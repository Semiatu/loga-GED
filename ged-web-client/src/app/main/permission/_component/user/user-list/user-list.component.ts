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
import { User } from 'src/app/main/permission/_model';
// SERVICE
import { UserService } from 'src/app/main/permission/_service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
// CRITERIA
import { UserCriteria } from 'src/app/main/permission/_criteria';
// RESOLVER
import { UserListResolver } from 'src/app/main/permission/_resolver';
// DATASOURCE
import { UserDatasource } from 'src/app/main/permission/_datasource';


@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserListComponent extends GenericListComponent<User, UserService> implements OnInit, OnDestroy {
  displayedColumns = ['id', 'createdBy', 'profile', 'username', 'firstName', 'lastName', 'phone', 'email', 'address', 'actions'];

  icon = 'account_box';
  criteria: UserCriteria = new UserCriteria();
  baseLink = Paths.permissionPath('users');

  private _unsubscribeAll: Subject<any>;

  constructor(
    protected _notificationService: SnackBarService,
    protected _dialogService: DialogService,
    protected _translateService: TranslateService,
    protected _service: UserService,
    private userResolver: UserListResolver,
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
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  search(page: number) {
    this.showLoading();
    this._service.search(this.criteria, page, this.row).subscribe(data => {
      this.totalElements = Helpers.getTotalElements(data);
      const value = Helpers.getOthers(data);
      this.reload(value);
      this.hideLoading();
    });
  }

  refresh() {
    this.criteria = new UserCriteria();
    this.dataSource = this.initialDataSource;
  }

  delete(component) {
    super.delete(component, 'cet utilisateur');
  }

  private initData() {
    this.totalElements = this.userResolver.total;
    this.dataSource = new UserDatasource(this.userResolver.users, this.userResolver.onUsersChanged,
      this.paginator, this.sort);
    this.initialDataSource = this.dataSource;
  }
}
