import React, { useState } from 'react';
import { Check, Info } from 'lucide-react';

const Pricing = ({ onPlanSelect }) => {
    const [activeTab, setActiveTab] = useState('pay-per-candidate');

    const handlePlanSelect = (planName, price) => {
        if (onPlanSelect) {
            onPlanSelect(`Interested in ${planName} plan (Price: ${price})`);
        }
    };

    return (
        <div id="pricing" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-xl text-gray-500">Choose the flexible model that suits your hiring volume.</p>
                </div>

                <div className="flex justify-center mb-12">
                    <div className="bg-gray-100 p-1 rounded-full flex">
                        <button
                            onClick={() => setActiveTab('pay-per-candidate')}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'pay-per-candidate' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Pay Per Candidate
                        </button>
                        <button
                            onClick={() => setActiveTab('subscriptions')}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'subscriptions' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Startups Subscription
                        </button>
                    </div>
                </div>

                {activeTab === 'pay-per-candidate' && (
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Starter Tier */}
                        <div className="border border-gray-200 rounded-2xl p-8 hover:border-primary transition-colors">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Starter Screening</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-extrabold text-gray-900">₹499</span>
                                <span className="text-gray-500 ml-1">/candidate</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-6">Filter resumes and basics before the live round.</p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                                    Resume Screening
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                                    Basic Assessment
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                                    Summary Report
                                </li>
                            </ul>
                            <button
                                onClick={() => handlePlanSelect('Starter Screening', '₹499/candidate')}
                                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-colors"
                            >
                                Choose Starter
                            </button>
                        </div>

                        {/* Pro Tier (Highlighted) */}
                        <div className="border-2 border-primary rounded-2xl p-8 transform scale-105 shadow-xl relative bg-white">
                            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                                POPULAR
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Pro Interview</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-extrabold text-gray-900">₹1,999</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-6">Standard 45-60 min technical round.</p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                    Everything in Starter
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                    60 min Live Interview
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                    Interview Recording
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                    Detailed Scorecard
                                </li>
                            </ul>
                            <button
                                onClick={() => handlePlanSelect('Pro Interview', '₹1,999')}
                                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary/25"
                            >
                                Get Started
                            </button>
                        </div>

                        {/* Premium Tier */}
                        <div className="border border-gray-200 rounded-2xl p-8 hover:border-primary transition-colors">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Premium Deep Dive</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-extrabold text-gray-900">₹6,999</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-6">For senior roles and system design.</p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                                    Senior/Lead Interviewer
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                                    System Design Round
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                                    Verification Signals
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                                    Extended Report
                                </li>
                            </ul>
                            <button
                                onClick={() => handlePlanSelect('Premium Deep Dive', '₹6,999')}
                                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-colors"
                            >
                                Contact Sales
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'subscriptions' && (
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="border border-gray-200 rounded-2xl p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Startup Plan</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-extrabold text-gray-900">₹19,999</span>
                                <span className="text-gray-500 ml-1">/month</span>
                            </div>
                            <p className="text-gray-600 mb-6">Perfect for early-stage teams hiring consistently.</p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-accent" /> Up to 10 Interviews included
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-accent" /> Discounted add-ons
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-accent" /> Priority Scheduling
                                </li>
                            </ul>
                            <button
                                onClick={() => handlePlanSelect('Startup Subscription', '₹19,999/month')}
                                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors"
                            >
                                Subscribe Now
                            </button>
                        </div>

                        <div className="border border-gray-200 rounded-2xl p-8 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Scale Plan</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-extrabold text-gray-900">₹49,999</span>
                                <span className="text-gray-500 ml-1">/month</span>
                            </div>
                            <p className="text-gray-600 mb-6">For high-growth scaleups and staffing agencies.</p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-accent" /> Higher Volume (25+ Interviews)
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-accent" /> Dedicated Account Manager
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                    <Check className="w-5 h-5 text-accent" /> Custom Rubrics Included
                                </li>
                            </ul>
                            <button
                                onClick={() => handlePlanSelect('Scale Subscription', '₹49,999/month')}
                                className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl transition-colors"
                            >
                                Talk to Sales
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-16 bg-blue-50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-100">
                    <div className="flex gap-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Info className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Enterprise or Agency?</h4>
                            <p className="text-gray-600 text-sm">We offer custom SLAs, ATS integrations, and white-label screening for staffing firms.</p>
                        </div>
                    </div>
                    <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
                        Contact Enterprise Sales
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
