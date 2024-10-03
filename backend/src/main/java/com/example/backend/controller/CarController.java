package com.example.backend.controller;

import com.example.backend.domain.HumanBeing;
import com.example.backend.entity.Car;
import com.example.backend.entity.HumanBeingEntity;
import com.example.backend.exception.NoEntityException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cars")
public class CarController {
    @Autowired
    private CarService carService;

    @GetMapping
    public ResponseEntity<List<Car>> getAllCars(){
        return ResponseEntity.ok(carService.getAllCars());


    }

    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id ){
        try {
            return ResponseEntity.ok(carService.getOne(id).orElseThrow(() ->new NoEntityException("No such car")));
        }catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Car> createCar(@RequestBody Car car){
        try {
            return ResponseEntity.ok(carService.createCar(car));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
}
