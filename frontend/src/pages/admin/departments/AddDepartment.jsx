import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import DepartmentService
    from "../../../services/DepartmentService";

import Loading
    from "../../../components/common/Loading";

import "../../../styles/forms.css";


function AddDepartment() {

    const navigate = useNavigate();

    const { id } = useParams();


    /* =========================================
       EDIT MODE
    ========================================= */

    const editing =
        Boolean(id);


    /* =========================================
       STATES
    ========================================= */

    const [formData, setFormData] =
        useState({
            departmentName: "",
            description: ""
        });

    const [loading, setLoading] =
        useState(editing);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /* =========================================
       LOAD DEPARTMENT FOR EDIT
    ========================================= */

    const loadDepartment = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await DepartmentService
                    .getDepartmentById(id);

            const department =
                response?.data ||
                response;


            setFormData({

                departmentName:
                    department?.departmentName || "",

                description:
                    department?.description || ""

            });

        } catch (error) {

            console.error(
                "Load department error:",
                error
            );

            setError(

                error?.response?.data?.message ||

                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to load department."
                )

            );

        } finally {

            setLoading(false);

        }

    }, [id]);


    /* =========================================
       LOAD DEPARTMENT WHEN EDITING
    ========================================= */

    useEffect(() => {

        if (editing) {

            loadDepartment();

        }

    }, [
        editing,
        loadDepartment
    ]);


    /* =========================================
       INPUT CHANGE
    ========================================= */

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


    /* =========================================
       SUBMIT
    ========================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        /* =====================================
           VALIDATION
        ===================================== */

        if (
            !formData.departmentName.trim()
        ) {

            setError(
                "Please enter department name."
            );

            return;

        }


        /* =====================================
           REQUEST DATA
        ===================================== */

        const requestData = {

            departmentName:
                formData.departmentName.trim(),

            description:
                formData.description.trim()

        };


        try {

            setSaving(true);


            /* =================================
               UPDATE
            ================================= */

            if (editing) {

                await DepartmentService
                    .updateDepartment(
                        id,
                        requestData
                    );


                setSuccess(
                    "Department updated successfully."
                );

            }


            /* =================================
               ADD
            ================================= */

            else {

                await DepartmentService
                    .addDepartment(
                        requestData
                    );


                setSuccess(
                    "Department added successfully."
                );

            }


            /* =================================
               RETURN TO LIST
            ================================= */

            setTimeout(() => {

                navigate(
                    "/admin/departments"
                );

            }, 800);


        } catch (error) {

            console.error(
                "Save department error:",
                error
            );

            setError(

                error?.response?.data?.message ||

                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to save department."
                )

            );

        } finally {

            setSaving(false);

        }

    };


    /* =========================================
       CANCEL
    ========================================= */

    const handleCancel = () => {

        navigate(
            "/admin/departments"
        );

    };


    /* =========================================
       BACK TO DEPARTMENTS
    ========================================= */

    const handleBackToDepartments = () => {

        navigate(
            "/admin/departments"
        );

    };


    /* =========================================
       LOADING
    ========================================= */

    if (loading) {

        return (

            <div className="page-container">

                <Loading />

            </div>

        );

    }


    /* =========================================
       PAGE
    ========================================= */

    return (

        <div className="page-container">


            {/* =================================
                PAGE HEADER
            ================================= */}

            <div
                className="management-header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "24px"
                }}
            >


                {/* =================================
                    LEFT SIDE
                ================================= */}

                <div>

                    <h2>

                        {
                            editing
                                ? "Edit Department"
                                : "Add Department"
                        }

                    </h2>


                </div>


                {/* =================================
                    RIGHT SIDE
                ================================= */}

                <button
                    type="button"
                    className="secondary-button"
                    onClick={
                        handleBackToDepartments
                    }
                    disabled={saving}
                >

                    ← Back to Departments

                </button>


            </div>


            {/* =================================
                SUCCESS
            ================================= */}

            {success && (

                <div className="page-success">

                    ✓ {success}

                </div>

            )}


            {/* =================================
                ERROR
            ================================= */}

            {error && (

                <div className="page-error">

                    ⚠️ {error}

                </div>

            )}


            {/* =================================
                FORM CARD
            ================================= */}

            <div className="form-card">


                <div className="form-section">


                    {/* =================================
                        FORM HEADER
                    ================================= */}

                    <div className="form-section-header">


                        <div className="form-section-icon">

                            🏢

                        </div>


                        <div>

                            <h3>
                                Department Information
                            </h3>

                            <p>
                                Enter the department details.
                            </p>

                        </div>


                    </div>


                    {/* =================================
                        FORM
                    ================================= */}

                    <form
                        onSubmit={handleSubmit}
                    >


                        <div className="form-grid">


                            {/* =================================
                                DEPARTMENT NAME
                            ================================= */}

                            <div className="form-group">

                                <label
                                    htmlFor="departmentName"
                                >

                                    Department Name

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="departmentName"
                                    type="text"
                                    name="departmentName"
                                    value={
                                        formData.departmentName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Cardiology"
                                />

                            </div>


                            {/* =================================
                                DESCRIPTION
                            ================================= */}

                            <div className="form-group">

                                <label
                                    htmlFor="description"
                                >

                                    Description

                                </label>


                                <input
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Heart and cardiovascular care"
                                />

                            </div>


                        </div>


                        {/* =================================
                            FORM BUTTONS
                        ================================= */}

                        <div className="form-actions">


                            {/* CANCEL */}

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={
                                    handleCancel
                                }
                                disabled={saving}
                            >

                                Cancel

                            </button>


                            {/* ADD / UPDATE */}

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={saving}
                            >

                                {saving

                                    ? "Saving..."

                                    : editing

                                        ? "✓ Update Department"

                                        : "✓ Add Department"

                                }

                            </button>


                        </div>


                    </form>


                </div>


            </div>


        </div>

    );

}


export default AddDepartment;