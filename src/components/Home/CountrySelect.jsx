import { useState, useRef, useEffect } from "react";
import { countries } from "./countries";
import "./CountrySelect.css";
import arrowIcon from "../../assets/dropdown-icon.svg";

export default function CountrySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selected = countries.find(c => c.code === value) || countries[0];

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="country-select-wrapper" ref={wrapperRef}>
      <div
        className="country-select-trigger"
        onClick={() => setOpen(!open)}
      >
        <span
          className="flag-img"
          style={{ backgroundPositionY: `${selected.pos}px` }}
        />

        <img
          src={arrowIcon}
          alt="Open"
          className={`arrow-icon ${open ? "rotate" : ""}`}
        />
      </div>

      {open && (
        <ul className="country-dropdown">
          {countries.map((country, index) => (
            <li
              key={`${country.code}-${country.name}-${index}`}
              onClick={() => {
                onChange(country.code);
                setOpen(false);
              }}
            >
              <span
                className="flag-img"
                style={{ backgroundPositionY: `${country.pos}px` }}
              />
              <span className="name">{country.name}</span>
              <span className="dial">{country.dial}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
