
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ProjectEstimate } from "@/types/estimator";

interface TimelineChartProps {
  estimate: ProjectEstimate;
}

interface TimelineData {
  name: string;
  months: number;
  cost: number;
  fill: string;
}

const TimelineChart = ({ estimate }: TimelineChartProps) => {
  const [data, setData] = useState<TimelineData[]>([]);

  useEffect(() => {
    const generateTimelineData = () => {
      // Use predefined values for more accurate timeline planning
      const projectType = estimate.projectType;
      const area = estimate.area;
      const isLarge = area > (estimate.areaUnit === 'sqft' ? 2000 : 185); // Convert to approx sqm
      
      // Base durations for residential projects
      let planningMonths = 2;
      let foundationMonths = 1.5;
      let structureMonths = 3;
      let coreMonths = 2;
      let finishesMonths = 2;
      let interiorsMonths = 1.5;
      
      // Adjust for project type
      if (projectType === 'commercial') {
        planningMonths += 1;
        foundationMonths += 0.5;
        structureMonths += 1;
        coreMonths += 0.5;
      } else if (projectType === 'mixed-use') {
        planningMonths += 1.5;
        foundationMonths += 1;
        structureMonths += 1.5;
        coreMonths += 1;
        finishesMonths += 0.5;
      }
      
      // Adjust for size
      if (isLarge) {
        foundationMonths += 0.5;
        structureMonths += 1;
        coreMonths += 0.5;
        finishesMonths += 1;
        interiorsMonths += 0.5;
      }
      
      // Format values to appropriate precision
      planningMonths = Math.max(1, Math.round(planningMonths));
      foundationMonths = Math.max(1, Math.round(foundationMonths));
      structureMonths = Math.max(1, Math.round(structureMonths));
      coreMonths = Math.max(1, Math.round(coreMonths));
      finishesMonths = Math.max(1, Math.round(finishesMonths));
      interiorsMonths = Math.max(1, Math.round(interiorsMonths));
      
      // Calculate costs using distribution percentages
      const totalCost = estimate.totalCost;
      const planningCost = totalCost * 0.10;
      const foundationCost = totalCost * 0.15;
      const structureCost = totalCost * 0.25;
      const coreCost = totalCost * 0.20;
      const finishesCost = totalCost * 0.15;
      const interiorsCost = totalCost * 0.15;
      
      const timelineData: TimelineData[] = [
        {
          name: "Planning & Approvals",
          months: planningMonths,
          cost: planningCost,
          fill: "#64B5F6" // Blue
        },
        {
          name: "Foundation & Site Work",
          months: foundationMonths,
          cost: foundationCost,
          fill: "#81C784" // Green
        },
        {
          name: "Structure & Framework",
          months: structureMonths,
          cost: structureCost,
          fill: "#FFB74D" // Orange
        },
        {
          name: "Core Systems Installation",
          months: coreMonths,
          cost: coreCost,
          fill: "#BA68C8" // Purple
        },
        {
          name: "Finishes & Surfaces",
          months: finishesMonths,
          cost: finishesCost,
          fill: "#F06292" // Pink
        },
        {
          name: "Interiors & Furnishing",
          months: interiorsMonths,
          cost: interiorsCost,
          fill: "#4DB6AC" // Teal
        }
      ];

      return timelineData;
    };

    setData(generateTimelineData());
  }, [estimate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const totalMonths = data.months;
      const totalCost = estimate.totalCost;
      const costPercentage = Math.round((data.cost / totalCost) * 100);
      
      return (
        <div className="bg-white p-3 border rounded-lg shadow-md">
          <p className="font-medium">{data.name}</p>
          <p><span className="font-medium">Duration:</span> {data.months} months</p>
          <p><span className="font-medium">Cost:</span> {formatCurrency(data.cost)}</p>
          <p className="text-xs text-gray-600">{costPercentage}% of total budget</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-4">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 140, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis 
              type="number" 
              label={{ value: 'Months', position: 'insideBottom', offset: -10 }} 
              domain={[0, 'dataMax']}
              tickCount={10}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={140} 
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="months" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 text-sm text-vs-dark/70 bg-gray-50 p-4 rounded-lg">
        <div className="font-medium mb-2 flex items-center">
          <span className="text-vs mr-2">Timeline Notes:</span>
        </div>
        <ul className="list-disc pl-5 space-y-1">
          <li>Timeline based on industry standards for {estimate.projectType} projects of this size</li>
          <li>Actual durations may vary based on site conditions and contractor availability</li>
          <li>Phases may overlap in actual construction scheduling</li>
          <li>Weather delays and material procurement times not included</li>
          <li>Approvals and permits may take longer depending on location</li>
        </ul>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.fill }}></div>
              <span>{item.name}: {item.months} mo.</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineChart;
