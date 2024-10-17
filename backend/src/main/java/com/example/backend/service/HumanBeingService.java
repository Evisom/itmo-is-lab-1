package com.example.backend.service;

import com.example.backend.domain.HumanBeing;
import com.example.backend.domain.Mood;
import com.example.backend.domain.WeaponType;
import com.example.backend.entity.Car;
import com.example.backend.entity.Coordinates;
import com.example.backend.entity.HumanBeingEntity;
import com.example.backend.entity.UserEntity;
import com.example.backend.exception.NoEntityException;
import com.example.backend.repository.CarRepo;
import com.example.backend.repository.CoordinatesRepo;
import com.example.backend.repository.HumanBeingRepo;
import com.example.backend.repository.UserRepo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class HumanBeingService {
    private final EntityManager entityManager;


    private final HumanBeingRepo humanBeingRepo;


    private final UserRepo userRepo;


    private final CarRepo carRepo;


    private final CoordinatesRepo coordinatesRepo;

    @Transactional(readOnly = true)
    public HumanBeing getHumanBeing(Long id) throws NoEntityException {
        HumanBeingEntity humanBeing = humanBeingRepo.findById(id).orElseThrow(() -> new NoEntityException("no such entity"));
        return HumanBeing.toModel(humanBeing);
    }

    @Transactional(readOnly = true)
    public List<HumanBeing> getFilteredHumans(String name, Long coordinatesId, LocalDateTime creationDate, Boolean realHero, Boolean hasToothpick, Long carId, Mood mood, Double impactSpeed, String soundtrackName, Double minutesOfWaiting, WeaponType weaponType) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<HumanBeingEntity> query = cb.createQuery(HumanBeingEntity.class);
        Root<HumanBeingEntity> humanBeing = query.from(HumanBeingEntity.class);


        List<Predicate> predicates = new ArrayList<>();


        if (name != null) {
            predicates.add(cb.equal(humanBeing.get("name"), name));
        }
        if (coordinatesId != null) {
            predicates.add(cb.equal(humanBeing.get("coordinatesId"), coordinatesId));
        }

        if (realHero != null) {
            predicates.add(cb.equal(humanBeing.get("realHero"), realHero));
        }


        if (impactSpeed != null) {
            predicates.add(cb.equal(humanBeing.get("impactSpeed"), impactSpeed));
        }


        if (weaponType != null) {
            predicates.add(cb.equal(humanBeing.get("weaponType"), weaponType));
        }
        if (creationDate != null) {
            predicates.add(cb.equal(humanBeing.get("creationDate"), creationDate));
        }


        if (hasToothpick != null) {
            predicates.add(cb.equal(humanBeing.get("hasToothpick"), hasToothpick));
        }


        if (soundtrackName != null) {
            predicates.add(cb.equal(humanBeing.get("soundtrackName"), soundtrackName));
        }
        if (minutesOfWaiting != null) {
            predicates.add(cb.equal(humanBeing.get("minutesOfWaiting"), minutesOfWaiting));
        }


        if (mood != null) {
            predicates.add(cb.equal(humanBeing.get("mood"), mood));
        }


        if (carId != null) {
            predicates.add(cb.equal(humanBeing.get("carId"), carId));
        }

        // Устанавливаем условия фильтрации
        query.select(humanBeing).where(predicates.toArray(new Predicate[0]));

        // Выполняем запрос и возвращаем результат
        return entityManager.createQuery(query).getResultList().stream().map(HumanBeing::toModel).collect(Collectors.toList());

    }

    @Transactional
    public HumanBeing createHumanBeing(HumanBeingEntity human, Long userId) throws NoEntityException {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new NoEntityException("no such entity"));

        Long carId = human.getCar().getId();
        Car car;
        if (carId == null) {
            car = new Car();
            car.setCool(human.getCar().getCool());
            carRepo.save(car);
        } else {
            car = carRepo.findById(carId).orElseThrow(() -> new NoEntityException("no such entity"));

        }

        Long coorId = human.getCoordinates().getId();
        Coordinates coordinates;
        if (coorId == null) {
            coordinates = new Coordinates();
            coordinates.setX(human.getCoordinates().getX());
            coordinates.setY(human.getCoordinates().getY());
            coordinatesRepo.save(coordinates);
        } else {
            coordinates = coordinatesRepo.findById(coorId).orElseThrow(() -> new NoEntityException("no such entity"));

        }

        human.setCar(car);
        human.setCoordinates(coordinates);
        human.setUser(user);
        return HumanBeing.toModel(humanBeingRepo.save(human));
    }

    @Transactional
    public HumanBeing updateHumanBeing(Long id, HumanBeingEntity humanBeingDetails) throws NoEntityException {
        HumanBeingEntity humanBeingEntity = humanBeingRepo.findById(id).orElseThrow(() -> new NoEntityException("no such entity"));
        Car car;
        Coordinates coordinates;

        Long carId = humanBeingDetails.getCar().getId();

        if (carId == null) {
            car = carRepo.findById(humanBeingEntity.getCar().getId()).orElseThrow(() -> new NoEntityException("no such entity"));
            car.setCool(humanBeingDetails.getCar().getCool());
            carRepo.save(car);
        } else {
            humanBeingEntity.setCar(carRepo.findById(carId).orElseThrow(() -> new NoEntityException("no such entity")));
        }


        Long coorId = humanBeingDetails.getCoordinates().getId();
        if (coorId == null) {
            coordinates = coordinatesRepo.findById(humanBeingEntity.getCoordinates().getId()).orElseThrow(() -> new NoEntityException("no such entity"));
            coordinates.setX(humanBeingDetails.getCoordinates().getX());
            coordinates.setY(humanBeingDetails.getCoordinates().getY());
            coordinatesRepo.save(coordinates);
        } else {
            humanBeingEntity.setCoordinates(coordinatesRepo.findById(coorId).orElseThrow(() -> new NoEntityException("no such entity")));

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

    @Transactional
    public boolean deleteHumanBeing(Long id) {
        if (humanBeingRepo.existsById(id)) {
            humanBeingRepo.deleteById(id);
            return true;
        }
        return false;
    }


    @Transactional(readOnly = true)
    public int getHumanCountBySoundtrackName(String soundtrackName) {
        return humanBeingRepo.getHumanCountBySoundtrackName(soundtrackName);
    }

    @Transactional(readOnly = true)

    public int getHumanCountByWeaponType(String weaponType) {
        return humanBeingRepo.getHumanCountByWeaponType(weaponType);
    }

    @Transactional(readOnly = true)
    public List<HumanBeing> getHumansBySoundtrackName(String soundtrackName) {
        return humanBeingRepo.getHumansBySoundtrackName(soundtrackName).stream().map(HumanBeing::toModel).collect(Collectors.toList());
    }

    @Transactional
    public void deleteHumansWithoutToothpicks() {
        humanBeingRepo.deleteHumansWithoutToothpicks();
    }

    @Transactional
    public void updateHumansWithoutCars() {
        humanBeingRepo.updateHumansWithoutCars();
    }


}
