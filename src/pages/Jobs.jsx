import React, { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import JobCard from '../components/JobCard';
import { jobCategories, jobTypes, workplaceTypes } from '../data/jobTaxonomy';
import { sampleJobs } from '../data/sampleJobs';
import { filterJobs } from '../lib/jobFilters';
import { supabase } from '../supabase';

const defaultFilters = {
    keyword: '',
    category: '',
    city: '',
    jobType: '',
    workplaceType: '',
    maxExperience: '',
    minSalary: '',
    freshness: ''
};

const Jobs = () => {
    const [jobs, setJobs] = useState(sampleJobs);
    const [filters, setFilters] = useState(defaultFilters);
    const [isLoading, setIsLoading] = useState(true);
    const [notice, setNotice] = useState('');

    useEffect(() => {
        const loadJobs = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Failed to load jobs:', error);
                setNotice('Showing sample jobs until the live job database is available.');
                setJobs(sampleJobs);
            } else {
                setJobs(data?.length ? data : sampleJobs);
                setNotice(data?.length ? '' : 'Showing sample jobs. Published recruiter jobs will appear here automatically.');
            }
            setIsLoading(false);
        };

        loadJobs();
    }, []);

    const filteredJobs = useMemo(() => filterJobs(jobs, filters), [jobs, filters]);

    const updateFilter = (event) => {
        const { name, value } = event.target;
        setFilters((current) => ({ ...current, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <SEO title="Find Jobs" description="Search verified jobs by category, location, salary, experience, and work type on HiringRound." />
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
                <section className="mb-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-wide text-primary">HiringRound Jobs</p>
                            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">Find roles across every major category</h1>
                            <p className="mt-4 text-lg text-gray-600">Search original HiringRound listings and recruiter-posted opportunities. No third-party listings are copied.</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white px-5 py-4 text-sm text-gray-600">
                            <span className="font-bold text-gray-950">{filteredJobs.length}</span> matching jobs
                        </div>
                    </div>
                </section>

                <section className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700">
                        <SlidersHorizontal className="h-4 w-4 text-primary" />
                        Filters
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <label className="relative md:col-span-2">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input name="keyword" value={filters.keyword} onChange={updateFilter} placeholder="Search title, company, skill" className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        </label>
                        <input name="city" value={filters.city} onChange={updateFilter} placeholder="City or remote" className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        <select name="category" value={filters.category} onChange={updateFilter} className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                            <option value="">All categories</option>
                            {jobCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                        </select>
                        <select name="jobType" value={filters.jobType} onChange={updateFilter} className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                            <option value="">All job types</option>
                            {jobTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <select name="workplaceType" value={filters.workplaceType} onChange={updateFilter} className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                            <option value="">All work modes</option>
                            {workplaceTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <input name="maxExperience" type="number" min="0" value={filters.maxExperience} onChange={updateFilter} placeholder="Max experience" className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        <input name="minSalary" type="number" min="0" value={filters.minSalary} onChange={updateFilter} placeholder="Min salary" className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        <select name="freshness" value={filters.freshness} onChange={updateFilter} className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                            <option value="">Any date</option>
                            <option value="1">Last 24 hours</option>
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                        </select>
                    </div>
                </section>

                {notice && <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">{notice}</div>}

                {isLoading ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {[1, 2, 3, 4].map((item) => <div key={item} className="h-56 animate-pulse rounded-lg border border-gray-200 bg-white" />)}
                    </div>
                ) : filteredJobs.length ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {filteredJobs.map((job) => <JobCard key={job.id} job={job} />)}
                    </div>
                ) : (
                    <div className="rounded-lg border border-gray-200 bg-white p-10 text-center">
                        <h2 className="text-xl font-bold text-gray-950">No jobs match these filters</h2>
                        <p className="mt-2 text-gray-600">Try broadening category, salary, or city filters.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Jobs;

