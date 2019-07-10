// MAIN
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from 'src/@externals/fuse/@fuse/animations';
// ABSTRACT AND UTILITY
import { GenericComponent } from 'src/@externals/loga/_abstract';
import { Paths } from 'src/environments/paths';
// MODEL
import { Profile, Role, ProfileRoleWrapper } from 'src/app/main/permission/_model';
// SERVICE
import { ProfileRoleService, ProfileService } from 'src/app/main/permission/_service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
// RESOLVER
import { ProfileRoleResolver } from 'src/app/main/permission/_resolver';


@Component({
  selector: 'profile-role',
  templateUrl: './profile-role.component.html',
  styleUrls: ['./profile-role.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProfileRoleComponent extends GenericComponent implements OnInit, OnDestroy {

  icon = 'vpn_key';
  baseLink = Paths.permissionPath('profiles');
  rolesTarget: Role[] = [];
  rolesSource: Role[] = [];
  profile: Profile;

  constructor(
    protected _notificationService: SnackBarService,
    protected _dialogService: DialogService,
    protected _translateService: TranslateService,
    private _service: ProfileService,
    private profileResolver: ProfileRoleResolver,
    private profileRoleService: ProfileRoleService,
  ) {
    super(_notificationService, _dialogService, _translateService);
  }


  /**
   * On init
   */
  ngOnInit(): void {
    this.profile = this.profileResolver.profile;
    this.rolesSource = this.profileResolver.rolesSource;
    this.rolesTarget = this.profileResolver.rolesTarget;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
  }

  save() {
    const profileRoleWrapper = new ProfileRoleWrapper();
    profileRoleWrapper.roles = this.rolesTarget;
    profileRoleWrapper.profile = this.profile;
    this.showLoading();
    this.profileRoleService.updateProfileRoles(profileRoleWrapper).subscribe(
      data => {
        this._translateService.get(['APP.SUCCESS', 'APP.UPDATE']).subscribe(values => {
          this._notificationService.open(values['APP.SUCCESS'], values['APP.UPDATE']);
        });
        this.hideLoading();
      }, error => {
        this.showError(error);
      });
  }
}
