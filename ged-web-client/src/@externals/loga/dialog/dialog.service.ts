import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ConfirmDialogComponent} from './confirm.dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {
  }

  openConfirmDialog(message: string) {
    const matDialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true
    });
    matDialogRef.componentInstance.confirmMessage = message;
    return matDialogRef;
  }
}
