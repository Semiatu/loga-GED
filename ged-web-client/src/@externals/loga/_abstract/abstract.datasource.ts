import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { FuseUtils } from 'src/@externals/fuse/@fuse/utils';
import { Properties } from './properties';

export abstract class AbstractDatasource<T> extends DataSource<T> {

  private _filterChange: BehaviorSubject<string> = new BehaviorSubject('');
  private _filteredDataChange: BehaviorSubject<T[]> = new BehaviorSubject([]);

  constructor(
    private _items: T[],
    private _onItemsChanged: BehaviorSubject<T[]>,
    private _matPaginator: MatPaginator,
    private _matSort: MatSort
  ) {
    super();

    this.filteredData = this._items;
  }

  nextItems(items: T[]) {
    this._onItemsChanged.next(items);
  }

  get items(): T[] {
    return this._items;
  }

  set items(value: T[]) {
    this._items = value;
  }

  get matPaginator(): MatPaginator {
    return this._matPaginator;
  }

  set matPaginator(value: MatPaginator) {
    this._matPaginator = value;
  }

  get matSort(): MatSort {
    return this._matSort;
  }

  set matSort(value: MatSort) {
    this._matSort = value;
  }

  get filteredData(): T[] {
    return this._filteredDataChange.value;
  }

  set filteredData(value: T[]) {
    this._filteredDataChange.next(value);
  }

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  connect(): Observable<T[]> {
    const displayDataChanges = [
      this._onItemsChanged,
      this._filterChange,
      this._matSort.sortChange
    ];
    return merge(...displayDataChanges).pipe(map(() => {

      let data = this._items.slice();

      data = this.filterData(data);

      this.filteredData = [...data];

      data = this.sortData(data);

      return data;
    })
    );

  }

  filterData(data): T[] {
    if (!this.filter) {
      return data;
    }
    return FuseUtils.filterArrayByString(data, this.filter);
  }

  sortData(data): T[] {
    if (!this._matSort.active || this._matSort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const properties = this._switch(this._matSort.active, a, b);
      const valueA = isNaN(+properties.propertyA) ? properties.propertyA : +properties.propertyA;
      const valueB = isNaN(+properties.propertyB) ? properties.propertyB : +properties.propertyB;
      return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
    });
  }

  disconnect(): void {
  }

  protected abstract _switch(active: string, a: any, b: any): Properties;
}
