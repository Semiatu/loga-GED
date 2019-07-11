package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.skeleton.domain.entity.Raccourci;
import com.loga.skeleton.repository.RaccourciRepository;
import org.springframework.stereotype.Service;

@Service
public class RaccourciService extends AbstractLongService<Raccourci, RaccourciRepository> {
    public RaccourciService(RaccourciRepository raccourciRepository){super(raccourciRepository);}
}
