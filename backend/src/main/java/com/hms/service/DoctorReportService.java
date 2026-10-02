package com.hms.service;

import java.time.LocalDate;

import com.hms.dto.DoctorDailyReportResponse;

public interface DoctorReportService {

    // =====================================================
    // GENERATE DOCTOR DAILY REPORT
    // =====================================================

    DoctorDailyReportResponse generateDailyReport(
            Long doctorId,
            LocalDate date
    );
}