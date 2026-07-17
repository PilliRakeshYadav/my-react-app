import { useState, useRef, useEffect } from "react";
import "./OurApps.css";
import arrowIcon from "../../assets/images/arrow-prev.svg";

/* LOGOS */
import mysecuremeLogo from "../../assets/images/mysecureme-logo.svg";
import securemeLogo from "../../assets/images/secureme-logo.svg";
import ufallalertLogo from "../../assets/images/ufallalert-logo.svg";
import unfoldquotesLogo from "../../assets/images/unfoldquotes.svg";
import distancedLogo from "../../assets/images/distanced.svg";
import applockLogo from "../../assets/images/2020applock.svg";
// import kaptureLogo from "../../assets/images/kapture-logo.svg";
import reqorderLogo from "../../assets/images/reqorder-logo.png";
import myfamilyLogo from "../../assets/images/myfamily-logo.svg";
import walletLogo from "../../assets/images/2020wallet-logo.png";
import oshaLogo from "../../assets/images/logo-osha-digital.svg";
import cumulusAILogo from "../../assets/images/logo-cumulusai.svg";
import kidsecureLogo from "../../assets/images/logo-kidsecure.svg";

/* SCREENS */
import mysecuremeScreen from "../../assets/images/mysecureme-screen.png";
import securemeScreen from "../../assets/images/secureme-screen.png";
import ufallScreen from "../../assets/images/ufall-alert-screen.png";
import unfoldquotesScreen from "../../assets/images/unfoldquotes-screen.png";
import distancedScreen from "../../assets/images/distanced-screen.png";
import appLockScreen from "../../assets/images/2020applock-screen.png";
// import kaptureScreen from "../../assets/images/kapture-screen.png";
import reqorderScreen from "../../assets/images/reqorder-screen.png";
import myfamilyScreen from "../../assets/images/myfamily-screen.png";
import walletScreen from "../../assets/images/2020wallet-screen.png";
import redgreenScreen from "../../assets/images/red-green-screen.png";

const apps = [
  {
    name: "MySecureME",
    link: "https://www.mysecureme.com/kiosk/index.html",
    logo: mysecuremeLogo,
    screen: mysecuremeScreen,
    bgClass: "mysecureme-bg",
    desc:
      "MySecureME - Protect Enterprise Network, Secure Your Devices. It makes mobile device management accessible and affordable for small and medium sized businesses."
  },

  {
    name: "uFallAlert",
    link: "https://unfoldlabs.com/ufallalert/",
    logo: ufallalertLogo,
    screen: ufallScreen,
    bgClass: "ufallalert-bg",
    desc:
      "Protect your family and anyone else you care about. It’s an Innovative solution for the people who are at risk of falling, especially elders, bikers, miners, construction workers, etc."
  },

  {
    name: "unfoldQuotes",
    link: "https://unfoldlabs.com/unfoldquotes/",
    logo: unfoldquotesLogo,
    screen: unfoldquotesScreen,
    bgClass: "uflquotes-bg",
    desc:
      "Quotes help us to get inspired, motivated, and guide our approach to handling things around us. They help us to perceive life with a wider perspective."
  },

  {
    name: "DistanceD",
    link: "http://unfoldlabs.com/distanced-landing-page/",
    logo: distancedLogo,
    screen: distancedScreen,
    bgClass: "distanced-bg",
    desc:
      "Monitor and track family/friends/colleagues/employees/others based on their distance and contact them immediately when required (alerts, emergency, help and information)."
  },

  {
    name: "SecureME",
    link: "https://unfoldlabs.com/secureme/index.html",
    logo: securemeLogo,
    screen: securemeScreen,
    bgClass: "secureme-bg",
    desc:
      "SecureME - An android application that allows businesses to restrict users access to only allowed applications on a device."
  },

  {
    name: "2020AppLock",
    link: "http://unfoldlabs.com/2020AppLock/index.html",
    logo: applockLogo,
    screen: appLockScreen,
    bgClass: "applock-bg",
    desc:
      "This app makes it easy to lock and unlock apps – it’s the ultimate solution for privacy on Android devices."
  },

  // {
  //   name: "Kapture",
  //   link: "#",
  //   logo: kaptureLogo,
  //   screen: kaptureScreen,
  //   bgClass: "kapture-bg",
  //   desc:
  //     "Kapture is an innovative and powerful API-driven knowledge management platform with advanced content management, search engine, security, and analytics."
  // },

  {
    name: "ReQorder",
    link: "https://www.reqorder.net/",
    logo: reqorderLogo,
    screen: reqorderScreen,
    bgClass: "reqorder-bg",
    desc:
      "ReQorder is a screen-recording software platform that allows users to record virtually anything: co-browsing sessions, demos, presentations, or even chat conversations."
  },

  {
    name: "MyFamily",
    link: "https://myfamily.unfoldlabs.com/",
    logo: myfamilyLogo,
    screen: myfamilyScreen,
    bgClass: "myfamily-bg",
    desc:
      "MyFamily is an innovative digital parenting platform to protect your family from online threats and make them safe and secure. It allows you to supervise, manage, monitor, and control online activities."
  },

  {
    name: "2020Wallet",
    link: "http://unfoldlabs.com/2020Wallet/index.html",
    logo: walletLogo,
    screen: walletScreen,
    bgClass: "wallet-bg",
    desc:
      "2020Wallet's My DataManager allows you to save all your data in one place. Save your cards (debit, credit) and documents (doc, docx, jpeg, png, txt, pdf, xlsx, xls) with a PIN."
  },

  {
    name: "OSHA Digital",
    link: "https://unfoldlabs.com/oshadigital/",
    logo: oshaLogo,
    screen: redgreenScreen,
    bgClass: "red-green-bg",
    desc:
      "RedGreen – Easy-to-use Android optimizer. Helps manage applications on devices. Speeds up your device and boosts memory."
  },

  {
    name: "CumulusAI",
    link: "https://unfoldlabs.com/cumulus-ai.html",
    logo: cumulusAILogo,
    screen: redgreenScreen,
    bgClass: "red-green-bg",
    desc:
      "RedGreen – Easy-to-use Android optimizer. Helps manage applications on devices. Speeds up your device and boosts memory."
  },

  {
    name: "KidSecure",
    link: "https://kidsecure.app/",
    logo: kidsecureLogo,
    screen: redgreenScreen,
    bgClass: "red-green-bg",
    desc:
      "RedGreen – Easy-to-use Android optimizer. Helps manage applications on devices. Speeds up your device and boosts memory."
  }
];

const SLIDE_GAP = 121;
const VISIBLE_THUMBS = 9;

export default function OurApps() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeThumb, setActiveThumb] = useState(0);
  const [slideWidth, setSlideWidth] = useState(1140);
  const viewportRef = useRef(null);
  const [thumbPosition, setThumbPosition] = useState(0);

  useEffect(() => {
    const updateSlideWidth = () => {
      if (!viewportRef.current) return;
      const width = viewportRef.current.clientWidth;
      if (width > 0) setSlideWidth(width);
    };

    updateSlideWidth();
    window.addEventListener("resize", updateSlideWidth);

    let observer;
    if (typeof ResizeObserver !== "undefined" && viewportRef.current) {
      observer = new ResizeObserver(updateSlideWidth);
      observer.observe(viewportRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateSlideWidth);
      observer?.disconnect();
    };
  }, []);

   useEffect(() => {
  const maxStart = Math.max(
    apps.length - VISIBLE_THUMBS,
    0
  );

  let startIndex;

  // First 4 icons
  if (activeThumb <= 3) {
    startIndex = 0;
  }

  // Last 4 icons
  else if (activeThumb >= apps.length - 5) {
    startIndex = maxStart;
  }

  // Middle icons
  else {
    startIndex = activeThumb - 3;
  }

  setThumbPosition(startIndex);

}, [activeThumb]);

const thumbOffset = thumbPosition * SLIDE_GAP;

const next = () => {

  setThumbPosition(prev => {

    const max =
      apps.length - VISIBLE_THUMBS;

    return prev >= max
      ? 0
      : prev + 1;

  });

};

 const prev = () => {

  setThumbPosition(prev => {

    const max =
      apps.length - VISIBLE_THUMBS;

    return prev <= 0
      ? max
      : prev - 1;

  });

};

  return (
    <section className="our-apps-section">
      <div
        className="content-block our-apps-blocks"
        id="our-apps-blocks-scroll"
      >

        <div
          id="main"
          role="main"
          className="our-app-slider"
        >

          <section className="slider">

            {/* MAIN SLIDER */}
            <div
              id="slider2"
              className="flexslider position-relative"
            >

              <div className="our-apps-heading1">
                <p className="sub-heading">Our</p>
                <h3 className="our-apps-heading">Apps</h3>
              </div>

              <div
                className="flex-viewport main-slider-viewport"
                ref={viewportRef}
              >

                <ul
                  className="slides slide-contents"
                  style={{
                    width: `${apps.length * slideWidth}px`,
                    transform: `translate3d(-${activeSlide * slideWidth}px,0,0)`,
                    transition: "transform 0.6s ease"
                  }}
                >

                  {apps.map((app, index) => (

                    <li
                      key={app.name}
                      className={`slide-product-listing ${activeSlide === index
                        ? "flex-active-slide"
                        : ""
                        }`}
                    >

                      <div className="dis-flex text-image-product-2">
                        <span className="mobile-back-blur" aria-hidden="true" />

                        {/* LEFT */}
                        <div className="image-product">

                          <a
                            href={app.link}
                            className="product-main-links"
                            target="_blank"
                            rel="noreferrer"
                          >

                            <span
                              className={`product-desc-bg ${app.bgClass}`}
                            ></span>

                            <span className="product-logo-blur">

                              <img
                                src={app.logo}
                                className="products-slide-logo"
                                draggable="false"
                                alt=""
                              />

                            </span>

                          </a>

                          <p className="product-screen-title">
                            {app.name}
                          </p>

                          <p className="product-screen-desc">
                            {app.desc}
                          </p>

                        </div>

                        {/* RIGHT */}
                        <div className="screen-product">

                          <img
                            src={app.screen}
                            className="screen-product-img"
                            draggable="false"
                            alt=""
                          />

                        </div>

                      </div>

                    </li>

                  ))}

                </ul>

              </div>




            </div>

            {/* BOTTOM CAROUSEL */}
            <div id="carousel2" className="flexslider">

              <div className="flex-viewport">

                <ul
                  className="slides slider-links-bottom"
                  style={{
                    width: `${apps.length * SLIDE_GAP}px`,
                    transform: `translate3d(-${thumbOffset}px,0px,0px)`,
                    transition: "transform 0.45s ease"
                  }}
                >

                  {apps.map((app, index) => (

                    <li
                      key={app.name}
                      className={`product-listing ${activeThumb === index
                        ? "flex-active-slide"
                        : ""
                        }`}
                      onClick={() => {
                        setActiveThumb(index);
                        setActiveSlide(index);
                      }}
                    >

                      <a
                        href={app.link}
                        target="_blank"
                        rel="noreferrer"
                        className="product-listing-link"
                        onClick={(e) => e.preventDefault()}
                      >

                        <span
                          className={`${app.bgClass} product-bg-list`}
                        ></span>

                        <span className="bg-blur-product-list">

                          <img
                            src={app.logo}
                            width="50"
                            className="product-img-list"
                            draggable="false"
                            alt=""
                          />

                        </span>

                        <span className="product-title-list">
                          {app.name}
                        </span>

                      </a>

                    </li>

                  ))}

                </ul>

              </div>

            </div>
            <div className="bottom-arrow-controls">

              <button
                className="bottom-arrow-btn"
                onClick={prev}
              >
                <img src={arrowIcon} alt="" />
              </button>

              <button
                className="bottom-arrow-btn"
                onClick={next}
              >
                <img
                  src={arrowIcon}
                  className="right-arrow"
                  alt=""
                />
              </button>

            </div>
          </section>

        </div>

      </div>
    </section>
  );
}