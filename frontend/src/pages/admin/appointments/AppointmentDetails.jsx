import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AppointmentService from "../../../services/AppointmentService";

import Loading from "../../../components/common/Loading";
import StatusBadge from "../../../components/common/StatusBadge";

function AppointmentDetails() {

    const { id } = useParams();

    const [appointment, setAppointment] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =========================================
       LOAD APPOINTMENT
    ========================================= */

    useEffect(() => {

        loadAppointment();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);


    const loadAppointment = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await AppointmentService.getAppointmentById(id);

            const data =
                response?.data || response;

            setAppointment(data);

        } catch (error) {

            console.error(
                "Appointment details error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to load appointment details."
                )
            );

        } finally {

            setLoading(false);
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
       ERROR
    ========================================= */

    if (error) {

        return (

            <div className="page-container">

                <div className="page-error">
                    ⚠️ {error}
                </div>

                <Link
                    to="/admin/appointments"
                    className="secondary-button"
                >
                    ← Back to Appointments
                </Link>

            </div>
        );
    }


    /* =========================================
       NO DATA
    ========================================= */

    if (!appointment) {

        return (

            <div className="page-container">

                <div className="empty-state">

                    <div className="empty-icon">
                        📅
                    </div>

                    <h3>
                        Appointment not found
                    </h3>

                    <p>
                        The requested appointment does not exist.
                    </p>

                    <Link
                        to="/admin/appointments"
                        className="primary-button"
                    >
                        Back to Appointments
                    </Link>

                </div>

            </div>
        );
    }


    return (

        <div className="page-container">

            {/* =================================
                HEADER
            ================================= */}

            <div className="page-header">

                <div>

                    <h1>
                        Appointment Details
                    </h1>

                    <p>
                        View complete appointment information
                    </p>

                </div>


                <Link
                    to="/admin/appointments"
                    className="secondary-button"
                >
                    ← Back to Appointments
                </Link>

            </div>


            {/* =================================
                APPOINTMENT SUMMARY
            ================================= */}

            <div className="management-card">

                <div className="details-header">

                    <div>

                        <span className="details-label">
                            Appointment ID
                        </span>

                        <h2>
                            #{appointment.id}
                        </h2>

                    </div>


                    <StatusBadge
                        status={
                            appointment.status ||
                            "PENDING"
                        }
                    />

                </div>


                {/* =================================
                    APPOINTMENT INFORMATION
                ================================= */}

                <div className="details-section">

                    <h3>
                        Appointment Information
                    </h3>


                    <div className="details-grid">

                        <div className="detail-item">

                            <span>
                                Appointment Date
                            </span>

                            <strong>
                                {
                                    appointment.appointmentDate ||
                                    "-"
                                }
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span>
                                Appointment Time
                            </span>

                            <strong>
                                {
                                    appointment.appointmentTime ||
                                    "-"
                                }
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span>
                                Department
                            </span>

                            <strong>
                                {
                                    appointment.departmentName ||
                                    appointment.department?.departmentName ||
                                    "Not assigned"
                                }
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span>
                                Reason
                            </span>

                            <strong>
                                {
                                    appointment.reason ||
                                    "Not specified"
                                }
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================
                    PATIENT INFORMATION
                ================================= */}

                <div className="details-section">

                    <h3>
                        Patient Information
                    </h3>


                    <div className="details-grid">

                        <div className="detail-item">

                            <span>
                                Patient Name
                            </span>

                            <strong>
                                {
                                    appointment.patientName ||
                                    appointment.patient?.patientName ||
                                    "Unknown"
                                }
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span>
                                Patient ID
                            </span>

                            <strong>
                                {
                                    appointment.patientId ||
                                    appointment.patient?.id ||
                                    "-"
                                }
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span>
                                Phone
                            </span>

                            <strong>
                                {
                                    appointment.patientPhone ||
                                    appointment.patient?.phone ||
                                    "-"
                                }
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span>
                                Email
                            </span>

                            <strong>
                                {
                                    appointment.patientEmail ||
                                    appointment.patient?.email ||
                                    "-"
                                }
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================
                    DOCTOR INFORMATION
                ================================= */}

                <div className="details-section">

                    <h3>
                        Doctor Information
                    </h3>


                    <div className="details-grid">

                        <div className="detail-item">

                            <span>
                                Doctor Name
                            </span>

                            <strong>
                                {
                                    appointment.doctorName ||
                                    appointment.doctor?.doctorName ||
                                    "Unknown"
                                }
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span>
                                Doctor ID
                            </span>

                            <strong>
                                {
                                    appointment.doctorId ||
                                    appointment.doctor?.id ||
                                    "-"
                                }
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span>
                                Specialization
                            </span>

                            <strong>
                                {
                                    appointment.specialization ||
                                    appointment.doctor?.specialization ||
                                    "-"
                                }
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span>
                                Doctor Email
                            </span>

                            <strong>
                                {
                                    appointment.doctorEmail ||
                                    appointment.doctor?.email ||
                                    "-"
                                }
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================
                    ADDITIONAL INFORMATION
                ================================= */}

                <div className="details-section">

                    <h3>
                        Additional Information
                    </h3>


                    <div className="detail-description">

                        <span>
                            Appointment Reason
                        </span>

                        <p>
                            {
                                appointment.reason ||
                                "No reason provided."
                            }
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AppointmentDetails;