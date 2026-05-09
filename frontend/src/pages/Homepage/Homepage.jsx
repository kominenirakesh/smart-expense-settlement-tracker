import Navbar from "../Header/Navbar.jsx";
import HeroSection from "./HeroSection.jsx";
import HowItWorks from "./HowItWorks.jsx";
import Copyright from "../../components/CopyRight/Copyright.jsx";
import "../../styles/Homepage/home.css";


function Home() {
  return (
    <div className="hero-container">
      <Navbar />
      <HeroSection />
    <div id="Features">
      <HowItWorks />
    </div>
      <Copyright/>
    </div>
  );
}

export default Home;