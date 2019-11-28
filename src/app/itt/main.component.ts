import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {beforeUrl} from '../itt/common/public-data';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {WorkspaceService} from './main.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('menuState', [
      state('inactive', style({
        left: '0px'
      })),
      state('active', style({
        left: '-130px'
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ]),
    trigger('routerState', [
      state('inactive', style({
        marginLeft: '180px'
      })),
      state('active', style({
        marginLeft: '50px'
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ]),
    trigger('imgState', [
      state('inactive', style({
        left: '16px'
      })),
      state('active', style({
        left: '143px'
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ])
  ]
})
export class WorkspaceComponent implements OnInit {

  constructor(private myService: WorkspaceService, public router: Router) {
  };

  ngOnInit() {
    this.getMenu();
    if (sessionStorage.getItem('userToken')) {
      this.realname = sessionStorage.getItem('realname');
    } else {
      this.router.navigateByUrl('login');
    }
  }

  /*************************  ********************************/
  informationNumber: any = 18;                      //头部我的消息数量
  menus: any[];                                    //菜单
  state: string = 'inactive';                      //菜单状态
  pTooltipIf: boolean = false;                     //pTooltipIf状态
  beforeUrl: string = beforeUrl;                   //api前缀地址
  timeout: any;                                    //错误信息时间
  realname: string;                                  //头部账号名字
  menumsg: string;


  /************************* 获取菜单 ********************************/
  getMenu() {
    if (sessionStorage.getItem('menu111')) {
      this.menus = JSON.parse(sessionStorage.getItem('menu111'));
      console.log(this.menus);
    } else {
      this.myService.getMenu()
        .then(
          menus => this.menus = menus,
          error => {
            this.menumsg = '获取菜单失败,请刷新再试';
          }
        )
        .then(() => {
          if (this.menus) {
            sessionStorage.setItem('menu111', JSON.stringify(this.menus));
          }
        });
    }
    this.menus = [
      {
        "name": "数据管理",
        "icon": "fa-database",
        "children": [
          {
            "name": "data-table",
            "link": "data-table"
          },
          {
            "name": "primeng验证",
            "link": "user"
          },
          {
            "name": "表单验证",
            "link": "ng-form"
          },
          {
            "name": "input",
            "link": "input"
          },
          {
            "name": "图标",
            "link": "icon"
          },
          {
            "name": "省级联动",
            "link": "citys"
          }
        ]
      },
      {
        "name": "charts",
        "icon": "fa-line-chart",
        "children": [
          {
            "name": "charts",
            "link": "charts"
          }
        ]
      },
      {
        "name": "tree",
        "icon": "fa-tree",
        "children": [
          {
            "name": "tree",
            "link": "tree"
          }
        ]
      },
      {
        "name": "上传",
        "icon": "fa-upload",
        "children": [
          {
            "name": "上传",
            "link": "upload"
          }
        ]
      }
    ];
  }

  /************************* 改变左侧菜单宽度 ********************************/
  changeMenuWidth() {
    this.state = (this.state === 'active' ? 'inactive' : 'active');
    //dom操作
    let fa = document.getElementsByClassName('ui-accordion-header');
    if (this.state == 'active') {
      for (let i = 0; i < fa.length; i++) {
        fa[i].getElementsByTagName('span')[0].style.display = 'none';
      }
      this.pTooltipIf = true;
    } else {
      for (let i = 0; i < fa.length; i++) {
        fa[i].getElementsByTagName('span')[0].style.display = 'inline-block';
      }
      this.pTooltipIf = false;
    }
  }

  /************************* 退出登录 ********************************/
  loginOut() {
    sessionStorage.clear();
    this.router.navigateByUrl('login');
  }
}
