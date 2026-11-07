package com.eterna.platform.jobs;

import com.eterna.platform.service.PayrollCalculationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
@RequiredArgsConstructor
@Slf4j
public class MonthlyPayrollQuartzJob implements Job {

    private final PayrollCalculationService payrollService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        String currentMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        log.info("Executing scheduled Quartz job: Monthly Payroll Calculation for {}", currentMonth);
        try {
            payrollService.runMonthlyPayrollBatch(currentMonth);
            log.info("Monthly payroll batch completed successfully.");
        } catch (Exception ex) {
            log.error("Failed to run monthly payroll batch via Quartz", ex);
            throw new JobExecutionException(ex);
        }
    }
}
