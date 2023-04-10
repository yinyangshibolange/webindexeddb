

export class IndexedDB {
 dbInfo = {
  name: "dbname",
  db: null,
  version: 1,
  stores: [
  ]
 }

 constructor(dbInfo) {
  this.dbInfo = dbInfo
  this.init()
 }

 init () {
  return new Promise((resolve, reject) => {
   const request = window.indexedDB.open(this.dbInfo.name, this.dbInfo.version) // 打开数据库连接
   request.onsuccess = (event) => {
    this.dbInfo.db = event.target.result // 数据库对象
    resolve(this.dbInfo.db)
   }

   request.onerror = (event) => {
    reject(event)
   }

   request.onupgradeneeded = (event) => {
    // 数据库创建或升级的时候会触发
    this.dbInfo.db = event.target.result // 数据库对象
    let objectStore
    if (Array.isArray(this.dbInfo.stores)) {
     this.dbInfo.stores.forEach(db_store => {
      const { storeName, indexs } = db_store
      if (!this.dbInfo.db.objectStoreNames.contains(storeName)) {
       objectStore = this.dbInfo.db.createObjectStore(storeName, { keyPath: 'id' }) // 创建表
      }

      if (Array.isArray(indexs)) {
       indexs.forEach(item => {
        try {
         objectStore.createIndex(item.name, item.keyPath, { unique: false, ...item.params }) // 创建索引 可以让你搜索任意字段
        } catch (err) {
         console.error(err)
        }
       })
      }

     })
    }

   }
  })
 }


 /**
  * 打开数据库
  * @param {*} storeName 打开数据库表
  * @param {*} indexs 索引列表
  * @returns 
  */
 openDB () {
  return new Promise((resolve, reject) => {
   const request = window.indexedDB.open(this.dbInfo.name, this.dbInfo.version)
   request.onsuccess = (event) => {
    this.dbInfo.db = event.target.result // 数据库对象
    resolve(this.dbInfo.db)
   }

   request.onerror = (event) => {
    reject(event)
   }

  })
 }

 /**
  * 新增数据
  * @param {*} storeName 打开数据库表
  * @param {*} data 数据包含id
  * @returns 
  */
 addData (storeName, data) {
  return new Promise((resolve, reject) => {
   let request = this.dbInfo.db.transaction([storeName], 'readwrite') // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
    .objectStore(storeName) // 仓库对象
    .add(data)

   request.onsuccess = (event) => {
    resolve(event)
   }

   request.onerror = (event) => {
    throw new Error(event.target.error)
   }
  })
 }

 /**
  * 通过键查找数据
  * @param {*} storeName 打开数据库表
  * @param {*} key 键
  * @returns 
  */
 getDataByKey (storeName, key) {
  return new Promise((resolve, reject) => {
   let transaction = this.dbInfo.db.transaction([storeName]) // 事务
   let objectStore = transaction.objectStore(storeName) // 仓库对象
   let request = objectStore.get(key)

   request.onerror = (event) => {
    reject(event)
   }

   request.onsuccess = (event) => {
    resolve(request.result)
   }
  })
 }

 /**
  * 遍历所有数据
  * @param {*} storeName 打开数据库表
  * @returns 
  */
 cursorGetData (storeName) {
  let list = []
  let store = this.dbInfo.db.transaction(storeName, 'readwrite') // 事务
   .objectStore(storeName) // 仓库对象
  let request = store.openCursor() // 指针对象
  return new Promise((resolve, reject) => {
   request.onsuccess = (e) => {
    let cursor = e.target.result
    if (cursor) {
     // 必须要检查
     list.push(cursor.value)
     cursor.continue() // 遍历了存储对象中的所有内容
    } else {
     resolve(list)
    }
   }
   request.onerror = (e) => {
    reject(e)
   }
  })
 }

 /**
  * 分页查找
  * @param {*} storeName 打开数据库表
  * @param {*} page 当前页
  * @param {*} pageSize 分页数
  * @returns 
  */
 cursorPage (storeName, params, page = 1, pageSize = 10) {
  return new Promise((resolve, reject) => {
   let data = []
   let store = this.dbInfo.db.transaction([storeName], 'readonly').objectStore(storeName)
   let requeset = store.openCursor()
   let count = store.count()
   let index = null
   requeset.onsuccess = (event) => {
    let res = event.target.result;
    if (res) {
     if (index === pageSize - 1) {
      data.push(res.value);
      try {
       resolve({
        list: data,
        total: count.result
       })
      } catch (err) {
       resolve({
        list: [],
        total: 0
       })
      }

      return
     }
     if (index === null && page !== 1) {
      index = 0
      res.advance((page - 1) * pageSize)
     } else {
      index++
      data.push(res.value);
      res.continue();
     }
    } else {
     try {
      resolve({
       list: data,
       total: count.result
      })
     } catch (err) {
      resolve({
       list: [],
       total: 0
      })
     }
    }
   }
   requeset.onerror = () => {
    reject('读取数据失败')
   }
  })
 }

 /**
  * 通过索引查找数据
  * @param {*} storeName 打开数据库表
  * @param {*} indexName 索引名称
  * @param {*} indexValue 索引值
  * @returns 
  */
 getDataByIndex (storeName, indexName, indexValue) {
  let store = this.dbInfo.db.transaction(storeName, 'readwrite').objectStore(storeName)
  let request = store.index(indexName).get(indexValue)
  return new Promise((resolve, reject) => {
   request.onerror = (e) => {
    reject(e)
   }
   request.onsuccess = (e) => {
    resolve(e.target.result)
   }
  })
 }

 /**
  * 通过索引和游标查找，遍历了存储对象中的所有内容
  * @param {*} storeName 打开数据库表
  * @param {*} indexName 索引名称
  * @param {*} indexValue 索引值
  * @returns 
  */
 cursorGetDataByIndex (storeName, params, ) {
  let list = []
  let store = this.dbInfo.db.transaction(storeName, 'readwrite').objectStore(storeName) // 仓库对象
  return new Promise((resolve, reject) => {
   const {indexs} = this.dbInfo.stores.find(item => item.storeName === storeName) || {}
   if(!indexs) {
    resolve([])
    return
   }
   let keyPath = "", vals = []
   for(const key in params) {
    keyPath += "," + key
    vals.push(params[key])
   }
   keyPath = keyPath.substring(1)
 
   const {name} = indexs.find(item => item.keyPath === keyPath) || {}
   if(!name) {
    resolve([])
    return
   }

   let total

   let request = store.index(name) // 索引对象
    .openCursor(IDBKeyRange.only(vals.length === 1 ? vals[0] :vals)) // 指针对象

   request.onsuccess = (e) => {
    let cursor = e.target.result
    if (cursor) {
     list.push(cursor.value)
     cursor.continue() // 遍历了存储对象中的所有内容
    } else {
     resolve(list)
    }
   }
   request.onerror = (ev) => {
    reject(ev)
   }
  })
 }

 /**
  * 修改数据
  * @param {*} storeName 打开数据库表
  * @param {*} data 数据
  * @returns 
  */
 updateDB (storeName, data) {
  let request = this.dbInfo.db.transaction([storeName], 'readwrite') // 事务对象
   .objectStore(storeName) // 仓库对象
   .put(data)

  return new Promise((resolve, reject) => {
   request.onsuccess = (ev) => {
    resolve(ev)
   }

   request.onerror = (ev) => {
    resolve(ev)
   }
  })
 }

 /**
  * 删除数据
  * @param {*} storeName 打开数据库表
  * @param {*} id id
  * @returns 
  */
 deleteDB (storeName, id) {
  let request = this.dbInfo.db.transaction([storeName], 'readwrite').objectStore(storeName).delete(id)

  return new Promise((resolve, reject) => {
   request.onsuccess = (ev) => {
    resolve(ev)
   }

   request.onerror = (ev) => {
    resolve(ev)
   }
  })
 }

 /**
  * 删除数据库
  * @param {String} dbName 数据库表名
  * @returns 
  */
 deleteDBAll (dbName) {
  let deleteRequest = window.indexedDB.deleteDatabase(dbName)
  return new Promise((resolve, reject) => {
   deleteRequest.onerror = (err) => {
    console.error(err)
   }
   deleteRequest.onsuccess = (event) => {
    console.info(event)
   }
  })
 }

 /**
  * 关闭数据库
  */
 closeDB () {
  this.dbInfo.db.close()
  console.info('数据库已关闭')
 }


}

