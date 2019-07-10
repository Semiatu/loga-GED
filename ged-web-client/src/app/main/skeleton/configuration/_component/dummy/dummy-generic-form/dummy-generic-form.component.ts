// MAIN
import { Component, OnDestroy, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// ABSTRACT AND UTILITY
import { matchOtherValidator } from 'src/@externals/loga/_validator/match.other.validator';
import { GenericPersistenceComponent } from 'src/@externals/loga/_abstract';
import { Paths } from 'src/environments/paths';
// MODEL
import { Dummy } from 'src/app/main/skeleton/configuration/_model';
// SERVICE
import { DummyService } from 'src/app/main/skeleton/configuration/_service';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
// RESOLVER
import { DummyFormResolver } from 'src/app/main/skeleton/configuration/_resolver';



@Component({
  selector: 'dummy-generic-form',
  templateUrl: './dummy-generic-form.component.html',
  styleUrls: ['./dummy-generic-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DummyGenericFormComponent extends GenericPersistenceComponent<Dummy, number, DummyService> implements OnInit {

  @Input()
  action: string;

  @Input()
  dummy: Dummy;

  @Output()
  save: EventEmitter<Dummy> = new EventEmitter();

  @Output()
  update: EventEmitter<Dummy> = new EventEmitter();

  icon = 'extension';
  componentName;
  passwordConfirm = null;
  hcp = true;
  hp = true;
  baseLink = Paths.configurationPath('dummies');

  constructor(
    protected _notificationService: SnackBarService,
    protected _service: DummyService,
    protected _translateService: TranslateService,
    protected _router: Router,
    protected _formBuilder: FormBuilder,
    protected dummyResolver: DummyFormResolver,
  ) {
    super(_notificationService, null, _translateService, _service, _router);
  }


  ngOnInit(): void {
    const key = this.action === 'edit' ? 'EDIT_TITLE' : 'ADD_TITLE';
    this._translateService.get('APP.USER.' + key).subscribe(title => {
      this.componentName = title;
    });
    if (!this.dummy) {
      this.dummy = new Dummy();
    }
    this.buildForm();
    this.setFormData(this.dummy);
    this.subscribe();
  }

  private setFormData(dummy: Dummy): void {
    this.ctrlSetValue('wording', dummy.wording);
    this.ctrlSetValue('description', dummy.description);
    this.ctrlSetValue('status', dummy.status);
  }

  protected buildForm(): void {
    this.form = this._formBuilder.group({
      wording: [this.dummy.wording, this.strRequiredMinMax],
      description: [this.dummy.description],
      status: [this.dummy.status],
    });
  }

  private subscribe(): void {
    if (!this.form) {
      this.buildForm();
    }
    this.subCtrlVC('wording', value => this.dummy.wording = value);
    this.subCtrlVC('description', value => this.dummy.description = value);
    this.subCtrlVC('status', value => this.dummy.status = value);
  }

  _save(): void {
    this.save.emit(this.dummy);
  }

  _update(): void {
    this.update.emit(this.dummy);
  }
}
