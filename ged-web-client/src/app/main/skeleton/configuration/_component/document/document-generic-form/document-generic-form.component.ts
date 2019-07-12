import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {GenericPersistenceComponent} from "../../../../../../../@externals/loga/_abstract";
import {Document, Dossier} from "../../../_model";
import {DocumentService} from "../../../_service";
import {Paths} from "../../../../../../../environments/paths";
import {SnackBarService} from "../../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {DocumentFormResolver} from "../../../_resolver";

@Component({
    selector: 'document-generic-form',
    templateUrl: './document-generic-form.component.html',
    styleUrls: ['./document-generic-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DocumentGenericFormComponent extends GenericPersistenceComponent<Document, number, DocumentService> implements OnInit {

    @Input()
    action: string;

    @Input()
    document: Document;

    @Output()
    save: EventEmitter<Document> = new EventEmitter();

    @Output()
    update: EventEmitter<Document> = new EventEmitter();

    icon = 'extension';
    componentName;
    passwordConfirm = null;
    hcp = true;
    hp = true;
    dossierId: any;
    baseLink = Paths.configurationPath('documents');

    constructor(
        protected _notificationService: SnackBarService,
        protected _service: DocumentService,
        protected _translateService: TranslateService,
        protected _router: Router,
        protected _formBuilder: FormBuilder,
        protected documentResolver: DocumentFormResolver,
        private activatedRoute: ActivatedRoute
    ) {
        super(_notificationService, null, _translateService, _service, _router);
    }



    ngOnInit(): void {
        const key = this.action === 'edit' ? 'EDIT_TITLE' : 'ADD_TITLE';
        this._translateService.get('APP.USER.' + key).subscribe(title => {
            this.componentName = title;
        });
        if (!this.document) {
            this.dossierId = this.activatedRoute.snapshot.params['idDossier'];
            this.document = new Document();
            this.document.dossier = new Dossier();
            this.document.dossier.id = this.dossierId;
        }else {
            this.dossierId = this.document.dossier.id;
        }

        this.buildForm();
        this.setFormData(this.document);
        this.subscribe();
    }

    private setFormData(document: Document): void {
        this.ctrlSetValue('nom', document.nom);
        this.ctrlSetValue('description', document.description);
        this.ctrlSetValue('taille', document.taille);
        this.ctrlSetValue('auteur', document.auteur);
        this.ctrlSetValue('format', document.format);
        this.ctrlSetValue('version', document.version);
        this.ctrlSetValue('url', document.url);
    }

    protected buildForm(): void {
        this.form = this._formBuilder.group({
            nom: [this.document.nom, this.strRequiredMinMax],
            description: [this.document.description, this.strRequiredMinMax],
            taille: [this.document.taille, [Validators.required]],
            auteur: [this.document.auteur, [Validators.required]],
            format: [this.document.format, [Validators.required]],
            version: [this.document.version, [Validators.required]],
            url: [this.document.url, [Validators.required]],
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
    }

    _save(): void {
        this.save.emit(this.document);
    }

    _update(): void {
        this.update.emit(this.document);
    }
}
