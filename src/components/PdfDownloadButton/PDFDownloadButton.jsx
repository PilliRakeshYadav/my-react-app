import { useState } from "react";
import downloadIcon from "../../assets/white-icon-down.svg";
import { countries } from "../Home/countries";

const DOCUMENT_API_URL =
  import.meta.env.VITE_DOCUMENT_API_URL ||
  "https://dev.unfoldlabs.com/AppCurator_api/generatePdfReport";

const STATIC_IMAGE_INFORMATION = {
  imageHeight: 100,
  imageWidth: 100,
  fileSizeInKB: 6,
  imageDistance: 1,
  blurScore: 0.8677999973297119,
};

const STATIC_COMPETITIVE_FIELDS = {
  futureInfo1: "Translating your App into other languages helps expand your reach. Consider translating your App into (Spanish? French? Hindi? Arabic? etc.)",
  futureInfo2: "Is there a way to identify how many ads are displayed?",
  futureInfo3: "Too many – Annoying",
  futureInfo4: "Too few – No revenue generated",
  futureInfo5: "Then possibly we can do a comparison of how your identified competitors are monetizing?",
  futureInfo6: "Ads??",
  futureInfo7: "Premium?",
  futureInfo8: "Freemium?",
  competitiveAppInfo: "If your App contains some of these features, make sure you highlight them. If it does not you may want to consider implementing some of these features to enhance your App.",
  competitiveAppASORankings: "Also seems to have a better ASO ranking based on the words used:",
  competitiveAppFeatures1: "Your competition seems to have the following features:–<br>",
  monthsFromNow: 88,
  updatedLastWeek: false,
};

function normalizeText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value).trim() || fallback;
}

function normalizeUrl(value) {
  const text = normalizeText(value);
  if (!text) return "";
  if (text.startsWith("//")) return `https:${text}`;
  return text;
}

function getAppName(app = {}) {
  return normalizeText(app.appName || app.name || app.trackName || app.title);
}

function getAppDescription(app = {}) {
  return normalizeText(app.appDescription || app.description || app.fullDescription);
}

function getPlatformType(app = {}, reportPlatform = "") {
  const platform = normalizeText(app.platformType || app.platform || reportPlatform || "android");
  return platform.toLowerCase().includes("ios") ? "iOS" : "Android";
}

function getCountryName(countryCode = "") {
  const country = countries.find((item) => item.code === countryCode);
  return country?.name || countryCode || "";
}

function getImageList(app = {}) {
  return [
    ...(Array.isArray(app.contentImagesArray) ? app.contentImagesArray : []),
    ...(Array.isArray(app.screenshots) ? app.screenshots : []),
    ...(Array.isArray(app.screenshotUrls) ? app.screenshotUrls : []),
    ...(Array.isArray(app.mobileScreenshots) ? app.mobileScreenshots : []),
    ...(Array.isArray(app.mobileContentImagesArray) ? app.mobileContentImagesArray : []),
  ].map(normalizeUrl).filter(Boolean);
}

function getWordArray(text = "") {
  return normalizeText(text)
    .replace(/[&/\\#+()$~%.'":*?<>{}-]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function getTopKeywordValues(text = "", limit = 10) {
  const ignoredWords = new Set([
    "the", "and", "for", "with", "your", "you", "that", "this", "from", "are",
    "app", "can", "our", "all", "have", "has", "will", "into", "what", "when",
  ]);
  const counts = getWordArray(text.toLowerCase()).reduce((acc, word) => {
    if (word.length < 4 || ignoredWords.has(word)) return acc;
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ [word]: count }));
}

function getTopKeywords(text = "", limit = 10) {
  return getTopKeywordValues(text, limit).map((item) => Object.keys(item)[0]);
}

function normalizeKeywordValueItems(value) {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    return Object.entries(item)
      .map(([word, count]) => {
        const keyword = normalizeText(word).toLowerCase();
        if (!keyword) return null;
        const numericCount = Number(count);
        return { [keyword]: Number.isFinite(numericCount) && numericCount > 0 ? numericCount : 1 };
      })
      .filter(Boolean);
  });
}

function getNameKeywords(app = {}) {
  const appName = getAppName(app);
  const words = getWordArray(appName)
    .map((word) => word.toLowerCase())
    .filter((word) => word.length > 2);

  return words.length ? words : [appName.toLowerCase()].filter(Boolean);
}

function getDescriptionKeywordValues(app = {}, relatedApp = {}) {
  const existing = normalizeKeywordValueItems(app.appDescriptionTopKeyValues);
  if (existing.length > 0) return existing;

  const keywords = [...getNameKeywords(app), ...getNameKeywords(relatedApp)];
  const uniqueKeywords = [...new Set(keywords.filter(Boolean))];
  return uniqueKeywords.map((keyword) => ({ [keyword]: 1 }));
}

function getNumericString(value) {
  const text = normalizeText(value);
  if (!text) return "0";

  const compactMatch = text.replace(/,/g, "").match(/^([\d.]+)\s*([kmb])\+?$/i);
  if (compactMatch) {
    const amount = Number(compactMatch[1]);
    const multiplier = { k: 1_000, m: 1_000_000, b: 1_000_000_000 }[compactMatch[2].toLowerCase()];
    return Number.isFinite(amount) ? String(Math.round(amount * multiplier)) : "0";
  }

  const digits = text.replace(/[^\d]/g, "");
  return digits || "0";
}

function getAppDownloads(app = {}) {
  return getNumericString(
    app.appDownloads ||
    app.users ||
    app.userRatingCount ||
    app.installs ||
    app.reviewAnalysis?.numberOfDownloads
  );
}

function getAppStoreAvailableArray(app = {}, reportPlatform = "") {
  const existing = Array.isArray(app.appStoreAvailableArray) ? app.appStoreAvailableArray : null;
  if (existing?.some((item) => normalizeText(item))) return existing;

  return getPlatformType(app, reportPlatform) === "iOS"
    ? ["", "apple", "", "", ""]
    : ["google", "", "", "", ""];
}

function getContentRating(app = {}) {
  const rating = normalizeText(app.contentRating || app.contentAdvisoryRating);
  return !rating || /^not available$/i.test(rating) ? "12+" : rating;
}

function getCommonWordArray(app = {}) {
  if (Array.isArray(app.commonWordArray) && app.commonWordArray.length > 0) {
    return app.commonWordArray.filter((item) => normalizeText(item));
  }

  const appName = getAppName(app);
  const keywords = getTopKeywords(`${appName} ${getAppDescription(app)}`, 12);
  return [...new Set([appName, ...keywords].filter(Boolean))];
}

function getRatingString(app = {}) {
  return normalizeText(app.rating || app.averageUserRating || app.reviewAnalysis?.averageRating || "0");
}

function getReviewAnalysis(app = {}) {
  const downloads = getAppDownloads(app);

  return {
    ...app.reviewAnalysis,
    fiveStarRating: app.reviewAnalysis?.fiveStarRating || "0",
    fourStarRating: app.reviewAnalysis?.fourStarRating || "0",
    threeStarRating: app.reviewAnalysis?.threeStarRating || "0",
    twoStarRating: app.reviewAnalysis?.twoStarRating || "0",
    oneStarRating: app.reviewAnalysis?.oneStarRating || "0",
    totalRating: normalizeText(app.reviewAnalysis?.totalRating || downloads),
    averageRating: getRatingString(app),
    numberOfDownloads: downloads,
  };
}

function buildDocumentAppPayload(app = {}, reportPlatform = "", countryCode = "US", { includeAppDownloads = false, relatedApp = {} } = {}) {
  const appName = getAppName(app);
  const appDescription = getAppDescription(app);
  const nameKeywordValues = app.appNameTopKeyValues || getTopKeywordValues(appName);
  const descriptionKeywordValues = getDescriptionKeywordValues(app, relatedApp);
  const payload = {
    ...(includeAppDownloads ? { appDownloads: getAppDownloads(app) } : {}),

    appIcon: normalizeUrl(app.appIcon || app.icon || app.artworkUrl100 || app.artworkUrl512 || app.headerImage),
    appName,
    platformType: getPlatformType(app, reportPlatform),
    countryCode,
    countryName: getCountryName(countryCode),
    appDescription,
    offeredBy: normalizeText(app.offeredBy || app.seller || app.sellerName || app.artistName, "Not Available"),
    appIconInfo:
      app.appIconInfo ||
      "Your icon should be carefully crafted in order to improve your Click Through Rate (CTR) and increase conversion. Make sure that it's original and descriptive enough, without too many details. Adding a border and avoiding text is highly recommended.",
    similarImageArray: Array.isArray(app.similarImageArray) ? app.similarImageArray.map(normalizeUrl).filter(Boolean) : [],
    imageInformation: STATIC_IMAGE_INFORMATION,
    appNameWordArray: Array.isArray(app.appNameWordArray) ? app.appNameWordArray : getWordArray(appName),
    appNameCommonWordsRatio: app.appNameCommonWordsRatio ?? 0,
    contentImagesArray: getImageList(app),
    contentImageInformationArray: Array.isArray(app.contentImageInformationArray) ? app.contentImageInformationArray : [],
    reviewAnalysis: getReviewAnalysis(app),
    fileSize: app.fileSize || app.fileSizeBytes || 0,
    appStoreAvailableArray: getAppStoreAvailableArray(app, reportPlatform),
    contentRating: getContentRating(app),
    publishedDate: app.publishedDate || app.launchedDate || app.releaseDate || "",
    versions: app.versions || app.versionText || app.version || "Not available",
    ...STATIC_COMPETITIVE_FIELDS,
    appNameTop3KeyWords: [appName].filter(Boolean),
    appDescriptionWordArray: Array.isArray(app.appDescriptionWordArray)
      ? app.appDescriptionWordArray
      : getWordArray(appDescription),
    appNameTop10KeyWords: Array.isArray(app.appNameTop10KeyWords)
      ? app.appNameTop10KeyWords
      : getTopKeywords(appName),
    appNameTopKeyValues: nameKeywordValues,
    appDescriptionRepetitiveKeys: Array.isArray(app.appDescriptionRepetitiveKeys)
      ? app.appDescriptionRepetitiveKeys
      : [],
    appDescriptionTop10KeyWords: descriptionKeywordValues.map((item) => Object.keys(item)[0]),
    appDescriptionTopKeyValues: descriptionKeywordValues,
    appDescriptionCommonWordsRatio: app.appDescriptionCommonWordsRatio ?? 0,
    price: app.price ?? 0,
    formattedPrice: app.formattedPrice || app.priceText || (app.price === 0 ? "Free" : ""),
    commonWordArray: getCommonWordArray(app),
    topKeywords: app.topKeywords || getTopKeywords(`${appName} ${appDescription}`, 5).join(" "),
    appNameCombinations: app.appNameCombinations || JSON.stringify([{ 0: appName }]),
    appFeatures: Array.isArray(app.appFeatures)
      ? app.appFeatures.join("<br>")
      : normalizeText(app.appFeatures || appDescription).replace(/\n/g, "<br>"),
  };

  return payload;
}

function buildDocumentPayload(reportData = {}) {
  const countryCode = normalizeText(reportData.country, "US").toUpperCase();
  const applicationType = getPlatformType(reportData.leftApp || {}, reportData.platform);

  return {
    searchResults: buildDocumentAppPayload(reportData.leftApp, reportData.platform, countryCode, {
      includeAppDownloads: true,
      relatedApp: reportData.rightApp,
    }),
    competitorSearchResults: buildDocumentAppPayload(reportData.rightApp, reportData.platform, countryCode, {
      relatedApp: reportData.leftApp,
    }),
    applicationType,
  };
}

function getBase64ResponseText(responseText) {
  const trimmedText = responseText.trim();

  if (
    (trimmedText.startsWith("\"") && trimmedText.endsWith("\"")) ||
    (trimmedText.startsWith("'") && trimmedText.endsWith("'"))
  ) {
    return trimmedText.slice(1, -1);
  }

  return trimmedText;
}

function convertBase64ToPdfBlob(base64Pdf) {
  const byteCharacters = atob(getBase64ResponseText(base64Pdf));
  const byteNumbers = new Array(byteCharacters.length);

  for (let index = 0; index < byteCharacters.length; index += 1) {
    byteNumbers[index] = byteCharacters.charCodeAt(index);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: "application/pdf" });
}

function downloadPdfBlob(blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "AppCurator_Report.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function PDFDownloadButton() {
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const reportData = JSON.parse(localStorage.getItem("reportData") || "{}");
      const payload = buildDocumentPayload(reportData);

      const response = await fetch(DOCUMENT_API_URL, {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/pdf, application/json, text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Document API failed with status ${response.status}`);
      }

      const base64Pdf = await response.text();
      const pdfBlob = convertBase64ToPdfBlob(base64Pdf);
      downloadPdfBlob(pdfBlob);
    } catch (error) {
      console.error("Unable to generate PDF report:", error);
      window.alert("Unable to download the PDF report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="report-btn" onClick={generatePDF} disabled={loading}>
      {loading ? "PDF..." : "PDF"}
      <img src={downloadIcon} width="15" alt="" />
    </button>
  );
}
