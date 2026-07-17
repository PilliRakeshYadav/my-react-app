import {
  Page,
  Text,
  Document,
  Image,
  View,
  StyleSheet
} from "@react-pdf/renderer";
import styles from "./styles";
import coverImage from "../assets/pdfimages/appcurator-high.png";
import logo from "../assets/pdfimages/appcurator-logo1.png";
import circleImg from "../assets/pdfimages/circle-img.png";
import additionalInfoIcon from "../assets/pdficons/additional-info-icon.png";
import appDescriptionIcon from "../assets/pdficons/app-description-icon.png";
import appIcon from "../assets/pdficons/app-icon.PNG";
import appNameIcon from "../assets/pdficons/app-name-icon.png";
import appSizeIcon from "../assets/pdficons/appsize-icon.png";
import appStoreIcon from "../assets/pdficons/appstore-icon.png";
import appUpdatesIcon from "../assets/pdficons/appupdates-icon.png";
import competitorFeatureIcon from "../assets/pdficons/competitor-feature-icon.png";
import contentImagesIcon from "../assets/pdficons/content-images-icon.png";
import contentVideoIcon from "../assets/pdficons/content-video-icon.png";
import featuresIcon from "../assets/pdficons/features-icon.png";
import reviewAnalysisIcon from "../assets/pdficons/review-analysis-icon.png";
import topKeywordsIcon from "../assets/pdficons/top-keywords-icon.png";

import star5 from "../assets/pdfimages/stars-5.png";
import star4 from "../assets/pdfimages/stars-4.png";
import star3 from "../assets/pdfimages/stars-3.png";
import star2 from "../assets/pdfimages/stars-2.png";
import star1 from "../assets/pdfimages/stars-1.png";
import star0 from "../assets/pdfimages/stars-0.png";


export default function ReportPDF({ data }) {
  const left = data?.leftApp || {};
  const right = data?.rightApp || {};

  const isAndroid =
    String(
      data?.platform ||
      left.platform ||
      left.platformType
    )
      .toLowerCase()
      .includes("android");

  const safe = (v, d = "N/A") => v ?? d;

  const getRatingImage = (rating) => {
    const r = parseFloat(rating || 0);

    if (r >= 4.5) return star5;
    if (r >= 3.5) return star4;
    if (r >= 2.5) return star3;
    if (r >= 1.5) return star2;
    if (r >= 0.5) return star1;

    return star0;
  };
  const Header = () => (
    <View fixed style={styles.header}>
      {/* LEFT LOGO */}
      <Image src={logo} style={styles.headerLogo} />

      {/* RIGHT CIRCLE WITH NUMBER */}
      <View style={styles.headerCircle}>
        <Image src={circleImg} style={styles.headerCircleImg} />
        <Text style={styles.headerPageNumber}
          render={({ pageNumber }) =>
            pageNumber === 1 ? "" : `${pageNumber - 1}`
          }
        />
      </View>
    </View>
  );

  const Footer = () => (
    <View fixed style={styles.footer}>
      <Text>UnfoldLabs Inc. © 2026. All Rights Reserved</Text>
      <Text>www.unfoldlabs.com</Text>
    </View>
  );

  const getAppName = (app) =>
    app?.trackName ||
    app?.appName ||
    app?.title ||
    app?.name ||
    "N/A";

  const getDeveloper = (app) =>
    app?.sellerName ||
    app?.seller ||
    app?.artistName ||
    "N/A";

  const getIcon = (app) =>
    app?.artworkUrl100 ||
    app?.artworkUrl512 ||
    app?.icon ||
    app?.appIcon ||
    "";

  const getRating = (app) =>
    app?.averageUserRating ||
    app?.rating ||
    0;

  const getDescription = (app) =>
    app?.description ||
    app?.appDescription ||
    app?.fullDescription ||
    "";

  const getScreenshots = (app) =>
    app?.screenshotUrls ||
    app?.screenshots ||
    app?.contentImagesArray ||
    [];

  const storeName =
  isAndroid
    ? "Google Play"
    : "App Store";

  return (
    <Document>
      {/* PAGE 1 */}
      <Page size="A4">
        <Image src={coverImage} style={styles.fullPageImage} />
      </Page>

      {/* PAGE 2 */}
      <Page size="A4" style={styles.page}>
        <Header />
        <Footer />

        {/* DATE */}
        <Text style={styles.dateText}>
          Generated Date : {new Date().toLocaleDateString()}
        </Text>

        {(() => {
          const safeImg = (url) =>
            url && url.startsWith("http")
              ? url
              : "https://via.placeholder.com/100";

          return (
            <>
              {/* APP HEADER */}
              <View style={styles.appHeader}>
                {/* <Image src={safeImg(left.artworkUrl100)} style={styles.appIcon} />
                <View style={styles.appHeaderText}>
                  <Text style={styles.appTitle}>{safe(left.trackName)}</Text>
                  <Text>{safe(left.sellerName)}</Text>
                  <Text>Date Not Available.</Text>
                </View> */}
                <Image
                  src={safeImg(getIcon(left))}
                  style={styles.appIcon}
                />

                <Text style={styles.appTitle}>
                  {getAppName(left)}
                </Text>

                <Text>
                  {getDeveloper(left)}
                </Text>
              </View>

              {/* TABLE */}
              <View style={styles.table}>
                {/* ROW 1 */}
                <View style={styles.tableRow}>
                  <View style={styles.tableCellLeft}>
                    <Text>
                      <Text style={styles.orangeText}>
                        Mobile OS :
                      </Text>
                      {isAndroid ? "Android" : "iOS"}
                    </Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text>
                      <Text style={styles.orangeText}>Location :</Text> United States
                    </Text>
                  </View>
                </View>

                {/* ROW 2 */}
                <View style={styles.tableRowBorderTop}>
                  <View style={styles.tableCellLeft}>
                    <Text>
                      <Text style={styles.orangeText}>Language :</Text> English
                    </Text>
                  </View>
                  <View style={styles.tableCellRight}>
                    <Text>
                      <Text style={styles.orangeText}>Competitor App :</Text>{" "}
                      {getAppName(right)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* SECTION TITLE */}
              <View style={styles.sectionHeaderRow}>
                <Image src={appIcon} style={styles.sectionIcon} />
                <Text style={styles.sectionHeader}>APP ICON</Text>
              </View>
              <View style={styles.divider} />

              {/* PIXEL SIZE */}
              <View style={styles.row}>
                <Text style={styles.label}>Pixel Size</Text>
                <Text style={styles.value}>
                  The icon for your Application looks good, but does not meet {storeName}
                  specifications. {storeName} recommends that the icon be 512 x 512 pixels.
                  {"\n\n"}
                  http://iconhandbook.co.uk/reference/chart/android/
                </Text>
              </View>

              {/* SIMILARITY */}
              <View style={styles.row}>
                <Text style={styles.label}>Similarity to other images</Text>
                <Text style={styles.value}>
                  The icon for your Application looks good, but looks very similar to
                  some other icons. We recommend you change your icons for better
                  branding.
                </Text>
              </View>

              {/* COMPETITION */}
              <View style={styles.row}>
                <Text style={styles.label}>Similarity to Competition</Text>
                <Text style={styles.value}>
                  The icon for your Application looks good, but looks very similar to
                  icons of competitive applications. Suggest making changes.
                  {"\n\n"}
                  Here is your App Icon and competitor icon.
                </Text>
              </View>
              <View style={styles.divider} />

              {/* ICON COMPARISON */}
              <View style={styles.iconComparison}>
                <View style={styles.iconBlock}>
                  <Image src={safeImg(getIcon(left))} style={styles.iconImage} />
                  <Text style={styles.orangeText}>App Icon</Text>
                </View>
                <View style={styles.iconBlock}>
                  <Image src={safeImg(getIcon(right))} style={styles.iconImage} />
                  <Text style={styles.orangeText}>Competitor App Icon</Text>
                </View>
              </View>
              <View style={styles.divider} />

              {/* FINAL NOTE */}
              <View style={styles.row}>
                <Text style={styles.label}>Blurry, not clear</Text>
                <Text style={styles.value}>
                  The icon for your Application looks crisp and clear. Excellent work
                  by your development team.
                </Text>
              </View>
            </>
          );
        })()}
      </Page>


      {/* PAGE 3: APP NAME */}
      <Page size="A4" style={styles.page}>
        <Header />
        <Footer />

        <View style={styles.sectionHeaderRow}>
          <Image src={appNameIcon} style={styles.sectionIcon} />
          <Text style={styles.sectionHeader}>APP NAME</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Character Count</Text>
          <Text style={styles.value}>
            The name of your Application is good, but it could be better. You could
            use more characters. Consider that relevant keywords in the title could
            increase your rank in the {storeName} store.
          </Text>
        </View>
        <View style={styles.subDivider} />

        <View style={styles.row}>
          <Text style={styles.label}>Common Words</Text>
          <Text style={styles.value}>
            Your Application has 2 words and most of them are unique. That is good
            for ASO. Good work by your team.
          </Text>
        </View>
        <View style={styles.subDivider} />

        <View style={styles.row}>
          <Text style={styles.label}>Repetitive Words</Text>
          <Text style={styles.value}>
            No repeated Words in your Aapplication  excellent work by your team in
            making sure that you have a good choice of words. This will help you in
            your ASO. Good Luck.
          </Text>
        </View>
        <View style={styles.subDivider} />

        <View style={styles.row}>
          <Text style={styles.label}>Competitors</Text>
          <Text style={styles.value}>
            Here are the top words used by the competitive Applications That you
            used in your App.
            We suggest that you use some of these important words in your app
            name so that it brings in better ASO for your application.
          </Text>
        </View>
      </Page>

      {/* PAGE 4: APP DESCRIPTION */}
      <Page size="A4" style={styles.page}>
        <Header />
        <Footer />

        <View style={styles.sectionHeaderRow}>
          <Image src={appDescriptionIcon} style={styles.sectionIcon} />
          <Text style={styles.sectionHeader}>APP DESCRIPTION</Text>
        </View>
        <View style={styles.divider} />

        {/* Character Count */}
        <View style={styles.row}>
          <Text style={styles.label}>Character Count</Text>
          <Text style={styles.value}>
            {(() => {
              const desc = getDescription(left);
              const charCount = desc.length;
              if (!charCount) return "No description available.";
              return `The ideal character count for the Application description is 2000–4000 characters. Your App Description has ${charCount} characters.`;
            })()}
          </Text>
        </View>
        <View style={styles.subDivider} />

        {/* Common Words */}
        <View style={styles.row}>
          <Text style={styles.label}>Common Words</Text>
          <Text style={styles.value}>
            {(() => {
              const desc = getDescription(left);
              const words = desc.split(/\s+/).filter(Boolean);
              if (!words.length) return "No words found in description.";
              return `Your Application has ${words.length} words in the App Description and most of them are unique. That is good for ASO. Good work by your team.`;
            })()}
          </Text>
        </View>
        <View style={styles.subDivider} />

        {/* Repetitive Words */}
        <View style={styles.row}>
          <Text style={styles.label}>Repetitive Words</Text>
          <Text style={styles.value}>
            {(() => {
              const desc = getDescription(left);
              const words = desc.toLowerCase().split(/\s+/).filter(Boolean);
              const counts = words.reduce((acc, w) => {
                acc[w] = (acc[w] || 0) + 1;
                return acc;
              }, {});
              const repeated = Object.entries(counts).filter(([_, c]) => c > 1);
              if (!repeated.length) {
                return "Your Application description does not have any words repeated — excellent work by your team in making sure that you have a better choice of words. This will help you in your ASO. Good Luck.";
              }
              return "Your Application description has some repeated words. Consider revising for better ASO.";
            })()}
          </Text>
        </View>
        <View style={styles.subDivider} />

        {/* Competitors */}
        <View style={styles.row}>
          <Text style={styles.label}>Competitors</Text>
          <Text style={styles.value}>
            {safe(right.description)
              ? "Here are the top words used by the competitive Applications that you used in your App. We suggest that you use some of these important words in your App Description so that it brings in better ASO for your Application."
              : "No competitor description available."}
          </Text>
        </View>
      </Page>



      {/* PAGE 5: CONTENT IMAGES */}
      <Page size="A4" style={styles.page}>
        <Header />
        <Footer />

        <View style={styles.sectionHeaderRow}>
          <Image src={contentImagesIcon} style={styles.sectionIcon} />
          <Text style={styles.sectionHeader}>CONTENT IMAGES</Text>
        </View>
        <View style={styles.divider} />

        {/* Number of Images */}
        <View style={styles.row}>
          <Text style={styles.label}>Number of Images</Text>
          <Text style={styles.value}>
            {(() => {
              const count =
                getScreenshots(left).length;
              const needed = 8;
              if (!count) return "No images available on the App Store.";
              if (count < needed) {
                return `${storeName} can take ${needed} images to be displayed and your application has only ${count} images available on the App Store. We recommend that you add ${needed - count} more images so that it meets the {storeName} recommendations.`;
              }
              return `${storeName} can take ${needed} images to be displayed and your application has ${count} images available — meeting the {storeName} recommendations.`;
            })()}
          </Text>
        </View>
        <View style={styles.subDivider} />

        {/* Image Blurry */}
        <View style={styles.row}>
          <Text style={styles.label}>Image Blurry</Text>
          <Text style={styles.value}>
            All the images that were uploaded by your team on the App Store are crisp and clear. Excellent work by your graphics team.
          </Text>
        </View>
        <View style={styles.subDivider} />

        {/* Images Not Recommended Size */}
        <View style={styles.row}>
          <Text style={styles.label}>Images Not Recommended Size</Text>
          <Text style={styles.value}>
            {(() => {
              const count =
                getScreenshots(left).length;
              return `{storeName} recommends that images are 512 x 512 pixels. You have ${count} images on {storeName} and all of them meet the {storeName} image criteria.`;
            })()}
          </Text>
        </View>
      </Page>


      {/* PAGE 6: CONTENT VIDEO */}
      <Page size="A4" style={styles.page}>
        <Header />
        <Footer />

        <View style={styles.sectionHeaderRow}>
          <Image src={contentVideoIcon} style={styles.sectionIcon} />
          <Text style={styles.sectionHeader}>CONTENT VIDEO</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Videos</Text>
          <Text style={styles.value}>
            According to a report  having a video on {storeName} raises the chances that
            your App will be visible for better ASO. We suggest that you add a video
            to the App store.
          </Text>
        </View>
      </Page>


      {/* PAGE 7: REVIEW ANALYSIS */}

      <Page size="A4" style={styles.page}>
        <Header />
        <Footer />

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Image src={reviewAnalysisIcon} style={styles.sectionIcon} />
          <Text style={styles.sectionHeader}>REVIEW ANALYSIS</Text>
        </View>
        <View style={styles.divider} />

        {/* App Information */}
        <Text style={styles.orangeText}>App Information:</Text>

        {/* Ratings */}
        <View style={styles.row}>
          <Text style={styles.label}>Ratings</Text>
          <View style={styles.valueBlock}>
            <Text>Your current rating is {getRating(left)}</Text>
            <Text>
              {getRating(left) >= 4
                ? "Your App is doing great in terms of rating. Please continue to keep the App with high quality and a great customer experience."
                : "Your App rating could be improved. Consider enhancing customer experience and UI/UX."}
            </Text>
            <View style={styles.ratingRow}>
              {getRatingImage(getRating(left)) && (
                <Image
                  src={getRatingImage(getRating(left))}
                  style={styles.ratingImage}
                />
              )}
              <Text style={styles.ratingValue}>{safe(getRating(left))}</Text>
            </View>
          </View>
        </View>
        <View style={styles.subDivider} />

        {/* No. of Ratings */}
        <View style={styles.row}>
          <Text style={styles.label}>No.of Ratings</Text>
          <View style={styles.valueBlock}>
            <Text>Your App has 5★ ratings - 3</Text>
            <Text>Your App has 4★ ratings - 3</Text>
            <Text>Your App has 1★ ratings - 3</Text>
            <Text>
              Based on this, you’re doing {getRating(left) >= 4.5 ? "great" : getRating(left) >= 3.5 ? "good" : "not very good"}.
              Positive customer reviews are a great way to increase your ratings. Consider implementing some of our suggestions to increase your ranking and visibility.
            </Text>
          </View>
        </View>

        {/* Competitor App Information */}
        <Text style={styles.orangeText}>Competitor App Information:</Text>

        {/* Ratings */}
        <View style={styles.row}>
          <Text style={styles.label}>Ratings</Text>
          <View style={styles.valueBlock}>
            <Text>Your current rating is {safe(getRating(right))}</Text>
            <Text>
              {getRating(right) >= 4
                ? "Competitor app is doing great in terms of rating. They are maintaining quality and customer experience."
                : "Competitor app performance is average. This gives you an opportunity to stand out with better UI/UX and customer satisfaction."}
            </Text>
            <View style={styles.ratingRow}>
              {getRatingImage(getRating(right)) && (
                <Image
                  src={getRatingImage(getRating(right))}
                  style={styles.ratingImage}
                />
              )}
              <Text style={styles.ratingValue}>{safe(getRating(right))}</Text>
            </View>
          </View>
        </View>
        <View style={styles.subDivider} />

        {/* No. of Ratings */}
        <View style={styles.row}>
          <Text style={styles.label}>No.of Ratings</Text>
          <View style={styles.valueBlock}>
            <Text>Competitor App has 5★ ratings - 3</Text>
            <Text>Competitor App has 4★ ratings - 3</Text>
            <Text>Competitor App has 1★ ratings - 3</Text>
            <Text>
              Based on this, they are doing {getRating(right) >= 4.5 ? "great" : getRating(right) >= 3.5 ? "good" : "not very good"}.
              Positive customer reviews are a great way to increase their ratings. You can use this insight to improve your own app’s ranking and visibility.
            </Text>
          </View>
        </View>
      </Page>

      {/* PAGE 8: APP STORE DISTRIBUTION */}
      <Page size="A4" style={styles.page}>
        <Header />
        <Footer />

        <View style={styles.sectionHeaderRow}>
          <Image src={appStoreIcon} style={styles.sectionIcon} />
          <Text style={styles.sectionHeader}>APP STORE DISTRIBUTION</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>App Store</Text>
          <View style={styles.valueBlock}>
            <Text>Your Application is available in the following App stores:</Text>
            <Text>o App Store</Text>
            <Text>You should consider placing your App in alternative app stores such as:</Text>
            <Text>o Google Play Store</Text>
            <Text>o Amazon</Text>
            <Text>o Nexva</Text>
            <Text>o Galaxy Apps</Text>
          </View>
        </View>
      </Page>


      {/* PAGE 9: SIZE & PRICE */}

      <Page size="A4" style={styles.page}>
        <Header />
        <Footer />

        <View style={styles.sectionHeaderRow}>
          <Image src={appSizeIcon} style={styles.sectionIcon} />
          <Text style={styles.sectionHeader}>SIZE</Text>
        </View>
        <View style={styles.divider} />

        {/* Size */}
        <View style={styles.row}>
          <Text style={styles.label}>Size</Text>
          <Text style={styles.value}>
            {left.fileSizeBytes
              ? `The size of your App is ${(left.fileSizeBytes / (1024 * 1024)).toFixed(0)} MB. Try to keep your App as small as possible (under 100MB) to allow users to download them on cellular networks.`
              : "No size information available."}
          </Text>
        </View>
        <View style={styles.subDivider} />

        {/* Price */}
        <View style={styles.row}>
          <Text style={styles.label}>Price</Text>
          <Text style={styles.value}>
            {left.price === 0
              ? "Your App is Free. So, do not insert too many ads inside your App. Users hate to see ads, even if the App is free."
              : `Your App costs ${left.formattedPrice}. Make sure the pricing is justified by the features and user experience.`}
          </Text>
        </View>
        <View style={styles.subDivider} />

        {/* In-App Payments */}
        <View style={styles.row}>
          <Text style={styles.label}>In-Apps Payments</Text>
          <Text style={styles.value}>
            {left.hasInAppPurchases ? "Your App includes In-App Purchases. Ensure they are fair and transparent to maintain user trust." : "Not Applicable"}
          </Text>
        </View>
      </Page>

      {/* PAGE 10: APP UPDATES */}
      <Page size="A4" style={styles.page}>
        <Header />
        <Footer />

        <View style={styles.sectionHeaderRow}>
          <Image src={appUpdatesIcon} style={styles.sectionIcon} />
          <Text style={styles.sectionHeader}>APP UPDATES</Text>
        </View>
        <View style={styles.divider} />

        {/* App Information */}
        <Text style={styles.orangeText}>App Information:</Text>

        {/* Version */}
        <View style={styles.row}>
          <Text style={styles.label}>Version</Text>
          <View style={styles.valueBlock}>
            <Text>
              Current Version is: {safe(left.version)}, it was released on{" "}
              {left.currentVersionReleaseDate
                ? new Date(left.currentVersionReleaseDate).toLocaleDateString()
                : "N/A"}
            </Text>
            <Text>
              Your App was last updated on {storeName} on{" "}
              {left.currentVersionReleaseDate
                ? new Date(left.currentVersionReleaseDate).toLocaleDateString()
                : "N/A"}.
            </Text>
            <Text>
              Based on a report, Apps on {storeName} are recommended to be updated every
              3–5 weeks to keep them current and vibrant. Suggest you keep your app
              current.
            </Text>
            <Text>
              Your competitive App {getAppName(right)} was last updated on{" "}
              {right.currentVersionReleaseDate
                ? new Date(right.currentVersionReleaseDate).toLocaleDateString()
                : "N/A"} — for you to stay competitive make sure you are on top of
              your competition.
            </Text>
          </View>
        </View>
        <View style={styles.subDivider} />

        {/* What's New */}
        <View style={styles.row}>
          <Text style={styles.label}>Whats New</Text>
          <View style={styles.valueBlock}>
            <Text>Not Applicable.</Text>
          </View>
        </View>

        {/* Competitor App Information */}
        <Text style={styles.orangeText}>Competitor App Information:</Text>

        {/* Version */}
        <View style={styles.row}>
          <Text style={styles.label}>Version</Text>
          <View style={styles.valueBlock}>
            <Text>
              Current Version is: {safe(right.version)}, it was released on{" "}
              {right.currentVersionReleaseDate
                ? new Date(right.currentVersionReleaseDate).toLocaleDateString()
                : "N/A"}
            </Text>
            <Text>
              Your App was last updated on {storeName} on{" "}
              {right.currentVersionReleaseDate
                ? new Date(right.currentVersionReleaseDate).toLocaleDateString()
                : "N/A"}.
            </Text>
            <Text>
              Based on a report, Apps on {storeName} are recommended to be updated every
              3–5 weeks to keep them current and vibrant. Suggest you keep your app
              current.
            </Text>
            <Text>
              Your competitive App {getAppName(right)} was last updated on{" "}
              {right.currentVersionReleaseDate
                ? new Date(right.currentVersionReleaseDate).toLocaleDateString()
                : "N/A"} — for you to stay competitive make sure you are on top of
              your competition.
            </Text>
          </View>
        </View>
        <View style={styles.subDivider} />

        {/* What's New */}
        <View style={styles.row}>
          <Text style={styles.label}>Whats New</Text>
          <View style={styles.valueBlock}>
            <Text>Not Applicable.</Text>
          </View>
        </View>
      </Page>



      {/* PAGE 11: ADDITIONAL INFORMATION */}
      <Page size="A4" style={styles.page}>
        <Header />
        <Footer />

        <View style={styles.sectionHeaderRow}>
          <Image src={additionalInfoIcon} style={styles.sectionIcon} />
          <Text style={styles.sectionHeader}>ADDITIONAL INFORMATION</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>App Information</Text>
          <View style={styles.valueBlock}>
            <Text>App Downloads : {safe(left.userRatingCount || "N/A")}</Text>
            <Text>Content Rating : {safe(left.contentAdvisoryRating || "12+")}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Competitor App Information</Text>
          <View style={styles.valueBlock}>
            <Text>App Downloads : {safe(right.userRatingCount || "N/A")}</Text>
            <Text>Content Rating : {safe(right.contentAdvisoryRating || "12+")}</Text>
          </View>
        </View>
      </Page>


      {/* PAGE 12: COMPETITOR FEATURES */}
      <Page size="A4" style={styles.page}>
        <Header />
        <Footer />

        <View style={styles.sectionHeaderRow}>
          <Image src={competitorFeatureIcon} style={styles.sectionIcon} />
          <Text style={styles.sectionHeader}>COMPETITOR FEATURES</Text>
        </View>
        <View style={styles.divider} />

        {/* App Information */}
        <Text style={styles.orangeText}>App Information:</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Features</Text>
          <View style={styles.valueBlock}>
            <Text>{safe(left.description)}</Text>
          </View>
        </View>
        <View style={styles.subDivider} />

        {/* Competitor App Information */}
        <Text style={styles.orangeText}>Competitor App Information:</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Features</Text>
          <View style={styles.valueBlock}>
            <Text>{safe(right.description)}</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 13: FUTURES */}

      <Page size="A4" style={styles.page}>
        <Header />
        <Footer />

        <View style={styles.sectionHeaderRow}>
          <Image src={featuresIcon} style={styles.sectionIcon} />
          <Text style={styles.sectionHeader}>FUTURES</Text>
        </View>
        <View style={styles.divider} />

        {/* Languages */}
        <View style={styles.row}>
          <Text style={styles.label}>Languages</Text>
          <Text style={styles.value}>
            {left.languageCodesISO2A && left.languageCodesISO2A.length > 1
              ? `Your App currently supports ${left.languageCodesISO2A.length} languages (${left.languageCodesISO2A.join(", ")}). Translating your App into more languages helps expand your reach. Consider adding Spanish, French, Hindi, Arabic, etc.`
              : "Your App currently supports only one language. Translating your App into other languages helps expand your reach."}
          </Text>
        </View>
        <View style={styles.subDivider} />

        {/* In-App Advertising */}
        <View style={styles.row}>
          <Text style={styles.label}>In-App Advertising?</Text>
          <View style={styles.valueBlock}>
            <Text>Is there a way to identify how many ads are displayed?</Text>
            <Text>• Too many — Annoying</Text>
            <Text>• Too few — No revenue generated</Text>
          </View>
        </View>
        <View style={styles.subDivider} />

        {/* Monetization */}
        <View style={styles.row}>
          <Text style={styles.label}>Monetization</Text>
          <View style={styles.valueBlock}>
            {left.hasInAppPurchases
              ? <Text>Your App includes In-App Purchases. Ensure they are fair and transparent to maintain user trust.</Text>
              : <Text>No In-App Purchases detected. Consider monetization strategies to stay competitive.</Text>}
            <Text>Possible competitor strategies:</Text>
            <Text>• Ads?</Text>
            <Text>• Premium?</Text>
            <Text>• Freemium?</Text>
          </View>
        </View>
      </Page>

    </Document>
  );
}
