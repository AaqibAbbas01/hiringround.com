import React from 'react';
import { CheckCircle, PlayCircle } from 'lucide-react';

const Hero = ({ onRegisterClick }) => {
    return (
        <div className="relative bg-gradient-to-br from-primary-dark via-primary to-primary-light pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-white space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium text-secondary">Trusted by 500+ Assessed Professionals</span>
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                            We help you <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
                                hire faster
                            </span> with verified technical screening
                        </h1>

                        <p className="text-lg text-gray-200 max-w-xl leading-relaxed">
                            Global Hiring Quality Engine. Structured interviews, role-specific rubrics, and recorded evidence done by experienced professionals. Reduce time-to-hire by 30–60%.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="#pricing" className="bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg shadow-accent/30 flex items-center justify-center gap-2">
                                View Pricing
                            </a>
                            <button
                                onClick={onRegisterClick}
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-lg font-bold text-lg transition-all backdrop-blur-sm flex items-center justify-center gap-2"
                            >
                                Get Started
                            </button>
                        </div>

                        <div className="pt-8 flex items-center gap-6 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-accent" />
                                <span>Recorded Interviews</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-accent" />
                                <span>Expert Panels</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-accent" />
                                <span>Detailed Reports</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden lg:block">
                        <div className="absolute -inset-4 bg-accent/20 rounded-2xl blur-2xl"></div>
                        <div className="relative bg-white rounded-xl shadow-2xl border border-white/10 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                            {/* Mockup UI representing a Dashboard or Video Interview */}
                            <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center gap-2">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="ml-4 bg-white px-3 py-1 rounded-md text-xs text-gray-400 border border-gray-200 flex-1">
                                    hiringround.online
                                </div>
                            </div>
                            <div className="p-1 bg-gray-900 aspect-video relative flex items-center justify-center">
                                <video
                                    src="/Online_Interview_Video_Generation.mp4"
                                    className="w-full h-full object-cover rounded-md"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                                {/* Floating Cards */}
                                <div className="absolute top-8 right-8 bg-white p-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce shadow-black/20">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">Score</p>
                                        <p className="text-sm font-bold text-green-600">9.2/10</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave Divider */}
            <div className="absolute bottom-0 w-full leading-none z-10">
                <svg className="block w-full h-12 md:h-24 lg:h-32" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>
        </div>
    );
};

export default Hero;
