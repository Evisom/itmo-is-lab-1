package com.example.backend.repository;

import com.example.backend.entity.UserEntity;
import org.springframework.data.repository.CrudRepository;

public interface UserRepo extends CrudRepository<UserEntity, Long> {
    UserEntity findByLogin(String login);

}
