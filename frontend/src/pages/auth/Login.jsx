import React, {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../../context/AuthContext";

import "../../styles/auth.css";


function Login() {

    const navigate = useNavigate();

    const {
        login,
        loading
    } = useAuth();


    const [
        formData,
        setFormData
    ] = useState({

        loginEmail: "",

        password: ""

    });


    const [
        error,
        setError
    ] = useState("");


    /* =========================================
       INPUT CHANGE
    ========================================= */

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData(
            (previous) => ({

                ...previous,

                [name]: value

            })
        );


        setError("");

    };


    /* =========================================
       LOGIN
    ========================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        if (
            !formData.loginEmail.trim()
        ) {

            setError(
                "Email is required."
            );

            return;

        }


        if (
            !formData.password.trim()
        ) {

            setError(
                "Password is required."
            );

            return;

        }


        const result =
            await login(
                formData.loginEmail,
                formData.password
            );


        if (!result.success) {

            setError(
                result.message ||
                "Invalid email or password."
            );

            return;

        }


        /* =====================================
           ROLE BASED REDIRECT
        ===================================== */

        const loggedUser =
            result.user;


        const role =
            String(
                loggedUser?.role || ""
            ).toUpperCase();


        if (
            role === "ADMIN"
        ) {

            navigate(
                "/admin/dashboard",
                {
                    replace: true
                }
            );

        }

        else if (
            role === "DOCTOR"
        ) {

            navigate(
                "/doctor/dashboard",
                {
                    replace: true
                }
            );

        }

        else if (
            role === "PATIENT"
        ) {

            navigate(
                "/patient/dashboard",
                {
                    replace: true
                }
            );

        }

        else {

            setError(
                "User role is not configured."
            );

        }

    };


    /* =========================================
       RETURN
    ========================================= */

    return (

        <div className="auth-page">


            <div className="auth-card">


                {/* =================================
                    LOGO
                ================================= */}

                <div className="auth-logo">

                    <div className="auth-logo-icon">

                        🏥

                    </div>

                </div>


                {/* =================================
                    HEADER
                ================================= */}

                <div className="auth-header">

                    <h1>

                        Hospital Management System

                    </h1>


                    <p>

                        Sign in to your account

                    </p>

                </div>


                {/* =================================
                    ERROR
                ================================= */}

                {error && (

                    <div className="auth-error">

                        ⚠️ {error}

                    </div>

                )}


                {/* =================================
                    FORM
                ================================= */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >


                    {/* EMAIL */}

                    <div className="form-group">

                        <label
                            htmlFor="loginEmail"
                        >

                            Email

                        </label>


                        <input
                            id="loginEmail"
                            type="email"
                            name="loginEmail"
                            placeholder="Enter your email"
                            value={
                                formData.loginEmail
                            }
                            onChange={
                                handleChange
                            }
                            autoComplete="email"
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <div className="form-label-row">

                            <label
                                htmlFor="password"
                            >

                                Password

                            </label>


                            <button
                                type="button"
                                className="auth-link-button"
                                onClick={() =>
                                    navigate(
                                        "/forgot-password"
                                    )
                                }
                            >

                                Forgot Password?

                            </button>

                        </div>


                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={
                                formData.password
                            }
                            onChange={
                                handleChange
                            }
                            autoComplete="current-password"
                        />

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="auth-primary-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Login"
                        }

                    </button>

                </form>


                {/* =================================
                    REGISTER
                ================================= */}

                <div className="auth-divider">

                    <span>

                        New patient?

                    </span>

                </div>


                <button
                    type="button"
                    className="auth-secondary-button"
                    onClick={() =>
                        navigate(
                            "/register"
                        )
                    }
                >

                    Create Patient Account

                </button>


                {/* =================================
                    FOOTER
                ================================= */}

                <div className="auth-footer">

                    <p>

                        Hospital Management System

                    </p>


                    <span>

                        Secure Healthcare Management

                    </span>

                </div>

            </div>

        </div>

    );

}


export default Login;