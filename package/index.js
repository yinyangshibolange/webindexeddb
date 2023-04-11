import {IndexedDB} from "./IndexedDB.js"

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function listSort(list, sortParams = []) {
    const sort_params = [{
        key: 'addtime',
        type: 'desc'
    }, ...(sortParams || [])]
    let list_temp = list
    sort_params.forEach(item => {
        let type, key
        if (typeof item === 'string') {
            type = 'desc'
            key = item
        } else if (typeof item === 'object') {
            type = typeof item.type === 'string' ? item.type.toLowerCase() : 'desc'
            key = item.key
        }
        if (type === 'desc') {
            list_temp = list_temp.sort((a, b) => b[key] - a[key])
        } else if (type === 'asc') {
            list_temp = list_temp.sort((a, b) => a[key] - b[key])
        }
    })
    return list_temp
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function findStoreMainKey(stores, storeName) {
    const store = stores.find(item => item.storeName === storeName)
    if (store) {
        return store.mainKey || "id"
    }
}

// mock数据持久化类，当前用indexedDb做持久化
class IndexdbStore {
    name = null // 数据库名称
    version = null // 数据库版本号
    stores = null // 数据库表配置
    db = null // IndexedDB 封装对象

    constructor(options) {
        if (!this.db) {
            this.rebuild(options)
        }
    }

    /**
     * 数据库升级重构
     * @param options 传入参数，同构造函数参数，可为空
     */
    rebuild(options) {
        const {name, version, stores} = options || {}
        this.stores = stores || this.stores
        this.name = name || this.name
        this.version = version || this.version
        this.db = new IndexedDB({
            name: name || this.name,
            version: version || this.version,
            db: null,
            stores: stores || this.stores,
        })

    }


    /**
     * 新增数据
     * 会自动添加addtime和addtimeformat字段
     * @param {String} storeName 表名
     * @param {Object} data 数据
     * @returns {Object} {code,data,msg}
     */
    async addItem(storeName, data) {
        let mainKey = findStoreMainKey(this.stores, storeName)
        if (!mainKey) {
            return {
                code: -1,
                msg: "表不存在，请检查您的配置",
            }
        }
        try {
            await this.db.openDB(storeName)
        } catch (err) {
            return {
                code: -1,
                msg: err,
            }
        }
        const now = new Date()
        try {
            const res = await this.db.addData(storeName, {
                [mainKey]: guid(),
                ...data,
                addtime: now.getTime(),
                addtimeformat: now.Format("yyyy-MM-dd hh:mm:ss"),
            })
            this.db.closeDB()
            return {
                code: 0,
                data: res
            }
        } catch (err) {
            this.db.closeDB()
            return {
                code: -1,
                msg: err
            }
        }
    }

    /**
     * 批量新增数据
     * 会自动添加addtime和addtimeformat字段
     * @param {String} storeName 表名
     * @param {Array} list 数据列表
     * @returns {Object} {code,data,msg}
     */
    async addBatch(storeName, list) {
        let mainKey = findStoreMainKey(this.stores, storeName)
        if (!mainKey) {
            return {
                code: -1,
                msg: "表不存在，请检查您的配置",
            }
        }
        if (!Array.isArray(list) || list.length === 0) {
            return {
                code: -1,
                msg: "参数错误，批量添加参数应为一个非空列表"
            }
        }
        try {
            await this.db.openDB(storeName)
        } catch (err) {
            return {
                code: -1,
                msg: err
            }
        }
        const now = new Date()
        let resList = []
        for (let i = 0; i < list.length; i++) {
            const data = list[i]
            try {
                const res = await this.db.addData(storeName, {
                    [mainKey]: guid(),
                    ...data,
                    addtime: now.getTime(),
                    addtimeformat: now.Format("yyyy-MM-dd hh:mm:ss"),
                })
                resList.push({
                    code: 0,
                    origin: data,
                    data: res
                })
            } catch (err) {
                resList.push({
                    code: -1,
                    origin: data,
                    data: err
                })
            }
        }
        this.db.closeDB()
        return {
            code: 0,
            data: resList
        }
    }

    /**
     * 修改数据
     * 会自动添加updatetime和updatetimeformat
     * @param {String} storeName 表名
     * @param {Object} data 数据
     * @returns {Object} {code,data,msg}
     */
    async updateItem(storeName, data) {
        let mainKey = findStoreMainKey(this.stores, storeName)
        if (!mainKey) {
            return {
                code: -1,
                msg: "表不存在，请检查您的配置",
            }
        }
        try {
            await this.db.openDB(storeName)
        } catch (err) {
            return {
                code: -1,
                msg: err
            }
        }
        const now = new Date()
        try {
            const res = await this.db.updateDB(storeName, {
                ...data,
                updatetime: now.getTime(),
                updatetimeformat: now.Format("yyyy-MM-dd hh:mm:ss"),
            })
            this.db.closeDB()

            return {
                code: 0,
                data: res,
            }
        } catch (err) {
            this.db.closeDB()
            return {
                code: -1,
                msg: err
            }
        }

    }

    /**
     * 批量修改数据
     * 会自动添加updatetime和updatetimeformat
     * @param {String} storeName 表名
     * @param {Array} list 数据列表
     * @returns {Object} {code,data,msg}
     */
    async updateBatch(storeName, list) {
        let mainKey = findStoreMainKey(this.stores, storeName)
        if (!mainKey) {
            return {
                code: -1,
                msg: "表不存在，请检查您的配置",
            }
        }
        if (!Array.isArray(list) || list.length === 0) {
            return {
                code: -1,
                msg: "参数错误，批量添加参数应为一个非空列表"
            }
        }
        try {
            await this.db.openDB(storeName)
        } catch (err) {
            return {
                code: -1,
                msg: err
            }
        }
        const now = new Date()
        const resList = []
        for (let i = 0; i < list.length; i++) {
            const data = list[i]
            try {
                const res = await this.db.updateDB(storeName, {
                    ...data,
                    updatetime: now.getTime(),
                    updatetimeformat: now.Format("yyyy-MM-dd hh:mm:ss"),
                })

                resList.push({
                    code: 0,
                    data: res
                })
            } catch (err) {
                resList.push({
                    code: -1,
                    msg: err
                })
            }
        }
        this.db.closeDB()
        return {
            code: 0,
            data: resList
        }
    }

    /**
     * 删除数据
     * @param {String} storeName 表名
     * @param {String} id 数据id
     * @returns  {Object} {code,data,msg}
     */
    async delItem(storeName, id) {
        let mainKey = findStoreMainKey(this.stores, storeName)
        if (!mainKey) {
            return {
                code: -1,
                msg: "表不存在，请检查您的配置",
            }
        }
        try {
            await this.db.openDB(storeName)
        } catch (err) {
            return {
                code: -1,
                msg: err
            }
        }
        try {
            const res = await this.db.deleteDB(storeName, id)
            this.db.closeDB()
            return {
                code: 0,
                data: res
            }
        } catch (err) {
            this.db.closeDB()
            return {
                code: -1,
                msg: err
            }
        }
    }

    /**
     * 批量删除数据
     * @param {String} storeName 表名
     * @param {Array} ids id列表
     * @returns {Object} {code,data,msg}
     */
    async delBatch(storeName, ids) {
        let mainKey = findStoreMainKey(this.stores, storeName)
        if (!mainKey) {
            return {
                code: -1,
                msg: "表不存在，请检查您的配置",
            }
        }
        if (!Array.isArray(ids) || ids.length === 0) {
            return {
                code: -1,
                msg: "参数错误，批量添加参数应为一个非空列表"
            }
        }
        try {
            await this.db.openDB(storeName)
        } catch (err) {
            return {
                code: -1,
                msg: err
            }
        }
        const resList = []
        for (let i = 0; i < ids.length; i++) {
            try {
                const res = await this.db.deleteDB(storeName, ids[i])
                resList.push({
                    code: 0,
                    data: res
                })
            } catch (err) {
                resList.push({
                    code: -1,
                    msg: err
                })
            }
        }
        this.db.closeDB()
        return {
            code: 0,
            data: resList
        }
    }

    /**
     * 查询表中所有数据
     * @param {String} storeName 表名
     * @param {Array} sortParams 排序参数[{key,type}]，默认有一个{key:'addtime',type:'desc'}参数
     * @returns {Object} {code,data,msg}
     */
    async getAll(storeName, sortParams = []) { // 查询所有，不分页
        let mainKey = findStoreMainKey(this.stores, storeName)
        if (!mainKey) {
            return {
                code: -1,
                msg: "表不存在，请检查您的配置",
            }
        }
        try {
            await this.db.openDB(storeName)
        } catch (err) {
            return {
                code: -1,
                msg: err
            }
        }
        try {
            let list = await this.db.cursorGetData(storeName)
            list = listSort(list, sortParams)
            this.db.closeDB()
            return {
                code: 0,
                data: list,
            }
        } catch (err) {
            this.db.closeDB()
            return {
                code: -1,
                msg: err,
            }
        }
    }

    /**
     * 条件查询数据
     * @param {String} storeName 表名
     * @param {Object} params 查询参数
     * @param {Array} sortParams 排序参数[{key,type}]，默认有一个{key:'addtime',type:'desc'}参数
     * @returns {Object} {code,data,msg}
     */
    async queryAll(storeName, params, sortParams = []) { // 条件查询，不分页
        let mainKey = findStoreMainKey(this.stores, storeName)
        if (!mainKey) {
            return {
                code: -1,
                msg: "表不存在，请检查您的配置",
            }
        }
        try {
            await this.db.openDB(storeName)
        } catch (err) {
            console.error(err)
            return
        }
        const keyLen = Object.keys(params || {}).length
        try {
            let list
            if (keyLen > 0) {
                list = await this.db.cursorGetDataByIndex(storeName, params)
            } else {
                list = await this.db.cursorGetData(storeName)
            }
            list = listSort(list, sortParams)
            this.db.closeDB()
            return {
                code: 0,
                data: list,
            }
        } catch (err) {
            this.db.closeDB()
            return {
                code: -1,
                msg: err,
            }
        }
    }

    /**
     * 条件查询分页数据
     * @param {String} storeName 表名
     * @param {Object} params 查询参数
     * @param {Array} sortParams 排序参数[{key,type}]，默认有一个{key:'addtime',type:'desc'}参数
     * @param {Number} page 当前页
     * @param {Number} pagesize 每页的项目数
     * @returns {Object} {code,data,msg}
     */
    async queryPage(storeName, params, sortParams, page = 1, pagesize = 10,) { // 条件查询，分页
        let mainKey = findStoreMainKey(this.stores, storeName)
        if (!mainKey) {
            return {
                code: -1,
                msg: "表不存在，请检查您的配置",
            }
        }
        try {
            await this.db.openDB(storeName)
        } catch (err) {
            return {
                code: -1,
                msg: err
            }
        }
        const keyLen = Object.keys(params || {}).length
        try {
            let list
            if (keyLen > 0) {
                list = await this.db.cursorGetDataByIndex(storeName, params)
            } else {
                list = await this.db.cursorGetData(storeName)
            }
            list = listSort(list, sortParams)
            this.db.closeDB()
            return {
                code: 0,
                data: {
                    total: list.length,
                    list: list.slice((page - 1) * pagesize, page * pagesize)
                }
            }
        } catch (err) {
            this.db.closeDB()
            return {
                code: -1,
                msg: err,
            }
        }

    }


}

// window.IndexdbStore = IndexdbStore

export default IndexdbStore
