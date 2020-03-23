import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataHandlerService} from '../../service/data-handler.service';
import {Category} from '../../model/Category';
import {MatDialog} from '@angular/material/dialog';
import {EditCategoryDialogComponent} from '../../dialog/edit-category-dialog/edit-category-dialog.component';
import {OperType} from '../../dialog/OperType';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  @Input()
  categories: Category[];

  @Input()
  selectedCategory: Category;

  // Выбрали категорию из списка
  @Output()
  selectCategory = new EventEmitter<Category>();

  // удаление категории
  @Output()
  deleteCategory = new EventEmitter<Category>();

  // изменре категории
  @Output()
  updateCategory = new EventEmitter<Category>();

  // добавили категорию
  @Output()
  addCategory = new EventEmitter<string>();

  // поиск категории
  @Output()
  searchCategory = new EventEmitter<string>(); // передаем строку для поиска


  // для отображения иконки редактирования при наведении на категорию
  indexMouseMove: number;

  searchCategoryTitle: string; // текущее значение для поиска категорий


  constructor(private dataHandler: DataHandlerService,
              private dialog: MatDialog // внедряем MatDialog, чтобы работать с диалоговыми окнами

  ) {
  }

  ngOnInit() {
    // this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
  }

  showTasksByCategory(category: Category) {
    // если не изменилось значение ничего не происходит
    if (this.selectedCategory === category) {
      return;
    }
    this.selectedCategory = category; // сохраняем выбранную категорию
    // вызывается внешний обработчик и передаем туда выбранную категорию
    this.selectCategory.emit(this.selectedCategory);
  }

  // сохраняет индекс записи категории, над который в данный момент проходит мышка (и там отображается иконка редактирования)
  showEditIcon(index: number) {
    this.indexMouseMove = index;
  }

  // диалоговое окно для редактирования категории
  openEditDialog(category: Category): void {

    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: [category.title, 'Редактирование категории', OperType.EDIT],
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result === 'delete') { // удалить
        this.deleteCategory.emit(category); // вызываем внешний обработчик
        return;
      }

      if (typeof (result) === 'string') { // нажали ОК и есть результат
        category.title = result as string;

        this.updateCategory.emit(category);
        return;
      }
    });
  }

  openAddCategoryDialog() {

    const dialogRef = this.dialog.open(EditCategoryDialogComponent,
      {
        data: ['', 'Добавление категории', OperType.ADD],
        width: '400px'
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addCategory.emit(result as string); // вызываем внешний обработчик
      }
    });
  }

  search() {
    if (this.searchCategoryTitle == null) {
      return;
    }
    this.searchCategory.emit(this.searchCategoryTitle);
  }
}
