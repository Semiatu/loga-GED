// MAIN
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// ABSTRACT AND UTILITY
import { GenericPersistenceComponent } from 'src/@externals/loga/_abstract';
import { Paths } from 'src/environments/paths';
import { Router } from '@angular/router';
// MODEL
import {Categorie} from "../../../_model/categorie";
// SERVICE
import { CategorieService } from 'src/app/main/skeleton/configuration/_service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
// RESOLVER
import { CategorieFormResolver } from 'src/app/main/skeleton/configuration/_resolver';


@Component({
    selector: 'categorie-form',
    templateUrl: './categorie-form.component.html',
    styleUrls: ['./categorie-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CategorieFormComponent extends GenericPersistenceComponent<Categorie, number, CategorieService> implements OnInit {

    action = 'add';
    categorie: Categorie;

    constructor(protected _notificationService: SnackBarService,
                protected _dialogService: DialogService,
                protected _translateService: TranslateService,
                protected _service: CategorieService,
                protected router: Router,
                protected categorieResolver: CategorieFormResolver,
    ) {
        super(_notificationService, _dialogService, _translateService, _service, router);
    }

    ngOnInit(): void {
        if (this.categorieResolver.categorie) {
            this.categorie = this.categorieResolver.categorie;
            this.action = 'edit';
        }
    }

    save(categorie: any): void {
        this.addSub(
            this._service.save(categorie).subscribe(value => {
                this._translateService.get(['APP.SUCCESS', 'APP.ADD']).subscribe(values => {
                    this.navigateToList(values['APP.SUCCESS'], values['APP.ADD'], Paths.configurationPath('categories'));
                });
            }, error => {
                this.showError(error);
            })
        );
    }

    update(categorie: any): void {
        this.addSub(
            this._service.update(categorie.id, categorie).subscribe(value => {
                this._translateService.get(['APP.SUCCESS', 'APP.UPDATE']).subscribe(values => {
                    this.navigateToList(values['APP.SUCCESS'], values['APP.UPDATE'], Paths.configurationPath('categories'));
                });
            }, error => {
                this.showError(error);
            })
        );
    }
}
