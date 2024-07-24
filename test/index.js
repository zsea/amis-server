var Koa = require('koa'), WEBPORT = 8080, path = require("path");
var bodyParser = require('koa-bodyparser'), useStatic = require("./static");
const router = require("./api"), Cloud = require("../cloud"), { getDB, Server, Watcher } = require("./api");
const { useUser, useAuthenticate } = require("../api");

const JWT_SECRET = process.env["AMIS.SECRET"] || "amis";
var app = new Koa();
app.use(bodyParser());
app.use(useStatic(path.join(__dirname, "../amis"), { "root": "/html", index: "index.html", default: "master.html" }));
app.use(router.routes());
const cloud = new Cloud();
Server.appendRouter(cloud);
cloud.use({ db: getDB() }, useAuthenticate(getDB()), useUser(JWT_SECRET),Watcher).then(function (m) {

    return app.use(m);
}).finally(function () {
    app.listen(WEBPORT, function (err) {
        if (err) {
            console.error('start fail', err);
            process.exit(1);
        }
        else {
            console.log('success:', WEBPORT)
        }
    });
})
