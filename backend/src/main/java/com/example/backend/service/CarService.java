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

    public Car createCar(Car car){
        return carRepo.save(car);
    }

    public Car updateCar(Long id, Car car) {
        Car oldCar = carRepo.findById(id).get();
        oldCar.setCool(car.getCool());
        carRepo.save(oldCar);
        car.setId(id);
        return car;

    }

    public boolean deleteCar(Long id) {
        if (carRepo.existsById(id)) {
            carRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
