create extension if not exists "pgcrypto";

do $$ begin
    create type user_role as enum ('candidate', 'recruiter');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type job_status as enum ('draft', 'published', 'closed');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type application_status as enum ('applied', 'reviewing', 'shortlisted', 'rejected', 'hired');
exception
    when duplicate_object then null;
end $$;

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    role user_role not null,
    full_name text not null,
    phone text,
    location text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.candidate_profiles (
    id uuid primary key references public.profiles(id) on delete cascade,
    resume_url text,
    target_role text,
    skills text[] not null default '{}',
    experience_years numeric(4, 1) not null default 0,
    education text,
    expected_salary text,
    notice_period text,
    preferred_job_types text[] not null default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.candidate_profiles add column if not exists target_role text;
alter table public.candidate_profiles add column if not exists expected_salary text;
alter table public.candidate_profiles add column if not exists notice_period text;

create table if not exists public.recruiter_profiles (
    id uuid primary key references public.profiles(id) on delete cascade,
    company_name text not null,
    website text,
    industry text,
    company_size text,
    verification_status text not null default 'pending',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.job_categories (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    created_at timestamptz not null default now()
);

create table if not exists public.jobs (
    id uuid primary key default gen_random_uuid(),
    recruiter_id uuid not null references public.recruiter_profiles(id) on delete cascade,
    title text not null,
    category text not null references public.job_categories(name),
    company text not null,
    location text not null,
    salary_min integer,
    salary_max integer,
    experience_min numeric(4, 1),
    experience_max numeric(4, 1),
    job_type text not null,
    workplace_type text not null,
    description text not null,
    requirements text,
    status job_status not null default 'draft',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (salary_min is null or salary_min >= 0),
    check (salary_max is null or salary_max >= 0),
    check (experience_min is null or experience_min >= 0),
    check (experience_max is null or experience_max >= 0)
);

create table if not exists public.applications (
    id uuid primary key default gen_random_uuid(),
    job_id uuid not null references public.jobs(id) on delete cascade,
    candidate_id uuid not null references public.candidate_profiles(id) on delete cascade,
    status application_status not null default 'applied',
    cover_note text,
    resume_snapshot text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (job_id, candidate_id)
);

create index if not exists jobs_status_created_at_idx on public.jobs(status, created_at desc);
create index if not exists jobs_recruiter_id_idx on public.jobs(recruiter_id);
create index if not exists applications_candidate_id_idx on public.applications(candidate_id);
create index if not exists applications_job_id_idx on public.applications(job_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
declare
    requested_role user_role := coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'candidate'::user_role);
    raw_skills text := new.raw_user_meta_data ->> 'skills';
begin
    insert into public.profiles (id, role, full_name, phone, location)
    values (
        new.id,
        requested_role,
        coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data ->> 'phone',
        new.raw_user_meta_data ->> 'location'
    )
    on conflict (id) do nothing;

    if requested_role = 'recruiter' then
        insert into public.recruiter_profiles (id, company_name, website, industry, company_size)
        values (
            new.id,
            coalesce(new.raw_user_meta_data ->> 'company_name', 'New Company'),
            new.raw_user_meta_data ->> 'website',
            new.raw_user_meta_data ->> 'industry',
            new.raw_user_meta_data ->> 'company_size'
        )
        on conflict (id) do nothing;
    else
        insert into public.candidate_profiles (id, resume_url, target_role, skills, experience_years, education, expected_salary, notice_period, preferred_job_types)
        values (
            new.id,
            new.raw_user_meta_data ->> 'resume_url',
            new.raw_user_meta_data ->> 'target_role',
            case
                when raw_skills is null or btrim(raw_skills) = '' then '{}'
                else string_to_array(raw_skills, ',')
            end,
            coalesce(nullif(new.raw_user_meta_data ->> 'experience_years', '')::numeric, 0),
            new.raw_user_meta_data ->> 'education',
            new.raw_user_meta_data ->> 'expected_salary',
            new.raw_user_meta_data ->> 'notice_period',
            '{}'
        )
        on conflict (id) do nothing;
    end if;

    return new;
end;
$$;

comment on function public.handle_new_user() is
'Creates portal profile rows from auth user metadata during signup so browser clients do not insert directly into RLS-protected profile tables.';

create or replace function public.recruiter_can_read_candidate_profile(candidate_profile_id uuid)
returns boolean
security definer
set search_path = public
language sql
stable
as $$
    select exists (
        select 1
        from public.applications a
        join public.jobs j on j.id = a.job_id
        where a.candidate_id = candidate_profile_id
        and j.recruiter_id = auth.uid()
    );
$$;

comment on function public.recruiter_can_read_candidate_profile(uuid) is
'Avoids recursive RLS when recruiters read basic candidate profile data through applications.';

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists candidate_profiles_set_updated_at on public.candidate_profiles;
create trigger candidate_profiles_set_updated_at before update on public.candidate_profiles for each row execute function public.set_updated_at();

drop trigger if exists recruiter_profiles_set_updated_at on public.recruiter_profiles;
create trigger recruiter_profiles_set_updated_at before update on public.recruiter_profiles for each row execute function public.set_updated_at();

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at before update on public.jobs for each row execute function public.set_updated_at();

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at before update on public.applications for each row execute function public.set_updated_at();

insert into public.job_categories (name) values
    ('Sales'),
    ('Telecalling / BPO'),
    ('Delivery'),
    ('Marketing'),
    ('Business Development'),
    ('Nurse'),
    ('QA / Testing'),
    ('Content Writing'),
    ('Accounts / Finance'),
    ('Cook / Chef / Baker'),
    ('Software / Web Developer'),
    ('Digital Marketing'),
    ('Driver'),
    ('Retail'),
    ('Human Resource'),
    ('Technician'),
    ('Back Office'),
    ('Beauty / Hair Stylist'),
    ('Graphic Designer'),
    ('Logistics / Operations'),
    ('Customer Support'),
    ('Data / Analytics')
on conflict (name) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'resumes',
    'resumes',
    false,
    5242880,
    array[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
)
on conflict (id) do update set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

alter table public.profiles enable row level security;
alter table public.candidate_profiles enable row level security;
alter table public.recruiter_profiles enable row level security;
alter table public.job_categories enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;

drop policy if exists "profiles own insert" on public.profiles;
create policy "profiles own insert" on public.profiles
for insert to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own update" on public.profiles
for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profiles readable by owner or relevant recruiter" on public.profiles;
create policy "profiles readable by owner or relevant recruiter" on public.profiles
for select to authenticated
using (
    auth.uid() = id
    or public.recruiter_can_read_candidate_profile(id)
);

drop policy if exists "candidate profiles own insert" on public.candidate_profiles;
create policy "candidate profiles own insert" on public.candidate_profiles
for insert to authenticated
with check (auth.uid() = id);

drop policy if exists "candidate profiles own update" on public.candidate_profiles;
create policy "candidate profiles own update" on public.candidate_profiles
for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "candidate profiles readable by owner" on public.candidate_profiles;
create policy "candidate profiles readable by owner" on public.candidate_profiles
for select to authenticated
using (auth.uid() = id);

drop policy if exists "recruiter profiles own insert" on public.recruiter_profiles;
create policy "recruiter profiles own insert" on public.recruiter_profiles
for insert to authenticated
with check (auth.uid() = id);

drop policy if exists "recruiter profiles own update" on public.recruiter_profiles;
create policy "recruiter profiles own update" on public.recruiter_profiles
for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "recruiter profiles readable by owner" on public.recruiter_profiles;
create policy "recruiter profiles readable by owner" on public.recruiter_profiles
for select to authenticated
using (auth.uid() = id);

drop policy if exists "categories public read" on public.job_categories;
create policy "categories public read" on public.job_categories
for select
using (true);

drop policy if exists "published jobs public read" on public.jobs;
create policy "published jobs public read" on public.jobs
for select
using (status = 'published' or recruiter_id = auth.uid());

drop policy if exists "recruiters insert own jobs" on public.jobs;
create policy "recruiters insert own jobs" on public.jobs
for insert to authenticated
with check (
    recruiter_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'recruiter')
);

drop policy if exists "recruiters update own jobs" on public.jobs;
create policy "recruiters update own jobs" on public.jobs
for update to authenticated
using (recruiter_id = auth.uid())
with check (recruiter_id = auth.uid());

drop policy if exists "applications visible to owner or recruiter" on public.applications;
create policy "applications visible to owner or recruiter" on public.applications
for select to authenticated
using (
    candidate_id = auth.uid()
    or exists (
        select 1 from public.jobs j
        where j.id = applications.job_id
        and j.recruiter_id = auth.uid()
    )
);

drop policy if exists "candidates apply to published jobs" on public.applications;
create policy "candidates apply to published jobs" on public.applications
for insert to authenticated
with check (
    candidate_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'candidate')
    and exists (select 1 from public.jobs j where j.id = job_id and j.status = 'published')
);

drop policy if exists "recruiters update application status" on public.applications;
create policy "recruiters update application status" on public.applications
for update to authenticated
using (
    exists (
        select 1 from public.jobs j
        where j.id = applications.job_id
        and j.recruiter_id = auth.uid()
    )
)
with check (
    exists (
        select 1 from public.jobs j
        where j.id = applications.job_id
        and j.recruiter_id = auth.uid()
    )
);

drop policy if exists "candidates upload own resumes" on storage.objects;
create policy "candidates upload own resumes" on storage.objects
for insert to authenticated
with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "candidates read own resumes" on storage.objects;
create policy "candidates read own resumes" on storage.objects
for select to authenticated
using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "candidates update own resumes" on storage.objects;
create policy "candidates update own resumes" on storage.objects
for update to authenticated
using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "candidates delete own resumes" on storage.objects;
create policy "candidates delete own resumes" on storage.objects
for delete to authenticated
using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = auth.uid()::text
);
