package com.loga.skeleton.controller;

import com.loga.bebase.controller.AbstractController;
import com.loga.skeleton.domain.criteria.CategorieSearchCriteria;
import com.loga.skeleton.domain.entity.Categorie;
import com.loga.skeleton.service.CategorieService;
import ml.smk.common.util.recherche.AbstractRechercheModel;
import ml.smk.common.util.recherche.RechercheSimpleModel;
import ml.smk.common.util.recherche.TypeEgalite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import static ml.smk.common.util.EntitesUtilitaire.getAliasTable;


@RestController
@RequestMapping("categorie")
public class CategorieController extends AbstractController<Categorie, Long, CategorieService> {

    public CategorieController(CategorieService categorieService) {
        super(categorieService);
    }

    @PutMapping("search")
    public Page<Categorie> search(@RequestBody CategorieSearchCriteria criteria, Pageable pageable) {
        AbstractRechercheModel rechercheModel = RechercheSimpleModel
                .of(Categorie.class)
                .addCondition(toCondition(criteria.getSearsh(), getAliasTable(Categorie.class) + ".nom", TypeEgalite.CONTIENT));
        return page(rechercheModel.getRequete(), pageable, Categorie.class);
    }

}
