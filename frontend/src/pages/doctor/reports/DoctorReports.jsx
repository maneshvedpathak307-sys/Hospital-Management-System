import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import DoctorReportService from "../../../services/DoctorReportService";

import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";

import "../../../styles/forms.css";
import "../../../styles/doctor-reports.css";


function DoctorReports() {

    // =====================================================
    // GET TODAY
    // =====================================================

    const getToday = () => {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(today.getMonth() + 1).padStart(2, "0");

        const day =
            String(today.getDate()).padStart(2, "0");

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
    // LOAD DOCTOR REPORT
    // =====================================================

    const loadReport = useCallback(async (date) => {

        if (!date) {
            return;
        }

        try {

            setLoading(true);

            setError("");


            const data =
                await DoctorReportService.getDailyReport(
                    date
                );


            console.log(
                "Doctor Daily Report:",
                data
            );


            setReport(data);


        } catch (error) {

            console.error(
                "Doctor report loading error:",
                error
            );


            /*
             * Keep report as null when API fails.
             *
             * The 3 cards will still be displayed
             * with 0 values.
             */

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
                    "Unable to load doctor report."
                );

            }

        } finally {

            setLoading(false);

        }

    }, []);


    // =====================================================
    // LOAD REPORT ON PAGE LOAD / DATE CHANGE
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
    // DOWNLOAD REPORT
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
                "Downloading doctor report for:",
                selectedDate
            );


            const response =
                await DoctorReportService.downloadDailyReport(
                    selectedDate
                );


            const blob =
                response.data;


            if (
                !blob ||
                blob.size === 0
            ) {

                throw new Error(
                    "The generated PDF is empty."
                );

            }


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement("a");


            link.href =
                url;


            link.download =
                `Doctor-Daily-Report-${selectedDate}.pdf`;


            link.style.display =
                "none";


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


            console.log(
                "Doctor PDF download successful."
            );


        } catch (error) {

            console.error(
                "Doctor report download error:",
                error
            );


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
                        "Unable to download doctor report."
                    );


                } catch {

                    setError(
                        "Unable to download doctor report."
                    );

                }

            } else {

                setError(
                    error?.message ||
                    "Unable to download doctor report."
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

    /*
     * If report is null:
     *
     * patients      = 0
     * appointments  = 0
     * revenue       = 0
     *
     * Therefore the cards can always be displayed.
     */

    const patients =
        numberValue(
            report?.totalPatients
        );


    const appointments =
        numberValue(
            report?.totalAppointments
        );


    const revenue =
        numberValue(
            report?.totalRevenue
        );


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="page-container">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <PageHeader
                title="Reports"
                subtitle="View your patients, appointments and revenue for any selected date."
            />


            {/* =================================================
                GENERATE DAILY REPORT
            ================================================= */}

            <div className="doctor-report-header-card">

                <div>

                    <h2>
                        Generate Daily Reports
                    </h2>

                    <p>
                        Generate and download your daily
                        doctor report.
                    </p>

                </div>


                <button
                    type="button"
                    className="doctor-download-report-btn"
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

            <div className="management-card doctor-report-date-card">

                <div className="doctor-report-section-header">

                    <div>

                        <h3>
                            Select Date
                        </h3>

                        <p>
                            Select a date to view your
                            report information.
                        </p>

                    </div>


                    <div className="doctor-report-date-form">

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
                LOADING INDICATOR
            ================================================= */}

            {loading && (

                <div
                    style={{
                        marginBottom: "20px"
                    }}
                >

                    <Loading />

                </div>

            )}


            {/* =================================================
                SELECTED DATE
            ================================================= */}

            <div className="doctor-report-selected-date">

                <span>
                    Report for
                </span>

                <strong>
                    {report?.reportDate || selectedDate}
                </strong>

            </div>


            {/* =================================================
                REPORT CARDS
                ALWAYS DISPLAYED
            ================================================= */}

            <div className="doctor-report-stats-grid">


                {/* =========================================
                    TOTAL PATIENTS
                ========================================= */}

                <div className="doctor-report-stat-card">

                    <div className="doctor-report-stat-icon">
                        👥
                    </div>

                    <div className="doctor-report-stat-content">

                        <span>
                            Total Patients
                        </span>

                        <strong>
                            {patients}
                        </strong>

                        <small>
                            Patients for selected date
                        </small>

                    </div>

                </div>


                {/* =========================================
                    TOTAL APPOINTMENTS
                ========================================= */}

                <div className="doctor-report-stat-card">

                    <div className="doctor-report-stat-icon">
                        📅
                    </div>

                    <div className="doctor-report-stat-content">

                        <span>
                            Total Appointments
                        </span>

                        <strong>
                            {appointments}
                        </strong>

                        <small>
                            Appointments for selected date
                        </small>

                    </div>

                </div>


                {/* =========================================
                    TOTAL REVENUE
                ========================================= */}

                <div className="doctor-report-stat-card">

                    <div className="doctor-report-stat-icon">
                        ₹
                    </div>

                    <div className="doctor-report-stat-content">

                        <span>
                            Total Revenue
                        </span>

                        <strong>
                            ₹{revenue.toFixed(2)}
                        </strong>

                        <small>
                            Revenue for selected date
                        </small>

                    </div>

                </div>

            </div>


            {/* =================================================
                INFORMATION
            ================================================= */}

            <div className="management-card doctor-report-info-card">

                <div className="doctor-report-info-icon">
                    📊
                </div>

                <div>

                    <h3>
                        Daily Doctor Report
                    </h3>

                    <p>
                        This report shows your patients,
                        appointments and revenue for
                        the selected date.
                    </p>

                </div>

            </div>


        </div>

    );

}


export default DoctorReports;