package com.hms.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // PATIENT
    // =====================================================

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;


    // =====================================================
    // DOCTOR
    // =====================================================

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;


    // =====================================================
    // DEPARTMENT
    // =====================================================

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;


    // =====================================================
    // APPOINTMENT DATE
    // =====================================================

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;


    // =====================================================
    // APPOINTMENT TIME
    // =====================================================

    @Column(name = "appointment_time", nullable = false)
    private LocalTime appointmentTime;


    // =====================================================
    // REASON
    // =====================================================

    @Column(nullable = false, length = 500)
    private String reason;


    // =====================================================
    // STATUS
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;


    // =====================================================
    // CREATED AT
    // =====================================================

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;


    // =====================================================
    // PATIENT DELETE / HIDE FLAG
    // =====================================================
    //
    // false = visible to patient
    // true  = hidden from patient's appointment list
    //
    // Appointment is NOT physically deleted.
    //
    // =====================================================

    @Column(name = "deleted_by_patient", nullable = false)
    private boolean deletedByPatient = false;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public Appointment() {
    }


    // =====================================================
    // PRE PERSIST
    // =====================================================

    @PrePersist
    public void onCreate() {

        createdAt = LocalDateTime.now();

        if (status == null) {

            status = AppointmentStatus.PENDING;

        }

        deletedByPatient = false;
    }


    // =====================================================
    // GET ID
    // =====================================================

    public Long getId() {

        return id;

    }


    // =====================================================
    // PATIENT
    // =====================================================

    public Patient getPatient() {

        return patient;

    }

    public void setPatient(Patient patient) {

        this.patient = patient;

    }


    // =====================================================
    // DOCTOR
    // =====================================================

    public Doctor getDoctor() {

        return doctor;

    }

    public void setDoctor(Doctor doctor) {

        this.doctor = doctor;

    }


    // =====================================================
    // DEPARTMENT
    // =====================================================

    public Department getDepartment() {

        return department;

    }

    public void setDepartment(Department department) {

        this.department = department;

    }


    // =====================================================
    // APPOINTMENT DATE
    // =====================================================

    public LocalDate getAppointmentDate() {

        return appointmentDate;

    }

    public void setAppointmentDate(LocalDate appointmentDate) {

        this.appointmentDate = appointmentDate;

    }


    // =====================================================
    // APPOINTMENT TIME
    // =====================================================

    public LocalTime getAppointmentTime() {

        return appointmentTime;

    }

    public void setAppointmentTime(LocalTime appointmentTime) {

        this.appointmentTime = appointmentTime;

    }


    // =====================================================
    // REASON
    // =====================================================

    public String getReason() {

        return reason;

    }

    public void setReason(String reason) {

        this.reason = reason;

    }


    // =====================================================
    // STATUS
    // =====================================================

    public AppointmentStatus getStatus() {

        return status;

    }

    public void setStatus(AppointmentStatus status) {

        this.status = status;

    }


    // =====================================================
    // CREATED AT
    // =====================================================

    public LocalDateTime getCreatedAt() {

        return createdAt;

    }


    // =====================================================
    // DELETED BY PATIENT
    // =====================================================

    public boolean isDeletedByPatient() {

        return deletedByPatient;

    }

    public void setDeletedByPatient(boolean deletedByPatient) {

        this.deletedByPatient = deletedByPatient;

    }

}