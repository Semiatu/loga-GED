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
import {SkeletonRoutingModule} from './skeleton.routing.module';
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
  MatCheckboxModule
} from '@angular/material';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ngxLoadingAnimationTypes, NgxLoadingModule} from 'ngx-loading';
import {FuseSharedModule} from 'src/@externals/fuse/@fuse/shared.module';
import {CustomSharedModule} from 'src/@externals/loga/custom.shared.module';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';



@NgModule({


  declarations: [

  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkeletonRoutingModule,
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
    MatCheckboxModule,

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

  ],


})
export class SkeletonModule {
}
