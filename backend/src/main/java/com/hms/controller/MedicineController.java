package com.hms.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.dto.MedicineResponse;
import com.hms.entity.Medicine;
import com.hms.repository.MedicineRepository;

@RestController
@RequestMapping("/api/doctor/medicines")
public class MedicineController {

    private final MedicineRepository medicineRepository;

    public MedicineController(
            MedicineRepository medicineRepository) {

        this.medicineRepository =
                medicineRepository;
    }

    @GetMapping
    public ResponseEntity<?> getMedicines() {

        List<Medicine> medicines =
                medicineRepository.findAll();

        List<MedicineResponse> response =
                new ArrayList<>();

        for (Medicine medicine : medicines) {

            response.add(
                    new MedicineResponse(
                            medicine.getId(),
                            medicine.getMedicineName(),
                            medicine.getGenericName(),
                            medicine.getCategory()
                    )
            );
        }

        return ResponseEntity.ok(response);
    }
}