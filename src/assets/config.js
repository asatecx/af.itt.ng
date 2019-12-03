var config = {

    devMode: true,

    // Google reCAPTCHA サイトID
    google: {
        reCaptchaSiteKey: '6Lcar00UAAAAAJkQ0KNoyEHL4kfToyGsWFjxmWXZ'
    },

    // SPA 画面遷移回数制限 (Home メニュー)
    // 未設定、又は 0の場合、画面refresh を行わない
    //    app.routing.ts の　RouterModule.forRoot(routes, {useHash: true});   useHash: trueが必要
    homeNavigationLimit: 0,
    
    webApiDomains: {
        node: { name: 'ドメイン【node】', baseUrl: 'http://$host:8090' },
        portal: { name: 'ドメイン【portal】', baseUrl: 'http://$host:8090' },
        itt: { name: 'ドメイン【itt】', baseUrl: 'http://47.74.24.150:8090' }
    }
};
