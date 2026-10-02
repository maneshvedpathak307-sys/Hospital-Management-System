package com.hms.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // TOKEN
    // ==========================================

    @Column(nullable = false, unique = true, length = 100)
    private String token;


    // ==========================================
    // USER
    // ==========================================

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;


    // ==========================================
    // EXPIRY
    // ==========================================

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public PasswordResetToken() {
    }


    public PasswordResetToken(
            String token,
            User user,
            LocalDateTime expiresAt) {

        this.token = token;
        this.user = user;
        this.expiresAt = expiresAt;
    }


    // ==========================================
    // GETTERS / SETTERS
    // ==========================================

    public Long getId() {
        return id;
    }


    public String getToken() {
        return token;
    }


    public void setToken(String token) {
        this.token = token;
    }


    public User getUser() {
        return user;
    }


    public void setUser(User user) {
        this.user = user;
    }


    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }


    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}