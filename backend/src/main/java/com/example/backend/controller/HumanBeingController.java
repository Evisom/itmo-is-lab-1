package com.example.backend.controller;

import com.example.backend.domain.HumanBeing;
import com.example.backend.domain.Mood;
import com.example.backend.domain.WeaponType;
import com.example.backend.entity.HumanBeingEntity;
import com.example.backend.service.HumanBeingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/humanbeings")
@RequiredArgsConstructor
public class HumanBeingController {


    private final HumanBeingService humanBeingService;

    @GetMapping("/{id}")
    public ResponseEntity<HumanBeing> getHumanBeing(@PathVariable Long id){
        try {
            return ResponseEntity.ok(humanBeingService.getHumanBeing(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }

    }
    @GetMapping
    public ResponseEntity<List<HumanBeing>> getFilteredHumans(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long coordinatesId,
            @RequestParam(required = false) LocalDateTime creationDate,
            @RequestParam(required = false) Boolean realHero,
            @RequestParam(required = false) Boolean hasToothpick,
            @RequestParam(required = false) Long carId,
            @RequestParam(required = false) Mood mood,
            @RequestParam(required = false) Double impactSpeed,
            @RequestParam(required = false) String soundtrackName,
            @RequestParam(required = false) Double minutesOfWaiting,
            @RequestParam(required = false) WeaponType weaponType
    ){
            return ResponseEntity.ok(humanBeingService.getFilteredHumans(name,coordinatesId,creationDate,realHero,hasToothpick,carId,
                    mood,impactSpeed,soundtrackName,minutesOfWaiting,weaponType));


    }

    @PostMapping
    public ResponseEntity<HumanBeing> createHumanBeing(@RequestBody HumanBeingEntity human,
                                           @RequestParam Long userId){
        try {
            return ResponseEntity.ok(humanBeingService.createHumanBeing(human, userId));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
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


    @GetMapping("/count/soundtrackName")
    public ResponseEntity<Integer> getHumanCountBySoundtrackName(@RequestParam String soundtrackName) {
        int count = humanBeingService.getHumanCountBySoundtrackName(soundtrackName);
        return  ResponseEntity.ok(count);
    }

    @GetMapping("/count/weaponType")
    public ResponseEntity<Integer> getHumanCountByWeaponType(@RequestParam String weaponType) {
        int count = humanBeingService.getHumanCountByWeaponType(weaponType);
        return  ResponseEntity.ok(count);
    }

    @GetMapping("/soundtrackName")
    public ResponseEntity<List<HumanBeing>> getHumansBySoundtrackName(@RequestParam String soundtrackName) {
        List<HumanBeing> humans = humanBeingService.getHumansBySoundtrackName(soundtrackName);
        return  ResponseEntity.ok(humans);
    }

    @DeleteMapping("/no-toothpicks")
    public ResponseEntity<Void> deleteHumansWithoutToothpicks() {
        humanBeingService.deleteHumansWithoutToothpicks();
        return  ResponseEntity.noContent().build();
    }

    @PutMapping("/update/no-car")
    public ResponseEntity<Void> updateHumansWithoutCars() {
        humanBeingService.updateHumansWithoutCars();
        return  ResponseEntity.noContent().build();
    }

}
