package com.loga.skeleton.controller;

import com.loga.bebase.controller.AbstractController;
import com.loga.skeleton.wrapper.TreeDataWrapper;
import ml.smk.common.util.recherche.AbstractRechercheModel;
import ml.smk.common.util.recherche.RechercheSimpleModel;
import ml.smk.common.util.recherche.TypeEgalite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.loga.skeleton.domain.criteria.RaccourciSearchCriteria;
import com.loga.skeleton.domain.entity.Raccourci;
import com.loga.skeleton.service.RaccourciService;

import static ml.smk.common.util.EntitesUtilitaire.getAliasTable;

@RestController
@RequestMapping("raccourcis")
public class RaccourciController extends AbstractController<Raccourci, Long, RaccourciService> {

    public RaccourciController(RaccourciService dummyService) {
        super(dummyService);
    }

    @PutMapping("search")
    public Page<Raccourci> search(@RequestBody RaccourciSearchCriteria criteria, Pageable pageable) {
        AbstractRechercheModel rechercheModel = RechercheSimpleModel
                .of(Raccourci.class)
                .addCondition(toCondition(criteria.getSearsh(), getAliasTable(Raccourci.class) + ".nom", TypeEgalite.CONTIENT));
        return page(rechercheModel.getRequete(), pageable, Raccourci.class);
    }

    @PostMapping("cree-raccourci-de-raccourci/{id}")
    public ResponseEntity creerRaccourciPourRacourcisave(@RequestBody Raccourci raccourci, @PathVariable Long id) {
        return responseExact(abstractService.creerRaccourciPourRacourcisave(raccourci, id));
    }

    @PutMapping("add-corbeille/{id}")
    public void addInCorbeille(@PathVariable Long id) {
        abstractService.addInCorbeille(id);
    }

    @PutMapping("restaurer/{id}")
    public void restaurer(@PathVariable Long id, Authentication authentication) {
        System.out.println("authentication = " + authentication.getName());
        abstractService.restaurer(id);
    }

}
