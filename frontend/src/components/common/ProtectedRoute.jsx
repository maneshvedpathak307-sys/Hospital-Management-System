import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


function ProtectedRoute({ allowedRoles = [] }) {

    const {
        user,
        loading,
        isAuthenticated
    } = useAuth();

    const location = useLocation();


    // =========================================
    // WAIT FOR AUTH STATE
    // =========================================

    if (loading) {

        return (
            <div className="loading-page">

                <div className="loading-spinner"></div>

                <p>
                    Checking authentication...
                </p>

            </div>
        );

    }


    // =========================================
    // NOT LOGGED IN
    // =========================================

    if (!isAuthenticated || !user) {

        return (
            <Navigate
                to="/"
                replace
                state={{
                    from: location
                }}
            />
        );

    }


    // =========================================
    // ROLE CHECK
    // =========================================

    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user.role)
    ) {

        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );

    }


    // =========================================
    // ACCESS GRANTED
    // =========================================

    return <Outlet />;

}


export default ProtectedRoute;