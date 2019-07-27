package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.bebase.wrapper.ResponseWrapper;
import com.loga.skeleton.domain.entity.Raccourci;
import com.loga.skeleton.domain.enumeration.RaccourciType;
import com.loga.skeleton.repository.RaccourciRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RaccourciService extends AbstractLongService<Raccourci, RaccourciRepository> {
    public RaccourciService(RaccourciRepository raccourciRepository){super(raccourciRepository);}

    @Override
    public ResponseWrapper<Raccourci> save(Raccourci entity) {
        if (entity.getEmplacement().getId() == 0) entity.setEmplacement(null);
        return super.save(entity);
    }

    public ResponseWrapper<Raccourci> creerRaccourciPourRacourcisave(Raccourci raccourci, Long id){
        Optional<Raccourci> optionalRaccourci = this.repositoryManager.findById(id);

        if (!optionalRaccourci.isPresent()) return ResponseWrapper.of("Impossible de créer un raccourci pour un raccourci qui n'existe pas");

        if (optionalRaccourci.get().getType().equals(RaccourciType.DOCUMENT)) {
            raccourci.setDocument(optionalRaccourci.get().getDocument());
        } else {
            raccourci.setDossier(optionalRaccourci.get().getDossier());
        }

        return this.save(raccourci);
    }
}
