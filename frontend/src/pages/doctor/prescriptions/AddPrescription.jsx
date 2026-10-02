import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../../services/api";

function AddPrescription() {

    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [appointments, setAppointments] =
        useState([]);

    const [medicines, setMedicines] =
        useState([]);

    const [form, setForm] = useState({

        appointmentId: "",

        diagnosis: "",

        instructions: "",

        prescriptionDate:
            new Date().toISOString().split("T")[0]

    });

    const [medicineForm, setMedicineForm] =
        useState({

            medicineId: "",

            dosage: "",

            frequency: "",

            duration: "",

            instructions: ""

        });

    const [selectedMedicines, setSelectedMedicines] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [loadingAppointments, setLoadingAppointments] =
        useState(true);

    const [loadingMedicines, setLoadingMedicines] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadAppointments();

        loadMedicines();

    }, []);


    // =====================================================
    // LOAD COMPLETED APPOINTMENTS
    // =====================================================

    const loadAppointments = async () => {

        try {

            setLoadingAppointments(true);

            setError("");


            /*
             * IMPORTANT:
             * This is the updated API endpoint.
             */

            const response =
                await api.get(
                    "/doctor/prescriptions/appointments/completed"
                );


            console.log(
                "Completed appointments response:",
                response.data
            );


            setAppointments(

                Array.isArray(response.data)
                    ? response.data
                    : []

            );


        } catch (error) {

            console.error(
                "Error loading completed appointments:",
                error
            );


            setAppointments([]);


            setError(

                error.response?.data?.message ||

                (
                    typeof error.response?.data === "string"

                        ? error.response.data

                        : "Unable to load completed appointments."
                )

            );


        } finally {

            setLoadingAppointments(false);

        }

    };


    // =====================================================
    // LOAD MEDICINES
    // =====================================================

    const loadMedicines = async () => {

        try {

            setLoadingMedicines(true);

            setError("");


            /*
             * Medicines API
             */

            const response =
                await api.get(
                    "/doctor/medicines"
                );


            console.log(
                "Medicines response:",
                response.data
            );


            setMedicines(

                Array.isArray(response.data)
                    ? response.data
                    : []

            );


        } catch (error) {

            console.error(
                "Error loading medicines:",
                error
            );


            setMedicines([]);


            setError(

                error.response?.data?.message ||

                (
                    typeof error.response?.data === "string"

                        ? error.response.data

                        : "Unable to load medicines."
                )

            );


        } finally {

            setLoadingMedicines(false);

        }

    };


    // =====================================================
    // FORM CHANGE
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

    };


    // =====================================================
    // MEDICINE FORM CHANGE
    // =====================================================

    const handleMedicineChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setMedicineForm((previous) => ({

            ...previous,

            [name]: value

        }));


        setError("");

        setSuccess("");

    };


    // =====================================================
    // ADD MEDICINE
    // =====================================================

    const handleAddMedicine = () => {

        setError("");

        setSuccess("");


        // =================================================
        // VALIDATE MEDICINE
        // =================================================

        if (!medicineForm.medicineId) {

            setError(
                "Please select a medicine."
            );

            return;

        }


        if (!medicineForm.dosage.trim()) {

            setError(
                "Please enter dosage."
            );

            return;

        }


        if (!medicineForm.frequency.trim()) {

            setError(
                "Please enter frequency."
            );

            return;

        }


        if (!medicineForm.duration.trim()) {

            setError(
                "Please enter duration."
            );

            return;

        }


        // =================================================
        // FIND SELECTED MEDICINE
        // =================================================

        const selectedMedicine =
            medicines.find(
                (medicine) =>
                    String(medicine.id) ===
                    String(medicineForm.medicineId)
            );


        if (!selectedMedicine) {

            setError(
                "Selected medicine was not found."
            );

            return;

        }


        // =================================================
        // CREATE MEDICINE OBJECT
        // =================================================

        const medicineData = {

            medicineId:
                Number(
                    medicineForm.medicineId
                ),

            medicineName:
                selectedMedicine.medicineName ||
                "Medicine",

            genericName:
                selectedMedicine.genericName ||
                "",

            dosage:
                medicineForm.dosage.trim(),

            frequency:
                medicineForm.frequency.trim(),

            duration:
                medicineForm.duration.trim(),

            instructions:
                medicineForm.instructions.trim()

        };


        // =================================================
        // ADD TO SELECTED MEDICINES
        // =================================================

        setSelectedMedicines((previous) => [

            ...previous,

            medicineData

        ]);


        // =================================================
        // RESET MEDICINE FORM
        // =================================================

        setMedicineForm({

            medicineId: "",

            dosage: "",

            frequency: "",

            duration: "",

            instructions: ""

        });

    };


    // =====================================================
    // REMOVE MEDICINE
    // =====================================================

    const handleRemoveMedicine = (index) => {

        setSelectedMedicines((previous) =>

            previous.filter(
                (_, medicineIndex) =>
                    medicineIndex !== index
            )

        );

    };


    // =====================================================
    // CREATE PRESCRIPTION
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        setError("");

        setSuccess("");


        // =================================================
        // VALIDATE APPOINTMENT
        // =================================================

        if (!form.appointmentId) {

            setError(
                "Please select a completed appointment."
            );

            return;

        }


        // =================================================
        // VALIDATE DIAGNOSIS
        // =================================================

        if (!form.diagnosis.trim()) {

            setError(
                "Please enter diagnosis."
            );

            return;

        }


        // =================================================
        // VALIDATE MEDICINES
        // =================================================

        if (selectedMedicines.length === 0) {

            setError(
                "Please add at least one medicine."
            );

            return;

        }


        // =================================================
        // REQUEST DATA
        // =================================================

        const requestData = {

            appointmentId:
                Number(
                    form.appointmentId
                ),

            diagnosis:
                form.diagnosis.trim(),

            medicines:

                selectedMedicines.map(
                    (medicine) => ({

                        medicineId:
                            medicine.medicineId,

                        dosage:
                            medicine.dosage,

                        frequency:
                            medicine.frequency,

                        duration:
                            medicine.duration,

                        instructions:
                            medicine.instructions

                    })
                ),

            instructions:
                form.instructions.trim()

        };


        console.log(
            "Create prescription request:",
            requestData
        );


        // =================================================
        // CREATE PRESCRIPTION API
        // =================================================

        try {

            setLoading(true);


            const response =
                await api.post(
                    "/doctor/prescriptions",
                    requestData
                );


            console.log(
                "Prescription response:",
                response.data
            );


            // =================================================
            // SUCCESS
            // =================================================

            setSuccess(
                typeof response.data === "string"

                    ? response.data

                    : response.data?.message ||
                      "Prescription created successfully."
            );


            // =================================================
            // REDIRECT
            // =================================================

            setTimeout(() => {

                navigate(
                    "/doctor/prescriptions"
                );

            }, 1200);


        } catch (error) {

            console.error(
                "Create prescription error:",
                error
            );


            setError(

                error.response?.data?.message ||

                (
                    typeof error.response?.data === "string"

                        ? error.response.data

                        : "Unable to create prescription."
                )

            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // BACK TO PRESCRIPTIONS
    // =====================================================

    const handleBackToPrescriptions = () => {

        navigate(
            "/doctor/prescriptions"
        );

    };


    // =====================================================
    // FORMAT APPOINTMENT
    // =====================================================

    const getAppointmentLabel = (
        appointment
    ) => {

        const patientName =
            appointment.patientName ||

            appointment.patient?.patientName ||

            appointment.patient?.name ||

            "Patient";


        const date =
            appointment.appointmentDate ||
            "-";


        const time =
            appointment.appointmentTime ||
            "-";


        return (

            patientName +
            " - " +
            date +
            " " +
            time +
            " - Appointment #" +
            appointment.id

        );

    };


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div className="page-container">


            {/* =================================================
                HEADER
            ================================================= */}

             <div
    className="management-header"
    style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        width: "100%",
        marginBottom: "24px"
    }}
>

                <div>

                    <h2>
                        Add Prescription
                    </h2>

                </div>


                <button
                    type="button"
                    className="secondary-button"
                    onClick={
                        handleBackToPrescriptions
                    }
                    style={{
                        marginLeft: "auto",
                        whiteSpace: "nowrap"
                    }}
                >

                    ← Back to Prescriptions

                </button>

            </div>


            {/* =================================================
                HEADER SPACE
            ================================================= */}

            <div
                className="add-prescription-header-space"
            >
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
                        PRESCRIPTION INFORMATION
                    ================================================= */}

                    <div className="form-section">


                        <div className="form-section-title">

                            <div className="form-section-icon">

                                💊

                            </div>


                            <div>

                                <h3>
                                    Prescription Information
                                </h3>

                                <p>
                                    Enter appointment and diagnosis details
                                </p>

                            </div>

                        </div>


                        <div className="form-grid">


                            {/* =================================================
                                COMPLETED APPOINTMENT
                            ================================================= */}

                            <div className="form-group full-width">

                                <label
                                    htmlFor="appointmentId"
                                >

                                    Completed Appointment

                                    <span>
                                        *
                                    </span>

                                </label>


                                <select
                                    id="appointmentId"
                                    name="appointmentId"
                                    value={
                                        form.appointmentId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        loadingAppointments
                                    }
                                >

                                    <option value="">

                                        {loadingAppointments

                                            ? "Loading completed appointments..."

                                            : appointments.length === 0

                                                ? "No completed appointments available"

                                                : "Select Completed Appointment"

                                        }

                                    </option>


                                    {appointments.map(
                                        (appointment) => (

                                            <option
                                                key={
                                                    appointment.id
                                                }
                                                value={
                                                    appointment.id
                                                }
                                            >

                                                {
                                                    getAppointmentLabel(
                                                        appointment
                                                    )
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* =================================================
                                DIAGNOSIS
                            ================================================= */}

                            <div className="form-group full-width">

                                <label
                                    htmlFor="diagnosis"
                                >

                                    Diagnosis

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="diagnosis"
                                    type="text"
                                    name="diagnosis"
                                    value={
                                        form.diagnosis
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter diagnosis"
                                />

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        MEDICINES
                    ================================================= */}

                    <div className="form-section">


                        <div className="form-section-title">

                            <div className="form-section-icon">

                                💊

                            </div>


                            <div>

                                <h3>
                                    Medicines
                                </h3>

                                <p>
                                    Add one or more medicines
                                </p>

                            </div>

                        </div>


                        <div className="form-grid">


                            {/* =================================================
                                MEDICINE
                            ================================================= */}

                            <div className="form-group full-width">

                                <label
                                    htmlFor="medicineId"
                                >

                                    Medicine

                                    <span>
                                        *
                                    </span>

                                </label>


                                <select
                                    id="medicineId"
                                    name="medicineId"
                                    value={
                                        medicineForm.medicineId
                                    }
                                    onChange={
                                        handleMedicineChange
                                    }
                                    disabled={
                                        loadingMedicines
                                    }
                                >

                                    <option value="">

                                        {loadingMedicines

                                            ? "Loading medicines..."

                                            : medicines.length === 0

                                                ? "No medicines available"

                                                : "Select Medicine"

                                        }

                                    </option>


                                    {medicines.map(
                                        (medicine) => (

                                            <option
                                                key={
                                                    medicine.id
                                                }
                                                value={
                                                    medicine.id
                                                }
                                            >

                                                {
                                                    medicine.medicineName
                                                }


                                                {medicine.genericName

                                                    ? " - " +
                                                      medicine.genericName

                                                    : ""

                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* =================================================
                                DOSAGE
                            ================================================= */}

                            <div className="form-group">

                                <label
                                    htmlFor="dosage"
                                >

                                    Dosage

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="dosage"
                                    type="text"
                                    name="dosage"
                                    value={
                                        medicineForm.dosage
                                    }
                                    onChange={
                                        handleMedicineChange
                                    }
                                    placeholder="e.g. 500 mg"
                                />

                            </div>


                            {/* =================================================
                                FREQUENCY
                            ================================================= */}

                            <div className="form-group">

                                <label
                                    htmlFor="frequency"
                                >

                                    Frequency

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="frequency"
                                    type="text"
                                    name="frequency"
                                    value={
                                        medicineForm.frequency
                                    }
                                    onChange={
                                        handleMedicineChange
                                    }
                                    placeholder="e.g. Twice a day"
                                />

                            </div>


                            {/* =================================================
                                DURATION
                            ================================================= */}

                            <div className="form-group">

                                <label
                                    htmlFor="duration"
                                >

                                    Duration

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="duration"
                                    type="text"
                                    name="duration"
                                    value={
                                        medicineForm.duration
                                    }
                                    onChange={
                                        handleMedicineChange
                                    }
                                    placeholder="e.g. 5 days"
                                />

                            </div>


                            {/* =================================================
                                MEDICINE INSTRUCTIONS
                            ================================================= */}

                            <div className="form-group">

                                <label
                                    htmlFor="medicineInstructions"
                                >

                                    Medicine Instructions

                                </label>


                                <input
                                    id="medicineInstructions"
                                    type="text"
                                    name="instructions"
                                    value={
                                        medicineForm.instructions
                                    }
                                    onChange={
                                        handleMedicineChange
                                    }
                                    placeholder="e.g. After food"
                                />

                            </div>


                            {/* =================================================
                                ADD MEDICINE BUTTON
                            ================================================= */}

                            <div className="form-group">

                                <label>
                                    &nbsp;
                                </label>


                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={
                                        handleAddMedicine
                                    }
                                >

                                    + Add Medicine

                                </button>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        SELECTED MEDICINES
                    ================================================= */}

                    {selectedMedicines.length > 0 && (

                        <div className="form-section">


                            <div className="form-section-title">

                                <div className="form-section-icon">

                                    📋

                                </div>


                                <div>

                                    <h3>
                                        Added Medicines
                                    </h3>

                                    <p>
                                        Review medicines before creating prescription
                                    </p>

                                </div>

                            </div>


                            <div className="table-wrapper">

                                <table className="data-table">


                                    <thead>

                                        <tr>

                                            <th>
                                                Medicine
                                            </th>

                                            <th>
                                                Dosage
                                            </th>

                                            <th>
                                                Frequency
                                            </th>

                                            <th>
                                                Duration
                                            </th>

                                            <th>
                                                Instructions
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {selectedMedicines.map(
                                            (
                                                medicine,
                                                index
                                            ) => (

                                                <tr
                                                    key={
                                                        index
                                                    }
                                                >

                                                    <td>

                                                        <strong>

                                                            {
                                                                medicine.medicineName
                                                            }

                                                        </strong>


                                                        {medicine.genericName && (

                                                            <div>

                                                                {
                                                                    medicine.genericName
                                                                }

                                                            </div>

                                                        )}

                                                    </td>


                                                    <td>

                                                        {
                                                            medicine.dosage
                                                        }

                                                    </td>


                                                    <td>

                                                        {
                                                            medicine.frequency
                                                        }

                                                    </td>


                                                    <td>

                                                        {
                                                            medicine.duration
                                                        }

                                                    </td>


                                                    <td>

                                                        {
                                                            medicine.instructions ||
                                                            "-"
                                                        }

                                                    </td>


                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="cancel-button"
                                                            onClick={() =>
                                                                handleRemoveMedicine(
                                                                    index
                                                                )
                                                            }
                                                        >

                                                            Remove

                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        GENERAL INSTRUCTIONS
                    ================================================= */}

                    <div className="form-section">

                        <div className="form-grid">

                            <div className="form-group full-width">

                                <label
                                    htmlFor="instructions"
                                >

                                    General Instructions

                                </label>


                                <textarea
                                    id="instructions"
                                    name="instructions"
                                    rows="4"
                                    value={
                                        form.instructions
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter general prescription instructions..."
                                />

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <div className="form-actions">


                        <Link
                            to="/doctor/prescriptions"
                            className="cancel-button"
                        >

                            Cancel

                        </Link>


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={
                                loading ||
                                loadingAppointments ||
                                loadingMedicines
                            }
                        >

                            {loading

                                ? "Creating..."

                                : "✓ Create Prescription"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


export default AddPrescription;