package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.bebase.wrapper.ResponseWrapper;
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
   TypeDocumentService typeDocumentService;
   @Autowired
   DossierRepository dossierRepository;

    public DocumentService(DocumentRepository documentRepository) {

        super(documentRepository);
    }
    public List<Document> getDocumentByDossier(Long idDossier, Pageable pageable){
        Optional<Dossier> optionalDossier = dossierRepository.findById(idDossier);
        if (optionalDossier.isPresent()){
            Dossier dossier = optionalDossier.get();
            return repositoryManager.findByDossier(dossier, pageable);
        }else{
            return  new ArrayList<>();
        }
    }

    // recuperer le nom du typeDoc si existe sinon creer
    @Override
    public ResponseWrapper<Document> save(Document document) {
        if (document.getTypeDocument()== null || document.getTypeDocument().getNom() == null)
            return ResponseWrapper.of("erreurrrrrrrrrrrrrrrrrrrrrr!");
        document.setTypeDocument(this.typeDocumentService.getTypeDocumentByNom(document.getTypeDocument()));
        return super.save(document);
    }
}
