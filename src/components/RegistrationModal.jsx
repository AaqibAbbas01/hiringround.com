import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Building, Mail, Phone, Linkedin, Code, ChevronDown, CheckCircle, MapPin, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { supabase } from '../supabase';

const RegistrationModal = ({ isOpen, onClose, initialRole = 'employer', initialMessage = '' }) => {
    const [role, setRole] = useState(initialRole); // 'employer' or 'interviewer'
    const [captchaValue, setCaptchaValue] = useState('');
    const [captchaError, setCaptchaError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        workEmail: '',
        countryCode: '+1',
        phone: '',
        hiringCategory: '',
        customHiringNeed: '',
        rounds: '',
        assessments: false,
        fullName: '',
        email: '',
        currentCompany: '',
        location: '',
        linkedin: '',
        experience: '',
        techStack: '',
        message: ''
    });

    useEffect(() => {
        if (isOpen) {
            // Reset submission state when modal opens
            setIsSubmitted(false);
            // Set initial role if provided
            setRole(initialRole);
            // Set initial message if provided
            setFormData(prev => ({ ...prev, message: initialMessage }));
            // Load captcha with a small delay to ensure canvas is ready
            setTimeout(() => {
                loadCaptchaEnginge(6, 'transparent', '#10b981');
            }, 100);
        }
    }, [isOpen, initialRole, initialMessage]);

    const rolesList = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer', 'QA Engineer', 'DevOps Engineer', 'Data Scientist', 'AI/ML Engineer', 'Product Manager', 'UI/UX Designer', 'Other'];
    const countryCodes = ['+1', '+44', '+91', '+61', '+81', '+49'];

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateCaptcha(captchaValue) !== true) {
            setCaptchaError(true);
            setCaptchaValue('');
            loadCaptchaEnginge(6, 'transparent', '#10b981');
            return;
        }

        setCaptchaError(false);
        setIsLoading(true);

        try {
            const submissionData = role === 'employer' ? {
                role,
                company_name: formData.companyName,
                work_email: formData.workEmail,
                phone: formData.phone,
                country_code: formData.countryCode,
                hiring_category: formData.hiringCategory,
                message: formData.message
            } : {
                role,
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                country_code: formData.countryCode,
                current_company: formData.currentCompany,
                experience: formData.experience,
                linkedin: formData.linkedin,
                tech_stack: formData.techStack,
                message: formData.message
            };

            const { error } = await supabase
                .from('enquiries')
                .insert([submissionData]);

            if (error) throw error;

            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit registration. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRefreshCaptcha = () => {
        loadCaptchaEnginge(6, 'transparent', '#10b981');
        setCaptchaValue('');
        setCaptchaError(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 py-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-secondary/80 backdrop-blur-md"
                    ></motion.div>

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-0"
                    >
                        {/* Left Side - Visual Sidebar */}
                        <div className="hidden md:flex md:w-[28%] bg-primary p-6 flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-secondary/20 rounded-full blur-3xl"></div>

                            <div className="relative z-10">
                                <ShieldCheck className="w-10 h-10 text-white mb-4" />
                                <h3 className="text-xl font-bold text-white mb-1 leading-tight">Secure Hiring</h3>
                                <p className="text-primary-light/90 text-[11px] leading-relaxed">
                                    Join the elite network using Hiring Round.
                                </p>
                            </div>

                            <div className="relative z-10 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                        <CheckCircle className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-white text-[10px] font-medium uppercase tracking-wider">Expertise</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                        <CheckCircle className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-white text-[10px] font-medium uppercase tracking-wider">Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="flex-1 p-5 md:p-7 bg-white relative min-h-[400px] flex flex-col justify-center">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-secondary group"
                            >
                                <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                            </button>

                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-4 py-8"
                                >
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-primary" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900">Thank You!</h2>
                                    <div className="space-y-2">
                                        <p className="text-gray-600 font-medium">Your submission was successful.</p>
                                        <p className="text-gray-500 text-sm leading-relaxed px-4">
                                            Our team will review your details and get back to you shortly. Welcome to the Hiring Round community!
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="mt-8 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                                    >
                                        Back to Website
                                    </button>
                                </motion.div>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Get Started</h2>
                                        <p className="text-gray-500 text-xs">Begin your journey with Hiring Round.</p>
                                    </div>

                                    {/* Role Toggle */}
                                    <div className="flex p-1 mb-5 bg-gray-100/80 rounded-xl w-full max-w-[280px] mx-auto">
                                        <button
                                            className={`flex-1 flex gap-2 items-center justify-center py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${role === 'employer'
                                                ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                                                : 'text-gray-500 hover:text-secondary'
                                                }`}
                                            onClick={() => setRole('employer')}
                                        >
                                            <Building className="w-3.5 h-3.5" />
                                            Employer
                                        </button>
                                        <button
                                            className={`flex-1 flex gap-2 items-center justify-center py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${role === 'interviewer'
                                                ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                                                : 'text-gray-500 hover:text-secondary'
                                                }`}
                                            onClick={() => setRole('interviewer')}
                                        >
                                            <User className="w-3.5 h-3.5" />
                                            Interviewer
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                                        {role === 'employer' ? (
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider ml-1">Company Name</label>
                                                        <div className="relative group">
                                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                                            <input
                                                                type="text"
                                                                name="companyName"
                                                                required
                                                                className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-lg pl-9 pr-3 py-2 text-sm transition-all outline-none"
                                                                placeholder="Acme Corp"
                                                                value={formData.companyName}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider ml-1">Work Email</label>
                                                        <div className="relative group">
                                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                                            <input
                                                                type="email"
                                                                name="workEmail"
                                                                required
                                                                className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-lg pl-9 pr-3 py-2 text-sm transition-all outline-none"
                                                                placeholder="hr@acme.com"
                                                                value={formData.workEmail}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider ml-1">Phone Number</label>
                                                    <div className="flex gap-2">
                                                        <div className="relative w-24 group">
                                                            <select
                                                                name="countryCode"
                                                                className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-lg px-2 py-2 text-xs transition-all outline-none appearance-none font-bold"
                                                                value={formData.countryCode}
                                                                onChange={handleInputChange}
                                                            >
                                                                {countryCodes.map(code => (
                                                                    <option key={code} value={code}>{code}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                        </div>
                                                        <div className="relative flex-1 group">
                                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                                            <input
                                                                type="tel"
                                                                name="phone"
                                                                required
                                                                className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-lg pl-9 pr-3 py-2 text-sm transition-all outline-none"
                                                                placeholder="Phone"
                                                                value={formData.phone}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider ml-1">Hiring Needs</label>
                                                    <div className="relative group">
                                                        <select
                                                            name="hiringCategory"
                                                            required
                                                            className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-lg pl-3 pr-8 py-2 text-sm transition-all outline-none appearance-none"
                                                            value={formData.hiringCategory}
                                                            onChange={handleInputChange}
                                                        >
                                                            <option value="">Select Category</option>
                                                            {rolesList.map(r => (
                                                                <option key={r} value={r}>{r}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider ml-1">Message</label>
                                                    <div className="relative group">
                                                        <textarea
                                                            name="message"
                                                            rows="2"
                                                            className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-lg px-3 py-2 text-sm transition-all outline-none resize-none"
                                                            placeholder="Any specific requirements?"
                                                            value={formData.message}
                                                            onChange={handleInputChange}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider ml-1">Full Name</label>
                                                    <div className="relative group">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                                        <input
                                                            type="text"
                                                            name="fullName"
                                                            required
                                                            className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-lg pl-9 pr-3 py-2 text-sm transition-all outline-none"
                                                            placeholder="John Doe"
                                                            value={formData.fullName}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider ml-1">Email</label>
                                                        <div className="relative group">
                                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                required
                                                                className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-lg pl-9 pr-3 py-2 text-sm transition-all outline-none"
                                                                placeholder="john@example.com"
                                                                value={formData.email}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider ml-1">Phone Number</label>
                                                        <div className="flex gap-2">
                                                            <div className="relative w-24 group">
                                                                <select
                                                                    name="countryCode"
                                                                    className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-lg px-2 py-2 text-xs transition-all outline-none appearance-none font-bold"
                                                                    value={formData.countryCode}
                                                                    onChange={handleInputChange}
                                                                >
                                                                    {countryCodes.map(code => (
                                                                        <option key={code} value={code}>{code}</option>
                                                                    ))}
                                                                </select>
                                                                <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                            </div>
                                                            <div className="relative flex-1 group">
                                                                <input
                                                                    type="tel"
                                                                    name="phone"
                                                                    required
                                                                    className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-lg px-3 py-2 text-sm transition-all outline-none"
                                                                    placeholder="Phone"
                                                                    value={formData.phone}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider ml-1">Current Company</label>
                                                    <div className="relative group">
                                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                                        <input
                                                            type="text"
                                                            name="currentCompany"
                                                            required
                                                            className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-lg pl-9 pr-3 py-2 text-sm transition-all outline-none"
                                                            placeholder="Google, Microsoft, etc."
                                                            value={formData.currentCompany}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider ml-1">Experience (Yrs)</label>
                                                        <div className="relative group">
                                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                                            <input
                                                                type="number"
                                                                name="experience"
                                                                required
                                                                className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-lg pl-9 pr-3 py-2 text-sm transition-all outline-none"
                                                                placeholder="5"
                                                                value={formData.experience}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider ml-1">LinkedIn</label>
                                                        <div className="relative group">
                                                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                                            <input
                                                                type="url"
                                                                name="linkedin"
                                                                required
                                                                className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-lg pl-9 pr-3 py-2 text-sm transition-all outline-none"
                                                                placeholder="linkedin.com/in/..."
                                                                value={formData.linkedin}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider ml-1">Tech Stack / More Details</label>
                                                    <div className="relative group">
                                                        <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                                        <input
                                                            type="text"
                                                            name="techStack"
                                                            required
                                                            className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-lg pl-9 pr-3 py-2 text-sm transition-all outline-none"
                                                            placeholder="React, Node.js, System Design, etc."
                                                            value={formData.techStack}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Captcha Section */}
                                        <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-[9px] font-bold text-gray-700 uppercase tracking-wider">Security Check</label>
                                                <button
                                                    type="button"
                                                    onClick={handleRefreshCaptcha}
                                                    className="text-primary hover:text-primary-dark transition-colors"
                                                    title="Refresh Captcha"
                                                >
                                                    <RefreshCw className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="bg-white rounded-lg p-1.5 flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden h-12">
                                                    <LoadCanvasTemplate />
                                                </div>
                                                <div className="relative group">
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Enter Captcha"
                                                        className={`w-full bg-white border-none ring-1 ${captchaError ? 'ring-red-500' : 'ring-gray-200'} focus:ring-2 focus:ring-primary rounded-lg px-3 py-2 text-xs transition-all outline-none`}
                                                        value={captchaValue}
                                                        onChange={(e) => setCaptchaValue(e.target.value)}
                                                    />
                                                </div>
                                                {captchaError && (
                                                    <p className="text-red-500 text-[9px] font-bold uppercase tracking-tight ml-1 animate-pulse">
                                                        Invalid captcha.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </form>

                                    <div className="mt-5 space-y-3">
                                        <motion.button
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            type="submit"
                                            disabled={isLoading}
                                            onClick={handleSubmit}
                                            className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {isLoading ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    {role === 'employer' ? 'Request Demo' : 'Join as Expert'}
                                                    <ChevronDown className="-rotate-90 w-4 h-4" />
                                                </>
                                            )}
                                        </motion.button>
                                        <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                                            By submitting, you agree to our <a href="#" className="text-primary hover:underline font-bold">Privacy Policy</a>.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RegistrationModal;
