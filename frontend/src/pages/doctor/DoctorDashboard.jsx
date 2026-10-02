import React, {
    useEffect,
    useState
} from "react";

import {
    useAuth
} from "../../context/AuthContext";

import api from "../../services/api";

import "../../styles/dashboard.css";


function DoctorDashboard() {

    const { user } = useAuth();


    /* =========================================
       PROFILE
    ========================================= */

    const [profile, setProfile] =
        useState(null);


    const [loadingProfile, setLoadingProfile] =
        useState(true);


    /* =========================================
       DASHBOARD STATISTICS
    ========================================= */

    const [stats, setStats] = useState({

        myPatients: 0,

        todayAppointments: 0,

        pendingAppointments: 0,

        prescriptions: 0

    });


    const [loadingStats, setLoadingStats] =
        useState(true);


    /* =========================================
       LOAD DOCTOR PROFILE
    ========================================= */

    useEffect(() => {

        const fetchDoctorProfile = async () => {

            try {

                setLoadingProfile(true);


                const response =
                    await api.get(
                        "/doctor/profile"
                    );


                if (response?.data) {

                    setProfile(
                        response.data
                    );

                }

            } catch (error) {

                console.error(
                    "Error loading doctor profile:",
                    error
                );

            } finally {

                setLoadingProfile(false);

            }

        };


        fetchDoctorProfile();

    }, []);


    /* =========================================
       LOAD DASHBOARD STATISTICS
    ========================================= */

    useEffect(() => {

        const fetchDashboardStats = async () => {

            try {

                setLoadingStats(true);


                const response =
                    await api.get(
                        "/doctor/dashboard/stats"
                    );


                console.log(
                    "Doctor dashboard stats:",
                    response.data
                );


                if (response?.data) {

                    setStats({

                        myPatients:
                            response.data.myPatients ??
                            0,

                        todayAppointments:
                            response.data.todayAppointments ??
                            0,

                        pendingAppointments:
                            response.data.pendingAppointments ??
                            0,

                        prescriptions:
                            response.data.prescriptions ??
                            0

                    });

                }

            } catch (error) {

                console.error(
                    "Error loading doctor dashboard statistics:",
                    error
                );

            } finally {

                setLoadingStats(false);

            }

        };


        fetchDashboardStats();

    }, []);


    /* =========================================
       GET DOCTOR NAME
    ========================================= */

    const getDoctorName = () => {

        /*
         * First priority:
         * Doctor profile from backend
         */

        const nameFromProfile =
            profile?.doctorName ||
            profile?.name;


        /*
         * Second priority:
         * Logged-in user
         */

        const nameFromUser =
            user?.name;


        const doctorName =
            nameFromProfile ||
            nameFromUser ||
            "Doctor";


        const cleanName =
            doctorName
                .toString()
                .trim();


        /*
         * Avoid:
         *
         * Dr. Dr. Amit Patil
         */

        if (
            cleanName
                .toLowerCase()
                .startsWith("dr.")
        ) {

            return cleanName;

        }


        return `Dr. ${cleanName}`;

    };


    const doctorName =
        getDoctorName();


    /* =========================================
       TODAY'S DATE
    ========================================= */

    const today =
        new Date();


    const formattedDate =
        today.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    /* =========================================
       RETURN
    ========================================= */

    return (

        <div className="dashboard-page">


            {/* =========================================
                WELCOME CARD
            ========================================= */}

            <div className="dashboard-welcome doctor-welcome">

                <div className="welcome-content">


                    <span className="welcome-label">

                        Welcome back 👋

                    </span>


                    <h2>

                        {loadingProfile
                            ? "Loading..."
                            : doctorName
                        }

                    </h2>


                    <p>

                        Manage your patients, appointments
                        and prescriptions from one powerful
                        dashboard.

                    </p>

                </div>


                <div className="welcome-visual">

                    <div className="welcome-circle">

                        👨‍⚕️

                    </div>

                </div>

            </div>



            {/* =========================================
                MY OVERVIEW
            ========================================= */}

            <section className="dashboard-section">


                <div className="dashboard-section-header">

                    <div>

                        <h2>

                            My Overview

                        </h2>


                        <p>

                            Summary of your current activities

                        </p>

                    </div>

                </div>



                {/* =====================================
                    STATISTICS GRID
                ===================================== */}

                <div className="dashboard-stats-grid">


                    {/* =================================
                        MY PATIENTS
                    ================================= */}

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-top">

                            <div className="dashboard-stat-icon blue">

                                🧑‍🤝‍🧑

                            </div>

                        </div>


                        <div className="dashboard-stat-title">

                            My Patients

                        </div>


                        <div className="dashboard-stat-value">

                            {loadingStats
                                ? "..."
                                : stats.myPatients
                            }

                        </div>


                        <div className="dashboard-stat-description">

                            Patients under your care

                        </div>

                    </div>



                    {/* =================================
                        TODAY'S APPOINTMENTS
                    ================================= */}

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-top">

                            <div className="dashboard-stat-icon purple">

                                📅

                            </div>

                        </div>


                        <div className="dashboard-stat-title">

                            Today's Appointments

                        </div>


                        <div className="dashboard-stat-value">

                            {loadingStats
                                ? "..."
                                : stats.todayAppointments
                            }

                        </div>


                        <div className="dashboard-stat-description">

                            Scheduled for today

                        </div>

                    </div>



                    {/* =================================
                        PENDING APPOINTMENTS
                    ================================= */}

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-top">

                            <div className="dashboard-stat-icon orange">

                                ⏳

                            </div>

                        </div>


                        <div className="dashboard-stat-title">

                            Pending Appointments

                        </div>


                        <div className="dashboard-stat-value">

                            {loadingStats
                                ? "..."
                                : stats.pendingAppointments
                            }

                        </div>


                        <div className="dashboard-stat-description">

                            Awaiting your response

                        </div>

                    </div>



                    {/* =================================
                        PRESCRIPTIONS
                    ================================= */}

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-top">

                            <div className="dashboard-stat-icon green">

                                💊

                            </div>

                        </div>


                        <div className="dashboard-stat-title">

                            Prescriptions

                        </div>


                        <div className="dashboard-stat-value">

                            {loadingStats
                                ? "..."
                                : stats.prescriptions
                            }

                        </div>


                        <div className="dashboard-stat-description">

                            Prescriptions created

                        </div>

                    </div>


                </div>


                {/* =========================================
                    DASHBOARD DATE
                ========================================= */}

                <div
                    style={{
                        marginTop: "20px",
                        color: "#666",
                        fontSize: "14px"
                    }}
                >

                    Dashboard updated for {formattedDate}

                </div>


            </section>


        </div>

    );

}


export default DoctorDashboard;