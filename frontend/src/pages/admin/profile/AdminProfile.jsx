import React, { useEffect, useState } from "react";

import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

import "../../../styles/profile.css";


function AdminProfile() {

    const { user } = useAuth();


    // =====================================================
    // STATE
    // =====================================================

    const [profile, setProfile] = useState({

        email: "",
        role: "ADMIN"

    });


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    useEffect(() => {

        const loadProfile = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await api.get(
                        "/admin/profile"
                    );


                const data =
                    response.data || {};


                console.log(
                    "Admin profile:",
                    data
                );


                setProfile({

                    email:
                        data.email ||
                        data.loginEmail ||
                        user?.email ||
                        "",

                    role:
                        data.role ||
                        user?.role ||
                        "ADMIN"

                });


            } catch (error) {

                console.error(
                    "Admin profile loading error:",
                    error
                );


                setProfile({

                    email:
                        user?.email ||
                        "",

                    role:
                        user?.role ||
                        "ADMIN"

                });


                setError(

                    error.response?.data?.message ||

                    "Unable to load admin profile."

                );


            } finally {

                setLoading(false);

            }

        };


        loadProfile();

    }, [user]);


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setProfile((previous) => ({

            ...previous,

            [name]: value

        }));


        setError("");

        setSuccess("");

    };


    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        setError("");

        setSuccess("");


        if (!profile.email.trim()) {

            setError(
                "Email is required."
            );

            return;

        }


        try {

            setSaving(true);


            const response =
                await api.put(
                    "/admin/profile",
                    {
                        email:
                            profile.email.trim()
                    }
                );


            const updated =
                response.data || {};


            setProfile({

                email:
                    updated.email ||
                    updated.loginEmail ||
                    profile.email,

                role:
                    updated.role ||
                    profile.role

            });


            setSuccess(

                updated.message ||

                "Profile updated successfully."

            );


        } catch (error) {

            console.error(
                "Admin profile update error:",
                error
            );


            setError(

                error.response?.data?.message ||

                (
                    typeof error.response?.data === "string"

                        ? error.response.data

                        : "Unable to update profile."
                )

            );


        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="page-container">

                <div className="profile-page">

                    <div className="profile-loading">

                        <div className="profile-loading-spinner">
                        </div>

                        <p>
                            Loading profile...
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="page-container">

            <div className="profile-page">


                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="profile-page-header">

                    <h1>
                        Admin Profile
                    </h1>

                </div>


                {/* =========================================
                    ERROR
                ========================================= */}

                {error && (

                    <div className="profile-error">

                        <span className="profile-alert-icon">
                            ⚠️
                        </span>

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* =========================================
                    SUCCESS
                ========================================= */}

                {success && (

                    <div className="profile-success">

                        <span className="profile-alert-icon">
                            ✓
                        </span>

                        <span>
                            {success}
                        </span>

                    </div>

                )}


                {/* =========================================
                    PROFILE CARD
                ========================================= */}

                <div className="profile-card">


                    {/* =====================================
                        PROFILE HEADER
                    ====================================== */}

                    <div className="profile-card-header">

                        <div className="profile-avatar">

                            👨‍💼

                        </div>


                        <div className="profile-basic-info">

                            <h2>
                                Administrator
                            </h2>

                            <p>
                                Hospital Administrator
                            </p>

                            <span className="profile-role">
                                ADMINISTRATOR
                            </span>

                        </div>

                    </div>


                    {/* =====================================
                        FORM AREA
                    ====================================== */}

                    <div className="profile-form-area">

                        <div className="profile-form-title">

                            <h3>
                                Account Information
                            </h3>

                            <p>
                                Update your administrator account information.
                            </p>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="profile-form-grid">


                                {/* EMAIL */}

                                <div className="profile-form-group">

                                    <label htmlFor="admin-email">
                                        Email
                                    </label>

                                    <input
                                        id="admin-email"
                                        type="email"
                                        name="email"
                                        value={
                                            profile.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter your email"
                                    />

                                </div>


                                {/* ROLE */}

                                <div className="profile-form-group">

                                    <label htmlFor="admin-role">
                                        Role
                                    </label>

                                    <input
                                        id="admin-role"
                                        type="text"
                                        value="Administrator"
                                        disabled
                                    />

                                </div>

                            </div>


                            {/* =================================
                                SAVE BUTTON
                            ================================== */}

                            <div className="profile-form-actions">

                                <button
                                    type="submit"
                                    className="profile-save-button"
                                    disabled={saving}
                                >

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default AdminProfile;