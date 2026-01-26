import React from 'react';
import PageLayout from '../components/PageLayout';

const HelpCenter = () => {
    return (
        <PageLayout title="Help Center">
            <div className="max-w-3xl mx-auto">
                <div className="relative mb-12">
                    <input type="text" className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 outline-none text-lg" placeholder="Search for help..." />
                    <svg className="w-6 h-6 text-gray-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>

                <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">How do I schedule an interview?</h3>
                        <p className="text-gray-600">You can schedule an interview directly from your dashboard. Select the technology, seniority, and preferred time slot.</p>
                    </div>
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">What happens if a candidate doesn't show up?</h3>
                        <p className="text-gray-600">If a candidate is a no-show, you can reschedule the interview at no additional cost within 24 hours.</p>
                    </div>
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Can I customize the question bank?</h3>
                        <p className="text-gray-600">Yes, Enterprise plans include custom question bank integration.</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default HelpCenter;
