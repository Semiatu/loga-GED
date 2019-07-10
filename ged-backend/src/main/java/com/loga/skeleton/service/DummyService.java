package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.skeleton.domain.entity.Dummy;
import org.springframework.stereotype.Service;
import com.loga.skeleton.repository.DummyRepository;

@Service
public class DummyService extends AbstractLongService<Dummy, DummyRepository> {

    public DummyService(DummyRepository entityRepository) {
        super(entityRepository);
    }
}
