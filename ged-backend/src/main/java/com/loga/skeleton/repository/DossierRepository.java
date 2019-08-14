package com.loga.skeleton.repository;

import com.loga.bebase.repository.AbstractRepository;
import com.loga.skeleton.domain.entity.Dossier;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DossierRepository  extends AbstractRepository<Dossier, Long> {

    List<Dossier> findByDossierParentAndEtatSuppressionIsFalse(Dossier dossier, Pageable pageable);
    List<Dossier> findByDossierParentAndEtatSuppressionIsFalse(Dossier dossier);
    List<Dossier> findByDossierParent(Dossier dossier);
    List<Dossier> findByDossierParentAndEstDansCorbeilleIsFalse(Dossier dossier);
    List<Dossier> findByDossierParentIsNullAndEtatSuppressionIsFalse(Pageable pageable);
    List<Dossier> findByDossierParentIsNullAndEtatSuppressionIsFalse();

    //Recuperer les dossiers qui sont dans la corbeille
    List<Dossier> findByEstDansCorbeilleIsTrue();


    @Query("select dossier from Dossier dossier where dossier.dossierParent =: idParent and dossier.id not in : ids")
    List<Dossier> findByDossierParentAndIdNotIn(@Param("idParent") long idParent, @Param("ids") List<Long> ids);


    @Modifying
    @Query("update Dossier dossier set dossier.etatSuppression = true, dossier.estDansCorbeille = true where dossier.id = :id ")
    int modifierEtatSuppression(@Param("id") long id);

    @Modifying
    @Query("update Dossier dossier set dossier.etatSuppression = false , dossier.estDansCorbeille = false where dossier.id = :id ")
    int restaurer(@Param("id") long id);

    @Modifying
    @Query("update Dossier dossier set dossier.etatSuppression = true where dossier.id in :ids")
    int listSuppression(@Param("ids") List<Long> ids);

    @Modifying
    @Query("update Dossier dossier set dossier.etatSuppression = false where dossier.id in :ids")
    int restaurerTout(@Param("ids") List<Long> ids);

    @Modifying
    @Query("delete from Dossier dossier where dossier.id in :ids")
    int supprimerToutDefinitivement(@Param("ids") List<Long> ids);

}
