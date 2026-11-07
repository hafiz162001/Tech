package com.eterna.platform.controller;

import com.eterna.platform.domain.Talent;
import com.eterna.platform.domain.TalentStatus;
import com.eterna.platform.service.TalentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/talents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TalentController {

    private final TalentService talentService;

    @GetMapping
    public ResponseEntity<List<Talent>> getTalents(
            @RequestParam(required = false) TalentStatus status,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(talentService.getTalents(status, city, keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Talent> getTalentById(@PathVariable Long id) {
        return ResponseEntity.ok(talentService.getTalentById(id));
    }

    @PostMapping
    public ResponseEntity<Talent> createTalent(@RequestBody Talent talent) {
        return ResponseEntity.ok(talentService.saveTalent(talent));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Talent> updateTalentStatus(
            @PathVariable Long id,
            @RequestParam TalentStatus status) {
        return ResponseEntity.ok(talentService.updateStatus(id, status));
    }
}
