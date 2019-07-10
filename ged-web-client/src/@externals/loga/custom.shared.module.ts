import {NgModule} from '@angular/core';
import {ArticleFilter, NameFilter, VehicleNameFilter, WordingFilter} from './_pipes';
import {ArticleDateFilter} from './_pipes/article.date.filter';
import {KeyValueFilter} from './_pipes/key.value.filter';

@NgModule({
  declarations: [
    WordingFilter,
    VehicleNameFilter,
    NameFilter,
    ArticleFilter,
    ArticleDateFilter,
    KeyValueFilter,
  ],

  imports: [],

  exports: [
    WordingFilter,
    VehicleNameFilter,
    NameFilter,
    ArticleFilter,
    KeyValueFilter,
  ]

})
export class CustomSharedModule {
}
