import {Injectable} from '@angular/core';
import {Category} from '../model/Category';
import {Task} from '../model/Task';
import {Observable} from 'rxjs';
import {TaskDAOArray} from '../Data/dao/impl/TaskDAOArray';
import {CategoryDAOArray} from '../Data/dao/impl/CategoryDAOArray';

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {
  taskDaoArray = new TaskDAOArray();
  categoryDaoArray = new CategoryDAOArray();

  constructor() {
  }

  getAllTasks(): Observable<Task[]> {
    return this.taskDaoArray.getAll();
  }

  getAllCategories(): Observable<Category[]> {
    return this.categoryDaoArray.getAll();
  }

}
