package com.example.backend.service;

import com.example.backend.entity.Car;
import com.example.backend.exception.NoEntityException;
import com.example.backend.repository.CarRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepo carRepo;

    @Transactional(readOnly = true)
    public List<Car> getAllCars() {
        return carRepo.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Car> getOne(Long id) {
        return carRepo.findById(id);

    }


    @Transactional
    public Car createCar(Car car) { return carRepo.save(car);    }

    @Transactional
    public Car updateCar(Long id, Car car) throws NoEntityException {
        Car oldCar = carRepo.findById(id).orElseThrow(() -> new NoEntityException("no such entity"));
        oldCar.setCool(car.getCool());
        carRepo.save(oldCar);
        car.setId(id);
        return car;

    }

    @Transactional
    public boolean deleteCar(Long id) {
        if (carRepo.existsById(id)) {
            carRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
