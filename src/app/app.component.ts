import {Component, OnInit} from '@angular/core';
import {Task} from './model/Task';
import {DataHandlerService} from './service/data-handler.service';
import {Category} from './model/Category';
import {Priority} from './model/Priority';
import {zip} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Todo';
  tasks: Task[];
  categories: Category[]; // все категории
  priorities: Priority[]; // все приоритеты

  selectedCategory: Category = null;

  // поиск
  searchTaskText = ''; // текущее значение для поиска задач
  searchCategoryText = ''; // текущее значение для поиска категорий

  // фильтрация
  priorityFilter: Priority;
  statusFilter: boolean;

  // статистика
  totalTaskCountInCategory: number;
  completedCountInCategory: number;
  uncompletedCountInCategory: number;
  uncompletedTotalTasksCount: number;
  showStat = true;



  constructor(
    private dataHandler: DataHandlerService, // фасад для работы с данными
  ) {
  }

  ngOnInit(): void {
    // this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);
    this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
    this.dataHandler.getAllPriorities().subscribe(priorities => this.priorities = priorities);
    this.onSelectCategory(null); // показать все задачи если невыбрнна категория
  }

  // выбор категории
  onSelectCategory(category: Category) {
    this.selectedCategory = category;
    this.updateTasksAndStat();
  }

  // удаление категории
  onDeleteCategory(category: Category) {
    this.dataHandler.deleteCategory(category.id).subscribe(() => {
      this.selectedCategory = null; // открываем категории Все
      this.onSelectCategory(this.selectedCategory);
    });
  }

  // обновление категории
  onUpdateCategory(category: Category) {
    this.dataHandler.updateCategory(category).subscribe(() => {
      this.selectedCategory = null; // открываем категории Все
      this.onSelectCategory(this.selectedCategory);
    });
  }

  // обновление задачи
  onUpdateTask(task: Task) {

    this.dataHandler.updateTask(task).subscribe(cat => {
      this.updateTasksAndStat();
    });

  }

  // добавление задачи
  onAddTask(task: Task) {
    this.dataHandler.addTask(task).subscribe(result => {
      this.updateTasksAndStat();
    });
  }

  // удаление Задачи
  onDeleteTask(task: Task) {
    this.dataHandler.deleteTask(task.id).subscribe(() => {
      this.updateTasksAndStat();
    });
  }

  // поиск задач
  onSearchTasks(searchString: string) {
    this.searchTaskText = searchString;
    this.updateTasksAndStat();
  }

  // фильтрация задач по статусу (все, решенные, нерешенные)
  onFilterTasksByStatus(status: boolean) {
    this.statusFilter = status;
    this.updateTasksAndStat();
  }

  // фильтрация задач по приоритету
  onFilterTasksByPriority(priority: Priority) {
    this.priorityFilter = priority;
    this.updateTasksAndStat();
  }

  private updateTasks() {
    this.dataHandler.searchTasks(
      this.selectedCategory,
      this.searchTaskText,
      this.statusFilter,
      this.priorityFilter
    ).subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });

  }

  // добавление категории
  onAddCategory(title: string) {
    this.dataHandler.addCategory(title).subscribe(
      () => this.updateCategory());
  }

  private updateCategory() {

    this.dataHandler.getAllCategories().subscribe(
      categories => this.categories = categories);
  }

  // поиск категории
  onSearchCategory(title: string) {

    this.searchCategoryText = title;

    this.dataHandler.searchCategories(title).subscribe(cat => {
      this.categories = cat;
    });
  }

  // показывает задачи с применением всех текущий словий
  updateTasksAndStat() {
    this.updateTasks(); // обновить список задач
    this.updateStat(); // обновить переменные для статистики
  }

  updateStat() {
    zip(
      this.dataHandler.getTotalCountInCategory(this.selectedCategory),
      this.dataHandler.getCompletedCountInCategory(this.selectedCategory),
      this.dataHandler.getUncompletedCountInCategory(this.selectedCategory),
      this.dataHandler.getUncompletedTotalCount())
      .subscribe(array => {
        this.totalTaskCountInCategory = array[0];
        this.completedCountInCategory = array[1];
        this.uncompletedCountInCategory = array[2];
        this.uncompletedTotalTasksCount = array[3]; // нужно для категории все
      });
  }

  toggleStat(showStat: boolean) {
    this.showStat = showStat;
  }
}
