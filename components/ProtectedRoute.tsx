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

    const normalizedRole = userRole ? userRole.toUpperCase() : '';

    // 2. Role not allowed -> Redirect to their correct home
    // Check using the normalized role against the allowed roles (which are Enums, likely Uppercase)
    // We also make sure to compare Enums as strings to be safe or assuming allowedRoles contains Enums.
    const isAllowed = allowedRoles.some(role => role === normalizedRole);

    if (!isAllowed) {
        if (normalizedRole === UserRole.ADMIN) return <Navigate to="/admin" replace />;
        if (normalizedRole === UserRole.PROFESSIONAL) return <Navigate to="/dashboard" replace />;
        return <Navigate to="/home" replace />; // Default for Resident
    }

    return <>{children}</>;
};

export default ProtectedRoute;
