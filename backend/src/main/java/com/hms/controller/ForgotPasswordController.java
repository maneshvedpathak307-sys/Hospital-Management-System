package com.hms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dto.ForgotPasswordRequest;
import com.hms.dto.ResetPasswordRequest;
import com.hms.service.ForgotPasswordService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;

    public ForgotPasswordController(
            ForgotPasswordService forgotPasswordService) {

        this.forgotPasswordService =
                forgotPasswordService;
    }

    // ==========================================
    // VERIFY EMAIL
    // ==========================================

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        String message =
                forgotPasswordService.forgotPassword(
                        request.getLoginEmail()
                );

        return ResponseEntity.ok(message);
    }

    // ==========================================
    // RESET PASSWORD
    // ==========================================

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        String message =
                forgotPasswordService.resetPassword(
                        request.getLoginEmail(),
                        request.getNewPassword()
                );

        return ResponseEntity.ok(message);
    }
}