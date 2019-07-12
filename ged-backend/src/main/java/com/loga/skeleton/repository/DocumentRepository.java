package com.loga.skeleton.repository;

import com.loga.bebase.repository.AbstractRepository;
import com.loga.skeleton.domain.entity.Document;
import com.loga.skeleton.domain.entity.Dossier;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DocumentRepository extends AbstractRepository<Document, Long> {

    List<Document> findByDossier (Dossier dossier, Pageable pageable);
}
