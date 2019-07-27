package com.loga.skeleton.repository;

import com.loga.bebase.repository.AbstractRepository;
import com.loga.skeleton.domain.entity.Dossier;
import com.loga.skeleton.domain.entity.Raccourci;

import java.util.List;

public interface RaccourciRepository extends AbstractRepository<Raccourci,Long> {

    List<Raccourci> findByEmplacement(Dossier dossier);
    List<Raccourci> findByEmplacementIsNull();


}
