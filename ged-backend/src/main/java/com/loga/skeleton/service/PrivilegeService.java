package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.skeleton.domain.entity.Privilege;
import com.loga.skeleton.repository.PrivilegeRepository;
import org.springframework.stereotype.Service;

@Service
public class PrivilegeService extends AbstractLongService<Privilege, PrivilegeRepository> {

    public PrivilegeService(PrivilegeRepository privilegeRepository){super(privilegeRepository);}
}
