package com.eterna.platform.controller;

import com.eterna.platform.domain.Timesheet;
import com.eterna.platform.repository.TimesheetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/timesheets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TimesheetController {

    private final TimesheetRepository timesheetRepository;

    @GetMapping
    public ResponseEntity<List<Timesheet>> getTimesheets(@RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(timesheetRepository.findByStatus(status));
        }
        return ResponseEntity.ok(timesheetRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Timesheet> submitTimesheet(@RequestBody Timesheet timesheet) {
        log.info("Submitting timesheet for candidate={}, client={}, hours={}",
                timesheet.getTalentName(), timesheet.getClientName(), timesheet.getHoursLogged());
        timesheet.setStatus("SUBMITTED");
        timesheet.setSubmittedAt(LocalDateTime.now());
        Timesheet saved = timesheetRepository.save(timesheet);
        log.info("Timesheet submitted successfully with id={}", saved.getId());
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<Timesheet> approveTimesheet(@PathVariable Long id) {
        log.info("Received timesheet approval request for id={}", id);
        Timesheet ts = timesheetRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Timesheet not found with id={}", id);
                    return new RuntimeException("Timesheet not found");
                });
        ts.setStatus("APPROVED");
        ts.setApprovedAt(LocalDateTime.now());
        Timesheet approved = timesheetRepository.save(ts);
        log.info("Timesheet id={} successfully approved", approved.getId());
        return ResponseEntity.ok(approved);
    }
}
