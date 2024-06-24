const { extendRouter } = require("./extends")
    , { AmisServer, useAuthenticate, useAmisServer } = require("./api")
    , path = require("path")
    ;
const htmlPath = path.join(__dirname, 'amis.asar');
module.exports = {
    /**
     * 为所有的Router原型添加setPression方法
     * @param {*} Router 
     * @param {Function(ctx,next,model)} authorize - 判断用户权限的方法
     * @returns 
     */
    extendRouter: function (Router, authorize) {
        return extendRouter(Router, authorize)
    },
    AmisServer,
    useAmisServer,
    useAuthenticate,
    htmlPath
}