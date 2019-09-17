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

    @Column(name = "versionPrecedente")
    private double versionPrecedente;

    @ManyToOne
    private Document document;
}
