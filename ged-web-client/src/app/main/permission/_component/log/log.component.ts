// MAIN
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { fuseAnimations } from 'src/@externals/fuse/@fuse/animations';
// ABSTRACT AND UTILITY
import { GenericListComponent } from 'src/@externals/loga/_abstract';
import { Helpers } from 'src/@externals/loga/_utility';
import { Paths } from 'src/environments/paths';
// MODEL
import { Log } from 'src/app/main/permission/_model';
// SERVICE
import { LogService } from 'src/app/main/permission/_service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
// CRITERIA
import { LogCriteria } from 'src/app/main/permission/_criteria';
// RESOLVER
import { LogResolver } from 'src/app/main/permission/_resolver';
// DATASOURCE
import { LogDatasource } from 'src/app/main/permission/_datasource';

@Component({
  selector: 'log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LogComponent extends GenericListComponent<Log, LogService> implements OnInit, OnDestroy {
  displayedColumns = ['id', 'createdBy', 'action', 'description'];
  actions = [];
  icon = 'grade';
  criteria: LogCriteria = new LogCriteria();
  baseLink = Paths.permissionPath('logs');

  private _unsubscribeAll: Subject<any>;

  constructor(
    protected _notificationService: SnackBarService,
    protected _dialogService: DialogService,
    protected _translateService: TranslateService,
    protected _service: LogService,
    private logResolver: LogResolver,
  ) {
    super(_notificationService, _dialogService, _translateService, _service);
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.initData();
    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
    this.actions = [
      { label: 'Création', value: 'create' },
      { label: 'Mise à jour', value: 'update' },
      { label: 'Suppression', value: 'delete' }
    ];
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  search(page: number) {
    this.showLoading();
    this._service.search(this.criteria, page, this.row).subscribe(data => {
      this.totalElements = Helpers.getTotalElements(data);
      this.reload(Helpers.getOthers(data));
      this.hideLoading();
    });
  }

  refresh() {
    this.criteria = new LogCriteria();
    this.dataSource = this.initialDataSource;
  }

  delete(component) {
    super.delete(component, 'ce log');
  }

  private initData() {
    this.totalElements = this.logResolver.total;
    this.dataSource = new LogDatasource(this.logResolver.logs, this.logResolver.onLogsChanged, this.paginator, this.sort);
    this.initialDataSource = this.dataSource;
  }
}
