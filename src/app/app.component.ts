import {Component, OnInit} from '@angular/core';
import {Task} from './model/Task';
import {DataHandlerService} from './service/data-handler.service';
import {Category} from './model/Category';
import {Priority} from './model/Priority';

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
    this.updateTasks();
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
      this.updateTasks();
    });

  }

  // добавление задачи
  onAddTask(task: Task) {
    this.dataHandler.addTask(task).subscribe(result => {
      this.updateTasks();
    });
  }

  // удаление Задачи
  onDeleteTask(task: Task) {
    this.dataHandler.deleteTask(task.id).subscribe(() => {
      this.updateTasks();
    });
  }

  // поиск задач
  onSearchTasks(searchString: string) {
    this.searchTaskText = searchString;
    this.updateTasks();
  }

  // фильтрация задач по статусу (все, решенные, нерешенные)
  onFilterTasksByStatus(status: boolean) {
    this.statusFilter = status;
    this.updateTasks();
  }

  // фильтрация задач по приоритету
  onFilterTasksByPriority(priority: Priority) {
    this.priorityFilter = priority;
    this.updateTasks();
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
}
