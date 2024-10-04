package com.example.backend.domain;

import com.example.backend.entity.Car;
import com.example.backend.entity.Coordinates;
import com.example.backend.entity.HumanBeingEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class HumanBeing {
    private Long id;
    private Long userId;
    private String name;
    private Coordinates coordinates;
    private java.time.LocalDateTime creationDate;
    private Boolean realHero;
    private boolean hasToothpick;
    private Car car;
    private Mood mood;
    private double impactSpeed;
    private String soundtrackName;
    private Long minutesOfWaiting;
    private WeaponType weaponType;

    public static HumanBeing toModel(HumanBeingEntity humanBeingEntity){
        HumanBeing model = new HumanBeing();
        model.setId(humanBeingEntity.getId());
        model.setUserId(humanBeingEntity.getUser().getId());
        model.setName(humanBeingEntity.getName());
        model.setCoordinates(humanBeingEntity.getCoordinates());
        model.setCreationDate(humanBeingEntity.getCreationDate());
        model.setRealHero(humanBeingEntity.getRealHero());
        model.setHasToothpick(humanBeingEntity.getHasToothpick());
        model.setCar(humanBeingEntity.getCar());
        model.setMood(humanBeingEntity.getMood());
        model.setImpactSpeed(humanBeingEntity.getImpactSpeed());
        model.setWeaponType(humanBeingEntity.getWeaponType());
        model.setSoundtrackName(humanBeingEntity.getSoundtrackName());
        model.setMinutesOfWaiting(humanBeingEntity.getMinutesOfWaiting());
        return model;
    }



}
