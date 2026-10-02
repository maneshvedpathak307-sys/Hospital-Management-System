package com.hms.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.entity.Appointment;
import com.hms.entity.AppointmentStatus;
import com.hms.entity.Doctor;
import com.hms.entity.User;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.UserRepository;


@RestController
@RequestMapping("/api/doctor/appointments")
public class DoctorAppointmentController {


    private final AppointmentRepository appointmentRepository;

    private final DoctorRepository doctorRepository;

    private final UserRepository userRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public DoctorAppointmentController(
            AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository,
            UserRepository userRepository) {

        this.appointmentRepository =
                appointmentRepository;

        this.doctorRepository =
                doctorRepository;

        this.userRepository =
                userRepository;
    }


    // =====================================================
    // GET TODAY'S APPOINTMENTS FOR LOGGED-IN DOCTOR
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getMyAppointments(
            Authentication authentication) {

        try {

            // ---------------------------------------------
            // 1. Get logged-in doctor
            // ---------------------------------------------

            Doctor doctor =
                    getLoggedInDoctor(authentication);


            // ---------------------------------------------
            // 2. Get today's date
            // ---------------------------------------------

            LocalDate today =
                    LocalDate.now();


            // ---------------------------------------------
            // 3. Get today's appointments only
            // ---------------------------------------------

            List<Appointment> appointments =
                    appointmentRepository
                            .findByDoctorIdAndAppointmentDateOrderByAppointmentTimeAsc(
                                    doctor.getId(),
                                    today
                            );


            // ---------------------------------------------
            // 4. Convert appointments
            // ---------------------------------------------

            return ResponseEntity.ok(
                    convertAppointments(appointments)
            );


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            createErrorResponse(
                                    e.getMessage()
                            )
                    );
        }
    }


    // =====================================================
    // GET PENDING APPOINTMENTS
    // =====================================================
    //
    // This returns only TODAY'S pending appointments.
    //
    // =====================================================

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingAppointments(
            Authentication authentication) {

        try {

            // ---------------------------------------------
            // 1. Get logged-in doctor
            // ---------------------------------------------

            Doctor doctor =
                    getLoggedInDoctor(authentication);


            // ---------------------------------------------
            // 2. Get today's date
            // ---------------------------------------------

            LocalDate today =
                    LocalDate.now();


            // ---------------------------------------------
            // 3. Get today's appointments
            // ---------------------------------------------

            List<Appointment> appointments =
                    appointmentRepository
                            .findByDoctorIdAndAppointmentDateOrderByAppointmentTimeAsc(
                                    doctor.getId(),
                                    today
                            );


            // ---------------------------------------------
            // 4. Keep only PENDING appointments
            // ---------------------------------------------

            List<Appointment> pendingAppointments =
                    appointments.stream()
                            .filter(appointment ->
                                    appointment.getStatus()
                                            == AppointmentStatus.PENDING
                            )
                            .toList();


            // ---------------------------------------------
            // 5. Return response
            // ---------------------------------------------

            return ResponseEntity.ok(
                    convertAppointments(
                            pendingAppointments
                    )
            );


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            createErrorResponse(
                                    e.getMessage()
                            )
                    );
        }
    }


    // =====================================================
    // GET APPOINTMENT DETAILS
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            // ---------------------------------------------
            // 1. Get logged-in doctor
            // ---------------------------------------------

            Doctor loggedInDoctor =
                    getLoggedInDoctor(authentication);


            // ---------------------------------------------
            // 2. Find appointment
            // ---------------------------------------------

            Appointment appointment =
                    appointmentRepository
                            .findById(id)
                            .orElse(null);


            if (appointment == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                createErrorResponse(
                                        "Appointment not found"
                                )
                        );
            }


            // ---------------------------------------------
            // 3. Check doctor
            // ---------------------------------------------

            if (appointment.getDoctor() == null) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                createErrorResponse(
                                        "This appointment has no doctor assigned"
                                )
                        );
            }


            // ---------------------------------------------
            // 4. Security check
            // ---------------------------------------------

            if (!appointment.getDoctor()
                    .getId()
                    .equals(loggedInDoctor.getId())) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                createErrorResponse(
                                        "You can view only your own appointments"
                                )
                        );
            }


            // ---------------------------------------------
            // 5. Create response
            // ---------------------------------------------

            Map<String, Object> response =
                    convertAppointmentDetails(
                            appointment
                    );


            return ResponseEntity.ok(response);


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            createErrorResponse(
                                    e.getMessage()
                            )
                    );
        }
    }


    // =====================================================
    // APPROVE APPOINTMENT
    // =====================================================

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveAppointment(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            // ---------------------------------------------
            // 1. Get logged-in doctor
            // ---------------------------------------------

            Doctor loggedInDoctor =
                    getLoggedInDoctor(authentication);


            // ---------------------------------------------
            // 2. Find appointment
            // ---------------------------------------------

            Appointment appointment =
                    appointmentRepository
                            .findById(id)
                            .orElse(null);


            if (appointment == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                createErrorResponse(
                                        "Appointment not found"
                                )
                        );
            }


            // ---------------------------------------------
            // 3. Check doctor
            // ---------------------------------------------

            if (appointment.getDoctor() == null) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                createErrorResponse(
                                        "This appointment has no doctor assigned"
                                )
                        );
            }


            // ---------------------------------------------
            // 4. Doctor ownership check
            // ---------------------------------------------

            if (!appointment.getDoctor()
                    .getId()
                    .equals(loggedInDoctor.getId())) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                createErrorResponse(
                                        "You are not authorized to approve this appointment"
                                )
                        );
            }


            // ---------------------------------------------
            // 5. Check appointment is today
            // ---------------------------------------------

            if (!LocalDate.now()
                    .equals(appointment.getAppointmentDate())) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                createErrorResponse(
                                        "Only today's appointments can be approved"
                                )
                        );
            }


            // ---------------------------------------------
            // 6. Check status
            // ---------------------------------------------

            if (appointment.getStatus() !=
                    AppointmentStatus.PENDING) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                createErrorResponse(
                                        "Only pending appointments can be approved"
                                )
                        );
            }


            // ---------------------------------------------
            // 7. Update status
            // ---------------------------------------------

            appointment.setStatus(
                    AppointmentStatus.APPROVED
            );


            Appointment updatedAppointment =
                    appointmentRepository.save(
                            appointment
                    );


            // ---------------------------------------------
            // 8. Response
            // ---------------------------------------------

            Map<String, Object> response =
                    new LinkedHashMap<>();


            response.put(
                    "message",
                    "Appointment approved successfully"
            );


            response.put(
                    "id",
                    updatedAppointment.getId()
            );


            response.put(
                    "status",
                    updatedAppointment.getStatus()
                            .name()
            );


            return ResponseEntity.ok(response);


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            createErrorResponse(
                                    e.getMessage()
                            )
                    );
        }
    }


    // =====================================================
    // REJECT APPOINTMENT
    // =====================================================

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectAppointment(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            // ---------------------------------------------
            // 1. Get logged-in doctor
            // ---------------------------------------------

            Doctor loggedInDoctor =
                    getLoggedInDoctor(authentication);


            // ---------------------------------------------
            // 2. Find appointment
            // ---------------------------------------------

            Appointment appointment =
                    appointmentRepository
                            .findById(id)
                            .orElse(null);


            if (appointment == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                createErrorResponse(
                                        "Appointment not found"
                                )
                        );
            }


            // ---------------------------------------------
            // 3. Check doctor
            // ---------------------------------------------

            if (appointment.getDoctor() == null) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                createErrorResponse(
                                        "This appointment has no doctor assigned"
                                )
                        );
            }


            // ---------------------------------------------
            // 4. Doctor ownership check
            // ---------------------------------------------

            if (!appointment.getDoctor()
                    .getId()
                    .equals(loggedInDoctor.getId())) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                createErrorResponse(
                                        "You are not authorized to reject this appointment"
                                )
                        );
            }


            // ---------------------------------------------
            // 5. Check appointment is today
            // ---------------------------------------------

            if (!LocalDate.now()
                    .equals(appointment.getAppointmentDate())) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                createErrorResponse(
                                        "Only today's appointments can be rejected"
                                )
                        );
            }


            // ---------------------------------------------
            // 6. Check status
            // ---------------------------------------------

            if (appointment.getStatus() !=
                    AppointmentStatus.PENDING) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                createErrorResponse(
                                        "Only pending appointments can be rejected"
                                )
                        );
            }


            // ---------------------------------------------
            // 7. Update status
            // ---------------------------------------------

            appointment.setStatus(
                    AppointmentStatus.REJECTED
            );


            Appointment updatedAppointment =
                    appointmentRepository.save(
                            appointment
                    );


            // ---------------------------------------------
            // 8. Response
            // ---------------------------------------------

            Map<String, Object> response =
                    new LinkedHashMap<>();


            response.put(
                    "message",
                    "Appointment rejected successfully"
            );


            response.put(
                    "id",
                    updatedAppointment.getId()
            );


            response.put(
                    "status",
                    updatedAppointment.getStatus()
                            .name()
            );


            return ResponseEntity.ok(response);


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            createErrorResponse(
                                    e.getMessage()
                            )
                    );
        }
    }


    // =====================================================
    // MARK APPOINTMENT AS COMPLETED
    // =====================================================

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeAppointment(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            // ---------------------------------------------
            // 1. Get logged-in doctor
            // ---------------------------------------------

            Doctor loggedInDoctor =
                    getLoggedInDoctor(authentication);


            // ---------------------------------------------
            // 2. Find appointment
            // ---------------------------------------------

            Appointment appointment =
                    appointmentRepository
                            .findById(id)
                            .orElse(null);


            if (appointment == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                createErrorResponse(
                                        "Appointment not found"
                                )
                        );
            }


            // ---------------------------------------------
            // 3. Check doctor
            // ---------------------------------------------

            if (appointment.getDoctor() == null) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                createErrorResponse(
                                        "This appointment has no doctor assigned"
                                )
                        );
            }


            // ---------------------------------------------
            // 4. Doctor ownership check
            // ---------------------------------------------

            if (!appointment.getDoctor()
                    .getId()
                    .equals(loggedInDoctor.getId())) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                createErrorResponse(
                                        "You are not authorized to complete this appointment"
                                )
                        );
            }


            // ---------------------------------------------
            // 5. Check appointment is today
            // ---------------------------------------------

            if (!LocalDate.now()
                    .equals(appointment.getAppointmentDate())) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                createErrorResponse(
                                        "Only today's appointments can be completed"
                                )
                        );
            }


            // ---------------------------------------------
            // 6. Check status
            // ---------------------------------------------

            if (appointment.getStatus() !=
                    AppointmentStatus.APPROVED) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                createErrorResponse(
                                        "Only approved appointments can be completed"
                                )
                        );
            }


            // ---------------------------------------------
            // 7. Update status
            // ---------------------------------------------

            appointment.setStatus(
                    AppointmentStatus.COMPLETED
            );


            Appointment updatedAppointment =
                    appointmentRepository.save(
                            appointment
                    );


            // ---------------------------------------------
            // 8. Response
            // ---------------------------------------------

            Map<String, Object> response =
                    new LinkedHashMap<>();


            response.put(
                    "message",
                    "Appointment completed successfully"
            );


            response.put(
                    "id",
                    updatedAppointment.getId()
            );


            response.put(
                    "status",
                    updatedAppointment.getStatus()
                            .name()
            );


            return ResponseEntity.ok(response);


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            createErrorResponse(
                                    e.getMessage()
                            )
                    );
        }
    }


    // =====================================================
    // GET LOGGED-IN DOCTOR
    // =====================================================

    private Doctor getLoggedInDoctor(
            Authentication authentication) {

        // ---------------------------------------------
        // Authentication check
        // ---------------------------------------------

        if (authentication == null) {

            throw new RuntimeException(
                    "Authentication required"
            );
        }


        // ---------------------------------------------
        // Get login email from JWT
        // ---------------------------------------------

        String loginEmail =
                authentication.getName();


        if (loginEmail == null ||
                loginEmail.trim().isEmpty()) {

            throw new RuntimeException(
                    "Login email not found"
            );
        }


        // ---------------------------------------------
        // Find User
        // ---------------------------------------------

        User user =
                userRepository
                        .findByLoginEmail(loginEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        // ---------------------------------------------
        // Find Doctor
        // ---------------------------------------------

        return doctorRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor profile not found"
                        )
                );
    }


    // =====================================================
    // CONVERT APPOINTMENTS
    // =====================================================

    private List<Map<String, Object>> convertAppointments(
            List<Appointment> appointments) {

        List<Map<String, Object>> result =
                new ArrayList<>();


        for (Appointment appointment :
                appointments) {

            Map<String, Object> data =
                    new LinkedHashMap<>();


            // ---------------------------------------------
            // Appointment ID
            // ---------------------------------------------

            data.put(
                    "id",
                    appointment.getId()
            );


            // ---------------------------------------------
            // Patient
            // ---------------------------------------------

            if (appointment.getPatient() != null) {

                data.put(
                        "patientId",
                        appointment.getPatient().getId()
                );


                data.put(
                        "patientName",
                        appointment.getPatient()
                                .getPatientName()
                );


                data.put(
                        "patientPhone",
                        appointment.getPatient()
                                .getPhone()
                );


                data.put(
                        "patientEmail",
                        appointment.getPatient()
                                .getEmail()
                );


                data.put(
                        "patientAge",
                        appointment.getPatient()
                                .getAge()
                );


                data.put(
                        "patientGender",
                        appointment.getPatient()
                                .getGender()
                );


                data.put(
                        "patientDisease",
                        appointment.getPatient()
                                .getDisease()
                );


                data.put(
                        "patientAddress",
                        appointment.getPatient()
                                .getAddress()
                );

            } else {

                data.put(
                        "patientId",
                        null
                );

                data.put(
                        "patientName",
                        "-"
                );

                data.put(
                        "patientPhone",
                        "-"
                );

                data.put(
                        "patientEmail",
                        "-"
                );

                data.put(
                        "patientAge",
                        null
                );

                data.put(
                        "patientGender",
                        "-"
                );

                data.put(
                        "patientDisease",
                        "-"
                );

                data.put(
                        "patientAddress",
                        "-"
                );
            }


            // ---------------------------------------------
            // Doctor
            // ---------------------------------------------

            if (appointment.getDoctor() != null) {

                data.put(
                        "doctorId",
                        appointment.getDoctor().getId()
                );


                data.put(
                        "doctorName",
                        appointment.getDoctor()
                                .getDoctorName()
                );


                data.put(
                        "specialization",
                        appointment.getDoctor()
                                .getSpecialization()
                );

            } else {

                data.put(
                        "doctorId",
                        null
                );

                data.put(
                        "doctorName",
                        "-"
                );

                data.put(
                        "specialization",
                        "-"
                );
            }


            // ---------------------------------------------
            // Department
            // ---------------------------------------------

            if (appointment.getDepartment() != null) {

                data.put(
                        "departmentId",
                        appointment.getDepartment()
                                .getId()
                );


                data.put(
                        "departmentName",
                        appointment.getDepartment()
                                .getDepartmentName()
                );

            } else {

                data.put(
                        "departmentId",
                        null
                );

                data.put(
                        "departmentName",
                        "-"
                );
            }


            // ---------------------------------------------
            // Appointment Date
            // ---------------------------------------------

            data.put(
                    "appointmentDate",
                    appointment.getAppointmentDate()
            );


            // ---------------------------------------------
            // Appointment Time
            // ---------------------------------------------

            data.put(
                    "appointmentTime",
                    appointment.getAppointmentTime()
            );


            // ---------------------------------------------
            // Reason
            // ---------------------------------------------

            data.put(
                    "reason",
                    appointment.getReason()
            );


            // ---------------------------------------------
            // Status
            // ---------------------------------------------

            data.put(
                    "status",
                    appointment.getStatus() != null
                            ? appointment.getStatus().name()
                            : "PENDING"
            );


            // ---------------------------------------------
            // Created At
            // ---------------------------------------------

            data.put(
                    "createdAt",
                    appointment.getCreatedAt()
            );


            result.add(data);
        }


        return result;
    }


    // =====================================================
    // CONVERT SINGLE APPOINTMENT DETAILS
    // =====================================================

    private Map<String, Object> convertAppointmentDetails(
            Appointment appointment) {

        Map<String, Object> response =
                new LinkedHashMap<>();


        // =================================================
        // APPOINTMENT
        // =================================================

        response.put(
                "id",
                appointment.getId()
        );


        response.put(
                "appointmentDate",
                appointment.getAppointmentDate()
        );


        response.put(
                "appointmentTime",
                appointment.getAppointmentTime()
        );


        response.put(
                "reason",
                appointment.getReason()
        );


        response.put(
                "status",
                appointment.getStatus() != null
                        ? appointment.getStatus().name()
                        : "PENDING"
        );


        response.put(
                "createdAt",
                appointment.getCreatedAt()
        );


        // =================================================
        // PATIENT
        // =================================================

        if (appointment.getPatient() != null) {

            response.put(
                    "patientId",
                    appointment.getPatient().getId()
            );


            response.put(
                    "patientName",
                    appointment.getPatient()
                            .getPatientName()
            );


            response.put(
                    "patientPhone",
                    appointment.getPatient()
                            .getPhone()
            );


            response.put(
                    "patientEmail",
                    appointment.getPatient()
                            .getEmail()
            );


            response.put(
                    "patientAge",
                    appointment.getPatient()
                            .getAge()
            );


            response.put(
                    "patientGender",
                    appointment.getPatient()
                            .getGender()
            );


            response.put(
                    "patientDisease",
                    appointment.getPatient()
                            .getDisease()
            );


            response.put(
                    "patientAddress",
                    appointment.getPatient()
                            .getAddress()
            );

        } else {

            response.put(
                    "patientId",
                    null
            );


            response.put(
                    "patientName",
                    "-"
            );


            response.put(
                    "patientPhone",
                    "-"
            );


            response.put(
                    "patientEmail",
                    "-"
            );


            response.put(
                    "patientAge",
                    null
            );


            response.put(
                    "patientGender",
                    "-"
            );


            response.put(
                    "patientDisease",
                    "-"
            );


            response.put(
                    "patientAddress",
                    "-"
            );
        }


        // =================================================
        // DOCTOR
        // =================================================

        if (appointment.getDoctor() != null) {

            response.put(
                    "doctorId",
                    appointment.getDoctor().getId()
            );


            response.put(
                    "doctorName",
                    appointment.getDoctor()
                            .getDoctorName()
            );


            response.put(
                    "specialization",
                    appointment.getDoctor()
                            .getSpecialization()
            );

        } else {

            response.put(
                    "doctorId",
                    null
            );


            response.put(
                    "doctorName",
                    "-"
            );


            response.put(
                    "specialization",
                    "-"
            );
        }


        // =================================================
        // DEPARTMENT
        // =================================================

        if (appointment.getDepartment() != null) {

            response.put(
                    "departmentId",
                    appointment.getDepartment()
                            .getId()
            );


            response.put(
                    "departmentName",
                    appointment.getDepartment()
                            .getDepartmentName()
            );

        } else {

            response.put(
                    "departmentId",
                    null
            );


            response.put(
                    "departmentName",
                    "-"
            );
        }


        return response;
    }


    // =====================================================
    // ERROR RESPONSE
    // =====================================================

    private Map<String, Object> createErrorResponse(
            String message) {

        Map<String, Object> error =
                new LinkedHashMap<>();


        error.put(
                "message",
                message != null
                        ? message
                        : "Something went wrong"
        );


        return error;
    }

}