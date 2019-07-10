// MAIN
import { Component, OnDestroy, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// ABSTRACT AND UTILITY
import { matchOtherValidator } from 'src/@externals/loga/_validator/match.other.validator';
import { GenericPersistenceComponent } from 'src/@externals/loga/_abstract';
import { Paths } from 'src/environments/paths';
// MODEL
import { User } from 'src/app/main/permission/_model';
// SERVICE
import { UserService } from 'src/app/main/permission/_service';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
// RESOLVER
import { UserFormResolver } from 'src/app/main/permission/_resolver';


@Component({
  selector: 'user-generic-form',
  templateUrl: './user-generic-form.component.html',
  styleUrls: ['./user-generic-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UserGenericFormComponent extends GenericPersistenceComponent<User, number, UserService> implements OnInit {

  @Input()
  action: string;

  @Input()
  user: User;

  @Output()
  eventSave: EventEmitter<User> = new EventEmitter();

  @Output()
  eventUpdate: EventEmitter<User> = new EventEmitter();

  icon = 'account_box';
  componentName;
  passwordConfirm = null;
  hcp = true;
  hp = true;
  baseLink = Paths.permissionPath('users');

  constructor(
    protected _notificationService: SnackBarService,
    protected _service: UserService,
    protected _translateService: TranslateService,
    protected _router: Router,
    protected _formBuilder: FormBuilder,
    protected userResolver: UserFormResolver,
  ) {
    super(_notificationService, null, _translateService, _service, _router);
  }


  ngOnInit(): void {
    const key = this.action === 'edit' ? 'EDIT_TITLE' : 'ADD_TITLE';
    this._translateService.get('APP.USER.' + key).subscribe(title => {
      this.componentName = title;
    });
    if (!this.user) {
      this.user = new User();
      this.buildForAddForm();
    } else {
      this.buildForEditForm();
    }
    this.setFormData(this.user);
    this.subscribe();
  }

  private setFormData(user: User): void {
    this.form.get('username').setValue(user.username);
    this.form.get('firstName').setValue(user.firstName);
    this.form.get('lastName').setValue(user.lastName);
    this.form.get('password').setValue(user.password);
    this.form.get('passwordConfirm').setValue(this.passwordConfirm);
    this.form.get('phone').setValue(this.user.phone);
    this.form.get('email').setValue(this.user.email);
    this.form.get('address').setValue(this.user.address);
    this.form.get('profile').setValue(this.user.profile);
  }

  protected buildForm(): void {
    this.form = this._formBuilder.group({
      username: [this.user.username, this.strRequiredMinMax],
      firstName: [this.user.firstName, this.strRequiredMinMax],
      lastName: [this.user.lastName, this.strRequiredMinMax],
      phone: [this.user.phone],
      email: [this.user.email],
      address: [this.user.address],
      profile: [this.user.profile, [Validators.required]],
    });
  }

  private buildForAddForm(): void {
    this.buildForm();
    this.form.addControl('password', new FormControl(this.user.password, this.strRequiredMinMax));
    this.form.addControl('passwordConfirm',
      new FormControl(this.passwordConfirm,
        [...this.strRequiredMinMax, matchOtherValidator('password')]));
  }

  private buildForEditForm(): void {
    this.buildForm();
    this.form.addControl('password', new FormControl(this.user.password));
    this.form.addControl('passwordConfirm', new FormControl(this.passwordConfirm,
      [matchOtherValidator('password')]));
  }

  private subscribe(): void {
    if (!this.form) {
      if (this.user.id) {
        this.buildForEditForm();
      } else {
        this.buildForAddForm();
      }
    }
    this.form.get('username').valueChanges.subscribe(value => this.user.username = value);
    this.form.get('firstName').valueChanges.subscribe(value => this.user.firstName = value);
    this.form.get('lastName').valueChanges.subscribe(value => this.user.lastName = value);
    this.form.get('password').valueChanges.subscribe(value => this.user.password = value);
    this.form.get('passwordConfirm').valueChanges.subscribe(value => this.passwordConfirm = value);
    this.form.get('phone').valueChanges.subscribe(value => this.user.phone = value);
    this.form.get('email').valueChanges.subscribe(value => this.user.email = value);
    this.form.get('address').valueChanges.subscribe(value => this.user.address = value);
    this.form.get('profile').valueChanges.subscribe(value => this.user.profile = value);
  }

  save(): void {
    this.eventSave.emit(this.user);
  }

  update(): void {
    this.eventUpdate.emit(this.user);
  }
}
