import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.css']
})
export class EditCategoryDialogComponent implements OnInit {
  private categoryTitle: string;
  private dialogTitle: string;

  constructor(
    private dialogRef: MatDialogRef<EditCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [string, string],
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {

    this.categoryTitle = this.data[0];
    this.dialogTitle = this.data[1];
  }

  // OK
  onConfirm() {
    this.dialogRef.close(this.categoryTitle);
  }

  // Cancel
  onCancel() {
    this.dialogRef.close(false);
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: `Вы дествительно холите удалить категорию: "${this.categoryTitle}"? (Сами задачи не удаляются)`
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close('delete'); // нажали кнопку удалить
      }
    });
  }
}
