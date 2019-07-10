package com.loga.skeleton;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * @author Ibrahim Maiga <maiga.ibrm@gmail.com>
 */
@Component
public class Runner implements CommandLineRunner {

    @Autowired
    private DefaultUserCreator defaultUserCreator;

    @Override
    public void run(String... args) throws Exception {
        defaultUserCreator.create();
    }

}
