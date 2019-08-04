import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from "../../../../../../../@externals/fuse/@fuse/animations";
import {GenericListComponent} from "../../../../../../../@externals/loga/_abstract";
import {Document, Dossier, Raccourci} from "../../../_model";
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
import {MatDialog, MatDialogRef, MatTableDataSource} from "@angular/material";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {DossierDisplayResolver} from "../../../_resolver/dossier/dossier.display.resolver";
import {RaccourciGenericFormComponent} from "../raccourci-generic-form/raccourci-generic-form.component";
import {RaccourciType} from "../../../_model/RaccourciType";
import {RaccourciService} from "../../../_service/raccourci.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
    selector: 'content-list',
    templateUrl: './content-list.component.html',
    styleUrls: ['./content-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ContentListComponent extends GenericListComponent<Dossier, DossierService> implements OnInit, OnDestroy {

    displayedColumns = ['id', 'nom', 'type', 'createdDate', 'lastModifiedDate', 'actions'];

    public myDataSource = new MatTableDataSource<any>();

    conf: ConfigurationModule;
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
    RaccourciFormLink: any;
    parentLink = Paths.configurationPath('dossiers');
    contentLink: any;
    subscription: Subscription;
    listsParent = [];
    renomerRaccourci = false;
    currentRaccourci = new Raccourci();
    form: FormGroup;
    sauvegardeNom: string;


    private _unsubscribeAll: Subject<any>;


    constructor(
        protected _notificationService: SnackBarService,
        protected _dialogService: DialogService,
        protected _translateService: TranslateService,
        protected _raccourciService: RaccourciService,
        protected _service: DossierService,
        private contentListResolver: ContentListResolver,
        private documentService: DocumentService,
        private activatedRoute: ActivatedRoute,
        protected clientResolver: DossierDisplayResolver,
        public router: Router,
        public formBuilder: FormBuilder,
        private dialog: MatDialog
    ) {
        super(_notificationService, _dialogService, _translateService, _service);
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.dossierID = this.activatedRoute.snapshot.params['id'];
        this.dossier = this.clientResolver.dossier;
        this.dossierNewLink = Paths.configurationPath('dossiers') + '/new/' + this.dossierID;
        this.RaccourciFormLink = Paths.configurationPath('raccourcis') + '/new/';
        this.initData();
        this.myDataSource.data = this.contentListResolver.mapwrapper;
        this.dossier = this.contentListResolver.dossier;
        console.log(this.contentListResolver.mapwrapper);
        this.buildForm();

        this.subscription = this.router.events.subscribe((event) => {
            if (this.activatedRoute.snapshot.params['id'] !== this.dossierID) {
                this.dossierID = this.activatedRoute.snapshot.params['id'];
                this.getContenus(this.dossierID);
                this.parentLink = Paths.join(Paths.configurationPath('dossiers'), '/content/' + this.dossierID);
                this.dossierNewLink = Paths.configurationPath('dossiers') + '/new/' + this.dossierID;
            }
        });
    }

    ngOnDestroy(): void {
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

    // renommer un raccourci
    showRenameDialog(component) {
        this.sauvegardeNom = component.nom;
        this.currentRaccourci = component;
        this.renomerRaccourci = true;
    }

    updateRaccourci() {
        this.renomerRaccourci = false;
        this._raccourciService.update(this.currentRaccourci.id, this.currentRaccourci).toPromise().then(value => {
            this._translateService.get(['APP.SUCCESS', 'APP.UPDATE']).subscribe(values => {
                this._notificationService.open(values['APP.SUCCESS'], values['APP.UPDATE']);
            });
            this.getContenus(this.dossierID);
        });

    }

    refresh(): void {
        this.criteria = new DossierCriteria();
        this.dataSource = this.initialDataSource;
    }

    delete(component): void {
        this.showLoading();
        this._translateService.get(['APP.DELETE_CONFIRM', 'APP.SUCCESS', 'APP.DELETE'], {value: 'cet element'})
            .subscribe(values => {
                const matDialogRef = this._dialogService.openConfirmDialog(values['APP.DELETE_CONFIRM']);
                matDialogRef.afterClosed().subscribe(response => {
                    if (response) {
                        if (this.isDocument(component)) this.deleteDocument(component);
                        if (this.isDossier(component)) this.deleteDossier(component);
                        if (this.isRaccourci(component)) this.deleteRaccourci(component);
                    }
                });
            });
    }


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

    isRaccourci(object) {
        return !this.isDocument(object) && (object.hasOwnProperty('document') || object.hasOwnProperty('dossier'));
    }

    isDossier(object) {
        return !this.isDocument(object) && !this.isRaccourci(object);
    }

    // on recupere le parent de chaque dossier et le met dans le tableau listsParent
    getParent() {
        this.listsParent = [];
        let dossier1 = this.dossier;
        console.log(dossier1);
        if( Number(this.dossierID) !== 0){
            this.listsParent.push({dossier: dossier1.nom, id: dossier1.id});
        } else {
            this.listsParent.push({dossier:'Racine', id: 0})
        }
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

    closeRename() {
        this.currentRaccourci.nom = this.sauvegardeNom;
        this.renomerRaccourci = false;
    }

    // delete document
    deleteDocument(component) {
        this.documentService.addInCorbeille(component.id).subscribe(value => {
            this.getContenus(this.dossierID);
        }, error => {
            this.showError(error);
        });
    }

    // delete dossier
    deleteDossier(component) {
        this._service.addInCorbeille(component.id).subscribe(value => {
            this.getContenus(this.dossierID);
        }, error => {
            this.showError(error);
        });
    }

    // delete raccourci
    deleteRaccourci(component) {
        this._raccourciService.addInCorbeille(component.id).subscribe(value => {
            this.getContenus(this.dossierID);
        }, error => {
            this.showError(error);
        });
    }

    getRoute(component) {
        if (this.isDocument(component)) {
            return this.documentLink + '/' + component.id + '/dossier/' + this.dossierID + '/display';
        } else if (this.isDossier(component)) {
            return this.baseLink + '/content/' + component.id;
        }

        if (component.dossier && component.dossier.id) {
            return this.baseLink + '/content/' + component.dossier.id;
        } else if (component.document && component.document.id) {
            return this.documentLink + '/' + component.document.id + '/dossier/' + component.document.dossier.id + '/display';
        }

    }


    // selectionner le fichier a uploader
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

                mapwrapper.push(...wrapper.dossiers)
                mapwrapper.push(...wrapper.documents)
                mapwrapper.push(...wrapper.raccourcis)

                this.myDataSource.data = mapwrapper;
                this.getParent();
            });
    }

    // lien du parent d'un dossier courent
    getParentPath() {
        if (Number(this.dossierID) !== 0 && this.dossier && this.dossier.dossierParent && this.dossier.dossierParent.id)
            return Paths.configurationPath('dossiers') + '/content/' + this.dossier.dossierParent.id;
        return Paths.configurationPath('dossiers') + '/content/0';
    }

    // modal du raccourci
    openDialog(): void {
        this._service.getTreeContent(0).subscribe(value => {
            this.afficheDialog(value);
        })
    }

    // modal du deplacement d'un dossier
    openDialogDeplacer(component): void {
        this._service.getDossierTreeContent(0).subscribe(value => {
            this.deplacer(component, value);
        })
    }

    afficheDialog(data) {
        const dialogRef = this.dialog.open(RaccourciGenericFormComponent, {
            width: 'auto',
            data: {data: data, deplacer: false}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.label) {
                console.log(result);
                const raccourci = new Raccourci();

                raccourci.emplacement = new Dossier();
                raccourci.emplacement.id = Number(this.dossierID);
                raccourci.nom = result.label + '-Raccourci';

                if (result.icon === null) {
                    raccourci.type = RaccourciType.DOSSIER;
                    raccourci.dossier = new Dossier();
                    raccourci.dossier.id = Number(result.data);
                    this.saveSimpleRacourci(raccourci);

                } else if (result.icon !== null && result.icon === 'fa fa-file-word-o') {

                    raccourci.type = RaccourciType.DOCUMENT;
                    raccourci.document = new Document();
                    raccourci.document.id = Number(result.data);
                    this.saveSimpleRacourci(raccourci);
                } else {
                    this.saveSimpleRacourciOfRaccourci(raccourci, result.data);
                }
            }


        });
    }

    // enregistrer un raccourci
    saveSimpleRacourci(raccourci) {
        this._raccourciService.save(raccourci).toPromise().then(value => {
            this.getContenus(Number(this.dossierID));
        });
    }

    // enregistrer le raccourci d'un raccourci
    saveSimpleRacourciOfRaccourci(raccourci, id) {
        this._raccourciService.creerRaccourciPourRacourcisave(raccourci, id).toPromise().then(value => {
            this.getContenus(Number(this.dossierID));
        });
    }

    protected buildForm(): void {
        this.form = this.formBuilder.group({
            nom: [this.currentRaccourci.nom, [Validators.required]],
        });
    }

    protected deplacer(component, data): void {
        const dialogRef = this.dialog.open(RaccourciGenericFormComponent, {
            width: 'auto',
            data: {data: data, deplacer: true}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data) {
                if (this.isDocument(component)) {
                    component.dossier.id = result.data;
                    this.documentService.save(component).toPromise().then(value => {
                        this.getContenus(this.dossierID);
                    });
                }
                if (this.isDossier(component)) {
                    component.dossierParent.id = result.data;
                    this._service.save(component).toPromise().then(value => {
                        this.getContenus(this.dossierID);
                    });
                }
                if (this.isRaccourci(component)) {
                    component.emplacement = new Dossier();
                    component.emplacement.id = result.data;
                    this._raccourciService.save(component).toPromise().then(value => {
                        this.getContenus(this.dossierID);
                    });
                }
            }

        });
    }


}


