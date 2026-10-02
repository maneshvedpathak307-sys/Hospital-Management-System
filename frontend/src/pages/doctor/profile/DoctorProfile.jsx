import React, { useEffect, useState } from "react";

import api from "../../../services/api";

import "../../../styles/profile.css";


function DoctorProfile() {

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    useEffect(() => {

        fetchProfile();

    }, []);


    const fetchProfile = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await api.get(
                    "/doctor/profile"
                );

            console.log(
                "Doctor profile:",
                response.data
            );

            setProfile(
                response.data || null
            );

        } catch (error) {

            console.error(
                "Error loading doctor profile:",
                error
            );

            setError(

                error.response?.data?.message ||

                (
                    typeof error.response?.data === "string"

                        ? error.response.data

                        : "Unable to load profile."
                )

            );

            setProfile(null);

        } finally {

            setLoading(false);

        }

    };


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


        if (!profile) {

            return;

        }


        try {

            setSaving(true);


            const requestData = {

                doctorName:
                    profile.doctorName,

                email:
                    profile.email,

                phone:
                    profile.phone,

                specialization:
                    profile.specialization,

                experience:
                    profile.experience,

                qualification:
                    profile.qualification

            };


            const response =
                await api.put(
                    "/doctor/profile",
                    requestData
                );


            setProfile(

                response.data?.doctor ||

                response.data ||

                profile

            );


            setSuccess(

                response.data?.message ||

                "Profile updated successfully."

            );

        } catch (error) {

            console.error(
                "Update doctor profile error:",
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

                        <div className="profile-loading-spinner"></div>

                        <p>
                            Loading profile...
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // PROFILE NOT FOUND
    // =====================================================

    if (!profile) {

        return (

            <div className="page-container">

                <div className="profile-page">

                    <div className="profile-page-header">

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            View and manage your professional information.
                        </p>

                    </div>


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

                </div>

            </div>

        );

    }


    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (

        <div className="page-container">

            <div className="profile-page">


                {/* =========================================
                    PAGE HEADER
                ========================================= */}

                <div className="profile-page-header">

                    <h1>
                        My Profile
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

                            👨‍⚕️

                        </div>


                        <div className="profile-basic-info">

                            <h2>

                                {
                                    profile.doctorName ||
                                    "Doctor"
                                }

                            </h2>


                            <p>

                                {
                                    profile.specialization ||
                                    "Medical Professional"
                                }

                            </p>


                            <span className="profile-role">

                                DOCTOR

                            </span>

                        </div>

                    </div>


                    {/* =====================================
                        FORM AREA
                    ====================================== */}

                    <div className="profile-form-area">


                        <div className="profile-form-title">

                            <h3>
                                Professional Information
                            </h3>

                            <p>
                                Update your professional information.
                            </p>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                        >


                            <div className="profile-form-grid">


                                {/* =================================
                                    DOCTOR NAME
                                ================================== */}

                                <div className="profile-form-group">

                                    <label htmlFor="doctor-name">

                                        Doctor Name

                                    </label>


                                    <input
                                        id="doctor-name"
                                        type="text"
                                        name="doctorName"
                                        value={
                                            profile.doctorName ||
                                            ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter doctor name"
                                    />

                                </div>


                                {/* =================================
                                    EMAIL
                                ================================== */}

                                <div className="profile-form-group">

                                    <label htmlFor="doctor-email">

                                        Email

                                    </label>


                                    <input
                                        id="doctor-email"
                                        type="email"
                                        name="email"
                                        value={
                                            profile.email ||
                                            ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter email"
                                    />

                                </div>


                                {/* =================================
                                    PHONE
                                ================================== */}

                                <div className="profile-form-group">

                                    <label htmlFor="doctor-phone">

                                        Phone

                                    </label>


                                    <input
                                        id="doctor-phone"
                                        type="tel"
                                        name="phone"
                                        value={
                                            profile.phone ||
                                            ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter phone number"
                                    />

                                </div>


                                {/* =================================
                                    SPECIALIZATION
                                ================================== */}

                                <div className="profile-form-group">

                                    <label htmlFor="specialization">

                                        Specialization

                                    </label>


                                    <input
                                        id="specialization"
                                        type="text"
                                        name="specialization"
                                        value={
                                            profile.specialization ||
                                            ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Cardiologist"
                                    />

                                </div>


                                {/* =================================
                                    DEPARTMENT
                                ================================== */}

                                <div className="profile-form-group">

                                    <label htmlFor="department">

                                        Department

                                    </label>


                                    <input
                                        id="department"
                                        type="text"
                                        name="departmentName"
                                        value={
                                            profile.departmentName ||
                                            ""
                                        }
                                        readOnly
                                        placeholder="Department"
                                    />

                                </div>


                                {/* =================================
                                    EXPERIENCE
                                ================================== */}

                                <div className="profile-form-group">

                                    <label htmlFor="experience">

                                        Experience

                                    </label>


                                    <input
                                        id="experience"
                                        type="text"
                                        name="experience"
                                        value={
                                            profile.experience ||
                                            ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. 8 years"
                                    />

                                </div>


                                {/* =================================
                                    QUALIFICATION
                                ================================== */}

                                <div className="profile-form-group full-width">

                                    <label htmlFor="qualification">

                                        Qualification

                                    </label>


                                    <input
                                        id="qualification"
                                        type="text"
                                        name="qualification"
                                        value={
                                            profile.qualification ||
                                            ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. MBBS, MD"
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

                                    {
                                        saving
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

export default DoctorProfile;