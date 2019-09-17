import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {CategorieService} from "../../_service";
import { AbstractListResolver } from 'src/@externals/loga/_abstract';
import { Helpers } from 'src/@externals/loga/_utility';

@Injectable({ providedIn: "root" })
export class CategorieListResolver extends AbstractListResolver implements Resolve<any> {

    categories: any[];
    onCategoriesChanged: BehaviorSubject<any>;
    total: number;

    constructor(private categorieService: CategorieService) {
        super();
        this.onCategoriesChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getCategories(),
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    protected getCategories(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.categorieService.findAllPage(0, 10)
                .subscribe(response => {
                    this.categories = Helpers.getOthers(response);
                    this.total = Helpers.getTotalElements(response);
                    this.onCategoriesChanged.next(this.categories);
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
