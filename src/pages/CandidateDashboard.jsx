import React, { useEffect, useMemo, useState } from 'react';
import { Briefcase, CheckCircle, FileText, FileUp, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContextCore';
import { formatSalary, toTitleCase } from '../lib/formatters';
import { uploadResume, validateResumeFile } from '../lib/resumeUpload';
import { supabase } from '../supabase';

const CandidateDashboard = () => {
    const { user, profile } = useAuth();
    const [candidateProfile, setCandidateProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [resumeMessage, setResumeMessage] = useState('');
    const [resumeError, setResumeError] = useState('');
    const [isUploadingResume, setIsUploadingResume] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadDashboard = async () => {
            if (!user) return;
            setIsLoading(true);

            const [{ data: candidate, error: candidateError }, { data: applicationRows, error: applicationsError }] = await Promise.all([
                supabase.from('candidate_profiles').select('*').eq('id', user.id).maybeSingle(),
                supabase
                    .from('applications')
                    .select('id,status,cover_note,created_at,jobs(id,title,company,location,salary_min,salary_max)')
                    .eq('candidate_id', user.id)
                    .order('created_at', { ascending: false })
            ]);

            if (!isMounted) return;
            if (candidateError) console.error('Failed to load candidate profile:', candidateError);
            if (applicationsError) console.error('Failed to load applications:', applicationsError);
            setCandidateProfile(candidate);
            setApplications(applicationRows || []);
            setIsLoading(false);
        };

        loadDashboard();

        return () => {
            isMounted = false;
        };
    }, [user]);

    const completion = useMemo(() => {
        const checks = [
            Boolean(profile?.full_name),
            Boolean(profile?.phone),
            Boolean(profile?.location),
            Boolean(candidateProfile?.resume_url),
            Boolean(candidateProfile?.skills?.length)
        ];
        return Math.round((checks.filter(Boolean).length / checks.length) * 100);
    }, [profile, candidateProfile]);

    const handleResumeUpload = async (event) => {
        const file = event.target.files?.[0];
        const validationError = validateResumeFile(file);

        if (validationError) {
            setResumeError(validationError);
            event.target.value = '';
            return;
        }

        setIsUploadingResume(true);
        setResumeError('');
        setResumeMessage('');

        try {
            const resumePath = await uploadResume({ supabase, userId: user.id, file });
            const { error } = await supabase
                .from('candidate_profiles')
                .upsert({
                    id: user.id,
                    resume_url: resumePath,
                    skills: candidateProfile?.skills || [],
                    experience_years: candidateProfile?.experience_years || 0,
                    preferred_job_types: candidateProfile?.preferred_job_types || []
                }, { onConflict: 'id' });

            if (error) throw error;
            setCandidateProfile((current) => ({ ...(current || {}), id: user.id, resume_url: resumePath }));
            setResumeMessage('Resume uploaded successfully.');
        } catch (uploadError) {
            setResumeError(uploadError.message || 'Could not upload resume.');
        } finally {
            setIsUploadingResume(false);
            event.target.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <SEO title="Candidate Dashboard" description="Track HiringRound job applications and candidate profile completion." />
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-primary">Candidate portal</p>
                        <h1 className="mt-2 text-4xl font-bold text-gray-950">Welcome, {profile?.full_name || 'Candidate'}</h1>
                    </div>
                    <Link to="/jobs" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-white hover:bg-primary-dark">
                        <Briefcase className="h-4 w-4" />
                        Browse jobs
                    </Link>
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <User className="mb-3 h-6 w-6 text-primary" />
                        <p className="text-sm text-gray-500">Profile completion</p>
                        <p className="mt-1 text-3xl font-bold text-gray-950">{completion}%</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <FileText className="mb-3 h-6 w-6 text-primary" />
                        <p className="text-sm text-gray-500">Applications</p>
                        <p className="mt-1 text-3xl font-bold text-gray-950">{applications.length}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <CheckCircle className="mb-3 h-6 w-6 text-primary" />
                        <p className="text-sm text-gray-500">Shortlisted</p>
                        <p className="mt-1 text-3xl font-bold text-gray-950">{applications.filter((item) => item.status === 'shortlisted').length}</p>
                    </div>
                </div>

                <section className="mb-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-950">Resume</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {candidateProfile?.resume_url ? 'Your CV is stored securely in Supabase Storage.' : 'Upload your CV to complete your candidate profile.'}
                            </p>
                            {candidateProfile?.target_role && <p className="mt-2 text-sm font-medium text-gray-700">Role: {candidateProfile.target_role}</p>}
                            {candidateProfile?.expected_salary && <p className="text-sm text-gray-500">Expected salary: {candidateProfile.expected_salary}</p>}
                            {candidateProfile?.notice_period && <p className="text-sm text-gray-500">Notice period: {candidateProfile.notice_period}</p>}
                        </div>
                        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary/30 bg-secondary px-5 py-3 text-sm font-bold text-primary hover:border-primary">
                            <FileUp className="h-4 w-4" />
                            {isUploadingResume ? 'Uploading...' : candidateProfile?.resume_url ? 'Replace resume' : 'Upload resume'}
                            <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleResumeUpload} disabled={isUploadingResume} className="hidden" />
                        </label>
                    </div>
                    {resumeMessage && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">{resumeMessage}</p>}
                    {resumeError && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{resumeError}</p>}
                </section>

                <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 p-5">
                        <h2 className="text-xl font-bold text-gray-950">Your applications</h2>
                    </div>
                    {isLoading ? (
                        <div className="p-5">
                            <div className="h-32 animate-pulse rounded-lg bg-gray-100" />
                        </div>
                    ) : applications.length ? (
                        <div className="divide-y divide-gray-100">
                            {applications.map((application) => (
                                <div key={application.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                                    <div>
                                        <Link to={`/jobs/${application.jobs?.id}`} className="text-lg font-bold text-gray-950 hover:text-primary">{application.jobs?.title}</Link>
                                        <p className="mt-1 text-sm font-medium text-gray-600">{application.jobs?.company}</p>
                                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{application.jobs?.location}</span>
                                            <span>{formatSalary(application.jobs?.salary_min, application.jobs?.salary_max)}</span>
                                        </div>
                                    </div>
                                    <span className="w-fit rounded-full bg-secondary px-3 py-1 text-sm font-bold text-primary">{toTitleCase(application.status)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 text-center">
                            <h3 className="text-lg font-bold text-gray-950">No applications yet</h3>
                            <p className="mt-2 text-gray-600">Find a role that fits and apply from the job detail page.</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default CandidateDashboard;
