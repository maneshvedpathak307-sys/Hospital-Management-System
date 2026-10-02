package com.hms.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BillRequest {

    @NotNull
    private Long patientId;

    @NotNull
    private Long doctorId;

    private Long appointmentId;

    @NotBlank
    private String treatment;

    @Min(0)
    private double consultationFee;

    @Min(0)
    private double medicineCharge;

    @Min(0)
    private double testCharge;

    @NotNull
    private LocalDate billDate;


    // =====================================================
    // GETTERS / SETTERS
    // =====================================================

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }


    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }


    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }


    public String getTreatment() {
        return treatment;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }


    public double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(
            double consultationFee) {

        this.consultationFee =
                consultationFee;
    }


    public double getMedicineCharge() {
        return medicineCharge;
    }

    public void setMedicineCharge(
            double medicineCharge) {

        this.medicineCharge =
                medicineCharge;
    }


    public double getTestCharge() {
        return testCharge;
    }

    public void setTestCharge(
            double testCharge) {

        this.testCharge =
                testCharge;
    }


    public LocalDate getBillDate() {
        return billDate;
    }

    public void setBillDate(
            LocalDate billDate) {

        this.billDate =
                billDate;
    }
}