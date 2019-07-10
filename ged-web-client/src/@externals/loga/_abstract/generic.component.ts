import { Converter, Helpers } from 'src/@externals/loga/_utility';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { Optional, OnDestroy } from '@angular/core';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
import { AsyncSubject, Subscription } from 'rxjs';
import { projectOption } from 'src/environments/project.option';
import { TranslateService } from '@ngx-translate/core';
import { Paths } from 'src/environments/paths';

export class GenericComponent implements OnDestroy {

    private subs: Subscription[] = [];
    
  projectOption: any;
  loading: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(protected _notificationService: SnackBarService,
    @Optional() protected dialogService: DialogService,
    @Optional() protected translateService: TranslateService) {
    this.projectOption = projectOption;
  }

  money(number: number) {
    return Helpers.money(+number);
  }

  numberToLetter(num: number, add = false) {
    const letter = Converter.numberToLetter(Math.abs(Math.trunc(num)));
    return letter[0].toUpperCase() + letter.substring(1) + (add ? ' de' : '') + ' FRANC CFA';
  }

  compareById(t1, t2) {
    return Helpers.compareById(t1, t2);
  }

  showError(error) {
    console.log('Error: ' + error);
    if (error.error instanceof Error) {
      console.log('Client-side error occured.');
    } else {
      console.log('Server-side error occured.');
    }
    this._notificationService.open(this.getErrorMessage(error), '');
    this.hideLoading();
  }

  getErrorMessage(error) {
    if (error.status >= 400 && error.status < 500) {
      return error.error;
    } else {
      return error.error && error.error.status >= 500
        ? error.error.message
        : 'Problème de connexion, verifiez que le serveur est en marche';
    }
  }

  showLoading() {
    this.loading.next(true);
  }

  hideLoading() {
    this.loading.next(false);
  }

  target(path, param) {
    return [path, param];
  }

  join(path, part) {
    return Paths.join(path, part);
  }

  protected addSub(sub: Subscription): void {
    this.subs.push(sub);
}

protected unsubs(): void {
    this.subs.forEach(sub => sub.unsubscribe());
}

ngOnDestroy(): void {
    console.log('On destroy, ' + this.subs.length + ' subs');
    
    this.unsubs();
}
}
