import {Injectable} from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
// import {beforeUrl} from '../pages/common/public-data';
import {Http} from '@angular/http';


@Injectable()
export class WorkspaceService {
  constructor(private http: Http) {
  }

  //获取菜单
  private menuUrl = 'assets/data/user-menu.json';

  getMenu(): Promise<any[]> {
    let url = `${this.menuUrl}`;
    return this.http.get(url).toPromise()
      .then(res => {
        return res;
      }).catch(res=>res);

  }



}//class end
