/*
**********************************************************************************
**********************************************************************************
********************************** DECLARATION ***********************************
**********************************************************************************
**********************************************************************************
*/

// BASIQUE ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionRoutingModule } from './permission.routing.module';
// PRIME NG
import { PickListModule } from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';
// MATERIAL DESIGN
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
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
  MatAutocompleteModule
} from '@angular/material';
// OTHERS
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';


/*
*
* TS
*
*/
import { UserListComponent } from './_component/user/user-list/user-list.component';
import { UserFormComponent } from './_component/user/user-form/user-form.component';
import { UserListResolver } from './_resolver/user/user.list.resolver';
import { UserFormResolver } from './_resolver/user/user.form.resolver';
import { UserGenericFormComponent } from './_component/user/user-generic-form/user-generic-form.component';
import { ProfileListComponent } from './_component/profile/profile-list/profile-list.component';
import { ProfileGenericFormComponent } from './_component/profile/profile-generic-form/profile-generic-form.component';
import { ProfileFormComponent } from './_component/profile/profile-form/profile-form.component';
import { ProfileListResolver } from './_resolver/profile/profile.list.resolver';
import { ProfileFormResolver } from './_resolver/profile/profile.form.resolver';
import { LogComponent } from './_component/log/log.component';
import { LogResolver } from './_resolver/log/log.resolver';
import { ProfileRoleComponent } from './_component/profile/profile-roles/profile-role.component';
import { ProfileRoleResolver } from './_resolver/profile/profile.role.resolver';
/*
*
* SHARED
*
*/
import { FuseSharedModule } from 'src/@externals/fuse/@fuse/shared.module';
import { CustomSharedModule } from 'src/@externals/loga/custom.shared.module';


@NgModule({


  declarations: [

    ProfileGenericFormComponent,
    ProfileListComponent,
    ProfileFormComponent,
    UserGenericFormComponent,
    UserListComponent,
    UserFormComponent,
    LogComponent,
    ProfileRoleComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    PermissionRoutingModule,
    FuseSharedModule,

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
  ],

  providers: [
    UserListResolver,
    UserFormResolver,
    ProfileListResolver,
    ProfileFormResolver,
    ProfileRoleResolver,
    LogResolver
  ],


})
export class PermissionModule {
}
