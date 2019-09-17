package com.loga.skeleton.service;

import com.loga.as.entity.User;
import com.loga.as.service.UserService;
import com.loga.bebase.service.AbstractLongService;
import com.loga.bebase.wrapper.ResponseWrapper;
import com.loga.skeleton.domain.entity.Authorisation;
import com.loga.skeleton.domain.entity.Document;
import com.loga.skeleton.domain.entity.Dossier;
import com.loga.skeleton.domain.entity.Raccourci;
import com.loga.skeleton.domain.enumeration.Privilege;
import com.loga.skeleton.repository.DocumentRepository;
import com.loga.skeleton.repository.DossierRepository;
import com.loga.skeleton.wrapper.SharedWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class DocumentService extends AbstractLongService<Document, DocumentRepository> {

    @Autowired
    TypeDocumentService typeDocumentService;
    @Autowired
    DossierRepository dossierRepository;
    @Autowired
    RaccourciService raccourciService;
    @Autowired
    UserService userService;
    @Autowired
    AuthorisationService authorisationService;

    public DocumentService(DocumentRepository documentRepository) {

        super(documentRepository);
    }

    public List<Document> getDocumentByDossier(Long idDossier, Pageable pageable) {
        Optional<Dossier> optionalDossier = dossierRepository.findById(idDossier);
        if (optionalDossier.isPresent()) {
            Dossier dossier = optionalDossier.get();
            return repositoryManager.findByDossierAndEtatSuppressionIsFalse(dossier, pageable);
        } else {
            return new ArrayList<>();
        }
    }

    public ResponseWrapper<Authorisation> partager(SharedWrapper sharedWrapper, Authentication authentication){
        Optional<Document> optionalDocument = this.repositoryManager.findById(sharedWrapper.getIdEntity());

        if (!optionalDocument.isPresent()) return ResponseWrapper.of("Information non trouvée");

        User user = this.userService.findByUsername(authentication.getName());
        Optional<Authorisation> optionalAuthorisation = this.authorisationService.getRepository().findByDocumentIdAndUserUsername(sharedWrapper.getIdEntity(), user.getUsername());

        if (!optionalAuthorisation.isPresent()) return ResponseWrapper.of("Information non trouvée");

        if (optionalAuthorisation.get().getPrivilege() == Privilege.LIRE) return ResponseWrapper.of(" Vous n'avez pas l'autorisaton de partager ce document!");

        Optional<User> optionalUser = this.userService.getRepository().findById(sharedWrapper.getUserId());
        if (!optionalUser.isPresent()) return ResponseWrapper.of("utilisateur non trouvé");

        Authorisation authorisation = new Authorisation();
        authorisation.setDocument(optionalDocument.get());
        authorisation.setUser(optionalUser.get());
        authorisation.setPrivilege(sharedWrapper.getPrivilege());
        return this.authorisationService.save(authorisation);

    }

    // recuperer le nom du typeDoc
    public ResponseWrapper<Document> save(Document document, Authentication authentication) {
        if (document.getTypeDocument() == null || document.getTypeDocument().getNom() == null)
            return ResponseWrapper.of("erreur de retrouver le type du document!");
        if (document.getDossier().getId() == 0L) document.setDossier(null);
        document.setTypeDocument(this.typeDocumentService.getTypeDocumentByNom(document.getTypeDocument()));
        ResponseWrapper<Document> responseWrapper = super.save(document);

        if (responseWrapper.isValid()){
            User user = this.userService.findByUsername(authentication.getName());
            Authorisation authorisation = new Authorisation();
            authorisation.setDocument(responseWrapper.getEntity());
            authorisation.setUser(user);
            authorisation.setPrivilege(Privilege.SUPPRIMER);
            this.authorisationService.save(authorisation);
        }

        return responseWrapper;
    }

    @Transactional
    public void addInCorbeille(Long id) {
        Optional<Document> optionalDocument = this.repositoryManager.findById(id);
        if (optionalDocument.isPresent()) {
            List<Raccourci> raccourciList = this.raccourciService.getRepository().findByDocumentAndEstDansCorbeilleIsFalse(optionalDocument.get());
            List<Long> idRacourcis = raccourciList.stream().map(Raccourci::getId).collect(Collectors.toList());
            if (idRacourcis.size() > 0 ) this.raccourciService.getRepository().listSuppression(idRacourcis);
            repositoryManager.modifierSuppression(id);
        }
    }

    @Transactional
    public boolean restaurer(Long id) {
        Optional<Document> optionalDocument = this.repositoryManager.findById(id);
        if (!optionalDocument.isPresent()) return false;
        List<Raccourci> raccourciList = this.raccourciService.getRepository().findByDocumentAndEstDansCorbeilleIsFalse(optionalDocument.get());
        List<Long> idRacourcis = raccourciList.stream().map(Raccourci::getId).collect(Collectors.toList());
        if (idRacourcis.size() > 0 ) this.raccourciService.getRepository().restaurerTout(idRacourcis);
        repositoryManager.restaurer(id);
        return true;

    }

    @Transactional
    @Override
    public ResponseWrapper<Document> delete(Long aLong) {
        Optional<Document> optionalDocument = this.repositoryManager.findById(aLong);

        if (!optionalDocument.isPresent()) return ResponseWrapper.of("Suppression impossible");
        this.raccourciService.getRepository().deleteAllByDocument(optionalDocument.get());
        return super.delete(aLong);
    }
}
