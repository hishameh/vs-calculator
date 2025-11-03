
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import Services from "@/components/Services";
import HorizontalRibbon from "@/components/HorizontalRibbon";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isBlurred, setIsBlurred] = useState(false);
  
  useEffect(() => {
    // Set focus to the top of the page when it loads
    window.scrollTo(0, 0);
    
    // Simulate content loading with 5 seconds timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    // Add event listener for hamburger hover
    const handleMouseEnter = () => setIsBlurred(true);
    const handleMouseLeave = () => setIsBlurred(false);
    
    const observer = new MutationObserver(mutations => {
      const hamburgerBtn = document.querySelector('.custom-hamburger')?.parentElement;
      const menu = document.querySelector('[aria-label="Close menu"]');
      
      if (hamburgerBtn) {
        hamburgerBtn.addEventListener('mouseenter', handleMouseEnter);
        hamburgerBtn.addEventListener('mouseleave', handleMouseLeave);
      }
      
      if (menu) {
        menu.addEventListener('mouseenter', handleMouseEnter);
        menu.addEventListener('mouseleave', handleMouseLeave);
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
  
  return (
    <div className="min-h-screen">
      {isLoading && <LoadingScreen duration={5000} />}
      <div className={`${isLoading ? 'hidden' : ''} transition-all duration-300 ${isBlurred ? 'blur-md' : ''}`}>
        <Navbar />
        <Hero />
        
        {/* Horizontal Ribbon */}
        <HorizontalRibbon />
        
        <Projects />
        <Services />
        <About />
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
