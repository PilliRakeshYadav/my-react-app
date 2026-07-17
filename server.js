import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import gplay from "google-play-scraper";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadLocalEnv() {
  [".env.local", ".env"].forEach((fileName) => {
    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) return;

    fs.readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .forEach((line) => {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (!match || process.env[match[1]]) return;

        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      });
  });
}

loadLocalEnv();

const app = express();
const port = process.env.PORT || 4173;
const GOOGLE_CSE_KEY = process.env.GOOGLE_CSE_KEY || "";
const GOOGLE_CSE_CX = process.env.GOOGLE_CSE_CX || "";

app.use(cors());

function extractAndroidAppId(term) {
  const trimmed = (term || "").trim();
  if (!trimmed) return null;

  const fromQuery = trimmed.match(/[?&]id=([a-zA-Z0-9_.]+)/);
  if (fromQuery) return fromQuery[1];

  const fromPath = trimmed.match(
    /play\.google\.com\/store\/apps\/details\/([a-zA-Z0-9_.]+)/
  );
  if (fromPath) return fromPath[1];

  if (/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z0-9_]+)+$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

function extractAndroidAppIdFromSearchItem(item) {
  return (
    extractAndroidAppId(item?.link) ||
    extractAndroidAppId(item?.formattedUrl) ||
    extractAndroidAppId(item?.htmlFormattedUrl) ||
    extractAndroidAppId(item?.snippet) ||
    extractAndroidAppId(item?.title)
  );
}

function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return trimmed;
}

function normalizeAndroidApp(androidApp) {
  const icon = normalizeImageUrl(
    androidApp?.icon || androidApp?.headerImage || androidApp?.artworkUrl100 || ""
  );

  return {
    ...androidApp,
    icon,
    artworkUrl100: icon,
  };
}

function compactInstalls(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) return "";

  if (numericValue >= 1_000_000_000) {
    return `${numericValue / 1_000_000_000}B`.replace(".0B", "B");
  }

  if (numericValue >= 1_000_000) {
    return `${numericValue / 1_000_000}M`.replace(".0M", "M");
  }

  if (numericValue >= 1_000) {
    return `${numericValue / 1_000}K`.replace(".0K", "K");
  }

  return String(numericValue);
}

function normalizeGoogleReportApp(androidApp) {
  const normalizedApp = normalizeAndroidApp(androidApp);
  const appDownloads =
    compactInstalls(androidApp?.minInstalls) ||
    String(androidApp?.installs || "").replace(/\+$/, "");

  return {
    ...normalizedApp,
    appDownloads,
    installs: appDownloads,
    users: appDownloads,
    appName: androidApp?.title || "",
    trackName: androidApp?.title || "",
    appDescription: androidApp?.description || "",
    description: androidApp?.summary || androidApp?.description || "",
    appFeatures: androidApp?.description || "",
    offeredBy: androidApp?.developer || "",
    sellerName: androidApp?.developer || "",
    dateUpdated: androidApp?.updated || "",
    datePublished: "",
    updated: androidApp?.updated || "",
    released: "",
    releaseDate: "",
    currentVersionReleaseDate: androidApp?.updated || "",
    screenshots: androidApp?.screenshots || [],
    contentImagesArray: androidApp?.screenshots || [],
    contentVideo: androidApp?.video || "",
    videos: androidApp?.video ? [androidApp.video] : [],
    averageUserRating: androidApp?.score || 0,
    rating: androidApp?.score || 0,
    version: androidApp?.version || "Not available",
    recentChanges: androidApp?.recentChanges || "Not Applicable",
    whatsNew: androidApp?.recentChanges || "Not Applicable",
    price: androidApp?.priceText || androidApp?.price || "0",
    formattedPrice: androidApp?.priceText || "$0.00",
    operatingSystem: "Android",
    platformType: "Android",
  };
}

function normalizeCustomSearchApp(item, index) {
  const appId = extractAndroidAppIdFromSearchItem(item);
  const title = String(item?.title || item?.htmlTitle || "Android app")
    .replace(/\s*-\s*Apps on Google Play\s*$/i, "")
    .replace(/\s*-\s*Google Play\s*$/i, "")
    .trim();

  return normalizeAndroidApp({
    appId,
    title,
    trackName: title,
    description: item?.snippet || "",
    summary: item?.snippet || "",
    url: item?.link || "",
    trackViewUrl: item?.link || "",
    developer: item?.displayLink || "Google Play",
    customSearchRank: index + 1,
    customSearchItem: item,
  });
}

async function searchAndroidAppsFromCustomSearch(term, country) {
  if (!GOOGLE_CSE_KEY || !GOOGLE_CSE_CX) {
    throw new Error("Missing Google Custom Search credentials");
  }

  const searchUrl = new URL("https://www.googleapis.com/customsearch/v1");
  searchUrl.searchParams.set("num", "10");
  searchUrl.searchParams.set("key", GOOGLE_CSE_KEY);
  searchUrl.searchParams.set("cx", GOOGLE_CSE_CX);
  searchUrl.searchParams.set("q", term);
  searchUrl.searchParams.set("hl", country.toUpperCase());

  const response = await fetch(searchUrl);
  if (!response.ok) {
    throw new Error(`Google Custom Search failed with status ${response.status}`);
  }

  const data = await response.json();
  const searchApps = (data.items || []).map(normalizeCustomSearchApp);
  const seenAppIds = new Set();
  const uniqueApps = searchApps.filter((app) => {
    if (!app.appId) return true;
    if (seenAppIds.has(app.appId)) return false;
    seenAppIds.add(app.appId);
    return true;
  });

  const hydratedApps = await Promise.allSettled(
    uniqueApps.map(async (app) => {
      if (!app.appId) return app;

      const androidApp = await gplay.app({
        appId: app.appId,
        country: country.toLowerCase(),
        lang: "en",
      });

      return normalizeAndroidApp({
        ...app,
        ...androidApp,
        customSearchItem: app.customSearchItem,
        customSearchRank: app.customSearchRank,
      });
    })
  );

  return hydratedApps
    .map((result, index) =>
      result.status === "fulfilled" ? result.value : uniqueApps[index]
    )
    .slice(0, 10);
}

async function getAndroidSearchResults(term, country) {
  const appId = extractAndroidAppId(term);
  const searchTerm = appId || term;

  if (appId) {
    try {
      const directApp = await gplay.app({
        appId,
        country: country.toLowerCase(),
        lang: "en",
      });
      return [normalizeAndroidApp(directApp)];
    } catch {
      // Fall back to Custom Search when direct lookup fails.
    }
  }

  return searchAndroidAppsFromCustomSearch(searchTerm, country);
}

function getImageBaseKey(url) {
  if (!url) return "";
  return url.split("=")[0].replace(/\/$/, "");
}

async function fetchPlayStoreSimilarIcons(appId, country, excludeIconUrl) {
  if (!appId) return [];

  try {
    const similarApps = await gplay.similar({
      appId,
      country: country.toLowerCase(),
      lang: "en",
      num: 15,
    });

    const excludeBase = getImageBaseKey(excludeIconUrl);

    return similarApps
      .map((similarApp) => normalizeImageUrl(similarApp.icon))
      .filter((icon) => icon.includes("googleusercontent.com"))
      .filter((icon, index, array) => {
        const isDuplicate = array.indexOf(icon) !== index;
        const isSameIcon = getImageBaseKey(icon) === excludeBase;
        return !isDuplicate && !isSameIcon;
      })
      .slice(0, 8);
  } catch {
    return [];
  }
}

app.get(
  ["/api/android-search", "/appcurator/api/android-search", "/AppCurator_api/android-search"],
  async (req, res) => {
    try {
      const term = req.query.term || req.query.q || "";
      const country = req.query.country || req.query.hl || "US";

      if (!String(term).trim()) {
        return res.status(400).json({ error: "Missing search term" });
      }

      const results = await getAndroidSearchResults(String(term), String(country));
      return res.json({ results });
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Android search failed",
      });
    }
  }
);

app.get(
  ["/api/google-report-details", "/appcurator/api/google-report-details", "/AppCurator_api/google-report-details"],
  async (req, res) => {
    try {
      const appId = req.query.appId || "";
      const country = req.query.country || "US";

      if (!String(appId).trim()) {
        return res.status(400).json({ error: "Missing app id" });
      }

      const androidApp = await gplay.app({
        appId: String(appId),
        country: String(country).toLowerCase(),
        lang: "en",
      });

      return res.json(normalizeGoogleReportApp(androidApp));
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Google report details failed",
      });
    }
  }
);

app.get(["/api/similar-images", "/appcurator/api/similar-images"], async (req, res) => {
  try {
    const iconUrl = String(req.query.iconUrl || "");
    const appId = String(req.query.appId || "");
    const country = String(req.query.country || "US");

    if (!iconUrl.trim()) {
      return res.status(400).json({ error: "Missing icon URL" });
    }

    const images = await fetchPlayStoreSimilarIcons(appId, country, iconUrl);
    return res.json({ images });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Similar images lookup failed",
    });
  }
});

app.use("/appcurator", express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "dist")));

app.get(/^\/appcurator\/.*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`AppCurator server running on http://localhost:${port}/appcurator/`);
});
