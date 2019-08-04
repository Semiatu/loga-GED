import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Paths} from "../../../../../../environments/paths";
import {Helpers} from "../../../../../../@externals/loga/_utility";
import {fuseAnimations} from "../../../../../../@externals/fuse/@fuse/animations";
import {GenericListComponent} from "../../../../../../@externals/loga/_abstract";
import {Document, Dossier, Raccourci} from "../../_model";
import {DocumentService, DossierService} from "../../_service";
import {MatDialog, MatTableDataSource} from "@angular/material";
import {ConfigurationModule} from "../../configuration.module";
import {DossierCriteria} from "../../_criteria";
import {Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SnackBarService} from "../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {DialogService} from "../../../../../../@externals/loga/dialog/dialog.service";
import {TranslateService} from "@ngx-translate/core";
import {RaccourciService} from "../../_service/raccourci.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {DossierDisplayResolver} from "../../_resolver/dossier/dossier.display.resolver";
import {RaccourciGenericFormComponent} from "../dossier/raccourci-generic-form/raccourci-generic-form.component";
import {RaccourciType} from "../../_model/RaccourciType";
import {CorbeilleListResolver} from "../../_resolver/dossier/corbeille.list.resolver";


@Component({
    selector: 'corbeille-list',
    templateUrl: './corbeille-list.component.html',
    styleUrls: ['./corbeille-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CorbeilleListComponent extends GenericListComponent<Dossier, DossierService> implements OnInit {

    displayedColumns = ['id', 'nom', 'type', 'lastModifiedDate', 'actions'];

    public myDataSource = new MatTableDataSource<any>();

    conf: ConfigurationModule;
    icon = 'folder';
    criteria: DossierCriteria = new DossierCriteria();
    baseLink = Paths.configurationPath('dossiers');


    constructor(
        protected _notificationService: SnackBarService,
        protected _dialogService: DialogService,
        protected _translateService: TranslateService,
        protected _raccourciService: RaccourciService,
        protected _service: DossierService,
        private corbeilleListResolver: CorbeilleListResolver,
        private documentService: DocumentService,
        public router: Router,
    ) {
        super(_notificationService, _dialogService, _translateService, _service);
    }

    ngOnInit(): void {
        this.initData();
        this.myDataSource.data = this.corbeilleListResolver.mapwrapper;
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

    restaurer(component): void {
        this.getService(component).restaurer(component.id).subscribe(value => {
            this.getCorbeilleContent();
        });
    }

    getService(component) {
        if (this.isDocument(component)) return this.documentService;
        if (this.isDossier(component)) return this._service;
        if (this.isRaccourci(component)) return this._raccourciService;
    }

    delete(component): void {
        this.showLoading();
        this._translateService.get(['APP.DELETE_CONFIRM', 'APP.SUCCESS', 'APP.DELETE'], {value: 'cet element'})
            .subscribe(values => {
                const matDialogRef = this._dialogService.openConfirmDialog(values['APP.DELETE_CONFIRM']);
                matDialogRef.afterClosed().subscribe(response => {
                    if (response) {
                        this.getService(component).delete(component.id).subscribe(value => {
                            this._notificationService.open(values['APP.SUCCESS'], values['APP.DELETE']);
                            this.getCorbeilleContent();
                        }, error => {
                            this.showError(error);
                        })
                    }
                });
            });
    }


    private initData(): void {
        this.myDataSource = new MatTableDataSource<any>();
        this.myDataSource.data = this.corbeilleListResolver.mapwrapper;
    }

    // si url dans document alors document sinon dossier
    isDocument(object) {
        return object.hasOwnProperty('url');
    }

    isRaccourci(object) {
        return !this.isDocument(object) && (object.hasOwnProperty('document') || object.hasOwnProperty('dossier'));
    }

    isDossier(object) {
        return !this.isDocument(object) && !this.isRaccourci(object);
    }

    // recuperer le contenu de la corbeille
    protected getCorbeilleContent() {
        this._service.getCorbeilleContent()
            .subscribe(response => {
                const wrapper = Helpers.getOthers(response);
                let mapwrapper = [];
                mapwrapper.push(...wrapper.dossiers)
                mapwrapper.push(...wrapper.documents)
                mapwrapper.push(...wrapper.raccourcis)
                this.myDataSource.data = mapwrapper;
            });
    }
}



