package com.eterna.platform.repository;

import com.eterna.platform.domain.PayrollRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayrollRecordRepository extends JpaRepository<PayrollRecord, Long> {
    List<PayrollRecord> findByPeriodMonth(String periodMonth);
    List<PayrollRecord> findByTalentId(Long talentId);
}
