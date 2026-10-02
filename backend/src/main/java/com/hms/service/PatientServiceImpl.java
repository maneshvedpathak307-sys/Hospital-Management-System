package com.hms.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.dto.PatientCreateRequest;
import com.hms.entity.Patient;
import com.hms.entity.Role;
import com.hms.entity.User;
import com.hms.repository.PatientRepository;
import com.hms.repository.UserRepository;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public PatientServiceImpl(
            PatientRepository patientRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.patientRepository = patientRepository;

        this.userRepository = userRepository;

        this.passwordEncoder = passwordEncoder;
    }


    // =====================================================
    // CREATE PATIENT
    // =====================================================

    @Override
    @Transactional
    public String createPatient(
            PatientCreateRequest request) {


        // ================================================
        // CHECK LOGIN EMAIL
        // ================================================

        if (userRepository.existsByLoginEmail(
                request.getLoginEmail())) {

            throw new RuntimeException(
                    "Login email already registered"
            );
        }


        // ================================================
        // CREATE USER ACCOUNT
        // ================================================

        User user = new User();


        user.setLoginEmail(
                request.getLoginEmail()
        );


        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );


        // IMPORTANT
        // Patient account gets PATIENT role

        user.setRole(
                Role.PATIENT
        );


        user.setEnabled(true);


        User savedUser =
                userRepository.save(user);


        // ================================================
        // CREATE PATIENT PROFILE
        // ================================================

        Patient patient = new Patient();


        patient.setPatientName(
                request.getPatientName()
        );


        patient.setAge(
                request.getAge()
        );


        patient.setGender(
                request.getGender()
        );


        patient.setPhone(
                request.getPhone()
        );


        patient.setEmail(
                request.getEmail()
        );


        patient.setAddress(
                request.getAddress()
        );


        patient.setDisease(
                request.getDisease()
        );


        // Connect patient with user

        patient.setUser(
                savedUser
        );


        patientRepository.save(
                patient
        );


        return "Patient created successfully";
    }


    // =====================================================
    // GET PATIENT PROFILE
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public Patient getPatientProfile(
            String loginEmail) {


        // ================================================
        // FIND USER BY JWT LOGIN EMAIL
        // ================================================

        User user =
                userRepository
                        .findByLoginEmail(loginEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with email: "
                                                + loginEmail
                                )
                        );


        // ================================================
        // FIND PATIENT USING USER ID
        // ================================================

        Patient patient =
                patientRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient profile not found"
                                )
                        );


        return patient;
    }


    // =====================================================
    // UPDATE PATIENT PROFILE
    // =====================================================

    @Override
    @Transactional
    public Patient updatePatientProfile(
            String loginEmail,
            Patient updatedPatient) {


        // ================================================
        // FIND USER
        // ================================================

        User user =
                userRepository
                        .findByLoginEmail(loginEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with email: "
                                                + loginEmail
                                )
                        );


        // ================================================
        // FIND PATIENT
        // ================================================

        Patient patient =
                patientRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient profile not found"
                                )
                        );


        // ================================================
        // UPDATE PATIENT NAME
        // ================================================

        if (updatedPatient.getPatientName() != null) {

            patient.setPatientName(
                    updatedPatient.getPatientName()
            );
        }


        // ================================================
        // UPDATE AGE
        // ================================================

        if (updatedPatient.getAge() != null) {

            patient.setAge(
                    updatedPatient.getAge()
            );
        }


        // ================================================
        // UPDATE GENDER
        // ================================================

        if (updatedPatient.getGender() != null) {

            patient.setGender(
                    updatedPatient.getGender()
            );
        }


        // ================================================
        // UPDATE PHONE
        // ================================================

        if (updatedPatient.getPhone() != null) {

            patient.setPhone(
                    updatedPatient.getPhone()
            );
        }


        // ================================================
        // UPDATE EMAIL
        // ================================================

        if (updatedPatient.getEmail() != null) {

            patient.setEmail(
                    updatedPatient.getEmail()
            );
        }


        // ================================================
        // UPDATE ADDRESS
        // ================================================

        if (updatedPatient.getAddress() != null) {

            patient.setAddress(
                    updatedPatient.getAddress()
            );
        }


        // ================================================
        // UPDATE DISEASE
        // ================================================

        if (updatedPatient.getDisease() != null) {

            patient.setDisease(
                    updatedPatient.getDisease()
            );
        }


        // ================================================
        // SAVE
        // ================================================

        return patientRepository.save(
                patient
        );
    }
}