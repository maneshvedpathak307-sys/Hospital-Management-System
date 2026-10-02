import React, {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import api from "../../../services/api";

import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";
import EmptyState from "../../../components/common/EmptyState";
import SearchBox from "../../../components/common/SearchBox";
import StatusBadge from "../../../components/common/StatusBadge";

import "../../../styles/tables.css";


function MyAppointments() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [appointments, setAppointments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [deletingId, setDeletingId] =
        useState(null);


    // =====================================================
    // PAGINATION
    // =====================================================

    const [currentPage, setCurrentPage] =
        useState(1);

    const appointmentsPerPage = 5;


    // =====================================================
    // TODAY
    // =====================================================

    const getToday = () => {

        const now = new Date();

        const year =
            now.getFullYear();

        const month =
            String(
                now.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                now.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    const today = getToday();


    // =====================================================
    // CHECK PREVIOUS APPOINTMENT
    // =====================================================

    const isPreviousAppointment = (
        appointment
    ) => {

        if (
            !appointment ||
            !appointment.appointmentDate
        ) {

            return false;

        }

        return (
            appointment.appointmentDate <
            today
        );

    };


    // =====================================================
    // LOAD APPOINTMENTS
    // =====================================================

    useEffect(() => {

        fetchAppointments();

    }, []);


    // =====================================================
    // FETCH APPOINTMENTS
    // =====================================================

    const fetchAppointments = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await api.get(
                    "/patient/appointments"
                );


            const data =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            setAppointments(data);


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

    };


    // =====================================================
    // SEARCH
    // =====================================================

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
                        appointment.doctorName || ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    String(
                        appointment.departmentName || ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    String(
                        appointment.reason || ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    String(
                        appointment.status || ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    String(
                        appointment.appointmentDate || ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                );

            }
        );


    // =====================================================
    // UPCOMING + TODAY
    // =====================================================

    const upcomingAppointments =
        filteredAppointments.filter(
            (appointment) => {

                return (
                    appointment.appointmentDate >=
                    today
                );

            }
        );


    // =====================================================
    // PREVIOUS
    // =====================================================

    const previousAppointments =
        filteredAppointments.filter(
            (appointment) => {

                return isPreviousAppointment(
                    appointment
                );

            }
        );


    // =====================================================
    // PAGINATION
    // =====================================================

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


    // =====================================================
    // RESET PAGE WHEN SEARCH CHANGES
    // =====================================================

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    // =====================================================
    // FIX PAGE AFTER DELETE
    // =====================================================

    useEffect(() => {

        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {

            setCurrentPage(
                totalPages
            );

        }

    }, [
        totalPages,
        currentPage
    ]);


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
    // BOOK APPOINTMENT
    // =====================================================

    const handleBookAppointment = () => {

        navigate(
            "/patient/appointments/book"
        );

    };


    // =====================================================
    // VIEW APPOINTMENT
    // =====================================================

    const handleViewAppointment = (id) => {

        navigate(
            `/patient/appointments/${id}`
        );

    };


    // =====================================================
    // DELETE APPOINTMENT
    // =====================================================
    //
    // IMPORTANT:
    // Patient can remove ANY visible appointment:
    //
    // Previous
    // Today
    // Upcoming
    //
    // The backend hides the appointment only for
    // the logged-in patient.
    //
    // =====================================================

    const handleDeleteAppointment = async (
        appointment
    ) => {

        if (
            !appointment ||
            !appointment.id
        ) {

            setError(
                "Appointment ID not found."
            );

            return;

        }


        // =================================================
        // CONFIRM
        // =================================================

        const confirmed =
            window.confirm(
                "Are you sure you want to remove this appointment from your appointment list?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setDeletingId(
                appointment.id
            );

            setError("");


            // =================================================
            // BACKEND
            // =================================================

            await api.delete(
                `/patient/appointments/${appointment.id}`
            );


            // =================================================
            // REMOVE FROM FRONTEND STATE
            // =================================================

            setAppointments(
                (previousAppointments) =>
                    previousAppointments.filter(
                        (item) =>
                            item.id !==
                            appointment.id
                    )
            );


        } catch (error) {

            console.error(
                "Error deleting appointment:",
                error
            );


            setError(
                error.response?.data?.message ||
                (
                    typeof error.response?.data === "string"
                        ? error.response.data
                        : "Unable to remove appointment."
                )
            );

        } finally {

            setDeletingId(null);

        }

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (dateString) => {

        if (!dateString) {

            return "-";

        }


        const date =
            new Date(
                `${dateString}T00:00:00`
            );


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // =====================================================
    // FORMAT TIME
    // =====================================================

    const formatTime = (timeString) => {

        if (!timeString) {

            return "-";

        }


        const [hours, minutes] =
            timeString
                .split(":")
                .map(Number);


        const date =
            new Date();


        date.setHours(
            hours,
            minutes,
            0,
            0
        );


        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

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
    // RETURN
    // =====================================================

    return (

        <div className="page-container">

            <PageHeader
                title="My Appointments"
                subtitle="View and manage your hospital appointments."
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
                MAIN CARD
            ================================================= */}

            <div className="management-card">


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <div
                    className="management-toolbar"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px",
                        width: "100%"
                    }}
                >

                    <div
                        style={{
                            width: "320px"
                        }}
                    >

                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder="Search appointments..."
                        />

                    </div>


                    <button
                        type="button"
                        className="primary-button"
                        onClick={
                            handleBookAppointment
                        }
                    >

                        + Book Appointment

                    </button>

                </div>


                {/* =================================================
                    SEARCH RESULT
                ================================================= */}

                {search && (

                    <div className="bill-search-result">

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


                {/* =================================================
                    EMPTY
                ================================================= */}

                {filteredAppointments.length === 0 ? (

                    <EmptyState
                        icon="📅"
                        title="No appointments found"
                        message={
                            search
                                ? "Try another search."
                                : "You have not booked any appointments yet."
                        }
                    />

                ) : (

                    <>


                        {/* =================================================
                            SUMMARY
                        ================================================= */}

                        <div
                            style={{
                                display: "flex",
                                gap: "20px",
                                marginBottom: "20px",
                                flexWrap: "wrap"
                            }}
                        >

                            <div
                                style={{
                                    padding: "15px 20px",
                                    borderRadius: "10px",
                                    background: "#f5f9ff",
                                    border: "1px solid #dbe7f5",
                                    minWidth: "180px"
                                }}
                            >

                                <strong>
                                    Upcoming & Today
                                </strong>

                                <div
                                    style={{
                                        fontSize: "24px",
                                        fontWeight: "700",
                                        marginTop: "5px"
                                    }}
                                >

                                    {
                                        upcomingAppointments.length
                                    }

                                </div>

                            </div>


                            <div
                                style={{
                                    padding: "15px 20px",
                                    borderRadius: "10px",
                                    background: "#fafafa",
                                    border: "1px solid #e5e5e5",
                                    minWidth: "180px"
                                }}
                            >

                                <strong>
                                    Previous
                                </strong>

                                <div
                                    style={{
                                        fontSize: "24px",
                                        fontWeight: "700",
                                        marginTop: "5px"
                                    }}
                                >

                                    {
                                        previousAppointments.length
                                    }

                                </div>

                            </div>


                            <div
                                style={{
                                    padding: "15px 20px",
                                    borderRadius: "10px",
                                    background: "#fafafa",
                                    border: "1px solid #e5e5e5",
                                    minWidth: "180px"
                                }}
                            >

                                <strong>
                                    Total
                                </strong>

                                <div
                                    style={{
                                        fontSize: "24px",
                                        fontWeight: "700",
                                        marginTop: "5px"
                                    }}
                                >

                                    {
                                        filteredAppointments.length
                                    }

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            TABLE
                        ================================================= */}

                        <div className="table-wrapper">

                            <table className="data-table">

                                <thead>

                                    <tr>

                                        <th>S.No.</th>

                                        <th>DOCTOR</th>

                                        <th>DEPARTMENT</th>

                                        <th>DATE</th>

                                        <th>TIME</th>

                                        <th>REASON</th>

                                        <th>STATUS</th>

                                        <th>ACTION</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {currentAppointments.map(
                                        (
                                            appointment,
                                            index
                                        ) => {

                                            const isPast =
                                                isPreviousAppointment(
                                                    appointment
                                                );


                                            const isToday =
                                                appointment.appointmentDate ===
                                                today;


                                            const serialNumber =
                                                startIndex +
                                                index +
                                                1;


                                            return (

                                                <tr
                                                    key={
                                                        appointment.id ||
                                                        index
                                                    }
                                                    style={
                                                        isPast
                                                            ? {
                                                                opacity: 0.75
                                                            }
                                                            : {}
                                                    }
                                                >


                                                    {/* S.NO. */}

                                                    <td>

                                                        <strong>
                                                            {
                                                                serialNumber
                                                            }
                                                        </strong>

                                                    </td>


                                                    {/* DOCTOR */}

                                                    <td>

                                                        <strong>

                                                            {
                                                                appointment.doctorName ||
                                                                "Doctor"
                                                            }

                                                        </strong>

                                                    </td>


                                                    {/* DEPARTMENT */}

                                                    <td>

                                                        {
                                                            appointment.departmentName ||
                                                            "-"
                                                        }

                                                    </td>


                                                    {/* DATE */}

                                                    <td>

                                                        <div>

                                                            {
                                                                formatDate(
                                                                    appointment.appointmentDate
                                                                )
                                                            }

                                                        </div>


                                                        {isToday && (

                                                            <small
                                                                style={{
                                                                    fontWeight: "600"
                                                                }}
                                                            >

                                                                Today

                                                            </small>

                                                        )}


                                                        {isPast && (

                                                            <small
                                                                style={{
                                                                    opacity: 0.7
                                                                }}
                                                            >

                                                                Previous

                                                            </small>

                                                        )}

                                                    </td>


                                                    {/* TIME */}

                                                    <td>

                                                        {
                                                            formatTime(
                                                                appointment.appointmentTime
                                                            )
                                                        }

                                                    </td>


                                                    {/* REASON */}

                                                    <td>

                                                        {
                                                            appointment.reason ||
                                                            "Not specified"
                                                        }

                                                    </td>


                                                    {/* STATUS */}

                                                    <td>

                                                        <StatusBadge
                                                            status={
                                                                appointment.status
                                                            }
                                                        />

                                                    </td>


                                                    {/* ACTION */}

                                                    <td>

                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                gap: "8px",
                                                                alignItems: "center",
                                                                flexWrap: "wrap"
                                                            }}
                                                        >

                                                            {/* VIEW */}

                                                            <button
                                                                type="button"
                                                                className="secondary-button"
                                                                onClick={() =>
                                                                    handleViewAppointment(
                                                                        appointment.id
                                                                    )
                                                                }
                                                            >

                                                                View

                                                            </button>


                                                            {/* =================================================
                                                                DELETE
                                                            =================================================
                                                            
                                                            Delete is now available
                                                            for every appointment.
                                                            ================================================= */}

                                                            <button
                                                                type="button"
                                                                className="secondary-button"
                                                                onClick={() =>
                                                                    handleDeleteAppointment(
                                                                        appointment
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingId ===
                                                                    appointment.id
                                                                }
                                                                style={{
                                                                    color: "#dc2626",
                                                                    borderColor: "#dc2626"
                                                                }}
                                                            >

                                                                {
                                                                    deletingId ===
                                                                    appointment.id
                                                                        ? "Removing..."
                                                                        : "Delete"
                                                                }

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            );

                                        }
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
                                    Total Appointments :
                                </strong>

                                <span>
                                    {totalAppointments}
                                </span>

                            </div>


                            <div className="pagination-controls">

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


export default MyAppointments;