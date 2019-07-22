package com.loga.skeleton.repository;

import com.loga.bebase.repository.AbstractRepository;
import com.loga.skeleton.domain.entity.TypeDocument;

import java.util.List;
import java.util.Optional;

public interface TypeDocumentRepository extends AbstractRepository<TypeDocument, Long> {

    Optional<TypeDocument> findByNom(String nom);
}
