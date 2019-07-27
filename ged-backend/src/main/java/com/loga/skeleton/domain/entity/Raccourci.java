package com.loga.skeleton.domain.entity;

import com.loga.bebase.entity.AbstractEntity;
import com.loga.skeleton.domain.enumeration.RaccourciType;
import lombok.*;

import javax.persistence.*;
import java.util.Collection;

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

    @ManyToOne
    private Dossier emplacement;

    @Column(name = "type")
    private RaccourciType type;

    @ManyToOne
    private Document document;

    @ManyToOne
    private Dossier dossier;

}
