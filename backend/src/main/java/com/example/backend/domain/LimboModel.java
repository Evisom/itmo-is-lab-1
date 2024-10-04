package com.example.backend.domain;

import com.example.backend.entity.Limbo;
import com.example.backend.entity.UserEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;




@Getter
@Setter
@NoArgsConstructor
public class LimboModel {

    private Long id;
    private Long userid;

    public static LimboModel toModel(Limbo limbo){
        LimboModel model = new LimboModel();
        model.setId(limbo.getId());
//        model.setUser(User.toModel(limbo.getUser()));
        return model;
    }
}
