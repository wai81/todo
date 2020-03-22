import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Task} from '../../model/Task';
import {DataHandlerService} from '../../service/data-handler.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {EditTaskDialogComponent} from '../../dialog/edit-task-dialog/edit-task-dialog.component';
import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';
import {Category} from '../../model/Category';
import {Priority} from '../../model/Priority';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  // поля для таблицы (те, что отображают данные из задачи - должны совпадать с названиями переменных класса)
  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category', 'operations', 'select'];
  dataSource: MatTableDataSource<Task>; // контейнер - источник данных для таблицы

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  tasks: Task[];
  priorities: Priority[];

  @Output()
  deleteTask = new EventEmitter<Task>();

  @Output()
  updateTask = new EventEmitter<Task>();

  @Output()
  selectCategory = new EventEmitter<Category>();

  @Output()
  filterByStatus = new EventEmitter<boolean>();

  @Output()
  filterByTitle = new EventEmitter<string>();

  @Output()
  filterByPriority = new EventEmitter<Priority>();

  @Output()
  addTask = new EventEmitter<Task>();

  // поиск
  searchTaskText: string; // текущее значение для поиска задач
  selectedStatusFilter: boolean = null; // при нажатии на категорию из списка задач
  selectedPriorityFilter: Priority = null; // фильтр по приоритету

// текущие задачи для отображения на странице
  @Input('tasks')
  private set setTasks(tasks: Task[]) {
    // не присваевается значение напрямую только через @Input
    this.tasks = tasks;
    this.fillTable();
  }

  @Input('priorities')
  set setPriorities(priorities: Priority[]) {
    this.priorities = priorities;
  }

  @Input()
  selectedCategory: Category;

  constructor(private dataHandler: DataHandlerService, // доступ к данным
              private dialog: MatDialog // работа с диалогом
  ) {
  }

  ngOnInit() {
    // this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);

    // датасорс обязательно нужно создавать для таблицы,
    // в него присваивается любой источник (БД, массивы, JSON и пр.)
    this.dataSource = new MatTableDataSource();

    this.fillTable();
  }

  // в зависимости от статуса задачи - вернуть цвет названия
  getPriorityColor(task: Task): string {
    // цвет завершенной задачи
    if (task.completed) {
      return '#9f9f9f'; // TODO вынести цвета в константы (magic strings, magic numbers)
    }
    if (task.priority && task.priority.color) {
      return task.priority.color;
    }
    return '#fff'; // TODO вынести цвета в константы (magic strings, magic numbers)
  }

  // диалоговое окно для редактирования и добавления задачи
  openEditTaskDialog(task: Task): void {

    const dialogRef = this.dialog.open(EditTaskDialogComponent, {data: [task, 'Редактирование задачи'], autoFocus: false});

    dialogRef.afterClosed().subscribe(result => {
      // обработка результата
      if (result === 'complete') {
        task.completed = true; // ставим статус задачи выполняются
        this.updateTask.emit(task);
        return;
      }

      if (result === 'activate') {
        task.completed = false; // ставим статус задачи не выполняется
        this.updateTask.emit(task);
        return;
      }

      if (result === 'delete') {
        this.deleteTask.emit(task);
        return;
      }

      if (result as Task) { // нажали ОК и есть результат
        this.updateTask.emit(task);
        return;
      }

    });
  }

  // показывает задачи с применением всех текущий условий (категория, поиск, фильтры и пр.)
  private fillTable() {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.data = this.tasks; // обновить источник данных (т.к. данные массива tasks обновились)
    this.addTableObjects();

    // когда получаем новые данные..
    // чтобы можно было сортировать по столбцам "категория" и "приоритет", т.к. там не примитивные типы, а объекты
    // @ts-ignore - показывает ошибку для типа даты, но так работает, т.к. можно возвращать любой тип
    this.dataSource.sortingDataAccessor = (task, colName) => {
      switch (colName) {
        case 'priority' : {
          return task.priority ? task.priority.id : null;
        }
        case 'category' : {
          return task.category ? task.category.title : null;
        }
        case 'date' : {
          return task.date ? task.date : null;
        }
        case 'title' : {
          return task.title ? task.title : null;
        }

      }
    };
  }

  private addTableObjects(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // диалоговое окно подтверждения удаления
  openDeleteDialog(task: Task) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: `Вы действительно хотите удалить задачу: "${task.title}"?`
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTask.emit(task); // нажали удалить
      }
    });
  }

  onToggleStatus(task: Task) {
    task.completed = !task.completed;
    this.updateTask.emit(task);
  }


  onSelectCategory(category: Category) {
    this.selectCategory.emit(category);
  }

  // фильтрация по названию
  onFilterByTitle() {
    this.filterByTitle.emit(this.searchTaskText);
  }

  // фильтррация по статусу
  onFilterByStatus(value: boolean) {
    // на всякий случай проверяем изменилось ли значение (хотя сам UI компонент должен это делать)
    if (value !== this.selectedStatusFilter) {
      this.selectedStatusFilter = value;
      this.filterByStatus.emit(this.selectedStatusFilter);
    }
  }

  onFilterByPriority(value: Priority) {

    if (value !== this.selectedPriorityFilter) {
      this.selectedPriorityFilter = value;
      this.filterByPriority.emit(this.selectedPriorityFilter);
    }
  }

  openAddTaskDialog() {
    const task = new Task(null, '', false, null, this.selectedCategory);
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {data: [task, 'Добавление задачи']});

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // если нажали на ОК и есть резултат
        this.addTask.emit(task);
      }
    });
  }
}
