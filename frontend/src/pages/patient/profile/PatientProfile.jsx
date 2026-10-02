import React, { useEffect, useState } from "react";

import api from "../../../services/api";

import "../../../styles/profile.css";

function PatientProfile() {

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


    // =====================================================
    // GET PROFILE
    // =====================================================

    const fetchProfile = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await api.get(
                    "/patient/profile"
                );

            console.log(
                "Patient profile response:",
                response.data
            );

            setProfile(
                response.data || null
            );

        } catch (error) {

            console.error(
                "Error loading patient profile:",
                error
            );

            setProfile(null);

            setError(

                error.response?.data?.message ||

                (
                    typeof error.response?.data === "string"
                        ? error.response.data
                        : "Unable to load profile."
                )
            );

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

            [name]:
                name === "age"
                    ? value === ""
                        ? ""
                        : Number(value)
                    : value

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

            setError(
                "Profile information is not available."
            );

            return;
        }


        try {

            setSaving(true);

            const requestData = {

                patientName:
                    profile.patientName || "",

                age:
                    profile.age || null,

                gender:
                    profile.gender || "",

                phone:
                    profile.phone || "",

                email:
                    profile.email || "",

                address:
                    profile.address || "",

                disease:
                    profile.disease || ""

            };


            console.log(
                "Updating patient profile:",
                requestData
            );


            const response =
                await api.put(
                    "/patient/profile",
                    requestData
                );


            console.log(
                "Update response:",
                response.data
            );


            // ---------------------------------------------
            // Backend response:
            //
            // {
            //   message: "...",
            //   patient: {...}
            // }
            // ---------------------------------------------

            if (response.data?.patient) {

                setProfile(
                    response.data.patient
                );

            }


            setSuccess(

                response.data?.message ||
                "Profile updated successfully."

            );

        } catch (error) {

            console.error(
                "Update patient profile error:",
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

                        <span className="profile-page-label">
                            PATIENT PORTAL
                        </span>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            View and manage your personal information.
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
    // MAIN PROFILE PAGE
    // =====================================================

    return (

        <div className="page-container">

            <div className="profile-page">


                {/* =========================================
                    PAGE HEADER
                ========================================== */}

                <div className="profile-page-header">

                    

                    <h1>
                        My Profile
                    </h1>

                   

                </div>


                {/* =========================================
                    ERROR
                ========================================== */}

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
                ========================================== */}

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
                ========================================== */}

                <div className="profile-card">


                    {/* PROFILE HEADER */}

                    <div className="profile-card-header">

                        <div className="profile-avatar">
                            🧑
                        </div>


                        <div className="profile-basic-info">

                            <h2>

                                {profile.patientName ||
                                    "Patient"}

                            </h2>

                            <p>
                                Patient Profile
                            </p>

                            <span className="profile-role">
                                PATIENT
                            </span>

                        </div>

                    </div>


                    {/* =====================================
                        FORM AREA
                    ====================================== */}

                    <div className="profile-form-area">

                        <div className="profile-form-title">

                            <h3>
                                Personal Information
                            </h3>

                            <p>
                                Update your personal and healthcare information.
                            </p>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="profile-form-grid">


                                {/* PATIENT NAME */}

                                <div className="profile-form-group">

                                    <label htmlFor="patient-name">
                                        Patient Name
                                    </label>

                                    <input
                                        id="patient-name"
                                        type="text"
                                        name="patientName"
                                        value={
                                            profile.patientName || ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter your name"
                                    />

                                </div>


                                {/* EMAIL */}

                                <div className="profile-form-group">

                                    <label htmlFor="patient-email">
                                        Email
                                    </label>

                                    <input
                                        id="patient-email"
                                        type="email"
                                        name="email"
                                        value={
                                            profile.email || ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter email"
                                    />

                                </div>


                                {/* PHONE */}

                                <div className="profile-form-group">

                                    <label htmlFor="patient-phone">
                                        Phone
                                    </label>

                                    <input
                                        id="patient-phone"
                                        type="tel"
                                        name="phone"
                                        value={
                                            profile.phone || ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter phone number"
                                    />

                                </div>


                                {/* AGE */}

                                <div className="profile-form-group">

                                    <label htmlFor="patient-age">
                                        Age
                                    </label>

                                    <input
                                        id="patient-age"
                                        type="number"
                                        name="age"
                                        min="1"
                                        max="120"
                                        value={
                                            profile.age ?? ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter age"
                                    />

                                </div>


                                {/* GENDER */}

                                <div className="profile-form-group">

                                    <label htmlFor="patient-gender">
                                        Gender
                                    </label>

                                    <select
                                        id="patient-gender"
                                        name="gender"
                                        value={
                                            profile.gender || ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="">
                                            Select Gender
                                        </option>

                                        <option value="MALE">
                                            Male
                                        </option>

                                        <option value="FEMALE">
                                            Female
                                        </option>

                                        <option value="OTHER">
                                            Other
                                        </option>

                                    </select>

                                </div>


                                {/* DISEASE */}

                                <div className="profile-form-group full-width">

                                    <label htmlFor="disease">
                                        Disease / Health Problem
                                    </label>

                                    <input
                                        id="disease"
                                        type="text"
                                        name="disease"
                                        value={
                                            profile.disease || ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter disease or health problem"
                                    />

                                </div>


                                {/* ADDRESS */}

                                <div className="profile-form-group full-width">

                                    <label htmlFor="patient-address">
                                        Address
                                    </label>

                                    <textarea
                                        id="patient-address"
                                        name="address"
                                        rows="4"
                                        value={
                                            profile.address || ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter your address"
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
                                        : "Save Changes"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default PatientProfile;