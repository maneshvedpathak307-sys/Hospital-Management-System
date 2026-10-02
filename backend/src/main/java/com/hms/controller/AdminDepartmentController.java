package com.hms.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.entity.Department;
import com.hms.repository.DepartmentRepository;

@RestController
@RequestMapping("/api/admin/departments")
public class AdminDepartmentController {

    private final DepartmentRepository departmentRepository;

    public AdminDepartmentController(
            DepartmentRepository departmentRepository) {

        this.departmentRepository = departmentRepository;
    }

    // ==========================================
    // GET ALL DEPARTMENTS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {

        return ResponseEntity.ok(
                departmentRepository.findAll()
        );
    }

    // ==========================================
    // GET DEPARTMENT BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getDepartmentById(
            @PathVariable Long id) {

        return departmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(null)
                );
    }

    // ==========================================
    // ADD DEPARTMENT
    // ==========================================

    @PostMapping
    public ResponseEntity<?> createDepartment(
            @RequestBody Department department) {

        // Check duplicate department name
        if (departmentRepository.existsByDepartmentName(
                department.getDepartmentName())) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Department already exists");
        }

        Department savedDepartment =
                departmentRepository.save(department);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedDepartment);
    }

    // ==========================================
    // UPDATE DEPARTMENT
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDepartment(
            @PathVariable Long id,
            @RequestBody Department department) {

        Department existingDepartment =
                departmentRepository.findById(id)
                        .orElse(null);

        if (existingDepartment == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Department not found");
        }

        // Check whether another department
        // already uses this name
        Department duplicate =
                departmentRepository
                        .findByDepartmentName(
                                department.getDepartmentName())
                        .orElse(null);

        if (duplicate != null &&
                !duplicate.getId().equals(id)) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Department name already exists");
        }

        existingDepartment.setDepartmentName(
                department.getDepartmentName());

        existingDepartment.setDescription(
                department.getDescription());

        Department updatedDepartment =
                departmentRepository.save(
                        existingDepartment);

        return ResponseEntity.ok(updatedDepartment);
    }

    // ==========================================
    // DELETE DEPARTMENT
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(
            @PathVariable Long id) {

        if (!departmentRepository.existsById(id)) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Department not found");
        }

        departmentRepository.deleteById(id);

        return ResponseEntity.ok(
                "Department deleted successfully"
        );
    }
}