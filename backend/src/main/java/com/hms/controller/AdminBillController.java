package com.hms.controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.dto.BillRequest;
import com.hms.entity.Appointment;
import com.hms.entity.AppointmentStatus;
import com.hms.entity.Bill;
import com.hms.entity.Doctor;
import com.hms.entity.Patient;
import com.hms.entity.PaymentStatus;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.BillRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PatientRepository;
import com.hms.service.InvoiceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/bills")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminBillController {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final InvoiceService invoiceService;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public AdminBillController(
            BillRepository billRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository,
            InvoiceService invoiceService) {

        this.billRepository = billRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.invoiceService = invoiceService;
    }

    // =====================================================
    // GET ALL BILLS
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getAllBills() {

        List<Bill> bills =
                billRepository.findAll();

        return ResponseEntity.ok(
                convertBills(bills)
        );
    }

    // =====================================================
    // GET BILL BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getBillById(
            @PathVariable Long id) {

        Bill bill =
                billRepository.findById(id)
                        .orElse(null);

        if (bill == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Bill not found");
        }

        return ResponseEntity.ok(
                convertBill(bill)
        );
    }

    // =====================================================
    // CREATE BILL
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createBill(
            @Valid @RequestBody BillRequest request) {

        // =================================================
        // FIND PATIENT
        // =================================================

        Patient patient =
                patientRepository.findById(
                        request.getPatientId()
                ).orElse(null);

        if (patient == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Patient not found");
        }

        // =================================================
        // FIND DOCTOR
        // =================================================

        Doctor doctor =
                doctorRepository.findById(
                        request.getDoctorId()
                ).orElse(null);

        if (doctor == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Doctor not found");
        }

        // =================================================
        // FIND APPOINTMENT
        // =================================================

        Appointment appointment = null;

        if (request.getAppointmentId() != null) {

            appointment =
                    appointmentRepository.findById(
                            request.getAppointmentId()
                    ).orElse(null);

            if (appointment == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Appointment not found");
            }

            // =================================================
            // APPOINTMENT MUST BE COMPLETED
            // =================================================

            if (appointment.getStatus()
                    != AppointmentStatus.COMPLETED) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                "Bill can be created only for completed appointments"
                        );
            }

            // =================================================
            // PATIENT CHECK
            // =================================================

            if (appointment.getPatient() == null ||
                    !appointment.getPatient()
                            .getId()
                            .equals(patient.getId())) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                "Patient does not match the appointment"
                        );
            }

            // =================================================
            // DOCTOR CHECK
            // =================================================

            if (appointment.getDoctor() == null ||
                    !appointment.getDoctor()
                            .getId()
                            .equals(doctor.getId())) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                "Doctor does not match the appointment"
                        );
            }

            // =================================================
            // DUPLICATE BILL
            // =================================================

            if (billRepository
                    .existsByAppointmentId(
                            request.getAppointmentId())) {

                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(
                                "Bill already exists for this appointment"
                        );
            }
        }

        // =================================================
        // VALIDATE AMOUNTS
        // =================================================

        if (request.getConsultationFee() < 0 ||
                request.getMedicineCharge() < 0 ||
                request.getTestCharge() < 0) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            "Bill charges cannot be negative"
                    );
        }

        // =================================================
        // CALCULATE TOTAL
        // =================================================

        double totalAmount =
                request.getConsultationFee()
                + request.getMedicineCharge()
                + request.getTestCharge();

        // =================================================
        // CREATE BILL
        // =================================================

        Bill bill = new Bill();

        bill.setPatient(patient);

        bill.setDoctor(doctor);

        bill.setAppointment(appointment);

        bill.setTreatment(
                request.getTreatment()
        );

        bill.setConsultationFee(
                request.getConsultationFee()
        );

        bill.setMedicineCharge(
                request.getMedicineCharge()
        );

        bill.setTestCharge(
                request.getTestCharge()
        );

        bill.setTotalAmount(
                totalAmount
        );

        bill.setBillDate(
                request.getBillDate()
        );

        // =================================================
        // PAYMENT DEFAULT
        // =================================================

        bill.setPaymentStatus(
                PaymentStatus.PENDING
        );

        bill.setPaymentMethod(null);

        bill.setPaidAmount(0.0);

        bill.setPaymentDate(null);

        // =================================================
        // SAVE
        // =================================================

        Bill savedBill =
                billRepository.save(bill);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        convertBill(savedBill)
                );
    }

    // =====================================================
    // UPDATE BILL
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBill(
            @PathVariable Long id,
            @Valid @RequestBody BillRequest request) {

        // =================================================
        // FIND EXISTING BILL
        // =================================================

        Bill existingBill =
                billRepository.findById(id)
                        .orElse(null);

        if (existingBill == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Bill not found");
        }

        // =================================================
        // FIND PATIENT
        // =================================================

        Patient patient =
                patientRepository.findById(
                        request.getPatientId()
                ).orElse(null);

        if (patient == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Patient not found");
        }

        // =================================================
        // FIND DOCTOR
        // =================================================

        Doctor doctor =
                doctorRepository.findById(
                        request.getDoctorId()
                ).orElse(null);

        if (doctor == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Doctor not found");
        }

        // =================================================
        // FIND APPOINTMENT
        // =================================================

        Appointment appointment = null;

        if (request.getAppointmentId() != null) {

            appointment =
                    appointmentRepository.findById(
                            request.getAppointmentId()
                    ).orElse(null);

            if (appointment == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Appointment not found");
            }

            // =================================================
            // COMPLETED CHECK
            // =================================================

            if (appointment.getStatus()
                    != AppointmentStatus.COMPLETED) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                "Bill can be linked only to a completed appointment"
                        );
            }

            // =================================================
            // PATIENT CHECK
            // =================================================

            if (appointment.getPatient() == null ||
                    !appointment.getPatient()
                            .getId()
                            .equals(patient.getId())) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                "Patient does not match the appointment"
                        );
            }

            // =================================================
            // DOCTOR CHECK
            // =================================================

            if (appointment.getDoctor() == null ||
                    !appointment.getDoctor()
                            .getId()
                            .equals(doctor.getId())) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                "Doctor does not match the appointment"
                        );
            }

            // =================================================
            // DUPLICATE BILL CHECK
            // =================================================

            Bill appointmentBill =
                    billRepository
                            .findByAppointmentId(
                                    request.getAppointmentId()
                            )
                            .orElse(null);

            if (appointmentBill != null &&
                    !appointmentBill.getId()
                            .equals(id)) {

                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(
                                "Another bill already exists for this appointment"
                        );
            }
        }

        // =================================================
        // VALIDATE AMOUNTS
        // =================================================

        if (request.getConsultationFee() < 0 ||
                request.getMedicineCharge() < 0 ||
                request.getTestCharge() < 0) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            "Bill charges cannot be negative"
                    );
        }

        // =================================================
        // CALCULATE TOTAL
        // =================================================

        double totalAmount =
                request.getConsultationFee()
                + request.getMedicineCharge()
                + request.getTestCharge();

        // =================================================
        // UPDATE BILL DETAILS
        // =================================================

        existingBill.setPatient(patient);

        existingBill.setDoctor(doctor);

        existingBill.setAppointment(appointment);

        existingBill.setTreatment(
                request.getTreatment()
        );

        existingBill.setConsultationFee(
                request.getConsultationFee()
        );

        existingBill.setMedicineCharge(
                request.getMedicineCharge()
        );

        existingBill.setTestCharge(
                request.getTestCharge()
        );

        existingBill.setTotalAmount(
                totalAmount
        );

        existingBill.setBillDate(
                request.getBillDate()
        );

        // =================================================
        // IMPORTANT
        // =================================================
        // DO NOT reset:
        //
        // paymentStatus
        // paymentMethod
        // paidAmount
        // paymentDate
        //
        // This preserves payment information.
        // =================================================

        Bill updatedBill =
                billRepository.save(existingBill);

        return ResponseEntity.ok(
                convertBill(updatedBill)
        );
    }

    // =====================================================
    // DELETE BILL
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBill(
            @PathVariable Long id) {

        Bill bill =
                billRepository.findById(id)
                        .orElse(null);

        if (bill == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Bill not found");
        }

        // =================================================
        // PREVENT DELETE OF PAID BILL
        // =================================================

        if (bill.getPaymentStatus()
                == PaymentStatus.PAID) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            "Paid bill cannot be deleted"
                    );
        }

        billRepository.delete(bill);

        return ResponseEntity.ok(
                "Bill deleted successfully"
        );
    }

    // =====================================================
    // CONVERT ALL BILLS
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
        // PATIENT
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

            data.put(
                    "patientPhone",
                    bill.getPatient().getPhone()
            );

            data.put(
                    "patientEmail",
                    bill.getPatient().getEmail()
            );

        } else {

            data.put("patientId", null);
            data.put("patientName", null);
            data.put("patientPhone", null);
            data.put("patientEmail", null);
        }

        // =================================================
        // DOCTOR
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

            data.put("doctorId", null);
            data.put("doctorName", null);
        }

        // =================================================
        // APPOINTMENT
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

        return data;
    }

    // =====================================================
    // DOWNLOAD INVOICE
    // =====================================================

    @GetMapping(
            value = "/{id}/invoice",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public ResponseEntity<?> downloadInvoice(
            @PathVariable Long id) {

        // =================================================
        // FIND BILL
        // =================================================

        Bill bill =
                billRepository.findById(id)
                        .orElse(null);

        if (bill == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Bill not found");
        }

        try {

            // =================================================
            // GENERATE PDF
            // =================================================

            byte[] pdf =
                    invoiceService.generateInvoice(
                            bill
                    );

            // =================================================
            // PATIENT NAME
            // =================================================

            String patientName = "Patient";

            if (bill.getPatient() != null &&
                    bill.getPatient()
                            .getPatientName() != null &&
                    !bill.getPatient()
                            .getPatientName()
                            .trim()
                            .isEmpty()) {

                patientName =
                        bill.getPatient()
                                .getPatientName();
            }

            // =================================================
            // SAFE FILE NAME
            // =================================================

            patientName =
                    patientName
                            .trim()
                            .replaceAll(
                                    "[^a-zA-Z0-9]+",
                                    "_"
                            );

            String fileName =
                    "Invoice_" +
                    bill.getId() +
                    "_" +
                    patientName +
                    ".pdf";

            // =================================================
            // RESPONSE
            // =================================================

            return ResponseEntity
                    .ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" +
                            fileName +
                            "\""
                    )
                    .contentType(
                            MediaType.APPLICATION_PDF
                    )
                    .contentLength(
                            pdf.length
                    )
                    .body(pdf);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            "Unable to generate invoice."
                    );
        }
    }
}