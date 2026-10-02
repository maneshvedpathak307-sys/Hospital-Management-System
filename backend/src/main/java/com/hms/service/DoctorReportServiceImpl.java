package com.hms.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.dto.DoctorDailyReportResponse;
import com.hms.entity.Appointment;
import com.hms.entity.Bill;
import com.hms.entity.Patient;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.BillRepository;

@Service
@Transactional(readOnly = true)
public class DoctorReportServiceImpl implements DoctorReportService {

    private final AppointmentRepository appointmentRepository;

    private final BillRepository billRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public DoctorReportServiceImpl(
            AppointmentRepository appointmentRepository,
            BillRepository billRepository) {

        this.appointmentRepository =
                appointmentRepository;

        this.billRepository =
                billRepository;
    }


    // =====================================================
    // GENERATE DOCTOR DAILY REPORT
    // =====================================================

    @Override
    public DoctorDailyReportResponse generateDailyReport(
            Long doctorId,
            LocalDate date) {


        // =================================================
        // 1. GET APPOINTMENTS
        // =================================================

        List<Appointment> appointments =
                appointmentRepository
                        .findByDoctorIdAndAppointmentDateOrderByAppointmentTimeAsc(
                                doctorId,
                                date
                        );


        // =================================================
        // 2. GET UNIQUE PATIENTS
        // =================================================

        List<Patient> patients =
                appointmentRepository
                        .findPatientsByDoctorIdAndAppointmentDate(
                                doctorId,
                                date
                        );


        // =================================================
        // 3. GET BILLS
        // =================================================

        List<Bill> bills =
                billRepository
                        .findByDoctorIdAndBillDate(
                                doctorId,
                                date
                        );


        // =================================================
        // 4. CALCULATE TOTAL REVENUE
        // =================================================

        double totalRevenue =
                bills.stream()
                        .mapToDouble(Bill::getTotalAmount)
                        .sum();


        // =================================================
        // 5. CREATE REPORT RESPONSE
        // =================================================

        DoctorDailyReportResponse response =
                new DoctorDailyReportResponse();


        response.setReportDate(date);


        response.setTotalPatients(
                patients.size()
        );


        response.setTotalAppointments(
                appointments.size()
        );


        response.setTotalRevenue(
                totalRevenue
        );


        // =================================================
        // 6. RETURN REPORT
        // =================================================

        return response;
    }
}