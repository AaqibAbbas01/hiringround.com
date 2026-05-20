import React from 'react';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
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
        return undefined;
    }, []);

    const openRegister = (message = '') => {
        setRegistrationMessage(message);
        setIsRegisterOpen(true);
    };

    return (
        <div className="bg-white font-sans text-gray-900">
            <SEO />
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
