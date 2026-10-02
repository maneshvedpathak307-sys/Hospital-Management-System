import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import "../../styles/auth.css";


function ForgotPassword() {

    const navigate = useNavigate();


    const [loginEmail, setLoginEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =========================================
    // VERIFY EMAIL
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // =========================================
        // VALIDATION
        // =========================================

        if (!loginEmail.trim()) {

            setError(
                "Email is required."
            );

            return;
        }


        try {

            setLoading(true);


            // =========================================
            // VERIFY EMAIL / CREATE RESET SESSION
            // =========================================

            const response =
                await api.post(
                    "/auth/forgot-password",
                    {
                        loginEmail:
                            loginEmail.trim()
                    }
                );


            console.log(
                "Forgot password response:",
                response.data
            );


            /*
             * Backend returns the reset token.
             *
             * User does NOT need to see or enter it.
             * We temporarily store it in sessionStorage.
             */

            let resetToken = "";


            if (
                typeof response.data === "string"
            ) {

                resetToken =
                    response.data;

            }

            else if (
                response.data?.token
            ) {

                resetToken =
                    response.data.token;

            }


            if (!resetToken) {

                setError(
                    "Unable to create password reset session."
                );

                return;
            }


            // =========================================
            // SAVE EMAIL
            // =========================================

            sessionStorage.setItem(
                "resetEmail",
                loginEmail.trim()
            );


            // =========================================
            // SAVE RESET TOKEN
            // =========================================

            sessionStorage.setItem(
                "resetToken",
                resetToken
            );


            // =========================================
            // SUCCESS
            // =========================================

            setSuccess(
                "Email verified successfully. Redirecting to reset password..."
            );


            // =========================================
            // GO TO RESET PASSWORD
            // =========================================

            setTimeout(() => {

                navigate(
                    "/reset-password"
                );

            }, 1200);


        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );


            let message =
                "Unable to verify email. Please try again.";


            if (
                typeof error.response?.data ===
                "string"
            ) {

                message =
                    error.response.data;

            }

            else if (
                error.response?.data?.message
            ) {

                message =
                    error.response.data.message;

            }


            setError(message);


        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // RETURN
    // =========================================

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

                        Forgot Password

                    </h1>


                    <p>

                        Verify your hospital account email

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
                    SUCCESS
                ================================= */}

                {success && (

                    <div className="auth-success">

                        ✓ {success}

                    </div>

                )}


                {/* =================================
                    INFORMATION
                ================================= */}

                <div className="auth-info">

                    Enter your login email to verify your
                    account and continue to reset your password.

                </div>


                {/* =================================
                    FORM
                ================================= */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================
                        EMAIL
                    ================================= */}

                    <div className="form-group">

                        <label htmlFor="loginEmail">

                            Login Email

                        </label>


                        <input
                            id="loginEmail"
                            type="email"
                            name="loginEmail"
                            placeholder="Enter your login email"
                            value={loginEmail}
                            onChange={(e) => {

                                setLoginEmail(
                                    e.target.value
                                );

                                setError("");
                                setSuccess("");

                            }}
                            autoComplete="email"
                        />

                    </div>


                    {/* =================================
                        VERIFY EMAIL BUTTON
                    ================================= */}

                    <button
                        type="submit"
                        className="auth-primary-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Verifying..."
                            : "Verify Email"
                        }

                    </button>

                </form>


                {/* =================================
                    BACK TO LOGIN
                ================================= */}

                <div className="auth-divider">

                    <span>

                        Remember your password?

                    </span>

                </div>


                <button
                    type="button"
                    className="auth-secondary-button"
                    onClick={() => {

                        sessionStorage.removeItem(
                            "resetEmail"
                        );

                        sessionStorage.removeItem(
                            "resetToken"
                        );

                        navigate("/");

                    }}
                >

                    Back to Login

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


export default ForgotPassword;