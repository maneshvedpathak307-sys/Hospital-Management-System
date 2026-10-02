import api from "./api";


/* =========================================
   GET ALL DOCTORS
========================================= */

const getAllDoctors = async () => {

    const response =
        await api.get(
            "/admin/doctors"
        );

    return response.data;
};


/* =========================================
   GET DOCTOR BY ID
========================================= */

const getDoctorById = async (id) => {

    const response =
        await api.get(
            `/admin/doctors/${id}`
        );

    return response.data;
};


/* =========================================
   ADD DOCTOR
========================================= */

const addDoctor = async (doctorData) => {

    const response =
        await api.post(
            "/admin/doctors",
            doctorData
        );

    return response.data;
};


/* =========================================
   UPDATE DOCTOR
========================================= */

const updateDoctor = async (
    id,
    doctorData
) => {

    const response =
        await api.put(
            `/admin/doctors/${id}`,
            doctorData
        );

    return response.data;
};


/* =========================================
   DELETE DOCTOR
========================================= */

const deleteDoctor = async (id) => {

    const response =
        await api.delete(
            `/admin/doctors/${id}`
        );

    return response.data;
};


/* =========================================
   SEARCH DOCTORS
========================================= */

const searchDoctors = async (keyword) => {

    const response =
        await api.get(
            "/admin/doctors/search",
            {
                params: {
                    keyword
                }
            }
        );

    return response.data;
};


/* =========================================
   DOCTOR MANAGEMENT SERVICE
========================================= */

const DoctorManagementService = {

    getAllDoctors,
    getDoctorById,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    searchDoctors

};


export default DoctorManagementService;