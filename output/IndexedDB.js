"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ownKeys(n,e){var t,r=Object.keys(n);return Object.getOwnPropertySymbols&&(t=Object.getOwnPropertySymbols(n),e&&(t=t.filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})),r.push.apply(r,t)),r}function _objectSpread(n){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(t),!0).forEach(function(e){_defineProperty(n,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach(function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))})}return n}function _defineProperty(e,n,t){return(n=_toPropertyKey(n))in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,_toPropertyKey(r.key),r)}}function _createClass(e,n,t){return n&&_defineProperties(e.prototype,n),t&&_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function _toPropertyKey(e){e=_toPrimitive(e,"string");return"symbol"===_typeof(e)?e:String(e)}function _toPrimitive(e,n){if("object"!==_typeof(e)||null===e)return e;var t=e[Symbol.toPrimitive];if(void 0===t)return("string"===n?String:Number)(e);t=t.call(e,n||"default");if("object"!==_typeof(t))return t;throw new TypeError("@@toPrimitive must return a primitive value.")}Object.defineProperty(exports,"__esModule",{value:!0}),exports.IndexedDB=void 0;var IndexedDB=function(){function n(e){_classCallCheck(this,n),this.dbInfo={name:"dbname",db:null,version:1,stores:[]},this.dbInfo=e,this.init()}return _createClass(n,[{key:"init",value:function(){var r=this;return new Promise(function(n,t){var e=window.indexedDB.open(r.dbInfo.name,r.dbInfo.version);e.onsuccess=function(e){r.dbInfo.db=e.target.result,n(r.dbInfo.db)},e.onerror=function(e){t(e)},e.onupgradeneeded=function(e){var t;r.dbInfo.db=e.target.result,Array.isArray(r.dbInfo.stores)&&r.dbInfo.stores.forEach(function(e){var n=e.storeName,e=e.indexs;r.dbInfo.db.objectStoreNames.contains(n)||(t=r.dbInfo.db.createObjectStore(n,{keyPath:"id"})),Array.isArray(e)&&e.forEach(function(e){try{t.createIndex(e.name,e.keyPath,_objectSpread({unique:!1},e.params))}catch(e){console.error(e)}})})}})}},{key:"openDB",value:function(){var r=this;return new Promise(function(n,t){var e=window.indexedDB.open(r.dbInfo.name,r.dbInfo.version);e.onsuccess=function(e){r.dbInfo.db=e.target.result,n(r.dbInfo.db)},e.onerror=function(e){t(e)}})}},{key:"addData",value:function(r,o){var i=this;return new Promise(function(n,e){var t=i.dbInfo.db.transaction([r],"readwrite").objectStore(r).add(o);t.onsuccess=function(e){n(e)},t.onerror=function(e){throw new Error(e.target.error)}})}},{key:"getDataByKey",value:function(e,o){var i=this;return new Promise(function(n,t){var r=i.dbInfo.db.transaction([e]).objectStore(e).get(o);r.onerror=function(e){t(e)},r.onsuccess=function(e){n(r.result)}})}},{key:"cursorGetData",value:function(e){var r=[],o=this.dbInfo.db.transaction(e,"readwrite").objectStore(e).openCursor();return new Promise(function(n,t){o.onsuccess=function(e){e=e.target.result;e?(r.push(e.value),e.continue()):n(r)},o.onerror=function(e){t(e)}})}},{key:"cursorPage",value:function(c,e){var s=this,a=2<arguments.length&&void 0!==arguments[2]?arguments[2]:1,f=3<arguments.length&&void 0!==arguments[3]?arguments[3]:10;return new Promise(function(n,e){var t=[],r=s.dbInfo.db.transaction([c],"readonly").objectStore(c),o=r.openCursor(),i=r.count(),u=null;o.onsuccess=function(e){e=e.target.result;if(e)if(u===f-1){t.push(e.value);try{n({list:t,total:i.result})}catch(e){n({list:[],total:0})}}else null===u&&1!==a?(u=0,e.advance((a-1)*f)):(u++,t.push(e.value),e.continue());else try{n({list:t,total:i.result})}catch(e){n({list:[],total:0})}},o.onerror=function(){e("读取数据失败")}})}},{key:"getDataByIndex",value:function(e,n,t){var r=this.dbInfo.db.transaction(e,"readwrite").objectStore(e).index(n).get(t);return new Promise(function(n,t){r.onerror=function(e){t(e)},r.onsuccess=function(e){n(e.target.result)}})}},{key:"cursorGetDataByIndex",value:function(u,c){var s=this,a=[],f=this.dbInfo.db.transaction(u,"readwrite").objectStore(u);return new Promise(function(n,t){var e=(s.dbInfo.stores.find(function(e){return e.storeName===u})||{}).indexs;if(e){var r,o="",i=[];for(r in c)o+=","+r,i.push(c[r]);var o=o.substring(1),e=(e.find(function(e){return e.keyPath===o})||{}).name;e?((e=f.index(e).openCursor(IDBKeyRange.only(1===i.length?i[0]:i))).onsuccess=function(e){e=e.target.result;e?(a.push(e.value),e.continue()):n(a)},e.onerror=function(e){t(e)}):n([])}else n([])})}},{key:"updateDB",value:function(e,n){var t=this.dbInfo.db.transaction([e],"readwrite").objectStore(e).put(n);return new Promise(function(n,e){t.onsuccess=function(e){n(e)},t.onerror=function(e){n(e)}})}},{key:"deleteDB",value:function(e,n){var t=this.dbInfo.db.transaction([e],"readwrite").objectStore(e).delete(n);return new Promise(function(n,e){t.onsuccess=function(e){n(e)},t.onerror=function(e){n(e)}})}},{key:"deleteDBAll",value:function(e){var t=window.indexedDB.deleteDatabase(e);return new Promise(function(e,n){t.onerror=function(e){console.error(e)},t.onsuccess=function(e){console.info(e)}})}},{key:"closeDB",value:function(){this.dbInfo.db.close(),console.info("数据库已关闭")}}]),n}();exports.IndexedDB=IndexedDB;