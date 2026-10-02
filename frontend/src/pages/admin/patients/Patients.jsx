import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PatientManagementService
    from "../../../services/PatientManagementService";

import PageHeader
    from "../../../components/common/PageHeader";

import Loading
    from "../../../components/common/Loading";

import SearchBox
    from "../../../components/common/SearchBox";

import EmptyState
    from "../../../components/common/EmptyState";

import "../../../styles/forms.css";
import "../../../styles/tables.css";


function Patients() {

    const navigate = useNavigate();


    /* =========================================
       STATES
    ========================================= */

    const [patients, setPatients] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =========================================
       PAGINATION
    ========================================= */

    const [currentPage, setCurrentPage] = useState(1);

    const patientsPerPage = 5;


    /* =========================================
       LOAD PATIENTS
    ========================================= */

    useEffect(() => {

        loadPatients();

    }, []);


    const loadPatients = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await PatientManagementService
                    .getAllPatients();


            /*
             * Support both:
             *
             * response.data
             *
             * and
             *
             * response
             */

            const data =
                response?.data ||
                response ||
                [];


            setPatients(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Load patients error:",
                error
            );


            setPatients([]);


            setError(
                error?.response?.data?.message ||

                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to load patients."
                )
            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================================
       SEARCH
    ========================================= */

    const filteredPatients =
        patients.filter((patient) => {

            const search =
                searchTerm
                    .toLowerCase()
                    .trim();


            if (!search) {

                return true;

            }


            return (

                String(
                    patient.patientName ||
                    patient.name ||
                    ""
                )
                    .toLowerCase()
                    .includes(search)


                ||

                String(
                    patient.email ||
                    patient.loginEmail ||
                    ""
                )
                    .toLowerCase()
                    .includes(search)


                ||

                String(
                    patient.phone ||
                    ""
                )
                    .toLowerCase()
                    .includes(search)


                ||

                String(
                    patient.disease ||
                    ""
                )
                    .toLowerCase()
                    .includes(search)


                ||

                String(
                    patient.gender ||
                    ""
                )
                    .toLowerCase()
                    .includes(search)

            );

        });


    /* =========================================
       RESET PAGE WHEN SEARCH CHANGES
    ========================================= */

    useEffect(() => {

        setCurrentPage(1);

    }, [searchTerm]);


    /* =========================================
       PAGINATION CALCULATION
    ========================================= */

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
            currentPage <
            totalPages
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
       VIEW PATIENT
    ========================================= */

    const handleView = (id) => {

        navigate(
            `/admin/patients/${id}`
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

            <PageHeader
                title="Patients"
                subtitle="Manage registered hospital patients."
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
                TOOLBAR
            ================================= */}

            <div className="management-toolbar">


                {/* SEARCH */}

                <SearchBox
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search patients..."
                />


            </div>


            {/* =================================
                PATIENT TABLE
            ================================= */}

            {filteredPatients.length === 0 ? (

                <EmptyState
                    title="No patients found"
                    message={
                        searchTerm
                            ? "No patients match your search."
                            : "No patients have been registered yet."
                    }
                />

            ) : (

                <div className="data-table-card">


                    {/* =================================
                        TABLE
                    ================================= */}

                    <div className="table-wrapper">

                        <table className="data-table">


                            {/* =================================
                                TABLE HEADER
                            ================================= */}

                            <thead>

                                <tr>

                                    {/* SERIAL NUMBER */}

                                    <th>
                                        S.No.
                                    </th>

                                    <th>
                                        Patient
                                    </th>

                                    <th>
                                        Age
                                    </th>

                                    <th>
                                        Gender
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Disease
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            {/* =================================
                                TABLE BODY
                            ================================= */}

                            <tbody>

                                {currentPatients.map(
                                    (patient, index) => (

                                        <tr
                                            key={
                                                patient.id ||
                                                index
                                            }
                                        >


                                            {/* =================
                                                SERIAL NUMBER
                                            ================= */}

                                            <td>

                                                <strong>
                                                    {
                                                        startIndex +
                                                        index +
                                                        1
                                                    }
                                                </strong>

                                            </td>


                                            {/* =================
                                                PATIENT
                                            ================= */}

                                            <td>

                                                <div className="patient-table-name">

                                                    <div>

                                                        <strong>

                                                            {
                                                                patient.patientName ||
                                                                patient.name ||
                                                                "Unknown Patient"
                                                            }

                                                        </strong>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* =================
                                                AGE
                                            ================= */}

                                            <td>

                                                {
                                                    patient.age ??
                                                    "-"
                                                }

                                            </td>


                                            {/* =================
                                                GENDER
                                            ================= */}

                                            <td>

                                                {
                                                    patient.gender ||
                                                    "-"
                                                }

                                            </td>


                                            {/* =================
                                                PHONE
                                            ================= */}

                                            <td>

                                                {
                                                    patient.phone ||
                                                    "-"
                                                }

                                            </td>


                                            {/* =================
                                                EMAIL
                                            ================= */}

                                            <td>

                                                {
                                                    patient.email ||
                                                    patient.loginEmail ||
                                                    "-"
                                                }

                                            </td>


                                            {/* =================
                                                DISEASE
                                            ================= */}

                                            <td>

                                                {
                                                    patient.disease ||
                                                    "-"
                                                }

                                            </td>


                                            {/* =================
                                                ACTIONS
                                            ================= */}

                                            <td>

                                                <div className="table-actions">


                                                    {/* VIEW */}

                                                    <button
                                                        type="button"
                                                        className="table-action view"
                                                        onClick={() =>
                                                            handleView(
                                                                patient.id
                                                            )
                                                        }
                                                        title="View patient"
                                                    >

                                                        👁

                                                    </button>


                                                </div>

                                            </td>


                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* =================================
                        TABLE FOOTER
                    ================================= */}

                    <div className="table-pagination">


                        {/* =================================
                            TOTAL PATIENTS
                        ================================= */}

                        <div className="pagination-total">

                            <strong>
                                Total Patients :
                            </strong>

                            <span>
                                {totalPatients}
                            </span>

                        </div>


                        {/* =================================
                            PAGINATION CONTROLS
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


                </div>

            )}


        </div>

    );

}


export default Patients;