package com.eterna.platform.service;

import com.eterna.platform.domain.ClientCompany;
import com.eterna.platform.domain.PayrollRecord;
import com.eterna.platform.domain.Placement;
import com.eterna.platform.domain.Talent;
import com.eterna.platform.domain.TalentStatus;
import com.eterna.platform.repository.PayrollRecordRepository;
import com.eterna.platform.repository.PlacementRepository;
import com.eterna.platform.repository.TalentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PayrollCalculationServiceTest {

    @Mock
    private PayrollRecordRepository payrollRepository;

    @Mock
    private PlacementRepository placementRepository;

    @Mock
    private TalentRepository talentRepository;

    @InjectMocks
    private PayrollCalculationService payrollService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(payrollService, "defaultExchangeRate", new BigDecimal("15800.0"));
    }

    @Test
    @DisplayName("Should return 0 tax for monthly salary under PTKP threshold 5.4M IDR")
    void testTaxUnderThreshold() {
        BigDecimal tax = payrollService.calculatePph21Tax(new BigDecimal("5000000"));
        assertEquals(0, BigDecimal.ZERO.compareTo(tax));
    }

    @Test
    @DisplayName("Should apply correct TER PPh 21 tax for senior engineer salary of 30,000,000 IDR (12%)")
    void testSeniorSalaryPph21Tax() {
        BigDecimal gross = new BigDecimal("30000000");
        BigDecimal tax = payrollService.calculatePph21Tax(gross);
        // 30,000,000 * 12% = 3,600,000 IDR
        assertEquals(new BigDecimal("3600000"), tax);
    }

    @Test
    @DisplayName("Should cap BPJS Kesehatan employee contribution at 12M IDR base (max 120,000 IDR)")
    void testBpjsKesehatanCap() {
        BigDecimal highSalary = new BigDecimal("45000000");
        BigDecimal bpjs = payrollService.calculateBpjsKesehatan(highSalary);
        assertEquals(new BigDecimal("120000"), bpjs);
    }

    @Test
    @DisplayName("Should compute gross to net deductions and generate payroll record correctly")
    void testGeneratePayrollForPlacement() {
        Talent talent = Talent.builder()
                .id(101L)
                .fullName("Rian Pratama")
                .email("rian@example.com")
                .status(TalentStatus.PLACED)
                .build();

        Placement placement = Placement.builder()
                .id(1L)
                .talent(talent)
                .roleTitle("Senior Fullstack Developer")
                .clientHourlyBillingUsd(new BigDecimal("45.0"))
                .talentSalaryIdr(new BigDecimal("25000000"))
                .status("ACTIVE")
                .build();

        when(payrollRepository.save(any(PayrollRecord.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PayrollRecord result = payrollService.generatePayrollForPlacement(placement, "2026-09");

        assertNotNull(result);
        assertEquals(new BigDecimal("25000000"), result.getGrossSalaryIdr());
        // Tax 25M * 10% = 2,500,000
        assertEquals(new BigDecimal("2500000"), result.getTaxPph21Idr());
        // BPJS Health 120,000
        assertEquals(new BigDecimal("120000"), result.getBpjsKesehatanIdr());
        // Client invoice USD = 45 * 160 hrs = 7200 USD
        assertEquals(new BigDecimal("7200.0"), result.getClientInvoiceUsd());
        assertTrue(result.getNetSalaryIdr().compareTo(BigDecimal.ZERO) > 0);
        assertTrue(result.getPayslipS3Key().contains("payslips/2026-09/slip_101_2026-09.pdf"));

        verify(payrollRepository, times(1)).save(any(PayrollRecord.class));
    }
}
