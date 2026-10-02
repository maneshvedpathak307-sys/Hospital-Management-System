import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../../../services/api";


function BookAppointment() {

    const navigate = useNavigate();

    const location = useLocation();


    // =====================================================
    // GET SELECTED DOCTOR FROM URL
    // =====================================================

    const queryParams =
        new URLSearchParams(location.search);

    const selectedDoctorId =
        queryParams.get("doctorId") || "";


    // =====================================================
    // STATE
    // =====================================================

    const [doctors, setDoctors] =
        useState([]);


    const [form, setForm] = useState({

        doctorId: selectedDoctorId,

        appointmentDate: "",

        appointmentTime: "",

        reason: ""

    });


    const [loadingDoctors, setLoadingDoctors] =
        useState(true);


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");


    // =====================================================
    // APPOINTMENT TIME SLOTS
    // =====================================================
    //
    // Doctor timing:
    //
    // 10:00 AM - 01:00 PM
    // 02:00 PM - 05:00 PM
    //
    // Each appointment = 30 minutes
    //
    // 05:00 PM is closing time.
    // Therefore last slot = 04:30 PM.
    //
    // =====================================================

    const appointmentTimeSlots = [

        {
            value: "10:00",
            label: "10:00 AM"
        },

        {
            value: "10:30",
            label: "10:30 AM"
        },

        {
            value: "11:00",
            label: "11:00 AM"
        },

        {
            value: "11:30",
            label: "11:30 AM"
        },

        {
            value: "12:00",
            label: "12:00 PM"
        },

        {
            value: "12:30",
            label: "12:30 PM"
        },

        // ================================================
        // LUNCH BREAK
        // ================================================

        {
            value: "14:00",
            label: "02:00 PM"
        },

        {
            value: "14:30",
            label: "02:30 PM"
        },

        {
            value: "15:00",
            label: "03:00 PM"
        },

        {
            value: "15:30",
            label: "03:30 PM"
        },

        {
            value: "16:00",
            label: "04:00 PM"
        },

        {
            value: "16:30",
            label: "04:30 PM"
        }

    ];


    // =====================================================
    // LOAD DOCTORS
    // =====================================================

    useEffect(() => {

        fetchDoctors();

    }, []);


    const fetchDoctors = async () => {

        try {

            setLoadingDoctors(true);

            setError("");


            const response =
                await api.get(
                    "/patient/doctors"
                );


            console.log(
                "Doctors API response:",
                response.data
            );


            setDoctors(

                Array.isArray(response.data)
                    ? response.data
                    : []

            );

        } catch (error) {

            console.error(
                "Error loading doctors:",
                error
            );


            setError(

                error.response?.data?.message ||

                (
                    typeof error.response?.data ===
                    "string"

                        ? error.response.data

                        : "Unable to load doctors."
                )

            );

        } finally {

            setLoadingDoctors(false);

        }

    };


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm((previous) => ({

            ...previous,

            [name]: value

        }));


        setError("");

        setSuccess("");


        // =================================================
        // WHEN DOCTOR CHANGES
        // =================================================

        if (name === "doctorId") {

            setForm((previous) => ({

                ...previous,

                doctorId: value,

                appointmentTime: ""

            }));

        }

    };


    // =====================================================
    // BACK
    // =====================================================

    const handleBackToAppointments = () => {

        navigate(
            "/patient/appointments"
        );

    };


    // =====================================================
    // VALIDATE TIME
    // =====================================================

    const isValidAppointmentTime = (time) => {

        if (!time) {

            return false;

        }


        const validSlots =
            appointmentTimeSlots.some(
                (slot) =>
                    slot.value === time
            );


        return validSlots;

    };


    // =====================================================
    // BOOK APPOINTMENT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        setError("");

        setSuccess("");


        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (!form.doctorId) {

            setError(
                "Please select a doctor."
            );

            return;

        }


        if (!form.appointmentDate) {

            setError(
                "Please select appointment date."
            );

            return;

        }


        if (!form.appointmentTime) {

            setError(
                "Please select appointment time."
            );

            return;

        }


        // =================================================
        // TIME VALIDATION
        // =================================================

        if (
            !isValidAppointmentTime(
                form.appointmentTime
            )
        ) {

            setError(
                "Please select a valid appointment time."
            );

            return;

        }


        // =================================================
        // REASON
        // =================================================

        if (!form.reason.trim()) {

            setError(
                "Please enter the reason for appointment."
            );

            return;

        }


        // =================================================
        // FIND DOCTOR
        // =================================================

        const selectedDoctor =
            doctors.find(
                (doctor) =>
                    Number(doctor.id) ===
                    Number(form.doctorId)
            );


        if (!selectedDoctor) {

            setError(
                "Selected doctor not found."
            );

            return;

        }


        // =================================================
        // GET DEPARTMENT
        // =================================================

        const departmentId =
            selectedDoctor.departmentId;


        if (!departmentId) {

            setError(
                "Selected doctor is not assigned to a department."
            );

            return;

        }


        // =================================================
        // REQUEST
        // =================================================

        const requestData = {

            doctorId:
                Number(form.doctorId),

            departmentId:
                Number(departmentId),

            appointmentDate:
                form.appointmentDate,

            appointmentTime:
                form.appointmentTime,

            reason:
                form.reason.trim()

        };


        console.log(
            "Booking appointment request:",
            requestData
        );


        // =================================================
        // API
        // =================================================

        try {

            setLoading(true);


            const response =
                await api.post(
                    "/patient/appointments",
                    requestData
                );


            console.log(
                "Appointment response:",
                response.data
            );


            // =================================================
            // BACKEND ASSIGNED TIME
            // =================================================

            const assignedTime =
                response.data?.appointmentTime;


            const requestedTime =
                response.data?.requestedTime;


            // =================================================
            // SLOT WAS CHANGED
            // =================================================

            if (
                assignedTime &&
                requestedTime &&
                assignedTime !== requestedTime
            ) {

                setSuccess(

                    `Requested time was already booked. Your appointment has been assigned to ${formatTime(assignedTime)}.`

                );

            } else {

                setSuccess(

                    response.data?.message ||
                    "Appointment booked successfully."

                );

            }


            // =================================================
            // GO TO APPOINTMENTS
            // =================================================

            setTimeout(() => {

                navigate(
                    "/patient/appointments"
                );

            }, 1800);


        } catch (error) {

            console.error(
                "Book appointment error:",
                error
            );


            setError(

                error.response?.data?.message ||

                (
                    typeof error.response?.data ===
                    "string"

                        ? error.response.data

                        : "Unable to book appointment."
                )

            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FORMAT TIME
    // =====================================================

    const formatTime = (time) => {

        if (!time) {

            return "";

        }


        const [
            hoursString,
            minutesString
        ] = time.split(":");


        let hours =
            Number(hoursString);

        const minutes =
            minutesString;


        const period =
            hours >= 12
                ? "PM"
                : "AM";


        if (hours === 0) {

            hours = 12;

        } else if (hours > 12) {

            hours -= 12;

        }


        return `${hours}:${minutes} ${period}`;

    };


    // =====================================================
    // TODAY
    // =====================================================

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    // =====================================================
    // SELECTED DOCTOR
    // =====================================================

    const selectedDoctor =
        doctors.find(
            (doctor) =>
                Number(doctor.id) ===
                Number(form.doctorId)
        );


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div className="page-container">


            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="management-header book-appointment-header"
                style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%"
                }}
            >

                <div>

                    <h2>
                        Book Appointment
                    </h2>

                </div>


                <button
                    type="button"
                    className="secondary-button"
                    onClick={
                        handleBackToAppointments
                    }
                    style={{
                        marginLeft: "auto",
                        whiteSpace: "nowrap"
                    }}
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
                SUCCESS
            ================================================= */}

            {success && (

                <div className="success-alert">

                    ✓ {success}

                </div>

            )}


            {/* =================================================
                FORM CARD
            ================================================= */}

            <div className="form-card">

                <form
                    onSubmit={handleSubmit}
                >


                    {/* =================================================
                        APPOINTMENT INFORMATION
                    ================================================= */}

                    <div className="form-section">


                        <div className="form-section-title">

                            <div className="form-section-icon">

                                📅

                            </div>


                            <div>

                                <h3>
                                    Appointment Information
                                </h3>

                                <p>
                                    Select a doctor and preferred appointment time.
                                </p>

                            </div>

                        </div>


                        <div className="form-grid">


                            {/* =================================================
                                DOCTOR
                            ================================================= */}

                            <div className="form-group full-width">

                                <label htmlFor="doctorId">

                                    Doctor

                                    <span>
                                        *
                                    </span>

                                </label>


                                <select
                                    id="doctorId"
                                    name="doctorId"
                                    value={
                                        form.doctorId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        loadingDoctors
                                    }
                                >

                                    <option value="">

                                        {loadingDoctors

                                            ? "Loading doctors..."

                                            : "Select Doctor"

                                        }

                                    </option>


                                    {doctors.map(
                                        (doctor) => (

                                            <option
                                                key={
                                                    doctor.id
                                                }
                                                value={
                                                    doctor.id
                                                }
                                            >

                                                {
                                                    doctor.doctorName ||
                                                    doctor.name ||
                                                    "Doctor"
                                                }

                                                {" - "}

                                                {
                                                    doctor.specialization ||
                                                    "Specialist"
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* =================================================
                                DEPARTMENT
                            ================================================= */}

                            {form.doctorId && (

                                <div
                                    className="form-group full-width"
                                >

                                    <label>
                                        Department
                                    </label>


                                    <input
                                        type="text"
                                        value={
                                            selectedDoctor?.departmentName ||
                                            "Department not assigned"
                                        }
                                        readOnly
                                    />

                                </div>

                            )}


                            {/* =================================================
                                DATE
                            ================================================= */}

                            <div className="form-group">

                                <label htmlFor="appointmentDate">

                                    Appointment Date

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="appointmentDate"
                                    type="date"
                                    name="appointmentDate"
                                    value={
                                        form.appointmentDate
                                    }
                                    min={today}
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            {/* =================================================
                                TIME
                            ================================================= */}

                            <div className="form-group">

                                <label htmlFor="appointmentTime">

                                    Appointment Time

                                    <span>
                                        *
                                    </span>

                                </label>


                                <select
                                    id="appointmentTime"
                                    name="appointmentTime"
                                    value={
                                        form.appointmentTime
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="">

                                        Select Appointment Time

                                    </option>


                                    {appointmentTimeSlots.map(
                                        (slot) => (

                                            <option
                                                key={
                                                    slot.value
                                                }
                                                value={
                                                    slot.value
                                                }
                                            >

                                                {
                                                    slot.label
                                                }

                                            </option>

                                        )
                                    )}

                                </select>


                                <small
                                    style={{
                                        display: "block",
                                        marginTop: "6px",
                                        color: "#666",
                                        lineHeight: "1.6"
                                    }}
                                >

                                    Doctor timing:
                                    {" "}
                                    10:00 AM - 05:00 PM

                                    <br />

                                    Lunch break:
                                    {" "}
                                    01:00 PM - 02:00 PM

                                    <br />

                                    Each appointment:
                                    {" "}
                                    30 minutes

                                    <br />

                                    If your selected time is already booked,
                                    the next available slot will be assigned automatically.

                                </small>

                            </div>


                            {/* =================================================
                                REASON
                            ================================================= */}

                            <div
                                className="form-group full-width"
                            >

                                <label htmlFor="reason">

                                    Reason for Appointment

                                    <span>
                                        *
                                    </span>

                                </label>


                                <textarea
                                    id="reason"
                                    name="reason"
                                    rows="5"
                                    value={
                                        form.reason
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Describe your reason for visiting the doctor..."
                                />

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="form-actions">


                        <button
                            type="button"
                            className="cancel-button"
                            onClick={
                                handleBackToAppointments
                            }
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >

                            {loading

                                ? "Booking..."

                                : "✓ Book Appointment"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


export default BookAppointment;