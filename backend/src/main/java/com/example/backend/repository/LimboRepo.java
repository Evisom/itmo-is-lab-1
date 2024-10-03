package com.example.backend.repository;

import com.example.backend.entity.Limbo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LimboRepo extends JpaRepository<Limbo, Long> {
}
