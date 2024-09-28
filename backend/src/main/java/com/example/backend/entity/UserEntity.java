package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String login;
    private String password;
//    private Set<Role> roles;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    private List<HumanBeing> humanBeingList;
}
