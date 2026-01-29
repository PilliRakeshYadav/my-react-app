import "./Contact.css";
import sendIcon from "../assets/send-icon.svg";
import addressIcon from "../assets/address1.svg";
import emailIcon from "../assets/email-icon.svg";
import { useState } from "react";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required.");
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError("Enter Valid Email.");
      return;
    }

    // If validation passes, proceed with form submission
    setEmailError("");
    
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", { email, message });
    
    // Reset form
    setEmail("");
    setMessage("");
    setIsSubmitted(false);
    
    // Show success message or redirect
    alert("Message sent successfully!");
  };

  const handleBlur = () => {
    // Only validate on blur if email has been entered
    if (email && !validateEmail(email)) {
      setEmailError("Enter Valid Email.");
    }
  };

  return (
    <div className="contact-block" id="contact-block">
      <div className="content-block">
        <div className="contact-section">

          <h3 className="heading">Contact</h3>

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
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
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
              <p>support@unfoldlabs.com</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}