package com.example.backend.service;

import com.example.backend.domain.Role;
import com.example.backend.domain.User;
import com.example.backend.entity.Limbo;
import com.example.backend.entity.UserEntity;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.repository.LimboRepo;
import com.example.backend.repository.UserRepo;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {


    private final UserRepo userRepo;


    private  final LimboRepo limboRepo;


    private final LimboService limboService;


    @Transactional(readOnly = true)
    public Optional<UserEntity> getByLogin(@NonNull String login) {
        UserEntity user = userRepo.findByLogin(login);
        return Optional.ofNullable(user);

    }


    @Transactional(readOnly = true)
    public User getOne(Long id) throws UserNotFoundException {
        UserEntity user = userRepo.findById(id).orElseThrow(() -> new UserNotFoundException("user not found"));

        return User.toModel(user);
    }

    @Transactional
    public Long deleteUser(Long id){
        userRepo.deleteById(id);
        return  id;
    }

    @Transactional
    public void save(UserEntity newUser) {
        userRepo.save(newUser);
    }


    public boolean isAnyAdmin(){
        List<UserEntity> adminList = userRepo.findAll();
        for (UserEntity user : adminList){
            if (user.getRoles().contains(Role.ADMIN)){
                return true;
            }
        }
        return false;
    }

    @Transactional
    public void goToLimbo(UserEntity user) {
        Limbo limboEntity = new Limbo();
        limboEntity.setUser(user);
        limboRepo.save(limboEntity);
    }

    @Transactional
    public User updateUserAdminRole(Long id) {
        UserEntity userEntity = userRepo.findById(id).orElse(null);
        if (userEntity!=null){
            userEntity.getRoles().add(Role.ADMIN);
            userRepo.save(userEntity);
            limboService.deleteUserFromLimbo(id);
            return User.toModel(userEntity);
        }


        return null;
    }


}