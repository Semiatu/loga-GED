package com.loga.skeleton;

import com.loga.bebase.log.LogInterface;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import ml.smk.common.util.Config;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import com.loga.skeleton.service.LoggerImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;

import static java.util.Optional.ofNullable;


@EnableScheduling
@EnableJpaAuditing
@SpringBootApplication
@EntityScan(basePackages = {"com.loga"})
@ComponentScan(basePackages = {"com.loga"})
@EnableJpaRepositories(basePackages = {"com.loga"})
public class LogaSkeletonApplication {

    public static void main(String[] args) {
        Config.context = SpringApplication.run(LogaSkeletonApplication.class, args);
    }

    @Bean
    public AuditorAware auditorAware() {
        return () -> ofNullable(SecurityContextHolder.getContext())
                .map(SecurityContext::getAuthentication)
                .map(Authentication::getName);
    }

    @Bean
    public LogInterface getLogInterface() {
        return new LoggerImpl();
    }
    
}
