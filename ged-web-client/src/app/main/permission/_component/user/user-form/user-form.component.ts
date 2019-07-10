// MAIN
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// ABSTRACT AND UTILITY
import { GenericPersistenceComponent } from 'src/@externals/loga/_abstract';
import { Paths } from 'src/environments/paths';
import { Router } from '@angular/router';
// MODEL
import { User } from 'src/app/main/permission/_model';
// SERVICE
import { UserService } from 'src/app/main/permission/_service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
// RESOLVER
import { UserFormResolver } from 'src/app/main/permission/_resolver';


@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UserFormComponent extends GenericPersistenceComponent<User, number, UserService> implements OnInit {

  action = 'add';

  user: User;

  constructor(protected _notificationService: SnackBarService,
    protected _dialogService: DialogService,
    protected _translateService: TranslateService,
    protected _service: UserService,
    protected router: Router,
    protected userResolver: UserFormResolver,
  ) {
    super(_notificationService, _dialogService, _translateService, _service, router);
  }

  ngOnInit(): void {
    if (this.userResolver.user) {
      this.user = this.userResolver.user;
      this.action = 'edit';
    }
  }

  save(user) {
    this._service.save(user).subscribe(value => {
      this._translateService.get(['APP.SUCCESS', 'APP.ADD']).subscribe(values => {
        this.navigateToList(values['APP.SUCCESS'], values['APP.ADD'], Paths.permissionPath('users'));
      });
    }, error => {
      this.showError(error);
    });
  }

  update(user) {
    this._service.update(user.id, user).subscribe(value => {
      this._translateService.get(['APP.SUCCESS', 'APP.UPDATE']).subscribe(values => {
        this.navigateToList(values['APP.SUCCESS'], values['APP.UPDATE'], Paths.permissionPath('users'));
      });
    }, error => {
      this.showError(error);
    });
  }
}
