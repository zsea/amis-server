const { extendRouter } = require("./extends")
    , { AmisServer, useAuthenticate, useAmisServer, useUser } = require("./api")
    , { usePager, useUpdater, useDeleter, useInsertOrUpdate, useInsert } = require("./table")
    , path = require("path")
    ;
const htmlPath = path.join(__dirname, 'amis.asar');
module.exports = {
    /**
     * 为所有的Router原型添加setPression方法
     * @param {*} Router 
     * @param {Function(ctx,next,model)} authorize - 判断用户权限的方法
     * @param {Function} parseUser - 用户权限判断 
     * @returns 
     */
    extendRouter: function (Router, authorize, parseUser) {
        return extendRouter(Router, authorize, parseUser)
    },
    AmisServer,
    useAmisServer,
    useAuthenticate,
    useUser,
    htmlPath,
    usePager,
    useUpdater,
    useDeleter,
    useInsertOrUpdate,
    useInsert
}