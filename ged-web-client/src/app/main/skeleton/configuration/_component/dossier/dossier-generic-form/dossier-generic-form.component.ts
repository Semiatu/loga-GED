import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {GenericPersistenceComponent} from "../../../../../../../@externals/loga/_abstract";
import {Dossier} from "../../../_model";
import {DossierService} from "../../../_service";
import {Paths} from "../../../../../../../environments/paths";
import {SnackBarService} from "../../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {DossierFormResolver} from "../../../_resolver";
import {DossierDisplayResolver} from "../../../_resolver/dossier/dossier.display.resolver";

@Component({
    selector: 'dossier-generic-form',
    templateUrl: './dossier-generic-form.component.html',
    styleUrls: ['./dossier-generic-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DossierGenericFormComponent extends GenericPersistenceComponent<Dossier, number, DossierService> implements OnInit {

    @Input()
    action: string;

    @Input()
    dossier: Dossier;

    @Output()
    save: EventEmitter<Dossier> = new EventEmitter();

    @Output()
    update: EventEmitter<Dossier> = new EventEmitter();

    icon = 'extension';
    componentName;
    passwordConfirm = null;
    hcp = true;
    hp = true;
    contentId: any;
    contentLink : any;
    baseLink = Paths.configurationPath('dossiers');

    constructor(
        protected _notificationService: SnackBarService,
        protected _service: DossierService,
        protected _translateService: TranslateService,
        protected _router: Router,
        protected _formBuilder: FormBuilder,
        protected dossierResolver: DossierFormResolver,
        protected clientResolver:  DossierDisplayResolver,
        private activatedRoute: ActivatedRoute,
    ) {
        super(_notificationService, null, _translateService, _service, _router);
    }



    ngOnInit(): void {
        this.contentId = this.activatedRoute.snapshot.params['idDossier'];
        console.log(this.contentId);
        this.dossier= this.clientResolver.dossier;

        const key = this.action === 'edit' ? 'EDIT_TITLE' : 'ADD_TITLE';
        this._translateService.get('APP.USER.' + key).subscribe(title => {
            this.componentName = title;
        });
        if (!this.dossier) {
            this.dossier = new Dossier();
            this.dossier.dossierParent = new Dossier();
            if (this.contentId !== 0) this.dossier.dossierParent.id =  this.contentId;
            if (this.contentId === 0) this.dossier.dossierParent.id =  null;

        }

        this.buildForm();
        this.setFormData(this.dossier);
        this.subscribe();
    }

    getContentLink() {
        return this.contentLink =Paths.configurationPath('dossiers')  + '/content/'  + this.contentId;
    }

    private setFormData(dossier: Dossier): void {
        this.ctrlSetValue('nom', dossier.nom);
        this.ctrlSetValue('taille', dossier.taille);
       }

    protected buildForm(): void {
        this.form = this._formBuilder.group({
            nom: [this.dossier.nom, [Validators.required]],
            taille: [this.dossier.taille],
        });
    }

    private subscribe(): void {
        if (!this.form) {
            this.buildForm();
        }
        this.subCtrlVC('nom', value => this.dossier.nom = value);
        this.subCtrlVC('taille', value => this.dossier.taille = value);
        }

    _save(): void {
        this.save.emit(this.dossier);
    }

    _update(): void {
        this.update.emit(this.dossier);
    }
}
