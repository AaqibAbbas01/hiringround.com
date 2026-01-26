import React from 'react';
import { XCircle, CheckCircle } from 'lucide-react';

const WhyChooseUs = () => {
    const problems = [
        "Time drain: too many resumes, low-quality interviews",
        "Inconsistent screening standards",
        "Limited in-house expertise for niche roles",
        "Bad hiring cost & coordination overhead"
    ];

    const solutions = [
        "Reduce time-to-hire by 30–60%",
        "Standardized rubrics & scoring",
        "Expert Panel: Senior MNC professionals",
        "Credible, structured evaluation & reporting"
    ];

    return (
        <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 gap-16 items-center">

                    <div className="mb-12 lg:mb-0">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                            Stop Wasting Engineering Hours on <span className="text-red-500">Bad Interviews</span>
                        </h2>
                        <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
                            <ul className="space-y-4">
                                {problems.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-lg text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                            Start Hiring with the <span className="text-primary">Quality Engine</span>
                        </h2>
                        <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
                            <ul className="space-y-4">
                                {solutions.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                                        <span className="text-lg text-gray-700 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WhyChooseUs;
