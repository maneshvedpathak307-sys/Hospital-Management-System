import api from "./api";


/* =========================================
   ADMIN DASHBOARD
========================================= */

const getDashboard = async () => {

    const response =
        await api.get(
            "/admin/dashboard"
        );

    return response.data;
};


/* =========================================
   ADMIN PROFILE
========================================= */

const getProfile = async () => {

    const response =
        await api.get(
            "/admin/profile"
        );

    return response.data;
};


const updateProfile = async (profileData) => {

    const response =
        await api.put(
            "/admin/profile",
            profileData
        );

    return response.data;
};


/* =========================================
   ADMIN NOTIFICATIONS
========================================= */

const getNotifications = async () => {

    const response =
        await api.get(
            "/admin/notifications"
        );

    return response.data;
};


const markNotificationAsRead = async (id) => {

    const response =
        await api.put(
            `/admin/notifications/${id}/read`
        );

    return response.data;
};


/* =========================================
   ADMIN SERVICE
========================================= */

const AdminService = {

    getDashboard,

    getProfile,
    updateProfile,

    getNotifications,
    markNotificationAsRead

};


export default AdminService;