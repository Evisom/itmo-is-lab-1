package com.example.backend.service;

import com.example.backend.domain.User;
import com.example.backend.entity.UserEntity;
import com.example.backend.exception.UserAlreadyExistException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.repository.UserRepo;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    @Autowired
    private UserRepo userRepo;

//    private final List<UserEntity> users;

//    public UserService() {
//        this.users = List.of(
//                new UserEntity(1L,"anton", "1234"),
//                new UserEntity(2L,"ivan", "12345")
//        );
//    }

    public Optional<UserEntity> getByLogin(@NonNull String login) {
        UserEntity user = userRepo.findByLogin(login);
        return Optional.ofNullable(user);

    }

    public UserEntity registration(UserEntity user) throws UserAlreadyExistException {
        if (userRepo.findByLogin(user.getLogin())!= null){
            throw  new UserAlreadyExistException("User alredy exist");
        }
        return userRepo.save(user);
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

}