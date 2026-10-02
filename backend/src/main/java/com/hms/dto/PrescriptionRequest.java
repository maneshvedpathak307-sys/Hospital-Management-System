package com.hms.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PrescriptionRequest {

    @NotNull(message = "Appointment ID is required")
    private Long appointmentId;

    @NotBlank(message = "Diagnosis is required")
    @Size(
        max = 500,
        message = "Diagnosis cannot exceed 500 characters"
    )
    private String diagnosis;

    @NotEmpty(message = "At least one medicine is required")
    @Valid
    private List<PrescriptionMedicineRequest> medicines;

    @Size(
        max = 1000,
        message = "Instructions cannot exceed 1000 characters"
    )
    private String instructions;

    public PrescriptionRequest() {
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public List<PrescriptionMedicineRequest> getMedicines() {
        return medicines;
    }

    public void setMedicines(
            List<PrescriptionMedicineRequest> medicines) {

        this.medicines = medicines;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
}