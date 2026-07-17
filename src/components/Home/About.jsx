import "./About.css";
import whyImg from "../../assets/why.svg";
import curatorImg from "../../assets/app-curator.svg";
import doesImg from "../../assets/does.svg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function About() {
  const aboutData = [
    {
      img: whyImg,
      title: "Why",
      span: "ASO?",
      text: `App Store Optimization (ASO), like search engine
      optimization (SEO) for websites, is used to improve the
      visibility of mobile applications on Google Play and Apple App
      Stores. Better ASO increases your organic installs through higher
      keyword rankings and app ratings.`,
    },
    {
      img: curatorImg,
      title: "Why",
      span: "Use AppCurator?",
      text: `AppCurator helps optimize mobile applications as per the
      App Store standards. Suggestions will be provided to improve
      quality of your app comparing with the competitors. Review
      analysis will give your current rating and let you know the
      tactics to improve app ranking and performance in the search
      results.`,
    },
    {
      img: doesImg,
      title: "What",
      span: "Does AppCurator Do?",
      text: `AppCurator helps app developers with implementing the best
      tactics to rank high on app stores. App size, logo improvements,
      content optimization, etc. will be provided as per the store
      standards for better ranking.`,
    },
  ];

  return (
    <section className="about-section" id="about-block">
      <div className="about-content-block">
        <p className="sub-heading text-center">About</p>
        <h3 className="heading text-center">AppCurator</h3>

        {/* Desktop View */}
        <div className="about-content desktop-about">
          {aboutData.map((item, index) => (
            <div className="content-in" key={index}>
              <div className="icon-wrap">
                <img
                  src={item.img}
                  alt={item.span}
                  className="icons-about1"
                />
              </div>

              <h3 className="about-heading1 text-center">
                {item.title} <span>{item.span}</span>
              </h3>

              <p>{item.text}</p>
            </div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="mobile-about-slider">
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={1}
            spaceBetween={20}
            navigation
            pagination={{ clickable: true }}
          >
            {aboutData.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="about-content">
                  <div className="content-in">
                    <div className="icon-wrap">
                      <img
                        src={item.img}
                        alt={item.span}
                        className="icons-about1"
                      />
                    </div>

                    <h3 className="about-heading1 text-center">
                      {item.title} <span>{item.span}</span>
                    </h3>

                    <p>{item.text}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}