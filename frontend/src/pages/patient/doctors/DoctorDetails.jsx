import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../../../services/api";

import PageHeader
    from "../../../components/common/PageHeader";

import Loading
    from "../../../components/common/Loading";

import "../../../styles/doctor-details.css";


function DoctorDetails() {

    /* =========================================
       URL PARAMETER
    ========================================= */

    const { id } = useParams();

    const navigate = useNavigate();


    /* =========================================
       STATE
    ========================================= */

    const [doctor, setDoctor] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =========================================
       LOAD DOCTOR
    ========================================= */

    const fetchDoctor = useCallback(async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await api.get(
                    `/patient/doctors/${id}`
                );

            setDoctor(
                response.data
            );

        } catch (error) {

            console.error(
                "Error loading doctor:",
                error
            );

            setDoctor(null);

            setError(
                error.response?.data?.message ||

                (
                    typeof error.response?.data === "string"

                        ? error.response.data

                        : "Unable to load doctor profile."
                )
            );

        } finally {

            setLoading(false);

        }

    }, [id]);


    /* =========================================
       USE EFFECT
    ========================================= */

    useEffect(() => {

        fetchDoctor();

    }, [fetchDoctor]);


    /* =========================================
       LOADING
    ========================================= */

    if (loading) {

        return (

            <div className="page-container">

                <Loading />

            </div>

        );

    }


    /* =========================================
       ERROR / NOT FOUND
    ========================================= */

    if (error || !doctor) {

        return (

            <div className="page-container doctor-details-page">


                {/* =================================
                    PAGE HEADER
                ================================= */}

                <PageHeader
                    title="Doctor Profile"
                    subtitle="View doctor professional information."
                />


                {/* =================================
                    ERROR CARD
                ================================= */}

                <div className="doctor-details-error">


                    <div className="doctor-details-error-icon">
                        ⚠️
                    </div>


                    <h3>
                        Unable to load doctor
                    </h3>


                    <p>

                        {
                            error ||
                            "Doctor profile not found."
                        }

                    </p>


                    <button
                        type="button"
                        className="doctor-back-button"
                        onClick={() =>
                            navigate(
                                "/patient/doctors"
                            )
                        }
                    >
                        ← Back to Doctors
                    </button>


                </div>

            </div>

        );

    }


    /* =========================================
       MAIN PAGE
    ========================================= */

    return (

        <div className="page-container doctor-details-page">


            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <PageHeader
                title="Doctor Profile"
                subtitle="View doctor professional information."
            />


            


            {/* =====================================
                MAIN PROFILE CARD
            ===================================== */}

            <div className="doctor-details-card">


                {/* =================================
                    PROFILE HEADER
                ================================= */}

                <div className="doctor-details-header">


                    {/* AVATAR */}

                    <div className="doctor-details-avatar">

                        👨‍⚕️

                    </div>


                    {/* BASIC INFORMATION */}

                    <div className="doctor-details-basic">


                        <h1>

                            {
                                doctor.doctorName ||
                                doctor.name ||
                                "Doctor"
                            }

                        </h1>


                        <p>

                            {
                                doctor.specialization ||
                                "Medical Specialist"
                            }

                        </p>


                        <span className="doctor-details-status">

                            <span></span>

                            Available for appointments

                        </span>


                    </div>

                </div>


                {/* =================================
                    CONTENT
                ================================= */}

                <div className="doctor-details-content">


                    {/* =================================
                        PROFESSIONAL INFORMATION
                    ================================= */}

                    <div className="doctor-details-section">


                        <h2>
                            Professional Information
                        </h2>


                        <div className="doctor-details-grid">


                            {/* =================================
                                SPECIALIZATION
                            ================================= */}

                            <div className="doctor-detail-item">


                                <span className="doctor-detail-icon">
                                    🩺
                                </span>


                                <div>

                                    <small>
                                        Specialization
                                    </small>


                                    <strong>

                                        {
                                            doctor.specialization ||
                                            "Not available"
                                        }

                                    </strong>

                                </div>

                            </div>


                            {/* =================================
                                DEPARTMENT
                            ================================= */}

                            <div className="doctor-detail-item">


                                <span className="doctor-detail-icon">
                                    🏥
                                </span>


                                <div>

                                    <small>
                                        Department
                                    </small>


                                    <strong>

                                        {
                                            doctor.departmentName ||
                                            "Not assigned"
                                        }

                                    </strong>

                                </div>

                            </div>


                            {/* =================================
                                QUALIFICATION
                            ================================= */}

                            <div className="doctor-detail-item">


                                <span className="doctor-detail-icon">
                                    🎓
                                </span>


                                <div>

                                    <small>
                                        Qualification
                                    </small>


                                    <strong>

                                        {
                                            doctor.qualification ||
                                            "Not available"
                                        }

                                    </strong>

                                </div>

                            </div>


                            {/* =================================
                                EXPERIENCE
                            ================================= */}

                            <div className="doctor-detail-item">


                                <span className="doctor-detail-icon">
                                    💼
                                </span>


                                <div>

                                    <small>
                                        Experience
                                    </small>


                                    <strong>

                                        {
                                            doctor.experience ||
                                            "Not available"
                                        }

                                    </strong>

                                </div>

                            </div>


                        </div>

                    </div>


                    {/* =================================
                        CONTACT INFORMATION
                    ================================= */}

                    <div className="doctor-details-section">


                        <h2>
                            Contact Information
                        </h2>


                        <div className="doctor-details-contact">


                            {/* EMAIL */}

                            <div className="doctor-contact-item">


                                <span>
                                    ✉️
                                </span>


                                <div>

                                    <small>
                                        Email
                                    </small>


                                    <strong>

                                        {
                                            doctor.email ||
                                            "Not available"
                                        }

                                    </strong>

                                </div>

                            </div>


                            {/* PHONE */}

                            <div className="doctor-contact-item">


                                <span>
                                    📞
                                </span>


                                <div>

                                    <small>
                                        Phone
                                    </small>


                                    <strong>

                                        {
                                            doctor.phone ||
                                            "Not available"
                                        }

                                    </strong>

                                </div>

                            </div>


                        </div>

                    </div>


                </div>


                {/* =================================
                    ACTIONS
                ================================= */}

                <div className="doctor-details-actions">


                    {/* BACK */}

                    <Link
                        to="/patient/doctors"
                        className="doctor-details-secondary"
                    >
                        ← Back
                    </Link>


                    {/* BOOK APPOINTMENT */}

                    <Link
                        to={`/patient/appointments/book?doctorId=${doctor.id}`}
                        className="doctor-details-primary"
                    >
                        📅 Book Appointment
                    </Link>


                </div>


            </div>

        </div>

    );

}


export default DoctorDetails;