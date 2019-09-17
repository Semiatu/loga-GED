package com.loga.skeleton.controller;

import com.loga.bebase.controller.AbstractController;
import com.loga.skeleton.domain.criteria.LangueSearchCriteria;
import com.loga.skeleton.domain.entity.Langue;
import com.loga.skeleton.service.LangueService;
import ml.smk.common.util.recherche.AbstractRechercheModel;
import ml.smk.common.util.recherche.RechercheSimpleModel;
import ml.smk.common.util.recherche.TypeEgalite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import static ml.smk.common.util.EntitesUtilitaire.getAliasTable;


@RestController
@RequestMapping("langue")
public class LangueController extends AbstractController<Langue, Long, LangueService> {

    public LangueController(LangueService langueService) {
        super(langueService);
    }

    @PutMapping("search")
    public Page<Langue> search(@RequestBody LangueSearchCriteria criteria, Pageable pageable) {
        AbstractRechercheModel rechercheModel = RechercheSimpleModel
                .of(Langue.class)
                .addCondition(toCondition(criteria.getSearsh(), getAliasTable(Langue.class) + ".nom", TypeEgalite.CONTIENT));
        return page(rechercheModel.getRequete(), pageable, Langue.class);
    }

}
