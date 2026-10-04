import React, {
    useEffect,
    useState
} from "react";

import api from "../../../services/api";

import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";
import EmptyState from "../../../components/common/EmptyState";
import SearchBox from "../../../components/common/SearchBox";

import "../../../styles/tables.css";


function MyPrescriptions() {


    // =====================================================
    // STATE
    // =====================================================

    const [prescriptions, setPrescriptions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [downloadingPdf, setDownloadingPdf] =
        useState(null);

    const [deletingId, setDeletingId] =
        useState(null);


    // =====================================================
    // PAGINATION
    // =====================================================

    const [currentPage, setCurrentPage] =
        useState(1);

    const prescriptionsPerPage = 5;


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
    // CHECK PREVIOUS PRESCRIPTION
    // =====================================================

    const isPreviousPrescription = (
        prescription
    ) => {

        if (
            !prescription ||
            !prescription.prescriptionDate
        ) {

            return false;

        }


        return (
            prescription.prescriptionDate <
            today
        );

    };


    // =====================================================
    // LOAD PRESCRIPTIONS
    // =====================================================

    useEffect(() => {

        fetchPrescriptions();

    }, []);


    // =====================================================
    // FETCH PRESCRIPTIONS
    // =====================================================

    const fetchPrescriptions = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await api.get(
                    "/patient/prescriptions"
                );


            const data =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            setPrescriptions(
                data
            );


        } catch (error) {

            console.error(
                "Error loading prescriptions:",
                error
            );


            setPrescriptions([]);


            setError(
                typeof error.response?.data === "string"

                    ? error.response.data

                    : error.response?.data?.message ||
                      "Unable to load prescriptions."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredPrescriptions =
        prescriptions.filter(
            (prescription) => {

                const searchText =
                    search
                        .toLowerCase()
                        .trim();


                if (!searchText) {

                    return true;

                }


                if (
                    String(
                        prescription.doctorName || ""
                    )
                        .toLowerCase()
                        .includes(searchText)
                ) {

                    return true;

                }


                if (
                    String(
                        prescription.diagnosis || ""
                    )
                        .toLowerCase()
                        .includes(searchText)
                ) {

                    return true;

                }


                const medicines =
                    Array.isArray(
                        prescription.medicines
                    )
                        ? prescription.medicines
                        : [];


                return medicines.some(
                    (medicine) => {

                        return (

                            String(
                                medicine.medicineName ||
                                ""
                            )
                                .toLowerCase()
                                .includes(searchText)

                            ||

                            String(
                                medicine.genericName ||
                                ""
                            )
                                .toLowerCase()
                                .includes(searchText)

                            ||

                            String(
                                medicine.dosage ||
                                ""
                            )
                                .toLowerCase()
                                .includes(searchText)

                            ||

                            String(
                                medicine.frequency ||
                                ""
                            )
                                .toLowerCase()
                                .includes(searchText)

                            ||

                            String(
                                medicine.duration ||
                                ""
                            )
                                .toLowerCase()
                                .includes(searchText)

                        );

                    }
                );

            }
        );


    // =====================================================
    // RESET PAGE
    // =====================================================

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPrescriptions =
        filteredPrescriptions.length;


    const totalPages =
        Math.ceil(
            totalPrescriptions /
            prescriptionsPerPage
        );


    const startIndex =
        (currentPage - 1) *
        prescriptionsPerPage;


    const endIndex =
        startIndex +
        prescriptionsPerPage;


    const currentPrescriptions =
        filteredPrescriptions.slice(
            startIndex,
            endIndex
        );


    // =====================================================
    // FIX PAGE
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
    // DOWNLOAD PDF
    // =====================================================

    const handleDownloadPdf = async (
        prescriptionId
    ) => {

        try {

            setError("");

            setDownloadingPdf(
                prescriptionId
            );


            const response =
                await api.get(
                    `/patient/prescriptions/${prescriptionId}/pdf`,
                    {
                        responseType: "blob"
                    }
                );


            const blob =
                new Blob(
                    [response.data],
                    {
                        type: "application/pdf"
                    }
                );


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement("a");


            link.href = url;


            link.download =
                "prescription.pdf";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            window.URL.revokeObjectURL(
                url
            );


        } catch (error) {

            console.error(
                "Error downloading prescription PDF:",
                error
            );


            setError(
                "Unable to download prescription PDF."
            );

        } finally {

            setDownloadingPdf(null);

        }

    };


    // =====================================================
    // DELETE PRESCRIPTION
    // =====================================================

    const handleDeletePrescription = async (
        prescription
    ) => {

        if (
            !prescription ||
            !prescription.id
        ) {

            setError(
                "Prescription ID not found."
            );

            return;

        }


        // =================================================
        // CONFIRM
        // =================================================

        const confirmed =
            window.confirm(
                "Are you sure you want to remove this prescription from your prescription list?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setDeletingId(
                prescription.id
            );

            setError("");


            // =================================================
            // BACKEND DELETE
            // =================================================

            await api.delete(
                `/patient/prescriptions/${prescription.id}`
            );


            // =================================================
            // REMOVE FROM FRONTEND
            // =================================================

            setPrescriptions(
                (previousPrescriptions) =>
                    previousPrescriptions.filter(
                        (item) =>
                            item.id !==
                            prescription.id
                    )
            );


        } catch (error) {

            console.error(
                "Error deleting prescription:",
                error
            );


            setError(
                typeof error.response?.data === "string"

                    ? error.response.data

                    : error.response?.data?.message ||
                      "Unable to remove prescription."
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
                title="My Prescriptions"
                subtitle="View medicines and prescriptions provided by your doctors."
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
                    className="table-toolbar"
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
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search prescriptions..."
                        />

                    </div>


                    <div
                        className="pagination-total"
                        style={{
                            marginLeft: "auto"
                        }}
                    >

                        <strong>
                            Total Prescriptions :
                        </strong>

                        <span>
                            {totalPrescriptions}
                        </span>

                    </div>

                </div>


                {/* =================================================
                    SEARCH RESULT
                ================================================= */}

                {search && (

                    <div className="bill-search-result">

                        Showing{" "}

                        <strong>
                            {filteredPrescriptions.length}
                        </strong>{" "}

                        result
                        {filteredPrescriptions.length !== 1
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

                {filteredPrescriptions.length === 0 ? (

                    <EmptyState
                        icon="💊"
                        title="No prescriptions found"
                        message={
                            search
                                ? "Try another search."
                                : "You do not have any prescriptions yet."
                        }
                    />

                ) : (

                    <>


                        {/* =================================================
                            TABLE
                        ================================================= */}

                        <div className="table-wrapper">

                            <table className="data-table">

                                <thead>

                                    <tr>

                                        <th>S.No.</th>

                                        <th>Doctor</th>

                                        <th>Diagnosis</th>

                                        <th>Medicines</th>

                                        <th>Date</th>

                                        <th>Action</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {currentPrescriptions.map(
                                        (
                                            prescription,
                                            index
                                        ) => {

                                            const medicines =
                                                Array.isArray(
                                                    prescription.medicines
                                                )
                                                    ? prescription.medicines
                                                    : [];


                                            const isPrevious =
                                                isPreviousPrescription(
                                                    prescription
                                                );


                                            const serialNumber =
                                                startIndex +
                                                index +
                                                1;


                                            return (

                                                <tr
                                                    key={
                                                        prescription.id ||
                                                        index
                                                    }
                                                    style={
                                                        isPrevious
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
                                                                prescription.doctorName ||
                                                                "Doctor"
                                                            }

                                                        </strong>


                                                        {prescription.departmentName && (

                                                            <div>

                                                                {
                                                                    prescription.departmentName
                                                                }

                                                            </div>

                                                        )}

                                                    </td>


                                                    {/* DIAGNOSIS */}

                                                    <td>

                                                        {
                                                            prescription.diagnosis ||
                                                            "-"
                                                        }

                                                    </td>


                                                    {/* MEDICINES */}

                                                    <td>

                                                        {medicines.length === 0 ? (

                                                            "-"

                                                        ) : (

                                                            <div>

                                                                {medicines.map(
                                                                    (
                                                                        medicine,
                                                                        medicineIndex
                                                                    ) => (

                                                                        <div
                                                                            key={
                                                                                medicine.id ||
                                                                                medicineIndex
                                                                            }
                                                                            style={{
                                                                                marginBottom:
                                                                                    medicineIndex <
                                                                                    medicines.length -
                                                                                        1
                                                                                        ? "12px"
                                                                                        : "0"
                                                                            }}
                                                                        >

                                                                            <strong>

                                                                                {
                                                                                    medicine.medicineName ||
                                                                                    "Medicine"
                                                                                }

                                                                            </strong>


                                                                            <div>

                                                                                Dosage:{" "}

                                                                                {
                                                                                    medicine.dosage ||
                                                                                    "-"
                                                                                }

                                                                            </div>


                                                                            <div>

                                                                                Frequency:{" "}

                                                                                {
                                                                                    medicine.frequency ||
                                                                                    "-"
                                                                                }

                                                                            </div>


                                                                            <div>

                                                                                Duration:{" "}

                                                                                {
                                                                                    medicine.duration ||
                                                                                    "-"
                                                                                }

                                                                            </div>


                                                                            {medicine.instructions && (

                                                                                <div>

                                                                                    Instructions:{" "}

                                                                                    {
                                                                                        medicine.instructions
                                                                                    }

                                                                                </div>

                                                                            )}

                                                                        </div>

                                                                    )
                                                                )}

                                                            </div>

                                                        )}

                                                    </td>


                                                    {/* DATE */}

                                                    <td>

                                                        {
                                                            formatDate(
                                                                prescription.prescriptionDate
                                                            )
                                                        }


                                                        {isPrevious && (

                                                            <div>

                                                                <small
                                                                    style={{
                                                                        opacity: 0.7
                                                                    }}
                                                                >

                                                                    Previous

                                                                </small>

                                                            </div>

                                                        )}

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


                                                            {/* DOWNLOAD */}

                                                            <button
                                                                type="button"
                                                                className="secondary-button"
                                                                onClick={() =>
                                                                    handleDownloadPdf(
                                                                        prescription.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    downloadingPdf ===
                                                                    prescription.id
                                                                }
                                                            >

                                                                {
                                                                    downloadingPdf ===
                                                                    prescription.id
                                                                        ? "Downloading..."
                                                                        : "📄 Download PDF"
                                                                }

                                                            </button>


                                                            {/* DELETE */}

                                                            <button
                                                                type="button"
                                                                className="secondary-button"
                                                                onClick={() =>
                                                                    handleDeletePrescription(
                                                                        prescription
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingId ===
                                                                    prescription.id
                                                                }
                                                                style={{
                                                                    color: "#dc2626",
                                                                    borderColor: "#dc2626"
                                                                }}
                                                            >

                                                                {
                                                                    deletingId ===
                                                                    prescription.id
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
                                    Total Prescriptions :
                                </strong>

                                <span>
                                    {totalPrescriptions}
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


export default MyPrescriptions;