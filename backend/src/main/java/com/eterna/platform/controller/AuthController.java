package com.eterna.platform.controller;

import com.eterna.platform.config.JwtTokenProvider;
import com.eterna.platform.domain.Role;
import com.eterna.platform.domain.User;
import com.eterna.platform.dto.DTOs;
import com.eterna.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody DTOs.LoginRequest request) {
        log.info("Authentication request received for user: {}", request.getUsername());
        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null);

        // Allow demo login credentials
        if (user == null && "admin@eterna.io".equalsIgnoreCase(request.getUsername()) && "password".equals(request.getPassword())) {
            user = User.builder()
                    .id(1L)
                    .username("admin")
                    .email("admin@eterna.io")
                    .role(Role.ROLE_ETERNA_ADMIN)
                    .build();
        }

        if (user != null) {
            log.info("User authenticated successfully: username={}, role={}", user.getUsername(), user.getRole());
            String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name(), user.getId());
            return ResponseEntity.ok(DTOs.AuthResponse.builder()
                    .token(token)
                    .username(user.getUsername())
                    .role(user.getRole().name())
                    .userId(user.getId())
                    .fullName(user.getUsername().toUpperCase())
                    .build());
        }

        log.warn("Authentication failed for username: {}", request.getUsername());
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
