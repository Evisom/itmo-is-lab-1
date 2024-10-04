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

    public HumanBeing getHumanBeing(Long id){
        HumanBeingEntity humanBeing = humanBeingRepo.findById(id).get();
        return HumanBeing.toModel(humanBeing);
    }
    public List<HumanBeing> getAllHumanBeing() {
        return humanBeingRepo.findAll().stream().map(HumanBeing::toModel).collect(Collectors.toList());
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
        Car car = carRepo.findById(humanBeingEntity.getCar().getId()).get();
        Coordinates coordinates = coordinatesRepo.findById(humanBeingEntity.getCoordinates().getId()).get();

        car.setCool(humanBeingDetails.getCar().getCool());

        coordinates.setX(humanBeingDetails.getCoordinates().getX());
        coordinates.setY(humanBeingDetails.getCoordinates().getY());


        humanBeingEntity.setName(humanBeingDetails.getName());
        humanBeingEntity.setRealHero(humanBeingDetails.getRealHero());
        humanBeingEntity.setHasToothpick(humanBeingDetails.getHasToothpick());
        humanBeingEntity.setMood(humanBeingDetails.getMood());
        humanBeingEntity.setImpactSpeed(humanBeingDetails.getImpactSpeed());
        humanBeingEntity.setSoundtrackName(humanBeingDetails.getSoundtrackName());
        humanBeingEntity.setMinutesOfWaiting(humanBeingDetails.getMinutesOfWaiting());
        humanBeingEntity.setWeaponType(humanBeingDetails.getWeaponType());

        carRepo.save(car);
        coordinatesRepo.save(coordinates);
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
