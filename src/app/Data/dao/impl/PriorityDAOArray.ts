import {PriorityDAO} from '../interface/PriorityDAO';
import {Observable, of} from 'rxjs';
import {Priority} from '../../../model/Priority';
import {TestData} from '../../TestData';

export class PriorityDAOArray implements PriorityDAO {
  add(T): Observable<Priority> {
    return undefined;
  }

  delete(id: number): Observable<Priority> {
    return undefined;
  }

  get(id: number): Observable<Priority> {
    return undefined;
  }

  getAll(): Observable<Priority[]> {
    return of(TestData.priorities);
  }

  update(): Observable<Priority> {
    return undefined;
  }

}
