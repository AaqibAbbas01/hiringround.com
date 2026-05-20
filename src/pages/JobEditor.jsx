import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import { jobCategories, jobTypes, workplaceTypes } from '../data/jobTaxonomy';
import { useAuth } from '../contexts/AuthContextCore';
import { supabase } from '../supabase';

const emptyJob = {
    title: '',
    category: jobCategories[0],
    company: '',
    location: '',
    salary_min: '',
    salary_max: '',
    experience_min: '',
    experience_max: '',
    job_type: 'Full Time',
    workplace_type: 'Work from Office',
    description: '',
    requirements: '',
    status: 'published'
};

const JobEditor = () => {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(emptyJob);
    const [isLoading, setIsLoading] = useState(isEditing);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadJob = async () => {
            if (!isEditing || !user) return;
            setIsLoading(true);
            const { data, error: loadError } = await supabase
                .from('jobs')
                .select('*')
                .eq('id', id)
                .eq('recruiter_id', user.id)
                .maybeSingle();

            if (loadError) {
                setError(loadError.message);
            } else if (!data) {
                setError('Job not found or you do not have access to edit it.');
            } else {
                setJob({
                    title: data.title || '',
                    category: data.category || jobCategories[0],
                    company: data.company || '',
                    location: data.location || '',
                    salary_min: data.salary_min ?? '',
                    salary_max: data.salary_max ?? '',
                    experience_min: data.experience_min ?? '',
                    experience_max: data.experience_max ?? '',
                    job_type: data.job_type || 'Full Time',
                    workplace_type: data.workplace_type || 'Work from Office',
                    description: data.description || '',
                    requirements: data.requirements || '',
                    status: data.status || 'published'
                });
            }
            setIsLoading(false);
        };

        loadJob();
    }, [id, isEditing, user]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setJob((current) => ({ ...current, [name]: value }));
    };

    const numberOrNull = (value) => value === '' ? null : Number(value);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        setError('');

        const payload = {
            ...job,
            salary_min: numberOrNull(job.salary_min),
            salary_max: numberOrNull(job.salary_max),
            experience_min: numberOrNull(job.experience_min),
            experience_max: numberOrNull(job.experience_max)
        };

        const result = isEditing
            ? await supabase.from('jobs').update(payload).eq('id', id).eq('recruiter_id', user.id).select('id').single()
            : await supabase.from('jobs').insert([{ ...payload, recruiter_id: user.id }]).select('id').single();

        if (result.error) {
            setError(result.error.message);
            setIsSaving(false);
            return;
        }

        navigate('/recruiter/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <SEO title={isEditing ? 'Edit Job' : 'Post Job'} description="Create and manage recruiter job postings on HiringRound." />
            <Navbar />
            <main className="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-wide text-primary">Recruiter portal</p>
                    <h1 className="mt-2 text-4xl font-bold text-gray-950">{isEditing ? 'Edit job' : 'Post a job'}</h1>
                </div>

                <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    {isLoading ? (
                        <div className="h-96 animate-pulse rounded-lg bg-gray-100" />
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}

                            <div className="grid gap-4 md:grid-cols-2">
                                <label className="block text-sm font-bold text-gray-700">
                                    Job title
                                    <input name="title" required value={job.title} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Company
                                    <input name="company" required value={job.company} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Category
                                    <select name="category" required value={job.category} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                                        {jobCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                                    </select>
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Location
                                    <input name="location" required value={job.location} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Job type
                                    <select name="job_type" value={job.job_type} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                                        {jobTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Work mode
                                    <select name="workplace_type" value={job.workplace_type} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                                        {workplaceTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Salary min
                                    <input name="salary_min" type="number" min="0" value={job.salary_min} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Salary max
                                    <input name="salary_max" type="number" min="0" value={job.salary_max} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Experience min
                                    <input name="experience_min" type="number" min="0" value={job.experience_min} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Experience max
                                    <input name="experience_max" type="number" min="0" value={job.experience_max} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                                </label>
                                <label className="block text-sm font-bold text-gray-700">
                                    Status
                                    <select name="status" value={job.status} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </label>
                            </div>

                            <label className="block text-sm font-bold text-gray-700">
                                Description
                                <textarea name="description" required rows="6" value={job.description} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                            </label>
                            <label className="block text-sm font-bold text-gray-700">
                                Requirements
                                <textarea name="requirements" rows="5" value={job.requirements} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                            </label>

                            <button disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-white hover:bg-primary-dark disabled:opacity-60">
                                <Save className="h-4 w-4" />
                                {isSaving ? 'Saving...' : 'Save job'}
                            </button>
                        </form>
                    )}
                </section>
            </main>
        </div>
    );
};

export default JobEditor;
