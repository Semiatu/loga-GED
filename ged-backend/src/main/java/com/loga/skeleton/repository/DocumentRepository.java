package com.loga.skeleton.repository;

import com.loga.bebase.repository.AbstractRepository;
import com.loga.skeleton.domain.entity.Document;
import com.loga.skeleton.domain.entity.Dossier;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentRepository extends AbstractRepository<Document, Long> {

    List<Document> findByDossierAndEtatSuppressionIsFalse(Dossier dossier, Pageable pageable);
    List<Document> findByDossierAndEtatSuppressionIsFalse(Dossier dossier);
    List<Document> findByDossier(Dossier dossier);
    List<Document> findByDossierAndEstDansCorbeilleIsFalse(Dossier dossier);
    List<Document> findByDossierIsNullAndEtatSuppressionIsFalse();

    //Recuperer les documents qui sont dans la corbeille
    List<Document> findByEstDansCorbeilleIsTrue();



    @Modifying
    @Query("update Document doc set doc.etatSuppression = true, doc.estDansCorbeille = true where doc.id = :id ")
    int modifierSuppression(@Param("id") long id);

    @Modifying
    @Query("update Document doc set doc.etatSuppression = false , doc.estDansCorbeille = false where doc.id = :id ")
    int restaurer(@Param("id") long id);

    @Modifying
    @Query("update Document doc set doc.etatSuppression = true where doc.id in :ids")
    int listSuppression(@Param("ids") List<Long> ids);


    @Modifying
    @Query("update Document doc set doc.etatSuppression = false where doc.id in :ids")
    int restaurerTout(@Param("ids") List<Long> ids);

    @Modifying
    @Query("delete from Document d where d.id in :ids")
    int supprimerToutDefinitivement(@Param("ids") List<Long> ids);
}

