import React, { useEffect, useState } from 'react';
import { Briefcase, Edit3, Eye, Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContextCore';
import { toTitleCase } from '../lib/formatters';
import { applicationStatuses } from '../data/jobTaxonomy';
import { supabase } from '../supabase';

const RecruiterDashboard = () => {
    const { user, profile } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadDashboard = async () => {
            if (!user) return;

            const [{ data: jobRows, error: jobsError }, { data: applicationRows, error: applicationsError }] = await Promise.all([
                supabase.from('jobs').select('*').eq('recruiter_id', user.id).order('created_at', { ascending: false }),
                supabase
                    .from('applications')
                    .select('id,status,cover_note,resume_snapshot,created_at,job_id,candidate_id,jobs!inner(id,title,recruiter_id),profiles!applications_candidate_id_fkey(full_name,phone,location)')
                    .eq('jobs.recruiter_id', user.id)
                    .order('created_at', { ascending: false })
            ]);

            if (!isMounted) return;
            if (jobsError) console.error('Failed to load recruiter jobs:', jobsError);
            if (applicationsError) console.error('Failed to load recruiter applications:', applicationsError);
            setJobs(jobRows || []);
            setApplications(applicationRows || []);
            setIsLoading(false);
        };

        loadDashboard();

        return () => {
            isMounted = false;
        };
    }, [user]);

    const updateApplicationStatus = async (applicationId, status) => {
        const { error } = await supabase.from('applications').update({ status }).eq('id', applicationId);
        if (error) {
            alert(error.message);
            return;
        }
        setApplications((current) => current.map((item) => item.id === applicationId ? { ...item, status } : item));
    };

    const toggleJobStatus = async (job) => {
        const nextStatus = job.status === 'published' ? 'closed' : 'published';
        const { error } = await supabase.from('jobs').update({ status: nextStatus }).eq('id', job.id);
        if (error) {
            alert(error.message);
            return;
        }
        setJobs((current) => current.map((item) => item.id === job.id ? { ...item, status: nextStatus } : item));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <SEO title="Recruiter Dashboard" description="Post jobs and review candidate applications on HiringRound." />
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-primary">Recruiter portal</p>
                        <h1 className="mt-2 text-4xl font-bold text-gray-950">Manage hiring, {profile?.full_name || 'Recruiter'}</h1>
                    </div>
                    <Link to="/recruiter/jobs/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-white hover:bg-primary-dark">
                        <Plus className="h-4 w-4" />
                        Post job
                    </Link>
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <Briefcase className="mb-3 h-6 w-6 text-primary" />
                        <p className="text-sm text-gray-500">Jobs posted</p>
                        <p className="mt-1 text-3xl font-bold text-gray-950">{jobs.length}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <Eye className="mb-3 h-6 w-6 text-primary" />
                        <p className="text-sm text-gray-500">Published</p>
                        <p className="mt-1 text-3xl font-bold text-gray-950">{jobs.filter((job) => job.status === 'published').length}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <Users className="mb-3 h-6 w-6 text-primary" />
                        <p className="text-sm text-gray-500">Applications</p>
                        <p className="mt-1 text-3xl font-bold text-gray-950">{applications.length}</p>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 p-5">
                            <h2 className="text-xl font-bold text-gray-950">Your jobs</h2>
                        </div>
                        {isLoading ? (
                            <div className="p-5"><div className="h-32 animate-pulse rounded-lg bg-gray-100" /></div>
                        ) : jobs.length ? (
                            <div className="divide-y divide-gray-100">
                                {jobs.map((job) => (
                                    <div key={job.id} className="p-5">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-950">{job.title}</h3>
                                                <p className="text-sm text-gray-600">{job.location} · {job.category}</p>
                                            </div>
                                            <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">{toTitleCase(job.status)}</span>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <Link to={`/recruiter/jobs/${job.id}/edit`} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-bold text-gray-700 hover:border-primary hover:text-primary">
                                                <Edit3 className="h-4 w-4" />
                                                Edit
                                            </Link>
                                            <button onClick={() => toggleJobStatus(job)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-bold text-gray-700 hover:border-primary hover:text-primary">
                                                {job.status === 'published' ? 'Close job' : 'Publish job'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 text-center">
                                <h3 className="text-lg font-bold text-gray-950">No jobs posted</h3>
                                <p className="mt-2 text-gray-600">Create your first job to start receiving applications.</p>
                            </div>
                        )}
                    </section>

                    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 p-5">
                            <h2 className="text-xl font-bold text-gray-950">Applications</h2>
                        </div>
                        {applications.length ? (
                            <div className="divide-y divide-gray-100">
                                {applications.map((application) => (
                                    <div key={application.id} className="p-5">
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-950">{application.profiles?.full_name || 'Candidate'}</h3>
                                                <p className="text-sm text-gray-600">{application.jobs?.title}</p>
                                                <p className="mt-2 text-sm text-gray-500">{application.profiles?.location || 'Location not added'} · {application.profiles?.phone || 'Phone not added'}</p>
                                                {application.cover_note && <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{application.cover_note}</p>}
                                            </div>
                                            <select value={application.status} onChange={(event) => updateApplicationStatus(application.id, event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                                                {applicationStatuses.map((status) => <option key={status} value={status}>{toTitleCase(status)}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 text-center">
                                <h3 className="text-lg font-bold text-gray-950">No applications yet</h3>
                                <p className="mt-2 text-gray-600">Applications will appear here when candidates apply.</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default RecruiterDashboard;
