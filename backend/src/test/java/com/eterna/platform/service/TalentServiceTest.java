package com.eterna.platform.service;

import com.eterna.platform.domain.Talent;
import com.eterna.platform.domain.TalentStatus;
import com.eterna.platform.repository.TalentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TalentServiceTest {

    @Mock
    private TalentRepository talentRepository;

    @InjectMocks
    private TalentService talentService;

    @Test
    @DisplayName("Should query repository when searching talents")
    void testGetTalents() {
        Talent t = Talent.builder()
                .id(1L)
                .fullName("Dewi Lestari")
                .primaryRole("Angular & Ionic Specialist")
                .locationCity("Bandung")
                .status(TalentStatus.AVAILABLE)
                .hourlyRateUsd(new BigDecimal("35.0"))
                .build();

        when(talentRepository.searchTalents(TalentStatus.AVAILABLE, "Bandung", "Angular"))
                .thenReturn(List.of(t));

        List<Talent> results = talentService.getTalents(TalentStatus.AVAILABLE, "Bandung", "Angular");

        assertEquals(1, results.size());
        assertEquals("Dewi Lestari", results.get(0).getFullName());
        verify(talentRepository, times(1)).searchTalents(TalentStatus.AVAILABLE, "Bandung", "Angular");
    }

    @Test
    @DisplayName("Should update status and save talent")
    void testUpdateStatus() {
        Talent t = Talent.builder()
                .id(1L)
                .fullName("Dewi Lestari")
                .status(TalentStatus.AVAILABLE)
                .build();

        when(talentRepository.findById(1L)).thenReturn(Optional.of(t));
        when(talentRepository.save(any(Talent.class))).thenAnswer(i -> i.getArgument(0));

        Talent updated = talentService.updateStatus(1L, TalentStatus.PLACED);

        assertEquals(TalentStatus.PLACED, updated.getStatus());
        verify(talentRepository, times(1)).save(t);
    }
}
