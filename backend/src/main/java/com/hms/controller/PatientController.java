package com.hms.controller;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.entity.Appointment;
import com.hms.entity.AppointmentStatus;
import com.hms.entity.Patient;
import com.hms.entity.User;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.PatientRepository;
import com.hms.repository.PrescriptionRepository;
import com.hms.repository.UserRepository;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private final PatientRepository patientRepository;

    private final UserRepository userRepository;

    private final AppointmentRepository appointmentRepository;

    private final PrescriptionRepository prescriptionRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public PatientController(
            PatientRepository patientRepository,
            UserRepository userRepository,
            AppointmentRepository appointmentRepository,
            PrescriptionRepository prescriptionRepository) {

        this.patientRepository =
                patientRepository;

        this.userRepository =
                userRepository;

        this.appointmentRepository =
                appointmentRepository;

        this.prescriptionRepository =
                prescriptionRepository;
    }


    // =====================================================
    // PATIENT DASHBOARD
    // GET /api/patient/dashboard
    // =====================================================

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(
            Authentication authentication) {

        try {

            // =================================================
            // 1. AUTHENTICATION CHECK
            // =================================================

            if (authentication == null) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                Map.of(
                                        "message",
                                        "User is not authenticated"
                                )
                        );
            }


            // =================================================
            // 2. GET LOGGED-IN USER
            // =================================================

            String loginEmail =
                    authentication.getName();


            User user =
                    userRepository
                            .findByLoginEmail(loginEmail)
                            .orElse(null);


            if (user == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                Map.of(
                                        "message",
                                        "User not found"
                                )
                        );
            }


            // =================================================
            // 3. GET PATIENT
            // =================================================

            Patient patient =
                    patientRepository
                            .findByUserId(user.getId())
                            .orElse(null);


            if (patient == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                Map.of(
                                        "message",
                                        "Patient profile not found"
                                )
                        );
            }


            // =================================================
            // 4. TODAY
            // =================================================

            LocalDate today =
                    LocalDate.now();


            // =================================================
            // 5. GET ALL APPOINTMENTS
            // =================================================
            //
            // IMPORTANT:
            //
            // We use findAll() here.
            //
            // Therefore you DO NOT need to create:
            //
            // findByPatientIdAndAppointmentDateGreaterThanEqual...
            //
            // in AppointmentRepository.
            //
            // No MySQL table/query modification is required.
            //
            // =================================================

            List<Appointment> allAppointments =
                    appointmentRepository.findAll();


            // =================================================
            // 6. GET THIS PATIENT'S APPOINTMENTS
            // =================================================

            List<Appointment> patientAppointments =
                    allAppointments
                            .stream()
                            .filter(appointment -> {

                                if (appointment == null) {

                                    return false;
                                }


                                if (appointment.getPatient() == null) {

                                    return false;
                                }


                                return appointment
                                        .getPatient()
                                        .getId()
                                        .equals(
                                                patient.getId()
                                        );

                            })
                            .sorted(
                                    Comparator
                                            .comparing(
                                                    Appointment::getAppointmentDate,
                                                    Comparator.nullsLast(
                                                            Comparator.naturalOrder()
                                                    )
                                            )
                                            .thenComparing(
                                                    Appointment::getAppointmentTime,
                                                    Comparator.nullsLast(
                                                            Comparator.naturalOrder()
                                                    )
                                            )
                            )
                            .toList();


            // =================================================
            // 7. ACTIVE TODAY + FUTURE APPOINTMENTS
            // =================================================

            List<Appointment> activeAppointments =
                    patientAppointments
                            .stream()
                            .filter(appointment -> {

                                // ---------------------------------
                                // DATE CHECK
                                // ---------------------------------

                                if (appointment
                                        .getAppointmentDate()
                                        == null) {

                                    return false;
                                }


                                // ---------------------------------
                                // REMOVE PREVIOUS APPOINTMENTS
                                // ---------------------------------

                                if (appointment
                                        .getAppointmentDate()
                                        .isBefore(today)) {

                                    return false;
                                }


                                // ---------------------------------
                                // REMOVE INACTIVE STATUS
                                // ---------------------------------

                                return isActiveAppointment(
                                        appointment
                                );

                            })
                            .toList();


            // =================================================
            // 8. TOTAL APPOINTMENTS
            // =================================================
            //
            // Today's + future active appointments.
            //
            // =================================================

            long totalAppointments =
                    activeAppointments.size();


            // =================================================
            // 9. UPCOMING APPOINTMENTS
            // =================================================
            //
            // Includes today's appointments and future
            // appointments.
            //
            // =================================================

            long upcomingAppointments =
                    activeAppointments
                            .stream()
                            .filter(appointment -> {

                                LocalDate appointmentDate =
                                        appointment
                                                .getAppointmentDate();


                                return appointmentDate
                                        .isEqual(today)
                                        ||
                                        appointmentDate
                                                .isAfter(today);

                            })
                            .count();


            // =================================================
            // 10. TOTAL PRESCRIPTIONS
            // =================================================

            long totalPrescriptions =
                    prescriptionRepository
                            .findByPatientIdAndPatientDeletedFalseOrderByCreatedAtDesc(
                                    patient.getId()
                            )
                            .size();


            // =================================================
            // 11. PENDING BILLS
            // =================================================
            //
            // Bill module is not connected yet.
            //
            // =================================================

            long pendingBills = 0;


            // =================================================
            // 12. FIND NEXT APPOINTMENT
            // =================================================

            Appointment nextAppointment =
                    activeAppointments
                            .stream()
                            .min(
                                    (a, b) -> {

                                        // -------------------------
                                        // COMPARE DATE
                                        // -------------------------

                                        if (a.getAppointmentDate()
                                                == null
                                                &&
                                                b.getAppointmentDate()
                                                        == null) {

                                            return 0;
                                        }


                                        if (a.getAppointmentDate()
                                                == null) {

                                            return 1;
                                        }


                                        if (b.getAppointmentDate()
                                                == null) {

                                            return -1;
                                        }


                                        int dateCompare =
                                                a.getAppointmentDate()
                                                        .compareTo(
                                                                b.getAppointmentDate()
                                                        );


                                        if (dateCompare != 0) {

                                            return dateCompare;
                                        }


                                        // -------------------------
                                        // COMPARE TIME
                                        // -------------------------

                                        if (a.getAppointmentTime()
                                                == null
                                                &&
                                                b.getAppointmentTime()
                                                        == null) {

                                            return 0;
                                        }


                                        if (a.getAppointmentTime()
                                                == null) {

                                            return 1;
                                        }


                                        if (b.getAppointmentTime()
                                                == null) {

                                            return -1;
                                        }


                                        return a.getAppointmentTime()
                                                .compareTo(
                                                        b.getAppointmentTime()
                                                );
                                    }
                            )
                            .orElse(null);


            // =================================================
            // 13. CREATE RESPONSE
            // =================================================

            Map<String, Object> response =
                    new LinkedHashMap<>();


            // =================================================
            // PATIENT NAME
            // =================================================

            response.put(
                    "patientName",
                    patient.getPatientName()
            );


            // =================================================
            // TOTAL APPOINTMENTS
            // =================================================

            response.put(
                    "totalAppointments",
                    totalAppointments
            );


            // =================================================
            // UPCOMING APPOINTMENTS
            // =================================================

            response.put(
                    "upcomingAppointments",
                    upcomingAppointments
            );


            // =================================================
            // TOTAL PRESCRIPTIONS
            // =================================================

            response.put(
                    "totalPrescriptions",
                    totalPrescriptions
            );


            // =================================================
            // PENDING BILLS
            // =================================================

            response.put(
                    "pendingBills",
                    pendingBills
            );


            // =================================================
            // 14. NEXT APPOINTMENT
            // =================================================

            if (nextAppointment != null) {

                Map<String, Object> next =
                        new LinkedHashMap<>();


                // ---------------------------------------------
                // APPOINTMENT ID
                // ---------------------------------------------

                next.put(
                        "id",
                        nextAppointment.getId()
                );


                // ---------------------------------------------
                // DATE
                // ---------------------------------------------

                next.put(
                        "appointmentDate",
                        nextAppointment
                                .getAppointmentDate()
                );


                // ---------------------------------------------
                // TIME
                // ---------------------------------------------

                next.put(
                        "appointmentTime",
                        nextAppointment
                                .getAppointmentTime()
                );


                // ---------------------------------------------
                // STATUS
                // ---------------------------------------------

                next.put(
                        "status",
                        nextAppointment.getStatus()
                );


                // ---------------------------------------------
                // DOCTOR
                // ---------------------------------------------

                if (nextAppointment.getDoctor() != null) {

                    next.put(
                            "doctorName",
                            nextAppointment
                                    .getDoctor()
                                    .getDoctorName()
                    );

                } else {

                    next.put(
                            "doctorName",
                            "Doctor"
                    );
                }


                // ---------------------------------------------
                // DEPARTMENT
                // ---------------------------------------------

                if (nextAppointment.getDepartment() != null) {

                    next.put(
                            "departmentName",
                            nextAppointment
                                    .getDepartment()
                                    .getDepartmentName()
                    );

                } else {

                    next.put(
                            "departmentName",
                            "Department"
                    );
                }


                // ---------------------------------------------
                // ADD NEXT APPOINTMENT
                // ---------------------------------------------

                response.put(
                        "nextAppointment",
                        next
                );

            } else {

                response.put(
                        "nextAppointment",
                        null
                );
            }


            // =================================================
            // 15. RETURN RESPONSE
            // =================================================

            return ResponseEntity.ok(
                    response
            );


        } catch (Exception e) {

            e.printStackTrace();


            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unable to load dashboard"
                            )
                    );
        }
    }


    // =====================================================
    // HELPER METHOD
    // =====================================================

    private boolean isActiveAppointment(
            Appointment appointment) {

        AppointmentStatus status =
                appointment.getStatus();


        // =================================================
        // NULL STATUS
        // =================================================

        if (status == null) {

            return false;
        }


        // =================================================
        // ACTIVE STATUS
        // =================================================

        return status != AppointmentStatus.CANCELLED
                &&
                status != AppointmentStatus.REJECTED
                &&
                status != AppointmentStatus.COMPLETED;
    }
}