import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import DoctorManagementService from "../../../services/DoctorManagementService";
import DepartmentService from "../../../services/DepartmentService";

import Loading from "../../../components/common/Loading";

import "../../../styles/forms.css";


function AddDoctor() {

    const navigate = useNavigate();


    // =====================================================
    // STATES
    // =====================================================

    const [departments, setDepartments] =
        useState([]);

    const [loadingDepartments, setLoadingDepartments] =
        useState(true);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({

        doctorName: "",
        specialization: "",
        email: "",
        phone: "",
        departmentId: "",
        loginEmail: "",
        password: ""

    });


    // =====================================================
    // LOAD DEPARTMENTS
    // =====================================================

    useEffect(() => {

        loadDepartments();

    }, []);


    const loadDepartments = async () => {

        try {

            setLoadingDepartments(true);

            setError("");


            const response =
                await DepartmentService.getAllDepartments();


            const data =
                response?.data ||
                response ||
                [];


            setDepartments(

                Array.isArray(data)
                    ? data
                    : []

            );

        } catch (error) {

            console.error(
                "Load departments error:",
                error
            );


            setError(

                error?.response?.data?.message ||

                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to load departments."
                )

            );

        } finally {

            setLoadingDepartments(false);

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


        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));


        setError("");
        setSuccess("");

    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {


        if (!formData.doctorName.trim()) {

            return "Please enter doctor name.";

        }


        if (!formData.specialization.trim()) {

            return "Please enter specialization.";

        }


        if (!formData.email.trim()) {

            return "Please enter professional email.";

        }


        if (!formData.phone.trim()) {

            return "Please enter phone number.";

        }


        if (!formData.departmentId) {

            return "Please select a department.";

        }


        if (!formData.loginEmail.trim()) {

            return "Please enter login email.";

        }


        if (!formData.password.trim()) {

            return "Please enter password.";

        }


        if (formData.password.length < 6) {

            return "Password must contain at least 6 characters.";

        }


        return null;

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        setError("");
        setSuccess("");


        // =================================================
        // VALIDATE
        // =================================================

        const validationError =
            validateForm();


        if (validationError) {

            setError(
                validationError
            );

            return;

        }


        // =================================================
        // REQUEST DATA
        // =================================================

        const requestData = {

            doctorName:
                formData.doctorName.trim(),

            specialization:
                formData.specialization.trim(),

            email:
                formData.email.trim(),

            phone:
                formData.phone.trim(),

            departmentId:
                Number(formData.departmentId),

            loginEmail:
                formData.loginEmail.trim(),

            password:
                formData.password

        };


        console.log(
            "Doctor request data:",
            requestData
        );


        // =================================================
        // CREATE DOCTOR
        // =================================================

        try {

            setLoading(true);


            /*
             * IMPORTANT:
             *
             * DoctorManagementService.js
             * has addDoctor(), not createDoctor().
             */

            const response =
                await DoctorManagementService.addDoctor(
                    requestData
                );


            console.log(
                "Doctor created successfully:",
                response
            );


            setSuccess(
                "Doctor created successfully."
            );


            // =================================================
            // REDIRECT
            // =================================================

            setTimeout(() => {

                navigate(
                    "/admin/doctors",
                    {
                        replace: true
                    }
                );

            }, 1200);


        } catch (error) {

            console.error(
                "Create doctor error:",
                error
            );


            setError(

                error?.response?.data?.message ||

                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to create doctor."
                )

            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {

        navigate(
            "/admin/doctors"
        );

    };


    // =====================================================
    // BACK TO DOCTORS
    // =====================================================

    const handleBackToDoctors = () => {

        navigate(
            "/admin/doctors"
        );

    };


    // =====================================================
    // LOADING DEPARTMENTS
    // =====================================================

    if (loadingDepartments) {

        return (

            <div className="page-container">

                <Loading />

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="page-container">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div
    className="management-header"
    style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        width: "100%",
        marginBottom: "24px"
    }}
>


                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div>

                    <h2>
                        Add Doctor
                    </h2>

                 

                </div>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <button
                    type="button"
                    className="secondary-button"
                    onClick={
                        handleBackToDoctors
                    }
                    disabled={loading}
                >

                    ← Back to Doctors

                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="page-error">

                    ⚠️ {error}

                </div>

            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <div className="page-success">

                    ✓ {success}

                </div>

            )}


            {/* =================================================
                FORM CARD
            ================================================= */}

            <div className="form-card">


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                >


                    {/* =================================================
                        DOCTOR INFORMATION
                    ================================================= */}

                    <div className="form-section">


                        <div className="form-section-header">

                            <div className="form-section-icon">

                                👨‍⚕️

                            </div>


                            <div>

                                <h3>
                                    Doctor Information
                                </h3>

                                <p>
                                    Enter the doctor's professional details.
                                </p>

                            </div>

                        </div>


                        <div className="form-grid">


                            {/* =================================================
                                DOCTOR NAME
                            ================================================= */}

                            <div className="form-group">

                                <label htmlFor="doctorName">

                                    Doctor Name

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="doctorName"
                                    type="text"
                                    name="doctorName"
                                    value={
                                        formData.doctorName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Dr. Priya Sharma"
                                    disabled={loading}
                                />

                            </div>


                            {/* =================================================
                                SPECIALIZATION
                            ================================================= */}

                            <div className="form-group">

                                <label htmlFor="specialization">

                                    Specialization

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="specialization"
                                    type="text"
                                    name="specialization"
                                    value={
                                        formData.specialization
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Cardiologist"
                                    disabled={loading}
                                />

                            </div>


                            {/* =================================================
                                PROFESSIONAL EMAIL
                            ================================================= */}

                            <div className="form-group">

                                <label htmlFor="email">

                                    Professional Email

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="doctor@hospital.com"
                                    disabled={loading}
                                />

                            </div>


                            {/* =================================================
                                PHONE
                            ================================================= */}

                            <div className="form-group">

                                <label htmlFor="phone">

                                    Phone

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="9876543210"
                                    disabled={loading}
                                />

                            </div>


                            {/* =================================================
                                DEPARTMENT
                            ================================================= */}

                            <div className="form-group form-full-width">

                                <label htmlFor="departmentId">

                                    Department

                                    <span>
                                        *
                                    </span>

                                </label>


                                <select
                                    id="departmentId"
                                    name="departmentId"
                                    value={
                                        formData.departmentId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                >

                                    <option value="">
                                        Select Department
                                    </option>


                                    {departments.map(
                                        (department) => (

                                            <option
                                                key={
                                                    department.id
                                                }
                                                value={
                                                    department.id
                                                }
                                            >

                                                {
                                                    department.departmentName
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        LOGIN INFORMATION
                    ================================================= */}

                    <div className="form-section">


                        <div className="form-section-header">

                            <div className="form-section-icon">

                                🔐

                            </div>


                            <div>

                                <h3>
                                    Doctor Login
                                </h3>

                                <p>
                                    Create login credentials for the doctor.
                                </p>

                            </div>

                        </div>


                        <div className="form-grid">


                            {/* =================================================
                                LOGIN EMAIL
                            ================================================= */}

                            <div className="form-group">

                                <label htmlFor="loginEmail">

                                    Login Email

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="loginEmail"
                                    type="email"
                                    name="loginEmail"
                                    value={
                                        formData.loginEmail
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="doctor@gmail.com"
                                    autoComplete="username"
                                    disabled={loading}
                                />

                            </div>


                            {/* =================================================
                                PASSWORD
                            ================================================= */}

                            <div className="form-group">

                                <label htmlFor="password">

                                    Password

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter password"
                                    autoComplete="new-password"
                                    disabled={loading}
                                />

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="form-actions">


                        {/* CANCEL */}

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={
                                handleCancel
                            }
                            disabled={loading}
                        >

                            Cancel

                        </button>


                        {/* CREATE */}

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >

                            {loading

                                ? "Creating..."

                                : "✓ Create Doctor"

                            }

                        </button>

                    </div>


                </form>

            </div>

        </div>

    );

}


export default AddDoctor;