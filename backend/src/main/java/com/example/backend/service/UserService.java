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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private LimboRepo limboRepo;

    @Autowired
    private LimboService limboService;


    public Optional<UserEntity> getByLogin(@NonNull String login) {
        UserEntity user = userRepo.findByLogin(login);
        return Optional.ofNullable(user);

    }



    public User getOne(Long id) throws UserNotFoundException {
        UserEntity user = userRepo.findById(id).get();
        if (user == null){
            throw new UserNotFoundException("User not found");
        }
        return User.toModel(user);
    }

    public Long deleteUser(Long id){
        userRepo.deleteById(id);
        return  id;
    }

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

    public void goToLimbo(Long userId) {
        Limbo limboEntity = new Limbo();
        limboEntity.setUserid(userId);
        limboRepo.save(limboEntity);
    }

    public User updateUserAdminRole(Long id) {
        UserEntity userEntity = userRepo.findById(id).get();
        userEntity.getRoles().add(Role.ADMIN);
        userRepo.save(userEntity);
        limboService.deleteUserFromLimbo(id);
        return User.toModel(userEntity);
    }


}