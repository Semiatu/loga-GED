// MAIN
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// ABSTRACT AND UTILITY
import { GenericPersistenceComponent } from 'src/@externals/loga/_abstract';
import { Paths } from 'src/environments/paths';
import { Router } from '@angular/router';
// MODEL
import { Dummy } from 'src/app/main/skeleton/configuration/_model';
// SERVICE
import { DummyService } from 'src/app/main/skeleton/configuration/_service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
// RESOLVER
import { DummyFormResolver } from 'src/app/main/skeleton/configuration/_resolver';


@Component({
  selector: 'dummy-form',
  templateUrl: './dummy-form.component.html',
  styleUrls: ['./dummy-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DummyFormComponent extends GenericPersistenceComponent<Dummy, number, DummyService> implements OnInit {

  action = 'add';
  dummy: Dummy;

  constructor(protected _notificationService: SnackBarService,
    protected _dialogService: DialogService,
    protected _translateService: TranslateService,
    protected _service: DummyService,
    protected router: Router,
    protected dummyResolver: DummyFormResolver,
  ) {
    super(_notificationService, _dialogService, _translateService, _service, router);
  }

  ngOnInit(): void {
    if (this.dummyResolver.dummy) {
      this.dummy = this.dummyResolver.dummy;
      this.action = 'edit';
    }
  }

  save(dummy: any): void {
    this.addSub(
        this._service.save(dummy).subscribe(value => {
            this._translateService.get(['APP.SUCCESS', 'APP.ADD']).subscribe(values => {
                this.navigateToList(values['APP.SUCCESS'], values['APP.ADD'], Paths.configurationPath('dummies'));
            });
        }, error => {
            this.showError(error);
        })
    );
  }

  update(dummy: any): void {
    this.addSub(
        this._service.update(dummy.id, dummy).subscribe(value => {
            this._translateService.get(['APP.SUCCESS', 'APP.UPDATE']).subscribe(values => {
                this.navigateToList(values['APP.SUCCESS'], values['APP.UPDATE'], Paths.configurationPath('dummies'));
            });
        }, error => {
        this.showError(error);
        })
    );
  }
}
