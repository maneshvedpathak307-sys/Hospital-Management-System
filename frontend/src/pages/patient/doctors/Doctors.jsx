import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../../services/api";

import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";
import EmptyState from "../../../components/common/EmptyState";
import SearchBox from "../../../components/common/SearchBox";

import "../../../styles/doctors.css";
import "../../../styles/tables.css";


function Doctors() {

    const [doctors, setDoctors] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");


    /* =========================================
       PAGINATION
    ========================================= */

    const [currentPage, setCurrentPage] = useState(1);

    const doctorsPerPage = 5;


    /* =========================================
       LOAD DOCTORS
    ========================================= */

    useEffect(() => {

        fetchDoctors();

    }, []);


    const fetchDoctors = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await api.get(
                    "/patient/doctors"
                );


            setDoctors(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Error loading doctors:",
                error
            );


            setDoctors([]);

            setError(
                error.response?.data?.message ||

                (
                    typeof error.response?.data === "string"
                        ? error.response.data
                        : "Unable to load doctors."
                )
            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================================
       SEARCH
    ========================================= */

    const filteredDoctors =
        doctors.filter((doctor) => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


            if (!searchText) {

                return true;

            }


            return (

                String(
                    doctor.doctorName ||
                    doctor.name ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText)


                ||

                String(
                    doctor.specialization ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText)


                ||

                String(
                    doctor.departmentName ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    /* =========================================
       RESET PAGE WHEN SEARCH CHANGES
    ========================================= */

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    /* =========================================
       PAGINATION CALCULATION
    ========================================= */

    const totalDoctors =
        filteredDoctors.length;


    const totalPages =
        Math.ceil(
            totalDoctors /
            doctorsPerPage
        );


    const startIndex =
        (currentPage - 1) *
        doctorsPerPage;


    const endIndex =
        startIndex +
        doctorsPerPage;


    const currentDoctors =
        filteredDoctors.slice(
            startIndex,
            endIndex
        );


    /* =========================================
       PREVIOUS PAGE
    ========================================= */

    const handlePreviousPage = () => {

        if (currentPage > 1) {

            setCurrentPage(
                currentPage - 1
            );

        }

    };


    /* =========================================
       NEXT PAGE
    ========================================= */

    const handleNextPage = () => {

        if (
            currentPage < totalPages
        ) {

            setCurrentPage(
                currentPage + 1
            );

        }

    };


    /* =========================================
       PAGE NUMBERS
    ========================================= */

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

        <div className="page-container doctors-page">


            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <PageHeader
                title="Doctors"
                subtitle="Find doctors and view their professional information."
            />


            {/* =====================================
                ERROR
            ===================================== */}

            {error && (

                <div className="doctors-error">

                    <span className="doctors-error-icon">
                        ⚠️
                    </span>

                    <div>

                        <strong>
                            Unable to load doctors
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                </div>

            )}


            {/* =====================================
                MAIN DOCTORS CARD
            ===================================== */}

            <div className="doctors-container">


                {/* =================================
                    SEARCH + TOTAL TOOLBAR

                    SEARCH = LEFT
                    TOTAL = RIGHT
                ================================= */}

                <div
                    className="doctors-toolbar"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px",
                        width: "100%"
                    }}
                >


                    {/* =================================
                        SEARCH - LEFT
                    ================================= */}

                    <div
                        className="doctors-search"
                        style={{
                            width: "320px",
                            marginLeft: "0"
                        }}
                    >

                        <SearchBox
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search doctors..."
                        />

                    </div>


                    {/* =================================
                        TOTAL DOCTORS - RIGHT
                    ================================= */}

                    <div
                        className="pagination-total"
                        style={{
                            marginLeft: "auto"
                        }}
                    >

                        <strong>
                            Total Doctors :
                        </strong>

                        <span>
                            {totalDoctors}
                        </span>

                    </div>


                </div>


                {/* =================================
                    SEARCH RESULT
                ================================= */}

                {search && (

                    <div className="doctor-search-result">

                        Showing{" "}

                        <strong>
                            {filteredDoctors.length}
                        </strong>{" "}

                        result
                        {filteredDoctors.length !== 1
                            ? "s"
                            : ""}{" "}

                        for "

                        <strong>
                            {search}
                        </strong>

                        "

                    </div>

                )}


                {/* =================================
                    EMPTY STATE
                ================================= */}

                {filteredDoctors.length === 0 ? (

                    <div className="doctors-empty">

                        <EmptyState
                            icon="👨‍⚕️"
                            title="No doctors found"
                            message={
                                search
                                    ? "Try another search."
                                    : "No doctors are currently available."
                            }
                        />

                    </div>

                ) : (

                    <>


                        {/* =================================
                            DOCTOR GRID
                        ================================= */}

                        <div className="doctor-grid">

                            {currentDoctors.map(
                                (doctor) => (

                                    <div
                                        className="doctor-card"
                                        key={doctor.id}
                                    >


                                        {/* =========================
                                            CARD TOP
                                        ========================= */}

                                        <div className="doctor-card-top">


                                            {/* AVATAR */}

                                            <div className="doctor-card-avatar">

                                                👨‍⚕️

                                            </div>


                                            {/* BASIC INFO */}

                                            <div className="doctor-card-heading">

                                                <h3>

                                                    {
                                                        doctor.doctorName ||
                                                        doctor.name ||
                                                        "Doctor"
                                                    }

                                                </h3>

                                                <p>

                                                    {
                                                        doctor.specialization ||
                                                        "Medical Specialist"
                                                    }

                                                </p>

                                            </div>

                                        </div>


                                        {/* =========================
                                            AVAILABLE STATUS
                                        ========================= */}

                                        <div className="doctor-available">

                                            <span className="doctor-status-dot"></span>

                                            Available for appointments

                                        </div>


                                        {/* =========================
                                            DOCTOR INFORMATION
                                        ========================= */}

                                        <div className="doctor-card-info">


                                            {/* DEPARTMENT */}

                                            <div className="doctor-info-item">

                                                <span className="doctor-info-icon">
                                                    🏥
                                                </span>

                                                <div>

                                                    <small>
                                                        Department
                                                    </small>

                                                    <strong>

                                                        {
                                                            doctor.departmentName ||
                                                            "Not Assigned"
                                                        }

                                                    </strong>

                                                </div>

                                            </div>


                                            {/* EMAIL */}

                                            <div className="doctor-info-item">

                                                <span className="doctor-info-icon">
                                                    ✉️
                                                </span>

                                                <div>

                                                    <small>
                                                        Email
                                                    </small>

                                                    <strong>

                                                        {
                                                            doctor.email ||
                                                            "Not available"
                                                        }

                                                    </strong>

                                                </div>

                                            </div>


                                            {/* PHONE */}

                                            <div className="doctor-info-item">

                                                <span className="doctor-info-icon">
                                                    📞
                                                </span>

                                                <div>

                                                    <small>
                                                        Phone
                                                    </small>

                                                    <strong>

                                                        {
                                                            doctor.phone ||
                                                            "Not available"
                                                        }

                                                    </strong>

                                                </div>

                                            </div>

                                        </div>


                                        {/* =========================
                                            ACTIONS
                                        ========================= */}

                                        <div className="doctor-card-actions">


                                            {/* VIEW PROFILE */}

                                            <Link
                                                to={`/patient/doctors/${doctor.id}`}
                                                className="doctor-view-button"
                                            >

                                                View Profile

                                            </Link>


                                            {/* BOOK APPOINTMENT */}

                                            <Link
                                                to={`/patient/appointments/book?doctorId=${doctor.id}`}
                                                className="doctor-book-button"
                                            >

                                                Book Appointment

                                            </Link>


                                        </div>


                                    </div>

                                )
                            )}

                        </div>


                        {/* =================================
                            PAGINATION FOOTER

                            PAGINATION ONLY
                            TOTAL DOCTORS REMOVED
                        ================================= */}

                        <div
                            className="table-pagination"
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                width: "100%"
                            }}
                        >


                            {/* =================================
                                PAGINATION CONTROLS - RIGHT
                            ================================= */}

                            <div className="pagination-controls">


                                {/* PREVIOUS */}

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


                                {/* PAGE NUMBERS */}

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


                                {/* PAGE INFORMATION */}

                                <span className="pagination-info">

                                    Page {currentPage} of{" "}

                                    {Math.max(
                                        totalPages,
                                        1
                                    )}

                                </span>


                                {/* NEXT */}

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


export default Doctors;