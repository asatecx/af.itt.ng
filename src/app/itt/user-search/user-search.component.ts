import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppHttp, Messages, Codes, SessionSetting, Resources } from '../../app.service';
import { DataTableMate } from '../../shared/utils/datatablemate';

import { Http, Headers, RequestOptions } from '@angular/http';

import * as _ from 'lodash';

// declare var $: any;
// declare var window: any;

@Component({
  selector: 'user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit {

  codes: any = {};
  domains: any[];
  // dataTableMate: DataTableMate = new DataTableMate('http://$host:8080', '/UserSearch', this.http);
  // ページング情報
  // トタル件数
  public totalRecords = 0;
  // ページにデータ件数
  public rows = 10;
  // 開始データ件数
  public first = 0;
  // ソート条件
  public sortInfo: any = {};
  // フィルター条件
  public filterInfo: any = {};

  // 検索したデータ
  public ResultData: any = [];

  // 自動データ取得
  public canLoadData = false;

  // サービス
  public server = 'http://$host:8080';

  // サービス
  private action: string;
  // Post用のデータ
  private postData: any = {};

  constructor(
    private http: Http
    ) { }

    /**
   * 初期化
   */
  ngOnInit() {
    
  }

  search(){
    // this.dataTableMate.first = 0;
    // this.dataTableMate.filterInfo = Object.assign({}, this.filterInfo);
    // this.dataTableMate.loadData();
    this.postData['filterInfo'] = this.filterInfo
    this.postData['sortInfo'] = this.sortInfo;
    this.postData['skipCount'] = this.first;
    this.postData['fetchCount'] = this.rows;
    // this.action = '/UserSearchInit';
// options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });
    let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
    // headers.append('accept-language', SessionSetting.getLanguage());
    let options: any = new RequestOptions({ headers: headers });
    // this.http.post(this.server, this.action, this.postData);
    this.post("http://localhost:8080","/UserSearch", this.postData);
    // this.http.get("http://localhost:8080/UserSearchInit", this.postData);
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

  /**
   * Performs http request with mothod: GET, POST, PUT DELETE
   */
  public request(method: string, domain: string, action: string, params?: any): Promise<any> {

    let headers: Headers = new Headers({ 'Accept': 'application/json' });
    headers.append('accept-language', SessionSetting.getLanguage());
    let options: any = new RequestOptions({ headers: headers });
    return this.requestDispatch(method, domain, action, options, params);
  }

  private requestDispatch(method: string, url: string, action: string, options: RequestOptions, params?: any): Promise<any> {
    // let url = config.webApiDomains[domain].baseUrl;
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
        Messages.unmaskDocument();
        let res = r.json();

        // 自動追加のTokenをセッションに設定する
        if (res && res.success && res.Token) {
          SessionSetting.set('Token', res.Token) ;
        }
        return res;
      })
      .catch(r => {
        // Session timeout
        if (r.status === 401) {
          SessionSetting.setUser(null) ;
          location.href = '/';
          return r ;
        }

        Messages.unmaskDocument();
        r.success = false;
        return r;
      });
  }
}
