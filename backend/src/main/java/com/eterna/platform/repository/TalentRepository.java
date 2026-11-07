package com.eterna.platform.repository;

import com.eterna.platform.domain.Talent;
import com.eterna.platform.domain.TalentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TalentRepository extends JpaRepository<Talent, Long> {
    List<Talent> findByStatus(TalentStatus status);
    
    @Query("SELECT t FROM Talent t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:city IS NULL OR LOWER(t.locationCity) = LOWER(:city)) AND " +
           "(:keyword IS NULL OR LOWER(t.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.skillsSummary) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Talent> searchTalents(@Param("status") TalentStatus status, 
                               @Param("city") String city, 
                               @Param("keyword") String keyword);
}
