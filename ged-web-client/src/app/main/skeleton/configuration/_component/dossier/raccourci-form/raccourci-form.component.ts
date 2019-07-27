// MAIN
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// ABSTRACT AND UTILITY
import { GenericPersistenceComponent } from 'src/@externals/loga/_abstract';
import { Paths } from 'src/environments/paths';
import { Router } from '@angular/router';
// MODEL
import { Raccourci } from 'src/app/main/skeleton/configuration/_model';
// SERVICE
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
import {RaccourciService} from "../../../_service/raccourci.service";
import {RaccourciFormResolver} from "../../../_resolver/dossier/raccourci.form.resolver";
// RESOLVER

@Component({
    selector: 'raccourci-form',
    templateUrl: './raccourci-form.component.html',
    styleUrls: ['./raccourci-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class RaccourciFormComponent extends GenericPersistenceComponent<Raccourci, number, RaccourciService> implements OnInit {

    action = 'add';
    raccourci: Raccourci;

    constructor(protected _notificationService: SnackBarService,
                protected _dialogService: DialogService,
                protected _translateService: TranslateService,
                protected _service: RaccourciService,
                protected router: Router,
                protected raccourciResolver: RaccourciFormResolver,
    ) {
        super(_notificationService, _dialogService, _translateService, _service, router);
    }

    ngOnInit(): void {
        if (this.raccourciResolver.raccourci) {
            this.raccourci = this.raccourciResolver.raccourci;
            this.action = 'edit';
        }
    }

    save(raccourci: any): void {
        this.addSub(
            this._service.save(raccourci).subscribe(value => {
                this._translateService.get(['APP.SUCCESS', 'APP.ADD']).subscribe(values => {
                    this.navigateToList(values['APP.SUCCESS'], values['APP.ADD'], Paths.configurationPath('raccourcis'));
                });
            }, error => {
                this.showError(error);
            })
        );
    }

    update(raccourci: any): void {
        this.addSub(
            this._service.update(raccourci.id, raccourci).subscribe(value => {
                this._translateService.get(['APP.SUCCESS', 'APP.UPDATE']).subscribe(values => {
                    this.navigateToList(values['APP.SUCCESS'], values['APP.UPDATE'], Paths.configurationPath('raccourcis'));
                });
            }, error => {
                this.showError(error);
            })
        );
    }
}
