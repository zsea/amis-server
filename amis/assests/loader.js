function HAdminLoader(res) {
    let jsCount = res.filter(x => x.type === "js").length;
    fetch("/api/amis/host").then(res => res.json()).then(ret => {
        if (ret && ret.success && ret.data) {
            return ret.data.host
        }
    }).catch(function (e) {
        console.error(e);
    }).then(host => {
        //console.info("资源地址", host);
        return new Promise(function (resolve) {
            for (var i = 0; i < res.length; i++) {
                let item = res[i];
                let src = item.src;
                if (item.amis) {
                    src = (host||"") + src;
                }
                
                if (item.type === "js") {
                    var dom = document.createElement("script");
                    dom.setAttribute("src", src);
                    dom.setAttribute("type", "text/javascript");
                    dom.async = false;
                    dom.onload = dom.onerror = function () {
                        jsCount--;
                        if (jsCount <= 0) {
                            resolve();
                        }
                    }
                    document.head.append(dom);
                }
                else if (item.type === "css") {
                    var dom = document.createElement("link");
                    dom.setAttribute("href", src);
                    dom.setAttribute("rel", "stylesheet");
                    document.head.append(dom);
                }
                else if (item.type === "icon") {
                    var dom = document.createElement("link");
                    dom.setAttribute("href", src);
                    dom.setAttribute("rel", "shortcut icon");
                    dom.setAttribute("type", "image/x-icon");
                    document.head.append(dom);
                }
            }
        })

    }).finally(function () {
        const loading = document.querySelector("div.loading");
        if (loading) loading.remove();
    })

};