import React from 'react';
import PageLayout from '../components/PageLayout';

const Careers = () => {
    return (
        <PageLayout title="Careers at SkillxHire">
            {({ openRegister }) => (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Team</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        We are always looking for passionate individuals to help us build the future of technical recruitment.
                    </p>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-8 inline-block">
                        <p className="text-blue-800 font-medium">
                            Currently, we have no open full-time positions. However, we are always onboarding new Interviewers!
                        </p>
                        <button
                            onClick={() => openRegister('interviewer')}
                            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Apply as Interviewer
                        </button>
                    </div>
                </div>
            )}
        </PageLayout>
    );
};

export default Careers;
