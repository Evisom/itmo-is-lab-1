package com.example.backend.service;

import com.example.backend.entity.Car;
import com.example.backend.entity.Coordinates;
import com.example.backend.repository.CoordinatesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;




@Service
public class CoordinatesService {
    @Autowired
    private CoordinatesRepo coordinatesRepo;
    public List<Coordinates> getAllCoordinates() {
        return coordinatesRepo.findAll();
    }

    public Optional<Coordinates> getOne(Long id) {
        return coordinatesRepo.findById(id);

    }

    public Coordinates createCoordinates(Coordinates coordinates){
        return coordinatesRepo.save(coordinates);
    }

    public Coordinates updateCoordinates(Long id, Coordinates coordinates) {
        Coordinates oldCoor = coordinatesRepo.findById(id).get();
        oldCoor.setX(coordinates.getX());
        oldCoor.setY(coordinates.getY());
        coordinatesRepo.save(oldCoor);
        coordinates.setId(id);
        return coordinates;

    }
}
