import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../types';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const userRole = localStorage.getItem('user_role') as UserRole;
    const isRegistered = localStorage.getItem('user_registered') === 'true';

    if (!isRegistered || userRole !== UserRole.ADMIN) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
