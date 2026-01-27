import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import { Mail, MapPin, Phone, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase';
import SEO from '../components/SEO';
import { useLocation } from 'react-router-dom';

const Contact = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    useEffect(() => {
        if (location.state && location.state.message) {
            setFormData(prev => ({ ...prev, message: location.state.message }));
        }
    }, [location]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase
                .from('contacts')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    message: formData.message
                }]);

            if (error) throw error;

            setIsSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageLayout title="Contact Us">
            <SEO
                title="Contact Us"
                description="Get in touch with Hiring Round for technical interview outsourcing services and support."
            />
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                    <p className="text-gray-600 mb-8">
                        Have questions about our services or need support? Our team is here to help.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Email</h4>
                                <p className="text-gray-610">support@hiringround.com</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Phone</h4>
                                <p className="text-gray-600">+91 (555) 123-4567</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Office</h4>
                                <p className="text-gray-600">Tech Park, Bangalore, India</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex flex-col justify-center min-h-[400px]">
                    {isSubmitted ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                            <p className="text-gray-600">
                                Thank you for reaching out. We have received your message and will get back to you within 24 hours.
                            </p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="mt-6 text-primary font-bold hover:underline"
                            >
                                Send another message
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="you@company.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="How can we help?"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default Contact;
