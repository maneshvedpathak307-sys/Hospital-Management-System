package com.hms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dto.DoctorCreateRequest;
import com.hms.service.DoctorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/doctors")
public class AdminDoctorController {

    private final DoctorService doctorService;

    public AdminDoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping
    public ResponseEntity<String> createDoctor(
            @Valid @RequestBody DoctorCreateRequest request) {

        return ResponseEntity.ok(
                doctorService.createDoctor(request)
        );
    }
}