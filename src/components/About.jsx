import "./About.css";
import whyImg from "../assets/why.svg";
import curatorImg from "../assets/app-curator.svg";
import doesImg from "../assets/does.svg";

export default function About() {
  return (
    <section className="about-section" id="about-block">
      <div className="content-block">
        <p className="sub-heading text-center">About</p>
        <h3 className="heading text-center">AppCurator</h3>

        <div className="about-content">
          <div className="content-in">
            <div className="icon-wrap">
              <img src={whyImg} alt="Why ASO" className="icons-about1" />
            </div>
            <h3 className="about-heading1 text-center">
              Why <span>ASO?</span>
            </h3>
            <p>
             App Store Optimization (ASO), like search engine
							optimization (SEO) for websites, is used to improve the
							visibility of mobile applications on Google Play and Apple App
							Stores. Better ASO increases your organic installs through higher
							keyword rankings and app ratings.
            </p>
          </div>

          <div className="content-in">
            <div className="icon-wrap">
              <img src={curatorImg} alt="Why AppCurator" className="icons-about1" />
            </div>
            <h3 className="about-heading1 text-center">
              Why <span>Use AppCurator?</span>
            </h3>
            <p>
              AppCurator helps optimize mobile applications as per the
							App Store standards. Suggestions will be provided to improve
							quality of your app comparing with the competitors. Review
							analysis will give your current rating and let you know the
							tactics to improve app ranking and performance in the search
							results.
            </p>
          </div>

          <div className="content-in">
            <div className="icon-wrap">
              <img src={doesImg} alt="What AppCurator Does" className="icons-about1" />
            </div>
            <h3 className="about-heading1 text-center">
              What <span>Does AppCurator Do?</span>
            </h3>
            <p>
              AppCurator helps app developers with implementing the best
							tactics to rank high on app stores. App size, logo improvements,
							content optimization, etc. will be provided as per the store
							standards for better ranking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
