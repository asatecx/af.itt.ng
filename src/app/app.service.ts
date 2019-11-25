import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ConfirmationService } from 'primeng/primeng';
import { NotificationService } from './shared/utils/notification.service';

// import 'rxjs/add/operator/toPromise';
// import { Observable } from 'rxjs';
import * as _ from 'lodash';

declare var $: any;

export type InternalStateType = {
  [key: string]: any
};

declare var config: any;

@Injectable()
export class AppState {
  _state: InternalStateType = {};

  constructor() {
  }

  // already return a clone of the current state
  get state() {
    return this._state = this._clone(this._state);
  }
  // never allow mutation
  set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }

  get(prop?: any) {
    // use our state getter for the clone
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  set(prop: string, value: any) {
    // internally mutate our state
    return this._state[prop] = value;
  }

  private _clone(object: InternalStateType) {
    // simple object clone
    return JSON.parse(JSON.stringify(object));
  }
}

@Injectable()
export class AppHttp {
  // private options = new RequestOptions({ withCredentials: true,
  // headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KeycloakService.auth.authz.token }) });
  constructor(private http: Http,
              private router: Router,
              private notifyService: NotificationService) {
    Messages.setNotifyService(this.notifyService);
  }

  /**
   * Performs http request with mothod: GET, POST, PUT DELETE
   */
  public request(method: string, domain: string, action: string, params?: any): Promise<any> {

    let headers: Headers = new Headers({ 'Accept': 'application/json' });
    headers.append('accept-language', SessionSetting.getLanguage());

    // 認証TOKENを追加する
    let token = SessionSetting.get('Token')
    if (token) {
      headers.append('x-af-token', token);
    }

    if (config.devMode) {
      let options: any = new RequestOptions({ headers: headers });
      return this.requestDispatch(method, domain, action, options, params);
    }

    // return this.kc.getToken().then(t => {
    //   headers.append('Authorization', 'Bearer ' + t);
    //   let options: any = new RequestOptions({ headers: headers });
    //   return this.requestDispatch(method, domain, action, options, params);
    // })
    //   .catch(r => {
    //     alert(r);
    //     r.success = false;
    //     this.kc.logout();
    //     return r;
    //   });
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

  // ファイルダウンロード
  public downloadFile(fileId: string) {
    // データ存在するか否のチェック
    this.get('node', `/main/v1/file/files/${fileId}`).then(r => {
      let result = r;
      if (result.success) {
        // ダウンロードURLを作成
        let outputFileUrl = config.webApiDomains.node.baseUrl;
        outputFileUrl += `/download/main/v1/file/files/${fileId}`;
        outputFileUrl += '?__userId=' + SessionSetting.getUser().UserID + '&open=true';
        // ダウンロード
        window.location.href = outputFileUrl;
      } else {
        Messages.error('appservice.downloadfailed', result.message);
      }
    })
      .catch(r => {
        Messages.error('appservice.downloadfailed', r);
      });
  }


  public getRequestURL(domain: string, action: string) : string {
    let url = config.webApiDomains[domain].baseUrl;
    return `${url}${action}` ;
  }

  public getDefaultRequestOptions() : RequestOptions {
    let headers: Headers = new Headers({ 'Accept': 'application/json' });
    headers.append('accept-language', SessionSetting.getLanguage());
  
    // 認証TOKENを追加する
    let token = SessionSetting.get('Token')
    if (token) {
      headers.append('x-af-token', token);
    }
    return new RequestOptions({ headers: headers });
  }

  private requestDispatch(method: string, domain: string, action: string, options: RequestOptions, params?: any): Promise<any> {
    Messages.maskDocument();
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
        Messages.unmaskDocument();
        let res = r.json();

        // 自動追加のTokenをセッションに設定する
        if (res && res.success && res.Token) {
          SessionSetting.set('Token', res.Token) ;
        }

        if (res.message) {
          if (action === '/main/v1/login/login' || action === '/main/v1/register/sendVerifyCode' || action.startsWith('/main/v1/forgot/password/')) {
            // no operation here
          } else if (res.success) {
            Messages.info(res.message);
          } else {
            Messages.error(res.message);
          }
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
        this.showConnErr(r);
        // return { successs: false };
        r.success = false;
        // return Promise.reject(r);
        return r;
      });
  }

  private showConnErr(r) {
    let res: any = {};
    if (r.json) { res = r.json() || {} }
    this.notifyService.smallBox({
      title: Messages.getMessage('main.err.connection'),
      content: res.message || r + '<br/>' + Messages.getMessage('main.process.help'),
      color: '#C46A69',
      icon: 'fa fa-times shake animated'
    });
  }
}

export class Resources {
  private static allLbls = {};
  private static allMsgs = {};
  private static valMsgs = {};

  public static init() {}

  public static getLabel(name: string, defVal: string = null): string {
    if (name == null) { return null }
    let str = Resources.getResxString(Resources.allLbls, name, defVal);
    if (str == null) { str = Resources.getMessage(name) }
    return str;
  }

  public static getMessage(name: string, ...params: any[]): string {
    if (name == null) { return null }
    let str = Resources.getResxString(Resources.allMsgs, name, name);
    let params1 = params;
    while (params1.length === 1 && Array.isArray(params1[0])) {
      params1 = params1[0];
    }
    for (let i = 0, len = params1.length; i < len; i++) {
      str = str.replace('{' + i + '}', params1[i]);
    }
    return str;
  }

  private static getResxString(resx: any, name: string, candidate: string): string {
    if (resx == null) { return candidate }
    let lan = SessionSetting.getLanguage();
    let strs = resx[lan];
    let str = (strs == null ? null : strs[name]);
    if ((str == null || str === '') && lan !== 'ja-JP') {
      strs = resx['ja-JP'];
      str = (strs == null ? null : strs[name]);
    }
    if (str == null || str === '') { str = candidate }
    return str;
  }

  // public static resetOtherResources(key: string) {
  //   // System.import(`script-loader!./shared/forms/validation/localization/messages_${key}.js?`);
  //   if ($.validator) {
  //     Resources.valMsgs[key].load();
  //   } else {
  //     import('jquery-validation/dist/jquery.validate.js').then(() => Resources.valMsgs[key].load());
  //   }
  // }
}

export class Messages {

  private static confirmationService: ConfirmationService;
  private static notifyService: NotificationService

  public static blockedDocument = false;
  private static title = null;

  public static setConfirmationService(confirmationService: ConfirmationService) {
    Messages.confirmationService = confirmationService;
    Messages.title = Resources.getMessage('main.app.title');
  }

  public static setNotifyService(notifyService: NotificationService) {
    Messages.notifyService = notifyService;
    Messages.title = Resources.getMessage('main.app.title');
  }

  public static getMessage(name: string, ...params: any[]): string {
    return Resources.getMessage(name, params);
  }

  public static maskDocument(miliiSeconds?: number) {
    Messages.blockedDocument = true;
    if (miliiSeconds) {
      setTimeout(() => Messages.blockedDocument = false, miliiSeconds);
    }
  }

  public static unmaskDocument() {
    Messages.blockedDocument = false;
  }

  public static info(name: string, ...params: any[]): MessagePromise {
    let promise = Messages.createPromise();
    if (name == null) {
      promise.setCancel();
      return promise.promise;
    }
    let msg = Messages.getMessage(name, params);

    /*Messages.confirmationService.confirm({
      header: Messages.title,
      message: msg,
      icon: 'fa fa-info-circle',
      rejectVisible: false,
      accept: () => promise.setOk(),
      reject: () => promise.setCancel()
    });*/
    this.notifyService.smallBox({
      title: Messages.title,
      content: msg,
      timeout: 5000,
      color: '#b7d8b7',
      icon: 'fa fa-info-circle shake animated'
    });
    promise.setOk();

    return promise.promise;
  }

  public static warn(name: string, ...params: any[]): MessagePromise {
    let promise = Messages.createPromise();
    if (name == null) {
      promise.setCancel();
      return promise.promise;
    }
    let msg = Messages.getMessage(name, params);
    /*Messages.confirmationService.confirm({
      header: Messages.title,
      message: msg,
      icon: 'fa fa-warning',
      rejectVisible: false,
      accept: () => promise.setOk(),
      reject: () => promise.setCancel()
    });*/
    this.notifyService.smallBox({
      title: Messages.title,
      content: msg,
      timeout: 10000,
      color: '#ffe399',
      icon: 'fa fa-warning shake animated'
    });
    promise.setOk();

    return promise.promise;
  }

  public static error(name: string, ...params: any[]): MessagePromise {
    let promise = Messages.createPromise();
    if (name == null) {
      promise.setCancel();
      return promise.promise;
    }
    let msg = Messages.getMessage(name, params);
    /*Messages.confirmationService.confirm({
      header: Messages.title,
      message: msg,
      icon: 'fa fa-times',
      rejectVisible: false,
      accept: () => promise.setOk(),
      reject: () => promise.setCancel()
    });*/
    this.notifyService.smallBox({
      title: Messages.title,
      content: msg,
      timeout: 10000,
      color: '#f8b7bd',
      icon: 'fa fa-times shake animated'
    });
    promise.setOk();

    return promise.promise;
  }

  public static confirm(name: string, ...params: any[]): MessagePromise {
    let promise = Messages.createPromise();
    if (name == null) {
      promise.setCancel();
      return promise.promise;
    }
    let msg = Messages.getMessage(name, params);
    Messages.confirmationService.confirm({
      header: Messages.title,
      message: msg,
      rejectVisible: true,
      icon: 'fa fa-question-circle',
      accept: () => promise.setOk(),
      reject: () => promise.setCancel()
    });
    return promise.promise;
  }

  private static createPromise() {
    let p = {
      ok: false,
      cancel: false,
      okCallback: null,
      cancelCallback: null,
      anyCallback: null,
      setOk: function () {
        p.ok = true;
        if (p.okCallback) {
          p.okCallback();
        }
        if (p.anyCallback) {
          p.anyCallback();
        }
      },

      setCancel: function () {
        p.cancel = true;
        if (p.cancelCallback) {
          p.cancelCallback();
        }
        if (p.anyCallback) {
          p.anyCallback();
        }
      },

      promise: {
        ok: function (callback) {
          if (p.ok) {
            callback();
            if (p.anyCallback) {
              p.anyCallback();
            }
          } else if (!p.cancel) {
            p.okCallback = callback;
          }
          return p.promise;
        },
        cancel: function (callback) {
          if (p.cancel) {
            callback();
            if (p.anyCallback) {
              p.anyCallback();
            }
          } else if (!p.ok) {
            p.cancelCallback = callback;
          }
          return p.promise;
        },
        any: function (callback) {
          if (p.ok || p.cancel) {
            callback();
          } else {
            p.anyCallback = callback;
          }
          return p.promise;
        }
      }
    }
    return p;
  }
}

interface MessagePromise {
  ok(cb?: () => any): MessagePromise;
  cancel(cb?: () => any): MessagePromise;
  any(cb?: () => any): MessagePromise;
}


// アプリメニュー取得サービス
@Injectable()
export class AppMenus {
  // メニューデータ
  private _menus: any[];

  // sa-route-breadcrumbs
  private _breadcrumbsPath : any[] ;

  // コンストラクタ
  constructor(private _http: AppHttp) {
    this._menus = [] ;
  }

  // メニューを取得する
  public getAppMenus(force = false) : Promise<any[]> {

    if (!force && this._menus != null && this._menus.length > 0) {
      return Promise.resolve(this._menus) ;
    }

    let user = SessionSetting.getUser();
    if (user === null) {
      return Promise.resolve([]) ;
    }

    // リクエストを発行しメニューを取得する
    return this._http.get('node', '/main/v1/menu/index', null).then(o => {
      this._menus = o.data;
      return this._menus;
    });
  }

  // 指定URL対応のメニューが存在するかをチェックする
  public hasMenuItemForURL(url: string) : Promise<boolean> {
    return this.getAppMenus().then((menus: any[]) =>{

      let matched = menus.filter(x => {
        if(x.ACTION_PATH === url) {
          return true ;
        } else if(url && url.length>0 &&url.indexOf(x.ACTION_PATH+'/')==0) {
          // 引数があるのURLも同一ともなす   /abc/xxx /abc
          return true ;
        } else {
          return false ;
        }
      });
      return matched!=null && matched.length>0 ;
    }) ;
  }

    public createBreadcrumbsPath(m: any): boolean {

    if(m && m.MENU_ID) {
      let breadcrumbsPath: any[] = [] ;
      // MENU_ID, MENU_NAME
      breadcrumbsPath.push({Name: Resources.getLabel(m.MENU_ID, m.MENU_NAME) }) ;
      while(m && m.PARENT_ID) {
        let tmpMenus = this._menus.filter(v => v.MENU_ID === m.PARENT_ID);
        if(tmpMenus && tmpMenus.length>0) {
          m = tmpMenus[0] ;
          breadcrumbsPath.push({Name: Resources.getLabel(m.MENU_ID, m.MENU_NAME) }) ;
        } else {
          m = null ;
        }
      }
      this._breadcrumbsPath = breadcrumbsPath.reverse() ;
    } else {
      this._breadcrumbsPath = [] ;
    }

    return this._breadcrumbsPath.length>0 ;
  }

  public createBreadcrumbsPathWithLink(p:any[]) : boolean {
    this._breadcrumbsPath = [] ;
    p.forEach(e => {
      let name = e.Name ;
      let actions: any = e.Actions ;
      if(!name && actions && actions.length>0) {
        let menus = this._menus.filter(x => x.ACTION_PATH === actions[0]);
        if(menus && menus.length>0) {
          name = Resources.getLabel(menus[0].MENU_ID, menus[0].MENU_NAME) ;
        }
      }
      this._breadcrumbsPath.push({Name: name, Actions: actions&&actions.length>0 ? actions : ['/'] }) ;
    });

    return this._breadcrumbsPath.length>0 ;
  }


  public getBreadcrumbsPath() : any[] {
    return this._breadcrumbsPath ;
  }

}



@Injectable()
export class Codes {

  // constructor() {}

  private static allCodes = {};

  public static setAllCodes(json) {
    if (json.success) {
      let categorys = _.groupBy(json.data, o => o.CATEGORY);
      let recurseFx = (codes0: any[], codes1: any[], parent: string) => {
        let rows = codes0.filter(v => v.PARENT_CODE === parent);
        rows.forEach(v => {
          let code = { category: v.CATEGORY, code: v.CODE, name: v.NAME, children: [] };
          recurseFx(codes0, code.children, v.CODE);
          if (code.children.length === 0) {
            delete code.children;
          }
          codes1.push(code);
        });
      }

      for (let category in categorys) {
        if (category) {
          let codes0 = categorys[category];
          let codes1 = [];
          recurseFx(codes0, codes1, '$');
          Codes.allCodes[category] = codes1;
        }
      }

      let domains = [];
      for (let id in config.webApiDomains) {
        if (id !== 'node') {
          domains.push({ code: id, name: config.webApiDomains[id].name });
        }
      }
      Codes.allCodes['domains'] = domains;
    }
  }

  public static getCodeList(category: string, ...codePath: any[]): any[] {
    // let res = addBlankFirst ? [{ code: '', name: ''}] : [];
    let res = [];
    let codes = Codes.allCodes[category];
    if (codes == null) { return res }

    let paths = codePath;
    if (codePath.length === 1 && Array.isArray(codePath[0])) { paths = codePath[0] }

    for (let i = 0; i < paths.length; i++) {
      let rows = codes.filter(v => v.code === paths[i]);
      if (rows.length === 0) { return res }
      codes = rows[0].children;
      if (codes == null) { return res }
    }

    codes.forEach(o => res.push({ code: o.code, name: Codes.getLabel(o.category, o.code, o.name) }));

    return res;
  }

  public static getCodeName(category: string, ...codePath: any[]): string {
    let paths = codePath;
    if (codePath.length === 1 && Array.isArray(codePath[0])) { paths = codePath[0] }
    let res = paths.length > 0 ? Codes.getLabel(category, paths[paths.length - 1]) : Codes.getLabel(category, '-');

    let codes = Codes.allCodes[category];
    if (codes == null) { return res }

    for (let i = 0; i < paths.length; i++) {
      let rows = codes.filter(v => v.code === paths[i]);
      if (rows.length === 0) { return res }
      if (i === paths.length - 1) { return Codes.getLabel(rows[0].category, rows[0].code, rows[0].name) }
      codes = rows[0].children;
      if (codes == null) { return res }
    }

    return res;
  }

  private static getLabel(category: string, code: string, name?: string): string {
    let id = `codes.${category}.${code}`;
    let label = Resources.getLabel(id);
    if (id === label) { return name != null ? name : code }
    return label;
  }
}

export class SessionSetting {

  // 2018/05/02追加
  private static _curLanguage ;

  public static set(k: string, v: any) {
    if (typeof v === 'object') {
      v = JSON.stringify(v);
    }
    sessionStorage.setItem(k, v);

    // 2018/05/02追加
    if (k === 'i18nKey') {
      SessionSetting._curLanguage = v ;
    }
  }

  public static get(k: string): any {
    let v = '';
    try {
      v = sessionStorage.getItem(k);
      v = JSON.parse(v);
    } catch (e) { }
    return v;
  }

  public static getLanguage(): string {

    // 2018/05/02変更
    // ここの処理は時間かかりすぎる
    // let v = SessionSetting.get('i18nKey');
    // if (v == '' || v == null) v = 'ja-JP';

    // 以下の様に変更する
    let v = SessionSetting._curLanguage ;
    if (v === '' || v == null) {
      v = SessionSetting.get('i18nKey');
      if (v === '' || v == null) {
        v = 'ja-JP';
      }
      SessionSetting._curLanguage = v ;
    }

    return v;
  }

  public static getOldUser(): any {
    return SessionSetting.get('oldUser');
  }

  public static setOldUser(oldUser: any): any {
      return SessionSetting.set('oldUser', oldUser);
  }

  public static getUser(): any {
    return SessionSetting.get('user');
  }

  public static setUser(user: any): any {
    return SessionSetting.set('user', user);
  }
}
