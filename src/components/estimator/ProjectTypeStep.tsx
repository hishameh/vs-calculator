
import { motion } from "framer-motion";
import { Building2, Home, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedText from "@/components/AnimatedText";

type ProjectType = "residential" | "commercial" | "mixed-use";

interface ProjectOption {
  id: ProjectType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ProjectTypeStepProps {
  selectedType: string;
  onSelect: (type: ProjectType) => void;
}

const ProjectTypeStep = ({ selectedType, onSelect }: ProjectTypeStepProps) => {
  const projectOptions: ProjectOption[] = [
    {
      id: "residential",
      title: "Residential",
      description: "Houses, apartments, and living spaces",
      icon: <Home className="size-6" />
    },
    {
      id: "commercial",
      title: "Commercial",
      description: "Offices, retail, and business spaces",
      icon: <Building className="size-6" />
    },
    {
      id: "mixed-use",
      title: "Mixed-Use",
      description: "Combined residential and commercial spaces",
      icon: <Building2 className="size-6" />
    }
  ];

  return (
    <div>
      <AnimatedText 
        text="What type of project are you planning?"
        className="text-2xl font-display mb-8 text-center"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {projectOptions.map((option) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: projectOptions.findIndex(o => o.id === option.id) * 0.1 }}
            className={cn(
              "group flex flex-col justify-between border rounded-xl p-6 cursor-pointer transition-all duration-300",
              selectedType === option.id 
                ? "border-vs bg-vs/5" 
                : "border-primary/10 hover:border-primary/30"
            )}
            onClick={() => onSelect(option.id as ProjectType)}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "flex-shrink-0 flex items-center justify-center size-12 rounded-lg transition-colors",
                selectedType === option.id 
                  ? "bg-vs text-white" 
                  : "bg-primary/5 text-primary/70 group-hover:bg-primary/10"
              )}>
                {option.icon}
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2 text-[#4f090c]">{option.title}</h3>
                <p className="text-[#4f090c]/80">{option.description}</p>
              </div>
            </div>
            
            <div className={cn(
              "mt-4 h-1 rounded-full bg-vs/20 overflow-hidden",
              selectedType === option.id ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            )}>
              <motion.div 
                className="h-full bg-vs" 
                initial={{ width: "0%" }}
                animate={{ width: selectedType === option.id ? "100%" : "0%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 text-center text-[#4f090c]/70 text-sm">
        <p>Choose the option that best describes your construction project</p>
      </div>
    </div>
  );
};

export default ProjectTypeStep;
