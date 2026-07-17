import React from "react";
import closeIcon from "../assets/close-btn.svg";
import uploadIcon from "../assets/upload-icon.svg";

const TestimonialPopup = ({
  showPost,
  name,
  setName,
  email,
  setEmail,
  company,
  setCompany,
  message,
  setMessage,
  fileName,
  setFileName,
  handlePost,
  handleClosePopup,
  nameError,
  setNameError,
  emailError,
  setEmailError,
  messageError,
  setMessageError,
}) => {
  if (!showPost) return null;

  return (
    <div
      className="post-testimonial-block"
      onClick={handleClosePopup}
    >
      <div
        className="testimonial-popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="post-header">
          <h3>Post Your Testimonials</h3>

          <button
            className="close-btn-post"
            onClick={handleClosePopup}
          >
            <img src={closeIcon} alt="" width="20" />
          </button>
        </div>

        <form className="form-horizontal" encType="multipart/form-data">
          <div className="post-body">
            <div className="form-in-post">
              <label className="label-name">Full Name*</label>

              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError?.("");
                }}
                className="form-field-post"
              />

              {nameError && (
                <div className="testimonial-error">{nameError}</div>
              )}
            </div>

            <div className="form-in-post">
              <label className="label-name">Email*</label>

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError?.("");
                }}
                className="form-field-post"
              />
              {emailError && (
                <div className="testimonial-error">{emailError}</div>
              )}
            </div>

            <div className="form-in-post">
              <label className="label-name">Company Name</label>

              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="form-field-post"
              />
            </div>

            <div className="upload-field">
              <label
                htmlFor="profile_pic"
                className="label-name custom-file-upload"
              >
                Upload Image
                <br />

                <img
                  src={uploadIcon}
                  className="mar-t-10"
                  alt=""
                />
              </label>

              <input
                type="file"
                id="profile_pic"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (!file) return;

                  setFileName(file.name);
                }}
              />

              {fileName && (
                <div className="upload-img-view">
                  <span className="custom-file-upload">
                    {fileName}
                  </span>
                </div>
              )}
            </div>

            <div className="form-in-post">
              <label className="label-name">Message*</label>

              <textarea
                cols="1"
                rows="3"
                name="yourMessage"
                id="yourMessage"
                maxLength={240}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setMessageError?.("");
                }}
                className="form-field-post"
              />
              {messageError && (
                <div className="testimonial-error">{messageError}</div>
              )}

              <div className="message-count">
                {message.length}/240
              </div>
            </div>

            <div className="text-center align-center-item">
              <button
                type="button"
                className="btn-default"
                onClick={handlePost}
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialPopup;
