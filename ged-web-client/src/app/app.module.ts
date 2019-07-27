import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule, matDialogAnimations,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorIntl,
    MatRippleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule
} from '@angular/material';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import 'hammerjs';
import {AppComponent} from './app.component';
import {FuseModule} from '../@externals/fuse/@fuse/fuse.module';
import {FuseProgressBarModule, FuseSidebarModule} from '../@externals/fuse/@fuse/components';
import {FuseSharedModule} from '../@externals/fuse/@fuse/shared.module';
import {LayoutModule} from '../@externals/fuse/layout/layout.module';
import {FuseThemeOptionsModule} from '../@externals/fuse/@fuse/components/theme-options/theme-options.module';
import {fuseTMConfig} from '../@externals/bridge';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {StoreModule} from '@ngrx/store';
import {APP_REDUCER_TOKEN, getReducers} from './store/reducers/app.reducers';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {PaginatorI18n} from './paginator.i18n';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {CustomSharedModule} from '../@externals/loga/custom.shared.module';
import {ConfirmDialogComponent} from '../@externals/loga/dialog/confirm.dialog.component';
import {MessageService} from 'primeng/api';
import {ngxLoadingAnimationTypes, NgxLoadingModule} from 'ngx-loading';
import {JwtInterceptor} from '../@externals/loga/_authentification/interceptor/jwt.interceptor';
import {XhrInterceptor} from '../@externals/loga/_authentification/interceptor/xhr-interceptor';
import {RoleGuard} from '../@externals/loga/_authentification/guard/role.guard';
import {AuthenticationChildGuard} from '../@externals/loga/_authentification/guard/authentication.child.guard';
import {AuthenticationGuard} from '../@externals/loga/_authentification/guard/authentication.guard';
import {RoleChildGuard} from '../@externals/loga/_authentification/guard/role.child.guard';
import {AuthenticationService} from '../@externals/loga/_authentification/authentication.service';
import {AppRoutingModule} from './app.routing.module';
import {AngularFireModule} from "@angular/fire";
import {AngularFireStorageModule} from "@angular/fire/storage";
import {AngularFireDatabase} from "@angular/fire/database";

@NgModule({
    declarations: [
        AppComponent,
        ConfirmDialogComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,


        // Loading
        NgxLoadingModule.forRoot({
            animationType: ngxLoadingAnimationTypes.chasingDots,
            backdropBackgroundColour: 'rgba(0,0,0,0.1)',
            backdropBorderRadius: '15px',
            primaryColour: '#3a87ad',
            secondaryColour: '#0088cc',
            tertiaryColour: '#7bf332'
        }),

        // Firebase
        AngularFireModule.initializeApp({
            apiKey: "AIzaSyAGHsuuSn5J2105hbslgXh_t_x2nCzZGvo",
            authDomain: "logaged.firebaseapp.com",
            databaseURL: "https://logaged.firebaseio.com",
            projectId: "logaged",
            storageBucket: "logaged.appspot.com",
            messagingSenderId: "532395410002",
            appId: "1:532395410002:web:ae6f398c12238dbf"
        }),
        AngularFireStorageModule,

        // TranslateModule

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatToolbarModule,
        MatInputModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatSelectModule,
        MatDialogModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatGridListModule,
        MatSnackBarModule,

        MatMenuModule,
        MatRippleModule,

        // Fuse modules
        FuseModule.forRoot(fuseTMConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // NGRX
        StoreModule.forRoot(APP_REDUCER_TOKEN),
        StoreDevtoolsModule.instrument({
            name: '[NGRX]',
            maxAge: 25,
            logOnly: environment.production
        }),

        // App modules
        LayoutModule,
        // NGx MatSelect
        NgxMatSelectSearchModule,

        // CUSTOM SHARED MODULE
        CustomSharedModule
    ],

    providers: [
        MessageService,
        AuthenticationService,
        AuthenticationGuard,
        AuthenticationChildGuard,
        RoleGuard,
        RoleChildGuard,
        JwtInterceptor,
        XhrInterceptor,
        AngularFireDatabase,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: XhrInterceptor,
            multi: true
        },
        {
            provide: APP_REDUCER_TOKEN,
            useFactory: getReducers
        },
        {
            provide: MatPaginatorIntl, deps: [TranslateService],
            useFactory: (translateService: TranslateService) => new PaginatorI18n(translateService).getPaginatorIntl()
        }
    ],
    bootstrap: [
        AppComponent
    ],
    entryComponents: [ConfirmDialogComponent]
})
export class AppModule {
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, 'src/@externals/bridge/navigation/i18n/', '.ts');
}
