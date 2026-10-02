package com.hms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dto.LoginRequest;
import com.hms.dto.LoginResponse;
import com.hms.dto.PatientRegisterRequest;
import com.hms.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ==========================================
    // ADMIN / DOCTOR / PATIENT LOGIN
    // ==========================================

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    // ==========================================
    // PATIENT REGISTRATION
    // ==========================================

    @PostMapping("/register/patient")
    public ResponseEntity<String> registerPatient(
            @Valid @RequestBody PatientRegisterRequest request) {

        return ResponseEntity.ok(
                authService.registerPatient(request)
        );
    }
}