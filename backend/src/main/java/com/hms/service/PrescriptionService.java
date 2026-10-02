package com.hms.service;

import java.util.List;

import org.springframework.security.core.Authentication;

import com.hms.dto.PrescriptionRequest;
import com.hms.dto.PrescriptionResponse;

public interface PrescriptionService {


    // =====================================================
    // DOCTOR - CREATE PRESCRIPTION
    // =====================================================

    PrescriptionResponse createPrescription(
            PrescriptionRequest request,
            Authentication authentication
    );


    // =====================================================
    // DOCTOR - GET MY PRESCRIPTIONS
    // =====================================================

    List<PrescriptionResponse> getDoctorPrescriptions(
            Authentication authentication
    );


    // =====================================================
    // DOCTOR - GET SINGLE PRESCRIPTION
    // =====================================================

    PrescriptionResponse getDoctorPrescriptionById(
            Long prescriptionId,
            Authentication authentication
    );


    // =====================================================
    // DOCTOR - UPDATE PRESCRIPTION
    // =====================================================

    PrescriptionResponse updatePrescription(
            Long prescriptionId,
            PrescriptionRequest request,
            Authentication authentication
    );


    // =====================================================
    // PATIENT - GET MY PRESCRIPTIONS
    // =====================================================

    List<PrescriptionResponse> getPatientPrescriptions(
            Authentication authentication
    );


    // =====================================================
    // PATIENT - DOWNLOAD PRESCRIPTION PDF
    // =====================================================

    byte[] generatePatientPrescriptionPdf(
            Long prescriptionId,
            Authentication authentication
    );


    // =====================================================
    // PATIENT - REMOVE PRESCRIPTION
    // =====================================================
    //
    // Patient can remove their own prescription.
    //
    // This is a SOFT DELETE.
    //
    // =====================================================

    void deletePatientPrescription(
            Long prescriptionId,
            Authentication authentication
    );
}