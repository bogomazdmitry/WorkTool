import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorModel } from '../../models/error-dialog-model';

@Component({
  selector: 'global-error-dialog',
  templateUrl: './global-error-dialog.component.html',
  styleUrls: ['./global-error-dialog.component.scss'],
})
export class GlobalErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GlobalErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorModel
  ) {}
}
