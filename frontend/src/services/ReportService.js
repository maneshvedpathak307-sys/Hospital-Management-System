import api from "./api";

const ReportService = {

    // =====================================================
    // GET DAILY REPORT
    // =====================================================

    getDailyReport: async (date) => {

        const response = await api.get(
            `/admin/reports/daily?date=${date}`
        );

        return response.data;
    },


    // =====================================================
    // DOWNLOAD DAILY REPORT PDF
    // =====================================================

    downloadDailyReport: async (date) => {

        const response = await api.get(
            `/admin/reports/daily/pdf?date=${date}`,
            {
                responseType: "blob"
            }
        );

        // IMPORTANT:
        // Return the complete Axios response
        // because ReportsAnalytics.jsx uses response.data

        return response;
    }

};

export default ReportService;