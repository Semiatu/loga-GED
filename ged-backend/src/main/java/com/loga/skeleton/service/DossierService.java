package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.skeleton.domain.entity.Dossier;
import com.loga.skeleton.repository.DossierRepository;
import org.springframework.stereotype.Service;

@Service
public class DossierService extends AbstractLongService<Dossier, DossierRepository> {

    public DossierService(DossierRepository dossierRepository){
        super(dossierRepository);
    }
}
