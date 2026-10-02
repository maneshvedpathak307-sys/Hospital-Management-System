package com.hms.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.entity.Bill;

public interface BillRepository
        extends JpaRepository<Bill, Long> {

    // =====================================================
    // PATIENT - GET MY BILLS
    // =====================================================

    List<Bill> findByPatientIdOrderByBillDateDesc(
            Long patientId
    );


    // =====================================================
    // CHECK BILL FOR APPOINTMENT
    // =====================================================

    boolean existsByAppointmentId(
            Long appointmentId
    );


    // =====================================================
    // GET BILL BY APPOINTMENT
    // =====================================================

    Optional<Bill> findByAppointmentId(
            Long appointmentId
    );


    // =====================================================
    // ADMIN - GET BILLS BY SELECTED DATE
    // =====================================================

    List<Bill> findByBillDate(
            LocalDate billDate
    );


    // =====================================================
    // DOCTOR - GET BILLS BY DOCTOR AND SELECTED DATE
    // =====================================================

    List<Bill> findByDoctorIdAndBillDate(
            Long doctorId,
            LocalDate billDate
    );

}