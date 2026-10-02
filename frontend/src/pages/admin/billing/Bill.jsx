import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    getAllBills,
    deleteBill,
    downloadInvoice
} from "../../../services/BillService";

import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";
import EmptyState from "../../../components/common/EmptyState";
import SearchBox from "../../../components/common/SearchBox";
import StatusBadge from "../../../components/common/StatusBadge";

import "../../../styles/forms.css";
import "../../../styles/tables.css";


function Bill() {

    const navigate = useNavigate();


    const [bills, setBills] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [downloadingId, setDownloadingId] =
        useState(null);

    const [currentPage, setCurrentPage] =
        useState(1);

    const billsPerPage = 5;


    // =====================================================
    // TODAY'S DATE
    // =====================================================

    const getTodayDate = () => {

        const today =
            new Date();

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


    // =====================================================
    // LOAD BILLS
    // =====================================================

    const loadBills = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getAllBills();


            const allBills =
                Array.isArray(response)
                    ? response
                    : [];


            // =================================================
            // FILTER ONLY TODAY'S BILLS
            // =================================================

            const today =
                getTodayDate();


            const todayBills =
                allBills.filter(
                    (bill) =>
                        bill.billDate === today
                );


            setBills(
                todayBills
            );


        } catch (error) {

            console.error(
                "Load bills error:",
                error
            );

            setBills([]);

            setError(
                error?.response?.data?.message ||
                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to load bills."
                )
            );

        } finally {

            setLoading(false);

        }

    }, []);


    // =====================================================
    // LOAD BILLS ON PAGE LOAD
    // =====================================================

    useEffect(() => {

        loadBills();

    }, [
        loadBills
    ]);


    // =====================================================
    // DELETE BILL
    // =====================================================

    const removeBill = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this bill?"
            );

        if (!confirmed) {

            return;

        }


        try {

            setError("");
            setSuccess("");

            await deleteBill(id);


            setSuccess(
                "Bill deleted successfully."
            );


            await loadBills();


        } catch (error) {

            console.error(
                "Delete bill error:",
                error
            );


            setError(
                error?.response?.data?.message ||
                (
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Unable to delete bill."
                )
            );

        }

    };


    // =====================================================
    // DOWNLOAD INVOICE
    // =====================================================

    const handleDownloadInvoice =
        async (bill) => {

            try {

                setError("");
                setSuccess("");

                setDownloadingId(
                    bill.id
                );


                const response =
                    await downloadInvoice(
                        bill.id
                    );


                const blob =
                    new Blob(
                        [response.data],
                        {
                            type:
                                "application/pdf"
                        }
                    );


                const url =
                    window.URL.createObjectURL(
                        blob
                    );


                const link =
                    document.createElement("a");


                link.href =
                    url;


                const patientName =
                    (
                        bill.patientName ||
                        `Patient_${bill.patientId || bill.id}`
                    )
                        .toString()
                        .trim()
                        .replace(
                            /[^a-zA-Z0-9]+/g,
                            "_"
                        );


                link.download =
                    `Invoice_${bill.id}_${patientName}.pdf`;


                document.body.appendChild(
                    link
                );


                link.click();


                link.remove();


                window.URL.revokeObjectURL(
                    url
                );


                setSuccess(
                    "Invoice downloaded successfully."
                );


            } catch (error) {

                console.error(
                    "Download invoice error:",
                    error
                );


                let message =
                    "Unable to download invoice.";


                if (
                    typeof error?.response?.data ===
                    "string"
                ) {

                    message =
                        error.response.data;

                } else if (
                    error?.response?.data?.message
                ) {

                    message =
                        error.response.data.message;

                }


                setError(
                    message
                );


            } finally {

                setDownloadingId(
                    null
                );

            }

        };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredBills =
        bills.filter((item) => {

            const searchText =
                search
                    .trim()
                    .toLowerCase();


            if (!searchText) {

                return true;

            }


            return (

                String(
                    item.patientName || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    item.doctorName || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    item.treatment || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    item.paymentStatus || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    item.appointmentId || ""
                )
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    // =====================================================
    // RESET PAGE
    // =====================================================

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalBills =
        filteredBills.length;


    const totalPages =
        Math.ceil(
            totalBills /
            billsPerPage
        );


    const startIndex =
        (currentPage - 1) *
        billsPerPage;


    const endIndex =
        startIndex +
        billsPerPage;


    const currentBills =
        filteredBills.slice(
            startIndex,
            endIndex
        );


    // =====================================================
    // PREVIOUS
    // =====================================================

    const handlePreviousPage = () => {

        if (currentPage > 1) {

            setCurrentPage(
                currentPage - 1
            );

        }

    };


    // =====================================================
    // NEXT
    // =====================================================

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


    return (

        <div className="page-container">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <PageHeader
                title="Billing"
                subtitle="Manage today's patient hospital bills."
            />


            {/* =================================================
                ALERTS
            ================================================= */}

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


            {/* =================================================
                BILL CARD
            ================================================= */}

            <div className="management-card">


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <div className="table-toolbar">


                    {/* SEARCH */}

                    <SearchBox
                        value={search}
                        onChange={(value) =>
                            setSearch(
                                value?.target
                                    ? value.target.value
                                    : value
                            )
                        }
                        placeholder="Search today's bills..."
                    />


                    {/* ADD BILL */}

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            navigate(
                                "/admin/billing/add"
                            )
                        }
                    >

                        ＋ Add Bill

                    </button>


                </div>


                {/* =================================================
                    TODAY INFORMATION
                ================================================= */}

                <div
                    style={{
                        marginBottom: "16px",
                        padding: "10px 14px",
                        fontSize: "14px"
                    }}
                >

                    <strong>
                        Today's Bills
                    </strong>

                    <span
                        style={{
                            marginLeft: "8px"
                        }}
                    >
                        ({getTodayDate()})
                    </span>

                </div>


                {/* =================================================
                    EMPTY
                ================================================= */}

                {filteredBills.length === 0 ? (

                    <EmptyState
                        icon="💳"
                        title="No bills found"
                        message={
                            search
                                ? "Try another search."
                                : "No bills have been created today."
                        }
                    />

                ) : (

                    <>


                        {/* =================================================
                            TABLE
                        ================================================= */}

                        <div className="table-wrapper">

                            <table className="data-table">


                                {/* TABLE HEADER */}

                                <thead>

                                    <tr>

                                        {/* SERIAL NUMBER */}

                                        <th>
                                            S.No.
                                        </th>

                                        <th>
                                            PATIENT
                                        </th>

                                        <th>
                                            DOCTOR
                                        </th>

                                        <th>
                                            APPOINTMENT
                                        </th>

                                        <th>
                                            TREATMENT
                                        </th>

                                        <th>
                                            CONSULTATION
                                        </th>

                                        <th>
                                            MEDICINE
                                        </th>

                                        <th>
                                            TESTS
                                        </th>

                                        <th>
                                            TOTAL
                                        </th>

                                        <th>
                                            STATUS
                                        </th>

                                        <th>
                                            BILL DATE
                                        </th>

                                        <th>
                                            ACTIONS
                                        </th>

                                    </tr>

                                </thead>


                                {/* TABLE BODY */}

                                <tbody>

                                    {currentBills.map(
                                        (item, index) => (

                                            <tr
                                                key={
                                                    item.id ||
                                                    index
                                                }
                                            >


                                                {/* =================================================
                                                    SERIAL NUMBER

                                                    This is only a display number.
                                                    It is NOT the MySQL ID.

                                                    Example:
                                                    Page 1 → 1, 2, 3, 4, 5
                                                    Page 2 → 6, 7, 8, 9, 10

                                                    If a bill is deleted, the
                                                    displayed numbers remain
                                                    sequential.
                                                ================================================= */}

                                                <td>

                                                    {
                                                        startIndex +
                                                        index +
                                                        1
                                                    }

                                                </td>


                                                {/* PATIENT */}

                                                <td>

                                                    <strong>

                                                        {
                                                            item.patientName ||
                                                            `Patient #${item.patientId}`
                                                        }

                                                    </strong>

                                                </td>


                                                {/* DOCTOR */}

                                                <td>

                                                    {
                                                        item.doctorName ||
                                                        `Doctor #${item.doctorId}`
                                                    }

                                                </td>


                                                {/* APPOINTMENT */}

                                                <td>

                                                    {
                                                        item.appointmentId ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* TREATMENT */}

                                                <td>

                                                    {
                                                        item.treatment ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* CONSULTATION */}

                                                <td>

                                                    ₹
                                                    {Number(
                                                        item.consultationFee ||
                                                        0
                                                    ).toFixed(2)}

                                                </td>


                                                {/* MEDICINE */}

                                                <td>

                                                    ₹
                                                    {Number(
                                                        item.medicineCharge ||
                                                        0
                                                    ).toFixed(2)}

                                                </td>


                                                {/* TESTS */}

                                                <td>

                                                    ₹
                                                    {Number(
                                                        item.testCharge ||
                                                        0
                                                    ).toFixed(2)}

                                                </td>


                                                {/* TOTAL */}

                                                <td>

                                                    <strong className="total-amount">

                                                        ₹
                                                        {Number(
                                                            item.totalAmount ||
                                                            0
                                                        ).toFixed(2)}

                                                    </strong>

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <StatusBadge
                                                        status={
                                                            item.paymentStatus ||
                                                            "PENDING"
                                                        }
                                                    />

                                                </td>


                                                {/* BILL DATE */}

                                                <td>

                                                    {
                                                        item.billDate ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* ACTIONS */}

                                                <td>

                                                    <div className="action-buttons">


                                                        {/* EDIT */}

                                                        <button
                                                            type="button"
                                                            className="edit-button"
                                                            title="Edit bill"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/billing/edit/${item.id}`
                                                                )
                                                            }
                                                        >

                                                            ✏️

                                                        </button>


                                                        {/* DOWNLOAD */}

                                                        <button
                                                            type="button"
                                                            className="download-button"
                                                            title="Download invoice"
                                                            disabled={
                                                                downloadingId ===
                                                                item.id
                                                            }
                                                            onClick={() =>
                                                                handleDownloadInvoice(
                                                                    item
                                                                )
                                                            }
                                                        >

                                                            {
                                                                downloadingId ===
                                                                item.id
                                                                    ? "⏳"
                                                                    : "📄"
                                                            }

                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            className="delete-button"
                                                            title="Delete bill"
                                                            onClick={() =>
                                                                removeBill(
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


                        {/* =================================================
                            PAGINATION
                        ================================================= */}

                        <div className="table-pagination">


                            {/* TOTAL */}

                            <div className="pagination-total">

                                <strong>
                                    Today's Bills :
                                </strong>

                                <span>
                                    {totalBills}
                                </span>

                            </div>


                            {/* CONTROLS */}

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


                                {/* PAGE INFO */}

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


export default Bill;