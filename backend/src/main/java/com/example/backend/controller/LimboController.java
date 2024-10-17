package com.example.backend.controller;

import com.example.backend.domain.User;
import com.example.backend.service.LimboService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("limbo")
@RequiredArgsConstructor
public class LimboController {

    private final LimboService limboService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsersFromLimbo(){
        return ResponseEntity.ok(limboService.getAllUsers());

    }

    @DeleteMapping
    public ResponseEntity<Void> deleteUser(@RequestParam Long userId){

        if (limboService.deleteUserFromLimbo(userId)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
