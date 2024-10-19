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

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class HumanBeingService {
    private final EntityManager entityManager;

    private final JwtProvider jwtProvider;


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
    public List<HumanBeing> getFilteredHumans(String name, Long coordinatesId, LocalDateTime creationDate, Boolean realHero,
                                              Boolean hasToothpick, Long carId, Mood mood, Double impactSpeed, String soundtrackName,
                                              Double minutesOfWaiting, WeaponType weaponType, String filterField, String sortOrder) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<HumanBeingEntity> query = cb.createQuery(HumanBeingEntity.class);
        Root<HumanBeingEntity> humanBeing = query.from(HumanBeingEntity.class);


        List<Predicate> predicates = new ArrayList<>();


        if (name != null) {
            predicates.add(cb.equal(humanBeing.get("name"), name));
        }
        if (coordinatesId != null) {
            predicates.add(cb.equal(humanBeing.get("coordinates").get("id"), coordinatesId));
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
            predicates.add(cb.equal(humanBeing.get("car").get("id"), carId));
        }

        if (sortOrder != null && filterField != null) {

            if (!filterField.equals("carId") && !filterField.equals("coordinatesId")) {
                if ("asc".equalsIgnoreCase(sortOrder)) {
                    query.orderBy(cb.asc(humanBeing.get(filterField)));
                } else {
                    query.orderBy(cb.desc(humanBeing.get(filterField)));
                }
            } else if (filterField.equals("carId")) {
                if ("asc".equalsIgnoreCase(sortOrder)) {
                    query.orderBy(cb.asc(humanBeing.get("car").get("id")));
                } else {
                    query.orderBy(cb.desc(humanBeing.get("car").get("id")));
                }
            } else {
                if ("asc".equalsIgnoreCase(sortOrder)) {
                    query.orderBy(cb.asc(humanBeing.get("coordinates").get("id")));
                } else {
                    query.orderBy(cb.desc(humanBeing.get("coordinates").get("id")));
                }
            }


        }

        query.select(humanBeing).where(predicates.toArray(new Predicate[0]));


        return entityManager.createQuery(query).getResultList().stream().map(HumanBeing::toModel).collect(Collectors.toList());

    }

    @Transactional
    public HumanBeing createHumanBeing(HumanBeingEntity human, Long userId, String token) throws NoEntityException, AccessDeniedException {

        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new NoEntityException("no such entity"));

        if (!checkRights(userId, token)) {
            throw new AccessDeniedException("You do not have permission to edit ");
        }

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
    public HumanBeing updateHumanBeing(Long id, HumanBeingEntity humanBeingDetails, String token) throws NoEntityException, AccessDeniedException {
        HumanBeingEntity humanBeingEntity = humanBeingRepo.findById(id).orElseThrow(() -> new NoEntityException("no such entity"));
        Car car;
        Coordinates coordinates;


        if (!checkRights(humanBeingEntity.getUser().getId(), token)) {
            throw new AccessDeniedException("You do not have permission to edit ");
        }


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
    public boolean deleteHumanBeing(Long id, String token) throws NoEntityException {

        HumanBeingEntity humanBeingEntity = humanBeingRepo.findById(id).orElse(null);

        if (humanBeingEntity == null) {
            return false;
        }

        if (!checkRights(humanBeingEntity.getUser().getId(), token)) {
            return false;
        }

        humanBeingRepo.deleteById(id);

        return true;


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

    private boolean checkRights(Long userId, String token) throws NoEntityException {
        String usernameFromToken = jwtProvider.getAccessClaims(token).getSubject();
        List<String> roles = jwtProvider.extractRoles(token);

        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new NoEntityException("no such entity"));
        return Objects.equals(user.getLogin(), usernameFromToken) || roles.contains("ADMIN");
    }


}
