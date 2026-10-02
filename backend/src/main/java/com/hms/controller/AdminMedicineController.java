package com.hms.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.dto.MedicineRequest;
import com.hms.entity.Medicine;
import com.hms.repository.MedicineRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/medicines")
public class AdminMedicineController {

    private final MedicineRepository medicineRepository;

    public AdminMedicineController(
            MedicineRepository medicineRepository) {

        this.medicineRepository =
                medicineRepository;
    }

    @GetMapping
    public ResponseEntity<List<Medicine>>
            getAllMedicines() {

        return ResponseEntity.ok(
                medicineRepository.findAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicineById(
            @PathVariable Long id) {

        return medicineRepository
                .findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .status(
                                    HttpStatus.NOT_FOUND)
                                .body(null)
                );
    }

    @PostMapping
    public ResponseEntity<?> addMedicine(
            @Valid
            @RequestBody MedicineRequest request) {

        if (medicineRepository
                .existsByMedicineName(
                        request.getMedicineName())) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                        "Medicine already exists");
        }

        Medicine medicine =
                new Medicine();

        medicine.setMedicineName(
                request.getMedicineName());

        medicine.setGenericName(
                request.getGenericName());

        medicine.setCategory(
                request.getCategory());

        medicine.setDosage(
                request.getDosage());

        medicine.setDescription(
                request.getDescription());

        medicine.setStock(
                request.getStock());

        medicine.setExpiryDate(
                request.getExpiryDate());

        Medicine saved =
                medicineRepository.save(medicine);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicine(
            @PathVariable Long id,
            @Valid
            @RequestBody MedicineRequest request) {

        Medicine medicine =
                medicineRepository
                        .findById(id)
                        .orElse(null);

        if (medicine == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Medicine not found");
        }

        Medicine duplicate =
                medicineRepository
                        .findByMedicineName(
                                request.getMedicineName())
                        .orElse(null);

        if (duplicate != null &&
                !duplicate.getId().equals(id)) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                        "Medicine name already exists");
        }

        medicine.setMedicineName(
                request.getMedicineName());

        medicine.setGenericName(
                request.getGenericName());

        medicine.setCategory(
                request.getCategory());

        medicine.setDosage(
                request.getDosage());

        medicine.setDescription(
                request.getDescription());

        medicine.setStock(
                request.getStock());

        medicine.setExpiryDate(
                request.getExpiryDate());

        Medicine updated =
                medicineRepository.save(medicine);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicine(
            @PathVariable Long id) {

        if (!medicineRepository
                .existsById(id)) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Medicine not found");
        }

        medicineRepository.deleteById(id);

        return ResponseEntity.ok(
                "Medicine deleted successfully");
    }
}