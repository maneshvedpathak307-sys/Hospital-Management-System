package com.hms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.entity.Medicine;

public interface MedicineRepository
        extends JpaRepository<Medicine, Long> {

    Optional<Medicine> findByMedicineName(
            String medicineName);

    boolean existsByMedicineName(
            String medicineName);

    List<Medicine>
    findByMedicineNameContainingIgnoreCase(
            String medicineName);
}