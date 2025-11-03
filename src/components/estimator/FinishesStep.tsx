
import { Lightbulb, PaintBucket, Aperture, Wind } from "lucide-react";
import { ComponentOption } from "@/types/estimator";
import CategorySelectionGrid from "./CategorySelectionGrid";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface FinishesStepProps {
  lighting: ComponentOption;
  windows: ComponentOption;
  ceiling: ComponentOption;
  surfaces: ComponentOption;
  onOptionChange: (component: string, option: ComponentOption) => void;
}

const FinishesStep = ({ 
  lighting, 
  windows, 
  ceiling, 
  surfaces, 
  onOptionChange 
}: FinishesStepProps) => {
  // Track which optional components are enabled
  const [enabledComponents, setEnabledComponents] = useState({
    lighting: !!lighting,
    windows: !!windows,
    ceiling: !!ceiling,
    surfaces: !!surfaces
  });

  // When a component is disabled, update the parent
  useEffect(() => {
    Object.entries(enabledComponents).forEach(([component, enabled]) => {
      if (!enabled && (component as keyof typeof enabledComponents)) {
        onOptionChange(component, '');
      }
    });
  }, [enabledComponents, onOptionChange]);

  // When a component option is selected but the component is disabled, enable it
  useEffect(() => {
    if (lighting && !enabledComponents.lighting) {
      setEnabledComponents(prev => ({ ...prev, lighting: true }));
    }
    if (windows && !enabledComponents.windows) {
      setEnabledComponents(prev => ({ ...prev, windows: true }));
    }
    if (ceiling && !enabledComponents.ceiling) {
      setEnabledComponents(prev => ({ ...prev, ceiling: true }));
    }
    if (surfaces && !enabledComponents.surfaces) {
      setEnabledComponents(prev => ({ ...prev, surfaces: true }));
    }
  }, [lighting, windows, ceiling, surfaces, enabledComponents]);

  // Handle toggling component inclusion
  const handleToggleComponent = (component: string, enabled: boolean) => {
    setEnabledComponents(prev => ({ ...prev, [component]: enabled }));
    
    if (!enabled) {
      onOptionChange(component, '');
    } else {
      onOptionChange(component, 'basic');
    }
  };

  const categories = {
    lighting: {
      title: "Lighting Solutions",
      icon: <Lightbulb className="size-6" />,
      options: {
        basic: "Standard recessed lighting and basic fixtures",
        mid: "Designer light fixtures with accent lighting",
        premium: "Smart lighting system with custom fixtures and automation"
      },
      optional: true,
      enabled: enabledComponents.lighting
    },
    windows: {
      title: "Windows & Doors",
      icon: <Wind className="size-6" />,
      options: {
        basic: "Standard uPVC windows and basic doors",
        mid: "Double-glazed aluminum windows and engineered wood doors",
        premium: "Smart windows with sound insulation and designer doors"
      },
      optional: true,
      enabled: enabledComponents.windows
    },
    ceiling: {
      title: "Ceiling Treatments",
      icon: <Aperture className="size-6" />,
      options: {
        basic: "Basic POP finish with simple design",
        mid: "Gypsum with cove lighting and recesses",
        premium: "Designer ceilings with multiple levels and integrated features"
      },
      optional: true,
      enabled: enabledComponents.ceiling
    },
    surfaces: {
      title: "Wall & Floor Surfaces",
      icon: <PaintBucket className="size-6" />,
      options: {
        basic: "Standard paint finishes and basic tiles",
        mid: "Premium paints with accent walls and better quality tiles",
        premium: "Designer wall coverings and premium imported materials"
      },
      optional: true,
      enabled: enabledComponents.surfaces
    }
  };

  const selectedOptions = {
    lighting,
    windows,
    ceiling,
    surfaces
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select Finishes</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose which finishes to include in your estimate. You can toggle components on or off as needed.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(categories).map(([key, category]) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-lg border hover:border-vs/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-vs/10 p-2 rounded-lg">{category.icon}</div>
                <Label htmlFor={`toggle-${key}`}>{category.title}</Label>
              </div>
              <Switch 
                id={`toggle-${key}`}
                checked={enabledComponents[key as keyof typeof enabledComponents]}
                onCheckedChange={(checked) => handleToggleComponent(key, checked)}
              />
            </div>
          ))}
        </div>
      </div>
      
      <CategorySelectionGrid
        categories={categories}
        selectedOptions={selectedOptions}
        onOptionChange={onOptionChange}
        sectionTitle="Finishes & Surfaces"
        sectionDescription="Select quality level for each finish component you want to include."
      />
    </div>
  );
};

export default FinishesStep;
