import { Helpers } from 'src/@externals/loga/_utility';
import { AbstractService, Entity } from 'src/@externals/loga/_abstract';
import { FormGroup, Validators, AbstractControl } from '@angular/forms';
import { GenericComponent } from 'src/@externals/loga/_abstract/generic.component';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export class GenericPersistenceComponent<T extends Entity<T>, ID, R extends AbstractService<T, ID>> extends GenericComponent {

  form: FormGroup;
  minLength = 4;
  maxLength = 255;

  constructor(
    protected _notificationService: SnackBarService,
    protected _dialogService: DialogService,
    protected _translateService: TranslateService,
    protected _service: R,
    protected router: Router,
  ) {
    super(_notificationService, _dialogService, _translateService);
  }

  subCtrlVC(ctrlName: string, observer): void {
    this.addSub(this.$ctrlValueChanges(ctrlName).subscribe(observer));
    }

    $ctrlValueChanges(ctrlName: string): Observable<any> {
        return this.ctrl(ctrlName).valueChanges;
    }

    ctrlSetValue(ctrlName: string, value: any): void {
        this.ctrl(ctrlName).setValue(value);
    }

    ctrl(ctrlName: string): AbstractControl {
        return this.form.get(ctrlName);
    }

  checkReturn(ret) {
    return Helpers.checkReturn(ret);
  }

  get strRequiredMinMax() {
    return [
        Validators.required,
        Validators.minLength(this.minLength),
        Validators.maxLength(this.maxLength)
    ];
}

get strRequiredMax() {
    return [Validators.required, Validators.maxLength(this.maxLength)];
}

get strRequiredMin(): Validators[] {
    return [Validators.required, Validators.minLength(this.minLength)];
}

get strMinMax(): Validators[] {
    return [
        Validators.required,
        Validators.minLength(this.minLength),
        Validators.maxLength(this.maxLength)
    ];
}

  protected navigateToList(message, action, path) {
    const booleanPromise = this.router.navigateByUrl(path);
    booleanPromise.then(result => {
      if (result) {
        this._notificationService.open(message, action);
      }
    });
  }

  printElement(elementID, title = ""): void {
    this.showLoading();
    const printElement = document.getElementById(elementID);
    const data = printElement.innerHTML;
    const doc = window.document.body.innerHTML;
    window.document.body.innerHTML = data;
    window.print();
    window.document.body.innerHTML = doc;
    window.close();
    window.location.reload();
}
}
