import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DummyListComponent } from './_component/dummy/dummy-list/dummy-list.component';
import { DummyFormComponent } from './_component/dummy/dummy-form/dummy-form.component';
import { DummyListResolver } from './_resolver/dummy/dummy.list.resolver';
import { DummyFormResolver } from './_resolver/dummy/dummy.form.resolver';
import { DummyDisplayFormComponent } from './_component/dummy/dummy-display-form/dummy-display-form.component';
import { DummyDisplayResolver } from './_resolver/dummy/dummy.display.resolver';

const configurationRoutes: Routes = [
  { path: '', redirectTo: '/dummies', pathMatch: 'full' },
  {
    path: 'dummies',
    children: [
      { path: '', component: DummyListComponent, resolve: { data: DummyListResolver } },
      { path: ':id', component: DummyFormComponent, resolve: { data: DummyFormResolver } },
      {path: ':id/display', component: DummyDisplayFormComponent, resolve: {data: DummyDisplayResolver}},
      { path: 'new', component: DummyFormComponent, resolve: { data: DummyFormResolver } }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(configurationRoutes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule {
}
