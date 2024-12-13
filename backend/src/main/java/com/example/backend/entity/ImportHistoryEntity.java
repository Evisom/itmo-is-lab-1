package com.example.backend.entity;


import com.example.backend.config.ImportStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "import_history")
public class ImportHistoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private UserEntity user;

    private String login;

    @Enumerated(EnumType.STRING)
    private ImportStatus status;

    private Integer addedObjectsCount;

    private String filename;

    public void setLogin(){
        this.login = this.user.getLogin();
    }


}
