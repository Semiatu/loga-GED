// MAIN
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
// ABSTRACT AND UTILITY
import {GenericPersistenceComponent} from 'src/@externals/loga/_abstract';
import {Paths} from 'src/environments/paths';
// MODEL
import {Categorie} from "../../../_model/categorie";
import {TranslateService} from '@ngx-translate/core';
import {SnackBarService} from 'src/@externals/loga/snack-bar/snack.bar.service';
// RESOLVER

import {MatPaginator, MatSort} from '@angular/material';
import {fuseAnimations} from '../../../../../../../@externals/fuse/@fuse/animations';
import {DialogService} from '../../../../../../../@externals/loga/dialog/dialog.service';
import {CategorieService} from '../../../_service';
import {CategorieDisplayResolver} from '../../../_resolver/categorie/categorie.display.resolver';

@Component({
    selector: 'categorie-display-form',
    templateUrl: './categorie-display-form.component.html',
    styleUrls: ['./categorie-display-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CategorieDisplayFormComponent extends GenericPersistenceComponent<Categorie, number, CategorieService> implements OnInit {
    categorie: Categorie;
    icon = 'reorder';
    baseLink = Paths.configurationPath('categories');
    totalElements = 0;
    row = 10;
    componentName = 'Categorie';

    categorieEditLink: any;
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
        protected _service: CategorieService,
        protected _translateService: TranslateService,
        protected _router: Router,
        protected _formBuilder: FormBuilder,
        protected clientResolver: CategorieDisplayResolver,
    ) {
        super(_notificationService, dialogService, _translateService, _service, _router);
    }


    ngOnInit(): void {
        this.categorie = this.clientResolver.categorie;
        this.categorieEditLink = '/' + Paths.configurationPath('categories/' + this.categorie.id);
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
        component = this.categorie;
        paramValue = 'ce Categorie';
        this.showLoading();
        this._translateService.get(['APP.DELETE_CONFIRM', 'APP.SUCCESS', 'APP.DELETE'], {value: paramValue})
            .subscribe(values => {
                const matDialogRef = this._dialogService.openConfirmDialog(values['APP.DELETE_CONFIRM']);
                matDialogRef.afterClosed().subscribe(response => {
                    if (response) {
                        this._service.delete(component.id).subscribe(value => {
                                this._service.findAllPage(0, this.row).subscribe(data => {
                                    this.navigateToList(values['APP.SUCCESS'], values['APP.DELETE'], Paths.configurationPath('categories'));
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
