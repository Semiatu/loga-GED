import { NgModule } from '@angular/core';
import { MainRoutingModule } from './main.routing.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    // Authentication
    CommonModule,
    RouterModule,
    MainRoutingModule
  ],
})
export class MainModule {
}
