// стандартные методы crud
import {Observable} from 'rxjs';

export interface CommonDAO<T> {
// получить все значения
  getAll(): Observable<T[]>;

// получить значение по id
  get(id: number): Observable<T>;

// удалить значение
  delete(id: number): Observable<T>;

// добавить значние
  add(T): Observable<T>;

// обновить(редактровать) значение
  update(): Observable<T>;
}
