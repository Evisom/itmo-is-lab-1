package com.example.backend.controller;

import com.example.backend.domain.User;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class UserController {


    private final UserService userService;



    @GetMapping("/{id}")
    public ResponseEntity<User> getOneUser(@PathVariable Long id ){
        try {
            return ResponseEntity.ok(userService.getOne(id));
        }catch (UserNotFoundException e){
            return ResponseEntity.badRequest().build();
        }
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/addAdminRole/{id}")
    public ResponseEntity<User> addAdminRole(@PathVariable Long id){
        try {
            return ResponseEntity.ok(userService.updateUserAdminRole(id));
        }catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> deleteUser(@PathVariable Long id){
        try {
            return ResponseEntity.ok(userService.deleteUser(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }



}
