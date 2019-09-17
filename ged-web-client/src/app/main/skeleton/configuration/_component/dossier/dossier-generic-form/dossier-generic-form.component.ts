import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {GenericPersistenceComponent} from "../../../../../../../@externals/loga/_abstract";
import {Dossier} from "../../../_model";
import {DossierService} from "../../../_service";
import {SnackBarService} from "../../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DossierDisplayResolver} from "../../../_resolver/dossier/dossier.display.resolver";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
    selector: 'dossier-generic-form',
    templateUrl: './dossier-generic-form.component.html',
    styleUrls: ['./dossier-generic-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DossierGenericFormComponent extends GenericPersistenceComponent<Dossier, number, DossierService> implements OnInit {


    dossier: Dossier = new Dossier();


    icon = 'extension';
    form: FormGroup;

    constructor(
        protected _notificationService: SnackBarService,
        protected _service: DossierService,
        protected _translateService: TranslateService,
        protected _router: Router,
        protected _formBuilder: FormBuilder,
        protected clientResolver: DossierDisplayResolver,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<DossierGenericFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        super(_notificationService, null, _translateService, _service, _router);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit(): void {

        this.dossier = this.data.dossier;

        this.buildForm();
        this.setFormData(this.dossier);
        this.subscribe();

    }

    private setFormData(dossier: Dossier): void {
        this.ctrlSetValue('nom', dossier.nom);
    }

    protected buildForm(): void {
        this.form = this._formBuilder.group({
            nom: [this.dossier.nom, [Validators.required]],
        });
    }

    private subscribe(): void {
        if (!this.form) {
            this.buildForm();
        }
        this.subCtrlVC('nom', value => this.dossier.nom = value);
    }

    _save(): void {
        this.dossier.dossierParent = new Dossier();
        this.dossier.dossierParent.id = this.data.idParent;
        this._service.save(this.dossier).subscribe(value => {
            this.dialogRef.close(value);
        });
    }
}
