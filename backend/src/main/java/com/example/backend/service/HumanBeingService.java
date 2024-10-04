package com.example.backend.service;

import com.example.backend.domain.HumanBeing;
import com.example.backend.entity.Car;
import com.example.backend.entity.Coordinates;
import com.example.backend.entity.HumanBeingEntity;
import com.example.backend.entity.UserEntity;
import com.example.backend.repository.CarRepo;
import com.example.backend.repository.CoordinatesRepo;
import com.example.backend.repository.HumanBeingRepo;
import com.example.backend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class HumanBeingService {

    @Autowired
    private HumanBeingRepo humanBeingRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CarRepo carRepo;

    @Autowired
    private CoordinatesRepo coordinatesRepo;

    public HumanBeing getHumanBeing(Long id) {
        HumanBeingEntity humanBeing = humanBeingRepo.findById(id).get();
        return HumanBeing.toModel(humanBeing);
    }

    public List<HumanBeing> getAllHumanBeing() {
        return humanBeingRepo.findAll().stream().map(HumanBeing::toModel).collect(Collectors.toList());
    }

    public HumanBeing createHumanBeing(HumanBeingEntity human, Long userId) {
        UserEntity user = userRepo.findById(userId).get();

        Long carId = human.getCar().getId();
        Car car;
        if (carId == null) {
            car = new Car();
            car.setCool(human.getCar().getCool());
            carRepo.save(car);
        } else {
            car = carRepo.findById(carId).get();

        }

        Long coorId = human.getCoordinates().getId();
        Coordinates coordinates;
        if (coorId == null) {
            coordinates = new Coordinates();
            coordinates.setX(human.getCoordinates().getX());
            coordinates.setY(human.getCoordinates().getY());
            coordinatesRepo.save(coordinates);
        } else {
            coordinates = coordinatesRepo.findById(coorId).get();

        }

        human.setCar(car);
        human.setCoordinates(coordinates);
        human.setUser(user);
        return HumanBeing.toModel(humanBeingRepo.save(human));
    }

    public HumanBeing updateHumanBeing(Long id, HumanBeingEntity humanBeingDetails) {
        HumanBeingEntity humanBeingEntity = humanBeingRepo.findById(id).get();
        Car car;
        Coordinates coordinates ;

        Long carId = humanBeingDetails.getCar().getId();

        if (carId == null) {
            car = carRepo.findById(humanBeingEntity.getCar().getId()).get();
            car.setCool(humanBeingDetails.getCar().getCool());
            carRepo.save(car);
        } else {
            humanBeingEntity.setCar(carRepo.findById(carId).get());
        }


        Long coorId = humanBeingDetails.getCoordinates().getId();
        if (coorId == null) {
            coordinates =  coordinatesRepo.findById(humanBeingEntity.getCoordinates().getId()).get();
            coordinates.setX(humanBeingDetails.getCoordinates().getX());
            coordinates.setY(humanBeingDetails.getCoordinates().getY());
            coordinatesRepo.save(coordinates);
        } else {
            humanBeingEntity.setCoordinates(coordinatesRepo.findById(coorId).get());

        }




        humanBeingEntity.setName(humanBeingDetails.getName());
        humanBeingEntity.setRealHero(humanBeingDetails.getRealHero());
        humanBeingEntity.setHasToothpick(humanBeingDetails.getHasToothpick());
        humanBeingEntity.setMood(humanBeingDetails.getMood());
        humanBeingEntity.setImpactSpeed(humanBeingDetails.getImpactSpeed());
        humanBeingEntity.setSoundtrackName(humanBeingDetails.getSoundtrackName());
        humanBeingEntity.setMinutesOfWaiting(humanBeingDetails.getMinutesOfWaiting());
        humanBeingEntity.setWeaponType(humanBeingDetails.getWeaponType());



        humanBeingRepo.save(humanBeingEntity);

        return HumanBeing.toModel(humanBeingEntity);
    }


    public boolean deleteHumanBeing(Long id) {
        if (humanBeingRepo.existsById(id)) {
            humanBeingRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
