import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from "../../../../../../../@externals/fuse/@fuse/animations";
import {GenericPersistenceComponent} from "../../../../../../../@externals/loga/_abstract";
import {Dossier} from "../../../_model";
import {DossierService} from "../../../_service";
import {Paths} from "../../../../../../../environments/paths";
import {MatPaginator, MatSort} from "@angular/material";
import {SnackBarService} from "../../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {DialogService} from "../../../../../../../@externals/loga/dialog/dialog.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {DossierDisplayResolver} from "../../../_resolver/dossier/dossier.display.resolver";

@Component({
    selector: 'dossier-display-form',
    templateUrl: './dossier-display-form.component.html',
    styleUrls: ['./dossier-display-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DossierDisplayFormComponent extends GenericPersistenceComponent<Dossier, number, DossierService> implements OnInit {
    dossier: Dossier;
    icon = 'reorder';
    baseLink = Paths.configurationPath('dossiers');
    totalElements = 0;
    row = 10;
    componentName = 'Dossier';

    dossierEditLink: any;
    @ViewChild('paginator')
    paginator: MatPaginator;

    @ViewChild('filter')
    filter: ElementRef;

    @ViewChild(MatSort)
    sort: MatSort;

    private DEFAULT = 'Non renseigné';

    constructor(
        protected _notificationService: SnackBarService,
        protected dialogService: DialogService,
        protected _service: DossierService,
        protected _translateService: TranslateService,
        protected _router: Router,
        protected _formBuilder: FormBuilder,
        protected clientResolver: DossierDisplayResolver,
    ) {
        super(_notificationService, dialogService, _translateService, _service, _router);
    }


    ngOnInit(): void {
        this.dossier = this.clientResolver.dossier;
        this.dossierEditLink = '/' + Paths.configurationPath('dossiers/' + this.dossier.id);
    }

    private next(details: any[], page): any {
        if (!details) {
            return [];
        }
        if (page < 0) {
            page = 0;
        }
        const length = details.length;
        const start = page * this.row;
        let end = start + this.row;
        if (end > length) {
            end = length;
        }
        return details.slice(start, end);
    }


// EMPLOYEE INFORMATION

    delete(component?: any, paramValue?: any): void {
        component = this.dossier;
        paramValue = 'cet Dossier';
        this.showLoading();
        this._translateService.get(['APP.DELETE_CONFIRM', 'APP.SUCCESS', 'APP.DELETE'], {value: paramValue})
            .subscribe(values => {
                const matDialogRef = this._dialogService.openConfirmDialog(values['APP.DELETE_CONFIRM']);
                matDialogRef.afterClosed().subscribe(response => {
                    if (response) {
                        this._service.delete(component.id).subscribe(value => {
                                this._service.findAllPage(0, this.row).subscribe(data => {
                                    this.navigateToList(values['APP.SUCCESS'], values['APP.DELETE'], Paths.configurationPath('dossiers'));
                                    this.hideLoading();
                                });
                            }, error => {
                                this.showError(error);
                            },
                        );
                    }
                });
            });
    }


}

