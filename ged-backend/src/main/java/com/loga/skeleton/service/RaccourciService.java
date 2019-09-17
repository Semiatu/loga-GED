package com.loga.skeleton.service;

import com.loga.as.entity.User;
import com.loga.as.service.UserService;
import com.loga.bebase.service.AbstractLongService;
import com.loga.bebase.wrapper.ResponseWrapper;
import com.loga.skeleton.domain.entity.Authorisation;
import com.loga.skeleton.domain.entity.Document;
import com.loga.skeleton.domain.entity.Raccourci;
import com.loga.skeleton.domain.enumeration.Privilege;
import com.loga.skeleton.domain.enumeration.RaccourciType;
import com.loga.skeleton.repository.RaccourciRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;
import java.util.Optional;

import static java.util.Objects.isNull;

@Service
public class RaccourciService extends AbstractLongService<Raccourci, RaccourciRepository> {
    public RaccourciService(RaccourciRepository raccourciRepository){super(raccourciRepository);}

    @Autowired
    UserService userService;

    @Autowired
    AuthorisationService authorisationService;
    @Override
    public ResponseWrapper<Raccourci> save(Raccourci entity) {
        if (entity.getEmplacement().getId() == 0) entity.setEmplacement(null);
        return super.save(entity);
    }

    public ResponseWrapper<Raccourci> save(Raccourci entity, Authentication authentication) {
        if (isNull(entity.getEmplacement()) || entity.getEmplacement().getId() == 0) entity.setEmplacement(null);

        ResponseWrapper<Raccourci> responseWrapper = super.save(entity);

        if (responseWrapper.isValid()) {
            User user = this.userService.findByUsername(authentication.getName());
            Authorisation authorisation = new Authorisation();
            authorisation.setRaccourci(responseWrapper.getEntity());
            authorisation.setUser(user);
            authorisation.setPrivilege(Privilege.SUPPRIMER);
            this.authorisationService.save(authorisation);
        }

        return responseWrapper;
    }

    public ResponseWrapper<Raccourci> creerRaccourciPourRacourcisave(Raccourci raccourci, Long id){
        Optional<Raccourci> optionalRaccourci = this.repositoryManager.findById(id);

        if (!optionalRaccourci.isPresent()) return ResponseWrapper.of("Impossible de créer un raccourci pour un raccourci qui n'existe pas");

        if (optionalRaccourci.get().getType().equals(RaccourciType.DOCUMENT)) {
            raccourci.setDocument(optionalRaccourci.get().getDocument());
        } else {
            raccourci.setDossier(optionalRaccourci.get().getDossier());
        }
        return this.save(raccourci);
    }

    @Transactional
    public void addInCorbeille(Long id) {
        repositoryManager.modifierSuppression(id);
    }

    @Transactional
    public void restaurer(Long id) {
        repositoryManager.restaurer(id);
    }

}
