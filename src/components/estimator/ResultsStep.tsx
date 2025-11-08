import { useState } from "react";
import { motion } from "framer-motion";
import { ProjectEstimate, ComponentOption } from "@/types/estimator";
import { Share, Calendar, Flag, CheckCheck, HardHat, PieChart, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImprovedCostVisualization from "./ImprovedCostVisualization";
import PhaseTimelineCost from "./PhaseTimelineCost";
import ContactCTAStrategy from "./ContactCTAStrategy";

interface ResultsStepProps {
  estimate: ProjectEstimate;
  onReset: () => void;
  onSave: () => void;
}

const ResultsStep = ({ estimate, onReset, onSave }: ResultsStepProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("breakdown");
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };
  
  const toSentenceCase = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Construction Cost Estimate',
        text: `My estimated construction cost is ${formatCurrency(estimate.totalCost)} for a ${estimate.area} ${estimate.areaUnit} ${estimate.projectType} project.`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser does not support the Web Share API."
      });
    }
  };

  // Helper to check if component is included
  const isIncluded = (value: string | undefined): boolean => {
    return !!(value && value !== 'none' && value !== '');
  };

  // Helper to format level label
  const formatLevel = (level: ComponentOption) => {
    if (level === 'standard') return 'Standard';
    if (level === 'premium') return 'Premium';
    if (level === 'luxury') return 'Luxury';
    return level;
  };

  // Group features by category
  const includedFeatures = {
    core: {
      title: "Core Building Components",
      items: [
        isIncluded(estimate.civilQuality) && { name: "Quality of Construction - Civil Materials", level: estimate.civilQuality },
        isIncluded(estimate.plumbing) && { name: "Plumbing & Sanitary", level: estimate.plumbing },
        isIncluded(estimate.electrical) && { name: "Electrical Systems", level: estimate.electrical },
        isIncluded(estimate.ac) && { name: "AC & HVAC Systems", level: estimate.ac },
        isIncluded(estimate.elevator) && { name: "Vertical Transportation", level: estimate.elevator },
      ].filter(Boolean)
    },
    finishes: {
      title: "Finishes & Surfaces",
      items: [
        isIncluded(estimate.buildingEnvelope) && { name: "Building Envelope & Facade", level: estimate.buildingEnvelope },
        isIncluded(estimate.lighting) && { name: "Lighting Systems & Fixtures", level: estimate.lighting },
        isIncluded(estimate.windows) && { name: "Windows & Glazing Systems", level: estimate.windows },
        isIncluded(estimate.ceiling) && { name: "Ceiling Design & Finishes", level: estimate.ceiling },
        isIncluded(estimate.surfaces) && { name: "Wall & Floor Finishes", level: estimate.surfaces },
      ].filter(Boolean)
    },
    interiors: {
      title: "Interiors & Furnishings",
      items: [
        isIncluded(estimate.fixedFurniture) && { name: "Fixed Furniture & Cabinetry", level: estimate.fixedFurniture },
        isIncluded(estimate.looseFurniture) && { name: "Loose Furniture", level: estimate.looseFurniture },
        isIncluded(estimate.furnishings) && { name: "Furnishings & Soft Decor", level: estimate.furnishings },
        isIncluded(estimate.appliances) && { name: "Appliances & Equipment", level: estimate.appliances },
        isIncluded(estimate.artefacts) && { name: "Artefacts & Art Pieces", level: estimate.artefacts },
      ].filter(Boolean)
    }
  };
  
  return (
    <div className="space-y-4 overflow-y-auto overflow-x-hidden max-h-[80vh] px-2 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-4 rounded-xl border border-vs/10 shadow-sm"
      >
        <h2 className="text-lg font-bold text-vs-dark text-center mb-3">Estimate Summary</h2>
        
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Location</h3>
            <p className="font-medium text-sm">{estimate.city}, {estimate.state}</p>
          </div>
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Project Type</h3>
            <p className="font-medium text-sm">{toSentenceCase(estimate.projectType)}</p>
          </div>
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Area</h3>
            <p className="font-medium text-sm">{estimate.area} {estimate.areaUnit}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-3 mb-3">
          <div className="text-center">
            <h3 className="text-xs text-vs-dark/70 mb-1">Estimated Total Cost</h3>
            <p className="text-2xl font-bold text-vs">{formatCurrency(estimate.totalCost)}</p>
            <p className="text-xs text-vs-dark/60">
              ({formatCurrency(Math.round(estimate.totalCost / estimate.area))} per {estimate.areaUnit})
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="breakdown" onValueChange={setActiveTab} className="mt-3">
          <TabsList className="grid grid-cols-3 mb-3 h-9">
            <TabsTrigger value="breakdown" className="text-xs">
              <PieChart className="w-3 h-3 mr-1" />
              Cost
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs">
              <BarChart3 className="w-3 h-3 mr-1" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="features" className="text-xs">
              <CheckCheck className="w-3 h-3 mr-1" />
              Features
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="breakdown" className="pt-2">
            <ImprovedCostVisualization estimate={estimate} />
          </TabsContent>
          
          <TabsContent value="timeline" className="pt-2 space-y-3">
            <PhaseTimelineCost estimate={estimate} />
            
            <div className="grid grid-cols-3 gap-2 pt-3 border-t">
              <div className="bg-vs/5 p-2 rounded-lg flex flex-col items-center">
                <Calendar className="text-vs mb-1" size={16} />
                <span className="text-sm font-bold text-vs">{estimate.timeline.phases.planning}</span>
                <p className="text-[10px] text-vs-dark/70 text-center">Planning</p>
              </div>
              
              <div className="bg-vs/5 p-2 rounded-lg flex flex-col items-center">
                <HardHat className="text-vs mb-1" size={16} />
                <span className="text-sm font-bold text-vs">{estimate.timeline.phases.construction}</span>
                <p className="text-[10px] text-vs-dark/70 text-center">Construction</p>
              </div>
              
              <div className="bg-vs/5 p-2 rounded-lg flex flex-col items-center">
                <CheckCheck className="text-vs mb-1" size={16} />
                <span className="text-sm font-bold text-vs">{estimate.timeline.phases.interiors}</span>
                <p className="text-[10px] text-vs-dark/70 text-center">Interiors</p>
              </div>
            </div>
            
            <div className="bg-vs/10 p-2 rounded-lg flex items-center justify-center gap-2">
              <Flag className="text-vs" size={16} />
              <div>
                <span className="text-lg font-bold text-vs">{estimate.timeline.totalMonths}</span>
                <span className="text-xs text-vs-dark/70 ml-1">Total Months</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="pt-2">
            <div className="space-y-3">
              {Object.entries(includedFeatures).map(([key, section]) => (
                <div key={key} className="bg-vs/5 rounded-lg p-3">
                  <h4 className="font-medium text-vs text-sm mb-2">{section.title}</h4>
                  <ul className="space-y-1.5">
                    {section.items.length > 0 ? (
                      section.items.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-xs">
                          <CheckCheck size={14} className="text-green-600 flex-shrink-0" />
                          <span className="flex-1">
                            {item.name}
                            {item.level && <span className="ml-1 text-[10px] bg-vs/20 text-vs-dark/70 px-1.5 py-0.5 rounded-full">
                              {formatLevel(item.level)}
                            </span>}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-gray-500">No items selected</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Contact CTA Strategy */}
      <ContactCTAStrategy 
        estimate={{
          totalCost: estimate.totalCost,
          area: estimate.area,
          areaUnit: estimate.areaUnit,
          city: estimate.city,
          state: estimate.state,
          projectType: estimate.projectType
        }} 
      />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-vs text-vs rounded-lg hover:bg-vs/5 transition-colors"
        >
          <Share size={16} /> Share
        </button>
        
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ResultsStep;
