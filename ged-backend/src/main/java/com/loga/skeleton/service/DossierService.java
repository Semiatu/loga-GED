package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.bebase.wrapper.ResponseWrapper;
import com.loga.skeleton.domain.entity.Document;
import com.loga.skeleton.domain.entity.Dossier;
import com.loga.skeleton.domain.entity.Raccourci;
import com.loga.skeleton.domain.enumeration.RaccourciType;
import com.loga.skeleton.repository.DossierRepository;
import com.loga.skeleton.wrapper.ContenuDossierWrapper;
import com.loga.skeleton.wrapper.TreeDataWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;

@Service
public class DossierService extends AbstractLongService<Dossier, DossierRepository> {

    @Autowired
    DocumentService documentService;
    @Autowired
    RaccourciService raccourciService;

    private List<Long> idDossiers = new ArrayList<>();
    private List<Long> idRacourcis = new ArrayList<>();
    private List<Long> idDocuments = new ArrayList<>();
    private List<Raccourci> raccourcis = new ArrayList<>();
    private List<Document> documentList = new ArrayList<>();
    private List<Dossier> dossierList = new ArrayList<>();
    private List<Raccourci> raccourciList = new ArrayList<>();

    public DossierService(DossierRepository dossierRepository) {

        super(dossierRepository);
    }


    public List<Dossier> getDossierByParent(Long dossierParent, Pageable pageable) {
        Optional<Dossier> dossierOptional = this.repositoryManager.findById(dossierParent);
        if (dossierOptional.isPresent()) {
            Dossier dossier = dossierOptional.get();
            return repositoryManager.findByDossierParentAndEtatSuppressionIsFalse(dossier, pageable);
        } else {
            return new ArrayList();
        }
    }

    @Override
    public ResponseWrapper<Dossier> save(Dossier entity) {
        if (entity.getDossierParent().getId() == 0) entity.setDossierParent(null);
        return super.save(entity);
    }

    @Override
    public ResponseWrapper<Dossier> update(Long id, Dossier entity) {
        if (entity.getDossierParent().getId() == 0) entity.setDossierParent(null);
        return super.update(id, entity);
    }

    public List<Dossier> findByDossierParentIsNull(Pageable pageable) {
        return this.repositoryManager.findByDossierParentIsNullAndEtatSuppressionIsFalse(pageable);
    }


    public ResponseWrapper<ContenuDossierWrapper> getContent(Long idDossier) {
        if (idDossier == 0)
            return
                    ResponseWrapper.
                            of(ContenuDossierWrapper
                                    .of(
                                            this.documentService.getRepository().findByDossierIsNullAndEtatSuppressionIsFalse(),
                                            this.repositoryManager.findByDossierParentIsNullAndEtatSuppressionIsFalse(),
                                            this.raccourciService.getRepository().findByEmplacementIsNullAndEtatSuppressionIsFalse(),
                                            null
                                    )
                            );
        Optional<Dossier> optionalDossier = this.repositoryManager.findById(idDossier);
        if (!optionalDossier.isPresent()) return ResponseWrapper.of("Impossible de trouver ce element");
        return ResponseWrapper
                .of(ContenuDossierWrapper
                        .of(
                                this.documentService.getRepository().findByDossierAndEtatSuppressionIsFalse(optionalDossier.get()),
                                this.repositoryManager.findByDossierParentAndEtatSuppressionIsFalse(optionalDossier.get()),
                                this.raccourciService.getRepository().findByEmplacementAndEtatSuppressionIsFalse(optionalDossier.get()),
                                optionalDossier.get()
                        )
                );

    }


    public ResponseWrapper<List<TreeDataWrapper>> getTreeData(Long idDossier) {
        List<TreeDataWrapper> dataWrapperList = new ArrayList<>();

        ResponseWrapper<ContenuDossierWrapper> contenuDossierWrapper = this.getContent(idDossier);
        if (contenuDossierWrapper.getEntity() == null) return ResponseWrapper.of(contenuDossierWrapper.getMessage());

        contenuDossierWrapper.getEntity().getDossiers()
                .stream()
                .map(TreeDataWrapper::mapDossier)
                .map(this::setLeaf)
                .peek(treeDataWrapper -> dataWrapperList.add(treeDataWrapper))
                .count();

        contenuDossierWrapper.getEntity().getDocuments()
                .stream()
                .map(TreeDataWrapper::mapDocument)
                .peek(treeDataWrapper -> dataWrapperList.add(treeDataWrapper))
                .count();

        contenuDossierWrapper.getEntity().getRaccourcis()
                .stream()
                .map(TreeDataWrapper::mapRacourci)
                .peek(treeDataWrapper -> dataWrapperList.add(treeDataWrapper))
                .count();
        return ResponseWrapper.of(dataWrapperList);
    }

    public TreeDataWrapper setLeaf(TreeDataWrapper treeDataWrapper) {
        Dossier dossier = this.repositoryManager.getOne(Long.valueOf(treeDataWrapper.getData()));
        List<Dossier> dossiers = this.getRepository().findByDossierParentAndEtatSuppressionIsFalse(dossier);

        if (dossier != null || dossiers.size() == 0) treeDataWrapper.setLeaf(true);
        if (dossiers.size() != 0) treeDataWrapper.setLeaf(false);
        return treeDataWrapper;
    }


    public ResponseWrapper<List<TreeDataWrapper>> getDossierTreeData(Long idDossier) {
        List<TreeDataWrapper> dataWrapperList = new ArrayList<>();

        ResponseWrapper<ContenuDossierWrapper> contenuDossierWrapper = this.getContent(idDossier);
        if (contenuDossierWrapper.getEntity() == null) return ResponseWrapper.of(contenuDossierWrapper.getMessage());

        contenuDossierWrapper.getEntity().getDossiers()
                .stream()
                .map(TreeDataWrapper::mapDossier)
                .map(this::setLeaf)
                .peek(treeDataWrapper -> dataWrapperList.add(treeDataWrapper))
                .count();

        return ResponseWrapper.of(dataWrapperList);

    }

    public void checkDelete(Long idDossier) {

        this.idRacourcis.clear();
        this.idDocuments.clear();
        this.idDossiers.clear();

        Optional<Dossier> optionalDossier = this.repositoryManager.findById(idDossier);

        List<Document> documentList = this.documentService.getRepository().findByDossierAndEtatSuppressionIsFalse(optionalDossier.get());
        this.checkDocumentRaccourci(documentList);
        documentList.forEach(document -> idDocuments.add(document.getId()));
        List<Raccourci> raccourciListContenus = this.raccourciService.getRepository().findByEmplacementAndEtatSuppressionIsFalse(optionalDossier.get());
        raccourciListContenus.forEach(raccourci -> idRacourcis.add(raccourci.getId()));
        List<Raccourci> raccourciList = this.raccourciService.getRepository().findByDossierAndEtatSuppressionIsFalse(optionalDossier.get());
        raccourciList.forEach(raccourci -> idRacourcis.add(raccourci.getId()));
        List<Dossier> dossiers = this.getRepository().findByDossierParent(optionalDossier.get());
        dossiers.forEach(dossier1 -> idDossiers.add(dossier1.getId()));
        if (nonNull(dossiers) && dossiers.size() > 0) {
            this.getIds(dossiers);
        }
        System.out.println("idRacourcis = " + idRacourcis);
        System.out.println("idDocuments = " + idDocuments);
        System.out.println("idDossiers = " + idDossiers);
    }

    public void getIds(List<Dossier> dossiers) {
        for (Dossier dossier : dossiers) {
            List<Dossier> dossierList = this.getRepository().findByDossierParent(dossier);
            dossierList.forEach(dossier1 -> idDossiers.add(dossier1.getId()));
            List<Document> documentList = this.documentService.getRepository().findByDossierAndEtatSuppressionIsFalse(dossier);
            this.checkDocumentRaccourci(documentList);
            documentList.forEach(document -> idDocuments.add(document.getId()));
            List<Raccourci> raccourciListContenus = this.raccourciService.getRepository().findByEmplacementAndEtatSuppressionIsFalse(dossier);
            raccourciListContenus.forEach(raccourci -> idRacourcis.add(raccourci.getId()));
            List<Raccourci> raccourciList = this.raccourciService.getRepository().findByDossierAndEtatSuppressionIsFalse(dossier);
            raccourciList.forEach(raccourci -> idRacourcis.add(raccourci.getId()));

            if (nonNull(dossierList) && dossierList.size() > 0) {
                this.getIds(dossierList);
            }
        }
    }

    public void checkDocumentRaccourci(List<Document> documents) {
        for (Document document : documents) {
            List<Raccourci> raccourciList = this.raccourciService.getRepository().findByDocumentAndEtatSuppressionIsFalse(document);
            raccourciList.forEach(raccourci -> idRacourcis.add(raccourci.getId()));
        }
    }


    public void checkDocumentRaccourciForRestaure(List<Document> documents) {
        for (Document document : documents) {
            List<Raccourci> raccourciList = this.raccourciService.getRepository().findByDocumentAndEstDansCorbeilleIsFalse(document);
            raccourciList.forEach(raccourci -> idRacourcis.add(raccourci.getId()));
        }
    }

    @Transactional
    public void addInCorbeille(Long id) {
        this.checkDelete(id);
        repositoryManager.modifierSuppression(id);
        if (idDossiers.size() > 0) repositoryManager.listSuppression(idDossiers);
        if (idDocuments.size() > 0) this.documentService.getRepository().listSuppression(idDocuments);
        if (idRacourcis.size() > 0) this.raccourciService.getRepository().listSuppression(idRacourcis);
    }


    @Transactional
    public boolean restaurer(Long id) {
        Optional<Dossier> optionalDossier = this.repositoryManager.findById(id);
        if (!optionalDossier.isPresent()) return false;
        this.recupererLesParentSupprime(optionalDossier.get());
        this.restaureChild(optionalDossier.get());
        repositoryManager.restaurer(id);
        if (idDossiers.size() > 0) repositoryManager.restaurerTout(idDossiers);
        if (idDocuments.size() > 0) this.documentService.getRepository().restaurerTout(idDocuments);
        this.regulariseRaccourci();
        if (idRacourcis.size() > 0) this.raccourciService.getRepository().restaurerTout(idRacourcis);
        return true;
    }

    public void regulariseRaccourci() {
        List<Long> longList = this.raccourcis.stream().filter(this::cibleExiste).map(Raccourci::getId).collect(Collectors.toList());
        if (longList.size() > 0) this.idRacourcis.addAll(longList);
    }

    public boolean cibleExiste(Raccourci raccourci) {


        if (nonNull(raccourci.getDocument())) {

            System.out.println("raccourci.getDocument().isEstDansCorbeille() = " + raccourci.getDocument().isEstDansCorbeille());
            System.out.println("raccourci.getDocument().isEtatSuppression() = " + raccourci.getDocument().isEtatSuppression());
            System.out.println(!raccourci.getDocument().isEtatSuppression() && !raccourci.getDocument().isEstDansCorbeille());

            return (!raccourci.getDocument().isEtatSuppression() && !raccourci.getDocument().isEstDansCorbeille());
        }

        if (nonNull(raccourci.getDossier())) {

            System.out.println("raccourci.getDossier().isEstDansCorbeille() = " + raccourci.getDossier().isEstDansCorbeille());
            System.out.println("raccourci.getDossier().isEtatSuppression() = " + raccourci.getDossier().isEtatSuppression());
            System.out.println(!raccourci.getDossier().isEtatSuppression() && !raccourci.getDossier
                    ().isEstDansCorbeille());

            return (!raccourci.getDossier().isEtatSuppression() && !raccourci.getDossier().isEstDansCorbeille());
        }
        return false;
    }

    public void restaureChild(Dossier dossier) {
        this.idRacourcis.clear();
        this.idDocuments.clear();
        this.idDossiers.clear();


        List<Document> documents = this.documentService.getRepository().findByDossierAndEstDansCorbeilleIsFalse(dossier);
        documents.forEach(document -> idDocuments.add(document.getId()));
        this.checkDocumentRaccourciForRestaure(documents);
        List<Raccourci> raccourciListContenus = this.raccourciService.getRepository().findByEmplacementAndEstDansCorbeilleIsFalse(dossier);
        raccourciListContenus.forEach(raccourci -> raccourcis.add(raccourci));
        List<Raccourci> raccourciList = this.raccourciService.getRepository().findByDossierAndEstDansCorbeilleIsFalse(dossier);
        raccourciList.forEach(raccourci -> idRacourcis.add(raccourci.getId()));
        List<Dossier> dossiers = this.getRepository().findByDossierParentAndEstDansCorbeilleIsFalse(dossier);
        dossiers.forEach(dossier1 -> idDossiers.add(dossier1.getId()));
        dossiers.forEach(dossier1 -> System.out.println("dossier1.getNom() = " + dossier1.getNom()));
        if (nonNull(dossiers) && dossiers.size() > 0) {
            this.getIdsForRestaure(dossiers);
        }
        System.out.println("idDocuments = " + idDocuments);
        System.out.println("idRacourcis = " + idRacourcis);
        System.out.println("idDossiers = " + idDossiers);
    }

    public void getIdsForRestaure(List<Dossier> dossiers) {
        for (Dossier dossier : dossiers) {

            List<Dossier> dossierList = this.getRepository().findByDossierParentAndEstDansCorbeilleIsFalse(dossier);
            dossierList.forEach(dossier1 -> idDossiers.add(dossier1.getId()));
            List<Document> documentList = this.documentService.getRepository().findByDossierAndEstDansCorbeilleIsFalse(dossier);
            this.checkDocumentRaccourciForRestaure(documentList);
            documentList.forEach(document -> idDocuments.add(document.getId()));
            List<Raccourci> raccourciList = this.raccourciService.getRepository().findByDossierAndEstDansCorbeilleIsFalse(dossier);
            raccourciList.forEach(raccourci -> idRacourcis.add(raccourci.getId()));

            List<Raccourci> raccourciListContenus = this.raccourciService.getRepository().findByEmplacementAndEstDansCorbeilleIsFalse(dossier);
            raccourciListContenus.forEach(raccourci -> raccourcis.add(raccourci));

            if (nonNull(dossierList) && dossierList.size() > 0) {
                this.getIdsForRestaure(dossierList);
            }
        }
    }

    public void recupererLesParentSupprime(Dossier dossier) {
        Dossier dossierCurrent = dossier;
        List<Long> ids = new ArrayList<>();
        for (int i = 0; i < Integer.MAX_VALUE; i++) {
            if (nonNull(dossierCurrent.getDossierParent())) {
                dossierCurrent = dossierCurrent.getDossierParent();
                ids.add(dossierCurrent.getId());
            } else {
                break;
            }
            System.out.println("i = " + i);
        }
        if (ids.size() > 0) this.repositoryManager.restaurerTout(ids);
    }


    public ResponseWrapper<ContenuDossierWrapper> getCorbeilleContent() {

        return ResponseWrapper
                .of(ContenuDossierWrapper
                        .of(
                                this.documentService.getRepository().findByEstDansCorbeilleIsTrue(),
                                this.repositoryManager.findByEstDansCorbeilleIsTrue(),
                                this.raccourciService.getRepository().findByEstDansCorbeilleIsTrue(),
                                null
                        )
                );

    }

    @Transactional
    public List<Document> deleteAll(Long aLong) {

        Optional<Dossier> optionalDossier = this.repositoryManager.findById(aLong);
        this.getChildForDelete(optionalDossier.get());
        idDossiers.add(optionalDossier.get().getId());
        System.out.println("dossierList = " + dossierList);
        if (idDossiers.size() > 0) this.repositoryManager.supprimerToutDefinitivement(idDossiers);
        if (idDocuments.size() > 0) this.documentService.getRepository().supprimerToutDefinitivement(idDocuments);
        if (idRacourcis.size() > 0) this.raccourciService.getRepository().supprimerToutDefinitivement(idRacourcis);
        return documentList;
    }


    public void getChildForDelete(Dossier dossier) {

        this.idRacourcis.clear();
        this.idDocuments.clear();
        this.idDossiers.clear();

        List<Document> documentList = this.documentService.getRepository().findByDossier(dossier);
        this.checkDocumentRaccourci(documentList);
        this.documentList.addAll(documentList);
        documentList.forEach(document -> idDocuments.add(document.getId()));
        this.checkDocumentRaccourciForDelete(documentList);
        List<Raccourci> raccourciListContenus = this.raccourciService.getRepository().findByEmplacement(dossier);
        raccourciListContenus.forEach(raccourci -> idRacourcis.add(raccourci.getId()));
        List<Raccourci> raccourciList = this.raccourciService.getRepository().findByDossier(dossier);
        raccourciList.forEach(raccourci -> idRacourcis.add(raccourci.getId()));
        List<Dossier> dossiers = this.getRepository().findByDossierParent(dossier);
        dossiers.forEach(dossier1 -> idDossiers.add(dossier1.getId()));
        if (nonNull(dossiers) && dossiers.size() > 0) {
            this.getIdsForDelete(dossiers);
        }
        System.out.println("idRacourcis = " + idRacourcis);
        System.out.println("idDocuments = " + idDocuments);
        System.out.println("idDossiers = " + idDossiers);
    }

    public void getIdsForDelete(List<Dossier> dossiers) {
        for (Dossier dossier : dossiers) {
            List<Dossier> dossierList = this.getRepository().findByDossierParent(dossier);
            dossierList.forEach(dossier1 -> idDossiers.add(dossier1.getId()));
            List<Document> documentList = this.documentService.getRepository().findByDossier(dossier);
            documentList.forEach(document -> idDocuments.add(document.getId()));
            this.documentList.addAll(documentList);
            List<Raccourci> raccourciListContenus = this.raccourciService.getRepository().findByEmplacement(dossier);
            this.checkDocumentRaccourciForDelete(documentList);
            List<Raccourci> raccourciList = this.raccourciService.getRepository().findByDossier(dossier);
            raccourciListContenus.forEach(raccourci -> idRacourcis.add(raccourci.getId()));
            raccourciList.forEach(raccourci -> idRacourcis.add(raccourci.getId()));

            if (nonNull(dossierList) && dossierList.size() > 0) {
                this.getIds(dossierList);
            }
        }
    }

    public void checkDocumentRaccourciForDelete(List<Document> documents) {
        for (Document document : documents) {
            List<Raccourci> raccourciList1 = this.raccourciService.getRepository().findByDocument(document);
            raccourciList1.forEach(raccourci -> idRacourcis.add(raccourci.getId()));
        }
    }
}
