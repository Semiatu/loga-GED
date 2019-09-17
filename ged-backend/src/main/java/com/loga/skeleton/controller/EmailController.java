/*
package com.loga.skeleton.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Controller;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class EmailController {

    @Autowired
    public JavaMailSender envoieMail;

    @RequestMapping("/sendSimpleEmail")

    public void sendSimpleMessage(String to, String subject, String text) {
        System.out.println("envoie du message.....");
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        envoieMail.send(message);
        System.out.println("Email envoyer !");
    }
}
*/
