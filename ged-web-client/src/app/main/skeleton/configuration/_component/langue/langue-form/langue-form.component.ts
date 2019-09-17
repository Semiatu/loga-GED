// MAIN
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// ABSTRACT AND UTILITY
import { GenericPersistenceComponent } from 'src/@externals/loga/_abstract';
import { Paths } from 'src/environments/paths';
import { Router } from '@angular/router';
// MODEL
import {Langue} from "../../../_model/langue";
// SERVICE
import { LangueService } from "../../../_service/langue.serveice";
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
// RESOLVER
import { LangueFormResolver } from 'src/app/main/skeleton/configuration/_resolver';


@Component({
    selector: 'langue-form',
    templateUrl: './langue-form.component.html',
    styleUrls: ['./langue-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class LangueFormComponent extends GenericPersistenceComponent<Langue, number, LangueService> implements OnInit {

    action = 'add';
    langue: Langue;

    constructor(protected _notificationService: SnackBarService,
                protected _dialogService: DialogService,
                protected _translateService: TranslateService,
                protected _service: LangueService,
                protected router: Router,
                protected langueResolver: LangueFormResolver,
    ) {
        super(_notificationService, _dialogService, _translateService, _service, router);
    }

    ngOnInit(): void {
        if (this.langueResolver.langue) {
            this.langue = this.langueResolver.langue;
            this.action = 'edit';
        }
    }

    save(langue: any): void {
        this.addSub(
            this._service.save(langue).subscribe(value => {
                this._translateService.get(['APP.SUCCESS', 'APP.ADD']).subscribe(values => {
                    this.navigateToList(values['APP.SUCCESS'], values['APP.ADD'], Paths.configurationPath('langues'));
                });
            }, error => {
                this.showError(error);
            })
        );
    }

    update(langue: any): void {
        this.addSub(
            this._service.update(langue.id, langue).subscribe(value => {
                this._translateService.get(['APP.SUCCESS', 'APP.UPDATE']).subscribe(values => {
                    this.navigateToList(values['APP.SUCCESS'], values['APP.UPDATE'], Paths.configurationPath('langues'));
                });
            }, error => {
                this.showError(error);
            })
        );
    }
}
