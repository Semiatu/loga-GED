package com.loga.skeleton.domain.entity;

import com.loga.bebase.entity.AbstractEntity;
import lombok.*;

import javax.persistence.*;
import java.util.Collection;
import java.util.List;

@EqualsAndHashCode(callSuper = false)
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "etat")
public class Etat extends AbstractEntity {


    @Column(name = "libelle")
    private String libelle;

    @OneToMany(mappedBy = "etat")
    private List<Document> documents;

}
