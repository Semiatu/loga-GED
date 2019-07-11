import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { DocumentService } from 'src/app/main/skeleton/configuration/_service';
import { AbstractListResolver } from 'src/@externals/loga/_abstract';
import { Helpers } from 'src/@externals/loga/_utility';

@Injectable({ providedIn: "root"})
export class DocumentListResolver extends AbstractListResolver implements Resolve<any> {

    documents: any[];
    onDocumentsChanged: BehaviorSubject<any>;
    total: number;

    constructor(private documentService: DocumentService) {
        super();
        this.onDocumentsChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getDocuments(),
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    protected getDocuments(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.documentService.findAllPage(0, 10)
                .subscribe(response => {
                    this.documents = Helpers.getOthers(response);
                    this.total = Helpers.getTotalElements(response);
                    this.onDocumentsChanged.next(this.documents);
                    resolve(response);
                }, reject);
        });
    }

    public hasDetails(): boolean {
        return true;
    }

    public hasUpload(): boolean {
        return false;
    }

}
