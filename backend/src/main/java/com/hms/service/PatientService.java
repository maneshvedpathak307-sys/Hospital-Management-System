package com.hms.service;

import com.hms.dto.PatientCreateRequest;
import com.hms.entity.Patient;

public interface PatientService {

    // =====================================================
    // CREATE PATIENT
    // =====================================================

    String createPatient(PatientCreateRequest request);


    // =====================================================
    // GET LOGGED-IN PATIENT PROFILE
    // =====================================================

    Patient getPatientProfile(String loginEmail);


    // =====================================================
    // UPDATE LOGGED-IN PATIENT PROFILE
    // =====================================================

    Patient updatePatientProfile(
            String loginEmail,
            Patient updatedPatient
    );
}