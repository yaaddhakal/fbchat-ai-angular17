import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string) {
  this.snackBar.open(message, 'Close', {
    duration: 3000,
    panelClass: ['bg-green-600']
  });
}

error(message: string) {
  this.snackBar.open(message, 'Close', {
    duration: 3000,
    panelClass: ['bg-red-600']
  });
}

info(message: string) {
  this.snackBar.open(message, 'Close', {
    duration: 3000,
    panelClass: ['bg-blue-600']
  });
}

}
