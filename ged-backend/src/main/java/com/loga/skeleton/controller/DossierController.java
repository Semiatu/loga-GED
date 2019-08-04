package com.loga.skeleton.controller;

import com.loga.bebase.controller.AbstractController;
import com.loga.skeleton.domain.criteria.DossierSearchCriteria;
import com.loga.skeleton.domain.entity.Document;
import com.loga.skeleton.domain.entity.Dossier;
import com.loga.skeleton.service.DossierService;
import com.loga.skeleton.wrapper.ContenuDossierWrapper;
import com.loga.skeleton.wrapper.TreeDataWrapper;
import ml.smk.common.util.recherche.AbstractRechercheModel;
import ml.smk.common.util.recherche.RechercheSimpleModel;
import ml.smk.common.util.recherche.TypeEgalite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static ml.smk.common.util.EntitesUtilitaire.getAliasTable;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("dossier")
public class DossierController extends AbstractController<Dossier, Long, DossierService> {

    public DossierController(DossierService dossierService) {
        super(dossierService);
    }

    @PutMapping("search")
    public Page<Dossier> search(@RequestBody DossierSearchCriteria criteria, Pageable pageable) {
        AbstractRechercheModel rechercheModel = RechercheSimpleModel
                .of(Dossier.class)
                .addCondition(toCondition(criteria.getSearsh(), getAliasTable(Dossier.class) + "nom", TypeEgalite.CONTIENT));
        return page(rechercheModel.getRequete(), pageable, Dossier.class);
    }

    @GetMapping("/parent/{idDossier}")
    public List<Dossier> findListDossier(@PathVariable Long idDossier, Pageable pageable) {
        if (idDossier == 0L) return this.abstractService.findByDossierParentIsNull(pageable);
        return this.abstractService.getDossierByParent(idDossier, pageable);
    }

    @GetMapping("get-content/{idDossier}")
    public ResponseEntity<ContenuDossierWrapper> getContent(@PathVariable Long idDossier) {
        if (!findAllSupport()) {
            return error();
        }
        return ok(abstractService.getContent(idDossier).getEntity());
    }

    @GetMapping("get-corbeille-content")
    public ResponseEntity<ContenuDossierWrapper> getCorbeilleContent() {
        if (!findAllSupport()) {
            return error();
        }
        return ok(abstractService.getCorbeilleContent().getEntity());
    }

    @GetMapping("get-tree-data/{idDossier}")
    public ResponseEntity<List<TreeDataWrapper>> getTreeData(@PathVariable Long idDossier) {
        return ok(abstractService.getTreeData(idDossier).getEntity());
    }

    @GetMapping("get-dossier-tree-data/{idDossier}")
    public ResponseEntity<List<TreeDataWrapper>> getDossierTreeData(@PathVariable Long idDossier) {
        return ok(abstractService.getDossierTreeData(idDossier).getEntity());
    }

    @GetMapping("check/{idDossier}")
    public void checkDelete(@PathVariable Long idDossier) {
        abstractService.checkDelete(idDossier);
    }

    @PutMapping("add-corbeille/{id}")
    public void addInCorbeille(@PathVariable Long id) {
        abstractService.addInCorbeille(id);
    }

    @PutMapping("restaurer/{id}")
    public void restaurer(@PathVariable Long id) {
        abstractService.restaurer(id);
    }

    @DeleteMapping("delete-all/{id}")
    public List<Document> deleteAll(@PathVariable Long id) {
        return abstractService.deleteAll(id);
    }

}
