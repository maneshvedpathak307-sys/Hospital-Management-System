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


function Register() {

    const navigate = useNavigate();

    const {
        register,
        loading
    } = useAuth();


    const [
        formData,
        setFormData
    ] = useState({

        patientName: "",

        age: "",

        gender: "",

        phone: "",

        email: "",

        address: "",

        disease: "",

        loginEmail: "",

        password: ""

    });


    const [
        error,
        setError
    ] = useState("");


    const [
        success,
        setSuccess
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

        setSuccess("");

    };


    /* =========================================
       VALIDATION
    ========================================= */

    const validateForm = () => {

        if (
            !formData.patientName.trim()
        ) {

            return "Patient name is required.";

        }


        if (!formData.age) {

            return "Age is required.";

        }


        if (
            Number(formData.age) < 1 ||
            Number(formData.age) > 120
        ) {

            return "Age must be between 1 and 120.";

        }


        if (!formData.gender) {

            return "Gender is required.";

        }


        if (
            !formData.phone.trim()
        ) {

            return "Phone number is required.";

        }


        if (
            !formData.email.trim()
        ) {

            return "Patient email is required.";

        }


        if (
            !formData.address.trim()
        ) {

            return "Address is required.";

        }


        if (
            !formData.loginEmail.trim()
        ) {

            return "Login email is required.";

        }


        if (
            !formData.password.trim()
        ) {

            return "Password is required.";

        }


        if (
            formData.password.length < 6
        ) {

            return "Password must be at least 6 characters.";

        }


        return null;

    };


    /* =========================================
       REGISTER
    ========================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setSuccess("");


        const validationError =
            validateForm();


        if (validationError) {

            setError(
                validationError
            );

            return;

        }


        /* =====================================
           CREATE REQUEST DATA
        ===================================== */

        const patientData = {

            patientName:
                formData.patientName.trim(),

            age:
                Number(formData.age),

            gender:
                formData.gender,

            phone:
                formData.phone.trim(),

            email:
                formData.email.trim(),

            address:
                formData.address.trim(),

            disease:
                formData.disease.trim(),

            loginEmail:
                formData.loginEmail.trim(),

            password:
                formData.password

        };


        console.log(
            "Patient registration data:",
            patientData
        );


        /* =====================================
           BACKEND REGISTRATION
        ===================================== */

        const result =
            await register(
                patientData
            );


        if (!result.success) {

            setError(
                result.message ||
                "Patient registration failed."
            );

            return;

        }


        /* =====================================
           SUCCESS
        ===================================== */

        setSuccess(
            result.message ||
            "Patient registration successful."
        );


        setTimeout(() => {

            navigate(
                "/",
                {
                    replace: true
                }
            );

        }, 1500);

    };


    /* =========================================
       RETURN
    ========================================= */

    return (

        <div className="auth-page">


            <div
                className="auth-card auth-register-card"
            >


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

                        Create Patient Account

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
                    FORM
                ================================= */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================
                        PATIENT INFORMATION
                    ================================= */}

                    <div className="auth-section-title">

                        Patient Information

                    </div>


                    {/* PATIENT NAME */}

                    <div className="form-group">

                        <label
                            htmlFor="patientName"
                        >

                            Patient Name *

                        </label>


                        <input
                            id="patientName"
                            type="text"
                            name="patientName"
                            placeholder="Enter patient name"
                            value={
                                formData.patientName
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>


                    {/* AGE + GENDER */}

                    <div className="auth-two-column">


                        <div className="form-group">

                            <label htmlFor="age">

                                Age *

                            </label>


                            <input
                                id="age"
                                type="number"
                                name="age"
                                min="1"
                                max="120"
                                placeholder="Age"
                                value={
                                    formData.age
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="gender">

                                Gender *

                            </label>


                            <select
                                id="gender"
                                name="gender"
                                value={
                                    formData.gender
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

                    </div>


                    {/* PHONE */}

                    <div className="form-group">

                        <label htmlFor="phone">

                            Phone Number *

                        </label>


                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            placeholder="Enter phone number"
                            value={
                                formData.phone
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>


                    {/* PATIENT EMAIL */}

                    <div className="form-group">

                        <label htmlFor="email">

                            Patient Email *

                        </label>


                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter patient email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>


                    {/* ADDRESS */}

                    <div className="form-group">

                        <label htmlFor="address">

                            Address *

                        </label>


                        <textarea
                            id="address"
                            name="address"
                            rows="3"
                            placeholder="Enter patient address"
                            value={
                                formData.address
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>


                    {/* DISEASE */}

                    <div className="form-group">

                        <label htmlFor="disease">

                            Disease

                        </label>


                        <input
                            id="disease"
                            type="text"
                            name="disease"
                            placeholder="Enter disease"
                            value={
                                formData.disease
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>


                    {/* =================================
                        LOGIN INFORMATION
                    ================================= */}

                    <div className="auth-section-title">

                        Login Information

                    </div>


                    {/* LOGIN EMAIL */}

                    <div className="form-group">

                        <label htmlFor="loginEmail">

                            Login Email *

                        </label>


                        <input
                            id="loginEmail"
                            type="email"
                            name="loginEmail"
                            placeholder="Enter login email"
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

                        <label htmlFor="password">

                            Password *

                        </label>


                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Create password"
                            value={
                                formData.password
                            }
                            onChange={
                                handleChange
                            }
                            autoComplete="new-password"
                        />

                    </div>


                    {/* =================================
                        REGISTER BUTTON
                    ================================= */}

                    <button
                        type="submit"
                        className="auth-primary-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Patient Account"
                        }

                    </button>

                </form>


                {/* =================================
                    LOGIN
                ================================= */}

                <div className="auth-divider">

                    <span>

                        Already have an account?

                    </span>

                </div>


                <button
                    type="button"
                    className="auth-secondary-button"
                    onClick={() =>
                        navigate("/")
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


export default Register;