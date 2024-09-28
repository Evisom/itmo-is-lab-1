package com.example.backend.repository;

import com.example.backend.entity.HumanBeing;
import org.springframework.data.repository.CrudRepository;

public interface HumanBeingRepo extends CrudRepository<HumanBeing, Long> {
}
