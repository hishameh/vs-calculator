import { ProjectEstimate } from "@/types/estimator";

interface PhaseTimelineCostProps {
  estimate: ProjectEstimate;
}

interface Phase {
  name: string;
  duration: number;
  cost: number;
  percentage: number;
  color: string;
  startMonth: number;
  endMonth: number;
}

const PhaseTimelineCost = ({ estimate }: PhaseTimelineCostProps) => {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value).replace('₹', '₹');
  };

  // Red color theme palette
  const redTheme = {
    primary: "#4f090c",     // Deep maroon
    light: "#8B1518",       // Medium red
    lighter: "#B91C1C",     // Bright red
    lightest: "#DC2626",    // Light red
    accent1: "#991B1B",     // Dark red
    accent2: "#7F1D1D",     // Very dark red
  };

  // Calculate cumulative start months for each phase
  let cumulativeMonth = 1;
  const phases: Phase[] = [];

  // Only add phases that have non-zero duration
  if (estimate.timeline.phases.planning > 0) {
    const startMonth = cumulativeMonth;
    const endMonth = startMonth + estimate.timeline.phases.planning - 1;
    phases.push({
      name: "Planning & Design",
      duration: estimate.timeline.phases.planning,
      cost: estimate.phaseBreakdown.planning,
      percentage: (estimate.phaseBreakdown.planning / estimate.totalCost) * 100,
      color: redTheme.lighter,
      startMonth,
      endMonth,
    });
    cumulativeMonth = endMonth + 1;
  }

  if (estimate.timeline.phases.siteWorkFoundation > 0) {
    const startMonth = cumulativeMonth;
    const endMonth = startMonth + estimate.timeline.phases.siteWorkFoundation - 1;
    phases.push({
      name: "Site Work & Foundation",
      duration: estimate.timeline.phases.siteWorkFoundation,
      cost: estimate.phaseBreakdown.siteWorkFoundation,
      percentage: (estimate.phaseBreakdown.siteWorkFoundation / estimate.totalCost) * 100,
      color: redTheme.primary,
      startMonth,
      endMonth,
    });
    cumulativeMonth = endMonth + 1;
  }

  if (estimate.timeline.phases.superstructure > 0) {
    const startMonth = cumulativeMonth;
    const endMonth = startMonth + estimate.timeline.phases.superstructure - 1;
    phases.push({
      name: "Superstructure (Framing & Masonry)",
      duration: estimate.timeline.phases.superstructure,
      cost: estimate.phaseBreakdown.superstructure,
      percentage: (estimate.phaseBreakdown.superstructure / estimate.totalCost) * 100,
      color: redTheme.light,
      startMonth,
      endMonth,
    });
    cumulativeMonth = endMonth + 1;
  }

  if (estimate.timeline.phases.mepRoughIns > 0) {
    const startMonth = cumulativeMonth;
    const endMonth = startMonth + estimate.timeline.phases.mepRoughIns - 1;
    phases.push({
      name: "MEP & Interior Rough-ins",
      duration: estimate.timeline.phases.mepRoughIns,
      cost: estimate.phaseBreakdown.mepRoughIns,
      percentage: (estimate.phaseBreakdown.mepRoughIns / estimate.totalCost) * 100,
      color: redTheme.accent1,
      startMonth,
      endMonth,
    });
    cumulativeMonth = endMonth + 1;
  }

  if (estimate.timeline.phases.interiorFinishes > 0) {
    const startMonth = cumulativeMonth;
    const endMonth = startMonth + estimate.timeline.phases.interiorFinishes - 1;
    phases.push({
      name: "Interior Finishes & Flooring",
      duration: estimate.timeline.phases.interiorFinishes,
      cost: estimate.phaseBreakdown.interiorFinishes,
      percentage: (estimate.phaseBreakdown.interiorFinishes / estimate.totalCost) * 100,
      color: redTheme.lightest,
      startMonth,
      endMonth,
    });
    cumulativeMonth = endMonth + 1;
  }

  if (estimate.timeline.phases.exteriorFinalTouches > 0) {
    const startMonth = cumulativeMonth;
    const endMonth = startMonth + estimate.timeline.phases.exteriorFinalTouches - 1;
    phases.push({
      name: "Exterior & Final Touches",
      duration: estimate.timeline.phases.exteriorFinalTouches,
      cost: estimate.phaseBreakdown.exteriorFinalTouches,
      percentage: (estimate.phaseBreakdown.exteriorFinalTouches / estimate.totalCost) * 100,
      color: redTheme.accent2,
      startMonth,
      endMonth,
    });
  }

  const totalDuration = estimate.timeline.totalMonths;

  return (
    <div className="space-y-3">
      {/* Overall duration banner */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
        <p className="text-sm text-red-800">
          <span className="font-bold">Overall Duration:</span> {totalDuration} Months ({Math.round(totalDuration * 30)} Days)
        </p>
      </div>

      {/* Phase breakdown */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-gray-800">Project Timeline & Cost Distribution</h4>
        {phases.map((phase, index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-700 font-medium">{phase.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">
                  {phase.duration} {phase.duration === 1 ? 'Month' : 'Months'}
                </span>
                <span className="text-vs font-semibold min-w-[80px] text-right">{formatCurrency(phase.cost)}</span>
              </div>
            </div>

            {/* Timeline bar */}
            <div className="relative h-9 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
              <div
                className="absolute top-0 h-full flex items-center px-3 text-white text-xs font-medium transition-all"
                style={{
                  backgroundColor: phase.color,
                  width: `${(phase.duration / totalDuration) * 100}%`,
                  left: `${((phase.startMonth - 1) / totalDuration) * 100}%`
                }}
              >
                <span className="truncate">
                  {phase.duration >= 1 ? `${phase.duration} month${phase.duration > 1 ? 's' : ''}` : '< 1 month'}
                </span>
              </div>
            </div>

            {/* Cost percentage and month range */}
            <div className="flex justify-between text-[10px] text-gray-500 px-1">
              <span>Month {phase.startMonth}{phase.endMonth !== phase.startMonth ? ` - ${phase.endMonth}` : ''}</span>
              <span className="font-medium">{phase.percentage.toFixed(1)}% of total</span>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline ruler */}
      <div className="mt-5">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1.5 px-1">
          {Array.from({ length: Math.min(Math.ceil(totalDuration) + 1, 13) }, (_, i) => (
            <span key={i} className="text-center">M{i}</span>
          ))}
        </div>
        <div className="h-2 bg-gradient-to-r from-red-200 via-red-300 to-red-400 w-full rounded-full shadow-inner"></div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg border border-red-200 shadow-sm">
          <p className="text-[10px] text-red-600 mb-1 font-medium uppercase tracking-wide">Total Duration</p>
          <p className="text-lg font-bold text-red-900">
            {totalDuration} {totalDuration === 1 ? 'Month' : 'Months'}
          </p>
          <p className="text-[10px] text-red-700">
            {phases.length} project phases
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg border border-red-200 shadow-sm">
          <p className="text-[10px] text-red-600 mb-1 font-medium uppercase tracking-wide">Total Cost</p>
          <p className="text-lg font-bold text-red-900">
            {formatCurrency(estimate.totalCost)}
          </p>
          <p className="text-[10px] text-red-700">
            ₹{Math.round(estimate.totalCost / estimate.area).toLocaleString('en-IN')} per {estimate.areaUnit}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhaseTimelineCost;
