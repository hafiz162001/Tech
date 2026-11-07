package com.eterna.platform.service;

import com.eterna.platform.domain.Talent;
import com.eterna.platform.domain.TalentStatus;
import com.eterna.platform.repository.TalentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TalentService {

    private final TalentRepository talentRepository;

    @Cacheable(value = "talents", key = "#status != null ? #status : 'ALL' + '_' + (#city != null ? #city : 'ALL') + '_' + (#keyword != null ? #keyword : '')")
    @Transactional(readOnly = true)
    public List<Talent> getTalents(TalentStatus status, String city, String keyword) {
        log.info("Fetching talents from database (cache miss) for status: {}, city: {}, keyword: {}", status, city, keyword);
        return talentRepository.searchTalents(status, city, keyword);
    }

    @Transactional(readOnly = true)
    public Talent getTalentById(Long id) {
        return talentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Talent not found with ID: " + id));
    }

    @CacheEvict(value = "talents", allEntries = true)
    @Transactional
    public Talent saveTalent(Talent talent) {
        log.info("Saving talent and evicting talent cache for: {}", talent.getFullName());
        return talentRepository.save(talent);
    }

    @CacheEvict(value = "talents", allEntries = true)
    @Transactional
    public Talent updateStatus(Long id, TalentStatus newStatus) {
        Talent talent = getTalentById(id);
        talent.setStatus(newStatus);
        return talentRepository.save(talent);
    }
}
