
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EstimatorWizard from "@/components/EstimatorWizard";
import FixedBanner from "@/components/FixedBanner";
import ParallaxScroll from "@/components/ParallaxScroll";
import { AlertTriangle } from "lucide-react";

const Estimator = () => {
  const { toast } = useToast();
  
  // Ensure page starts at the top
  useState(() => {
    window.scrollTo(0, 0);
  });
  
  return (
    <div className="min-h-screen bg-[#f0ede8]">
      <FixedBanner className="fixed top-0 w-full z-50" />
      <div className="pt-10">
        <Navbar />
      </div>
      
      <section className="py-12 md:py-20 px-4 mt-8">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto mb-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <h1 className="text-3xl md:text-4xl font-halimun mb-3 text-vs">
                Estimator
              </h1>
              
              <div className="flex items-center justify-center gap-2 text-sm text-vs-dark/80 bg-vs/5 px-4 py-3 rounded-lg border border-vs/10">
                <AlertTriangle size={16} className="text-orange-500" />
                <p>This tool provides indicative costs only. Contact us for a refined project estimate tailored to your specific requirements.</p>
              </div>
            </motion.div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <EstimatorWizard />
          </div>
        </div>
      </section>
      
      <div className="mt-10">
        <ParallaxScroll />
      </div>
      <Footer />
    </div>
  );
};

export default Estimator;
