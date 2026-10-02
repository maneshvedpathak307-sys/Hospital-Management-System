package com.hms.dto;

import java.time.LocalDate;

public class DailyReportResponse {

    // =====================================================
    // REPORT DATE
    // =====================================================

    private LocalDate reportDate;


    // =====================================================
    // TOTAL COUNTS
    // =====================================================

    private long totalDoctors;

    private long totalPatients;

    private long totalAppointments;

    private long totalBills;


    // =====================================================
    // REVENUE
    // =====================================================

    private double totalRevenue;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public DailyReportResponse() {
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


    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
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


    public long getTotalBills() {
        return totalBills;
    }

    public void setTotalBills(long totalBills) {
        this.totalBills = totalBills;
    }


    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}