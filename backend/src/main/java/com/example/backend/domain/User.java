package com.example.backend.domain;

import com.example.backend.entity.UserEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class User {
    private Long id;
    private String login;
    private List<HumanBeing> humanBeingList;

    public static User toModel(UserEntity userEntity){
        User model = new User();
        model.setId(userEntity.getId());
        model.setLogin(userEntity.getLogin());
        model.setHumanBeingList(userEntity.getHumanBeingEntityList().stream().map(HumanBeing::toModel).collect(Collectors.toList()));
        return model;
    }
}
