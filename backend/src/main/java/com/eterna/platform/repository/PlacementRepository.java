package com.eterna.platform.repository;

import com.eterna.platform.domain.Placement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementRepository extends JpaRepository<Placement, Long> {
    List<Placement> findByStatus(String status);
    List<Placement> findByTalentId(Long talentId);
    List<Placement> findByClientId(Long clientId);
}
