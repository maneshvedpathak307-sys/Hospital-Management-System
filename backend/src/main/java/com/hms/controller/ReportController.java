package com.hms.controller;

import java.time.LocalDate;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dto.DailyReportResponse;
import com.hms.service.ReportPdfService;
import com.hms.service.ReportService;

@RestController
@RequestMapping("/api/admin/reports")
public class ReportController {

    private final ReportService reportService;

    private final ReportPdfService reportPdfService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public ReportController(
            ReportService reportService,
            ReportPdfService reportPdfService) {

        this.reportService =
                reportService;

        this.reportPdfService =
                reportPdfService;
    }


    // =====================================================
    // GET DAILY REPORT
    // =====================================================
    //
    // Example:
    //
    // GET /api/admin/reports/daily?date=2026-08-27
    //
    // =====================================================

    @GetMapping("/daily")
    public ResponseEntity<DailyReportResponse> getDailyReport(
            @RequestParam LocalDate date) {

        DailyReportResponse report =
                reportService.generateDailyReport(date);

        return ResponseEntity.ok(report);
    }


    // =====================================================
    // DOWNLOAD DAILY REPORT PDF
    // =====================================================
    //
    // Example:
    //
    // GET /api/admin/reports/daily/pdf?date=2026-08-27
    //
    // =====================================================

    @GetMapping("/daily/pdf")
    public ResponseEntity<byte[]> downloadDailyReport(
            @RequestParam LocalDate date) {


        // -------------------------------------------------
        // 1. Generate report data
        // -------------------------------------------------

        DailyReportResponse report =
                reportService.generateDailyReport(date);


        // -------------------------------------------------
        // 2. Generate PDF
        // -------------------------------------------------

        byte[] pdf =
                reportPdfService.generateDailyReportPdf(
                        report
                );


        // -------------------------------------------------
        // 3. Prepare filename
        // -------------------------------------------------

        String filename =
                "Daily-Hospital-Report-" +
                date +
                ".pdf";


        // -------------------------------------------------
        // 4. Return PDF
        // -------------------------------------------------

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                filename +
                                "\""
                )
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .contentLength(
                        pdf.length
                )
                .body(pdf);
    }
}