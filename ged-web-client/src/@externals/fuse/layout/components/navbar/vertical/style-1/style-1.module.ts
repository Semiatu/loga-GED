import {NgModule} from '@angular/core';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {NavbarVerticalStyle1Component} from "./style-1.component";
import {FuseNavigationModule} from "../../../../../@fuse/components";
import {FuseSharedModule} from "../../../../../@fuse/shared.module";


@NgModule({
  declarations: [
    NavbarVerticalStyle1Component
  ],
  imports: [
    MatButtonModule,
    MatIconModule,

    FuseSharedModule,
    FuseNavigationModule
  ],
  exports: [
    NavbarVerticalStyle1Component
  ]
})
export class NavbarVerticalStyle1Module {
}
