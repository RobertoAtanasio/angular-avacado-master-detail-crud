import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap} from 'rxjs/operators';

import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath = 'api/categories';

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Category[]> {
    console.log('>> entrou em getAll()');
    return this.http.get(this.apiPath).pipe(
      catchError(this.handlerError),
      map(this.jsonDataForCategories)
    );
  }

  getById(id: number): Observable<Category> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handlerError),
      map(this.jsonDataForCategory)
    );
  }

  create(categoria: Category): Observable<Category> {
    return this.http.post(this.apiPath, categoria).pipe(
      catchError(this.handlerError),
      map(this.jsonDataForCategory)
    )
  }

  update(categoria: Category): Observable<Category> {
    const url = `${this.apiPath}/${categoria.id}`;
    return this.http.put(url, categoria).pipe(
      catchError(this.handlerError),
      map(() => categoria)
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

  private jsonDataForCategories(jsonData: any): Category[] {
    const categories: Category[] = [];
    console.log('>> jsonDataForCategories', jsonData);
    jsonData.forEach(element => {
      categories.push(element as Category);
    });
    return categories;
  }

  private jsonDataForCategory(jsonData: any): Category {
    return jsonData as Category;
  }
}
