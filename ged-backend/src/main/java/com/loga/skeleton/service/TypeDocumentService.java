package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.skeleton.domain.entity.TypeDocument;
import com.loga.skeleton.repository.TypeDocumentRepository;
import org.springframework.stereotype.Service;

@Service
public class TypeDocumentService extends AbstractLongService<TypeDocument, TypeDocumentRepository> {

    public TypeDocumentService(TypeDocumentRepository typeDocumentRepository){super(typeDocumentRepository);}
}
