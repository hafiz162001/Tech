package com.eterna.platform.config;

import com.eterna.platform.jobs.MonthlyPayrollQuartzJob;
import com.eterna.platform.jobs.TimesheetReminderQuartzJob;
import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QuartzConfig {

    @Bean
    public JobDetail monthlyPayrollJobDetail() {
        return JobBuilder.newJob(MonthlyPayrollQuartzJob.class)
                .withIdentity("monthlyPayrollJob", "payroll-group")
                .withDescription("Automated calculation and generation of monthly talent payroll")
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger monthlyPayrollJobTrigger(JobDetail monthlyPayrollJobDetail) {
        // Runs on the 25th day of every month at 09:00 WIB
        return TriggerBuilder.newTrigger()
                .forJob(monthlyPayrollJobDetail)
                .withIdentity("monthlyPayrollTrigger", "payroll-group")
                .withSchedule(CronScheduleBuilder.cronSchedule("0 0 9 25 * ?"))
                .build();
    }

    @Bean
    public JobDetail timesheetReminderJobDetail() {
        return JobBuilder.newJob(TimesheetReminderQuartzJob.class)
                .withIdentity("timesheetReminderJob", "hr-group")
                .withDescription("Reminds placed engineers to submit weekly timesheets")
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger timesheetReminderJobTrigger(JobDetail timesheetReminderJobDetail) {
        // Runs every Friday at 16:00 WIB
        return TriggerBuilder.newTrigger()
                .forJob(timesheetReminderJobDetail)
                .withIdentity("timesheetReminderTrigger", "hr-group")
                .withSchedule(CronScheduleBuilder.cronSchedule("0 0 16 ? * FRI"))
                .build();
    }
}
