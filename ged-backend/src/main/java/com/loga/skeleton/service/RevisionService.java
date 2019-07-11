package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.skeleton.domain.entity.Revision;
import com.loga.skeleton.repository.RevisionRepository;
import org.springframework.stereotype.Service;

@Service
public class RevisionService extends AbstractLongService<Revision, RevisionRepository> {

    public RevisionService(RevisionRepository revisionRepository){super(revisionRepository);}
}
