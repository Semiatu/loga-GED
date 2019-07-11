package com.loga.skeleton.domain.entity;

import com.loga.bebase.entity.AbstractEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Collection;
import java.util.List;

@EqualsAndHashCode(callSuper = false)
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "dossier")
public class Dossier extends AbstractEntity {

    @Column(name = "nom")
    private String nom;

    @Column(name = "taille")
    private Long taille;

    @OneToMany(mappedBy = "dossier")
    private List<Raccourci> raccourcis;

    @ManyToOne
    private Dossier dossier;

    @OneToMany(mappedBy = "dossier")
    private List<Document> documents;

    @OneToMany(mappedBy = "dossier")
    private List<Privilege> privileges;


}
