import {Component, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../fuse/@fuse/animations';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm.dialog.component.html',
  styleUrls: ['./confirm.dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ConfirmDialogComponent {
  confirmMessage: string;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}
}
