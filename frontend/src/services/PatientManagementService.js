import api from "./api";


/* =========================================
   GET ALL PATIENTS
========================================= */

const getAllPatients = async () => {

    const response =
        await api.get(
            "/admin/patients"
        );

    return response.data;
};


/* =========================================
   GET PATIENT BY ID
========================================= */

const getPatientById = async (id) => {

    const response =
        await api.get(
            `/admin/patients/${id}`
        );

    return response.data;
};


/* =========================================
   ADD PATIENT
========================================= */

const addPatient = async (patientData) => {

    const response =
        await api.post(
            "/admin/patients",
            patientData
        );

    return response.data;
};


/* =========================================
   UPDATE PATIENT
========================================= */

const updatePatient = async (
    id,
    patientData
) => {

    const response =
        await api.put(
            `/admin/patients/${id}`,
            patientData
        );

    return response.data;
};


/* =========================================
   DELETE PATIENT
========================================= */

const deletePatient = async (id) => {

    const response =
        await api.delete(
            `/admin/patients/${id}`
        );

    return response.data;
};


/* =========================================
   SEARCH PATIENTS
========================================= */

const searchPatients = async (keyword) => {

    const response =
        await api.get(
            "/admin/patients/search",
            {
                params: {
                    keyword
                }
            }
        );

    return response.data;
};


/* =========================================
   PATIENT MANAGEMENT SERVICE
========================================= */

const PatientManagementService = {

    getAllPatients,
    getPatientById,
    addPatient,
    updatePatient,
    deletePatient,
    searchPatients

};


export default PatientManagementService;