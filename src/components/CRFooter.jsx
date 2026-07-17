import { useEffect } from "react";
import footerLogo from "../assets/logo-footer.svg";
import scrollArrow from "../assets/images/arrow-prev.svg";
import "./Footer.css";
import { appHashUrl } from "../utils/appUrl";

export default function CompareFooter() {

const openSection = (sectionId) => {

  const url =
    appHashUrl(`/scroll/${sectionId}`);

  window.open(
    url,
    "_blank"
  );

};

useEffect(() => {
  const handleScroll = () => {
    const btn = document.getElementById("button-scroll-top");

    if (!btn) return;

    if (window.scrollY > 300) {
      btn.classList.add("show-scroll-top");
    } else {
      btn.classList.remove("show-scroll-top");
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);
  return (
    <>
      <footer className="footer">
        <div className="footer-content-block">

          <ul className="dis-flex footer-list">

            <li>
              <button
                className="nav-link footer-btn"
                onClick={() => openSection("banner-top")}
              >
                Home
              </button>
            </li>

            <li>
              <button
                className="nav-link footer-btn"
                onClick={() => openSection("about-block")}
              >
                About us
              </button>
            </li>

            <li>
              <button
                className="nav-link footer-btn"
                onClick={() => openSection("our-apps-blocks-scroll")}
              >
                Recommended Apps
              </button>
            </li>

            <li>
              <button
                className="nav-link footer-btn"
                onClick={() => openSection("comments-block")}
              >
                Comments
              </button>
            </li>

            <li>
              <button
                className="nav-link footer-btn"
                onClick={() => openSection("faq-block")}
              >
                FAQs
              </button>
            </li>

            <li>
              <button
                className="nav-link footer-btn"
                onClick={() => openSection("contact-block")}
              >
                Contact
              </button>
            </li>

          </ul>

          <div className="dis-flex">

            <div className="footer-logo">
              <img src={footerLogo} alt="Footer Logo" />
            </div>

            <div className="footer-copyrights">
              <p className="pad-b-15">
                <a
                  href="http://unfoldlabs.com/"
                  className="nav-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  UnfoldLabs Inc
                </a>{" "}
                ©. All Rights Reserved.
              </p>
            </div>

          </div>
        </div>
      </footer>

      <a
        href={appHashUrl("/")}
        id="button-scroll-top"
        className="scroll-top"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <img
          src={scrollArrow}
          className="scroll-icon"
          alt="Scroll to top"
        />
      </a>
    </>
  );
}
