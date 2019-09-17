package com.loga.skeleton.wrapper;

import com.loga.skeleton.domain.enumeration.Privilege;
import lombok.Data;

@Data
public class SharedWrapper {
    private Long idEntity;
    private Long UserId;
    private Privilege privilege;
}
