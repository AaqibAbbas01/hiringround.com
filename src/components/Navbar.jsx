import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onRegisterClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full bg-white z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        {/* Logo */}
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/logo.png" alt="Hiring Round" className="h-10 w-auto" />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="/#services" className="text-gray-600 hover:text-primary font-medium transition-colors">Services</a>
                        <a href="/#how-it-works" className="text-gray-600 hover:text-primary font-medium transition-colors">How it Works</a>
                        <a href="/#pricing" className="text-gray-600 hover:text-primary font-medium transition-colors">Pricing</a>
                        <Link to="/company/contact" className="text-gray-600 hover:text-primary font-medium transition-colors">Contact Us</Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={onRegisterClick}
                            className="bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-primary/20"
                        >
                            Register
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-primary focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg">
                    <div className="px-4 pt-2 pb-6 space-y-4">
                        <a href="/#services" className="block text-gray-600 hover:text-primary font-medium" onClick={() => setIsOpen(false)}>Services</a>
                        <a href="/#how-it-works" className="block text-gray-600 hover:text-primary font-medium" onClick={() => setIsOpen(false)}>How it Works</a>
                        <a href="/#pricing" className="block text-gray-600 hover:text-primary font-medium" onClick={() => setIsOpen(false)}>Pricing</a>
                        <Link to="/company/contact" className="block text-gray-600 hover:text-primary font-medium" onClick={() => setIsOpen(false)}>Contact Us</Link>
                        <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
                            <button
                                onClick={() => {
                                    onRegisterClick();
                                    setIsOpen(false);
                                }}
                                className="w-full bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg font-medium"
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
