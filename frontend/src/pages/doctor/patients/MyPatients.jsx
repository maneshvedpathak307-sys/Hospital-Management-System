import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../../services/api";

import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";
import EmptyState from "../../../components/common/EmptyState";
import SearchBox from "../../../components/common/SearchBox";

import "../../../styles/my-patients.css";
import "../../../styles/tables.css";


function MyPatients() {

    const [patients, setPatients] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");


    /* =====================================================
       PAGINATION
    ===================================================== */

    const [currentPage, setCurrentPage] = useState(1);

    const patientsPerPage = 5;


    /* =====================================================
       LOAD PATIENTS
    ===================================================== */

    useEffect(() => {

        const fetchPatients = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        "/doctor/patients"
                    );

                setPatients(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } catch (error) {

                console.error(
                    "Error loading patients:",
                    error
                );

                setPatients([]);

                setError(
                    error.response?.data?.message ||

                    (
                        typeof error.response?.data === "string"
                            ? error.response.data
                            : "Unable to load patients."
                    )
                );

            } finally {

                setLoading(false);

            }

        };


        fetchPatients();

    }, []);


    /* =====================================================
       SEARCH
    ===================================================== */

    const filteredPatients =
        patients.filter((patient) => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


            if (!searchText) {

                return true;

            }


            return (

                String(
                    patient.patientName ||
                    patient.name ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    patient.email ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    patient.phone ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    patient.disease ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    /* =====================================================
       RESET PAGE WHEN SEARCH CHANGES
    ===================================================== */

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    /* =====================================================
       PAGINATION CALCULATION
    ===================================================== */

    const totalPatients =
        filteredPatients.length;


    const totalPages =
        Math.ceil(
            totalPatients /
            patientsPerPage
        );


    const startIndex =
        (currentPage - 1) *
        patientsPerPage;


    const endIndex =
        startIndex +
        patientsPerPage;


    const currentPatients =
        filteredPatients.slice(
            startIndex,
            endIndex
        );


    /* =====================================================
       PREVIOUS PAGE
    ===================================================== */

    const handlePreviousPage = () => {

        if (currentPage > 1) {

            setCurrentPage(
                currentPage - 1
            );

        }

    };


    /* =====================================================
       NEXT PAGE
    ===================================================== */

    const handleNextPage = () => {

        if (
            currentPage < totalPages
        ) {

            setCurrentPage(
                currentPage + 1
            );

        }

    };


    /* =====================================================
       PAGE NUMBERS
    ===================================================== */

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


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="page-container">

                <Loading />

            </div>

        );

    }


    return (

        <div className="page-container my-patients-page">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <PageHeader
                title="My Patients"
                subtitle="View and manage patients assigned to you."
            />


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="my-patients-error">

                    <span>
                        ⚠️
                    </span>

                    <div>

                        <strong>
                            Unable to load patients
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                </div>

            )}


            {/* =================================================
                MAIN CONTAINER
            ================================================= */}

            <div className="my-patients-container">


                {/* =================================================
                    TOOLBAR

                    SEARCH LEFT
                    TOTAL RIGHT
                ================================================= */}

                <div
                    className="my-patients-toolbar"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px"
                    }}
                >


                    {/* =========================================
                        SEARCH - LEFT
                    ========================================= */}

                    <div
                        className="my-patients-search"
                        style={{
                            width: "320px"
                        }}
                    >

                        <SearchBox
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search patients..."
                        />

                    </div>


                    {/* =========================================
                        TOTAL PATIENTS - RIGHT
                    ========================================= */}

                    <div
                        className="pagination-total"
                        style={{
                            marginLeft: "auto"
                        }}
                    >

                        <strong>
                            Total Patients :
                        </strong>

                        <span>
                            {totalPatients}
                        </span>

                    </div>

                </div>


                {/* =================================================
                    SEARCH RESULT
                ================================================= */}

                {search && (

                    <div className="doctor-search-result">

                        Showing{" "}

                        <strong>
                            {filteredPatients.length}
                        </strong>{" "}

                        result
                        {filteredPatients.length !== 1
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

                {filteredPatients.length === 0 ? (

                    <div className="my-patients-empty">

                        <EmptyState
                            icon="👥"
                            title="No patients found"
                            message={
                                search
                                    ? "Try another search."
                                    : "No patients are currently assigned to you."
                            }
                        />

                    </div>

                ) : (

                    <>


                        {/* =================================================
                            PATIENT GRID
                        ================================================= */}

                        <div className="patient-grid">

                            {currentPatients.map(
                                (patient) => (

                                    <div
                                        className="patient-card"
                                        key={patient.id}
                                    >


                                        {/* =================================
                                            PATIENT HEADER
                                        ================================= */}

                                        <div className="patient-card-header">


                                            {/* AVATAR */}

                                            <div className="patient-card-avatar">

                                                🧑

                                            </div>


                                            {/* NAME */}

                                            <div className="patient-card-heading">

                                                <h3>

                                                    {
                                                        patient.patientName ||
                                                        patient.name ||
                                                        "Patient"
                                                    }

                                                </h3>


                                                {/* PATIENT ROLE */}

                                                <span className="patient-role-badge">

                                                    Patient

                                                </span>

                                            </div>

                                        </div>


                                        {/* =================================
                                            PATIENT INFORMATION
                                        ================================= */}

                                        <div className="patient-card-info">


                                            {/* EMAIL */}

                                            <div className="patient-info-row">

                                                <span className="patient-info-icon">
                                                    ✉️
                                                </span>

                                                <div>

                                                    <small>
                                                        Email
                                                    </small>

                                                    <strong>
                                                        {
                                                            patient.email ||
                                                            "Not available"
                                                        }
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* PHONE */}

                                            <div className="patient-info-row">

                                                <span className="patient-info-icon">
                                                    📞
                                                </span>

                                                <div>

                                                    <small>
                                                        Phone
                                                    </small>

                                                    <strong>
                                                        {
                                                            patient.phone ||
                                                            "Not available"
                                                        }
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* AGE */}

                                            <div className="patient-info-row">

                                                <span className="patient-info-icon">
                                                    🎂
                                                </span>

                                                <div>

                                                    <small>
                                                        Age
                                                    </small>

                                                    <strong>
                                                        {
                                                            patient.age ??
                                                            "Not available"
                                                        }
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* HEALTH PROBLEM */}

                                            <div className="patient-info-row">

                                                <span className="patient-info-icon">
                                                    🩺
                                                </span>

                                                <div>

                                                    <small>
                                                        Health Problem
                                                    </small>

                                                    <strong>
                                                        {
                                                            patient.disease ||
                                                            "Not specified"
                                                        }
                                                    </strong>

                                                </div>

                                            </div>


                                        </div>


                                        {/* =================================
                                            ACTION
                                        ================================= */}

                                        <div className="patient-card-actions">

                                            <Link
                                                to={`/doctor/patients/${patient.id}`}
                                                className="patient-view-button"
                                            >
                                                View Patient
                                            </Link>

                                        </div>


                                    </div>

                                )
                            )}

                        </div>


                        {/* =================================================
                            PAGINATION FOOTER
                            
                            PAGINATION ONLY - RIGHT SIDE
                        ================================================= */}

                        <div
                            className="table-pagination"
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                width: "100%"
                            }}
                        >

                            <div
                                className="pagination-controls"
                                style={{
                                    marginLeft: "auto"
                                }}
                            >


                                {/* =================================
                                    PREVIOUS
                                ================================= */}

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


                                {/* =================================
                                    PAGE NUMBERS
                                ================================= */}

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


                                {/* =================================
                                    PAGE INFORMATION
                                ================================= */}

                                <span className="pagination-info">

                                    Page {currentPage} of{" "}

                                    {Math.max(
                                        totalPages,
                                        1
                                    )}

                                </span>


                                {/* =================================
                                    NEXT
                                ================================= */}

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


export default MyPatients;