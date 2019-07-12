import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {GenericListComponent} from "../../../../../../../@externals/loga/_abstract";
import {Document} from "../../../_model";
import {DocumentService} from "../../../_service";
import {ConfigurationModule} from "../../../configuration.module";
import {DocumentCriteria} from "../../../_criteria";
import {Paths} from "../../../../../../../environments/paths";
import {fromEvent, Subject} from "rxjs";
import {SnackBarService} from "../../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {DialogService} from "../../../../../../../@externals/loga/dialog/dialog.service";
import {TranslateService} from "@ngx-translate/core";
import {DocumentListResolver} from "../../../_resolver";
import {debounceTime, distinctUntilChanged, takeUntil} from "rxjs/operators";
import {Helpers} from "../../../../../../../@externals/loga/_utility";
import {DocumentDatasource} from "../../../_datasource";
import {fuseAnimations} from "../../../../../../../@externals/fuse/@fuse/animations";
import {ActivatedRoute, ActivatedRouteSnapshot} from "@angular/router";

@Component({
    selector: 'document-list',
    templateUrl: './document-list.component.html',
    styleUrls: ['./document-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DocumentListComponent extends GenericListComponent<Document, DocumentService> implements OnInit, OnDestroy {

    displayedColumns = ['id', 'createdBy', 'createdDate', 'lastModifiedBy', 'lastModifiedDate', 'nom', 'description', 'taille', 'auteur', 'format', 'version', 'url' ,'actions'];

    conf: ConfigurationModule
    icon = 'description';
    criteria: DocumentCriteria = new DocumentCriteria();
    baseLink = Paths.configurationPath('documents');
    displayLink = this.baseLink + '/display';
    dossierID: string;

    private _unsubscribeAll: Subject<any>;

    constructor(
        protected _notificationService: SnackBarService,
        protected _dialogService: DialogService,
        protected _translateService: TranslateService,
        protected _service: DocumentService,
        private documentResolver: DocumentListResolver,
        private activatedRoute: ActivatedRoute
    ) {
        super(_notificationService, _dialogService, _translateService, _service);
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {

        this.dossierID = this.activatedRoute.snapshot.params['id'];
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
        this.criteria = new DocumentCriteria();
        this.dataSource = this.initialDataSource;
    }

    delete(component): void {
        this.showLoading();
        this._translateService.get(['APP.DELETE_CONFIRM', 'APP.SUCCESS', 'APP.DELETE'], { value: 'cet element' })
            .subscribe(values => {
                const matDialogRef = this._dialogService.openConfirmDialog(values['APP.DELETE_CONFIRM']);
                matDialogRef.afterClosed().subscribe(response => {
                    if (response) {
                        this._service.delete(component.id).subscribe(value => {
                            this._service.findByDossier(this.dossierID, 0, this.row).subscribe(data => {
                                this.reload(Helpers.getOthers(data));
                                this.initialDataSource = this.dataSource;
                                this._notificationService.open(values['APP.SUCCESS'], values['APP.DELETE']);
                                this.hideLoading();
                            });
                        }, error => {
                            this.showError(error);
                        });
                    }
                });
            });
    }

    private initData(): void {
        this.totalElements = this.documentResolver.total;
        this.dataSource = new DocumentDatasource(this.documentResolver.documents, this.documentResolver.onDocumentsChanged,
            this.paginator, this.sort);
        this.initialDataSource = this.dataSource;
    }

}
