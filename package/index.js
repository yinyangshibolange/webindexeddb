import {IndexedDB} from "./IndexedDB.js"

function listSort (list, sortParams = []) {
    const sort_params = [{
        key: 'addtime',
        type: 'desc'
    }, ...sortParams]
    // 默认按addtime排序
    return list.sort((a, b) => {
        let flag = false
        for (let i = 0; i < sort_params.length; i++) {
            const item = sort_params[i]
            let type, key
            if (typeof item === 'string') {
                type = 'desc'
                key = item
            } else if (typeof item === 'object') {
                type = typeof item.type === 'string' ? item.type.toLowerCase() : 'desc'
                key = item.key
            }
            if (type === 'desc' && b[key] > a[key]) {
                flag = true
                break
            } else if (type === 'asc' && a[key] > b[key]) {
                flag = true
                break
            }
        }
        return flag
    })
}

// mock数据持久化类，当前用indexedDb做持久化
export class IndexdbStore {
    db = null
    constructor(options = {
        name: "myindexdb", // 你的indexdb数据库名称
        version: 1, // 如果修改了options里的stores参数，那么必须修改version版本号，不然stores的修改不会生效
        stores: [
            //     { // 类似数据库表
            //     storeName: "imageList",
            //     indexs: [{
            //         name: "parentid", // 索引名称
            //         keyPath: "parentid", // 索引字段
            //         params: {
            //             unique: false,
            //         }
            //     }]
            // }
        ]
    }) {
        if (!this.db) {
            const { name, version, stores } = options
            this.db = new IndexedDB({
                name, version, db: null, stores
            })
        }
    }


    /**
     * 新增数据
     * 会自动添加addtime和addtimeformat字段
     * @param {String} storeName 表名
     * @param {Object} data 数据
     * @returns {Object} {code,data,msg}
     */
    async addItem (storeName, data) {
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
    async addBatch (storeName, list) {
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
    async updateItem (storeName, data) {
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
    async updateBatch (storeName, list) {
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
    async delItem (storeName, id) {
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
    async delBatch (storeName, ids) {
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
    async getAll (storeName, sortParams = []) { // 查询所有，不分页
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
    async queryAll (storeName, params, sortParams = []) { // 条件查询，不分页
        try {
            await this.db.openDB(storeName)
        } catch (err) {
            console.error(err)
            return
        }
        try {
            let list = await this.db.cursorGetDataByIndex(storeName, params)
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
    async queryPage (storeName, params, sortParams, page = 1, pagesize = 10,) { // 条件查询，分页
        try {
            await this.db.openDB(storeName)
        } catch (err) {
            return {
                code: -1,
                msg: err
            }
        }
        try {
            let list = await this.db.cursorGetDataByIndex(storeName, params)
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