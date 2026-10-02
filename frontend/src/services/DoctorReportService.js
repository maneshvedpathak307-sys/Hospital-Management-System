import api from "./api";

const DoctorReportService = {

    // =====================================================
    // GET DOCTOR DAILY REPORT
    // =====================================================

    getDailyReport: async (date) => {

        const response =
            await api.get(
                `/doctor/reports/daily?date=${date}`
            );

        return response.data;
    },


    // =====================================================
    // DOWNLOAD DOCTOR DAILY REPORT PDF
    // =====================================================

    downloadDailyReport: async (date) => {

        const response =
            await api.get(
                `/doctor/reports/daily/pdf?date=${date}`,
                {
                    responseType: "blob"
                }
            );

        // Return complete Axios response
        // because DoctorReports.jsx uses response.data

        return response;
    }

};

export default DoctorReportService;