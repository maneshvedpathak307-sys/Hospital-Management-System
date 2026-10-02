import api from "./api";


/* =========================================
   GET ADMIN PROFILE
========================================= */

const getAdminProfile = async () => {

    const response =
        await api.get(
            "/admin/profile"
        );

    return response.data;
};


/* =========================================
   UPDATE ADMIN PROFILE
========================================= */

const updateAdminProfile = async (
    profileData
) => {

    const response =
        await api.put(
            "/admin/profile",
            profileData
        );

    return response.data;
};


/* =========================================
   GET DOCTOR PROFILE
========================================= */

const getDoctorProfile = async () => {

    const response =
        await api.get(
            "/doctor/profile"
        );

    return response.data;
};


/* =========================================
   UPDATE DOCTOR PROFILE
========================================= */

const updateDoctorProfile = async (
    profileData
) => {

    const response =
        await api.put(
            "/doctor/profile",
            profileData
        );

    return response.data;
};


/* =========================================
   GET PATIENT PROFILE
========================================= */

const getPatientProfile = async () => {

    const response =
        await api.get(
            "/patient/profile"
        );

    return response.data;
};


/* =========================================
   UPDATE PATIENT PROFILE
========================================= */

const updatePatientProfile = async (
    profileData
) => {

    const response =
        await api.put(
            "/patient/profile",
            profileData
        );

    return response.data;
};


/* =========================================
   PROFILE SERVICE
========================================= */

const ProfileService = {

    getAdminProfile,
    updateAdminProfile,

    getDoctorProfile,
    updateDoctorProfile,

    getPatientProfile,
    updatePatientProfile

};


export default ProfileService;