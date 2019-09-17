package com.loga.skeleton.service;

import com.loga.as.entity.User;
import com.loga.as.service.UserService;
import com.loga.bebase.service.AbstractLongService;
import com.loga.bebase.wrapper.ResponseWrapper;
import com.loga.skeleton.domain.entity.Authorisation;
import com.loga.skeleton.domain.entity.Document;
import com.loga.skeleton.domain.entity.Dossier;
import com.loga.skeleton.domain.entity.Raccourci;
import com.loga.skeleton.domain.enumeration.Privilege;
import com.loga.skeleton.repository.DossierRepository;
import com.loga.skeleton.wrapper.ContenuDossierWrapper;
import com.loga.skeleton.wrapper.SharedWrapper;
import com.loga.skeleton.wrapper.TreeDataWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Service
public class DossierService extends AbstractLongService<Dossier, DossierRepository> {

    @Autowired
    DocumentService documentService;
    @Autowired
    RaccourciService raccourciService;
    @Autowired
    UserService userService;
    @Autowired
    AuthorisationService authorisationService;

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

    public ResponseWrapper<Authorisation> partager(SharedWrapper sharedWrapper, Authentication authentication) {
        Optional<Dossier> optionalDossier = this.repositoryManager.findById(sharedWrapper.getIdEntity());

        if (!optionalDossier.isPresent()) return ResponseWrapper.of("Information non trouvée");

        User user = this.userService.findByUsername(authentication.getName());
        Optional<Authorisation> optionalAuthorisation = this.authorisationService.getRepository().findByDossierIdAndUserUsername(sharedWrapper.getIdEntity(), user.getUsername());

        if (!optionalAuthorisation.isPresent()) return ResponseWrapper.of("Information non trouvée");

        if (optionalAuthorisation.get().getPrivilege() == Privilege.LIRE)
            return ResponseWrapper.of(" Vous n'avez pas l'autorisaton de partager ce document!");

        Optional<User> optionalUser = this.userService.getRepository().findById(sharedWrapper.getUserId());
        if (!optionalUser.isPresent()) return ResponseWrapper.of("utilisateur non trouvé");

        Authorisation authorisation = new Authorisation();
        authorisation.setUser(optionalUser.get());
        authorisation.setDossier(optionalDossier.get());
        authorisation.setPrivilege(sharedWrapper.getPrivilege());
        return this.authorisationService.save(authorisation);

    }

    public ResponseWrapper<Dossier> save(Dossier entity, Authentication authentication) {
        if (isNull(entity.getDossierParent()) || entity.getDossierParent().getId() == 0) entity.setDossierParent(null);

        ResponseWrapper<Dossier> responseWrapper = super.save(entity);

        if (responseWrapper.isValid()) {
            User user = this.userService.findByUsername(authentication.getName());
            Authorisation authorisation = new Authorisation();
            authorisation.setDossier(responseWrapper.getEntity());
            authorisation.setUser(user);
            authorisation.setPrivilege(Privilege.SUPPRIMER);
            this.authorisationService.save(authorisation);
        }

        return responseWrapper;
    }

    @Override
    public ResponseWrapper<Dossier> update(Long id, Dossier entity) {
        if (nonNull(entity.getDossierParent()) && entity.getDossierParent().getId() == 0) entity.setDossierParent(null);
        return super.update(id, entity);
    }

    public List<Dossier> findByDossierParentIsNull(Pageable pageable) {
        return this.repositoryManager.findByDossierParentIsNullAndEtatSuppressionIsFalse(pageable);
    }


    public ResponseWrapper<List<Authorisation>> getIdNullAuthorisation(Authentication authentication) {

        List<Authorisation> returnList = new ArrayList<>();

        List<Authorisation> authorisationsDocument = this.authorisationService.getRepository().findByUserUsernameAndDocumentNotNull(authentication.getName());

        System.out.println("authorisationsDocument.size() = " + authorisationsDocument.size());
        for (Authorisation authorisation : authorisationsDocument) {

            if (!this.dossierParentExiste(authorisation.getDocument().getDossier(), authentication))
                returnList.add(authorisation);
        }

        List<Authorisation> authorisationsDossier = this.authorisationService.getRepository().findByUserUsernameAndDossierIsNotNull(authentication.getName());

        System.out.println("authorisationsDossier.size() = " + authorisationsDossier.size());

        List<Authorisation> authorisationsRaccourci = this.authorisationService.getRepository().findByRaccourciIsNotNullAndRaccourciEmplacementIsNullAndUserUsername(authentication.getName());

        System.out.println("authorisationsRaccourci.size() = " + authorisationsRaccourci.size());
        returnList.addAll(authorisationsRaccourci);

        for (Authorisation authorisation : authorisationsDossier) {

            System.out.println("this.authorisationParentExiste(authorisation, authentication) = " + this.authorisationParentExiste(authorisation, authentication));
            if (!this.authorisationParentExiste(authorisation, authentication)) returnList.add(authorisation);
        }

        return ResponseWrapper.of(returnList);
    }


    public ResponseWrapper<List<Authorisation>> getIdNotNullAuthorisation(Long idDossier, Authentication authentication) {

        List<Authorisation> returnList = new ArrayList<>();

        returnList.addAll(this.authorisationService.getRepository().findByDocumentDossierIdAndUserUsername(idDossier, authentication.getName()));


        returnList.addAll(this.authorisationService.getRepository().findByDossierDossierParentIdAndUserUsername(idDossier, authentication.getName()));
        returnList.addAll(this.authorisationService.getRepository().findByRaccourciEmplacementIdAndUserUsername(idDossier, authentication.getName()));

        return ResponseWrapper.of(returnList);
    }

    public ResponseWrapper<List<Authorisation>> getContent(Long idDossier, Authentication authentication) {

        if (idDossier == 0) {
            return this.getIdNullAuthorisation(authentication);
        }

        return this.getIdNotNullAuthorisation(idDossier, authentication);

    }

    public boolean authorisationParentExiste(Authorisation authorisation, Authentication authentication) {

        if (nonNull(authorisation.getDossier()))
            return this.dossierParentExiste(authorisation.getDossier().getDossierParent(), authentication);
        return false;

    }

    public boolean dossierParentExiste(Dossier dossier, Authentication authentication) {

        if (dossier == null) return false;
        List<Long> ids = new ArrayList<>();

        for (int i = 0; i < Integer.MAX_VALUE; i++) {
            ids.add(dossier.getId());
            if (nonNull(dossier.getDossierParent())) {
                dossier = dossier.getDossierParent();
            } else {
                break;
            }

            System.out.println("i = " + i);
        }
        if (ids.size() > 0)
            return this.authorisationService.getRepository().findByUserNameAndIds(authentication.getName(), ids).size() > 0;
        return false;

    }


    public Authorisation setParent(Authorisation authorisation, Authentication authentication) {

        return null;
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


    public ResponseWrapper<List<TreeDataWrapper>> getTreeData2(Long idDossier) {
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


    public ResponseWrapper<List<TreeDataWrapper>> getTreeData(Long idDossier, Authentication authentication) {
        List<TreeDataWrapper> dataWrapperList = new ArrayList<>();

        ResponseWrapper<List<Authorisation>> listResponseWrapper = this.getContent(idDossier, authentication);


        if (!listResponseWrapper.isValid()) return ResponseWrapper.of(listResponseWrapper.getMessage());

        listResponseWrapper.getEntity()
                .stream()
                .map(TreeDataWrapper::mapAuthentification)
                .map(this::setLeaf)
                .peek(treeDataWrapper -> dataWrapperList.add(treeDataWrapper))
                .count();
        return ResponseWrapper.of(dataWrapperList);
    }


    public TreeDataWrapper setLeaf(TreeDataWrapper treeDataWrapper) {
        if (nonNull(treeDataWrapper.getExpandedIcon())) return this.setLeaf2(treeDataWrapper);
        return treeDataWrapper;
    }


    public TreeDataWrapper setLeaf2(TreeDataWrapper treeDataWrapper) {
        Dossier dossier = this.repositoryManager.getOne(Long.valueOf(treeDataWrapper.getData()));
        List<Dossier> dossiers = this.getRepository().findByDossierParentAndEtatSuppressionIsFalse(dossier);

        if (dossier != null || dossiers.size() == 0) treeDataWrapper.setLeaf(true);
        if (dossiers.size() != 0) treeDataWrapper.setLeaf(false);
        return treeDataWrapper;
    }


    public ResponseWrapper<List<TreeDataWrapper>> getDossierTreeData(Long idParent, List<Long> ids) {
        List<TreeDataWrapper> dataWrapperList = new ArrayList<>();

        List<Dossier> dossierList;


        if (idParent == 0) {
            dossierList = this.repositoryManager.findByDossierParentIsNullAndEtatSuppressionIsFalse();
            dossierList = this.repositoryManager.findByDossierParentIsNullAndEtatSuppressionIsFalse();
        } else {

            Optional<Dossier> optionalDossier = this.repositoryManager.findById(idParent);

            dossierList = this.repositoryManager.findByDossierParentAndEtatSuppressionIsFalse(optionalDossier.get());


        }

        dossierList
                .stream()
                .filter(dossier -> filterData(dossier, ids))
                .map(TreeDataWrapper::mapDossier)
                .map(this::setLeaf)
                .peek(treeDataWrapper -> dataWrapperList.add(treeDataWrapper))
                .count();

        return ResponseWrapper.of(dataWrapperList);

    }

    public boolean filterData(Dossier dossier, List<Long> ids) {
        for (Long id : ids) {
            if ((dossier.getId().equals(id))) return false;
        }

        return true;
    }

    // ids de tout le contenu d'un dossier
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
        // si le dossier a un dossier fils
        List<Dossier> dossiers = this.getRepository().findByDossierParent(optionalDossier.get());
        dossiers.forEach(dossier1 -> idDossiers.add(dossier1.getId()));
        if (nonNull(dossiers) && dossiers.size() > 0) {
            this.getIds(dossiers);
        }
        System.out.println("idRacourcis = " + idRacourcis);
        System.out.println("idDocuments = " + idDocuments);
        System.out.println("idDossiers = " + idDossiers);
    }

    // ids de la liste des dossier qui n'ont pas ete supprimer
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

    // ids raccourciDocument dans panier pour la suppression
    public void checkDocumentRaccourci(List<Document> documents) {
        for (Document document : documents) {
            List<Raccourci> raccourciList = this.raccourciService.getRepository().findByDocumentAndEtatSuppressionIsFalse(document);
            raccourciList.forEach(raccourci -> idRacourcis.add(raccourci.getId()));
        }
    }

    //ids raccourciDocument dans panier pour la restauration
    public void checkDocumentRaccourciForRestaure(List<Document> documents) {
        for (Document document : documents) {
            List<Raccourci> raccourciList = this.raccourciService.getRepository().findByDocumentAndEstDansCorbeilleIsFalse(document);
            raccourciList.forEach(raccourci -> idRacourcis.add(raccourci.getId()));
        }
    }

    @Transactional
    public void addInCorbeille(Long id) {
        this.checkDelete(id);
        repositoryManager.modifierEtatSuppression(id);
        if (idDossiers.size() > 0) repositoryManager.listSuppression(idDossiers);
        if (idDocuments.size() > 0) this.documentService.getRepository().listSuppression(idDocuments);
        if (idRacourcis.size() > 0) this.raccourciService.getRepository().listSuppression(idRacourcis);
    }


    @Transactional
    public void restaurer(Long id) {
        Optional<Dossier> optionalDossier = this.repositoryManager.findById(id);
        if (!optionalDossier.isPresent()) return;
        this.recupererLesParentSupprime(optionalDossier.get());
        this.restaureChild(optionalDossier.get());
        repositoryManager.restaurer(id);
        if (idDossiers.size() > 0) repositoryManager.restaurerTout(idDossiers);
        if (idDocuments.size() > 0) this.documentService.getRepository().restaurerTout(idDocuments);
        this.regulariseRaccourci();
        if (idRacourcis.size() > 0) this.raccourciService.getRepository().restaurerTout(idRacourcis);
    }

    public void regulariseRaccourci() {
        List<Long> longList = this.raccourcis
                .stream()
                .filter(this::cibleExiste)
                .map(Raccourci::getId).collect(Collectors.toList());
        if (longList.size() > 0) this.idRacourcis.addAll(longList);
    }

    public boolean cibleExiste(Raccourci raccourci) {
        if (nonNull(raccourci.getDocument())) {
            return (!raccourci.getDocument().isEtatSuppression() && !raccourci.getDocument().isEstDansCorbeille());
        }
        if (nonNull(raccourci.getDossier())) {
            return (!raccourci.getDossier().isEtatSuppression() && !raccourci.getDossier().isEstDansCorbeille());
        }
        return false;
    }

    // restauration des fils d'un dossier
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

    // suppression definitive des tout les documents contenu dans un dossier
    @Transactional
    public List<Document> deleteDossier(Long aLong) {

        Optional<Dossier> optionalDossier = this.repositoryManager.findById(aLong);
        this.getChildForDelete(optionalDossier.get());
        idDossiers.add(optionalDossier.get().getId());
        System.out.println("dossierList = " + dossierList);
        if (idDossiers.size() > 0) this.repositoryManager.supprimerToutDefinitivement(idDossiers);
        if (idDocuments.size() > 0) this.documentService.getRepository().supprimerToutDefinitivement(idDocuments);
        if (idRacourcis.size() > 0) this.raccourciService.getRepository().supprimerToutDefinitivement(idRacourcis);
        return documentList;
    }

    @Transactional
    public List<Document> deleteAll(ContenuDossierWrapper contenuDossierWrapper) {
        List<Document> documentList = new ArrayList<>();
        contenuDossierWrapper.getDossiers().forEach(dossier -> {
            documentList.addAll(this.deleteDossier(dossier.getId()));
        });

        contenuDossierWrapper.getDocuments().forEach(document -> this.documentService.delete(document.getId()));
        contenuDossierWrapper.getRaccourcis().forEach(raccourci -> this.raccourciService.delete(raccourci.getId()));
        this.documentList.addAll(contenuDossierWrapper.getDocuments());
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

    // panier ids raccourciDocument pour la suppression
    public void checkDocumentRaccourciForDelete(List<Document> documents) {
        for (Document document : documents) {
            List<Raccourci> raccourciList1 = this.raccourciService.getRepository().findByDocument(document);
            raccourciList1.forEach(raccourci -> idRacourcis.add(raccourci.getId()));
        }
    }

    // supprimer tout les element cochés
    @Transactional
    public void addAllSelectedInCorbeille(ContenuDossierWrapper contenuDossierWrapper) {

        contenuDossierWrapper.getDocuments().forEach(document -> this.documentService.addInCorbeille(document.getId()));
        contenuDossierWrapper.getDossiers().forEach(dossier -> addInCorbeille(dossier.getId()));
        contenuDossierWrapper.getRaccourcis().forEach(raccourci -> this.raccourciService.addInCorbeille(raccourci.getId()));

    }

    @Transactional
    public void restaureAllSelected(ContenuDossierWrapper contenuDossierWrapper) {

        contenuDossierWrapper.getDocuments().forEach(document -> this.documentService.restaurer(document.getId()));
        contenuDossierWrapper.getDossiers().forEach(dossier -> restaurer(dossier.getId()));
        contenuDossierWrapper.getRaccourcis().forEach(raccourci -> this.raccourciService.restaurer(raccourci.getId()));

    }

    private Privilege getPrivilege(Dossier dossier, String usernane) {
        Optional<Authorisation> authorisation =
                this.authorisationService.getRepository().findByDossierIdAndUserUsername(dossier.getId(), usernane);
        if (authorisation.isPresent()) return authorisation.get().getPrivilege();
        return null;
    }

    private Privilege getPrivilege(Document document, String usernane) {
        Optional<Authorisation> authorisation =
                this.authorisationService.getRepository().findByDocumentIdAndUserUsername(document.getId(), usernane);
        if (authorisation.isPresent()) return authorisation.get().getPrivilege();
        return null;
    }

    @Transactional
    public void deplaceAllSelected(ContenuDossierWrapper contenuDossierWrapper) {
        System.out.println("contenuDossierWrapper = " + contenuDossierWrapper);
        List<Dossier> dossiers =
                contenuDossierWrapper
                        .getDossiers()
                        .stream()
                        .map(dossier -> this.mapDossier(dossier, contenuDossierWrapper.getDossier()))
                        .collect(Collectors.toList());

        List<Document> documents =
                contenuDossierWrapper
                        .getDocuments()
                        .stream()
                        .map(document -> this.mapDocument(document, contenuDossierWrapper.getDossier()))
                        .collect(Collectors.toList());

        List<Raccourci> raccourcis =
                contenuDossierWrapper
                        .getRaccourcis()
                        .stream()
                        .map(raccourci -> this.mapRaccourci(raccourci, contenuDossierWrapper.getDossier()))
                        .collect(Collectors.toList());

        documentService.saveAll(documents);
        raccourciService.saveAll(raccourcis);
        saveAll(dossiers);

    }

    private Dossier mapDossier(Dossier dossier, Dossier dossierParent) {
        dossier.setDossierParent(dossierParent);
        return dossier;
    }

    private Document mapDocument(Document document, Dossier dossier) {
        document.setDossier(dossier);
        return document;
    }

    private Raccourci mapRaccourci(Raccourci raccourci, Dossier dossier) {
        raccourci.setDossier(dossier);
        return raccourci;
    }
}
