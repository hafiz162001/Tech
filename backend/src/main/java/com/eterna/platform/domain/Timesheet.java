package com.eterna.platform.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "timesheets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Timesheet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "placement_id", nullable = false)
    private Placement placement;

    @Column(nullable = false)
    private LocalDate weekStartDate;

    @Column(nullable = false)
    private Double billableHours; // e.g. 40.0

    @Column(nullable = false)
    private String status; // "SUBMITTED", "APPROVED", "REJECTED", "PAID"

    @Column(columnDefinition = "TEXT")
    private String summaryDeliverables; // What was shipped during the week

    private String clientReviewerNotes;

    private LocalDateTime submittedAt;
    private LocalDateTime approvedAt;
}
