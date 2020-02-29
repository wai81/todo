import {Category} from '../model/Category';
import {Priority} from '../model/Priority';
import {Task} from '../model/Task';

export class TestData {
  static categories: Category[] = [
    {id: 1, title: 'Работа'},
    {id: 2, title: 'Семья'},
    {id: 3, title: 'Машина'}
  ];
  static priorities: Priority[] = [
    {id: 1, title: 'Низкий', color: '#49e551'},
    {id: 2, title: 'Средний', color: '#abe544'},
    {id: 3, title: 'Высокий', color: '#ff6915'},
    {id: 4, title: 'Очень срочно!', color: '#e5090f'}
  ];
  static tasks: Task[] = [
    {
      id: 1,
      title: 'Заправить машину',
      priority: TestData.priorities[1],
      completed: false,
      category: TestData.categories[2],
      date: new Date('2020-02-29')
    },
    {
      id: 2,
      title: 'Завести детей в школу',
      priority: TestData.priorities[2],
      completed: false,
      category: TestData.categories[1],
      date: new Date('2020-03-03')
    },
    {
      id: 3,
      title: 'Обновить конфигурацию ЗП',
      priority: TestData.priorities[1],
      completed: false,
      category: TestData.categories[0],
      date: new Date('2020-03-03')
    },
    {
      id: 4,
      title: 'Заменить масло в машине',
      priority: TestData.priorities[3],
      completed: false,
      category: TestData.categories[2]
    }
  ];
}
