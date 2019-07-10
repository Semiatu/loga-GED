import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard} from 'src/@externals/loga/_authentification/guard/role.guard';
import {AuthenticationChildGuard} from 'src/@externals/loga/_authentification/guard/authentication.child.guard';
import {RoleChildGuard} from 'src/@externals/loga/_authentification/guard/role.child.guard';

const mainRoutes: Routes = [
  {
    path: 'permission',
    loadChildren: './permission/permission.module#PermissionModule',
    canActivate: [RoleGuard],
    canActivateChild: [AuthenticationChildGuard, RoleChildGuard]
  },
  {
    path: 'skeleton',
    loadChildren: './skeleton/skeleton.module#SkeletonModule',
    canActivate: [RoleGuard],
    canActivateChild: [AuthenticationChildGuard, RoleChildGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(mainRoutes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
