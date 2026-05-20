import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Briefcase, Building, FileUp, Mail, MapPin, Phone, Search, ShieldCheck, User, X } from 'lucide-react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContextCore';
import { supabase } from '../supabase';
import {
    candidateRoleOptions,
    companySizeOptions,
    educationOptions,
    experienceOptions,
    indianCities,
    industryOptions,
    noticePeriodOptions,
    salaryRangeOptions,
    skillOptions
} from '../data/onboardingOptions';
import { uploadResume, validateResumeFile } from '../lib/resumeUpload';

const emptyForm = {
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    role: 'candidate',
    companyName: '',
    website: '',
    industry: '',
    companySize: '',
    currentRole: '',
    skills: '',
    experienceYears: '',
    education: '',
    resumeUrl: '',
    expectedSalary: '',
    noticePeriod: ''
};

const AuthPage = () => {
    const { mode = 'login' } = useParams();
    const isRegister = mode === 'register';
    const navigate = useNavigate();
    const location = useLocation();
    const { user, profile, refreshProfile } = useAuth();
    const [formData, setFormData] = useState(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [canResendConfirmation, setCanResendConfirmation] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skillSearch, setSkillSearch] = useState('');
    const [showSkillDropdown, setShowSkillDropdown] = useState(false);
    const skillDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (skillDropdownRef.current && !skillDropdownRef.current.contains(e.target)) {
                setShowSkillDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (user && profile) {
        return <Navigate to={profile.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'} replace />;
    }

    const handleChange = (event) => {
        const { name, value, selectedOptions, multiple } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
        if (multiple) {
            const values = Array.from(selectedOptions).map((option) => option.value);
            setFormData((current) => ({ ...current, [name]: values.join(', ') }));
        } else {
            setFormData((current) => ({ ...current, [name]: value }));
        }
    };

    const handleResumeChange = (event) => {
        const file = event.target.files?.[0] || null;
        const validationError = validateResumeFile(file);
        if (validationError) {
            setError(validationError);
            setResumeFile(null);
            event.target.value = '';
            return;
        }

        setError('');
        setResumeFile(file);
    };

    const redirectAfterAuth = (nextProfile) => {
        const requestedPath = location.state?.from;
        if (requestedPath) {
            navigate(requestedPath, { replace: true });
            return;
        }
        navigate(nextProfile?.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard', { replace: true });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError('');
        setMessage('');
        setCanResendConfirmation(false);

        try {
            if (isRegister) {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                        data: {
                            role: formData.role,
                            full_name: formData.name,
                            phone: formData.phone || null,
                            location: formData.location || null,
                            company_name: formData.companyName || null,
                            website: formData.website || null,
                            industry: formData.industry || null,
                            company_size: formData.companySize || null,
                            target_role: formData.currentRole || null,
                            skills: formData.skills || null,
                            experience_years: formData.experienceYears || null,
                            education: formData.education || null,
                            expected_salary: formData.expectedSalary || null,
                            notice_period: formData.noticePeriod || null
                        }
                    }
                });

                if (signUpError) throw signUpError;
                if (!data.user) throw new Error('Signup did not return a user.');

                if (!data.session) {
                    setMessage(resumeFile
                        ? 'Account created. Please confirm your email, then log in to upload your resume.'
                        : 'Account created. Please confirm your email, then log in.');
                    return;
                }

                if (formData.role === 'candidate' && resumeFile) {
                    const resumePath = await uploadResume({ supabase, userId: data.user.id, file: resumeFile });
                    const { error: resumeProfileError } = await supabase
                        .from('candidate_profiles')
                        .upsert({
                            id: data.user.id,
                            resume_url: resumePath,
                            target_role: formData.currentRole || null,
                            skills: formData.skills ? formData.skills.split(', ').filter(Boolean) : [],
                            experience_years: formData.experienceYears ? Number(formData.experienceYears) : 0,
                            education: formData.education || null,
                            expected_salary: formData.expectedSalary || null,
                            notice_period: formData.noticePeriod || null,
                            preferred_job_types: []
                        }, { onConflict: 'id' });
                    if (resumeProfileError) throw resumeProfileError;
                }

                await refreshProfile();
                navigate(formData.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard', { replace: true });
                return;
            }

            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            });

            if (loginError) throw loginError;
            const { data: nextProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', loginData.user.id)
                .maybeSingle();
            await refreshProfile();
            redirectAfterAuth(nextProfile);
        } catch (submitError) {
            if (submitError.code === 'email_not_confirmed') {
                setCanResendConfirmation(true);
                setError('Your email is not confirmed yet. Open the latest confirmation email, or resend it below.');
            } else {
                setError(submitError.message || 'Authentication failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendConfirmation = async () => {
        if (!formData.email) {
            setError('Enter your email address first, then resend confirmation.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setMessage('');

        const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: formData.email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (resendError) {
            setError(resendError.message);
        } else {
            setMessage('Confirmation email sent. Use the newest email link.');
            setCanResendConfirmation(false);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <SEO title={isRegister ? 'Create Account' : 'Login'} description="Access your HiringRound candidate or recruiter portal." />
            <Navbar />
            <main className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
                <section className="flex flex-col justify-center">
                    <div className="max-w-xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-2 text-sm font-bold text-primary">
                            <ShieldCheck className="h-4 w-4" />
                            Secure HiringRound portal
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
                            {isRegister ? 'Create your hiring account' : 'Welcome back'}
                        </h1>
                        <p className="mt-4 text-lg leading-8 text-gray-600">
                            Recruiters can publish jobs and review applications. Candidates can discover roles, apply, and track progress from one dashboard.
                        </p>
                    </div>
                </section>

                <section className="self-center rounded-lg border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/70 sm:p-8">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-950">{isRegister ? 'Register' : 'Login'}</h2>
                            <p className="text-sm text-gray-500">{isRegister ? 'Choose your account type.' : 'Use your account email and password.'}</p>
                        </div>
                        <Link to={isRegister ? '/auth/login' : '/auth/register'} className="text-sm font-bold text-primary hover:underline">
                            {isRegister ? 'Login' : 'Create account'}
                        </Link>
                    </div>

                    {message && <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{message}</div>}
                    {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}
                    {canResendConfirmation && (
                        <button
                            type="button"
                            onClick={handleResendConfirmation}
                            disabled={isSubmitting}
                            className="mb-4 w-full rounded-lg border border-primary/30 bg-secondary px-4 py-3 text-sm font-bold text-primary hover:border-primary disabled:opacity-60"
                        >
                            Resend confirmation email
                        </button>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isRegister && (
                            <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
                                {['candidate', 'recruiter'].map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setFormData((current) => ({ ...current, role }))}
                                        className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold transition ${formData.role === role ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        {role === 'candidate' ? <User className="h-4 w-4" /> : <Building className="h-4 w-4" />}
                                        {role === 'candidate' ? 'Candidate' : 'Recruiter'}
                                    </button>
                                ))}
                            </div>
                        )}

                        {isRegister && (
                            <label className="block text-sm font-bold text-gray-700">
                                Full name
                                <input name="name" required value={formData.name} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                            </label>
                        )}

                        <label className="block text-sm font-bold text-gray-700">
                            Email
                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-10 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                            </div>
                        </label>

                        <label className="block text-sm font-bold text-gray-700">
                            Password
                            <input name="password" type="password" required minLength="6" value={formData.password} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        </label>

                        {isRegister && (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block text-sm font-bold text-gray-700">
                                    Phone
                                    <div className="relative mt-1">
                                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-10 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                                    </div>
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Location
                                    <div className="relative mt-1">
                                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <select name="location" value={formData.location} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-10 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                                            <option value="">Select city</option>
                                            {indianCities.map((city) => <option key={city} value={city}>{city}</option>)}
                                        </select>
                                    </div>
                                </label>
                            </div>
                        )}

                        {isRegister && formData.role === 'recruiter' && (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block text-sm font-bold text-gray-700">
                                    Company name
                                    <input name="companyName" required value={formData.companyName} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Website
                                    <input name="website" value={formData.website} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Industry
                                    <select name="industry" value={formData.industry} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                                        <option value="">Select industry</option>
                                        {industryOptions.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
                                    </select>
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Company size
                                    <select name="companySize" value={formData.companySize} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                                        <option value="">Select size</option>
                                        {companySizeOptions.map((size) => <option key={size} value={size}>{size}</option>)}
                                    </select>
                                </label>
                            </div>
                        )}

                        {isRegister && formData.role === 'candidate' && (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block text-sm font-bold text-gray-700">
                                    Current / target role
                                    <select name="currentRole" required value={formData.currentRole} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                                        <option value="">Select role</option>
                                        {candidateRoleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
                                    </select>
                                </label>
                                <div className="block text-sm font-bold text-gray-700">
                                    Skills
                                    <div className="relative mt-1" ref={skillDropdownRef}>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-gray-300 px-10 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                placeholder="Search skills (e.g. React, Python…)"
                                                value={skillSearch}
                                                onChange={(e) => { setSkillSearch(e.target.value); setShowSkillDropdown(true); }}
                                                onFocus={() => setShowSkillDropdown(true)}
                                            />
                                        </div>
                                        {showSkillDropdown && skillSearch.trim() !== '' && (
                                            <ul className="absolute z-50 mt-1 max-h-44 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg text-sm font-normal">
                                                {skillOptions
                                                    .filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()) && !selectedSkills.includes(s))
                                                    .map(skill => (
                                                        <li
                                                            key={skill}
                                                            onMouseDown={(e) => {
                                                                e.preventDefault();
                                                                const next = [...selectedSkills, skill];
                                                                setSelectedSkills(next);
                                                                setFormData(current => ({ ...current, skills: next.join(', ') }));
                                                                setSkillSearch('');
                                                                setShowSkillDropdown(false);
                                                            }}
                                                            className="cursor-pointer px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors"
                                                        >
                                                            {skill}
                                                        </li>
                                                    ))
                                                }
                                                {skillOptions.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()) && !selectedSkills.includes(s)).length === 0 && (
                                                    <li className="px-4 py-2 text-gray-400 text-xs">No matching skills</li>
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                    {selectedSkills.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {selectedSkills.map(skill => (
                                                <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const next = selectedSkills.filter(s => s !== skill);
                                                            setSelectedSkills(next);
                                                            setFormData(current => ({ ...current, skills: next.join(', ') }));
                                                        }}
                                                        className="ml-0.5 hover:text-red-500 transition-colors"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <label className="block text-sm font-bold text-gray-700">
                                    Experience years
                                    <select name="experienceYears" value={formData.experienceYears} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                                        <option value="">Select experience</option>
                                        {experienceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                    </select>
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Education
                                    <select name="education" value={formData.education} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                                        <option value="">Select education</option>
                                        {educationOptions.map((education) => <option key={education} value={education}>{education}</option>)}
                                    </select>
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Expected salary
                                    <select name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                                        <option value="">Select salary range</option>
                                        {salaryRangeOptions.map((salary) => <option key={salary} value={salary}>{salary}</option>)}
                                    </select>
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Notice period
                                    <select name="noticePeriod" value={formData.noticePeriod} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                                        <option value="">Select notice period</option>
                                        {noticePeriodOptions.map((notice) => <option key={notice} value={notice}>{notice}</option>)}
                                    </select>
                                </label>
                                <label className="block text-sm font-bold text-gray-700 sm:col-span-2">
                                    Upload resume
                                    <div className="mt-1 flex items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-4">
                                        <FileUp className="h-5 w-5 text-primary" />
                                        <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleResumeChange} className="w-full text-sm font-normal text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:font-bold file:text-white" />
                                    </div>
                                    <span className="mt-1 block text-xs font-normal text-gray-500">{resumeFile ? resumeFile.name : 'PDF, DOC, or DOCX up to 5 MB. Stored in Supabase Storage after login/signup.'}</span>
                                </label>
                            </div>
                        )}

                        <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60">
                            <Briefcase className="h-4 w-4" />
                            {isSubmitting ? 'Please wait...' : isRegister ? 'Create account' : 'Login'}
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default AuthPage;
