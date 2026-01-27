import React from 'react';
import { ClipboardList, Users, BarChart3, FileCheck } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            id: "01",
            title: "Requirement Intake",
            desc: "Share your JD, tech stack, and must-have skills. We align them with our company-specific scoring rubrics.",
            icon: <ClipboardList className="w-8 h-8 text-primary" />
        },
        {
            id: "02",
            title: "Expert Assessment",
            desc: "Candidates go through MCQ, coding tasks, or case studies tailored to the specific role requirements.",
            icon: <FileCheck className="w-8 h-8 text-primary" />
        },
        {
            id: "03",
            title: "Live Technical Interview",
            desc: "A domain professional conducts a structured interview focusing on problem-solving and real-world scenarios.",
            icon: <Users className="w-8 h-8 text-primary" />
        },
        {
            id: "04",
            title: "Decide with Data",
            desc: "Receive a detailed scorecard, interview recording, and a clear Hire/Consider/Reject recommendation.",
            icon: <BarChart3 className="w-8 h-8 text-primary" />
        }
    ];

    return (
        <div id="how-it-works" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900">How Hiring Round Works</h2>
                    <p className="mt-4 text-xl text-gray-500">A seamless extension of your recruitment team.</p>
                </div>

                <div className="relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>

                    <div className="grid md:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="bg-white p-6 text-center group">
                                <div className="w-20 h-20 mx-auto bg-white border-4 border-secondary rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-accent transition-colors duration-300 relative">
                                    {step.icon}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                                        {step.id}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">{step.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
