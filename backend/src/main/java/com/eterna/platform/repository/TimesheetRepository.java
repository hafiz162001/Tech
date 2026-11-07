package com.eterna.platform.repository;

import com.eterna.platform.domain.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {
    List<Timesheet> findByPlacementId(Long placementId);
    List<Timesheet> findByStatus(String status);
}
