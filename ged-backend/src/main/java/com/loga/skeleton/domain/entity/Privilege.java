package com.loga.skeleton.domain.entity;

import com.loga.bebase.entity.AbstractEntity;
import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@EqualsAndHashCode(callSuper = false)
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "attribut")
public class Privilege extends AbstractEntity {

    @Column(name = "nom")
    private String nom;

    @Column(name = "lecture")
    private String lecture;

    @Column(name = "relecture")
    private String relecture;

    @Column(name = "ecriture")
    private String ecriture;

    @Column(name = "modification")
    private String modification;

    @Column(name = "telechargement")
    private String telechargement;

    @ManyToOne
    private Dossier dossier;

    @ManyToOne
    private Document document;

}
