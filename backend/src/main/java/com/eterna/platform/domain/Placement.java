package com.eterna.platform.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "placements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Placement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "talent_id", nullable = false)
    private Talent talent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private ClientCompany client;

    @Column(nullable = false)
    private String roleTitle; // e.g. "Senior Fullstack Java/Angular Engineer"

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    @Column(nullable = false)
    private String status; // "INTERVIEW", "OFFERED", "ACTIVE", "COMPLETED"

    @Column(nullable = false)
    private BigDecimal clientHourlyBillingUsd; // Billing rate to overseas client

    @Column(nullable = false)
    private BigDecimal talentMonthlySalaryIdr; // Base salary paid to Indonesian engineer

    private String timezoneOverlapHours; // e.g. "4 hours daily overlap with US PST"
}
