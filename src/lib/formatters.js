export const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed';
    const compact = (value) => `₹${Number(value).toLocaleString('en-IN')}`;
    if (min && max) return `${compact(min)} - ${compact(max)} monthly`;
    return min ? `From ${compact(min)} monthly` : `Up to ${compact(max)} monthly`;
};

export const formatExperience = (min, max) => {
    if ((min === null || min === undefined) && (max === null || max === undefined)) return 'Any experience';
    if (Number(min) === 0 && Number(max) === 0) return 'Fresher';
    if (min !== null && min !== undefined && max !== null && max !== undefined) return `${min}-${max} years`;
    return min ? `${min}+ years` : `Up to ${max} years`;
};

export const toTitleCase = (value = '') => value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

