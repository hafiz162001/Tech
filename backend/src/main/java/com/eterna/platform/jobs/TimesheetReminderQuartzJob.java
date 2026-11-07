package com.eterna.platform.jobs;

import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class TimesheetReminderQuartzJob implements Job {

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        log.info("Executing scheduled Quartz job: Weekly Timesheet Reminder - Notifying placed engineers & clients...");
        // In production: triggers email/Slack/in-app push notification via Firebase Cloud Messaging (FCM)
    }
}
