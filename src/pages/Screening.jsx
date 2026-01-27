import React from 'react';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';

const Screening = () => {
    return (
        <PageLayout title="Screening Services">
            <SEO
                title="Screening Services"
                description="Comprehensive candidate screening including resume validation, phone screens, and cultural fit assessment."
            />
            <div className="prose max-w-none">
                <p className="text-lg text-gray-600 mb-8">
                    Rapidly filter candidates with our comprehensive screening process, ensuring only the most qualified talent reaches your final rounds.
                </p>
                <h3 className="text-2xl font-semibold mb-4">Our Screening Process</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Resume Validation & Analysis</li>
                    <li>Technical Phone Screens</li>
                    <li>Cultural Fit Assessment</li>
                    <li>Communication Skills Evaluation</li>
                </ul>
            </div>
        </PageLayout>
    );
};

export default Screening;
