import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DummyListComponent } from './_component/dummy/dummy-list/dummy-list.component';
import { DummyFormComponent } from './_component/dummy/dummy-form/dummy-form.component';
import { DummyListResolver } from './_resolver/dummy/dummy.list.resolver';
import { DummyFormResolver } from './_resolver/dummy/dummy.form.resolver';
import { DummyDisplayFormComponent } from './_component/dummy/dummy-display-form/dummy-display-form.component';
import { DummyDisplayResolver } from './_resolver/dummy/dummy.display.resolver';
import {DossierListComponent} from "./_component/dossier/dossier-list/dossier-list.component";
import {
    CategorieFormResolver, CategorieListResolver,
    ContentListResolver,
    DocumentFormResolver,
    DocumentListResolver,
    DossierFormResolver,
    DossierListResolver, LangueFormResolver, LangueListResolver
} from "./_resolver";
import {DossierFormComponent} from "./_component/dossier/dossier-form/dossier-form.component";
import {DossierDisplayFormComponent} from "./_component/dossier/dossier-display-form/dossier-display-form.component";
import {DossierDisplayResolver} from "./_resolver/dossier/dossier.display.resolver";
import {DocumentListComponent} from "./_component/document/document-list/document-list.component";
import {DocumentFormComponent} from "./_component/document/document-form/document-form.component";
import {DocumentDisplayFormComponent} from "./_component/document/document-display-form/document-display-form.component";
import {DocumentDisplayResolver} from "./_resolver/document/document.display.resolver";
import {ContentListComponent} from "./_component/dossier/content-list/content-list.component";
import {RaccourciFormComponent} from "./_component/dossier/raccourci-form/raccourci-form.component";
import {RaccourciFormResolver} from "./_resolver/dossier/raccourci.form.resolver";
import {CorbeilleListComponent} from "./_component/corbeille-list/corbeille-list.component";
import {CorbeilleListResolver} from "./_resolver/dossier/corbeille.list.resolver";
import {CategorieFormComponent} from "./_component/categorie/categorie-form/categorie-form.component";
import {CategorieListComponent} from "./_component/categorie/categorie-list/categorie-list.component";
import {CategorieDisplayResolver} from "./_resolver/categorie/categorie.display.resolver";
import {CategorieDisplayFormComponent} from "./_component/categorie/categorie-display-form/categorie-display-form.component";
import {LangueFormComponent} from "./_component/langue/langue-form/langue-form.component";
import {LangueDisplayResolver} from "./_resolver/langue/langue.display.resolver";
import {LangueDisplayFormComponent} from "./_component/langue/langue-display-form/langue-display-form.component";
import {LangueListComponent} from "./_component/langue/langue-list/langue-list.component";

const configurationRoutes: Routes = [
  { path: '', redirectTo: '/dossiers/content/0', pathMatch: 'full' },


    {
        path: 'dummies',
        children: [
            {path: '', component: DummyListComponent, resolve: {data: DummyListResolver}},
            {path: ':id', component: DummyFormComponent, resolve: {data: DummyFormResolver}},
            {path: ':id/display', component: DummyDisplayFormComponent, resolve: {data: DummyDisplayResolver}},
            {path: 'new', component: DummyFormComponent, resolve: {data: DummyFormResolver}}
        ]
    },
    {
        path: 'categories',
        children: [
            {path: '', component: CategorieListComponent, resolve: {data: CategorieListResolver}},
            {path: ':id', component: CategorieFormComponent, resolve: {data: CategorieFormResolver}},
            {path: ':id/display', component: CategorieDisplayFormComponent, resolve: {data: CategorieDisplayResolver}},
            {path: 'new', component: CategorieFormComponent, resolve: {data: CategorieFormResolver}}
        ]
    },
    {
        path: 'langues',
        children: [
            {path: '', component: LangueListComponent, resolve: {data: LangueListResolver}},
            {path: ':id', component: LangueFormComponent, resolve: {data: LangueFormResolver}},
            {path: ':id/display', component: LangueDisplayFormComponent, resolve: {data: LangueDisplayResolver}},
            {path: 'new', component: LangueFormComponent, resolve: {data: LangueFormResolver}}
        ]
    },
    {
        path: 'dossiers',
        children: [
            { path: '', component: DossierListComponent, resolve: { data: DossierListResolver } },
            { path: 'parent/:idDossier', component: DossierListComponent, resolve: { data: DossierListResolver } },
            {path: ':id/parent/:idDossier', component: DossierFormComponent, resolve: {data: DossierFormResolver}},
            {path: ':id', component: DossierFormComponent, resolve: {data: DossierFormResolver}},
            {path: ':id/dossier/display', component: DossierDisplayFormComponent, resolve: {data: DossierDisplayResolver}},
            {path: ':id/dossier/:idDossier/display', component: DossierDisplayFormComponent, resolve: {data: DossierDisplayResolver}},
            {path: 'new', component: DossierFormComponent, resolve: {data: DossierFormResolver}},
            {path: 'new/:idDossier', component: DossierFormComponent, resolve: {data: DossierFormResolver}},
            {path: 'content/:id', component: ContentListComponent, resolve: {data: ContentListResolver}},
            {path: 'content', component: ContentListComponent, resolve: {data: ContentListResolver}}
        ]
    },
    {
        path: 'documents',
        children: [
            { path: 'dossier/:id', component: DocumentListComponent, resolve: { data: DocumentListResolver } },
            { path: 'dossier', component: DocumentListComponent, resolve: { data: DocumentListResolver } },
            {path: '/parent/:idDossier', component: DocumentFormComponent, resolve: {data: DocumentFormResolver}},
            {path: ':id/parent/:idDossier', component: DocumentFormComponent, resolve: {data: DocumentFormResolver}},
            {path: ':id', component: DocumentFormComponent, resolve: {data: DocumentFormResolver}},
            {path: ':id/dossier/display', component: DocumentDisplayFormComponent, resolve: {data: DocumentDisplayResolver}},
            {path: ':id/dossier/:idDossier/display', component: DocumentDisplayFormComponent, resolve: {data: DocumentDisplayResolver}},
            {path: 'new/:idDossier', component: DocumentFormComponent, resolve: {data: DocumentFormResolver}},
            {path: 'new', component: DocumentFormComponent, resolve: {data: DocumentFormResolver}},
            {path: 'content', component: ContentListComponent, resolve: {data: ContentListResolver}}
        ]
    },
    {
        path: 'raccourcis',
        children: [
            {path: ':id', component: RaccourciFormComponent, resolve: {data: RaccourciFormResolver}},
            {path: 'new', component: RaccourciFormComponent, resolve: {data: RaccourciFormResolver}}
        ]
    },

    {
        path: 'corbeille',
        children: [
            {path: '', component: CorbeilleListComponent, resolve: {data: CorbeilleListResolver}}
        ]
    },
];


@NgModule({
  imports: [RouterModule.forChild(configurationRoutes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule {
}
