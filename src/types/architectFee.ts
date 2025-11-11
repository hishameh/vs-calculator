export type Typology = {
  model: 'PERCENT' | 'SQM';
  rate: number;
  min: number;
};

export type ArchitectFeeRates = {
  typologies: Record<string, Typology>;
  clientMultipliers: Record<string, number>;
  complexity: Record<string, number>;
  vizPrices: Record<string, number>;
  extraRender: Record<string, number>;
  conversionRates: Record<string, number>;
  premiumMultiplier: number;
  rushMultiplier: number;
  profitMargin: number;
  taxRate: number;
  minimumFeeStudio: number;
};

export type ArchitectFeeCalculation = {
  baseFee: number;
  ffeFee: number;
  landscapeFee: number;
  vizFee: number;
  overheadAllocation: number;
  profit: number;
  tax: number;
  totalFee: number;
  currency: string;
};

// Export the default rates
export const defaultArchitectFeeRates: ArchitectFeeRates = {
  typologies: {
    "Individual House": { model: "PERCENT", rate: 0.08, min: 20000 },
    "Residential Block": { model: "PERCENT", rate: 0.05, min: 50000 },
    "Commercial": { model: "PERCENT", rate: 0.04, min: 80000 },
    "FF&E Procurement": { model: "PERCENT", rate: 0.10, min: 30000 },
    "Landscape - Detailed": { model: "SQM", rate: 150, min: 25000 },
  },
  clientMultipliers: {
    "Friend/Family": 0.85,
    "Individual": 1.0,
    "Corporate": 1.15,
    "Developer": 1.10,
  },
  complexity: {
    "Simple": 0.9,
    "Standard": 1.0,
    "Premium": 1.2,
    "Luxury": 1.5,
  },
  vizPrices: {
    "None": 0,
    "Standard": 25000,
    "Premium": 50000,
    "Luxury": 100000,
  },
  extraRender: {
    "Interior": 5000,
    "Exterior": 7500,
  },
  conversionRates: {
    "INR": 1,
    "USD": 83,
    "EUR": 90,
  },
  premiumMultiplier: 1.0,
  rushMultiplier: 1.25,
  profitMargin: 0.15,
  taxRate: 0.18,
  minimumFeeStudio: 50000,
};

// Keep the old defaultRates for backward compatibility if needed
export const defaultRates = {
  typologies: {
    "Individual House": { model: "PERCENT" as const, rate: 0.08, min: 20000 },
    "Residential Block": { model: "PERCENT" as const, rate: 0.05, min: 50000 },
    "Commercial": { model: "PERCENT" as const, rate: 0.04, min: 80000 },
  },
  clientMultipliers: {
    "Individual": 1.0,
    "Corporate": 1.4,
    "Developer": 1.3,
  },
  complexity: {
    "Basic": 1.0,
    "Standard": 1.15,
    "Premium": 1.35,
  },
  vizPrices: {
    "Basic": 3000,
    "Standard": 12000,
    "Premium": 33000,
  },
  extraRender: {
    "Basic": 1500,
    "Standard": 2500,
    "Premium": 3500,
  },
  conversionRates: {
    "INR": 1,
    "USD": 83.0,
    "EUR": 90.0,
  },
  premiumMultiplier: 1.15,
  rushMultiplier: 1.25,
  profitMargin: 0.15,
  taxRate: 0.05,
  minimumFeeStudio: 7000,
};
