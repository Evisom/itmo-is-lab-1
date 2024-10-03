package com.example.backend.service;

import com.example.backend.domain.JwtAuthentication;
import com.example.backend.domain.JwtRequest;
import com.example.backend.domain.JwtResponse;
import com.example.backend.domain.Role;
import com.example.backend.entity.UserEntity;
import com.example.backend.exception.AuthException;
import com.example.backend.util.PasswordHash384;
import io.jsonwebtoken.Claims;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final Map<String, String> refreshStorage = new HashMap<>();
    private final JwtProvider jwtProvider;

    public JwtResponse register(@NonNull JwtRequest authRequest) {

        if (userService.getByLogin(authRequest.getLogin()).isPresent()) {
            throw new AuthException("Пользователь с таким логином уже существует");
        }


        String hashedPassword = PasswordHash384.encryptThisString(authRequest.getPassword());


        UserEntity newUser = new UserEntity();
        newUser.setLogin(authRequest.getLogin());
        newUser.setPassword(hashedPassword);


        Set<Role> roles = new HashSet<>();
        roles.add(Role.USER);
        newUser.setRoles(roles);


        userService.save(newUser);


        final String accessToken = jwtProvider.generateAccessToken(newUser);
        final String refreshToken = jwtProvider.generateRefreshToken(newUser);
        refreshStorage.put(newUser.getLogin(), refreshToken);

        return new JwtResponse(accessToken, refreshToken);
    }

    public JwtResponse login(@NonNull JwtRequest authRequest) {
        final UserEntity user = userService.getByLogin(authRequest.getLogin())
                .orElseThrow(() -> new AuthException("Пользователь не найден"));
        if (user.getPassword().equals(authRequest.getPassword())) {
            final String accessToken = jwtProvider.generateAccessToken(user);
            final String refreshToken = jwtProvider.generateRefreshToken(user);
            refreshStorage.put(user.getLogin(), refreshToken);
            return new JwtResponse(accessToken, refreshToken);
        } else {
            throw new AuthException("Неправильный пароль");
        }
    }

    public JwtResponse getAccessToken(@NonNull String refreshToken) {
        if (jwtProvider.validateRefreshToken(refreshToken)) {
            final Claims claims = jwtProvider.getRefreshClaims(refreshToken);
            final String login = claims.getSubject();
            final String saveRefreshToken = refreshStorage.get(login);
            if (saveRefreshToken != null && saveRefreshToken.equals(refreshToken)) {
                final UserEntity user = userService.getByLogin(login)
                        .orElseThrow(() -> new AuthException("Пользователь не найден"));
                final String accessToken = jwtProvider.generateAccessToken(user);
                return new JwtResponse(accessToken, null);
            }
        }
        return new JwtResponse(null, null);
    }

    public JwtResponse refresh(@NonNull String refreshToken) {
        if (jwtProvider.validateRefreshToken(refreshToken)) {
            final Claims claims = jwtProvider.getRefreshClaims(refreshToken);
            final String login = claims.getSubject();
            final String saveRefreshToken = refreshStorage.get(login);
            if (saveRefreshToken != null && saveRefreshToken.equals(refreshToken)) {
                final UserEntity user = userService.getByLogin(login)
                        .orElseThrow(() -> new AuthException("Пользователь не найден"));
                final String accessToken = jwtProvider.generateAccessToken(user);
                final String newRefreshToken = jwtProvider.generateRefreshToken(user);
                refreshStorage.put(user.getLogin(), newRefreshToken);
                return new JwtResponse(accessToken, newRefreshToken);
            }
        }
        throw new AuthException("Невалидный JWT токен");
    }

    public JwtAuthentication getAuthInfo() {
        return (JwtAuthentication) SecurityContextHolder.getContext().getAuthentication();
    }

}