package com.hms.controller;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.hms.dto.PaymentRequest;
import com.hms.entity.Bill;
import com.hms.entity.Patient;
import com.hms.entity.PaymentStatus;
import com.hms.entity.User;
import com.hms.repository.BillRepository;
import com.hms.repository.PatientRepository;
import com.hms.repository.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patient/bills")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientPaymentController {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public PatientPaymentController(
            BillRepository billRepository,
            PatientRepository patientRepository,
            UserRepository userRepository) {

        this.billRepository = billRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    // =====================================================
    // PAY BILL
    // =====================================================

    @PostMapping("/{billId}/pay")
    public ResponseEntity<?> payBill(
            @PathVariable Long billId,
            @Valid @RequestBody PaymentRequest request,
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

        String loginEmail = authentication.getName();

        User user = userRepository
                .findByLoginEmail(loginEmail)
                .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        // =================================================
        // GET PATIENT
        // =================================================

        Patient patient = patientRepository
                .findByUserId(user.getId())
                .orElse(null);

        if (patient == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Patient profile not found");
        }

        // =================================================
        // GET BILL
        // =================================================

        Bill bill = billRepository
                .findById(billId)
                .orElse(null);

        if (bill == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Bill not found");
        }

        // =================================================
        // SECURITY CHECK
        // =================================================

        if (bill.getPatient() == null ||
                !bill.getPatient()
                        .getId()
                        .equals(patient.getId())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "You are not authorized to pay this bill"
                    );
        }

        // =================================================
        // CHECK PAYMENT STATUS
        // =================================================

        if (bill.getPaymentStatus() == PaymentStatus.PAID) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            "This bill has already been paid"
                    );
        }

        // =================================================
        // CHECK CANCELLED
        // =================================================

        if (bill.getPaymentStatus() == PaymentStatus.CANCELLED) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            "Cancelled bill cannot be paid"
                    );
        }

        // =================================================
        // VALIDATE PAYMENT METHOD
        // =================================================

        if (request.getPaymentMethod() == null ||
                request.getPaymentMethod()
                        .trim()
                        .isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            "Payment method is required"
                    );
        }

        String paymentMethod =
                request.getPaymentMethod()
                        .trim()
                        .toUpperCase();

        // =================================================
        // ALLOWED PAYMENT METHODS
        // =================================================

        if (!paymentMethod.equals("UPI")
                && !paymentMethod.equals("CARD")
                && !paymentMethod.equals("CASH")) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            "Invalid payment method. Use UPI, CARD or CASH"
                    );
        }

        // =================================================
        // VALIDATE TOTAL
        // =================================================

        if (bill.getTotalAmount() <= 0) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            "Invalid bill amount"
                    );
        }

        // =================================================
        // UPDATE PAYMENT
        // =================================================

        bill.setPaymentStatus(
                PaymentStatus.PAID
        );

        bill.setPaymentMethod(
                paymentMethod
        );

        bill.setPaidAmount(
                bill.getTotalAmount()
        );

        // IMPORTANT:
        // Bill entity uses paymentDate

        bill.setPaymentDate(
                LocalDate.now()
        );

        // =================================================
        // SAVE
        // =================================================

        Bill paidBill =
                billRepository.save(bill);

        // =================================================
        // RESPONSE
        // =================================================

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "message",
                "Bill payment successful"
        );

        response.put(
                "billId",
                paidBill.getId()
        );

        response.put(
                "totalAmount",
                paidBill.getTotalAmount()
        );

        response.put(
                "paidAmount",
                paidBill.getPaidAmount()
        );

        response.put(
                "paymentStatus",
                paidBill.getPaymentStatus()
        );

        response.put(
                "paymentMethod",
                paidBill.getPaymentMethod()
        );

        response.put(
                "paymentDate",
                paidBill.getPaymentDate()
        );

        return ResponseEntity.ok(response);
    }
}