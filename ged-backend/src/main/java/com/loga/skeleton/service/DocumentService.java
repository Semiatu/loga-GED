package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.bebase.wrapper.ResponseWrapper;
import com.loga.skeleton.domain.entity.Document;
import com.loga.skeleton.domain.entity.Dossier;
import com.loga.skeleton.domain.entity.Raccourci;
import com.loga.skeleton.repository.DocumentRepository;
import com.loga.skeleton.repository.DossierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
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

    // recuperer le nom du typeDoc
    @Override
    public ResponseWrapper<Document> save(Document document) {
        if (document.getTypeDocument() == null || document.getTypeDocument().getNom() == null)
            return ResponseWrapper.of("erreur de retrouver le type du document!");
        document.setTypeDocument(this.typeDocumentService.getTypeDocumentByNom(document.getTypeDocument()));
        return super.save(document);
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
