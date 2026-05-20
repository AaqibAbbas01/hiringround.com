export const filterJobs = (jobs, filters) => {
    const keyword = filters.keyword.trim().toLowerCase();
    const city = filters.city.trim().toLowerCase();
    const now = Date.now();

    return jobs.filter((job) => {
        const searchable = `${job.title} ${job.company} ${job.category} ${job.location} ${job.description}`.toLowerCase();
        const matchesKeyword = !keyword || searchable.includes(keyword);
        const matchesCategory = !filters.category || job.category === filters.category;
        const matchesCity = !city || job.location.toLowerCase().includes(city);
        const matchesJobType = !filters.jobType || job.job_type === filters.jobType;
        const matchesWorkplace = !filters.workplaceType || job.workplace_type === filters.workplaceType;
        const matchesExperience = !filters.maxExperience || Number(job.experience_min ?? 0) <= Number(filters.maxExperience);
        const matchesSalary = !filters.minSalary || Number(job.salary_max ?? 0) >= Number(filters.minSalary);
        const ageDays = (now - new Date(job.created_at).getTime()) / 86400000;
        const matchesFreshness = !filters.freshness || ageDays <= Number(filters.freshness);

        return matchesKeyword && matchesCategory && matchesCity && matchesJobType && matchesWorkplace && matchesExperience && matchesSalary && matchesFreshness;
    });
};

