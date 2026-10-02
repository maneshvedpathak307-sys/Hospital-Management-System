package com.hms.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.entity.Appointment;
import com.hms.repository.AppointmentRepository;

@RestController
@RequestMapping("/api/admin/appointments")
public class AdminAppointmentController {

    private final AppointmentRepository appointmentRepository;

    public AdminAppointmentController(
            AppointmentRepository appointmentRepository) {

        this.appointmentRepository = appointmentRepository;
    }

    // ==========================================
    // GET ALL APPOINTMENTS
    // ==========================================

 // ==========================================
 // GET TODAY'S APPOINTMENTS ONLY
 // ==========================================

 @GetMapping
 public ResponseEntity<?> getAllAppointments() {

     LocalDate today =
             LocalDate.now();


     List<Appointment> appointments =
             appointmentRepository
                     .findByAppointmentDateOrderByAppointmentTimeAsc(
                             today
                     );


     return ResponseEntity.ok(
             convertAppointments(appointments)
     );
 }

    // ==========================================
    // GET APPOINTMENT BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(
            @PathVariable Long id) {

        Appointment appointment =
                appointmentRepository.findById(id)
                        .orElse(null);

        if (appointment == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Appointment not found");
        }

        return ResponseEntity.ok(
                convertAppointment(appointment)
        );
    }

    // ==========================================
    // CONVERT APPOINTMENT TO SAFE JSON
    // ==========================================

    private List<Map<String, Object>> convertAppointments(
            List<Appointment> appointments) {

        List<Map<String, Object>> result =
                new ArrayList<>();

        for (Appointment appointment : appointments) {

            result.add(
                    convertAppointment(appointment)
            );
        }

        return result;
    }

    // ==========================================
    // CONVERT SINGLE APPOINTMENT
    // ==========================================

    private Map<String, Object> convertAppointment(
            Appointment appointment) {

        Map<String, Object> data =
                new LinkedHashMap<>();

        data.put(
                "id",
                appointment.getId()
        );

        data.put(
                "patientId",
                appointment.getPatient().getId()
        );

        data.put(
                "patientName",
                appointment.getPatient().getPatientName()
        );

        data.put(
                "patientPhone",
                appointment.getPatient().getPhone()
        );

        data.put(
                "patientEmail",
                appointment.getPatient().getEmail()
        );

        data.put(
                "doctorId",
                appointment.getDoctor().getId()
        );

        data.put(
                "doctorName",
                appointment.getDoctor().getDoctorName()
        );

        data.put(
                "departmentId",
                appointment.getDepartment().getId()
        );

        data.put(
                "departmentName",
                appointment.getDepartment()
                        .getDepartmentName()
        );

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
                appointment.getStatus().name()
        );

        data.put(
                "createdAt",
                appointment.getCreatedAt()
        );

        return data;
    }
}