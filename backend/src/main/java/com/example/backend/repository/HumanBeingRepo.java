package com.example.backend.repository;

import com.example.backend.entity.HumanBeingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HumanBeingRepo extends JpaRepository<HumanBeingEntity, Long> {

    @Query(value = "SELECT count_human_beings_by_soundtrack(:soundtrackName)", nativeQuery = true)
    int getHumanCountBySoundtrackName(@Param("soundtrackName") String soundtrackName);

    @Query(value = "SELECT count_human_beings_by_weapon_type(:weaponType)", nativeQuery = true)
    int getHumanCountByWeaponType(@Param("weaponType") String weaponType);

    @Query(value = "SELECT * FROM get_human_beings_by_soundtrack(:soundtrackName)", nativeQuery = true)
    List<HumanBeingEntity> getHumansBySoundtrackName(@Param("soundtrackName") String soundtrackName);

    @Modifying
    @Query(value = "CALL delete_human_beings_without_toothpicks()", nativeQuery = true)
    void deleteHumansWithoutToothpicks();

    @Modifying
    @Query(value = "CALL update_humans_cars_to_cool()", nativeQuery = true)
    void updateHumansWithoutCars();
}
