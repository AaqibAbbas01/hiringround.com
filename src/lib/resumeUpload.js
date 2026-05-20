const RESUME_BUCKET = 'resumes';

export const uploadResume = async ({ supabase, userId, file }) => {
    if (!file) return null;

    const extension = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const safeName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9-_]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'resume';
    const path = `${userId}/${Date.now()}-${safeName}.${extension}`;

    const { error } = await supabase.storage
        .from(RESUME_BUCKET)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (error) throw error;
    return path;
};

export const validateResumeFile = (file) => {
    if (!file) return '';

    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
        return 'Upload a PDF, DOC, or DOCX resume.';
    }

    if (file.size > maxSize) {
        return 'Resume must be 5 MB or smaller.';
    }

    return '';
};

