import {NgModule} from '@angular/core';
import {MatSidenavModule} from '@angular/material';
import {HorizontalLayout1Component} from './layout-1.component';
import {FuseSharedModule} from "../../../@fuse/shared.module";
import {FuseSidebarModule} from "../../../@fuse/components";
import {ContentModule} from "src/@externals/fuse/layout/components/content/content.module";
import {FooterModule} from "../../components/footer/footer.module";
import {NavbarModule} from "../../components/navbar/navbar.module";
import {QuickPanelModule} from "../../components/quick-panel/quick-panel.module";
import {ToolbarModule} from "../../components/toolbar/toolbar.module";
import {FuseThemeOptionsModule} from "../../../@fuse/components/theme-options/theme-options.module";

@NgModule({
  declarations: [
    HorizontalLayout1Component
  ],
  imports: [
    MatSidenavModule,

    FuseSharedModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,

    ContentModule,
    FooterModule,
    NavbarModule,
    QuickPanelModule,
    ToolbarModule
  ],
  exports: [
    HorizontalLayout1Component
  ]
})
export class HorizontalLayout1Module {
}
