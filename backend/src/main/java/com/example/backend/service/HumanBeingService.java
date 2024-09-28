package com.example.backend.service;

import com.example.backend.entity.HumanBeing;
import com.example.backend.entity.UserEntity;
import com.example.backend.repository.HumanBeingRepo;
import com.example.backend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HumanBeingService {

    @Autowired
    private HumanBeingRepo humanBeingRepo;

    @Autowired
    private UserRepo userRepo;

    public HumanBeing createHumanBeing(HumanBeing human, Long userId){
        UserEntity user = userRepo.findById(userId).get();
        human.setUser(user);
        return humanBeingRepo.save(human);
    }

    public HumanBeing updateHumanBeing(Long id){
        HumanBeing human = humanBeingRepo.findById(id).get();
        human.setRealHero(!human.getRealHero());
        return humanBeingRepo.save(human);

    }
}
