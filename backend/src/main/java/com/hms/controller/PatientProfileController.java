package com.hms.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.hms.entity.Patient;
import com.hms.entity.User;
import com.hms.repository.PatientRepository;
import com.hms.repository.UserRepository;

@RestController
@RequestMapping("/api/patient")
public class PatientProfileController {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientProfileController(
            PatientRepository patientRepository,
            UserRepository userRepository) {

        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    // =====================================================
    // GET PATIENT PROFILE
    // GET /api/patient/profile
    // =====================================================

    @GetMapping("/profile")
    public ResponseEntity<?> getPatientProfile(
            Authentication authentication) {

        try {

            if (authentication == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "message",
                                "User is not authenticated"
                        ));
            }

            // ---------------------------------------------
            // GET LOGGED-IN USER EMAIL
            // ---------------------------------------------

            String loginEmail = authentication.getName();

            // ---------------------------------------------
            // FIND USER
            // ---------------------------------------------

            User user = userRepository
                    .findByLoginEmail(loginEmail)
                    .orElse(null);

            if (user == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "message",
                                "User not found"
                        ));
            }

            // ---------------------------------------------
            // FIND PATIENT
            // ---------------------------------------------

            Patient patient = patientRepository
                    .findByUserId(user.getId())
                    .orElse(null);

            if (patient == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "message",
                                "Patient profile not found"
                        ));
            }

            // ---------------------------------------------
            // CREATE SAFE RESPONSE
            // ---------------------------------------------
            // Do not directly return Patient because it
            // contains User and User may contain password.

            Map<String, Object> response =
                    new LinkedHashMap<>();

            response.put(
                    "id",
                    patient.getId()
            );

            response.put(
                    "patientName",
                    patient.getPatientName()
            );

            response.put(
                    "age",
                    patient.getAge()
            );

            response.put(
                    "gender",
                    patient.getGender()
            );

            response.put(
                    "phone",
                    patient.getPhone()
            );

            response.put(
                    "email",
                    patient.getEmail()
            );

            response.put(
                    "address",
                    patient.getAddress()
            );

            response.put(
                    "disease",
                    patient.getDisease()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            e.getMessage() != null
                                    ? e.getMessage()
                                    : "Unable to load patient profile"
                    ));
        }
    }


    // =====================================================
    // UPDATE PATIENT PROFILE
    // PUT /api/patient/profile
    // =====================================================

    @PutMapping("/profile")
    public ResponseEntity<?> updatePatientProfile(
            Authentication authentication,
            @RequestBody Patient request) {

        try {

            if (authentication == null) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "message",
                                "User is not authenticated"
                        ));
            }

            // ---------------------------------------------
            // GET LOGGED-IN USER
            // ---------------------------------------------

            String loginEmail =
                    authentication.getName();

            User user =
                    userRepository
                            .findByLoginEmail(loginEmail)
                            .orElse(null);

            if (user == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "message",
                                "User not found"
                        ));
            }

            // ---------------------------------------------
            // GET PATIENT PROFILE
            // ---------------------------------------------

            Patient patient =
                    patientRepository
                            .findByUserId(user.getId())
                            .orElse(null);

            if (patient == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "message",
                                "Patient profile not found"
                        ));
            }

            // ---------------------------------------------
            // UPDATE PATIENT DETAILS
            // ---------------------------------------------

            if (request.getPatientName() != null) {

                patient.setPatientName(
                        request.getPatientName()
                );
            }

            if (request.getAge() != null) {

                patient.setAge(
                        request.getAge()
                );
            }

            if (request.getGender() != null) {

                patient.setGender(
                        request.getGender()
                );
            }

            if (request.getPhone() != null) {

                patient.setPhone(
                        request.getPhone()
                );
            }

            if (request.getEmail() != null) {

                patient.setEmail(
                        request.getEmail()
                );
            }

            if (request.getAddress() != null) {

                patient.setAddress(
                        request.getAddress()
                );
            }

            if (request.getDisease() != null) {

                patient.setDisease(
                        request.getDisease()
                );
            }

            // ---------------------------------------------
            // SAVE
            // ---------------------------------------------

            Patient updatedPatient =
                    patientRepository.save(patient);

            // ---------------------------------------------
            // SAFE RESPONSE
            // ---------------------------------------------

            Map<String, Object> patientResponse =
                    new LinkedHashMap<>();

            patientResponse.put(
                    "id",
                    updatedPatient.getId()
            );

            patientResponse.put(
                    "patientName",
                    updatedPatient.getPatientName()
            );

            patientResponse.put(
                    "age",
                    updatedPatient.getAge()
            );

            patientResponse.put(
                    "gender",
                    updatedPatient.getGender()
            );

            patientResponse.put(
                    "phone",
                    updatedPatient.getPhone()
            );

            patientResponse.put(
                    "email",
                    updatedPatient.getEmail()
            );

            patientResponse.put(
                    "address",
                    updatedPatient.getAddress()
            );

            patientResponse.put(
                    "disease",
                    updatedPatient.getDisease()
            );

            Map<String, Object> response =
                    new LinkedHashMap<>();

            response.put(
                    "message",
                    "Profile updated successfully"
            );

            response.put(
                    "patient",
                    patientResponse
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            e.getMessage() != null
                                    ? e.getMessage()
                                    : "Unable to update patient profile"
                    ));
        }
    }
}