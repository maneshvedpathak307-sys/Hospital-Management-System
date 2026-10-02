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

import {
    createBill,
    getBillById,
    updateBill
} from "../../../services/BillService";

import Loading from "../../../components/common/Loading";

import "../../../styles/forms.css";


function AddBill() {

    const navigate = useNavigate();

    const { id } = useParams();

    const editing = Boolean(id);


    // =====================================================
    // TODAY'S DATE
    // =====================================================

    const getTodayDate = () => {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;

    };


    // =====================================================
    // EMPTY FORM
    // =====================================================

    const emptyForm = {

        patientId: "",

        doctorId: "",

        appointmentId: "",

        treatment: "",

        consultationFee: "",

        medicineCharge: "",

        testCharge: "",

        billDate: getTodayDate()

    };


    // =====================================================
    // STATES
    // =====================================================

    const [bill, setBill] =
        useState(emptyForm);

    const [appointments, setAppointments] =
        useState([]);

    const [selectedAppointment, setSelectedAppointment] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [loadingAppointments, setLoadingAppointments] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // LOAD APPOINTMENTS
    // =====================================================

    const loadAppointments = useCallback(async () => {

        try {

            setLoadingAppointments(true);

            setError("");


            const response =
                await api.get(
                    "/admin/appointments"
                );


            console.log(
                "Appointments:",
                response.data
            );


            const data =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            setAppointments(data);


        } catch (error) {

            console.error(
                "Load appointments error:",
                error
            );


            setAppointments([]);


            setError(

                error?.response?.data?.message ||

                (
                    typeof error?.response?.data === "string"

                        ? error.response.data

                        : "Unable to load appointments."
                )

            );

        } finally {

            setLoadingAppointments(false);

        }

    }, []);


    // =====================================================
    // LOAD BILL FOR EDIT
    // =====================================================

    const loadBill = useCallback(async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getBillById(id);


            const data =
                response?.data ||
                response;


            console.log(
                "Bill details:",
                data
            );


            setBill({

                patientId:
                    data.patientId ?? "",

                doctorId:
                    data.doctorId ?? "",

                appointmentId:
                    data.appointmentId ?? "",

                treatment:
                    data.treatment || "",

                consultationFee:
                    data.consultationFee ?? "",

                medicineCharge:
                    data.medicineCharge ?? "",

                testCharge:
                    data.testCharge ?? "",

                billDate:
                    data.billDate ||
                    getTodayDate()

            });


            if (data.appointmentId) {

                const appointment =
                    appointments.find(
                        (item) =>
                            String(item.id) ===
                            String(data.appointmentId)
                    );


                if (appointment) {

                    setSelectedAppointment(
                        appointment
                    );

                }

            }

        } catch (error) {

            console.error(
                "Load bill error:",
                error
            );


            setError(

                error?.response?.data?.message ||

                (
                    typeof error?.response?.data === "string"

                        ? error.response.data

                        : "Unable to load bill."
                )

            );

        } finally {

            setLoading(false);

        }

    }, [
        id,
        appointments
    ]);


    // =====================================================
    // LOAD APPOINTMENTS ON PAGE LOAD
    // =====================================================

    useEffect(() => {

        loadAppointments();

    }, [
        loadAppointments
    ]);


    // =====================================================
    // LOAD BILL WHEN EDITING
    // =====================================================

    useEffect(() => {

        if (editing) {

            loadBill();

        }

    }, [
        editing,
        loadBill
    ]);


    // =====================================================
    // FIND APPOINTMENT AFTER APPOINTMENTS LOAD
    // =====================================================

    useEffect(() => {

        if (
            bill.appointmentId &&
            appointments.length > 0
        ) {

            const appointment =
                appointments.find(
                    (item) =>
                        String(item.id) ===
                        String(bill.appointmentId)
                );


            if (appointment) {

                setSelectedAppointment(
                    appointment
                );

            }

        }

    }, [
        appointments,
        bill.appointmentId
    ]);


    // =====================================================
    // GET PATIENT NAME
    // =====================================================

    const getPatientName = (appointment) => {

        if (!appointment) {

            return "";

        }


        if (appointment.patientName) {

            return appointment.patientName;

        }


        if (appointment.patient?.name) {

            return appointment.patient.name;

        }


        if (
            appointment.patient?.firstName ||
            appointment.patient?.lastName
        ) {

            return [

                appointment.patient.firstName,

                appointment.patient.lastName

            ]
                .filter(Boolean)
                .join(" ");

        }


        return `Patient #${appointment.patientId || "-"}`;

    };


    // =====================================================
    // GET DOCTOR NAME
    // =====================================================

    const getDoctorName = (appointment) => {

        if (!appointment) {

            return "";

        }


        if (appointment.doctorName) {

            return appointment.doctorName;

        }


        if (appointment.doctor?.name) {

            return appointment.doctor.name;

        }


        if (
            appointment.doctor?.firstName ||
            appointment.doctor?.lastName
        ) {

            const name = [

                appointment.doctor.firstName,

                appointment.doctor.lastName

            ]
                .filter(Boolean)
                .join(" ");


            return name
                ? `Dr. ${name}`
                : `Doctor #${appointment.doctorId || "-"}`;

        }


        return `Doctor #${appointment.doctorId || "-"}`;

    };


    // =====================================================
    // GET DEPARTMENT NAME
    // =====================================================

    const getDepartmentName = (appointment) => {

        if (!appointment) {

            return "";

        }


        return (

            appointment.departmentName ||

            appointment.department?.departmentName ||

            ""

        );

    };


    // =====================================================
    // APPOINTMENT DISPLAY TEXT
    // =====================================================

    const getAppointmentLabel = (appointment) => {

        if (!appointment) {

            return "";

        }


        const appointmentId =
            appointment.id ||
            appointment.appointmentId ||
            "-";


        const patientName =
            getPatientName(
                appointment
            );


        const doctorName =
            getDoctorName(
                appointment
            );


        return `Appointment #${appointmentId} — ${patientName} — ${doctorName}`;

    };


    // =====================================================
    // SELECT APPOINTMENT
    // =====================================================

    const handleAppointmentChange = (e) => {

        const appointmentId =
            e.target.value;


        setError("");

        setSuccess("");


        if (!appointmentId) {

            setSelectedAppointment(null);


            setBill((previous) => ({

                ...previous,

                appointmentId: "",

                patientId: "",

                doctorId: ""

            }));


            return;

        }


        const appointment =
            appointments.find(
                (item) =>
                    String(
                        item.id ||
                        item.appointmentId
                    ) ===
                    String(appointmentId)
            );


        if (!appointment) {

            setError(
                "Selected appointment was not found."
            );

            return;

        }


        const patientId =
            appointment.patientId ||
            appointment.patient?.id ||
            "";


        const doctorId =
            appointment.doctorId ||
            appointment.doctor?.id ||
            "";


        setSelectedAppointment(
            appointment
        );


        setBill((previous) => ({

            ...previous,

            appointmentId:
                appointment.id ||
                appointment.appointmentId ||
                "",

            patientId:
                patientId,

            doctorId:
                doctorId

        }));

    };


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setBill((previous) => ({

            ...previous,

            [name]: value

        }));


        setError("");

        setSuccess("");

    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {

        if (!bill.appointmentId) {

            setError(
                "Please select an appointment."
            );

            return false;

        }


        if (!bill.patientId) {

            setError(
                "Patient information could not be found for the selected appointment."
            );

            return false;

        }


        if (!bill.doctorId) {

            setError(
                "Doctor information could not be found for the selected appointment."
            );

            return false;

        }


        if (!bill.treatment.trim()) {

            setError(
                "Please enter treatment."
            );

            return false;

        }


        if (
            bill.consultationFee === "" ||
            Number(bill.consultationFee) < 0
        ) {

            setError(
                "Please enter a valid consultation fee."
            );

            return false;

        }


        if (
            bill.medicineCharge === "" ||
            Number(bill.medicineCharge) < 0
        ) {

            setError(
                "Please enter a valid medicine charge."
            );

            return false;

        }


        if (
            bill.testCharge === "" ||
            Number(bill.testCharge) < 0
        ) {

            setError(
                "Please enter a valid test charge."
            );

            return false;

        }


        if (!bill.billDate) {

            setError(
                "Please select bill date."
            );

            return false;

        }


        return true;

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setSuccess("");


        if (!validateForm()) {

            return;

        }


        const requestData = {

            patientId:
                Number(
                    bill.patientId
                ),

            doctorId:
                Number(
                    bill.doctorId
                ),

            appointmentId:
                Number(
                    bill.appointmentId
                ),

            treatment:
                bill.treatment.trim(),

            consultationFee:
                Number(
                    bill.consultationFee
                ),

            medicineCharge:
                Number(
                    bill.medicineCharge
                ),

            testCharge:
                Number(
                    bill.testCharge
                ),

            billDate:
                bill.billDate

        };


        console.log(
            "Bill request:",
            requestData
        );


        try {

            setSaving(true);


            // =================================================
            // UPDATE
            // =================================================

            if (editing) {

                await updateBill(
                    id,
                    requestData
                );


                setSuccess(
                    "Bill updated successfully."
                );

            }


            // =================================================
            // CREATE
            // =================================================

            else {

                await createBill(
                    requestData
                );


                setSuccess(
                    "Bill created successfully."
                );

            }


            setTimeout(() => {

                navigate(
                    "/admin/billing"
                );

            }, 800);


        } catch (error) {

            console.error(
                "Bill save error:",
                error
            );


            setError(

                error?.response?.data?.message ||

                (
                    typeof error?.response?.data === "string"

                        ? error.response.data

                        : "Unable to save bill."
                )

            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {

        navigate(
            "/admin/billing"
        );

    };


    // =====================================================
    // BACK TO BILLS
    // =====================================================

    const handleBackToBills = () => {

        navigate(
            "/admin/billing"
        );

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
                    width: "100%",
                    marginBottom: "24px"
                }}
            >

                <div>

                    <h2>

                        {editing
                            ? "Edit Bill"
                            : "Add Bill"
                        }

                    </h2>

                </div>


                <button
                    type="button"
                    className="secondary-button"
                    onClick={
                        handleBackToBills
                    }
                    disabled={saving}
                    style={{
                        marginLeft: "auto",
                        whiteSpace: "nowrap"
                    }}
                >

                    ← Back to Bills

                </button>


            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="page-error">

                    ⚠️ {error}

                </div>

            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <div className="page-success">

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
                        APPOINTMENT
                    ================================================= */}

                    <div className="form-section">


                        <div className="form-section-header">

                            <div className="form-section-icon">

                                📅

                            </div>


                            <div>

                                <h3>
                                    Appointment
                                </h3>

                                <p>
                                    Select the patient appointment for this bill.
                                </p>

                            </div>

                        </div>


                        <div className="form-grid">


                            {/* APPOINTMENT */}

                            <div className="form-group full-width">

                                <label
                                    htmlFor="appointmentId"
                                >

                                    Appointment

                                    <span>
                                        *
                                    </span>

                                </label>


                                <select
                                    id="appointmentId"
                                    name="appointmentId"
                                    value={
                                        bill.appointmentId
                                    }
                                    onChange={
                                        handleAppointmentChange
                                    }
                                    disabled={
                                        loadingAppointments ||
                                        saving ||
                                        editing
                                    }
                                >

                                    <option value="">

                                        {loadingAppointments

                                            ? "Loading appointments..."

                                            : appointments.length === 0

                                                ? "No appointments available"

                                                : "Select Appointment"

                                        }

                                    </option>


                                    {appointments.map(
                                        (appointment) => {

                                            const appointmentId =
                                                appointment.id ||
                                                appointment.appointmentId;


                                            return (

                                                <option
                                                    key={
                                                        appointmentId
                                                    }
                                                    value={
                                                        appointmentId
                                                    }
                                                >

                                                    {
                                                        getAppointmentLabel(
                                                            appointment
                                                        )
                                                    }

                                                </option>

                                            );

                                        }
                                    )}

                                </select>


                                <small>

                                    {editing

                                        ? "Appointment cannot be changed while editing."

                                        : "Select the appointment. Patient and doctor information will be filled automatically."

                                    }

                                </small>

                            </div>


                        </div>


                        {/* =================================================
                            SELECTED APPOINTMENT
                        ================================================= */}

                        {selectedAppointment && (

                            <div className="selected-appointment-card">


                                <div className="selected-appointment-header">

                                    <div className="selected-appointment-icon">

                                        ✓

                                    </div>


                                    <div>

                                        <h4>
                                            Selected Appointment
                                        </h4>

                                        <p>
                                            Appointment information
                                        </p>

                                    </div>

                                </div>


                                <div className="selected-appointment-grid">


                                    {/* APPOINTMENT */}

                                    <div>

                                        <span>
                                            Appointment
                                        </span>

                                        <strong>

                                            #
                                            {
                                                selectedAppointment.id ||
                                                selectedAppointment.appointmentId ||
                                                bill.appointmentId
                                            }

                                        </strong>

                                    </div>


                                    {/* PATIENT */}

                                    <div>

                                        <span>
                                            Patient
                                        </span>

                                        <strong>

                                            {
                                                getPatientName(
                                                    selectedAppointment
                                                )
                                            }

                                        </strong>

                                    </div>


                                    {/* DOCTOR */}

                                    <div>

                                        <span>
                                            Doctor
                                        </span>

                                        <strong>

                                            {
                                                getDoctorName(
                                                    selectedAppointment
                                                )
                                            }

                                        </strong>

                                    </div>


                                    {/* DEPARTMENT */}

                                    {getDepartmentName(
                                        selectedAppointment
                                    ) && (

                                        <div>

                                            <span>
                                                Department
                                            </span>

                                            <strong>

                                                {
                                                    getDepartmentName(
                                                        selectedAppointment
                                                    )
                                                }

                                            </strong>

                                        </div>

                                    )}

                                </div>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        BILLING DETAILS
                    ================================================= */}

                    <div className="form-section">


                        <div className="form-section-header">

                            <div className="form-section-icon">

                                💰

                            </div>


                            <div>

                                <h3>
                                    Billing Details
                                </h3>

                                <p>
                                    Enter treatment and charges for this appointment.
                                </p>

                            </div>

                        </div>


                        <div className="form-grid">


                            {/* TREATMENT */}

                            <div className="form-group full-width">

                                <label
                                    htmlFor="treatment"
                                >

                                    Treatment

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="treatment"
                                    type="text"
                                    name="treatment"
                                    value={
                                        bill.treatment
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter treatment details"
                                    disabled={saving}
                                />

                            </div>


                            {/* CONSULTATION FEE */}

                            <div className="form-group">

                                <label
                                    htmlFor="consultationFee"
                                >

                                    Consultation Fee

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="consultationFee"
                                    type="number"
                                    name="consultationFee"
                                    min="0"
                                    step="0.01"
                                    value={
                                        bill.consultationFee
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="₹ 0.00"
                                    disabled={saving}
                                />

                            </div>


                            {/* MEDICINE CHARGE */}

                            <div className="form-group">

                                <label
                                    htmlFor="medicineCharge"
                                >

                                    Medicine Charge

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="medicineCharge"
                                    type="number"
                                    name="medicineCharge"
                                    min="0"
                                    step="0.01"
                                    value={
                                        bill.medicineCharge
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="₹ 0.00"
                                    disabled={saving}
                                />

                            </div>


                            {/* TEST CHARGE */}

                            <div className="form-group">

                                <label
                                    htmlFor="testCharge"
                                >

                                    Test Charge

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="testCharge"
                                    type="number"
                                    name="testCharge"
                                    min="0"
                                    step="0.01"
                                    value={
                                        bill.testCharge
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="₹ 0.00"
                                    disabled={saving}
                                />

                            </div>


                            {/* BILL DATE */}

                            <div className="form-group">

                                <label
                                    htmlFor="billDate"
                                >

                                    Bill Date

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="billDate"
                                    type="date"
                                    name="billDate"
                                    value={
                                        bill.billDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={saving}
                                />

                            </div>


                            {/* PATIENT */}

                            <div className="form-group">

                                <label>
                                    Patient
                                </label>


                                <input
                                    type="text"
                                    value={
                                        selectedAppointment
                                            ? getPatientName(
                                                selectedAppointment
                                            )
                                            : "-"
                                    }
                                    disabled
                                />


                                <small>

                                    Patient is automatically taken from the appointment.

                                </small>

                            </div>


                            {/* DOCTOR */}

                            <div className="form-group">

                                <label>
                                    Doctor
                                </label>


                                <input
                                    type="text"
                                    value={
                                        selectedAppointment
                                            ? getDoctorName(
                                                selectedAppointment
                                            )
                                            : "-"
                                    }
                                    disabled
                                />


                                <small>

                                    Doctor is automatically taken from the appointment.

                                </small>

                            </div>


                        </div>

                    </div>


                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <div className="form-actions">


                        <button
                            type="button"
                            className="cancel-button"
                            onClick={
                                handleCancel
                            }
                            disabled={saving}
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={
                                saving ||
                                loadingAppointments ||
                                !bill.appointmentId
                            }
                        >

                            {saving

                                ? "Saving..."

                                : editing

                                    ? "✓ Update Bill"

                                    : "✓ Create Bill"

                            }

                        </button>


                    </div>


                </form>

            </div>

        </div>

    );

}


export default AddBill;