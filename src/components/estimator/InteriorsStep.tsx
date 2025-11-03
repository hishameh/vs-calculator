import { Sofa, Armchair, Flower, Tv } from "lucide-react";
import { ComponentOption } from "@/types/estimator";
import CategorySelectionGrid from "./CategorySelectionGrid";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
// ❌ REMOVED: useState and useEffect imports related to enabledComponents
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

  // 🛑 REMOVED: const [enabledComponents, setEnabledComponents] = useState(...)
  // 🛑 REMOVED: The two useEffect blocks

  // ✅ NEW: Function to check if a component is currently enabled (has a value)
  const isComponentEnabled = (componentValue: ComponentOption): boolean => !!componentValue;

  // Handle toggling component inclusion
  const handleToggleComponent = (component: string, enabled: boolean) => {
    // NO local state update needed here. We update the context directly.
    if (!enabled) {
      // If turning OFF, set the context state to empty string
      onOptionChange(component, '');
    } else {
      // If turning ON, set a default value in the context state
      onOptionChange(component, 'basic');
    }
  };

  const categories = {
    fixedFurniture: {
      title: "Fixed Furniture",
      icon: <Sofa className="size-6" />,
      options: { /* ... */ },
      optional: true,
      enabled: isComponentEnabled(fixedFurniture) // ✅ DERIVED from PROPS
    },
    looseFurniture: {
      title: "Loose Furniture",
      icon: <Armchair className="size-6" />,
      options: { /* ... */ },
      optional: true,
      enabled: isComponentEnabled(looseFurniture) // ✅ DERIVED from PROPS
    },
    furnishings: {
      title: "Decorative Elements",
      icon: <Flower className="size-6" />,
      options: { /* ... */ },
      optional: true,
      enabled: isComponentEnabled(furnishings) // ✅ DERIVED from PROPS
    },
    appliances: {
      title: "Appliances & Fixtures",
      icon: <Tv className="size-6" />,
      options: { /* ... */ },
      optional: true,
      enabled: isComponentEnabled(appliances) // ✅ DERIVED from PROPS
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
          {Object.entries(categories).map(([key, category]) => {
            const isEnabled = isComponentEnabled(selectedOptions[key as keyof typeof selectedOptions]); // ✅ CHECK PROP VALUE
            return (
            <div key={key} className={cn(
              "flex items-center justify-between p-4 rounded-lg border transition-colors",
              isEnabled // ✅ USE DERIVED VALUE
                ? "border-vs/30 bg-vs/5" 
                : "border-gray-200 bg-gray-50"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isEnabled ? "bg-vs/10" : "bg-gray-200" // ✅ USE DERIVED VALUE
                )}>{category.icon}</div>
                <Label htmlFor={`toggle-${key}`} className={cn(
                  isEnabled ? "text-foreground" : "text-gray-400" // ✅ USE DERIVED VALUE
                )}>{category.title}</Label>
              </div>
              <Switch 
                id={`toggle-${key}`}
                checked={isEnabled} // ✅ USE DERIVED VALUE
                onCheckedChange={(checked) => handleToggleComponent(key, checked)}
              />
            </div>
            )}
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
