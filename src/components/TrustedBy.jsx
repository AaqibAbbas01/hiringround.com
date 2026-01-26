import React from 'react';

const TrustedBy = () => {
    const companies = [
        "4achievers",
        "i3infosoft",
        "testrinx",
        "fleetx",
        "Reddoorz"
    ];

    // Duplicate the list to create a seamless infinite scroll
    const marqueeCompanies = [...companies, ...companies, ...companies, ...companies];

    return (
        <div className="py-12 bg-white mb-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-12">
                    Trusted by High-Growth Startups & Enterprises
                </p>

                <div className="relative w-full overflow-hidden mask-gradient">
                    <div className="flex gap-16 animate-marquee whitespace-nowrap">
                        {marqueeCompanies.map((company, index) => (
                            <div key={index} className="flex items-center gap-2 flex-shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                <span className="text-2xl font-bold text-gray-400 hover:text-gray-600">{company}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                
                .mask-gradient {
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }

                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                @media (max-width: 640px) {
                    .animate-marquee {
                        animation-duration: 15s;
                    }
                }
            `}</style>
        </div>
    );
};

export default TrustedBy;
