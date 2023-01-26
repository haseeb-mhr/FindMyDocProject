import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private httpClient: HttpClient) { }
  
  public get<T>(path: string, params?: any, response = 'json'): Observable<T> {
    return this.httpClient.get<T>(environment.api.baseUrl + path,
      { headers: this.httpOptions.headers, params, responseType: response as 'json' });
  }

  public post<T>(path: any, model: any, response = 'json'): Observable<T> {
    return this.httpClient.post<T>(environment.api.baseUrl + path,
      model, { headers: this.httpOptions.headers, responseType: response as 'json' });
  }

  public postData(path: any, model: any){
    return this.httpClient.post(environment.api.baseUrl + path, model, { observe: 'response' })
  }

  public postData2(path: any, formData: any) {
    return this.httpClient.post(environment.api.baseUrl + path, formData, { reportProgress: true, observe: 'events' });
  }

  public put<T>(path: any, model: any, params?: any, response = 'json'): Observable<T> {
    return this.httpClient.put<T>(environment.api.baseUrl + path,
      model, { headers: this.httpOptions.headers, params, responseType: response as 'json' });
  }

  public delete<T>(path: any, params?: any, response = 'json'): Observable<T> {
    return this.httpClient.delete<T>(environment.api.baseUrl + path,
      { headers: this.httpOptions.headers, params, responseType: response as 'json' });
  }
}
