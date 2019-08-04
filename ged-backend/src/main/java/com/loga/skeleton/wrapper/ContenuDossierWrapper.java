package com.loga.skeleton.wrapper;

import com.loga.skeleton.domain.entity.Document;
import com.loga.skeleton.domain.entity.Dossier;
import com.loga.skeleton.domain.entity.Raccourci;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContenuDossierWrapper {
    List<Document> documents = new ArrayList<>();
    List<Dossier> dossiers  = new ArrayList<>();
    Dossier dossier;
    List<Raccourci> raccourcis  = new ArrayList<>();

    public static ContenuDossierWrapper of( List<Document> documents, List<Dossier> dossiers,List<Raccourci> raccourcis ,Dossier dossier){
        return new ContenuDossierWrapper(documents, dossiers, dossier, raccourcis);
    }
}
