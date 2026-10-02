import api from "./api";


/* =========================================
   GET ALL APPOINTMENTS
========================================= */

const getAllAppointments = async () => {

    const response =
        await api.get(
            "/admin/appointments"
        );

    return response.data;
};


/* =========================================
   GET APPOINTMENT BY ID
========================================= */

const getAppointmentById = async (id) => {

    const response =
        await api.get(
            `/admin/appointments/${id}`
        );

    return response.data;
};


/* =========================================
   UPDATE APPOINTMENT STATUS
========================================= */

const updateAppointmentStatus = async (
    id,
    status
) => {

    const response =
        await api.put(
            `/admin/appointments/${id}/status`,
            {
                status
            }
        );

    return response.data;
};


/* =========================================
   DELETE APPOINTMENT
========================================= */

const deleteAppointment = async (id) => {

    const response =
        await api.delete(
            `/admin/appointments/${id}`
        );

    return response.data;
};


/* =========================================
   SEARCH APPOINTMENTS
========================================= */

const searchAppointments = async (keyword) => {

    const response =
        await api.get(
            "/admin/appointments/search",
            {
                params: {
                    keyword
                }
            }
        );

    return response.data;
};


/* =========================================
   APPOINTMENT SERVICE
========================================= */

const AppointmentService = {

    getAllAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    deleteAppointment,
    searchAppointments

};


export default AppointmentService;