package com.hms.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hms.entity.Appointment;
import com.hms.entity.AppointmentStatus;
import com.hms.entity.Patient;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {


    // =====================================================
    // PATIENT - GET VISIBLE APPOINTMENTS
    // =====================================================
    //
    // Returns only appointments which the patient
    // has NOT deleted/hidden.
    //
    // Previous + Today + Future
    //
    // =====================================================

    List<Appointment>
    findByPatientIdAndDeletedByPatientFalseOrderByAppointmentDateAscAppointmentTimeAsc(
            Long patientId
    );


    // =====================================================
    // PATIENT - GET TODAY AND UPCOMING APPOINTMENTS
    // =====================================================

    List<Appointment>
    findByPatientIdAndAppointmentDateGreaterThanEqualAndDeletedByPatientFalseOrderByAppointmentDateAscAppointmentTimeAsc(
            Long patientId,
            LocalDate appointmentDate
    );


    // =====================================================
    // DOCTOR - GET ALL APPOINTMENTS
    // =====================================================

    List<Appointment>
    findByDoctorIdOrderByAppointmentDateAscAppointmentTimeAsc(
            Long doctorId
    );


    // =====================================================
    // DOCTOR - GET TODAY'S APPOINTMENTS
    // =====================================================

    List<Appointment>
    findByDoctorIdAndAppointmentDateOrderByAppointmentTimeAsc(
            Long doctorId,
            LocalDate appointmentDate
    );


    // =====================================================
    // DOCTOR - GET TODAY'S APPOINTMENTS BY STATUS
    // =====================================================

    List<Appointment>
    findByDoctorIdAndAppointmentDateAndStatusOrderByAppointmentTimeAsc(
            Long doctorId,
            LocalDate appointmentDate,
            AppointmentStatus status
    );


    // =====================================================
    // DEPARTMENT - GET APPOINTMENTS
    // =====================================================

    List<Appointment> findByDepartmentId(
            Long departmentId
    );


    // =====================================================
    // ADMIN - GET APPOINTMENTS BY DATE
    // =====================================================

    List<Appointment>
    findByAppointmentDateOrderByAppointmentTimeAsc(
            LocalDate appointmentDate
    );


    // =====================================================
    // ADMIN - GET TODAY'S PATIENTS
    // =====================================================

    @Query("""
        SELECT DISTINCT a.patient
        FROM Appointment a
        WHERE a.appointmentDate = :appointmentDate
        AND a.patient IS NOT NULL
    """)
    List<Patient> findPatientsByAppointmentDate(
            @Param("appointmentDate") LocalDate appointmentDate
    );


    // =====================================================
    // CHECK ACTIVE APPOINTMENT SLOT
    // =====================================================

    @Query("""
        SELECT COUNT(a) > 0
        FROM Appointment a
        WHERE a.doctor.id = :doctorId
        AND a.appointmentDate = :appointmentDate
        AND a.appointmentTime = :appointmentTime
        AND a.status <> com.hms.entity.AppointmentStatus.CANCELLED
    """)
    boolean existsActiveAppointmentSlot(
            @Param("doctorId") Long doctorId,
            @Param("appointmentDate") LocalDate appointmentDate,
            @Param("appointmentTime") LocalTime appointmentTime
    );


    // =====================================================
    // DOCTOR - GET MY PATIENTS
    // =====================================================

    @Query("""
        SELECT DISTINCT a.patient
        FROM Appointment a
        WHERE a.doctor.id = :doctorId
        AND a.patient IS NOT NULL
    """)
    List<Patient> findPatientsByDoctorId(
            @Param("doctorId") Long doctorId
    );


    // =====================================================
    // DOCTOR - GET PATIENTS BY DOCTOR AND DATE
    // =====================================================

    @Query("""
        SELECT DISTINCT a.patient
        FROM Appointment a
        WHERE a.doctor.id = :doctorId
        AND a.appointmentDate = :appointmentDate
        AND a.patient IS NOT NULL
    """)
    List<Patient> findPatientsByDoctorIdAndAppointmentDate(
            @Param("doctorId") Long doctorId,
            @Param("appointmentDate") LocalDate appointmentDate
    );


    // =====================================================
    // DOCTOR - CHECK PATIENT APPOINTMENT FOR TODAY
    // =====================================================

    @Query("""
        SELECT COUNT(a) > 0
        FROM Appointment a
        WHERE a.doctor.id = :doctorId
        AND a.patient.id = :patientId
        AND a.appointmentDate = :appointmentDate
        AND a.status <> com.hms.entity.AppointmentStatus.CANCELLED
    """)
    boolean existsPatientAppointmentForDoctorToday(
            @Param("doctorId") Long doctorId,
            @Param("patientId") Long patientId,
            @Param("appointmentDate") LocalDate appointmentDate
    );


    // =====================================================
    // DOCTOR REPORT - APPOINTMENTS BY DATE
    // =====================================================

    long countByDoctorIdAndAppointmentDate(
            Long doctorId,
            LocalDate appointmentDate
    );


    // =====================================================
    // DOCTOR REPORT - UNIQUE PATIENTS BY DATE
    // =====================================================

    @Query("""
        SELECT COUNT(DISTINCT a.patient.id)
        FROM Appointment a
        WHERE a.doctor.id = :doctorId
        AND a.appointmentDate = :appointmentDate
        AND a.patient IS NOT NULL
        AND a.status <> com.hms.entity.AppointmentStatus.CANCELLED
    """)
    long countDistinctPatientsByDoctorIdAndAppointmentDate(
            @Param("doctorId") Long doctorId,
            @Param("appointmentDate") LocalDate appointmentDate
    );


    // =====================================================
    // DOCTOR - GET APPOINTMENTS BY STATUS
    // =====================================================

    List<Appointment>
    findByDoctorIdAndStatusOrderByAppointmentDateDescAppointmentTimeDesc(
            Long doctorId,
            AppointmentStatus status
    );

}