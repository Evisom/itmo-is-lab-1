package com.example.backend.repository;

import com.example.backend.domain.Role;
import com.example.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserRepo extends JpaRepository<UserEntity, Long> {
    UserEntity findByLogin(String login);

}
