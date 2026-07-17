import { useState, useEffect, useRef } from "react";

import "./Header.css";

import logo from "../assets/appcurator-logo.svg";
import menuIcon from "../assets/menu.svg";

import { useNavigate } from "react-router-dom";

export default function Header() {

  const [open, setOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const menuRef = useRef(null);

  const navigate = useNavigate();

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
     SCROLL TO SECTION
  ========================= */

  const scrollToSection = (id) => {

    setOpen(false);

    navigate("/");

    setTimeout(() => {

      const el =
        document.getElementById(id);

      if (el) {

        el.scrollIntoView({
          behavior: "smooth",
        });

      }

    }, 400);

  };

  return (
    <>

      <header className="header">

        <img
          src={logo}
          className="app-logo"
          alt="logo"
          onClick={() => {
            window.location.reload();
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
              scrollToSection("banner-top")
            }
          >
            Home
          </li>

          <li
            onClick={() =>
              scrollToSection("about-block")
            }
          >
            About us
          </li>

          <li
            onClick={() =>
              scrollToSection(
                "our-apps-blocks-scroll"
              )
            }
          >
            Recommended Apps
          </li>

          <li
            onClick={() =>
              scrollToSection("comments-block")
            }
          >
            Comments
          </li>

          <li
            onClick={() =>
              scrollToSection("faq-block")
            }
          >
            FAQs
          </li>

          <li
            onClick={() =>
              scrollToSection("contact-block")
            }
          >
            Contact
          </li>

        </ul>

      </div>

    </>
  );
}
