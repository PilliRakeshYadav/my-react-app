import { useState } from "react";
import "./OurApps.css";
import arrowIcon from "../assets/images/arrow-prev.svg";

/* LOGOS */
import securemeLogo from "../assets/images/secureme-logo.svg";
import ufallalertLogo from "../assets/images/ufallalert-logo.svg";
import unfoldquotesLogo from "../assets/images/unfoldquotes.svg";
import distancedLogo from "../assets/images/distanced.svg";
import applockLogo from "../assets/images/2020applock.svg";
import kaptureLogo from "../assets/images/kapture-logo.svg";
import reqorderLogo from "../assets/images/reqorder-logo.png";
import myfamilyLogo from "../assets/images/myfamily-logo.svg";
import walletLogo from "../assets/images/2020wallet-logo.png";
import redgreenLogo from "../assets/images/red-green-logo.png";

/* SCREENS */
import securemeScreen from "../assets/images/secureme-screen.png";
import ufallScreen from "../assets/images/ufall-alert-screen.png";
import unfoldquotesScreen from "../assets/images/unfoldquotes-screen.png";
import distancedScreen from "../assets/images/distanced-screen.png";
import kaptureScreen from "../assets/images/kapture-screen.png";
import reqorderScreen from "../assets/images/reqorder-screen.png";
import myfamilyScreen from "../assets/images/myfamily-screen.png";
import walletScreen from "../assets/images/2020wallet-screen.png";
import redgreenScreen from "../assets/images/red-green-screen.png";

const apps = [
  {
    name: "MySecureME",
    link: "https://www.mysecureme.com/",
    logo: securemeLogo,
    screen: securemeScreen,
    desc:
      "Protect Enterprise Network, Secure Your Devices. Mobile device management for businesses."
  },
  {
    name: "uFallAlert",
    link: "https://unfoldlabs.com/ufallalert/",
    logo: ufallalertLogo,
    screen: ufallScreen,
    desc:
      "Innovative solution for people at risk of falling, especially elders and workers."
  },
  {
    name: "unfoldQuotes",
    link: "https://unfoldlabs.com/unfoldquotes/",
    logo: unfoldquotesLogo,
    screen: unfoldquotesScreen,
    desc:
      "Inspirational quotes to motivate and guide your everyday life."
  },
  {
    name: "DistanceD",
    link: "http://unfoldlabs.com/distanced-landing-page/",
    logo: distancedLogo,
    screen: distancedScreen,
    desc:
      "Monitor and track people based on distance and send alerts when required."
  },
  {
    name: "SecureME",
    link: "http://unfoldlabs.com/SecureMe/index.html",
    logo: securemeLogo,
    screen: securemeScreen,
    desc:
      "Restrict device access to only allowed applications for businesses."
  },
  {
    name: "2020AppLock",
    link: "http://unfoldlabs.com/2020AppLock/index.html",
    logo: applockLogo,
    screen: securemeScreen,
    desc:
      "Privacy-focused app lock solution for Android devices."
  },
  {
    name: "Kapture",
    link: "#",
    logo: kaptureLogo,
    screen: kaptureScreen,
    desc:
      "API-driven knowledge management platform with analytics and security."
  },
  {
    name: "ReQorder",
    link: "https://www.reqorder.net/",
    logo: reqorderLogo,
    screen: reqorderScreen,
    desc:
      "Screen-recording platform for demos, presentations, and co-browsing."
  },
  {
    name: "MyFamily",
    link: "https://myfamily.unfoldlabs.com/",
    logo: myfamilyLogo,
    screen: myfamilyScreen,
    desc:
      "Digital parenting platform to protect families from online threats."
  },
  {
    name: "2020Wallet",
    link: "http://unfoldlabs.com/2020Wallet/index.html",
    logo: walletLogo,
    screen: walletScreen,
    desc:
      "Securely store cards and documents protected by a PIN."
  },
  {
    name: "RedGreen",
    link: "http://unfoldlabs.com/redgreen/index.html",
    logo: redgreenLogo,
    screen: redgreenScreen,
    desc:
      "Android optimizer to boost device speed and memory."
  }
];

export default function OurApps() {
  const [active, setActive] = useState(0);

  const next = () =>
    setActive((prev) => (prev + 1) % apps.length);

  const prev = () =>
    setActive((prev) => (prev - 1 + apps.length) % apps.length);

  return (
    <div className="our-apps-blocks" id="our-apps-blocks-scroll">
      <div className="content-block">

        {/* HEADING */}
        <div className="our-apps-heading">
          <p className="sub-heading">Our</p>
          <h3 className="heading">Apps</h3>
        </div>

        {/* MAIN DISPLAY */}
        <div className="app-main">

          <div className="app-left">
            <img
              src={apps[active].logo}
              className="main-logo"
              alt={apps[active].name}
            />
            <h4>{apps[active].name}</h4>
            <p>{apps[active].desc}</p>
          </div>

          <div className="app-right">
            <img
              src={apps[active].screen}
              className="main-screen"
              alt={apps[active].name}
            />
          </div>

        </div>

        {/* ICON STRIP */}
        <div className="icon-strip">
          {apps.map((app, index) => (
            <div
              key={app.name}
              className={`icon-card ${index === active ? "active" : ""}`}
              onClick={() => setActive(index)}
            >
              <img src={app.logo} alt={app.name} />
              <span>{app.name}</span>
            </div>
          ))}
        </div>

        {/* IMAGE ARROWS */}
        <div className="arrow-controls">

          <button className="arrow-btn" onClick={prev}>
            <img
              src={arrowIcon}
              className="arrow left"
              alt="Previous"
            />
          </button>

          <button className="arrow-btn" onClick={next}>
            <img
              src={arrowIcon}
              className="arrow right"
              alt="Next"
            />
          </button>

        </div>

      </div>
    </div>
  );
}
