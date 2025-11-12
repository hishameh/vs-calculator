import { useEffect } from "react";
import EstimatorWizard from "@/components/EstimatorWizard";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-background py-4 px-4">
      {/* Simple Header with Logo */}
      <div className="container-custom max-w-5xl mx-auto mb-4">
        <div className="flex justify-center items-center">
          <img 
            src="/lovable-uploads/1938f286-8b49-49bf-bc47-3ac7ef7d6cab.png" 
            alt="Vanilla & Somethin'" 
            className="h-16 md:h-20"
          />
        </div>
      </div>

      <div className="container-custom max-w-5xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-display mb-2">
            Project Cost Estimator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            Get an accurate, transparent estimate for your complete project - construction, architecture & interiors.
          </p>
        </div>
        
        <EstimatorWizard />
      </div>

      {/* Footer */}
      <div className="container-custom max-w-5xl mx-auto mt-8">
        <div className="text-center text-sm text-muted-foreground border-t pt-6">
          <p>© {new Date().getFullYear()} VS Collective LLP. All rights reserved.</p>
          <p className="mt-2">
            <a href="mailto:design@vanillasometh.in" className="hover:text-vs transition-colors">
              design@vanillasometh.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
