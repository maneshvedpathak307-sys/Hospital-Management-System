import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../../services/api";

import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";
import EmptyState from "../../../components/common/EmptyState";
import SearchBox from "../../../components/common/SearchBox";

import "../../../styles/tables.css";


function Prescriptions() {

    const [prescriptions, setPrescriptions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");


    // =====================================================
    // PAGINATION
    // =====================================================

    const [currentPage, setCurrentPage] = useState(1);

    const prescriptionsPerPage = 5;


    // =====================================================
    // LOAD PRESCRIPTIONS
    // =====================================================

    useEffect(() => {

        fetchPrescriptions();

    }, []);


    const fetchPrescriptions = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await api.get(
                    "/doctor/prescriptions"
                );


            setPrescriptions(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );


        } catch (error) {

            console.error(
                "Error loading prescriptions:",
                error
            );


            setPrescriptions([]);


            setError(

                error.response?.data?.message ||

                (
                    typeof error.response?.data === "string"
                        ? error.response.data
                        : "Unable to load prescriptions."
                )

            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredPrescriptions =
        prescriptions.filter(
            (prescription) => {

                const searchText =
                    search
                        .toLowerCase()
                        .trim();


                if (!searchText) {

                    return true;

                }


                // -----------------------------------------
                // MEDICINE SEARCH
                // -----------------------------------------

                const medicineSearchText =
                    Array.isArray(
                        prescription.medicines
                    )
                        ? prescription.medicines
                            .map((medicine) =>
                                [
                                    medicine.medicineName,
                                    medicine.genericName,
                                    medicine.category,
                                    medicine.dosage,
                                    medicine.frequency,
                                    medicine.duration,
                                    medicine.instructions
                                ]
                                    .filter(Boolean)
                                    .join(" ")
                            )
                            .join(" ")
                            .toLowerCase()
                        : "";


                return (

                    String(
                        prescription.patientName || ""
                    )
                        .toLowerCase()
                        .includes(searchText)


                    ||

                    String(
                        prescription.diagnosis || ""
                    )
                        .toLowerCase()
                        .includes(searchText)


                    ||

                    medicineSearchText
                        .includes(searchText)


                    ||

                    String(
                        prescription.prescriptionDate ||
                        prescription.date ||
                        ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                );

            }
        );


    // =====================================================
    // RESET PAGE WHEN SEARCH CHANGES
    // =====================================================

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPrescriptions =
        filteredPrescriptions.length;


    const totalPages =
        Math.ceil(
            totalPrescriptions /
            prescriptionsPerPage
        );


    const startIndex =
        (currentPage - 1) *
        prescriptionsPerPage;


    const endIndex =
        startIndex +
        prescriptionsPerPage;


    const currentPrescriptions =
        filteredPrescriptions.slice(
            startIndex,
            endIndex
        );


    // =====================================================
    // PREVIOUS PAGE
    // =====================================================

    const handlePreviousPage = () => {

        if (currentPage > 1) {

            setCurrentPage(
                currentPage - 1
            );

        }

    };


    // =====================================================
    // NEXT PAGE
    // =====================================================

    const handleNextPage = () => {

        if (
            currentPage < totalPages
        ) {

            setCurrentPage(
                currentPage + 1
            );

        }

    };


    // =====================================================
    // PAGE NUMBERS
    // =====================================================

    const getPageNumbers = () => {

        const pages = [];


        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {

            pages.push(page);

        }


        return pages;

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

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

            <PageHeader
                title="Prescriptions"
                subtitle="Create and manage patient prescriptions."
            />


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="error-alert">

                    ⚠️ {error}

                </div>

            )}


            {/* =================================================
                PRESCRIPTION CARD
            ================================================= */}

            <div className="management-card">


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <div className="table-toolbar">

                    <SearchBox
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search prescriptions..."
                    />


                    <Link
                        to="/doctor/prescriptions/add"
                        className="primary-button"
                    >

                        + Add Prescription

                    </Link>

                </div>


                {/* =================================================
                    SEARCH RESULT
                ================================================= */}

                {search && (

                    <div className="doctor-search-result">

                        Showing{" "}

                        <strong>
                            {filteredPrescriptions.length}
                        </strong>{" "}

                        result
                        {filteredPrescriptions.length !== 1
                            ? "s"
                            : ""}{" "}

                        for "

                        <strong>
                            {search}
                        </strong>

                        "

                    </div>

                )}


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {filteredPrescriptions.length === 0 ? (

                    <EmptyState
                        icon="💊"
                        title="No prescriptions found"
                        message={
                            search
                                ? "Try another search."
                                : "No prescriptions have been created yet."
                        }
                    />

                ) : (

                    <>


                        {/* =================================================
                            TABLE
                        ================================================= */}

                        <div className="table-wrapper">

                            <table className="data-table">

                                <thead>

                                    <tr>

                                        <th>
                                            S.No.
                                        </th>

                                        <th>
                                            Patient
                                        </th>

                                        <th>
                                            Diagnosis
                                        </th>

                                        <th>
                                            Medicine
                                        </th>

                                        <th>
                                            Dosage
                                        </th>

                                        <th>
                                            Duration
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {currentPrescriptions.map(
                                        (prescription, index) => (

                                            <tr
                                                key={
                                                    prescription.id ||
                                                    index
                                                }
                                            >

                                                {/* S.NO */}

                                                <td>

                                                    {
                                                        startIndex +
                                                        index +
                                                        1
                                                    }

                                                </td>


                                                {/* PATIENT */}

                                                <td>

                                                    <div className="doctor-cell">

                                                        <strong>

                                                            {
                                                                prescription.patientName ||
                                                                "Unknown Patient"
                                                            }

                                                        </strong>

                                                    </div>

                                                </td>


                                                {/* DIAGNOSIS */}

                                                <td>

                                                    {
                                                        prescription.diagnosis ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* =================================================
                                                    MEDICINES

                                                    IMPORTANT:
                                                    medicines is an ARRAY
                                                ================================================= */}

                                                <td>

                                                    {Array.isArray(
                                                        prescription.medicines
                                                    ) &&
                                                    prescription.medicines.length > 0
                                                        ? (
                                                            <div>
                                                                {prescription.medicines.map(
                                                                    (medicine, medicineIndex) => (

                                                                        <div
                                                                            key={
                                                                                medicine.id ||
                                                                                medicineIndex
                                                                            }
                                                                            style={{
                                                                                marginBottom:
                                                                                    medicineIndex <
                                                                                    prescription.medicines.length - 1
                                                                                        ? "8px"
                                                                                        : "0"
                                                                            }}
                                                                        >

                                                                            <strong>
                                                                                {
                                                                                    medicine.medicineName ||
                                                                                    "-"
                                                                                }
                                                                            </strong>

                                                                        </div>

                                                                    )
                                                                )}
                                                            </div>
                                                        )
                                                        : "-"
                                                    }

                                                </td>


                                                {/* =================================================
                                                    DOSAGE
                                                ================================================= */}

                                                <td>

                                                    {Array.isArray(
                                                        prescription.medicines
                                                    ) &&
                                                    prescription.medicines.length > 0
                                                        ? (
                                                            <div>
                                                                {prescription.medicines.map(
                                                                    (medicine, medicineIndex) => (

                                                                        <div
                                                                            key={
                                                                                medicine.id ||
                                                                                medicineIndex
                                                                            }
                                                                            style={{
                                                                                marginBottom:
                                                                                    medicineIndex <
                                                                                    prescription.medicines.length - 1
                                                                                        ? "8px"
                                                                                        : "0"
                                                                            }}
                                                                        >

                                                                            {
                                                                                medicine.dosage ||
                                                                                "-"
                                                                            }

                                                                        </div>

                                                                    )
                                                                )}
                                                            </div>
                                                        )
                                                        : "-"
                                                    }

                                                </td>


                                                {/* =================================================
                                                    DURATION
                                                ================================================= */}

                                                <td>

                                                    {Array.isArray(
                                                        prescription.medicines
                                                    ) &&
                                                    prescription.medicines.length > 0
                                                        ? (
                                                            <div>
                                                                {prescription.medicines.map(
                                                                    (medicine, medicineIndex) => (

                                                                        <div
                                                                            key={
                                                                                medicine.id ||
                                                                                medicineIndex
                                                                            }
                                                                            style={{
                                                                                marginBottom:
                                                                                    medicineIndex <
                                                                                    prescription.medicines.length - 1
                                                                                        ? "8px"
                                                                                        : "0"
                                                                            }}
                                                                        >

                                                                            {
                                                                                medicine.duration ||
                                                                                "-"
                                                                            }

                                                                        </div>

                                                                    )
                                                                )}
                                                            </div>
                                                        )
                                                        : "-"
                                                    }

                                                </td>


                                                {/* DATE */}

                                                <td>

                                                    {
                                                        prescription.prescriptionDate ||
                                                        prescription.date ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* ACTION */}

                                                <td>

                                                    <Link
                                                        to={`/doctor/prescriptions/${prescription.id}`}
                                                        className="secondary-button"
                                                    >

                                                        View

                                                    </Link>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* =================================================
                            PAGINATION
                        ================================================= */}

                        <div
                            className="table-pagination"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%"
                            }}
                        >

                            <div className="pagination-total">

                                <strong>
                                    Total Prescriptions :
                                </strong>

                                <span>
                                    {totalPrescriptions}
                                </span>

                            </div>


                            <div
                                className="pagination-controls"
                                style={{
                                    marginLeft: "auto"
                                }}
                            >

                                <button
                                    type="button"
                                    className="pagination-button"
                                    onClick={
                                        handlePreviousPage
                                    }
                                    disabled={
                                        currentPage === 1 ||
                                        totalPages === 0
                                    }
                                >

                                    ← Previous

                                </button>


                                {totalPages > 0 && (

                                    <div className="pagination-pages">

                                        {getPageNumbers().map(
                                            (page) => (

                                                <button
                                                    type="button"
                                                    key={page}
                                                    className={
                                                        currentPage === page
                                                            ? "pagination-page active"
                                                            : "pagination-page"
                                                    }
                                                    onClick={() =>
                                                        setCurrentPage(
                                                            page
                                                        )
                                                    }
                                                >

                                                    {page}

                                                </button>

                                            )
                                        )}

                                    </div>

                                )}


                                <span className="pagination-info">

                                    Page {currentPage} of{" "}

                                    {Math.max(
                                        totalPages,
                                        1
                                    )}

                                </span>


                                <button
                                    type="button"
                                    className="pagination-button"
                                    onClick={
                                        handleNextPage
                                    }
                                    disabled={
                                        currentPage === totalPages ||
                                        totalPages === 0
                                    }
                                >

                                    Next →

                                </button>

                            </div>

                        </div>

                    </>

                )}

            </div>

        </div>

    );

}


export default Prescriptions;