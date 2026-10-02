import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../../../services/api";

import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";


function DoctorDetails() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [doctor, setDoctor] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =====================================================
       LOAD DOCTOR
    ===================================================== */

    const loadDoctor = useCallback(async () => {

        try {

            setLoading(true);

            setError("");

            setDoctor(null);


            /*
             * IMPORTANT
             *
             * Admin viewing a doctor:
             *
             * GET /api/admin/doctors/{id}
             */

            const response =
                await api.get(
                    `/admin/doctors/${id}`
                );


            console.log(
                "Doctor details response:",
                response.data
            );


            setDoctor(response.data);

        } catch (error) {

            console.error(
                "Doctor details error:",
                error
            );


            if (
                error.response?.status === 404
            ) {

                setError(
                    "Doctor not found."
                );

            } else {

                setError(
                    error.response?.data?.message ||
                    (
                        typeof error.response?.data === "string"
                            ? error.response.data
                            : "Unable to load doctor details."
                    )
                );

            }

        } finally {

            setLoading(false);

        }

    }, [id]);


    /* =====================================================
       USE EFFECT
    ===================================================== */

    useEffect(() => {

        loadDoctor();

    }, [loadDoctor]);


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="page-container">

                <Loading />

            </div>

        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (error || !doctor) {

        return (

            <div className="page-container">

                <PageHeader
                    title="Doctor Details"
                    subtitle="View doctor information."
                />


                <div className="page-error">

                    ⚠️{" "}

                    {error ||
                        "Doctor not found."}

                </div>


                <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                        navigate(
                            "/admin/doctors"
                        )
                    }
                >

                    ← Back to Doctors

                </button>

            </div>

        );

    }


    /* =====================================================
       HELPER VALUES
    ===================================================== */

    const departmentName =
        doctor.departmentName ||
        doctor.department?.departmentName ||
        "Not assigned";


    const doctorEmail =
        doctor.email ||
        "Not available";


    const doctorPhone =
        doctor.phone ||
        "Not available";


    const loginEmail =
        doctor.loginEmail ||
        doctor.user?.loginEmail ||
        doctor.user?.email ||
        "Not available";


    const role =
        doctor.role ||
        doctor.user?.role ||
        "DOCTOR";


    const status =
        doctor.status ||
        (
            doctor.user?.enabled
                ? "ACTIVE"
                : "INACTIVE"
        );


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <div className="page-container">


            {/* =================================================
                HEADER
            ================================================= */}

            <PageHeader
                title="Doctor Details"
                subtitle="View complete doctor information."
            />


            {/* =================================================
                TOP ACTIONS
            ================================================= */}

            <div className="details-actions">


                <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                        navigate(
                            "/admin/doctors"
                        )
                    }
                >

                    ← Back to Doctors

                </button>


                <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                        navigate(
                            `/admin/doctors/edit/${doctor.id}`
                        )
                    }
                >

                    ✏️ Edit Doctor

                </button>


            </div>


            {/* =================================================
                PROFILE CARD
            ================================================= */}

            <div className="details-card">


                {/* =================================================
                    PROFILE HEADER
                ================================================= */}

                <div className="doctor-profile-header">


                    <div className="doctor-large-avatar">

                        👨‍⚕️

                    </div>


                    <div>

                        <h2>

                            {
                                doctor.doctorName ||
                                doctor.name ||
                                "Doctor"
                            }

                        </h2>


                        <p>

                            {
                                doctor.specialization ||
                                "Specialization not specified"
                            }

                        </p>


                        <span className="details-id">

                            Doctor ID: #{doctor.id}

                        </span>


                    </div>


                </div>


                {/* =================================================
                    PROFESSIONAL INFORMATION
                ================================================= */}

                <div className="details-section">


                    <div className="details-section-title">


                        <div className="details-icon">

                            👨‍⚕️

                        </div>


                        <div>

                            <h3>

                                Professional Information

                            </h3>


                            <p>

                                Doctor's hospital information

                            </p>

                        </div>


                    </div>


                    <div className="details-grid">


                        {/* DOCTOR NAME */}

                        <div className="details-item">

                            <span>
                                Doctor Name
                            </span>

                            <strong>

                                {
                                    doctor.doctorName ||
                                    "Not available"
                                }

                            </strong>

                        </div>


                        {/* SPECIALIZATION */}

                        <div className="details-item">

                            <span>
                                Specialization
                            </span>

                            <strong>

                                {
                                    doctor.specialization ||
                                    "Not specified"
                                }

                            </strong>

                        </div>


                        {/* DEPARTMENT */}

                        <div className="details-item">

                            <span>
                                Department
                            </span>

                            <strong>

                                {departmentName}

                            </strong>

                        </div>


                        {/* DOCTOR ID */}

                        <div className="details-item">

                            <span>
                                Doctor ID
                            </span>

                            <strong>

                                #{doctor.id}

                            </strong>

                        </div>


                    </div>


                </div>


                {/* =================================================
                    CONTACT INFORMATION
                ================================================= */}

                <div className="details-section">


                    <div className="details-section-title">


                        <div className="details-icon">

                            📞

                        </div>


                        <div>

                            <h3>

                                Contact Information

                            </h3>


                            <p>

                                Doctor contact details

                            </p>

                        </div>


                    </div>


                    <div className="details-grid">


                        {/* EMAIL */}

                        <div className="details-item">

                            <span>

                                Professional Email

                            </span>


                            <strong>

                                {doctorEmail}

                            </strong>

                        </div>


                        {/* PHONE */}

                        <div className="details-item">

                            <span>

                                Phone

                            </span>


                            <strong>

                                {doctorPhone}

                            </strong>

                        </div>


                    </div>


                </div>


                {/* =================================================
                    ACCOUNT INFORMATION
                ================================================= */}

                <div className="details-section">


                    <div className="details-section-title">


                        <div className="details-icon">

                            🔐

                        </div>


                        <div>

                            <h3>

                                Account Information

                            </h3>


                            <p>

                                Doctor login account information

                            </p>

                        </div>


                    </div>


                    <div className="details-grid">


                        {/* LOGIN EMAIL */}

                        <div className="details-item">

                            <span>

                                Login Email

                            </span>


                            <strong>

                                {loginEmail}

                            </strong>

                        </div>


                        {/* ROLE */}

                        <div className="details-item">

                            <span>

                                Role

                            </span>


                            <strong>

                                {role}

                            </strong>

                        </div>


                        {/* STATUS */}

                        <div className="details-item">

                            <span>

                                Account Status

                            </span>


                            <strong
                                className={
                                    status === "ACTIVE"
                                        ? "status-active"
                                        : "status-inactive"
                                }
                            >

                                {status}

                            </strong>

                        </div>


                    </div>


                </div>


            </div>


        </div>

    );

}


export default DoctorDetails;