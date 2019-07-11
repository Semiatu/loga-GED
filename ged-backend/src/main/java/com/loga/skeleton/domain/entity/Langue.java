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
@Table(name = "langue")
public class Langue extends AbstractEntity {


    @Column(name = "nom")
    private String nom;

   @OneToMany(mappedBy = "langue")
    private List<Document> documents;


}
