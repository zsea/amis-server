function HAdminLoader(res){
    for(var i=0;i<res.length;i++){
        var item=res[i];
        if(item.type==="js"){
            var dom=document.createElement("script");
            dom.setAttribute("src",item.src);
            dom.setAttribute("type","text/javascript");
            document.head.append(dom);
        }
        else if(item.type==="css"){
            var dom=document.createElement("link");
            dom.setAttribute("href",item.src);
            dom.setAttribute("rel","stylesheet");
            document.head.append(dom);
        }
        else if(item.type==="icon"){
            var dom=document.createElement("link");
            dom.setAttribute("href",item.src);
            dom.setAttribute("rel","shortcut icon");
            dom.setAttribute("type","image/x-icon");
            document.head.append(dom);
        }
    }
};