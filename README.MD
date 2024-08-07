[中文](https://github.com/zsea/amis-server/blob/master/README.ZH.CN.MD)

A Simple Backend Management System Implemented with Baidu AMIS

# Features
- Login
- Account Management
- Role Management
- Password Change
- Page Design
- API Management

# Installation

```shell
npm install --save @zsea/amis-server  --only=production
```

# Usage

```javascript
const { htmlPath, extendRouter, AmisServer, useAmisServer, useAuthenticate } = require("./amis-server")
```

> The package does not include `Koa-Router`; you need to manually introduce it in your project.

1. Add permission setting methods to the `Router` object to facilitate the direct setting of permissions for modules during self-development.

```javascript
extendRouter(Router, useAuthenticate(db));
```

* `db` is a `Linq` instance based on [linq2mysql](https://www.npmjs.com/package/linq2mysql).
* `Router` is the `koa-router` class.
* `useAuthenticate` is the implemented permission verification module; you can also implement your own permission verification module.
* `useUser` is A method for transforming the token content in the cookie into a user object. You can also implement your own conversion function with the function signature: `parseUser(ctx)`.
    * SECRET - The secret key for JWT.
    * tokenName - The name of the cookie that stores the token. Default value: `amis_token`.

2. Create an `AmisServer` object, which implements basic permission management functionality.

```javascript
const server = useAmisServer(router, db, JWT_SECRET, tokenName,watcher);
// or
const server = new AmisServer(router, db, JWT_SECRET, tokenName,watcher);
```

* `router` is an instance of `koa-router`.
* `db` is a `Linq` instance.
* `JWT_SECRET` is the secret key for `JWT`.
* `tokenName` is the cookie name where the `token` is stored after a successful login.
* `watcher` is an event monitoring mechanism, which is currently mainly used for triggering the server to reload API data when there are changes to the API.

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

# Using Encapsulated Database Operation Methods

The library encapsulates common database operation methods.

* usePager - Query data from the database with pagination
* useUpdater - Update data in the database
* useDeleter - Delete records from the database
* useInsertOrUpdate - Insert a record into the database, or update if it exists
* useInsert - Insert a record into the database

## Parameter Description

* useTable - A callback function that returns a `Linq` object.
* useQuery - Generates an operational `object` value based on the configuration.

### Example

**useTable**

```javascript
useTable(() => db.table("users"));
```

**useQuery**
```javascript
{
    id: ({ query, body, user }) => query.id
}
```

In the above object, the value of `id` will be generated at runtime. `query` and `body` are the objects passed in via `GET` and `POST`, respectively. `user` is the current logged-in object.

> The term `POST` mentioned above actually refers to: methods that can pass a body, such as POST/PATCH, etc.

# API Management
The system provides simple API management capabilities, capable of performing ```CRUD``` operations on the database.

## Example

```js
const cloud = new Cloud();
await cloud.use({db, dbs}, authorize, parseUser, watcher);
```

# Miscellaneous

The `amis.sql` file contains the MySQL table creation statements.