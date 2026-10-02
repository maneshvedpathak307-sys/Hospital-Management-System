import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import AppointmentService
    from "../../../services/AppointmentService";

import PageHeader
    from "../../../components/common/PageHeader";

import Loading
    from "../../../components/common/Loading";

import SearchBox
    from "../../../components/common/SearchBox";

import StatusBadge
    from "../../../components/common/StatusBadge";

import "../../../styles/forms.css";
import "../../../styles/tables.css";


function AdminAppointments() {

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

    const [statusFilter, setStatusFilter] =
        useState("ALL");


    /* =========================================
       PAGINATION
    ========================================= */

    const [currentPage, setCurrentPage] =
        useState(1);

    const appointmentsPerPage = 5;


    /* =========================================
       GET TODAY'S DATE
       
       IMPORTANT:
       Do not use toISOString() here because
       UTC conversion can change the date.
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

    const loadAppointments =
        useCallback(async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await AppointmentService
                        .getAllAppointments();


                const data =
                    response?.data ||
                    response ||
                    [];


                const allAppointments =
                    Array.isArray(data)
                        ? data
                        : [];


                /* =====================================
                   ONLY TODAY'S APPOINTMENTS
                ===================================== */

                const todayAppointments =
                    allAppointments.filter(
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
                    "Load appointments error:",
                    error
                );


                setAppointments([]);


                setError(

                    error?.response?.data?.message ||

                    (
                        typeof error?.response?.data === "string"
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
       LOAD APPOINTMENTS ON PAGE LOAD
    ========================================= */

    useEffect(() => {

        loadAppointments();

    }, [
        loadAppointments
    ]);


    /* =========================================
       SEARCH + STATUS FILTER
    ========================================= */

    const filteredAppointments =
        appointments.filter(
            (appointment) => {

                const searchText =
                    search
                        .trim()
                        .toLowerCase();


                const matchesSearch =
                    !searchText ||

                    String(
                        appointment.patientName ||
                        ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    String(
                        appointment.doctorName ||
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
                        .includes(searchText);


                const matchesStatus =
                    statusFilter === "ALL" ||

                    String(
                        appointment.status ||
                        ""
                    )
                        .toUpperCase() ===
                        statusFilter;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    /* =========================================
       RESET PAGE WHEN SEARCH/FILTER CHANGES
    ========================================= */

    useEffect(() => {

        setCurrentPage(1);

    }, [
        search,
        statusFilter
    ]);


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
                HEADER
            ================================= */}

            <PageHeader
                title="Appointments"
                subtitle="View and monitor all hospital appointments for today."
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
                APPOINTMENT CARD
            ================================= */}

            <div className="management-card">


                {/* =================================
                    TOOLBAR
                ================================= */}

                <div className="table-toolbar">

                    <div className="table-toolbar-actions">


                        {/* SEARCH */}

                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder="Search today's appointments..."
                        />


                        {/* STATUS FILTER */}

                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                        >

                            <option value="ALL">
                                All Status
                            </option>

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="APPROVED">
                                Approved
                            </option>

                            <option value="REJECTED">
                                Rejected
                            </option>

                            <option value="COMPLETED">
                                Completed
                            </option>

                            <option value="CANCELLED">
                                Cancelled
                            </option>

                        </select>


                    </div>

                </div>


                {/* =================================
                    EMPTY STATE
                ================================= */}

                {filteredAppointments.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            📅
                        </div>

                        <h3>
                            No appointments for today
                        </h3>

                        <p>

                            {search ||
                            statusFilter !== "ALL"

                                ? "Try changing your search or filter."

                                : "There are no appointments scheduled for today."

                            }

                        </p>

                    </div>

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

                                        <th>
                                            S.No.
                                        </th>

                                        <th>
                                            Patient
                                        </th>

                                        <th>
                                            Doctor
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


                                                {/* SERIAL NUMBER */}

                                                <td>

                                                    {
                                                        startIndex +
                                                        index +
                                                        1
                                                    }

                                                </td>


                                                {/* PATIENT */}

                                                <td>

                                                    <div className="person-cell">

                                                        <strong>

                                                            {
                                                                appointment.patientName ||
                                                                "Unknown"
                                                            }

                                                        </strong>

                                                    </div>

                                                </td>


                                                {/* DOCTOR */}

                                                <td>

                                                    <div className="person-cell">

                                                        <strong>

                                                            {
                                                                appointment.doctorName ||
                                                                "Unknown"
                                                            }

                                                        </strong>

                                                    </div>

                                                </td>


                                                {/* DEPARTMENT */}

                                                <td>

                                                    {
                                                        appointment.departmentName ||
                                                        appointment.department?.departmentName ||
                                                        "Not assigned"
                                                    }

                                                </td>


                                                {/* DATE */}

                                                <td>

                                                    {
                                                        appointment.appointmentDate ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* TIME */}

                                                <td>

                                                    {
                                                        appointment.appointmentTime ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* REASON */}

                                                <td>

                                                    <span className="reason-text">

                                                        {
                                                            appointment.reason ||
                                                            "Not specified"
                                                        }

                                                    </span>

                                                </td>


                                                {/* STATUS */}

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


                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* =================================
                            TABLE FOOTER / PAGINATION
                        ================================= */}

                        <div className="table-pagination">


                            {/* TOTAL APPOINTMENTS */}

                            <div className="pagination-total">

                                <strong>
                                    Today's Appointments :
                                </strong>

                                <span>
                                    {totalAppointments}
                                </span>

                            </div>


                            {/* PAGINATION CONTROLS */}

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
                                        currentPage ===
                                            totalPages ||
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


export default AdminAppointments;