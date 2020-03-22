import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataHandlerService} from '../../service/data-handler.service';
import {Category} from '../../model/Category';
import {MatDialog} from '@angular/material/dialog';
import {EditCategoryDialogComponent} from '../../dialog/edit-category-dialog/edit-category-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  @Input()
  categories: Category[];

  // Выбрали категорию из списка
  @Output()
  selectCategory = new EventEmitter<Category>();
  // удаление категории
  @Output()
  deleteCategory = new EventEmitter<Category>();
  // изменре категории
  @Output()
  updateCategory = new EventEmitter<Category>();

  @Input()
  selectedCategory: Category;

  // для отображения иконки редактирования при наведении на категорию
  indexMouseMove: number;


  constructor(private dataHandler: DataHandlerService,
              private dialog: MatDialog) {
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
      data: [category.title, 'Редактирование категории'],
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
}
