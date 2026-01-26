import React from 'react';
import PageLayout from '../components/PageLayout';
import Pricing from '../components/Pricing'; // Reusing the existing component!

const PricingPage = () => {
    // We already have a Pricing component, but it might need to be wrapped.
    // The Pricing component likely has its own section wrapper.
    // Let's import it and see. If it duplicates layout, we might adjust or just render it.
    // Since PageLayout handles navbar, we just need the content.
    // The existing Pricing component is likely a full section.
    return (
        <PageLayout title="Pricing Plans">
            <div className="text-center mb-8">
                <p className="text-lg text-gray-600">Transparent pricing for teams of all sizes.</p>
            </div>
            {/* We can reuse the existing Pricing section component logic or content */}
            <div className="-mt-12">
                <Pricing />
            </div>
        </PageLayout>
    );
};

export default PricingPage;
