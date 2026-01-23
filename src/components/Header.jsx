import { useState, useEffect } from "react";
import "./Header.css";
import logo from "../assets/appcurator-logo.svg";
import menuIcon from "../assets/menu.svg";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
  if (darkMode) {
    document.body.classList.add("dark");
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.body.classList.remove("dark");
    document.documentElement.setAttribute("data-theme", "light");
  }
}, [darkMode]);

useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);


  const scrollToSection = (id) => {
    setOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <header className="header">
        <img src={logo} className="app-logo" alt="logo" />

        <div className="header-actions">
          <button
            className={`dark-mode-button ${darkMode ? "dark-active" : ""}`}
            onClick={() => setDarkMode(!darkMode)}
          />

          <img
            src={menuIcon}
            className="menu-icon"
            alt="menu"
            onClick={() => setOpen(true)}
          />
        </div>
      </header>

      {open && <div className="backdrop-top" onClick={() => setOpen(false)} />}

      <div className={`menu-block ${open ? "show-menu" : ""}`}>
        <ul className="nav-list">
          <center>Menu</center>
          <li onClick={() => scrollToSection("top")}>Home</li>
          <li onClick={() => scrollToSection("about")}>About us</li>
          <li onClick={() => scrollToSection("recomended apps")}>Recomended Apps</li>
          <li onClick={() => scrollToSection("comments")}>Comments</li>
          <li onClick={() => scrollToSection("faq")}>FAQs</li>
          <li onClick={() => scrollToSection("contact")}>Contact</li>
        </ul>
      </div>
    </>
  );
}
