package com.loga.skeleton.domain.criteria;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogSearchCriteria {

    private String action;
    private String user;
    private Date begin;
    private Date end;
}
