

(function () {
    let amis = amisRequire('amis/embed');
    // 通过替换下面这个配置来生成不同页面
    document.title = `登录`;
    let amisJSON = {
        "data": Object.assign({ amis_rember: window.localStorage.getItem("amis_rember") === "true", amis_rember_username: window.localStorage.getItem("amis_rember_username") }, __appSchema__),
        "type": "page",
        "title": "",
        "body": [
            {
                "type": "grid",
                "columns": [
                    {
                        "body": [],
                        "id": "u:bdac6fb9874a",
                        "columnClassName": {
                            "index-logo-left-bg": true,
                            "min-h-full": true
                        }
                    },
                    {
                        "body": {
                            "type": "grid-2d",
                            "cols": 12,
                            "grids": [
                                {
                                    "x": 5,
                                    "y": 5,
                                    "h": 1,
                                    "w": 4,
                                    "width": 300,
                                    "type": "form",
                                    "mode": "horizontal",
                                    "title": "",
                                    "api": {
                                        "url": "/api/amis/login",
                                        "method": "post",
                                        //"dataType": "form-data",
                                        requestAdaptor: function (api) {
                                            let password = api.body.password;
                                            password = CryptoJS.MD5(password).toString();
                                            password = api.body.username + "#" + password;
                                            password = CryptoJS.MD5(password).toString();
                                            api.body.password = password;
                                            if (api.body.rember) {
                                                window.localStorage.setItem("amis_rember", "true");
                                                window.localStorage.setItem("amis_rember_username", api.body.username);
                                            }
                                            else {
                                                window.localStorage.removeItem("amis_rember");
                                                window.localStorage.removeItem("amis_rember_username");
                                            }
                                        },
                                    },
                                    "panelClassName": "p-r p-l p-b-md",
                                    "redirect": window.__appSchema__.homePage || "/html/master",
                                    "body": [
                                        {
                                            "type": "tpl",
                                            "tpl": "<div class=\"loginTitle\">\n<p><strong>${brandName}</strong></p>\n</div>",
                                            "id": "u:ec04628a976f"
                                        },
                                        {
                                            "type": "input-text",
                                            "label": false,
                                            "name": "username",
                                            "size": "full",
                                            "placeholder": "账号",
                                            "addOn": {
                                                "label": "",
                                                "type": "text",
                                                "position": "left",
                                                "icon": "fa fa-user"
                                            },
                                            "id": "u:fe5a37b6b4ce",
                                            "required": true,
                                            "validateOnChange": true,
                                            "value": "${amis_rember_username}"
                                        },
                                        {
                                            "type": "input-password",
                                            "label": false,
                                            "name": "password",
                                            "size": "full",
                                            "placeholder": "密码",
                                            "addOn": {
                                                "label": "",
                                                "type": "text",
                                                "position": "left",
                                                "icon": "fa fa-lock"
                                            },
                                            "id": "u:c8c6c46b6e37",
                                            "required": true,
                                            "validateOnChange": true
                                        },
                                        {
                                            "type": "checkbox",
                                            "label": false,
                                            "name": "rember",
                                            "option": "保持登录",
                                            "id": "u:50fbdfd793de",
                                            "value": "${amis_rember}"
                                        },
                                        {
                                            "type": "control",
                                            "label": false,
                                            "body": [
                                                {
                                                    "type": "button",
                                                    "level": "primary",
                                                    "actionType": "submit",
                                                    "block": true,
                                                    "label": "登陆",
                                                    "id": "u:ee4ca4173a2c"
                                                }
                                            ],
                                            "id": "u:d99f08581f00"
                                        }
                                    ],
                                    "id": "u:d9395bdc6782",
                                    "feat": "Insert"
                                }
                            ],
                            "id": "u:57248db7fda2"
                        },
                        "id": "u:31bb4b0d6631"
                    }
                ],
                "id": "u:19464d5e1ce6",
                "gap": "none",
                "valign": "between",
                "className": {
                    "min-h-full": true
                }
            }
        ],
        "id": "u:0fe200b56ad9",
        "asideResizor": false,
        "pullRefresh": {
            "disabled": true
        },
        "regions": [
            "body"
        ],
        "themeCss": {
            "baseControlClassName": {},
            "bodyControlClassName": {
                "padding-and-margin:default": {
                    "marginTop": "var(--sizes-size-0)",
                    "marginRight": "var(--sizes-size-0)",
                    "marginBottom": "var(--sizes-size-0)",
                    "marginLeft": "var(--sizes-size-0)",
                    "paddingTop": "var(--sizes-size-0)",
                    "paddingRight": "var(--sizes-size-0)",
                    "paddingBottom": "var(--sizes-size-0)",
                    "paddingLeft": "var(--sizes-size-0)"
                }
            }
        },
        "className": {
            "min-h-full": true
        }
    };
    amis.embed('#root', amisJSON);
})();


