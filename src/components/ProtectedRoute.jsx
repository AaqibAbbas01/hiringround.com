import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextCore';

const ProtectedRoute = ({ role, children }) => {
    const { isLoading, user, profile } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-28">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="h-32 rounded-lg bg-white border border-gray-200 animate-pulse" />
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
    }

    if (role && profile?.role !== role) {
        const fallback = profile?.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard';
        return <Navigate to={fallback} replace />;
    }

    return children;
};

export default ProtectedRoute;
