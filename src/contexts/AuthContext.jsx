import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContextCore';
import { supabase } from '../supabase';

const profileFromMetadata = (currentUser) => {
    if (!currentUser) return null;

    const metadata = currentUser.user_metadata || {};
    return {
        id: currentUser.id,
        role: metadata.role || 'candidate',
        full_name: metadata.full_name || currentUser.email?.split('@')[0] || 'User',
        phone: metadata.phone || null,
        location: metadata.location || null,
        is_metadata_fallback: true
    };
};

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadProfile = useCallback(async (currentUser) => {
        if (!currentUser) {
            setProfile(null);
            return null;
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .maybeSingle();

        if (error) {
            console.error('Failed to load profile:', error);
            const fallbackProfile = profileFromMetadata(currentUser);
            setProfile(fallbackProfile);
            return fallbackProfile;
        }

        const nextProfile = data || profileFromMetadata(currentUser);
        setProfile(nextProfile);
        return nextProfile;
    }, []);

    useEffect(() => {
        let isMounted = true;

        const hydrate = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (!isMounted) return;

                if (error) {
                    console.error('Failed to load auth session:', error);
                    setSession(null);
                    setUser(null);
                    setProfile(null);
                    return;
                }

                setSession(data.session);
                setUser(data.session?.user ?? null);
                await loadProfile(data.session?.user ?? null);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        hydrate();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession);
            setUser(nextSession?.user ?? null);
            setProfile(nextSession?.user ? profileFromMetadata(nextSession.user) : null);
            setIsLoading(false);

            setTimeout(() => {
                loadProfile(nextSession?.user ?? null);
            }, 0);
        });

        return () => {
            isMounted = false;
            listener.subscription.unsubscribe();
        };
    }, [loadProfile]);

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setProfile(null);
    };

    const value = useMemo(() => ({
        session,
        user,
        profile,
        isLoading,
        refreshProfile: () => loadProfile(user),
        signOut
    }), [session, user, profile, isLoading, loadProfile]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
