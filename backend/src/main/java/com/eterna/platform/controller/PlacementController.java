package com.eterna.platform.controller;

import com.eterna.platform.domain.Placement;
import com.eterna.platform.repository.PlacementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/placements")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlacementController {

    private final PlacementRepository placementRepository;

    @GetMapping
    public ResponseEntity<List<Placement>> getPlacements(@RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(placementRepository.findByStatus(status));
        }
        return ResponseEntity.ok(placementRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Placement> createPlacement(@RequestBody Placement placement) {
        return ResponseEntity.ok(placementRepository.save(placement));
    }
}
