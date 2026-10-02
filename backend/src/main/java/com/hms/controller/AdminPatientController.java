package com.hms.controller;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.dto.PatientCreateRequest;
import com.hms.entity.Patient;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.PatientRepository;
import com.hms.service.PatientService;

@RestController
@RequestMapping("/api/admin/patients")
public class AdminPatientController {

    private final PatientRepository patientRepository;

    private final PatientService patientService;

    private final AppointmentRepository appointmentRepository;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public AdminPatientController(
            PatientRepository patientRepository,
            PatientService patientService,
            AppointmentRepository appointmentRepository) {

        this.patientRepository =
                patientRepository;

        this.patientService =
                patientService;

        this.appointmentRepository =
                appointmentRepository;
    }


    // ==========================================
    // GET TODAY'S PATIENTS ONLY
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getAllPatients() {

        // ------------------------------------------
        // TODAY'S DATE
        // ------------------------------------------

        LocalDate today =
                LocalDate.now();


        // ------------------------------------------
        // GET PATIENTS WHO HAVE APPOINTMENT TODAY
        // ------------------------------------------

        List<Patient> patients =
                appointmentRepository
                        .findPatientsByAppointmentDate(
                                today
                        );


        // ------------------------------------------
        // CONVERT TO RESPONSE
        // ------------------------------------------

        List<Map<String, Object>> response =
                patients.stream()
                        .map(patient -> {

                            Map<String, Object> map =
                                    new LinkedHashMap<>();


                            map.put(
                                    "id",
                                    patient.getId()
                            );


                            map.put(
                                    "patientName",
                                    patient.getPatientName()
                            );


                            map.put(
                                    "age",
                                    patient.getAge()
                            );


                            map.put(
                                    "gender",
                                    patient.getGender()
                            );


                            map.put(
                                    "phone",
                                    patient.getPhone()
                            );


                            map.put(
                                    "email",
                                    patient.getEmail()
                            );


                            map.put(
                                    "address",
                                    patient.getAddress()
                            );


                            map.put(
                                    "disease",
                                    patient.getDisease()
                            );


                            return map;

                        })
                        .toList();


        // ------------------------------------------
        // RETURN TODAY'S PATIENTS
        // ------------------------------------------

        return ResponseEntity.ok(response);
    }


    // ==========================================
    // GET PATIENT BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getPatientById(
            @PathVariable Long id) {


        // ------------------------------------------
        // FIND PATIENT
        // ------------------------------------------

        Patient patient =
                patientRepository
                        .findById(id)
                        .orElse(null);


        // ------------------------------------------
        // PATIENT NOT FOUND
        // ------------------------------------------

        if (patient == null) {

            Map<String, Object> error =
                    new LinkedHashMap<>();


            error.put(
                    "message",
                    "Patient not found."
            );


            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error);
        }


        // ------------------------------------------
        // PREPARE RESPONSE
        // ------------------------------------------

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


        // ------------------------------------------
        // LOGIN ACCOUNT INFORMATION
        // ------------------------------------------

        if (patient.getUser() != null) {

            response.put(
                    "loginEmail",
                    patient.getUser()
                            .getLoginEmail()
            );


            if (patient.getUser().getRole() != null) {

                response.put(
                        "role",
                        patient.getUser()
                                .getRole()
                                .name()
                );

            } else {

                response.put(
                        "role",
                        "PATIENT"
                );
            }

        } else {

            response.put(
                    "loginEmail",
                    null
            );


            response.put(
                    "role",
                    "PATIENT"
            );
        }


        // ------------------------------------------
        // RETURN PATIENT
        // ------------------------------------------

        return ResponseEntity.ok(response);
    }


    // ==========================================
    // CREATE PATIENT
    // ==========================================

    @PostMapping
    public ResponseEntity<?> createPatient(
            @RequestBody PatientCreateRequest request) {

        try {

            String message =
                    patientService.createPatient(request);


            return ResponseEntity.ok(message);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

}