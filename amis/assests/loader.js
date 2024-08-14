function HAdminLoader(res) {
    let jsCount = res.filter(x => x.type === "js").length;
    for (var i = 0; i < res.length; i++) {
        let item = res[i];
        if (item.type === "js") {
            var dom = document.createElement("script");
            dom.setAttribute("src", item.src);
            dom.setAttribute("type", "text/javascript");
            dom.async = false;
            dom.onload = dom.onerror = function () {
                jsCount--;
                if (jsCount <= 0) {
                    const loading=document.querySelector("div.loading");
                    if(loading) loading.remove();
                }
            }
            document.head.append(dom);
        }
        else if (item.type === "css") {
            var dom = document.createElement("link");
            dom.setAttribute("href", item.src);
            dom.setAttribute("rel", "stylesheet");
            document.head.append(dom);
        }
        else if (item.type === "icon") {
            var dom = document.createElement("link");
            dom.setAttribute("href", item.src);
            dom.setAttribute("rel", "shortcut icon");
            dom.setAttribute("type", "image/x-icon");
            document.head.append(dom);
        }
    }
};