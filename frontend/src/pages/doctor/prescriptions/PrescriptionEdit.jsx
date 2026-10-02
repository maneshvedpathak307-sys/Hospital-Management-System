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

import Loading from "../../../components/common/Loading";

import "../../../styles/tables.css";


function PrescriptionEdit() {

    const { id } = useParams();

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [prescription, setPrescription] =
        useState(null);

    const [medicines, setMedicines] =
        useState([]);

    const [selectedMedicines, setSelectedMedicines] =
        useState([]);


    const [form, setForm] = useState({

        appointmentId: "",

        diagnosis: "",

        instructions: ""

    });


    const [medicineForm, setMedicineForm] =
        useState({

            medicineId: "",

            dosage: "",

            frequency: "",

            duration: "",

            instructions: ""

        });


    const [loading, setLoading] =
        useState(true);

    const [loadingMedicines, setLoadingMedicines] =
        useState(true);

    const [updating, setUpdating] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // LOAD PRESCRIPTION
    // =====================================================

    const loadPrescription = useCallback(async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await api.get(
                    `/doctor/prescriptions/${id}`
                );


            console.log(
                "Prescription details:",
                response.data
            );


            const data =
                response.data;


            setPrescription(data);


            // =================================================
            // MAIN FORM
            // =================================================

            setForm({

                appointmentId:
                    data.appointmentId ||
                    data.appointment?.id ||
                    "",

                diagnosis:
                    data.diagnosis ||
                    "",

                instructions:
                    data.instructions ||
                    ""

            });


            // =================================================
            // EXISTING MEDICINES
            // =================================================

            const existingMedicines =
                Array.isArray(data.medicines)
                    ? data.medicines
                    : [];


            setSelectedMedicines(

                existingMedicines.map(
                    (medicine) => ({

                        id:
                            medicine.id ||
                            null,

                        medicineId:
                            medicine.medicineId ||
                            medicine.medicine?.id ||
                            "",

                        medicineName:
                            medicine.medicineName ||
                            medicine.medicine?.medicineName ||
                            "Medicine",

                        genericName:
                            medicine.genericName ||
                            medicine.medicine?.genericName ||
                            "",

                        dosage:
                            medicine.dosage ||
                            "",

                        frequency:
                            medicine.frequency ||
                            "",

                        duration:
                            medicine.duration ||
                            "",

                        instructions:
                            medicine.instructions ||
                            ""

                    })
                )

            );


        } catch (error) {

            console.error(
                "Error loading prescription:",
                error
            );


            setError(

                error.response?.data?.message ||

                (
                    typeof error.response?.data === "string"

                        ? error.response.data

                        : "Unable to load prescription."
                )

            );

        } finally {

            setLoading(false);

        }

    }, [
        id
    ]);


    // =====================================================
    // LOAD MEDICINES
    // =====================================================

    const loadMedicines = async () => {

        try {

            setLoadingMedicines(true);


            const response =
                await api.get(
                    "/doctor/medicines"
                );


            console.log(
                "Medicines:",
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
    // LOAD PRESCRIPTION + MEDICINES
    // =====================================================

    useEffect(() => {

        loadPrescription();

        loadMedicines();

    }, [
        id,
        loadPrescription
    ]);


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
        // VALIDATION
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
        // FIND MEDICINE
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

            id: null,

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
        // ADD MEDICINE
        // =================================================

        setSelectedMedicines(
            (previous) => [

                ...previous,

                medicineData

            ]
        );


        // =================================================
        // RESET
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

        setSelectedMedicines(
            (previous) =>

                previous.filter(
                    (_, medicineIndex) =>
                        medicineIndex !== index
                )
        );

    };


    // =====================================================
    // UPDATE EXISTING MEDICINE FIELD
    // =====================================================

    const handleExistingMedicineChange = (
        index,
        field,
        value
    ) => {

        setSelectedMedicines(
            (previous) =>

                previous.map(
                    (medicine, medicineIndex) => {

                        if (
                            medicineIndex !== index
                        ) {

                            return medicine;

                        }


                        return {

                            ...medicine,

                            [field]: value

                        };

                    }
                )
        );


        setError("");

        setSuccess("");

    };


    // =====================================================
    // UPDATE PRESCRIPTION
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        setError("");

        setSuccess("");


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

        if (
            selectedMedicines.length === 0
        ) {

            setError(
                "Please add at least one medicine."
            );

            return;

        }


        // =================================================
        // VALIDATE MEDICINE DETAILS
        // =================================================

        for (
            let i = 0;
            i < selectedMedicines.length;
            i++
        ) {

            const medicine =
                selectedMedicines[i];


            if (!medicine.medicineId) {

                setError(
                    `Medicine ${i + 1}: Please select a medicine.`
                );

                return;

            }


            if (
                !medicine.dosage ||
                !medicine.dosage.trim()
            ) {

                setError(
                    `Medicine ${i + 1}: Please enter dosage.`
                );

                return;

            }


            if (
                !medicine.frequency ||
                !medicine.frequency.trim()
            ) {

                setError(
                    `Medicine ${i + 1}: Please enter frequency.`
                );

                return;

            }


            if (
                !medicine.duration ||
                !medicine.duration.trim()
            ) {

                setError(
                    `Medicine ${i + 1}: Please enter duration.`
                );

                return;

            }

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
                            Number(
                                medicine.medicineId
                            ),

                        dosage:
                            medicine.dosage.trim(),

                        frequency:
                            medicine.frequency.trim(),

                        duration:
                            medicine.duration.trim(),

                        instructions:
                            medicine.instructions
                                ? medicine.instructions.trim()
                                : ""

                    })
                ),

            instructions:
                form.instructions.trim()

        };


        console.log(
            "Update prescription request:",
            requestData
        );


        // =================================================
        // UPDATE API
        // =================================================

        try {

            setUpdating(true);


            /*
             * UPDATE PRESCRIPTION
             *
             * Backend endpoint:
             *
             * PUT /api/doctor/prescriptions/{id}
             */

            const response =
                await api.put(
                    `/doctor/prescriptions/${id}`,
                    requestData
                );


            console.log(
                "Update prescription response:",
                response.data
            );


            setSuccess(
                typeof response.data === "string"

                    ? response.data

                    : response.data?.message ||
                      "Prescription updated successfully."
            );


            // =================================================
            // GO TO DETAILS
            // =================================================

            setTimeout(() => {

                navigate(
                    `/doctor/prescriptions/${id}`
                );

            }, 1000);


        } catch (error) {

            console.error(
                "Update prescription error:",
                error
            );


            setError(

                error.response?.data?.message ||

                (
                    typeof error.response?.data === "string"

                        ? error.response.data

                        : "Unable to update prescription."
                )

            );

        } finally {

            setUpdating(false);

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

    if (!prescription) {

        return (

            <div className="page-container">

                <div className="management-header">

                    <div>

                        <h2>
                            Edit Prescription
                        </h2>

                    </div>

                </div>


                <div className="error-alert">

                    ⚠️{" "}

                    {
                        error ||
                        "Prescription not found."
                    }

                </div>


                <Link
                    to="/doctor/prescriptions"
                    className="secondary-button"
                >

                    ← Back to Prescriptions

                </Link>

            </div>

        );

    }


    // =====================================================
    // PAGE
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
                    alignItems: "center",
                    width: "100%"
                }}
            >

                <div>

                    <h2>
                        ✏️ Edit Prescription
                    </h2>

                    <p>
                        Update prescription information and medicines.
                    </p>

                </div>


                <Link
                    to="/doctor/prescriptions"
                    className="secondary-button"
                    style={{
                        marginLeft: "auto",
                        whiteSpace: "nowrap"
                    }}
                >

                    ← Back to Prescriptions

                </Link>

            </div>


            {/* =================================================
                HEADER SPACE
            ================================================= */}

            <div
                style={{
                    height: "20px"
                }}
            />


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
                                    Edit Prescription
                                </h3>

                                <p>
                                    Update diagnosis and prescription details.
                                </p>

                            </div>

                        </div>


                        <div className="form-grid">


                            {/* =================================================
                                APPOINTMENT
                            ================================================= */}

                            <div className="form-group full-width">

                                <label>
                                    Appointment
                                </label>


                                <input
                                    type="text"
                                    value={
                                        prescription.patientName
                                            ? `${prescription.patientName} - Appointment #${form.appointmentId}`
                                            : `Appointment #${form.appointmentId || "-"}`
                                    }
                                    disabled
                                />


                                <small>
                                    Appointment cannot be changed while editing.
                                </small>

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
                        EXISTING MEDICINES
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
                                    Edit existing medicines or add new medicines.
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            EXISTING MEDICINES
                        ================================================= */}

                        {selectedMedicines.length > 0 ? (

                            <div className="table-wrapper">

                                <table className="data-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                S.No.
                                            </th>

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
                                                        medicine.id ||
                                                        `new-${index}`
                                                    }
                                                >

                                                    {/* S.NO */}

                                                    <td>

                                                        {
                                                            index + 1
                                                        }

                                                    </td>


                                                    {/* MEDICINE */}

                                                    <td>

                                                        <strong>

                                                            {
                                                                medicine.medicineName ||
                                                                "-"
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


                                                    {/* DOSAGE */}

                                                    <td>

                                                        <input
                                                            type="text"
                                                            value={
                                                                medicine.dosage
                                                            }
                                                            onChange={(e) =>
                                                                handleExistingMedicineChange(
                                                                    index,
                                                                    "dosage",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="e.g. 500 mg"
                                                        />

                                                    </td>


                                                    {/* FREQUENCY */}

                                                    <td>

                                                        <input
                                                            type="text"
                                                            value={
                                                                medicine.frequency
                                                            }
                                                            onChange={(e) =>
                                                                handleExistingMedicineChange(
                                                                    index,
                                                                    "frequency",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="e.g. Twice a day"
                                                        />

                                                    </td>


                                                    {/* DURATION */}

                                                    <td>

                                                        <input
                                                            type="text"
                                                            value={
                                                                medicine.duration
                                                            }
                                                            onChange={(e) =>
                                                                handleExistingMedicineChange(
                                                                    index,
                                                                    "duration",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="e.g. 5 days"
                                                        />

                                                    </td>


                                                    {/* INSTRUCTIONS */}

                                                    <td>

                                                        <input
                                                            type="text"
                                                            value={
                                                                medicine.instructions ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleExistingMedicineChange(
                                                                    index,
                                                                    "instructions",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="e.g. After food"
                                                        />

                                                    </td>


                                                    {/* REMOVE */}

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

                                                            🗑 Remove

                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <p>
                                No medicines added.
                            </p>

                        )}


                        {/* =================================================
                            ADD NEW MEDICINE
                        ================================================= */}

                        <div
                            style={{
                                marginTop: "25px",
                                paddingTop: "20px",
                                borderTop: "1px solid #ddd"
                            }}
                        >

                            <h4>
                                ➕ Add Medicine
                            </h4>


                            <div className="form-grid">


                                {/* MEDICINE */}

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


                                {/* DOSAGE */}

                                <div className="form-group">

                                    <label>

                                        Dosage

                                        <span>
                                            *
                                        </span>

                                    </label>


                                    <input
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


                                {/* FREQUENCY */}

                                <div className="form-group">

                                    <label>

                                        Frequency

                                        <span>
                                            *
                                        </span>

                                    </label>


                                    <input
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


                                {/* DURATION */}

                                <div className="form-group">

                                    <label>

                                        Duration

                                        <span>
                                            *
                                        </span>

                                    </label>


                                    <input
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


                                {/* INSTRUCTIONS */}

                                <div className="form-group">

                                    <label>

                                        Medicine Instructions

                                    </label>


                                    <input
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


                                {/* ADD BUTTON */}

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
                                        disabled={
                                            loadingMedicines
                                        }
                                    >

                                        + Add Medicine

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        GENERAL INSTRUCTIONS
                    ================================================= */}

                    <div className="form-section">


                        <div className="form-section-title">

                            <div className="form-section-icon">

                                📋

                            </div>


                            <div>

                                <h3>
                                    General Instructions
                                </h3>

                                <p>
                                    Update general instructions for the patient.
                                </p>

                            </div>

                        </div>


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
                                    rows="5"
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
                        ACTIONS
                    ================================================= */}

                    <div className="form-actions">


                        <Link
                            to={`/doctor/prescriptions/${id}`}
                            className="cancel-button"
                        >

                            Cancel

                        </Link>


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={
                                updating ||
                                loadingMedicines
                            }
                        >

                            {updating

                                ? "Updating..."

                                : "✓ Update Prescription"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


export default PrescriptionEdit;