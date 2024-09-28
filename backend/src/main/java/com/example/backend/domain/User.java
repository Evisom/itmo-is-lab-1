package com.example.backend.domain;

import com.example.backend.entity.UserEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class User {
    private Long id;
    private String login;

    public static User toModel(UserEntity userEntity){
        User model = new User();
        model.setId(userEntity.getId());
        model.setLogin(userEntity.getLogin());
        return model;
    }
}
