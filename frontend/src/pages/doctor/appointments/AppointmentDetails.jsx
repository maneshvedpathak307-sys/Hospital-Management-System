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
import StatusBadge from "../../../components/common/StatusBadge";
import "../../../styles/buttons.css";


function AppointmentDetails() {

    const { id } = useParams();

    const navigate = useNavigate();


    /* =========================================
       STATE
    ========================================= */

    const [appointment, setAppointment] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState(false);


    /* =========================================
       LOAD APPOINTMENT
    ========================================= */

    const fetchAppointment = useCallback(async () => {

        try {

            setLoading(true);

            setError("");


            console.log(
                "================================="
            );

            console.log(
                "DOCTOR - Loading appointment:",
                id
            );

            console.log(
                "GET:",
                `/doctor/appointments/${id}`
            );


            const response =
                await api.get(
                    `/doctor/appointments/${id}`
                );


            console.log(
                "Doctor appointment details:",
                response.data
            );


            setAppointment(
                response.data
            );


        } catch (error) {

            console.error(
                "Doctor appointment error:",
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


    /* =========================================
       LOAD APPOINTMENT WHEN ID CHANGES
    ========================================= */

    useEffect(() => {

        fetchAppointment();

    }, [
        id,
        fetchAppointment
    ]);


    /* =========================================
       BACK
    ========================================= */

    const handleBack = () => {

        navigate(
            "/doctor/appointments"
        );

    };


    /* =========================================
       APPROVE
    ========================================= */

    const handleApprove = async () => {

        try {

            setActionLoading(true);

            setError("");


            console.log(
                "================================="
            );

            console.log(
                "DOCTOR - Approving appointment:",
                id
            );

            console.log(
                "PUT:",
                `/doctor/appointments/${id}/approve`
            );


            const response =
                await api.put(
                    `/doctor/appointments/${id}/approve`
                );


            console.log(
                "Approve response:",
                response.data
            );


            await fetchAppointment();


        } catch (error) {

            console.error(
                "Approve appointment error:",
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
                    "You are not authorized to approve this appointment."
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

                            : "Only pending appointments can be approved."
                    )

                );

            } else {

                setError(

                    error.response?.data?.message ||

                    (
                        typeof error.response?.data ===
                        "string"

                            ? error.response.data

                            : "Unable to approve appointment."
                    )

                );

            }

        } finally {

            setActionLoading(false);

        }

    };


    /* =========================================
       REJECT
    ========================================= */

    const handleReject = async () => {

        try {

            setActionLoading(true);

            setError("");


            console.log(
                "================================="
            );

            console.log(
                "DOCTOR - Rejecting appointment:",
                id
            );

            console.log(
                "PUT:",
                `/doctor/appointments/${id}/reject`
            );


            const response =
                await api.put(
                    `/doctor/appointments/${id}/reject`
                );


            console.log(
                "Reject response:",
                response.data
            );


            await fetchAppointment();


        } catch (error) {

            console.error(
                "Reject appointment error:",
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
                    "You are not authorized to reject this appointment."
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

                            : "Only pending appointments can be rejected."
                    )

                );

            } else {

                setError(

                    error.response?.data?.message ||

                    (
                        typeof error.response?.data ===
                        "string"

                            ? error.response.data

                            : "Unable to reject appointment."
                    )

                );

            }

        } finally {

            setActionLoading(false);

        }

    };


    /* =========================================
       COMPLETE
    ========================================= */

    const handleComplete = async () => {

        try {

            setActionLoading(true);

            setError("");


            console.log(
                "================================="
            );

            console.log(
                "DOCTOR - Completing appointment:",
                id
            );

            console.log(
                "PUT:",
                `/doctor/appointments/${id}/complete`
            );


            const response =
                await api.put(
                    `/doctor/appointments/${id}/complete`
                );


            console.log(
                "Complete response:",
                response.data
            );


            await fetchAppointment();


        } catch (error) {

            console.error(
                "Complete appointment error:",
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
                    "You are not authorized to complete this appointment."
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

                            : "Only approved appointments can be completed."
                    )

                );

            } else {

                setError(

                    error.response?.data?.message ||

                    (
                        typeof error.response?.data ===
                        "string"

                            ? error.response.data

                            : "Unable to complete appointment."
                    )

                );

            }

        } finally {

            setActionLoading(false);

        }

    };


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

    if (!appointment) {

        return (

            <div className="page-container">

                <div
                    className="management-header"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px"
                    }}
                >

                    <div>

                        <h2>
                            Appointment Details
                        </h2>

                        <p>
                            View appointment information.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="secondary-button"
                        onClick={handleBack}
                    >

                        ← Back to Appointments

                    </button>

                </div>


                {error && (

                    <div className="error-alert">

                        ⚠️ {error}

                    </div>

                )}

            </div>

        );

    }


    /* =========================================
       STATUS
    ========================================= */

    const status =
        String(
            appointment.status || ""
        ).toUpperCase();


    /* =========================================
       PAGE
    ========================================= */

    return (

        <div className="page-container">


            {/* =================================
                HEADER
            ================================= */}

            <div
                className="management-header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "20px"
                }}
            >

                <div>

                    <h2>
                        Appointment Details
                    </h2>

                </div>


                <button
                    type="button"
                    className="secondary-button"
                    onClick={handleBack}
                >

                    ← Back to Appointments

                </button>

            </div>


            {/* =================================
                ERROR
            ================================= */}

            {error && (

                <div className="error-alert">

                    ⚠️ {error}

                </div>

            )}


            {/* =================================
                DETAILS CARD
            ================================= */}

            <div className="management-card">


                {/* =================================
                    CARD HEADER
                ================================= */}

                <div className="table-toolbar">

                    <div>

                        <h3>
                            Appointment
                        </h3>

                        <span>
                            Hospital appointment information
                        </span>

                    </div>


                    <StatusBadge
                        status={
                            appointment.status
                        }
                    />

                </div>


                {/* =================================
                    PATIENT SUMMARY
                ================================= */}

                <div className="profile-header">

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


                {/* =================================
                    INFORMATION
                ================================= */}

                <div className="profile-form">

                    <div className="form-grid">


                        {/* PATIENT NAME */}

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


                        {/* PHONE */}

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


                        {/* EMAIL */}

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


                        {/* AGE */}

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


                        {/* GENDER */}

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


                        {/* DEPARTMENT */}

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


                        {/* DOCTOR */}

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


                        {/* SPECIALIZATION */}

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


                        {/* DATE */}

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


                        {/* TIME */}

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


                        {/* STATUS */}

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


                        {/* DISEASE */}

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


                        {/* ADDRESS */}

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


                        {/* REASON */}

                        <div className="form-group full-width">

                            <label>
                                Reason for Appointment
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


                {/* =================================
                    DOCTOR ACTIONS
                ================================= */}

                <div className="form-actions">


                    {/* ==============================
                        PENDING
                    ============================== */}

                    {status === "PENDING" && (

                        <>

                            <button
                                type="button"
                                className="primary-button"
                                disabled={
                                    actionLoading
                                }
                                onClick={
                                    handleApprove
                                }
                            >

                                {actionLoading

                                    ? "Processing..."

                                    : "✓ Approve Appointment"

                                }

                            </button>


                            <button
                                type="button"
                                className="danger-light-button"
                                disabled={
                                    actionLoading
                                }
                                onClick={
                                    handleReject
                                }
                            >

                                {actionLoading

                                    ? "Processing..."

                                    : "✕ Reject Appointment"

                                }

                            </button>

                        </>

                    )}


                    {/* ==============================
                        APPROVED
                    ============================== */}

                    {status === "APPROVED" && (

                        <button
                            type="button"
                            className="primary-button"
                            disabled={
                                actionLoading
                            }
                            onClick={
                                handleComplete
                            }
                        >

                            {actionLoading

                                ? "Processing..."

                                : "✓ Mark as Completed"

                            }

                        </button>

                    )}


                    {/* ==============================
                        COMPLETED
                    ============================== */}

                    {status === "COMPLETED" && (

                        <span>

                            Appointment completed.

                        </span>

                    )}


                    {/* ==============================
                        REJECTED
                    ============================== */}

                    {status === "REJECTED" && (

                        <span>

                            Appointment rejected.

                        </span>

                    )}


                    {/* ==============================
                        CANCELLED
                    ============================== */}

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