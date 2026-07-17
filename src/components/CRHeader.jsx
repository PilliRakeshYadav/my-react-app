import { useState, useEffect, useRef } from "react";

import "./Header.css";

import logo from "../assets/appcurator-logo.svg";
import menuIcon from "../assets/menu.svg";
import { appHashUrl } from "../utils/appUrl";

export default function CRHeader() {

  const [open, setOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const menuRef = useRef(null);

  /* =========================
     APPLY DARK MODE
  ========================= */

  useEffect(() => {

    if (darkMode) {

      document.body.classList.add("dark");

      document.body.setAttribute(
        "data-theme",
        "dark"
      );

      localStorage.setItem("theme", "dark");

    } else {

      document.body.classList.remove("dark");

      document.body.setAttribute(
        "data-theme",
        "light"
      );

      localStorage.setItem("theme", "light");

    }

  }, [darkMode]);

  /* =========================
     CLOSE MENU OUTSIDE CLICK
  ========================= */

  useEffect(() => {

    const handleClick = (e) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {

        setOpen(false);

      }

    };

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClick
      );

    };

  }, []);

  /* =========================
     OPEN MAIN WEBSITE SECTION
  ========================= */

const openSection = (sectionId) => {

  setOpen(false);

  const url =
    appHashUrl(`/scroll/${sectionId}`);

  window.open(
    url,
    "_blank"
  );

};
  return (
    <>

      <header className="header">

        <img
          src={logo}
          className="app-logo"
          alt="logo"
          onClick={() => {

            window.location.href =
              appHashUrl("/");

          }}
        />

        <div className="header-actions">

          <button
            className={`dark-mode-button ${
              darkMode
                ? "dark-active"
                : ""
            }`}
            onClick={() =>
              setDarkMode(!darkMode)
            }
          />

          <img
            src={menuIcon}
            className="menu-icon"
            alt="menu"
            onClick={() => setOpen(true)}
          />

        </div>

      </header>

      {open && (

        <div
          className="backdrop-top"
          onClick={() => setOpen(false)}
        />

      )}

      <div
        ref={menuRef}
        className={`menu-block ${
          open ? "show-menu" : ""
        }`}
      >

        <ul className="nav-list">

          <center>Menu</center>

          <li
            onClick={() =>
              openSection("banner-top")
            }
          >
            Home
          </li>

          <li
            onClick={() =>
              openSection("about-block")
            }
          >
            About us
          </li>

          <li
            onClick={() =>
              openSection(
                "our-apps-blocks-scroll"
              )
            }
          >
            Recommended Apps
          </li>

          <li
            onClick={() =>
              openSection("comments-block")
            }
          >
            Comments
          </li>

          <li
            onClick={() =>
              openSection("faq-block")
            }
          >
            FAQs
          </li>

          <li
            onClick={() =>
              openSection("contact-block")
            }
          >
            Contact
          </li>

        </ul>

      </div>

    </>
  );
}
