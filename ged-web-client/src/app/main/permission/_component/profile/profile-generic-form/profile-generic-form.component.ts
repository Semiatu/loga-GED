// MAIN
import { Component, OnDestroy, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
// ABSTRACT AND UTILITY
import { GenericPersistenceComponent } from 'src/@externals/loga/_abstract';
import { Paths } from 'src/environments/paths';
// MODEL
import { Profile } from 'src/app/main/permission/_model';
// SERVICE
import { ProfileService } from 'src/app/main/permission/_service';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';



@Component({
  selector: 'profile-generic-form',
  templateUrl: './profile-generic-form.component.html',
  styleUrls: ['./profile-generic-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProfileGenericFormComponent extends GenericPersistenceComponent<Profile, number, ProfileService> implements OnInit {

  @Input()
  action: string;

  @Input()
  profile: Profile;

  @Output()
  eventSave: EventEmitter<Profile> = new EventEmitter();

  @Output()
  eventUpdate: EventEmitter<Profile> = new EventEmitter();

  icon = 'vpn_key';
  componentName;
  baseLink = Paths.permissionPath('profiles');

  constructor(
    protected _notificationService: SnackBarService,
    protected _service: ProfileService,
    protected _translateService: TranslateService,
    protected _router: Router,
    protected _formBuilder: FormBuilder,
  ) {
    super(_notificationService, null, _translateService, _service, _router);
  }


  ngOnInit(): void {
    const key = this.action === 'edit' ? 'EDIT_TITLE' : 'ADD_TITLE';
    this._translateService.get('APP.PROFILE.' + key).subscribe(title => {
      this.componentName = title;
    });
    if (!this.profile) {
      this.profile = new Profile();
    }
    this.buildForm();
    this.setFormData(this.profile);
    this.subscribe();
  }

  private setFormData(profile: Profile): void {
    this.form.get('name').setValue(profile.name);
    this.form.get('description').setValue(profile.description);
  }

  protected buildForm(): void {
    this.form = this._formBuilder.group({
      name: [this.profile.name, this.strRequiredMinMax],
      description: [this.profile.description]
    });
  }

  private subscribe(): void {
    if (!this.form) {
      this.buildForm();
    }
    this.form.get('name').valueChanges.subscribe(value => this.profile.name = value);
    this.form.get('description').valueChanges.subscribe(value => this.profile.description = value);
  }

  save(): void {
    this.eventSave.emit(this.profile);
  }

  update(): void {
    this.eventUpdate.emit(this.profile);
  }
}
