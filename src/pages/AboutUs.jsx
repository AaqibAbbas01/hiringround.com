import React from 'react';
import PageLayout from '../components/PageLayout';

const AboutUs = () => {
    return (
        <PageLayout title="About Us">
            <div className="prose max-w-none text-gray-600">
                <p className="text-lg mb-6">
                    SkillxHire is on a mission to transform technical hiring. We believe that engineering talent should be evaluated by engineers, for engineers.
                </p>
                <p className="mb-6">
                    Founded in 2024, we have built a network of over 500+ assessed interviewers from top tech companies including Google, Amazon, and Microsoft.
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Vision</h3>
                <p>
                    To create a world where every technical hire is a perfect match, reducing bias and increasing efficiency in the recruitment process.
                </p>
            </div>
        </PageLayout>
    );
};

export default AboutUs;
