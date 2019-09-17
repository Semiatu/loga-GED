import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {GenericPersistenceComponent} from "../../../../../../../@externals/loga/_abstract";
import { Revision} from "../../../_model/revision";
import {RevisionService} from "../../../_service";
import {Paths} from "../../../../../../../environments/paths";
import {SnackBarService} from "../../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {FormBuilder, Validator, Validators} from "@angular/forms";
import { RevisionFormResolver } from "../../../_resolver/revision/revision.form.resolver";

@Component({
    selector: 'revision-generic-form',
    templateUrl: './revision-generic-form.component.html',
    styleUrls: ['./revision-generic-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RevisionGenericFormComponent extends GenericPersistenceComponent<Revision, number, RevisionService> implements OnInit {

    @Input()
    action: string;

    @Input()
    revision: Revision;

    @Output()
    save: EventEmitter<Revision> = new EventEmitter();

    @Output()
    update: EventEmitter<Revision> = new EventEmitter();

    icon = 'extension';
    componentName;
    passwordConfirm = null;
    baseLink = Paths.configurationPath('revisions');


    constructor(
        protected _notificationService: SnackBarService,
        protected _service: RevisionService,
        protected _translateService: TranslateService,
        protected _router: Router,
        protected _formBuilder: FormBuilder,
        protected revisionResolver: RevisionFormResolver,
    ) {
        super(_notificationService, null, _translateService, _service, _router);
    }



    ngOnInit(): void {
        const key = this.action === 'edit' ? 'EDIT_TITLE' : 'ADD_TITLE';
        this._translateService.get('APP.USER.' + key).subscribe(title => {
            this.componentName = title;
        });
        if (!this.revision) {
            this.revision = new Revision();
        }

        this.buildForm();
        this.setFormData(this.revision);
        this.subscribe();
    }

    private setFormData(revision: Revision): void {
        this.ctrlSetValue('versionPrecedente', revision.versionPrecedente);

    }

    protected buildForm(): void {
        this.form = this._formBuilder.group({
            nom: [this.revision.versionPrecedente, this.strRequiredMinMax],
        });
    }

    private subscribe(): void {
        if (!this.form) {
            this.buildForm();
        }
        this.subCtrlVC('versionPrecedente', value => this.revision.versionPrecedente = value);
    }

    _save(): void {
        this.save.emit(this.revision);
    }

    _update(): void {
        this.update.emit(this.revision);
    }

}
