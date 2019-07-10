import { AbstractService, Entity } from 'src/@externals/loga/_abstract';
import { GenericComponent } from 'src/@externals/loga/_abstract/generic.component';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
import { TranslateService } from '@ngx-translate/core';
import { Helpers } from 'src/@externals/loga/_utility';
import { MatPaginator, MatSort, PageEvent } from '@angular/material';
import { AbstractDatasource } from 'src/@externals/loga/_abstract';
import { ElementRef, ViewChild } from '@angular/core';

export class GenericListComponent<T extends Entity<T>, R extends AbstractService<T, number>> extends GenericComponent {
  dataSource: AbstractDatasource<T> | null;
  initialDataSource: AbstractDatasource<T> | null;
  totalElements = 0;
  row = 10;

  @ViewChild('paginator')
  paginator: MatPaginator;

  @ViewChild('filter')
  filter: ElementRef;

  @ViewChild(MatSort)
  sort: MatSort;


  constructor(
    protected _notificationService: SnackBarService,
    protected _dialogService: DialogService,
    protected _translateService: TranslateService,
    protected _service: R,
  ) {
    super(_notificationService, _dialogService, _translateService);
  }

  delete(component, paramValue?) {
    this.showLoading();
    this._translateService.get(['APP.DELETE_CONFIRM', 'APP.SUCCESS', 'APP.DELETE'], { value: paramValue })
      .subscribe(values => {
        const matDialogRef = this._dialogService.openConfirmDialog(values['APP.DELETE_CONFIRM']);
        matDialogRef.afterClosed().subscribe(response => {
          if (response) {
            this._service.delete(component.id).subscribe(value => {
              this._service.findAllPage(0, this.row).subscribe(data => {
                this.reload(Helpers.getOthers(data));
                this.initialDataSource = this.dataSource;
                this._notificationService.open(values['APP.SUCCESS'], values['APP.DELETE']);
                this.hideLoading();
              });
            }, error => {
              this.showError(error);
            });
          }
        });
      });
  }

  page($event: PageEvent) {
    console.log($event);
    this._service.findAllPage($event.pageIndex, $event.pageSize).subscribe(data => {
      this.totalElements = Helpers.getTotalElements(data);
      this.reload(Helpers.getOthers(data));
    });
  }

  gotoEditComponent(component: any) {
  }

  protected reload(items: T[]) {
    this.dataSource.items = items;
    this.dataSource.nextItems(items);
    this.dataSource.matPaginator = this.paginator;
    this.dataSource.matSort = this.sort;
  }
  
}
