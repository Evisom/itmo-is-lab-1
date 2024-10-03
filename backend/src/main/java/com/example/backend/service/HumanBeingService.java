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

import java.util.Optional;


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

    public HumanBeing getHumanBeing(Long id){
        HumanBeingEntity humanBeing = humanBeingRepo.findById(id).get();
        return HumanBeing.toModel(humanBeing);
    }

    public HumanBeing createHumanBeing(HumanBeingEntity human, Long userId){
        UserEntity user = userRepo.findById(userId).get();
        Coordinates coordinates = new Coordinates();
        coordinates.setX(human.getCoordinates().getX());
        coordinates.setY(human.getCoordinates().getY());
        coordinatesRepo.save(coordinates);

        Car car = new Car();
        car.setCool(human.getCar().getCool());
        carRepo.save(car);

        human.setCar(car);
        human.setCoordinates(coordinates);
        human.setUser(user);
        return HumanBeing.toModel(humanBeingRepo.save(human));
    }

    public HumanBeing updateHumanBeing(Long id, HumanBeingEntity humanBeingDetails) {
        HumanBeingEntity humanBeingEntity = humanBeingRepo.findById(id).get();



        humanBeingEntity.setName(humanBeingDetails.getName());
        humanBeingEntity.setCoordinates(humanBeingDetails.getCoordinates());
        humanBeingEntity.setRealHero(humanBeingDetails.getRealHero());
        humanBeingEntity.setHasToothpick(humanBeingDetails.getHasToothpick());
        humanBeingEntity.setCar(humanBeingDetails.getCar());
        humanBeingEntity.setMood(humanBeingDetails.getMood());
        humanBeingEntity.setImpactSpeed(humanBeingDetails.getImpactSpeed());
        humanBeingEntity.setSoundtrackName(humanBeingDetails.getSoundtrackName());
        humanBeingEntity.setMinutesOfWaiting(humanBeingDetails.getMinutesOfWaiting());
        humanBeingEntity.setWeaponType(humanBeingDetails.getWeaponType());


        humanBeingRepo.save(humanBeingEntity);

        return HumanBeing.toModel(humanBeingEntity);
    }

}
