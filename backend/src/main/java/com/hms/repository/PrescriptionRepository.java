package com.hms.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.entity.Prescription;

public interface PrescriptionRepository
        extends JpaRepository<Prescription, Long> {

    // =====================================================
    // DOCTOR - GET TODAY'S PRESCRIPTIONS
    // =====================================================
    //
    // Only prescriptions created for the logged-in doctor
    // on the given date.
    //
    // patientDeleted = false means the prescription is
    // still visible to the patient.
    //
    // =====================================================

    List<Prescription>
    findByDoctorIdAndPrescriptionDateAndPatientDeletedFalseOrderByCreatedAtDesc(
            Long doctorId,
            LocalDate prescriptionDate
    );


    // =====================================================
    // PATIENT - GET MY PRESCRIPTIONS
    // =====================================================
    //
    // Patient can see only prescriptions that have NOT
    // been removed from their prescription list.
    //
    // =====================================================

    List<Prescription>
    findByPatientIdAndPatientDeletedFalseOrderByCreatedAtDesc(
            Long patientId
    );


    // =====================================================
    // CHECK PRESCRIPTION FOR APPOINTMENT
    // =====================================================

    boolean existsByAppointmentId(
            Long appointmentId
    );
}