package com.hms.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class CompletedAppointmentResponse {

    private Long id;

    private Long patientId;

    private String patientName;

    private LocalDate appointmentDate;

    private LocalTime appointmentTime;

    private String status;

    public CompletedAppointmentResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(
            LocalDate appointmentDate) {

        this.appointmentDate =
                appointmentDate;
    }

    public LocalTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(
            LocalTime appointmentTime) {

        this.appointmentTime =
                appointmentTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}