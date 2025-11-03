
import { Sofa, Armchair, Flower, Tv } from "lucide-react";
import { ComponentOption } from "@/types/estimator";
import CategorySelectionGrid from "./CategorySelectionGrid";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface InteriorsStepProps {
  fixedFurniture: ComponentOption;
  looseFurniture: ComponentOption;
  furnishings: ComponentOption;
  appliances: ComponentOption;
  onOptionChange: (component: string, option: ComponentOption) => void;
}

const InteriorsStep = ({ 
  fixedFurniture, 
  looseFurniture, 
  furnishings, 
  appliances, 
  onOptionChange 
}: InteriorsStepProps) => {
  // Track which optional components are enabled
  const [enabledComponents, setEnabledComponents] = useState({
    fixedFurniture: !!fixedFurniture,
    looseFurniture: !!looseFurniture,
    furnishings: !!furnishings,
    appliances: !!appliances
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
    if (fixedFurniture && !enabledComponents.fixedFurniture) {
      setEnabledComponents(prev => ({ ...prev, fixedFurniture: true }));
    }
    if (looseFurniture && !enabledComponents.looseFurniture) {
      setEnabledComponents(prev => ({ ...prev, looseFurniture: true }));
    }
    if (furnishings && !enabledComponents.furnishings) {
      setEnabledComponents(prev => ({ ...prev, furnishings: true }));
    }
    if (appliances && !enabledComponents.appliances) {
      setEnabledComponents(prev => ({ ...prev, appliances: true }));
    }
  }, [fixedFurniture, looseFurniture, furnishings, appliances, enabledComponents]);

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
    fixedFurniture: {
      title: "Fixed Furniture",
      icon: <Sofa className="size-6" />,
      options: {
        basic: "Laminate finish storage units and basic built-ins",
        mid: "Veneer finish with better hardware and organization",
        premium: "Custom designed units with premium finishes and automation"
      },
      optional: true,
      enabled: enabledComponents.fixedFurniture
    },
    looseFurniture: {
      title: "Loose Furniture",
      icon: <Armchair className="size-6" />,
      options: {
        basic: "Ready-to-assemble furniture with basic finishes",
        mid: "Mid-range furniture with better fabrics and materials",
        premium: "Designer furniture with premium materials and craftsmanship"
      },
      optional: true,
      enabled: enabledComponents.looseFurniture
    },
    furnishings: {
      title: "Decorative Elements",
      icon: <Flower className="size-6" />,
      options: {
        basic: "Standard curtains, basic accessories, and artwork",
        mid: "Designer fabrics, better accessories, and curated art",
        premium: "Custom drapery, high-end accessories, and statement art pieces"
      },
      optional: true,
      enabled: enabledComponents.furnishings
    },
    appliances: {
      title: "Appliances & Fixtures",
      icon: <Tv className="size-6" />,
      options: {
        basic: "Standard appliances with essential features",
        mid: "Energy-efficient models with better functionality",
        premium: "Smart appliances with premium brands and features"
      },
      optional: true,
      enabled: enabledComponents.appliances
    }
  };

  const selectedOptions = {
    fixedFurniture,
    looseFurniture,
    furnishings,
    appliances
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select Interior Components</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose which interior elements to include in your project. You can toggle components on or off as needed.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(categories).map(([key, category]) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-lg border">
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
        sectionTitle="Interiors & Furnishings"
        sectionDescription="Select quality level for each interior component you want to include."
      />
    </div>
  );
};

export default InteriorsStep;
