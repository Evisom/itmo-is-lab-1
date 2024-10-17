package com.example.backend.service;

import com.example.backend.entity.Coordinates;
import com.example.backend.exception.NoEntityException;
import com.example.backend.repository.CoordinatesRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;




@Service
@RequiredArgsConstructor
public class CoordinatesService {

    private final CoordinatesRepo coordinatesRepo;
    @Transactional(readOnly = true)
    public List<Coordinates> getAllCoordinates() {
        return coordinatesRepo.findAll();
    }
    @Transactional(readOnly = true)
    public Optional<Coordinates> getOne(Long id) {
        return coordinatesRepo.findById(id);

    }

    @Transactional
    public Coordinates createCoordinates(Coordinates coordinates){
        return coordinatesRepo.save(coordinates);
    }

    @Transactional
    public Coordinates updateCoordinates(Long id, Coordinates coordinates) throws NoEntityException {
        Coordinates oldCoor = coordinatesRepo.findById(id).orElseThrow(() -> new NoEntityException("no such entity"));
        oldCoor.setX(coordinates.getX());
        oldCoor.setY(coordinates.getY());
        coordinatesRepo.save(oldCoor);
        coordinates.setId(id);
        return coordinates;

    }

    @Transactional
    public boolean deleteCoordinates(Long id) {
        if (coordinatesRepo.existsById(id)) {
            coordinatesRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
