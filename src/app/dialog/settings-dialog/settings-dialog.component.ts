import {Component, OnInit} from '@angular/core';
import {Priority} from '../../model/Priority';
import {MatDialogRef} from '@angular/material/dialog';
import {DataHandlerService} from '../../service/data-handler.service';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements OnInit {
  priorities: Priority[];

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>, // для возможности работы с текущим диалогом
    private dataHandler: DataHandlerService // ссылка на сервис для работы
  ) {
  }

  ngOnInit() {
    // получаем все значения чтобы отобразить настройку цветов
    this.dataHandler.getAllPriorities().subscribe(priorities => this.priorities = priorities);
  }

// кнопка закрыть
  onClose() {
    this.dialogRef.close(false);
  }

  // т.к. мы меняем значения в массивах, то изменения сразу отражаются на списке задач (не требуется доп. обновления)

  // добавили приоритет
  private onAddPriority(priority: Priority): void {
    this.dataHandler.addPriority(priority).subscribe();
  }

  // удалили приоритет
  private onDeletePriority(priority: Priority): void {
    this.dataHandler.deletePriority(priority.id).subscribe();
  }

  // обновили приоритет
  private onUpdatePriority(priority: Priority): void {
    this.dataHandler.updatePriority(priority).subscribe();
  }
}
