package com.example.backend.domain;

import com.example.backend.config.ImportStatus;
import com.example.backend.entity.ImportHistoryEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter
@Setter
@NoArgsConstructor
public class History {


    private Long id;
    private Long userId;
    private ImportStatus status;
    private Integer addedObjectsCount;


    public static History toModel(ImportHistoryEntity historyEntity){
        History  model = new History();
        model.setId(historyEntity.getId());
        model.setUserId(historyEntity.getUser().getId());
        model.setStatus(historyEntity.getStatus());
        model.setAddedObjectsCount(historyEntity.getAddedObjectsCount());
        return model;
    }
}
