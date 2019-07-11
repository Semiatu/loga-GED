package com.loga.skeleton.controller;

import com.loga.bebase.controller.AbstractController;
import com.loga.skeleton.domain.criteria.DocumentSearchCriteria;
import com.loga.skeleton.domain.entity.Document;
import com.loga.skeleton.service.DocumentService;
import ml.smk.common.util.recherche.AbstractRechercheModel;
import ml.smk.common.util.recherche.RechercheSimpleModel;
import ml.smk.common.util.recherche.TypeEgalite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static ml.smk.common.util.EntitesUtilitaire.getAliasTable;

@RestController
@RequestMapping("document")
public class DocumentController extends AbstractController<Document, Long , DocumentService> {

    public DocumentController(DocumentService documentService){super(documentService);}

    @PutMapping("search")
    public Page<Document> search(@RequestBody DocumentSearchCriteria criteria, Pageable pageable) {
        AbstractRechercheModel rechercheModel = RechercheSimpleModel
                .of(Document.class)
                .addCondition(toCondition(criteria.getSearsh(), getAliasTable(Document.class) + ".nom", TypeEgalite.CONTIENT))
                .addCondition(toCondition(criteria.getSearsh(), getAliasTable(Document.class) + ".dossier", TypeEgalite.CONTIENT));
        return page(rechercheModel.getRequete(), pageable, Document.class);
    }
}
