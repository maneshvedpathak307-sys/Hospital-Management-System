import api from "./api";


/* =========================================
   DOCTOR DASHBOARD
========================================= */

const getDashboard = async () => {

    const response =
        await api.get(
            "/doctor/dashboard"
        );

    return response.data;
};


/* =========================================
   DOCTOR PROFILE
========================================= */

const getProfile = async () => {

    const response =
        await api.get(
            "/doctor/profile"
        );

    return response.data;
};


const updateProfile = async (profileData) => {

    const response =
        await api.put(
            "/doctor/profile",
            profileData
        );

    return response.data;
};


/* =========================================
   DOCTOR PATIENTS
========================================= */

const getPatients = async () => {

    const response =
        await api.get(
            "/doctor/patients"
        );

    return response.data;
};


const getPatientById = async (id) => {

    const response =
        await api.get(
            `/doctor/patients/${id}`
        );

    return response.data;
};


/* =========================================
   DOCTOR APPOINTMENTS
========================================= */

const getAppointments = async () => {

    const response =
        await api.get(
            "/doctor/appointments"
        );

    return response.data;
};


const getAppointmentById = async (id) => {

    const response =
        await api.get(
            `/doctor/appointments/${id}`
        );

    return response.data;
};


const updateAppointmentStatus = async (
    id,
    status
) => {

    const response =
        await api.put(
            `/doctor/appointments/${id}/status`,
            {
                status
            }
        );

    return response.data;
};


/* =========================================
   DOCTOR PRESCRIPTIONS
========================================= */

const getPrescriptions = async () => {

    const response =
        await api.get(
            "/doctor/prescriptions"
        );

    return response.data;
};


const addPrescription = async (
    prescriptionData
) => {

    const response =
        await api.post(
            "/doctor/prescriptions",
            prescriptionData
        );

    return response.data;
};


const getPrescriptionById = async (id) => {

    const response =
        await api.get(
            `/doctor/prescriptions/${id}`
        );

    return response.data;
};


/* =========================================
   DOCTOR SERVICE
========================================= */

const DoctorService = {

    getDashboard,

    getProfile,
    updateProfile,

    getPatients,
    getPatientById,

    getAppointments,
    getAppointmentById,
    updateAppointmentStatus,

    getPrescriptions,
    addPrescription,
    getPrescriptionById

};


export default DoctorService;