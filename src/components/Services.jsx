import React from 'react';
import { Code2, Bug, Database, LineChart, FileText, Video, Users, CheckSquare, GraduationCap } from 'lucide-react';

const Services = () => {
    const roles = [
        {
            title: "Full Stack Developers",
            icon: <Code2 className="w-6 h-6 text-accent" />,
            desc: "MERN, MEAN, Java, Spring, .NET experts assessed on system design and coding."
        },
        {
            title: "QA Engineers",
            icon: <Bug className="w-6 h-6 text-accent" />,
            desc: "Manual and Automation testing professionals verified for frameworks and quality standards."
        },
        {
            title: "DevOps & Cloud",
            icon: <Database className="w-6 h-6 text-accent" />,
            desc: "Cloud infrastructure, CI/CD, Kubernetes, and security experts for scalable systems."
        },
        {
            title: "Data Analysts",
            icon: <LineChart className="w-6 h-6 text-accent" />,
            desc: "SQL, Python, visualization (PowerBI/Tableau), and business metrics experts."
        },
        {
            title: "Freshers & Campus",
            icon: <GraduationCap className="w-6 h-6 text-accent" />,
            desc: "Foundation tests and role-specific evaluations to filter high-potential entry talent."
        }
    ];

    const features = [
        {
            title: "Requirement Intake",
            icon: <FileText className="w-8 h-8 text-white" />,
            desc: "We analyze your JD, tech stack, and must-have skills to align with our company-specific rubrics."
        },
        {
            title: "Assessment Tests",
            icon: <CheckSquare className="w-8 h-8 text-white" />,
            desc: "MCQ + coding + case tasks + role-specific scenarios. Custom tests based on requirements."
        },
        {
            title: "Live Technical Interviews",
            icon: <Users className="w-8 h-8 text-white" />,
            desc: "Structured interviews by domain professionals. No random questions, just standardized evaluation."
        },
        {
            title: "Artifacts & Reporting",
            icon: <Video className="w-8 h-8 text-white" />,
            desc: "You get the recording, code submission, and a detailed scorecard with a Hire/No-Hire recommendation."
        }
    ];

    return (
        <div id="services" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Roles Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-base text-accent font-semibold tracking-wide uppercase">Core Capabilities</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Supported Roles (Initial)
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        From freshers to experienced MNC professionals, our panel covers the entire spectrum.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-24">
                    {roles.map((role, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group">
                            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {role.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{role.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {role.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Core Services Grid */}
                <div className="bg-primary rounded-3xl p-8 md:p-16 overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-accent opacity-20 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-6">Hiring Quality Engine</h2>
                            <p className="text-primary-100 text-lg max-w-2xl mx-auto">
                                We provide an end-to-end screening layer that acts as your quality firewall.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
                            {features.map((feature, index) => (
                                <div key={index} className="flex gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                                        <p className="text-primary-100 leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Services;
