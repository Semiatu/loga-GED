package com.loga.skeleton.repository;

import com.loga.bebase.repository.AbstractRepository;
import com.loga.skeleton.domain.entity.Dossier;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DossierRepository  extends AbstractRepository<Dossier, Long> {

    List<Dossier> findByDossierParent(Dossier dossier, Pageable pageable);
    List<Dossier> findByDossierParent(Dossier dossier);
    List<Dossier> findByDossierParentIsNull(Pageable pageable);
    List<Dossier> findByDossierParentIsNull();
}
