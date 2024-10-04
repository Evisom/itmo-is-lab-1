package com.example.backend.service;


import com.example.backend.domain.HumanBeing;
import com.example.backend.domain.LimboModel;
import com.example.backend.domain.User;
import com.example.backend.entity.Limbo;
import com.example.backend.repository.LimboRepo;
import com.example.backend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LimboService {

    @Autowired
    private LimboRepo limboRepo;

    @Autowired
    private UserRepo userRepo;

    public List<User> getAllUsers() {
        List<Limbo> userInLimboList =  limboRepo.findAll();
        List<User> users = new ArrayList<>();
        for (Limbo limbo : userInLimboList){
            users.add(User.toModel(userRepo.findById(limbo.getUserid()).get()));
        }
        return users;
    }

    @Transactional
    public boolean deleteUserFromLimbo(Long id) {
        if (limboRepo.existsByUserid(id)) {
            limboRepo.deleteByUserid(id);
            return true;
        }
        return false;
    }
}
