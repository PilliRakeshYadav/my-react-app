import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import About from "./components/About";
import OurApps from "./components/OurApps";
import Comments from "./components/Comments";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app-container">

      {/* HEADER / TOP */}
      <div id="top">
        <Header />
      </div>

      {/* HOME */}
      <section id="banner-top">
        <Home />
      </section>

      {/* ABOUT */}
      <section id="about-block">
        <About />
      </section>

      {/* OUR APPS */}
      <section id="our-apps-blocks-scroll">
        <OurApps />
      </section>

      {/* COMMENTS / TESTIMONIALS */}
      <section id="comments-block">
        <Comments />
      </section>

      {/* FAQ */}
      <section id="faq-block">
        <FAQ />
      </section>

      {/* CONTACT */}
      <section id="contact-block">
        <Contact />
      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

export default App;
