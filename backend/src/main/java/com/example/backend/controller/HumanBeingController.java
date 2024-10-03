package com.example.backend.controller;

import com.example.backend.domain.HumanBeing;
import com.example.backend.entity.HumanBeingEntity;
import com.example.backend.service.HumanBeingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/humanbeings")
public class HumanBeingController {

    @Autowired
    private HumanBeingService humanBeingService;

    @GetMapping("/{id}")
    public ResponseEntity getHumanBeing(@PathVariable Long id){
        try {
            return ResponseEntity.ok(humanBeingService.getHumanBeing(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error");
        }

    }
    @GetMapping
    public ResponseEntity<List<HumanBeing>> getHumanBeing(){
            return ResponseEntity.ok(humanBeingService.getAllHumanBeing());


    }

    @PostMapping
    public ResponseEntity createHumanBeing(@RequestBody HumanBeingEntity human,
                                           @RequestParam Long userId){
        try {
            return ResponseEntity.ok(humanBeingService.createHumanBeing(human, userId));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error");
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<HumanBeing> updateHumanBeing(@PathVariable Long id, @RequestBody HumanBeingEntity humanBeingEntity) {
        try {
            return ResponseEntity.ok(humanBeingService.updateHumanBeing(id, humanBeingEntity));
        }catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHumanBeing(@PathVariable Long id) {
        if (humanBeingService.deleteHumanBeing(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
