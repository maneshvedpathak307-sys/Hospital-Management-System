import api from "./api";


// =====================================================
// GET ALL BILLS
// =====================================================

export const getAllBills = async () => {

    const response =
        await api.get(
            "/admin/bills"
        );

    return response.data;
};


// =====================================================
// GET BILL BY ID
// =====================================================

export const getBillById = async (id) => {

    const response =
        await api.get(
            `/admin/bills/${id}`
        );

    return response;
};


// =====================================================
// CREATE BILL
// =====================================================

export const createBill = async (data) => {

    const response =
        await api.post(
            "/admin/bills",
            data
        );

    return response;
};


// =====================================================
// UPDATE BILL
// =====================================================

export const updateBill = async (
    id,
    data
) => {

    const response =
        await api.put(
            `/admin/bills/${id}`,
            data
        );

    return response;
};


// =====================================================
// DELETE BILL
// =====================================================

export const deleteBill = async (id) => {

    const response =
        await api.delete(
            `/admin/bills/${id}`
        );

    return response;
};


// =====================================================
// DOWNLOAD INVOICE
// =====================================================

export const downloadInvoice = async (id) => {

    const response =
        await api.get(
            `/admin/bills/${id}/invoice`,
            {
                responseType: "blob"
            }
        );

    return response;
};