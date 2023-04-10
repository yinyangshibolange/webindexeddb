/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 61:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(698)["default"]);
function _regeneratorRuntime() {
  "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 698:
/***/ ((module) => {

function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 687:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(61)();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/* unused harmony export IndexdbStore */
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(687);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);







function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function listSort(list) {
  var sortParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var sort_params = [{
    key: 'addtime',
    type: 'desc'
  }].concat(_toConsumableArray(sortParams));
  // 默认按addtime排序
  return list.sort(function (a, b) {
    var flag = false;
    for (var i = 0; i < sort_params.length; i++) {
      var item = sort_params[i];
      var type = void 0,
        key = void 0;
      if (typeof item === 'string') {
        type = 'desc';
        key = item;
      } else if (_typeof(item) === 'object') {
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
var IndexdbStore = /*#__PURE__*/(/* unused pure expression or super */ null && (function () {
  function IndexdbStore() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
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
    _classCallCheck(this, IndexdbStore);
    this.db = null;
    if (!this.db) {
      var name = options.name,
        version = options.version,
        stores = options.stores;
      this.db = new IndexedDB({
        name: name,
        version: version,
        db: null,
        stores: stores
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
  _createClass(IndexdbStore, [{
    key: "addItem",
    value: function () {
      var _addItem = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(storeName, data) {
        var now, res;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return this.db.openDB(storeName);
            case 3:
              _context.next = 8;
              break;
            case 5:
              _context.prev = 5;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", {
                code: -1,
                msg: _context.t0
              });
            case 8:
              now = new Date();
              _context.prev = 9;
              _context.next = 12;
              return this.db.addData(storeName, _objectSpread(_objectSpread({}, data), {}, {
                addtime: now.getTime(),
                addtimeformat: now.Format("yyyy-MM-dd hh:mm:ss")
              }));
            case 12:
              res = _context.sent;
              this.db.closeDB();
              return _context.abrupt("return", {
                code: 0,
                data: res
              });
            case 17:
              _context.prev = 17;
              _context.t1 = _context["catch"](9);
              this.db.closeDB();
              return _context.abrupt("return", {
                code: -1,
                msg: _context.t1
              });
            case 21:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[0, 5], [9, 17]]);
      }));
      function addItem(_x, _x2) {
        return _addItem.apply(this, arguments);
      }
      return addItem;
    }()
    /**
     * 批量新增数据
     * 会自动添加addtime和addtimeformat字段
     * @param {String} storeName 表名
     * @param {Array} list 数据列表
     * @returns {Object} {code,data,msg}
     */
  }, {
    key: "addBatch",
    value: function () {
      var _addBatch = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(storeName, list) {
        var now, resList, i, data, res;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(!Array.isArray(list) || list.length === 0)) {
                _context2.next = 2;
                break;
              }
              return _context2.abrupt("return", {
                code: -1,
                msg: "参数错误，批量添加参数应为一个非空列表"
              });
            case 2:
              _context2.prev = 2;
              _context2.next = 5;
              return this.db.openDB(storeName);
            case 5:
              _context2.next = 10;
              break;
            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](2);
              return _context2.abrupt("return", {
                code: -1,
                msg: _context2.t0
              });
            case 10:
              now = new Date();
              resList = [];
              i = 0;
            case 13:
              if (!(i < list.length)) {
                _context2.next = 28;
                break;
              }
              data = list[i];
              _context2.prev = 15;
              _context2.next = 18;
              return this.db.addData(storeName, _objectSpread(_objectSpread({}, data), {}, {
                addtime: now.getTime(),
                addtimeformat: now.Format("yyyy-MM-dd hh:mm:ss")
              }));
            case 18:
              res = _context2.sent;
              resList.push({
                code: 0,
                origin: data,
                data: res
              });
              _context2.next = 25;
              break;
            case 22:
              _context2.prev = 22;
              _context2.t1 = _context2["catch"](15);
              resList.push({
                code: -1,
                origin: data,
                data: _context2.t1
              });
            case 25:
              i++;
              _context2.next = 13;
              break;
            case 28:
              this.db.closeDB();
              return _context2.abrupt("return", {
                code: 0,
                data: resList
              });
            case 30:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[2, 7], [15, 22]]);
      }));
      function addBatch(_x3, _x4) {
        return _addBatch.apply(this, arguments);
      }
      return addBatch;
    }()
    /**
     * 修改数据
     * 会自动添加updatetime和updatetimeformat
     * @param {String} storeName 表名
     * @param {Object} data 数据
     * @returns {Object} {code,data,msg}
     */
  }, {
    key: "updateItem",
    value: function () {
      var _updateItem = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(storeName, data) {
        var now, res;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return this.db.openDB(storeName);
            case 3:
              _context3.next = 8;
              break;
            case 5:
              _context3.prev = 5;
              _context3.t0 = _context3["catch"](0);
              return _context3.abrupt("return", {
                code: -1,
                msg: _context3.t0
              });
            case 8:
              now = new Date();
              _context3.prev = 9;
              _context3.next = 12;
              return this.db.updateDB(storeName, _objectSpread(_objectSpread({}, data), {}, {
                updatetime: now.getTime(),
                updatetimeformat: now.Format("yyyy-MM-dd hh:mm:ss")
              }));
            case 12:
              res = _context3.sent;
              this.db.closeDB();
              return _context3.abrupt("return", {
                code: 0,
                data: res
              });
            case 17:
              _context3.prev = 17;
              _context3.t1 = _context3["catch"](9);
              this.db.closeDB();
              return _context3.abrupt("return", {
                code: -1,
                msg: _context3.t1
              });
            case 21:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[0, 5], [9, 17]]);
      }));
      function updateItem(_x5, _x6) {
        return _updateItem.apply(this, arguments);
      }
      return updateItem;
    }()
    /**
     * 批量修改数据
     * 会自动添加updatetime和updatetimeformat
     * @param {String} storeName 表名
     * @param {Array} list 数据列表
     * @returns {Object} {code,data,msg}
     */
  }, {
    key: "updateBatch",
    value: function () {
      var _updateBatch = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(storeName, list) {
        var now, resList, i, data, res;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!(!Array.isArray(list) || list.length === 0)) {
                _context4.next = 2;
                break;
              }
              return _context4.abrupt("return", {
                code: -1,
                msg: "参数错误，批量添加参数应为一个非空列表"
              });
            case 2:
              _context4.prev = 2;
              _context4.next = 5;
              return this.db.openDB(storeName);
            case 5:
              _context4.next = 10;
              break;
            case 7:
              _context4.prev = 7;
              _context4.t0 = _context4["catch"](2);
              return _context4.abrupt("return", {
                code: -1,
                msg: _context4.t0
              });
            case 10:
              now = new Date();
              resList = [];
              i = 0;
            case 13:
              if (!(i < list.length)) {
                _context4.next = 28;
                break;
              }
              data = list[i];
              _context4.prev = 15;
              _context4.next = 18;
              return this.db.updateDB(storeName, _objectSpread(_objectSpread({}, data), {}, {
                updatetime: now.getTime(),
                updatetimeformat: now.Format("yyyy-MM-dd hh:mm:ss")
              }));
            case 18:
              res = _context4.sent;
              resList.push({
                code: 0,
                data: res
              });
              _context4.next = 25;
              break;
            case 22:
              _context4.prev = 22;
              _context4.t1 = _context4["catch"](15);
              resList.push({
                code: -1,
                msg: _context4.t1
              });
            case 25:
              i++;
              _context4.next = 13;
              break;
            case 28:
              this.db.closeDB();
              return _context4.abrupt("return", {
                code: 0,
                data: resList
              });
            case 30:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this, [[2, 7], [15, 22]]);
      }));
      function updateBatch(_x7, _x8) {
        return _updateBatch.apply(this, arguments);
      }
      return updateBatch;
    }()
    /**
     * 删除数据
     * @param {String} storeName 表名
     * @param {String} id 数据id
     * @returns  {Object} {code,data,msg}
     */
  }, {
    key: "delItem",
    value: function () {
      var _delItem = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(storeName, id) {
        var res;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return this.db.openDB(storeName);
            case 3:
              _context5.next = 8;
              break;
            case 5:
              _context5.prev = 5;
              _context5.t0 = _context5["catch"](0);
              return _context5.abrupt("return", {
                code: -1,
                msg: _context5.t0
              });
            case 8:
              _context5.prev = 8;
              _context5.next = 11;
              return this.db.deleteDB(storeName, id);
            case 11:
              res = _context5.sent;
              this.db.closeDB();
              return _context5.abrupt("return", {
                code: 0,
                data: res
              });
            case 16:
              _context5.prev = 16;
              _context5.t1 = _context5["catch"](8);
              this.db.closeDB();
              return _context5.abrupt("return", {
                code: -1,
                msg: _context5.t1
              });
            case 20:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this, [[0, 5], [8, 16]]);
      }));
      function delItem(_x9, _x10) {
        return _delItem.apply(this, arguments);
      }
      return delItem;
    }()
    /**
     * 批量删除数据
     * @param {String} storeName 表名
     * @param {Array} ids id列表
     * @returns {Object} {code,data,msg}
     */
  }, {
    key: "delBatch",
    value: function () {
      var _delBatch = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(storeName, ids) {
        var resList, i, res;
        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              if (!(!Array.isArray(ids) || ids.length === 0)) {
                _context6.next = 2;
                break;
              }
              return _context6.abrupt("return", {
                code: -1,
                msg: "参数错误，批量添加参数应为一个非空列表"
              });
            case 2:
              _context6.prev = 2;
              _context6.next = 5;
              return this.db.openDB(storeName);
            case 5:
              _context6.next = 10;
              break;
            case 7:
              _context6.prev = 7;
              _context6.t0 = _context6["catch"](2);
              return _context6.abrupt("return", {
                code: -1,
                msg: _context6.t0
              });
            case 10:
              resList = [];
              i = 0;
            case 12:
              if (!(i < ids.length)) {
                _context6.next = 26;
                break;
              }
              _context6.prev = 13;
              _context6.next = 16;
              return this.db.deleteDB(storeName, ids[i]);
            case 16:
              res = _context6.sent;
              resList.push({
                code: 0,
                data: res
              });
              _context6.next = 23;
              break;
            case 20:
              _context6.prev = 20;
              _context6.t1 = _context6["catch"](13);
              resList.push({
                code: -1,
                msg: _context6.t1
              });
            case 23:
              i++;
              _context6.next = 12;
              break;
            case 26:
              this.db.closeDB();
              return _context6.abrupt("return", {
                code: 0,
                data: resList
              });
            case 28:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this, [[2, 7], [13, 20]]);
      }));
      function delBatch(_x11, _x12) {
        return _delBatch.apply(this, arguments);
      }
      return delBatch;
    }()
    /**
     * 查询表中所有数据
     * @param {String} storeName 表名
     * @param {Array} sortParams 排序参数[{key,type}]，默认有一个{key:'addtime',type:'desc'}参数
     * @returns {Object} {code,data,msg}
     */
  }, {
    key: "getAll",
    value: function () {
      var _getAll = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(storeName) {
        var sortParams,
          list,
          _args7 = arguments;
        return _regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              sortParams = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : [];
              _context7.prev = 1;
              _context7.next = 4;
              return this.db.openDB(storeName);
            case 4:
              _context7.next = 9;
              break;
            case 6:
              _context7.prev = 6;
              _context7.t0 = _context7["catch"](1);
              return _context7.abrupt("return", {
                code: -1,
                msg: _context7.t0
              });
            case 9:
              _context7.prev = 9;
              _context7.next = 12;
              return this.db.cursorGetData(storeName);
            case 12:
              list = _context7.sent;
              list = listSort(list, sortParams);
              this.db.closeDB();
              return _context7.abrupt("return", {
                code: 0,
                data: list
              });
            case 18:
              _context7.prev = 18;
              _context7.t1 = _context7["catch"](9);
              this.db.closeDB();
              return _context7.abrupt("return", {
                code: -1,
                msg: _context7.t1
              });
            case 22:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this, [[1, 6], [9, 18]]);
      }));
      function getAll(_x13) {
        return _getAll.apply(this, arguments);
      }
      return getAll;
    }()
    /**
     * 条件查询数据
     * @param {String} storeName 表名
     * @param {Object} params 查询参数
     * @param {Array} sortParams 排序参数[{key,type}]，默认有一个{key:'addtime',type:'desc'}参数
     * @returns {Object} {code,data,msg}
     */
  }, {
    key: "queryAll",
    value: function () {
      var _queryAll = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(storeName, params) {
        var sortParams,
          list,
          _args8 = arguments;
        return _regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              sortParams = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : [];
              _context8.prev = 1;
              _context8.next = 4;
              return this.db.openDB(storeName);
            case 4:
              _context8.next = 10;
              break;
            case 6:
              _context8.prev = 6;
              _context8.t0 = _context8["catch"](1);
              console.error(_context8.t0);
              return _context8.abrupt("return");
            case 10:
              _context8.prev = 10;
              _context8.next = 13;
              return this.db.cursorGetDataByIndex(storeName, params);
            case 13:
              list = _context8.sent;
              list = listSort(list, sortParams);
              this.db.closeDB();
              return _context8.abrupt("return", {
                code: 0,
                data: list
              });
            case 19:
              _context8.prev = 19;
              _context8.t1 = _context8["catch"](10);
              this.db.closeDB();
              return _context8.abrupt("return", {
                code: -1,
                msg: _context8.t1
              });
            case 23:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this, [[1, 6], [10, 19]]);
      }));
      function queryAll(_x14, _x15) {
        return _queryAll.apply(this, arguments);
      }
      return queryAll;
    }()
    /**
     * 条件查询分页数据
     * @param {String} storeName 表名
     * @param {Object} params 查询参数
     * @param {Array} sortParams 排序参数[{key,type}]，默认有一个{key:'addtime',type:'desc'}参数
     * @param {Number} page 当前页
     * @param {Number} pagesize 每页的项目数
     * @returns {Object} {code,data,msg}
     */
  }, {
    key: "queryPage",
    value: function () {
      var _queryPage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(storeName, params, sortParams) {
        var page,
          pagesize,
          list,
          _args9 = arguments;
        return _regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              page = _args9.length > 3 && _args9[3] !== undefined ? _args9[3] : 1;
              pagesize = _args9.length > 4 && _args9[4] !== undefined ? _args9[4] : 10;
              _context9.prev = 2;
              _context9.next = 5;
              return this.db.openDB(storeName);
            case 5:
              _context9.next = 10;
              break;
            case 7:
              _context9.prev = 7;
              _context9.t0 = _context9["catch"](2);
              return _context9.abrupt("return", {
                code: -1,
                msg: _context9.t0
              });
            case 10:
              _context9.prev = 10;
              _context9.next = 13;
              return this.db.cursorGetDataByIndex(storeName, params);
            case 13:
              list = _context9.sent;
              list = listSort(list, sortParams);
              this.db.closeDB();
              return _context9.abrupt("return", {
                code: 0,
                data: {
                  total: list.length,
                  list: list.slice((page - 1) * pagesize, page * pagesize)
                }
              });
            case 19:
              _context9.prev = 19;
              _context9.t1 = _context9["catch"](10);
              this.db.closeDB();
              return _context9.abrupt("return", {
                code: -1,
                msg: _context9.t1
              });
            case 23:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this, [[2, 7], [10, 19]]);
      }));
      function queryPage(_x16, _x17, _x18) {
        return _queryPage.apply(this, arguments);
      }
      return queryPage;
    }()
  }]);
  return IndexdbStore;
}()));
})();

/******/ })()
;