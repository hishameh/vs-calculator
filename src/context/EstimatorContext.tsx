import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectEstimate, ComponentOption } from '@/types/estimator';

// Component pricing per square meter (in INR)
const COMPONENT_PRICING: Record<string, Record<ComponentOption, number>> = {
  civilQuality: { none: 0, standard: 850, premium: 1150, luxury: 1530 },
  plumbing: { none: 0, standard: 180, premium: 350, luxury: 700 },
  electrical: { none: 0, standard: 150, premium: 300, luxury: 600 },
  ac: { none: 0, standard: 400, premium: 750, luxury: 1400 },
  elevator: { none: 0, standard: 180, premium: 380, luxury: 850 },
  buildingEnvelope: { none: 0, standard: 150, premium: 320, luxury: 650 },
  lighting: { none: 0, standard: 120, premium: 280, luxury: 600 },
  windows: { none: 0, standard: 220, premium: 450, luxury: 950 },
  ceiling: { none: 0, standard: 130, premium: 270, luxury: 580 },
  surfaces: { none: 0, standard: 280, premium: 550, luxury: 1100 },
  fixedFurniture: { none: 0, standard: 400, premium: 750, luxury: 1400 },
  looseFurniture: { none: 0, standard: 280, premium: 550, luxury: 1200 },
  furnishings: { none: 0, standard: 90, premium: 220, luxury: 500 },
  appliances: { none: 0, standard: 180, premium: 380, luxury: 850 },
  artefacts: { none: 0, standard: 70, premium: 180, luxury: 450 },
  landscape: { none: 0, standard: 120, premium: 280, luxury: 650 },
};

// Component included elements
const COMPONENT_DETAILS: Record<string, Record<ComponentOption, string[]>> = {
  civilQuality: {
    none: [],
    standard: ['Basic foundation', 'Standard bricks', 'Regular cement', 'Basic plastering', 'Standard waterproofing'],
    premium: ['Enhanced foundation', 'Premium bricks', 'High-grade cement', 'Fine plastering', 'Advanced waterproofing', 'Seismic considerations'],
    luxury: ['Premium foundation', 'Luxury bricks/blocks', 'Superior cement', 'Expert plastering', 'Top-grade waterproofing', 'Full seismic design', 'Thermal insulation']
  },
  plumbing: {
    none: [],
    standard: ['CPVC pipes', 'Standard fixtures', 'Basic fittings', 'Standard drainage'],
    premium: ['Premium CPVC', 'Mid-range fixtures', 'Quality fittings', 'Enhanced drainage', 'Water purifier points'],
    luxury: ['Copper/PPR pipes', 'Luxury fixtures', 'Designer fittings', 'Advanced drainage', 'Water treatment system', 'Hot water circulation']
  },
  electrical: {
    none: [],
    standard: ['Standard wiring', 'Basic switches', 'Regular outlets', 'MCB panel'],
    premium: ['Premium wiring', 'Modular switches', 'Multiple outlets', 'RCCB protection', 'Smart home ready'],
    luxury: ['Armoured cables', 'Designer switches', 'Abundant outlets', 'Full automation', 'Home automation', 'Backup systems']
  },
  ac: {
    none: [],
    standard: ['Split AC provision', 'Basic ducting', 'Standard vents'],
    premium: ['VRF ready', 'Concealed ducting', 'Premium vents', 'Zoned cooling'],
    luxury: ['VRF/Cassette system', 'Full concealment', 'Designer grilles', 'Multi-zone control', 'Air purification']
  },
  elevator: {
    none: [],
    standard: ['Basic elevator shaft', 'Standard lift', '4-6 person capacity'],
    premium: ['Enhanced shaft', 'Mid-range lift', '6-8 person capacity', 'Automatic doors'],
    luxury: ['Premium shaft', 'Luxury elevator', '8-13 person capacity', 'Smart controls', 'Designer cabin']
  },
  buildingEnvelope: {
    none: [],
    standard: ['Basic exterior paint', 'Standard weather coating', 'Basic insulation'],
    premium: ['Textured exterior', 'Premium weather coating', 'Enhanced insulation', 'Decorative elements'],
    luxury: ['Designer facade', 'High-performance coating', 'Superior insulation', 'Architectural features', 'Cladding options']
  },
  lighting: {
    none: [],
    standard: ['LED fixtures', 'Basic design', 'Standard switches'],
    premium: ['Designer LED', 'Ambient lighting', 'Dimmer controls', 'Cove lighting'],
    luxury: ['Premium fixtures', 'Layered lighting', 'Smart controls', 'Feature lighting', 'Chandelier provisions']
  },
  windows: {
    none: [],
    standard: ['UPVC windows', 'Clear glass', 'Mosquito nets', 'Standard grilles'],
    premium: ['Premium UPVC', 'Tinted/Reflective glass', 'Hidden grilles', 'Weather stripping'],
    luxury: ['Aluminium/Wood', 'Double glazing', 'Automated controls', 'Designer frames', 'Sound insulation']
  },
  ceiling: {
    none: [],
    standard: ['Gypsum board', 'POP corners', 'Basic design'],
    premium: ['Designer gypsum', 'POP patterns', 'Cove lighting', 'Multiple levels'],
    luxury: ['Premium materials', 'Complex patterns', 'Integrated lighting', 'Multi-level design', 'Acoustic treatment']
  },
  surfaces: {
    none: [],
    standard: ['Vitrified tiles', 'Basic marble', 'Standard paint', 'Regular counters'],
    premium: ['Premium tiles', 'Italian marble', 'Texture paint', 'Granite counters', 'Feature walls'],
    luxury: ['Imported tiles', 'Premium marble/Onyx', 'Designer finishes', 'Quartz counters', 'Wood paneling', 'Stone cladding']
  },
  fixedFurniture: {
    none: [],
    standard: ['Plywood cabinets', 'Laminate finish', 'Basic hardware', 'Standard wardrobes'],
    premium: ['Boiling water resistant plywood', 'Premium laminate', 'Soft-close hardware', 'Designer wardrobes', 'Kitchen modules'],
    luxury: ['Marine plywood', 'Veneer/Lacquer finish', 'Premium hardware', 'Walk-in wardrobes', 'Modular kitchen', 'Study units']
  },
  looseFurniture: {
    none: [],
    standard: ['Essential furniture', 'Standard quality', 'Basic design'],
    premium: ['Designer furniture', 'Quality materials', 'Coordinated design', 'Upholstery'],
    luxury: ['Premium furniture', 'Luxury materials', 'Custom design', 'Premium upholstery', 'Branded items']
  },
  furnishings: {
    none: [],
    standard: ['Basic curtains', 'Standard blinds', 'Regular cushions'],
    premium: ['Designer curtains', 'Motorized blinds', 'Decorative cushions', 'Throws'],
    luxury: ['Premium drapes', 'Automated blinds', 'Designer cushions', 'Luxury throws', 'Rugs', 'Wall art']
  },
  appliances: {
    none: [],
    standard: ['Basic kitchen appliances', 'Standard brand'],
    premium: ['Mid-range appliances', 'Good brands', 'Built-in options'],
    luxury: ['Premium appliances', 'International brands', 'Fully built-in', 'Smart features', 'Wine cooler']
  },
  artefacts: {
    none: [],
    standard: ['Basic decor items', 'Standard artwork'],
    premium: ['Designer decor', 'Quality artwork', 'Sculptures'],
    luxury: ['Premium decor', 'Original artwork', 'Designer sculptures', 'Collectibles', 'Feature pieces']
  },
  landscape: {
    none: [],
    standard: ['Basic landscaping', 'Lawn', 'Border plants', 'Simple paving'],
    premium: ['Designer landscape', 'Themed garden', 'Water feature', 'Outdoor lighting', 'Paved pathways'],
    luxury: ['Premium landscape', 'Complex design', 'Multiple water features', 'Gazebo', 'Outdoor kitchen', 'Irrigation system']
  },
};

// Project type definitions with scope details
export const PROJECT_TYPES = {
  'interior-only': {
    label: 'Interior Design Only',
    description: 'Interior finishing, furniture, and styling',
    excludes: ['civilQuality', 'plumbing', 'electrical', 'buildingEnvelope', 'elevator'],
    baseRate: 0,
  },
  'core-shell': {
    label: 'Core & Shell',
    description: 'Structure, MEP systems, basic envelope',
    excludes: ['fixedFurniture', 'looseFurniture', 'furnishings', 'appliances', 'artefacts', 'landscape'],
    baseRate: 850,
  },
  'full-project': {
    label: 'Full Project (No Landscape)',
    description: 'Complete construction and interiors',
    excludes: ['landscape'],
    baseRate: 850,
  },
  'full-landscape': {
    label: 'Full Project with Landscape',
    description: 'Everything including outdoor spaces',
    excludes: [],
    baseRate: 850,
  },
  'renovation': {
    label: 'Renovation/Remodel',
    description: 'Updating existing structure',
    excludes: ['elevator'],
    baseRate: 700,
  },
};

const calculateConstructionCost = (
  projectType: string,
  areaInSqM: number,
  civilQuality: ComponentOption,
  buildingType: string
): number => {
  const projectConfig = PROJECT_TYPES[projectType as keyof typeof PROJECT_TYPES];
  
  if (projectConfig.excludes.includes('civilQuality')) {
    return 0; // No construction cost for interior-only projects
  }

  let baseRate = projectConfig.baseRate;
  
  // Adjust for building type
  if (buildingType === 'commercial') baseRate *= 1.3;
  else if (buildingType === 'mixed-use') baseRate *= 1.5;
  
  // Scale factor for area
  let scaleFactor = 1.0;
  if (areaInSqM < 30) scaleFactor = 1.10;
  else if (areaInSqM < 50) scaleFactor = 1.06;
  else if (areaInSqM < 100) scaleFactor = 1.03;
  
  // Quality multiplier
  let qualityMultiplier = 1.0;
  if (civilQuality === "premium") qualityMultiplier = 1.35;
  else if (civilQuality === "luxury") qualityMultiplier = 1.80;
  
  return baseRate * areaInSqM * scaleFactor * qualityMultiplier;
};

interface EstimatorContextType {
  step: number;
  totalSteps: number;
  estimate: ProjectEstimate;
  isCalculating: boolean;
  componentDetails: typeof COMPONENT_DETAILS;
  projectTypes: typeof PROJECT_TYPES;
  updateEstimate: (field: keyof ProjectEstimate, value: any) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleReset: () => void;
  handleSaveEstimate: () => void;
  handleOptionChange: (component: string, option: ComponentOption) => void;
  setStep: (step: number) => void;
  calculateRealTimeCost: () => void;
}

const EstimatorContext = createContext<EstimatorContextType | undefined>(undefined);

export const useEstimator = () => {
  const context = useContext(EstimatorContext);
  if (!context) {
    throw new Error('useEstimator must be used within EstimatorProvider');
  }
  return context;
};

const initialEstimate: ProjectEstimate = {
  state: '',
  city: '',
  projectType: 'full-project',
  buildingType: 'residential',
  area: 1000,
  areaUnit: 'sqft',
  complexity: 5,
  selectedMaterials: [],
  civilQuality: 'standard',
  plumbing: 'standard',
  electrical: 'standard',
  ac: 'standard',
  elevator: 'none',
  buildingEnvelope: 'standard',
  lighting: 'standard',
  windows: 'standard',
  ceiling: 'standard',
  surfaces: 'standard',
  fixedFurniture: 'standard',
  looseFurniture: 'standard',
  furnishings: 'standard',
  appliances: 'standard',
  artefacts: 'none',
  landscape: 'none',
  totalCost: 0,
  categoryBreakdown: {
    construction: 0,
    core: 0,
    finishes: 0,
    interiors: 0,
    landscape: 0,
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
  componentCosts: {},
};

export const EstimatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState(1);
  const [estimate, setEstimate] = useState<ProjectEstimate>(initialEstimate);
  const [isCalculating, setIsCalculating] = useState(false);
  const totalSteps = 6; // Added contact/meeting step

  const updateEstimate = (field: keyof ProjectEstimate, value: any) => {
    setEstimate(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (component: string, option: ComponentOption) => {
    updateEstimate(component as keyof ProjectEstimate, option);
  };

  const calculateRealTimeCost = () => {
    const areaInSqM = estimate.areaUnit === 'sqft' 
      ? estimate.area * 0.092903 
      : estimate.area;

    const projectConfig = PROJECT_TYPES[estimate.projectType as keyof typeof PROJECT_TYPES];
    
    const constructionCost = calculateConstructionCost(
      estimate.projectType,
      areaInSqM,
      estimate.civilQuality,
      estimate.buildingType
    );

    let coreCost = 0;
    let finishesCost = 0;
    let interiorsCost = 0;
    let landscapeCost = 0;
    const componentCosts: Record<string, number> = {};

    // Calculate component costs (respecting project type exclusions)
    const coreComponents = ['plumbing', 'electrical', 'ac', 'elevator'];
    const finishComponents = ['buildingEnvelope', 'lighting', 'windows', 'ceiling', 'surfaces'];
    const interiorComponents = ['fixedFurniture', 'looseFurniture', 'furnishings', 'appliances', 'artefacts'];
    const landscapeComponents = ['landscape'];

    // Add civil quality to component costs if not excluded
    if (!projectConfig.excludes.includes('civilQuality') && estimate.civilQuality !== 'none') {
      componentCosts.civilQuality = COMPONENT_PRICING.civilQuality[estimate.civilQuality] * areaInSqM;
    }

    coreComponents.forEach(comp => {
      if (!projectConfig.excludes.includes(comp)) {
        const value = estimate[comp as keyof ProjectEstimate] as ComponentOption;
        const cost = (COMPONENT_PRICING[comp]?.[value] || 0) * areaInSqM;
        coreCost += cost;
        if (cost > 0) componentCosts[comp] = cost;
      }
    });

    finishComponents.forEach(comp => {
      if (!projectConfig.excludes.includes(comp)) {
        const value = estimate[comp as keyof ProjectEstimate] as ComponentOption;
        const cost = (COMPONENT_PRICING[comp]?.[value] || 0) * areaInSqM;
        finishesCost += cost;
        if (cost > 0) componentCosts[comp] = cost;
      }
    });

    interiorComponents.forEach(comp => {
      if (!projectConfig.excludes.includes(comp)) {
        const value = estimate[comp as keyof ProjectEstimate] as ComponentOption;
        const cost = (COMPONENT_PRICING[comp]?.[value] || 0) * areaInSqM;
        interiorsCost += cost;
        if (cost > 0) componentCosts[comp] = cost;
      }
    });

    landscapeComponents.forEach(comp => {
      if (!projectConfig.excludes.includes(comp)) {
        const value = estimate[comp as keyof ProjectEstimate] as ComponentOption;
        const cost = (COMPONENT_PRICING[comp]?.[value] || 0) * areaInSqM;
        landscapeCost += cost;
        if (cost > 0) componentCosts[comp] = cost;
      }
    });

    const totalCost = constructionCost + coreCost + finishesCost + interiorsCost + landscapeCost;

    // Calculate timeline based on project type and building type
    let baseMonths = 8;
    if (estimate.buildingType === 'commercial') baseMonths = 10;
    else if (estimate.buildingType === 'mixed-use') baseMonths = 12;
    
    if (estimate.projectType === 'interior-only') baseMonths = 4;
    else if (estimate.projectType === 'renovation') baseMonths = 6;

    const planningMonths = Math.ceil(baseMonths * 0.15);
    const constructionMonths = Math.ceil(baseMonths * 0.55);
    const interiorsMonths = Math.ceil(baseMonths * 0.30);

    setEstimate(prev => ({
      ...prev,
      totalCost,
      componentCosts,
      categoryBreakdown: {
        construction: constructionCost,
        core: coreCost,
        finishes: finishesCost,
        interiors: interiorsCost,
        landscape: landscapeCost,
      },
      phaseBreakdown: {
        planning: totalCost * 0.10,
        construction: constructionCost + coreCost,
        interiors: finishesCost + interiorsCost + landscapeCost,
      },
      timeline: {
        totalMonths: planningMonths + constructionMonths + interiorsMonths,
        phases: {
          planning: planningMonths,
          construction: constructionMonths,
          interiors: interiorsMonths,
        },
      },
    }));
  };

  // Real-time calculation when components change
  useEffect(() => {
    if (step >= 3) {
      calculateRealTimeCost();
    }
  }, [
    estimate.projectType,
    estimate.buildingType,
    estimate.area,
    estimate.areaUnit,
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
    estimate.landscape,
    step,
  ]);

  const handleNext = () => {
    if (step < totalSteps) {
      setIsCalculating(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsCalculating(false);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setEstimate(initialEstimate);
    setStep(1);
  };

  const handleSaveEstimate = () => {
    console.log('Saving estimate:', estimate);
    // This would integrate with your backend or storage
  };

  return (
    <EstimatorContext.Provider
      value={{
        step,
        totalSteps,
        estimate,
        isCalculating,
        componentDetails: COMPONENT_DETAILS,
        projectTypes: PROJECT_TYPES,
        updateEstimate,
        handleNext,
        handlePrevious,
        handleReset,
        handleSaveEstimate,
        handleOptionChange,
        setStep,
        calculateRealTimeCost,
      }}
    >
      {children}
    </EstimatorContext.Provider>
  );
};
