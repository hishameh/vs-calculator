import { jsPDF } from 'jspdf';
import { ProjectEstimate } from '@/types/estimator';

export const generateEstimatePDF = (estimate: ProjectEstimate) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = 20;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  // Professional fee calculation
  const professionalFee = Math.round(estimate.totalCost * 0.08);
  const totalWithFee = estimate.totalCost + professionalFee;
  const costPerSqft = Math.round(estimate.totalCost / estimate.area);
  const feePerSqft = Math.round(professionalFee / estimate.area);
  const totalPerSqft = Math.round(totalWithFee / estimate.area);

  // HEADER - Brand colored
  doc.setFillColor(122, 30, 31); // VS color
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Project Cost Estimate', pageWidth / 2, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Vanilla & Somethin\' | VS Collective LLP', pageWidth / 2, 25, { align: 'center' });
  yPos = 45;

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // PROJECT OVERVIEW SECTION
  doc.setFillColor(240, 240, 245);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 40, 'F');
  yPos += 8;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Project Overview', margin + 5, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Location: ${estimate.city}, ${estimate.state}`, margin + 5, yPos);
  yPos += 6;
  doc.text(`Project Type: ${estimate.projectType.toUpperCase()}`, margin + 5, yPos);
  yPos += 6;
  doc.text(`Area: ${estimate.area.toLocaleString()} ${estimate.areaUnit}`, margin + 5, yPos);
  yPos += 6;
  doc.text(`Timeline: ${estimate.timeline.totalMonths} months`, margin + 5, yPos);
  yPos += 15;

  // INVESTMENT BREAKDOWN - Main highlight
  doc.setFillColor(250, 245, 245);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 55, 'F');
  doc.setDrawColor(122, 30, 31);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 55);
  yPos += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(122, 30, 31);
  doc.text('TOTAL PROJECT INVESTMENT', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  doc.setFontSize(24);
  doc.text(formatCurrency(totalWithFee), pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`${formatCurrency(totalPerSqft)} per ${estimate.areaUnit}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 12;

  // Cost Components - Side by side
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  const leftX = margin + 10;
  const rightX = pageWidth / 2 + 5;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Construction Cost:', leftX, yPos);
  doc.text(formatCurrency(estimate.totalCost), leftX + 50, yPos);
  
  doc.text('Architecture Services:', rightX, yPos);
  doc.text(formatCurrency(professionalFee), rightX + 50, yPos);
  yPos += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`${formatCurrency(costPerSqft)}/${estimate.areaUnit}`, leftX + 50, yPos);
  doc.text(`${formatCurrency(feePerSqft)}/${estimate.areaUnit} (8%)`, rightX + 50, yPos);
  yPos += 15;

  // WHAT'S INCLUDED
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('What\'s Included', margin, yPos);
  yPos += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const leftItems = [
    '✓ Complete structural work',
    '✓ All MEP systems installation',
    '✓ Quality finishes & fixtures',
    '✓ Interior fit-outs',
  ];

  const rightItems = [
    '✓ Complete design & drawings',
    '✓ 3D visualizations',
    '✓ Full site supervision',
    '✓ Authority approvals',
  ];

  leftItems.forEach((item) => {
    doc.text(item, leftX, yPos);
    yPos += 5;
  });

  yPos -= 20; // Reset for right column
  rightItems.forEach((item) => {
    doc.text(item, rightX, yPos);
    yPos += 5;
  });

  yPos += 10;

  // COST DISTRIBUTION
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Cost Distribution', margin, yPos);
  yPos += 8;

  const breakdown = [
    { label: 'Base Construction', value: estimate.categoryBreakdown.construction },
    { label: 'Core Systems', value: estimate.categoryBreakdown.core },
    { label: 'Finishes', value: estimate.categoryBreakdown.finishes },
    { label: 'Interiors', value: estimate.categoryBreakdown.interiors },
    { label: 'Professional Services', value: professionalFee },
  ];

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  breakdown.forEach(item => {
    const percentage = ((item.value / totalWithFee) * 100).toFixed(1);
    doc.text(item.label, margin + 5, yPos);
    doc.text(`${percentage}%`, pageWidth - margin - 50, yPos);
    doc.text(formatCurrency(item.value), pageWidth - margin - 5, yPos, { align: 'right' });
    yPos += 6;
  });

  yPos += 10;

  // PROJECT TIMELINE
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Project Timeline', margin, yPos);
  yPos += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const phases = [
    { name: 'Planning & Design', duration: estimate.timeline.phases.planning },
    { name: 'Construction', duration: estimate.timeline.phases.construction },
    { name: 'Finishing & Interiors', duration: estimate.timeline.phases.interiors },
  ];

  phases.forEach(phase => {
    doc.text(`${phase.name}: ${phase.duration} months`, margin + 5, yPos);
    yPos += 6;
  });

  yPos += 10;

  // IMPORTANT NOTES
  doc.setFillColor(255, 245, 230);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 35, 'F');
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 100, 0);
  doc.text('Important Information', margin + 5, yPos);
  yPos += 7;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const notes = [
    `• This is an indicative estimate based on ${estimate.city} market rates`,
    '• Final costs may vary ±10% based on site conditions',
    '• Professional fee of 8% covers complete architectural services',
    '• Contact us for a detailed fixed-price quotation',
  ];

  notes.forEach(note => {
    doc.text(note, margin + 5, yPos);
    yPos += 5;
  });

  // FOOTER
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.text('Vanilla & Somethin\' | design@vanillasometh.in | www.vanillasometh.in', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, footerY + 4, { align: 'center' });

  // Save
  const fileName = `Estimate_${estimate.city}_${estimate.area}${estimate.areaUnit}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
