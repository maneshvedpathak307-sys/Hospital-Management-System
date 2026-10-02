import api from "./api";


/* =========================================
   PATIENT DASHBOARD
========================================= */

const getDashboard = async () => {

    const response =
        await api.get(
            "/patient/dashboard"
        );

    return response.data;
};


/* =========================================
   PATIENT PROFILE
========================================= */

const getProfile = async () => {

    const response =
        await api.get(
            "/patient/profile"
        );

    return response.data;
};


const updateProfile = async (profileData) => {

    const response =
        await api.put(
            "/patient/profile",
            profileData
        );

    return response.data;
};


/* =========================================
   DOCTORS
========================================= */

const getDoctors = async () => {

    const response =
        await api.get(
            "/patient/doctors"
        );

    return response.data;
};


const getDoctorById = async (id) => {

    const response =
        await api.get(
            `/patient/doctors/${id}`
        );

    return response.data;
};


/* =========================================
   APPOINTMENTS
========================================= */

const getAppointments = async () => {

    const response =
        await api.get(
            "/patient/appointments"
        );

    return response.data;
};


const getAppointmentById = async (id) => {

    const response =
        await api.get(
            `/patient/appointments/${id}`
        );

    return response.data;
};


const bookAppointment = async (
    appointmentData
) => {

    const response =
        await api.post(
            "/patient/appointments",
            appointmentData
        );

    return response.data;
};


const cancelAppointment = async (id) => {

    const response =
        await api.put(
            `/patient/appointments/${id}/cancel`
        );

    return response.data;
};


/* =========================================
   PRESCRIPTIONS
========================================= */

const getPrescriptions = async () => {

    const response =
        await api.get(
            "/patient/prescriptions"
        );

    return response.data;
};


/* =========================================
   BILLS
========================================= */

const getBills = async () => {

    const response =
        await api.get(
            "/patient/bills"
        );

    return response.data;
};


/* =========================================
   PATIENT SERVICE
========================================= */

const PatientService = {

    getDashboard,

    getProfile,
    updateProfile,

    getDoctors,
    getDoctorById,

    getAppointments,
    getAppointmentById,
    bookAppointment,
    cancelAppointment,

    getPrescriptions,

    getBills

};


export default PatientService;