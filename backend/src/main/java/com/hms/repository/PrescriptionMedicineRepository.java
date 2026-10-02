package com.hms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.entity.PrescriptionMedicine;

public interface PrescriptionMedicineRepository
        extends JpaRepository<
                PrescriptionMedicine,
                Long> {

    List<PrescriptionMedicine>
    findByPrescriptionId(Long prescriptionId);

    List<PrescriptionMedicine>
    findByMedicineId(Long medicineId);
}