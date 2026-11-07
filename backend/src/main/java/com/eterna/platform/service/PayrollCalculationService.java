package com.eterna.platform.service;

import com.eterna.platform.domain.PayrollRecord;
import com.eterna.platform.domain.Placement;
import com.eterna.platform.domain.Talent;
import com.eterna.platform.dto.DTOs;
import com.eterna.platform.repository.PayrollRecordRepository;
import com.eterna.platform.repository.PlacementRepository;
import com.eterna.platform.repository.TalentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayrollCalculationService {

    private final PayrollRecordRepository payrollRepository;
    private final PlacementRepository placementRepository;
    private final TalentRepository talentRepository;

    @Value("${eterna.payroll.default-exchange-rate-usd-idr:15800.0}")
    private BigDecimal defaultExchangeRate;

    /**
     * Calculates Indonesian TER (Tarif Efektif Rata-rata) PPh 21 monthly tax withholding
     * based on PP No. 58/2023 & PMK 168/2023.
     */
    public BigDecimal calculatePph21Tax(BigDecimal grossMonthlySalary) {
        if (grossMonthlySalary == null || grossMonthlySalary.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        double gross = grossMonthlySalary.doubleValue();
        double ratePercent;

        if (gross <= 5_400_000) {
            ratePercent = 0.0;
        } else if (gross <= 5_650_000) {
            ratePercent = 0.0025;
        } else if (gross <= 5_950_000) {
            ratePercent = 0.005;
        } else if (gross <= 6_300_000) {
            ratePercent = 0.0075;
        } else if (gross <= 6_750_000) {
            ratePercent = 0.01;
        } else if (gross <= 7_500_000) {
            ratePercent = 0.015;
        } else if (gross <= 8_550_000) {
            ratePercent = 0.02;
        } else if (gross <= 9_650_000) {
            ratePercent = 0.03;
        } else if (gross <= 10_050_000) {
            ratePercent = 0.04;
        } else if (gross <= 12_200_000) {
            ratePercent = 0.05;
        } else if (gross <= 14_000_000) {
            ratePercent = 0.06;
        } else if (gross <= 16_000_000) {
            ratePercent = 0.07;
        } else if (gross <= 19_000_000) {
            ratePercent = 0.08;
        } else if (gross <= 23_000_000) {
            ratePercent = 0.09;
        } else if (gross <= 28_000_000) {
            ratePercent = 0.10;
        } else if (gross <= 34_000_000) {
            ratePercent = 0.12;
        } else if (gross <= 40_000_000) {
            ratePercent = 0.15;
        } else if (gross <= 50_000_000) {
            ratePercent = 0.17;
        } else {
            ratePercent = 0.20;
        }

        return grossMonthlySalary.multiply(BigDecimal.valueOf(ratePercent)).setScale(0, RoundingMode.HALF_UP);
    }

    /**
     * BPJS Kesehatan Employee Share = 1% (Cap salary 12,000,000 IDR)
     */
    public BigDecimal calculateBpjsKesehatan(BigDecimal grossMonthlySalary) {
        BigDecimal cap = new BigDecimal("12000000");
        BigDecimal basis = grossMonthlySalary.min(cap);
        return basis.multiply(new BigDecimal("0.01")).setScale(0, RoundingMode.HALF_UP);
    }

    /**
     * BPJS Ketenagakerjaan: JHT (2%) + JP (1% cap at 10,042,300 IDR)
     */
    public BigDecimal calculateBpjsKetenagakerjaan(BigDecimal grossMonthlySalary) {
        BigDecimal jht = grossMonthlySalary.multiply(new BigDecimal("0.02"));
        BigDecimal jpCap = new BigDecimal("10042300");
        BigDecimal jpBasis = grossMonthlySalary.min(jpCap);
        BigDecimal jp = jpBasis.multiply(new BigDecimal("0.01"));
        return jht.add(jp).setScale(0, RoundingMode.HALF_UP);
    }

    @Transactional
    public PayrollRecord generatePayrollForPlacement(Placement placement, String periodMonth) {
        Talent talent = placement.getTalent();
        BigDecimal gross = placement.getTalentSalaryIdr();

        BigDecimal pph21 = calculatePph21Tax(gross);
        BigDecimal bpjsHealth = calculateBpjsKesehatan(gross);
        BigDecimal bpjsLabor = calculateBpjsKetenagakerjaan(gross);
        BigDecimal totalDeductions = pph21.add(bpjsHealth).add(bpjsLabor);
        BigDecimal netTakeHome = gross.subtract(totalDeductions);

        // Client invoicing in USD (Standard 160 hrs * billing rate)
        BigDecimal clientInvoiceUsd = placement.getClientHourlyBillingUsd().multiply(BigDecimal.valueOf(160));

        PayrollRecord record = PayrollRecord.builder()
                .talent(talent)
                .placement(placement)
                .periodMonth(periodMonth)
                .grossSalaryIdr(gross)
                .taxPph21Idr(pph21)
                .bpjsKesehatanIdr(bpjsHealth)
                .bpjsKetenagakerjaanIdr(bpjsLabor)
                .totalDeductionsIdr(totalDeductions)
                .netSalaryIdr(netTakeHome)
                .clientInvoiceUsd(clientInvoiceUsd)
                .exchangeRateUsdIdr(defaultExchangeRate)
                .status("CALCULATED")
                .payslipS3Key(String.format("payslips/%s/slip_%d_%s.pdf", periodMonth, talent.getId(), periodMonth))
                .build();

        return payrollRepository.save(record);
    }

    @Transactional
    public List<PayrollRecord> runMonthlyPayrollBatch(String periodMonth) {
        log.info("Running monthly payroll batch calculation for period: {}", periodMonth);
        List<Placement> activePlacements = placementRepository.findByStatus("ACTIVE");
        List<PayrollRecord> generated = new ArrayList<>();

        for (Placement p : activePlacements) {
            generated.add(generatePayrollForPlacement(p, periodMonth));
        }

        log.info("Generated {} payroll slips for period {}", generated.size(), periodMonth);
        return generated;
    }
}
