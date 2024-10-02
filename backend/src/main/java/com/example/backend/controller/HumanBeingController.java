package com.example.backend.controller;

import com.example.backend.entity.HumanBeing;
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
    public ResponseEntity createHumanBeing(@RequestParam HumanBeing human,
                                           @RequestParam Long humanId){
        try {
            return ResponseEntity.ok(humanBeingService.createHumanBeing(human, humanId));
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
