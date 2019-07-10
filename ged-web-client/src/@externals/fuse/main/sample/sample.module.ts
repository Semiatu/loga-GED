import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {SampleComponent} from './sample.component';
import {FuseSharedModule} from "../../@fuse/shared.module";

const routes = [
  {
    path: 'sample',
    component: SampleComponent
  }
];

@NgModule({
  declarations: [
    SampleComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    TranslateModule,

    FuseSharedModule
  ],
  exports: [
    SampleComponent
  ]
})

export class SampleModule {
}
