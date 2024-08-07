[英文](https://github.com/zsea/amis-server/blob/master/README.MD)

基于百度AMIS实现的简单后台管理系统。

# 功能
* 登录
* 账号管理
* 角色管理
* 密码修改
* 页面设计
* API管理

# 安装

```
npm install --save @zsea/amis-server  --only=production
```

# 使用

```js
const { htmlPath,extendRouter,AmisServer,useAmisServer,useAuthenticate } = require("./amis-server")
```

> 包中没有包含```Koa-Router```，你需要在你的项目中手动引入。

1. 为```Router```对象添加权限设置方法，方便自己开发模块时可以直接设置模块的权限。

```js
extendRouter(Router,useAuthenticate(db),useUser(SECRET,tokenName));
```

* db为基于[linq2mysql](https://www.npmjs.com/package/linq2mysql)的```Linq```实例。
* ```Router```为```koa-router```类。
* ```useAuthenticate```为实现的权限验证模块，你也可以实现自己的权限验证模块。
* ```useUser```转换cookie中token内容为user对象的方法。你也可以实现自己的转换函数，函数签名为：```parseUser(ctx)```。
    * SECRET - JWT的密钥
    * tokenName - cookie存储token的名称。默认值：amis_token

2. 创建一个```AmisServer```对象，```AmisServer```中实现了基本的权限管理功能。

```js
const server=useAmisServer(router,db,JWT_SECRET,tokenName,watcher);
// 或者
const server=new AmisServer(router,db,JWT_SECRET,tokenName,watcher);
```

* ```router```为```koa-router```实例。
* ```db```为```Linq```实例。
* ```JWT_SECRET```为```JWT```的密钥。
* ```tokenName```为登录成功后存储```token```的```cookie```名称。
* ```watcher```为监控事件，目前主要用于处理API变化时让服务端重新加载API数据。

> 此处的访问路径前缀必须是```/api/amis```，即```useAmisServer```中传入的```router```的```prefix```值为```/api/amis```。

3. 创建一个KOA服务，并添加路由。

```js
var app = new Koa();
app.use(router.routes());
```

4. 添加静态资源
```js
app.use(Asar(htmlPath, { "root": "/html", index: "index.html",default:"master.html" }));
```

> 此处依赖了包```koa-asar```。

# 注册自定义模块

在```extendRouter```中为```Router```扩展了```setPermission```方法，原型如下：
```js
setPermission(text,anonymous);
```

* text - 模块名称
* anonymous - 模块是否允许匿名访问，默认：false

该方法为最后添加的路由设置模块名称和访问权限。

```js
router.get('test','/api/texxt',(ctx)=>{ctx.body="OK"}).setPermission('测试');
```

此处的```get```可以换成其它任何有效的http方法，模块的主子关系使用```:```分隔。

为了能在权限管理中查看到对应的模块，需要将此路由添加到```AmisServer```中。

```js
server.appendRouter(router);
```

# 使用封装的数据库操作方法

库中封装了常用的数据库操作方法。

* usePager - 从数据库中分页查询数据
* useUpdater - 更新数据库中的数据
* useDeleter - 从数据为中删除记录
* useInsertOrUpdate - 向数据库中写入记录，如果存在，则更新。
* useInsert - 向数据库中写入记录。

## 参数说明

* useTable - 回调函数，返回一个```Linq```对象。
* useQuery - 根据配置生成一个操作的```object```的值。

### 示例

**useTable**

```js
useTable(()=>db.table("users"));
```

**useQuery**
```js
{
    id:({query,body,user})=>query.id
}
```
在上面的对象中，```id```的值会在运行时生成。```query```和```body```分别是```GET```和```POST```传入的对象。```user```为当前登录对象。

> 上面说的```POST```实际指：POST/PATCH等可以传入body的方法。

# API管理
系统提供简单的API管理功能，可以完成数据库的```CRUD```操作。

## 示例

```js
const cloud = new Cloud();
await cloud.use({db,dbs}, authorize, parseUser,watcher);
```

# 其它

```amis.sql```为```mysql```的数据表创建语句。