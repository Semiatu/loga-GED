package com.loga.skeleton.domain.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.loga.bebase.entity.AbstractEntity;
import com.loga.skeleton.domain.enumeration.RaccourciType;
import lombok.*;

import javax.persistence.*;
import java.util.Collection;

import static java.util.Objects.isNull;

@EqualsAndHashCode(callSuper = false)
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "raccourci")
public class Raccourci extends AbstractEntity {

    @Column(name = "nom")
    private String nom;

    @Column(name = "etat_suppression")
    private boolean etatSuppression = false;

    @Column(name = "est_dans_corbeille")
    private boolean estDansCorbeille = false;

    @ManyToOne
    private Dossier emplacement;

    @Column(name = "type")
    private RaccourciType type;

    @ManyToOne
    private Document document;

    @ManyToOne
    private Dossier dossier;

}
