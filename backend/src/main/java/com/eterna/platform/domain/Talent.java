package com.eterna.platform.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "talents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Talent implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String primaryRole; // e.g. "Fullstack Java & Angular Developer"

    @Column(nullable = false)
    private Integer experienceYears;

    @Column(columnDefinition = "TEXT")
    private String skillsSummary; // Comma separated or JSON: "Java 21, Spring Boot 3, Angular 19, Ionic 8, NgRx, Redis, MySQL, AWS"

    @Column(nullable = false)
    private String locationCity; // e.g. "Bandung", "Jakarta", "Yogyakarta", "Bali"

    @Column(nullable = false)
    private String timezone; // e.g. "Asia/Jakarta (UTC+7)"

    @Column(nullable = false)
    private BigDecimal hourlyRateUsd;

    @Column(nullable = false)
    private BigDecimal monthlyRateIdr;

    private Double englishFluencyScore; // e.g. 9.2 out of 10

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TalentStatus status; // AVAILABLE, PLACED, INTERVIEWING

    private String avatarUrl;

    private String githubUrl;
    private String linkedinUrl;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
