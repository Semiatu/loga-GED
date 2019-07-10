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
import { Profile } from 'src/app/main/permission/_model';
// SERVICE
import { ProfileService } from 'src/app/main/permission/_service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/@externals/loga/dialog/dialog.service';
import { SnackBarService } from 'src/@externals/loga/snack-bar/snack.bar.service';
// CRITERIA
import { ProfileCriteria } from 'src/app/main/permission/_criteria';
// RESOLVER
import { ProfileListResolver } from 'src/app/main/permission/_resolver';
// DATASOURCE
import { ProfileDatasource } from 'src/app/main/permission/_datasource';


@Component({
  selector: 'profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProfileListComponent extends GenericListComponent<Profile, ProfileService> implements OnInit, OnDestroy {
  displayedColumns = ['id', 'createdBy', 'name', 'description', 'actions'];

  icon = 'vpn_key';
  criteria: ProfileCriteria = new ProfileCriteria();
  baseLink = Paths.permissionPath('profiles');

  private _unsubscribeAll: Subject<any>;
  private onProfilesChanged: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(
    protected _notificationService: SnackBarService,
    protected _dialogService: DialogService,
    protected _translateService: TranslateService,
    protected _service: ProfileService,
    private profileResolver: ProfileListResolver,
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
      this.reload(Helpers.getOthers(data));
      this.hideLoading();
    });
  }

  gotoEditComponent(component: any) {
  }

  refresh() {
    this.criteria = new ProfileCriteria();
    this.dataSource = this.initialDataSource;
  }

  delete(component) {
    super.delete(component, 'ce profil');
  }

  private initData() {
    this.totalElements = this.profileResolver.total;
    this.dataSource = new ProfileDatasource(this.profileResolver.profiles, this.profileResolver.onProfilesChanged,
      this.paginator, this.sort);
    this.initialDataSource = this.dataSource;
  }
}
