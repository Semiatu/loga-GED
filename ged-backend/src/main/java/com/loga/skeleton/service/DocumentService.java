package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.skeleton.domain.entity.Document;
import com.loga.skeleton.domain.entity.Dossier;
import com.loga.skeleton.repository.DocumentRepository;
import com.loga.skeleton.repository.DossierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class DocumentService extends AbstractLongService<Document, DocumentRepository> {

    @Autowired
    private DossierRepository dossierRepository;

    public DocumentService(DocumentRepository documentRepository) {

        super(documentRepository);
    }

    public List<Document> getDocumentByDossier(Long idDossier, Pageable pageable){
        Optional<Dossier> optionalDossier = this.dossierRepository.findById(idDossier);

        if (optionalDossier.isPresent()) {
            Dossier dossier = optionalDossier.get();
            return this.repositoryManager.findByDossier(dossier, pageable);
        } else {
            return new ArrayList<>();
        }

    }

}