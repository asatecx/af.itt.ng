import {Injectable} from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
// import {beforeUrl} from '../pages/common/public-data';
import {Http} from '@angular/http';


@Injectable()
export class LayoutService {
  constructor(private http: Http) {
  }

  //获取菜单
  private menuUrl = 'assets/data/user-menu.json';

  getMenu(): Promise<any> {
    let url = `${this.menuUrl}`;
    let httpOptions: any;
    httpOptions = {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(url, httpOptions).toPromise()
      .then(res => {
        return res;
      }).catch(res=>res);

  }



}//class end
