package com.hms.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dto.AppointmentRequest;
import com.hms.entity.Appointment;
import com.hms.entity.AppointmentStatus;
import com.hms.entity.Department;
import com.hms.entity.Doctor;
import com.hms.entity.Patient;
import com.hms.entity.User;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.DepartmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PatientRepository;
import com.hms.repository.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patient/appointments")
public class PatientAppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public PatientAppointmentController(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            DepartmentRepository departmentRepository,
            UserRepository userRepository) {

        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
    }

    // =====================================================
    // BOOK APPOINTMENT
    // =====================================================

    @PostMapping
    public ResponseEntity<?> bookAppointment(
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Authentication required"
                    ));
        }

        User user = getLoggedInUser(authentication);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "User not found"
                    ));
        }

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

        Doctor doctor =
                doctorRepository
                        .findById(request.getDoctorId())
                        .orElse(null);

        if (doctor == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Doctor not found"
                    ));
        }

        Department department =
                departmentRepository
                        .findById(request.getDepartmentId())
                        .orElse(null);

        if (department == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Department not found"
                    ));
        }

        LocalDate appointmentDate =
                request.getAppointmentDate();

        LocalTime requestedTime =
                request.getAppointmentTime();

        if (appointmentDate == null ||
                requestedTime == null) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Appointment date and time are required"
                    ));
        }

        if (appointmentDate.isBefore(LocalDate.now())) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "Appointment date cannot be in the past"
                    ));
        }

        LocalTime openingTime =
                LocalTime.of(10, 0);

        LocalTime lunchStart =
                LocalTime.of(13, 0);

        LocalTime lunchEnd =
                LocalTime.of(14, 0);

        LocalTime closingTime =
                LocalTime.of(17, 0);

        if (requestedTime.isBefore(openingTime)
                || !requestedTime.isBefore(closingTime)) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "Doctor appointments are available from 10:00 AM to 05:00 PM"
                    ));
        }

        if (!requestedTime.isBefore(lunchStart)
                && requestedTime.isBefore(lunchEnd)) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "Doctor is unavailable during lunch break from 01:00 PM to 02:00 PM"
                    ));
        }

        int minute =
                requestedTime.getMinute();

        if (minute != 0 && minute != 30) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "Please select a valid 30-minute appointment slot"
                    ));
        }

        LocalTime assignedTime =
                findNextAvailableSlot(
                        doctor.getId(),
                        appointmentDate,
                        requestedTime
                );

        if (assignedTime == null) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "No appointment slots are available for this doctor on the selected date"
                    ));
        }

        Appointment appointment =
                new Appointment();

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setDepartment(department);
        appointment.setAppointmentDate(appointmentDate);
        appointment.setAppointmentTime(assignedTime);
        appointment.setReason(request.getReason());
        appointment.setStatus(AppointmentStatus.PENDING);

        Appointment savedAppointment =
                appointmentRepository.save(appointment);

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "message",
                assignedTime.equals(requestedTime)
                        ? "Appointment booked successfully."
                        : "Requested time was already booked. Next available appointment time has been assigned."
        );

        response.put(
                "appointmentId",
                savedAppointment.getId()
        );

        response.put(
                "doctorId",
                doctor.getId()
        );

        response.put(
                "doctorName",
                doctor.getDoctorName()
        );

        response.put(
                "appointmentDate",
                appointmentDate
        );

        response.put(
                "requestedTime",
                requestedTime
        );

        response.put(
                "appointmentTime",
                assignedTime
        );

        response.put(
                "status",
                savedAppointment.getStatus() != null
                        ? savedAppointment.getStatus().name()
                        : "PENDING"
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =====================================================
    // FIND NEXT AVAILABLE SLOT
    // =====================================================

    private LocalTime findNextAvailableSlot(
            Long doctorId,
            LocalDate appointmentDate,
            LocalTime requestedTime) {

        LocalTime currentTime =
                requestedTime;

        LocalTime lunchStart =
                LocalTime.of(13, 0);

        LocalTime lunchEnd =
                LocalTime.of(14, 0);

        LocalTime closingTime =
                LocalTime.of(17, 0);

        while (currentTime.isBefore(closingTime)) {

            if (!currentTime.isBefore(lunchStart)
                    && currentTime.isBefore(lunchEnd)) {

                currentTime = lunchEnd;
                continue;
            }

            boolean booked =
                    appointmentRepository
                            .existsActiveAppointmentSlot(
                                    doctorId,
                                    appointmentDate,
                                    currentTime
                            );

            if (!booked) {
                return currentTime;
            }

            currentTime =
                    currentTime.plusMinutes(30);
        }

        return null;
    }

    // =====================================================
    // GET MY APPOINTMENTS
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getMyAppointments(
            Authentication authentication) {

        if (authentication == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Authentication required"
                    ));
        }

        User user =
                getLoggedInUser(authentication);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "User not found"
                    ));
        }

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

        List<Appointment> appointments =
                appointmentRepository
                        .findByPatientIdAndDeletedByPatientFalseOrderByAppointmentDateAscAppointmentTimeAsc(
                                patient.getId()
                        );

        List<Map<String, Object>> response =
                appointments.stream()
                        .map(this::convertAppointment)
                        .toList();

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // CANCEL APPOINTMENT
    // =====================================================

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(
            @PathVariable Long id,
            Authentication authentication) {

        if (authentication == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Authentication required"
                    ));
        }

        User user =
                getLoggedInUser(authentication);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        Patient patient =
                patientRepository
                        .findByUserId(user.getId())
                        .orElse(null);

        if (patient == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Patient profile not found");
        }

        Appointment appointment =
                appointmentRepository
                        .findById(id)
                        .orElse(null);

        if (appointment == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Appointment not found");
        }

        if (appointment.getPatient() == null
                || !appointment.getPatient()
                        .getId()
                        .equals(patient.getId())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "You can cancel only your own appointment"
                    );
        }

        if (appointment.getStatus()
                != AppointmentStatus.PENDING) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            "Only pending appointments can be cancelled"
                    );
        }

        appointment.setStatus(
                AppointmentStatus.CANCELLED
        );

        appointmentRepository.save(
                appointment
        );

        return ResponseEntity.ok(
                "Appointment cancelled successfully"
        );
    }

    // =====================================================
    // GET SINGLE APPOINTMENT
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(
            @PathVariable Long id,
            Authentication authentication) {

        if (authentication == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Authentication required"
                    ));
        }

        User user =
                getLoggedInUser(authentication);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "User not found"
                    ));
        }

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

        Appointment appointment =
                appointmentRepository
                        .findById(id)
                        .orElse(null);

        if (appointment == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Appointment not found"
                    ));
        }

        if (appointment.getPatient() == null
                || !appointment.getPatient()
                        .getId()
                        .equals(patient.getId())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "You can view only your own appointments"
                    ));
        }

        Map<String, Object> response =
                convertAppointmentDetails(
                        appointment
                );

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // DELETE / HIDE PREVIOUS APPOINTMENT
    // =====================================================
    //
    // IMPORTANT:
    //
    // There is ONLY ONE DELETE mapping for:
    //
    // DELETE /api/patient/appointments/{id}
    //
    // This is a SOFT DELETE.
    //
    // The database appointment remains available to
    // doctor/admin.
    //
    // It is only hidden from this patient's list.
    //
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePreviousAppointment(
            @PathVariable Long id,
            Authentication authentication) {

        if (authentication == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Authentication required"
                    ));
        }

        User user =
                getLoggedInUser(authentication);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "User not found"
                    ));
        }

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

        Appointment appointment =
                appointmentRepository
                        .findById(id)
                        .orElse(null);

        if (appointment == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Appointment not found"
                    ));
        }

        // =====================================================
        // SECURITY
        // Patient can delete ONLY their own appointment
        // =====================================================

        if (appointment.getPatient() == null
                || !appointment.getPatient()
                        .getId()
                        .equals(patient.getId())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "You can remove only your own appointment"
                    ));
        }

        // =====================================================
        // ONLY PREVIOUS APPOINTMENTS
        // =====================================================

        LocalDate today =
                LocalDate.now();

        if (appointment.getAppointmentDate() == null
                || !appointment.getAppointmentDate()
                        .isBefore(today)) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "Only previous appointments can be removed"
                    ));
        }

        // =====================================================
        // ALREADY REMOVED
        // =====================================================

        if (appointment.isDeletedByPatient()) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "Appointment has already been removed"
                    ));
        }

        // =====================================================
        // SOFT DELETE
        // =====================================================

        appointment.setDeletedByPatient(true);

        appointmentRepository.save(
                appointment
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Previous appointment removed successfully"
                )
        );
    }
    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    private User getLoggedInUser(
            Authentication authentication) {

        if (authentication == null) {
            return null;
        }

        String loginEmail =
                authentication.getName();

        if (loginEmail == null
                || loginEmail.trim().isEmpty()) {

            return null;
        }

        return userRepository
                .findByLoginEmail(loginEmail)
                .orElse(null);
    }

    // =====================================================
    // CONVERT APPOINTMENT
    // =====================================================

    private Map<String, Object> convertAppointment(
            Appointment appointment) {

        Map<String, Object> data =
                new LinkedHashMap<>();

        data.put(
                "id",
                appointment.getId()
        );

        if (appointment.getPatient() != null) {

            Patient patient =
                    appointment.getPatient();

            data.put(
                    "patientId",
                    patient.getId()
            );

            data.put(
                    "patientName",
                    patient.getPatientName()
            );

            data.put(
                    "patientPhone",
                    patient.getPhone()
            );

            data.put(
                    "patientEmail",
                    patient.getEmail()
            );

            data.put(
                    "patientAge",
                    patient.getAge()
            );

            data.put(
                    "patientGender",
                    patient.getGender()
            );

            data.put(
                    "patientDisease",
                    patient.getDisease()
            );

            data.put(
                    "patientAddress",
                    patient.getAddress()
            );

        } else {

            data.put("patientId", null);
            data.put("patientName", "-");
            data.put("patientPhone", "-");
            data.put("patientEmail", "-");
            data.put("patientAge", null);
            data.put("patientGender", "-");
            data.put("patientDisease", "-");
            data.put("patientAddress", "-");
        }

        if (appointment.getDoctor() != null) {

            Doctor doctor =
                    appointment.getDoctor();

            data.put(
                    "doctorId",
                    doctor.getId()
            );

            data.put(
                    "doctorName",
                    doctor.getDoctorName()
            );

            data.put(
                    "specialization",
                    doctor.getSpecialization()
            );

        } else {

            data.put("doctorId", null);
            data.put("doctorName", "-");
            data.put("specialization", "-");
        }

        if (appointment.getDepartment() != null) {

            Department department =
                    appointment.getDepartment();

            data.put(
                    "departmentId",
                    department.getId()
            );

            data.put(
                    "departmentName",
                    department.getDepartmentName()
            );

        } else {

            data.put("departmentId", null);
            data.put("departmentName", "-");
        }

        data.put(
                "appointmentDate",
                appointment.getAppointmentDate()
        );

        data.put(
                "appointmentTime",
                appointment.getAppointmentTime()
        );

        data.put(
                "reason",
                appointment.getReason()
        );

        data.put(
                "status",
                appointment.getStatus() != null
                        ? appointment.getStatus().name()
                        : "PENDING"
        );

        data.put(
                "createdAt",
                appointment.getCreatedAt()
        );

        return data;
    }

    // =====================================================
    // CONVERT SINGLE APPOINTMENT
    // =====================================================

    private Map<String, Object> convertAppointmentDetails(
            Appointment appointment) {

        Map<String, Object> response =
                new LinkedHashMap<>();

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

        if (appointment.getPatient() != null) {

            Patient patient =
                    appointment.getPatient();

            response.put(
                    "patientId",
                    patient.getId()
            );

            response.put(
                    "patientName",
                    patient.getPatientName()
            );

            response.put(
                    "patientPhone",
                    patient.getPhone()
            );

            response.put(
                    "patientEmail",
                    patient.getEmail()
            );

            response.put(
                    "patientAge",
                    patient.getAge()
            );

            response.put(
                    "patientGender",
                    patient.getGender()
            );

            response.put(
                    "patientDisease",
                    patient.getDisease()
            );

            response.put(
                    "patientAddress",
                    patient.getAddress()
            );

        } else {

            response.put("patientId", null);
            response.put("patientName", "-");
            response.put("patientPhone", "-");
            response.put("patientEmail", "-");
            response.put("patientAge", null);
            response.put("patientGender", "-");
            response.put("patientDisease", "-");
            response.put("patientAddress", "-");
        }

        if (appointment.getDoctor() != null) {

            Doctor doctor =
                    appointment.getDoctor();

            response.put(
                    "doctorId",
                    doctor.getId()
            );

            response.put(
                    "doctorName",
                    doctor.getDoctorName()
            );

            response.put(
                    "specialization",
                    doctor.getSpecialization()
            );

        } else {

            response.put("doctorId", null);
            response.put("doctorName", "-");
            response.put("specialization", "-");
        }

        if (appointment.getDepartment() != null) {

            Department department =
                    appointment.getDepartment();

            response.put(
                    "departmentId",
                    department.getId()
            );

            response.put(
                    "departmentName",
                    department.getDepartmentName()
            );

        } else {

            response.put("departmentId", null);
            response.put("departmentName", "-");
        }

        return response;
    }
}