import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CompareBox.css";
import swapIcon from "../../assets/flip-arow-icon.svg";
import closeIcon from "../../assets/close-s.svg";

export default function CompareBox({
  platform,
  country
}) {
  const [app1, setApp1] = useState("");
  const [app2, setApp2] = useState("");

  const handleSwap = () => {
  setApp1(app2);
  setApp2(app1);
};

  const [errors, setErrors] = useState({
    app1: false,
    app2: false,
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const navigate = useNavigate();

  const showToast = (msg) => {
    setToast({ show: true, message: msg });

    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  const compareApps = (e) => {
    e.preventDefault();

    const newErrors = {
      app1: !app1.trim(),
      app2: !app2.trim(),
    };

    setErrors(newErrors);

    if (newErrors.app1 || newErrors.app2) return;

    if (app1.trim().toLowerCase() === app2.trim().toLowerCase()) {
      showToast("Both App Names should not be same.");
      return;
    }

    navigate(`/compare?app1=${encodeURIComponent(app1)}&app2=${encodeURIComponent(app2)}&platform=${platform}&country=${country}`);

  };

  return (
    <>
      {toast.show && (
        <div className="custom-toast toast-failure1">
          <p className="p-text-toast">
            <img src={closeIcon} width="25" alt="error" />
            <span>{toast.message}</span>
          </p>
        </div>
      )}

      <form className="compare-box" onSubmit={compareApps}>
        
        <div className="input-wrapper">
          <input
            name="appName"
            autoComplete="on"
            value={app1}
            onChange={(e) => {
              setApp1(e.target.value);
              setErrors((prev) => ({ ...prev, app1: false }));
            }}
            placeholder="Your App"
            className={errors.app1 ? "error-input" : ""}
          />

          {errors.app1 && (
            <span className="error-text">Enter Your App Name.</span>
          )}
        </div>

        <img src={swapIcon} className="swap-icon" alt="swap" onClick={handleSwap}/>

        <div className="input-wrapper">
          <input
            name="appName"
            autoComplete="on"
            value={app2}
            onChange={(e) => {
              setApp2(e.target.value);
              setErrors((prev) => ({ ...prev, app2: false }));
            }}
            placeholder="Competitor App"
            className={errors.app2 ? "error-input" : ""}
          />

          {errors.app2 && (
            <span className="error-text">
              Enter Competitor App Name.
            </span>
          )}
        </div>

        <button type="submit" className="compare-btn">
          Compare
        </button>
      </form>
    </>
  );
}