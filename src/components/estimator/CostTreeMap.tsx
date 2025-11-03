
import { useRef, useEffect, useState } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { ProjectEstimate } from "@/types/estimator";

interface CostTreeMapProps {
  estimate: ProjectEstimate;
  showLabels?: boolean;
}

interface TreeMapItem {
  name: string;
  size?: number;
  children?: TreeMapItem[];
  color?: string;
  percentage?: number;
}

// Enhanced color scheme for better readability
const COLORS = [
  "#8889DD", "#8DC77B", "#E2CF45", "#F89C74", "#E79796", 
  "#B085F5", "#71C2CC", "#F8C12D", "#A5D297"
];

// Color legend mapping
const COLOR_CATEGORIES = {
  "Construction": "#8889DD",
  "Core Components": "#8DC77B",
  "Finishes": "#E2CF45",
  "Interiors": "#F89C74"
};

const CostTreeMap = ({ estimate, showLabels = false }: CostTreeMapProps) => {
  const [data, setData] = useState<TreeMapItem[]>([]);
  
  useEffect(() => {
    // Convert estimate data to treemap format
    const formatData = () => {
      const baseRate = estimate.totalCost / estimate.area;
      
      const coreItems: TreeMapItem[] = [];
      if (estimate.plumbing) {
        const size = estimate.area * baseRate * 0.06;
        coreItems.push({ 
          name: "Plumbing", 
          size,
          percentage: (size / estimate.totalCost) * 100
        });
      }
      if (estimate.electrical) {
        const size = estimate.area * baseRate * 0.08;
        coreItems.push({ 
          name: "Electrical", 
          size,
          percentage: (size / estimate.totalCost) * 100
        });
      }
      if (estimate.ac) {
        const size = estimate.area * baseRate * 0.07;
        coreItems.push({ 
          name: "AC Systems", 
          size,
          percentage: (size / estimate.totalCost) * 100
        });
      }
      if (estimate.elevator) {
        const size = estimate.area * baseRate * 0.05;
        coreItems.push({ 
          name: "Elevator", 
          size,
          percentage: (size / estimate.totalCost) * 100
        });
      }
      
      const finishItems: TreeMapItem[] = [];
      if (estimate.lighting) {
        const size = estimate.area * baseRate * 0.04;
        finishItems.push({ 
          name: "Lighting", 
          size,
          percentage: (size / estimate.totalCost) * 100
        });
      }
      if (estimate.windows) {
        const size = estimate.area * baseRate * 0.06;
        finishItems.push({ 
          name: "Windows", 
          size,
          percentage: (size / estimate.totalCost) * 100
        });
      }
      if (estimate.ceiling) {
        const size = estimate.area * baseRate * 0.04;
        finishItems.push({ 
          name: "Ceiling", 
          size,
          percentage: (size / estimate.totalCost) * 100
        });
      }
      if (estimate.surfaces) {
        const size = estimate.area * baseRate * 0.09;
        finishItems.push({ 
          name: "Surfaces", 
          size,
          percentage: (size / estimate.totalCost) * 100
        });
      }
      
      const interiorItems: TreeMapItem[] = [];
      if (estimate.fixedFurniture) {
        const size = estimate.area * baseRate * 0.08;
        interiorItems.push({ 
          name: "Fixed Furniture", 
          size,
          percentage: (size / estimate.totalCost) * 100
        });
      }
      if (estimate.looseFurniture) {
        const size = estimate.area * baseRate * 0.06;
        interiorItems.push({ 
          name: "Loose Furniture", 
          size,
          percentage: (size / estimate.totalCost) * 100
        });
      }
      if (estimate.furnishings) {
        const size = estimate.area * baseRate * 0.04;
        interiorItems.push({ 
          name: "Furnishings", 
          size,
          percentage: (size / estimate.totalCost) * 100
        });
      }
      if (estimate.appliances) {
        const size = estimate.area * baseRate * 0.05;
        interiorItems.push({ 
          name: "Appliances", 
          size,
          percentage: (size / estimate.totalCost) * 100
        });
      }
      
      // Add base construction costs
      const constructionItems: TreeMapItem[] = [
        { 
          name: "Structure", 
          size: estimate.area * baseRate * 0.15,
          percentage: (estimate.area * baseRate * 0.15 / estimate.totalCost) * 100
        },
        { 
          name: "Foundation", 
          size: estimate.area * baseRate * 0.08,
          percentage: (estimate.area * baseRate * 0.08 / estimate.totalCost) * 100
        },
        { 
          name: "Walls", 
          size: estimate.area * baseRate * 0.05,
          percentage: (estimate.area * baseRate * 0.05 / estimate.totalCost) * 100
        }
      ];
      
      return [
        {
          name: "Total Cost",
          children: [
            { name: "Construction", children: constructionItems, color: COLOR_CATEGORIES["Construction"] },
            { name: "Core Components", children: coreItems, color: COLOR_CATEGORIES["Core Components"] },
            { name: "Finishes", children: finishItems, color: COLOR_CATEGORIES["Finishes"] },
            { name: "Interiors", children: interiorItems, color: COLOR_CATEGORIES["Interiors"] }
          ]
        }
      ];
    };
    
    setData(formatData());
  }, [estimate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-vs">{formatCurrency(payload[0].value)}</p>
          {payload[0].payload.percentage && (
            <p className="text-xs text-gray-500">
              {payload[0].payload.percentage.toFixed(1)}% of total
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="h-[400px] w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={data}
              dataKey="size"
              stroke="#fff"
              fill="#8884d8"
              content={<CustomizedContent showLabels={showLabels} />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Loading cost breakdown...
          </div>
        )}
      </div>
      
      {/* Color legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {Object.entries(COLOR_CATEGORIES).map(([category, color]) => (
          <div key={category} className="flex items-center">
            <div 
              className="w-4 h-4 mr-2 rounded-sm" 
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-xs text-gray-600">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom treemap rectangle component
const CustomizedContent = (props: any) => {
  const { root, depth, x, y, width, height, index, name, value, showLabels } = props;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 
            ? COLORS[Math.floor((index / root.children.length) * COLORS.length) % COLORS.length] 
            : COLORS[(depth + index) % COLORS.length],
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {/* Show labels on all depths if showLabels is true */}
      {(showLabels || depth === 1) && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={depth === 1 ? 14 : 12}
          fontWeight={depth === 1 ? "bold" : "normal"}
          className="drop-shadow-md"
          style={{ textShadow: "0px 0px 3px rgba(0,0,0,0.7)" }}
        >
          {name}
        </text>
      )}
      {(showLabels || depth === 1) && (
        <text
          x={x + width / 2}
          y={y + height / 2 + (depth === 1 ? 20 : 16)}
          textAnchor="middle"
          fill="#fff"
          fontSize={depth === 1 ? 12 : 10}
          className="drop-shadow-md"
          style={{ textShadow: "0px 0px 3px rgba(0,0,0,0.7)" }}
        >
          {formatCurrency(value)}
        </text>
      )}
      {!showLabels && depth === 2 && width > 70 && height > 25 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#fff"
            fontSize={10}
            style={{ textShadow: "0px 0px 3px rgba(0,0,0,0.7)" }}
          >
            {name}
          </text>
          {width > 100 && (
            <text
              x={x + width / 2}
              y={y + height / 2 + 14}
              textAnchor="middle"
              fill="#fff"
              fontSize={8}
              style={{ textShadow: "0px 0px 3px rgba(0,0,0,0.7)" }}
            >
              {formatCurrency(value)}
            </text>
          )}
        </>
      )}
    </g>
  );
};

export default CostTreeMap;
