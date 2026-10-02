package com.hms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PatientRegisterRequest {

    // ==========================================
    // PATIENT INFORMATION
    // ==========================================

    @NotBlank(message = "Patient name is required")
    private String patientName;

    @NotNull(message = "Age is required")
    @Min(value = 1, message = "Age must be greater than 0")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid patient email")
    private String email;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Disease is required")
    private String disease;


    // ==========================================
    // LOGIN INFORMATION
    // ==========================================

    @NotBlank(message = "Login email is required")
    @Email(message = "Enter a valid login email")
    private String loginEmail;

    @NotBlank(message = "Password is required")
    @Size(
        min = 6,
        message = "Password must contain at least 6 characters"
    )
    private String password;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public PatientRegisterRequest() {
    }


    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }


    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }


    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }


    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }


    public String getLoginEmail() {
        return loginEmail;
    }

    public void setLoginEmail(String loginEmail) {
        this.loginEmail = loginEmail;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}