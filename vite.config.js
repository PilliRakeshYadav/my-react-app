import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

function extractAndroidAppId(term) {
  const trimmed = (term || '').trim()
  if (!trimmed) return null

  const fromQuery = trimmed.match(/[?&]id=([a-zA-Z0-9_.]+)/)
  if (fromQuery) return fromQuery[1]

  const fromPath = trimmed.match(
    /play\.google\.com\/store\/apps\/details\/([a-zA-Z0-9_.]+)/
  )
  if (fromPath) return fromPath[1]

  if (/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z0-9_]+)+$/.test(trimmed)) {
    return trimmed
  }

  return null
}

function normalizeAndroidApp(app) {
  const icon = normalizeImageUrl(
    app?.icon || app?.headerImage || app?.artworkUrl100 || ''
  )

  return {
    ...app,
    icon,
    artworkUrl100: icon,
  }
}

function compactInstalls(value) {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue) || numericValue <= 0) return ''

  if (numericValue >= 1_000_000_000) {
    return `${numericValue / 1_000_000_000}B`.replace('.0B', 'B')
  }

  if (numericValue >= 1_000_000) {
    return `${numericValue / 1_000_000}M`.replace('.0M', 'M')
  }

  if (numericValue >= 1_000) {
    return `${numericValue / 1_000}K`.replace('.0K', 'K')
  }

  return String(numericValue)
}

function normalizeGoogleReportApp(app) {
  const normalizedApp = normalizeAndroidApp(app)
  const appDownloads =
    compactInstalls(app?.minInstalls) || String(app?.installs || '').replace(/\+$/, '')

  return {
    ...normalizedApp,
    appDownloads,
    installs: appDownloads,
    users: appDownloads,
    appName: app?.title || '',
    trackName: app?.title || '',
    appDescription: app?.description || '',
    description: app?.summary || app?.description || '',
    appFeatures: app?.description || '',
    offeredBy: app?.developer || '',
    sellerName: app?.developer || '',
    dateUpdated: app?.updated || '',
    datePublished: '',
    updated: app?.updated || '',
    released: '',
    releaseDate: '',
    currentVersionReleaseDate: app?.updated || '',
    screenshots: app?.screenshots || [],
    contentImagesArray: app?.screenshots || [],
    contentVideo: app?.video || '',
    videos: app?.video ? [app.video] : [],
    averageUserRating: app?.score || 0,
    rating: app?.score || 0,
    version: app?.version || 'Not available',
    recentChanges: app?.recentChanges || 'Not Applicable',
    whatsNew: app?.recentChanges || 'Not Applicable',
    price: app?.priceText || app?.price || '0',
    formattedPrice: app?.priceText || '$0.00',
    operatingSystem: 'Android',
    platformType: 'Android',
  }
}

function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  return trimmed
}

let googleCseKey = process.env.GOOGLE_CSE_KEY || ''
let googleCseCx = process.env.GOOGLE_CSE_CX || ''

function configureGoogleCseEnv(mode) {
  const env = loadEnv(mode, process.cwd(), '')
  googleCseKey = env.GOOGLE_CSE_KEY || process.env.GOOGLE_CSE_KEY || ''
  googleCseCx = env.GOOGLE_CSE_CX || process.env.GOOGLE_CSE_CX || ''
}

function extractAndroidAppIdFromSearchItem(item) {
  return (
    extractAndroidAppId(item?.link) ||
    extractAndroidAppId(item?.formattedUrl) ||
    extractAndroidAppId(item?.htmlFormattedUrl) ||
    extractAndroidAppId(item?.snippet) ||
    extractAndroidAppId(item?.title)
  )
}

function getImageBaseKey(url) {
  if (!url) return ''
  return url.split('=')[0].replace(/\/$/, '')
}

async function fetchGoogleSimilarImages(iconUrl) {
  if (!iconUrl) return []

  const searchUrl = new URL('https://www.googleapis.com/customsearch/v1')
  searchUrl.searchParams.set('key', googleCseKey)
  searchUrl.searchParams.set('cx', googleCseCx)
  searchUrl.searchParams.set('q', iconUrl)
  searchUrl.searchParams.set('searchType', 'image')
  searchUrl.searchParams.set('num', '10')

  const response = await fetch(searchUrl)
  if (!response.ok) return []

  const data = await response.json()
  const ownIconBase = getImageBaseKey(iconUrl)

  return (data.items || [])
    .map((item) => normalizeImageUrl(item.link))
    .filter((link) => link.includes('googleusercontent.com'))
    .filter((link, index, array) => {
      const isDuplicate =
        array.findIndex((entry) => getImageBaseKey(entry) === getImageBaseKey(link)) !==
        index
      const isSameAsQuery = getImageBaseKey(link) === ownIconBase
      return !isDuplicate && !isSameAsQuery
    })
    .slice(0, 8)
}

async function fetchPlayStoreSimilarIcons(gplay, appId, country, excludeIconUrl) {
  if (!appId) return []

  try {
    const similarApps = await gplay.similar({
      appId,
      country: country.toLowerCase(),
      lang: 'en',
      num: 15,
    })

    const excludeBase = getImageBaseKey(excludeIconUrl)

    return similarApps
      .map((app) => normalizeImageUrl(app.icon))
      .filter((icon) => icon.includes('googleusercontent.com'))
      .filter((icon, index, array) => {
        const isDuplicate = array.indexOf(icon) !== index
        const isSameIcon = getImageBaseKey(icon) === excludeBase
        return !isDuplicate && !isSameIcon
      })
      .slice(0, 8)
  } catch {
    return []
  }
}

async function getSimilarImages(iconUrl, appId, country) {
  const googleImages = await fetchGoogleSimilarImages(iconUrl)

  if (googleImages.length >= 3) {
    return googleImages
  }

  const gplay = (await import('google-play-scraper')).default
  const playStoreImages = await fetchPlayStoreSimilarIcons(
    gplay,
    appId,
    country,
    iconUrl
  )

  return [...new Set([...googleImages, ...playStoreImages])].slice(0, 8)
}

async function getAndroidSearchResults(gplay, term, country) {
  const appId = extractAndroidAppId(term)
  const searchTerm = appId || term

  if (appId) {
    try {
      const directApp = await gplay.app({
        appId,
        country: country.toLowerCase(),
        lang: 'en',
      })
      return [normalizeAndroidApp(directApp)]
    } catch {
      // Fall back to Custom Search when direct lookup fails.
    }
  }

  return searchAndroidAppsFromCustomSearch(gplay, searchTerm, country)
}

function normalizeCustomSearchApp(item, index) {
  const appId = extractAndroidAppIdFromSearchItem(item)
  const title = String(item?.title || item?.htmlTitle || 'Android app')
    .replace(/\s*-\s*Apps on Google Play\s*$/i, '')
    .replace(/\s*-\s*Google Play\s*$/i, '')
    .trim()

  return normalizeAndroidApp({
    appId,
    title,
    trackName: title,
    description: item?.snippet || '',
    summary: item?.snippet || '',
    url: item?.link || '',
    trackViewUrl: item?.link || '',
    developer: item?.displayLink || 'Google Play',
    customSearchRank: index + 1,
    customSearchItem: item,
  })
}

async function searchAndroidAppsFromCustomSearch(gplay, term, country) {
  if (!googleCseKey || !googleCseCx) {
    throw new Error('Missing Google Custom Search credentials')
  }

  const searchUrl = new URL('https://www.googleapis.com/customsearch/v1')
  searchUrl.searchParams.set('num', '10')
  searchUrl.searchParams.set('key', googleCseKey)
  searchUrl.searchParams.set('cx', googleCseCx)
  searchUrl.searchParams.set('q', term)
  searchUrl.searchParams.set('hl', country.toUpperCase())

  const response = await fetch(searchUrl)
  if (!response.ok) {
    throw new Error(`Google Custom Search failed with status ${response.status}`)
  }

  const data = await response.json()
  const searchApps = (data.items || []).map(normalizeCustomSearchApp)
  const seenAppIds = new Set()
  const uniqueApps = searchApps.filter((app) => {
    if (!app.appId) return true
    if (seenAppIds.has(app.appId)) return false
    seenAppIds.add(app.appId)
    return true
  })

  const hydratedApps = await Promise.allSettled(
    uniqueApps.map(async (app) => {
      if (!app.appId) return app

      const androidApp = await gplay.app({
        appId: app.appId,
        country: country.toLowerCase(),
        lang: 'en',
      })

      return normalizeAndroidApp({
        ...app,
        ...androidApp,
        customSearchItem: app.customSearchItem,
        customSearchRank: app.customSearchRank,
      })
    })
  )

  return hydratedApps
    .map((result, index) =>
      result.status === 'fulfilled' ? result.value : uniqueApps[index]
    )
    .slice(0, 10)
}

function androidApiPlugin() {
  const registerAndroidApiRoutes = (middlewares) => {
    middlewares.use('/api/android-search', async (req, res) => {
      try {
        const gplay = (await import('google-play-scraper')).default
        const requestUrl = new URL(req.url, 'http://localhost')
        const term =
          requestUrl.searchParams.get('term') ||
          requestUrl.searchParams.get('q') ||
          ''
        const country =
          requestUrl.searchParams.get('country') ||
          requestUrl.searchParams.get('hl') ||
          'US'

        if (!term.trim()) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Missing search term' }))
          return
        }

        const androidResults = await getAndroidSearchResults(
          gplay,
          term,
          country
        )

        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ results: androidResults }))
      } catch (error) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            error:
              error instanceof Error ? error.message : 'Android search failed',
          })
        )
      }
    })

    middlewares.use('/api/google-report-details', async (req, res) => {
      try {
        const gplay = (await import('google-play-scraper')).default
        const requestUrl = new URL(req.url, 'http://localhost')
        const appId = requestUrl.searchParams.get('appId') || ''
        const country = requestUrl.searchParams.get('country') || 'US'

        if (!appId.trim()) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Missing app id' }))
          return
        }

        const app = await gplay.app({
          appId,
          country: country.toLowerCase(),
          lang: 'en',
        })

        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(normalizeGoogleReportApp(app)))
      } catch (error) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            error:
              error instanceof Error
                ? error.message
                : 'Google report details failed',
          })
        )
      }
    })

    middlewares.use('/api/similar-images', async (req, res) => {
      try {
        const requestUrl = new URL(req.url, 'http://localhost')
        const iconUrl = requestUrl.searchParams.get('iconUrl') || ''
        const appId = requestUrl.searchParams.get('appId') || ''
        const country = requestUrl.searchParams.get('country') || 'US'

        if (!iconUrl.trim()) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Missing icon URL' }))
          return
        }

        const images = await getSimilarImages(iconUrl, appId, country)

        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ images }))
      } catch (error) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            error:
              error instanceof Error
                ? error.message
                : 'Similar images lookup failed',
          })
        )
      }
    })

  }

  return {
    name: 'appcurator-android-api',
    configureServer(server) {
      registerAndroidApiRoutes(server.middlewares)
    },
    configurePreviewServer(server) {
      registerAndroidApiRoutes(server.middlewares)
    },
  }
}

export default defineConfig(({ mode }) => {
  configureGoogleCseEnv(mode)

  return {
    plugins: [react(), androidApiPlugin()],
    base: '/appcurator/',
  }
})
