import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import AuthService from "../services/AuthService";


/* =========================================
   CREATE CONTEXT
========================================= */

const AuthContext = createContext(null);


/* =========================================
   AUTH PROVIDER
========================================= */

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);


    /* =========================================
       RESTORE LOGIN
    ========================================= */

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        const token =
            localStorage.getItem("token");


        if (storedUser && token) {

            try {

                const parsedUser =
                    JSON.parse(storedUser);

                setUser(parsedUser);

            } catch (error) {

                console.error(
                    "Invalid stored user:",
                    error
                );

                localStorage.removeItem("user");
                localStorage.removeItem("token");

                setUser(null);
            }

        } else {

            setUser(null);
        }


        setLoading(false);

    }, []);


    /* =========================================
       LOGIN
    ========================================= */

    const login = async (
        loginEmail,
        password
    ) => {

        try {

            setLoading(true);


            /* =================================
               CLEAR OLD USER FIRST
            ================================= */

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setUser(null);


            /* =================================
               LOGIN API
            ================================= */

            const result =
                await AuthService.login(
                    loginEmail,
                    password
                );


            console.log(
                "Login API result:",
                result
            );


            /* =================================
               CHECK RESPONSE
            ================================= */

            if (!result || !result.token) {

                return {

                    success: false,

                    message:
                        "Login successful but JWT token was not received."

                };
            }


            /* =================================
               CREATE CURRENT USER
            ================================= */

            const loggedUser = {

                userId:
                    result.userId,

                loginEmail:
                    result.loginEmail ||
                    loginEmail,

                role:
                    String(
                        result.role || ""
                    ).toUpperCase()
            };


            console.log(
                "New logged user:",
                loggedUser
            );


            /* =================================
               SAVE NEW TOKEN
            ================================= */

            localStorage.setItem(
                "token",
                result.token
            );


            /* =================================
               SAVE NEW USER
            ================================= */

            localStorage.setItem(
                "user",
                JSON.stringify(
                    loggedUser
                )
            );


            /* =================================
               UPDATE REACT STATE
            ================================= */

            setUser(loggedUser);


            /* =================================
               RETURN LOGIN RESULT
            ================================= */

            return {

                success: true,

                user: loggedUser,

                token: result.token

            };


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            let message =
                "Invalid email or password.";


            if (
                typeof error.response?.data ===
                "string"
            ) {

                message =
                    error.response.data;

            } else if (
                error.response?.data?.message
            ) {

                message =
                    error.response.data.message;
            }


            return {

                success: false,

                message

            };


        } finally {

            setLoading(false);
        }
    };


    /* =========================================
       REGISTER
    ========================================= */

    const register = async (
        patientData
    ) => {

        try {

            setLoading(true);


            const result =
                await AuthService.register(
                    patientData
                );


            console.log(
                "Registration API result:",
                result
            );


            return {

                success: true,

                message:
                    typeof result === "string"
                        ? result
                        : result?.message ||
                          "Patient account created successfully."

            };


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            let message =
                "Registration failed.";


            if (
                typeof error.response?.data ===
                "string"
            ) {

                message =
                    error.response.data;

            } else if (
                error.response?.data?.message
            ) {

                message =
                    error.response.data.message;
            }


            return {

                success: false,

                message

            };


        } finally {

            setLoading(false);
        }
    };


    /* =========================================
       LOGOUT
    ========================================= */

    const logout = () => {

        AuthService.logout();

        setUser(null);
    };


    /* =========================================
       CONTEXT VALUE
    ========================================= */

    const value = {

        user,

        loading,

        login,

        register,

        logout,

        isAuthenticated:
            !!user &&
            !!localStorage.getItem("token")

    };


    return (

        <AuthContext.Provider
            value={value}
        >

            {children}

        </AuthContext.Provider>
    );
}


/* =========================================
   USE AUTH
========================================= */

export function useAuth() {

    const context =
        useContext(AuthContext);


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }


    return context;
}


export default AuthContext;