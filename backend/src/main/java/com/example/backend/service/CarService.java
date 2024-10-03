package com.example.backend.service;

import com.example.backend.entity.Car;
import com.example.backend.repository.CarRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarService {
    @Autowired
    private CarRepo carRepo;
    public List<Car> getAllCars() {
        return carRepo.findAll();
    }

    public Optional<Car> getOne(Long id) {
        return carRepo.findById(id);

    }
}
