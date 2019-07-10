import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from 'src/@externals/fuse/@fuse/animations';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FuseConfigService } from 'src/@externals/fuse/@fuse/services/config.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/@externals/loga/_authentification/authentication.service';
import { projectOption } from 'src/environments/project.option';
import { RoleHelpers } from 'src/@externals/loga/_utility/role.helpers';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  /**
   * JWT Helpers
   */
  private helper = new JwtHelperService();


  constructor(
    private _fuseConfigService: FuseConfigService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private _formBuilder: FormBuilder
  ) {
    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._createLoginForm();
  }

  private _createLoginForm() {
    this.loginForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  authenticate(user) {
    this.authenticationService.login(user).subscribe(
      response => {
        console.log('response = ' + response);
        const token = response.headers.get('Authorization');
        localStorage.setItem(projectOption.tokenKey, token);
        if (token) {
          console.log('Token');
          this.router.navigateByUrl(RoleHelpers.getTarget());
        }
      },
      error => {
      },
      () => {
      }
    );
  }
}
