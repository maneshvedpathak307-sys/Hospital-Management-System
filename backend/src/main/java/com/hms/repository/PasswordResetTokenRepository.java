package com.hms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.entity.PasswordResetToken;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {


    Optional<PasswordResetToken>
    findByToken(String token);


    void deleteByUserId(Long userId);


    void deleteByToken(String token);
}