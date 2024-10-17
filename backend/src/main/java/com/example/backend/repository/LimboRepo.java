package com.example.backend.repository;

import com.example.backend.entity.Limbo;
import com.example.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface LimboRepo extends JpaRepository<Limbo, Long> {

    @Modifying
    @Query("DELETE FROM Limbo l WHERE l.user = :user")
    void deleteByUser(UserEntity user);



}
