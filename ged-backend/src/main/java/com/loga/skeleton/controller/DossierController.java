package com.loga.skeleton.controller;

import com.loga.bebase.controller.AbstractController;
import com.loga.skeleton.domain.criteria.DossierSearchCriteria;
import com.loga.skeleton.domain.entity.Dossier;
import com.loga.skeleton.service.DossierService;
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
@RequestMapping("dossier")
public class DossierController extends AbstractController<Dossier,Long, DossierService> {

    public DossierController(DossierService dossierService){super(dossierService);}

    @PutMapping("search")
    public Page<Dossier> search(@RequestBody DossierSearchCriteria criteria, Pageable pageable) {
        AbstractRechercheModel rechercheModel = RechercheSimpleModel
                .of(Dossier.class)
                .addCondition(toCondition(criteria.getSearsh(), getAliasTable(Dossier.class) + ".nom", TypeEgalite.CONTIENT));
                  return page(rechercheModel.getRequete(), pageable, Dossier.class);
    }

}
