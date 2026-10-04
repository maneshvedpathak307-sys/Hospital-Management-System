import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import DoctorManagementService
    from "../../../services/DoctorManagementService";

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


function ManageDoctors() {

    const navigate = useNavigate();


    /* =========================================
       STATES
    ========================================= */

    const [doctors, setDoctors] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [search, setSearch] =
        useState("");


    /* =========================================
       PAGINATION
    ========================================= */

    const [currentPage, setCurrentPage] =
        useState(1);

    const doctorsPerPage = 5;


    /* =========================================
       LOAD DOCTORS
    ========================================= */

    useEffect(() => {

        loadDoctors();

    }, []);


    const loadDoctors = async () => {

        try {

            setLoading(true);

            setError("");

            setSuccess("");


            const response =
                await DoctorManagementService
                    .getAllDoctors();


            const data =
                response?.data ||
                response ||
                [];


            setDoctors(

                Array.isArray(data)
                    ? data
                    : []

            );

        } catch (error) {

            console.error(
                "Load doctors error:",
                error
            );


            setDoctors([]);


            setError(

                error?.response?.data?.message ||

                (
                    typeof error?.response?.data === "string"
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
                    .trim()
                    .toLowerCase();


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
                    doctor.email ||
                    doctor.loginEmail ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    doctor.phone ||
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
                    doctor.department?.departmentName ||
                    doctor.department ||
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
       DELETE DOCTOR
    ========================================= */

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this doctor?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setError("");

            setSuccess("");


            /*
             * id is the actual database ID.
             *
             * It is used internally to delete
             * the correct doctor.
             */

            await DoctorManagementService
                .deleteDoctor(id);


            setSuccess(
                "Doctor deleted successfully."
            );


            /*
             * Remove deleted doctor
             * from frontend immediately.
             */

            setDoctors((previous) =>

                previous.filter(
                    (doctor) =>
                        doctor.id !== id
                )

            );


            /*
             * Check pagination after delete.
             */

            const remainingDoctors =
                filteredDoctors.filter(
                    (doctor) =>
                        doctor.id !== id
                );


            const remainingPages =
                Math.ceil(
                    remainingDoctors.length /
                    doctorsPerPage
                );


            /*
             * If current page becomes empty,
             * move to previous available page.
             */

            if (
                currentPage >
                    remainingPages &&
                remainingPages > 0
            ) {

                setCurrentPage(
                    remainingPages
                );

            }

        } catch (error) {

            console.error(
                "Delete doctor error:",
                error
            );


            setError(

                error?.response?.data?.message ||

                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to delete doctor."
                )

            );

        }

    };


    /* =========================================
       VIEW DOCTOR
    ========================================= */

    const handleView = (id) => {

        navigate(
            `/admin/doctors/${id}`
        );

    };


    /* =========================================
       EDIT DOCTOR
    ========================================= */

    const handleEdit = (id) => {

        navigate(
            `/admin/doctors/edit/${id}`
        );

    };


    /* =========================================
       ADD DOCTOR
    ========================================= */

    const handleAddDoctor = () => {

        navigate(
            "/admin/doctors/add"
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
                title="Doctors"
                subtitle="Manage hospital doctors and their information."
            />


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
                DOCTOR CARD
            ================================= */}

            <div className="management-card">


                {/* =================================
                    TOOLBAR
                ================================= */}

                <div className="table-toolbar">


                    {/* SEARCH */}

                    <SearchBox
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search doctors..."
                    />


                    {/* ADD DOCTOR */}

                    <button
                        type="button"
                        className="primary-button"
                        onClick={
                            handleAddDoctor
                        }
                    >

                        ＋ Add Doctor

                    </button>


                </div>


                {/* =================================
                    EMPTY STATE
                ================================= */}

                {filteredDoctors.length === 0 ? (

                    <div className="empty-state">


                        <div className="empty-icon">

                            👨‍⚕️

                        </div>


                        <h3>

                            No doctors found

                        </h3>


                        <p>

                            {search

                                ? "Try another search."

                                : "No doctors have been added yet."

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

                                            Doctor

                                        </th>


                                        <th>

                                            Email

                                        </th>


                                        <th>

                                            Phone

                                        </th>


                                        <th>

                                            Specialization

                                        </th>


                                        <th>

                                            Department

                                        </th>


                                        <th>

                                            Status

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


                                    {currentDoctors.map(
                                        (doctor, index) => (

                                            <tr
                                                key={
                                                    doctor.id ||
                                                    index
                                                }
                                            >


                                                {/* =================================
                                                    SERIAL NUMBER
                                                ================================= */}

                                                <td>

                                                    <strong>

                                                        {
                                                            startIndex +
                                                            index +
                                                            1
                                                        }

                                                    </strong>

                                                </td>


                                                {/* =================================
                                                    DOCTOR
                                                ================================= */}

                                                <td>

                                                    <strong>

                                                        {
                                                            doctor.doctorName ||
                                                            doctor.name ||
                                                            "Unknown Doctor"
                                                        }

                                                    </strong>

                                                </td>


                                                {/* =================================
                                                    EMAIL
                                                ================================= */}

                                                <td>

                                                    {
                                                        doctor.email ||
                                                        doctor.loginEmail ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* =================================
                                                    PHONE
                                                ================================= */}

                                                <td>

                                                    {
                                                        doctor.phone ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* =================================
                                                    SPECIALIZATION
                                                ================================= */}

                                                <td>

                                                    {
                                                        doctor.specialization ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* =================================
                                                    DEPARTMENT
                                                ================================= */}

                                                <td>

                                                    {
                                                        doctor.departmentName ||
                                                        doctor.department?.departmentName ||
                                                        doctor.department ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* =================================
                                                    STATUS
                                                ================================= */}

                                                <td>

                                                    <StatusBadge
                                                        status={
                                                            doctor.status ||

                                                            (
                                                                doctor.active
                                                                    ? "ACTIVE"
                                                                    : "INACTIVE"
                                                            )
                                                        }
                                                    />

                                                </td>


                                                {/* =================================
                                                    ACTIONS
                                                ================================= */}

                                                <td>

                                                    <div className="action-buttons">


                                                        {/* VIEW */}

                                                        <button
                                                            type="button"
                                                            className="view-button"
                                                            title="View doctor"
                                                            onClick={() =>
                                                                handleView(
                                                                    doctor.id
                                                                )
                                                            }
                                                        >

                                                            👁️

                                                        </button>


                                                        {/* EDIT */}

                                                        <button
                                                            type="button"
                                                            className="edit-button"
                                                            title="Edit doctor"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    doctor.id
                                                                )
                                                            }
                                                        >

                                                            ✏️

                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            className="delete-button"
                                                            title="Delete doctor"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    doctor.id
                                                                )
                                                            }
                                                        >

                                                            🗑️

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
                            PAGINATION
                        ================================= */}

                        <div className="table-pagination">


                            {/* =================================
                                TOTAL DOCTORS
                            ================================= */}

                            <div className="pagination-total">

                                <strong>

                                    Total Doctors :

                                </strong>


                                <span>

                                    {totalDoctors}

                                </span>

                            </div>


                            {/* =================================
                                PAGINATION CONTROLS
                            ================================= */}

                            <div className="pagination-controls">


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


export default ManageDoctors;