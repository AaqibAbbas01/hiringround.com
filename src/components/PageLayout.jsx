import React from 'react';
import Navbar from './Navbar';
import RegistrationModal from './RegistrationModal';

const PageLayout = ({ title, showRegister = true, children }) => {
    const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
    const [registrationRole, setRegistrationRole] = React.useState('employer');

    const openRegister = (role = 'employer') => {
        setRegistrationRole(role);
        setIsRegisterOpen(true);
    };

    return (
        <div className="bg-white min-h-screen">
            <Navbar onRegisterClick={() => openRegister('employer')} />

            <div className="pt-24 pb-12 bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {typeof children === 'function' ? children({ openRegister }) : children}
            </main>

            {showRegister && (
                <RegistrationModal
                    isOpen={isRegisterOpen}
                    onClose={() => setIsRegisterOpen(false)}
                    initialRole={registrationRole}
                />
            )}
        </div>
    );
};

export default PageLayout;
