package com.example.backend.controller;

import com.example.backend.entity.HumanBeingEntity;
import com.example.backend.service.HumanBeingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/humanbeing")
public class HumanBeingController {

    @Autowired
    private HumanBeingService humanBeingService;

    @PostMapping
    public ResponseEntity createHumanBeing(@RequestBody HumanBeingEntity human,
                                           @RequestParam Long userId){
        try {
            return ResponseEntity.ok(humanBeingService.createHumanBeing(human, userId));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error");
        }

    }

    @PutMapping
    public ResponseEntity updateHumanBeing(  @RequestParam Long humanId){
        try {
            return ResponseEntity.ok(humanBeingService.updateHumanBeing( humanId));

        }catch (Exception e){
                return ResponseEntity.badRequest().body("Error");
        }

    }
}
