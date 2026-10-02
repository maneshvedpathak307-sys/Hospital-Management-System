import api from "./api";


/* =========================================
   GET ALL PRESCRIPTIONS
========================================= */

const getAllPrescriptions = async () => {

    const response =
        await api.get(
            "/admin/prescriptions"
        );

    return response.data;
};


/* =========================================
   GET PRESCRIPTION BY ID
========================================= */

const getPrescriptionById = async (id) => {

    const response =
        await api.get(
            `/admin/prescriptions/${id}`
        );

    return response.data;
};


/* =========================================
   CREATE PRESCRIPTION
========================================= */

const createPrescription = async (
    prescriptionData
) => {

    const response =
        await api.post(
            "/admin/prescriptions",
            prescriptionData
        );

    return response.data;
};


/* =========================================
   UPDATE PRESCRIPTION
========================================= */

const updatePrescription = async (
    id,
    prescriptionData
) => {

    const response =
        await api.put(
            `/admin/prescriptions/${id}`,
            prescriptionData
        );

    return response.data;
};


/* =========================================
   DELETE PRESCRIPTION
========================================= */

const deletePrescription = async (id) => {

    const response =
        await api.delete(
            `/admin/prescriptions/${id}`
        );

    return response.data;
};


/* =========================================
   SEARCH PRESCRIPTIONS
========================================= */

const searchPrescriptions = async (
    keyword
) => {

    const response =
        await api.get(
            "/admin/prescriptions/search",
            {
                params: {
                    keyword
                }
            }
        );

    return response.data;
};


/* =========================================
   PRESCRIPTION SERVICE
========================================= */

const PrescriptionService = {

    getAllPrescriptions,
    getPrescriptionById,
    createPrescription,
    updatePrescription,
    deletePrescription,
    searchPrescriptions

};


export default PrescriptionService;