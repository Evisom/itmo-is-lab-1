package com.example.backend.controller;

import com.example.backend.entity.Car;
import com.example.backend.entity.Coordinates;
import com.example.backend.exception.NoEntityException;
import com.example.backend.service.CarService;
import com.example.backend.service.CoordinatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/coordinates")
public class CoordinatesController {
    @Autowired
    private CoordinatesService coordinatesService;

    @GetMapping
    public ResponseEntity<List<Coordinates>> getAllCars(){
        return ResponseEntity.ok(coordinatesService.getAllCoordinates());


    }

    @GetMapping("/{id}")
    public ResponseEntity<Coordinates> getCarById(@PathVariable Long id ){
        try {
            return ResponseEntity.ok(coordinatesService.getOne(id).orElseThrow(() ->new NoEntityException("No such coordinates")));
        }catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Coordinates> createCar(@RequestBody Coordinates coordinates){
        try {
            return ResponseEntity.ok(coordinatesService.createCoordinates(coordinates));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Coordinates> updateHumanBeing(@PathVariable Long id, @RequestBody Coordinates coordinates) {
        try {
            return ResponseEntity.ok(coordinatesService.updateCoordinates(id, coordinates));
        }catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }
}
