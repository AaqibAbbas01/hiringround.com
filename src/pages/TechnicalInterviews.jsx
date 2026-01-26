import React from 'react';
import PageLayout from '../components/PageLayout';

const TechnicalInterviews = () => {
    return (
        <PageLayout title="Technical Interviews">
            <div className="prose max-w-none">
                <p className="text-lg text-gray-600 mb-6">
                    Our technical interview service connects you with elite industry experts who conduct rigorous technical evaluations.
                </p>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Expert-Led Evaluations</h3>
                <p className="mb-4 text-gray-600">
                    We match your candidates with senior engineers from top tech companies. They evaluate code quality, problem-solving skills, and system design aptitude relative to your specific role requirements.
                </p>
            </div>
        </PageLayout>
    );
};

export default TechnicalInterviews;
