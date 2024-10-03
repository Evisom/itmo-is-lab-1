package com.example.backend.entity;

import com.example.backend.domain.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "user_entity")
@Entity
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String login;
    private String password;
    private Set<Role> roles;

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "user", orphanRemoval = true)
    private Limbo limbo;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user",orphanRemoval = true)
    private List<HumanBeingEntity> humanBeingEntityList;
}
