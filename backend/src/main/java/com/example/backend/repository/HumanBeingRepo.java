package com.example.backend.repository;

import com.example.backend.entity.HumanBeingEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HumanBeingRepo extends JpaRepository<HumanBeingEntity, Long> {
}
