import { Injectable, Injector } from '@angular/core';

import { BaseResourceService } from '../../../shared/services/base-resource.service';
import { CategoryService } from '../../categories/shared/category.service';
import { Entry } from './entry.model';

import { Observable } from 'rxjs';
import { flatMap, catchError, map } from 'rxjs/operators';

import * as moment from 'moment';

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

  getByMonthAndYear(month: string, year: string): Observable<Entry []> {
    return this.getAll().pipe(
      map(entries => {
        const entry = this.filterByMonthAndYear(entries, month, year);
        // console.log('>>', entry );
        return entry;
      }),
      catchError(this.handlerError)
    );
  }

  private filterByMonthAndYear(entries: Entry[], month: string, year: string) {
    return entries.filter(entry => {
      const entryDate = moment(entry.date, 'DD/MM/YYYY');
      const monthMatches = entryDate.month() + 1 === parseInt(month, 10);
      const yearMatches = entryDate.year() === parseInt(year, 10);
      if (monthMatches && yearMatches) {
        return entry;
      }
    })
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

}
