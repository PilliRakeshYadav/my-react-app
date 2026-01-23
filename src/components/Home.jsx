import { useState } from "react";
import "./Home.css";
import CompareBox from "./CompareBox";

import bgImage from "../assets/compare-image.png";
import howItWorksImg from "../assets/how-it-works-icon.svg";
import androidImg from "../assets/android-icon.svg";
import iosImg from "../assets/ios-icon.svg";

import CountrySelect from "./CountrySelect";

export default function Home() {
  const [platform, setPlatform] = useState("android");
  const [country, setCountry] = useState("US");

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
        onClick={handleComingSoon}
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
              className={`platform-switch ${
                platform === "android" ? "android-active" : "ios-active"
              }`}
            >
              <button
                className={platform === "android" ? "active" : ""}
                onClick={() => setPlatform("android")}
                aria-label="Android"
              >
                <img src={androidImg} alt="Android" />
              </button>

              <button
                className={platform === "ios" ? "active" : ""}
                onClick={() => setPlatform("ios")}
                aria-label="iOS"
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
          <CompareBox />
        </div>

      </div> 
    </section>
  );
}
