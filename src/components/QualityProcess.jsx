import React from 'react';
import { ShieldCheck, UserCheck, Scale, Award } from 'lucide-react';

const QualityProcess = () => {
    return (
        <div className="py-20 bg-secondary/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900">Consistency You Can Trust</h2>
                    <p className="mt-4 text-xl text-gray-500">How we deliver standardized quality at scale.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <Scale className="w-10 h-10 text-primary mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Standardized Rubrics</h3>
                        <p className="text-gray-600">
                            Each role has a specific rubric covering fundamentals, problem-solving, tooling, and communication to remove bias.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <UserCheck className="w-10 h-10 text-primary mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Vetted Interviewers</h3>
                        <p className="text-gray-600">
                            Network of professionals from top MNCs/startups. Gated through trial interviews and role-based certification.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Quality Assurance</h3>
                        <p className="text-gray-600">
                            Internal QA team performs random audits of recordings. Monthly calibration sessions for interviewers.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <Award className="w-10 h-10 text-primary mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Gold Standard</h3>
                        <p className="text-gray-600">
                            We maintain "Gold Standard" sample interviews per role for training and benchmarking.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QualityProcess;
