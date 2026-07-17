import "./Contact.css";
import sendIcon from "../../assets/send-icon.svg";
import addressIcon from "../../assets/address1.svg";
import emailIcon from "../../assets/email-icon.svg";
import { useState } from "react";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) setEmailError("");
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    if (messageError) setMessageError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Validate email
    if (!email.trim()) {
      setEmailError("Enter an email.");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Enter valid email.");
      return;
    }

    // Validate message
    if (!message.trim()) {
      setMessageError("Enter the message.");
      return;
    }

    // Clear errors if all good
    setEmailError("");
    setMessageError("");

    try {
      // Example POST API call
      const res = await fetch("https://dev.unfoldlabs.com/AppCator_api/saveContact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message })
      });

      const result = await res.json();
      if (result.statusCode === 200) {
        alert("Message sent successfully!");
        setEmail("");
        setMessage("");
        setIsSubmitted(false);
      } else {
        alert("Failed to send: " + result.message);
      }
    } catch (err) {
      console.error("Error sending contact:", err);
      alert("Error sending message. Please try again.");
    }
  };

  const handleBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError("Enter valid email.");
    }
  };

  return (
    <section className="contact-wrapper" id="contact-block">
     <div className="contact-block">
      <div className="contact-content-block">
        <div className="contact-section">
          <h3 className="contact-heading">Contact</h3>

          <form onSubmit={handleSubmit}>
            <div className="contact-form1 dis-flex">
              <div className="input-field contact-email">
                <input
                  type="email"
                  name="emailId"
                  id="emailId1"
                  placeholder="Email*"
                  maxLength="60"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleBlur}
                />
                {emailError && (
                  <small className="validations-app errorMsg">{emailError}</small>
                )}
              </div>

              <div className="input-field">
                <input
                  type="text"
                  placeholder="Message*"
                  value={message}
                  onChange={handleMessageChange}
                />
                {messageError && (
                  <small className="validations-app errorMsg">{messageError}</small>
                )}
              </div>

              <button type="submit" className="btn-send-contact">
                <img src={sendIcon} alt="Send" />
              </button>
            </div>
          </form>

          <div className="contact-details gap-40 dis-flex">
            <div className="in-contact">
              <img src={addressIcon} alt="" />
              <p>
                16855 West Bernardo Drive #300 <br />
                San Diego – CA 92127
              </p>
            </div>
            <div className="in-contact">
              <img src={emailIcon} alt="" />
              <a href="mailto:support@unfoldlabs.com" className="nav-link">
                <p>support@unfoldlabs.com</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}
