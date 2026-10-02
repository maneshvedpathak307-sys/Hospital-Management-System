package com.hms.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class PrescriptionUpdateRequest {

    // =====================================================
    // DIAGNOSIS
    // =====================================================

    @NotBlank(message = "Diagnosis is required")
    @Size(
        max = 500,
        message = "Diagnosis cannot exceed 500 characters"
    )
    private String diagnosis;


    // =====================================================
    // MEDICINES
    // =====================================================

    @NotEmpty(
        message = "At least one medicine is required"
    )
    @Valid
    private List<PrescriptionMedicineRequest> medicines;


    // =====================================================
    // GENERAL INSTRUCTIONS
    // =====================================================

    @Size(
        max = 1000,
        message = "Instructions cannot exceed 1000 characters"
    )
    private String instructions;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public PrescriptionUpdateRequest() {
    }


    // =====================================================
    // GETTERS
    // =====================================================

    public String getDiagnosis() {
        return diagnosis;
    }

    public List<PrescriptionMedicineRequest> getMedicines() {
        return medicines;
    }

    public String getInstructions() {
        return instructions;
    }


    // =====================================================
    // SETTERS
    // =====================================================

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public void setMedicines(
            List<PrescriptionMedicineRequest> medicines) {

        this.medicines = medicines;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
}