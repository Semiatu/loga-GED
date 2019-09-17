package com.loga.skeleton.controller;

import com.loga.bebase.controller.AbstractController;
import com.loga.skeleton.domain.entity.Authorisation;
import com.loga.skeleton.service.AuthorisationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("authorisation")
public class AuthorisationController extends AbstractController<Authorisation,Long, AuthorisationService> {
    public AuthorisationController(AuthorisationService abstractService) {
        super(abstractService);
    }

   /* @PostMapping("create")
    public ResponseEntity create(Authorisation entity) {
        return super.create(entity);
    }*/

    @PostMapping("create")
    public ResponseEntity create(@RequestBody Authorisation authorisation) {
        return responseExact(abstractService.save(authorisation));
    }
}
