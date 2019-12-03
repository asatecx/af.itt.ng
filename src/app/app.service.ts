import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';

// import 'rxjs/add/operator/toPromise';
// import { Observable } from 'rxjs';
import * as _ from 'lodash';

declare var $: any;

declare var config: any;

@Injectable()
export class AppHttp {
  constructor(private http: Http,
              private router: Router) {
  }

  /**
   * Performs http request with mothod: GET, POST, PUT DELETE
   */
  public request(method: string, domain: string, action: string, params?: any): Promise<any> {

    let headers: Headers = new Headers({ 'Accept': 'application/json' });
    let options: any = new RequestOptions({ headers: headers });
    return this.requestDispatch(method, domain, action, options, params);
  }

  /**
   * Performs a request with `get` http method.
   */
  public get(domain: string, action: string, params?: any): Promise<any> {
    return this.request('GET', domain, action, params);
  }

  /**
   * Performs a request with `post` http method.
   */
  public post(domain: string, action: string, body: any): Promise<any> {
    return this.request('POST', domain, action, body);
  }

  /**
   * Performs a request with `put` http method.
   */
  public put(domain: string, action: string, body: any): Promise<any> {
    return this.request('PUT', domain, action, body);
  }

  /**
   * Performs a request with `delete` http method.
   */
  public delete(domain: string, action: string, params?: any): Promise<any> {
    return this.request('DELETE', domain, action, params);
  }

  public getRequestURL(domain: string, action: string) : string {
    let url = config.webApiDomains[domain].baseUrl;
    return `${url}${action}` ;
  }

  public getDefaultRequestOptions() : RequestOptions {
    let headers: Headers = new Headers({ 'Accept': 'application/json' });
    return new RequestOptions({ headers: headers });
  }

  private requestDispatch(method: string, domain: string, action: string, options: RequestOptions, params?: any): Promise<any> {
    let url = config.webApiDomains[domain].baseUrl;
    let prms: Promise<any>;
    switch (method.toUpperCase()) {
      case 'GET':
        if (params) { options.params = params }
        prms = this.http.get(`${url}${action}`, options).toPromise();
        break;
      case 'POST':
        prms = this.http.post(`${url}${action}`, params, options).toPromise();
        break;
      case 'PUT':
        prms = this.http.put(`${url}${action}`, params, options).toPromise();
        break;
      case 'DELETE':
        if (params) { options.params = params }
        prms = this.http.delete(`${url}${action}`, options).toPromise();
        break;
      default:
        return null;
    }
    return prms
      .then(r => {
        let res = r.json();
        return res;
      })
      .catch(r => {
        // Session timeout
        if (r.status === 401) {
          location.href = '/';
          return r ;
        }
        r.success = false;
        return r;
      });
  }
}
