package com.hms.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.entity.User;
import com.hms.repository.UserRepository;

@Service
public class ForgotPasswordService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public ForgotPasswordService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;

        this.passwordEncoder = passwordEncoder;
    }

    // ==========================================
    // VERIFY EMAIL
    // ==========================================

    public String forgotPassword(String loginEmail) {

        User user =
                userRepository
                        .findByLoginEmail(loginEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No account found with this email"
                                ));

        if (!user.isEnabled()) {

            throw new RuntimeException(
                    "This account is disabled"
            );
        }

        return "Email verified successfully";
    }

    // ==========================================
    // RESET PASSWORD
    // ==========================================

    @Transactional
    public String resetPassword(
            String loginEmail,
            String newPassword) {

        User user =
                userRepository
                        .findByLoginEmail(loginEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No account found with this email"
                                ));

        if (!user.isEnabled()) {

            throw new RuntimeException(
                    "This account is disabled"
            );
        }

        // ==========================================
        // ENCODE NEW PASSWORD
        // ==========================================

        user.setPassword(
                passwordEncoder.encode(
                        newPassword
                )
        );

        // ==========================================
        // SAVE USER
        // ==========================================

        userRepository.save(user);

        return "Password reset successfully";
    }
}