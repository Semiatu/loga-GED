import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Paths} from "../../../../../../environments/paths";
import {Helpers} from "../../../../../../@externals/loga/_utility";
import {fuseAnimations} from "../../../../../../@externals/fuse/@fuse/animations";
import {GenericListComponent} from "../../../../../../@externals/loga/_abstract";
import {Document, Dossier, Raccourci} from "../../_model";
import {DocumentService, DossierService, UploadService} from "../../_service";
import {MatDialog, MatTableDataSource} from "@angular/material";
import {ConfigurationModule} from "../../configuration.module";
import {DossierCriteria} from "../../_criteria";
import {SnackBarService} from "../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {DialogService} from "../../../../../../@externals/loga/dialog/dialog.service";
import {TranslateService} from "@ngx-translate/core";
import {RaccourciService} from "../../_service/raccourci.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {CorbeilleListResolver} from "../../_resolver/dossier/corbeille.list.resolver";
import {RaccourciType} from "../../_model/RaccourciType";
import {SelectionModel} from "@angular/cdk/collections";
import {ContenuDossierWrapper} from "../../wrapper/contenu-dossier-wrapper";


@Component({
    selector: 'corbeille-list',
    templateUrl: './corbeille-list.component.html',
    styleUrls: ['./corbeille-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CorbeilleListComponent extends GenericListComponent<Dossier, DossierService> implements OnInit {

    displayedColumns = ['select','id', 'nom', 'type', 'lastModifiedDate', 'actions'];

    public myDataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(true, []);

    conf: ConfigurationModule;
    icon = 'folder';
    criteria: DossierCriteria = new DossierCriteria();
    baseLink = Paths.configurationPath('dossiers');
    contenuDossierWrapper: ContenuDossierWrapper = new ContenuDossierWrapper();

    constructor(
        protected _notificationService: SnackBarService,
        protected _dialogService: DialogService,
        protected _translateService: TranslateService,
        protected _raccourciService: RaccourciService,
        protected _service: DossierService,
        private corbeilleListResolver: CorbeilleListResolver,
        private documentService: DocumentService,
        public router: Router,
        public uploadService: UploadService,
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
        let  documentListSupprimer: Document[] = [];
        this.showLoading();
        this._translateService.get(['APP.DELETE_CONFIRM', 'APP.SUCCESS', 'APP.DELETE'], {value: 'cet element'})
            .subscribe(values => {
                const matDialogRef = this._dialogService.openConfirmDialog(values['APP.DELETE_CONFIRM']);
                matDialogRef.afterClosed().subscribe(response => {
                    if (response) {
                        this.getService(component).delete(component.id).subscribe(value => {
                            if (this.isDossier(component)) {
                                documentListSupprimer =  Helpers.getOthers(value);
                                documentListSupprimer.forEach(document => this.uploadService.deleteFileUpload(document));
                            }
                            if (this.isDocument(component)) {
                               this.uploadService.deleteFileUpload(component)
                            }
                            this._notificationService.open(values['APP.SUCCESS'], values['APP.DELETE']);
                            this.getCorbeilleContent();
                        }, error => {
                            this.showError(error);
                        })
                    }
                });
            });
    }

    deleteFirbaseDocument(document): void {
        this.uploadService.deleteFileUpload(document);
    }

    private initData(): void {
        this.myDataSource = new MatTableDataSource<any>();
        this.myDataSource.data = this.corbeilleListResolver.mapwrapper;
    }

    isDocument(object) {
        return object.hasOwnProperty('url');
    }

    isRaccourci(object) {
        return !this.isDocument(object) && (object.hasOwnProperty('document') || object.hasOwnProperty('dossier'));
    }

    isDossier(object) {
        return !this.isDocument(object) && !this.isRaccourci(object);
    }
    isRaccourciOfDocument(object){
        return this.isRaccourci(object) && object.type === RaccourciType.DOCUMENT;
    }

    isRaccourciOfDossier(object) {
        return this.isRaccourci(object) && object.type === RaccourciType.DOSSIER;
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

    //Si le nombre d'éléments sélectionnés correspond au nombre total de lignes.
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.myDataSource.data.length;
        return numSelected == numRows;
    }

    // Sélectionne toutes les lignes si elles ne sont pas toutes sélectionnées. sinon, libere la selection.
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.myDataSource.data.forEach(row => this.selection.select(row));
    }
    // Le libellé de la case à cocher sur la ligne passée.
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }

        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    // supprimer tout les element cochés
    public restaureAllSelected() {

        console.log('ok');
        this.selection.selected.forEach(value => {
            if (this.isDossier(value)) {
                this.contenuDossierWrapper.dossiers.push(value);
            }
            if (this.isDocument(value)) {
                this.contenuDossierWrapper.documents.push(value);
            }
            if (this.isRaccourci(value)) {
                this.contenuDossierWrapper.raccourcis.push(value);
            }
        });

        this._service.restaureAllSelected(this.contenuDossierWrapper).subscribe(response => {
            this.getCorbeilleContent();
            this.selection.clear();
        });
    }

    public addToWrapper() {
        this.contenuDossierWrapper = new ContenuDossierWrapper();
        this.selection.selected.forEach(value => {
            if (this.isDossier(value)) {
                this.contenuDossierWrapper.dossiers.push(value);
            }
            if (this.isDocument(value)) {
                this.contenuDossierWrapper.documents.push(value);
            }
            if (this.isRaccourci(value)) {
                this.contenuDossierWrapper.raccourcis.push(value);
            }
        });
    }

    public deleteAll(){
        this.addToWrapper();
        this._service.deleteAll(this.contenuDossierWrapper).subscribe(value => {
            let documents = [];
             documents = Helpers.getListOthers(value);
            documents.forEach(value1 => this.deleteFirbaseDocument(value1));
            this.getCorbeilleContent();
            this.selection.clear();
        })
    }
}



