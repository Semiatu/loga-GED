package com.loga.skeleton.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.loga.bebase.entity.AbstractEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Collection;
import java.util.List;

import static java.util.Objects.isNull;

@EqualsAndHashCode(callSuper = false)
@Entity
@Data
@NoArgsConstructor
@Table(name = "dossier")
public class Dossier extends AbstractEntity {

    @Column(name = "nom")
    private String nom;

    @Column(name = "taille")
    private Long taille;

    @Column(name = "etat_suppression")
    private boolean etatSuppression = false;

    @Column(name = "est_dans_corbeille")
    private boolean estDansCorbeille = false;

    @Column(name = "afficher_contenu")
    private boolean displayContent = true;

    @ManyToOne
    private Dossier dossierParent;

}
