import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {GenericPersistenceComponent} from "../../../../../../../@externals/loga/_abstract";
import {Dossier} from "../../../_model";
import {DossierService} from "../../../_service";
import {Paths} from "../../../../../../../environments/paths";
import {SnackBarService} from "../../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {DossierFormResolver} from "../../../_resolver";
import {fuseAnimations} from "../../../../../../../@externals/fuse/@fuse/animations";

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
    baseLink = Paths.configurationPath('dossiers');

    constructor(
        protected _notificationService: SnackBarService,
        protected _service: DossierService,
        protected _translateService: TranslateService,
        protected _router: Router,
        protected _formBuilder: FormBuilder,
        protected dossierResolver: DossierFormResolver,
    ) {
        super(_notificationService, null, _translateService, _service, _router);
    }



    ngOnInit(): void {
        const key = this.action === 'edit' ? 'EDIT_TITLE' : 'ADD_TITLE';
        this._translateService.get('APP.USER.' + key).subscribe(title => {
            this.componentName = title;
        });
        if (!this.dossier) {
            this.dossier = new Dossier();
        }

        this.buildForm();
        this.setFormData(this.dossier);
        this.subscribe();
    }

    private setFormData(dossier: Dossier): void {
        this.ctrlSetValue('nom', dossier.nom);
        this.ctrlSetValue('taille', dossier.taille);
       }

    protected buildForm(): void {
        this.form = this._formBuilder.group({
            nom: [this.dossier.nom, this.strRequiredMinMax],
            taille: [this.dossier.taille, [Validators.required]],
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
