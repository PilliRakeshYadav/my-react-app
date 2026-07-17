import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import CRHeader from "../CRHeader";
import CRFooter from "../CRFooter";
import "./ReportPage.css";
import TestimonialPopup from "../TestimonialPopup";
import viceVersaIcon from "../../assets/vice-versa.svg";
import star5 from "../../assets/stars-5.svg";
import star4half from "../../assets/half-star-4.svg";
import star4 from "../../assets/stars-4.svg";
import star3 from "../../assets/stars-3.svg";
import star2 from "../../assets/stars-2.svg";
import star0 from "../../assets/stars-0.svg";
import star1 from "../../assets/stars-1.png";
import PDFDownloadButton from "../PdfDownloadButton/PDFDownloadButton";
import { Link } from "react-router-dom";

const EMPTY_VIDEOS = [];
const IOS_NAME_COMPETITOR_KEYWORDS = [];
const IOS_DESCRIPTION_COMPETITOR_KEYWORDS = [
  
];

/* ==========================================================================
   ====== SECTION 0: STRING & IMAGE UTILITIES ===============================
   ========================================================================== */

function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  return trimmed;
}

function getComparableImageUrl(url) {
  return normalizeImageUrl(url).split("=")[0];
}

function uniqueImageUrls(urls = []) {
  const seen = new Set();
  return urls.filter((url) => {
    const comparableUrl = getComparableImageUrl(url);
    if (!comparableUrl || seen.has(comparableUrl)) return false;
    seen.add(comparableUrl);
    return true;
  });
}

function getYouTubeVideoId(url) {
  if (!url) return "";
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] || "";
    }
    if (host.endsWith("youtube.com")) {
      if (parsedUrl.pathname === "/watch") {
        return parsedUrl.searchParams.get("v") || "";
      }
      const [, type, id] = parsedUrl.pathname.split("/");
      if (["embed", "shorts", "live"].includes(type)) {
        return id || "";
      }
    }
  } catch {
    return "";
  }
  return "";
}

function getYouTubeEmbedUrl(url) {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

async function fetchYouTubeTitle(url) {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return "";
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${videoId}`
      )}&format=json`
    );
    if (!res.ok) return "";
    const data = await res.json();
    return data?.title || "";
  } catch (error) {
    console.error("Unable to load YouTube title:", error);
    return "";
  }
}

function getVideoFallbackTitle(url, index) {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `YouTube video ${videoId}` : `Content video ${index + 1}`;
}

function getCleanTextLayout(text = "") {
  if (!text) return "Not Available";
  return text.replace(/<[^>]*>/g, "").trim() || "Not Available";
}

function getShortDescription(text = "") {
  const summary = text
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .find((paragraph) => paragraph.trim())
    ?.replace(/\s+/g, " ")
    .trim();
  return summary || "Not Available";
}

function getDescriptionLines(text = "") {
  return getCleanTextLayout(text)
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function getFirstDescriptionLine(text = "") {
  return getDescriptionLines(text)[0] || "";
}

function normalizeWhatsNew(value) {
  const text = String(value || "").trim();
  if (!text || /^not available$/i.test(text)) return "Not Applicable";
  return text;
}

function formatDate(date) {
  if (!date) return "Not available";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return String(date);
  return parsedDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatCountPlus(value) {
  if (!value) return "Not Available";
  return String(value).trim();
}

function formatAppSize(value) {
  if (!value) return "Not Available";
  const numericValue = Number(value);
  if (!isNaN(numericValue) && numericValue > 0) return `${(numericValue / 1048576).toFixed(2)} MB`;
  return String(value);
}

function wasUpdatedWithinDays(date, dayCount) {
  if (!date) return false;
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return false;
  const diffMs = Date.now() - parsedDate.getTime();
  return diffMs >= 0 && diffMs <= dayCount * 24 * 60 * 60 * 1000;
}

function getVersionTextForReport(app) {
  const version = app?.versionText || "Not available";
  if (!isAndroid(app)) return version;
  if (/^vary$/i.test(String(version).trim())) return "Not available";
  return version;
}

function StoreImage({ src, alt, className = "" }) {
  const normalizedSrc = normalizeImageUrl(src);
  if (!normalizedSrc) return null;
  return <img src={normalizedSrc} alt={alt || ""} className={className} referrerPolicy="no-referrer" loading="lazy" />;
}

function getLiveScreenshotGrid(app) {
  if (Array.isArray(app.screenshots) && app.screenshots.length > 0) return uniqueImageUrls(app.screenshots);
  if (Array.isArray(app.contentImagesArray) && app.contentImagesArray.length > 0) return uniqueImageUrls(app.contentImagesArray);
  return [];
}

function getLiveMobileScreenshotGrid(app) {
  if (Array.isArray(app.mobileScreenshots) && app.mobileScreenshots.length > 0) return uniqueImageUrls(app.mobileScreenshots);
  if (Array.isArray(app.mobileContentImagesArray) && app.mobileContentImagesArray.length > 0) return uniqueImageUrls(app.mobileContentImagesArray);
  return [];
}

// Clean recovery fallback loop checks for dynamic video nodes
function getLiveVideosGrid(app) {
  if (Array.isArray(app.videos) && app.videos.length > 0) return app.videos;
  if (Array.isArray(app.contentVideoArray) && app.contentVideoArray.length > 0) return app.contentVideoArray;
  return [];
}

function getStoreName(app) { return isAndroid(app) ? "Google Play" : "App Store"; }

function isAndroid(app) {
  return String(app?.platform || app?.platformType || "").toLowerCase().includes("android");
}

function normalizeListItems(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap((item) => normalizeListItems(item));
  if (typeof value === "object") {
    return Object.entries(value).map(([word, count]) => {
      const numericCount = Number(count);
      if (!Number.isNaN(numericCount)) {
        return `${word} - ${count} ${numericCount === 1 ? "occurrence" : "occurrences"}`;
      }
      return `${word} - ${count}`;
    });
  }
  return String(value).split(",").map((item) => item.trim()).filter(Boolean);
}

function normalizeLegacyKeywordItems(value) {
  return normalizeListItems(value).map((item) => {
    const text = String(item).trim();
    const legacyMatch = text.match(/^(.*?)\s*-\s*(\d+)\s*$/);
    if (!legacyMatch) return text;

    const [, word, count] = legacyMatch;
    const numericCount = Number(count);
    return `${word.trim()} - ${count} ${numericCount === 1 ? "occurrence" : "occurrences"}`;
  }).filter(Boolean);
}

function getAppName(app) {
  return app?.appName || app?.name || app?.trackName || app?.title || "";
}

function getAppDescription(app) {
  return app?.appDescription || app?.description || app?.fullDescription || "";
}

function countLegacyWords(text = "", { removeDoubleSpaces = false } = {}) {
  let normalized = String(text).replace(/[&/\\#+()$~%.'":*?<>{}-]/g, "");
  normalized = removeDoubleSpaces ? normalized.replace(/  +/g, "") : normalized.replace(/  +/g, " ");
  return normalized.split(" ").filter((word) => word !== "-" && word !== "&" && word !== "").length;
}

function getLegacyAppNameCommonText(app, platform) {
  const wordCount = countLegacyWords(getAppName(app));
  if (app?.appNameCommonWords1 && app?.appNameCommonWords2) {
    return {
      good: app.appNameCommonWords1,
      needsWork: app.appNameCommonWords2,
    };
  }
  const singularWord = wordCount === 1 ? "word(s)" : "words";
  const platformText = platform === "ios" ? "a better choice of words" : "a good choice of words";
  return {
    good: `Your Application has ${wordCount} ${singularWord} and most of them are unique. That is good for ASO. Good work by your team.`,
    needsWork: `Your Application name has ${wordCount} ${singularWord} – and more than 50% of the words are very common words. This will not give you the right ASO rankings. We recommend that you use specific words to get your Application better recognized. The suggested common words to change are${platform === "android" ? ":" : ""}`,
    repetitiveGood: app?.appNameRepetitiveWords1 || `No repeated Words in your Application – excellent work by your team in making sure that you have ${platformText}. This will help you in your ASO. Good Luck.`,
    repetitiveBad: app?.appNameRepetitiveWords2 || `Your Application name has ${wordCount} ${singularWord} – and 2 or more words are repeated more than once. You could ${platform === "ios" ? "use better words" : "remove the duplicate words"} to get a better ASO ranking. The following words are repeated:`,
  };
}

function parseLegacyCombinations(value) {
  if (!value) return [];
  try {
    const combinations = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(combinations)) return [];
    return combinations.flatMap((item) =>
      Object.entries(item || {})
        .filter(([key]) => {
          const index = parseInt(key, 10);
          return index > 0 && index <= 4;
        })
        .map(([, text]) => String(text))
    );
  } catch {
    return [];
  }
}

function hasLegacyRelevantKeywords(app, competitorApp, source) {
  const keywordField = source === "name" ? "appNameTop10KeyWords" : "appDescriptionTop10KeyWords";
  const wordsField = source === "name" ? "appNameWordArray" : "appDescriptionWordArray";
  const competitorKeywords = Array.isArray(competitorApp?.[keywordField]) ? competitorApp[keywordField] : [];
  const appWords = Array.isArray(app?.[wordsField]) ? app[wordsField] : [];
  let matchingKeywords = 0;

  competitorKeywords.forEach((keyword) => {
    if (appWords.indexOf(keyword) > -1) matchingKeywords += 1;
  });

  return matchingKeywords >= 3;
}

function getLegacyNameCharacterText(app, competitorApp, platform) {
  const appName = getAppName(app).trim();
  const charCount = appName.length;
  const hasRelevantKeywords = hasLegacyRelevantKeywords(app, competitorApp, "name");

  // Character Count Section Starts here
  if (platform === "ios") {
    if (charCount >= 25 && hasRelevantKeywords) {
      return `The ideal character count for the Application name is 25-30 characters. Your App name is great. Your app name contains ${charCount} characters. Your Application also has relevant and proper keywords in the title.`;
    }
    if (charCount >= 25 && charCount <= 30 && !hasRelevantKeywords) {
      return `The ideal character count for the Application name is 25-30 characters. Your App name is great. Your app name contains ${charCount} characters, but you don’t have relevant and proper keywords in the title.`;
    }
    if (charCount >= 15 && charCount <= 25) {
      return "The name of your Application is good, but it could be better. You could use more characters. consider that relevant keywords in the title could increase your rank in the iStore. ";
    }
    if (charCount < 15) {
      return `The name of your Application is too short. You only have ${charCount} characters. iStore recommends 25-30 characters. Your Application name will not be accepted if it doesn’t contain the most relevant keywords. `;
    }
    return "";
  }

  if (charCount >= 25 && charCount <= 30 && hasRelevantKeywords) {
    return `The ideal character count for the Application name is 25-30 characters. Your App name is great. Your App name contains ${charCount} characters.`;
  }
  if (charCount >= 25 && charCount <= 30 && !hasRelevantKeywords) {
    return `The ideal character count for the Application name is 25-30 characters. Your App name is great. Your App name contains ${charCount} characters, but you don’t have relevant and proper keywords in the title.`;
  }
  if (charCount >= 15 && charCount <= 25) {
    return "The name of your Application is good, but it could be better. You could use more characters. Consider that relevant keywords in the title could increase your rank in the Google Play store. Please check out Google Keywords planner tools for relevant keywords at the following link:";
  }
  if (charCount < 15) {
    return `The name of your Application is too short. You only have ${charCount} characters. Google Play recommends 25-30 characters. Your Application name will not be accepted if it doesn’t contain the most relevant keywords. Check out Google Keywords planner tools for relevant keywords at the following link:`;
  }
  return `The ideal character count for the Application name is 25-30 characters. Your App name is great. Your App name contains ${charCount} characters.`;
}

function getLegacyDescriptionTexts(app, competitorApp, platform) {
  const description = getAppDescription(app);
  const charCount = description.trim().length;
  const hasRelevantKeywords = hasLegacyRelevantKeywords(app, competitorApp, "description");
  const descriptionForWords = platform === "ios"
    ? description.replace(/  +/g, "")
    : description.trim().replace("<br>", "g").replace(/  +/g, " ");
  const wordCount = platform === "ios"
    ? descriptionForWords.split(" ").length
    : descriptionForWords.split(" ").filter(Boolean).length;
  const storeName = platform === "ios" ? "iStore" : "Google Play";
  const descriptionLabel = platform === "ios" ? "description" : "Description";

  const generatedCharacterTexts = {
    good: `The length of your App ${descriptionLabel} is great. You have ${charCount} characters. The ideal character count for the Application description is between 2000-4000 characters. Your Application description also has relevant and proper keywords in the description.`,
    missingKeywords: `The ideal character count for the Application description is 2000-4000 characters. Your App ${descriptionLabel} is great – and you have ${charCount} characters, but you don’t have relevant and proper keywords in the description.${platform === "android" ? " Please check out Google Keywords planner tools for relevant keywords at the following link." : " "}`,
    better: `The description of your Application is good, but it could be better. You could use more characters. Your Application description currently has ${charCount} characters, ${storeName} recommends 2000-4000 characters. Also, consider relevant keywords in the description could increase your rank in the ${storeName}.${platform === "android" ? " Please check out Google Keywords planner tools for relevant keywords at the following link." : " "}`,
    tooShort: `The description of your Application is too short. You only have ${charCount} characters, whereas ${storeName} recommends 2000-4000 characters. You need to add more words as fewer words affects your ranking in the ${storeName}.${platform === "android" ? " Also, check out Google Keywords planner tools for relevant keywords at the following link:" : " "}`,
  };

  let characterText = "";
  // End of AppDescription - Character Count
  if (charCount >= 2000 && charCount <= 4000 && hasRelevantKeywords) {
    characterText = app?.appDescriptionCharacterCount1 || generatedCharacterTexts.good;
  } else if (charCount >= 2000 && charCount <= 4000 && !hasRelevantKeywords) {
    characterText = app?.appDescriptionCharacterCount2 || generatedCharacterTexts.missingKeywords;
  } else if (charCount >= 1000 && charCount < 2000) {
    characterText = app?.appDescriptionCharacterCount3 || generatedCharacterTexts.better;
  } else if (charCount >= 1 && charCount < 1000) {
    characterText = app?.appDescriptionCharacterCount4 || generatedCharacterTexts.tooShort;
  } else {
    characterText = app?.appDescriptionCharacterCount1 || generatedCharacterTexts.good;
  }

  const commonGood = app?.appDescriptionCommonWords1 || `Your Application has ${wordCount} words in the App ${descriptionLabel} and most of them are unique. That is good for ASO. Good work by your team.`;
  const commonBad = app?.appDescriptionCommonWords2 || `Your Application description has ${wordCount} words – and more than 50% of the words are very common words. This will not give you the right ASO rankings. We recommend that you use specific words to get your Application better recognized.${platform === "ios" ? " The suggested common words to change are" : ""}`;
  const hasCommonWords = parseFloat(app?.appDescriptionCommonWordsRatio) < 0.5;
  const repetitiveWords = Array.isArray(app?.appDescriptionRepetitiveKeys) ? app.appDescriptionRepetitiveKeys : [];

  return {
    characterText,
    commonText: hasCommonWords ? commonGood : commonBad,
    repetitiveText: repetitiveWords.length < 2
      ? app?.appDescriptionRepetitiveWords1 || "Your Application description does not have any words repeated – excellent work by your team in making sure that you have a better choice of words. This will help you in your ASO. Good Luck."
      : app?.appDescriptionRepetitiveWords2 || `Your Application description has ${wordCount} words – and 2 or more words are repeated more than once. You could use better words to get a better ASO ranking. The following words are repeated:`,
    repetitiveWords,
  };
}

function extractTopKeywords(text = "", limit = 8) {
  const stopWords = new Set(["the", "a", "an", "and", "or", "for", "to", "of", "in", "on", "with", "your", "app", "is", "are", "be", "by", "at", "from", "as", "it", "this", "that", "you", "can", "will", "our", "all", "has", "have", "more", "free"]);
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((word) => word.length > 3 && !stopWords.has(word));
  const frequency = {};
  words.forEach((word) => { frequency[word] = (frequency[word] || 0) + 1; });
  return Object.entries(frequency).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([word, count]) => `${word} - ${count} occurrence${count > 1 ? "s" : ""}`);
}

function getCompetitorKeywords(competitor, variant) {
  const stored = variant === "name"
    ? competitor.appNameTopKeyValues || competitor.topKeywords || competitor.topWords
    : competitor.appDescriptionTopKeyValues || competitor.topWords || competitor.topKeywords;
  const normalized = normalizeLegacyKeywordItems(stored);
  if (normalized.length) return normalized;
  const sourceText = variant === "name" ? competitor.name || "" : `${competitor.description || ""} ${competitor.name || ""}`;
  const extracted = extractTopKeywords(sourceText);
  return extracted.length ? extracted : ["videos - 1 occurrence"];
}

function getCompetitorKeywordsForDisplay(competitor, variant) {
  const iosOnlyKeywords = new Set([...IOS_NAME_COMPETITOR_KEYWORDS, ...IOS_DESCRIPTION_COMPETITOR_KEYWORDS]);
  return getCompetitorKeywords(competitor, variant).filter((keyword) => !iosOnlyKeywords.has(keyword));
}

async function fetchSimilarImagesForApp(app) {
  const iconUrl = normalizeImageUrl(app?.icon || app?.artworkUrl100 || app?.artworkUrl512 || app?.appIcon || app?.headerImage || "");
  if (!iconUrl) return [];

  try {
    const response = await fetch(`https://dev.unfoldlabs.com/AppCurator_api/getSimilarImages?query=${encodeURIComponent(iconUrl)}`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Similar image search failed with status ${response.status}`);
    }

    const data = await response.json();
    const thumbnailLinks = (Array.isArray(data?.items) ? data.items : [])
      .flatMap((item) => [
        ...(Array.isArray(item?.images) ? item.images : []),
        item?.image,
      ])
      .map((image) => normalizeImageUrl(image?.thumbnailLink))
      .filter(Boolean);

    return [...new Set(thumbnailLinks)];
  } catch (error) {
    console.error("Unable to fetch similar images:", error);
    return [];
  }
}

function normalizeAppData(app) {
  if (!app) return null;
  if (isAndroid(app)) {
    return {
      ...app,
      rating: parseFloat(app.rating || app.reviewAnalysis?.averageRating || 4.4)
    };
  }

  const name = app.trackName || app.title || app.appName || "";
  const description = app.description || app.appDescription || app.shortDescription || "";
  const icon = normalizeImageUrl(app.artworkUrl100 || app.artworkUrl512 || app.appIcon || app.icon || app.headerImage || "");
  
  const candidatesImages = [
    ...(Array.isArray(app.screenshotUrls) ? app.screenshotUrls : []),
    ...(Array.isArray(app.screenshots) ? app.screenshots : []),
  ];
  const images = [...new Set(candidatesImages.map(normalizeImageUrl).filter(Boolean))];
  
  const candidatesVideos = [app.previewUrl, app.videoUrl];
  const videos = candidatesVideos.flatMap(item => item ? [item] : []);

  const finalRating = Number(app.averageUserRating || app.rating || 0);

  return {
    ...app,
    name,
    trackName: app.trackName || name,
    description,
    icon,
    artworkUrl100: icon,
    similarImageArray: [],
    platform: "iOS",
    users: app.userRatingCount || 0,
    seller: app.sellerName || app.artistName || "Not Available",
    website: app.sellerUrl || app.artistViewUrl || app.trackViewUrl || "",
    launchedDate: app.releaseDate || "",
    updatedDate: app.currentVersionReleaseDate || app.releaseDate || "",
    screenshots: images,
    videos,
    rating: finalRating,
    fileSize: app.fileSizeBytes || "",
    priceText: app.formattedPrice || (app.price === 0 ? "Free" : String(app.price)),
    inAppPayments: false,
    contentRating: app.contentAdvisoryRating || "Everyone",
    versionText: app.versionText || app.version || "Not available",
    whatsNew: normalizeWhatsNew(app.releaseNotes),
    languages: app.languageCodesISO2A || [],
    appFeatures: String(description).split(". ").filter(Boolean).slice(0, 8)
  };
}

function readStoredReportData() {
  try {
    const reportData = JSON.parse(localStorage.getItem("reportData") || "null");
    if (reportData?.leftApp && reportData?.rightApp) {
      return {
        leftApp: reportData.leftApp,
        rightApp: reportData.rightApp,
        platform: reportData.platform || "android",
        country: reportData.country || "US",
      };
    }
    return { leftApp: null, rightApp: null, platform: "android", country: "US" };
  } catch (error) {
    console.error("Unable to read stored report data:", error);
    return { leftApp: null, rightApp: null };
  }
}

// FIXED: Cleaned column width properties to support responsive flex row sizing grids
function Section({ title, left, right }) {
  const isSingle = !right;
  return (
    <>
      <div className="detail-title"><h3 className="heading text-center">{title}</h3></div>
      <div className="detail-content-in p-20">
        <div className={`dis-flex gap-30 ${isSingle ? "single-block" : ""}`}>
          <div className="w-100 content-details-d">{left}</div>
          {!isSingle && <div className="w-100 content-details-d">{right}</div>}
        </div>
      </div>
    </>
  );
}

/* ==========================================================================
   ======================= SECTION 1: ANDROID BLOCKS ========================
   ========================================================================== */

function AndroidAboutBlock({ app }) {
  if (!app) return "N/A";
  const shortDescription =
    getFirstDescriptionLine(app.fullDescription || app.appDescription || app.description) ||
    app.shortDescription ||
    getShortDescription(getCleanTextLayout(app.description));
  return (
    <div>
      <p className="detail-title-sub">About</p>
      <p className="detailed-content-p clamp-5">{shortDescription}</p>
      <ul className="about-details-d">
        <li className="about-details-d-list">Users : <span className="details-main">{formatCountPlus(app.users)}</span></li>
        {/* {app.launchedDate && <li className="about-details-d-list">Date launched : <span className="details-main">{formatDate(app.launchedDate)}</span></li>} */}
        <li className="about-details-d-list">Date updated : <span className="details-main">{app.updatedDate ? formatDate(app.updatedDate) : "N/A"}</span></li>
        <li className="about-details-d-list">Parent organization : <span className="details-main">{app.seller}</span></li>
        <li className="about-details-d-list">Operating system : <span className="details-main">Android</span></li>
      </ul>
      <p className="detailed-content-p">No repeated Words in your Application – excellent work by your team in making sure that you have a good choice of words. This will help you in your ASO. Good Luck.</p>
    </div>
  );
}

function SimilarIconThumbnails({ images = [], appName = "" }) {
  if (!images.length) return null;
  return (
    <div className="similar-icon-thumbnails">
      {images.map((image, index) => (
        <StoreImage
          key={`${image}-${index}`}
          src={image}
          alt={`${appName || "App"} similar icon ${index + 1}`}
          className="similar-icon-thumbnail"
        />
      ))}
    </div>
  );
}
function AndroidIconContent({ app, mainApp, similarImages = [], variant = "default" }) {
  if (!app) return null;
  const isCompetitorColumn = variant === "competitor";
  return (
    <div>
      <div className="dis-flex gap-15-lr icon-detail-row">
        <div className="center-middle header-icon"><StoreImage src={app.icon} alt={app.name} /></div>
        <div>
          <p className="detail-title-sub">Pixel Size</p>
          <p className="detailed-content-p">The icon for your Application looks good, but does not meet Google Play specifications. Google Play recommends that the icon be <b>512 × 512 pixels</b>. Here is the link to Google Play Specifications for App Icons:<br /><b><a href="http://iconhandbook.co.uk/reference/chart/android/" target="_blank" rel="noreferrer" className="detail-links">http://iconhandbook.co.uk/reference/chart/android/</a></b></p>
        </div>
      </div>
      <p className="detail-title-sub">Similarity to other images</p>
      {isCompetitorColumn && mainApp ? (
        <>
          <p className="detailed-content-p">The icon for your Application looks good, but looks very similar to icons of some competitive Application you provided. Suggest you make a change to the icon so that it is not very similar to the competition.<br /><br /><b><i>Here is your App Icon, and here is your competitor icon which is closer to yours.</i></b></p>
          <div className="icon-comparison-row text-center">
            <div className="report-icon-preview"><StoreImage src={mainApp.icon} alt={mainApp.name} className="similar-image img-thumbnail" /><br /><br /><b><u><span style={{ color: "#d13662" }}>App Icon</span></u></b></div>
            <br/><br/>
            <div className="report-icon-preview"><StoreImage src={app.icon} alt={app.name} className="similar-image img-thumbnail" /><br /><br /><b><u><span style={{ color: "#d13662" }}>Competitor App Icon</span></u></b></div>
          </div>
        </>
      ) : (
        <>
          <p className="detailed-content-p">The icon for your Application is Unique and doesn’t match other icons. Good work in getting the Icon done right.</p>
          <SimilarIconThumbnails images={similarImages} appName={app.name} />
        </>
      )}
      {/* <p className="detail-title-sub">Icon Clarity</p>
      <p className="detailed-content-p">The icon for your Application looks crisp and clear. Excellent work by your Application development team.</p> */}
    </div>
  );
}
// function AndroidIconContent({ app, mainApp, similarImages = [], variant = "default" }) {
//   if (!app) return null;
//   const isCompetitorColumn = variant === "competitor";
//   return (
//     <div>
//       <div className="dis-flex gap-15-lr icon-detail-row">
//         <div className="center-middle header-icon"><StoreImage src={app.icon} alt={app.name} /></div>
//         <div>
//           <p className="detail-title-sub">Pixel Size</p>
//           <p className="detailed-content-p">The icon for your Application looks good, but does not meet Google Play specifications. Google Play recommends that the icon be <b>512 × 512 pixels</b>. Here is the link to Google Play Specifications for App Icons:<br /><b><a href="http://iconhandbook.co.uk/reference/chart/android/" target="_blank" rel="noreferrer" className="detail-links">http://iconhandbook.co.uk/reference/chart/android/</a></b></p>
//         </div>
//       </div>
//       <p className="detail-title-sub">Similarity to other images</p>
//       {isCompetitorColumn && mainApp ? (
//         <>
//           <p className="detailed-content-p">The icon for your Application looks good, but looks very similar to icons of some competitive Application you provided. Suggest you make a change to the icon so that it is not very similar to the competition.<br /><br /><b><i>Here is your App Icon, and here is your competitor icon which is closer to yours.</i></b></p>
//           <div className="icon-comparison-row text-center">
//             <div className="report-icon-preview"><StoreImage src={mainApp.icon} alt={mainApp.name} className="similar-image img-thumbnail" /><br /><br /><b><u><span style={{ color: "#d13662" }}>App Icon</span></u></b></div>
//             <br/><br/>
//             <div className="report-icon-preview"><StoreImage src={app.icon} alt={app.name} className="similar-image img-thumbnail" /><br /><br /><b><u><span style={{ color: "#d13662" }}>Competitor App Icon</span></u></b></div>
//           </div>
//         </>
//       ) : (
//         <>
//           <p className="detailed-content-p">The icon for your Application looks good, but looks very similar to some other icons. Here are some of the similar icons. We recommend you need to change your icons for better branding for your Application.</p>
//           <SimilarIconThumbnails images={similarImages} appName={app.name} />
//         </>
//       )}
//       {/* <p className="detail-title-sub">Icon Clarity</p>
//       <p className="detailed-content-p">The icon for your Application looks crisp and clear. Excellent work by your Application development team.</p> */}
//     </div>
//   );
// }



function AndroidNameBlock({ app, competitorApp }) {
  if (!app) return null;

  const appName = getAppName(app);
  const charCount = appName.trim().length;
  const commonText = getLegacyAppNameCommonText(app, "android");
  const hasCommonWords = parseFloat(app.appNameCommonWordsRatio) < 0.5;
  const repetitiveWords = Array.isArray(app.appNameRepetitiveKeys) ? app.appNameRepetitiveKeys : [];
  const commonWordSuggestions = parseLegacyCombinations(app.appNameCombinations);
  const characterCountText = getLegacyNameCharacterText(app, competitorApp, "android");

  return (
    <div>
      <h4 className="sub-heading-4 text-center displayTitle">
        {appName}
      </h4>

      <div>
        <p className="detail-title-sub">Character Count</p>
      </div>

      <p className="detailed-content-p">
        {characterCountText}
      </p>
      {(charCount < 25) && (
        <p className="detailed-content-p">
          <a
            href="https://adwords.google.com/intl/en_in/home/tools/keyword-planner/"
            target="_blank"
            rel="noreferrer"
            className="detail-links"
          >
            https://adwords.google.com/intl/en_in/home/tools/keyword-planner/
          </a>
        </p>
      )}

      <div>
        <p className="detail-title-sub">Common Words</p>
      </div>

      <p className="detailed-content-p">
        {hasCommonWords ? commonText.good : commonText.needsWork}
      </p>
      {!hasCommonWords && commonWordSuggestions.length > 0 && (
        <ol className="details-lists">
          {commonWordSuggestions.map((word, index) => <li key={`${word}-${index}`}>{word}</li>)}
        </ol>
      )}

      <div>
        <p className="detail-title-sub">Repetitive Words</p>
      </div>

      <p className="detailed-content-p">
        {repetitiveWords.length < 2 ? commonText.repetitiveGood : commonText.repetitiveBad}
      </p>
      {repetitiveWords.length >= 2 && (
        <ol className="details-lists">
          {/* {repetitiveWords.map((word, index) => <li key={`${word}-${index}`}>{word}</li>)} */}
        </ol>
      )}
    </div>
  );
}

function AndroidNameCompetitorBlock({ app }) {
  if (!app) return null;

  const keywords = getCompetitorKeywordsForDisplay(app, "name");
  const appName = getAppName(app);
  const charCount = appName.trim().length;
  const characterCountText = getLegacyNameCharacterText(app, null, "android");

  return (
    <div>
      <h4 className="sub-heading-4 text-center displayTitle">
        {appName}
      </h4>

      <p className="detail-title-sub">Character Count</p>

      <p className="detailed-content-p">
        {characterCountText}
      </p>

      {(charCount < 25) && (
        <p className="detailed-content-p">
          <a
            href="https://adwords.google.com/intl/en_in/home/tools/keyword-planner/"
            target="_blank"
            rel="noreferrer"
            className="detail-links"
          >
            https://adwords.google.com/intl/en_in/home/tools/keyword-planner/
          </a>
        </p>
      )}

      <p className="detail-title-sub">Common Words</p>

      <p className="detailed-content-p">
        Here are the top words used by competitive Applications that
        you may consider using in your App.
      </p>

      <p className="detail-title-sub">Repetative Words</p>

      <ul className="details-lists">
        {/* {keywords.map((word, index) => (
          <li key={`${word}-${index}`}>{word}</li>
        ))} */}
      </ul>

      <p className="detailed-content-p">
        We suggest that you use some of these important words in your
        App name so that it brings better ASO visibility for your
        Application.
      </p>
    </div>
  );
}

// function AndroidNameCompetitorBlock({ app }) {
//   if (!app) return null;
//   const keywords = getCompetitorKeywordsForDisplay(app, "name");
//   const charCount = (app.name || "").trim().length;
//   return (
//     <div>
//       <h4 className="sub-heading-4 text-center displayTitle">{app.name}</h4>
//       <p className="detail-title-sub">Character Count</p>
//       <p className="detailed-content-p">The name of your Application is too short. You only have <b>{charCount}</b> characters. Google Play recommends 25-30 characters. Your Application name will not be accepted if it doesn't contain the most relevant keywords. Check out Google Keywords planner tools for relevant keywords at the following link:<br /><br /><a href="https://adwords.google.com/intl/en_in/home/tools/keyword-planner/" target="_blank" rel="noreferrer" className="detail-links">https://adwords.google.com/intl/en_in/home/tools/keyword-planner/</a></p>
//       <p className="detail-title-sub">Common Words</p>
//       <p className="detailed-content-p">Here are the top words used by the competitive Applications that you used in your App.</p>
//       <p className="detail-title-sub">Repetitive Words</p>
//        <ul className="details-lists">{keywords.map((word, i) => <li key={`${word}-${i}`}>{word}</li>)}</ul>
//      {/* <p className="sub-heading-4">ASO Optimization</p> */}
//       <p className="detailed-content-p">We suggest that you use some of these important words in your App name so that it brings in better ASO for your Application.</p>
//     </div>
//   );
// }

function AndroidDescriptionBlock({ app, competitorApp }) {
  const descriptionTexts = getLegacyDescriptionTexts(app, competitorApp, "android");
  return (
    <div>
      <p className="detail-title-sub">Character Count</p><p className="detailed-content-p">{descriptionTexts.characterText}</p>
      <p className="detail-title-sub">Common Words</p><p className="detailed-content-p">{descriptionTexts.commonText}</p>
      <p className="detail-title-sub">Repetitive Words</p><p className="detailed-content-p">{descriptionTexts.repetitiveText}</p>
      {descriptionTexts.repetitiveWords.length >= 2 && (
        <ol className="details-lists">
          {descriptionTexts.repetitiveWords.map((word, index) => <li key={`${word}-${index}`}>{word}</li>)}
        </ol>
      )}
    </div>
  );
}

// FIXED: Defined the missing component required on row rendering tree matrix (line 978)
function AndroidCompetitorsKeywordsBlock({ competitor, variant = "description" }) {
  if (!competitor) return null;
  const keywords = getCompetitorKeywordsForDisplay(competitor, variant);
  const introText = "Here are the top words used by the competitive Applications that you used in your App.";
  const outroText = "We suggest that you use some of these important words in your App Description so that it brings in better ASO for your Application.";
  return (
    <div>
      <p className="detail-title-sub">Competitors</p><p className="detailed-content-p">{introText}</p>
      <ol className="details-lists">{keywords.map((word, index) => <li key={`${word}-${index}`}>{word}</li>)}</ol>
      <p className="detailed-content-p">{outroText}</p>
    </div>
  );
}

function AndroidContentImagesBlock({ app }) {
  const images = getLiveScreenshotGrid(app);
  const mobileImages = getLiveMobileScreenshotGrid(app);
  const mobileImageUrls = new Set(mobileImages.map(getComparableImageUrl));
  const notRecommendedImages = images.filter((img) => !mobileImageUrls.has(getComparableImageUrl(img)));
  const imageCount = images.length;
  const storeName = getStoreName(app);
  const recommendedCount = 8;
  const moreImages = Math.max(recommendedCount - imageCount, 0);
  let numberOfImagesText = imageCount === 0 
    ? `${storeName} can take ${recommendedCount} images to be displayed and your Application has no images available on the App store. We recommend that you add ${recommendedCount} images so that it meets the ${storeName} recommendations.` 
    : imageCount < recommendedCount 
    ? `${storeName} can take ${recommendedCount} images to be displayed and your Application has only ${imageCount} images available on the App store. We recommend that you add ${moreImages} more images to the App store so that it meets the ${storeName} recommendations.` 
    : `Your App has ${imageCount} images posted on the App store – Those are good. Good Work by your team.`;
    
  return (
    <div>
      <p className="detail-title-sub">Number of Images</p><p className="detailed-content-p">{numberOfImagesText}</p>
      <p className="detail-title-sub">Image Blurry</p><p className="detailed-content-p">All the images that were uploaded by your team on the App store are crisp and clear. Excellent work by your graphics team.</p>
      {mobileImages.length > 0 && (
        <div className="content-images-grid">{mobileImages.map((img, i) => <StoreImage key={`mobile-${img}-${i}`} src={img} alt={`${app.name} mobile screenshot ${i + 1}`} className="content-screenshot" />)}</div>
      )}
      <p className="detail-title-sub">Images Not Recommended Size</p><p className="detailed-content-p">Google Play recommends that images should meet proper aspect ratios. Review the screenshots below and replace any that do not meet store guidelines.</p>
      {notRecommendedImages.length > 0 && (
        <div className="content-images-grid">{notRecommendedImages.map((img, i) => <StoreImage key={`size-${img}-${i}`} src={img} alt={`${app.name} store image ${i + 1}`} className="content-screenshot" />)}</div>
      )}
    </div>
  );
}

function AndroidContentVideoBlock({ app }) {
  const videos = getLiveVideosGrid(app);
  const [videoTitles, setVideoTitles] = useState({});
  const storeName = getStoreName(app);
  const videoText = videos.length > 0 
    ? `According to a report – having a video on ${storeName} raises the chances that your App will be visible for better ASO. Your team has done an amazing job with the video content.` 
    : `According to a report – having a video on ${storeName} raises the chances that your App will be visible for better ASO. We suggest that you add a video to the App store.`;

  useEffect(() => {
    let isMounted = true;
    const loadTitles = async () => {
      const titles = {};
      await Promise.all(videos.map(async (url, index) => {
        const title = await fetchYouTubeTitle(url);
        titles[index] = title || getVideoFallbackTitle(url, index);
      }));
      if (isMounted) setVideoTitles(titles);
    };
    if (videos.length > 0) loadTitles();
    return () => { isMounted = false; };
  }, [videos]);

  return (
    <div>
      <div className="similar-img">
        {videos.map((url, i) => {
          const title = videoTitles[i] || getVideoFallbackTitle(url, i);
          const embedUrl = getYouTubeEmbedUrl(url) || url;
          return (
            <div className="content-video-item" key={url || i}>
              <iframe title={title} width="100%" height="300" src={embedUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen frameBorder="0"></iframe>
              <p className="content-video-title">{title}</p>
            </div>
          );
        })}
      </div>
      <p className="detail-title-sub">Videos</p><p className="detailed-content-p">{videoText}</p>
    </div>
  );
}

function AndroidReviewBlock({ rating }) {
  const rate = Number(rating || 0).toFixed(1);
  const getStarImage = () => {
    const value = parseFloat(rate);
    if (value >= 4.5) return star5; if (value >= 4.0) return star4half; if (value >= 3.5) return star4; if (value >= 2.5) return star3; if (value >= 1.5) return star2; if (value >= 0.5) return star1; return star0;
  };
  return (
    <div>
      <p className="detail-title-sub">Ratings <span className="ratings-icon">{rate} <img src={getStarImage()} alt="stars" /></span></p>
      <p className="detailed-content-p">Your current rating is <b>{rate}</b><br /><br />Your App rating parameters are stable, check user reviews for version updates.</p>
    </div>
  );
}

function AndroidAppStoreBlock() {
  return (
    <div><p className="detail-title-sub">You should consider placing your App in alternative App stores such as:</p><ul className="details-lists"><li>Google Play Store</li><li>Amazon Appstore</li><li>Samsung Galaxy Store</li><li>Nexva</li></ul></div>
  );
}

function AndroidSizeBlock({ app }) {
  const sizeText = app.appDetailsSizeText || formatAppSize(app.fileSize);
  return (
    <div>
      <p className="detail-title-sub">Size</p><p className="detailed-content-p">The size of your App is <b>{sizeText}</b>.</p>
      <p className="detail-title-sub">Price</p><p className="detailed-content-p">Your App costs <b>{"$0.00"}</b>. Do not insert too many ads inside your app. Users hate to see ads, even if the App is free.</p>
      <p className="detail-title-sub">In-Apps Payments</p><p className="detailed-content-p">{app.inAppPayments ? "Available" : "Not Applicable"}</p>
    </div>
  );
}

function AndroidAppInfoBlock({ app }) {
  const releaseDate = app.updatedDate || app.launchedDate;
  const formattedReleaseDate = formatDate(releaseDate);
  const versionText = getVersionTextForReport(app);
  return (
    <div>
      <p className="sub-heading-4">Version Info</p>
      <p className="detailed-content-p">Current Version is: <b>{versionText}</b>, it was released on <b>{formattedReleaseDate}</b></p>
      <p className="detailed-content-p">Based on a report - apps on Google Play are recommended to be updated every 3-5 weeks to keep them current/vibrant. Suggest you keep your App current.</p>
      <p className="detail-title-sub">Whats New</p><p className="detailed-content-p">{app.whatsNew || "Performance improvements."}</p>
    </div>
  );
}

function AndroidAdditionalInfoBlock({ app }) {
  const contentRating = isAndroid(app) ? "Everyone" : app.contentRating;
  return (
    <div><p className="detail-title-sub">App Information</p><p className="detailed-content-p">No. of Installs : {formatCountPlus(app.users)}<br />Content Rating : {contentRating}</p></div>
  );
}

function AndroidFeaturesBlock({ app }) {
  const features = useMemo(() => {
    const descriptionLines = getDescriptionLines(app?.fullDescription || app?.appDescription || app?.description || "");
    if (descriptionLines.length > 0) return descriptionLines;
    if (Array.isArray(app?.appFeatures) && app.appFeatures.length > 0) {
      return app.appFeatures;
    }
    if (Array.isArray(app?.reviewAnalysis?.appFeatures)) return app.reviewAnalysis.appFeatures;
    return [
      "Optimized operational interface constructed specifically for mobile performance tracks",
      "Robust data security framework safeguarding active network communication channels"
    ];
  }, [app]);

  return (
    <div>{features.map((item, i) => <p key={i} className="detailed-content-p">{item}</p>)}</div>
  );
}

function AndroidFuturesBlock() {
  return (
    <div>
      <p className="detail-title-sub">Languages</p><p className="detailed-content-p">Translating your App into other languages helps expand your reach.</p>
      <p className="detail-title-sub">In App Advertising?</p><p className="detailed-content-p">Is there a way to identify how many ads are displayed?</p>
      <ul className="details-lists"><li>Too many – Annoying</li><li>Too few – No revenue generated</li></ul>
      <p className="detail-title-sub">Monetization</p><p className="detailed-content-p">Compare how competitors are monetizing:</p>
      <ul className="details-lists"><li>Ads?</li><li>Premium?</li><li>Freemium?</li></ul>
    </div>
  );
}

/* ==========================================================================
   =========================== iOS BLOCKS ===================================
   ========================================================================== */

function IOSAboutBlock({ app }) {
  if (!app) return "N/A";
  const shortDescription = getShortDescription(app.description);
  return (
    <div>
      <p className="detail-title-sub">About {app.name}</p><p className="detailed-content-p clamp-5">{shortDescription}</p>
      <ul className="about-details-d">
        <li className="about-details-d-list font-style-normal">User : <span className="details-main">{formatCountPlus(app.users)}</span></li>
        {app.launchedDate && <li className="about-details-d-list">Date launched : <span className="details-main">{formatDate(app.launchedDate)}</span></li>}
        <li className="about-details-d-list">Parent organization : <span className="details-main">{app.seller}</span></li>
        <li className="about-details-d-list">Operating system : <span className="details-main">iOS</span></li>
        <li className="about-details-d-list sellerUrlLI">Website : <span className="details-main">{app.website ? <a href={app.website} target="_blank" rel="noreferrer" className="detail-links">{app.website}</a> : "Not Available"}</span></li>
      </ul>
      <p className="detailed-content-p">No repeated Words in your Application – excellent work by your team in making sure that you have a good choice of words. This will help you in your ASO. Good Luck.</p>
    </div>
  );
}

function IOSIconContent({ app, mainApp, variant = "default" }) {
  if (!app) return null;
  const isCompetitorColumn = variant === "competitor";
  return (
    <div>
      <div className="dis-flex gap-15-lr icon-detail-row">
        <div className="center-middle header-icon"><StoreImage src={app.icon} alt={app.name} /></div>
        <div>
          <p className="detail-title-sub">Pixel Size</p><p className="detailed-content-p">The icon for your Application looks good, but does not meet iStore specifications. iStore recommends that the icon be 512 x 512 pixels. Here is the link to iStore Specifications for App Icons.</p>
        </div>
      </div>
      <p className="detail-title-sub">Similarity to other images</p>
      {isCompetitorColumn && mainApp ? (
        <>
          <p className="detailed-content-p">The icon for your Application looks good, but looks very similar to icons of some competitive Application you provided. Suggest you make a change to the icon so that it is not very similar to the competition.<br /><br /><b><i>Here is your App Icon, and here is your competitor icon which is closer to yours.</i></b></p>
          <div className="icon-comparison-row text-center">
            <div className="report-icon-preview"><StoreImage src={mainApp.icon} alt={mainApp.name} className="similar-image img-thumbnail" /><br /><br /><b><u><span style={{ color: "#d13662" }}>App Icon</span></u></b></div>
            <br/><br/>
            <div className="report-icon-preview"><StoreImage src={app.icon} alt={app.name} className="similar-image img-thumbnail" /><br /><br /><b><u><span style={{ color: "#d13662" }}>Competitor App Icon</span></u></b></div>
          </div>
        </>
      ) : (
        <p className="detailed-content-p">The icon for your Application is Unique and doesn’t match other icons. Good work in getting the Icon done right.</p>
      )}
      {/* <p className="detail-title-sub">Icon Clarity</p><p className="detailed-content-p">The icon for your Application looks crisp and clear. Excellent work by your Application development team.</p> */}
    </div>
  );
}

function IOSNameBlock({ app, competitorApp }) {
  if (!app) return null;

  const name = getAppName(app);
  const commonText = getLegacyAppNameCommonText(app, "ios");
  const hasCommonWords = parseFloat(app.appNameCommonWordsRatio) < 0.5;
  const repetitiveWords = Array.isArray(app.appNameRepetitiveKeys) ? app.appNameRepetitiveKeys : [];
  const commonWordSuggestions = parseLegacyCombinations(app.appNameCombinations);
  const characterCountText = getLegacyNameCharacterText(app, competitorApp, "ios");

  return (
    <div>

      <h4 className="sub-heading-4 text-center displayTitle">
        {name}
      </h4>

      <p className="detail-title-sub">
        Character Count
      </p>

      <p className="detailed-content-p">
        {characterCountText}
      </p>

      <p className="detail-title-sub">
        Common Words
      </p>

      <p className="detailed-content-p">
        {hasCommonWords ? commonText.good : commonText.needsWork}
      </p>
      {!hasCommonWords && commonWordSuggestions.length > 0 && (
        <ol className="details-lists">
          {commonWordSuggestions.map((word, index) => <li key={`${word}-${index}`}>{word}</li>)}
        </ol>
      )}

      <p className="detail-title-sub">
        Repetitive Words
      </p>

      {repetitiveWords.length < 2 ? (

        <p className="detailed-content-p">
          {commonText.repetitiveGood}
        </p>

      ) : (

        <div className="detailed-content-p">

          {commonText.repetitiveBad}

          <ol>
            {repetitiveWords.map((word, i) => (
              <li key={i}>
                {word}
              </li>
            ))}
          </ol>

        </div>

      )}

    </div>
  );
}


function IOSNameCompetitorBlock({ app }) {
  if (!app) return null;

  const keywords =
    getCompetitorKeywordsForDisplay(
      app,
      "name"
    );

  const characterCountText = getLegacyNameCharacterText(app, null, "ios");

  return (
    <div>

      <h4 className="sub-heading-4 text-center displayTitle">
        {getAppName(app)}
      </h4>

      <p className="detail-title-sub">
        Character Count
      </p>

      <p className="detailed-content-p">
        {characterCountText}
      </p>

      <p className="detail-title-sub">
        Common Words
      </p>

      <p className="detailed-content-p">
        Here are the top words used by the competitive Applications that you used in your App.
      </p>

      <p className="detail-title-sub">
        Repetitive Words
      </p>

      <ul className="details-lists">
        {keywords.map((word, index) => (
          <li key={`${word}-${index}`}>
            {word}
          </li>
        ))}
      </ul>

      <p className="detailed-content-p">
        We suggest that you use some of these important words in your App name so that it brings in better ASO for your Application.
      </p>

    </div>
  );
}



function IOSDescriptionBlock({ app, competitorApp }) {
  const descriptionTexts = getLegacyDescriptionTexts(app, competitorApp, "ios");

  return (
    <div>
      <p className="detail-title-sub">Character Count</p>

      <p className="detailed-content-p">
        {descriptionTexts.characterText}
      </p>

      <p className="detail-title-sub">Common Words</p>

      <p className="detailed-content-p">
        {descriptionTexts.commonText}
      </p>

      <p className="detail-title-sub">Repetitive Words</p>

      <p className="detailed-content-p">
        {descriptionTexts.repetitiveText}
      </p>
      {descriptionTexts.repetitiveWords.length >= 2 && (
        <ol className="details-lists">
          {descriptionTexts.repetitiveWords.map((word, index) => <li key={`${word}-${index}`}>{word}</li>)}
        </ol>
      )}
    </div>
  );
}

function IOSCompetitorsKeywordsBlock({
  competitor,
  variant = "description",
}) {
  if (!competitor) return null;

  const keywords =
    getCompetitorKeywordsForDisplay(
      competitor,
      variant
    );

  return (
    <div>

      <p className="detail-title-sub">
        Competitors
      </p>

      <p className="detailed-content-p">
        Here are the top words used by the competitive Applications that you provided:
      </p>

      <ul className="details-lists">
        {keywords.map((word, index) => (
          <li key={index}>
            {word}
          </li>
        ))}
      </ul>

      <p className="detailed-content-p">
        We suggest that you use some of these important words in your App description so that it brings in better ASO for your Application.
      </p>

    </div>
  );
}
function IOSContentImagesBlock({ app }) {
  const images = app.screenshots || [];
  const imageCount = images.length;
  const storeName = getStoreName(app);
  const recommendedCount = 8;
  const moreImages = Math.max(recommendedCount - imageCount, 0);
  let numberOfImagesText = imageCount === 0 ? `${storeName} can take ${recommendedCount} images to be displayed and your Application has no images available on the App store. We recommend that you add ${recommendedCount} images so that it meets the ${storeName} recommendations.` : imageCount < recommendedCount ? `${storeName} can take ${recommendedCount} images to be displayed and your Application has only ${imageCount} images available on the App store. We recommend that you add ${moreImages} more images to the App store so that it meets the ${storeName} recommendations.` : `Your App has ${imageCount} images posted on the App store – Those are good. Good Work by your team.`;
  return (
    <div>
      <p className="detail-title-sub">Number of Images</p><p className="detailed-content-p">{numberOfImagesText}</p>
      <p className="detail-title-sub">Image Blurry</p><p className="detailed-content-p">All the images that were uploaded by your team on the App store are crisp and clear. Excellent work by your graphics team.</p>
      <p className="detail-title-sub">Images Not Recommended Size</p><p className="detailed-content-p">App Store recommends that images should be 512 × 512 pixels. Review the screenshots below and replace any that do not meet store guidelines.</p>
      {imageCount > 0 && (
        <div className="content-images-grid">{images.map((img, i) => <StoreImage key={`size-${img}-${i}`} src={img} alt={`${app.name} store image ${i + 1}`} className="content-screenshot" />)}</div>
      )}
    </div>
  );
}

function IOSContentVideoBlock({ app }) {
  const videos = useMemo(() => (Array.isArray(app?.videos) ? app.videos : EMPTY_VIDEOS), [app?.videos]);
  const [videoTitles, setVideoTitles] = useState({});
  const storeName = getStoreName(app);
  const videoText = app?.contentVideoText || (videos.length > 0 ? `According to a report – having a video on ${storeName} raises the chances that your App will be visible for better ASO. Your team has done an amazing job with the video content.` : `According to a report – having a video on ${storeName} raises the chances that your App will be visible for better ASO. We suggest that you add a video to the App store.`);

  useEffect(() => {
    let isMounted = true;
    const loadTitles = async () => {
      const titles = {};
      await Promise.all(videos.map(async (url, index) => {
        const title = await fetchYouTubeTitle(url);
        titles[index] = title || getVideoFallbackTitle(url, index);
      }));
      if (isMounted) setVideoTitles(titles);
    };
    if (videos.length > 0) {
      loadTitles();
    } else {
      Promise.resolve().then(() => {
        if (isMounted) setVideoTitles({});
      });
    }
    return () => { isMounted = false; };
  }, [videos]);

  return (
    <div>
      <div className="similar-img">
        {videos.length > 0 && videos.map((url, i) => {
          const title = videoTitles[i] || getVideoFallbackTitle(url, i);
          const embedUrl = getYouTubeEmbedUrl(url);
          return (
            <div className="content-video-item" key={url || i}>
              {embedUrl ? (
                <iframe title={title} width="100%" height="300" src={embedUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen frameBorder="0"></iframe>
              ) : (
                <video controls width="100%" height="300" src={url}></video>
              )}
              <p className="content-video-title">{title}</p>
            </div>
          );
        })}
      </div>
      <p className="videos">Videos</p><p className="detailed-content-p">{videoText}</p>
    </div>
  );
}

function IOSReviewBlock({ rating }) {
  const rate = Number(rating || 0).toFixed(2);
  const getStarImage = () => {
    const value = parseFloat(rate);
    if (value >= 4.5) return star5; if (value >= 4.0) return star4half; if (value >= 3.5) return star4; if (value >= 2.5) return star3; if (value >= 1.5) return star2; if (value >= 0.5) return star1; return star0;
  };
  return (
    <div>
      <p className="detail-title-sub">Ratings <span className="ratings-icon">{rate} <img src={getStarImage()} alt="stars" /></span></p>
      <p className="detailed-content-p">Your current rating is <b>{rate}</b></p>
    </div>
  );
}

function IOSAppStoreBlock() {
  return (
    <div><p className="detail-title-sub">Your Application is available in the following App stores:</p><ul className="details-lists"><li>iStore</li></ul><p className="detail-title-sub">You should consider placing your App in alternative App stores such as:</p><ul className="details-lists"><li>Google Play Store</li><li>amazon</li><li>samsung</li><li>nexva</li></ul></div>
  );
}

function IOSSizeBlock({ app }) {
  const sizeText = app.appDetailsSizeText || formatAppSize(app.fileSize);
  return (
    <div>
      <p className="detail-title-sub">Size</p><p className="detailed-content-p">The size of your App is <b>{sizeText}</b>.Try to keep your App as small as possible (under 100MB) to allow users to download them on cellular networks</p>
      <p className="detail-title-sub">Price</p><p className="detailed-content-p">Your App costs <b>{"$0.00"}</b>. Do not insert too many ads inside your app. Users hate to see ads, even if the App is free.</p>
      <p className="detail-title-sub">In-Apps Payments</p><p className="detailed-content-p">{app.inAppPayments ? "Available" : "Not Applicable"}</p>
    </div>
  );
}

function IOSAppInfoBlock({ app }) {
  const releaseDate = app.updatedDate || app.launchedDate;
  const formattedReleaseDate = formatDate(releaseDate);
  const recentlyUpdated = wasUpdatedWithinDays(releaseDate, 7);
  const versionText = getVersionTextForReport(app);
  return (
    <div>
      <p className="detail-title-sub">Version</p><p className="detailed-content-p">Current Version is: <b>{versionText}</b>, it was released on <b>{formattedReleaseDate}</b></p>
      <p className="detailed-content-p">{recentlyUpdated ? "Good work - the latest version of the App on the App store is less than a week old. Good work by your team in keeping the App current." : `Your App was last updated on App Store on ${formattedReleaseDate}.`}</p>
      <p className="detailed-content-p">Based on a report - apps on App Store are recommended to be updated every 3-5 weeks to keep them current/vibrant. Suggest you keep your App current.</p>
      <p className="detail-title-sub">Whats New</p><p className="detailed-content-p">{app.whatsNew}</p>
    </div>
  );
}

function IOSAdditionalInfoBlock({ app }) {
  const contentRating = isAndroid(app) ? "Everyone" : app.contentRating;
  return (
    <div><p className="detail-title-sub">App Information</p><p className="detailed-content-p">No. of Installs : {formatCountPlus(app.users)}<br />Content Rating : {contentRating}</p></div>
  );
}

function IOSFeaturesBlock({ app }) {
  const features = Array.isArray(app.appFeatures) ? app.appFeatures : String(app.appFeatures || app.description || "").split(". ").filter(Boolean).slice(0, 8);
  return (
    <div>{features?.map((item, i) => <p key={i} className="detailed-content-p">{item}.</p>)}</div>
  );
}

function IOSFuturesBlock() {
  return (
    <div>
      <p className="detail-title-sub">Languages</p><p className="detailed-content-p">Translating your App into other languages helps expand your reach.</p>
      <p className="detail-title-sub">In App Advertising?</p><p className="detailed-content-p">Is there a way to identify how many ads are displayed?</p>
      <ul className="details-lists"><li>Too many – Annoying</li><li>Too few – No revenue generated</li></ul>
      <p className="detail-title-sub">Monetization</p><p className="detailed-content-p">Compare how competitors are monetizing:</p>
      <ul className="details-lists"><li>Ads?</li><li>Premium?</li><li>Freemium?</li></ul>
    </div>
  );
}

/* ==========================================================================
   ======================= MAIN REPORT PAGE EXPORT ===========================
   ========================================================================== */

export default function ReportPage() {
  const { state } = useLocation();
  const storedReportData = useMemo(() => readStoredReportData(), []);
  const leftApp = useMemo(() => normalizeAppData(state?.leftApp || storedReportData.leftApp), [state?.leftApp, storedReportData.leftApp]);
  const rightApp = useMemo(() => normalizeAppData(state?.rightApp || storedReportData.rightApp), [state?.rightApp, storedReportData.rightApp]);
  const reportPlatform = state?.platform || storedReportData.platform || "android";
  const reportCountry = (state?.country || storedReportData.country || "US").toUpperCase();
  const isAndroidReport = reportPlatform.toLowerCase() === "android";

  const [leftSimilarImages, setLeftSimilarImages] = useState([]);
  const [rightSimilarImages, setRightSimilarImages] = useState([]);
  const [showPost, setShowPost] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");

  const handlePost = async () => {
    setNameError(""); setEmailError(""); setMessageError("");
    if (!name.trim()) { setNameError("Enter the full name"); return; }
    if (!email.trim()) { setEmailError("Enter the email"); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setEmailError("Enter a valid email address"); return; }
    if (!message.trim()) { setMessageError("Enter the message"); return; }

    const jsonInput = JSON.stringify({ fullName: name, email, companyName: company, message });
    const formData = new FormData();
    if (fileName) formData.append("file", document.getElementById("profile_pic").files[0]);
    formData.append("jsonInput", jsonInput);

    try {
      const res = await fetch("https://dev.unfoldlabs.com/AppCurator_api/saveTestimonials", { method: "POST", body: formData });
      const result = await res.json();
      if (result.statusCode === 200) {
        setName(""); setEmail(""); setCompany(""); setMessage(""); setFileName(""); setShowPost(false);
      }
    } catch (err) {
      console.error("Error posting testimonial:", err);
    }
  };

  const handleClosePopup = () => {
    setShowPost(false); setName(""); setEmail(""); setCompany(""); setMessage(""); setFileName("");
    setNameError(""); setEmailError(""); setMessageError("");
  };

  useEffect(() => {
    const sticky = document.querySelector(".sticky-div");
    const scrollBtn = document.getElementById("button-scroll-top");
    if (!sticky) return;
    const stickyTop = sticky.offsetTop;
    const onScroll = () => {
      if (window.scrollY > stickyTop - 90) sticky.classList.add("fixed-compare");
      else sticky.classList.remove("fixed-compare");
      if (window.scrollY > 300) scrollBtn?.classList.add("show-scroll-top");
      else scrollBtn?.classList.remove("show-scroll-top");
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (leftApp && rightApp) {
      const reportData = { leftApp, rightApp, platform: reportPlatform, country: reportCountry };
      localStorage.setItem("reportData", JSON.stringify(reportData));
    }
  }, [leftApp, rightApp, reportPlatform, reportCountry]);

  useEffect(() => {
    if (!leftApp && !rightApp) return;
    let isMounted = true;
    const loadSimilarImages = async () => {
      try {
        const [leftImages, rightImages] = await Promise.all([
          leftApp ? fetchSimilarImagesForApp(leftApp) : Promise.resolve([]),
          rightApp ? fetchSimilarImagesForApp(rightApp) : Promise.resolve([]),
        ]);
        if (!isMounted) return;
        setLeftSimilarImages(leftImages);
        setRightSimilarImages(rightImages);
      } catch (error) {
        console.error("Unable to load similar icons:", error);
      }
    };
    loadSimilarImages();
    return () => { isMounted = false; };
  }, [leftApp, rightApp]);

  if (!leftApp || !rightApp) {
    return (
      <><CRHeader /><div className="page-offset" /><div className="container-block"><h2>No apps selected</h2></div><CRFooter /></>
    );
  }

  return (
    <div className="app-container">
      <CRHeader /><div className="page-offset" />
      <div className="reportpage-content-block">
        <div className="dis-flex justify-space-between">
          <ul className="bredcrumbs-ul pad-b-0">
            <li className="bredcrumbs-list"><Link to="/" className="bredcrumbs-link">Home</Link></li>
            <li className="bredcrumbs-list">
              <Link to={`/compare?app1=${encodeURIComponent(leftApp?.name || "")}&app2=${encodeURIComponent(rightApp?.name || "")}&platform=${encodeURIComponent(reportPlatform)}&country=${encodeURIComponent(reportCountry)}`} className="bredcrumbs-link">Select App</Link>
            </li>
            <li className="bredcrumbs-list">Search Results</li>
          </ul>
          <div className="get-report-n-back">
            <div className="report-download dis-flex gap-15-lr">
              <PDFDownloadButton />
              <button className="report-btn secondary" onClick={() => setShowPost(true)}>Post Testimonials</button>
            </div>
          </div>
        </div>
      </div>
      <div className="container-block search-apps-detailed">
        <div className="app-details-block">
          <div className="sticky-div">
            <div className="in-selected-apps dis-flex compare-head">
              <div className="w-50 app-col">
                <div className="app-details-in dis-flex">
                  <div className="details-logo"><StoreImage src={leftApp.icon} alt={leftApp.name} /></div>
                  <div className="details-names center-middle"><p>{leftApp.name}</p></div>
                </div>
              </div>
              <div className="swap-center"><img src={viceVersaIcon} className="vice-versa-icon" alt="swap" /></div>
              <div className="w-50 app-col">
                <div className="app-details-in dis-flex">
                  <div className="details-logo"><StoreImage src={rightApp.icon} alt={rightApp.name} /></div>
                  <div className="details-names center-middle"><p>{rightApp.name}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-block report-body">
        {isAndroidReport ? (
          <>
            {/* ANDROID LAYOUT TREE */}
            <Section title="Description" left={<AndroidAboutBlock app={leftApp} />} right={<AndroidAboutBlock app={rightApp} />} />
            <Section title="Icon" left={<AndroidIconContent app={leftApp} mainApp={rightApp} similarImages={leftSimilarImages} />} right={<AndroidIconContent app={rightApp} mainApp={leftApp} similarImages={rightSimilarImages} variant="competitor" />} />
            <Section title="Name" left={<AndroidNameBlock app={leftApp} competitorApp={rightApp} />} right={<AndroidNameCompetitorBlock app={rightApp} />} />
            <Section title="App Description" left={<AndroidDescriptionBlock app={leftApp} competitorApp={rightApp} />} right={<AndroidCompetitorsKeywordsBlock competitor={rightApp} variant="description" />} />
            <Section title="Content Images" left={<AndroidContentImagesBlock app={leftApp} />} right={<AndroidCompetitorsKeywordsBlock competitor={rightApp} variant="images" />} />
            <Section title="Content Videos" left={<AndroidContentVideoBlock app={leftApp} />} right={<AndroidContentVideoBlock app={rightApp} />} />
            <Section title="Review Analysis" left={<AndroidReviewBlock rating={leftApp.rating} />} right={<AndroidReviewBlock rating={rightApp.rating} />} />
            <Section title="App Store" left={<AndroidAppStoreBlock />} />
            <Section title="Size" left={<AndroidSizeBlock app={leftApp} />} />
            <Section title="App Information" left={<AndroidAppInfoBlock app={leftApp} />} right={<AndroidAppInfoBlock app={rightApp} />} />
            <Section title="Additional Information" left={<AndroidAdditionalInfoBlock app={leftApp} />} right={<AndroidAdditionalInfoBlock app={rightApp} />} />
            <Section title="Features" left={<AndroidFeaturesBlock app={leftApp} />} right={<AndroidFeaturesBlock app={rightApp} />} />
            <Section title="Futures" left={<AndroidFuturesBlock />} />
          </>
        ) : (
          <>
            {/* iOS LAYOUT TREE */}
            <Section title="Description" left={<IOSAboutBlock app={leftApp} />} right={<IOSAboutBlock app={rightApp} />} />
            <Section title="Icon" left={<IOSIconContent app={leftApp} mainApp={rightApp} />} right={<IOSIconContent app={rightApp} mainApp={leftApp} variant="competitor" />} />
            <Section title="Name" left={<IOSNameBlock app={leftApp} competitorApp={rightApp} />} right={<IOSNameCompetitorBlock app={rightApp} />} />
            <Section title="App Description" left={<IOSDescriptionBlock app={leftApp} competitorApp={rightApp} />} right={<IOSCompetitorsKeywordsBlock competitor={rightApp} variant="description" />} />
            <Section title="Content Images" left={<IOSContentImagesBlock app={leftApp} />} right={<IOSCompetitorsKeywordsBlock competitor={rightApp} variant="images" />} />
            <Section title="Content Videos" left={<IOSContentVideoBlock app={leftApp} />} right={<IOSContentVideoBlock app={rightApp} />} />
            <Section title="Review Analysis" left={<IOSReviewBlock rating={leftApp.rating} />} right={<IOSReviewBlock rating={rightApp.rating} />} />
            <Section title="App Store" left={<IOSAppStoreBlock />} />
            <Section title="Size" left={<IOSSizeBlock app={leftApp} />} />
            <Section title="App Information" left={<IOSAppInfoBlock app={leftApp} />} right={<IOSAppInfoBlock app={rightApp} variant="competitor" />} />
            <Section title="Additional Information" left={<IOSAdditionalInfoBlock app={leftApp} />} right={<IOSAdditionalInfoBlock app={rightApp} />} />
            <Section title="Features" left={<IOSFeaturesBlock app={leftApp} />} right={<IOSFeaturesBlock app={rightApp} />} />
            <Section title="Futures" left={<IOSFuturesBlock />} />
          </>
        )}
      </div>
      <CRFooter />
      <TestimonialPopup showPost={showPost} setShowPost={setShowPost} name={name} setName={setName} email={email} setEmail={setEmail} company={company} setCompany={setCompany} message={message} handlePost={handlePost} handleClosePopup={handleClosePopup} nameError={nameError} setNameError={setNameError} emailError={emailError} setEmailError={setEmailError} messageError={messageError} setMessageError={setMessageError} />
    </div>
  );
}
