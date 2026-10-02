import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DepartmentService
    from "../../../services/DepartmentService";

import PageHeader
    from "../../../components/common/PageHeader";

import Loading
    from "../../../components/common/Loading";

import SearchBox
    from "../../../components/common/SearchBox";

import "../../../styles/forms.css";
import "../../../styles/tables.css";


function Department() {

    const navigate = useNavigate();


    /* =========================================
       STATES
    ========================================= */

    const [departments, setDepartments] =
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

    const departmentsPerPage = 5;


    /* =========================================
       LOAD DEPARTMENTS
    ========================================= */

    useEffect(() => {

        loadDepartments();

    }, []);


    const loadDepartments = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await DepartmentService
                    .getAllDepartments();

            const data =
                response?.data ||
                response ||
                [];

            setDepartments(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Load departments error:",
                error
            );

            setDepartments([]);

            setError(
                error?.response?.data?.message ||

                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to load departments."
                )
            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================================
       SEARCH
    ========================================= */

    const filteredDepartments =
        departments.filter((department) => {

            const searchText =
                search
                    .trim()
                    .toLowerCase();

            if (!searchText) {

                return true;

            }

            return (

                String(
                    department.departmentName ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    department.description ||
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

    const totalDepartments =
        filteredDepartments.length;

    const totalPages =
        Math.ceil(
            totalDepartments /
            departmentsPerPage
        );

    const startIndex =
        (currentPage - 1) *
        departmentsPerPage;

    const endIndex =
        startIndex +
        departmentsPerPage;

    const currentDepartments =
        filteredDepartments.slice(
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
       DELETE DEPARTMENT
    ========================================= */

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this department?"
            );

        if (!confirmed) {

            return;

        }

        try {

            setError("");
            setSuccess("");

            /*
             * IMPORTANT:
             *
             * id is the actual database ID.
             * It is used only internally for
             * deleting the correct department.
             *
             * It is NOT displayed in the table.
             */

            await DepartmentService
                .deleteDepartment(id);


            setSuccess(
                "Department deleted successfully."
            );


            /*
             * Remove deleted department
             * from frontend immediately.
             */

            setDepartments((previous) =>

                previous.filter(
                    (department) =>
                        department.id !== id
                )

            );


            /*
             * Check pagination after delete.
             */

            const remainingDepartments =
                filteredDepartments.filter(
                    (department) =>
                        department.id !== id
                );

            const remainingPages =
                Math.ceil(
                    remainingDepartments.length /
                    departmentsPerPage
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
                "Delete department error:",
                error
            );

            setError(
                error?.response?.data?.message ||

                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to delete department."
                )
            );

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
       PAGE
    ========================================= */

    return (

        <div className="page-container">


            {/* =================================
                PAGE HEADER
            ================================= */}

            <PageHeader
                title="Departments"
                subtitle="Manage hospital departments."
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
                DEPARTMENT CARD
            ================================= */}

            <div className="management-card">


                {/* =================================
                    TOOLBAR
                ================================= */}

                <div className="table-toolbar">

                    {/* SEARCH */}

                    <SearchBox
                        value={search}
                        onChange={setSearch}
                        placeholder="Search departments..."
                    />


                    {/* ADD DEPARTMENT */}

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            navigate(
                                "/admin/departments/add"
                            )
                        }
                    >

                        ＋ Add Department

                    </button>

                </div>


                {/* =================================
                    EMPTY STATE
                ================================= */}

                {filteredDepartments.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            🏢
                        </div>

                        <h3>
                            No departments found
                        </h3>

                        <p>

                            {search
                                ? "Try another search."
                                : "No departments have been added yet."
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

                                <thead>

                                    <tr>

                                        {/* CHANGED:
                                            ID → S.No.
                                        */}

                                        <th>
                                            S.No.
                                        </th>

                                        <th>
                                            Department Name
                                        </th>

                                        <th>
                                            Description
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {currentDepartments.map(
                                        (department, index) => (

                                            <tr
                                                key={
                                                    department.id
                                                }
                                            >


                                                {/* =================================
                                                    SERIAL NUMBER
                                                =================================
                                                
                                                This is NOT the MySQL ID.

                                                Example:

                                                Page 1:
                                                1
                                                2
                                                3
                                                4
                                                5

                                                Page 2:
                                                6
                                                7
                                                8
                                                9
                                                10

                                                If department #2 is deleted,
                                                the displayed numbers become:

                                                1
                                                2
                                                3
                                                4

                                                automatically.
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
                                                    DEPARTMENT NAME
                                                ================================= */}

                                                <td>

                                                    <strong>

                                                        {
                                                            department.departmentName
                                                        }

                                                    </strong>

                                                </td>


                                                {/* =================================
                                                    DESCRIPTION
                                                ================================= */}

                                                <td>

                                                    {
                                                        department.description ||
                                                        "No description"
                                                    }

                                                </td>


                                                {/* =================================
                                                    ACTIONS
                                                ================================= */}

                                                <td>

                                                    <div className="action-buttons">


                                                        {/* EDIT */}

                                                        <button
                                                            type="button"
                                                            className="edit-button"
                                                            title="Edit department"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/departments/edit/${department.id}`
                                                                )
                                                            }
                                                        >

                                                            ✏️

                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            className="delete-button"
                                                            title="Delete department"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    department.id
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
                                TOTAL DEPARTMENTS
                            ================================= */}

                            <div className="pagination-total">

                                <strong>
                                    Total Departments :
                                </strong>

                                <span>
                                    {totalDepartments}
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


export default Department;