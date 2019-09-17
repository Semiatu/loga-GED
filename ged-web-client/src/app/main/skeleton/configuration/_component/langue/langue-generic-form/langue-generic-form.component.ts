import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {GenericPersistenceComponent} from "../../../../../../../@externals/loga/_abstract";
import { Langue} from "../../../_model/langue";
import {LangueService} from "../../../_service/langue.serveice";
import {Paths} from "../../../../../../../environments/paths";
import {SnackBarService} from "../../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {FormBuilder, Validator, Validators} from "@angular/forms";
import {LangueFormResolver} from "../../../_resolver";

@Component({
    selector: 'langue-generic-form',
    templateUrl: './langue-generic-form.component.html',
    styleUrls: ['./langue-generic-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LangueGenericFormComponent extends GenericPersistenceComponent<Langue, number, LangueService> implements OnInit {

    @Input()
    action: string;

    @Input()
    langue: Langue;

    @Output()
    save: EventEmitter<Langue> = new EventEmitter();

    @Output()
    update: EventEmitter<Langue> = new EventEmitter();

    icon = 'extension';
    componentName;
    passwordConfirm = null;
    baseLink = Paths.configurationPath('langues');


    constructor(
        protected _notificationService: SnackBarService,
        protected _service: LangueService,
        protected _translateService: TranslateService,
        protected _router: Router,
        protected _formBuilder: FormBuilder,
        protected langueResolver: LangueFormResolver,
    ) {
        super(_notificationService, null, _translateService, _service, _router);
    }



    ngOnInit(): void {
        const key = this.action === 'edit' ? 'EDIT_TITLE' : 'ADD_TITLE';
        this._translateService.get('APP.USER.' + key).subscribe(title => {
            this.componentName = title;
        });
        if (!this.langue) {
            this.langue = new Langue();
        }

        this.buildForm();
        this.setFormData(this.langue);
        this.subscribe();
    }

    private setFormData(langue: Langue): void {
        this.ctrlSetValue('nom', langue.nom);

    }

    protected buildForm(): void {
        this.form = this._formBuilder.group({
            nom: [this.langue.nom, this.strRequiredMinMax],
        });
    }

    private subscribe(): void {
        if (!this.form) {
            this.buildForm();
        }
        this.subCtrlVC('nom', value => this.langue.nom = value);
    }

    _save(): void {
        this.save.emit(this.langue);
    }

    _update(): void {
        this.update.emit(this.langue);
    }

}
