import "./Contact.css";
import sendIcon from "../assets/send-icon.svg";
import addressIcon from "../assets/address1.svg";
import emailIcon from "../assets/email-icon.svg";

export default function Contact() {
  return (
    <div className="contact-block" id="contact-block">
      <div className="content-block">
        <div className="contact-section">

          <h3 className="heading">Contact</h3>

          <form>
            <div className="contact-form1 dis-flex">
              <div className="input-field contact-email">
                <input type="email" placeholder="Email*" />
              </div>

              <div className="input-field">
                <input type="text" placeholder="Message*" />
              </div>

              <button type="button" className="btn-send-contact">
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
