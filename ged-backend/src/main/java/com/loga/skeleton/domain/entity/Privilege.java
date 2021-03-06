package com.loga.skeleton.domain.entity;

import com.loga.as.entity.Profile;
import com.loga.as.entity.User;
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
@Table(name = "privilege")
public class Privilege extends AbstractEntity {

    @ManyToOne
    private Dossier dossier;

    @ManyToOne
    private Document document;

    @ManyToOne
    private User user;

    @ManyToOne
    private Profile profile;


}
