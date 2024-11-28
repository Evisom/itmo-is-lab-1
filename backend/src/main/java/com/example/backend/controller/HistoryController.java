package com.example.backend.controller;

import com.example.backend.domain.History;
import com.example.backend.service.ImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/history")
@RequiredArgsConstructor
public class HistoryController {
    private final ImportService importService;


    @GetMapping
    public ResponseEntity<List<History>> getHistory() {
        try {
            return ResponseEntity.ok(importService.getImportHistory());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

    }
}
