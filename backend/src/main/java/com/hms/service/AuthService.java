package com.hms.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.dto.LoginRequest;
import com.hms.dto.LoginResponse;
import com.hms.dto.PatientRegisterRequest;
import com.hms.entity.Patient;
import com.hms.entity.Role;
import com.hms.entity.User;
import com.hms.repository.PatientRepository;
import com.hms.repository.UserRepository;
import com.hms.security.JwtService;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PatientRepository patientRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    // ==========================================
    // LOGIN
    // ADMIN / DOCTOR / PATIENT
    // ==========================================

    public LoginResponse login(LoginRequest request) {

        String loginEmail =
                request.getLoginEmail()
                        .trim()
                        .toLowerCase();


        System.out.println(
                "LOGIN ATTEMPT: " + loginEmail
        );


        // ==========================================
        // AUTHENTICATE USER
        // ==========================================

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginEmail,
                                request.getPassword()
                        )
                );


        // ==========================================
        // GET USER DETAILS
        // ==========================================

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();


        // ==========================================
        // FIND USER
        // ==========================================

        User user =
                userRepository
                        .findByLoginEmail(loginEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        // ==========================================
        // GENERATE JWT
        // ==========================================

        String token =
                jwtService.generateToken(
                        userDetails
                );


        System.out.println(
                "LOGIN SUCCESS: " + loginEmail
        );

        System.out.println(
                "LOGIN ROLE: " + user.getRole()
        );


        // ==========================================
        // RETURN LOGIN RESPONSE
        // ==========================================

        return new LoginResponse(
                token,
                user.getRole().name(),
                user.getId(),
                user.getLoginEmail()
        );
    }


    // ==========================================
    // PATIENT REGISTRATION
    // ==========================================

    @Transactional
    public String registerPatient(
            PatientRegisterRequest request) {


        String loginEmail =
                request.getLoginEmail()
                        .trim()
                        .toLowerCase();


        String patientEmail =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // ==========================================
        // CHECK LOGIN EMAIL
        // ==========================================

        if (userRepository.existsByLoginEmail(
        loginEmail)) {

    throw new RuntimeException(
            "Email already registered. Please use a different email address."
    );
}

        // ==========================================
        // CREATE USER
        // ==========================================

        User user = new User();


        user.setLoginEmail(
                loginEmail
        );


        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );


        user.setRole(
                Role.PATIENT
        );


        user.setEnabled(
                true
        );


        User savedUser =
                userRepository.save(user);


        // ==========================================
        // CREATE PATIENT
        // ==========================================

        Patient patient =
                new Patient();


        patient.setPatientName(
                request.getPatientName().trim()
        );


        patient.setAge(
                request.getAge()
        );


        patient.setGender(
                request.getGender()
        );


        patient.setPhone(
                request.getPhone().trim()
        );


        // Patient's normal/professional email
        patient.setEmail(
                patientEmail
        );


        patient.setAddress(
                request.getAddress().trim()
        );


        patient.setDisease(
                request.getDisease().trim()
        );


        // Connect patient with user
        patient.setUser(
                savedUser
        );


        patientRepository.save(
                patient
        );


        System.out.println(
                "PATIENT REGISTERED"
        );

        System.out.println(
                "Patient Email: " + patientEmail
        );

        System.out.println(
                "Login Email: " + loginEmail
        );

        System.out.println(
                "User ID: " + savedUser.getId()
        );


        return "Patient account created successfully";
    }
}