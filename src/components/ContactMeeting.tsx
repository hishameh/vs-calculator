// components/ContactMeeting.tsx
import React, { useState } from 'react';
import { useEstimator } from '@/contexts/EstimatorContext';
import { Calendar, Mail, Phone, MessageSquare, Clock, CheckCircle, Download, Send } from 'lucide-react';

const ContactMeeting: React.FC = () => {
  const { estimate, handlePrevious, handleSaveEstimate, projectTypes } = useEstimator();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
    contactMethod: 'email',
  });
  const [submitted, setSubmitted] = useState(false);

  const projectConfig = projectTypes[estimate.projectType as keyof typeof projectTypes];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your backend
    handleSaveEstimate();
    console.log('Form submitted:', { ...formData, estimate });
    setSubmitted(true);
  };

  const handleDownloadEstimate = () => {
    // Generate PDF or detailed report
    console.log('Downloading estimate:', estimate);
    alert('Your detailed estimate will be downloaded shortly!');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center" style={{ cursor: 'default' }}>
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Thank You for Your Interest!
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              We've received your request and will get back to you within 24 hours. A copy of your estimate has been sent to your email.
            </p>
            
            <div className="bg-slate-50 rounded-xl p-6 mb-8">
              <h2 className="font-semibold text-slate-900 mb-4">What happens next?</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-slate-700">Our team will review your project requirements</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-slate-700">We'll schedule a consultation at your preferred time</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-slate-700">Receive a detailed proposal with refined cost estimates</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleDownloadEstimate}
                className="px-6 py-3 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition-all duration-200 flex items-center justify-center gap-2"
                style={{ cursor: 'pointer' }}
              >
                <Download className="w-5 h-5" />
                Download Estimate
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
                style={{ cursor: 'pointer' }}
              >
                Create Another Estimate
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" style={{ cursor: 'default' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Schedule a Consultation
          </h1>
          <p className="text-lg text-slate-600">
            Let's discuss your {projectConfig.label.toLowerCase()} project in detail
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                      style={{ cursor: 'text' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                      style={{ cursor: 'text' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+91 98765 43210"
                    style={{ cursor: 'text' }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      style={{ cursor: 'pointer' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Preferred Time
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="">Select time</option>
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
                      <option value="evening">Evening (3 PM - 6 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred Contact Method *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'email', icon: Mail, label: 'Email' },
                      { value: 'phone', icon: Phone, label: 'Phone' },
                      { value: 'whatsapp', icon: MessageSquare, label: 'WhatsApp' },
                    ].map((method) => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, contactMethod: method.value })}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2
                          ${formData.contactMethod === method.value 
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-slate-200 hover:border-slate-300'
                          }
                        `}
                        style={{ cursor: 'pointer' }}
                      >
                        <method.icon className="w-6 h-6" />
                        <span className="text-sm font-medium">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Additional Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Tell us more about your project, any specific requirements, or questions you have..."
                    style={{ cursor: 'text' }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  style={{ cursor: 'pointer' }}
                >
                  <Send className="w-5 h-5" />
                  Submit & Schedule Consultation
                </button>
              </form>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-4">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Project Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="pb-4 border-b border-slate-200">
                  <div className="text-sm text-slate-600 mb-1">Total Estimate</div>
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(estimate.totalCost)}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {formatCurrency(estimate.totalCost / estimate.area)} per {estimate.areaUnit === 'sqft' ? 'sq.ft.' : 'sq.m.'}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-600 mb-1">Project Type</div>
                  <div className="font-semibold text-slate-900">{projectConfig.label}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-600 mb-1">Building Type</div>
                  <div className="font-semibold text-slate-900 capitalize">{estimate.buildingType}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-600 mb-1">Area</div>
                  <div className="font-semibold text-slate-900">
                    {estimate.area} {estimate.areaUnit === 'sqft' ? 'sq.ft.' : 'sq.m.'}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-600 mb-1">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Timeline
                  </div>
                  <div className="font-semibold text-slate-900">{estimate.timeline.totalMonths} months</div>
                </div>
              </div>

              <button
                onClick={handleDownloadEstimate}
                className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg font-medium hover:bg-slate-200 transition-all duration-200 flex items-center justify-center gap-2 mb-4"
                style={{ cursor: 'pointer' }}
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>

              <div className="text-xs text-slate-500 text-center">
                Your estimate will be saved and sent to your email
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={handlePrevious}
            className="px-6 py-3 text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200"
            style={{ cursor: 'pointer' }}
          >
            ← Back to Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactMeeting;
