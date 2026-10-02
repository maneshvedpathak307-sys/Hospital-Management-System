package com.hms.dto;

import java.time.LocalDate;

public class DoctorDailyReportResponse {

    private LocalDate reportDate;

    private long totalPatients;

    private long totalAppointments;

    private double totalRevenue;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public DoctorDailyReportResponse() {
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