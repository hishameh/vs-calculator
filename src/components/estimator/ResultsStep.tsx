import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Download, ArrowLeft, CheckCircle } from 'lucide-react';
import { ProjectEstimate } from '@/types/estimator';

interface ResultsStepProps {
  estimate: ProjectEstimate;
  onReset: () => void;
  onSave: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ estimate, onReset, onSave }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  // Simplified architect fee - 8% of construction cost
  const professionalFee = Math.round(estimate.totalCost * 0.08);
  const costPerSqft = Math.round(estimate.totalCost / estimate.area);
  const feePerSqft = Math.round(professionalFee / estimate.area);
  const totalWithFee = estimate.totalCost + professionalFee;
  const totalPerSqft = Math.round(totalWithFee / estimate.area);

  const handleShare = async () => {
    const shareText = `Project Estimate - ${estimate.city}\n${estimate.area} ${estimate.areaUnit} ${estimate.projectType}\nConstruction: ${formatCurrency(estimate.totalCost)}\nProfessional Fee: ${formatCurrency(professionalFee)}\nTotal: ${formatCurrency(totalWithFee)}`;
    
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Project Estimate', text: shareText });
      } else {
        navigator.clipboard.writeText(shareText);
        alert('Copied to clipboard!');
      }
    } catch (error) {
      console.log('Share failed');
    }
  };

  const pricingList = [
    { label: 'Civil Quality', value: estimate.civilQuality },
    { label: 'Plumbing', value: estimate.plumbing },
    { label: 'Electrical', value: estimate.electrical },
    { label: 'AC', value: estimate.ac },
    { label: 'Elevator', value: estimate.elevator },
    { label: 'Building Envelope', value: estimate.buildingEnvelope },
    { label: 'Lighting', value: estimate.lighting },
    { label: 'Windows', value: estimate.windows },
    { label: 'Ceiling', value: estimate.ceiling },
    { label: 'Surfaces', value: estimate.surfaces },
    { label: 'Fixed Furniture', value: estimate.fixedFurniture },
    { label: 'Loose Furniture', value: estimate.looseFurniture },
    { label: 'Furnishings', value: estimate.furnishings },
    { label: 'Appliances', value: estimate.appliances },
    { label: 'Artefacts', value: estimate.artefacts },
  ].filter(item => item.value !== 'none');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Project Summary Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-vs-dark mb-2">Your Complete Project Estimate</h2>
        <p className="text-sm text-muted-foreground">
          {estimate.area.toLocaleString()} {estimate.areaUnit} • {estimate.projectType} • {estimate.city}, {estimate.state}
        </p>
      </div>

      {/* Main Cost Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Construction Cost */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-semibold text-blue-900">Construction Cost</h3>
            <span className="text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded-full font-medium">
              {formatCurrency(costPerSqft)}/{estimate.areaUnit}
            </span>
          </div>
          <p className="text-3xl font-bold text-blue-900 mb-2">
            {formatCurrency(estimate.totalCost)}
          </p>
          <p className="text-xs text-blue-700">Complete construction including materials, labor & execution</p>
        </div>

        {/* Professional Fee */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-semibold text-purple-900">Architecture Services</h3>
            <span className="text-xs bg-purple-200 text-purple-900 px-2 py-1 rounded-full font-medium">
              {formatCurrency(feePerSqft)}/{estimate.areaUnit}
            </span>
          </div>
          <p className="text-3xl font-bold text-purple-900 mb-2">
            {formatCurrency(professionalFee)}
          </p>
          <p className="text-xs text-purple-700">Design, drawings, approvals & supervision (8% of construction)</p>
        </div>
      </div>

      {/* Total Investment - Highlighted */}
      <div className="bg-gradient-to-br from-vs/10 to-vs/5 p-8 rounded-2xl text-center border-2 border-vs/30 shadow-lg">
        <h3 className="text-sm text-vs-dark/70 mb-2 uppercase tracking-wide">Total Project Investment</h3>
        <p className="text-5xl font-bold text-vs mb-4">
          {formatCurrency(totalWithFee)}
        </p>
        <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
          <div className="bg-white px-4 py-2 rounded-lg">
            <span className="text-vs-dark/70">Per {estimate.areaUnit}: </span>
            <span className="font-bold text-vs">{formatCurrency(totalPerSqft)}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg">
            <span className="text-vs-dark/70">Timeline: </span>
            <span className="font-bold text-vs">{estimate.timeline.totalMonths} months</span>
          </div>
        </div>
      </div>

      {/* What's Included - Transparent Pricing */}
      <div className="glass-card border border-primary/5 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-vs-dark mb-4">Complete Transparent Pricing</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Construction Package */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">Construction Package</h4>
            <p className="text-lg font-bold text-blue-900 mb-3">{formatCurrency(estimate.totalCost)}</p>
            <ul className="text-xs text-blue-700 space-y-1.5">
              <li className="flex items-start gap-1">
                <CheckCircle size={12} className="mt-0.5 flex-shrink-0" />
                <span>Complete structural work</span>
              </li>
              <li className="flex items-start gap-1">
                <CheckCircle size={12} className="mt-0.5 flex-shrink-0" />
                <span>All systems (plumbing, electrical, HVAC)</span>
              </li>
              <li className="flex items-start gap-1">
                <CheckCircle size={12} className="mt-0.5 flex-shrink-0" />
                <span>Quality finishes & fixtures</span>
              </li>
              <li className="flex items-start gap-1">
                <CheckCircle size={12} className="mt-0.5 flex-shrink-0" />
                <span>Complete interior fit-outs</span>
              </li>
            </ul>
          </div>

          {/* Architecture Services */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2 text-sm">Architecture Services</h4>
            <p className="text-lg font-bold text-purple-900 mb-3">{formatCurrency(professionalFee)}</p>
            <ul className="text-xs text-purple-700 space-y-1.5">
              <li className="flex items-start gap-1">
                <CheckCircle size={12} className="mt-0.5 flex-shrink-0" />
                <span>Complete design & drawings</span>
              </li>
              <li className="flex items-start gap-1">
                <CheckCircle size={12} className="mt-0.5 flex-shrink-0" />
                <span>3D visualizations & renders</span>
              </li>
              <li className="flex items-start gap-1">
                <CheckCircle size={12} className="mt-0.5 flex-shrink-0" />
                <span>Full site supervision</span>
              </li>
              <li className="flex items-start gap-1">
                <CheckCircle size={12} className="mt-0.5 flex-shrink-0" />
                <span>Authority approvals & liaison</span>
              </li>
            </ul>
          </div>

          {/* Value Proposition */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2 text-sm">Our Promise</h4>
            <p className="text-lg font-bold text-green-900 mb-3">Zero Hidden Costs</p>
            <ul className="text-xs text-green-700 space-y-1.5">
              <li className="flex items-start gap-1">
                <CheckCircle size={12} className="mt-0.5 flex-shrink-0" />
                <span>Fixed transparent pricing</span>
              </li>
              <li className="flex items-start gap-1">
                <CheckCircle size={12} className="mt-0.5 flex-shrink-0" />
                <span>Detailed itemized breakdown</span>
              </li>
              <li className="flex items-start gap-1">
                <CheckCircle size={12} className="mt-0.5 flex-shrink-0" />
                <span>Quality assurance included</span>
              </li>
              <li className="flex items-start gap-1">
                <CheckCircle size={12} className="mt-0.5 flex-shrink-0" />
                <span>Post-completion warranty</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Cost Distribution Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span>Investment Breakdown</span>
            <span>{formatCurrency(totalWithFee)}</span>
          </div>
          <div className="h-10 bg-gray-100 rounded-full overflow-hidden flex text-xs font-medium text-white">
            <div 
              className="bg-blue-600 flex items-center justify-center"
              style={{ width: `${(estimate.categoryBreakdown.construction / estimate.totalCost * 100)}%` }}
            >
              Structure {(estimate.categoryBreakdown.construction / estimate.totalCost * 100).toFixed(0)}%
            </div>
            <div 
              className="bg-green-600 flex items-center justify-center"
              style={{ width: `${(estimate.categoryBreakdown.core / estimate.totalCost * 100)}%` }}
            >
              Systems {(estimate.categoryBreakdown.core / estimate.totalCost * 100).toFixed(0)}%
            </div>
            <div 
              className="bg-yellow-600 flex items-center justify-center"
              style={{ width: `${(estimate.categoryBreakdown.finishes / estimate.totalCost * 100)}%` }}
            >
              Finishes {(estimate.categoryBreakdown.finishes / estimate.totalCost * 100).toFixed(0)}%
            </div>
            <div 
              className="bg-purple-600 flex items-center justify-center"
              style={{ width: `${(estimate.categoryBreakdown.interiors / estimate.totalCost * 100)}%` }}
            >
              Interiors {(estimate.categoryBreakdown.interiors / estimate.totalCost * 100).toFixed(0)}%
            </div>
            <div 
              className="bg-indigo-600 flex items-center justify-center"
              style={{ width: `${(professionalFee / totalWithFee * 100)}%` }}
            >
              Services {(professionalFee / totalWithFee * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="glass-card border border-primary/5 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-vs-dark mb-4">Project Timeline</h3>
        <div className="space-y-4">
          {[
            { phase: 'Planning & Design', duration: estimate.timeline.phases.planning, color: 'blue' },
            { phase: 'Construction', duration: estimate.timeline.phases.construction, color: 'vs' },
            { phase: 'Finishing & Interiors', duration: estimate.timeline.phases.interiors, color: 'green' }
          ].map((phase, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium">{phase.phase}</span>
                <span className="text-muted-foreground">{phase.duration} months</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-${phase.color}-500 rounded-full`}
                  style={{ 
                    width: `${(phase.duration / estimate.timeline.totalMonths * 100)}%`,
                    backgroundColor: phase.color === 'vs' ? '#7A1E1F' : undefined
                  }}
                />
              </div>
            </div>
          ))}
          <div className="text-center pt-2 text-sm font-semibold">
            Total Duration: {estimate.timeline.totalMonths} months ({Math.round(estimate.timeline.totalMonths * 30)} days)
          </div>
        </div>
      </div>

      {/* Selected Components */}
      <div className="glass-card border border-primary/5 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-vs-dark mb-4">Your Selected Specifications</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {pricingList.map((item, index) => (
            <div 
              key={index}
              className="flex justify-between items-center p-3 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-medium">{item.label}</span>
              <span className="text-xs font-bold capitalize bg-vs/10 text-vs px-2 py-1 rounded">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Important Disclaimer */}
      <div className="bg-orange-50 border-l-4 border-orange-400 rounded-lg p-4 text-sm">
        <p className="font-semibold text-orange-800 mb-2">📋 Important Information:</p>
        <ul className="list-disc pl-5 space-y-1 text-orange-700">
          <li>This is an <strong>indicative estimate</strong> based on {estimate.city} market rates</li>
          <li>Final costs may vary ±10% based on site conditions & material availability</li>
          <li>Professional fee of <strong>8%</strong> covers complete architectural services</li>
          <li>Timeline is approximate and subject to approvals & weather conditions</li>
          <li><strong>Contact us for a detailed fixed-price quotation</strong></li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center pt-4">
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-vs hover:bg-vs-light text-white font-semibold rounded-lg transition-colors shadow-lg"
        >
          <Share2 size={18} />
          Share Estimate
        </button>
        <button 
          onClick={onSave}
          className="flex items-center gap-2 px-6 py-3 bg-vs hover:bg-vs-light text-white font-semibold rounded-lg transition-colors shadow-lg"
        >
          <Download size={18} />
          Download PDF
        </button>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 border-2 border-vs text-vs hover:bg-vs/5 font-semibold rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          New Estimate
        </button>
      </div>
    </motion.div>
  );
};

export default ResultsStep;
