import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit {
  // Входячие параметры
  @Input()
  totalTaskInCategory: number; // общее количество задач в категории

  @Input()
  completeTaskInCategory: number; // количество решенных задач в категории

  @Input()
  uncompleteTaskInCategory: number; // количество нерешенных задач в категории

  @Input()
  showStat: boolean; // показать или скрыть статистику
  constructor() {
  }

  ngOnInit(): void {
  }

}
