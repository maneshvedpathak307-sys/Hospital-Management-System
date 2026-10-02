package com.hms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.entity.Doctor;

public interface DoctorRepository
        extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByUserId(Long userId);

    List<Doctor> findByDepartmentId(Long departmentId);

    boolean existsByUserId(Long userId);

    Optional<Doctor> findByUserLoginEmail(String loginEmail);
}