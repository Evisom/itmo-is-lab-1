package com.example.backend.repository;

import com.example.backend.entity.Coordinates;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoordinatesRepo extends JpaRepository<Coordinates, Long> {
}
