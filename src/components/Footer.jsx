import React from 'react';
import { Twitter, Linkedin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold text-white mb-4 block">Hiring Round</Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Reinventing technical recruitment with expert interviews on demand.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/product/technical-interviews" className="hover:text-white transition-colors">Technical Interviews</Link></li>
                            <li><Link to="/product/assessment-tests" className="hover:text-white transition-colors">Assessment Tests</Link></li>
                            <li><Link to="/product/screening" className="hover:text-white transition-colors">Screening</Link></li>
                            <li><Link to="/product/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/company/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/company/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link to="/company/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link to="/company/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/resources/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link to="/resources/case-studies" className="hover:text-white transition-colors">Case Studies</Link></li>
                            <li><Link to="/resources/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-gray-800 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Hiring Round. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span>Made in India for the World 🇮🇳</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
