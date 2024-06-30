var Koa = require('koa'), WEBPORT = 8080, path = require("path");
var bodyParser = require('koa-bodyparser'), useStatic = require("./static");
const router = require("./api");

var app = new Koa();
app.use(bodyParser());
app.use(useStatic(path.join(__dirname, "../amis"), { "root": "/html", index: "index.html", default: "master.html" }));
app.use(router.routes());
app.listen(WEBPORT, function (err) {
    if (err) {
        console.error('start fail', err);
        process.exit(1);
    }
    else {
        console.log('success:', WEBPORT)
    }
});