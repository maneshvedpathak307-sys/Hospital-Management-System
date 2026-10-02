package com.hms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "prescription_medicines")
public class PrescriptionMedicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // PRESCRIPTION
    // =====================================================

    @ManyToOne
    @JoinColumn(
            name = "prescription_id",
            nullable = false
    )
    private Prescription prescription;


    // =====================================================
    // MEDICINE
    // =====================================================

    @ManyToOne
    @JoinColumn(
            name = "medicine_id",
            nullable = false
    )
    private Medicine medicine;


    // =====================================================
    // DOSAGE
    // =====================================================

    @Column(nullable = false, length = 100)
    private String dosage;


    // =====================================================
    // FREQUENCY
    // =====================================================

    @Column(nullable = false, length = 100)
    private String frequency;


    // =====================================================
    // DURATION
    // =====================================================

    @Column(nullable = false, length = 100)
    private String duration;


    // =====================================================
    // INSTRUCTIONS
    // =====================================================

    @Column(length = 500)
    private String instructions;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public PrescriptionMedicine() {
    }


    // =====================================================
    // GETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public Prescription getPrescription() {
        return prescription;
    }

    public Medicine getMedicine() {
        return medicine;
    }

    public String getDosage() {
        return dosage;
    }

    public String getFrequency() {
        return frequency;
    }

    public String getDuration() {
        return duration;
    }

    public String getInstructions() {
        return instructions;
    }


    // =====================================================
    // SETTERS
    // =====================================================

    public void setPrescription(
            Prescription prescription) {

        this.prescription = prescription;
    }

    public void setMedicine(
            Medicine medicine) {

        this.medicine = medicine;
    }

    public void setDosage(
            String dosage) {

        this.dosage = dosage;
    }

    public void setFrequency(
            String frequency) {

        this.frequency = frequency;
    }

    public void setDuration(
            String duration) {

        this.duration = duration;
    }

    public void setInstructions(
            String instructions) {

        this.instructions = instructions;
    }
}