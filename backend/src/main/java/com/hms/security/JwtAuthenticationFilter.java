package com.hms.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }


    // ==========================================
    // DO NOT RUN JWT FILTER FOR AUTH APIs
    // ==========================================

    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request) {

        String path = request.getServletPath();

        return path.startsWith("/api/auth/");
    }


    // ==========================================
    // JWT FILTER
    // ==========================================

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader =
                request.getHeader("Authorization");


        // ==========================================
        // NO JWT TOKEN
        // ==========================================

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // ==========================================
        // EXTRACT TOKEN
        // ==========================================

        final String jwtToken =
                authHeader.substring(7);


        String loginEmail;


        try {

            loginEmail =
                    jwtService.extractUsername(
                            jwtToken
                    );

        } catch (Exception e) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // ==========================================
        // LOAD USER
        // ==========================================

        if (loginEmail != null &&
                SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {

            UserDetails userDetails =
                    userDetailsService
                            .loadUserByUsername(
                                    loginEmail
                            );


            // ======================================
            // VALIDATE TOKEN
            // ======================================

            if (jwtService.isTokenValid(
                    jwtToken,
                    userDetails)) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );


                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );


                System.out.println(
                        "JWT USER: "
                                + userDetails.getUsername()
                );


                System.out.println(
                        "JWT AUTHORITIES: "
                                + userDetails.getAuthorities()
                );


                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );
            }
        }


        filterChain.doFilter(
                request,
                response
        );
    }
    
    
}