package com.hms.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.hms.entity.User;
import com.hms.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/profile")
public class AdminProfileController {

    private final UserRepository userRepository;

    public AdminProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =====================================================
    // GET ADMIN PROFILE
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getAdminProfile(
            Authentication authentication) {

        try {

            // ---------------------------------------------
            // Get logged-in email from JWT
            // ---------------------------------------------

            String loginEmail =
                    authentication.getName();

            System.out.println(
                    "Admin Profile Request From: "
                            + loginEmail
            );


            // ---------------------------------------------
            // Find user
            // ---------------------------------------------

            User user =
                    userRepository
                            .findByLoginEmail(loginEmail)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Admin user not found"
                                    )
                            );


            // ---------------------------------------------
            // Prepare response
            // ---------------------------------------------

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "id",
                    user.getId()
            );

            response.put(
                    "loginEmail",
                    user.getLoginEmail()
            );

            response.put(
                    "email",
                    user.getLoginEmail()
            );

            response.put(
                    "role",
                    user.getRole().name()
            );

            response.put(
                    "enabled",
                    user.isEnabled()
            );

            response.put(
                    "createdAt",
                    user.getCreatedAt()
            );


            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =====================================================
    // UPDATE ADMIN PROFILE
    // =====================================================

    @PutMapping
    public ResponseEntity<?> updateAdminProfile(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {

        try {

            // ---------------------------------------------
            // Get logged-in admin email
            // ---------------------------------------------

            String loginEmail =
                    authentication.getName();


            // ---------------------------------------------
            // Find admin
            // ---------------------------------------------

            User user =
                    userRepository
                            .findByLoginEmail(loginEmail)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Admin user not found"
                                    )
                            );


            // ---------------------------------------------
            // Get new email
            // ---------------------------------------------

            Object emailObject =
                    request.get("email");


            if (emailObject != null) {

                String newEmail =
                        emailObject
                                .toString()
                                .trim();


                if (!newEmail.isEmpty()
                        && !newEmail.equals(
                                user.getLoginEmail())) {

                    user.setLoginEmail(
                            newEmail
                    );
                }
            }


            // ---------------------------------------------
            // Save
            // ---------------------------------------------

            userRepository.save(user);


            // ---------------------------------------------
            // Response
            // ---------------------------------------------

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Admin profile updated successfully"
            );

            response.put(
                    "id",
                    user.getId()
            );

            response.put(
                    "loginEmail",
                    user.getLoginEmail()
            );

            response.put(
                    "email",
                    user.getLoginEmail()
            );

            response.put(
                    "role",
                    user.getRole().name()
            );

            response.put(
                    "enabled",
                    user.isEnabled()
            );


            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}