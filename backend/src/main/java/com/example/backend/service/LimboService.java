package com.example.backend.service;


import com.example.backend.domain.User;
import com.example.backend.entity.Limbo;
import com.example.backend.entity.UserEntity;
import com.example.backend.repository.LimboRepo;
import com.example.backend.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LimboService {


    private final LimboRepo limboRepo;


    private final UserRepo userRepo;
    @Transactional(readOnly = true)

    public List<User> getAllUsers() {
        return limboRepo.findAll().stream()
                .map(Limbo::getUser).map(User::toModel)  // Извлекаем пользователя из Limbo
                .collect(Collectors.toList());  // Преобразуем в список
    }

    @Transactional
    public boolean deleteUserFromLimbo(Long userId) {
        UserEntity user = userRepo.findById(userId).orElse(null);
        if (user!=null) {
            limboRepo.deleteByUser(user);
            return true;
        }
        return false;
    }
}
