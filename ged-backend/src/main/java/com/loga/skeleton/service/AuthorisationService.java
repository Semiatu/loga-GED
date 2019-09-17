package com.loga.skeleton.service;

import com.loga.as.entity.User;
import com.loga.as.service.UserService;
import com.loga.bebase.service.AbstractLongService;
import com.loga.bebase.wrapper.ResponseWrapper;
import com.loga.skeleton.domain.entity.Authorisation;
import com.loga.skeleton.domain.enumeration.Privilege;
import com.loga.skeleton.repository.AuthorisationRepository;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Objects;

import static java.util.Objects.nonNull;

@Service
public class AuthorisationService extends AbstractLongService<Authorisation, AuthorisationRepository> {

    @Autowired
    UserService userService;
    @Autowired
    DossierService dossierService;
    @Autowired
    DocumentService documentService;

    public AuthorisationService(AuthorisationRepository repositoryManager) {
        super(repositoryManager);
    }

    @Autowired
    private JavaMailSender javaMailSender;

    String lecture = "lecture";
    String modification = "modification";

    private String getDroit(Authorisation authorisation) {
        if (authorisation.getPrivilege() == Privilege.SUPPRIMER) return "suppression";
        if (authorisation.getPrivilege() == Privilege.MODIFIER) return "modification";
        if (authorisation.getPrivilege() == Privilege.TELECHARGER) return "télechargement";
        return "lecture";
    }

    private boolean isDocument(Authorisation authorisation) {
        return nonNull(authorisation.getDocument());
    }

    private boolean isDossier(Authorisation authorisation) {
        return nonNull(authorisation.getDossier());
    }

    private boolean isRaccourci(Authorisation authorisation) {
        return nonNull(authorisation.getRaccourci());
    }

    private String getFileName(Authorisation authorisation) {
        if (this.isDocument(authorisation)) return authorisation.getDocument().getNom();
        if (this.isDossier(authorisation)) return authorisation.getDossier().getNom();
        return authorisation.getRaccourci().getNom();
    }

    private boolean isValidEmail(String email) {
        String regex = "^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$";
        return email.matches(regex);
    }


    public void sendEmail(Authentication authentication, Authorisation authorisation) {

        User user = this.userService.findByUsername(authentication.getName());
        User recepteurUser = this.userService.findByUsername(authorisation.getUser().getUsername());

        if (nonNull(recepteurUser.getEmail()) && isValidEmail(recepteurUser.getEmail())) {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(recepteurUser.getEmail());
            msg.setSubject(this.getFileName(authorisation) + " - Partager avec droit de " + this.getDroit(authorisation));
            msg.setText(user + " vous donne accès au document suivant  avec droit de " + this.getDroit(authorisation));
            javaMailSender.send(msg);
        }
    }

    public ResponseWrapper<Authorisation> save(Authorisation authorisation, Authentication authentication) {
       /* ResponseWrapper<Authorisation> authorisationResponseWrapper = super.save(authorisation);
        if (!authorisationResponseWrapper.isValid()) return authorisationResponseWrapper;

        User user = this.userService.findByUsername(authentication.getName());*/

        this.sendEmail(authentication, authorisation);
        return ResponseWrapper.of(new Authorisation());
    }
}
