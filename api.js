// var log4js = require("log4js");
// var logger = log4js.getLogger("系统管理");
// logger.level = process.env['AMIS.LOGGER'] || "TRACE"
// var Router = require('@koa/router');
// const Linq = require("linq2mysql");
const crypto = require("crypto")
    , Event = require("events").EventEmitter
    ;
const JWT = require('jsonwebtoken');
const { getModels } = require("./extends");
const { usePager, useDeleter } = require("./table")

/**
 * 解析token到用户对象
 * @param {string} JWT_SECRET - 生成JWT的密钥
 * @param {string} tokenName - 生成cookie的名称
 * @returns 
 */
function useUser(JWT_SECRET, tokenName) {
    tokenName = tokenName || "amis_token";
    return function user(ctx) {
        const token = ctx.cookies.get(tokenName);
        if (!token || !token.length) {
            return false;
        }
        try {
            var payload = JWT.verify(token, JWT_SECRET);
            ctx.user = payload;
        }
        catch (e) {
            return false;
        }
        return false;
    }
}
function useAuthenticate(db) {

    /**
 * 默认的权限检测方法
 * @param {object} ctx 
 * @param {Function} next 
 * @param {string} model - 模块id
 * @returns 
 */
    return async function Authenticate(ctx, next, model) {
        if (!ctx.user) {
            ctx.body = {
                status: 403,
                msg: "未登录。"
            };
            return;
        }
        if (!await canVisit(ctx.user, model, db)) {
            ctx.body = {
                status: 401,
                msg: "未授权。"
            }
            return;
        }
        await next();
    }
}
/**
 * 判断用户是否具有访问模块的权限
 * @param {object} user 
 * @param {string} user.uid - 用户ID
 * @param {string} model  - 模块ID
 * @param {Linq} db - 数据库连接对象
 * @returns {boolean}
 */
async function canVisit(user, model, db) {
    //return false;
    if (!user) return false;
    if (user.uid === '00000000-0000-0000-0000-000000000000') return true;
    const roles = (await db.table("user_role_links").where({ uid: user.uid }).select(x => x.rid).toArray()).map(x => x.rid);
    roles.push(user.uid); //添加用户id
    roles.push('00000000-0000-0000-0000-000000000000'); //角色Everyone
    const rights = (await db.table("permissions").where({ ur_id: roles, model: model }).select(x => x.limit).toArray()).map(x => x.limit);
    // 检查是否有拒绝权限
    if (rights.some(x => (x & 0x1) === 1)) return false;
    // 是否有允许权限
    if (rights.some(x => (x >> 1 & 0x1) === 1)) return true;
    return false;
}
// extendRouter(Router, Authenticate);
// console.log(Router.prototype)
// const JWT_SECRET = process.env["AMIS.SECRET"] || "zzzsea";

// const db = new Linq(process.env["AMIS.MYSQL"] || "mysql://root@127.0.0.1/amis");
// var router = new Router({
//     prefix: '/api/amis'
// });
/**
 * Amis Server对象
 * @constructor
 * @param {Router} router 
 * @param {Linq} db 
 * @param {string} JWT_SECRET - 生成JWT的密钥
 * @param {string} tokenName - 生成cookie的名称
 * @param {Event} watcher - API变化时的事件触发器
 */
function AmisServer(router, db, JWT_SECRET, tokenName, watcher) {
    tokenName = tokenName || "amis_token";
    this.options["secret"] = JWT_SECRET;
    this.options["tokenName"] = tokenName;
    this.options["expiresIn"] = 7; //cookie存储的时间（单位：天）
    var isAllow = function (user, model) {
        return canVisit(user, model, db);
    }

    var emptyRouter = { stack: [] }
    const self = this;
    this.emptyRouter = emptyRouter;
    this.routers = [emptyRouter, router];
    this.setPermission("limit", "权限管理");
    this.setPermission("system", "系统设置");
    router.post("login", '/login', async function login(ctx) {
        const { password, username, rember } = ctx.request.body;
        if (!username) {
            ctx.body = {
                status: 1,
                msg: "账号不能为空。"
            }
            return
        }
        if (!password) {
            ctx.body = {
                status: 1,
                msg: "密码不能为空。"
            }
            return
        }
        let user = await db.table("users").where({ username: username }).first();
        if (!user) {
            ctx.body = {
                status: 2,
                msg: "账号不存在。"
            }
            return
        }
        if (user.status !== "enable") {
            ctx.body = {
                status: 2,
                msg: "账号被禁用。"
            }
            return
        }
        const tokenUser = { uid: user.id, username: user.username, avatar: user.avatar };
        if (!await isAllow(tokenUser, "login")) {
            ctx.body = {
                status: 403,
                msg: "账号不允许登录。"
            }
            return
        }
        let errorTimes = Math.floor(user.error_times / 3);
        let allowDate = user.last_error_at + 5 * 60 * 1000 * errorTimes;
        if (Date.now() < allowDate) {
            ctx.body = {
                status: 2,
                msg: "登录错误次数太多，请稍后再试。"
            }
            return
        }
        let pwd = `${username}#${user.password}`;
        const md5 = crypto.createHash("md5");
        md5.update(pwd);
        pwd = md5.digest("hex").toString();
        if (password !== pwd) {
            ctx.body = {
                status: 3,
                msg: "密码错误。"
            }
            await db.table("users").where({ id: user.id }).update(x => { x.error_times = x.error_times + 1, x.last_error_at = now }, { now: Date.now() })
            return
        }
        await db.table("users").where({ id: user.id }).update({ last_error_at: 0, error_times: 0 });
        const token = JWT.sign(tokenUser, self.options["secret"], { expiresIn: self.options["expiresIn"] + "d" });
        ctx.cookies.set(tokenName, token, { maxAge: rember ? self.options["expiresIn"] * 24 * 60 * 60 * 1000 : undefined });
        ctx.body = {
            status: 0,
            msg: '登录成功'
        }
    }).setPermission("登录", true);
    router.get("/logout", async function (ctx) {
        ctx.cookies.set(tokenName, "", { expires: new Date(1970, 1, 1) });
        ctx.body = {
            status: 0
        }
    });
    router.get("/schema.js", async function (ctx) {
        const apps = await db.table("application").toArray();
        const settings = {};
        const brandName = (apps.find(x => x.key === "brandName") || {}).value;
        const logo = (apps.find(x => x.key === "logo") || {}).value;
        const className = (apps.find(x => x.key === "className") || {}).value;
        const header = (apps.find(x => x.key === "header") || {}).value;
        const asideBefore = (apps.find(x => x.key === "asideBefore") || {}).value;
        const asideAfter = (apps.find(x => x.key === "asideAfter") || {}).value;
        const footer = (apps.find(x => x.key === "footer") || {}).value;
        const homePage = (apps.find(x => x.key === "homePage") || {}).value;
        function tryJsonParse(s, _default_) {
            try {
                return JSON.parse(s);
            }
            catch (e) {

            }
            return _default_;
        }
        settings["brandName"] = brandName;
        settings["logo"] = logo;
        settings["className"] = className;
        settings["header"] = tryJsonParse(header);
        settings["asideBefore"] = tryJsonParse(asideBefore);
        settings["asideAfter"] = tryJsonParse(asideAfter);
        settings["footer"] = tryJsonParse(footer);
        settings["api"] = '/api/amis/menus';
        settings["type"] = "app";
        settings["homePage"] = homePage;
        ctx.body = `window.__appSchema__=${JSON.stringify(settings)};`
        ctx.set("content-type", "application/javascript; charset=UTF-8");
    });

    router.get("/allow.js", async function (ctx) {
        const models = getModels(self.routers);
        const ___allow___ = {};
        async function loadLimit(children) {
            for (const m of children) {
                let allow = false;
                if (ctx.user) {
                    allow = await isAllow(ctx.user, m.id);
                }
                ___allow___[m.id] = allow;
                if (m.children) {
                    await loadLimit(m.children);
                }
            }
        }
        await loadLimit(models);
        ctx.body = `window.___allow___=${JSON.stringify(___allow___)};window.canAllow=function(id){return ___allow___[id]!==true}\n`
    }).setPermission("权限列表", true);
    // console.log(getModels(router));
    router.get(/*"login",*/ '/menus', async function (ctx) {
        const pages = (await db.table("pages").orderBy(x => x.order).toArray()).map(x => {

            if (x.schema_mode === "json") {
                try {
                    //x.schema = JSON.parse(x.schema);
                    x.schemaApi = '/api/amis/schema/' + x.id
                    delete x.schema;
                }
                catch (e) {

                }
            }
            else {
                x.schemaApi = x.schema_api;
            }

            x.isDefaultPage = x.is_default_page;
            x.className = x.class_name;
            x.isDefaultPage = x.isDefaultPage === "true";
            x.visible = x.visible === "true";
            if (x.redirect || x.link) {
                x.schemaApi = undefined;
                x.schema = undefined;
            }
            if (!x.pid) x.pid = "";
            if (x.schema_mode === "url") {
                delete x.schema;
            }
            return x;
        })
        async function loadChildren(pid) {
            let children = pages.filter(x => x.pid === pid);
            for (const child of children) {
                const __allow__ = await isAllow(ctx.user, child.model);
                if (__allow__) {
                    child.children = await loadChildren(child.id);
                }
                else {
                    child.__deny__ = true;
                }
            }
            if (children && children.length) return children.filter(x => x.__deny__ !== true);
        }
        const children = await loadChildren("")
        ctx.body = {
            status: 0,
            data: {
                pages: [{
                    children: children
                }]
            }
        }
    }).setPermission("权限列表", true);//.setPermission("登录");

    router.get(/*"login",*/ "/schema/:id", async function (ctx) {
        const { id } = ctx.params
        if (!id) {
            return ctx.body = {
                status: 0,
                data: {
                    type: "page",
                    body: "404"
                }
            }
        }
        const page = await db.table("pages").where({ id: id }).first();
        if (!page || page.status !== 'enable') {
            return ctx.body = {
                status: 0,
                data: {
                    type: "page",
                    body: "404"
                }
            }
        }
        ctx.body = {
            status: 0,
            data: JSON.parse(page.schema || JSON.stringify({ type: "page" }))
        }
        ctx.headers["content-type"] = "application/json; charset=utf-8";
    });//.setPermission("");

    router.get("limit:user", '/users', async function (ctx) {
        const users = (await db.table("users").orderBy(x => x.created_at).toArray()).map(x => {
            const u = Object.assign({}, x, { password: '' });
            return u;
        });
        const total = await db.table("users").count();
        ctx.body = {
            status: 0,
            data: {
                items: users,
                total: total
            }
        }
    }).setPermission("账号管理");
    router.delete("limit:user:delete", '/user', async function (ctx) {
        const { id } = ctx.request.query;
        if (id === "00000000-0000-0000-0000-000000000000") {
            return ctx.body = {
                status: 403,
                msg: "不能删除当前账号。"
            }
        }
        await Promise.all([db.table("users").where({ id: id }).delete()
            , db.table("user_role_links").where({ uid: id }).delete()
            , db.table("permissions").where({ ur_id: id }).delete()
        ]);
        ctx.body = {
            status: 0
        }
    }).setPermission("删除账号");
    router.post("limit:user:add", "/limit/user", async function (ctx) {
        const { id, password, status, username } = ctx.request.body;
        if (!id) {
            return ctx.body = {
                status: 1,
                msg: '缺少参数 id'
            }
        }
        if (!password) {
            return ctx.body = {
                status: 1,
                msg: '缺少参数 password'
            }
        }
        if (!username) {
            return ctx.body = {
                status: 1,
                msg: '缺少参数 username'
            }
        }
        //检查id是否重得
        let u = await db.table("users").where({ id: id }).first();
        if (u) {
            return ctx.body = {
                status: 2,
                msg: '账号已存在'
            }
        }
        u = await db.table("users").where({ username: username }).first();
        if (u) {
            return ctx.body = {
                status: 2,
                msg: '账号已存在'
            }
        }
        await db.table("users").insert({
            id: id,
            password: password,
            status: status === "enable" ? "enable" : "disabled",
            username: username,
            created_at: Date.now(),
            updated_at: 0,
            error_times: 0,
            last_error_at: 0
        });
        ctx.body = {
            status: 0
        }
    }).setPermission("添加账号");
    router.patch('limit:user:editor', "/limit/user", async function (ctx) {
        const { id, password, status } = ctx.request.body;
        if (!id) {
            return ctx.body = {
                status: 1,
                msg: '缺少参数 id'
            }
        }
        if (!password) {
            return ctx.body = {
                status: 1,
                msg: '缺少参数 password'
            }
        }

        await db.table("users").where({ id: id }).update({
            password: password,
            status: status === "enable" ? "enable" : "disabled",
            updated_at: Date.now()
        });
        ctx.body = {
            status: 0
        }
    }).setPermission("修改密码");

    async function ModelMiddleware(ctx, next) {
        let { id } = ctx.request.query;
        if (!id) {
            return ctx.body = {
                status: 1,
                msg: "缺少参数 id"
            }
        }
        let models = getModels(self.routers);
        const limits = await db.table("permissions").where({ ur_id: id }).toArray();
        function loadLimit(children) {
            if (!children) return;
            // const children = models.filter(x => x.parent === pid);
            for (const child of children) {
                loadLimit(child.children);
                //child.children = loadChildren(child.id);
                // if(child.children)
                const ad = limits.find(x => x.model === child.id);
                let allow = 0, deny = 0;
                if (ad && ad.limit) {
                    allow = (ad.limit >> 1) === 1;
                    deny = (ad.limit & 0x1) === 1;
                }
                child.allow = allow;
                child.deny = deny;
            }
            if (children.length) return children.map(x => ({
                id: x.id,
                label: x.name,
                allow: x.allow,
                deny: x.deny,
                children: x.children
            }));
        }
        loadLimit(models);
        const items = models;
        ctx.body = {
            status: 0,
            data: {
                items: items,
                oid: id
            }
        }
    }
    router.get('limit:roles:permissions', '/role/models', ModelMiddleware).setPermission("权限设置");
    router.get('limit:user:permissions', '/user/models', ModelMiddleware).setPermission("权限设置");
    router.get('system:pages', '/system/page/models', ModelMiddleware).setPermission("页面管理");
    router.get('limit:user:role', '/user/roles', async function (ctx) {
        const roles = await db.table("roles").orderBy(x => x.created_at).toArray();
        const { uid } = ctx.request.query;
        const data = {
            items: roles.map(x => {
                x.value = x.id;
                return x;
            })
        }
        if (uid) {
            const uRoles = await db.table("user_role_links").where({ uid: uid }).orderBy(x => x.created_at).toArray();
            data["roles"] = uRoles.map(x => x.rid).join(',');
        }
        ctx.body = {
            status: 0,
            data: data
        }
    }).setPermission("角色设置");
    router.post('limit:user:role', '/user/roles', async function (ctx) {
        let { roles, uid } = ctx.request.body;
        roles = roles.split(',');
        let allRoles = (await db.table("user_role_links").where({ uid: uid }).toArray()).map(x => x.rid);
        for (const item of roles) {

            if (allRoles.includes(item)) {
                // 存在，则不添加
                allRoles = allRoles.filter(x => x !== item);
                continue;
            }
            // 写入数据库
            if (item && item.length) {
                await db.table("user_role_links").insert({ id: [uid, item].join(':'), uid: uid, rid: item, created_at: Date.now() });
                allRoles = allRoles.filter(x => x !== item);
            }
        }
        // 删除数据库中还存在的内容
        if (allRoles && allRoles.length) {
            const ids = allRoles.map(x => [uid, x].join(':'));
            await db.table("user_role_links").where({ id: ids }).delete();
        }
        ctx.body = {
            status: 0
        }
    }).setPermission("角色设置");
    router.patch('limit:user:status', '/user/status', async function (ctx) {
        const { id, status } = ctx.request.body;
        if (id === "00000000-0000-0000-0000-000000000000") {
            return ctx.body = {
                status: 403,
                msg: "不能修改当前账号状态。"
            }
        }
        await db.table("users").where({ id: id }).update({ status: status, updated_at: Date.now() });
        ctx.body = {
            status: 0
        }
    }).setPermission('状态设置');
    router.post('limit:user:permissions', '/user/permissions', async function (ctx) {
        const { oid, model, type, value } = ctx.request.body;
        const id = `${model}:${oid}`;
        const permission = await db.table("permissions").where({ id: id }).first();
        let limit = 0, n = value === true ? 1 : 0, old = 0;
        if (permission) {
            old = permission.limit || 0;
        }
        if (type === "allow") {
            limit = (n << 1) | (old & 0x1);
        }
        else if (type === "deny") {
            limit = (old & 0x2) | n;
        }
        await db.table("permissions").insert({ id: id, ur_id: oid, model: model, limit: limit, created_at: Date.now(), updated_at: 0 }, { limit: limit, updated_at: Date.now() });
        ctx.body = {
            status: 0
        }
    }).setPermission('权限设置');

    router.get('system:pages', '/system/pages', async function (ctx) {
        const pages = (await db.table("pages").orderByDescending(x => x.is_system_page).thenBy(x => x.order).toArray()).map(x => {
            if (!x.pid) x.pid = "";
            if (x.schema) {
                try {
                    x.schema = JSON.parse(x.schema);
                }
                catch (e) {

                }
            }
            x.visible = x.visible === "true"
            x.is_default_page = x.is_default_page === "true";
            return x;
        });
        function loadChildren(pid) {
            let children = pages.filter(x => x.pid === pid);
            children.forEach(child => {
                child.children = loadChildren(child.id);
            });
            if (children && children.length) return children;
        }
        const items = loadChildren("");
        ctx.body = {
            status: 0,
            data: {
                items: items
            }
        }
    }).setPermission('页面管理');
    router.post('system:pages:add', '/system/page', async function (ctx) {
        const { id, label, model, order, schema_mode, url, visible, icon, schema_api, link, redirect, rewrite, is_default_page, class_name, pid, status } = ctx.request.body;
        const entity = {
            id: id,
            label: label,
            model: model,
            order: order || 0,
            schema_mode: schema_mode,
            url: url,
            visible: visible ? "true" : "false",
            icon: icon,
            schema_api: schema_api,
            link: link,
            redirect: redirect,
            rewrite: rewrite,
            is_default_page: is_default_page ? "true" : "false",
            class_name: class_name,
            is_system_page: 0,
            pid: pid,
            status: status
        };
        await db.table("pages").insert(Object.assign({ created_at: Date.now(), updated_at: 0 }, entity), Object.assign({ updated_at: Date.now() }, entity));
        ctx.body = {
            status: 0
        }
    }).setPermission('添加页面');
    router.patch('system:pages:schema', '/system/schema', async function (ctx) {
        const { id, schema } = ctx.request.body;
        if (!id) {
            return ctx.body = {
                status: 1,
                msg: "缺少参数 id"
            }
        }
        if (!schema) {
            return ctx.body = {
                status: 1,
                msg: "缺少参数 schema"
            }
        }
        const page = await db.table("pages").where({ id: id }).first();
        if (!page) {
            return ctx.body = {
                status: 2,
                msg: "页面不存在"
            }
        }
        if (page.is_system_page === 1) {
            return ctx.body = {
                status: 403,
                msg: "当前页面不允许编辑"
            }
        }
        await db.table("pages").where({ id: id }).update({ schema: schema, updated_at: Date.now() });
        ctx.body = {
            status: 0
        }
    }).setPermission('设计页面');

    router.patch('system:pages:editor', '/system/page', async function (ctx) {
        const { id, label, model, order, schema_mode, url, visible, icon, schema_api, link, redirect, rewrite, is_default_page, class_name, pid, status } = ctx.request.body;
        const entity = {
            label: label,
            model: model,
            order: order || 0,
            schema_mode: schema_mode,
            url: url,
            visible: visible ? "true" : "false",
            icon: icon,
            schema_api: schema_api,
            link: link,
            redirect: redirect,
            rewrite: rewrite,
            is_default_page: is_default_page ? "true" : "false",
            class_name: class_name,
            is_system_page: 0,
            pid: pid,
            status: status
        };
        await db.table("pages").where({ id: id, is_system_page: 0 }).update(Object.assign({ updated_at: Date.now() }, entity));
        ctx.body = {
            status: 0
        }
    }).setPermission('设置页面');
    router.delete('system:pages:delete', '/system/page', async function (ctx) {
        const { id } = ctx.request.query;
        if (!id) {
            return ctx.body = {
                status: 1,
                msg: `缺少参数 id`
            }
        }
        const count = await db.table("pages").where({ pid: id }).count();
        if (count > 0) {
            return ctx.body = {
                status: 401,
                msg: `请先删除子页面`
            }
        }
        await db.table("pages").where({ id: id, is_system_page: 0 }).delete();
        ctx.body = {
            status: 0
        }
    }).setPermission('删除页面');

    router.get('limit:roles', '/authorize/roles', async function (ctx) {
        const roles = await db.table("roles").orderBy(x => x.created_at).toArray();
        ctx.body = {
            status: 0,
            data: {
                items: [{ id: "00000000-0000-0000-0000-000000000000", name: "Everyone", desc: "所有账号都会属于该角色。", created_at: 0 }, ...roles]
            }
        }
    }).setPermission('角色管理');
    router.post('limit:roles:add', '/authorize/role', async function (ctx) {
        const { id, name, desc } = ctx.request.body;
        const entity = {
            id,
            name,
            desc
        }
        await db.table("roles").insert(Object.assign({ created_at: Date.now(), updated_at: 0 }, entity), Object.assign({ updated_at: Date.now() }, entity));
        ctx.body = {
            status: 0
        }
    }).setPermission('增加角色');
    router.delete('limit:roles:delete', '/authorize/role', async function (ctx) {
        const { id } = ctx.request.query;
        if (!id) {
            return ctx.body = {
                status: 1,
                msg: `缺少参数 id`
            }
        }
        await db.table("roles").where({ id: id }).delete();
        ctx.body = {
            status: 0
        }
    }).setPermission('删除角色');
    router.get('limit:roles:users', '/authorize/roles/users', async function (ctx) {
        const { id } = ctx.request.query;
        // 读取所有账号
        const users = await db.table("users").where(x => x.id !== '00000000-0000-0000-0000-000000000000').toArray();
        const links = await db.table("user_role_links").where({ rid: id }).where(x => x.uid !== '00000000-0000-0000-0000-000000000000').toArray();
        ctx.body = {
            status: 0,
            data: {
                items: users.map(x => ({ id: x.id, username: x.username, status: x.status, value: x.id })),
                users: links.map(x => x.uid).join(',')
            }
        }
    }).setPermission('用户管理');
    router.post('limit:roles:users', '/authorize/roles/users', async function (ctx) {
        let { role, users } = ctx.request.body;
        if (!role || !role.length) {
            return ctx.body = {
                status: 1,
                msg: "缺少参数 role"
            }
        }
        users = (users || '').split(',').filter(x => x && x.length);
        const uList = (await db.table("user_role_links").where({ rid: role }).select(x => x.uid).toArray()).map(x => x.uid);
        for (const u of users) {
            const uIndex = uList.indexOf(u);
            if (uIndex > -1) {
                uList[uIndex] = null;
                continue;
            }
            //添加到表中
            await db.table("user_role_links").insert({
                id: `${u}:${role}`,
                uid: u,
                rid: role,
                created_at: Date.now()
            });
        }
        const deletedUsers = uList.filter(x => x !== null).map(x => `${x}:${role}`);
        if (deletedUsers && deletedUsers.length) {
            await db.table("user_role_links").where({ id: deletedUsers }).delete()
        }
        ctx.body = {
            status: 0
        }
    }).setPermission('用户管理');
    router.post('limit:roles:permissions', '/authorize/roles/permissions', async function (ctx) {
        const { oid, model, type, value } = ctx.request.body;
        const id = `${model}:${oid}`;
        const permission = await db.table("permissions").where({ id: id }).first();
        let limit = 0, n = value === true ? 1 : 0, old = 0;
        if (permission) {
            old = permission.limit || 0;
        }
        if (type === "allow") {
            limit = (n << 1) | (old & 0x1);
        }
        else if (type === "deny") {
            limit = (old & 0x2) | n;
        }
        await db.table("permissions").insert({ id: id, ur_id: oid, model: model, limit: limit, created_at: Date.now(), updated_at: 0 }, { limit: limit, updated_at: Date.now() });
        ctx.body = {
            status: 0
        }
    }).setPermission('权限设置');
    router.get('system:application', '/settings/application', async function (ctx) {
        const apps = await db.table("application").toArray();
        const settings = {};
        apps.forEach(kv => {
            settings[kv.key] = kv.value;
        })
        ctx.body = {
            status: 0,
            data: settings
        }
    }).setPermission("应用设置");
    router.post('system:application', '/settings/application', async function (ctx) {
        const fields = ['brandName', 'logo', 'className', 'header', 'asideBefore', 'asideAfter', 'footer', 'homePage'];
        for (const key of fields) {
            const value = ctx.request.body[key];
            await db.table("application").insert({ key: key, value: value, created_at: Date.now(), updated_at: 0 }, { key: key, value: value, updated_at: 0 });
        }
        ctx.body = {
            status: 0,
            msg: "保存成功！"
        }
    }).setPermission("应用设置");

    router.get("self", "/self", async function (ctx) {
        ctx.body = {
            status: 0,
            data: ctx.user
        }
    }).setPermission("个人信息");
    router.post('self:passwd', '/self/passwd', async function (ctx, next) {
        const { password, newPassword } = ctx.request.body;
        if (!password) {
            ctx.body = {
                status: 1,
                msg: "原始密码不能为空。"
            }
            return
        }
        if (!newPassword) {
            ctx.body = {
                status: 1,
                msg: "新密码不能为空。"
            }
            return
        }
        const username = ctx.user.username;
        let user = await db.table("users").where({ id: ctx.user.uid }).first();
        if (!user) {
            ctx.body = {
                status: 2,
                msg: "账号不存在。"
            }
            return
        }
        let pwd = `${username}#${user.password}`;
        const md5 = crypto.createHash("md5");
        md5.update(pwd);
        pwd = md5.digest("hex").toString();
        if (password !== pwd) {
            ctx.body = {
                status: 3,
                msg: "原始密码错误。"
            }
            return
        }
        await db.table("users").where({ id: user.id }).update({ password: newPassword });
        ctx.cookies.set('amis_token', "", { expires: new Date(1970, 1, 1) });
        ctx.body = {
            status: 0,
            msg: "密码修改成功，请重新登录。"
        }
    }).setPermission("修改密码");

    //接口管理

    router.get("system:apis", "/settings/apis", async function (ctx) {
        let models = await db.table("models").orderBy(p => p.order).toArray()
        models = models.map(x => {
            const level = x.id.split(':').length;
            x.level = level;
            if (level === 1) {
                x.parent = "";
            }
            else {
                x.parent = x.id.replace(/:[^:]+$/ig, '');
            }
            if (!x.name) x.name = x.id;
            if (x.fields && x.fields.length) {
                x.fields = x.fields.split(',');
            }
            else {
                x.fields = [];
            }
            x.descByTime = x.desc_by_time === 1;
            x.hasTime = x.has_time === 1;
            x.updater = x.updater === 1;
            //delete x.desc_by_time;
            return x;
        });
        function loadChildren(pid) {
            const children = models.filter(x => x.parent === pid);
            for (const child of children) {
                child.children = loadChildren(child.id);
            }
            if (children.length) return children;
        }
        const items = loadChildren("");
        ctx.body = {
            status: 0,
            data: {
                items: items || []
            }
        }
    }).setPermission("接口管理");
    function useApiMiddleware(mode) {
        return async function (ctx) {
            // let { id, name, path, status, type, method } = ctx.request.body;
            let origin;
            if (mode === 'update') {
                if (!ctx.request.query.id || !ctx.request.query.id.length) {
                    return ctx.body = {
                        status: 0,
                        msg: '缺少原始接口id'
                    }
                }
            }
            const required = ['id', 'name', 'path', 'status', 'type', 'method'];
            if (ctx.request.body.type === "simple") {
                required.push('usefunc');
                required.push("table");
                if (ctx.request.body.usefunc === "useUpdater") {
                    required.push("entity");
                }
                else if (ctx.request.body.usefunc === "useUpdater") {
                    required.push("useInsert");
                }
            }
            for (const field of required) {
                const v = ctx.request.body[field];
                if (v === null || v === undefined || v === "") {
                    return ctx.body = {
                        status: 1,
                        msg: '缺少必要参数 ' + field
                    }
                }
            }
            const entity = {
                id: ctx.request.body.id,
                name: ctx.request.body.name,
                path: ctx.request.body.path,
                method: ctx.request.body.method,
                status: ctx.request.body.status,
                order: ctx.request.body.order || 0,
                type: ctx.request.body.type,
                anonymous: ctx.request.body.anonymous || 0,
                has_time: ctx.request.body.hasTime ? 1 : 0
                //created_at: Date.now(),
                //updated_at: 0
            }
            //console.log(entity);
            if (entity.type === "simple") {
                entity.usefunc = ctx.request.body.usefunc;
                entity.table = ctx.request.body.table;
                if (entity.usefunc === "usePager") {
                    entity.where = ctx.request.body.where;
                    entity.variables = ctx.request.body.variables;
                    entity.fields = (ctx.request.body.fields || []).join(",");
                    entity.desc_by_time = ctx.request.body.descByTime ? 1 : 0;
                }
                else if (entity.usefunc === "useUpdater") {
                    entity.where = ctx.request.body.where;
                    entity.variables = ctx.request.body.variables;
                    entity.entity = ctx.request.body.entity;
                }
                else if (entity.usefunc === "useDeleter") {
                    entity.where = ctx.request.body.where;
                    entity.variables = ctx.request.body.variables;
                }
                else if (entity.usefunc === "useInsert") {
                    entity.entity = ctx.request.body.entity;
                    entity.has_time = ctx.request.body.hasTime ? 1 : 0;
                    entity.updater = ctx.request.body.updater ? 1 : 0;
                }
            }
            else if (entity.type === 'customize') {
                entity.codes = ctx.request.body.codes;
                //console.log(ctx.request.body)
            }
            if (mode === 'insert') {
                entity.updated_at = 0;
                entity.created_at = Date.now();
                try {
                    await db.table("models").insert(entity);
                }
                catch (e) {
                    if (e.code === 'ER_DUP_ENTRY') {
                        return ctx.body = {
                            status: 500,
                            msg: '存在相同记录。'
                        }
                    }
                }
            }
            else if (mode === 'update') {
                origin = await db.table("models").where({ id: ctx.request.query.id }).first();
                entity.updated_at = Date.now();
                await db.table("models").where({ id: ctx.request.query.id }).update(entity);
            }
            if (watcher) {
                let eventName = null;
                if (mode === "insert") {
                    eventName = "added";
                }
                else if (mode === "update") {
                    eventName = "changed";
                    if (ctx.request.query.id !== entity.id) {
                        watcher.emit("deleted", ctx.request.query.id);
                    }
                }
                if (eventName) {
                    watcher.emit(eventName, entity.id, origin);
                }
            }
            ctx.body = {
                status: 0
            }
        }
    }
    router.post("system:apis:post", "/settings/apis", useApiMiddleware("insert")).setPermission("添加接口");
    router.patch("system:apis:patch", "/settings/apis", useApiMiddleware("update")).setPermission("编辑接口");
    function useApiDelete() {
        const m = useDeleter(() => db.table("models"), p => p.id == id, { id: ({ query }) => query.id })
        return async function (ctx, next) {
            await m(ctx, next);
            if (watcher && ctx.body && ctx.body.status === 0) {
                watcher.emit("deleted", ctx.request.query.id);
            }
        }
    }
    router.delete("system:apis:delete", "/settings/api", useApiDelete()).setPermission("删除接口");
    router.get("system:apis:reload", "/settings/apis/reload", async function (ctx, next) {
        if (watcher) {
            watcher.emit("reload");
        }
        ctx.body = {
            status: 0
        }
    }).setPermission("重新加载接口");
}
/**
 * 添加模块到Server中，便于进行授权操作
 * @param {Router} router 
 * @returns 
 */
AmisServer.prototype.appendRouter = function (router) {
    this.routers.push(router);
    return this;
}
/**
 * 在模块管理中，以:分隔模块路径，此处可设置某些模块没有对应功能接口时，需要在权限管理里显示
 * @param {string} id - 模块ID
 * @param {string} name - 模块名称
 * @returns 
 */
AmisServer.prototype.setPermission = function (id, name) {
    this.emptyRouter.stack.push({ name: id, text: name });
    return this;
}
/**
 * 生成登录的token字符串
 * @param {*} user - 用户信息 
 * @param {boolean|string} rember - 是否持久化
 * @returns {string} 
 */
AmisServer.prototype.getToken = function (user, rember) {
    const options = {};
    if (typeof rember === "boolean" && rember === true) {
        options["expiresIn"] = this.options["expiresIn"] + "d";
    }
    else if (typeof rember === "string") {
        options["expiresIn"] = rember;
    }
    return JWT.sign(user, this.options["secret"], options);
}
/**
 * 存储当前服务的一些设置项
 */
AmisServer.prototype.options = {};
/**
 * Amis Server对象
 * @param {Router} router 
 * @param {Linq} db 
 * @param {string} JWT_SECRET - 生成JWT的密钥
 * @param {string?} tokenName - 生成cookie的名称
 * @param {Event} watcher - API变化时的事件触发器 
 * @returns AmisServer
 */
function useAmisServer(router, db, JWT_SECRET, tokenName, watcher) {
    return new AmisServer(router, db, JWT_SECRET, tokenName, watcher);
}

module.exports = {
    AmisServer,
    useAuthenticate,
    useAmisServer,
    useUser
};
