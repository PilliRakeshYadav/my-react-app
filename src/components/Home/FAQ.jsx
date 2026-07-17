import { useState } from "react";
import "./FAQ.css";

const FAQ_DATA = {
  appcurator: [
    {
      q: "How is AppCurator helpful?",
      a: "Benchmark your competition - AppCurator helps to compare your app with competitor apps that are available in the global market.",
    },
    {
      q: "How do you use AppCurator?",
      a: (
        <>
          To see what drives competitor successes via AppCurator,
          you need to follow these steps:
          <br />

          1. Select the platform (Android/iOS) from the drop-down list.
          <br />

          2. Select the country from the drop-down list.
          <br />

          3. Enter your app and competitor app names in the text fields.
          <br />

          4. Click on “Compare” - a list of a maximum 10 apps suggestions will appear.
          <br />

          5. Choose the exact apps that you want to compare.
          <br />

          6. Click on “Get Report”.
          <br />

          7. You can see the complete report online on the webpage
          (or) you can also download a PDF report
          and save it on your PC for further purposes.
        </>
      ),
    },
    {
      q: "What are the main features of AppCurator?",
      a: "Track and compare iOS and Android apps available on the App Store and Google Play Store. Generate reports (online/PDF) for future ASO optimization purposes.",
    },
    {
      q: "What does AppCurator do?",
      a: "AppCurator is the most trusted app comparison tool for tracking and comparing apps on Android and iOS Platforms. It highlights app features as per Google Play and iOS Standards.",
    },
  ],

  competitors: [
    {
      q: "How do I know my competitors?",
      a: "You can enter a keyword that’s related to your app or competitor app in the text field. We show you suggestions and you can pick one to start comparing apps.",
    },
    {
      q: "How many apps can I add to compare?",
      a: "You can add two apps (1 your app and 1 competitor app).",
    },
    {
      q: "How do I know if my app is better or worse then competitor apps?",
      a: "AppCurator gives your app and competitor app details as per the Play Store and App Store standards. You can easily check the results and improve on ASO.",
    },
  ],

  platforms: [
    {
      q: "What are the mobile platforms supported?",
      a: "Android and iOS.",
    },
    {
      q: "Do you have an AppCurator mobile Application?",
      a: "Currently No. But we're constantly looking to have one. If you’d like to learn more about our roadmap, feel free to contact us at any time and set up a call with one of our app intelligence experts!",
    },
  ],

  reports: [
    {
      q: "Can I download a report?",
      a: "Yes - PDF reports can be downloaded.",
    },
    {
      q: "What does the AppCurator report contain?",
      a: "Your app and Competitor app details as per the stores standards.",
    },
  ],
};

export default function FAQ() {
  const [activeTab, setActiveTab] = useState("appcurator");
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq-contact-block sections">
      <div className="faq-content-block faq-block">

        {/* HEADER */}
        <h3 className="faqs-heading">FAQs</h3>
        <p className="p-heading text-center">Hello, How can i help you?</p>


        {/* TAB BUTTONS */}
        <div className="faqs-block">
          <div className="faq-links">
            <div className="tab-buttons">
              <span
                className={activeTab === "appcurator" ? "active" : ""}
                onClick={() => {
                  setActiveTab("appcurator");
                  setOpenIndex(null);
                }}
              >
                AppCurator
              </span>

              <span
                className={activeTab === "competitors" ? "active" : ""}
                onClick={() => {
                  setActiveTab("competitors");
                  setOpenIndex(null);
                }}
              >
                Competitors?
              </span>

              <span
                className={activeTab === "platforms" ? "active" : ""}
                onClick={() => {
                  setActiveTab("platforms");
                  setOpenIndex(null);
                }}
              >
                Platforms Supported
              </span>

              <span
                className={activeTab === "reports" ? "active" : ""}
                onClick={() => {
                  setActiveTab("reports");
                  setOpenIndex(null);
                }}
              >
                Download Reports
              </span>
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="tab-content">
            <div className="accordion">
              {FAQ_DATA[activeTab].map((item, index) => {
                const isOpen = openIndex === index;

                return (
                  <div className="accordion-item" key={index}>
                    <button
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpenIndex(isOpen ? null : index)
                      }
                    >
                      <span
                        className={`accordion-title ${isOpen ? "active-title" : ""
                          }`}
                      >
                        {item.q}
                      </span>
                      <span className={`icon ${isOpen ? "open" : ""}`}></span>
                    </button>

                    <div
                      className="accordion-content"
                      style={{
                        maxHeight: isOpen ? "500px" : "0",
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <p>{item.a}</p>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
