import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {GenericListComponent} from "../../../../../../../@externals/loga/_abstract";
import {Dossier} from "../../../_model";
import {DossierService} from "../../../_service";
import {ConfigurationModule} from "../../../configuration.module";
import {DossierCriteria} from "../../../_criteria";
import {Paths} from "../../../../../../../environments/paths";
import {fromEvent, Subject} from "rxjs";
import {SnackBarService} from "../../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {DialogService} from "../../../../../../../@externals/loga/dialog/dialog.service";
import {TranslateService} from "@ngx-translate/core";
import {DossierListResolver} from "../../../_resolver";
import {debounceTime, distinctUntilChanged, takeUntil} from "rxjs/operators";
import {Helpers} from "../../../../../../../@externals/loga/_utility";
import {DossierDatasource} from "../../../_datasource";
import {fuseAnimations} from "../../../../../../../@externals/fuse/@fuse/animations";
import {ActivatedRoute} from "@angular/router";
import {DossierDisplayResolver} from "../../../_resolver/dossier/dossier.display.resolver";

@Component({
    selector: 'dossier-list',
    templateUrl: './dossier-list.component.html',
    styleUrls: ['./dossier-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DossierListComponent extends GenericListComponent<Dossier, DossierService> implements OnInit, OnDestroy {

    displayedColumns = ['id', 'nom', 'taille', 'createdDate', 'lastModifiedDate', 'actions'];

    conf: ConfigurationModule
    icon = 'folder';
    criteria: DossierCriteria = new DossierCriteria();
    baseLink = Paths.configurationPath('dossiers');
    documentLink = Paths.configurationPath('documents');
    displayLink = this.baseLink + '/display';
    dossierID : string;
    dossier: Dossier;
    dossierEditLink: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        protected _notificationService: SnackBarService,
        protected _dialogService: DialogService,
        protected _translateService: TranslateService,
        protected _service: DossierService,
        private dossierResolver: DossierListResolver,
        protected clientResolver:  DossierDisplayResolver,
        private activatedRoute: ActivatedRoute,
    ) {
        super(_notificationService, _dialogService, _translateService, _service);
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.dossierID = this.activatedRoute.snapshot.params['idDossier'];
        this.dossier= this.clientResolver.dossier;
        this.dossierEditLink = '/' + Paths.configurationPath('dossiers/' + this. dossier.id);

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
        this.criteria = new DossierCriteria();
        this.dataSource = this.initialDataSource;
    }

    delete(component): void {
        super.delete(component, 'cet element');
    }

    private initData(): void {
        this.totalElements = this.dossierResolver.total;
        this.dataSource = new DossierDatasource(this.dossierResolver.dossiers, this.dossierResolver.onDossiersChanged,
            this.paginator, this.sort);
        this.initialDataSource = this.dataSource;
    }

}
