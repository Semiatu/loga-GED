package com.loga.skeleton.controller;

import com.loga.bebase.controller.AbstractController;
import com.loga.skeleton.domain.criteria.CategorieSearchCriteria;
import com.loga.skeleton.domain.criteria.RevisionSearchCriteria;
import com.loga.skeleton.domain.entity.Categorie;
import com.loga.skeleton.domain.entity.Revision;
import com.loga.skeleton.service.CategorieService;
import com.loga.skeleton.service.RevisionService;
import ml.smk.common.util.recherche.AbstractRechercheModel;
import ml.smk.common.util.recherche.RechercheSimpleModel;
import ml.smk.common.util.recherche.TypeEgalite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import static ml.smk.common.util.EntitesUtilitaire.getAliasTable;


@RestController
@RequestMapping("revision")
public class RevisionController extends AbstractController<Revision, Long, RevisionService> {

    public RevisionController(RevisionService revisionService) {
        super(revisionService);
    }

    @PutMapping("search")
    public Page<Revision> search(@RequestBody RevisionSearchCriteria criteria, Pageable pageable) {
        AbstractRechercheModel rechercheModel = RechercheSimpleModel
                .of(Revision.class)
                .addCondition(toCondition(criteria.getSearsh(), getAliasTable(Revision.class) + ".nom", TypeEgalite.CONTIENT));
        return page(rechercheModel.getRequete(), pageable, Revision.class);
    }

}
