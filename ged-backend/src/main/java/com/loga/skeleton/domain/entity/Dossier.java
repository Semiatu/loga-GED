package com.loga.skeleton.domain.entity;

import com.loga.bebase.entity.AbstractEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import javax.persistence.*;

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

    @ManyToOne
    private Dossier dossierParent;




}
