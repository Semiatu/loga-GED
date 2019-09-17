// MAIN
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
// ABSTRACT AND UTILITY
import {GenericPersistenceComponent} from 'src/@externals/loga/_abstract';
import {Paths} from 'src/environments/paths';
// MODEL
import {Langue} from "../../../_model/langue";
import {TranslateService} from '@ngx-translate/core';
import {SnackBarService} from 'src/@externals/loga/snack-bar/snack.bar.service';
// RESOLVER

import {MatPaginator, MatSort} from '@angular/material';
import {fuseAnimations} from '../../../../../../../@externals/fuse/@fuse/animations';
import {DialogService} from '../../../../../../../@externals/loga/dialog/dialog.service';
import {LangueService} from "../../../_service/langue.serveice";
import {LangueDisplayResolver} from '../../../_resolver/langue/langue.display.resolver';

@Component({
    selector: 'langue-display-form',
    templateUrl: './langue-display-form.component.html',
    styleUrls: ['./langue-display-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LangueDisplayFormComponent extends GenericPersistenceComponent<Langue, number, LangueService> implements OnInit {
    langue: Langue;
    icon = 'reorder';
    baseLink = Paths.configurationPath('langues');
    totalElements = 0;
    row = 10;
    componentName = 'Langue';

    langueEditLink: any;
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
        protected _service: LangueService,
        protected _translateService: TranslateService,
        protected _router: Router,
        protected _formBuilder: FormBuilder,
        protected clientResolver: LangueDisplayResolver,
    ) {
        super(_notificationService, dialogService, _translateService, _service, _router);
    }


    ngOnInit(): void {
        this.langue = this.clientResolver.langue;
        this.langueEditLink = '/' + Paths.configurationPath('langues/' + this.langue.id);
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
        component = this.langue;
        paramValue = 'ce Langue';
        this.showLoading();
        this._translateService.get(['APP.DELETE_CONFIRM', 'APP.SUCCESS', 'APP.DELETE'], {value: paramValue})
            .subscribe(values => {
                const matDialogRef = this._dialogService.openConfirmDialog(values['APP.DELETE_CONFIRM']);
                matDialogRef.afterClosed().subscribe(response => {
                    if (response) {
                        this._service.delete(component.id).subscribe(value => {
                                this._service.findAllPage(0, this.row).subscribe(data => {
                                    this.navigateToList(values['APP.SUCCESS'], values['APP.DELETE'], Paths.configurationPath('langues'));
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
