package com.hms.dto;

import java.time.LocalDate;

public class DoctorReportDTO {

    // =====================================================
    // REPORT DATE
    // =====================================================

    private LocalDate reportDate;


    // =====================================================
    // TOTAL PATIENTS
    // =====================================================

    private long totalPatients;


    // =====================================================
    // TOTAL APPOINTMENTS
    // =====================================================

    private long totalAppointments;


    // =====================================================
    // TOTAL REVENUE
    // =====================================================

    private double totalRevenue;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public DoctorReportDTO() {
    }


    public DoctorReportDTO(
            LocalDate reportDate,
            long totalPatients,
            long totalAppointments,
            double totalRevenue) {

        this.reportDate = reportDate;
        this.totalPatients = totalPatients;
        this.totalAppointments = totalAppointments;
        this.totalRevenue = totalRevenue;
    }


    // =====================================================
    // GETTERS AND SETTERS
    // =====================================================

    public LocalDate getReportDate() {
        return reportDate;
    }

    public void setReportDate(LocalDate reportDate) {
        this.reportDate = reportDate;
    }


    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }


    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }


    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}