import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Helpers } from 'src/@externals/loga/_utility';
import {CategorieService} from "../../_service";
import {Categorie } from "../../_model/categorie";

@Injectable({ providedIn: "root" })
export class CategorieFormResolver implements Resolve<any> {

    onCategoriesChanged: BehaviorSubject<any>;
    categorie: Categorie;

    constructor(private categorieService: CategorieService) {
        this.onCategoriesChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        const values = [];
        if (route.params) {
            const id = route.params.id;
            if (id && Number.isInteger(+id)) {
                values.push(this.find(id));
            } else {
                this.categorie = null;
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
            this.categorieService.find(id)
                .subscribe(response => {
                    this.categorie = Helpers.getOthers(response);
                    resolve(response);
                }, reject);
        });
    }
}
