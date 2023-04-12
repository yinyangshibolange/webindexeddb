(function () {
  'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  class IndexedDB {
    constructor(dbInfo) {
      _defineProperty(this, "dbInfo", {
        name: "dbname",
        db: null,
        version: 1,
        stores: []
      });
      this.dbInfo = dbInfo;
      this.init();
    }
    init() {
      return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(this.dbInfo.name, this.dbInfo.version); // 打开数据库连接
        request.onsuccess = event => {
          this.dbInfo.db = event.target.result; // 数据库对象
          resolve(this.dbInfo.db);
        };
        request.onerror = event => {
          reject(event);
        };
        request.onupgradeneeded = event => {
          // 数据库创建或升级的时候会触发
          this.dbInfo.db = event.target.result; // 数据库对象
          let objectStore;
          if (Array.isArray(this.dbInfo.stores)) {
            this.dbInfo.stores.forEach(db_store => {
              const {
                storeName,
                indexs,
                mainKey
              } = db_store;
              if (!this.dbInfo.db.objectStoreNames.contains(storeName)) {
                objectStore = this.dbInfo.db.createObjectStore(storeName, {
                  keyPath: mainKey || "id"
                }); // 创建表
              }

              if (Array.isArray(indexs)) {
                indexs.forEach(item => {
                  try {
                    objectStore.createIndex(item.name, item.keyPath, _objectSpread2({
                      unique: false
                    }, item.params)); // 创建索引 可以让你搜索任意字段
                  } catch (err) {
                    console.error(err);
                  }
                });
              }
            });
          }
        };
      });
    }

    /**
     * 打开数据库
     * @param {*} storeName 打开数据库表
     * @param {*} indexs 索引列表
     * @returns
     */
    openDB() {
      return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(this.dbInfo.name, this.dbInfo.version);
        request.onsuccess = event => {
          this.dbInfo.db = event.target.result; // 数据库对象
          resolve(this.dbInfo.db);
        };
        request.onerror = event => {
          reject(event);
        };
      });
    }

    /**
     * 新增数据
     * @param {*} storeName 打开数据库表
     * @param {*} data 数据包含id
     * @returns
     */
    addData(storeName, data) {
      return new Promise((resolve, reject) => {
        let request = this.dbInfo.db.transaction([storeName], 'readwrite') // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
        .objectStore(storeName) // 仓库对象
        .add(data);
        request.onsuccess = event => {
          resolve(event);
        };
        request.onerror = event => {
          throw new Error(event.target.error);
        };
      });
    }

    /**
     * 通过键查找数据
     * @param {*} storeName 打开数据库表
     * @param {*} key 键
     * @returns
     */
    getDataByKey(storeName, key) {
      return new Promise((resolve, reject) => {
        let transaction = this.dbInfo.db.transaction([storeName]); // 事务
        let objectStore = transaction.objectStore(storeName); // 仓库对象
        let request = objectStore.get(key);
        request.onerror = event => {
          reject(event);
        };
        request.onsuccess = event => {
          resolve(request.result);
        };
      });
    }

    /**
     * 遍历所有数据
     * @param {*} storeName 打开数据库表
     * @returns
     */
    cursorGetData(storeName) {
      let list = [];
      let store = this.dbInfo.db.transaction(storeName, 'readwrite') // 事务
      .objectStore(storeName); // 仓库对象
      let request = store.openCursor(); // 指针对象
      return new Promise((resolve, reject) => {
        request.onsuccess = e => {
          let cursor = e.target.result;
          if (cursor) {
            // 必须要检查
            list.push(cursor.value);
            cursor.continue(); // 遍历了存储对象中的所有内容
          } else {
            resolve(list);
          }
        };
        request.onerror = e => {
          reject(e);
        };
      });
    }

    /**
     * 分页查找
     * @param {*} storeName 打开数据库表
     * @param {*} page 当前页
     * @param {*} pageSize 分页数
     * @returns
     */
    cursorPage(storeName, params) {
      let page = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      let pageSize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
      return new Promise((resolve, reject) => {
        let data = [];
        let store = this.dbInfo.db.transaction([storeName], 'readonly').objectStore(storeName);
        let requeset = store.openCursor();
        let count = store.count();
        let index = null;
        requeset.onsuccess = event => {
          let res = event.target.result;
          if (res) {
            if (index === pageSize - 1) {
              data.push(res.value);
              try {
                resolve({
                  list: data,
                  total: count.result
                });
              } catch (err) {
                resolve({
                  list: [],
                  total: 0
                });
              }
              return;
            }
            if (index === null && page !== 1) {
              index = 0;
              res.advance((page - 1) * pageSize);
            } else {
              index++;
              data.push(res.value);
              res.continue();
            }
          } else {
            try {
              resolve({
                list: data,
                total: count.result
              });
            } catch (err) {
              resolve({
                list: [],
                total: 0
              });
            }
          }
        };
        requeset.onerror = () => {
          reject('读取数据失败');
        };
      });
    }

    /**
     * 通过索引查找数据
     * @param {*} storeName 打开数据库表
     * @param {*} indexName 索引名称
     * @param {*} indexValue 索引值
     * @returns
     */
    getDataByIndex(storeName, indexName, indexValue) {
      let store = this.dbInfo.db.transaction(storeName, 'readwrite').objectStore(storeName);
      let request = store.index(indexName).get(indexValue);
      return new Promise((resolve, reject) => {
        request.onerror = e => {
          reject(e);
        };
        request.onsuccess = e => {
          resolve(e.target.result);
        };
      });
    }

    /**
     * 通过索引和游标查找，遍历了存储对象中的所有内容
     * @param {*} storeName 打开数据库表
     * @param {*} indexName 索引名称
     * @param {*} indexValue 索引值
     * @returns
     */
    cursorGetDataByIndex(storeName, params) {
      let list = [];
      let store = this.dbInfo.db.transaction(storeName, 'readwrite').objectStore(storeName); // 仓库对象
      return new Promise((resolve, reject) => {
        const {
          indexs
        } = this.dbInfo.stores.find(item => item.storeName === storeName) || {};
        if (!indexs) {
          resolve([]);
          return;
        }
        let keyPath = "",
          vals = [];
        for (const key in params) {
          keyPath += "," + key;
          vals.push(params[key]);
        }
        keyPath = keyPath.substring(1);
        const {
          name
        } = indexs.find(item => item.keyPath === keyPath) || {};
        if (!name) {
          resolve([]);
          return;
        }
        let request = store.index(name) // 索引对象
        .openCursor(IDBKeyRange.only(vals.length === 1 ? vals[0] : vals)); // 指针对象

        request.onsuccess = e => {
          let cursor = e.target.result;
          if (cursor) {
            list.push(cursor.value);
            cursor.continue(); // 遍历了存储对象中的所有内容
          } else {
            resolve(list);
          }
        };
        request.onerror = ev => {
          reject(ev);
        };
      });
    }

    /**
     * 修改数据
     * @param {*} storeName 打开数据库表
     * @param {*} data 数据
     * @returns
     */
    updateDB(storeName, data) {
      let request = this.dbInfo.db.transaction([storeName], 'readwrite') // 事务对象
      .objectStore(storeName) // 仓库对象
      .put(data);
      return new Promise((resolve, reject) => {
        request.onsuccess = ev => {
          resolve(ev);
        };
        request.onerror = ev => {
          resolve(ev);
        };
      });
    }

    /**
     * 删除数据
     * @param {*} storeName 打开数据库表
     * @param {*} id id
     * @returns
     */
    deleteDB(storeName, id) {
      let request = this.dbInfo.db.transaction([storeName], 'readwrite').objectStore(storeName).delete(id);
      return new Promise((resolve, reject) => {
        request.onsuccess = ev => {
          resolve(ev);
        };
        request.onerror = ev => {
          resolve(ev);
        };
      });
    }

    /**
     * 删除数据库
     * @param {String} dbName 数据库表名
     * @returns
     */
    deleteDBAll(dbName) {
      let deleteRequest = window.indexedDB.deleteDatabase(dbName);
      return new Promise((resolve, reject) => {
        deleteRequest.onerror = err => {
          console.error(err);
        };
        deleteRequest.onsuccess = event => {
          console.info(event);
        };
      });
    }

    /**
     * 关闭数据库
     */
    closeDB() {
      this.dbInfo.db.close();
      console.info('数据库已关闭');
    }
  }

  function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }
  function listSort(list) {
    let sortParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    const sort_params = [{
      key: 'addtime',
      type: 'desc'
    }, ...(sortParams || [])];
    let list_temp = list;
    sort_params.forEach(item => {
      let type, key;
      if (typeof item === 'string') {
        type = 'desc';
        key = item;
      } else if (typeof item === 'object') {
        type = typeof item.type === 'string' ? item.type.toLowerCase() : 'desc';
        key = item.key;
      }
      if (type === 'desc') {
        list_temp = list_temp.sort((a, b) => b[key] - a[key]);
      } else if (type === 'asc') {
        list_temp = list_temp.sort((a, b) => a[key] - b[key]);
      }
    });
    return list_temp;
  }
  Date.prototype.Format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1,
      //月份
      "d+": this.getDate(),
      //日
      "h+": this.getHours(),
      //小时
      "m+": this.getMinutes(),
      //分
      "s+": this.getSeconds(),
      //秒
      "q+": Math.floor((this.getMonth() + 3) / 3),
      //季度
      "S": this.getMilliseconds() //毫秒
    };

    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return fmt;
  };
  function findStoreMainKey(stores, storeName) {
    const store = stores.find(item => item.storeName === storeName);
    if (store) {
      return store.mainKey || "id";
    }
  }

  // mock数据持久化类，当前用indexedDb做持久化
  class IndexdbStore {
    // IndexedDB 封装对象

    constructor(options) {
      _defineProperty(this, "name", null);
      // 数据库名称
      _defineProperty(this, "version", null);
      // 数据库版本号
      _defineProperty(this, "stores", null);
      // 数据库表配置
      _defineProperty(this, "db", null);
      let name = 'indexeddbname',
        version = 1,
        stores = [];
      if (options) {
        name = options.name || name;
        version = options.version || version;
        stores = options.stores || stores;
      }
      if (!this.db) {
        this.rebuild({
          name,
          version,
          stores
        });
      }
    }

    /**
     * 数据库升级重构
     * @param options 传入参数，同构造函数参数，可为空
     */
    rebuild(options) {
      const {
        name,
        version,
        stores
      } = options || {};
      this.stores = stores || this.stores;
      this.name = name || this.name;
      this.version = version || this.version;
      this.db = new IndexedDB({
        name: name || this.name,
        version: version || this.version,
        db: null,
        stores: stores || this.stores
      });
    }

    /**
     * 新增数据
     * 会自动添加addtime和addtimeformat字段
     * 会自动添加[mainKey](主键)字段
     * @param {String} storeName 表名
     * @param {Object} data 数据
     * @returns {Object} {code,data,msg}
     */
    async addItem(storeName, data) {
      let mainKey = findStoreMainKey(this.stores, storeName);
      if (!mainKey) {
        return {
          code: -1,
          msg: "表不存在，请检查您的配置"
        };
      }
      try {
        await this.db.openDB(storeName);
      } catch (err) {
        return {
          code: -1,
          msg: err
        };
      }
      const now = new Date();
      try {
        const res = await this.db.addData(storeName, _objectSpread2(_objectSpread2({
          [mainKey]: guid()
        }, data), {}, {
          addtime: now.getTime(),
          addtimeformat: now.Format("yyyy-MM-dd hh:mm:ss")
        }));
        this.db.closeDB();
        return {
          code: 0,
          data: res
        };
      } catch (err) {
        this.db.closeDB();
        return {
          code: -1,
          msg: err
        };
      }
    }

    /**
     * 批量新增数据
     * 会自动添加addtime和addtimeformat字段
     * 会自动添加[mainKey](主键)字段
     * @param {String} storeName 表名
     * @param {Array} list 数据列表
     * @returns {Object} {code,data,msg}
     */
    async addBatch(storeName, list) {
      let mainKey = findStoreMainKey(this.stores, storeName);
      if (!mainKey) {
        return {
          code: -1,
          msg: "表不存在，请检查您的配置"
        };
      }
      if (!Array.isArray(list) || list.length === 0) {
        return {
          code: -1,
          msg: "参数错误，批量添加参数应为一个非空列表"
        };
      }
      try {
        await this.db.openDB(storeName);
      } catch (err) {
        return {
          code: -1,
          msg: err
        };
      }
      const now = new Date();
      let resList = [];
      for (let i = 0; i < list.length; i++) {
        const data = list[i];
        try {
          const res = await this.db.addData(storeName, _objectSpread2(_objectSpread2({
            [mainKey]: guid()
          }, data), {}, {
            addtime: now.getTime(),
            addtimeformat: now.Format("yyyy-MM-dd hh:mm:ss")
          }));
          resList.push({
            code: 0,
            origin: data,
            data: res
          });
        } catch (err) {
          resList.push({
            code: -1,
            origin: data,
            data: err
          });
        }
      }
      this.db.closeDB();
      return {
        code: 0,
        data: resList
      };
    }

    /**
     * 修改数据
     * 会自动添加updatetime和updatetimeformat
     * @param {String} storeName 表名
     * @param {Object} data 数据
     * @returns {Object} {code,data,msg}
     */
    async updateItem(storeName, data) {
      let mainKey = findStoreMainKey(this.stores, storeName);
      if (!mainKey) {
        return {
          code: -1,
          msg: "表不存在，请检查您的配置"
        };
      }
      try {
        await this.db.openDB(storeName);
      } catch (err) {
        return {
          code: -1,
          msg: err
        };
      }
      const now = new Date();
      try {
        const res = await this.db.updateDB(storeName, _objectSpread2(_objectSpread2({}, data), {}, {
          updatetime: now.getTime(),
          updatetimeformat: now.Format("yyyy-MM-dd hh:mm:ss")
        }));
        this.db.closeDB();
        return {
          code: 0,
          data: res
        };
      } catch (err) {
        this.db.closeDB();
        return {
          code: -1,
          msg: err
        };
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
      let mainKey = findStoreMainKey(this.stores, storeName);
      if (!mainKey) {
        return {
          code: -1,
          msg: "表不存在，请检查您的配置"
        };
      }
      if (!Array.isArray(list) || list.length === 0) {
        return {
          code: -1,
          msg: "参数错误，批量添加参数应为一个非空列表"
        };
      }
      try {
        await this.db.openDB(storeName);
      } catch (err) {
        return {
          code: -1,
          msg: err
        };
      }
      const now = new Date();
      const resList = [];
      for (let i = 0; i < list.length; i++) {
        const data = list[i];
        try {
          const res = await this.db.updateDB(storeName, _objectSpread2(_objectSpread2({}, data), {}, {
            updatetime: now.getTime(),
            updatetimeformat: now.Format("yyyy-MM-dd hh:mm:ss")
          }));
          resList.push({
            code: 0,
            data: res
          });
        } catch (err) {
          resList.push({
            code: -1,
            msg: err
          });
        }
      }
      this.db.closeDB();
      return {
        code: 0,
        data: resList
      };
    }

    /**
     * 删除数据
     * @param {String} storeName 表名
     * @param {String} id 数据id
     * @returns  {Object} {code,data,msg}
     */
    async delItem(storeName, id) {
      let mainKey = findStoreMainKey(this.stores, storeName);
      if (!mainKey) {
        return {
          code: -1,
          msg: "表不存在，请检查您的配置"
        };
      }
      try {
        await this.db.openDB(storeName);
      } catch (err) {
        return {
          code: -1,
          msg: err
        };
      }
      try {
        const res = await this.db.deleteDB(storeName, id);
        this.db.closeDB();
        return {
          code: 0,
          data: res
        };
      } catch (err) {
        this.db.closeDB();
        return {
          code: -1,
          msg: err
        };
      }
    }

    /**
     * 批量删除数据
     * @param {String} storeName 表名
     * @param {Array} ids id列表
     * @returns {Object} {code,data,msg}
     */
    async delBatch(storeName, ids) {
      let mainKey = findStoreMainKey(this.stores, storeName);
      if (!mainKey) {
        return {
          code: -1,
          msg: "表不存在，请检查您的配置"
        };
      }
      if (!Array.isArray(ids) || ids.length === 0) {
        return {
          code: -1,
          msg: "参数错误，批量添加参数应为一个非空列表"
        };
      }
      try {
        await this.db.openDB(storeName);
      } catch (err) {
        return {
          code: -1,
          msg: err
        };
      }
      const resList = [];
      for (let i = 0; i < ids.length; i++) {
        try {
          const res = await this.db.deleteDB(storeName, ids[i]);
          resList.push({
            code: 0,
            data: res
          });
        } catch (err) {
          resList.push({
            code: -1,
            msg: err
          });
        }
      }
      this.db.closeDB();
      return {
        code: 0,
        data: resList
      };
    }

    /**
     * 查询表中所有数据
     * @param {String} storeName 表名
     * @param {Array} sortParams 排序参数[{key,type}]，默认有一个{key:'addtime',type:'desc'}参数
     * @returns {Object} {code,data,msg}
     */
    async getAll(storeName) {
      let sortParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      // 查询所有，不分页
      let mainKey = findStoreMainKey(this.stores, storeName);
      if (!mainKey) {
        return {
          code: -1,
          msg: "表不存在，请检查您的配置"
        };
      }
      try {
        await this.db.openDB(storeName);
      } catch (err) {
        return {
          code: -1,
          msg: err
        };
      }
      try {
        let list = await this.db.cursorGetData(storeName);
        list = listSort(list, sortParams);
        this.db.closeDB();
        return {
          code: 0,
          data: list
        };
      } catch (err) {
        this.db.closeDB();
        return {
          code: -1,
          msg: err
        };
      }
    }

    /**
     * 条件查询数据
     * @param {String} storeName 表名
     * @param {Object} params 查询参数
     * @param {Array} sortParams 排序参数[{key,type}]，默认有一个{key:'addtime',type:'desc'}参数
     * @returns {Object} {code,data,msg}
     */
    async queryAll(storeName, params) {
      let sortParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      // 条件查询，不分页
      let mainKey = findStoreMainKey(this.stores, storeName);
      if (!mainKey) {
        return {
          code: -1,
          msg: "表不存在，请检查您的配置"
        };
      }
      try {
        await this.db.openDB(storeName);
      } catch (err) {
        console.error(err);
        return;
      }
      const keyLen = Object.keys(params || {}).length;
      try {
        let list;
        if (keyLen > 0) {
          list = await this.db.cursorGetDataByIndex(storeName, params);
        } else {
          list = await this.db.cursorGetData(storeName);
        }
        list = listSort(list, sortParams);
        this.db.closeDB();
        return {
          code: 0,
          data: list
        };
      } catch (err) {
        this.db.closeDB();
        return {
          code: -1,
          msg: err
        };
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
    async queryPage(storeName, params, sortParams) {
      let page = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      let pagesize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;
      // 条件查询，分页
      let mainKey = findStoreMainKey(this.stores, storeName);
      if (!mainKey) {
        return {
          code: -1,
          msg: "表不存在，请检查您的配置"
        };
      }
      try {
        await this.db.openDB(storeName);
      } catch (err) {
        return {
          code: -1,
          msg: err
        };
      }
      const keyLen = Object.keys(params || {}).length;
      try {
        let list;
        if (keyLen > 0) {
          list = await this.db.cursorGetDataByIndex(storeName, params);
        } else {
          list = await this.db.cursorGetData(storeName);
        }
        list = listSort(list, sortParams);
        this.db.closeDB();
        return {
          code: 0,
          data: {
            total: list.length,
            list: list.slice((page - 1) * pagesize, page * pagesize)
          }
        };
      } catch (err) {
        this.db.closeDB();
        return {
          code: -1,
          msg: err
        };
      }
    }
  }

  return IndexdbStore;

})();
