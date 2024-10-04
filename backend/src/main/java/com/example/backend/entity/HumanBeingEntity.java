package com.example.backend.entity;

import com.example.backend.domain.Mood;
import com.example.backend.domain.WeaponType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "human_being")
public class HumanBeingEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @NotBlank
    private String name;

    @NotNull
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "coordinates_id")
    private Coordinates coordinates;



    @NotNull
    @Column(updatable = false)
    private LocalDateTime creationDate;

    @NotNull
    private Boolean realHero;

    private boolean hasToothpick;

    @NotNull
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "car_id")
    private Car car;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Mood mood;

    @Max(154)
    private double impactSpeed;

    @NotNull
    private String soundtrackName;

    @NotNull
    private Long minutesOfWaiting;

    @Enumerated(EnumType.STRING)
    private WeaponType weaponType;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    public HumanBeingEntity() {
        this.creationDate = LocalDateTime.now();
    }

    public boolean getHasToothpick() {
        return hasToothpick;
    }


}
