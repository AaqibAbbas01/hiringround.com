import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhyChooseUs from '../components/WhyChooseUs';
import TrustedBy from '../components/TrustedBy';
import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import QualityProcess from '../components/QualityProcess';
import Pricing from '../components/Pricing';
import RegistrationModal from '../components/RegistrationModal';

const Home = () => {
    const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
    const [registrationMessage, setRegistrationMessage] = React.useState('');

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsRegisterOpen(true);
        }, 1000); // Small delay for better UX
        return () => clearTimeout(timer);
    }, []);

    const openRegister = (message = '') => {
        setRegistrationMessage(message);
        setIsRegisterOpen(true);
    };

    return (
        <div className="bg-white font-sans text-gray-900">
            <Navbar onRegisterClick={() => openRegister()} />
            <main>
                <Hero onRegisterClick={() => openRegister()} />
                <WhyChooseUs />
                <Services />
                <QualityProcess />
                <HowItWorks />
                <Pricing onPlanSelect={openRegister} />
                <TrustedBy />
            </main>
            <RegistrationModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                initialMessage={registrationMessage}
            />
        </div>
    );
};

export default Home;
