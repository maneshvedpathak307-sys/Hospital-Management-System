import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAllMedicines,
    deleteMedicine
} from "../../../services/MedicineService";

import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";
import SearchBox from "../../../components/common/SearchBox";
import EmptyState from "../../../components/common/EmptyState";

import "../../../styles/forms.css";
import "../../../styles/tables.css";


function Medicine() {

    const navigate = useNavigate();


    /* =========================================
       STATES
    ========================================= */

    const [medicines, setMedicines] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /* =========================================
       PAGINATION
    ========================================= */

    const [currentPage, setCurrentPage] =
        useState(1);

    const medicinesPerPage = 5;


    /* =========================================
       LOAD MEDICINES
    ========================================= */

    useEffect(() => {

        loadMedicines();

    }, []);


    const loadMedicines = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getAllMedicines();


            /*
             * MedicineService already returns
             * response.data
             */

            setMedicines(
                Array.isArray(response)
                    ? response
                    : []
            );


        } catch (error) {

            console.error(
                "Error loading medicines:",
                error
            );


            setMedicines([]);


            setError(
                error?.response?.data?.message ||

                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to load medicines."
                )
            );


        } finally {

            setLoading(false);

        }

    };


    /* =========================================
       DELETE MEDICINE
    ========================================= */

    const removeMedicine = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this medicine?"
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
             * id is the REAL MySQL ID.
             *
             * It is used only for deleting
             * the correct medicine.
             *
             * It is NOT displayed in the table.
             */

            await deleteMedicine(id);


            setSuccess(
                "Medicine deleted successfully."
            );


            /*
             * Reload medicines.
             *
             * After reload, S.No. is automatically
             * recalculated from the current list.
             */

            await loadMedicines();


        } catch (error) {

            console.error(
                "Delete medicine error:",
                error
            );


            setError(
                error?.response?.data?.message ||

                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to delete medicine."
                )
            );

        }

    };


    /* =========================================
       SEARCH
    ========================================= */

    const filteredMedicines =
        medicines.filter((item) => {

            const searchText =
                search
                    .trim()
                    .toLowerCase();


            if (!searchText) {

                return true;

            }


            return (

                String(
                    item.medicineName ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText)


                ||

                String(
                    item.genericName ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText)


                ||

                String(
                    item.category ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText)


                ||

                String(
                    item.dosage ||
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

    const totalMedicines =
        filteredMedicines.length;


    const totalPages =
        Math.ceil(
            totalMedicines /
            medicinesPerPage
        );


    const startIndex =
        (currentPage - 1) *
        medicinesPerPage;


    const endIndex =
        startIndex +
        medicinesPerPage;


    const currentMedicines =
        filteredMedicines.slice(
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
                HEADER
            ================================= */}

            <PageHeader
                title="Medicines"
                subtitle="Manage hospital medicines and inventory."
            />


            {/* =================================
                ALERTS
            ================================= */}

            {error && (

                <div className="page-error">

                    ⚠️ {error}

                </div>

            )}


            {success && (

                <div className="page-success">

                    ✓ {success}

                </div>

            )}


            {/* =================================
                MEDICINE LIST CARD
            ================================= */}

            <div className="management-card">


                {/* =================================
                    TOOLBAR
                ================================= */}

                <div className="table-toolbar">


                    {/* SEARCH */}

                    <SearchBox
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search medicines..."
                    />


                    {/* ADD MEDICINE */}

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            navigate(
                                "/admin/medicines/add"
                            )
                        }
                    >

                        ＋ Add Medicine

                    </button>


                </div>


                {/* =================================
                    MEDICINE TABLE
                ================================= */}

                {filteredMedicines.length === 0 ? (

                    <EmptyState
                        icon="💊"
                        title="No medicines found"
                        message={
                            search
                                ? "Try another search."
                                : "No medicines have been added yet."
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
                                            S.No.
                                        </th>

                                        <th>
                                            MEDICINE
                                        </th>

                                        <th>
                                            GENERIC NAME
                                        </th>

                                        <th>
                                            CATEGORY
                                        </th>

                                        <th>
                                            DOSAGE
                                        </th>

                                        <th>
                                            STOCK
                                        </th>

                                        <th>
                                            EXPIRY DATE
                                        </th>

                                        <th>
                                            DESCRIPTION
                                        </th>

                                        <th>
                                            ACTIONS
                                        </th>

                                    </tr>

                                </thead>


                                {/* =================================
                                    TABLE BODY
                                ================================= */}

                                <tbody>

                                    {currentMedicines.map(
                                        (item, index) => (

                                            <tr
                                                key={
                                                    item.id ||
                                                    index
                                                }
                                            >


                                                {/* =================
                                                    SERIAL NUMBER

                                                    NOT MYSQL ID
                                                ================= */}

                                                <td>

                                                    {
                                                        startIndex +
                                                        index +
                                                        1
                                                    }

                                                </td>


                                                {/* =================
                                                    MEDICINE
                                                ================= */}

                                                <td>

                                                    <strong>

                                                        {
                                                            item.medicineName
                                                        }

                                                    </strong>

                                                </td>


                                                {/* =================
                                                    GENERIC NAME
                                                ================= */}

                                                <td>

                                                    {
                                                        item.genericName ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* =================
                                                    CATEGORY
                                                ================= */}

                                                <td>

                                                    {
                                                        item.category ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* =================
                                                    DOSAGE
                                                ================= */}

                                                <td>

                                                    {
                                                        item.dosage ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* =================
                                                    STOCK
                                                ================= */}

                                                <td>

                                                    <span className="stock-value">

                                                        {
                                                            item.stock ??
                                                            0
                                                        }

                                                    </span>

                                                </td>


                                                {/* =================
                                                    EXPIRY DATE
                                                ================= */}

                                                <td>

                                                    {
                                                        item.expiryDate ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* =================
                                                    DESCRIPTION
                                                ================= */}

                                                <td>

                                                    <span className="description-cell">

                                                        {
                                                            item.description ||
                                                            "-"
                                                        }

                                                    </span>

                                                </td>


                                                {/* =================
                                                    ACTIONS
                                                ================= */}

                                                <td>

                                                    <div className="action-buttons">


                                                        {/* EDIT */}

                                                        <button
                                                            type="button"
                                                            className="edit-button"
                                                            title="Edit medicine"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/medicines/edit/${item.id}`
                                                                )
                                                            }
                                                        >

                                                            ✏️

                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            className="delete-button"
                                                            title="Delete medicine"
                                                            onClick={() =>
                                                                removeMedicine(
                                                                    item.id
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
                            TABLE FOOTER
                        ================================= */}

                        <div className="table-pagination">


                            {/* =================================
                                TOTAL MEDICINES
                            ================================= */}

                            <div className="pagination-total">

                                <strong>
                                    Total Medicines :
                                </strong>

                                <span>
                                    {totalMedicines}
                                </span>

                            </div>


                            {/* =================================
                                PAGINATION CONTROLS
                            ================================= */}

                            <div className="pagination-controls">


                                {/* =============================
                                    PREVIOUS
                                ============================= */}

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


                                {/* =============================
                                    PAGE NUMBERS
                                ============================= */}

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


                                {/* =============================
                                    PAGE INFO
                                ============================= */}

                                <span className="pagination-info">

                                    Page {currentPage} of{" "}
                                    {Math.max(
                                        totalPages,
                                        1
                                    )}

                                </span>


                                {/* =============================
                                    NEXT
                                ============================= */}

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


export default Medicine;