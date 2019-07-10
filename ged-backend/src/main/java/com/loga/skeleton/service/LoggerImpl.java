package com.loga.skeleton.service;

import com.loga.as.entity.User;
import com.loga.as.repository.UserRepository;
import com.loga.bebase.log.LogAction;
import com.loga.bebase.log.LogInterface;
import com.loga.bebase.log.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;

import static com.loga.bebase.log.LogUtils.buildLog;

public class LoggerImpl implements LogInterface {

    @Autowired
    private LogRepository logRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void log(LogAction action, String description) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username);
        this.logRepository.save(buildLog(() -> user.getId(), action, description));
    }
}
