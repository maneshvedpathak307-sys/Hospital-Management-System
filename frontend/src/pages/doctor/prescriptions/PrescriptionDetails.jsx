import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import api from "../../../services/api";

import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";

import "../../../styles/tables.css";


function PrescriptionDetails() {

    const { id } = useParams();


    /* =========================================
       STATES
    ========================================= */

    const [prescription, setPrescription] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =========================================
       LOAD PRESCRIPTION
    ========================================= */

    const fetchPrescription = useCallback(async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await api.get(
                    `/doctor/prescriptions/${id}`
                );


            setPrescription(
                response.data
            );


        } catch (error) {

            console.error(
                "Error loading prescription:",
                error
            );


            setError(

                error.response?.data?.message ||

                (
                    typeof error.response?.data === "string"
                        ? error.response.data
                        : "Unable to load prescription."
                )

            );

        } finally {

            setLoading(false);

        }

    }, [
        id
    ]);


    /* =========================================
       LOAD ON PAGE LOAD
    ========================================= */

    useEffect(() => {

        fetchPrescription();

    }, [
        fetchPrescription
    ]);


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
       ERROR
    ========================================= */

    if (error) {

        return (

            <div className="page-container">

                <PageHeader
                    title="Prescription Details"
                    subtitle="View prescription information."
                />


                <div className="error-alert">

                    ⚠️ {error}

                </div>


                <Link
                    to="/doctor/prescriptions"
                    className="secondary-button"
                >

                    ← Back to Prescriptions

                </Link>

            </div>

        );

    }


    /* =========================================
       NO DATA
    ========================================= */

    if (!prescription) {

        return (

            <div className="page-container">

                <PageHeader
                    title="Prescription Details"
                    subtitle="Prescription information."
                />


                <div className="error-alert">

                    Prescription not found.

                </div>


                <Link
                    to="/doctor/prescriptions"
                    className="secondary-button"
                >

                    ← Back to Prescriptions

                </Link>

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
                title="Prescription Details"
                subtitle="View complete prescription information."
            />


            {/* =================================
                TOP ACTIONS
            ================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "20px",
                    flexWrap: "wrap"
                }}
            >

                {/* EDIT */}

                <Link
                    to={`/doctor/prescriptions/${id}/edit`}
                    className="primary-button"
                >

                    ✏️ Edit Prescription

                </Link>


                {/* BACK */}

                <Link
                    to="/doctor/prescriptions"
                    className="secondary-button"
                >

                    ← Back to Prescriptions

                </Link>

            </div>


            {/* =================================
                PATIENT / DOCTOR INFORMATION
            ================================= */}

            <div className="management-card">

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px",
                        marginBottom: "25px"
                    }}
                >

                    {/* PATIENT */}

                    <div>

                        <strong>
                            Patient
                        </strong>

                        <div>
                            {
                                prescription.patientName ||
                                "-"
                            }
                        </div>

                    </div>


                    {/* DOCTOR */}

                    <div>

                        <strong>
                            Doctor
                        </strong>

                        <div>
                            {
                                prescription.doctorName ||
                                "-"
                            }
                        </div>

                    </div>


                    {/* DEPARTMENT */}

                    <div>

                        <strong>
                            Department
                        </strong>

                        <div>
                            {
                                prescription.departmentName ||
                                "-"
                            }
                        </div>

                    </div>


                    {/* DATE */}

                    <div>

                        <strong>
                            Prescription Date
                        </strong>

                        <div>
                            {
                                prescription.prescriptionDate ||
                                "-"
                            }
                        </div>

                    </div>

                </div>


                {/* =================================
                    DIAGNOSIS
                ================================= */}

                <div
                    style={{
                        marginBottom: "25px"
                    }}
                >

                    <h3>
                        Diagnosis
                    </h3>

                    <p>
                        {
                            prescription.diagnosis ||
                            "-"
                        }
                    </p>

                </div>


                {/* =================================
                    MEDICINES
                ================================= */}

                <div>

                    <h3>
                        Prescribed Medicines
                    </h3>


                    {
                        Array.isArray(
                            prescription.medicines
                        ) &&
                        prescription.medicines.length > 0 ? (

                            <div className="table-wrapper">

                                <table className="data-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                S.No.
                                            </th>

                                            <th>
                                                Medicine
                                            </th>

                                            <th>
                                                Generic Name
                                            </th>

                                            <th>
                                                Dosage
                                            </th>

                                            <th>
                                                Frequency
                                            </th>

                                            <th>
                                                Duration
                                            </th>

                                            <th>
                                                Instructions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {
                                            prescription.medicines.map(
                                                (medicine, index) => (

                                                    <tr
                                                        key={
                                                            medicine.id ||
                                                            index
                                                        }
                                                    >

                                                        <td>
                                                            {index + 1}
                                                        </td>


                                                        <td>

                                                            <strong>
                                                                {
                                                                    medicine.medicineName ||
                                                                    "-"
                                                                }
                                                            </strong>

                                                        </td>


                                                        <td>

                                                            {
                                                                medicine.genericName ||
                                                                "-"
                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                medicine.dosage ||
                                                                "-"
                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                medicine.frequency ||
                                                                "-"
                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                medicine.duration ||
                                                                "-"
                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                medicine.instructions ||
                                                                "-"
                                                            }

                                                        </td>

                                                    </tr>

                                                )
                                            )
                                        }

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <p>
                                No medicines prescribed.
                            </p>

                        )
                    }

                </div>


                {/* =================================
                    GENERAL INSTRUCTIONS
                ================================= */}

                <div
                    style={{
                        marginTop: "30px"
                    }}
                >

                    <h3>
                        General Instructions
                    </h3>

                    <p>

                        {
                            prescription.instructions ||
                            "No additional instructions."
                        }

                    </p>

                </div>

            </div>

        </div>

    );

}


export default PrescriptionDetails;