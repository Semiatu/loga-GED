package com.loga.skeleton.service;

import com.loga.bebase.service.AbstractLongService;
import com.loga.bebase.wrapper.ResponseWrapper;
import com.loga.skeleton.domain.entity.Dossier;
import com.loga.skeleton.repository.DossierRepository;
import com.loga.skeleton.wrapper.ContenuDossierWrapper;
import com.loga.skeleton.wrapper.TreeDataWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DossierService extends AbstractLongService<Dossier, DossierRepository> {

    @Autowired
    DocumentService documentService;
    @Autowired
    RaccourciService raccourciService;

    public DossierService(DossierRepository dossierRepository) {

        super(dossierRepository);
    }


    public List<Dossier> getDossierByParent(Long dossierParent, Pageable pageable) {
        Optional<Dossier> dossierOptional = this.repositoryManager.findById(dossierParent);
        if (dossierOptional.isPresent()) {
            Dossier dossier = dossierOptional.get();
            return repositoryManager.findByDossierParent(dossier, pageable);
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

    public List<Dossier> findByDossierParentIsNullAnd(Pageable pageable) {
        return this.repositoryManager.findByDossierParentIsNull(pageable);
    }

    public ResponseWrapper<ContenuDossierWrapper> getContent(Long idDossier) {
        if (idDossier == 0)
            return
                    ResponseWrapper.
                            of(ContenuDossierWrapper
                                    .of(
                                            this.documentService.getRepository().findByDossierIsNull(),
                                            this.repositoryManager.findByDossierParentIsNull(),
                                            this.raccourciService.getRepository().findByEmplacementIsNull(),
                                            null
                                    )
                            );

        Optional<Dossier> optionalDossier = this.repositoryManager.findById(idDossier);

        if (!optionalDossier.isPresent()) return ResponseWrapper.of("Impossible de recup2s");
        return ResponseWrapper
                .of(ContenuDossierWrapper
                        .of(
                                this.documentService.getRepository().findByDossier(optionalDossier.get()),
                                this.repositoryManager.findByDossierParent(optionalDossier.get()),
                                this.raccourciService.getRepository().findByEmplacement(optionalDossier.get()),
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
        List<Dossier> dossiers = this.getRepository().findByDossierParent(dossier);

        if (dossier != null || dossiers.size() == 0) treeDataWrapper.setLeaf(true);
        if (dossiers.size() != 0) treeDataWrapper.setLeaf(false);
        return treeDataWrapper;
    }


}
