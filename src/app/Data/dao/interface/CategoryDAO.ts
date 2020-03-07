import {CommonDAO} from './CommonDAO';
import {Category} from '../../../model/Category';
import {Observable} from 'rxjs';

// методы для категории
export interface CategoryDAO extends CommonDAO<Category> {
  // поиск но названию
  search(title: string): Observable<Category[]>;
}
