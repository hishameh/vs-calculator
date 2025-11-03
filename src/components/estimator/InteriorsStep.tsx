import { Sofa, Armchair, Flower, Tv } from "lucide-react";
import { ComponentOption } from "@/types/estimator";
import CategorySelectionGrid from "./CategorySelectionGrid";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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
    
    // 🔑 INITIAL STATE FIX: Use a synchronization object for cleaner code
    const initialEnabledState = {
        fixedFurniture: !!fixedFurniture,
        looseFurniture: !!looseFurniture,
        furnishings: !!furnishings,
        appliances: !!appliances
    };

    // Track which optional components are enabled
    const [enabledComponents, setEnabledComponents] = useState(initialEnabledState);

    // ✅ FIX 1: Single, clean synchronization effect (Replaces two original effects)
    // Syncs the internal state with the external context props.
    useEffect(() => {
        // Create the new desired state based on current props (!!"" is false, !!"basic" is true)
        const newEnabledState = {
            fixedFurniture: !!fixedFurniture,
            looseFurniture: !!looseFurniture,
            furnishings: !!furnishings,
            appliances: !!appliances
        };

        // Only update state if there's a difference to avoid infinite loops
        if (
            newEnabledState.fixedFurniture !== enabledComponents.fixedFurniture ||
            newEnabledState.looseFurniture !== enabledComponents.looseFurniture ||
            newEnabledState.furnishings !== enabledComponents.furnishings ||
            newEnabledState.appliances !== enabledComponents.appliances
        ) {
            setEnabledComponents(newEnabledState);
        }
    
        // NOTE: If you only want the *toggle switch* to control enabling/disabling, 
        // you would remove this useEffect entirely and rely solely on `handleToggleComponent` 
        // and the fact that `onOptionChange` works.
        // However, since you want selection to implicitly enable the switch, this sync is required.
    // We only depend on the props here, not the local state, to prevent loops.
    }, [fixedFurniture, looseFurniture, furnishings, appliances]); 

    // ✅ NOTE: The original first useEffect is now redundant and should be removed. 
    // The context handler already ensures the parent state is cleared (set to "").

  // Handle toggling component inclusion
  const handleToggleComponent = (component: string, enabled: boolean) => {
    setEnabledComponents(prev => ({ ...prev, [component]: enabled }));
    
    if (!enabled) {
      // When the switch is turned OFF, clear the value in the parent context
      onOptionChange(component, '');
    } else {
      // When the switch is turned ON, set a default value in the parent context
      onOptionChange(component, 'basic');
    }
  };
    // ... rest of the component (categories, selectedOptions, return) remains the same ...

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
            <div key={key} className={cn(
              "flex items-center justify-between p-4 rounded-lg border transition-colors",
              enabledComponents[key as keyof typeof enabledComponents] 
                ? "border-vs/30 bg-vs/5" 
                : "border-gray-200 bg-gray-50"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  enabledComponents[key as keyof typeof enabledComponents] ? "bg-vs/10" : "bg-gray-200"
                )}>{category.icon}</div>
                <Label htmlFor={`toggle-${key}`} className={cn(
                  enabledComponents[key as keyof typeof enabledComponents] ? "text-foreground" : "text-gray-400"
                )}>{category.title}</Label>
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
