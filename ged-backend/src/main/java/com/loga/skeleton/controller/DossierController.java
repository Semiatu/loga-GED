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
import org.springframework.security.core.Authentication;
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
    public ResponseEntity getContent(@PathVariable Long idDossier, Authentication authentication) {
        if (!findAllSupport()) {
            return error();
        }
        return ok(abstractService.getContent(idDossier, authentication).getEntity());
    }

    @GetMapping("get-corbeille-content")
    public ResponseEntity<ContenuDossierWrapper> getCorbeilleContent() {
        return ok(abstractService.getCorbeilleContent().getEntity());
    }

    @GetMapping("get-tree-data/{idDossier}")
    public ResponseEntity<List<TreeDataWrapper>> getTreeData(@PathVariable Long idDossier, Authentication authentication) {
        return ok(abstractService.getTreeData(idDossier, authentication).getEntity());
    }

    @PostMapping("get-dossier-tree-data/{idParent}")
    public ResponseEntity<List<TreeDataWrapper>> getDossierTreeData(@PathVariable Long idParent,@RequestBody List<Long> notIds) {
        return ok(abstractService.getDossierTreeData(idParent, notIds ).getEntity());
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

    @DeleteMapping("delete-dossier/{id}")
    public List<Document> deleteDossier(@PathVariable Long id) { return abstractService.deleteDossier(id); }

    @PutMapping("delete-all")
    public List<Document> deleteAll(@RequestBody ContenuDossierWrapper contenuDossierWrapper) { return abstractService.deleteAll(contenuDossierWrapper); }

    @PostMapping("add-all-in-corbeille")
    public void addAllSelectedInCorbeille(@RequestBody ContenuDossierWrapper contenuDossierWrapper){
        this.abstractService.addAllSelectedInCorbeille(contenuDossierWrapper);
    }

    @PostMapping("restaure-all-selected")
    public void restaureAllSelected(@RequestBody ContenuDossierWrapper contenuDossierWrapper){
        this.abstractService.restaureAllSelected(contenuDossierWrapper);
    }

    @PostMapping("deplace-all-selected")
    public void deplaceAllSelected(@RequestBody ContenuDossierWrapper contenuDossierWrapper){
        this.abstractService.deplaceAllSelected(contenuDossierWrapper);
    }

    @PostMapping("create")
    public ResponseEntity create(@RequestBody Dossier entity, Authentication authentication) {
        return responseExact(abstractService.save(entity,authentication));
    }

}
