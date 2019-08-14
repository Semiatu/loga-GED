// MAIN
import {Component, OnDestroy, EventEmitter, Input, OnInit, Output, ViewEncapsulation, Inject} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// ABSTRACT AND UTILITY
import { matchOtherValidator } from 'src/@externals/loga/_validator/match.other.validator';
import { GenericPersistenceComponent } from 'src/@externals/loga/_abstract';
import { Paths } from 'src/environments/paths';
// MODEL
import { Raccourci } from 'src/app/main/skeleton/configuration/_model';
import {TreeNode} from "primeng/api";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {DossierService} from "../../../_service";
// RESOLVER


@Component({
    selector: 'raccourci-generic-form',
    templateUrl: './raccourci-generic-form.component.html',
    styleUrls: ['./raccourci-generic-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class RaccourciGenericFormComponent implements OnInit {

    @Input()
    action: string;

    @Input()
    raccourci: Raccourci;

    @Output()
    save: EventEmitter<Raccourci> = new EventEmitter();

    @Output()
    update: EventEmitter<Raccourci> = new EventEmitter();

    icon = 'extension';
    componentName;
    passwordConfirm = null;
    hcp = true;
    hp = true;
    baseLink = Paths.configurationPath('raccourcis');
    files: TreeNode[];
    selectedFile : TreeNode;


    constructor(
        public dialogRef: MatDialogRef<RaccourciGenericFormComponent>,
        public dossierService:DossierService,
        @Inject(MAT_DIALOG_DATA) public data: any) {}

    onNoClick(): void {
        this.dialogRef.close();
    }


    ngOnInit(): void {
        this.files =[
            {
                "label": "Documents",
                "data": "Documents Folder",
                "expandedIcon": "fa fa-folder-open",
                "collapsedIcon": "fa fa-folder",
                "children": [{
                    "label": "Work",
                    "data": "Work Folder",
                    "expandedIcon": "fa fa-folder-open",
                    "collapsedIcon": "fa fa-folder",
                    "children": [{
                        "label": "Expenses.doc",
                        "icon": "fa fa-file-word-o",
                        "data": "Expenses Document"
                    }, {"label": "Resume.doc", "icon": "fa fa-file-word-o", "data": "Resume Document"}]
                },
                    {
                        "label": "Home",
                        "data": "Home Folder",
                        "expandedIcon": "fa fa-folder-open",
                        "collapsedIcon": "fa fa-folder",
                        "children": [{"label": "Invoices.txt", "icon": "fa fa-file-word-o", "data": "Invoices for this month"}]
                    }]
            },
            {
                "label": "Pictures",
                "data": "Pictures Folder",
                "expandedIcon": "fa fa-folder-open",
                "collapsedIcon": "fa fa-folder",
                "children": [
                    {"label": "barcelona.jpg", "icon": "fa fa-file-image-o", "data": "Barcelona Photo"},
                    {"label": "logo.jpg", "icon": "fa fa-file-image-o", "data": "PrimeFaces Logo"},
                    {"label": "primeui.png", "icon": "fa fa-file-image-o", "data": "PrimeUI Logo"}]
            },
            {
                "label": "Movies",
                "data": "Movies Folder",
                "expandedIcon": "fa fa-folder-open",
                "collapsedIcon": "fa fa-folder",
                "children": [{
                    "label": "Al Pacino",
                    "data": "Pacino Movies",
                    "children": [{"label": "Scarface", "icon": "fa fa-file-video-o", "data": "Scarface Movie"}, {"label": "Serpico", "icon": "fa fa-file-video-o", "data": "Serpico Movie"}]
                },
                    {
                        "label": "Robert De Niro",
                        "data": "De Niro Movies",
                        "children": [{"label": "Goodfellas", "icon": "fa fa-file-video-o", "data": "Goodfellas Movie"}, {"label": "Untouchables", "icon": "fa fa-file-video-o", "data": "Untouchables Movie"}]
                    }]
            }
        ];
    }

    permitSave(event){
        return !(this.data.ids && this.idExste(event));
    }

    idExste(event): boolean{
        console.log(this.data.ids)
        let returnData = false;
        this.data.ids.forEach( id => {
            console.log(id);
            console.log(event.node.data);
            console.log((Number(event.node.data) === Number(id)));
           if (Number(event.node.data) === Number(id)) {
               returnData = true;
               return true;
           }
        });
        console.log(returnData)
        return returnData;
    }

    nodeSelect(event) {
        if (this.permitSave(event)) {
            this.dialogRef.close(event.node);
        }
        console.log(event);
        console.log(this.permitSave(event));
    }
    // charger un raccourci
    loadNode(event) {
        console.log(event);
        if(event.node && ! this.data.deplacer) {
            this.dossierService.getTreeContent(event.node.data).toPromise().then(nodes => event.node.children = nodes);
        }
        // charger un deplacement
        if(event.node && this.data.deplacer) {
            this.dossierService.getDossierTreeContent(event.node.data,this.data.param).toPromise().then(nodes => event.node.children = nodes);
        }
    }





}
