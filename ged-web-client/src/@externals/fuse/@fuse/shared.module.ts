import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';
import {FuseDirectivesModule} from './directives/directives';
import {FusePipesModule} from './pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,

    FlexLayoutModule,

    FuseDirectivesModule,
    FusePipesModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,

    FlexLayoutModule,

    FuseDirectivesModule,
    FusePipesModule
  ]
})
export class FuseSharedModule {
}
