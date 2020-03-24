import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.css']
})
export class AboutDialogComponent implements OnInit {
  message: string;
  dialogTitle: string;

  constructor(
    private dialogRef: MatDialogRef<AboutDialogComponent>, // для работы с текущим диалогом
    @Inject(MAT_DIALOG_DATA) data: { dialogTitle: string, message: string } // данные, которые передаем
  ) {
    // текст для диалогового окна
    this.dialogTitle = data.dialogTitle; // заголовок
    this.message = data.message; // сообщение
  }

  ngOnInit(): void {
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
