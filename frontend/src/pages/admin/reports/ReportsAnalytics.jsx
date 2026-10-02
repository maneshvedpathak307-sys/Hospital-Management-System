import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import ReportService from "../../../services/ReportService";

import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";

import "../../../styles/forms.css";
import "../../../styles/tables.css";
import "../../../styles/reports.css";


function ReportsAnalytics() {

    // =====================================================
    // GET TODAY
    // =====================================================

    const getToday = () => {

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


    // =====================================================
    // STATES
    // =====================================================

    const [selectedDate, setSelectedDate] =
        useState(getToday());


    const [report, setReport] =
        useState(null);


    const [loading, setLoading] =
        useState(false);


    const [downloading, setDownloading] =
        useState(false);


    const [error, setError] =
        useState("");


    // =====================================================
    // GET REPORT FROM BACKEND
    // =====================================================

    const loadReport = useCallback(async (date) => {

        if (!date) {

            return;

        }


        try {

            setLoading(true);

            setError("");


            const data =
                await ReportService.getDailyReport(
                    date
                );


            console.log(
                "Daily Report:",
                data
            );


            setReport(data);

        } catch (error) {

            console.error(
                "Report loading error:",
                error
            );


            setReport(null);


            if (
                error?.response?.data?.message
            ) {

                setError(
                    error.response.data.message
                );

            } else if (
                typeof error?.response?.data === "string"
            ) {

                setError(
                    error.response.data
                );

            } else {

                setError(
                    "Unable to load report."
                );

            }

        } finally {

            setLoading(false);

        }

    }, []);


    // =====================================================
    // LOAD REPORT WHEN SELECTED DATE CHANGES
    // =====================================================

    useEffect(() => {

        loadReport(selectedDate);

    }, [
        selectedDate,
        loadReport
    ]);


    // =====================================================
    // DATE CHANGE
    // =====================================================

    const handleDateChange = (e) => {

        const date =
            e.target.value;


        setSelectedDate(date);

    };


    // =====================================================
    // DOWNLOAD DAILY REPORT PDF
    // =====================================================

    const handleDownloadReport = async () => {

        if (!selectedDate) {

            setError(
                "Please select a date first."
            );

            return;

        }


        try {

            setDownloading(true);

            setError("");


            console.log(
                "Downloading report for:",
                selectedDate
            );


            // =================================================
            // CALL BACKEND
            // =================================================

            const response =
                await ReportService.downloadDailyReport(
                    selectedDate
                );


            console.log(
                "PDF response:",
                response
            );


            // =================================================
            // GET PDF BLOB
            // =================================================

            const blob =
                response.data;


            // =================================================
            // VALIDATE PDF
            // =================================================

            if (
                !blob ||
                blob.size === 0
            ) {

                throw new Error(
                    "The generated PDF is empty."
                );

            }


            // =================================================
            // CHECK PDF TYPE
            // =================================================

            console.log(
                "PDF size:",
                blob.size
            );

            console.log(
                "PDF type:",
                blob.type
            );


            // =================================================
            // CREATE OBJECT URL
            // =================================================

            const url =
                window.URL.createObjectURL(
                    blob
                );


            // =================================================
            // CREATE DOWNLOAD LINK
            // =================================================

            const link =
                document.createElement("a");


            link.href =
                url;


            link.download =
                `Daily-Hospital-Report-${selectedDate}.pdf`;


            link.style.display =
                "none";


            document.body.appendChild(
                link
            );


            // =================================================
            // DOWNLOAD
            // =================================================

            link.click();


            // =================================================
            // CLEANUP
            // =================================================

            document.body.removeChild(
                link
            );


            window.URL.revokeObjectURL(
                url
            );


            console.log(
                "PDF download successful."
            );


        } catch (error) {

            console.error(
                "Report download error:",
                error
            );


            // =================================================
            // HANDLE BLOB ERROR
            // =================================================

            if (
                error?.response?.data instanceof Blob
            ) {

                try {

                    const text =
                        await error.response.data.text();


                    const errorData =
                        JSON.parse(text);


                    setError(
                        errorData.message ||
                        "Unable to download daily report."
                    );

                } catch {

                    setError(
                        "Unable to download daily report."
                    );

                }

            } else {

                setError(
                    error?.message ||
                    "Unable to download daily report."
                );

            }

        } finally {

            setDownloading(false);

        }

    };


    // =====================================================
    // SAFE NUMBER
    // =====================================================

    const numberValue = (value) => {

        const number =
            Number(value);


        return Number.isFinite(number)
            ? number
            : 0;

    };


    // =====================================================
    // REPORT VALUES
    // =====================================================

    const doctors =
        numberValue(
            report?.totalDoctors
        );


    const patients =
        numberValue(
            report?.totalPatients
        );


    const appointments =
        numberValue(
            report?.totalAppointments
        );


    const bills =
        numberValue(
            report?.totalBills
        );


    const revenue =
        numberValue(
            report?.totalRevenue
        );


    // =====================================================
    // INITIAL LOADING
    // =====================================================

    if (
        loading &&
        !report
    ) {

        return (

            <div className="page-container">

                <Loading />

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="page-container">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <PageHeader
                title="Reports "
                subtitle="View hospital activity and revenue for any selected date."
            />


            {/* =================================================
                GENERATE DAILY REPORT HEADER
            ================================================= */}

            <div className="report-header-card">

                <div>

                    <h2>
                        Generate Daily Reports
                    </h2>


                    <p>
                        Generate and download the daily
                        hospital report.
                    </p>

                </div>


                {/* =============================================
                    DOWNLOAD BUTTON
                ============================================= */}

                <button
                    type="button"
                    className="download-report-btn"
                    onClick={handleDownloadReport}
                    disabled={
                        downloading ||
                        !selectedDate
                    }
                >

                    {downloading
                        ? "⏳ Generating..."
                        : "📥 Download Report"
                    }

                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="page-error">

                    ⚠️ {error}

                </div>

            )}


            {/* =================================================
                SELECT DATE
            ================================================= */}

            <div className="management-card report-date-card">

                <div className="report-section-header">

                    <div>

                        <h3>
                            Select Date
                        </h3>

                        <p>
                            Select a date to view hospital
                            information and generate the report.
                        </p>

                    </div>


                    <div className="report-date-form">

                        <label>
                            Report Date
                        </label>


                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                        />

                    </div>

                </div>

            </div>


            {/* =================================================
                STATISTICS - 5 CARDS
            ================================================= */}

            {report && (

                <div className="report-stats-grid">


                    {/* =========================================
                        DOCTORS
                    ========================================= */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon">
                            👨‍⚕️
                        </div>


                        <div className="report-stat-content">

                            <span>
                                Doctors
                            </span>


                            <strong>
                                {doctors}
                            </strong>


                            <small>
                                Doctors with appointments
                            </small>

                        </div>

                    </div>


                    {/* =========================================
                        PATIENTS
                    ========================================= */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon">
                            🧑‍🤝‍🧑
                        </div>


                        <div className="report-stat-content">

                            <span>
                                Patients
                            </span>


                            <strong>
                                {patients}
                            </strong>


                            <small>
                                Patients with appointments
                            </small>

                        </div>

                    </div>


                    {/* =========================================
                        APPOINTMENTS
                    ========================================= */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon">
                            📅
                        </div>


                        <div className="report-stat-content">

                            <span>
                                Appointments
                            </span>


                            <strong>
                                {appointments}
                            </strong>


                            <small>
                                Appointments on this date
                            </small>

                        </div>

                    </div>


                    {/* =========================================
                        BILLS
                    ========================================= */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon">
                            🧾
                        </div>


                        <div className="report-stat-content">

                            <span>
                                Bills
                            </span>


                            <strong>
                                {bills}
                            </strong>


                            <small>
                                Bills generated on this date
                            </small>

                        </div>

                    </div>


                    {/* =========================================
                        REVENUE
                    ========================================= */}

                    <div className="report-stat-card">

                        <div className="report-stat-icon">
                            ₹
                        </div>


                        <div className="report-stat-content">

                            <span>
                                Total Revenue
                            </span>


                            <strong>
                                ₹{revenue.toFixed(2)}
                            </strong>


                            <small>
                                Total billing amount
                            </small>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                INFORMATION / FOOTER
            ================================================= */}

            {report && (

                <div className="management-card report-info-card">

                    <div className="report-info-icon">
                        📊
                    </div>


                    <div>

                        <h3>
                            Daily Report
                        </h3>


                        <p>
                            This report shows the hospital
                            activity recorded for the selected
                            date, including doctors, patients,
                            appointments, bills and revenue.
                        </p>

                    </div>

                </div>

            )}

        </div>

    );

}


export default ReportsAnalytics;