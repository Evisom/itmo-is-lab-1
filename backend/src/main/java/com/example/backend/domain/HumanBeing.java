package com.example.backend.domain;

import com.example.backend.entity.HumanBeingEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class HumanBeing {
    private Long id;
    private String name;
    private Boolean realHero;

    public static HumanBeing toModel(HumanBeingEntity humanBeingEntity){
        HumanBeing model = new HumanBeing();
        model.setId(humanBeingEntity.getId());
        model.setName(humanBeingEntity.getName());
        model.setRealHero(humanBeingEntity.getRealHero());
        return model;
    }

}
