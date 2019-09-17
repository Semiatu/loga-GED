package com.loga.skeleton.domain.entity;

import com.loga.as.entity.Profile;
import com.loga.as.entity.User;
import com.loga.bebase.entity.AbstractEntity;
import com.loga.skeleton.domain.enumeration.Privilege;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@EqualsAndHashCode(callSuper = false)
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "authorisation")
public class Authorisation extends AbstractEntity {

    @ManyToOne
    private Document document;

    @ManyToOne
    private Dossier dossier;

    @ManyToOne
    private Raccourci raccourci;

    private Privilege privilege;

    @ManyToOne
    private Profile profile;

    @ManyToOne
    private User user;

}
