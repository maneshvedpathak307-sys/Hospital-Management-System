import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import "../../styles/auth.css";


function ResetPassword() {

    const navigate = useNavigate();


    // =========================================
    // GET VERIFIED EMAIL
    // =========================================

    const resetEmail =
        sessionStorage.getItem("resetEmail") || "";


    // =========================================
    // GET RESET TOKEN
    // =========================================

    const resetToken =
        sessionStorage.getItem("resetToken") || "";


    // =========================================
    // FORM DATA
    // =========================================

    const [
        formData,
        setFormData
    ] = useState({

        newPassword: "",

        confirmPassword: ""

    });


    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        success,
        setSuccess
    ] = useState("");


    // =========================================
    // INPUT CHANGE
    // =========================================

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

        setSuccess("");

    };


    // =========================================
    // RESET PASSWORD
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setSuccess("");


        // =========================================
        // CHECK EMAIL
        // =========================================

        if (!resetEmail) {

            setError(
                "Password reset session has expired. Please start again."
            );

            return;
        }


        // =========================================
        // CHECK RESET TOKEN
        // =========================================

        if (!resetToken) {

            setError(
                "Password reset session has expired. Please start again."
            );

            return;
        }


        // =========================================
        // NEW PASSWORD VALIDATION
        // =========================================

        if (!formData.newPassword) {

            setError(
                "New password is required."
            );

            return;
        }


        // =========================================
        // CONFIRM PASSWORD VALIDATION
        // =========================================

        if (!formData.confirmPassword) {

            setError(
                "Please confirm your new password."
            );

            return;
        }


        // =========================================
        // PASSWORD MATCH
        // =========================================

        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        // =========================================
        // PASSWORD LENGTH
        // =========================================

        if (
            formData.newPassword.length < 6
        ) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        try {

            setLoading(true);


            // =========================================
            // RESET PASSWORD API
            // =========================================

            const response =
                await api.post(
                    "/auth/reset-password",
                    {
                        loginEmail:
                            resetEmail,

                        token:
                            resetToken,

                        newPassword:
                            formData.newPassword
                    }
                );


            console.log(
                "Reset password response:",
                response.data
            );


            // =========================================
            // SUCCESS
            // =========================================

            setSuccess(
                typeof response.data === "string"
                    ? response.data
                    : response.data?.message ||
                      "Password updated successfully."
            );


            // =========================================
            // CLEAR RESET SESSION
            // =========================================

            sessionStorage.removeItem(
                "resetEmail"
            );

            sessionStorage.removeItem(
                "resetToken"
            );


            // =========================================
            // GO TO LOGIN
            // =========================================

            setTimeout(() => {

                navigate("/");

            }, 1500);


        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );


            let message =
                "Unable to reset password. Please try again.";


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
    // BACK TO LOGIN
    // =========================================

    const handleBackToLogin = () => {

        sessionStorage.removeItem(
            "resetEmail"
        );

        sessionStorage.removeItem(
            "resetToken"
        );

        navigate("/");

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

                        Create New Password

                    </h1>


                    <p>

                        Create a new password for your account

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
                    ACCOUNT INFORMATION
                ================================= */}

                <div className="auth-info">

                    <strong>

                        Verified Account

                    </strong>


                    <br />


                    {resetEmail ||
                        "No verified account found."}

                </div>


                {/* =================================
                    FORM
                ================================= */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================
                        NEW PASSWORD
                    ================================= */}

                    <div className="form-group">

                        <label htmlFor="newPassword">

                            New Password

                        </label>


                        <input
                            id="newPassword"
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password"
                            value={
                                formData.newPassword
                            }
                            onChange={
                                handleChange
                            }
                            autoComplete="new-password"
                        />

                    </div>


                    {/* =================================
                        CONFIRM PASSWORD
                    ================================= */}

                    <div className="form-group">

                        <label htmlFor="confirmPassword">

                            Confirm Password

                        </label>


                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            value={
                                formData.confirmPassword
                            }
                            onChange={
                                handleChange
                            }
                            autoComplete="new-password"
                        />

                    </div>


                    {/* =================================
                        PASSWORD HINT
                    ================================= */}

                    <div className="password-hint">

                        Password must be at least 6 characters.

                    </div>


                    {/* =================================
                        UPDATE PASSWORD BUTTON
                    ================================= */}

                    <button
                        type="submit"
                        className="auth-primary-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Updating..."
                            : "Update Password"
                        }

                    </button>

                </form>


                {/* =================================
                    BACK TO LOGIN
                ================================= */}

                <button
                    type="button"
                    className="auth-secondary-button"
                    onClick={
                        handleBackToLogin
                    }
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


export default ResetPassword;