import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import api from "../../../services/api";

import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";
import EmptyState from "../../../components/common/EmptyState";
import SearchBox from "../../../components/common/SearchBox";
import StatusBadge from "../../../components/common/StatusBadge";

import "../../../styles/tables.css";


function MyAppointments() {

    /* =========================================
       STATES
    ========================================= */

    const [appointments, setAppointments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");


    /* =========================================
       PAGINATION
    ========================================= */

    const [currentPage, setCurrentPage] =
        useState(1);

    const appointmentsPerPage = 5;


    /* =========================================
       GET TODAY'S DATE
    ========================================= */

    const getTodayDate = () => {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;

    };


    const todayDate =
        getTodayDate();


    /* =========================================
       LOAD APPOINTMENTS
    ========================================= */

    const fetchAppointments = useCallback(async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await api.get(
                    "/doctor/appointments"
                );


            const data =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            /* =====================================
               ONLY TODAY'S APPOINTMENTS
            ===================================== */

            const todayAppointments =
                data.filter(
                    (appointment) => {

                        const appointmentDate =
                            String(
                                appointment.appointmentDate ||
                                ""
                            ).substring(0, 10);


                        return (
                            appointmentDate ===
                            todayDate
                        );

                    }
                );


            /* =====================================
               SORT BY TIME
            ===================================== */

            todayAppointments.sort(
                (a, b) => {

                    const timeA =
                        String(
                            a.appointmentTime ||
                            ""
                        );

                    const timeB =
                        String(
                            b.appointmentTime ||
                            ""
                        );


                    return timeA.localeCompare(
                        timeB
                    );

                }
            );


            setAppointments(
                todayAppointments
            );


        } catch (error) {

            console.error(
                "Error loading appointments:",
                error
            );


            setAppointments([]);


            setError(

                error.response?.data?.message ||

                (
                    typeof error.response?.data === "string"
                        ? error.response.data
                        : "Unable to load appointments."
                )

            );

        } finally {

            setLoading(false);

        }

    }, [
        todayDate
    ]);


    /* =========================================
       LOAD ON PAGE LOAD
    ========================================= */

    useEffect(() => {

        fetchAppointments();

    }, [
        fetchAppointments
    ]);


    /* =========================================
       STATUS CLASS
    ========================================= */

    const getStatusClass = (status) => {

        switch (
            String(
                status || ""
            ).toUpperCase()
        ) {

            case "PENDING":
                return "pending";

            case "APPROVED":
                return "approved";

            case "REJECTED":
                return "rejected";

            case "COMPLETED":
                return "completed";

            case "CANCELLED":
                return "cancelled";

            default:
                return "";

        }

    };


    /* =========================================
       SEARCH
    ========================================= */

    const filteredAppointments =
        appointments.filter(
            (appointment) => {

                const searchText =
                    search
                        .toLowerCase()
                        .trim();


                if (!searchText) {

                    return true;

                }


                return (

                    String(
                        appointment.patientName ||
                        ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    String(
                        appointment.departmentName ||
                        ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    String(
                        appointment.reason ||
                        ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    String(
                        appointment.status ||
                        ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    String(
                        appointment.appointmentDate ||
                        ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    String(
                        appointment.appointmentTime ||
                        ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                );

            }
        );


    /* =========================================
       RESET PAGE WHEN SEARCH CHANGES
    ========================================= */

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    /* =========================================
       PAGINATION CALCULATION
    ========================================= */

    const totalAppointments =
        filteredAppointments.length;


    const totalPages =
        Math.ceil(
            totalAppointments /
            appointmentsPerPage
        );


    const startIndex =
        (currentPage - 1) *
        appointmentsPerPage;


    const endIndex =
        startIndex +
        appointmentsPerPage;


    const currentAppointments =
        filteredAppointments.slice(
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
       RETURN
    ========================================= */

    return (

        <div className="page-container">


            {/* =================================
                PAGE HEADER
            ================================= */}

            <PageHeader
                title="My Appointments"
                subtitle="View and manage your appointments for today."
            />


            {/* =================================
                ERROR
            ================================= */}

            {error && (

                <div className="error-alert">

                    ⚠️ {error}

                </div>

            )}


            {/* =================================
                APPOINTMENT CARD
            ================================= */}

            <div className="management-card">


                {/* =================================
                    TOOLBAR
                ================================= */}

                <div
                    className="table-toolbar"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px"
                    }}
                >


                    {/* SEARCH */}

                    <div
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
                            placeholder="Search today's appointments..."
                        />

                    </div>


                    {/* TOTAL */}

                    <div
                        className="pagination-total"
                        style={{
                            marginLeft: "auto"
                        }}
                    >

                        <strong>
                            Today's Appointments :
                        </strong>

                        <span>
                            {totalAppointments}
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
                            {filteredAppointments.length}
                        </strong>{" "}

                        result
                        {filteredAppointments.length !== 1
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

                {filteredAppointments.length === 0 ? (

                    <EmptyState
                        icon="📅"
                        title="No appointments for today"
                        message={
                            search
                                ? "Try another search."
                                : "You currently have no appointments scheduled for today."
                        }
                    />

                ) : (

                    <>


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
                                            No.
                                        </th>

                                        <th>
                                            Patient
                                        </th>

                                        <th>
                                            Department
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Time
                                        </th>

                                        <th>
                                            Reason
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                {/* =================================
                                    TABLE BODY
                                ================================= */}

                                <tbody>

                                    {currentAppointments.map(
                                        (appointment, index) => (

                                            <tr
                                                key={
                                                    appointment.id ||
                                                    index
                                                }
                                            >


                                                {/* =================================
                                                    SERIAL NUMBER

                                                    This is ONLY frontend numbering.

                                                    It is NOT the MySQL ID.
                                                ================================= */}

                                                <td>

                                                    {
                                                        startIndex +
                                                        index +
                                                        1
                                                    }

                                                </td>


                                                {/* =================================
                                                    PATIENT
                                                ================================= */}

                                                <td>

                                                    <div className="doctor-cell">

                                                        <div>

                                                            <strong>

                                                                {
                                                                    appointment.patientName ||
                                                                    "Unknown Patient"
                                                                }

                                                            </strong>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* =================================
                                                    DEPARTMENT
                                                ================================= */}

                                                <td>

                                                    {
                                                        appointment.departmentName ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* =================================
                                                    DATE
                                                ================================= */}

                                                <td>

                                                    {
                                                        appointment.appointmentDate ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* =================================
                                                    TIME
                                                ================================= */}

                                                <td>

                                                    {
                                                        appointment.appointmentTime ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* =================================
                                                    REASON
                                                ================================= */}

                                                <td>

                                                    {
                                                        appointment.reason ||
                                                        "Not specified"
                                                    }

                                                </td>


                                                {/* =================================
                                                    STATUS
                                                ================================= */}

                                                <td>

                                                    <StatusBadge
                                                        status={
                                                            appointment.status ||
                                                            "PENDING"
                                                        }
                                                        className={
                                                            getStatusClass(
                                                                appointment.status
                                                            )
                                                        }
                                                    />

                                                </td>


                                                {/* =================================
                                                    ACTION

                                                    MySQL ID is NOT displayed.

                                                    It is still used internally
                                                    for the View page.
                                                ================================= */}

                                                <td>

                                                    <Link
                                                        to={`/doctor/appointments/${appointment.id}`}
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


                        {/* =================================
                            PAGINATION
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

                            <div
                                className="pagination-controls"
                                style={{
                                    marginLeft: "auto"
                                }}
                            >


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


export default MyAppointments;