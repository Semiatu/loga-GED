import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Helpers } from 'src/@externals/loga/_utility';
import { DocumentService } from 'src/app/main/skeleton/configuration/_service';
import { Document } from 'src/app/main/skeleton/configuration/_model';

@Injectable({ providedIn: "root" })
export class DocumentFormResolver implements Resolve<any> {

    onDocumentsChanged: BehaviorSubject<any>;
    document: Document;

    constructor(private documentService: DocumentService) {
        this.onDocumentsChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        const values = [];
        if (route.params) {
            const id = route.params.id;
            if (id && Number.isInteger(+id)) {
                values.push(this.find(id));
            } else {
                this.document = null;
            }
        }
        return new Promise((resolve, reject) => {
            Promise.all(values).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    private find(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this.documentService.find(id)
                .subscribe(response => {
                    this.document = Helpers.getOthers(response);
                    resolve(response);
                }, reject);
        });
    }
}
