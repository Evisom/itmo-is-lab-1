package com.example.backend.controller;

import com.example.backend.domain.User;
import com.example.backend.entity.UserEntity;
import com.example.backend.exception.UserAlreadyExistException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("users")
public class UserController {

    @Autowired
    private UserService userService;



    @GetMapping("/{id}")
    public ResponseEntity getOneUser(@PathVariable Long id ){
        try {
            return ResponseEntity.ok(userService.getOne(id));
        }catch (UserNotFoundException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Произошла ошибка");
        }
    }


    @PreAuthorize("ADMIN")
    @PutMapping("/addAdminRole/{id}")

    public ResponseEntity<User> addAdminRole(@PathVariable Long id){
        try {
            return ResponseEntity.ok(userService.addAdmin(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteUser(@PathVariable Long id){
        try {
            return ResponseEntity.ok(userService.deleteUser(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Произошла ошибка");
        }
    }



}
