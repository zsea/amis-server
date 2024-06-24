A Simple Backend Management System Implemented with Baidu AMIS

# Features
- Login
- Account Management
- Role Management
- Password Change

# Installation

```shell
npm install --save @zsea/amis-server
```

# Usage

```javascript
const { htmlPath, extendRouter, AmisServer, useAmisServer, useAuthenticate } = require("./amis-server")
```

> The package does not include `Koa-Router`; you need to manually introduce it in your project.

1. Add a permission setting method to the `Router` object to facilitate the direct setting of errors in the modules you develop.

```javascript
extendRouter(Router, useAuthenticate(db));
```

* `db` is a `Linq` instance based on [linq2mysql](https://www.npmjs.com/package/linq2mysql).
* `Router` is the `koa-router` class.
* `useAuthenticate` is the implemented permission verification module; you can also implement your own permission verification module.

2. Create an `AmisServer` object, which implements basic permission management functionality.

```javascript
const server = useAmisServer(router, db, JWT_SECRET, tokenName);
// or
const server = new AmisServer(router, db, JWT_SECRET, tokenName);
```

* `router` is an instance of `koa-router`.
* `db` is a `Linq` instance.
* `JWT_SECRET` is the secret key for `JWT`.
* `tokenName` is the cookie name where the `token` is stored after a successful login.

> The access path prefix here must be `/api/amis`, i.e., the `prefix` value passed to the `router` in `useAmisServer` is `/api/amis`.

3. Create a KOA service and add routes.

```javascript
var app = new Koa();
app.use(router.routes());
```

4. Add static resources

```javascript
app.use(Asar(htmlPath, { "root": "/html", index: "index.html", default: "master.html" }));
```

> This depends on the package `koa-asar`.

# Register Custom Modules

In `extendRouter`, the `setPermission` method is extended for the `Router`, with the following prototype:

```javascript
setPermission(text, anonymous);
```

* `text` - Module name
* `anonymous` - Whether the module allows anonymous access, default: false

This method sets the module name and access permissions for the last added route.

```javascript
router.get('test', '/api/texxt', (ctx) => { ctx.body = "OK" }).setPermission('Test');
```

Here, `get` can be replaced with any other valid HTTP method, and the parent-child relationship of the module is separated by `:`.

In order to see the corresponding module in permission management, this route needs to be added to `AmisServer`.

```javascript
server.appendRouter(router);
```