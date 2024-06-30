
var Router = require('@koa/router');
const Linq = require("linq2mysql");
const { extendRouter, useAmisServer, useAuthenticate,useUser } = require("../index")

const JWT_SECRET = process.env["AMIS.SECRET"] || "amis";

const db = new Linq(process.env["AMIS.MYSQL"] || "mysql://root@127.0.0.1/amis");
extendRouter(Router, useAuthenticate(db),useUser(JWT_SECRET));
var router = new Router({
    prefix: '/api/amis'
});

const server = useAmisServer(router, db, JWT_SECRET);
module.exports = router;
module.exports.Server = server;
module.exports.Router = Router;