package com.eterna.platform.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "client_companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientCompany {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String country; // e.g. "United States", "Singapore", "Australia", "United Kingdom"

    @Column(nullable = false)
    private String timezone; // e.g. "America/Los_Angeles (PST)", "Europe/London (GMT)"

    @Column(nullable = false)
    private String contactEmail;

    private String industry; // e.g. "Fintech", "HealthTech", "SaaS"

    private String logoUrl;

    @Builder.Default
    private Boolean active = true;

    private LocalDateTime registeredAt;
}
