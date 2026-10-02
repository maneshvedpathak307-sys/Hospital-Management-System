package com.hms.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public SecurityConfig(
            CustomUserDetailsService customUserDetailsService,
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.customUserDetailsService =
                customUserDetailsService;

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }


    // =====================================================
    // PASSWORD ENCODER
    // =====================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // =====================================================
    // AUTHENTICATION PROVIDER
    // =====================================================

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(
                        customUserDetailsService
                );

        provider.setPasswordEncoder(
                passwordEncoder()
        );

        return provider;
    }


    // =====================================================
    // AUTHENTICATION MANAGER
    // =====================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }


    // =====================================================
    // CORS CONFIGURATION
    // =====================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        // -------------------------------------------------
        // React frontend
        // -------------------------------------------------

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:3000"
                )
        );


        // -------------------------------------------------
        // HTTP methods
        // -------------------------------------------------

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );


        // -------------------------------------------------
        // Request headers
        // -------------------------------------------------

        configuration.setAllowedHeaders(
                List.of("*")
        );


        // -------------------------------------------------
        // Credentials
        // -------------------------------------------------

        configuration.setAllowCredentials(
                true
        );


        // -------------------------------------------------
        // Exposed headers
        // -------------------------------------------------

        configuration.setExposedHeaders(
                List.of(
                        "Authorization"
                )
        );


        // -------------------------------------------------
        // Register CORS
        // -------------------------------------------------

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    // =====================================================
    // SECURITY FILTER CHAIN
    // =====================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http


            // =================================================
            // CORS
            // =================================================

            .cors(cors ->
                    cors.configurationSource(
                            corsConfigurationSource()
                    )
            )


            // =================================================
            // CSRF
            // =================================================

            .csrf(csrf ->
                    csrf.disable()
            )


            // =================================================
            // SESSION MANAGEMENT
            // =================================================

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )


            // =================================================
            // AUTHORIZATION
            // =================================================

            .authorizeHttpRequests(auth -> auth

                    // ==========================================
                    // CORS PREFLIGHT
                    // ==========================================

                    .requestMatchers(
                            HttpMethod.OPTIONS,
                            "/**"
                    ).permitAll()


                    // ==========================================
                    // PUBLIC AUTH APIs
                    // ==========================================

                    .requestMatchers(
                            HttpMethod.POST,
                            "/api/auth/login",
                            "/api/auth/register/patient",
                            "/api/auth/forgot-password",
                            "/api/auth/verify-reset-token",
                            "/api/auth/reset-password"
                    ).permitAll()


                    // ==========================================
                    // ADMIN
                    // ==========================================

                    .requestMatchers(
                            "/api/admin/**"
                    ).hasRole("ADMIN")


                    // ==========================================
                    // DOCTOR REPORTS
                    // ==========================================

                    .requestMatchers(
                            "/api/doctor/reports/**"
                    ).hasRole("DOCTOR")


                    // ==========================================
                    // DOCTOR
                    // ==========================================

                    .requestMatchers(
                            "/api/doctor/**"
                    ).hasRole("DOCTOR")


                    // ==========================================
                    // PATIENT
                    // ==========================================

                    .requestMatchers(
                            "/api/patient/**"
                    ).hasRole("PATIENT")


                    // ==========================================
                    // EVERYTHING ELSE
                    // ==========================================

                    .anyRequest()
                    .authenticated()
            )


            // =================================================
            // AUTHENTICATION PROVIDER
            // =================================================

            .authenticationProvider(
                    authenticationProvider()
            )


            // =================================================
            // JWT FILTER
            // =================================================

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );


        return http.build();
    }
}