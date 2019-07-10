import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserFormComponent } from './_component/user/user-form/user-form.component';
import { UserFormResolver } from './_resolver/user/user.form.resolver';
import { UserListComponent } from './_component/user/user-list/user-list.component';
import { UserListResolver } from './_resolver/user/user.list.resolver';
import { ProfileListComponent } from './_component/profile/profile-list/profile-list.component';
import { ProfileListResolver } from './_resolver/profile/profile.list.resolver';
import { ProfileFormComponent } from './_component/profile/profile-form/profile-form.component';
import { ProfileFormResolver } from './_resolver/profile/profile.form.resolver';
import { ProfileRoleComponent } from './_component/profile/profile-roles/profile-role.component';
import { ProfileRoleResolver } from './_resolver/profile/profile.role.resolver';
import { LogComponent } from './_component/log/log.component';
import { LogResolver } from './_resolver/log/log.resolver';


const permissionRoutes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'logs', component: LogComponent, resolve: { data: LogResolver } },
  {
    path: 'users',
    children: [
      { path: '', component: UserListComponent, resolve: { data: UserListResolver } },
      { path: ':id', component: UserFormComponent, resolve: { data: UserFormResolver } },
      { path: 'new', component: UserFormComponent, resolve: { data: UserFormResolver } }
    ]
  },
  {
    path: 'profiles',
    children: [
      { path: '', component: ProfileListComponent, resolve: { data: ProfileListResolver }, },
      { path: ':id', component: ProfileFormComponent, resolve: { data: ProfileFormResolver } },
      { path: ':id/roles', component: ProfileRoleComponent, resolve: { data: ProfileRoleResolver } },
      { path: 'new', component: ProfileFormComponent, resolve: { data: ProfileFormResolver } }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(permissionRoutes)],
  exports: [RouterModule]
})
export class PermissionRoutingModule {
}
