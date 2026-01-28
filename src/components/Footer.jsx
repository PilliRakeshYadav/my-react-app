import { useEffect } from "react";
import footerLogo from "../assets/logo-footer.svg";
import scrollArrow from "../assets/images/arrow-prev.svg";
import "./Footer.css";


export default function Footer() {
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sendAnalytics = (name) => {
    console.log("Analytics:", name);
  };

  return (
    <>
      {/* Anchor target */}
      <div id="top" />

      <footer className="footer">
        <div className="content-block">
          <ul className="dis-flex footer-list">
            <li><a href="#banner-top" className="nav-link" onClick={() => sendAnalytics("home")}>Home</a></li>
            <li><a href="#about-block" className="nav-link" onClick={() => sendAnalytics("aboutUs")}>About us</a></li>
            <li><a href="#our-apps-blocks-scroll" className="nav-link" onClick={() => sendAnalytics("recApps")}>Recomended Apps</a></li>
            <li><a href="#comments-block" className="nav-link" onClick={() => sendAnalytics("comments")}>Comments</a></li>
            <li><a href="#faq-block" className="nav-link" onClick={() => sendAnalytics("faqs")}>FAQS</a></li>
            <li><a href="#contact-block" className="nav-link" onClick={() => sendAnalytics("contact")}>Contact</a></li>
          </ul>

          <div className="dis-flex">
            <div className="footer-logo">
              <img src={footerLogo} alt="Footer Logo" />
            </div>

            <div className="footer-copyrights">
              <p className="pad-b-15">
                <a href="http://unfoldlabs.com/" className="nav-link" target="_blank" rel="noreferrer">
                  UnfoldLabs Inc
                </a>{" "}
                ©. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

     {/* Scroll To Top Button */}
<a
  href="#top"
  id="button-scroll-top"
  className="show-scroll-top"
  onClick={scrollToTop}
  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
>
  <img src={scrollArrow} className="scroll-icon" alt="Scroll to top" />
</a>
    </>
  );
}
