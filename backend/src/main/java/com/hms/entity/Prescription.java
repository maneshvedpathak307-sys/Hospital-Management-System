package com.hms.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // APPOINTMENT
    // =====================================================

    @ManyToOne
    @JoinColumn(
            name = "appointment_id",
            nullable = false
    )
    private Appointment appointment;


    // =====================================================
    // PATIENT
    // =====================================================

    @ManyToOne
    @JoinColumn(
            name = "patient_id",
            nullable = false
    )
    private Patient patient;


    // =====================================================
    // DOCTOR
    // =====================================================

    @ManyToOne
    @JoinColumn(
            name = "doctor_id",
            nullable = false
    )
    private Doctor doctor;


    // =====================================================
    // DIAGNOSIS
    // =====================================================

    @Column(
            nullable = false,
            length = 500
    )
    private String diagnosis;


    // =====================================================
    // INSTRUCTIONS
    // =====================================================

    @Column(length = 1000)
    private String instructions;


    // =====================================================
    // PRESCRIPTION DATE
    // =====================================================

    @Column(
            name = "prescription_date",
            nullable = false
    )
    private LocalDate prescriptionDate;


    // =====================================================
    // CREATED AT
    // =====================================================

    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;


    // =====================================================
    // PATIENT DELETED
    // =====================================================

    @Column(
            name = "patient_deleted",
            nullable = false
    )
    private boolean patientDeleted = false;


    // =====================================================
    // PRESCRIPTION MEDICINES
    // =====================================================

    @OneToMany(
            mappedBy = "prescription",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<PrescriptionMedicine>
            prescriptionMedicines =
            new ArrayList<>();


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public Prescription() {
    }


    // =====================================================
    // PRE-PERSIST
    // =====================================================

    @PrePersist
    public void onCreate() {

        if (createdAt == null) {

            createdAt =
                    LocalDateTime.now();
        }

        if (prescriptionDate == null) {

            prescriptionDate =
                    LocalDate.now();
        }

        patientDeleted = false;
    }


    // =====================================================
    // GETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public Patient getPatient() {
        return patient;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public String getInstructions() {
        return instructions;
    }

    public LocalDate getPrescriptionDate() {
        return prescriptionDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public boolean isPatientDeleted() {
        return patientDeleted;
    }

    public List<PrescriptionMedicine>
    getPrescriptionMedicines() {

        return prescriptionMedicines;
    }


    // =====================================================
    // SETTERS
    // =====================================================

    public void setAppointment(
            Appointment appointment) {

        this.appointment = appointment;
    }

    public void setPatient(
            Patient patient) {

        this.patient = patient;
    }

    public void setDoctor(
            Doctor doctor) {

        this.doctor = doctor;
    }

    public void setDiagnosis(
            String diagnosis) {

        this.diagnosis = diagnosis;
    }

    public void setInstructions(
            String instructions) {

        this.instructions = instructions;
    }

    public void setPrescriptionDate(
            LocalDate prescriptionDate) {

        this.prescriptionDate =
                prescriptionDate;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt = createdAt;
    }

    public void setPatientDeleted(
            boolean patientDeleted) {

        this.patientDeleted =
                patientDeleted;
    }

    public void setPrescriptionMedicines(
            List<PrescriptionMedicine>
                    prescriptionMedicines) {

        this.prescriptionMedicines =
                prescriptionMedicines;
    }


    // =====================================================
    // ADD MEDICINE
    // =====================================================

    public void addPrescriptionMedicine(
            PrescriptionMedicine prescriptionMedicine) {

        prescriptionMedicines.add(
                prescriptionMedicine
        );

        prescriptionMedicine.setPrescription(
                this
        );
    }


    // =====================================================
    // CLEAR MEDICINES
    // =====================================================
    //
    // Used when doctor edits prescription.
    //
    // Because orphanRemoval = true,
    // old prescription medicine records
    // will be removed from the database.
    //
    // =====================================================

    public void clearPrescriptionMedicines() {

        prescriptionMedicines.clear();
    }
    
    
}