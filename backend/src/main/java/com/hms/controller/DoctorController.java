package com.hms.controller;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.entity.Appointment;
import com.hms.entity.AppointmentStatus;
import com.hms.entity.Doctor;
import com.hms.entity.Patient;
import com.hms.entity.User;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PrescriptionRepository;
import com.hms.repository.UserRepository;

@RestController
@RequestMapping("/api")
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public DoctorController(
            DoctorRepository doctorRepository,
            UserRepository userRepository,
            AppointmentRepository appointmentRepository,
            PrescriptionRepository prescriptionRepository) {

        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.prescriptionRepository = prescriptionRepository;
    }

    // =====================================================
    // ADMIN - GET ALL DOCTORS
    // =====================================================

    @GetMapping("/admin/doctors")
    public ResponseEntity<?> getAllDoctors() {

        List<Doctor> doctors =
                doctorRepository.findAll();

        List<Map<String, Object>> response =
                doctors.stream()
                        .map(this::createDoctorResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // DOCTOR - GET OWN PROFILE
    // =====================================================

    @GetMapping("/doctor/profile")
    public ResponseEntity<?> getDoctorProfile(
            Authentication authentication) {

        String loginEmail =
                authentication.getName();

        User user =
                userRepository
                        .findByLoginEmail(loginEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        Doctor doctor =
                doctorRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor profile not found"
                                ));

        Map<String, Object> response =
                createDoctorProfileResponse(
                        doctor,
                        user
                );

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // DOCTOR - UPDATE OWN PROFILE
    // =====================================================

    @PutMapping("/doctor/profile")
    public ResponseEntity<?> updateDoctorProfile(
            Authentication authentication,
            @RequestBody Map<String, Object> request) {

        String loginEmail =
                authentication.getName();

        User user =
                userRepository
                        .findByLoginEmail(loginEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        Doctor doctor =
                doctorRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor profile not found"
                                ));

        // =================================================
        // DOCTOR NAME
        // =================================================

        if (request.containsKey("doctorName")) {

            Object value =
                    request.get("doctorName");

            if (value != null) {

                doctor.setDoctorName(
                        value.toString()
                );
            }
        }

        // =================================================
        // EMAIL
        // =================================================

        if (request.containsKey("email")) {

            Object value =
                    request.get("email");

            if (value != null) {

                doctor.setEmail(
                        value.toString()
                );
            }
        }

        // =================================================
        // PHONE
        // =================================================

        if (request.containsKey("phone")) {

            Object value =
                    request.get("phone");

            if (value != null) {

                doctor.setPhone(
                        value.toString()
                );
            }
        }

        // =================================================
        // SPECIALIZATION
        // =================================================

        if (request.containsKey("specialization")) {

            Object value =
                    request.get("specialization");

            if (value != null) {

                doctor.setSpecialization(
                        value.toString()
                );
            }
        }

        // =================================================
        // EXPERIENCE
        // =================================================

        if (request.containsKey("experience")) {

            Object value =
                    request.get("experience");

            if (value != null) {

                doctor.setExperience(
                        value.toString()
                );
            }
        }

        // =================================================
        // QUALIFICATION
        // =================================================

        if (request.containsKey("qualification")) {

            Object value =
                    request.get("qualification");

            if (value != null) {

                doctor.setQualification(
                        value.toString()
                );
            }
        }

        // =================================================
        // SAVE
        // =================================================

        Doctor updatedDoctor =
                doctorRepository.save(doctor);

        // =================================================
        // RESPONSE
        // =================================================

        Map<String, Object> response =
                createDoctorProfileResponse(
                        updatedDoctor,
                        user
                );

        response.put(
                "message",
                "Profile updated successfully"
        );

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // DOCTOR - GET TODAY'S PATIENTS
    // =====================================================

    @GetMapping("/doctor/patients")
    public ResponseEntity<?> getMyPatients(
            Authentication authentication) {

        String loginEmail =
                authentication.getName();

        User user =
                userRepository
                        .findByLoginEmail(loginEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        Doctor doctor =
                doctorRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor profile not found"
                                ));

        LocalDate today =
                LocalDate.now();

        List<Patient> patients =
                appointmentRepository
                        .findPatientsByDoctorIdAndAppointmentDate(
                                doctor.getId(),
                                today
                        );

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
                                    "email",
                                    patient.getEmail()
                            );

                            map.put(
                                    "phone",
                                    patient.getPhone()
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
                                    "disease",
                                    patient.getDisease()
                            );

                            map.put(
                                    "address",
                                    patient.getAddress()
                            );

                            return map;

                        })
                        .toList();

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // DOCTOR - GET TODAY'S PATIENT DETAILS
    // =====================================================

    @GetMapping("/doctor/patients/{id}")
    public ResponseEntity<?> getPatientDetails(
            @PathVariable Long id,
            Authentication authentication) {

        String loginEmail =
                authentication.getName();

        User user =
                userRepository
                        .findByLoginEmail(loginEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        Doctor doctor =
                doctorRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor profile not found"
                                ));

        LocalDate today =
                LocalDate.now();

        boolean hasAppointment =
                appointmentRepository
                        .existsPatientAppointmentForDoctorToday(
                                doctor.getId(),
                                id,
                                today
                        );

        if (!hasAppointment) {

            Map<String, Object> error =
                    new LinkedHashMap<>();

            error.put(
                    "message",
                    "Patient does not have an appointment with you today."
            );

            return ResponseEntity
                    .status(404)
                    .body(error);
        }

        Patient patient =
                appointmentRepository
                        .findPatientsByDoctorIdAndAppointmentDate(
                                doctor.getId(),
                                today
                        )
                        .stream()
                        .filter(p ->
                                p.getId().equals(id)
                        )
                        .findFirst()
                        .orElse(null);

        if (patient == null) {

            Map<String, Object> error =
                    new LinkedHashMap<>();

            error.put(
                    "message",
                    "Patient not found."
            );

            return ResponseEntity
                    .status(404)
                    .body(error);
        }

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
                "email",
                patient.getEmail()
        );

        response.put(
                "phone",
                patient.getPhone()
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
                "disease",
                patient.getDisease()
        );

        response.put(
                "address",
                patient.getAddress()
        );

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // ADMIN - GET DOCTOR BY ID
    // =====================================================

    @GetMapping("/admin/doctors/{id}")
    public ResponseEntity<?> getDoctorById(
            @PathVariable Long id) {

        Doctor doctor =
                doctorRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                ));

        Map<String, Object> response =
                createDoctorResponse(doctor);

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // PATIENT - GET ALL AVAILABLE DOCTORS
    // =====================================================

    @GetMapping("/patient/doctors")
    public ResponseEntity<?> getDoctorsForPatients() {

        List<Doctor> doctors =
                doctorRepository.findAll();

        List<Map<String, Object>> response =
                doctors.stream()
                        .map(this::createDoctorResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // PATIENT - GET DOCTOR BY ID
    // =====================================================

    @GetMapping("/patient/doctors/{id}")
    public ResponseEntity<?> getDoctorForPatient(
            @PathVariable Long id) {

        Optional<Doctor> doctorOptional =
                doctorRepository.findById(id);

        if (doctorOptional.isEmpty()) {

            Map<String, Object> error =
                    new LinkedHashMap<>();

            error.put(
                    "message",
                    "Doctor not found"
            );

            return ResponseEntity
                    .status(404)
                    .body(error);
        }

        Doctor doctor =
                doctorOptional.get();

        Map<String, Object> response =
                createDoctorResponse(doctor);

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // DOCTOR - DASHBOARD STATISTICS
    // =====================================================

    @GetMapping("/doctor/dashboard/stats")
    public ResponseEntity<?> getDoctorDashboardStats(
            Authentication authentication) {

        String loginEmail =
                authentication.getName();

        User user =
                userRepository
                        .findByLoginEmail(loginEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        Doctor doctor =
                doctorRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor profile not found"
                                ));

        Long doctorId =
                doctor.getId();

        LocalDate today =
                LocalDate.now();

        // =================================================
        // TODAY'S PATIENTS
        // =================================================

        List<Patient> patients =
                appointmentRepository
                        .findPatientsByDoctorIdAndAppointmentDate(
                                doctorId,
                                today
                        );

        int myPatients =
                patients.size();

        // =================================================
        // ALL DOCTOR APPOINTMENTS
        // =================================================

        List<Appointment> appointments =
                appointmentRepository
                        .findByDoctorIdOrderByAppointmentDateAscAppointmentTimeAsc(
                                doctorId
                        );

        // =================================================
        // TODAY'S APPOINTMENTS
        //
        // Only appointments whose date is today.
        // =================================================

        long todayAppointments =
                appointments.stream()
                        .filter(appointment ->
                                appointment.getAppointmentDate() != null
                        )
                        .filter(appointment ->
                                today.equals(
                                        appointment.getAppointmentDate()
                                )
                        )
                        .count();

        // =================================================
        // PENDING APPOINTMENTS
        //
        // IMPORTANT:
        //
        // Only PENDING appointments are counted.
        //
        // Appointment date must be:
        //
        // TODAY or FUTURE
        //
        // Previous dates are NOT counted.
        //
        // Example:
        //
        // 03/10/2026 -> ❌ Previous
        // 04/10/2026 -> ✅ Today
        // 05/10/2026 -> ✅ Future
        // 06/10/2026 -> ✅ Future
        //
        // =================================================

        long pendingAppointments =
                appointments.stream()
                        .filter(appointment ->
                                AppointmentStatus.PENDING.equals(
                                        appointment.getStatus()
                                )
                        )
                        .filter(appointment ->
                                appointment.getAppointmentDate() != null
                        )
                        .filter(appointment ->
                                !appointment
                                        .getAppointmentDate()
                                        .isBefore(today)
                        )
                        .count();

        // =================================================
        // TODAY'S PRESCRIPTIONS
        // =================================================

        int prescriptions =
                prescriptionRepository
                        .findByDoctorIdAndPrescriptionDateAndPatientDeletedFalseOrderByCreatedAtDesc(
                                doctorId,
                                today
                        )
                        .size();

        // =================================================
        // RESPONSE
        // =================================================

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "myPatients",
                myPatients
        );

        response.put(
                "todayAppointments",
                todayAppointments
        );

        response.put(
                "pendingAppointments",
                pendingAppointments
        );

        response.put(
                "prescriptions",
                prescriptions
        );

        response.put(
                "date",
                today
        );

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // HELPER - DOCTOR RESPONSE
    // =====================================================

    private Map<String, Object> createDoctorResponse(
            Doctor doctor) {

        Map<String, Object> map =
                new LinkedHashMap<>();

        map.put(
                "id",
                doctor.getId()
        );

        map.put(
                "doctorName",
                doctor.getDoctorName()
        );

        map.put(
                "specialization",
                doctor.getSpecialization()
        );

        map.put(
                "email",
                doctor.getEmail()
        );

        map.put(
                "phone",
                doctor.getPhone()
        );

        map.put(
                "experience",
                doctor.getExperience()
        );

        map.put(
                "qualification",
                doctor.getQualification()
        );

        // =================================================
        // DEPARTMENT
        // =================================================

        if (doctor.getDepartment() != null) {

            map.put(
                    "departmentId",
                    doctor.getDepartment().getId()
            );

            map.put(
                    "departmentName",
                    doctor.getDepartment()
                            .getDepartmentName()
            );

        } else {

            map.put(
                    "departmentId",
                    null
            );

            map.put(
                    "departmentName",
                    "Not Assigned"
            );
        }

        // =================================================
        // USER
        // =================================================

        if (doctor.getUser() != null) {

            User user =
                    doctor.getUser();

            map.put(
                    "userId",
                    user.getId()
            );

            map.put(
                    "loginEmail",
                    user.getLoginEmail()
            );

            map.put(
                    "role",
                    user.getRole() != null
                            ? user.getRole().name()
                            : "DOCTOR"
            );

            map.put(
                    "status",
                    user.isEnabled()
                            ? "ACTIVE"
                            : "INACTIVE"
            );

        } else {

            map.put(
                    "userId",
                    null
            );

            map.put(
                    "loginEmail",
                    null
            );

            map.put(
                    "role",
                    "DOCTOR"
            );

            map.put(
                    "status",
                    "INACTIVE"
            );
        }

        return map;
    }

    // =====================================================
    // HELPER - DOCTOR OWN PROFILE RESPONSE
    // =====================================================

    private Map<String, Object> createDoctorProfileResponse(
            Doctor doctor,
            User user) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "id",
                doctor.getId()
        );

        response.put(
                "doctorName",
                doctor.getDoctorName()
        );

        response.put(
                "email",
                doctor.getEmail()
        );

        response.put(
                "phone",
                doctor.getPhone()
        );

        response.put(
                "specialization",
                doctor.getSpecialization()
        );

        response.put(
                "experience",
                doctor.getExperience()
        );

        response.put(
                "qualification",
                doctor.getQualification()
        );

        // =================================================
        // DEPARTMENT
        // =================================================

        if (doctor.getDepartment() != null) {

            response.put(
                    "departmentId",
                    doctor.getDepartment().getId()
            );

            response.put(
                    "departmentName",
                    doctor.getDepartment()
                            .getDepartmentName()
            );

        } else {

            response.put(
                    "departmentId",
                    null
            );

            response.put(
                    "departmentName",
                    "Not Assigned"
            );
        }

        response.put(
                "loginEmail",
                user.getLoginEmail()
        );

        response.put(
                "role",
                user.getRole() != null
                        ? user.getRole().name()
                        : "DOCTOR"
        );

        return response;
    }
}