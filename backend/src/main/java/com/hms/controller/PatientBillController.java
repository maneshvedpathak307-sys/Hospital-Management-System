package com.hms.controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.hms.entity.Bill;
import com.hms.entity.Patient;
import com.hms.entity.User;
import com.hms.repository.BillRepository;
import com.hms.repository.PatientRepository;
import com.hms.repository.UserRepository;

@RestController
@RequestMapping("/api/patient/bills")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientBillController {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public PatientBillController(
            BillRepository billRepository,
            PatientRepository patientRepository,
            UserRepository userRepository) {

        this.billRepository = billRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    // =====================================================
    // GET MY BILLS
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getMyBills(
            Authentication authentication) {

        // =================================================
        // CHECK AUTHENTICATION
        // =================================================

        if (authentication == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User is not authenticated");
        }

        // =================================================
        // GET LOGGED-IN USER EMAIL
        // =================================================

        String loginEmail =
                authentication.getName();

        // =================================================
        // FIND USER
        // =================================================

        User user =
                userRepository
                        .findByLoginEmail(loginEmail)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        // =================================================
        // FIND PATIENT PROFILE
        // =================================================

        Patient patient =
                patientRepository
                        .findByUserId(user.getId())
                        .orElse(null);

        if (patient == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Patient profile not found");
        }

        // =================================================
        // GET PATIENT BILLS
        // =================================================

        List<Bill> bills =
                billRepository
                        .findByPatientIdOrderByBillDateDesc(
                                patient.getId()
                        );

        // =================================================
        // RETURN BILLS
        // =================================================

        return ResponseEntity.ok(
                convertBills(bills)
        );
    }

    // =====================================================
    // GET MY BILL BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getMyBillById(
            @PathVariable Long id,
            Authentication authentication) {

        // =================================================
        // CHECK AUTHENTICATION
        // =================================================

        if (authentication == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User is not authenticated");
        }

        // =================================================
        // GET LOGGED-IN USER
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
                    .body("User not found");
        }

        // =================================================
        // FIND PATIENT
        // =================================================

        Patient patient =
                patientRepository
                        .findByUserId(user.getId())
                        .orElse(null);

        if (patient == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Patient profile not found");
        }

        // =================================================
        // FIND BILL
        // =================================================

        Bill bill =
                billRepository
                        .findById(id)
                        .orElse(null);

        if (bill == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Bill not found");
        }

        // =================================================
        // SECURITY CHECK
        // =================================================
        // Patient can only view their own bill.
        // =================================================

        if (bill.getPatient() == null ||
                !bill.getPatient()
                        .getId()
                        .equals(patient.getId())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "You are not authorized to view this bill"
                    );
        }

        // =================================================
        // RETURN BILL
        // =================================================

        return ResponseEntity.ok(
                convertBill(bill)
        );
    }

    // =====================================================
    // CONVERT BILL LIST
    // =====================================================

    private List<Map<String, Object>> convertBills(
            List<Bill> bills) {

        List<Map<String, Object>> result =
                new ArrayList<>();

        for (Bill bill : bills) {

            result.add(
                    convertBill(bill)
            );
        }

        return result;
    }

    // =====================================================
    // CONVERT BILL
    // =====================================================

    private Map<String, Object> convertBill(
            Bill bill) {

        Map<String, Object> data =
                new LinkedHashMap<>();

        // =================================================
        // BILL ID
        // =================================================

        data.put(
                "id",
                bill.getId()
        );

        // =================================================
        // PATIENT DETAILS
        // =================================================

        if (bill.getPatient() != null) {

            data.put(
                    "patientId",
                    bill.getPatient().getId()
            );

            data.put(
                    "patientName",
                    bill.getPatient().getPatientName()
            );

        } else {

            data.put(
                    "patientId",
                    null
            );

            data.put(
                    "patientName",
                    null
            );
        }

        // =================================================
        // DOCTOR DETAILS
        // =================================================

        if (bill.getDoctor() != null) {

            data.put(
                    "doctorId",
                    bill.getDoctor().getId()
            );

            data.put(
                    "doctorName",
                    bill.getDoctor().getDoctorName()
            );

        } else {

            data.put(
                    "doctorId",
                    null
            );

            data.put(
                    "doctorName",
                    null
            );
        }

        // =================================================
        // APPOINTMENT DETAILS
        // =================================================

        if (bill.getAppointment() != null) {

            data.put(
                    "appointmentId",
                    bill.getAppointment().getId()
            );

            data.put(
                    "appointmentDate",
                    bill.getAppointment()
                            .getAppointmentDate()
            );

            data.put(
                    "appointmentTime",
                    bill.getAppointment()
                            .getAppointmentTime()
            );

        } else {

            data.put(
                    "appointmentId",
                    null
            );

            data.put(
                    "appointmentDate",
                    null
            );

            data.put(
                    "appointmentTime",
                    null
            );
        }

        // =================================================
        // BILL DETAILS
        // =================================================

        data.put(
                "treatment",
                bill.getTreatment()
        );

        data.put(
                "consultationFee",
                bill.getConsultationFee()
        );

        data.put(
                "medicineCharge",
                bill.getMedicineCharge()
        );

        data.put(
                "testCharge",
                bill.getTestCharge()
        );

        data.put(
                "totalAmount",
                bill.getTotalAmount()
        );

        data.put(
                "billDate",
                bill.getBillDate()
        );

        // =================================================
        // PAYMENT DETAILS
        // =================================================
        //
        // No CASH logic is added here.
        //
        // These values come directly from the Bill entity.
        //
        // paymentStatus:
        // PENDING / PAID / etc. depending on your enum
        //
        // paymentMethod:
        // Whatever payment method your backend actually stores.
        //
        // =================================================

        data.put(
                "paymentStatus",
                bill.getPaymentStatus()
        );

        data.put(
                "paymentMethod",
                bill.getPaymentMethod()
        );

        data.put(
                "paidAmount",
                bill.getPaidAmount()
        );

        data.put(
                "paymentDate",
                bill.getPaymentDate()
        );

        // =================================================
        // RETURN
        // =================================================

        return data;
    }
}