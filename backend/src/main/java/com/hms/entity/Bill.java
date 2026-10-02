package com.hms.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================================
    // PATIENT
    // =====================================================

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    // =====================================================
    // DOCTOR
    // =====================================================

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    // =====================================================
    // APPOINTMENT
    // =====================================================

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    // =====================================================
    // BILL DETAILS
    // =====================================================

    private String treatment;

    private double consultationFee;

    private double medicineCharge;

    private double testCharge;

    private double totalAmount;

    private LocalDate billDate;

    // =====================================================
    // PAYMENT DETAILS
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;

    private String paymentMethod;

    private double paidAmount;

    private LocalDate paymentDate;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public Bill() {
    }

    // =====================================================
    // ID
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // =====================================================
    // PATIENT
    // =====================================================

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    // =====================================================
    // DOCTOR
    // =====================================================

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    // =====================================================
    // APPOINTMENT
    // =====================================================

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    // =====================================================
    // TREATMENT
    // =====================================================

    public String getTreatment() {
        return treatment;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }

    // =====================================================
    // CONSULTATION FEE
    // =====================================================

    public double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(double consultationFee) {
        this.consultationFee = consultationFee;
    }

    // =====================================================
    // MEDICINE CHARGE
    // =====================================================

    public double getMedicineCharge() {
        return medicineCharge;
    }

    public void setMedicineCharge(double medicineCharge) {
        this.medicineCharge = medicineCharge;
    }

    // =====================================================
    // TEST CHARGE
    // =====================================================

    public double getTestCharge() {
        return testCharge;
    }

    public void setTestCharge(double testCharge) {
        this.testCharge = testCharge;
    }

    // =====================================================
    // TOTAL AMOUNT
    // =====================================================

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    // =====================================================
    // BILL DATE
    // =====================================================

    public LocalDate getBillDate() {
        return billDate;
    }

    public void setBillDate(LocalDate billDate) {
        this.billDate = billDate;
    }

    // =====================================================
    // PAYMENT STATUS
    // =====================================================

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    // =====================================================
    // PAYMENT METHOD
    // =====================================================

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    // =====================================================
    // PAID AMOUNT
    // =====================================================

    public double getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(double paidAmount) {
        this.paidAmount = paidAmount;
    }

    // =====================================================
    // PAYMENT DATE
    // =====================================================

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }
}