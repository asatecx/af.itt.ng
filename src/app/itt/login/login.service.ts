/**
 * 这里可能放很多公用的api接口
 */
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import {beforeUrl} from '../common/public-data';
import {Http, Headers} from '@angular/http';
import {catchError, tap} from 'rxjs/operators';
import { Observable , of} from 'rxjs';

@Injectable()
export class LoginService {
  constructor(private http: Http) {
  }

  //登录
  private loginUrl = '../../assets/login.json';
  login(userToken: string): Observable<any> {
    let httpOptions: any;
    httpOptions = {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': userToken
      })
    };
    let url = this.loginUrl;
    return this.http
      .get(url,httpOptions)
      .pipe(
        tap((res: any) => res),
        catchError((error: Response | any) => {
          return Promise.reject(error);
        })
      );
  }

}//class end
