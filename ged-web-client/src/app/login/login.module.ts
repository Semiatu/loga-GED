import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule} from '@angular/material';
import {LoginComponent} from './login.component';
import {FuseSharedModule} from 'src/@externals/fuse/@fuse/shared.module';
import {AuthenticationService} from 'src/@externals/loga/_authentification/authentication.service';

const routes = [
  {
    path: '',
    component: LoginComponent,
  }
];

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,

    FuseSharedModule
  ],
  providers: [
    AuthenticationService
  ]
})
export class LoginModule {
}
