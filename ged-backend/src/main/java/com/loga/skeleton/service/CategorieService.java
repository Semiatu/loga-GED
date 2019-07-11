package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.skeleton.domain.entity.Categorie;
import com.loga.skeleton.repository.CategorieRepository;
import org.springframework.stereotype.Service;

@Service
public class CategorieService extends AbstractLongService<Categorie, CategorieRepository> {

    public CategorieService(CategorieRepository categorieRepository){super(categorieRepository);}
}
