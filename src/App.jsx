import { useEffect } from "react";
import "./App.css";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
// import Loader from "./components/Loader";

import Header from "./components/Header";
import Home from "./components/Home/home-section";
import About from "./components/Home/About";
import OurApps from "./components/Home/OurApps";
import Comments from "./components/Home/Comments";
import FAQ from "./components/Home/FAQ";
import Contact from "./components/Home/Contact";
import Footer from "./components/Footer";
import ComparePage from "./components/ComparePage";
import ReportPage from "./components/Report/ReportPage";

function MainPage() {
  const location = useLocation();

useEffect(() => {

  if (
    location.pathname.startsWith("/scroll/")
  ) {

    const sectionId =
      location.pathname.replace(
        "/scroll/",
        ""
      );

    requestAnimationFrame(() => {

      const element =
        document.getElementById(sectionId);

      if (element) {

        window.scrollTo({
          top: element.offsetTop,
          behavior: "auto"
        });

      }

    });

  }

}, [location]);

  return (
    <div className="app-container">
      <Header />
      <section id="banner-top"><Home /></section>
      <section id="about-block"><About /></section>
      <section id="our-apps-blocks-scroll"><OurApps /></section>
      <section id="comments-block"><Comments /></section>
      <section id="faq-block"><FAQ /></section>
      <section id="contact-block"><Contact /></section>
      <Footer />
    </div>
  );
}

function AppWrapper() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/scroll/:sectionId" element={<MainPage />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/reportpage" element={<ReportPage />} />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
    }
  }, []);

  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;