import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from "../../../../../../../@externals/fuse/@fuse/animations";
import {GenericListComponent} from "../../../../../../../@externals/loga/_abstract";
import {Document, Dossier} from "../../../_model";
import {DocumentService, DossierService} from "../../../_service";
import {ConfigurationModule} from "../../../configuration.module";
import {DossierCriteria} from "../../../_criteria";
import {Paths} from "../../../../../../../environments/paths";
import {fromEvent, Subject, Subscription} from "rxjs";
import {SnackBarService} from "../../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {DialogService} from "../../../../../../../@externals/loga/dialog/dialog.service";
import {TranslateService} from "@ngx-translate/core";
import {ContentListResolver, DossierListResolver} from "../../../_resolver";
import {Helpers} from "../../../../../../../@externals/loga/_utility";
import {MatTableDataSource} from "@angular/material";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {DossierDisplayResolver} from "../../../_resolver/dossier/dossier.display.resolver";
import {ContenuDossierWrapper} from "../../../wrapper/contenu-dossier-wrapper";

@Component({
    selector: 'content-list',
    templateUrl: './content-list.component.html',
    styleUrls: ['./content-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ContentListComponent extends GenericListComponent<Dossier, DossierService> implements OnInit, OnDestroy {

    displayedColumns = ['id', 'nom', 'type', 'taille', 'createdDate', 'lastModifiedDate', 'actions'];

    public myDataSource = new MatTableDataSource<any>();

    conf: ConfigurationModule
    icon = 'folder';
    criteria: DossierCriteria = new DossierCriteria();
    baseLink = Paths.configurationPath('dossiers');
    documentLink = Paths.configurationPath('documents');
    displayLink = this.baseLink + '/display';
    dossier: Dossier = new Dossier();
    dossierID: string;
    file = File = null;
    dossierEditLink: any;
    dossierNewLink: any;
    parentLink = Paths.configurationPath('dossiers');
    contentLink: any;
    subscription: Subscription;

    listsParent = [];
    private _unsubscribeAll: Subject<any>;


    constructor(
        protected _notificationService: SnackBarService,
        protected _dialogService: DialogService,
        protected _translateService: TranslateService,
        protected _service: DossierService,
        private contentListResolver: ContentListResolver,
        private documentService: DocumentService,
        private activatedRoute: ActivatedRoute,
        protected clientResolver: DossierDisplayResolver,
        public router: Router
    ) {
        super(_notificationService, _dialogService, _translateService, _service);
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.dossierID = this.activatedRoute.snapshot.params['id'];
        this.dossier = this.clientResolver.dossier;
        this.dossierNewLink = Paths.configurationPath('dossiers') + '/new/' + this.dossierID;
        this.initData();
        this.myDataSource.data = this.contentListResolver.mapwrapper;
        this.dossier = this.contentListResolver.dossier;
        console.log(this.contentListResolver.mapwrapper);


        this.subscription = this.router.events.subscribe((event) => {
            /* console.log(this.router.routerState.root);
             console.log(this.router.routerState.root.firstChild);
             console.log(this.router.routerState.root.firstChild && this.router.routerState.root.firstChild.firstChild);
             */

            if (this.activatedRoute.snapshot.params['id'] !== this.dossierID) {
                this.dossierID = this.activatedRoute.snapshot.params['id'];
                console.log(this.dossierID);
                this.getContenus(this.dossierID);
                this.parentLink = Paths.join(Paths.configurationPath('dossiers'), '/content/' + this.dossierID);
                this.dossierNewLink = Paths.configurationPath('dossiers') + '/new/' + this.dossierID;
            }


        });

    }

    ngOnDestroy(): void {
        console.log('tg');
        this.subscription.unsubscribe();
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

    getUpdateDossierLink(id) {
        return this.dossierEditLink = Paths.configurationPath('dossiers') + '/' + id + '/parent/' + this.dossierID;
    }

    getUpdateDocumentLink(id) {
        return this.dossierEditLink = Paths.configurationPath('documents') + '/' + id + '/parent/' + this.dossierID;
    }

    refresh(): void {
        this.criteria = new DossierCriteria();
        this.dataSource = this.initialDataSource;
    }

    delete(component): void {
        super.delete(component, 'cet element');
        this.isDocument(component) ? this.deleteDocument(component, 'cet element') : this.deleteDossier(component, 'cet element');

    }


    // inscrire ma data source
    private initData(): void {
        this.myDataSource = new MatTableDataSource<any>();
        console.log(this.contentListResolver.mapwrapper);
        this.myDataSource.data = this.contentListResolver.mapwrapper;
        this.dossier = this.contentListResolver.dossier;

        /*   this.subscription = this.contentListResolver.data.subscribe(data => {
               this.dossier = data[0];
               this.myDataSource.data = data[1];
               console.log(data[1]);

           });*/
        console.log(this.dossier)
        this.getParent();
    }

    // si url dans document alors document sinon dossier
    isDocument(object) {
        return object.hasOwnProperty('url');
    }

    getParent() {
        this.listsParent = [];
        let dossier1 = this.dossier;
        console.log(dossier1);
        for (let i = 0; i < 1000; i++) {

            if (dossier1 && dossier1.dossierParent && dossier1.dossierParent.nom) {
                this.listsParent.push({dossier: dossier1.dossierParent.nom, id: dossier1.dossierParent.id})
            }

            if (dossier1 === null || dossier1.dossierParent === null || dossier1.dossierParent.id === null) {

                if (Number(this.dossierID) !== 0) this.listsParent.push({dossier: 'Racine', id: 0})
                this.regularise();

                return
            }

            dossier1 = dossier1.dossierParent;

            console.log(this.listsParent);
            console.log(i);
        }


    }

    regularise() {
        const affect = this.listsParent;
        this.listsParent = [];

        let index = 0;
        console.log(affect.length)
        for (let i = affect.length - 1; i >= 0; i--) {
            this.listsParent.push(affect[i])
            index++;
            console.log(i);
            console.log();
        }
        console.log(this.listsParent)
    }


    deleteDocument(component, paramValue?) {
        this.showLoading();
        this._translateService.get(['APP.DELETE_CONFIRM', 'APP.SUCCESS', 'APP.DELETE'], {value: paramValue})
            .subscribe(values => {
                const matDialogRef = this._dialogService.openConfirmDialog(values['APP.DELETE_CONFIRM']);
                matDialogRef.afterClosed().subscribe(response => {
                    if (response) {
                        this.documentService.delete(component.id).subscribe(value => {
                            this._service.findAllPage(0, this.row).subscribe(data => {
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

    deleteDossier(component, paramValue?) {
        this.showLoading();
        this._translateService.get(['APP.DELETE_CONFIRM', 'APP.SUCCESS', 'APP.DELETE'], {value: paramValue})
            .subscribe(values => {
                const matDialogRef = this._dialogService.openConfirmDialog(values['APP.DELETE_CONFIRM']);
                matDialogRef.afterClosed().subscribe(response => {
                    if (response) {
                        this._service.delete(component.id).subscribe(value => {
                            this._service.findAllPage(0, this.row).subscribe(data => {
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

    getRoute(component) {
        return this.isDocument(component) ? this.documentLink + '/' + component.id + '/dossier/' + this.dossierID + '/display' :
            this.baseLink + '/content/' + component.id;
    }

    //selectionner un fichier
    getFileDetails(event) {
        this.file = event.target.files[0];
        sessionStorage.setItem('fileToUpload', JSON.stringify(this.file));
        const navigationExtras: NavigationExtras = {state: {file: this.file}};
        this.router.navigateByUrl(this.documentLink + '/new/' + this.dossierID, navigationExtras);

    }

    // recuperer le contenu d'un dossier
    protected getContenus(idDossier) {
        this._service.getContent(idDossier)
            .subscribe(response => {
                const wrapper = Helpers.getOthers(response);
                this.dossier = wrapper.dossier;
                console.log(this.dossier)
                let mapwrapper = [];

                for (let wrapperKey in wrapper.dossiers) {
                    mapwrapper.push(wrapper.dossiers[wrapperKey])
                }

                for (let wrapperKey in wrapper.documents) {
                    mapwrapper.push(wrapper.documents[wrapperKey])
                }

                this.myDataSource.data = mapwrapper;
                console.log(mapwrapper);
                this.getParent();
            });
    }

    getParentPath() {
        if (Number(this.dossierID) !== 0 && this.dossier && this.dossier.dossierParent && this.dossier.dossierParent.id)
            return Paths.configurationPath('dossiers') + '/content/' + this.dossier.dossierParent.id;
        return Paths.configurationPath('dossiers') + '/content/0';
    }


}


