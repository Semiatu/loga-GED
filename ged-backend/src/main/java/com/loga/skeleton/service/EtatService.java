package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.skeleton.domain.entity.Etat;
import com.loga.skeleton.repository.EtatRepository;
import org.springframework.stereotype.Service;

@Service
public class EtatService extends AbstractLongService<Etat, EtatRepository> {

    public EtatService(EtatRepository etatRepository){super(etatRepository);}
}
