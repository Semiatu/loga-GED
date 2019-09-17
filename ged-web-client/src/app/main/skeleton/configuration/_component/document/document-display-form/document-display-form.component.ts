// MAIN
import {Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
// ABSTRACT AND UTILITY
import {GenericPersistenceComponent} from 'src/@externals/loga/_abstract';
import {Paths} from 'src/environments/paths';
// MODEL
import { Document} from '../../../_model';
import {TranslateService} from '@ngx-translate/core';
import {SnackBarService} from 'src/@externals/loga/snack-bar/snack.bar.service';
// RESOLVER

import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSort} from '@angular/material';
import {fuseAnimations} from '../../../../../../../@externals/fuse/@fuse/animations';
import {DialogService} from '../../../../../../../@externals/loga/dialog/dialog.service';
import {DocumentService, UploadService} from '../../../_service';
import {DocumentDisplayResolver} from "../../../_resolver/document/document.display.resolver";
import {DocumentGenericFormComponent} from "../document-generic-form/document-generic-form.component";

@Component({
    selector: 'document-display-form',
    templateUrl: './document-display-form.component.html',
    styleUrls: ['./document-display-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class  DocumentDisplayFormComponent extends GenericPersistenceComponent< Document, number,  DocumentService> implements OnInit {
    document:  Document;
    icon = 'reorder';
    baseLink = Paths.configurationPath('documents');
    totalElements = 0;
    row = 10;
    componentName = 'Document';
    dossierID : string;
    parentLink : any;
    documentEditLink: any;
    fileViewerUrl: string;
    isDocumentDisplay = true;
    showDocument = true;
    showInformation = false;

    @ViewChild('paginator')
    paginator: MatPaginator;

    @ViewChild('filter')
    filter: ElementRef;

    @ViewChild(MatSort)
    sort: MatSort;


    constructor(
        protected _notificationService: SnackBarService,
        protected dialogService: DialogService,
        protected _service:  DocumentService,
        protected uploadService:  UploadService,
        protected _translateService: TranslateService,
        protected _router: Router,
        protected _formBuilder: FormBuilder,
        protected clientResolver:  DocumentDisplayResolver,
        private activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
    ) {
        super(_notificationService, dialogService, _translateService, _service, _router);
    }


    ngOnInit(): void {
        this.dossierID = this.activatedRoute.snapshot.params['idDossier'];
        this.document = this.clientResolver.document;
        this. documentEditLink = '/' + Paths.configurationPath('documents/' + this. document.id);
       this.fileViewerUrl = this.clientResolver.document.url;
    }


    getParentLInk(){
        return this.parentLink =Paths.configurationPath('dossiers')  + '/content/'  + this.dossierID;
    }

    dowload(){
        this._service.getReceipt(this.document.url).subscribe(value => {
            console.log('ok');
        },error1 => {
            console.log(error1);
        })
    }

    private next(details: any[], page): any {
        if (!details) {
            return [];
        }
        if (page < 0) {
            page = 0;
        }
        const length = details.length;
        const start = page * this.row;
        let end = start + this.row;
        if (end > length) {
            end = length;
        }
        return details.slice(start, end);
    }


// EMPLOYEE INFORMATION

    delete(component?: any, paramValue?: any): void {
        component = this. document;
        paramValue = 'ce  Document';
        this.showLoading();
        this._translateService.get(['APP.DELETE_CONFIRM', 'APP.SUCCESS', 'APP.DELETE'], {value: paramValue})
            .subscribe(values => {
                const matDialogRef = this._dialogService.openConfirmDialog(values['APP.DELETE_CONFIRM']);
                matDialogRef.afterClosed().subscribe(response => {
                    if (response) {
                        this._service.delete(component.id).subscribe(value => {
                                this._service.findAllPage(0, this.row).subscribe(data => {
                                    this.navigateToList(values['APP.SUCCESS'], values['APP.DELETE'], Paths.configurationPath('documents'));
                                    this.hideLoading();
                                });
                            }, error => {
                                this.showError(error);
                            },
                        );
                    }
                });
            });
    }
// telecharger document
   public downloadDocument(){
       this.uploadService.downloadFile(this.document);
   }

    openDisplayDialogue(){
        this.showDocument = false;
        this.showInformation = true;
    }

    activeShowDocument(){
        this.showDocument = true;
        this.showInformation = false;
    }

}
