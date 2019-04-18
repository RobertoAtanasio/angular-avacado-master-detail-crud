import { BaseResourceModel } from '../models/base-resource.model';

import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';

export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected http: HttpClient;

  constructor(
    protected apiPath: string,
    protected injector: Injector
  ) {
    this.http = injector.get(HttpClient);
  }

  getAll(): Observable<T[]> {
    console.log('> path', this.apiPath);
    return this.http.get(this.apiPath).pipe(
      catchError(this.handlerError),
      map(this.jsonDataForResources)
    );
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handlerError),
      map(this.jsonDataForResource)
    );
  }

  create(resource: T): Observable<T> {
    return this.http.post(this.apiPath, resource).pipe(
      catchError(this.handlerError),
      map(this.jsonDataForResource)
    )
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;
    return this.http.put(url, resource).pipe(
      catchError(this.handlerError),
      map(() => resource)
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handlerError),
      map(() => null)
    )
  }

  protected handlerError(error: any): Observable<any> {
    console.log('Erro na requisição:', error);
    return throwError(error);
  }

  protected jsonDataForResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(element => {
      resources.push(element as T);
    });
    return resources;
  }

  protected jsonDataForResource(jsonData: any): T {
    return jsonData as T;
  }
}