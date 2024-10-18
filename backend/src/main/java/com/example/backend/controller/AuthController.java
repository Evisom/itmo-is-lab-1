package com.example.backend.controller;


import com.example.backend.domain.JwtRequest;
import com.example.backend.domain.JwtResponse;
import com.example.backend.domain.RefreshJwtRequest;
import com.example.backend.exception.UserAlreadyExistException;
import com.example.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("registration")
    public ResponseEntity<JwtResponse> registration(@RequestBody JwtRequest authRequest, @RequestParam Boolean wantBeAdmin ){
        try {
            final JwtResponse token = authService.register(authRequest,wantBeAdmin);
            return ResponseEntity.ok(token);
        }catch (UserAlreadyExistException e){
            return ResponseEntity.status(409).build();
        }
    }

    @PostMapping("login")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest authRequest) {
        final JwtResponse token = authService.login(authRequest);
        return ResponseEntity.ok(token);
    }

    @PostMapping("token")
    public ResponseEntity<JwtResponse> getNewAccessToken(@RequestBody RefreshJwtRequest request) {
        final JwtResponse token = authService.getAccessToken(request.getRefreshToken());
        return ResponseEntity.ok(token);
    }

    @PostMapping("refresh")
    public ResponseEntity<JwtResponse> getNewRefreshToken(@RequestBody RefreshJwtRequest request) {
        final JwtResponse token = authService.refresh(request.getRefreshToken());
        return ResponseEntity.ok(token);
    }

}