import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import CursorAnimation from '@/components/CursorAnimation';
import FixedBanner from '@/components/FixedBanner';
import EstimatorCTA from '@/components/EstimatorCTA';

const Home = () => {
  return (
    <>
      <LoadingScreen duration={3000} />
      <CursorAnimation />
      <div className="min-h-screen">
        <Navbar />
        <FixedBanner />
        <Hero />
        <About />
        <Projects />
        <Services />
        <EstimatorCTA />
        <Contact />
        <Footer />
      </div>
    </>
  );
};

export default Home;
