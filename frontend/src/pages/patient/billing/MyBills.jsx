import React, { useEffect, useState } from "react";

import api from "../../../services/api";

import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";
import EmptyState from "../../../components/common/EmptyState";
import SearchBox from "../../../components/common/SearchBox";
import StatusBadge from "../../../components/common/StatusBadge";

import "../../../styles/dashboard.css";
import "../../../styles/tables.css";


function MyBills() {

    const [bills, setBills] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [selectedBill, setSelectedBill] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("");

    const [paying, setPaying] = useState(false);

    // Card fields are frontend-only.
    // They are NOT sent to backend.
    const [cardNumber, setCardNumber] = useState("");

    const [cardHolderName, setCardHolderName] = useState("");

    const [expiryDate, setExpiryDate] = useState("");

    const [cvv, setCvv] = useState("");

    const billsPerPage = 5;


    // =====================================================
    // LOAD BILLS
    // =====================================================

    useEffect(() => {

        fetchBills();

    }, []);


    const fetchBills = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await api.get("/patient/bills");

            setBills(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Error loading bills:",
                error
            );

            setBills([]);

            setError(
                error.response?.data?.message ||
                (
                    typeof error.response?.data === "string"
                        ? error.response.data
                        : "Unable to load bills."
                )
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredBills =
        bills.filter((bill) => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();

            if (!searchText) {
                return true;
            }

            return (

                String(bill.treatment || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(bill.billDate || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(bill.paymentStatus || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(bill.paymentMethod || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(bill.doctorName || "")
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    // =====================================================
    // RESET PAGE WHEN SEARCH CHANGES
    // =====================================================

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    // =====================================================
    // AMOUNT HELPER
    // =====================================================

    const getBillAmount = (bill) => {

        return Number(
            bill.totalAmount || 0
        );

    };


    // =====================================================
    // TOTAL AMOUNT
    // =====================================================

    const totalAmount =
        bills.reduce(
            (total, bill) =>
                total +
                getBillAmount(bill),
            0
        );


    // =====================================================
    // PENDING AMOUNT
    // =====================================================

    const pendingAmount =
        bills.reduce(
            (total, bill) => {

                const status =
                    String(
                        bill.paymentStatus || ""
                    ).toUpperCase();

                if (status === "PENDING") {

                    return (
                        total +
                        getBillAmount(bill)
                    );

                }

                return total;

            },
            0
        );


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

        if (currentPage < totalPages) {

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
    // OPEN PAYMENT MODAL
    // =====================================================

    const handlePayClick = (bill) => {

        setSelectedBill(bill);

        setPaymentMethod("");

        setCardNumber("");

        setCardHolderName("");

        setExpiryDate("");

        setCvv("");

        setError("");

        setSuccess("");

    };


    // =====================================================
    // SELECT PAYMENT METHOD
    // =====================================================

    const handlePaymentMethod = (method) => {

        setPaymentMethod(method);

        setError("");

        // Clear card data when leaving card payment
        if (method !== "CARD") {

            setCardNumber("");

            setCardHolderName("");

            setExpiryDate("");

            setCvv("");

        }

    };


    // =====================================================
    // CLOSE PAYMENT MODAL
    // =====================================================

    const closePaymentModal = () => {

        if (paying) {
            return;
        }

        setSelectedBill(null);

        setPaymentMethod("");

        setCardNumber("");

        setCardHolderName("");

        setExpiryDate("");

        setCvv("");

        setError("");

    };


    // =====================================================
    // CARD VALIDATION
    // =====================================================

    const validateCard = () => {

        if (paymentMethod !== "CARD") {
            return true;
        }

        if (!cardNumber.trim()) {

            setError(
                "Please enter card number."
            );

            return false;

        }

        if (!cardHolderName.trim()) {

            setError(
                "Please enter card holder name."
            );

            return false;

        }

        if (!expiryDate.trim()) {

            setError(
                "Please enter expiry date."
            );

            return false;

        }

        if (!cvv.trim()) {

            setError(
                "Please enter CVV."
            );

            return false;

        }

        return true;

    };


    // =====================================================
    // PAY BILL
    // =====================================================

    const handlePayment = async () => {

        if (!selectedBill) {
            return;
        }

        if (!paymentMethod) {

            setError(
                "Please select a payment method."
            );

            return;

        }


        // Card fields are checked only on frontend.
        // They are NEVER sent to backend.
        if (!validateCard()) {
            return;
        }


        try {

            setPaying(true);

            setError("");

            setSuccess("");


            // =================================================
            // ONLY PAYMENT METHOD IS SENT
            // =================================================

            const response =
                await api.post(
                    `/patient/bills/${selectedBill.id}/pay`,
                    {
                        paymentMethod:
                            paymentMethod
                    }
                );


            // =================================================
            // SUCCESS
            // =================================================

            setSuccess(
                response.data?.message ||
                "Bill payment successful."
            );


            // =================================================
            // CLOSE MODAL
            // =================================================

            setSelectedBill(null);

            setPaymentMethod("");

            setCardNumber("");

            setCardHolderName("");

            setExpiryDate("");

            setCvv("");


            // =================================================
            // REFRESH BILLS
            // =================================================

            await fetchBills();

        } catch (error) {

            console.error(
                "Payment error:",
                error
            );

            setError(
                error.response?.data?.message ||
                (
                    typeof error.response?.data === "string"
                        ? error.response.data
                        : "Unable to process payment."
                )
            );

        } finally {

            setPaying(false);

        }

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

        <div className="page-container my-bills-page">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="my-bills-header">

                <PageHeader
                    title="My Bills"
                    subtitle="View your hospital bills and payment information."
                />

            </div>


            {/* =========================================
                SUCCESS
            ========================================= */}

            {success && (

                <div
                    className="success-alert"
                    style={{
                        marginBottom: "20px"
                    }}
                >

                    ✅ {success}

                </div>

            )}


            {/* =========================================
                ERROR
            ========================================= */}

            {error && !selectedBill && (

                <div
                    className="error-alert"
                    style={{
                        marginBottom: "20px"
                    }}
                >

                    ⚠️ {error}

                </div>

            )}


            {/* =========================================
                SUMMARY
            ========================================= */}

            <div className="bills-stats">


                {/* TOTAL BILLS */}

                <div className="bill-stat-card">

                    <div className="bill-stat-icon bills-icon">

                        💳

                    </div>

                    <div className="bill-stat-content">

                        <span>
                            Total Bills
                        </span>

                        <h3>
                            {bills.length}
                        </h3>

                    </div>

                </div>


                {/* TOTAL AMOUNT */}

                <div className="bill-stat-card">

                    <div className="bill-stat-icon amount-icon">

                        ₹

                    </div>

                    <div className="bill-stat-content">

                        <span>
                            Total Amount
                        </span>

                        <h3>
                            ₹{totalAmount.toFixed(2)}
                        </h3>

                    </div>

                </div>


                {/* PENDING AMOUNT */}

                <div className="bill-stat-card">

                    <div className="bill-stat-icon pending-icon">

                        ⏳

                    </div>

                    <div className="bill-stat-content">

                        <span>
                            Pending Amount
                        </span>

                        <h3>
                            ₹{pendingAmount.toFixed(2)}
                        </h3>

                    </div>

                </div>

            </div>


            {/* =========================================
                BILL HISTORY
            ========================================= */}

            <div className="management-card bills-history-card">


                {/* =====================================
                    TOOLBAR
                ===================================== */}

                <div
                    className="bills-toolbar"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px",
                        width: "100%"
                    }}
                >

                    <div
                        className="bills-search"
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
                            placeholder="Search bills..."
                        />

                    </div>


                    <div
                        className="pagination-total"
                        style={{
                            marginLeft: "auto"
                        }}
                    >

                        <strong>
                            Total Bills :
                        </strong>

                        <span>
                            {totalBills}
                        </span>

                    </div>

                </div>


                {/* =====================================
                    SEARCH RESULT
                ===================================== */}

                {search && (

                    <div className="bill-search-result">

                        Showing{" "}

                        <strong>
                            {filteredBills.length}
                        </strong>{" "}

                        result
                        {filteredBills.length !== 1
                            ? "s"
                            : ""}{" "}

                        for "

                        <strong>
                            {search}
                        </strong>

                        "

                    </div>

                )}


                {/* =====================================
                    EMPTY
                ===================================== */}

                {filteredBills.length === 0 ? (

                    <div className="bills-empty">

                        <EmptyState
                            icon="💳"
                            title="No bills found"
                            message={
                                search
                                    ? "Try another search."
                                    : "You do not have any hospital bills yet."
                            }
                        />

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

                                        {/* SR NO */}

                                        <th>
                                            S. No.
                                        </th>

                                        <th>
                                            Bill Date
                                        </th>

                                        <th>
                                            Treatment
                                        </th>

                                        <th>
                                            Doctor
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Payment Method
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Payment Date
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {currentBills.map(
                                        (bill, index) => {

                                            const status =
                                                String(
                                                    bill.paymentStatus || ""
                                                ).toUpperCase();


                                            // =================================================
                                            // SERIAL NUMBER
                                            // =================================================
                                            // Page 1:
                                            // 1, 2, 3, 4, 5
                                            //
                                            // Page 2:
                                            // 6, 7, 8, 9, 10
                                            // =================================================

                                            const serialNumber =
                                                startIndex +
                                                index +
                                                1;


                                            return (

                                                <tr
                                                    key={
                                                        bill.id ||
                                                        index
                                                    }
                                                >


                                                    {/* =================================
                                                        SR NO
                                                    ================================= */}

                                                    <td>

                                                        <strong>
                                                            {serialNumber}
                                                        </strong>

                                                    </td>


                                                    {/* =================================
                                                        BILL DATE
                                                    ================================= */}

                                                    <td>

                                                        {
                                                            bill.billDate ||
                                                            "-"
                                                        }

                                                    </td>


                                                    {/* =================================
                                                        TREATMENT
                                                    ================================= */}

                                                    <td>

                                                        {
                                                            bill.treatment ||
                                                            "Hospital Service"
                                                        }

                                                    </td>


                                                    {/* =================================
                                                        DOCTOR
                                                    ================================= */}

                                                    <td>

                                                        {
                                                            bill.doctorName ||
                                                            "-"
                                                        }

                                                    </td>


                                                    {/* =================================
                                                        AMOUNT
                                                    ================================= */}

                                                    <td>

                                                        <strong className="bill-amount">

                                                            ₹
                                                            {getBillAmount(
                                                                bill
                                                            ).toFixed(2)}

                                                        </strong>

                                                    </td>


                                                    {/* =================================
                                                        PAYMENT METHOD
                                                    ================================= */}

                                                    <td>

                                                        {
                                                            bill.paymentMethod ||
                                                            "-"
                                                        }

                                                    </td>


                                                    {/* =================================
                                                        STATUS
                                                    ================================= */}

                                                    <td>

                                                        <StatusBadge
                                                            status={
                                                                bill.paymentStatus ||
                                                                "PENDING"
                                                            }
                                                        />

                                                    </td>


                                                    {/* =================================
                                                        PAYMENT DATE
                                                    ================================= */}

                                                    <td>

                                                        {
                                                            bill.paymentDate ||
                                                            "-"
                                                        }

                                                    </td>


                                                    {/* =================================
                                                        ACTION
                                                    ================================= */}

                                                    <td>

                                                        {status === "PENDING" ? (

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handlePayClick(
                                                                        bill
                                                                    )
                                                                }
                                                                style={{
                                                                    padding: "8px 16px",
                                                                    border: "none",
                                                                    borderRadius: "6px",
                                                                    cursor: "pointer",
                                                                    fontWeight: "600"
                                                                }}
                                                            >

                                                                💳 Pay Now

                                                            </button>

                                                        ) : status === "PAID" ? (

                                                            <span
                                                                style={{
                                                                    fontWeight: "600"
                                                                }}
                                                            >

                                                                ✓ Paid

                                                            </span>

                                                        ) : (

                                                            <span>
                                                                -
                                                            </span>

                                                        )}

                                                    </td>

                                                </tr>

                                            );

                                        }
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


            {/* =====================================================
                PAYMENT MODAL
            ===================================================== */}

            {selectedBill && (

                <div
                    onClick={(e) => {

                        if (
                            e.target === e.currentTarget &&
                            !paying
                        ) {

                            closePaymentModal();

                        }

                    }}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.55)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        padding: "20px",
                        overflowY: "auto"
                    }}
                >


                    <div
                        style={{
                            width: "500px",
                            maxWidth: "100%",
                            background: "#fff",
                            borderRadius: "14px",
                            padding: "25px",
                            boxShadow:
                                "0 15px 40px rgba(0,0,0,0.25)",
                            maxHeight: "90vh",
                            overflowY: "auto"
                        }}
                    >


                        {/* =================================
                            HEADER
                        ================================= */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "20px"
                            }}
                        >

                            <h2
                                style={{
                                    margin: 0
                                }}
                            >

                                Payment

                            </h2>


                            <button
                                type="button"
                                onClick={
                                    closePaymentModal
                                }
                                disabled={paying}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    fontSize: "22px",
                                    cursor: paying
                                        ? "not-allowed"
                                        : "pointer"
                                }}
                            >

                                ✕

                            </button>

                        </div>


                        {/* =================================
                            BILL INFORMATION
                        ================================= */}

                        <div
                            style={{
                                background: "#f7f7f7",
                                padding: "15px",
                                borderRadius: "8px",
                                marginBottom: "20px"
                            }}
                        >

                            <p>

                                <strong>
                                    Bill ID:
                                </strong>{" "}

                                #{selectedBill.id}

                            </p>


                            <p>

                                <strong>
                                    Treatment:
                                </strong>{" "}

                                {selectedBill.treatment ||
                                    "Hospital Service"}

                            </p>


                            <p
                                style={{
                                    marginBottom: 0
                                }}
                            >

                                <strong>
                                    Amount:
                                </strong>{" "}

                                <span
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "700"
                                    }}
                                >

                                    ₹
                                    {getBillAmount(
                                        selectedBill
                                    ).toFixed(2)}

                                </span>

                            </p>

                        </div>


                        {/* =================================
                            ERROR
                        ================================= */}

                        {error && (

                            <div
                                className="error-alert"
                                style={{
                                    marginBottom: "15px"
                                }}
                            >

                                ⚠️ {error}

                            </div>

                        )}


                        {/* =================================
                            PAYMENT METHODS
                        ================================= */}

                        <h3
                            style={{
                                marginBottom: "12px"
                            }}
                        >

                            Select Payment Method

                        </h3>


                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(3, 1fr)",
                                gap: "10px",
                                marginBottom: "20px"
                            }}
                        >


                            {/* CASH */}

                            <button
                                type="button"
                                onClick={() =>
                                    handlePaymentMethod(
                                        "CASH"
                                    )
                                }
                                disabled={paying}
                                style={{
                                    padding: "13px 8px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    background:
                                        paymentMethod === "CASH"
                                            ? "#eef7ee"
                                            : "#fff",
                                    border:
                                        paymentMethod === "CASH"
                                            ? "2px solid #28a745"
                                            : "1px solid #ccc",
                                    fontWeight: "600"
                                }}
                            >

                                💵 Cash

                            </button>


                            {/* UPI */}

                            <button
                                type="button"
                                onClick={() =>
                                    handlePaymentMethod(
                                        "UPI"
                                    )
                                }
                                disabled={paying}
                                style={{
                                    padding: "13px 8px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    background:
                                        paymentMethod === "UPI"
                                            ? "#f2edff"
                                            : "#fff",
                                    border:
                                        paymentMethod === "UPI"
                                            ? "2px solid #673ab7"
                                            : "1px solid #ccc",
                                    fontWeight: "600"
                                }}
                            >

                                📱 UPI

                            </button>


                            {/* CARD */}

                            <button
                                type="button"
                                onClick={() =>
                                    handlePaymentMethod(
                                        "CARD"
                                    )
                                }
                                disabled={paying}
                                style={{
                                    padding: "13px 8px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    background:
                                        paymentMethod === "CARD"
                                            ? "#eef5ff"
                                            : "#fff",
                                    border:
                                        paymentMethod === "CARD"
                                            ? "2px solid #1976d2"
                                            : "1px solid #ccc",
                                    fontWeight: "600"
                                }}
                            >

                                💳 Card

                            </button>

                        </div>


                        {/* =================================================
                            CASH PAYMENT
                        ================================================= */}

                        {paymentMethod === "CASH" && (

                            <div
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "10px",
                                    padding: "18px",
                                    marginBottom: "18px"
                                }}
                            >

                                <h3
                                    style={{
                                        marginTop: 0
                                    }}
                                >

                                    💵 Cash Payment

                                </h3>


                                <div
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "700",
                                        marginBottom: "15px"
                                    }}
                                >

                                    Amount

                                    <div>

                                        ₹
                                        {getBillAmount(
                                            selectedBill
                                        ).toFixed(2)}

                                    </div>

                                </div>


                                <h4>
                                    Cash Deposit Instructions
                                </h4>


                                <ol
                                    style={{
                                        paddingLeft: "20px",
                                        lineHeight: "1.8"
                                    }}
                                >

                                    <li>
                                        Visit hospital cash counter
                                    </li>

                                    <li>

                                        Provide Bill ID #
                                        {selectedBill.id}

                                    </li>

                                    <li>

                                        Pay ₹
                                        {getBillAmount(
                                            selectedBill
                                        ).toFixed(2)}

                                    </li>

                                    <li>
                                        Collect receipt
                                    </li>

                                </ol>


                                <button
                                    type="button"
                                    onClick={
                                        handlePayment
                                    }
                                    disabled={paying}
                                    style={{
                                        width: "100%",
                                        padding: "13px",
                                        border: "none",
                                        borderRadius: "8px",
                                        fontWeight: "700",
                                        cursor: paying
                                            ? "not-allowed"
                                            : "pointer"
                                    }}
                                >

                                    {paying
                                        ? "Processing..."
                                        : "Confirm Cash Payment"}

                                </button>

                            </div>

                        )}


                        {/* =================================================
                            UPI PAYMENT
                        ================================================= */}

                        {paymentMethod === "UPI" && (

                            <div
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "10px",
                                    padding: "18px",
                                    marginBottom: "18px",
                                    textAlign: "center"
                                }}
                            >

                                <h3
                                    style={{
                                        marginTop: 0
                                    }}
                                >

                                    📱 UPI Payment

                                </h3>


                                <p>
                                    Scan QR using your UPI app
                                </p>


                                {/* SAMPLE QR CODE */}

                                <img
                                    src="/sample_upi_qr.png"
                                    alt="Sample UPI QR Code"
                                    style={{
                                        width: "210px",
                                        height: "210px",
                                        objectFit: "contain",
                                        margin: "10px auto 15px",
                                        display: "block"
                                    }}
                                />


                                <div
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "700",
                                        marginBottom: "8px"
                                    }}
                                >

                                    ₹
                                    {getBillAmount(
                                        selectedBill
                                    ).toFixed(2)}

                                </div>


                                <div
                                    style={{
                                        color: "#666",
                                        marginBottom: "8px"
                                    }}
                                >

                                    Payment Amount

                                </div>


                                <div
                                    style={{
                                        marginBottom: "18px",
                                        fontWeight: "600"
                                    }}
                                >

                                    Bill #{selectedBill.id}

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        handlePayment
                                    }
                                    disabled={paying}
                                    style={{
                                        width: "100%",
                                        padding: "13px",
                                        border: "none",
                                        borderRadius: "8px",
                                        fontWeight: "700",
                                        cursor: paying
                                            ? "not-allowed"
                                            : "pointer"
                                    }}
                                >

                                    {paying
                                        ? "Processing..."
                                        : `Confirm UPI Payment ₹${getBillAmount(
                                              selectedBill
                                          ).toFixed(2)}`}

                                </button>

                            </div>

                        )}


                        {/* =================================================
                            CARD PAYMENT
                        ================================================= */}

                        {paymentMethod === "CARD" && (

                            <div
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "10px",
                                    padding: "18px",
                                    marginBottom: "18px"
                                }}
                            >

                                <h3
                                    style={{
                                        marginTop: 0
                                    }}
                                >

                                    💳 Card Payment

                                </h3>


                                {/* CARD NUMBER */}

                                <label
                                    style={{
                                        display: "block",
                                        fontWeight: "600",
                                        marginBottom: "6px"
                                    }}
                                >

                                    Card Number

                                </label>


                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) =>
                                        setCardNumber(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter card number"
                                    maxLength="19"
                                    style={{
                                        width: "100%",
                                        padding: "11px",
                                        border: "1px solid #ccc",
                                        borderRadius: "7px",
                                        marginBottom: "15px",
                                        boxSizing: "border-box"
                                    }}
                                />


                                {/* CARD HOLDER */}

                                <label
                                    style={{
                                        display: "block",
                                        fontWeight: "600",
                                        marginBottom: "6px"
                                    }}
                                >

                                    Card Holder Name

                                </label>


                                <input
                                    type="text"
                                    value={cardHolderName}
                                    onChange={(e) =>
                                        setCardHolderName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter card holder name"
                                    style={{
                                        width: "100%",
                                        padding: "11px",
                                        border: "1px solid #ccc",
                                        borderRadius: "7px",
                                        marginBottom: "15px",
                                        boxSizing: "border-box"
                                    }}
                                />


                                {/* EXPIRY + CVV */}

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "1fr 1fr",
                                        gap: "12px",
                                        marginBottom: "15px"
                                    }}
                                >

                                    <div>

                                        <label
                                            style={{
                                                display: "block",
                                                fontWeight: "600",
                                                marginBottom: "6px"
                                            }}
                                        >

                                            Expiry Date

                                        </label>


                                        <input
                                            type="text"
                                            value={expiryDate}
                                            onChange={(e) =>
                                                setExpiryDate(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="MM/YY"
                                            maxLength="5"
                                            style={{
                                                width: "100%",
                                                padding: "11px",
                                                border: "1px solid #ccc",
                                                borderRadius: "7px",
                                                boxSizing: "border-box"
                                            }}
                                        />

                                    </div>


                                    <div>

                                        <label
                                            style={{
                                                display: "block",
                                                fontWeight: "600",
                                                marginBottom: "6px"
                                            }}
                                        >

                                            CVV

                                        </label>


                                        <input
                                            type="password"
                                            value={cvv}
                                            onChange={(e) =>
                                                setCvv(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="CVV"
                                            maxLength="4"
                                            style={{
                                                width: "100%",
                                                padding: "11px",
                                                border: "1px solid #ccc",
                                                borderRadius: "7px",
                                                boxSizing: "border-box"
                                            }}
                                        />

                                    </div>

                                </div>


                                {/* AMOUNT */}

                                <div
                                    style={{
                                        fontSize: "19px",
                                        fontWeight: "700",
                                        marginBottom: "15px"
                                    }}
                                >

                                    Amount: ₹
                                    {getBillAmount(
                                        selectedBill
                                    ).toFixed(2)}

                                </div>


                                {/* PAY BUTTON */}

                                <button
                                    type="button"
                                    onClick={
                                        handlePayment
                                    }
                                    disabled={paying}
                                    style={{
                                        width: "100%",
                                        padding: "13px",
                                        border: "none",
                                        borderRadius: "8px",
                                        fontWeight: "700",
                                        cursor: paying
                                            ? "not-allowed"
                                            : "pointer"
                                    }}
                                >

                                    {paying
                                        ? "Processing..."
                                        : `Pay ₹${getBillAmount(
                                              selectedBill
                                          ).toFixed(2)}`}

                                </button>

                            </div>

                        )}


                        {/* =================================
                            CANCEL
                        ================================= */}

                        <button
                            type="button"
                            onClick={
                                closePaymentModal
                            }
                            disabled={paying}
                            style={{
                                width: "100%",
                                padding: "11px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                background: "#fff",
                                cursor: paying
                                    ? "not-allowed"
                                    : "pointer",
                                fontWeight: "600"
                            }}
                        >

                            Cancel

                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}


export default MyBills;