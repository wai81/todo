import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Task} from '../../model/Task';
import {DataHandlerService} from '../../service/data-handler.service';
import {Category} from '../../model/Category';
import {Priority} from '../../model/Priority';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {OperType} from '../OperType';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})
export class EditTaskDialogComponent implements OnInit {

  categories: Category[];
  priorities: Priority[];

  dialogTitle: string; // заголовог диалога
  task: Task; // задача для редактирования/создания
  operType: OperType;

  // сохраняем все значения в отдельные переменные
  // чтобы изменения не сказывались на самой задаче и можно было отменить
  tmpTitle: string;
  tmpCategory: Category;
  tmpPriority: Priority;
  tmpDate: Date;


  // сохраняем все значения в отдельные переменные

  constructor(
    private dialogRef: MatDialogRef<EditTaskDialogComponent>, // для работы с текущим диалоговыи окном
    @Inject(MAT_DIALOG_DATA) private data: [Task, string, OperType], // данные, которые передали в диалоговое окно
    private dataHandler: DataHandlerService, // ссылка на сервис для работы с данными
    private dialog: MatDialog, // для открытия нового диалогового окна (из текущего) - например для подтверждения удаления
  ) {

  }

  ngOnInit() {
    this.task = this.data[0]; // задача для редактирования/создания
    this.dialogTitle = this.data[1]; // текст для диалогового окна
    this.operType = this.data[2];

    // инициализация начальных значений (записывам в отдельные переменные
    // чтобы можно было отменить изменения, а то будут сразу записываться в задачу)
    this.tmpTitle = this.task.title;
    this.tmpCategory = this.task.category;
    this.tmpPriority = this.task.priority;
    this.tmpDate = this.task.date;

    this.dataHandler.getAllCategories().subscribe(items => this.categories = items);
    this.dataHandler.getAllPriorities().subscribe(items => this.priorities = items);
  }

  // нажатие кнопки сохранить
  onConfirm(): void {

    // считываем все значения для сохранения в поля задачи
    this.task.title = this.tmpTitle;
    this.task.category = this.tmpCategory;
    this.task.priority = this.tmpPriority;
    this.task.date = this.tmpDate;

    // передаем добавленную/измененную задачу в обработчик
    // что с ним будут делать - уже на задача этого компонента
    this.dialogRef.close(this.task);
  }

  // нажатие кнопки отмена
  onCancel(): void {
    this.dialogRef.close(null);
  }

  delete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: `Вы действительно хотите удалить задачу: "${this.task.title}"?`
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close('delete'); // нажали удалить
      }
    });
  }

  // нажали Выполнить (завершить) задачу
  complete() {
    this.dialogRef.close('complete');
  }

  // делаем статус задачи "незавершенным" (активируем)
  activate() {
    this.dialogRef.close('activate');
  }

  canDelete(): boolean {
    return this.operType === OperType.EDIT;
  }

  canActivateDesactivate(): boolean {
    return this.operType === OperType.EDIT;
  }
}
