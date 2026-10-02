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

import "../../../styles/buttons.css";
import "../../../styles/forms.css";


function AppointmentDetails() {

    const { id } = useParams();

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [appointment, setAppointment] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState(false);


    // =====================================================
    // LOAD APPOINTMENT
    // =====================================================

    const fetchAppointment = useCallback(async () => {

        try {

            setLoading(true);

            setError("");


            console.log(
                "================================="
            );

            console.log(
                "PATIENT - Loading appointment:",
                id
            );

            console.log(
                "GET:",
                `/patient/appointments/${id}`
            );


            const response =
                await api.get(
                    `/patient/appointments/${id}`
                );


            console.log(
                "Patient appointment details:",
                response.data
            );


            setAppointment(
                response.data
            );


        } catch (error) {

            console.error(
                "Patient appointment error:",
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


            if (
                error.response?.status === 401
            ) {

                setError(
                    "Please login again."
                );

            } else if (
                error.response?.status === 403
            ) {

                setError(
                    "You are not authorized to view this appointment."
                );

            } else if (
                error.response?.status === 404
            ) {

                setError(
                    "Appointment not found."
                );

            } else {

                setError(

                    error.response?.data?.message ||

                    (
                        typeof error.response?.data ===
                        "string"

                            ? error.response.data

                            : "Unable to load appointment details."
                    )

                );

            }

        } finally {

            setLoading(false);

        }

    }, [id]);


    // =====================================================
    // LOAD APPOINTMENT ON PAGE LOAD / ID CHANGE
    // =====================================================

    useEffect(() => {

        fetchAppointment();

    }, [fetchAppointment]);


    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {

        navigate(
            "/patient/appointments"
        );

    };


    // =====================================================
    // CANCEL APPOINTMENT
    // =====================================================

    const handleCancel = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this appointment?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setActionLoading(true);

            setError("");


            console.log(
                "================================="
            );

            console.log(
                "PATIENT - Cancelling appointment:",
                id
            );

            console.log(
                "PUT:",
                `/patient/appointments/${id}/cancel`
            );


            const response =
                await api.put(
                    `/patient/appointments/${id}/cancel`
                );


            console.log(
                "Cancel response:",
                response.data
            );


            await fetchAppointment();


        } catch (error) {

            console.error(
                "Cancel appointment error:",
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


            if (
                error.response?.status === 403
            ) {

                setError(
                    "You are not authorized to cancel this appointment."
                );

            } else if (
                error.response?.status === 400
            ) {

                setError(

                    error.response?.data?.message ||

                    (
                        typeof error.response?.data ===
                        "string"

                            ? error.response.data

                            : "This appointment cannot be cancelled."
                    )

                );

            } else {

                setError(

                    error.response?.data?.message ||

                    (
                        typeof error.response?.data ===
                        "string"

                            ? error.response.data

                            : "Unable to cancel appointment."
                    )

                );

            }

        } finally {

            setActionLoading(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="page-container">

                <Loading />

            </div>

        );

    }


    // =====================================================
    // ERROR / NOT FOUND
    // =====================================================

    if (!appointment) {

        return (

            <div className="page-container">


                {/* =========================================
                    PAGE HEADER
                ========================================= */}

                <div
                    className="management-header"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px",
                        width: "100%"
                    }}
                >

                    <div>

                        <h2>
                            Appointment Details
                        </h2>

                        <p>
                            View your appointment information.
                        </p>

                    </div>


                    {/* BACK BUTTON - RIGHT SIDE */}

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={handleBack}
                    >

                        ← Back to Appointments

                    </button>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="error-alert">

                        ⚠️ {error}

                    </div>

                )}

            </div>

        );

    }


    // =====================================================
    // STATUS
    // =====================================================

    const status =
        String(
            appointment.status || ""
        ).toUpperCase();


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="page-container">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div
                className="management-header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "20px",
                    width: "100%"
                }}
            >


                {/* =============================================
                    LEFT
                ============================================= */}

                <div>

                    <h2>
                        Appointment Details
                    </h2>

                </div>


                {/* =============================================
                    RIGHT - BACK BUTTON
                ============================================= */}

                <button
                    type="button"
                    className="secondary-button"
                    onClick={handleBack}
                    disabled={actionLoading}
                >

                    ← Back to Appointments

                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="error-alert">

                    ⚠️ {error}

                </div>

            )}


            {/* =================================================
                MAIN APPOINTMENT CARD
            ================================================= */}

            <div className="management-card">


                {/* =================================================
                    PATIENT PROFILE HEADER
                ================================================= */}

                <div
                    className="profile-header"
                    style={{
                        marginTop: "25px",
                        marginBottom: "25px"
                    }}
                >

                    <div className="profile-avatar">

                        🧑

                    </div>


                    <div>

                        <h2>

                            {
                                appointment.patientName ||
                                "Patient"
                            }

                        </h2>

                        <p>
                            Patient
                        </p>

                    </div>

                </div>


                {/* =================================================
                    PATIENT INFORMATION
                ================================================= */}

                <div
                    className="form-section"
                    style={{
                        marginBottom: "25px"
                    }}
                >


                    {/* SECTION HEADER */}

                    <div className="form-section-header">

                        <div className="form-section-icon">

                            👤

                        </div>


                        <div>

                            <h3>
                                Patient Information
                            </h3>

                            <p>
                                Patient information associated with this appointment.
                            </p>

                        </div>

                    </div>


                    {/* PATIENT DETAILS */}

                    <div className="form-grid">


                        {/* =====================================
                            PATIENT NAME
                        ===================================== */}

                        <div className="form-group">

                            <label>
                                Patient Name
                            </label>

                            <input
                                type="text"
                                value={
                                    appointment.patientName ||
                                    "-"
                                }
                                disabled
                            />

                        </div>


                        {/* =====================================
                            PATIENT PHONE
                        ===================================== */}

                        <div className="form-group">

                            <label>
                                Patient Phone
                            </label>

                            <input
                                type="text"
                                value={
                                    appointment.patientPhone ||
                                    "-"
                                }
                                disabled
                            />

                        </div>


                        {/* =====================================
                            PATIENT EMAIL
                        ===================================== */}

                        <div className="form-group">

                            <label>
                                Patient Email
                            </label>

                            <input
                                type="text"
                                value={
                                    appointment.patientEmail ||
                                    "-"
                                }
                                disabled
                            />

                        </div>


                        {/* =====================================
                            PATIENT AGE
                        ===================================== */}

                        <div className="form-group">

                            <label>
                                Patient Age
                            </label>

                            <input
                                type="text"
                                value={
                                    appointment.patientAge ??
                                    "-"
                                }
                                disabled
                            />

                        </div>


                        {/* =====================================
                            PATIENT GENDER
                        ===================================== */}

                        <div className="form-group">

                            <label>
                                Patient Gender
                            </label>

                            <input
                                type="text"
                                value={
                                    appointment.patientGender ||
                                    "-"
                                }
                                disabled
                            />

                        </div>


                        {/* =====================================
                            PATIENT DISEASE
                        ===================================== */}

                        <div className="form-group">

                            <label>
                                Patient Disease
                            </label>

                            <input
                                type="text"
                                value={
                                    appointment.patientDisease ||
                                    "-"
                                }
                                disabled
                            />

                        </div>


                        {/* =====================================
                            PATIENT ADDRESS
                        ===================================== */}

                        <div className="form-group full-width">

                            <label>
                                Patient Address
                            </label>

                            <input
                                type="text"
                                value={
                                    appointment.patientAddress ||
                                    "-"
                                }
                                disabled
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    APPOINTMENT INFORMATION
                ================================================= */}

                <div
                    className="form-section"
                    style={{
                        marginBottom: "25px"
                    }}
                >


                    {/* SECTION HEADER */}

                    <div className="form-section-header">

                        <div className="form-section-icon">

                            📅

                        </div>


                        <div>

                            <h3>
                                Appointment Information
                            </h3>

                            <p>
                                Doctor and appointment schedule information.
                            </p>

                        </div>

                    </div>


                    {/* APPOINTMENT DETAILS */}

                    <div className="form-grid">


                        {/* =====================================
                            DEPARTMENT
                        ===================================== */}

                        <div className="form-group">

                            <label>
                                Department
                            </label>

                            <input
                                type="text"
                                value={
                                    appointment.departmentName ||
                                    "-"
                                }
                                disabled
                            />

                        </div>


                        {/* =====================================
                            DOCTOR
                        ===================================== */}

                        <div className="form-group">

                            <label>
                                Doctor
                            </label>

                            <input
                                type="text"
                                value={
                                    appointment.doctorName ||
                                    "-"
                                }
                                disabled
                            />

                        </div>


                        {/* =====================================
                            SPECIALIZATION
                        ===================================== */}

                        <div className="form-group">

                            <label>
                                Specialization
                            </label>

                            <input
                                type="text"
                                value={
                                    appointment.specialization ||
                                    "-"
                                }
                                disabled
                            />

                        </div>


                        {/* =====================================
                            APPOINTMENT DATE
                        ===================================== */}

                        <div className="form-group">

                            <label>
                                Appointment Date
                            </label>

                            <input
                                type="text"
                                value={
                                    appointment.appointmentDate ||
                                    "-"
                                }
                                disabled
                            />

                        </div>


                        {/* =====================================
                            APPOINTMENT TIME
                        ===================================== */}

                        <div className="form-group">

                            <label>
                                Appointment Time
                            </label>

                            <input
                                type="text"
                                value={
                                    appointment.appointmentTime ||
                                    "-"
                                }
                                disabled
                            />

                        </div>


                        {/* =====================================
                            APPOINTMENT STATUS
                        ===================================== */}

                        <div className="form-group">

                            <label>
                                Appointment Status
                            </label>

                            <input
                                type="text"
                                value={
                                    appointment.status ||
                                    "-"
                                }
                                disabled
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    REASON FOR APPOINTMENT
                ================================================= */}

                <div
                    className="form-section"
                    style={{
                        marginBottom: "25px"
                    }}
                >


                    {/* SECTION HEADER */}

                    <div className="form-section-header">

                        <div className="form-section-icon">

                            📋

                        </div>


                        <div>

                            <h3>
                                Reason for Appointment
                            </h3>

                            <p>
                                Reason provided by the patient.
                            </p>

                        </div>

                    </div>


                    <div className="form-grid">

                        <div className="form-group full-width">

                            <label>
                                Reason
                            </label>

                            <textarea
                                rows="4"
                                value={
                                    appointment.reason ||
                                    "Not specified"
                                }
                                disabled
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    PATIENT ACTIONS
                ================================================= */}

                <div className="form-actions">


                    {/* =============================================
                        PENDING
                    ============================================= */}

                    {status === "PENDING" && (

                        <button
                            type="button"
                            className="danger-light-button"
                            disabled={
                                actionLoading
                            }
                            onClick={
                                handleCancel
                            }
                        >

                            {actionLoading

                                ? "Cancelling..."

                                : "✕ Cancel Appointment"

                            }

                        </button>

                    )}


                    {/* =============================================
                        APPROVED
                    ============================================= */}

                    {status === "APPROVED" && (

                        <span>

                            Appointment approved by doctor.

                        </span>

                    )}


                    {/* =============================================
                        COMPLETED
                    ============================================= */}

                    {status === "COMPLETED" && (

                        <span>

                            Appointment completed.

                        </span>

                    )}


                    {/* =============================================
                        REJECTED
                    ============================================= */}

                    {status === "REJECTED" && (

                        <span>

                            Appointment rejected by doctor.

                        </span>

                    )}


                    {/* =============================================
                        CANCELLED
                    ============================================= */}

                    {status === "CANCELLED" && (

                        <span>

                            Appointment cancelled.

                        </span>

                    )}

                </div>


            </div>

        </div>

    );

}


export default AppointmentDetails;