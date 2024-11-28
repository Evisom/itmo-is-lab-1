package com.example.backend.repository;

import com.example.backend.entity.ImportHistoryEntity;
import com.example.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImportHistoryRepository extends JpaRepository<ImportHistoryEntity, Long> {

    List<ImportHistoryEntity> findByUser(UserEntity user);


}