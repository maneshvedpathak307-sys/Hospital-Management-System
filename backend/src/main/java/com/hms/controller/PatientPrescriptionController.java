package com.hms.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dto.PrescriptionResponse;
import com.hms.service.PrescriptionService;

@RestController
@RequestMapping("/api/patient/prescriptions")
public class PatientPrescriptionController {

    private final PrescriptionService prescriptionService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public PatientPrescriptionController(
            PrescriptionService prescriptionService) {

        this.prescriptionService =
                prescriptionService;
    }


    // =====================================================
    // GET MY PRESCRIPTIONS
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getMyPrescriptions(
            Authentication authentication) {

        try {

            List<PrescriptionResponse> response =
                    prescriptionService
                            .getPatientPrescriptions(
                                    authentication
                            );

            return ResponseEntity.ok(
                    response
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =====================================================
    // DOWNLOAD PRESCRIPTION PDF
    // =====================================================

    @GetMapping("/{id}/pdf")
    public ResponseEntity<?> downloadPrescriptionPdf(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            byte[] pdf =
                    prescriptionService
                            .generatePatientPrescriptionPdf(
                                    id,
                                    authentication
                            );


            return ResponseEntity
                    .ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"prescription.pdf\""
                    )
                    .contentType(
                            MediaType.APPLICATION_PDF
                    )
                    .contentLength(
                            pdf.length
                    )
                    .body(
                            pdf
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =====================================================
    // PATIENT - REMOVE PRESCRIPTION
    // =====================================================
    //
    // Endpoint:
    //
    // DELETE
    // /api/patient/prescriptions/{id}
    //
    // IMPORTANT:
    //
    // This is a SOFT DELETE.
    //
    // The prescription remains in the database.
    //
    // patientDeleted = true
    //
    // Therefore:
    //
    // Patient:
    //     prescription disappears from My Prescriptions
    //
    // Doctor/Admin:
    //     prescription remains available
    //
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePrescriptionForPatient(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            prescriptionService
                    .deletePatientPrescription(
                            id,
                            authentication
                    );

            return ResponseEntity.ok(
                    "Prescription removed successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }
}