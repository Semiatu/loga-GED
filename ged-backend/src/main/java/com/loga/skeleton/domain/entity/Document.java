package com.loga.skeleton.domain.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.loga.bebase.entity.AbstractEntity;
import lombok.*;

import javax.persistence.*;
import java.util.List;

import static java.util.Objects.isNull;

@EqualsAndHashCode(callSuper = false)
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "document")
public class Document extends AbstractEntity {

    @Column(name = "nom")
    private String nom;

    @Column(name = "description")
    private String description;

    @Column(name = "taille")
    private String taille;

    @Column(name = "est_dans_corbeille")
    private boolean estDansCorbeille = false;

    @Column(name = "format")
    private String format;

    @Column(name = "auteur")
    private String auteur;

    @Column(name = "version")
    private String version;

    @Column(name = "url")
    private String url;

    @Column(name = "etat_suppression")
    private boolean etatSuppression = false;

    @ManyToOne
    @JoinColumn(name = "categorie")
    private Categorie categorie;

    @ManyToOne
    @JoinColumn(name = "etat")
    private Etat etat;

    @ManyToOne
    @JoinColumn(name = "langue")
    private Langue langue;

    @ManyToOne
    @JoinColumn(name = "type")
    private TypeDocument typeDocument;

    @ManyToOne
    private Dossier dossier;

}
