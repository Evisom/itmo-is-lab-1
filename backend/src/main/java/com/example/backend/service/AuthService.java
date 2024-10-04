package com.example.backend.service;

import com.example.backend.domain.JwtAuthentication;
import com.example.backend.domain.JwtRequest;
import com.example.backend.domain.JwtResponse;
import com.example.backend.domain.Role;
import com.example.backend.entity.UserEntity;
import com.example.backend.exception.AuthException;
import com.example.backend.exception.UserAlreadyExistException;
import com.example.backend.util.PasswordHash384;
import io.jsonwebtoken.Claims;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    public JwtResponse register(@NonNull JwtRequest authRequest, Boolean wantBeAdmin) throws  UserAlreadyExistException {

        if (userService.getByLogin(authRequest.getLogin()).isPresent()) {
            throw new UserAlreadyExistException("Пользователь с таким логином уже существует");
        }

        String hashedPassword = PasswordHash384.encryptThisString(authRequest.getPassword());


        UserEntity newUser = new UserEntity();
        newUser.setLogin(authRequest.getLogin());
        newUser.setPassword(hashedPassword);


        Set<Role> roles = new HashSet<>();
        roles.add(Role.USER);
        newUser.setRoles(roles);
        userService.save(newUser);
        if (! userService.isAnyAdmin() && wantBeAdmin){
            roles.add(Role.ADMIN);
            userService.save(newUser);
        } else if (wantBeAdmin) {
            userService.goToLimbo(newUser.getId());
        }

        final String accessToken = jwtProvider.generateAccessToken(newUser);
        final String refreshToken = jwtProvider.generateRefreshToken(newUser);
        refreshStorage.put(newUser.getLogin(), refreshToken);

        return new JwtResponse(accessToken, refreshToken, newUser.getId());
    }

    public JwtResponse login(@NonNull JwtRequest authRequest) {
        final UserEntity user = userService.getByLogin(authRequest.getLogin())
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));
        String hashedPassword = PasswordHash384.encryptThisString(authRequest.getPassword());
        if (hashedPassword.equals(user.getPassword())) {
            final String accessToken = jwtProvider.generateAccessToken(user);
            final String refreshToken = jwtProvider.generateRefreshToken(user);
            refreshStorage.put(user.getLogin(), refreshToken);
            return new JwtResponse(accessToken, refreshToken,user.getId());
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
                return new JwtResponse(accessToken, null,user.getId());
            }
        }
        return new JwtResponse(null, null,null);
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
                return new JwtResponse(accessToken, newRefreshToken, user.getId());
            }
        }
        throw new AuthException("Невалидный JWT токен");
    }

    public JwtAuthentication getAuthInfo() {
        return (JwtAuthentication) SecurityContextHolder.getContext().getAuthentication();
    }

}