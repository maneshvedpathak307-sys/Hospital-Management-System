import React, {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import "../../styles/dashboard.css";


function AdminDashboard() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [stats, setStats] = useState({

        doctors: 0,

        patients: 0,

        appointments: 0,

        departments: 0

    });


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD DASHBOARD DATA
    // =====================================================

    useEffect(() => {

        fetchDashboardData();

    }, []);


    const fetchDashboardData = async () => {

        try {

            setLoading(true);

            setError("");


            console.log(
                "================================="
            );

            console.log(
                "ADMIN DASHBOARD - Loading statistics"
            );


            // =================================================
            // FETCH ALL ADMIN DATA
            // =================================================

            const [

                doctorsResponse,

                patientsResponse,

                appointmentsResponse,

                departmentsResponse

            ] = await Promise.all([

                api.get("/admin/doctors"),

                api.get("/admin/patients"),

                api.get("/admin/appointments"),

                api.get("/admin/departments")

            ]);


            console.log(
                "Doctors:",
                doctorsResponse.data
            );

            console.log(
                "Patients:",
                patientsResponse.data
            );

            console.log(
                "Appointments:",
                appointmentsResponse.data
            );

            console.log(
                "Departments:",
                departmentsResponse.data
            );


            // =================================================
            // CONVERT RESPONSE TO ARRAYS
            // =================================================

            const doctors =
                Array.isArray(
                    doctorsResponse.data
                )
                    ? doctorsResponse.data
                    : [];


            const patients =
                Array.isArray(
                    patientsResponse.data
                )
                    ? patientsResponse.data
                    : [];


            const appointments =
                Array.isArray(
                    appointmentsResponse.data
                )
                    ? appointmentsResponse.data
                    : [];


            const departments =
                Array.isArray(
                    departmentsResponse.data
                )
                    ? departmentsResponse.data
                    : [];


            // =================================================
            // SET REAL STATISTICS
            // =================================================

            setStats({

                doctors:
                    doctors.length,

                patients:
                    patients.length,

                appointments:
                    appointments.length,

                departments:
                    departments.length

            });


            console.log(
                "================================="
            );

            console.log(
                "ADMIN DASHBOARD STATISTICS"
            );

            console.log(
                "Total Doctors:",
                doctors.length
            );

            console.log(
                "Total Patients:",
                patients.length
            );

            console.log(
                "Total Appointments:",
                appointments.length
            );

            console.log(
                "Total Departments:",
                departments.length
            );

            console.log(
                "================================="
            );


        } catch (error) {

            console.error(
                "Admin dashboard error:",
                error
            );


            console.error(
                "HTTP status:",
                error.response?.status
            );


            console.error(
                "Backend response:",
                error.response?.data
            );


            setError(

                error.response?.data?.message ||

                (
                    typeof error.response?.data ===
                    "string"

                        ? error.response.data

                        : "Unable to load dashboard statistics."
                )

            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div className="dashboard-page">


            {/* =========================================
                WELCOME BANNER
            ========================================= */}

            <div className="dashboard-welcome admin-welcome">

                <div className="welcome-content">

                    <span className="welcome-label">
                        Welcome back 👋
                    </span>

                    <h2>
                        Administrator
                    </h2>

                    <p>
                        Manage doctors, patients, appointments,
                        departments and hospital operations from
                        one powerful dashboard.
                    </p>

                </div>


                <div className="welcome-visual">

                    <div className="welcome-circle">
                        👨‍💼
                    </div>

                </div>

            </div>


            {/* =========================================
                ERROR
            ========================================= */}

            {error && (

                <div className="error-alert">

                    ⚠️ {error}

                </div>

            )}


            {/* =========================================
                HOSPITAL OVERVIEW
            ========================================= */}

            <section className="dashboard-section">

                <div className="dashboard-section-header">

                    <div>

                        <h2>
                            Hospital Overview
                        </h2>

                        <p>
                            Quick summary of hospital activities
                        </p>

                    </div>

                </div>


                {/* =====================================
                    STATISTICS
                ===================================== */}

                <div className="dashboard-stats-grid">


                    {/* =================================
                        TOTAL DOCTORS
                    ================================= */}

                    <div
                        className="dashboard-stat-card"
                        onClick={() =>
                            navigate("/admin/doctors")
                        }
                    >

                        <div className="dashboard-stat-top">

                            <div className="dashboard-stat-icon blue">

                                👨‍⚕️

                            </div>

                            <span className="stat-arrow">
                                →
                            </span>

                        </div>


                        <div className="dashboard-stat-title">

                            Total Doctors

                        </div>


                        <div className="dashboard-stat-value">

                            {loading
                                ? "..."
                                : stats.doctors
                            }

                        </div>


                        <div className="dashboard-stat-description">

                            Active doctors

                        </div>

                    </div>


                    {/* =================================
                        TOTAL PATIENTS
                    ================================= */}

                    <div
                        className="dashboard-stat-card"
                        onClick={() =>
                            navigate("/admin/patients")
                        }
                    >

                        <div className="dashboard-stat-top">

                            <div className="dashboard-stat-icon green">

                                🧑‍🤝‍🧑

                            </div>

                            <span className="stat-arrow">
                                →
                            </span>

                        </div>


                        <div className="dashboard-stat-title">

                            Total Patients

                        </div>


                        <div className="dashboard-stat-value">

                            {loading
                                ? "..."
                                : stats.patients
                            }

                        </div>


                        <div className="dashboard-stat-description">

                            Registered patients

                        </div>

                    </div>


                    {/* =================================
                        APPOINTMENTS
                    ================================= */}

                    <div
                        className="dashboard-stat-card"
                        onClick={() =>
                            navigate("/admin/appointments")
                        }
                    >

                        <div className="dashboard-stat-top">

                            <div className="dashboard-stat-icon purple">

                                📅

                            </div>

                            <span className="stat-arrow">
                                →
                            </span>

                        </div>


                        <div className="dashboard-stat-title">

                            Appointments

                        </div>


                        <div className="dashboard-stat-value">

                            {loading
                                ? "..."
                                : stats.appointments
                            }

                        </div>


                        <div className="dashboard-stat-description">

                            Total appointments

                        </div>

                    </div>


                    {/* =================================
                        DEPARTMENTS
                    ================================= */}

                    <div
                        className="dashboard-stat-card"
                        onClick={() =>
                            navigate("/admin/departments")
                        }
                    >

                        <div className="dashboard-stat-top">

                            <div className="dashboard-stat-icon orange">

                                🏥

                            </div>

                            <span className="stat-arrow">
                                →
                            </span>

                        </div>


                        <div className="dashboard-stat-title">

                            Departments

                        </div>


                        <div className="dashboard-stat-value">

                            {loading
                                ? "..."
                                : stats.departments
                            }

                        </div>


                        <div className="dashboard-stat-description">

                            Hospital departments

                        </div>

                    </div>


                </div>

            </section>


        </div>

    );

}


export default AdminDashboard;