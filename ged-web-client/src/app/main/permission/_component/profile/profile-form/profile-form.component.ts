// MAIN
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// ABSTRACT AND UTILITY
import { GenericPersistenceComponent } from 'src/@externals/loga/_abstract';
import { Paths } from 'src/environments/paths';
import { Router } from '@angular/router';
// MODEL
import { Profile } from 'src/app/main/permission/_model';
// SERVICE
import { ProfileService } from 'src/app/main/permission/_service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
// RESOLVER
import { ProfileFormResolver } from 'src/app/main/permission/_resolver';



@Component({
  selector: 'profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProfileFormComponent extends GenericPersistenceComponent<Profile, number, ProfileService> implements OnInit {

  action = 'add';

  profile: Profile;

  constructor(protected _notificationService: SnackBarService,
    protected _dialogService: DialogService,
    protected _translateService: TranslateService,
    protected _service: ProfileService,
    protected profileResolver: ProfileFormResolver,
    protected router: Router
  ) {
    super(_notificationService, _dialogService, _translateService, _service, null);
  }

  ngOnInit(): void {
    if (this.profileResolver.profile) {
      this.profile = this.profileResolver.profile;
      this.action = 'edit';
    }
  }

  save(profile) {
    this._service.save(profile).subscribe(value => {
      this._translateService.get(['APP.SUCCESS', 'APP.ADD']).subscribe(values => {
        this.navigateToList(values['APP.SUCCESS'], values['APP.ADD'], Paths.permissionPath('profiles'));
      });
    }, error => {
      this.showError(error);
    });
  }

  update(profile) {
    this._service.update(profile.id, profile).subscribe(value => {
      this._translateService.get(['APP.SUCCESS', 'APP.UPDATE']).subscribe(values => {
        this.navigateToList(values['APP.SUCCESS'], values['APP.UPDATE'], Paths.permissionPath('profiles'));
      });
    }, error => {
      this.showError(error);
    });
  }
}
