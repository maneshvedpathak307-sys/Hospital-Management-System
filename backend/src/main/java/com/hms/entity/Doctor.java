package com.hms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================================
    // DOCTOR NAME
    // =====================================================

    @Column(name = "doctor_name", nullable = false)
    private String doctorName;

    // =====================================================
    // SPECIALIZATION
    // =====================================================

    @Column(nullable = false)
    private String specialization;

    // =====================================================
    // EMAIL
    // =====================================================

    @Column(nullable = false)
    private String email;

    // =====================================================
    // PHONE
    // =====================================================

    @Column(nullable = false)
    private String phone;

    // =====================================================
    // EXPERIENCE
    // =====================================================

    @Column(name = "experience")
    private String experience;

    // =====================================================
    // QUALIFICATION
    // =====================================================

    @Column(name = "qualification")
    private String qualification;

    // =====================================================
    // USER
    // =====================================================

    @OneToOne
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    // =====================================================
    // DEPARTMENT
    // =====================================================

    @ManyToOne
    @JoinColumn(
            name = "department_id",
            nullable = false
    )
    private Department department;

    // =====================================================
    // DEFAULT CONSTRUCTOR
    // =====================================================

    public Doctor() {
    }

    // =====================================================
    // PARAMETERIZED CONSTRUCTOR
    // =====================================================

    public Doctor(
            String doctorName,
            String specialization,
            String email,
            String phone,
            String experience,
            String qualification,
            User user,
            Department department) {

        this.doctorName = doctorName;
        this.specialization = specialization;
        this.email = email;
        this.phone = phone;
        this.experience = experience;
        this.qualification = qualification;
        this.user = user;
        this.department = department;
    }

    // =====================================================
    // GETTERS AND SETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }
}