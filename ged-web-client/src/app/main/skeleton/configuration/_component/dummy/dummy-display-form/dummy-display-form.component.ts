// MAIN
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
// ABSTRACT AND UTILITY
import {GenericPersistenceComponent} from 'src/@externals/loga/_abstract';
import {Paths} from 'src/environments/paths';
// MODEL
import {Dummy} from '../../../_model';
import {TranslateService} from '@ngx-translate/core';
import {SnackBarService} from 'src/@externals/loga/snack-bar/snack.bar.service';
// RESOLVER

import {MatPaginator, MatSort} from '@angular/material';
import {fuseAnimations} from '../../../../../../../@externals/fuse/@fuse/animations';
import {DialogService} from '../../../../../../../@externals/loga/dialog/dialog.service';
import {DummyService} from '../../../_service';
import {DummyDisplayResolver} from '../../../_resolver/dummy/dummy.display.resolver';

@Component({
    selector: 'dummy-display-form',
    templateUrl: './dummy-display-form.component.html',
    styleUrls: ['./dummy-display-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DummyDisplayFormComponent extends GenericPersistenceComponent<Dummy, number, DummyService> implements OnInit {
    dummy: Dummy;
    icon = 'reorder';
    baseLink = Paths.configurationPath('dummies');
    totalElements = 0;
    row = 10; 
    componentName = 'Dummy';

    dummyEditLink: any;
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
        protected _service: DummyService,
        protected _translateService: TranslateService,
        protected _router: Router,
        protected _formBuilder: FormBuilder,
        protected clientResolver: DummyDisplayResolver,
    ) {
        super(_notificationService, dialogService, _translateService, _service, _router);
    }


    ngOnInit(): void {
        this.dummy = this.clientResolver.dummy;
        this.dummyEditLink = '/' + Paths.configurationPath('dummies/' + this.dummy.id);
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
        component = this.dummy;
        paramValue = 'ce Dummy';
        this.showLoading();
        this._translateService.get(['APP.DELETE_CONFIRM', 'APP.SUCCESS', 'APP.DELETE'], {value: paramValue})
            .subscribe(values => {
                const matDialogRef = this._dialogService.openConfirmDialog(values['APP.DELETE_CONFIRM']);
                matDialogRef.afterClosed().subscribe(response => {
                    if (response) {
                        this._service.delete(component.id).subscribe(value => {
                                this._service.findAllPage(0, this.row).subscribe(data => {
                                    this.navigateToList(values['APP.SUCCESS'], values['APP.DELETE'], Paths.configurationPath('dummies'));
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
