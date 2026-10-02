package com.hms.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.dto.DoctorCreateRequest;
import com.hms.entity.Department;
import com.hms.entity.Doctor;
import com.hms.entity.Role;
import com.hms.entity.User;
import com.hms.repository.DepartmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.UserRepository;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorServiceImpl(
            DoctorRepository doctorRepository,
            DepartmentRepository departmentRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public String createDoctor(DoctorCreateRequest request) {

        // Check login email
        if (userRepository.existsByLoginEmail(
                request.getLoginEmail())) {

            throw new RuntimeException(
                    "Login email already registered");
        }

        // Find department
        Department department =
                departmentRepository.findById(
                        request.getDepartmentId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Department not found"));

        // Create User account
        User user = new User();

        user.setLoginEmail(request.getLoginEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(Role.DOCTOR);

        user.setEnabled(true);

        User savedUser =
                userRepository.save(user);

        // Create Doctor
        Doctor doctor = new Doctor();

        doctor.setDoctorName(
                request.getDoctorName());

        doctor.setSpecialization(
                request.getSpecialization());

        doctor.setEmail(
                request.getEmail());

        doctor.setPhone(
                request.getPhone());

        doctor.setUser(savedUser);

        doctor.setDepartment(department);

        doctorRepository.save(doctor);

        return "Doctor created successfully";
    }
}