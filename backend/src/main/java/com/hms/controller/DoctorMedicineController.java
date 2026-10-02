package com.hms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.entity.Medicine;
import com.hms.repository.MedicineRepository;

@RestController
@RequestMapping("/api/doctor/medicine-management")
public class DoctorMedicineController {

    private final MedicineRepository medicineRepository;

    public DoctorMedicineController(
            MedicineRepository medicineRepository) {

        this.medicineRepository =
                medicineRepository;
    }

    // ==========================================
    // GET ALL MEDICINES
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Medicine>>
            getAllMedicines() {

        return ResponseEntity.ok(
                medicineRepository.findAll()
        );
    }

    // ==========================================
    // SEARCH MEDICINES
    // ==========================================

    @GetMapping("/search")
    public ResponseEntity<List<Medicine>>
            searchMedicines(
                    @RequestParam String name) {

        return ResponseEntity.ok(
                medicineRepository
                        .findByMedicineNameContainingIgnoreCase(
                                name
                        )
        );
    }
}