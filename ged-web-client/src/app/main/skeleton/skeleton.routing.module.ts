import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/@externals/loga/_authentification/guard/role.guard';
import { AuthenticationChildGuard } from 'src/@externals/loga/_authentification/guard/authentication.child.guard';
import { RoleChildGuard } from 'src/@externals/loga/_authentification/guard/role.child.guard';

const skeletonRoutes: Routes = [
  {
    path: 'configuration',
    loadChildren: './configuration/configuration.module#ConfigurationModule',
    canActivate: [RoleGuard],
    canActivateChild: [AuthenticationChildGuard, RoleChildGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(skeletonRoutes)],
  exports: [RouterModule]
})
export class SkeletonRoutingModule {
}
