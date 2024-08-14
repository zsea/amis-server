
document.title = `管理后台`;
var amisEditor, page, doAction;
function showEditor(_page_, action) {
    page = _page_;
    doAction = action;
    amisEditor = document.createElement("iframe");
    amisEditor.setAttribute("src", "/html/editor");
    amisEditor.className = "amis-editor-box";
    document.body.append(amisEditor);
}
function exitEditor() {
    if (amisEditor) {
        doAction({
            "actionType": "dialog",
            "dialog": {
                "title": "请确认",
                closeOnEsc: true,
                "body": "正在退出，请确认已保存内容？",
                "onEvent": {
                    "confirm": {
                        "actions": [
                            {
                                "actionType": "custom",
                                script: () => {
                                    amisEditor.remove();
                                    amisEditor = null;
                                }
                            }
                        ]
                    }
                }
            }
        })
        // if (!confirm('正在退出，请确认已保存内容？')) return;

    }
}
function saveSchema(schema) {

    // 设置请求的选项
    const options = {
        method: 'PATCH', // 设置请求方法为PATCH
        headers: {
            'Content-Type': 'application/json' // 设置请求头，指定发送的数据类型为JSON
        },
        body: JSON.stringify({
            schema: JSON.stringify(schema),
            id: page.id
        }) // 将JavaScript对象转换为JSON字符串
    };

    // 发送fetch请求
    fetch("/api/amis/system/schema", options)
        .then(response => {
            // 首先检查响应的状态
            if (!response.ok) {
                // 如果响应状态码不是2xx，抛出错误
                doAction({
                    actionType: "toast",
                    args: {
                        "msg": "保存失败，请稍后再试。",
                        "msgType": "error"
                    }
                });
                return;
            }
            // 解析JSON响应体
            return response.json();
        })
        .then(data => {
            if (!data) return;
            // 请求成功，处理数据
            if (data.status === 0) {
                doAction({
                    actionType: "toast",
                    args: {
                        "msg": data.msg || "保存成功。",
                        "msgType": "success"
                    }
                });
            }
            else {
                doAction({
                    actionType: "toast",
                    args: {
                        "msg": data.msg || "保存失败，请稍后再试。",
                        "msgType": "error"
                    }
                });
            }
        })
        .catch(error => {
            doAction({
                actionType: "toast",
                args: {
                    "msg": "保存失败，请稍后再试。",
                    "msgType": "error"
                }
            })
        });
}
function getSchema() {

    if (page && page.schema) {
        return page.schema;
    }
    return {
        "type": "page",
        "body": [],
        "regions": [
            "body"
        ]
    }
}
(function () {

    let amis = amisRequire('amis/embed');
    // 通过替换下面这个配置来生成不同页面
    let amisJSON = window.__appSchema__ || {
        "type": "page",
        "body": {
            type: "tpl",
            "tpl": "Not Found"
        }
    };
    amis.embed('#root', amisJSON);

})();
