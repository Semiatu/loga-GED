import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Helpers} from 'src/@externals/loga/_utility';
import {CategorieService} from "../../_service";
import {Categorie} from "../../_model/categorie";

@Injectable({ providedIn: "root" })
export class CategorieDisplayResolver implements Resolve<any> {

    categorie: Categorie;

    constructor(
        private categorieService: CategorieService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            const values = [];
            if (route.params) {
                const id = route.params.id;
                if (!isNaN(+id)) {
                    values.push(this.find(id));
                }
            }
            Promise.all(values).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    protected find(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this.categorieService.find(id)
                .subscribe(response => {
                    this.categorie = Helpers.getOthers(response);
                    resolve(response);
                }, reject);
        });
    }


}
