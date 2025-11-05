import { ComponentOption } from "@/types/estimator";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QualityLevelSelectorProps {
  component: string;
  currentValue: ComponentOption;
  onChange: (value: ComponentOption) => void;
  required?: boolean;
}

const QualityLevelSelector = ({
  component,
  currentValue,
  onChange,
  required = false,
}: QualityLevelSelectorProps) => {
  // Define quality levels with descriptions and prices per sqm
  const qualityLevels: ComponentOption[] = [
    {
      label: "Not Required",
      value: "not_required",
      price: 0,
      description: "This component will not be included in the construction",
    },
    {
      label: "Economy",
      value: "economy",
      price: component === "civilQuality" ? 50 : component === "plumbing" ? 40 : component === "ac" ? 80 : component === "electrical" ? 35 : 150,
      description: "Basic quality materials and standard installation. Suitable for budget-conscious projects with minimal requirements.",
    },
    {
      label: "Standard",
      value: "standard",
      price: component === "civilQuality" ? 100 : component === "plumbing" ? 75 : component === "ac" ? 150 : component === "electrical" ? 60 : 250,
      description: "Good quality materials with professional installation. Balanced approach for most residential and commercial projects.",
    },
    {
      label: "Premium",
      value: "premium",
      price: component === "civilQuality" ? 180 : component === "plumbing" ? 120 : component === "ac" ? 250 : component === "electrical" ? 100 : 400,
      description: "High-grade materials and expert installation. Enhanced durability, aesthetics, and performance for quality-focused projects.",
    },
  ];

  // Filter out "Not Required" for required components
  const availableLevels = required
    ? qualityLevels.filter((level) => level.value !== "not_required")
    : qualityLevels;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {availableLevels.map((level) => (
          <TooltipProvider key={level.value} delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onChange(level)}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                    currentValue.value === level.value
                      ? "border-vs bg-vs/5 shadow-sm"
                      : "border-gray-200 hover:border-vs/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{level.label}</span>
                    <Info className="size-4 text-muted-foreground" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {level.price === 0 ? (
                      <span className="font-medium">SAR 0</span>
                    ) : (
                      <>
                        <span className="font-medium">SAR {level.price}</span>
                        <span>/m²</span>
                      </>
                    )}
                  </div>
                  {currentValue.value === level.value && (
                    <div className="absolute top-2 right-2 size-2 rounded-full bg-vs" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">{level.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      {currentValue.value && (
        <p className="text-xs text-muted-foreground pl-1">
          Selected: <span className="font-medium">{currentValue.label}</span>
          {currentValue.price > 0 && (
            <span> - SAR {currentValue.price}/m²</span>
          )}
        </p>
      )}
    </div>
  );
};

export default QualityLevelSelector;
