package com.eterna.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class DTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private String token;
        private String username;
        private String role;
        private Long userId;
        private String fullName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TalentFilterRequest {
        private String status;
        private String city;
        private String keyword;
        private Integer minExp;
        private BigDecimal maxHourlyRate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PayrollBreakdownResponse {
        private Long talentId;
        private String talentName;
        private String periodMonth;
        private BigDecimal grossSalaryIdr;
        private BigDecimal taxPph21Idr;
        private BigDecimal bpjsKesehatanIdr;
        private BigDecimal bpjsKetenagakerjaanIdr;
        private BigDecimal totalDeductionsIdr;
        private BigDecimal netSalaryIdr;
        private BigDecimal clientInvoiceUsd;
        private BigDecimal exchangeRateUsdIdr;
        private String status;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TimesheetRequest {
        private Long placementId;
        private String weekStartDate;
        private Double billableHours;
        private String summaryDeliverables;
    }
}
