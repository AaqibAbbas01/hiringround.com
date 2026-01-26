import React from 'react';
import PageLayout from '../components/PageLayout';

const CaseStudies = () => {
    return (
        <PageLayout title="Case Studies">
            <div className="space-y-8">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-full md:w-1/3 h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">TechCorp</span>
                    </div>
                    <div className="w-full md:w-2/3">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">How TechCorp Reduced Hiring Time by 50%</h3>
                        <p className="text-gray-600 mb-6">
                            "SkillxHire's on-demand interviewers allowed us to scale our hiring capability instantly without burning out our engineering team."
                        </p>
                        <div className="flex gap-8">
                            <div>
                                <span className="block text-3xl font-bold text-primary">50%</span>
                                <span className="text-sm text-gray-500">Faster Hiring</span>
                            </div>
                            <div>
                                <span className="block text-3xl font-bold text-primary">98%</span>
                                <span className="text-sm text-gray-500">Candidate Satisfaction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default CaseStudies;
