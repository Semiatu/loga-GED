import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { FuseUtils } from 'src/@externals/fuse/@fuse/utils';
import { Properties } from './properties';

export abstract class AbstractListResolver {

  constructor() {
  }

  public abstract hasDetails(): boolean;

  public abstract hasUpload(): boolean;

}
