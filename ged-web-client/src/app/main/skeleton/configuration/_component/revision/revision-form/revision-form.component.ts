// MAIN
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// ABSTRACT AND UTILITY
import { GenericPersistenceComponent } from 'src/@externals/loga/_abstract';
import { Paths } from 'src/environments/paths';
import { Router } from '@angular/router';
// MODEL
import {Revision} from "../../../_model/revision";
// SERVICE
import { RevisionService } from 'src/app/main/skeleton/configuration/_service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
// RESOLVER
import { RevisionFormResolver } from "../../../_resolver/revision/revision.form.resolver";


@Component({
    selector: 'revision-form',
    templateUrl: './revision-form.component.html',
    styleUrls: ['./revision-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class RevisionFormComponent extends GenericPersistenceComponent<Revision, number, RevisionService> implements OnInit {

    action = 'add';
    revision: Revision;

    constructor(protected _notificationService: SnackBarService,
                protected _dialogService: DialogService,
                protected _translateService: TranslateService,
                protected _service: RevisionService,
                protected router: Router,
                protected revisionResolver: RevisionFormResolver,
    ) {
        super(_notificationService, _dialogService, _translateService, _service, router);
    }

    ngOnInit(): void {
        if (this.revisionResolver.revision) {
            this.revision = this.revisionResolver.revision;
            this.action = 'edit';
        }
    }

    save(revision: any): void {
        this.addSub(
            this._service.save(revision).subscribe(value => {
                this._translateService.get(['APP.SUCCESS', 'APP.ADD']).subscribe(values => {
                    this.navigateToList(values['APP.SUCCESS'], values['APP.ADD'], Paths.configurationPath('revisions'));
                });
            }, error => {
                this.showError(error);
            })
        );
    }

    update(revision: any): void {
        this.addSub(
            this._service.update(revision.id, revision).subscribe(value => {
                this._translateService.get(['APP.SUCCESS', 'APP.UPDATE']).subscribe(values => {
                    this.navigateToList(values['APP.SUCCESS'], values['APP.UPDATE'], Paths.configurationPath('revisions'));
                });
            }, error => {
                this.showError(error);
            })
        );
    }
}
