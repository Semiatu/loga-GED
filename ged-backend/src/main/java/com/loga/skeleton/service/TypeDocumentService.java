package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.skeleton.domain.entity.TypeDocument;
import com.loga.skeleton.repository.TypeDocumentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TypeDocumentService extends AbstractLongService<TypeDocument, TypeDocumentRepository> {

    public TypeDocumentService(TypeDocumentRepository typeDocumentRepository){
        super(typeDocumentRepository);
    }

    // typeDocument en fonction du nom
    public TypeDocument getTypeDocumentByNom(TypeDocument typeDoc) {
        Optional<TypeDocument> optionalTypeDocument = repositoryManager.findByNom(typeDoc.getNom());
        if (optionalTypeDocument.isPresent()) {
            return optionalTypeDocument.get();
        } else {
            return repositoryManager.save(typeDoc);
        }
    }
}
