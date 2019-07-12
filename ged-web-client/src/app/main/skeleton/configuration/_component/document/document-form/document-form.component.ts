import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GenericPersistenceComponent} from "../../../../../../../@externals/loga/_abstract";
import {Document} from "../../../_model";
import {DocumentService} from "../../../_service";
import {SnackBarService} from "../../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {DialogService} from "../../../../../../../@externals/loga/dialog/dialog.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {DocumentFormResolver} from "../../../_resolver";
import {Paths} from "../../../../../../../environments/paths";

@Component({
    selector: 'document-form',
    templateUrl: './document-form.component.html',
    styleUrls: ['./document-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DocumentFormComponent extends GenericPersistenceComponent<Document, number, DocumentService> implements OnInit {


    action = 'add';
    document: Document;

    constructor(protected _notificationService: SnackBarService,
                protected _dialogService: DialogService,
                protected _translateService: TranslateService,
                protected _service: DocumentService,
                protected router: Router,
                protected documentResolver: DocumentFormResolver,
    ) {
        super(_notificationService, _dialogService, _translateService, _service, router);
    }

    ngOnInit(): void {
        if (this.documentResolver.document) {
            this.document = this.documentResolver.document;
            this.action = 'edit';
        }
    }

    save(document: Document): void {
        console.log(Paths.join( Paths.configurationPath('documents') , Paths.join('dossier', String(document.dossier.id))));
        this.addSub(
            this._service.save(document).subscribe(value => {
                this._translateService.get(['APP.SUCCESS', 'APP.ADD']).subscribe(values => {
                    this.navigateToList(values['APP.SUCCESS'], values['APP.ADD'], Paths.configurationPath('documents') + '/dossier/' + document.dossier.id );
                });
            }, error => {
                this.showError(error);
            })
        );
    }

    update(document: Document): void {
        this.addSub(
            this._service.update(document.id, document).subscribe(value => {
                this._translateService.get(['APP.SUCCESS', 'APP.UPDATE']).subscribe(values => {
                    this.navigateToList(values['APP.SUCCESS'], values['APP.UPDATE'],Paths.configurationPath('documents') + '/dossier/' + document.dossier.id );
                });
            }, error => {
                this.showError(error);
            })
        );
    }
}
