const warp = function (fn, anonymous, hasPermission, model) {

    return async function (ctx, next) {
        if (!anonymous && hasPermission && typeof hasPermission === "function") {
            await Promise.resolve(hasPermission(ctx, function () {
                return fn(ctx, next);
            }, model));
        }
        else {
            return fn(ctx, next,model);
        }

    }
}
/**
 * 
 * @param {*} Router 
 * @param {Function} hasPermission - 用户权限判断
 */
function extendRouter(Router, hasPermission) {
    Router.prototype.setPermission = function (text, anonymous) {
        const laster = this.stack[this.stack.length - 1];
        if (laster) {
            laster.text = text;
            laster.anonymous = anonymous;
            for (let i = 0; i < laster.stack.length; i++) {
                if (laster.stack[i].isAmis === true) {
                    continue;
                }
                laster.stack[i] = warp(laster.stack[i], anonymous, hasPermission, laster.name);
                laster.stack[i].isAmis = true;
            }
        }
        return this;
    }
}
/**
 * 生成模块管理树
 * @param {Router[]|Router} routers 
 */
function getModels(routers) {
    let rs = Array.isArray(routers) ? routers : [routers];
    let models = [], exists = {};
    for (const item of rs) {
        for (const s of item.stack) {
            if (!s.name || !s.name.length) continue;
            if (!exists[s.name]) {
                models.push({
                    id: s.name,
                    name: s.text
                });
                exists[s.name] = true
            }
        }
    }
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
    return items;
}

async function Nothing(ctx, next) { }
module.exports = {
    extendRouter,
    getModels,
    Nothing
}
