package com.example.backend.repository;

import com.example.backend.entity.HumanBeingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface HumanBeingRepo extends JpaRepository<HumanBeingEntity, Long> {
}
