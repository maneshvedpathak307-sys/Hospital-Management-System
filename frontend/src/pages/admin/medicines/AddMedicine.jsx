import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    createMedicine,
    getMedicineById,
    updateMedicine
} from "../../../services/MedicineService";

import Loading
    from "../../../components/common/Loading";

import "../../../styles/forms.css";


function AddMedicine() {

    const navigate = useNavigate();

    const { id } = useParams();

    const editing =
        Boolean(id);


    /* =========================================
       EMPTY FORM
    ========================================= */

    const emptyForm = {

        medicineName: "",
        genericName: "",
        category: "",
        dosage: "",
        stock: "",
        expiryDate: "",
        description: ""

    };


    /* =========================================
       STATES
    ========================================= */

    const [formData, setFormData] =
        useState(emptyForm);

    const [loading, setLoading] =
        useState(editing);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /* =========================================
       LOAD MEDICINE FOR EDIT
    ========================================= */

    const loadMedicine = useCallback(async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getMedicineById(id);


            const medicine =
                response?.data ||
                response;


            setFormData({

                medicineName:
                    medicine?.medicineName || "",

                genericName:
                    medicine?.genericName || "",

                category:
                    medicine?.category || "",

                dosage:
                    medicine?.dosage || "",

                stock:
                    medicine?.stock ?? "",

                expiryDate:
                    medicine?.expiryDate || "",

                description:
                    medicine?.description || ""

            });


        } catch (error) {

            console.error(
                "Load medicine error:",
                error
            );


            setError(

                error?.response?.data?.message ||

                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to load medicine."
                )

            );


        } finally {

            setLoading(false);

        }

    }, [id]);


    /* =========================================
       LOAD MEDICINE WHEN EDITING
    ========================================= */

    useEffect(() => {

        if (editing) {

            loadMedicine();

        }

    }, [
        editing,
        loadMedicine
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
            !formData.medicineName.trim()
        ) {

            setError(
                "Please enter medicine name."
            );

            return;

        }


        if (
            !formData.genericName.trim()
        ) {

            setError(
                "Please enter generic name."
            );

            return;

        }


        if (
            !formData.category.trim()
        ) {

            setError(
                "Please enter medicine category."
            );

            return;

        }


        if (
            !formData.dosage.trim()
        ) {

            setError(
                "Please enter dosage."
            );

            return;

        }


        if (
            formData.stock === "" ||
            Number(formData.stock) < 0
        ) {

            setError(
                "Please enter a valid stock."
            );

            return;

        }


        if (!formData.expiryDate) {

            setError(
                "Please select expiry date."
            );

            return;

        }


        /* =====================================
           REQUEST DATA
        ===================================== */

        const requestData = {

            medicineName:
                formData.medicineName.trim(),

            genericName:
                formData.genericName.trim(),

            category:
                formData.category.trim(),

            dosage:
                formData.dosage.trim(),

            stock:
                Number(formData.stock),

            expiryDate:
                formData.expiryDate,

            description:
                formData.description.trim()

        };


        try {

            setSaving(true);


            /* =================================
               UPDATE MEDICINE
            ================================= */

            if (editing) {

                await updateMedicine(
                    id,
                    requestData
                );


                setSuccess(
                    "Medicine updated successfully."
                );

            }


            /* =================================
               ADD MEDICINE
            ================================= */

            else {

                await createMedicine(
                    requestData
                );


                setSuccess(
                    "Medicine added successfully."
                );

            }


            /* =================================
               RETURN TO MEDICINES
            ================================= */

            setTimeout(() => {

                navigate(
                    "/admin/medicines"
                );

            }, 800);


        } catch (error) {

            console.error(
                "Save medicine error:",
                error
            );


            setError(

                error?.response?.data?.message ||

                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to save medicine."
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
            "/admin/medicines"
        );

    };


    /* =========================================
       BACK TO MEDICINES
    ========================================= */

    const handleBackToMedicines = () => {

        navigate(
            "/admin/medicines"
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
                    width: "100%",
                    marginBottom: "24px"
                }}
            >


                {/* =================================
                    LEFT
                ================================= */}

                <div>

                    <h2>

                        {
                            editing
                                ? "Edit Medicine"
                                : "Add Medicine"
                        }

                    </h2>

                </div>


                {/* =================================
                    RIGHT
                ================================= */}

                <button
                    type="button"
                    className="secondary-button"
                    onClick={
                        handleBackToMedicines
                    }
                    disabled={saving}
                >

                    ← Back to Medicines

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

                            💊

                        </div>


                        <div>

                            <h3>
                                Medicine Information
                            </h3>

                            <p>
                                Enter the medicine's details.
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
                                MEDICINE NAME
                            ================================= */}

                            <div className="form-group">

                                <label
                                    htmlFor="medicineName"
                                >

                                    Medicine Name

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="medicineName"
                                    type="text"
                                    name="medicineName"
                                    value={
                                        formData.medicineName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Paracetamol 500mg"
                                />

                            </div>


                            {/* =================================
                                GENERIC NAME
                            ================================= */}

                            <div className="form-group">

                                <label
                                    htmlFor="genericName"
                                >

                                    Generic Name

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="genericName"
                                    type="text"
                                    name="genericName"
                                    value={
                                        formData.genericName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Paracetamol"
                                />

                            </div>


                            {/* =================================
                                CATEGORY
                            ================================= */}

                            <div className="form-group">

                                <label
                                    htmlFor="category"
                                >

                                    Category

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="category"
                                    type="text"
                                    name="category"
                                    value={
                                        formData.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Painkiller"
                                />

                            </div>


                            {/* =================================
                                DOSAGE
                            ================================= */}

                            <div className="form-group">

                                <label
                                    htmlFor="dosage"
                                >

                                    Dosage

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="dosage"
                                    type="text"
                                    name="dosage"
                                    value={
                                        formData.dosage
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="500mg"
                                />

                            </div>


                            {/* =================================
                                STOCK
                            ================================= */}

                            <div className="form-group">

                                <label
                                    htmlFor="stock"
                                >

                                    Stock

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="stock"
                                    type="number"
                                    name="stock"
                                    min="0"
                                    value={
                                        formData.stock
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="100"
                                />

                            </div>


                            {/* =================================
                                EXPIRY DATE
                            ================================= */}

                            <div className="form-group">

                                <label
                                    htmlFor="expiryDate"
                                >

                                    Expiry Date

                                    <span>
                                        *
                                    </span>

                                </label>


                                <input
                                    id="expiryDate"
                                    type="date"
                                    name="expiryDate"
                                    value={
                                        formData.expiryDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            {/* =================================
                                DESCRIPTION
                            ================================= */}

                            <div
                                className="form-group full-width"
                            >

                                <label
                                    htmlFor="description"
                                >

                                    Description

                                </label>


                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter medicine description"
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

                                        ? "✓ Update Medicine"

                                        : "✓ Add Medicine"

                                }

                            </button>


                        </div>


                    </form>


                </div>


            </div>


        </div>

    );

}


export default AddMedicine;