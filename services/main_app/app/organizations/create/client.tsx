'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, CheckCircle } from 'lucide-react';

interface FormData {
  name: string;
  type: string;
  service: string;
  badgeTimes: string;
  description: string;
  callBackURL: string;
}

export default function CreateOrgClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: 'Company',
    service: 'Software Development',
    badgeTimes: '7',
    description: '',
    callBackURL: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(5);
    } catch (error) {
      console.error('Failed to create organization:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition mb-4"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Building2 size={32} className="text-slate-900" />
            </div>
            <h1 className="text-3xl font-bold text-white">Create Organization</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex-1 flex items-center">
                <button
                  onClick={() => currentStep >= step && setCurrentStep(step)}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition ${
                    currentStep >= step
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {currentStep > step ? <CheckCircle size={24} /> : step}
                </button>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                        : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-center text-sm">
            <span className={currentStep >= 1 ? 'text-white font-semibold' : 'text-slate-400'}>
              Basic Info
            </span>
            <span className={currentStep >= 2 ? 'text-white font-semibold' : 'text-slate-400'}>
              Details
            </span>
            <span className={currentStep >= 3 ? 'text-white font-semibold' : 'text-slate-400'}>
              Settings
            </span>
            <span className={currentStep >= 4 ? 'text-white font-semibold' : 'text-slate-400'}>
              Review
            </span>
          </div>
        </div>

        {/* Success State */}
        {currentStep === 5 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-slate-900" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Organization Created!</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Your organization <span className="font-semibold text-white">{formData.name}</span> has been successfully created. You can now invite members and start awarding badges.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/organizations/1')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition"
              >
                View Organization
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-slate-700 text-white font-semibold py-3 rounded-lg hover:bg-slate-600 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-3">Organization Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Tech Startup, Marketing Team"
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition text-lg"
                />
                <p className="text-slate-400 text-sm mt-2">Choose a clear, descriptive name for your organization</p>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-3">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of your organization..."
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition h-24"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleNext}
                  disabled={!formData.name.trim()}
                  className={`flex-1 font-semibold py-3 rounded-lg transition ${
                    formData.name.trim()
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Organization Type & Service */}
        {currentStep === 2 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Organization Details</h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-3">Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  >
                    <option value="Company">Company</option>
                    <option value="Team">Team</option>
                    <option value="Guild">Guild</option>
                    <option value="Community">Community</option>
                    <option value="Startup">Startup</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-3">Service *</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  >
                    <option value="Software Development">Software Development</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">Human Resources</option>
                    <option value="Operations">Operations</option>
                    <option value="Finance">Finance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-3">Organization Type Guide</h3>
                <div className="space-y-2 text-slate-400 text-sm">
                  <p><span className="font-semibold text-white">Company:</span> Formal business entity</p>
                  <p><span className="font-semibold text-white">Team:</span> Small internal team or department</p>
                  <p><span className="font-semibold text-white">Guild:</span> Interest-based or hobby group</p>
                  <p><span className="font-semibold text-white">Community:</span> Open community with members</p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={handlePrev}
                  className="flex-1 bg-slate-700 text-white font-semibold py-3 rounded-lg hover:bg-slate-600 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Badge Settings */}
        {currentStep === 3 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Badge Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-3">Badge Award Frequency (days) *</label>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <input
                      type="number"
                      name="badgeTimes"
                      value={formData.badgeTimes}
                      onChange={handleInputChange}
                      min="1"
                      max="365"
                      className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>
                  <p className="text-slate-400 text-sm">days</p>
                </div>
                <p className="text-slate-400 text-sm mt-2">How often members can earn new badges in this organization</p>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-3">Callback URL (Optional)</label>
                <input
                  type="url"
                  name="callBackURL"
                  value={formData.callBackURL}
                  onChange={handleInputChange}
                  placeholder="https://your-domain.com/webhook"
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
                <p className="text-slate-400 text-sm mt-2">Webhook URL for badge award notifications</p>
              </div>

              <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-3">Badge Award Frequency Preview</h3>
                <div className="space-y-2 text-slate-400">
                  <p>Members will be eligible to earn a new badge every <span className="font-semibold text-white">{formData.badgeTimes} day(s)</span>.</p>
                  <p className="text-sm">This helps maintain consistent engagement and motivation within your organization.</p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={handlePrev}
                  className="flex-1 bg-slate-700 text-white font-semibold py-3 rounded-lg hover:bg-slate-600 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition"
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Review Your Organization</h2>
            
            <div className="space-y-6 mb-8">
              <div className="bg-slate-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Organization Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-600 pb-4">
                    <span className="text-slate-400">Name</span>
                    <span className="text-white font-semibold text-right">{formData.name}</span>
                  </div>
                  <div className="flex justify-between items-start border-b border-slate-600 pb-4">
                    <span className="text-slate-400">Type</span>
                    <span className="text-white font-semibold">{formData.type}</span>
                  </div>
                  <div className="flex justify-between items-start border-b border-slate-600 pb-4">
                    <span className="text-slate-400">Service</span>
                    <span className="text-white font-semibold">{formData.service}</span>
                  </div>
                  <div className="flex justify-between items-start border-b border-slate-600 pb-4">
                    <span className="text-slate-400">Badge Frequency</span>
                    <span className="text-white font-semibold">Every {formData.badgeTimes} days</span>
                  </div>
                  {formData.description && (
                    <div className="flex justify-between items-start">
                      <span className="text-slate-400">Description</span>
                      <span className="text-white font-semibold text-right max-w-xs">{formData.description}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <p className="text-blue-300 text-sm">
                  ✓ You will be set as the administrator of this organization<br/>
                  ✓ You can invite members and start awarding badges immediately<br/>
                  ✓ All settings can be modified later in the organization settings
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePrev}
                className="flex-1 bg-slate-700 text-white font-semibold py-3 rounded-lg hover:bg-slate-600 transition"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Organization'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
