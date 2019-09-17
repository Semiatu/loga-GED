package com.loga.skeleton.repository;

import com.loga.bebase.repository.AbstractRepository;
import com.loga.skeleton.domain.entity.Authorisation;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AuthorisationRepository extends AbstractRepository<Authorisation, Long> {

    @Query("select authorisation from Authorisation authorisation where authorisation.user.username=:username and authorisation.dossier.id in :ids")
    List<Authorisation> findByUserNameAndIds(@Param("username") String username, @Param("ids") List<Long> ids);

    Optional<Authorisation> findByDossierIdAndUserUsername(Long id, String userName);
    Optional<Authorisation> findByDocumentIdAndUserUsername(Long id, String userName);

    List<Authorisation> findByDocumentDossierIdAndUserUsername(Long idDossier, String userId);
    List<Authorisation> findByDossierDossierParentIdAndUserUsername(Long idDossier, String userId);
    List<Authorisation> findByRaccourciEmplacementIdAndUserUsername(Long idDossier, String userId);


    List<Authorisation> findByUserUsernameAndDossierIsNotNull(String userId);
    List<Authorisation> findByUserUsernameAndDocumentNotNull(String userId);

    List<Authorisation> findByDocumentDossierIsNullAndUserUsername(String userId);
//    List<Authorisation> findByDossierDossierParentIsNullAndUserUsername(Long idDossier, String userId);
    List<Authorisation> findByRaccourciIsNotNullAndRaccourciEmplacementIsNullAndUserUsername(String userId);
}
