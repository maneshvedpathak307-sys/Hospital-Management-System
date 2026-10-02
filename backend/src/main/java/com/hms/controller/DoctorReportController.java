package com.hms.controller;

import java.time.LocalDate;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dto.DoctorDailyReportResponse;
import com.hms.entity.Doctor;
import com.hms.repository.DoctorRepository;
import com.hms.service.DoctorReportPdfService;
import com.hms.service.DoctorReportService;

import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/doctor/reports")
public class DoctorReportController {

    private final DoctorReportService doctorReportService;

    private final DoctorReportPdfService doctorReportPdfService;

    private final DoctorRepository doctorRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public DoctorReportController(
            DoctorReportService doctorReportService,
            DoctorReportPdfService doctorReportPdfService,
            DoctorRepository doctorRepository) {

        this.doctorReportService =
                doctorReportService;

        this.doctorReportPdfService =
                doctorReportPdfService;

        this.doctorRepository =
                doctorRepository;
    }


    // =====================================================
    // GET DAILY REPORT
    // =====================================================

    @GetMapping("/daily")
    public ResponseEntity<DoctorDailyReportResponse>
    getDailyReport(
            @RequestParam LocalDate date,
            Authentication authentication) {


        // =================================================
        // GET LOGGED-IN DOCTOR EMAIL
        // =================================================

        String loginEmail =
                authentication.getName();


        // =================================================
        // FIND DOCTOR
        // =================================================

        Doctor doctor =
                doctorRepository
                        .findByUserLoginEmail(loginEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found."
                                )
                        );


        // =================================================
        // GENERATE REPORT
        // =================================================

        DoctorDailyReportResponse report =
                doctorReportService.generateDailyReport(
                        doctor.getId(),
                        date
                );


        return ResponseEntity.ok(report);
    }


    // =====================================================
    // DOWNLOAD DAILY REPORT PDF
    // =====================================================

    @GetMapping("/daily/pdf")
    public ResponseEntity<byte[]>
    downloadDailyReport(
            @RequestParam LocalDate date,
            Authentication authentication) {


        // =================================================
        // GET LOGGED-IN DOCTOR EMAIL
        // =================================================

        String loginEmail =
                authentication.getName();


        // =================================================
        // FIND DOCTOR
        // =================================================

        Doctor doctor =
                doctorRepository
                        .findByUserLoginEmail(loginEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found."
                                )
                        );


        // =================================================
        // GENERATE REPORT DATA
        // =================================================

        DoctorDailyReportResponse report =
                doctorReportService.generateDailyReport(
                        doctor.getId(),
                        date
                );


        // =================================================
        // GENERATE PDF
        // =================================================

        byte[] pdf =
                doctorReportPdfService
                        .generateDailyReportPdf(report);


        // =================================================
        // RESPONSE
        // =================================================

        return ResponseEntity.ok()
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Doctor-Daily-Report-"
                                + date
                                + ".pdf"
                )
                .body(pdf);
    }
}