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
import {Langue} from "../../../_model/langue";
// SERVICE
import {LangueService} from "../../../_service/langue.serveice";
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
// CRITERIA
import { LangueCriteria } from 'src/app/main/skeleton/configuration/_criteria';
// RESOLVER
import { LangueListResolver } from 'src/app/main/skeleton/configuration/_resolver';
// DATASOURCE
import { LangueDatasource } from 'src/app/main/skeleton/configuration/_datasource';
import {Router} from "@angular/router";

@Component({
    selector: 'langue-list',
    templateUrl: './langue-list.component.html',
    styleUrls: ['./langue-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LangueListComponent extends GenericListComponent<Langue, LangueService> implements OnInit, OnDestroy {

    displayedColumns = ['id', 'nom', 'createdBy','lastModifiedDate', 'actions'];

    icon = 'langue';
    criteria: LangueCriteria = new LangueCriteria();
    baseLink = Paths.configurationPath('langues');
    displayLink = this.baseLink + '/display';

    private _unsubscribeAll: Subject<any>;

    constructor(
        protected _notificationService: SnackBarService,
        protected _dialogService: DialogService,
        protected _translateService: TranslateService,
        protected _service: LangueService,
        private langueResolver: LangueListResolver,
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
        this.criteria = new LangueCriteria();
        this.dataSource = this.initialDataSource;
    }

    delete(component): void {
        super.delete(component, 'cet element');
    }

    private initData(): void {
        this.totalElements = this.langueResolver.total;
        this.dataSource = new LangueDatasource(this.langueResolver.langues, this.langueResolver.onLanguesChanged,
            this.paginator, this.sort);
        this.initialDataSource = this.dataSource;
    }

}
