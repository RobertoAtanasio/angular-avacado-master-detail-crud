import { BaseResourceModel } from '../models/base-resource.model';

import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';

export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected http: HttpClient;

  constructor(
    protected apiPath: string,
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData: any) => T
  ) {
    this.http = injector.get(HttpClient);
  }

  getAll(): Observable<T[]> {
    // console.log('> path', this.apiPath);
    return this.http.get(this.apiPath).pipe(
      map(this.jsonDataForResources.bind(this)),
      catchError(this.handlerError)
    );
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      map(this.jsonDataForResource.bind(this)),
      // map( (jsonData: Array<any>) => this.jsonDataToResourceFn(jsonData) ),
      catchError(this.handlerError)
    );
  }

  create(resource: T): Observable<T> {
    return this.http.post(this.apiPath, resource).pipe(
      map(this.jsonDataForResource.bind(this)),
      catchError(this.handlerError)
    )
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;
    return this.http.put(url, resource).pipe(
      map(() => resource),
      catchError(this.handlerError)
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      map(() => null),
      catchError(this.handlerError)
    )
  }

  protected handlerError(error: any): Observable<any> {
    console.log('Erro na requisição:', error);
    return throwError(error);
  }

  protected jsonDataForResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(element => {
      // resources.push(element as T);
      resources.push(this.jsonDataToResourceFn(element));
    });
    return resources;
  }

  protected jsonDataForResource(jsonData: any): T {
    // return jsonData as T;
    return this.jsonDataToResourceFn(jsonData);
  }
}