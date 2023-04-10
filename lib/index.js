"use strict";

require("core-js/modules/es.symbol.description.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexdbStore = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.array.sort.js");
require("core-js/modules/es.promise.js");
var _IndexedDB = require("./IndexedDB");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function listSort(list) {
  let sortParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  const sort_params = [{
    key: 'addtime',
    type: 'desc'
  }, ...sortParams];
  // 默认按addtime排序
  return list.sort((a, b) => {
    let flag = false;
    for (let i = 0; i < sort_params.length; i++) {
      const item = sort_params[i];
      let type, key;
      if (typeof item === 'string') {
        type = 'desc';
        key = item;
      } else if (typeof item === 'object') {
        type = typeof item.type === 'string' ? item.type.toLowerCase() : 'desc';
        key = item.key;
      }
      if (type === 'desc' && b[key] > a[key]) {
        flag = true;
        break;
      } else if (type === 'asc' && a[key] > b[key]) {
        flag = true;
        break;
      }
    }
    return flag;
  });
}

// mock数据持久化类，当前用indexedDb做持久化
class IndexdbStore {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      name: "myindexdb",
      // 你的indexdb数据库名称
      version: 1,
      // 如果修改了options里的stores参数，那么必须修改version版本号，不然stores的修改不会生效
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
    };
    _defineProperty(this, "db", null);
    if (!this.db) {
      const {
        name,
        version,
        stores
      } = options;
      this.db = new _IndexedDB.IndexedDB({
        name,
        version,
        db: null,
        stores
      });
    }
  }

  /**
   * 新增数据
   * 会自动添加addtime和addtimeformat字段
   * @param {String} storeName 表名
   * @param {Object} data 数据
   * @returns {Object} {code,data,msg}
   */
  async addItem(storeName, data) {
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
      const res = await this.db.addData(storeName, _objectSpread(_objectSpread({}, data), {}, {
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
   * @param {String} storeName 表名
   * @param {Array} list 数据列表
   * @returns {Object} {code,data,msg}
   */
  async addBatch(storeName, list) {
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
        const res = await this.db.addData(storeName, _objectSpread(_objectSpread({}, data), {}, {
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
      const res = await this.db.updateDB(storeName, _objectSpread(_objectSpread({}, data), {}, {
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
        const res = await this.db.updateDB(storeName, _objectSpread(_objectSpread({}, data), {}, {
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
    try {
      await this.db.openDB(storeName);
    } catch (err) {
      console.error(err);
      return;
    }
    try {
      let list = await this.db.cursorGetDataByIndex(storeName, params);
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
    try {
      await this.db.openDB(storeName);
    } catch (err) {
      return {
        code: -1,
        msg: err
      };
    }
    try {
      let list = await this.db.cursorGetDataByIndex(storeName, params);
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
exports.IndexdbStore = IndexdbStore;