import { LazyLoadEvent } from 'primeng/primeng';
import { AppHttp } from '../../app.service';

export class DataTableMate {

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
  public server = '';

  // サービス
  private action: string;

  // Post用のデータ
  private postData: any = {};


  // サービス設定
  constructor(server: string, action: string, private http: AppHttp) {
    this.server = server;
    this.action = action;
  }

  // ページング情報格納して、データ検索する
  public loadDataLazy(event: LazyLoadEvent) {
    // ページング情報保存
    this.first = event.first;
    this.rows = event.rows;

    // ソート情報設定
    let sortInfo = {};
    if (event.multiSortMeta !== undefined && event.multiSortMeta !== null) {
      event.multiSortMeta.forEach(function (sort) {
        sortInfo[sort.field] = sort.order;
      });
      this.sortInfo = sortInfo;
    }

    if (this.canLoadData) {
      // データ検索
      setTimeout(() => {
        this.loadData();
      }, 0);
    } else {
      // データ取得できない場合、Gridのバインダーデータは空リストで格納する
      // 該当処理は最初ページ開くとき、Gridのデータ取得しなくて、「検索」ボタンをクリックしたから、データ検索する
      this.clearData();
    }
  }

  public load() {
    // 自動取得データ機能が有効になる
    this.canLoadData = true;

    if (!this.server) {
      this.clearData();
      return;
    }

    this.postData['filterInfo'] = this.filterInfo
    this.postData['sortInfo'] = this.sortInfo;
    this.postData['skipCount'] = this.first;
    this.postData['fetchCount'] = this.rows;

    return this.http.post(this.server, this.action, this.postData);
  }

  // ページング情報取得
  public loadData() {
    return this.load().then(r => {
      if (r.success) {
        if (r.totalCount === 0) {
          this.clearData();
          return;
        }
        if (r.data.length === 0 && this.first > 0) {
          this.first = Math.floor((r.totalCount - 1) / this.rows) * this.rows;
          this.loadData();
          return;
        }
        // トタル件数設定
        this.totalRecords = r.totalCount;
        // 表示するデータ設定
        this.ResultData = r.data;
      }
    });
  }

  public clearData() {
    this.totalRecords = 0;
    this.ResultData = [];
  }
}
