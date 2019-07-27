package com.loga.skeleton.wrapper;

import com.loga.skeleton.domain.entity.Document;
import com.loga.skeleton.domain.entity.Dossier;
import com.loga.skeleton.domain.entity.Raccourci;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TreeDataWrapper {
    private String label;
    private String data;
    private String expandedIcon;
    private String collapsedIcon;
    private String icon;
    private boolean leaf = true;
    private List<TreeDataWrapper> children;

    // all constructor
    public TreeDataWrapper(String label, String data, List<TreeDataWrapper> children) {
        this.label = label;
        this.data = data;
        this.expandedIcon = "fa fa-folder-open";
        this.collapsedIcon = "fa fa-folder";
        this.children = children;
    }

    // folder parent constructor
    public TreeDataWrapper(String label, String data) {
        this.label = label;
        this.data = data;
        this.expandedIcon = "fa fa-folder-open"; // for a folder open
        this.collapsedIcon = "fa fa-folder";  // for folder
    }

    // childreen constructor
    public TreeDataWrapper(String label, String data, TreeEnumeration type) {
        this.label = label;
        this.data = data;
        if (type.equals(TreeEnumeration.DOCUMENT))  this.icon = "fa fa-file-word-o";
        if (type.equals(TreeEnumeration.RACCOURCI))  this.icon = "fa fa-file-excel-o";

    }
/*
    public static TreeDataWrapper ofDossier(String label, String data) {
        return new TreeDataWrapper(label,data);
    }

    public static TreeDataWrapper ofDossierAvecFlis(String label, String data, List<TreeDataWrapper> children) {
        return new TreeDataWrapper(label,data,children);
    }

    public static TreeDataWrapper ofFichier(String label, String data, TreeEnumeration type) {
        return new TreeDataWrapper(label,data,type);
    }*/

    public static TreeDataWrapper mapDocument(Document document) {
        return new TreeDataWrapper(document.getNom(),String.valueOf(document.getId()), TreeEnumeration.DOCUMENT);
    }

    public static TreeDataWrapper mapRacourci(Raccourci raccourci) {
        return new TreeDataWrapper(raccourci.getNom(),String.valueOf(raccourci.getId()), TreeEnumeration.RACCOURCI);
    }

    public static TreeDataWrapper mapDossier(Dossier dossier) {
        return new TreeDataWrapper(dossier.getNom(),String.valueOf(dossier.getId()));
    }


}
