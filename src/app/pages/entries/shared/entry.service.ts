import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap} from 'rxjs/operators';

import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath = 'api/entries';

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Entry[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handlerError),
      map(this.jsonDataForEntries)
    );
  }

  getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handlerError),
      map(this.jsonDataForEntry)
    );
  }

  create(entry: Entry): Observable<Entry> {
    return this.http.post(this.apiPath, entry).pipe(
      catchError(this.handlerError),
      map(this.jsonDataForEntry)
    )
  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;
    return this.http.put(url, entry).pipe(
      catchError(this.handlerError),
      map(() => entry)
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handlerError),
      map(() => null)
    )
  }

  private handlerError(error: any): Observable<any> {
    console.log('Erro na requisição:', error);
    return throwError(error);
  }

  private jsonDataForEntries(jsonData: any): Entry[] {
    const entries: Entry[] = [];
    // console.log('>> ', jsonData[0] as Entry);
    // console.log('>> ', Object.assign(new Entry(), jsonData[0]));
    jsonData.forEach(element => {
      entries.push(Object.assign(new Entry(), element));
    });
    return entries;
  }

  private jsonDataForEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }
}
