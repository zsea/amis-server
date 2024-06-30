const path = require("path")
    , fs = require("fs").promises
    ;
function useStatic(dir, options) {
    const root = dir;
    options = Object.assign({}, options);
    options.root = options.root || "/"
    options.methods = options.methods || ["GET"];
    if (!options.root.endsWith("/")) options.root += "/"
    if (!options.methods.length) options.methods.push('GET');
    return async function (ctx, next) {
        let path_name = ctx.path;
        if (path_name + "/" === options.root) path_name += "/";
        if (path_name.startsWith(options.root) && options.methods.includes(ctx.request.method)) {
            let filename = path_name.substring(options.root.length);
            if (typeof options.rewrite === "function") {
                filename = (await Promise.resolve(filename)) || filename;
            }
            else if (typeof options.rewrite === "object") {
                filename = options.rewrite[filename] || filename;
            }
            else if (typeof options.rewrite === "string") {
                filename = options.rewrite;
            }
            let fileinfo = undefined;
            try {
                fileinfo = await fs.stat(path.join(root, filename))
                if (!fileinfo.isFile()) {
                    fileinfo = undefined;
                }
            }
            catch (e) {

            }
            if (!fileinfo && options.index) {
                if (filename !== "" && !filename.endsWith("/")) {
                    filename = filename + "/" + options.index;
                }
                else {
                    filename = filename + options.index;
                }
                try {
                    fileinfo = await fs.stat(path.join(root, filename));
                    if (!fileinfo.isFile()) {
                        fileinfo = undefined;
                    }
                }
                catch (e) {
                    
                }
            }
            if (!fileinfo && options.default) {
                try {
                    filename = options.default;
                    fileinfo = await fs.stat(path.join(root, filename))
                    if (!fileinfo.isFile()) {
                        fileinfo = undefined;
                    }
                }
                catch (e) {

                }
            }
            if (!fileinfo) {
                ctx.body = "Not Found";
                ctx.status = 404;
                return;
            }
            const content = await fs.readFile(path.join(root, filename));
            ctx.body = content;
            const ext = path.extname(filename);
            ctx.type = ext;
            return
        }
        await next();
    }
}

module.exports = useStatic;