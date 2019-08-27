package com.loga.skeleton.controller;

import com.loga.bebase.controller.AbstractController;
import com.loga.skeleton.domain.criteria.DocumentSearchCriteria;
import com.loga.skeleton.domain.entity.Document;
import com.loga.skeleton.domain.entity.Dossier;
import com.loga.skeleton.service.DocumentService;
import ml.smk.common.util.recherche.AbstractRechercheModel;
import ml.smk.common.util.recherche.RechercheSimpleModel;
import ml.smk.common.util.recherche.TypeEgalite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static ml.smk.common.util.EntitesUtilitaire.getAliasTable;

@RestController
@RequestMapping("document")
public class DocumentController extends AbstractController<Document, Long , DocumentService> {

    public DocumentController(DocumentService documentService){super(documentService);}

    @PutMapping("search")
    public Page<Document> search(@RequestBody DocumentSearchCriteria criteria, Pageable pageable) {
        AbstractRechercheModel rechercheModel = RechercheSimpleModel
                .of(Document.class)
                .addCondition(toCondition(criteria.getSearsh(), getAliasTable(Document.class) + ".nom", TypeEgalite.CONTIENT));
                return page(rechercheModel.getRequete(), pageable, Document.class);
    }
    @GetMapping("dossier/{dossierId}")
    public List<Document> getDoument(@PathVariable Long dossierId, Pageable pageable){
        return abstractService.getDocumentByDossier(dossierId, pageable);
    }

    @PutMapping("add-corbeille/{id}")
    public void addInCorbeille(@PathVariable Long id) {
        abstractService.addInCorbeille(id);
    }

    @PutMapping("restaurer/{id}")
    public void restaurer(@PathVariable Long id){
        abstractService.restaurer(id);
    }

    @PostMapping("create")
    public ResponseEntity create(@RequestBody Document entity, Authentication authentication) {
        return responseExact(abstractService.save(entity,authentication));
    }
}
