import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContextCore';
import { supabase } from '../supabase';

const AuthCallback = () => {
    const { profile, refreshProfile } = useAuth();
    const [status, setStatus] = useState('Confirming your email...');
    const [redirectTo, setRedirectTo] = useState('');

    useEffect(() => {
        const finishConfirmation = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');

            if (code) {
                const { error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) {
                    setStatus(error.message || 'Could not confirm this email link.');
                    return;
                }
            } else {
                await supabase.auth.getSession();
            }

            const nextProfile = await refreshProfile();
            const role = nextProfile?.role || profile?.role;
            setStatus('Email confirmed.');
            setRedirectTo(role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
        };

        finishConfirmation();
    }, [profile, refreshProfile]);

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <SEO title="Confirming Email" description="Confirm your HiringRound account email." />
            <Navbar />
            <main className="mx-auto max-w-xl px-4 pb-16 pt-32 text-center sm:px-6 lg:px-8">
                <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-950">{status}</h1>
                    <p className="mt-3 text-gray-600">You can close this page after your dashboard opens.</p>
                </div>
            </main>
        </div>
    );
};

export default AuthCallback;

