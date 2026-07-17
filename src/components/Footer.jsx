import { useEffect } from "react";

import footerLogo from "../assets/logo-footer.svg";
import scrollArrow from "../assets/images/arrow-prev.svg";

import "./Footer.css";
import { appHashUrl } from "../utils/appUrl";

export default function Footer() {

  /* =========================
     SCROLL BUTTON
  ========================= */

  useEffect(() => {

    const handleScroll = () => {

      const btn =
        document.getElementById(
          "button-scroll-top"
        );

      if (!btn) return;

      if (window.scrollY > 300) {

        btn.classList.add(
          "show-scroll-top"
        );

      } else {

        btn.classList.remove(
          "show-scroll-top"
        );

      }

    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

  }, []);

  /* =========================
     SCROLL TO SECTION
  ========================= */

  const scrollToSection = (id) => {

    const section =
      document.getElementById(id);

    if (section) {

      section.scrollIntoView({
        behavior: "smooth",
      });

    }

  };

  /* =========================
     SCROLL TO TOP
  ========================= */

  const scrollToTop = (e) => {

    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  return (
    <>
    <section className="footer-section">
      <footer className="footer">

        <div className="footer-content-block">

          <ul className="dis-flex footer-list">

            <li>
              <button
                className="nav-link footer-btn"
                onClick={() =>
                  scrollToSection(
                    "banner-top"
                  )
                }
              >
                Home
              </button>
            </li>

            <li>
              <button
                className="nav-link footer-btn"
                onClick={() =>
                  scrollToSection(
                    "about-block"
                  )
                }
              >
                About us
              </button>
            </li>

            <li>
              <button
                className="nav-link footer-btn"
                onClick={() =>
                  scrollToSection(
                    "our-apps-blocks-scroll"
                  )
                }
              >
                Recomended Apps
              </button>
            </li>

            <li>
              <button
                className="nav-link footer-btn"
                onClick={() =>
                  scrollToSection(
                    "comments-block"
                  )
                }
              >
                Comments
              </button>
            </li>

            <li>
              <button
                className="nav-link footer-btn"
                onClick={() =>
                  scrollToSection(
                    "faq-block"
                  )
                }
              >
                FAQS
              </button>
            </li>

            <li>
              <button
                className="nav-link footer-btn"
                onClick={() =>
                  scrollToSection(
                    "contact-block"
                  )
                }
              >
                Contact
              </button>
            </li>

          </ul>

          <div className="dis-flex footer-bottom">

            <div className="footer-logo">

              <img
                src={footerLogo}
                alt="Footer Logo"
              />

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
                </a>

                {" "}©. All Rights Reserved.

              </p>

            </div>

          </div>

        </div>

      </footer>
     </section>
      {/* =========================
          SCROLL TOP BUTTON
      ========================= */}

      <a
        href={appHashUrl("/")}
        id="button-scroll-top"
        className="scroll-top"
        onClick={scrollToTop}
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
