import { useState } from "react";
import "./home-section.css";
import CompareBox from "./CompareBox";
import videoIcon from "../../assets/video-icon-2.svg";
import closeBtn from "../../assets/close-btn.svg";
import bgImage from "../../assets/compare-image.png";
import howItWorksImg from "../../assets/how-it-works-icon.svg";
import androidImg from "../../assets/android-icon.svg";
import iosImg from "../../assets/ios-icon.svg";
import CountrySelect from "./CountrySelect";

export default function Home() {
  const [platform, setPlatform] = useState("android");
  const [country, setCountry] = useState("US");
  const [showNewImage, setShowNewImage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleComingSoon = () => {
    alert("Coming Soon");
  };

  return (
    <section className="home-section" id="top">
      <div className="center-content">

        <div className="hero-row">
          <div className="hero-text">
            <h1 className="main-title">
              <span className="line-1">Platform for App Developers to</span>
              <span className="line-2">Improve Downloads & Ranking</span>
              <span className="dis-block">Appification. Simplified. Successfully</span>
            </h1>


            <div className="how-it-works dis-flex item-center">
              <p className="how-it-works-p">How Does It Work?</p>

              <img
                src={howItWorksImg}
                alt="How it works"
                className="how-image"
                onClick={() => setShowPopup(true)}
                style={{ cursor: "pointer" }}
              />

            </div>
          </div>



          <img
            src={bgImage}
            alt="visual"
            className="compare-image"
          />
        </div>


        <div className="compare-wrapper">


          <div className="platform-bar">


            <div
              className={`platform-switch ${platform === "android"
                  ? "android-active"
                  : "ios-active"
                }`}
              onClick={() =>
                setPlatform(
                  platform === "android"
                    ? "ios"
                    : "android"
                )
              }
            >

              <button
                className={platform === "android" ? "active" : ""}
                aria-label="Android"
                type="button"
              >
                <img src={androidImg} alt="Android" />
              </button>

              <button
                className={platform === "ios" ? "active" : ""}
                aria-label="iOS"
                type="button"
              >
                <img src={iosImg} alt="iOS" />
              </button>

            </div>


            <CountrySelect
              value={country}
              onChange={setCountry}
            />

          </div>  <br></br>
          <br></br>
          <CompareBox platform={platform} country={country} />
        </div>

      </div>

      {showPopup && (
        <div className="popup-section popup-block">

          <div
            className="back-drop-close"
            onClick={() => setShowPopup(false)}
          ></div>

          <div className="content-coming-soon">

            <button
              className="close-btn-all"
              onClick={() => setShowPopup(false)}
            >
              <img src={closeBtn} alt="close" width="20" />
            </button>

            <div className="content-img-coming-soon">
              <img src={videoIcon} alt="coming soon" />
              <h3 className="coming-soon-text">Coming Soon!</h3>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
