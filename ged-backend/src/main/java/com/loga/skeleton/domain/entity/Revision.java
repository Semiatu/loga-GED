package com.loga.skeleton.domain.entity;

import com.loga.bebase.entity.AbstractEntity;
import lombok.*;

import javax.persistence.*;
import java.util.Date;

@EqualsAndHashCode(callSuper = false)
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "revision")
public class Revision extends AbstractEntity {

    @Column(name = "nom")
    private double nom;

    @Column(name = "versionPrecedente")
    private String versionPrecedente;

    @Column(name = "dateRevision")
    @Temporal(TemporalType.DATE)
    private Date dateRevision;

    @ManyToOne
    private Document document;
}
