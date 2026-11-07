package com.eterna.platform.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "talent_id", nullable = false)
    private Talent talent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "placement_id")
    private Placement placement;

    @Column(nullable = false)
    private String periodMonth; // "2026-09"

    @Column(nullable = false)
    private BigDecimal grossSalaryIdr;

    @Column(nullable = false)
    private BigDecimal taxPph21Idr; // Indonesian Income Tax

    @Column(nullable = false)
    private BigDecimal bpjsKesehatanIdr; // BPJS Health 1%

    @Column(nullable = false)
    private BigDecimal bpjsKetenagakerjaanIdr; // BPJS Labor (JHT 2% + JP 1%)

    @Column(nullable = false)
    private BigDecimal totalDeductionsIdr;

    @Column(nullable = false)
    private BigDecimal netSalaryIdr; // Take Home Pay transferred to Talent bank account

    @Column(nullable = false)
    private BigDecimal clientInvoiceUsd; // Invoiced to global client

    private BigDecimal exchangeRateUsdIdr;

    @Column(nullable = false)
    private String status; // "CALCULATED", "APPROVED", "DISBURSED"

    private String payslipS3Key; // Reference to AWS S3 bucket PDF

    private LocalDateTime disbursedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
