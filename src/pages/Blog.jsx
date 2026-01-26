import React from 'react';
import PageLayout from '../components/PageLayout';

const Blog = () => {
    return (
        <PageLayout title="Blog">
            <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-6">
                            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Hiring Tips</span>
                            <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">Top 10 Interview Questions for 2026</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Discover the essential technical questions every hiring manager needs to ask to identify top talent.
                            </p>
                            <a href="#" className="text-primary font-semibold text-sm hover:underline">Read More &rarr;</a>
                        </div>
                    </div>
                ))}
            </div>
        </PageLayout>
    );
};

export default Blog;
