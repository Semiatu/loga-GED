package com.loga.skeleton.domain.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @ManyToOne
    private Dossier dossierParent;

    private boolean leaf;

   /* @OneToMany(mappedBy = "dossier")
    private List<Raccourci> raccourcis;*/

   /* @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @OneToMany(mappedBy = "dossier")
    private List<Document> documents;*/

    /*@OneToMany(mappedBy = "dossier")
    private List<Privilege> privileges;
*/

}
