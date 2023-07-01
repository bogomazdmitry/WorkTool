import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ErrorModel } from '../../models/error-dialog-model';
import { ErrorService } from '../../services/global-error.service';
import { GlobalErrorDialogComponent } from '../global-error-dialog/global-error-dialog.component';

@Component({
  selector: 'global-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.scss'],
})
export class GlobalErrorComponent implements OnInit {
  private dialogIsOpen = false;

  private dialogRef:
    | MatDialogRef<GlobalErrorDialogComponent, ErrorModel>
    | undefined = undefined;

  constructor(private errorService: ErrorService, private dialog: MatDialog) {}

  ngOnInit() {
    this.errorService.getError().subscribe(this.handleError.bind(this));
  }

  private handleError(errorModel: ErrorModel) {
    if (!this.dialogIsOpen || !this.dialogRef) {
      this.dialogRef = this.dialog.open(GlobalErrorDialogComponent, {
        data: errorModel,
      });
      this.dialogIsOpen = true;
      this.dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe(() => {
          this.dialogIsOpen = false;
        });
    } else {
      this.dialogRef.componentInstance.data = errorModel;
    }
  }
}
