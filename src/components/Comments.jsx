import { useState } from "react";
import userIcon from "../assets/user-icon-default.svg";
import closeIcon from "../assets/close-btn.svg";
import uploadIcon from "../assets/upload-icon.svg";
import "./Comments.css";

export default function Comments() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showPost, setShowPost] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [fileName, setFileName] = useState("");

  // ALL testimonials
  const testimonials = [
    { name: "Rakesh Pilli", text: "hiii all" },
    { name: "Roger", text: "Great application to compare stuff!! Very handy..." },
    { name: "Nicholas", text: "The platform is super easy to use..." },
    { name: "David", text: "A quick and effective solution..." },
    { name: "Alex", text: "Really useful and easy to understand." },
    { name: "Maria", text: "Clean UI and smooth experience." }
  ];

  // Split into groups of 3
  const slides = [];
  for (let i = 0; i < testimonials.length; i += 3) {
    slides.push(testimonials.slice(i, i + 3));
  }

  return (
    <div className="container-block sections test-block" id="comments-block">
      <div className="content-block">
        <div className="testimonials-block">

          <p className="sub-heading">What people</p>
          <h3 className="heading">say about</h3>

          <button
            className="post-testimonials-index"
            onClick={() => setShowPost(true)}
          >
            Post Testimonials
          </button>

          {/* SLIDER */}
          <div className="slidera">
            <div className="flex-viewport">
              <ul className="slides">
                {slides.map((group, index) => (
                  <li
                    key={index}
                    className={`slide ${
                      index === activeSlide ? "flex-active-slide" : ""
                    }`}
                  >
                    <div className="testimonials">
                      {group.map((item, i) => (
                        <Testimonial
                          key={i}
                          name={item.name}
                          text={item.text}
                        />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* DOTS */}
          <ul className="slick-dots">
            {slides.map((_, index) => (
              <li
                key={index}
                className={activeSlide === index ? "slick-active" : ""}
              >
                <button onClick={() => setActiveSlide(index)} />
              </li>
            ))}
          </ul>

        </div>
      </div>

      {/* POST TESTIMONIAL MODAL */}
      {showPost && (
        <div
          className="post-testimonial-block"
          onClick={() => setShowPost(false)}
        >
          <div
            className="testimonial-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="post-header">
              <h3>Post Your Testimonials</h3>
              <button
                className="close-btn-post"
                onClick={() => setShowPost(false)}
              >
                <img src={closeIcon} alt="" width="20" />
              </button>
            </div>

            <form className="form-horizontal">
              <div className="post-body">

                <div className="form-in-post">
                  <label className="label-name">Full Name*</label>
                  <input type="text" className="form-field-post" maxLength={60} />
                </div>

                <div className="form-in-post">
                  <label className="label-name">Email*</label>
                  <input type="email" className="form-field-post" maxLength={60} />
                </div>

                <div className="form-in-post">
                  <label className="label-name">Company Name</label>
                  <input type="text" className="form-field-post" maxLength={60} />
                </div>

                {/* IMAGE UPLOAD */}
                <div className="form-in-post dis-flex gap-30">
                  <label
                    htmlFor="profile_pic"
                    className="label-name custom-file-upload"
                  >
                    Upload Image<br />
                    <img src={uploadIcon} className="mar-t-10" alt="" />
                  </label>

                  <input
                    type="file"
                    id="profile_pic"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setPreviewImg(URL.createObjectURL(file));
                        setFileName(file.name);
                      }
                    }}
                  />

                  {previewImg && (
                    <div className="upload-img-view">
                      <img
                        src={previewImg}
                        alt=""
                        className="profile-pic-1"
                      />
                      <span className="custom-file-upload">{fileName}</span>
                    </div>
                  )}
                </div>

                <div className="form-in-post">
                  <label className="label-name">Message*</label>
                  <textarea
                    rows="3"
                    className="form-field-post"
                    maxLength={240}
                  />
                </div>

                <div className="text-center align-center-item">
                  <button type="button" className="btn-default">
                    Post
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Testimonial({ name, text }) {
  return (
    <div className="in-testimonials">
      <div className="img-test">
        <div className="overflow-hidden">
          <img src={userIcon} className="testimonial-image" alt="" />
          <span className="blur-1"></span>
          <img src={userIcon} className="testimonial-blur-image" alt="" />
        </div>
      </div>
      <h5 className="testimonial-title">{name}</h5>
      <p className="testimonial-content">{text}</p>
    </div>
  );
}
