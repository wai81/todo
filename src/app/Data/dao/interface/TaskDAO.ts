import {CommonDAO} from './CommonDAO';
import {Task} from '../../../model/Task';
import {Category} from '../../../model/Category';
import {Priority} from '../../../model/Priority';
import {Observable} from 'rxjs';

export interface TaskDAO extends CommonDAO<Task> {
  // поиск задач
  search(category: Category, searchText: string, status: boolean, priority: Priority): Observable<Task[]>;

  // количество звершенных задач по категории
  getCompletedCountInCategory(category: Category): Observable<number>;

  // количестов незавершенных задач по категории
  getUncompletedCountInCategory(category: Category): Observable<number>;

  // количество всех задач в категории
  getTotalCountInCategory(category: Category): Observable<number>;

  // количество всех задач
  getTotalCount(): Observable<number>;

}
