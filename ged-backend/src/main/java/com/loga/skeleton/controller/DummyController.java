package com.loga.skeleton.controller;

import com.loga.bebase.controller.AbstractController;
import ml.smk.common.util.recherche.AbstractRechercheModel;
import ml.smk.common.util.recherche.RechercheSimpleModel;
import ml.smk.common.util.recherche.TypeEgalite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import com.loga.skeleton.domain.criteria.DummySearchCriteria;
import com.loga.skeleton.domain.entity.Dummy;
import com.loga.skeleton.service.DummyService;
import static ml.smk.common.util.EntitesUtilitaire.getAliasTable;


@RestController
@RequestMapping("dummies")
public class DummyController extends AbstractController<Dummy, Long, DummyService> {

    public DummyController(DummyService dummyService) {
        super(dummyService);
    }

    @PutMapping("search")
    public Page<Dummy> search(@RequestBody DummySearchCriteria criteria, Pageable pageable) {
        AbstractRechercheModel rechercheModel = RechercheSimpleModel
                .of(Dummy.class)
                .addCondition(toCondition(criteria.getWording(), getAliasTable(Dummy.class) + ".wording", TypeEgalite.CONTIENT));
        return page(rechercheModel.getRequete(), pageable, Dummy.class);
    }

}
