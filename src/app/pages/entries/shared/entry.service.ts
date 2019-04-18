import { Injectable, Injector } from '@angular/core';

import { BaseResourceService } from '../../../shared/services/base-resource.service';
import { CategoryService } from '../../categories/shared/category.service';
import { Entry } from './entry.model';
import { Observable } from 'rxjs';
import { flatMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(
    protected injector: Injector, private categoryService: CategoryService
  ) {
    super('api/entries', injector, Entry.fromJson);
  }

  create(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
    // return this.categoryService.getById(entry.categoryId).pipe(
    //   flatMap(category => {
    //     entry.category = category;
    //     return super.create(entry);
    //   })
    // );
  }

  update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
    // return this.categoryService.getById(entry.categoryId).pipe(
    //   flatMap(category => {
    //     entry.category = category;
    //     return super.update(entry);
    //   })
    // )
  }

  private setCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<Entry>{
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return sendFn(entry);
      }),
      catchError(this.handlerError)
    );
  }

  // protected jsonDataForResources(jsonData: any): Entry[] {
  //   const entries: Entry[] = [];
  //   jsonData.forEach(element => {
  //     // entries.push(Object.assign(new Entry(), element));
  //     entries.push(Entry.fromJson(element));
  //   });
  //   return entries;
  // }

  // protected jsonDataForResource(jsonData: any): Entry {
  //   // return Object.assign(new Entry(), jsonData);
  //   return Entry.fromJson(jsonData);
  // }
}
