import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, IndianRupee, MapPin, Timer } from 'lucide-react';
import { formatExperience, formatSalary } from '../lib/formatters';

const JobCard = ({ job }) => (
    <Link
        to={`/jobs/${job.id}`}
        className="block rounded-lg border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
    >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">{job.category}</p>
                <h3 className="mt-1 text-xl font-bold text-gray-950">{job.title}</h3>
                <p className="mt-1 text-sm font-medium text-gray-600">{job.company}</p>
            </div>
            <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">{job.job_type}</span>
        </div>

        <div className="mt-5 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{job.location}</span>
            <span className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" />{formatExperience(job.experience_min, job.experience_max)}</span>
            <span className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-primary" />{formatSalary(job.salary_min, job.salary_max)}</span>
            <span className="flex items-center gap-2"><Timer className="h-4 w-4 text-primary" />{job.workplace_type}</span>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-600">{job.description}</p>
    </Link>
);

export default JobCard;

