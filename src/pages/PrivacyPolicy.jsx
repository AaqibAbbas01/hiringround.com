import React from 'react';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
    return (
        <PageLayout title="Privacy Policy">
            <SEO
                title="Privacy Policy"
                description="Privacy Policy for Hiring Round. Learn how we collect, use, and protect your personal information."
            />
            <div className="prose max-w-none text-gray-600">
                <p className="mb-4">Last Updated: January 2026</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h3>
                <p className="mb-4">
                    Welcome to Hiring Round. We are committed to protecting your personal information and your right to privacy.
                </p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">2. Information We Collect</h3>
                <p className="mb-4">
                    We collect personal information that you provide to us such as name, address, contact information, passwords and security data, and payment information.
                </p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">3. How We Use Your Information</h3>
                <p className="mb-4">
                    We use your information to facilitate account creation and logon process, post testimonials, request feedback, and to manage user accounts.
                </p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">4. Contact Us</h3>
                <p>
                    If you have questions or comments about this policy, you may email us at privacy@hiringround.com.
                </p>
            </div>
        </PageLayout>
    );
};

export default PrivacyPolicy;
