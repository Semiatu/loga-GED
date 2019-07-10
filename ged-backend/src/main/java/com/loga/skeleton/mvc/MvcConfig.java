/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.loga.skeleton.mvc;

import java.io.File;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 *
 * @author gerardus
 */
@Configuration
@EnableWebMvc
public class MvcConfig extends WebMvcConfigurerAdapter {
    
    @Value("${file.directory}")
    private String fileDirectory;
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
          .addResourceHandler("/images/**")
//          .addResourceLocations(new File("/Users/gerardus/Gerard/Loga Engineering/Projets/Loga Business Platform/Files").toURI().toString()); 
          .addResourceLocations(new File(fileDirectory).toURI().toString()); 
    }
}