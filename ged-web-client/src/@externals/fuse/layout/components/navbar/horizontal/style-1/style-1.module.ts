import {NgModule} from '@angular/core';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {NavbarHorizontalStyle1Component} from "./style-1.component";
import {FuseSharedModule} from "../../../../../@fuse/shared.module";
import {FuseNavigationModule} from "../../../../../@fuse/components";

@NgModule({
  declarations: [
    NavbarHorizontalStyle1Component
  ],
  imports: [
    MatButtonModule,
    MatIconModule,

    FuseSharedModule,
    FuseNavigationModule
  ],
  exports: [
    NavbarHorizontalStyle1Component
  ]
})
export class NavbarHorizontalStyle1Module {
}
