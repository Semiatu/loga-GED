import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {GenericPersistenceComponent} from "../../../../../../../@externals/loga/_abstract";
import { Categorie} from "../../../_model/categorie";
import {CategorieService} from "../../../_service";
import {Paths} from "../../../../../../../environments/paths";
import {SnackBarService} from "../../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {FormBuilder, Validator, Validators} from "@angular/forms";
import {CategorieFormResolver} from "../../../_resolver";

@Component({
    selector: 'categorie-generic-form',
    templateUrl: './categorie-generic-form.component.html',
    styleUrls: ['./categorie-generic-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CategorieGenericFormComponent extends GenericPersistenceComponent<Categorie, number, CategorieService> implements OnInit {

    @Input()
    action: string;

    @Input()
    categorie: Categorie;

    @Output()
    save: EventEmitter<Categorie> = new EventEmitter();

    @Output()
    update: EventEmitter<Categorie> = new EventEmitter();

    icon = 'extension';
    componentName;
    passwordConfirm = null;
    baseLink = Paths.configurationPath('categories');


    constructor(
        protected _notificationService: SnackBarService,
        protected _service: CategorieService,
        protected _translateService: TranslateService,
        protected _router: Router,
        protected _formBuilder: FormBuilder,
        protected categorieResolver: CategorieFormResolver,
    ) {
        super(_notificationService, null, _translateService, _service, _router);
    }



    ngOnInit(): void {
        const key = this.action === 'edit' ? 'EDIT_TITLE' : 'ADD_TITLE';
        this._translateService.get('APP.USER.' + key).subscribe(title => {
            this.componentName = title;
        });
        if (!this.categorie) {
            this.categorie = new Categorie();
        }

       this.buildForm();
        this.setFormData(this.categorie);
        this.subscribe();
    }

    private setFormData(categorie: Categorie): void {
        this.ctrlSetValue('nom', categorie.nom);
       
    }

    protected buildForm(): void {
        this.form = this._formBuilder.group({
            nom: [this.categorie.nom, this.strRequiredMinMax],
        });
    }

    private subscribe(): void {
        if (!this.form) {
            this.buildForm();
        }
        this.subCtrlVC('nom', value => this.categorie.nom = value);
    }

    _save(): void {
        this.save.emit(this.categorie);
    }

    _update(): void {
        this.update.emit(this.categorie);
    }
   
}
