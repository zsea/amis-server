/**
 * 返回Linq的表格实例
 * @callback useTable
 * @returns {Linq}
 */
/**
 * 返回变量值
 * @callback useQuery
 * @param {object} args - 
 * @param {object} args.body -  
 * @param {object} args.query -  
 * @param {object} args.user -  
 * @returns {string|number|string[]|number[]}
 */

async function createObject(ctx, variables) {
    const q = {};
    if (variables) {
        for (const key in variables) {
            const v = await Promise.resolve(variables[key]({ query: ctx.request.query, body: ctx.request.body, user: ctx.user }));
            q[key] = v;
        }
    }
    return q;
}

/**
 * 
 * @param {*} ctx 
 * @param {*} useTable 
 * @param {*} where 
 * @param {*} variables 
 * @returns 
 */
async function createDB(ctx, useTable, where, variables) {
    let db = await Promise.resolve(useTable({ query: ctx.request.query, body: ctx.request.body, user: ctx.user }));
    if (where) {
        const q = await createObject(ctx, variables);
        db = db.where(where, q);
    }
    return db;
}

/**
 * 
 * 返回一个表格查询的中间件
 * @param {useTable} useTable - 回调函数，返回查询表格
 * @param {lamda} where - 查询条件
 * @param {Object.<string, useQuery>} [variables] - lamda变量列表
 * @param {string[]} [fields] - 最终输出的字段
 * @param {boolean} [descByTime=true] - 按创建时间倒序排序，使用created_at字段倒序排序
 * @returns 
 */
function usePager(useTable, where, variables, fields, descByTime) {

    return async function (ctx, next) {
        let db = await createDB(ctx, useTable, where, variables);
        const total = await db.count();

        if (descByTime !== false) {
            db = db.orderByDescending(p => p.created_at)
        }
        const { orderBy, orderDir } = ctx.request.query;
        if (orderBy && orderBy.length) {
            if (descByTime === false) {//未排序过
                if (orderDir === "desc") {
                    db = db.thenByDescending(`p=>p.${orderBy}`);
                }
                else {
                    db = db.thenBy(`p=>p.${orderBy}`);
                }
            }
        }
        if (fields && fields.length) {
            let lamda = `p=>{${fields.map(x => `p.${x}`).join(',')}}`;
            db = db.select(lamda);
        }
        let page = ctx.request.query.page;
        if (isNaN(page)) {
            page = 1;
        }
        else {
            page = parseInt(page);
        }
        if (page < 1) page = 1;
        let size = ctx.request.query.perPage;
        if (isNaN(size)) {
            size = 10;
        }
        else {
            size = parseInt(size);
        }
        if (size < 0) size = 10;
        const items = await db.skip((page - 1) * size).take(size).toArray();
        ctx.body = {
            status: 0,
            data: {
                items: items,
                total: total
            }
        }
    }
}

/**
 * 删除数据
 * @param {useTable} useTable - 回调函数，返回查询表格
 * @param {lamda} where - 查询条件
 * @param {Object.<string, useQuery>} [variables] - lamda变量列表
 * @returns 
 */
function useDeleter(useTable, where, variables) {
    return async function (ctx, next) {
        let db = await createDB(ctx, useTable, where, variables);
        await db.delete();
        ctx.body = {
            status: 0
        }
    }
}

/**
 * 
 * 更新记录
 * @param {useTable} useTable - 回调函数，返回查询表格
 * @param {lamda} where - 查询条件
 * @param {Object.<string, useQuery>} [variables] - lamda变量列表
 * @param {Object.<string, useQuery>} [entity] - 更新的对象内容
 * @param {boolean} [hasTime=true] - 是否更新时间字段updated_at
 * @returns 
 */
function useUpdater(useTable, where, variables, entity, hasTime) {
    return async function (ctx, next) {
        let db = await createDB(ctx, useTable, where, variables);
        const item = await createObject(ctx, entity);
        const updater = hasTime !== false ? Object.assign({ updated_at: Date.now() }, item) : item;
        await db.update(updater);
        ctx.body = {
            status: 0
        }
    }
}

/**
 * 
 * 插入记录
 * @param {useTable} useTable - 回调函数，返回查询表格
 * @param {Object.<string, useQuery>} [entity] - 更新的对象内容
 * @param {boolean} [hasTime=true] - 是否有时间字段updated_at/created_at
 * @param {boolean} [updater=false] - 具有相同记录时时否更新
 * @returns 
 */
function useInsert(useTable, entity, hasTime, updater) {
    return async function (ctx, next) {
        let db = await Promise.resolve(useTable());
        const item = await createObject(ctx, entity);
        let iItem, uItem;
        if (hasTime !== false) {
            //有时间字段
            iItem = Object.assign({ created_at: Date.now(), updated_at: 0 }, item);
            uItem = Object.assign({ updated_at: 0 }, item);
        }
        else {
            iItem = item;
            uItem = item;
        }
        try {
            await db.insert(iItem, updater ? uItem : undefined);
        }
        catch (e) {
            // console.error(e);

            if (e.code === 'ER_DUP_ENTRY') {
                return ctx.body = {
                    status: 500,
                    msg: '存在相同记录。'
                }
            }
            throw e;
        }
        ctx.body = {
            status: 0
        }
    }
}
/**
 * 
 * 插入/更新记录
 * @param {useTable} useTable - 回调函数，返回查询表格
 * @param {Object.<string, useQuery>} [entity] - 更新的对象内容
 * @param {boolean} [hasTime=true] - 是否有时间字段updated_at/created_at
 * @returns 
 */
function useInsertOrUpdate(useTable, entity, hasTime) {
    return useInsert(useTable, entity, hasTime, true);
}
module.exports = {
    usePager,
    useUpdater,
    useDeleter,
    useInsertOrUpdate,
    useInsert
}