import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GenericPersistenceComponent} from "../../../../../../../@externals/loga/_abstract";
import {Document} from "../../../_model";
import {DocumentService} from "../../../_service";
import {SnackBarService} from "../../../../../../../@externals/loga/snack-bar/snack.bar.service";
import {DialogService} from "../../../../../../../@externals/loga/dialog/dialog.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DocumentFormResolver} from "../../../_resolver";
import {Paths} from "../../../../../../../environments/paths";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AngularFireStorage} from "@angular/fire/storage";

@Component({
    selector: 'document-form',
    templateUrl: './document-form.component.html',
    styleUrls: ['./document-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DocumentFormComponent extends GenericPersistenceComponent<Document, number, DocumentService> implements OnInit {


    action = 'add';
    document: Document;
    state$: Observable<any>;
    stateValue: any;
    file: any;
    observeFile: Observable<any>;
    contentId: any;
    baseLink = Paths.configurationPath('dossiers');

    constructor(protected _notificationService: SnackBarService,
                protected _dialogService: DialogService,
                protected _translateService: TranslateService,
                protected _service: DocumentService,
                protected router: Router,
                protected documentResolver: DocumentFormResolver,
                private fileStorage: AngularFireStorage,
                public activatedRoute: ActivatedRoute,

    ) {
        super(_notificationService, _dialogService, _translateService, _service, router);
    }

    ngOnInit(): void {

        this.contentId = this.activatedRoute.snapshot.params['idDossier'];

        if (this.documentResolver.document) {
            this.document = this.documentResolver.document;
            this.action = 'edit';
        }else {
            // souscribe file
            this.state$ = this.activatedRoute.paramMap
                .pipe(map(() => window.history.state))

            this.state$.subscribe(value => {
                this.file = value.file;

                this.observeFile = new Observable(subscriber =>  {
                    subscriber.next(this.file);
                    subscriber.complete();
                });
            });
        }



    }

    save(document: Document): void {
        console.log(Paths.join( Paths.configurationPath('dossiers') , Paths.join('content', String(document.dossier.id))));
        this.addSub(
            this._service.save(document).subscribe(value => {
                this._translateService.get(['APP.SUCCESS', 'APP.ADD']).subscribe(values => {
                    this.navigateToList(values['APP.SUCCESS'], values['APP.ADD'], Paths.configurationPath('dossiers') + '/content/' + this.contentId );
                });
            }, error => {
                this.showError(error);
            },
             /*   ()=>{
                    this.upload();
                }*/
            )
        );
    }

    update(document: Document): void {
        this.addSub(
            this._service.update(document.id, document).subscribe(value => {
                this._translateService.get(['APP.SUCCESS', 'APP.UPDATE']).subscribe(values => {
                    this.navigateToList(values['APP.SUCCESS'], values['APP.UPDATE'],Paths.configurationPath('dossiers') + '/content/' + this.contentId);
                });
            }, error => {
                this.showError(error);
            })
        );
    }
}
