import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import DoctorManagementService from "../../../services/DoctorManagementService";
import DepartmentService from "../../../services/DepartmentService";

import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";


function EditDoctor() {

    const navigate = useNavigate();

    const { id } = useParams();


    const [departments, setDepartments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const [formData, setFormData] =
        useState({
            doctorName: "",
            specialization: "",
            email: "",
            phone: "",
            departmentId: ""
        });


    /* =========================================
       LOAD DOCTOR + DEPARTMENTS
    ========================================= */

    const loadData = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const [
                doctorResponse,
                departmentResponse
            ] = await Promise.all([

                DoctorManagementService.getDoctorById(id),

                DepartmentService.getAllDepartments()

            ]);


            const doctor =
                doctorResponse?.data ||
                doctorResponse;


            const departmentData =
                departmentResponse?.data ||
                departmentResponse ||
                [];


            setFormData({

                doctorName:
                    doctor?.doctorName || "",

                specialization:
                    doctor?.specialization || "",

                email:
                    doctor?.email || "",

                phone:
                    doctor?.phone || "",

                departmentId:
                    doctor?.department?.id ||
                    doctor?.departmentId ||
                    ""

            });


            setDepartments(
                Array.isArray(departmentData)
                    ? departmentData
                    : []
            );


        } catch (error) {

            console.error(
                "Load doctor error:",
                error
            );


            setError(
                error?.response?.data?.message ||
                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to load doctor information."
                )
            );

        } finally {

            setLoading(false);

        }

    }, [id]);


    /* =========================================
       LOAD DATA WHEN ID CHANGES
    ========================================= */

    useEffect(() => {

        loadData();

    }, [
        loadData
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
       VALIDATION
    ========================================= */

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


        return null;

    };


    /* =========================================
       UPDATE DOCTOR
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
                Number(
                    formData.departmentId
                )

        };


        try {

            setSaving(true);


            await DoctorManagementService.updateDoctor(
                id,
                requestData
            );


            setSuccess(
                "Doctor updated successfully."
            );


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
                "Update doctor error:",
                error
            );


            setError(
                error?.response?.data?.message ||
                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to update doctor."
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
            "/admin/doctors"
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
                HEADER
            ================================= */}

            <PageHeader
                title="Edit Doctor"
                subtitle="Update doctor professional information."
            />


            {/* =================================
                ERROR
            ================================= */}

            {error && (

                <div className="page-error">

                    ⚠️ {error}

                </div>

            )}


            {/* =================================
                SUCCESS
            ================================= */}

            {success && (

                <div className="page-success">

                    ✓ {success}

                </div>

            )}


            {/* =================================
                FORM CARD
            ================================= */}

            <div className="form-card">


                {/* =================================
                    DOCTOR INFORMATION
                ================================= */}

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
                                Update the doctor's professional details.
                            </p>

                        </div>


                    </div>


                    <form
                        onSubmit={handleSubmit}
                    >


                        <div className="form-grid">


                            {/* DOCTOR NAME */}

                            <div className="form-group">

                                <label
                                    htmlFor="doctorName"
                                >

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
                                />

                            </div>


                            {/* SPECIALIZATION */}

                            <div className="form-group">

                                <label
                                    htmlFor="specialization"
                                >

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
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="form-group">

                                <label
                                    htmlFor="email"
                                >

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
                                />

                            </div>


                            {/* PHONE */}

                            <div className="form-group">

                                <label
                                    htmlFor="phone"
                                >

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
                                />

                            </div>


                            {/* DEPARTMENT */}

                            <div className="form-group form-full-width">

                                <label
                                    htmlFor="departmentId"
                                >

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


                        {/* =================================
                            ACTIONS
                        ================================= */}

                        <div className="form-actions">


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


                            <button
                                type="submit"
                                className="primary-button"
                                disabled={saving}
                            >

                                {saving

                                    ? "Updating..."

                                    : "✓ Update Doctor"

                                }

                            </button>


                        </div>


                    </form>


                </div>


            </div>


        </div>

    );

}


export default EditDoctor;