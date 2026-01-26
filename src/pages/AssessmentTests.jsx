import React from 'react';
import PageLayout from '../components/PageLayout';

const AssessmentTests = () => {
    return (
        <PageLayout title="Assessment Tests">
            <div className="prose max-w-none">
                <p className="text-lg text-gray-600 mb-6">
                    Validate skills with automated and live coding assessments designed to mimic real-world engineering challenges.
                </p>
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Coding Challenges</h3>
                        <p className="text-gray-600">Language-agnostic problems that test algorithmic thinking.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">System Design</h3>
                        <p className="text-gray-600">Architecture scenarios to evaluate scalability and trade-off analysis.</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default AssessmentTests;
