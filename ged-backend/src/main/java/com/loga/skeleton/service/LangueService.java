package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.skeleton.domain.entity.Langue;
import com.loga.skeleton.repository.LangueRepository;
import org.springframework.stereotype.Service;

@Service
public class LangueService extends AbstractLongService<Langue, LangueRepository> {

    public LangueService(LangueRepository langueRepository){
        super(langueRepository);
    }
}
