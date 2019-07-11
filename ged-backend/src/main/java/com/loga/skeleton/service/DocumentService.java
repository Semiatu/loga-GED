package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.skeleton.domain.entity.Document;
import com.loga.skeleton.repository.DocumentRepository;
import org.springframework.stereotype.Service;


@Service
public class DocumentService extends AbstractLongService<Document, DocumentRepository> {

   public DocumentService(DocumentRepository documentRepository){
       super(documentRepository);
   }
}
