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
import {Revision} from "../../../_model/revision";
// SERVICE
import { RevisionService } from 'src/app/main/skeleton/configuration/_service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
// CRITERIA
import { RevisionCriteria } from 'src/app/main/skeleton/configuration/_criteria';
// RESOLVER
import { RevisionListResolver } from "../../../_resolver/revision/revision.list.resolver";
// DATASOURCE
import { RevisionDatasource } from "../../../_datasource/revision.datasource";
import {Router} from "@angular/router";

@Component({
    selector: 'revision-list',
    templateUrl: './revision-list.component.html',
    styleUrls: ['./revision-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RevisionListComponent extends GenericListComponent<Revision, RevisionService> implements OnInit, OnDestroy {

    displayedColumns = ['id', 'versionPrecedente', 'createdBy','lastModifiedDate', 'actions'];

    icon = 'library_books';
    criteria: RevisionCriteria = new RevisionCriteria();
    baseLink = Paths.configurationPath('revisions');
    displayLink = this.baseLink + '/display';

    private _unsubscribeAll: Subject<any>;

    constructor(
        protected _notificationService: SnackBarService,
        protected _dialogService: DialogService,
        protected _translateService: TranslateService,
        protected _service: RevisionService,
        private revisionResolver: RevisionListResolver,
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
        this.criteria = new RevisionCriteria();
        this.dataSource = this.initialDataSource;
    }

    delete(component): void {
        super.delete(component, 'cet element');
    }

    private initData(): void {
        this.totalElements = this.revisionResolver.total;
        this.dataSource = new RevisionDatasource(this.revisionResolver.revisions, this.revisionResolver.onRevisionsChanged,
            this.paginator, this.sort);
        this.initialDataSource = this.dataSource;
    }

}
