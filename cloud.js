const { usePager, useDeleter, useUpdater, useInsert } = require("./table")
    , Event = require("events").EventEmitter
    ;
function Cloud() {

}
function parseFunction(code, db, dbs, helper) {
    let f = new Function("db", "dbs", "require", "helper", code);
    const md = f(db, dbs, require, helper);
    delete f;
    return md;
}
Cloud.prototype.stack = [];
/**
 * 
 * @param {object} database - 数据库配置
 * @param {Linq} database.db - 默认数据库连接，一般连接到amis系统数据库
 * @param {object} database.dbs - 数据库连接对象池
 * @param {*} authorize 
 * @param {*} parseUser 
 * @param {Event} watcher - 接口变化的事件
 * @param {object} helper - 用户自定义的辅助功能
 * @returns 
 */
Cloud.prototype.use = async function ({ db, dbs }, authorize, parseUser, watcher, helper) {
    // const dbs = undefined;
    let index = {}, middlewares = {}, models = [], self = this;

    function createMiddleware(m) {
        if (m.type === "customize") {
            return parseFunction([' return async function(ctx,next){', m.codes, '}'].join('\n'), db, dbs, helper);
        }
        else if (m.type === 'simple') {
            const useTable = parseFunction('return ' + m.table, db, dbs, helper);
            if (m.usefunc === "usePager") {
                const variables = parseFunction('return ' + m.variables, db, dbs, helper);
                const where = parseFunction('return ' + m.where, helper);
                let fields = m.fields;
                if (fields && fields.length) fields = fields.split(',');
                if (!fields || !fields.length) fields = null
                const md = usePager(useTable, where, variables, fields, m.desc_by_time === 1);
                return md;
            }
            else if (m.usefunc === "useUpdater") {
                const variables = parseFunction('return ' + m.variables, db, dbs, helper);
                const where = parseFunction('return ' + m.where, db, dbs, helper);
                const entity = parseFunction('return ' + m.entity, db, dbs, helper);
                const md = useUpdater(useTable, where, variables, entity, m.has_time === 1);
                return md;
            }
            else if (m.usefunc === "useDeleter") {
                const variables = parseFunction('return ' + m.variables, db, dbs, helper);
                const where = parseFunction('return ' + m.where, db, dbs, helper);
                const md = useDeleter(useTable, where, variables);
                return md;
            }
            else if (m.usefunc === "useInsert") {
                const entity = parseFunction('return ' + m.entity, db, dbs, helper);
                const md = useInsert(useTable, entity, m.has_time === 1, m.updater === 1);
                return md;
            }
        }
    }
    async function loadModels() {
        let __models__ = await db.table("models").where({ status: "enable" }).toArray();
        let __index__ = {}, __middlewares__ = {}, __stack__ = __models__.map(x => ({ name: x.id, text: x.name, method: x.method, path: x.path }));
        __models__.forEach(m => {
            const key = `${m.method}:${m.path}`;
            __index__[key] = m;
            __middlewares__[key] = createMiddleware(m);

        });
        models = __models__;
        index = __index__;
        middlewares = __middlewares__;
        self.stack = __stack__;
    };
    async function loadOne(id, old) {

        const m = await db.table("models").where({ status: "enable", id: id }).first();
        if (m) {
            // 更新
            if (old) {
                const okey = `${old.method}:${old.path}`;
                delete index[okey];
                delete middlewares[okey];
            }
            const key = `${m.method}:${m.path}`;
            index[key] = m;
            middlewares[key] = createMiddleware(m);
            const stack = self.stack.find(x => x.name === m.id);
            if (stack) {
                stack.name = m.id;
                stack.text = m.name;
                stack.method = m.method;
                stack.path = m.path;
            }
            else {
                self.stack.push({
                    name: m.id,
                    text: m.name,
                    method: m.method,
                    path: m.path
                })
            }
        }
        else {

            removeModel(id);
        }
    }
    function removeModel(id) {
        const stack = self.stack.find(x => x.name === id);
        if (stack) {
            const key = `${stack.method}:${stack.path}`;
            delete index[key];
            delete middlewares[key];
            self.stack = self.stack.filter(x => x.name !== id)
        }
    }
    if (watcher) {
        watcher.addListener("reload", loadModels);
        watcher.addListener("deleted", removeModel);
        watcher.addListener("changed", loadOne);
        watcher.addListener("added", loadOne);
    }

    await loadModels();
    function callMiddleware(key, ctx, next) {
        const md = middlewares[key];
        if (md) {
            return Promise.resolve(md(ctx, next));
        }
        else {
            ctx.status = 404;
        }

    }
    return async function (ctx, next) {
        if (!ctx.user) {
            await Promise.resolve(parseUser(ctx));
        }
        const key = `${ctx.method}:${ctx.path}`;
        const model = index[key];
        if (!model) {
            return await next();
        }
        if (model.anonymous) {
            //数据库中的匿名模块
            await Promise.resolve(callMiddleware(key, ctx, next));
            return;
        }
        if (!ctx.user) {
            // 未登录，非匿名
            return ctx.body = {
                status: 403,
                msg: "未登录。"
            };
        }
        await authorize(ctx, async function () {
            const md = middlewares[key];
            if (md) {
                return Promise.resolve(md(ctx, next));
            }
        }, model.id, model);

        //console.log(ctx.method);
    }
}
module.exports = Cloud;
/**
 * 
 * @param {object} database - 数据库配置
 * @param {Linq} database.db - 默认数据库连接，一般连接到amis系统数据库
 * @param {object} database.dbs - 数据库连接对象池
 * @param {*} authorize 
 * @param {*} parseUser 
 * @param {Event} watcher - 接口变化的事件
 * @param {object} helper - 用户自定义的辅助功能
 * @returns 
 */
module.exports.useCloud = async function ({ db, dbs }, authorize, parseUser, watcher, helper) {
    const cloud = new Cloud();
    return await cloud.use({ db, dbs }, authorize, parseUser, watcher, helper);

}