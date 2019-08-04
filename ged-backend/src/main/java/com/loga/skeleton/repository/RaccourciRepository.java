package com.loga.skeleton.repository;

import com.loga.bebase.repository.AbstractRepository;
import com.loga.skeleton.domain.entity.Document;
import com.loga.skeleton.domain.entity.Dossier;
import com.loga.skeleton.domain.entity.Raccourci;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RaccourciRepository extends AbstractRepository<Raccourci,Long> {

    List<Raccourci> findByEmplacementAndEtatSuppressionIsFalse(Dossier dossier);
    List<Raccourci> findByEmplacement(Dossier dossier);
    List<Raccourci> findByDossier(Dossier dossier);
    List<Raccourci> findByEmplacementAndEstDansCorbeilleIsFalse(Dossier dossier);
    List<Raccourci> findByEmplacementIsNullAndEtatSuppressionIsFalse();
    List<Raccourci> findByDossierAndEtatSuppressionIsFalse(Dossier dossier);
    List<Raccourci> findByDossierAndEstDansCorbeilleIsFalse(Dossier dossier);
    List<Raccourci> findByDocumentAndEtatSuppressionIsFalse(Document document);
    List<Raccourci> findByDocumentAndEstDansCorbeilleIsFalse(Document document);
    List<Raccourci> findByDocument(Document document);

    //Recuperer les raccourcis qui sont dans la corbeille
    List<Raccourci> findByEstDansCorbeilleIsTrue();


    @Modifying
    @Query("update Raccourci raccourci set raccourci.etatSuppression = true, raccourci.estDansCorbeille = true where raccourci.id = :id ")
    int modifierSuppression(@Param("id") long id);

     @Modifying
    @Query("update Raccourci raccourci set raccourci.etatSuppression = false , raccourci.estDansCorbeille = false where raccourci.id = :id ")
    int restaurer(@Param("id") long id);


    @Modifying
    @Query("update  Raccourci  raccourci set raccourci.etatSuppression = true where  raccourci.id in :ids")
    int listSuppression(@Param("ids") List<Long> ids);

    @Modifying
    @Query("update  Raccourci  raccourci set raccourci.etatSuppression = false where  raccourci.id in :ids")
    int restaurerTout(@Param("ids") List<Long> ids);

    @Modifying
    @Query("delete from Raccourci r where r.id in :ids")
    int supprimerToutDefinitivement(@Param("ids") List<Long> ids);

    int deleteAllByDocument(Document document);
    int deleteAllByDossier(Dossier dossier);
    int deleteAllByEmplacement(Dossier dossier);

}
