package com.hms.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.hms.dto.CompletedAppointmentResponse;
import com.hms.dto.PrescriptionRequest;
import com.hms.dto.PrescriptionResponse;
import com.hms.entity.Appointment;
import com.hms.entity.AppointmentStatus;
import com.hms.entity.Doctor;
import com.hms.entity.User;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.UserRepository;
import com.hms.service.PrescriptionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/doctor/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    private final AppointmentRepository appointmentRepository;

    private final DoctorRepository doctorRepository;

    private final UserRepository userRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public PrescriptionController(
            PrescriptionService prescriptionService,
            AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository,
            UserRepository userRepository) {

        this.prescriptionService =
                prescriptionService;

        this.appointmentRepository =
                appointmentRepository;

        this.doctorRepository =
                doctorRepository;

        this.userRepository =
                userRepository;
    }


    // =====================================================
    // CREATE PRESCRIPTION
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createPrescription(
            @Valid @RequestBody PrescriptionRequest request,
            Authentication authentication) {

        try {

            PrescriptionResponse response =
                    prescriptionService.createPrescription(
                            request,
                            authentication
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET DOCTOR PRESCRIPTIONS
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getMyPrescriptions(
            Authentication authentication) {

        try {

            List<PrescriptionResponse> response =
                    prescriptionService.getDoctorPrescriptions(
                            authentication
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET SINGLE DOCTOR PRESCRIPTION
    // =====================================================

    @GetMapping("/{prescriptionId}")
    public ResponseEntity<?> getPrescriptionById(
            @PathVariable Long prescriptionId,
            Authentication authentication) {

        try {

            PrescriptionResponse response =
                    prescriptionService
                            .getDoctorPrescriptionById(
                                    prescriptionId,
                                    authentication
                            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // UPDATE DOCTOR PRESCRIPTION
    // =====================================================
    //
    // PUT:
    // /api/doctor/prescriptions/{prescriptionId}
    //
    // Doctor can update:
    // - Diagnosis
    // - Medicines
    // - Dosage
    // - Frequency
    // - Duration
    // - Medicine instructions
    // - General instructions
    //
    // =====================================================

    @PutMapping("/{prescriptionId}")
    public ResponseEntity<?> updatePrescription(
            @PathVariable Long prescriptionId,
            @Valid @RequestBody PrescriptionRequest request,
            Authentication authentication) {

        try {

            PrescriptionResponse response =
                    prescriptionService.updatePrescription(
                            prescriptionId,
                            request,
                            authentication
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET TODAY'S COMPLETED APPOINTMENTS
    // =====================================================

    @GetMapping("/appointments/completed")
    public ResponseEntity<?> getCompletedAppointments(
            Authentication authentication) {

        try {

            Doctor doctor =
                    getLoggedInDoctor(authentication);


            LocalDate today =
                    LocalDate.now();


            List<Appointment> appointments =
                    appointmentRepository
                            .findByDoctorIdAndAppointmentDateAndStatusOrderByAppointmentTimeAsc(
                                    doctor.getId(),
                                    today,
                                    AppointmentStatus.COMPLETED
                            );


            List<CompletedAppointmentResponse>
                    response =
                    new ArrayList<>();


            for (
                    Appointment appointment :
                    appointments
            ) {

                CompletedAppointmentResponse dto =
                        new CompletedAppointmentResponse();


                dto.setId(
                        appointment.getId()
                );


                if (appointment.getPatient() != null) {

                    dto.setPatientId(
                            appointment
                                    .getPatient()
                                    .getId()
                    );


                    dto.setPatientName(
                            appointment
                                    .getPatient()
                                    .getPatientName()
                    );
                }


                dto.setAppointmentDate(
                        appointment.getAppointmentDate()
                );


                dto.setAppointmentTime(
                        appointment.getAppointmentTime()
                );


                dto.setStatus(
                        appointment
                                .getStatus()
                                .name()
                );


                response.add(dto);
            }


            return ResponseEntity.ok(response);


        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET LOGGED-IN DOCTOR
    // =====================================================

    private Doctor getLoggedInDoctor(
            Authentication authentication) {

        if (authentication == null) {

            throw new RuntimeException(
                    "Authentication required"
            );
        }


        String loginEmail =
                authentication.getName();


        if (loginEmail == null ||
                loginEmail.trim().isEmpty()) {

            throw new RuntimeException(
                    "Login email not found"
            );
        }


        User user =
                userRepository
                        .findByLoginEmail(
                                loginEmail
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        return doctorRepository
                .findByUserId(
                        user.getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor profile not found"
                        )
                );
    }
}