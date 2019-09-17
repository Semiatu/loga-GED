// MAIN
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { fuseAnimations } from 'src/@externals/fuse/@fuse/animations';
// ABSTRACT AND UTILITY
import { GenericListComponent } from 'src/@externals/loga/_abstract';
import { Helpers } from 'src/@externals/loga/_utility';
import { Paths } from 'src/environments/paths';
// MODEL
import {Categorie} from "../../../_model/categorie";
// SERVICE
import { CategorieService } from 'src/app/main/skeleton/configuration/_service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
// CRITERIA
import { CategorieCriteria } from 'src/app/main/skeleton/configuration/_criteria';
// RESOLVER
import { CategorieListResolver } from 'src/app/main/skeleton/configuration/_resolver';
// DATASOURCE
import { CategorieDatasource } from 'src/app/main/skeleton/configuration/_datasource';
import {Router} from "@angular/router";

@Component({
    selector: 'categorie-list',
    templateUrl: './categorie-list.component.html',
    styleUrls: ['./categorie-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CategorieListComponent extends GenericListComponent<Categorie, CategorieService> implements OnInit, OnDestroy {

    displayedColumns = ['id', 'nom', 'createdBy','lastModifiedDate', 'actions'];

    icon = 'library_books';
    criteria: CategorieCriteria = new CategorieCriteria();
    baseLink = Paths.configurationPath('categories');
    displayLink = this.baseLink + '/display';

    private _unsubscribeAll: Subject<any>;

    constructor(
        protected _notificationService: SnackBarService,
        protected _dialogService: DialogService,
        protected _translateService: TranslateService,
        protected _service: CategorieService,
        private categorieResolver: CategorieListResolver,
        public router: Router,
    ) {
        super(_notificationService, _dialogService, _translateService, _service);
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.initData();
        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(150), distinctUntilChanged())
            .subscribe(() => {
                if (!this.dataSource) {
                    return;
                }
                this.dataSource.filter = this.filter.nativeElement.value;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    search(page: number): void {
        this.showLoading();
        this._service.search(this.criteria, page, this.row).subscribe(data => {
            this.totalElements = Helpers.getTotalElements(data);
            const value = Helpers.getOthers(data);
            this.reload(value);
            this.hideLoading();
        });
    }

    refresh(): void {
        this.criteria = new CategorieCriteria();
        this.dataSource = this.initialDataSource;
    }

    delete(component): void {
        super.delete(component, 'cet element');
    }

    private initData(): void {
        this.totalElements = this.categorieResolver.total;
        this.dataSource = new CategorieDatasource(this.categorieResolver.categories, this.categorieResolver.onCategoriesChanged,
            this.paginator, this.sort);
        this.initialDataSource = this.dataSource;
    }

}
