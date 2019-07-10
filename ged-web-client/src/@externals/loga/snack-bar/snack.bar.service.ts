import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {
  }

  open(message, action, duration?) {
    this.snackBar.open(message, action, {
      duration: duration ? duration : 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
