package com.hms.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.hms.entity.User;
import com.hms.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String loginEmail)
            throws UsernameNotFoundException {

        User user = userRepository.findByLoginEmail(loginEmail)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with email: " + loginEmail
                        ));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getLoginEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .disabled(!user.isEnabled())
                .build();
    }
}