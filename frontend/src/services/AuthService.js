import api from "./api";


/* =========================================
   LOGIN
========================================= */

export const loginUser = async (
    loginEmail,
    password
) => {

    const response =
        await api.post(
            "/auth/login",
            {
                loginEmail,
                password
            }
        );

    return response.data;
};


/* =========================================
   PATIENT REGISTRATION
========================================= */

export const registerPatient = async (
    patientData
) => {

    const response =
        await api.post(
            "/auth/register/patient",
            patientData
        );

    return response.data;
};


/* =========================================
   FORGOT PASSWORD
========================================= */

export const forgotPassword = async (
    loginEmail
) => {

    const response =
        await api.post(
            "/auth/forgot-password",
            {
                loginEmail
            }
        );

    return response.data;
};


/* =========================================
   VERIFY RESET TOKEN
========================================= */

export const verifyResetToken = async (
    loginEmail,
    token
) => {

    const response =
        await api.post(
            "/auth/verify-reset-token",
            {
                loginEmail,
                token
            }
        );

    return response.data;
};


/* =========================================
   RESET PASSWORD
========================================= */

export const resetPassword = async (
    loginEmail,
    token,
    newPassword
) => {

    const response =
        await api.post(
            "/auth/reset-password",
            {
                loginEmail,
                token,
                newPassword
            }
        );

    return response.data;
};


/* =========================================
   LOGOUT
========================================= */

export const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    sessionStorage.removeItem(
        "resetEmail"
    );

    sessionStorage.removeItem(
        "resetToken"
    );
};


/* =========================================
   GET CURRENT USER
========================================= */

export const getCurrentUser = () => {

    const storedUser =
        localStorage.getItem("user");


    if (!storedUser) {

        return null;
    }


    try {

        return JSON.parse(
            storedUser
        );

    } catch (error) {

        console.error(
            "Invalid stored user:",
            error
        );


        localStorage.removeItem(
            "user"
        );


        return null;
    }
};


/* =========================================
   DEFAULT EXPORT
========================================= */

const AuthService = {

    login: loginUser,

    register: registerPatient,

    forgotPassword,

    verifyResetToken,

    resetPassword,

    logout,

    getCurrentUser

};


export default AuthService;