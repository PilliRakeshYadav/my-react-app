import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import TestimonialPopup from "../TestimonialPopup";
import userIcon from "../../assets/user-icon-default.svg";
import "./Comments.css";

export default function Comments() {
  const [showPost, setShowPost] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [testimonials, setTestimonials] = useState([]);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const res = await fetch("https://dev.unfoldlabs.com/AppCurator_api/getTestimonials");
        const result = await res.json();
        if (result.status && result.data) {
          setTestimonials(result.data);
        } else {
          console.error("Failed to load testimonials:", result.message);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      }
    };
    loadTestimonials();
  }, []);

  const handlePost = async () => {

    setNameError("");
    setEmailError("");
    setMessageError("");

    // Full Name validation
    if (!name.trim()) {
      setNameError("Enter the full name");
      return;
    }

    // Email validation
    if (!email.trim()) {
      setEmailError("Enter the email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }

    // Message validation
    if (!message.trim()) {
      setMessageError("Enter the message");
      return;
    }

    // Build JSON input
    const jsonInput = JSON.stringify({
      fullName: name,
      email: email,
      companyName: company,
      message: message
    });

    // Build FormData
    const formData = new FormData();
    if (fileName) {
      formData.append("file", document.getElementById("profile_pic").files[0]);
    }
    formData.append("jsonInput", jsonInput);

    try {
      const res = await fetch("https://dev.unfoldlabs.com/AppCurator_api/saveTestimonials", {
        method: "POST",
        body: formData
      });

      const result = await res.json();
      if (result.statusCode === 200) {
        // reload testimonials after successful save
        const updated = await fetch("https://dev.unfoldlabs.com/AppCurator_api/getTestimonials");
        const updatedResult = await updated.json();
        if (updatedResult.status && updatedResult.data) {
          setTestimonials(updatedResult.data);
        }

        // reset form
        setName("");
        setEmail("");
        setCompany("");
        setMessage("");
        setFileName("");
        setShowPost(false);
      } else {
        console.error("Failed to post testimonial:", result.message);
      }
    } catch (err) {
      console.error("Error posting testimonial:", err);
    }
  };
  const handleClosePopup = () => {
    setShowPost(false);

    setName("");
    setEmail("");
    setCompany("");
    setMessage("");
    setFileName("");

    setNameError("");
    setEmailError("");
    setMessageError("");
  };
const groupedTestimonials = [];

for (let i = 0; i < testimonials.length; i += 3) {
  groupedTestimonials.push(testimonials.slice(i, i + 3));
}
  return (
    <div className="container-block sections test-block" id="comments-block">
      <div className="comments-content-block">
        <div className="testimonials-block">
          <p className="comment-sub-heading">What people</p>
          <h3 className="comment-heading">say about</h3>

          <button className="post-testimonials-index" onClick={() => setShowPost(true)}>
            Post Testimonials
          </button>

          {testimonials.length > 0 ? (

            <Swiper
  modules={[Pagination, Autoplay]}
  loop={true}
  autoplay={{
    delay: 5000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  }}
  pagination={{
    clickable: true,
  }}
  spaceBetween={15}
>
  {groupedTestimonials.map((group, groupIndex) => (
    <SwiperSlide key={groupIndex}>
      <div className="testimonial-group">
        {group.map((item, i) => (
          <div className="testimonial-col" key={i}>
            <div className="in-testimonials">
              <div className="img-test">
                <div className="overflow-hidden">
                  <img
                    src={item.imageUrl || userIcon}
                    className="testimonial-image"
                    alt=""
                  />
                  <span className="blur-1"></span>
                  <img
                    src={item.imageUrl || userIcon}
                    className="testimonial-blur-image"
                    alt=""
                  />
                </div>
              </div>

              <h5 className="testimonial-title">
                {item.fullName}
              </h5>

              <p className="testimonial-message">
                {item.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SwiperSlide>
  ))}
</Swiper>

          ) : (
            <p>No testimonials yet.</p>
          )}
        </div>
      </div>

      <TestimonialPopup
        showPost={showPost}
        setShowPost={setShowPost}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        company={company}
        setCompany={setCompany}
        message={message}
        setMessage={setMessage}
        fileName={fileName}
        setFileName={setFileName}
        handlePost={handlePost}
        handleClosePopup={handleClosePopup}
        nameError={nameError}
        setNameError={setNameError}
        emailError={emailError}
        setEmailError={setEmailError}
        messageError={messageError}
        setMessageError={setMessageError}
      />
    </div>
  );
}
