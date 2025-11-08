import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ProjectEstimate, ComponentOption } from "@/types/estimator";
import { useToast } from "@/hooks/use-toast";

interface EstimatorContextType {
  step: number;
  totalSteps: number;
  estimate: ProjectEstimate;
  isCalculating: boolean;
  setStep: (step: number) => void;
  updateEstimate: (key: keyof ProjectEstimate, value: any) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleReset: () => void;
  handleSaveEstimate: () => void;
  handleOptionChange: (component: string, option: ComponentOption) => void;
}

const EstimatorContext = createContext<EstimatorContextType | undefined>(undefined);

// Location-based cost multipliers (per sq ft base rates)
const LOCATION_BASE_RATES: Record<string, { tier: number; basic: number; standard: number; premium: number; luxury: number }> = {
  // Tier 1 Cities - Major Metros
  "Mumbai": { tier: 1, basic: 2000, standard: 3000, premium: 4250, luxury: 5500 },
  "Navi Mumbai": { tier: 1, basic: 1900, standard: 2900, premium: 4000, luxury: 5200 },
  "Thane": { tier: 1, basic: 1850, standard: 2800, premium: 3900, luxury: 5000 },
  "Delhi": { tier: 1, basic: 1900, standard: 2900, premium: 4000, luxury: 5300 },
  "New Delhi": { tier: 1, basic: 2000, standard: 3000, premium: 4250, luxury: 5500 },
  "Gurgaon": { tier: 1, basic: 2000, standard: 3100, premium: 4300, luxury: 5600 },
  "Noida": { tier: 1, basic: 1850, standard: 2850, premium: 4000, luxury: 5200 },
  "Bangalore": { tier: 1, basic: 1900, standard: 2900, premium: 4100, luxury: 5400 },
  "Bengaluru": { tier: 1, basic: 1900, standard: 2900, premium: 4100, luxury: 5400 },
  "Hyderabad": { tier: 1, basic: 1800, standard: 2700, premium: 3800, luxury: 5000 },
  "Chennai": { tier: 1, basic: 1800, standard: 2700, premium: 3900, luxury: 5100 },
  "Pune": { tier: 1, basic: 1850, standard: 2800, premium: 3900, luxury: 5200 },
  
  // Tier 2 Cities - Mid-sized
  "Ahmedabad": { tier: 2, basic: 1550, standard: 2150, premium: 3000, luxury: 4000 },
  "Surat": { tier: 2, basic: 1500, standard: 2100, premium: 2900, luxury: 3800 },
  "Jaipur": { tier: 2, basic: 1550, standard: 2200, premium: 3000, luxury: 4000 },
  "Kochi": { tier: 2, basic: 1500, standard: 2100, premium: 2900, luxury: 3900 },
  "Coimbatore": { tier: 2, basic: 1450, standard: 2000, premium: 2800, luxury: 3700 },
  "Indore": { tier: 2, basic: 1500, standard: 2100, premium: 2900, luxury: 3800 },
  "Chandigarh": { tier: 2, basic: 1600, standard: 2250, premium: 3100, luxury: 4100 },
  "Lucknow": { tier: 2, basic: 1450, standard: 2000, premium: 2850, luxury: 3700 },
  "Visakhapatnam": { tier: 2, basic: 1450, standard: 2000, premium: 2800, luxury: 3600 },
  "Nagpur": { tier: 2, basic: 1450, standard: 2000, premium: 2850, luxury: 3700 },
  "Vadodara": { tier: 2, basic: 1500, standard: 2100, premium: 2900, luxury: 3800 },
  
  // Tier 3 - Smaller towns (default)
  "default": { tier: 3, basic: 1350, standard: 1750, premium: 2250, luxury: 3000 }
};

// Component-wise cost breakdown as % of base rate per sq ft
const COMPONENT_COST_BREAKDOWN: Record<string, Record<ComponentOption, number>> = {
  // Core construction (40-45% of total)
  civilQuality: { none: 0, standard: 0.42, premium: 0.44, luxury: 0.46 },
  
  // MEP Systems (20-25% of total)
  plumbing: { none: 0, standard: 0.08, premium: 0.10, luxury: 0.13 },
  electrical: { none: 0, standard: 0.07, premium: 0.09, luxury: 0.12 },
  ac: { none: 0, standard: 0.06, premium: 0.09, luxury: 0.14 },
  elevator: { none: 0, standard: 0.03, premium: 0.04, luxury: 0.06 },
  
  // Finishes (15-20% of total)
  buildingEnvelope: { none: 0, standard: 0.05, premium: 0.07, luxury: 0.10 },
  lighting: { none: 0, standard: 0.03, premium: 0.05, luxury: 0.08 },
  windows: { none: 0, standard: 0.05, premium: 0.07, luxury: 0.10 },
  ceiling: { none: 0, standard: 0.03, premium: 0.05, luxury: 0.08 },
  surfaces: { none: 0, standard: 0.06, premium: 0.09, luxury: 0.13 },
  
  // Interiors (15-20% of total)
  fixedFurniture: { none: 0, standard: 0.08, premium: 0.12, luxury: 0.18 },
  looseFurniture: { none: 0, standard: 0.04, premium: 0.07, luxury: 0.12 },
  furnishings: { none: 0, standard: 0.02, premium: 0.04, luxury: 0.07 },
  appliances: { none: 0, standard: 0.03, premium: 0.06, luxury: 0.10 },
  artefacts: { none: 0, standard: 0.01, premium: 0.03, luxury: 0.06 },
};

const initialEstimate: ProjectEstimate = {
  state: "",
  city: "",
  projectType: "",
  area: 0,
  areaUnit: "sqft",
  complexity: 5,
  selectedMaterials: [],
  civilQuality: "standard",
  plumbing: "standard",
  ac: "standard",
  electrical: "standard",
  elevator: "none",
  buildingEnvelope: "standard",
  lighting: "standard",
  windows: "standard",
  ceiling: "standard",
  surfaces: "standard",
  fixedFurniture: "standard",
  looseFurniture: "standard",
  furnishings: "standard",
  appliances: "standard",
  artefacts: "none",
  totalCost: 0,
  categoryBreakdown: {
    construction: 0,
    core: 0,
    finishes: 0,
    interiors: 0,
  },
  phaseBreakdown: {
    planning: 0,
    construction: 0,
    interiors: 0,
  },
  timeline: {
    totalMonths: 0,
    phases: {
      planning: 0,
      construction: 0,
      interiors: 0,
    },
  },
};

export const EstimatorProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState(1);
  const [estimate, setEstimate] = useState<ProjectEstimate>(initialEstimate);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();
  const totalSteps = 5;

  // Get base rate for location and quality
  const getBaseRate = useCallback((city: string, qualityLevel: ComponentOption): number => {
    const locationRates = LOCATION_BASE_RATES[city] || LOCATION_BASE_RATES["default"];
    
    switch (qualityLevel) {
      case "standard": return locationRates.standard;
      case "premium": return locationRates.premium;
      case "luxury": return locationRates.luxury;
      default: return locationRates.standard;
    }
  }, []);

  // Get overall quality level (dominant quality)
  const getOverallQuality = useCallback((estimate: ProjectEstimate): ComponentOption => {
    const qualities = [
      estimate.civilQuality,
      estimate.plumbing,
      estimate.electrical,
      estimate.ac !== "none" ? estimate.ac : "standard",
    ].filter(q => q !== "none");
    
    // Count occurrences
    const counts = { standard: 0, premium: 0, luxury: 0, none: 0 };
    qualities.forEach(q => counts[q]++);
    
    // Return most common quality
    if (counts.luxury > 0) return "luxury";
    if (counts.premium >= 2) return "premium";
    return "standard";
  }, []);

  // Calculate timeline
  const calculateTimeline = useCallback((
    projectType: string,
    area: number,
    areaUnit: string,
    complexity: number
  ) => {
    const areaInSqft = areaUnit === "sqm" ? area * 10.764 : area;
    const sizeUnits = areaInSqft / 1000; // per 1000 sqft
    
    let planningMonths = 2;
    let constructionMonths = 6;
    let interiorsMonths = 2;
    
    // Project type adjustment
    if (projectType === "commercial") {
      planningMonths += 1;
      constructionMonths += 2;
      interiorsMonths += 1;
    } else if (projectType === "mixed-use") {
      planningMonths += 2;
      constructionMonths += 4;
      interiorsMonths += 1;
    }
    
    // Area adjustment
    const areaAddition = Math.floor(sizeUnits / 2);
    constructionMonths += areaAddition;
    interiorsMonths += Math.floor(areaAddition / 2);
    
    // Complexity adjustment
    const complexityFactor = 1 + ((complexity - 5) * 0.1);
    constructionMonths = Math.ceil(constructionMonths * complexityFactor);
    interiorsMonths = Math.ceil(interiorsMonths * complexityFactor);
    
    planningMonths = Math.max(1, Math.round(planningMonths));
    constructionMonths = Math.max(3, Math.round(constructionMonths));
    interiorsMonths = Math.max(1, Math.round(interiorsMonths));
    
    return {
      totalMonths: planningMonths + constructionMonths + interiorsMonths,
      phases: {
        planning: planningMonths,
        construction: constructionMonths,
        interiors: interiorsMonths,
      },
    };
  }, []);

  // Main calculation function
  const calculateFullEstimate = useCallback((currentEstimate: ProjectEstimate): ProjectEstimate => {
    const areaInSqft = currentEstimate.areaUnit === "sqm" 
      ? currentEstimate.area * 10.764 
      : currentEstimate.area;

    // Get overall quality level
    const overallQuality = getOverallQuality(currentEstimate);
    
    // Get base rate per sq ft for this location and quality
    let baseRatePerSqft = getBaseRate(currentEstimate.city, overallQuality);
    
    // Project type multiplier
    if (currentEstimate.projectType === "commercial") {
      baseRatePerSqft *= 1.10;
    } else if (currentEstimate.projectType === "mixed-use") {
      baseRatePerSqft *= 1.15;
    }
    
    // Complexity multiplier (±15% for extreme complexity)
    const complexityMultiplier = 1 + ((currentEstimate.complexity - 5) * 0.03);
    baseRatePerSqft *= complexityMultiplier;
    
    // Calculate component costs
    let totalCostPerSqft = 0;
    let construction = 0;
    let core = 0;
    let finishes = 0;
    let interiors = 0;
    
    // Sum up all component costs
    Object.entries(COMPONENT_COST_BREAKDOWN).forEach(([component, rates]) => {
      const selectedQuality = currentEstimate[component as keyof ProjectEstimate] as ComponentOption;
      const componentCostPerSqft = baseRatePerSqft * rates[selectedQuality];
      totalCostPerSqft += componentCostPerSqft;
      
      // Categorize
      if (component === "civilQuality") {
        construction += componentCostPerSqft * areaInSqft;
      } else if (["plumbing", "electrical", "ac", "elevator"].includes(component)) {
        core += componentCostPerSqft * areaInSqft;
      } else if (["buildingEnvelope", "lighting", "windows", "ceiling", "surfaces"].includes(component)) {
        finishes += componentCostPerSqft * areaInSqft;
      } else {
        interiors += componentCostPerSqft * areaInSqft;
      }
    });
    
    // Total before overheads
    const subtotal = totalCostPerSqft * areaInSqft;
    
    // Add professional fees (8% - architect, engineer, approvals)
    const professionalFees = subtotal * 0.08;
    
    // Add contingency (5%)
    const contingency = subtotal * 0.05;
    
    // Total before tax
    const totalBeforeTax = subtotal + professionalFees + contingency;
    
    // Add GST (12% effective)
    const gst = totalBeforeTax * 0.12;
    
    // Final total
    const totalCost = totalBeforeTax + gst;
    
    // Phase breakdown
    const planningCost = totalCost * 0.08;
    const constructionPhaseCost = construction + (core * 0.6) + (professionalFees * 0.5);
    const interiorsPhaseCost = interiors + finishes + (core * 0.4) + (professionalFees * 0.5) + contingency + gst;
    
    // Timeline
    const timeline = calculateTimeline(
      currentEstimate.projectType,
      currentEstimate.area,
      currentEstimate.areaUnit,
      currentEstimate.complexity
    );

    return {
      ...currentEstimate,
      totalCost: Math.round(totalCost),
      categoryBreakdown: {
        construction: Math.round(construction),
        core: Math.round(core),
        finishes: Math.round(finishes),
        interiors: Math.round(interiors),
      },
      phaseBreakdown: {
        planning: Math.round(planningCost),
        construction: Math.round(constructionPhaseCost),
        interiors: Math.round(interiorsPhaseCost),
      },
      timeline,
    };
  }, [getBaseRate, getOverallQuality, calculateTimeline]);

  // Recalculate whenever relevant fields change
  useEffect(() => {
    if (estimate.area > 0 && estimate.projectType && estimate.city) {
      const updatedEstimate = calculateFullEstimate(estimate);
      setEstimate(updatedEstimate);
    }
  }, [
    estimate.area,
    estimate.areaUnit,
    estimate.projectType,
    estimate.city,
    estimate.complexity,
    estimate.civilQuality,
    estimate.plumbing,
    estimate.electrical,
    estimate.ac,
    estimate.elevator,
    estimate.buildingEnvelope,
    estimate.lighting,
    estimate.windows,
    estimate.ceiling,
    estimate.surfaces,
    estimate.fixedFurniture,
    estimate.looseFurniture,
    estimate.furnishings,
    estimate.appliances,
    estimate.artefacts,
  ]);

  const updateEstimate = useCallback((key: keyof ProjectEstimate, value: any) => {
    setEstimate((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleOptionChange = useCallback((component: string, option: ComponentOption) => {
    updateEstimate(component as keyof ProjectEstimate, option);
  }, [updateEstimate]);

  const validateStep = useCallback((currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!estimate.state || !estimate.city) {
          toast({
            title: "Location Required",
            description: "Please select your project location.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2:
        if (!estimate.projectType) {
          toast({
            title: "Project Type Required",
            description: "Please select your project type.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 3:
        if (estimate.area <= 0) {
          toast({
            title: "Area Required",
            description: "Please enter a valid project area.",
            variant: "destructive",
          });
          return false;
        }
        const maxArea = estimate.areaUnit === "sqft" ? 50000 : 4645;
        if (estimate.area > maxArea) {
          toast({
            title: "Large Project",
            description: "Very large projects may require custom estimation. Please contact us for accurate pricing.",
          });
        }
        break;
      case 4:
        const requiredComponents = [estimate.civilQuality, estimate.plumbing, estimate.electrical];
        const hasAllRequired = requiredComponents.every(c => c && c !== 'none');
        
        if (!hasAllRequired) {
          toast({
            title: "Required Components",
            description: "Please select quality levels for all required components (Civil, Plumbing, Electrical).",
            variant: "destructive",
          });
          return false;
        }
        break;
    }
    return true;
  }, [estimate, toast]);

  const handleNext = useCallback(() => {
    if (!validateStep(step)) return;
    
    if (step < totalSteps) {
      if (step === 4) {
        setIsCalculating(true);
        setTimeout(() => {
          const finalEstimate = calculateFullEstimate(estimate);
          setEstimate(finalEstimate);
          setIsCalculating(false);
          setStep(5);
        }, 1000);
      } else {
        setStep(step + 1);
      }
    }
  }, [step, estimate, validateStep, calculateFullEstimate]);

  const handlePrevious = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step]);

  const handleReset = useCallback(() => {
    setEstimate(initialEstimate);
    setStep(1);
    toast({
      title: "Estimate Reset",
      description: "Starting a new estimate.",
    });
  }, [toast]);

  const handleSaveEstimate = useCallback(() => {
    const savedEstimates = JSON.parse(localStorage.getItem("savedEstimates") || "[]");
    const newEstimate = {
      ...estimate,
      savedAt: new Date().toISOString(),
      id: Date.now().toString(),
    };
    savedEstimates.push(newEstimate);
    localStorage.setItem("savedEstimates", JSON.stringify(savedEstimates));
    
    toast({
      title: "Estimate Saved",
      description: "Your estimate has been saved successfully.",
    });
  }, [estimate, toast]);

  return (
    <EstimatorContext.Provider
      value={{
        step,
        totalSteps,
        estimate,
        isCalculating,
        setStep,
        updateEstimate,
        handleNext,
        handlePrevious,
        handleReset,
        handleSaveEstimate,
        handleOptionChange,
      }}
    >
      {children}
    </EstimatorContext.Provider>
  );
};

export const useEstimator = () => {
  const context = useContext(EstimatorContext);
  if (!context) {
    throw new Error("useEstimator must be used within EstimatorProvider");
  }
  return context;
};
