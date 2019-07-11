import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GenericPersistenceComponent} from "../../../../../../../@externals/loga/_abstract";
import {Dossier} from "../../../_model";
import {DossierService} from "../../../_service";
import {SnackBarService} from "../../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {DialogService} from "../../../../../../../@externals/loga/dialog/dialog.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {DossierFormResolver} from "../../../_resolver";
import {Paths} from "../../../../../../../environments/paths";
import {fuseAnimations} from "../../../../../../../@externals/fuse/@fuse/animations";

@Component({
    selector: 'dossier-form',
    templateUrl: './dossier-form.component.html',
    styleUrls: ['./dossier-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DossierFormComponent extends GenericPersistenceComponent<Dossier, number, DossierService> implements OnInit {


    action = 'add';
    dossier: Dossier;

    constructor(protected _notificationService: SnackBarService,
                protected _dialogService: DialogService,
                protected _translateService: TranslateService,
                protected _service: DossierService,
                protected router: Router,
                protected dossierResolver: DossierFormResolver,
    ) {
        super(_notificationService, _dialogService, _translateService, _service, router);
    }

    ngOnInit(): void {
        if (this.dossierResolver.dossier) {
            this.dossier = this.dossierResolver.dossier;
            this.action = 'edit';
        }
    }

    save(dossier: any): void {
        this.addSub(
            this._service.save(dossier).subscribe(value => {
                this._translateService.get(['APP.SUCCESS', 'APP.ADD']).subscribe(values => {
                    this.navigateToList(values['APP.SUCCESS'], values['APP.ADD'], Paths.configurationPath('dossiers'));
                });
            }, error => {
                this.showError(error);
            })
        );
    }

    update(dossier: any): void {
        this.addSub(
            this._service.update(dossier.id, dossier).subscribe(value => {
                this._translateService.get(['APP.SUCCESS', 'APP.UPDATE']).subscribe(values => {
                    this.navigateToList(values['APP.SUCCESS'], values['APP.UPDATE'], Paths.configurationPath('dossiers'));
                });
            }, error => {
                this.showError(error);
            })
        );
    }
}
