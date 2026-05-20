import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, Building, CheckCircle, IndianRupee, MapPin, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContextCore';
import { sampleJobs } from '../data/sampleJobs';
import { formatExperience, formatSalary } from '../lib/formatters';
import { supabase } from '../supabase';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [job, setJob] = useState(null);
    const [coverNote, setCoverNote] = useState('');
    const [candidateProfile, setCandidateProfile] = useState(null);
    const [hasApplied, setHasApplied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const isSampleJob = useMemo(() => id?.startsWith('sample-'), [id]);

    useEffect(() => {
        const loadJob = async () => {
            setIsLoading(true);
            setError('');

            if (isSampleJob) {
                setJob(sampleJobs.find((item) => item.id === id) ?? null);
                setIsLoading(false);
                return;
            }

            const { data, error: jobError } = await supabase
                .from('jobs')
                .select('*')
                .eq('id', id)
                .eq('status', 'published')
                .maybeSingle();

            if (jobError) {
                console.error('Failed to load job:', jobError);
                setError('This job could not be loaded.');
            }
            setJob(data);
            setIsLoading(false);
        };

        loadJob();
    }, [id, isSampleJob]);

    useEffect(() => {
        const loadCandidateState = async () => {
            if (!user || profile?.role !== 'candidate' || isSampleJob) return;

            const [{ data: candidate }, { data: existingApplication }] = await Promise.all([
                supabase.from('candidate_profiles').select('*').eq('id', user.id).maybeSingle(),
                supabase.from('applications').select('id').eq('job_id', id).eq('candidate_id', user.id).maybeSingle()
            ]);

            setCandidateProfile(candidate);
            setHasApplied(Boolean(existingApplication));
        };

        loadCandidateState();
    }, [user, profile, id, isSampleJob]);

    const handleApply = async (event) => {
        event.preventDefault();

        if (!user) {
            navigate('/auth/login', { state: { from: `/jobs/${id}` } });
            return;
        }

        if (profile?.role !== 'candidate') {
            setError('Only candidate accounts can apply for jobs.');
            return;
        }

        if (isSampleJob) {
            setMessage('Create a recruiter-published live job to test real applications. Sample jobs are read-only.');
            return;
        }

        setIsApplying(true);
        setError('');
        setMessage('');

        const { error: applyError } = await supabase.from('applications').insert([{
            job_id: id,
            candidate_id: user.id,
            status: 'applied',
            cover_note: coverNote || null,
            resume_snapshot: candidateProfile?.resume_url || null
        }]);

        if (applyError) {
            setError(applyError.code === '23505' ? 'You have already applied for this job.' : applyError.message);
        } else {
            setHasApplied(true);
            setMessage('Application submitted.');
            setCoverNote('');
        }
        setIsApplying(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <SEO title={job?.title || 'Job Detail'} description={job?.description || 'Review job details and apply on HiringRound.'} />
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
                <Link to="/jobs" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                    <ArrowLeft className="h-4 w-4" />
                    Back to jobs
                </Link>

                {isLoading ? (
                    <div className="h-96 animate-pulse rounded-lg border border-gray-200 bg-white" />
                ) : !job ? (
                    <div className="rounded-lg border border-gray-200 bg-white p-10 text-center">
                        <h1 className="text-2xl font-bold text-gray-950">Job not found</h1>
                        <p className="mt-2 text-gray-600">It may have been closed or unpublished.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-bold uppercase tracking-wide text-primary">{job.category}</p>
                            <h1 className="mt-2 text-3xl font-bold text-gray-950 sm:text-4xl">{job.title}</h1>
                            <p className="mt-2 flex items-center gap-2 text-gray-600"><Building className="h-4 w-4 text-primary" />{job.company}</p>

                            <div className="mt-6 grid gap-3 rounded-lg bg-gray-50 p-4 text-sm text-gray-700 sm:grid-cols-2">
                                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{job.location}</span>
                                <span className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" />{formatExperience(job.experience_min, job.experience_max)}</span>
                                <span className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-primary" />{formatSalary(job.salary_min, job.salary_max)}</span>
                                <span className="font-bold text-primary">{job.job_type} · {job.workplace_type}</span>
                            </div>

                            <div className="mt-8 space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-950">Job description</h2>
                                    <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">{job.description}</p>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-950">Requirements</h2>
                                    <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">{job.requirements || 'The recruiter has not added detailed requirements yet.'}</p>
                                </div>
                            </div>
                        </section>

                        <aside className="h-fit rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-950">Apply for this job</h2>
                            <p className="mt-2 text-sm text-gray-600">Your application will be visible to the recruiter that posted this role.</p>

                            {message && <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{message}</div>}
                            {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}

                            {hasApplied ? (
                                <div className="mt-6 rounded-lg bg-secondary p-4 text-primary">
                                    <CheckCircle className="mb-2 h-6 w-6" />
                                    <p className="font-bold">You have applied for this job.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleApply} className="mt-6 space-y-4">
                                    <textarea value={coverNote} onChange={(event) => setCoverNote(event.target.value)} rows="5" placeholder="Short cover note" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                                    <button disabled={isApplying} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-dark disabled:opacity-60">
                                        <Send className="h-4 w-4" />
                                        {isApplying ? 'Applying...' : 'Apply now'}
                                    </button>
                                    {!user && <p className="text-center text-xs text-gray-500">You will be asked to login first.</p>}
                                </form>
                            )}
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
};

export default JobDetail;
