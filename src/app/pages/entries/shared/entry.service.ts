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
    console.log('>> entrou em getAll()');
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
    console.log('>> entrou no update');
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
    console.log('>> jsonDataForEntries', jsonData);
    jsonData.forEach(element => {
      entries.push(element as Entry);
    });
    return entries;
  }

  private jsonDataForEntry(jsonData: any): Entry {
    console.log('>> jsonDataForEntry', jsonData);
    return jsonData as Entry;
  }
}
