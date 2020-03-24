import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AboutDialogComponent} from '../../dialog/about-dialog/about-dialog.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  year: Date;

  constructor(
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.year = new Date();
  }

// Окно о прогамме
  openAboutDialog() {
    this.dialog.open(AboutDialogComponent, {
      autoFocus: false,
      data: {
        dialogTitle: 'О приложении',
        message: 'Данное приложение было создано по урокам видео курса "Angular для начинающих" на сайте javabegin.ru'
      },
      width: '400px'
    });


  }
}
