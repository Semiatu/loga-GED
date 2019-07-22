/*
**********************************************************************************
**********************************************************************************
********************************** DECLARATION ***********************************
**********************************************************************************
**********************************************************************************
*/

// BASIQUE ANGULAR
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfigurationRoutingModule} from './configuration.routing.module';
// PRIME NG
import {PickListModule} from 'primeng/primeng';
import {ToastModule} from 'primeng/toast';
// MATERIAL DESIGN
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {
    MatChipsModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatGridListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatCardModule, MatProgressBarModule
} from '@angular/material';
// OTHERS
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {ngxLoadingAnimationTypes, NgxLoadingModule} from 'ngx-loading';


/*
*
* TS
*
*/
// COMPONENT
import {DummyListComponent} from './_component/dummy/dummy-list/dummy-list.component';
import {DummyFormComponent} from './_component/dummy/dummy-form/dummy-form.component';
import {DummyGenericFormComponent} from './_component/dummy/dummy-generic-form/dummy-generic-form.component';
import {DummyDisplayFormComponent} from './_component/dummy/dummy-display-form/dummy-display-form.component';
// RESOLVER
import {DummyListResolver} from './_resolver/dummy/dummy.list.resolver';
import {DummyFormResolver} from './_resolver/dummy/dummy.form.resolver';

/*
*
* SHARED
*
*/
import {FuseSharedModule} from 'src/@externals/fuse/@fuse/shared.module';
import {CustomSharedModule} from 'src/@externals/loga/custom.shared.module';
import {DummyDisplayResolver} from './_resolver/dummy/dummy.display.resolver';
import {DossierListComponent} from './_component/dossier/dossier-list/dossier-list.component';
import {DocumentListComponent} from './_component/document/document-list/document-list.component';
import {DossierGenericFormComponent} from './_component/dossier/dossier-generic-form/dossier-generic-form.component';
import {DossierFormComponent} from './_component/dossier/dossier-form/dossier-form.component';
import {DossierDisplayFormComponent} from './_component/dossier/dossier-display-form/dossier-display-form.component';
import {DocumentDisplayFormComponent} from './_component/document/document-display-form/document-display-form.component';
import {DocumentFormComponent} from './_component/document/document-form/document-form.component';
import {DocumentGenericFormComponent} from './_component/document/document-generic-form/document-generic-form.component';
import { ContentListComponent } from './_component/dossier/content-list/content-list.component';


@NgModule({


    declarations: [
        DummyListComponent,
        DummyFormComponent,
        DummyGenericFormComponent,
        DummyDisplayFormComponent,
        DossierListComponent,
        DossierFormComponent,
        DossierGenericFormComponent,
        DossierDisplayFormComponent,
        DocumentListComponent,
        DocumentDisplayFormComponent,
        DocumentFormComponent,
        DocumentGenericFormComponent,
        ContentListComponent,
    ],

    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ConfigurationRoutingModule,
        FuseSharedModule,

        MatCardModule,

        // Loading
        NgxLoadingModule.forRoot({
            animationType: ngxLoadingAnimationTypes.chasingDots,
            backdropBackgroundColour: 'rgba(0,0,0,0.1)',
            backdropBorderRadius: '15px',
            primaryColour: '#3a87ad',
            secondaryColour: '#0088cc',
            tertiaryColour: '#7bf332'
        }),

        // PRIME NG

        PickListModule,
        ToastModule,

        // MATERIAL DESIGN
        MatInputModule,
        MatIconModule,
        MatFormFieldModule,
        MatButtonModule,
        MatTooltipModule,
        MatSelectModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatGridListModule,
        MatExpansionModule,

        MatChipsModule,
        MatPaginatorModule,
        MatSortModule,
        MatSnackBarModule,

        MatMenuModule,
        MatTableModule,
        MatToolbarModule,
        NgxMatSelectSearchModule,
        CustomSharedModule,
        MatProgressBarModule,
    ],

    providers: [
        DummyListResolver,
        DummyFormResolver,
        DummyDisplayResolver,
    ],


})
export class ConfigurationModule {
}
