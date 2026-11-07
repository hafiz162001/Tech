package com.eterna.platform.controller;

import com.eterna.platform.domain.PayrollRecord;
import com.eterna.platform.repository.PayrollRecordRepository;
import com.eterna.platform.service.PayrollCalculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payroll")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PayrollController {

    private final PayrollCalculationService payrollCalculationService;
    private final PayrollRecordRepository payrollRecordRepository;

    @GetMapping("/records")
    public ResponseEntity<List<PayrollRecord>> getPayrollRecords(@RequestParam(required = false) String period) {
        if (period != null) {
            return ResponseEntity.ok(payrollRecordRepository.findByPeriodMonth(period));
        }
        return ResponseEntity.ok(payrollRecordRepository.findAll());
    }

    @PostMapping("/calculate-estimate")
    public ResponseEntity<Map<String, Object>> calculateTaxEstimate(@RequestParam BigDecimal grossMonthlySalary) {
        BigDecimal pph21 = payrollCalculationService.calculatePph21Tax(grossMonthlySalary);
        BigDecimal bpjsHealth = payrollCalculationService.calculateBpjsKesehatan(grossMonthlySalary);
        BigDecimal bpjsLabor = payrollCalculationService.calculateBpjsKetenagakerjaan(grossMonthlySalary);
        BigDecimal totalDeductions = pph21.add(bpjsHealth).add(bpjsLabor);
        BigDecimal takeHomePay = grossMonthlySalary.subtract(totalDeductions);

        Map<String, Object> result = new HashMap<>();
        result.put("grossMonthlySalary", grossMonthlySalary);
        result.put("taxPph21Idr", pph21);
        result.put("bpjsKesehatanIdr", bpjsHealth);
        result.put("bpjsKetenagakerjaanIdr", bpjsLabor);
        result.put("totalDeductionsIdr", totalDeductions);
        result.put("netTakeHomePayIdr", takeHomePay);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/run-batch")
    public ResponseEntity<List<PayrollRecord>> runMonthlyBatch(@RequestParam String periodMonth) {
        return ResponseEntity.ok(payrollCalculationService.runMonthlyPayrollBatch(periodMonth));
    }
}
