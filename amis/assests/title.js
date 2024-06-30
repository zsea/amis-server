(function () {
    var descriptor = Object.getOwnPropertyDescriptor(Document.prototype, "title");
    var old = descriptor["set"];
    descriptor["set"] = function (title) {
        title = title + ' - ' + __appSchema__.brandName;
        old.apply(this, [title]);
    }
    Object.defineProperty(Document.prototype, "title", descriptor);
})();