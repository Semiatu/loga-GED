package com.loga.skeleton.wrapper;

import com.loga.skeleton.domain.entity.Document;
import com.loga.skeleton.domain.entity.Dossier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContenuDossierWrapper {
    List<Document> documents;
    List<Dossier> dossiers;
    Dossier dossier;

    public static ContenuDossierWrapper of( List<Document> documents, List<Dossier> dossiers, Dossier dossier){
        return new ContenuDossierWrapper(documents, dossiers, dossier);
    }
}
