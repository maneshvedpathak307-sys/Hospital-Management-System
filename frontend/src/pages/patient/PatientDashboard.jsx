import React, { useEffect, useState } from "react";

import api from "../../services/api";

import "../../styles/dashboard.css";


function PatientDashboard() {

    const [dashboard, setDashboard] =
        useState(null);

    const [profile, setProfile] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [loadingProfile, setLoadingProfile] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =====================================================
       LOAD DASHBOARD + PROFILE
    ===================================================== */

    useEffect(() => {

        fetchDashboard();

        fetchPatientProfile();

    }, []);


    /* =====================================================
       LOAD PATIENT DASHBOARD
    ===================================================== */

    const fetchDashboard = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await api.get(
                    "/patient/dashboard"
                );


            console.log(
                "Patient dashboard data:",
                response.data
            );


            if (response?.data) {

                setDashboard(
                    response.data
                );

            }

        } catch (error) {

            console.error(
                "Patient dashboard error:",
                error
            );


            setError(

                error.response?.data?.message ||

                (
                    typeof error.response?.data === "string"

                        ? error.response.data

                        : "Unable to load dashboard."
                )

            );

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       LOAD PATIENT PROFILE
    ===================================================== */

    const fetchPatientProfile = async () => {

        try {

            setLoadingProfile(true);


            const response =
                await api.get(
                    "/patient/profile"
                );


            console.log(
                "Patient profile:",
                response.data
            );


            if (response?.data) {

                setProfile(
                    response.data
                );

            }

        } catch (error) {

            console.error(
                "Patient profile error:",
                error
            );

        } finally {

            setLoadingProfile(false);

        }

    };


    /* =====================================================
       GET PATIENT NAME
    ===================================================== */

    const getPatientName = () => {

        /*
         * First priority:
         * Patient profile
         */

        const nameFromProfile =
            profile?.patientName ||
            profile?.name;


        /*
         * Second priority:
         * Dashboard response
         */

        const nameFromDashboard =
            dashboard?.patientName ||
            dashboard?.name;


        const patientName =
            nameFromProfile ||
            nameFromDashboard ||
            "Patient";


        /*
         * Remove existing title
         *
         * Example:
         *
         * Mr. Rahul
         * Mrs. Priya
         * Ms. Anjali
         */

        const cleanName =
            patientName
                .toString()
                .replace(
                    /^(mr\.?|mrs\.?|ms\.?)\s+/i,
                    ""
                )
                .trim();


        /* =================================================
           FEMALE
        ================================================= */

        if (
            String(
                profile?.gender || ""
            )
                .toUpperCase() === "FEMALE"
        ) {

            return `Mrs. ${cleanName}`;

        }


        /* =================================================
           MALE
        ================================================= */

        if (
            String(
                profile?.gender || ""
            )
                .toUpperCase() === "MALE"
        ) {

            return `Mr. ${cleanName}`;

        }


        /* =================================================
           UNKNOWN / OTHER
        ================================================= */

        return cleanName;

    };


    /* =====================================================
       DASHBOARD DATA
    ===================================================== */

    const data =
        dashboard || {};


    const patientName =
        getPatientName();


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="dashboard-loading">

                <div className="dashboard-spinner"></div>

                <p>
                    Loading your dashboard...
                </p>

            </div>

        );

    }


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <div className="dashboard-page">


            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (

                <div className="dashboard-error">

                    <span>
                        ⚠️
                    </span>

                    <div>

                        <strong>
                            Unable to load some information
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                </div>

            )}


            {/* =================================================
                WELCOME BANNER
            ================================================= */}

            <div className="dashboard-welcome patient-welcome">

                <div className="welcome-content">


                    {/* WELCOME LABEL */}

                    <span className="welcome-label">

                        Welcome back 👋

                    </span>


                    {/* PATIENT NAME */}

                    <h2>

                        {loadingProfile
                            ? "Loading..."
                            : patientName
                        }

                    </h2>


                    {/* DESCRIPTION */}

                    <p>

                        Manage your healthcare information,
                        appointments and prescriptions from
                        one convenient dashboard.

                    </p>

                </div>


                {/* PATIENT ICON */}

                <div className="welcome-visual">

                    <div className="welcome-circle">

                        🧑

                    </div>

                </div>

            </div>



            {/* =================================================
                MY OVERVIEW
            ================================================= */}

            <section className="dashboard-section">


                {/* SECTION HEADER */}

                <div className="dashboard-section-header">

                    <div>

                        <h2>
                            My Overview
                        </h2>

                        <p>
                            Quick summary of your healthcare
                            activities
                        </p>

                    </div>

                </div>



                {/* =================================================
                    STATISTICS
                ================================================= */}

                <div className="dashboard-stats-grid">


                    {/* =================================================
                        TOTAL APPOINTMENTS
                    ================================================= */}

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-top">

                            <div className="dashboard-stat-icon blue">

                                📅

                            </div>

                        </div>


                        <div className="dashboard-stat-title">

                            Total Appointments

                        </div>


                        <div className="dashboard-stat-value">

                            {
                                data.totalAppointments ?? 0
                            }

                        </div>


                        <div className="dashboard-stat-description">

                            All your appointments

                        </div>

                    </div>



                    {/* =================================================
                        UPCOMING APPOINTMENTS
                    ================================================= */}

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-top">

                            <div className="dashboard-stat-icon purple">

                                🗓️

                            </div>

                        </div>


                        <div className="dashboard-stat-title">

                            Upcoming Appointments

                        </div>


                        <div className="dashboard-stat-value">

                            {
                                data.upcomingAppointments ?? 0
                            }

                        </div>


                        <div className="dashboard-stat-description">

                            Scheduled appointments

                        </div>

                    </div>



                    {/* =================================================
                        PRESCRIPTIONS
                    ================================================= */}

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

                            {
                                data.totalPrescriptions ?? 0
                            }

                        </div>


                        <div className="dashboard-stat-description">

                            Prescriptions received

                        </div>

                    </div>



                    {/* =================================================
                        PENDING BILLS
                    ================================================= */}

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-top">

                            <div className="dashboard-stat-icon orange">

                                💳

                            </div>

                        </div>


                        <div className="dashboard-stat-title">

                            Pending Bills

                        </div>


                        <div className="dashboard-stat-value">

                            {
                                data.pendingBills ?? 0
                            }

                        </div>


                        <div className="dashboard-stat-description">

                            Bills awaiting payment

                        </div>

                    </div>

                </div>

            </section>



            {/* =================================================
                NEXT APPOINTMENT
            ================================================= */}

            {data.nextAppointment && (

                <section className="dashboard-section">


                    {/* SECTION HEADER */}

                    <div className="dashboard-section-header">

                        <div>

                            <h2>
                                Next Appointment
                            </h2>

                            <p>
                                Your upcoming appointment
                            </p>

                        </div>

                    </div>



                    {/* APPOINTMENT CARD */}

                    <div className="next-appointment-card">


                        {/* ICON */}

                        <div className="next-appointment-icon">

                            📅

                        </div>



                        {/* APPOINTMENT DETAILS */}

                        <div className="next-appointment-details">

                            <span>

                                UPCOMING APPOINTMENT

                            </span>


                            <h3>

                                {
                                    data.nextAppointment.doctorName ||
                                    "Doctor"
                                }

                            </h3>


                            <p>

                                {
                                    data.nextAppointment.departmentName ||
                                    "Department"
                                }

                            </p>

                        </div>



                        {/* DATE + TIME */}

                        <div className="appointment-date">

                            <strong>

                                {
                                    data.nextAppointment.appointmentDate ||
                                    "-"
                                }

                            </strong>


                            <span>

                                {
                                    data.nextAppointment.appointmentTime ||
                                    "-"
                                }

                            </span>

                        </div>

                    </div>

                </section>

            )}



            {/* =================================================
                NO UPCOMING APPOINTMENT
            ================================================= */}

            {!data.nextAppointment && (

                <section className="dashboard-section">


                    <div className="dashboard-section-header">

                        <div>

                            <h2>
                                Next Appointment
                            </h2>

                            <p>
                                Your upcoming appointment
                            </p>

                        </div>

                    </div>


                    <div className="next-appointment-card">


                        <div className="next-appointment-icon">

                            📅

                        </div>


                        <div className="next-appointment-details">

                            <span>
                                NO UPCOMING APPOINTMENT
                            </span>


                            <h3>
                                No appointment scheduled
                            </h3>


                            <p>
                                You currently have no upcoming
                                appointments.
                            </p>

                        </div>

                    </div>

                </section>

            )}

        </div>

    );

}


export default PatientDashboard;