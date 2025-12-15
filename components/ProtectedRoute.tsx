import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const userRole = localStorage.getItem('user_role') as UserRole;
    const isRegistered = localStorage.getItem('user_registered') === 'true';

    // 1. Not registered or logged in -> Login
    if (!isRegistered || !userRole) {
        return <Navigate to="/login" replace />;
    }

    // 2. Role not allowed -> Redirect to their correct home
    if (!allowedRoles.includes(userRole)) {
        if (userRole === UserRole.ADMIN) return <Navigate to="/admin" replace />;
        if (userRole === UserRole.PROFESSIONAL) return <Navigate to="/dashboard" replace />;
        return <Navigate to="/home" replace />; // Default for Resident
    }

    return <>{children}</>;
};

export default ProtectedRoute;
