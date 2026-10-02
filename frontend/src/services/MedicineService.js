import api from "./api";


/* =========================================
   GET ALL MEDICINES
========================================= */

export const getAllMedicines = async () => {

    const response =
        await api.get(
            "/admin/medicines"
        );

    return response.data;
};


/* =========================================
   GET MEDICINE BY ID
========================================= */

export const getMedicineById = async (id) => {

    const response =
        await api.get(
            `/admin/medicines/${id}`
        );

    return response.data;
};


/* =========================================
   CREATE MEDICINE
========================================= */

export const createMedicine = async (
    medicineData
) => {

    const response =
        await api.post(
            "/admin/medicines",
            medicineData
        );

    return response.data;
};


/* =========================================
   UPDATE MEDICINE
========================================= */

export const updateMedicine = async (
    id,
    medicineData
) => {

    const response =
        await api.put(
            `/admin/medicines/${id}`,
            medicineData
        );

    return response.data;
};


/* =========================================
   DELETE MEDICINE
========================================= */

export const deleteMedicine = async (id) => {

    const response =
        await api.delete(
            `/admin/medicines/${id}`
        );

    return response.data;
};


/* =========================================
   SEARCH MEDICINES
========================================= */

export const searchMedicines = async (
    keyword
) => {

    const response =
        await api.get(
            "/admin/medicines/search",
            {
                params: {
                    keyword
                }
            }
        );

    return response.data;
};


/* =========================================
   DEFAULT EXPORT
========================================= */

const MedicineService = {

    getAllMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    searchMedicines

};


export default MedicineService;