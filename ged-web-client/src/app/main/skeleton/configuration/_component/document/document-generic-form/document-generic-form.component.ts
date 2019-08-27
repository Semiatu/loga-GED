import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {GenericPersistenceComponent} from "../../../../../../../@externals/loga/_abstract";
import {Document, Dossier, TypeDocument} from "../../../_model";
import {DocumentService, UploadService} from "../../../_service";
import {Paths} from "../../../../../../../environments/paths";
import {SnackBarService} from "../../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {TranslateService} from "@ngx-translate/core";
import {FormBuilder, Validators} from "@angular/forms";
import {fuseAnimations} from "../../../../../../../@externals/fuse/@fuse/animations";
import * as firebase from 'firebase';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {DossierDisplayResolver} from "../../../_resolver/dossier/dossier.display.resolver";

@Component({
    selector: 'document-generic-form',
    templateUrl: './document-generic-form.component.html',
    styleUrls: ['./document-generic-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DocumentGenericFormComponent extends GenericPersistenceComponent<Document, number, DocumentService> implements OnInit {

    @Input()
    action: string;

    @Input()
    document: Document;

    @Input()
    file: Observable<any>;


    @Output()
    save: EventEmitter<Document> = new EventEmitter();

    @Output()
    update: EventEmitter<Document> = new EventEmitter();

    icon = 'extension';
    componentName;
    passwordConfirm = null;
    hcp = true;
    hp = true;
    showProgress = false;
    profileUrl: Observable<string | null>;
    dossierId: any;
    baseLink = Paths.configurationPath('documents');
    dossierLink = Paths.configurationPath('dossiers');

    contentLink : any;
    dossier: Dossier;

    constructor(
        protected _notificationService: SnackBarService,
        protected _service: DocumentService,
        protected _translateService: TranslateService,
        protected _router: Router,
        protected _formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private uploadService: UploadService,
        protected clientResolver:  DossierDisplayResolver,
    ) {
        super(_notificationService, null, _translateService, _service, _router);
    }


    ngOnInit(): void {
        this.dossier= this.clientResolver.dossier;

        const key = this.action === 'edit' ? 'EDIT_TITLE' : 'ADD_TITLE';
        this._translateService.get('APP.USER.' + key).subscribe(title => {
            this.componentName = title;
        });
        if (!this.document) {
            this.dossierId = this.activatedRoute.snapshot.params['idDossier'];
            this.document = new Document();
            this.document.dossier = new Dossier();
            this.document.dossier.id = this.dossierId === 0 ? null : this.dossierId;

            this.file.subscribe(file => {
                console.log(file);
                this.document.file = file;
                this.document.nom = file.name;
                this.document.taille = this.returnFileSize(file.size);
                this. document.typeDocument = new TypeDocument();
                this. document.typeDocument.nom = file.type;

            });

        } else {
            this.dossierId = this.document.dossier.id;
        }

        this.buildForm();
        this.setFormData(this.document);
        this.subscribe();
    }

    getContentLink() {
        return this.contentLink =Paths.configurationPath('dossiers')  + '/content/'  + this.dossierId;
    }

    private setFormData(document: Document): void {
        this.ctrlSetValue('nom', document.nom);
        this.ctrlSetValue('description', document.description);
        this.ctrlSetValue('taille', document.taille );
        this.ctrlSetValue('auteur', document.auteur);
        this.ctrlSetValue('format', document.format);
        this.ctrlSetValue('version', document.version);
        this.ctrlSetValue('url', document.url);
        this.ctrlSetValue('typeDocument', document.typeDocument.nom);
    }

    protected buildForm(): void {
        this.form = this._formBuilder.group({
            nom: [this.document.nom, this.strRequiredMinMax],
            description: [this.document.description],
            taille: [this.document.taille],
            auteur: [this.document.auteur],
            format: [this.document.format],
            version: [this.document.version],
            url: [this.document.url],
            typeDocument: [this. document.typeDocument.nom],
        });
    }

    private subscribe(): void {
        if (!this.form) {
            this.buildForm();
        }
        this.subCtrlVC('nom', value => this.document.nom = value);
        this.subCtrlVC('description', value => this.document.description = value);
        this.subCtrlVC('taille', value => this.document.taille = value);
        this.subCtrlVC('auteur', value => this.document.auteur = value);
        this.subCtrlVC('format', value => this.document.format = value);
        this.subCtrlVC('version', value => this.document.version = value);
        this.subCtrlVC('url', value => this.document.url = value);
        this.subCtrlVC('typeDocument', value => this. document.typeDocument.nom = value);
    }

    saveIndb(): void {
        console.log(Paths.join(Paths.configurationPath('documents'), Paths.join('dossier', String(this.document.dossier.id))));
        this.addSub(
            this._service.save(this.document).subscribe(value => {
                    this._translateService.get(['APP.SUCCESS', 'APP.ADD']).subscribe(values => {
                        this.navigateToList(values['APP.SUCCESS'], values['APP.ADD'], Paths.configurationPath('dossiers') + '/content/' + this.dossierId );
                    });
                }, error => {
                    this.showError(error);
                }
            )
        );
    }

  /* _save(): void {
        this.saveIndb()
    }*/

   // uploder et enregistrement du fichier
    _save(): void {
        this.showProgress = true;
        let uploadTask = this.uploadService.pushDocument(this.document);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
             console.log(snapshot);
                //document in progress
                this.document.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            },
            // document error
            (error) => {
                this.showProgress = false;
                console.log(error)
            },
            () => {
                // document success
                this.showProgress = false;

                // recuperation de url
                uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                    this.document.url = downloadURL;
                    console.log('URL:' + this.document.url);

                    // enregistrement du fichier dans la bdd
                    this.saveIndb();
                });
            });
    }
    updateIndb(): void {
        this.addSub(
            this._service.update( this.document.id, this.document).subscribe(value => {
                this._translateService.get(['APP.SUCCESS', 'APP.UPDATE']).subscribe(values => {
                    this.navigateToList(values['APP.SUCCESS'], values['APP.UPDATE'], Paths.configurationPath('dossiers') + '/content/' + this.dossierId );
                });
            }, error => {
                this.showError(error);
            })
        );
    }
    returnFileSize(size: number) {
        if(size < 1024) {
            return size + ' octets';
        } else if(size >= 1024 && size < 1048576) {
            return (size / 1024).toFixed(1) + ' Ko';
        } else if(size >= 1048576) {
            return (size /1048576).toFixed(1) + ' Mo';
        }
    }
}
