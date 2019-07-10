package com.loga.skeleton.domain.entity;

import com.loga.bebase.entity.AbstractEntity;
import lombok.*;

import javax.persistence.*;

@EqualsAndHashCode(callSuper = false)
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "dummy")
public class Dummy extends AbstractEntity {

    @Column(name = "wording")
    private String wording;

    @Column(name = "description")
    private String description;
    
    @Column(name = "status")
    private Boolean status = true;
    
}
