import { useState } from "react";
import "./FAQ.css";

const FAQ_DATA = {
  appcurator: [
    {
      q: "How is AppCurator helpful?",
      a: "Benchmark your competition. AppCurator helps to compare your app with competitor apps available in the global market.",
    },
    {
      q: "How do you use AppCurator?",
      a: "Enter your app and competitor app details to get detailed comparison insights.",
    },
    {
      q: "What are the main features of AppCurator?",
      a: "Competitor analysis, ASO insights, keyword ranking, and app performance comparison.",
    },
    {
      q: "What does AppCurator do?",
      a: "AppCurator helps developers improve app visibility, downloads, and rankings.",
    },
  ],

  competitors: [
    {
      q: "How do I know my competitors?",
      a: "AppCurator identifies competitors based on keywords and category rankings.",
    },
    {
      q: "How many apps can I add to compare?",
      a: "You can compare multiple competitor apps at once.",
    },
    {
      q: "How do I know if my app is better?",
      a: "Comparison reports show ratings, reviews, keywords, and performance clearly.",
    },
  ],

  platforms: [
    {
      q: "What platforms are supported?",
      a: "AppCurator supports Android (Google Play) and iOS (Apple App Store).",
    },
    {
      q: "Is there a mobile app?",
      a: "Currently AppCurator is web-based.",
    },
  ],

  reports: [
    {
      q: "Can I download a report?",
      a: "Yes, you can download detailed comparison and ASO reports.",
    },
    {
      q: "What does the report include?",
      a: "Keyword ranking, competitor analysis, ratings, and optimization tips.",
    },
  ],
};

export default function FAQ() {
  const [activeTab, setActiveTab] = useState("appcurator");
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq-contact-block sections">
      <div className="content-block faq-block">

        {/* HEADER */}
        <h3 className="heading text-center mar-b-0">FAQ</h3>
        <p  className="p-heading text-center">Hello, How can i help you?</p>
        

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
                      <span className="accordion-title">
                        {item.q}
                      </span>
                      <span className="icon"></span>
                    </button>

                    <div
                      className="accordion-content"
                      style={{
                        maxHeight: isOpen ? "200px" : "0",
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
