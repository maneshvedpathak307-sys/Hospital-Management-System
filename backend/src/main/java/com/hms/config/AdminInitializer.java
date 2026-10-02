package com.hms.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.hms.entity.Role;
import com.hms.entity.User;
import com.hms.repository.UserRepository;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        String adminEmail = "admin@gmail.com";

        if (!userRepository.existsByLoginEmail(adminEmail)) {

            User admin = new User();

            admin.setLoginEmail(adminEmail);

            admin.setPassword(
                    passwordEncoder.encode("admin123")
            );

            admin.setRole(Role.ADMIN);

            admin.setEnabled(true);

            userRepository.save(admin);

            System.out.println(
                    "======================================"
            );
            System.out.println(
                    "ADMIN USER CREATED SUCCESSFULLY"
            );
            System.out.println(
                    "Email    : admin@gmail.com"
            );
            System.out.println(
                    "Password : admin123"
            );
            System.out.println(
                    "Role     : ADMIN"
            );
            System.out.println(
                    "======================================"
            );

        } else {

            System.out.println(
                    "ADMIN USER ALREADY EXISTS: "
                    + adminEmail
            );
        }
    }
}