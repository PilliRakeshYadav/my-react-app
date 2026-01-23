import "./CompareBox.css";
import swapIcon from "../assets/flip-arow-icon.svg";

export default function CompareBox() {
  return (
    <div className="compare-box">
      <input type="text" placeholder="Your App" />
      <img
        src={swapIcon}
        alt="Swap"
        className="swap-icon"
      />
      <input type="text" placeholder="Competitor App" />
      <button className="compare-btn">Compare</button>
    </div>
  );
}
