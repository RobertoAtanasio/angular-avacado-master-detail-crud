import { Injectable, Injector } from '@angular/core';

import { BaseResourceService } from '../../../shared/services/base-resource.service';
import { CategoryService } from '../../categories/shared/category.service';
import { Entry } from './entry.model';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(
    protected injector: Injector, private categoryService: CategoryService
  ) {
    super('api/entries', injector);
  }

  create(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.create(entry);
      })
    );
  }

  update(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.update(entry);
      })
    )
  }

  protected jsonDataForResources(jsonData: any): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach(element => {
      entries.push(Object.assign(new Entry(), element));
    });
    return entries;
  }

  protected jsonDataForResource(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }
}
