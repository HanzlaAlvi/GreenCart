import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "./footer";
import HeroSection from "./sections/HeroSection";
import MissionSection from "./sections/MissionSection";
import ValuesSection from "./sections/ValuesSection";
import TeamSection from "./sections/TeamSection";
import Header from "./header";

const CompanyPage = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />
      <HeroSection />
      <MissionSection />
      <ValuesSection />
      <TeamSection />
      <Footer />
    </div>
  );
};

export default CompanyPage;