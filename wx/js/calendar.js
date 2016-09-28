/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "3893746729f0e90e5b62"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 2;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/wx/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {__webpack_require__(31);
	var pageLoad = __webpack_require__(15);
	var mobiScroll = __webpack_require__(19);
	var Dom = __webpack_require__(17);
	var Ajax = __webpack_require__(23);
	var Lunar = __webpack_require__(34);
	var wx = __webpack_require__(21);
	
	var fuc = {
	    config: {
	        birthday: "",
	        isGoodDay: false,
	        screenWidth :$(document.body).width()//获取屏幕宽度
	    },
	    init: function() {
	        pageLoad({backgroundColor: "#12101A"});
	        this.renderPage();
	        this.bindEvent();
	    },
	    renderPage: function() {
	        var screenHeight = $(document.body).height(),
	            toolbarHeight = $('#toolbar').height(),
	            wrapperHeight = $('.wrapper').height(),
	            titleHeight = $('.schedule h1').height();
	        this.otherHeight = screenHeight-toolbarHeight-wrapperHeight-titleHeight;
	        wx.wxConfig(1);
	        this.getUserInformation();//获取用户信息，若用户设置了生日，则可获取生日
	        Ajax.getEventOfMonth();//判断当前页面的时间中有没有事件，有事件的在下方加点
	        /*----------------------------------进入页面时，显示当天的事件列表和运势-------------------------------------------*/
	        var theDay = $('.date_current').attr('id');
	        Ajax.getEventOfDay(theDay);//获取一天的事件
	        Ajax.getFortune(theDay);//获取当天的黄历
	        /*--------------------------获取点击日期，显示当天的日程列表和运势--------------------------*/
	        Lunar.clickDate();
	        this.selectBirthday = this.selectBirthdayDate('#birthday')
	        this.selectBirthday.setVal(new Date("1990/01/01"));//选择生日
	        var wrapper = document.getElementById('wrapper');
	        wrapper.addEventListener('touchmove', function (e) {
	            e.preventDefault();
	        });
	    },
	    getUserInformation: function() {
	        var that=this;
	        $.ajax({
	            type: "get",
	            url: "http://www.li-li.cn/llwx/user/detail",
	            dataType: "json",
	            success: function (data) {
	                if (data.code == 0) {
	                    that.config.birthday = data.data.birthday;
	                    if (that.config.birthday != null && that.config.birthday != "") {
	                        var birthdayArr = that.config.birthday.split(" ");
	                        var birthdayStr = birthdayArr[0].replace(/\-/g, "/"),
	                            birthdayDateArr = birthdayArr[0].split("-");
	                        that.selectBirthdayDate('#alterBirthday').setVal(new Date(birthdayStr));
	                        $('.birthday').html("（"+birthdayDateArr[1]+"-"+birthdayDateArr[2]+"）");
	                    }
	                }
	            }
	        });
	    },
	    selectBirthdayDate: function(obj) {
	        var that = this;
	        var selb = mobiScroll.date(obj, {
	            theme: 'android-holo-light',
	            lang: 'zh',
	            display: 'bottom',
	            dateFormat: 'yyyy-mm-dd',
	            min: new Date(1921, 1, 1),
	            max: new Date(2020, 1, 1),
	            readonly: false,
	            onShow: function (event, inst) {
	                var theDate = inst._tempValue;
	                Dom.transDate(theDate);
	            },
	            onSet: function (event, inst) {
	                if(that.config.isGoodDay){//跳转吉日
	                    that.config.isGoodDay=false;
	                    $('.lucky').animate({'bottom': '0px'}, 500);
	                }
	                $('#loadingToast').show();//显示loading
	                var selectedDate = inst.getVal();//获取选择时间的标准形式
	                var selectedTime = inst._tempValue;//获取选择时间 yyyy-mm-dd
	                $('.alConBg').css("display", "none");
	                $('.content').css("display", "block");
	                Ajax.setBirthday(selectedTime);//将用户设置的生日传至后台
	                that.config.birthday = selectedTime + "08:00:00";//保存用户设置的生日
	                var birthdayStr = selectedTime.replace(/\-/g,"-"),
	                    birthdayArr = selectedTime.split("-");
	                that.selectBirthdayDate('#alterBirthday').setVal(new Date(birthdayStr));
	                $('.birthday').html("（"+birthdayArr[1]+"-"+birthdayArr[2]+"）");
	            },
	            onChange: function (event, inst) {
	                var changeDate = inst._tempValue;
	                Dom.transDate(changeDate);
	            },
	            onCancel: function (event, inst) {
	                Dom.slideLeft();
	                that.config.isGoodDay = false;
	            }
	        });
	        return selb;
	    },
	    bindEvent: function() {
	        var that = this;
	        /*------------------------------------点击添加事件按钮，跳转至添加事件页面------------------------------------*/
	        $('.addEvent').on('tap', function (event) {
	            var dateCurrent = $('.date_current').attr('id');
	            $('body').html("").css("background", "#66cccc");
	            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/addEvent.html?date=" + dateCurrent);
	            event.preventDefault();
	        });
	
	        /*--------------点击/滑动的tab切换效果，容器高度随显示内容变化--------------------------*/
	        $('.scheduleCon').css("min-height",this.otherHeight+"px");
	        var scheHeight = parseInt($('.scheduleList').css('height'));
	        $('.schedule').css("height", 40+scheHeight+"px");
	        $('.scheBtn').on('tap', function (event) {
	            Dom.slideRight();
	        });
	        $('.almaBtn').on('tap', function (event) {
	            Dom.slideLeft();
	        });
	        $('.scheduleList').on('swipeLeft', function (event) {
	            Dom.slideLeft();
	            event.preventDefault();
	            return false;
	        });
	        $('.almanac').on('swipeRight', function (event) {
	            Dom.slideRight();
	            event.preventDefault();
	            return false;
	        });
	        /*--------------------------------吉日-------------------------------*/
	        var _btns = $('.lucky .word_item span');
	        //var _btnsB = $('.inFrame .word_item span');
	        var num02 = 0;
	        $('.inFrame').css("width",3*that.config.screenWidth+"px");//底部一行吉日容器的宽度
	        /*---------------------------点击上方吉日按钮，若用户设置了生日则显示吉日列表，没有设置则提示用户设置生日-------------*/
	        $('.luckyDay').on('tap', function (event) {
	            if (that.config.birthday) {
	                _btns.each(function () {
	                    $(this).removeClass("active");
	                });
	                $('.lucky').animate({'bottom': '0px'}, 500);
	            } else {
	                $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
	                    $('#dialog2').hide();
	                    that.config.isGoodDay = true;
	                    that.selectBirthday.show();
	                });
	            }
	        });
	
	        /*------------------一行吉日列表的滑动查看效果-----------------------*/
	        var lucky02 = document.getElementById('lucky02');
	        lucky02.addEventListener("touchmove", function (e) {
	            e.preventDefault();
	        });
	        var timer1 = null, timer2 = null;
	        $('.lucky02').on('swipeLeft', function (event) {
	            clearInterval(timer1);
	            clearInterval(timer2);
	            timer1 = setInterval(function () {
	                num02 += 0.05;
	                if (num02.toFixed(2) % 1 == 0) {
	                    clearInterval(timer1);
	                }
	                if (num02 > 2) {
	                    clearInterval(timer1);
	                    num02 = 2;
	                }
	                $('.inFrame').css('left', -num02 * that.config.screenWidth + 'px');
	            }, 15);
	            event.preventDefault();
	            return false;
	        });
	        $('.lucky02').on('swipeRight', function (event) {
	            clearInterval(timer2);
	            clearInterval(timer1);
	            timer2 = setInterval(function () {
	                num02 -= 0.05;
	                if (num02.toFixed(2) % 1 == 0) {
	                    clearInterval(timer2);
	                }
	                if (num02 < 0) {
	                    num02 = 0;
	                    clearInterval(timer2);
	                }
	                $('.inFrame').css('left', -num02 * that.config.screenWidth + 'px');
	            }, 15);
	            event.preventDefault();
	            return false;
	        });
	
	        /*------------------点击吉日列表中的关闭按钮，列表隐藏，日历中所有日期恢复初始状态-----------------------*/
	        $('.close').on('tap', function (event) {
	            Lunar.selectWord = "";
	            var dateItem = Dom.getDateList();
	            var wordItem = $('.luckyWord .word_item span');
	            $('.lucky').animate({'bottom': "-265px"}, 500);
	            for (var i = 0; i < dateItem.size(); i++) {
	                dateItem.eq(i).removeClass("Not-lucky");
	            }
	            for (var j = 0; j < wordItem.size(); j++) {
	                wordItem.eq(i).removeClass("active");
	            }
	        });
	        $('.close02').on('tap', function (event) {
	            Lunar.selectWord = "";
	            var dateItem = Dom.getDateList();
	            var wordItem = $('.lucky02 .word_item span');
	            $('.lucky02').animate({'bottom': "-64px"}, 500);
	            $('.close02').animate({'bottom':'-30px'},500);
	            for (var i = 0; i < dateItem.size(); i++) {
	                dateItem.eq(i).removeClass("Not-lucky");
	            }
	            for (var j = 0; j < wordItem.size(); j++) {
	                wordItem.eq(j).removeClass("active");
	            }
	        });
	    }
	}
	
	fuc.init();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* Zepto v1.1.7 - zepto event ajax form ie - zeptojs.com/license */
	
	var Zepto = (function() {
	  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
	    document = window.document,
	    elementDisplay = {}, classCache = {},
	    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
	    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
	    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
	    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	    rootNodeRE = /^(?:body|html)$/i,
	    capitalRE = /([A-Z])/g,
	
	    // special attributes that should be get/set via method calls
	    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
	
	    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
	    table = document.createElement('table'),
	    tableRow = document.createElement('tr'),
	    containers = {
	      'tr': document.createElement('tbody'),
	      'tbody': table, 'thead': table, 'tfoot': table,
	      'td': tableRow, 'th': tableRow,
	      '*': document.createElement('div')
	    },
	    readyRE = /complete|loaded|interactive/,
	    simpleSelectorRE = /^[\w-]*$/,
	    class2type = {},
	    toString = class2type.toString,
	    zepto = {},
	    camelize, uniq,
	    tempParent = document.createElement('div'),
	    propMap = {
	      'tabindex': 'tabIndex',
	      'readonly': 'readOnly',
	      'for': 'htmlFor',
	      'class': 'className',
	      'maxlength': 'maxLength',
	      'cellspacing': 'cellSpacing',
	      'cellpadding': 'cellPadding',
	      'rowspan': 'rowSpan',
	      'colspan': 'colSpan',
	      'usemap': 'useMap',
	      'frameborder': 'frameBorder',
	      'contenteditable': 'contentEditable'
	    },
	    isArray = Array.isArray ||
	      function(object){ return object instanceof Array }
	
	  zepto.matches = function(element, selector) {
	    if (!selector || !element || element.nodeType !== 1) return false
	    var matchesSelector = element.matches || element.webkitMatchesSelector ||
	                          element.mozMatchesSelector || element.oMatchesSelector ||
	                          element.matchesSelector
	    if (matchesSelector) return matchesSelector.call(element, selector)
	    // fall back to performing a selector:
	    var match, parent = element.parentNode, temp = !parent
	    if (temp) (parent = tempParent).appendChild(element)
	    match = ~zepto.qsa(parent, selector).indexOf(element)
	    temp && tempParent.removeChild(element)
	    return match
	  }
	
	  function type(obj) {
	    return obj == null ? String(obj) :
	      class2type[toString.call(obj)] || "object"
	  }
	
	  function isFunction(value) { return type(value) == "function" }
	  function isWindow(obj)     { return obj != null && obj == obj.window }
	  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
	  function isObject(obj)     { return type(obj) == "object" }
	  function isPlainObject(obj) {
	    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
	  }
	
	  function likeArray(obj) {
	    var length = !!obj && 'length' in obj && obj.length,
	      type = $.type(obj)
	
	    return 'function' != type && !isWindow(obj) && (
	      'array' == type || length === 0 ||
	        (typeof length == 'number' && length > 0 && (length - 1) in obj)
	    )
	  }
	
	  function compact(array) { return filter.call(array, function(item){ return item != null }) }
	  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
	  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
	  function dasherize(str) {
	    return str.replace(/::/g, '/')
	           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
	           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
	           .replace(/_/g, '-')
	           .toLowerCase()
	  }
	  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }
	
	  function classRE(name) {
	    return name in classCache ?
	      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
	  }
	
	  function maybeAddPx(name, value) {
	    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
	  }
	
	  function defaultDisplay(nodeName) {
	    var element, display
	    if (!elementDisplay[nodeName]) {
	      element = document.createElement(nodeName)
	      document.body.appendChild(element)
	      display = getComputedStyle(element, '').getPropertyValue("display")
	      element.parentNode.removeChild(element)
	      display == "none" && (display = "block")
	      elementDisplay[nodeName] = display
	    }
	    return elementDisplay[nodeName]
	  }
	
	  function children(element) {
	    return 'children' in element ?
	      slice.call(element.children) :
	      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
	  }
	
	  // `$.zepto.fragment` takes a html string and an optional tag name
	  // to generate DOM nodes from the given html string.
	  // The generated DOM nodes are returned as an array.
	  // This function can be overridden in plugins for example to make
	  // it compatible with browsers that don't support the DOM fully.
	  zepto.fragment = function(html, name, properties) {
	    var dom, nodes, container
	
	    // A special case optimization for a single tag
	    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))
	
	    if (!dom) {
	      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
	      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
	      if (!(name in containers)) name = '*'
	
	      container = containers[name]
	      container.innerHTML = '' + html
	      dom = $.each(slice.call(container.childNodes), function(){
	        container.removeChild(this)
	      })
	    }
	
	    if (isPlainObject(properties)) {
	      nodes = $(dom)
	      $.each(properties, function(key, value) {
	        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
	        else nodes.attr(key, value)
	      })
	    }
	
	    return dom
	  }
	
	  // `$.zepto.Z` swaps out the prototype of the given `dom` array
	  // of nodes with `$.fn` and thus supplying all the Zepto functions
	  // to the array. This method can be overridden in plugins.
	  zepto.Z = function(dom, selector) {
	    dom = dom || []
	    dom.__proto__ = $.fn
	    dom.selector = selector || ''
	    return dom
	  }
	
	  // `$.zepto.isZ` should return `true` if the given object is a Zepto
	  // collection. This method can be overridden in plugins.
	  zepto.isZ = function(object) {
	    return object instanceof zepto.Z
	  }
	
	  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
	  // takes a CSS selector and an optional context (and handles various
	  // special cases).
	  // This method can be overridden in plugins.
	  zepto.init = function(selector, context) {
	    var dom
	    // If nothing given, return an empty Zepto collection
	    if (!selector) return zepto.Z()
	    // Optimize for string selectors
	    else if (typeof selector == 'string') {
	      selector = selector.trim()
	      // If it's a html fragment, create nodes from it
	      // Note: In both Chrome 21 and Firefox 15, DOM error 12
	      // is thrown if the fragment doesn't begin with <
	      if (selector[0] == '<' && fragmentRE.test(selector))
	        dom = zepto.fragment(selector, RegExp.$1, context), selector = null
	      // If there's a context, create a collection on that context first, and select
	      // nodes from there
	      else if (context !== undefined) return $(context).find(selector)
	      // If it's a CSS selector, use it to select nodes.
	      else dom = zepto.qsa(document, selector)
	    }
	    // If a function is given, call it when the DOM is ready
	    else if (isFunction(selector)) return $(document).ready(selector)
	    // If a Zepto collection is given, just return it
	    else if (zepto.isZ(selector)) return selector
	    else {
	      // normalize array if an array of nodes is given
	      if (isArray(selector)) dom = compact(selector)
	      // Wrap DOM nodes.
	      else if (isObject(selector))
	        dom = [selector], selector = null
	      // If it's a html fragment, create nodes from it
	      else if (fragmentRE.test(selector))
	        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
	      // If there's a context, create a collection on that context first, and select
	      // nodes from there
	      else if (context !== undefined) return $(context).find(selector)
	      // And last but no least, if it's a CSS selector, use it to select nodes.
	      else dom = zepto.qsa(document, selector)
	    }
	    // create a new Zepto collection from the nodes found
	    return zepto.Z(dom, selector)
	  }
	
	  // `$` will be the base `Zepto` object. When calling this
	  // function just call `$.zepto.init, which makes the implementation
	  // details of selecting nodes and creating Zepto collections
	  // patchable in plugins.
	  $ = function(selector, context){
	    return zepto.init(selector, context)
	  }
	
	  function extend(target, source, deep) {
	    for (key in source)
	      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
	        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
	          target[key] = {}
	        if (isArray(source[key]) && !isArray(target[key]))
	          target[key] = []
	        extend(target[key], source[key], deep)
	      }
	      else if (source[key] !== undefined) target[key] = source[key]
	  }
	
	  // Copy all but undefined properties from one or more
	  // objects to the `target` object.
	  $.extend = function(target){
	    var deep, args = slice.call(arguments, 1)
	    if (typeof target == 'boolean') {
	      deep = target
	      target = args.shift()
	    }
	    args.forEach(function(arg){ extend(target, arg, deep) })
	    return target
	  }
	
	  // `$.zepto.qsa` is Zepto's CSS selector implementation which
	  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
	  // This method can be overridden in plugins.
	  zepto.qsa = function(element, selector){
	    var found,
	        maybeID = selector[0] == '#',
	        maybeClass = !maybeID && selector[0] == '.',
	        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
	        isSimple = simpleSelectorRE.test(nameOnly)
	    return (isDocument(element) && isSimple && maybeID) ?
	      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
	      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
	      slice.call(
	        isSimple && !maybeID ?
	          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
	          element.getElementsByTagName(selector) : // Or a tag
	          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
	      )
	  }
	
	  function filtered(nodes, selector) {
	    return selector == null ? $(nodes) : $(nodes).filter(selector)
	  }
	
	  $.contains = document.documentElement.contains ?
	    function(parent, node) {
	      return parent !== node && parent.contains(node)
	    } :
	    function(parent, node) {
	      while (node && (node = node.parentNode))
	        if (node === parent) return true
	      return false
	    }
	
	  function funcArg(context, arg, idx, payload) {
	    return isFunction(arg) ? arg.call(context, idx, payload) : arg
	  }
	
	  function setAttribute(node, name, value) {
	    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
	  }
	
	  // access className property while respecting SVGAnimatedString
	  function className(node, value){
	    var klass = node.className || '',
	        svg   = klass && klass.baseVal !== undefined
	
	    if (value === undefined) return svg ? klass.baseVal : klass
	    svg ? (klass.baseVal = value) : (node.className = value)
	  }
	
	  // "true"  => true
	  // "false" => false
	  // "null"  => null
	  // "42"    => 42
	  // "42.5"  => 42.5
	  // "08"    => "08"
	  // JSON    => parse if valid
	  // String  => self
	  function deserializeValue(value) {
	    try {
	      return value ?
	        value == "true" ||
	        ( value == "false" ? false :
	          value == "null" ? null :
	          +value + "" == value ? +value :
	          /^[\[\{]/.test(value) ? $.parseJSON(value) :
	          value )
	        : value
	    } catch(e) {
	      return value
	    }
	  }
	
	  $.type = type
	  $.isFunction = isFunction
	  $.isWindow = isWindow
	  $.isArray = isArray
	  $.isPlainObject = isPlainObject
	
	  $.isEmptyObject = function(obj) {
	    var name
	    for (name in obj) return false
	    return true
	  }
	
	  $.inArray = function(elem, array, i){
	    return emptyArray.indexOf.call(array, elem, i)
	  }
	
	  $.camelCase = camelize
	  $.trim = function(str) {
	    return str == null ? "" : String.prototype.trim.call(str)
	  }
	
	  // plugin compatibility
	  $.uuid = 0
	  $.support = { }
	  $.expr = { }
	
	  $.map = function(elements, callback){
	    var value, values = [], i, key
	    if (likeArray(elements))
	      for (i = 0; i < elements.length; i++) {
	        value = callback(elements[i], i)
	        if (value != null) values.push(value)
	      }
	    else
	      for (key in elements) {
	        value = callback(elements[key], key)
	        if (value != null) values.push(value)
	      }
	    return flatten(values)
	  }
	
	  $.each = function(elements, callback){
	    var i, key
	    if (likeArray(elements)) {
	      for (i = 0; i < elements.length; i++)
	        if (callback.call(elements[i], i, elements[i]) === false) return elements
	    } else {
	      for (key in elements)
	        if (callback.call(elements[key], key, elements[key]) === false) return elements
	    }
	
	    return elements
	  }
	
	  $.grep = function(elements, callback){
	    return filter.call(elements, callback)
	  }
	
	  if (window.JSON) $.parseJSON = JSON.parse
	
	  // Populate the class2type map
	  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	    class2type[ "[object " + name + "]" ] = name.toLowerCase()
	  })
	
	  // Define methods that will be available on all
	  // Zepto collections
	  $.fn = {
	    // Because a collection acts like an array
	    // copy over these useful array functions.
	    forEach: emptyArray.forEach,
	    reduce: emptyArray.reduce,
	    push: emptyArray.push,
	    sort: emptyArray.sort,
	    indexOf: emptyArray.indexOf,
	    concat: emptyArray.concat,
	
	    // `map` and `slice` in the jQuery API work differently
	    // from their array counterparts
	    map: function(fn){
	      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
	    },
	    slice: function(){
	      return $(slice.apply(this, arguments))
	    },
	
	    ready: function(callback){
	      // need to check if document.body exists for IE as that browser reports
	      // document ready when it hasn't yet created the body element
	      if (readyRE.test(document.readyState) && document.body) callback($)
	      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
	      return this
	    },
	    get: function(idx){
	      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
	    },
	    toArray: function(){ return this.get() },
	    size: function(){
	      return this.length
	    },
	    remove: function(){
	      return this.each(function(){
	        if (this.parentNode != null)
	          this.parentNode.removeChild(this)
	      })
	    },
	    each: function(callback){
	      emptyArray.every.call(this, function(el, idx){
	        return callback.call(el, idx, el) !== false
	      })
	      return this
	    },
	    filter: function(selector){
	      if (isFunction(selector)) return this.not(this.not(selector))
	      return $(filter.call(this, function(element){
	        return zepto.matches(element, selector)
	      }))
	    },
	    add: function(selector,context){
	      return $(uniq(this.concat($(selector,context))))
	    },
	    is: function(selector){
	      return this.length > 0 && zepto.matches(this[0], selector)
	    },
	    not: function(selector){
	      var nodes=[]
	      if (isFunction(selector) && selector.call !== undefined)
	        this.each(function(idx){
	          if (!selector.call(this,idx)) nodes.push(this)
	        })
	      else {
	        var excludes = typeof selector == 'string' ? this.filter(selector) :
	          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
	        this.forEach(function(el){
	          if (excludes.indexOf(el) < 0) nodes.push(el)
	        })
	      }
	      return $(nodes)
	    },
	    has: function(selector){
	      return this.filter(function(){
	        return isObject(selector) ?
	          $.contains(this, selector) :
	          $(this).find(selector).size()
	      })
	    },
	    eq: function(idx){
	      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
	    },
	    first: function(){
	      var el = this[0]
	      return el && !isObject(el) ? el : $(el)
	    },
	    last: function(){
	      var el = this[this.length - 1]
	      return el && !isObject(el) ? el : $(el)
	    },
	    find: function(selector){
	      var result, $this = this
	      if (!selector) result = $()
	      else if (typeof selector == 'object')
	        result = $(selector).filter(function(){
	          var node = this
	          return emptyArray.some.call($this, function(parent){
	            return $.contains(parent, node)
	          })
	        })
	      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
	      else result = this.map(function(){ return zepto.qsa(this, selector) })
	      return result
	    },
	    closest: function(selector, context){
	      var nodes = [], collection = typeof selector == 'object' && $(selector)
	      this.each(function(_, node){
	        while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
	          node = node !== context && !isDocument(node) && node.parentNode
	        if (node && nodes.indexOf(node) < 0) nodes.push(node)
	      })
	      return $(nodes)
	    },
	    parents: function(selector){
	      var ancestors = [], nodes = this
	      while (nodes.length > 0)
	        nodes = $.map(nodes, function(node){
	          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
	            ancestors.push(node)
	            return node
	          }
	        })
	      return filtered(ancestors, selector)
	    },
	    parent: function(selector){
	      return filtered(uniq(this.pluck('parentNode')), selector)
	    },
	    children: function(selector){
	      return filtered(this.map(function(){ return children(this) }), selector)
	    },
	    contents: function() {
	      return this.map(function() { return slice.call(this.childNodes) })
	    },
	    siblings: function(selector){
	      return filtered(this.map(function(i, el){
	        return filter.call(children(el.parentNode), function(child){ return child!==el })
	      }), selector)
	    },
	    empty: function(){
	      return this.each(function(){ this.innerHTML = '' })
	    },
	    // `pluck` is borrowed from Prototype.js
	    pluck: function(property){
	      return $.map(this, function(el){ return el[property] })
	    },
	    show: function(){
	      return this.each(function(){
	        this.style.display == "none" && (this.style.display = '')
	        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
	          this.style.display = defaultDisplay(this.nodeName)
	      })
	    },
	    replaceWith: function(newContent){
	      return this.before(newContent).remove()
	    },
	    wrap: function(structure){
	      var func = isFunction(structure)
	      if (this[0] && !func)
	        var dom   = $(structure).get(0),
	            clone = dom.parentNode || this.length > 1
	
	      return this.each(function(index){
	        $(this).wrapAll(
	          func ? structure.call(this, index) :
	            clone ? dom.cloneNode(true) : dom
	        )
	      })
	    },
	    wrapAll: function(structure){
	      if (this[0]) {
	        $(this[0]).before(structure = $(structure))
	        var children
	        // drill down to the inmost element
	        while ((children = structure.children()).length) structure = children.first()
	        $(structure).append(this)
	      }
	      return this
	    },
	    wrapInner: function(structure){
	      var func = isFunction(structure)
	      return this.each(function(index){
	        var self = $(this), contents = self.contents(),
	            dom  = func ? structure.call(this, index) : structure
	        contents.length ? contents.wrapAll(dom) : self.append(dom)
	      })
	    },
	    unwrap: function(){
	      this.parent().each(function(){
	        $(this).replaceWith($(this).children())
	      })
	      return this
	    },
	    clone: function(){
	      return this.map(function(){ return this.cloneNode(true) })
	    },
	    hide: function(){
	      return this.css("display", "none")
	    },
	    toggle: function(setting){
	      return this.each(function(){
	        var el = $(this)
	        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
	      })
	    },
	    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
	    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
	    html: function(html){
	      return 0 in arguments ?
	        this.each(function(idx){
	          var originHtml = this.innerHTML
	          $(this).empty().append( funcArg(this, html, idx, originHtml) )
	        }) :
	        (0 in this ? this[0].innerHTML : null)
	    },
	    text: function(text){
	      return 0 in arguments ?
	        this.each(function(idx){
	          var newText = funcArg(this, text, idx, this.textContent)
	          this.textContent = newText == null ? '' : ''+newText
	        }) :
	        (0 in this ? this.pluck('textContent').join("") : null)
	    },
	    attr: function(name, value){
	      var result
	      return (typeof name == 'string' && !(1 in arguments)) ?
	        (!this.length || this[0].nodeType !== 1 ? undefined :
	          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
	        ) :
	        this.each(function(idx){
	          if (this.nodeType !== 1) return
	          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
	          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
	        })
	    },
	    removeAttr: function(name){
	      return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
	        setAttribute(this, attribute)
	      }, this)})
	    },
	    prop: function(name, value){
	      name = propMap[name] || name
	      return (1 in arguments) ?
	        this.each(function(idx){
	          this[name] = funcArg(this, value, idx, this[name])
	        }) :
	        (this[0] && this[0][name])
	    },
	    data: function(name, value){
	      var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()
	
	      var data = (1 in arguments) ?
	        this.attr(attrName, value) :
	        this.attr(attrName)
	
	      return data !== null ? deserializeValue(data) : undefined
	    },
	    val: function(value){
	      if (0 in arguments) {
	        if (value == null) value = ""
	        return this.each(function(idx){
	          this.value = funcArg(this, value, idx, this.value)
	        })
	      } else {
	        return this[0] && (this[0].multiple ?
	           $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
	           this[0].value)
	      }
	    },
	    offset: function(coordinates){
	      if (coordinates) return this.each(function(index){
	        var $this = $(this),
	            coords = funcArg(this, coordinates, index, $this.offset()),
	            parentOffset = $this.offsetParent().offset(),
	            props = {
	              top:  coords.top  - parentOffset.top,
	              left: coords.left - parentOffset.left
	            }
	
	        if ($this.css('position') == 'static') props['position'] = 'relative'
	        $this.css(props)
	      })
	      if (!this.length) return null
	      if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0]))
	        return {top: 0, left: 0}
	      var obj = this[0].getBoundingClientRect()
	      return {
	        left: obj.left + window.pageXOffset,
	        top: obj.top + window.pageYOffset,
	        width: Math.round(obj.width),
	        height: Math.round(obj.height)
	      }
	    },
	    css: function(property, value){
	      if (arguments.length < 2) {
	        var element = this[0]
	        if (typeof property == 'string') {
	          if (!element) return
	          return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property)
	        } else if (isArray(property)) {
	          if (!element) return
	          var props = {}
	          var computedStyle = getComputedStyle(element, '')
	          $.each(property, function(_, prop){
	            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
	          })
	          return props
	        }
	      }
	
	      var css = ''
	      if (type(property) == 'string') {
	        if (!value && value !== 0)
	          this.each(function(){ this.style.removeProperty(dasherize(property)) })
	        else
	          css = dasherize(property) + ":" + maybeAddPx(property, value)
	      } else {
	        for (key in property)
	          if (!property[key] && property[key] !== 0)
	            this.each(function(){ this.style.removeProperty(dasherize(key)) })
	          else
	            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
	      }
	
	      return this.each(function(){ this.style.cssText += ';' + css })
	    },
	    index: function(element){
	      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
	    },
	    hasClass: function(name){
	      if (!name) return false
	      return emptyArray.some.call(this, function(el){
	        return this.test(className(el))
	      }, classRE(name))
	    },
	    addClass: function(name){
	      if (!name) return this
	      return this.each(function(idx){
	        if (!('className' in this)) return
	        classList = []
	        var cls = className(this), newName = funcArg(this, name, idx, cls)
	        newName.split(/\s+/g).forEach(function(klass){
	          if (!$(this).hasClass(klass)) classList.push(klass)
	        }, this)
	        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
	      })
	    },
	    removeClass: function(name){
	      return this.each(function(idx){
	        if (!('className' in this)) return
	        if (name === undefined) return className(this, '')
	        classList = className(this)
	        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
	          classList = classList.replace(classRE(klass), " ")
	        })
	        className(this, classList.trim())
	      })
	    },
	    toggleClass: function(name, when){
	      if (!name) return this
	      return this.each(function(idx){
	        var $this = $(this), names = funcArg(this, name, idx, className(this))
	        names.split(/\s+/g).forEach(function(klass){
	          (when === undefined ? !$this.hasClass(klass) : when) ?
	            $this.addClass(klass) : $this.removeClass(klass)
	        })
	      })
	    },
	    scrollTop: function(value){
	      if (!this.length) return
	      var hasScrollTop = 'scrollTop' in this[0]
	      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
	      return this.each(hasScrollTop ?
	        function(){ this.scrollTop = value } :
	        function(){ this.scrollTo(this.scrollX, value) })
	    },
	    scrollLeft: function(value){
	      if (!this.length) return
	      var hasScrollLeft = 'scrollLeft' in this[0]
	      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
	      return this.each(hasScrollLeft ?
	        function(){ this.scrollLeft = value } :
	        function(){ this.scrollTo(value, this.scrollY) })
	    },
	    position: function() {
	      if (!this.length) return
	
	      var elem = this[0],
	        // Get *real* offsetParent
	        offsetParent = this.offsetParent(),
	        // Get correct offsets
	        offset       = this.offset(),
	        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()
	
	      // Subtract element margins
	      // note: when an element has margin: auto the offsetLeft and marginLeft
	      // are the same in Safari causing offset.left to incorrectly be 0
	      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
	      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0
	
	      // Add offsetParent borders
	      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
	      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0
	
	      // Subtract the two offsets
	      return {
	        top:  offset.top  - parentOffset.top,
	        left: offset.left - parentOffset.left
	      }
	    },
	    offsetParent: function() {
	      return this.map(function(){
	        var parent = this.offsetParent || document.body
	        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
	          parent = parent.offsetParent
	        return parent
	      })
	    }
	  }
	
	  // for now
	  $.fn.detach = $.fn.remove
	
	  // Generate the `width` and `height` functions
	  ;['width', 'height'].forEach(function(dimension){
	    var dimensionProperty =
	      dimension.replace(/./, function(m){ return m[0].toUpperCase() })
	
	    $.fn[dimension] = function(value){
	      var offset, el = this[0]
	      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
	        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
	        (offset = this.offset()) && offset[dimension]
	      else return this.each(function(idx){
	        el = $(this)
	        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
	      })
	    }
	  })
	
	  function traverseNode(node, fun) {
	    fun(node)
	    for (var i = 0, len = node.childNodes.length; i < len; i++)
	      traverseNode(node.childNodes[i], fun)
	  }
	
	  // Generate the `after`, `prepend`, `before`, `append`,
	  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
	  adjacencyOperators.forEach(function(operator, operatorIndex) {
	    var inside = operatorIndex % 2 //=> prepend, append
	
	    $.fn[operator] = function(){
	      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
	      var argType, nodes = $.map(arguments, function(arg) {
	            var arr = []
	            argType = type(arg)
	            if (argType == "array") {
	              arg.forEach(function(el) {
	                if (el.nodeType !== undefined) return arr.push(el)
	                else if ($.zepto.isZ(el)) return arr = arr.concat(el.get())
	                arr = arr.concat(zepto.fragment(el))
	              })
	              return arr
	            }
	            return argType == "object" || arg == null ?
	              arg : zepto.fragment(arg)
	          }),
	          parent, copyByClone = this.length > 1
	      if (nodes.length < 1) return this
	
	      return this.each(function(_, target){
	        parent = inside ? target : target.parentNode
	
	        // convert all methods to a "before" operation
	        target = operatorIndex == 0 ? target.nextSibling :
	                 operatorIndex == 1 ? target.firstChild :
	                 operatorIndex == 2 ? target :
	                 null
	
	        var parentInDocument = $.contains(document.documentElement, parent)
	
	        nodes.forEach(function(node){
	          if (copyByClone) node = node.cloneNode(true)
	          else if (!parent) return $(node).remove()
	
	          parent.insertBefore(node, target)
	          if (parentInDocument) traverseNode(node, function(el){
	            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
	               (!el.type || el.type === 'text/javascript') && !el.src){
	              var target = el.ownerDocument ? el.ownerDocument.defaultView : window
	              target['eval'].call(target, el.innerHTML)
	            }
	          })
	        })
	      })
	    }
	
	    // after    => insertAfter
	    // prepend  => prependTo
	    // before   => insertBefore
	    // append   => appendTo
	    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
	      $(html)[operator](this)
	      return this
	    }
	  })
	
	  zepto.Z.prototype = $.fn
	
	  // Export internal API functions in the `$.zepto` namespace
	  zepto.uniq = uniq
	  zepto.deserializeValue = deserializeValue
	  $.zepto = zepto
	
	  return $
	})()
	
	window.Zepto = Zepto
	window.$ === undefined && (window.$ = Zepto)
	
	;(function($){
	  var _zid = 1, undefined,
	      slice = Array.prototype.slice,
	      isFunction = $.isFunction,
	      isString = function(obj){ return typeof obj == 'string' },
	      handlers = {},
	      specialEvents={},
	      focusinSupported = 'onfocusin' in window,
	      focus = { focus: 'focusin', blur: 'focusout' },
	      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }
	
	  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'
	
	  function zid(element) {
	    return element._zid || (element._zid = _zid++)
	  }
	  function findHandlers(element, event, fn, selector) {
	    event = parse(event)
	    if (event.ns) var matcher = matcherFor(event.ns)
	    return (handlers[zid(element)] || []).filter(function(handler) {
	      return handler
	        && (!event.e  || handler.e == event.e)
	        && (!event.ns || matcher.test(handler.ns))
	        && (!fn       || zid(handler.fn) === zid(fn))
	        && (!selector || handler.sel == selector)
	    })
	  }
	  function parse(event) {
	    var parts = ('' + event).split('.')
	    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
	  }
	  function matcherFor(ns) {
	    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
	  }
	
	  function eventCapture(handler, captureSetting) {
	    return handler.del &&
	      (!focusinSupported && (handler.e in focus)) ||
	      !!captureSetting
	  }
	
	  function realEvent(type) {
	    return hover[type] || (focusinSupported && focus[type]) || type
	  }
	
	  function add(element, events, fn, data, selector, delegator, capture){
	    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
	    events.split(/\s/).forEach(function(event){
	      if (event == 'ready') return $(document).ready(fn)
	      var handler   = parse(event)
	      handler.fn    = fn
	      handler.sel   = selector
	      // emulate mouseenter, mouseleave
	      if (handler.e in hover) fn = function(e){
	        var related = e.relatedTarget
	        if (!related || (related !== this && !$.contains(this, related)))
	          return handler.fn.apply(this, arguments)
	      }
	      handler.del   = delegator
	      var callback  = delegator || fn
	      handler.proxy = function(e){
	        e = compatible(e)
	        if (e.isImmediatePropagationStopped()) return
	        e.data = data
	        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
	        if (result === false) e.preventDefault(), e.stopPropagation()
	        return result
	      }
	      handler.i = set.length
	      set.push(handler)
	      if ('addEventListener' in element)
	        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
	    })
	  }
	  function remove(element, events, fn, selector, capture){
	    var id = zid(element)
	    ;(events || '').split(/\s/).forEach(function(event){
	      findHandlers(element, event, fn, selector).forEach(function(handler){
	        delete handlers[id][handler.i]
	      if ('removeEventListener' in element)
	        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
	      })
	    })
	  }
	
	  $.event = { add: add, remove: remove }
	
	  $.proxy = function(fn, context) {
	    var args = (2 in arguments) && slice.call(arguments, 2)
	    if (isFunction(fn)) {
	      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
	      proxyFn._zid = zid(fn)
	      return proxyFn
	    } else if (isString(context)) {
	      if (args) {
	        args.unshift(fn[context], fn)
	        return $.proxy.apply(null, args)
	      } else {
	        return $.proxy(fn[context], fn)
	      }
	    } else {
	      throw new TypeError("expected function")
	    }
	  }
	
	  $.fn.bind = function(event, data, callback){
	    return this.on(event, data, callback)
	  }
	  $.fn.unbind = function(event, callback){
	    return this.off(event, callback)
	  }
	  $.fn.one = function(event, selector, data, callback){
	    return this.on(event, selector, data, callback, 1)
	  }
	
	  var returnTrue = function(){return true},
	      returnFalse = function(){return false},
	      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
	      eventMethods = {
	        preventDefault: 'isDefaultPrevented',
	        stopImmediatePropagation: 'isImmediatePropagationStopped',
	        stopPropagation: 'isPropagationStopped'
	      }
	
	  function compatible(event, source) {
	    if (source || !event.isDefaultPrevented) {
	      source || (source = event)
	
	      $.each(eventMethods, function(name, predicate) {
	        var sourceMethod = source[name]
	        event[name] = function(){
	          this[predicate] = returnTrue
	          return sourceMethod && sourceMethod.apply(source, arguments)
	        }
	        event[predicate] = returnFalse
	      })
	
	      event.timeStamp || (event.timeStamp = Date.now())
	
	      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
	          'returnValue' in source ? source.returnValue === false :
	          source.getPreventDefault && source.getPreventDefault())
	        event.isDefaultPrevented = returnTrue
	    }
	    return event
	  }
	
	  function createProxy(event) {
	    var key, proxy = { originalEvent: event }
	    for (key in event)
	      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]
	
	    return compatible(proxy, event)
	  }
	
	  $.fn.delegate = function(selector, event, callback){
	    return this.on(event, selector, callback)
	  }
	  $.fn.undelegate = function(selector, event, callback){
	    return this.off(event, selector, callback)
	  }
	
	  $.fn.live = function(event, callback){
	    $(document.body).delegate(this.selector, event, callback)
	    return this
	  }
	  $.fn.die = function(event, callback){
	    $(document.body).undelegate(this.selector, event, callback)
	    return this
	  }
	
	  $.fn.on = function(event, selector, data, callback, one){
	    var autoRemove, delegator, $this = this
	    if (event && !isString(event)) {
	      $.each(event, function(type, fn){
	        $this.on(type, selector, data, fn, one)
	      })
	      return $this
	    }
	
	    if (!isString(selector) && !isFunction(callback) && callback !== false)
	      callback = data, data = selector, selector = undefined
	    if (callback === undefined || data === false)
	      callback = data, data = undefined
	
	    if (callback === false) callback = returnFalse
	
	    return $this.each(function(_, element){
	      if (one) autoRemove = function(e){
	        remove(element, e.type, callback)
	        return callback.apply(this, arguments)
	      }
	
	      if (selector) delegator = function(e){
	        var evt, match = $(e.target).closest(selector, element).get(0)
	        if (match && match !== element) {
	          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
	          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
	        }
	      }
	
	      add(element, event, callback, data, selector, delegator || autoRemove)
	    })
	  }
	  $.fn.off = function(event, selector, callback){
	    var $this = this
	    if (event && !isString(event)) {
	      $.each(event, function(type, fn){
	        $this.off(type, selector, fn)
	      })
	      return $this
	    }
	
	    if (!isString(selector) && !isFunction(callback) && callback !== false)
	      callback = selector, selector = undefined
	
	    if (callback === false) callback = returnFalse
	
	    return $this.each(function(){
	      remove(this, event, callback, selector)
	    })
	  }
	
	  $.fn.trigger = function(event, args){
	    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
	    event._args = args
	    return this.each(function(){
	      // handle focus(), blur() by calling them directly
	      if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
	      // items in the collection might not be DOM elements
	      else if ('dispatchEvent' in this) this.dispatchEvent(event)
	      else $(this).triggerHandler(event, args)
	    })
	  }
	
	  // triggers event handlers on current element just as if an event occurred,
	  // doesn't trigger an actual event, doesn't bubble
	  $.fn.triggerHandler = function(event, args){
	    var e, result
	    this.each(function(i, element){
	      e = createProxy(isString(event) ? $.Event(event) : event)
	      e._args = args
	      e.target = element
	      $.each(findHandlers(element, event.type || event), function(i, handler){
	        result = handler.proxy(e)
	        if (e.isImmediatePropagationStopped()) return false
	      })
	    })
	    return result
	  }
	
	  // shortcut methods for `.bind(event, fn)` for each event type
	  ;('focusin focusout focus blur load resize scroll unload click dblclick '+
	  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
	  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
	    $.fn[event] = function(callback) {
	      return (0 in arguments) ?
	        this.bind(event, callback) :
	        this.trigger(event)
	    }
	  })
	
	  $.Event = function(type, props) {
	    if (!isString(type)) props = type, type = props.type
	    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
	    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
	    event.initEvent(type, bubbles, true)
	    return compatible(event)
	  }
	
	})(Zepto)
	
	;(function($){
	  var jsonpID = +new Date(),
	      document = window.document,
	      key,
	      name,
	      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	      scriptTypeRE = /^(?:text|application)\/javascript/i,
	      xmlTypeRE = /^(?:text|application)\/xml/i,
	      jsonType = 'application/json',
	      htmlType = 'text/html',
	      blankRE = /^\s*$/,
	      originAnchor = document.createElement('a')
	
	  originAnchor.href = window.location.href
	
	  // trigger a custom event and return false if it was cancelled
	  function triggerAndReturn(context, eventName, data) {
	    var event = $.Event(eventName)
	    $(context).trigger(event, data)
	    return !event.isDefaultPrevented()
	  }
	
	  // trigger an Ajax "global" event
	  function triggerGlobal(settings, context, eventName, data) {
	    if (settings.global) return triggerAndReturn(context || document, eventName, data)
	  }
	
	  // Number of active Ajax requests
	  $.active = 0
	
	  function ajaxStart(settings) {
	    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
	  }
	  function ajaxStop(settings) {
	    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
	  }
	
	  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
	  function ajaxBeforeSend(xhr, settings) {
	    var context = settings.context
	    if (settings.beforeSend.call(context, xhr, settings) === false ||
	        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
	      return false
	
	    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
	  }
	  function ajaxSuccess(data, xhr, settings, deferred) {
	    var context = settings.context, status = 'success'
	    settings.success.call(context, data, status, xhr)
	    if (deferred) deferred.resolveWith(context, [data, status, xhr])
	    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
	    ajaxComplete(status, xhr, settings)
	  }
	  // type: "timeout", "error", "abort", "parsererror"
	  function ajaxError(error, type, xhr, settings, deferred) {
	    var context = settings.context
	    settings.error.call(context, xhr, type, error)
	    if (deferred) deferred.rejectWith(context, [xhr, type, error])
	    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
	    ajaxComplete(type, xhr, settings)
	  }
	  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
	  function ajaxComplete(status, xhr, settings) {
	    var context = settings.context
	    settings.complete.call(context, xhr, status)
	    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
	    ajaxStop(settings)
	  }
	
	  // Empty function, used as default callback
	  function empty() {}
	
	  $.ajaxJSONP = function(options, deferred){
	    if (!('type' in options)) return $.ajax(options)
	
	    var _callbackName = options.jsonpCallback,
	      callbackName = ($.isFunction(_callbackName) ?
	        _callbackName() : _callbackName) || ('Zepto' + (jsonpID++)),
	      script = document.createElement('script'),
	      originalCallback = window[callbackName],
	      responseData,
	      abort = function(errorType) {
	        $(script).triggerHandler('error', errorType || 'abort')
	      },
	      xhr = { abort: abort }, abortTimeout
	
	    if (deferred) deferred.promise(xhr)
	
	    $(script).on('load error', function(e, errorType){
	      clearTimeout(abortTimeout)
	      $(script).off().remove()
	
	      if (e.type == 'error' || !responseData) {
	        ajaxError(null, errorType || 'error', xhr, options, deferred)
	      } else {
	        ajaxSuccess(responseData[0], xhr, options, deferred)
	      }
	
	      window[callbackName] = originalCallback
	      if (responseData && $.isFunction(originalCallback))
	        originalCallback(responseData[0])
	
	      originalCallback = responseData = undefined
	    })
	
	    if (ajaxBeforeSend(xhr, options) === false) {
	      abort('abort')
	      return xhr
	    }
	
	    window[callbackName] = function(){
	      responseData = arguments
	    }
	
	    script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
	    document.head.appendChild(script)
	
	    if (options.timeout > 0) abortTimeout = setTimeout(function(){
	      abort('timeout')
	    }, options.timeout)
	
	    return xhr
	  }
	
	  $.ajaxSettings = {
	    // Default type of request
	    type: 'GET',
	    // Callback that is executed before request
	    beforeSend: empty,
	    // Callback that is executed if the request succeeds
	    success: empty,
	    // Callback that is executed the the server drops error
	    error: empty,
	    // Callback that is executed on request complete (both: error and success)
	    complete: empty,
	    // The context for the callbacks
	    context: null,
	    // Whether to trigger "global" Ajax events
	    global: true,
	    // Transport
	    xhr: function () {
	      return new window.XMLHttpRequest()
	    },
	    // MIME types mapping
	    // IIS returns Javascript as "application/x-javascript"
	    accepts: {
	      script: 'text/javascript, application/javascript, application/x-javascript',
	      json:   jsonType,
	      xml:    'application/xml, text/xml',
	      html:   htmlType,
	      text:   'text/plain'
	    },
	    // Whether the request is to another domain
	    crossDomain: false,
	    // Default timeout
	    timeout: 0,
	    // Whether data should be serialized to string
	    processData: true,
	    // Whether the browser should be allowed to cache GET responses
	    cache: true
	  }
	
	  function mimeToDataType(mime) {
	    if (mime) mime = mime.split(';', 2)[0]
	    return mime && ( mime == htmlType ? 'html' :
	      mime == jsonType ? 'json' :
	      scriptTypeRE.test(mime) ? 'script' :
	      xmlTypeRE.test(mime) && 'xml' ) || 'text'
	  }
	
	  function appendQuery(url, query) {
	    if (query == '') return url
	    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
	  }
	
	  // serialize payload and append it to the URL for GET requests
	  function serializeData(options) {
	    if (options.processData && options.data && $.type(options.data) != "string")
	      options.data = $.param(options.data, options.traditional)
	    if (options.data && (!options.type || options.type.toUpperCase() == 'GET' || 'jsonp' == options.dataType))
	      options.url = appendQuery(options.url, options.data), options.data = undefined
	  }
	
	  $.ajax = function(options){
	    var settings = $.extend({}, options || {}),
	        deferred = $.Deferred && $.Deferred(),
	        urlAnchor, hashIndex
	    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]
	
	    ajaxStart(settings)
	
	    if (!settings.crossDomain) {
	      urlAnchor = document.createElement('a')
	      urlAnchor.href = settings.url
	      // cleans up URL for .href (IE only), see https://github.com/madrobby/zepto/pull/1049
	      urlAnchor.href = urlAnchor.href
	      settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
	    }
	
	    if (!settings.url) settings.url = window.location.toString()
	    if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex)
	    serializeData(settings)
	
	    var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
	    if (hasPlaceholder) dataType = 'jsonp'
	
	    if (settings.cache === false || (
	         (!options || options.cache !== true) &&
	         ('script' == dataType || 'jsonp' == dataType)
	        ))
	      settings.url = appendQuery(settings.url, '_=' + Date.now())
	
	    if ('jsonp' == dataType) {
	      if (!hasPlaceholder)
	        settings.url = appendQuery(settings.url,
	          settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
	      return $.ajaxJSONP(settings, deferred)
	    }
	
	    var mime = settings.accepts[dataType],
	        headers = { },
	        setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
	        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
	        xhr = settings.xhr(),
	        nativeSetHeader = xhr.setRequestHeader,
	        abortTimeout
	
	    if (deferred) deferred.promise(xhr)
	
	    if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
	    setHeader('Accept', mime || '*/*')
	    if (mime = settings.mimeType || mime) {
	      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
	      xhr.overrideMimeType && xhr.overrideMimeType(mime)
	    }
	    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
	      setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')
	
	    if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
	    xhr.setRequestHeader = setHeader
	
	    xhr.onreadystatechange = function(){
	      if (xhr.readyState == 4) {
	        xhr.onreadystatechange = empty
	        clearTimeout(abortTimeout)
	        var result, error = false
	        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
	          dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
	
	          if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob')
	            result = xhr.response
	          else {
	            result = xhr.responseText
	
	            try {
	              // http://perfectionkills.com/global-eval-what-are-the-options/
	              if (dataType == 'script')    (1,eval)(result)
	              else if (dataType == 'xml')  result = xhr.responseXML
	              else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
	            } catch (e) { error = e }
	
	            if (error) return ajaxError(error, 'parsererror', xhr, settings, deferred)
	          }
	
	          ajaxSuccess(result, xhr, settings, deferred)
	        } else {
	          ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
	        }
	      }
	    }
	
	    if (ajaxBeforeSend(xhr, settings) === false) {
	      xhr.abort()
	      ajaxError(null, 'abort', xhr, settings, deferred)
	      return xhr
	    }
	
	    var async = 'async' in settings ? settings.async : true
	    xhr.open(settings.type, settings.url, async, settings.username, settings.password)
	
	    if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]
	
	    for (name in headers) nativeSetHeader.apply(xhr, headers[name])
	
	    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
	        xhr.onreadystatechange = empty
	        xhr.abort()
	        ajaxError(null, 'timeout', xhr, settings, deferred)
	      }, settings.timeout)
	
	    // avoid sending empty string (#319)
	    xhr.send(settings.data ? settings.data : null)
	    return xhr
	  }
	
	  // handle optional data/success arguments
	  function parseArguments(url, data, success, dataType) {
	    if ($.isFunction(data)) dataType = success, success = data, data = undefined
	    if (!$.isFunction(success)) dataType = success, success = undefined
	    return {
	      url: url
	    , data: data
	    , success: success
	    , dataType: dataType
	    }
	  }
	
	  $.get = function(/* url, data, success, dataType */){
	    return $.ajax(parseArguments.apply(null, arguments))
	  }
	
	  $.post = function(/* url, data, success, dataType */){
	    var options = parseArguments.apply(null, arguments)
	    options.type = 'POST'
	    return $.ajax(options)
	  }
	
	  $.getJSON = function(/* url, data, success */){
	    var options = parseArguments.apply(null, arguments)
	    options.dataType = 'json'
	    return $.ajax(options)
	  }
	
	  $.fn.load = function(url, data, success){
	    if (!this.length) return this
	    var self = this, parts = url.split(/\s/), selector,
	        options = parseArguments(url, data, success),
	        callback = options.success
	    if (parts.length > 1) options.url = parts[0], selector = parts[1]
	    options.success = function(response){
	      self.html(selector ?
	        $('<div>').html(response.replace(rscript, "")).find(selector)
	        : response)
	      callback && callback.apply(self, arguments)
	    }
	    $.ajax(options)
	    return this
	  }
	
	  var escape = encodeURIComponent
	
	  function serialize(params, obj, traditional, scope){
	    var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
	    $.each(obj, function(key, value) {
	      type = $.type(value)
	      if (scope) key = traditional ? scope :
	        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
	      // handle data in serializeArray() format
	      if (!scope && array) params.add(value.name, value.value)
	      // recurse into nested objects
	      else if (type == "array" || (!traditional && type == "object"))
	        serialize(params, value, traditional, key)
	      else params.add(key, value)
	    })
	  }
	
	  $.param = function(obj, traditional){
	    var params = []
	    params.add = function(key, value) {
	      if ($.isFunction(value)) value = value()
	      if (value == null) value = ""
	      this.push(escape(key) + '=' + escape(value))
	    }
	    serialize(params, obj, traditional)
	    return params.join('&').replace(/%20/g, '+')
	  }
	})(Zepto)
	
	;(function($){
	  $.fn.serializeArray = function() {
	    var name, type, result = [],
	      add = function(value) {
	        if (value.forEach) return value.forEach(add)
	        result.push({ name: name, value: value })
	      }
	    if (this[0]) $.each(this[0].elements, function(_, field){
	      type = field.type, name = field.name
	      if (name && field.nodeName.toLowerCase() != 'fieldset' &&
	        !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
	        ((type != 'radio' && type != 'checkbox') || field.checked))
	          add($(field).val())
	    })
	    return result
	  }
	
	  $.fn.serialize = function(){
	    var result = []
	    this.serializeArray().forEach(function(elm){
	      result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
	    })
	    return result.join('&')
	  }
	
	  $.fn.submit = function(callback) {
	    if (0 in arguments) this.bind('submit', callback)
	    else if (this.length) {
	      var event = $.Event('submit')
	      this.eq(0).trigger(event)
	      if (!event.isDefaultPrevented()) this.get(0).submit()
	    }
	    return this
	  }
	
	})(Zepto)
	
	;(function($){
	  // __proto__ doesn't exist on IE<11, so redefine
	  // the Z function to use object extension instead
	  if (!('__proto__' in {})) {
	    $.extend($.zepto, {
	      Z: function(dom, selector){
	        dom = dom || []
	        $.extend(dom, $.fn)
	        dom.selector = selector || ''
	        dom.__Z = true
	        return dom
	      },
	      // this is a kludge but works
	      isZ: function(object){
	        return $.type(object) === 'array' && '__Z' in object
	      }
	    })
	  }
	
	  // getComputedStyle shouldn't freak out when called
	  // without a valid element as argument
	  try {
	    getComputedStyle(undefined)
	  } catch(e) {
	    var nativeGetComputedStyle = getComputedStyle
	    window.getComputedStyle = function(element, pseudoElement){
	      try {
	        return nativeGetComputedStyle(element, pseudoElement)
	      } catch(e) {
	        return null
	      }
	    }
	  }
	})(Zepto)
	
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.
	
	;(function($){
	  var touch = {},
	      touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
	      longTapDelay = 750,
	      gesture
	
	  function swipeDirection(x1, x2, y1, y2) {
	    return Math.abs(x1 - x2) >=
	    Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
	  }
	
	  function longTap() {
	    longTapTimeout = null
	    if (touch.last) {
	      touch.el.trigger('longTap')
	      touch = {}
	    }
	  }
	
	  function cancelLongTap() {
	    if (longTapTimeout) clearTimeout(longTapTimeout)
	    longTapTimeout = null
	  }
	
	  function cancelAll() {
	    if (touchTimeout) clearTimeout(touchTimeout)
	    if (tapTimeout) clearTimeout(tapTimeout)
	    if (swipeTimeout) clearTimeout(swipeTimeout)
	    if (longTapTimeout) clearTimeout(longTapTimeout)
	    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
	    touch = {}
	  }
	
	  function isPrimaryTouch(event){
	    return (event.pointerType == 'touch' ||
	        event.pointerType == event.MSPOINTER_TYPE_TOUCH)
	        && event.isPrimary
	  }
	
	  function isPointerEventType(e, type){
	    return (e.type == 'pointer'+type ||
	    e.type.toLowerCase() == 'mspointer'+type)
	  }
	
	  $(document).ready(function(){
	    var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType
	
	    if ('MSGesture' in window) {
	      gesture = new MSGesture()
	      gesture.target = document.body
	    }
	
	    $(document)
	        .bind('MSGestureEnd', function(e){
	          var swipeDirectionFromVelocity =
	              e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null
	          if (swipeDirectionFromVelocity) {
	            touch.el.trigger('swipe')
	            touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
	          }
	        })
	        .on('touchstart MSPointerDown pointerdown', function(e){
	          if((_isPointerType = isPointerEventType(e, 'down')) &&
	              !isPrimaryTouch(e)) return
	          firstTouch = _isPointerType ? e : e.touches[0]
	          if (e.touches && e.touches.length === 1 && touch.x2) {
	            // Clear out touch movement data if we have it sticking around
	            // This can occur if touchcancel doesn't fire due to preventDefault, etc.
	            touch.x2 = undefined
	            touch.y2 = undefined
	          }
	          now = Date.now()
	          delta = now - (touch.last || now)
	          touch.el = $('tagName' in firstTouch.target ?
	              firstTouch.target : firstTouch.target.parentNode)
	          touchTimeout && clearTimeout(touchTimeout)
	          touch.x1 = firstTouch.pageX
	          touch.y1 = firstTouch.pageY
	          if (delta > 0 && delta <= 250) touch.isDoubleTap = true
	          touch.last = now
	          longTapTimeout = setTimeout(longTap, longTapDelay)
	          // adds the current touch contact for IE gesture recognition
	          if (gesture && _isPointerType) gesture.addPointer(e.pointerId)
	        })
	        .on('touchmove MSPointerMove pointermove', function(e){
	          if((_isPointerType = isPointerEventType(e, 'move')) &&
	              !isPrimaryTouch(e)) return
	          firstTouch = _isPointerType ? e : e.touches[0]
	          cancelLongTap()
	          touch.x2 = firstTouch.pageX
	          touch.y2 = firstTouch.pageY
	
	          deltaX += Math.abs(touch.x1 - touch.x2)
	          deltaY += Math.abs(touch.y1 - touch.y2)
	        })
	        .on('touchend MSPointerUp pointerup', function(e){
	          if((_isPointerType = isPointerEventType(e, 'up')) &&
	              !isPrimaryTouch(e)) return
	          cancelLongTap()
	
	          // swipe
	          if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
	              (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))
	
	            swipeTimeout = setTimeout(function() {
	              if (touch.el){
	                touch.el.trigger('swipe')
	                touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
	              }
	              touch = {}
	            }, 0)
	
	          // normal tap
	          else if ('last' in touch)
	          // don't fire tap when delta position changed by more than 30 pixels,
	          // for instance when moving to a point and back to origin
	            if (deltaX < 30 && deltaY < 30) {
	              // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
	              // ('tap' fires before 'scroll')
	              tapTimeout = setTimeout(function() {
	
	                // trigger universal 'tap' with the option to cancelTouch()
	                // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
	                var event = $.Event('tap')
	                event.cancelTouch = cancelAll
	                // [by paper] fix -> "TypeError: 'undefined' is not an object (evaluating 'touch.el.trigger'), when double tap
	                if (touch.el) touch.el.trigger(event)
	
	                // trigger double tap immediately
	                if (touch.isDoubleTap) {
	                  if (touch.el) touch.el.trigger('doubleTap')
	                  touch = {}
	                }
	
	                // trigger single tap after 250ms of inactivity
	                else {
	                  touchTimeout = setTimeout(function(){
	                    touchTimeout = null
	                    if (touch.el) touch.el.trigger('singleTap')
	                    touch = {}
	                  }, 250)
	                }
	              }, 0)
	            } else {
	              touch = {}
	            }
	          deltaX = deltaY = 0
	
	        })
	        // when the browser window loses focus,
	        // for example when a modal dialog is shown,
	        // cancel all ongoing events
	        .on('touchcancel MSPointerCancel pointercancel', cancelAll)
	
	    // scrolling the window indicates intention of the user
	    // to scroll, not tap or swipe, so cancel all ongoing events
	    $(window).on('scroll', cancelAll)
	  })
	
	  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
	    'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
	    $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
	  })
	})(Zepto)
	
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.
	
	;(function($, undefined){
	  var prefix = '', eventPrefix,
	      vendors = { Webkit: 'webkit', Moz: '', O: 'o' },
	      testEl = document.createElement('div'),
	      supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
	      transform,
	      transitionProperty, transitionDuration, transitionTiming, transitionDelay,
	      animationName, animationDuration, animationTiming, animationDelay,
	      cssReset = {}
	
	  function dasherize(str) { return str.replace(/([A-Z])/g, '-$1').toLowerCase() }
	  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : name.toLowerCase() }
	
	  if (testEl.style.transform === undefined) $.each(vendors, function(vendor, event){
	    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
	      prefix = '-' + vendor.toLowerCase() + '-'
	      eventPrefix = event
	      return false
	    }
	  })
	
	  transform = prefix + 'transform'
	  cssReset[transitionProperty = prefix + 'transition-property'] =
	      cssReset[transitionDuration = prefix + 'transition-duration'] =
	          cssReset[transitionDelay    = prefix + 'transition-delay'] =
	              cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
	                  cssReset[animationName      = prefix + 'animation-name'] =
	                      cssReset[animationDuration  = prefix + 'animation-duration'] =
	                          cssReset[animationDelay     = prefix + 'animation-delay'] =
	                              cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''
	
	  $.fx = {
	    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
	    speeds: { _default: 400, fast: 200, slow: 600 },
	    cssPrefix: prefix,
	    transitionEnd: normalizeEvent('TransitionEnd'),
	    animationEnd: normalizeEvent('AnimationEnd')
	  }
	
	  $.fn.animate = function(properties, duration, ease, callback, delay){
	    if ($.isFunction(duration))
	      callback = duration, ease = undefined, duration = undefined
	    if ($.isFunction(ease))
	      callback = ease, ease = undefined
	    if ($.isPlainObject(duration))
	      ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
	    if (duration) duration = (typeof duration == 'number' ? duration :
	            ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
	    if (delay) delay = parseFloat(delay) / 1000
	    return this.anim(properties, duration, ease, callback, delay)
	  }
	
	  $.fn.anim = function(properties, duration, ease, callback, delay){
	    var key, cssValues = {}, cssProperties, transforms = '',
	        that = this, wrappedCallback, endEvent = $.fx.transitionEnd,
	        fired = false
	
	    if (duration === undefined) duration = $.fx.speeds._default / 1000
	    if (delay === undefined) delay = 0
	    if ($.fx.off) duration = 0
	
	    if (typeof properties == 'string') {
	      // keyframe animation
	      cssValues[animationName] = properties
	      cssValues[animationDuration] = duration + 's'
	      cssValues[animationDelay] = delay + 's'
	      cssValues[animationTiming] = (ease || 'linear')
	      endEvent = $.fx.animationEnd
	    } else {
	      cssProperties = []
	      // CSS transitions
	      for (key in properties)
	        if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
	        else cssValues[key] = properties[key], cssProperties.push(dasherize(key))
	
	      if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
	      if (duration > 0 && typeof properties === 'object') {
	        cssValues[transitionProperty] = cssProperties.join(', ')
	        cssValues[transitionDuration] = duration + 's'
	        cssValues[transitionDelay] = delay + 's'
	        cssValues[transitionTiming] = (ease || 'linear')
	      }
	    }
	
	    wrappedCallback = function(event){
	      if (typeof event !== 'undefined') {
	        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
	        $(event.target).unbind(endEvent, wrappedCallback)
	      } else
	        $(this).unbind(endEvent, wrappedCallback) // triggered by setTimeout
	
	      fired = true
	      $(this).css(cssReset)
	      callback && callback.call(this)
	    }
	    if (duration > 0){
	      this.bind(endEvent, wrappedCallback)
	      // transitionEnd is not always firing on older Android phones
	      // so make sure it gets fired
	      setTimeout(function(){
	        if (fired) return
	        wrappedCallback.call(that)
	      }, ((duration + delay) * 1000) + 25)
	    }
	
	    // trigger page reflow so new elements can animate
	    this.size() && this.get(0).clientLeft
	
	    this.css(cssValues)
	
	    if (duration <= 0) setTimeout(function() {
	      that.each(function(){ wrappedCallback.call(this) })
	    }, 0)
	
	    return this
	  }
	
	  testEl = null
	})(Zepto)
	
	
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.
	
	;(function($, undefined){
	  var document = window.document, docElem = document.documentElement,
	      origShow = $.fn.show, origHide = $.fn.hide, origToggle = $.fn.toggle
	
	  function anim(el, speed, opacity, scale, callback) {
	    if (typeof speed == 'function' && !callback) callback = speed, speed = undefined
	    var props = { opacity: opacity }
	    if (scale) {
	      props.scale = scale
	      el.css($.fx.cssPrefix + 'transform-origin', '0 0')
	    }
	    return el.animate(props, speed, null, callback)
	  }
	
	  function hide(el, speed, scale, callback) {
	    return anim(el, speed, 0, scale, function(){
	      origHide.call($(this))
	      callback && callback.call(this)
	    })
	  }
	
	  $.fn.show = function(speed, callback) {
	    origShow.call(this)
	    if (speed === undefined) speed = 0
	    else this.css('opacity', 0)
	    return anim(this, speed, 1, '1,1', callback)
	  }
	
	  $.fn.hide = function(speed, callback) {
	    if (speed === undefined) return origHide.call(this)
	    else return hide(this, speed, '0,0', callback)
	  }
	
	  $.fn.toggle = function(speed, callback) {
	    if (speed === undefined || typeof speed == 'boolean')
	      return origToggle.call(this, speed)
	    else return this.each(function(){
	      var el = $(this)
	      el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback)
	    })
	  }
	
	  $.fn.fadeTo = function(speed, opacity, callback) {
	    return anim(this, speed, opacity, null, callback)
	  }
	
	  $.fn.fadeIn = function(speed, callback) {
	    var target = this.css('opacity')
	    if (target > 0) this.css('opacity', 0)
	    else target = 1
	    return origShow.call(this).fadeTo(speed, target, callback)
	  }
	
	  $.fn.fadeOut = function(speed, callback) {
	    return hide(this, speed, null, callback)
	  }
	
	  $.fn.fadeToggle = function(speed, callback) {
	    return this.each(function(){
	      var el = $(this)
	      el[
	          (el.css('opacity') == 0 || el.css('display') == 'none') ? 'fadeIn' : 'fadeOut'
	          ](speed, callback)
	    })
	  }
	
	})(Zepto)
	
	window.Zepto = Zepto
	'$' in window || (window.$ = Zepto)
	
	if ( true ) {
	  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () { return Zepto; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}


/***/ },
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {module.exports = function(options) {
	    var defaults = {opacity: 1, backgroundColor: "#000", delayTime: 500, zindex: 999, sleep: 500};
	    var options = $.extend(defaults, options);
	    var _PageHeight = document.documentElement.clientHeight, _PageWidth = document.documentElement.clientWidth;
	    var _LLLoadingHtml = '<div id="loadingPage" style="position:fixed;left:0;top:0;_position: absolute;width:100%;height:' + _PageHeight + 'px;background:' + options.backgroundColor + ';opacity:' + options.opacity + ';filter:alpha(opacity=' + options.opacity * 100 + ');z-index:' + options.zindex + ';"><div class="ll_loading_con"><div class="ll-loading"><div class="ll-load-inner"><div class="ll-load-container"><div class="ll-load-scale-multiple la-2x"><div></div><div></div><div></div></div></div></div><div class="ll-load-logo"><span class="ll-logo-1"></span><span class="ll-logo-2"></span><span class="ll-logo-3"></span></div></div></div></div>';
	    $("body").append(_LLLoadingHtml);
	    document.onreadystatechange = PageLoaded;
	    function PageLoaded() {
	        if (document.readyState == "complete") {
	            var loadingMask = $('#loadingPage');
	            setTimeout(function () {
	                loadingMask.animate({"opacity": 0}, options.delayTime, function () {
	                    $(this).remove()
	                })
	            }, options.sleep)
	        }
	    };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 16 */,
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {var transCalendar = __webpack_require__(18);
	var Dom = {
	    getRequest: function(name) {
	        var url = window.location.search; //获取url中"?"符后的字串
	        var theRequest = new Object();
	        if (url.indexOf("?") != -1) {
	            var str = url.substr(1);
	            strs = str.split("&");
	            for(var i = 0; i < strs.length; i ++) {
	                //就是这句的问题
	                theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
	                //之前用了unescape()
	                //才会出现乱码
	            }
	        }
	        return theRequest[name];
	    },
	    /*---------------获取时间中的年月日部分--------------------*/
	    getDate: function(date) {
	        var dateArr = date.split(" ");
	        return dateArr[0];
	    },
	    /*--------------------------得到事件时间中去掉年月日和秒的时间------------------------------*/
	    getHourMinute: function(date) {
	        var dateArr = date.split(" ");
	        var timeArr = dateArr[1].split(":");
	        var time = timeArr[0]+":"+timeArr[1];
	        return time;
	    },
	    /*------------------------比较时间是否相等-------------------------*/
	    compareDate: function(time) {
	        var today = new Date();
	        var theYear = today.getFullYear(),
	            theMonth = today.getMonth()+ 1,
	            theDay = today.getDate();
	        var timeArr = time.split("-");
	        if(theYear == timeArr[0] && theMonth == parseInt(timeArr[1]) && theDay == parseInt(timeArr[2])){
	            return true;
	        }else{
	            return false;
	        }
	    },
	    /*----------------比较时间大小----------------*/
	    smallerDate:function(time){
	        var today = new Date();
	        var theYear = today.getFullYear(),
	            theMonth = today.getMonth()+ 1,
	            theDay = today.getDate();
	        var timeStr = time.replace(/\-/g,"/");
	        var theDate = new Date(timeStr),
	            todayDate = new Date(theYear+"/"+theMonth+"/"+theDay);
	        if(todayDate.getTime()-theDate.getTime()>0){
	            return true;
	        }else{
	            return false;
	        }
	    },
	    /*--------------------处理事件的日期----------------------*/
	    tranDayDate: function(date) {
	        var that = this;
	        var dateArr = date.split(" ");
	        var timeArr = dateArr[0].split("-"),
	            time = dateArr[0].replace(/\-/g,"/");
	        var theDate = new Date(time);
	        var ca = new transCalendar(),
	            theDay = timeArr[2];
	        var theNlArr = ca.getls(theDate);
	        var theWeek = that.transWeek(theDate);
	        var nlDate = theNlArr[2]+"月"+theNlArr[3],
	            month = timeArr[0]+"年"+timeArr[1]+"月";
	        return [theDay,theWeek,nlDate,month,dateArr[0]];//返回当天是几日、星期几、农历月日、年月、没有时分秒的日期
	    },
	    transWeek: function(day) {
	        var week = day.getDay();
	        switch (week){
	            case 0:
	                week = "周日";
	                break;
	            case 1:
	                week = "周一";
	                break;
	            case 2:
	                week = "周二";
	                break;
	            case 3:
	                week = "周三";
	                break;
	            case 4:
	                week = "周四";
	                break;
	            case 5:
	                week = "周五";
	                break;
	            case 6:
	                week = "周六";
	                break;
	        }
	        return week;
	    },
	    transDate: function(date, showWeek) {
	        var that = this;
	        var ca = new transCalendar();
	        var dateArr = date.split(" ");
	        var dateTimeArr = dateArr[0].split("-");
	        var theDate = new Date(dateArr[0]);
	        var theNl = ca.getls(theDate);
	        var theNlDate = '',week="";
	        if(showWeek){
	            week = that.transWeek(theDate);
	        }
	        if(dateArr[1]){//若时间格式为 yyyy-mm-dd hh:ii
	            theNlDate =dateTimeArr[0]+"年"+theNl[2]+"月"+theNl[3]+"&nbsp;&nbsp;"+week+"&nbsp;&nbsp;"+dateArr[1];
	        }else{//时间格式为 yyyy-mm-dd
	            theNlDate = dateTimeArr[0]+"年"+theNl[2]+"月"+theNl[3];
	        }
	        $('.mbsc-fr-hdr').html(theNlDate);
	    },
	    /*--------------------比较开始时间和结束时间，并输出显示格式------------------*/
	    compareTimes:function(startTime,endTime){
	        var that = this,
	            endArr = endTime.split(" ");
	        var startYear = parseInt(startTime.split(" ")[0].split("-")[0], 10),
	            startMonth = parseInt(startTime.split(" ")[0].split("-")[1], 10),
	            startDay = parseInt(startTime.split(" ")[0].split("-")[2], 10),
	            endYear = parseInt(endTime.split(" ")[0].split("-")[0], 10),
	            endMonth = parseInt(endTime.split(" ")[0].split("-")[1], 10),
	            endDay = parseInt(endTime.split(" ")[0].split("-")[2], 10),
	            endTimeStr = endArr[1].split(':');
	        if(startTime == endTime){
	            return that.transStartTime(startTime);
	        }else{
	            if(startYear==endYear&&startMonth == endMonth&&startDay == endDay){
	                return that.transStartTime(startTime)+"-"+endTimeStr[0]+":"+endTimeStr[1];
	            }else if(startYear==endYear&&startMonth == endMonth&&startDay != endDay){
	                return that.transStartTime(startTime)+"&nbsp;<span class='f12 ccc'>至</span><br>"+that.transStartTime(endTime);
	            }else if(startYear==endYear&&startMonth != endMonth){
	                return that.transStartTime(startTime)+"&nbsp;<span class='f12 ccc'>至</span><br>"+that.transStartTime(endTime);
	            }else if(startYear!=endYear){
	                return that.tranDate(startTime)+"&nbsp;<span class='f12 ccc'>至</span><br>"+that.tranDate(endTime);
	            }
	        }
	    },
	
	    /*-------------------转换时间格式，只获取月日，星期和时分-----------------------*/
	    transStartTime:function(date){
	        var that = this;
	        var time = date.split(" ");
	        var dateArr = time[0].split("-");
	        var timeStr = time[0].replace(/\-/g, "/");
	        var hourArr = time[1].split(":");//将时分秒分割为数组
	        var theDate = new Date(timeStr);//将日期转换成标准格式
	        var theWeek = that.transWeek(theDate);//获取当前时间对应的星期
	        return  dateArr[1] + "月" + dateArr[2] + "日" + " " + theWeek + " " + hourArr[0] + ":" + hourArr[1];
	    },
	
	    /*-------------------------转换获取的开始时间、结束时间、提醒时间格式---------------*/
	    tranDate:function(date){
	        var that = this;
	        var time = date.split(" ");
	        var dateArr = time[0].split("-");
	        var timeStr = time[0].replace(/\-/g, "/");
	        var hourArr = time[1].split(":");//将时分秒分割为数组
	        var theDate = new Date(timeStr);//将日期转换成标准格式
	        var theWeek = that.transWeek(theDate);//获取当前时间对应的星期
	        return dateArr[0] + "年" + dateArr[1] + "月" + dateArr[2] + "日" + " " + theWeek + " " + hourArr[0] + ":" + hourArr[1];
	    },
	    getDateList: function() {
	        var dateItem = "";
	        var theDateList = $('.date_slide .date_list');
	        for (var i = 0; i < theDateList.size(); i++) {
	            if (theDateList.eq(i).attr("class") == "date_list active") {
	                dateItem = theDateList.eq(i).find('.date_item');
	            } else {
	                dateItem = theDateList.eq(0).find('.date_item');
	            }
	        }
	        return dateItem;
	    },
	    checkUserAgent: function() {
	        this.mobile = {
	            platform: '',
	            version: 0,
	            Android: function () {
	                return this.platform === 'Android';
	            },
	            iOS: function () {
	                return this.platform === 'iOS';
	            },
	            init: function () {
	                var ua = navigator.userAgent;
	                if (ua.match(/Android/i)) {
	                    this.platform = 'Android';
	                    this.version = parseFloat(ua.slice(ua.indexOf("Android") + 8));
	                }
	                else if (ua.match(/iPhone|iPad|iPod/i)) {
	                    this.platform = 'iOS';
	                    this.version = parseFloat(ua.slice(ua.indexOf("OS") + 3));
	                }
	            }
	        };
	        this.mobile.init();
	    },
	    /*-----------------------向左滑动时让schedule的高度等于黄历内容的高度------------------------*/
	    slideLeft: function() {
	        $('.scheBtn').removeClass('active');
	        $('.almaBtn').addClass('active');
	        $('.scheduleList').animate({"left": "-100%"}, 500);
	        $('.almanac').animate({"left": "0px"}, 500);
	        var almaHeight = parseInt($('.almanac').css('height'));
	        $('.schedule').css('height', 40 + almaHeight + "px");
	    },
	    /*--------------------向右滑动时让schedule的高度等于日程内容的高度-------------------------*/
	    slideRight: function() {
	        $('.scheBtn').addClass('active');
	        $('.almaBtn').removeClass('active');
	        $('.scheduleList').animate({left: "0px"}, 500);
	        $('.almanac').animate({left: "100%"}, 500);
	        var scheHeight = parseInt($('.scheduleList').css('height'));
	        $('.schedule').css('height', 40 + scheHeight + "px");
	    },
	    //比较两个时间
	    compareTimeDate: function(time, current) {
	        if(current) {
	            var curYear = parseInt(current.split(" ")[0].split("-")[0], 10),
	                curMonth = parseInt(current.split(" ")[0].split("-")[1], 10),
	                curDay = parseInt(current.split(" ")[0].split("-")[2], 10),
	                curHour = current.split(" ")[1] ? parseInt(current.split(" ")[1].split(":")[0], 10) : 0,
	                curMin = current.split(" ")[1] ? parseInt(current.split(" ")[1].split(":")[1], 10) : 0;
	        } else {
	            var today = new Date();
	            var curYear = today.getFullYear(),
	                curMonth = today.getMonth() + 1,
	                curDay = today.getDate(),
	                curHour = today.getHours(),
	                curMin = today.getMinutes();
	        }
	        var toYear = parseInt(time.split(" ")[0].split("-")[0], 10),
	            toMonth = parseInt(time.split(" ")[0].split("-")[1], 10),
	            toDay = parseInt(time.split(" ")[0].split("-")[2], 10),
	            toHour = time.split(" ")[1] ? parseInt(time.split(" ")[1].split(":")[0], 10) : 0,
	            toMin = time.split(" ")[1] ? parseInt(time.split(" ")[1].split(":")[1], 10) : 0;
	        //比较
	        if(toYear > curYear) {
	            return "over";
	        } else if(toYear < curYear) {
	            return "below";
	        } else {
	            if(toMonth > curMonth) {
	                return "over";
	            } else if(toMonth < curMonth) {
	                return "below";
	            } else {
	                if(toDay > curDay) {
	                    return "over";
	                } else if(toDay < curDay) {
	                    return "below";
	                } else {
	                    if(toHour > curHour) {
	                        return "over";
	                    } else if(toHour < curHour) {
	                        return "below";
	                    } else {
	                        if(toMin > curMin) {
	                            return "over";
	                        } else if(toMin < curMin) {
	                            return "below";
	                        } else {
	                            return "equal";
	                        }
	                    }
	                }
	            }
	        }
	    },
	    getToday: function(date) {
	        var today = new Date();
	        var year = today.getFullYear(),
	            month = today.getMonth() + 1,
	            day = today.getDate();
	        var isToday = false;
	        if(date) {
	            if(year == date.split("-")[0] && month == date.split("-")[1] && day == date.split("-")[2]) {
	                isToday = true;
	            }
	        }
	        return {
	            year: year,
	            month: month,
	            day: day,
	            weekDay: this.transWeek(today),
	            isToday: isToday
	        }
	    },
	    /*--------------textarea高度自适应---------------*/
	    autoTextarea: function (elem, extra, maxHeight) {
	        extra = extra || 0;
	        var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
	            isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
	            addEvent = function (type, callback) {
	                elem.addEventListener ?
	                    elem.addEventListener(type, callback, false) :
	                    elem.attachEvent('on' + type, callback);
	            },
	            getStyle = elem.currentStyle ? function (name) {
	                var val = elem.currentStyle[name];
	                if (name === 'height' && val.search(/px/i) !== 1) {
	                    var rect = elem.getBoundingClientRect();
	                    return rect.bottom - rect.top -
	                        parseFloat(getStyle('paddingTop')) -
	                        parseFloat(getStyle('paddingBottom')) + 'px';
	                };
	                return val;
	            } : function (name) {
	                return getComputedStyle(elem, null)[name];
	            },
	            minHeight = parseFloat(getStyle('height'));
	        elem.style.resize = 'none';
	        var change = function () {
	            var scrollTop, height,
	                padding = 0,
	                style = elem.style;
	            if (elem._length === elem.value.length) return;
	            elem._length = elem.value.length;
	            if (!isFirefox && !isOpera) {
	                padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
	            }
	            ;
	            scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	            elem.style.height = minHeight + 'px';
	            if (elem.scrollHeight > minHeight) {
	                if (maxHeight && elem.scrollHeight > maxHeight) {
	                    height = maxHeight - padding;
	                    style.overflowY = 'auto';
	                } else {
	                    height = elem.scrollHeight - padding;
	                    style.overflowY = 'hidden';
	                }
	                ;
	                style.height = height + extra + 'px';
	                scrollTop += parseInt(style.height) - elem.currHeight;
	                document.body.scrollTop = scrollTop;
	                document.documentElement.scrollTop = scrollTop;
	                elem.currHeight = parseInt(style.height);
	            }
	            ;
	        };
	        addEvent('propertychange', change);
	        addEvent('input', change);
	        addEvent('focus', change);
	        change();
	    }
	}
	
	Dom.checkUserAgent();
	module.exports = Dom;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 18 */
/***/ function(module, exports) {

	function tranCalendar() {
		/* ***
		
		该对象用于获取日期对应的节气、节日
		三个方法如下:
		.getl(date,lockNum)  返回日期对应的数字或农历表示
		.getst(date)  获取日期对应的节气,若不是则为空.
		.getlf(date)  获取阴历节日,若不是则为空.
		.getls(date)  获取阴历数组表示 结果["阴历年", "属相", "阴历月", "阴历日"] 
		.getsf(date)  获取阳历节日,若不是则为空.
		*/
		var unlockNum = true; //是否开启数字格式值返回 如：2011-12-15返回值为1121 [false则为 冬月廿十一]
		var solarTerm = new Array("小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至","小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"); //24节气
		var DifferenceInMonth = new Array(1272060, 1275495, 1281180, 1289445, 1299225, 1310355, 1321560, 1333035, 1342770, 1350855, 1356420, 1359045,
		1358580, 1355055, 1348695, 1340040, 1329630, 1318455, 1306935, 1297380, 1286865, 1277730, 1274550, 1271556); //24节气值
		var SF = { "0101": "元旦", "0214": "情人节", "0305#": "学雷锋纪念日", "0308": "妇女节", "0312#": "植树节", "0315#": "消费者权益日", "0401#": "愚人节", "0501": "劳动节", "0504": "青年节", "0601": "儿童节", "0701": "建党节", "0801": "建军节", "0910": "教师节", "1001": "国庆节", "1224": "平安夜", "1225": "圣诞节" }; //阳历节日
		var LF = { "0101": "春节", "0115": "元宵节", "0505": "端午节", "0815": "中秋节", "0707": "七夕", "0909": "重阳节", "1010#": "感恩节", "1208#": "腊八节", "0100": "除夕" }; //阴历节日
		var CalendarData=new Array(100),madd=new Array(12),tgString="甲乙丙丁戊己庚辛壬癸",dzString="子丑寅卯辰巳午未申酉戌亥",numString="一二三四五六七八九十",monString="正二三四五六七八九十冬腊",weekString="日一二三四五六",sx="鼠牛虎兔龙蛇马羊猴鸡狗猪",cYear,cMonth,cDay,TheDate;
		CalendarData=new Array(0xA4B,0x5164B,0x6A5,0x6D4,0x415B5,0x2B6,0x957,0x2092F,0x497,0x60C96,0xD4A,0xEA5,0x50DA9,0x5AD,0x2B6,0x3126E,0x92E,0x7192D,0xC95,0xD4A,0x61B4A,0xB55,0x56A,0x4155B,0x25D,0x92D,0x2192B,0xA95,0x71695,0x6CA,0xB55,0x50AB5,0x4DA,0xA5B,0x30A57,0x52B,0x8152A,0xE95,0x6AA,0x615AA,0xAB5,0x4B6,0x414AE,0xA57,0x526,0x31D26,0xD95,0x70B55,0x56A,0x96D,0x5095D,0x4AD,0xA4D,0x41A4D,0xD25,0x81AA5,0xB54,0xB6A,0x612DA,0x95B,0x49B,0x41497,0xA4B,0xA164B,0x6A5,0x6D4,0x615B4,0xAB6,0x957,0x5092F,0x497,0x64B,0x30D4A,0xEA5,0x80D65,0x5AC,0xAB6,0x5126D,0x92E,0xC96,0x41A95,0xD4A,0xDA5,0x20B55,0x56A,0x7155B,0x25D,0x92D,0x5192B,0xA95,0xB4A,0x416AA,0xAD5,0x90AB5,0x4BA,0xA5B,0x60A57,0x52B,0xA93,0x40E95);madd[0]=0;madd[1]=31;madd[2]=59;madd[3]=90;madd[4]=120;madd[5]=151;madd[6]=181;madd[7]=212;madd[8]=243;madd[9]=273;madd[10]=304;madd[11]=334;
		function GetBit(m,n){return(m>>n)&1}
		function e2c(){
			TheDate=(arguments.length!=3)?new Date():new Date(arguments[0],arguments[1],arguments[2]);
			var total,m,n,k;
			var isEnd=false;
			var tmp=TheDate.getFullYear();
			total=(tmp-1921)*365+Math.floor((tmp-1921)/4)+madd[TheDate.getMonth()]+TheDate.getDate()-38;
			if(TheDate.getYear()%4==0&&TheDate.getMonth()>1){total++}
			for(m=0;;m++){
				k=(CalendarData[m]<0xfff)?11:12;
				for(n=k;n>=0;n--){
					if(total<=29+GetBit(CalendarData[m],n)){isEnd=true;break}
					total=total-29-GetBit(CalendarData[m],n)
				}
				if(isEnd)break
			}
			cYear=1921+m;cMonth=k-n+1;cDay=total;
			if(k==12){
				if(cMonth==Math.floor(CalendarData[m]/0x10000)+1){cMonth=1-cMonth}
				if(cMonth>Math.floor(CalendarData[m]/0x10000)+1){cMonth--}
			}
		}
		function GetcDateString() {
			var P = [19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632, 21970, 19168, 42422, 42192, 53840, 119381, 46400, 54944, 44450, 38320, 84343, 18800, 42160, 46261, 27216, 27968, 109396, 11104, 38256, 21234, 18800, 25958, 54432, 59984, 28309, 23248, 11104, 100067, 37600, 116951, 51536, 54432, 120998, 46416, 22176, 107956, 9680, 37584, 53938, 43344, 46423, 27808, 46416, 86869, 19872, 42448, 83315, 21200, 43432, 59728, 27296, 44710, 43856, 19296, 43748, 42352, 21088, 62051, 55632, 23383, 22176, 38608, 19925, 19152, 42192, 54484, 53840, 54616, 46400, 46496, 103846, 38320, 18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872, 38256, 19189, 18800, 25776, 29859, 59984, 27480, 21952, 43872, 38613, 37600, 51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680, 37584, 51893, 43344, 46240, 47780, 44368, 21977, 19360, 42416, 86390, 21168, 43312, 31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005, 54576, 23200, 30371, 38608, 19415, 19152, 42192, 118966, 53840, 54560, 56645, 46496, 22224, 21938, 18864, 42359, 42160, 43600, 111189, 27936, 44448];
			var tmp = "";
			if(unlockNum==false){
				tmp += tgString.charAt((cYear - 4) % 10);
				tmp += dzString.charAt((cYear - 4) % 12);
				tmp += "(";
				tmp += sx.charAt((cYear - 4) % 12);
				tmp += ")年";
			}
			if (cMonth < 1) {
				if (unlockNum == false) {
					tmp += "(闰)";
					tmp += monString.charAt(-cMonth - 1);
				} else {
					//tmp += "(闰)"; //**
					tmp += cMonth < 10 ? "0" + (cMonth - 2) : (cMonth - 2);  //monString.charAt(-cMonth - 1);//**        
				}
			} else {
				if (unlockNum == false) {
					tmp += monString.charAt(cMonth - 1);
				} else {
					tmp += cMonth < 10 ? "0" + cMonth : cMonth;  //monString.charAt(cMonth - 1);//**
				}
			}
			if (unlockNum == false) {
				tmp += "月";
				tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十"));
				if (cDay % 10 != 0 || cDay == 10) {
					tmp += numString.charAt((cDay - 1) % 10);
				}
			} else {
				tmp += (cDay < 10 ? "0" + cDay : cDay);
				if (cMonth == 12 && cDay == ((P[cYear - 1900] & (65536 >> 12)) ? 30 : 29)) {
					tmp = "0100";
				}
			}
			return tmp;
		}
		//获取阴历	
		function GetLunarDay(solarYear,solarMonth,solarDay){
			if(solarYear<1921||solarYear>2020){return""}else{solarMonth=(parseInt(solarMonth)>0)?(solarMonth-1):11;
			e2c(solarYear,solarMonth,solarDay);
			return GetcDateString()
			}
		}
	
	    //获取节气
	    this.getst = function(date) {
			var DifferenceInYear = 31556926;
			var BeginTime = new Date(1901 / 1 / 1);
			BeginTime.setTime(947120460000);
			for (; date.getFullYear() < BeginTime.getFullYear(); ) {
				BeginTime.setTime(BeginTime.getTime() - DifferenceInYear * 1000);
			}
			for (; date.getFullYear() > BeginTime.getFullYear(); ) {
				BeginTime.setTime(BeginTime.getTime() + DifferenceInYear * 1000);
			}
			for (var M = 0; date.getMonth() > BeginTime.getMonth(); M++) {
				BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
			}
			if (date.getDate() > BeginTime.getDate()) {
				BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
				M++;
			}
			if (date.getDate() > BeginTime.getDate()) {
				BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
				M == 23 ? M = 0 : M++;
			}
			var JQ = "";
			if (date.getDate() == BeginTime.getDate()) {
				JQ += solarTerm[M];
			}
			return JQ;
		}
		//获取阳历节日
		this.getsf=function(){
			var m,d;
			if(arguments.length == 2){
				m=arguments[0];d=arguments[1];
			}else{
				m=arguments[0].getMonth()+1;d=arguments[0].getDate();
			}
			m= SF[(m < 10 ? "0" + m : m.toString()) + (d < 10 ? "0" + d : d.toString())];
			return m?m:'';
		}
		//获取阴历 D当前日期 lockNum是否开启数字格式值返回 //var D = new Date();
		this.getl=function (D,lockNum) {
			unlockNum = lockNum;
			if (lockNum == false || lockNum == "false") {
				numString = "一二三四五六七八九十";
				monString = "正二三四五六七八九十冬腊";
			}
			var yy = D.getFullYear();
			var mm = D.getMonth() + 1;
			var dd = D.getDate();
			var ww = D.getDay();
			var ss = parseInt(D.getTime() / 1000);
			if (yy < 100)yy = "19" + yy;
			return GetLunarDay(yy, mm, dd);
		}
		//获取阴历节日
		this.getlf=function (D) {
			var dayT = LF[this.getl(D,true)]; return dayT ? dayT : "";
		}
		//获取阴历数组
		this.getls=function(D){
			var tmp=this.getl(D,false);
			var t=['','','',''];
			var s=tmp.indexOf('年');
			if(s!=-1){
				t[0]=tmp.substring(0,2);
				t[1]=tmp.substring(3,4);
				tmp=tmp.substring(6);
				s=tmp.indexOf('月');
				t[2]=tmp.substring(0,s);
				t[3]=tmp.substring(s+1);
			}
			return t;
		}
	}
	
	module.exports = tranCalendar;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function($) {__webpack_require__(20);
	!function(e,t){ true?!(__WEBPACK_AMD_DEFINE_FACTORY__ = (t), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"object"==typeof exports?module.exports=t():e.mobiscroll=t()}(this,function(){var e=e||{};return function(t,a,s){function n(e){return"function"==typeof e}function c(e){return"object"==typeof e}function i(e){return e.replace(/-+(.)?/g,function(e,t){return t?t.toUpperCase():""})}function r(e,t,a){for(var n in t)a&&(f.isPlainObject(t[n])||f.isArray(t[n]))?((f.isPlainObject(t[n])&&!f.isPlainObject(e[n])||f.isArray(t[n])&&!f.isArray(e[n]))&&(e[n]={}),r(e[n],t[n],a)):t[n]!==s&&(e[n]=t[n])}function l(e){return e.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}var o={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},d={readonly:"readOnly"},m=[],u=Array.prototype.slice,h=function(){var e=function(e){for(var t=0,t=0;t<e.length;t++)this[t]=e[t];return this.length=e.length,r(this)},r=function(s,c){var i=[],l=0;if(s&&!c&&s instanceof e)return s;if(n(s))return r(a).ready(s);if(s)if("string"==typeof s){var o,s=l=s.trim();if(0<=l.indexOf("<")&&0<=l.indexOf(">"))for(o="div",0===l.indexOf("<li")&&(o="ul"),0===l.indexOf("<tr")&&(o="tbody"),0!==l.indexOf("<td")&&0!==l.indexOf("<th")||(o="tr"),0===l.indexOf("<tbody")&&(o="table"),0===l.indexOf("<option")&&(o="select"),o=a.createElement(o),o.innerHTML=l,l=0;l<o.childNodes.length;l++)i.push(o.childNodes[l]);else for(c||"#"!==s[0]||s.match(/[ .<>:~]/)?(c instanceof e&&(c=c[0]),o=(c||a).querySelectorAll(s)):o=[a.getElementById(s.split("#")[1])],l=0;l<o.length;l++)o[l]&&i.push(o[l])}else if(s.nodeType||s===t||s===a)i.push(s);else if(0<s.length&&s[0].nodeType)for(l=0;l<s.length;l++)i.push(s[l]);else r.isArray(s)&&(i=s);return new e(i)};return e.prototype={ready:function(e){return/complete|loaded|interactive/.test(a.readyState)&&a.body?e(r):a.addEventListener("DOMContentLoaded",function(){e(r)},!1),this},concat:m.concat,empty:function(){return this.each(function(){this.innerHTML=""})},map:function(e){return r(r.map(this,function(t,a){return e.call(t,a,t)}))},slice:function(){return r(u.apply(this,arguments))},addClass:function(e){if("undefined"==typeof e)return this;for(var e=e.split(" "),t=0;t<e.length;t++)for(var a=0;a<this.length;a++)"undefined"!=typeof this[a].classList&&""!==e[t]&&this[a].classList.add(e[t]);return this},removeClass:function(e){for(var e=e.split(" "),t=0;t<e.length;t++)for(var a=0;a<this.length;a++)"undefined"!=typeof this[a].classList&&""!==e[t]&&this[a].classList.remove(e[t]);return this},hasClass:function(e){return!!this[0]&&this[0].classList.contains(e)},toggleClass:function(e){for(var e=e.split(" "),t=0;t<e.length;t++)for(var a=0;a<this.length;a++)"undefined"!=typeof this[a].classList&&this[a].classList.toggle(e[t]);return this},closest:function(e,t){var a=this[0],s=!1;for(c(e)&&(s=r(e));a&&!(s?0<=s.indexOf(a):r.matches(a,e));)a=a!==t&&a.nodeType!==a.DOCUMENT_NODE&&a.parentNode;return r(a)},attr:function(e,t){var a;if(1===arguments.length&&"string"==typeof e&&this.length)return a=this[0].getAttribute(e),this[0]&&(a||""===a)?a:s;for(a=0;a<this.length;a++)if(2===arguments.length)this[a].setAttribute(e,t);else for(var n in e)this[a][n]=e[n],this[a].setAttribute(n,e[n]);return this},removeAttr:function(e){for(var t=0;t<this.length;t++)this[t].removeAttribute(e);return this},prop:function(e,t){if(e=d[e]||e,1===arguments.length&&"string"==typeof e)return this[0]?this[0][e]:s;for(var a=0;a<this.length;a++)this[a][e]=t;return this},val:function(e){if("undefined"==typeof e)return this.length&&this[0].multiple?r.map(this.find("option:checked"),function(e){return e.value}):this[0]?this[0].value:s;if(this.length&&this[0].multiple)r.each(this[0].options,function(){this.selected=-1!=e.indexOf(this.value)});else for(var t=0;t<this.length;t++)this[t].value=e;return this},on:function(e,t,a,s){function c(e){var s,n;if(s=e.target,r(s).is(t))a.call(s,e);else for(n=r(s).parents(),s=0;s<n.length;s++)r(n[s]).is(t)&&a.call(n[s],e)}function i(e,t,a,s){t=t.split("."),e.DomNameSpaces||(e.DomNameSpaces=[]),e.DomNameSpaces.push({namespace:t[1],event:t[0],listener:a,capture:s}),e.addEventListener(t[0],a,s)}var l,o,e=e.split(" ");for(l=0;l<this.length;l++)if(n(t)||!1===t)for(n(t)&&(s=(a=t)||!1),o=0;o<e.length;o++)-1!=e[o].indexOf(".")?i(this[l],e[o],a,s):this[l].addEventListener(e[o],a,s);else for(o=0;o<e.length;o++)this[l].DomLiveListeners||(this[l].DomLiveListeners=[]),this[l].DomLiveListeners.push({listener:a,liveListener:c}),-1!=e[o].indexOf(".")?i(this[l],e[o],c,s):this[l].addEventListener(e[o],c,s);return this},off:function(e,t,a,s){function c(e){var t,a,s;t=e.split(".");var e=t[0],n=t[1];for(t=0;t<o.length;++t)if(o[t].DomNameSpaces){for(a=0;a<o[t].DomNameSpaces.length;++a)s=o[t].DomNameSpaces[a],s.namespace!=n||s.event!=e&&e||(o[t].removeEventListener(s.event,s.listener,s.capture),s.removed=!0);for(a=o[t].DomNameSpaces.length-1;0<=a;--a)o[t].DomNameSpaces[a].removed&&o[t].DomNameSpaces.splice(a,1)}}var i,r,l,o=this,e=e.split(" ");for(i=0;i<e.length;i++)for(r=0;r<this.length;r++)if(n(t)||!1===t)n(t)&&(s=(a=t)||!1),0===e[i].indexOf(".")?c(e[i].substr(1),a,s):this[r].removeEventListener(e[i],a,s);else{if(this[r].DomLiveListeners)for(l=0;l<this[r].DomLiveListeners.length;l++)this[r].DomLiveListeners[l].listener===a&&this[r].removeEventListener(e[i],this[r].DomLiveListeners[l].liveListener,s);this[r].DomNameSpaces&&this[r].DomNameSpaces.length&&e[i]&&c(e[i])}return this},trigger:function(e,t){for(var s=e.split(" "),n=0;n<s.length;n++)for(var c=0;c<this.length;c++){var i;try{i=new CustomEvent(s[n],{detail:t,bubbles:!0,cancelable:!0})}catch(e){i=a.createEvent("Event"),i.initEvent(s[n],!0,!0),i.detail=t}this[c].dispatchEvent(i)}return this},width:function(e){return e!==s?this.css("width",e):this[0]===t?t.innerWidth:this[0]===a?a.documentElement.scrollWidth:0<this.length?parseFloat(this.css("width")):null},height:function(e){if(e!==s)return this.css("height",e);if(this[0]===t)return t.innerHeight;if(this[0]===a){var e=a.body,n=a.documentElement;return Math.max(e.scrollHeight,e.offsetHeight,n.clientHeight,n.scrollHeight,n.offsetHeight)}return 0<this.length?parseFloat(this.css("height")):null},innerWidth:function(){var e=this;if(0<this.length){if(this[0].innerWidth)return this[0].innerWidth;var t=this[0].offsetWidth;return["left","right"].forEach(function(a){t-=parseInt(e.css(i("border-"+a+"-width"))||0,10)}),t}},innerHeight:function(){var e=this;if(0<this.length){if(this[0].innerHeight)return this[0].innerHeight;var t=this[0].offsetHeight;return["top","bottom"].forEach(function(a){t-=parseInt(e.css(i("border-"+a+"-width"))||0,10)}),t}},offset:function(){if(0<this.length){var e=this[0],s=e.getBoundingClientRect(),n=a.body;return{top:s.top+(t.pageYOffset||e.scrollTop)-(e.clientTop||n.clientTop||0),left:s.left+(t.pageXOffset||e.scrollLeft)-(e.clientLeft||n.clientLeft||0)}}},hide:function(){for(var e=0;e<this.length;e++)this[e].style.display="none";return this},show:function(){for(var e=0;e<this.length;e++)"none"==this[e].style.display&&(this[e].style.display="block"),"none"==this[e].style.getPropertyValue("display")&&(this[e].style.display="block");return this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},styles:function(){return this[0]?t.getComputedStyle(this[0],null):s},css:function(e,t){var a,s,n,c,i=this[0],d="";if(2>arguments.length){if(!i)return;if(a=getComputedStyle(i,""),"string"==typeof e)return i.style[e]||a.getPropertyValue(e);if(r.isArray(e))return c={},r.each(e,function(e,t){c[t]=i.style[t]||a.getPropertyValue(t)}),c}if("string"==typeof e)t||0===t?d=l(e)+":"+("number"!=typeof t||o[l(e)]?t:t+"px"):this.each(function(){this.style.removeProperty(l(e))});else for(n in e)if(e[n]||0===e[n])d+=l(n)+":"+("number"!=typeof e[n]||o[l(n)]?e[n]:e[n]+"px")+";";else for(s=0;s<this.length;s++)this[s].style.removeProperty(l(n));return this.each(function(){this.style.cssText+=";"+d})},each:function(e){for(var t=0;t<this.length&&!1!==e.apply(this[t],[t,this[t]]);t++);return this},filter:function(t){for(var a=[],s=0;s<this.length;s++)n(t)?t.call(this[s],s,this[s])&&a.push(this[s]):r.matches(this[s],t)&&a.push(this[s]);return new e(a)},html:function(e){if("undefined"==typeof e)return this[0]?this[0].innerHTML:s;this.empty();for(var t=0;t<this.length;t++)this[t].innerHTML=e;return this},text:function(e){if("undefined"==typeof e)return this[0]?this[0].textContent.trim():null;for(var t=0;t<this.length;t++)this[t].textContent=e;return this},is:function(e){return 0<this.length&&r.matches(this[0],e)},not:function(e){var t=[];if(n(e)&&e.call!==s)this.each(function(a){e.call(this,a)||t.push(this)});else{var a="string"==typeof e?this.filter(e):"number"==typeof e.length&&n(e.item)?u.call(e):r(e);c(a)&&(a=r.map(a,function(e){return e})),this.each(function(e,s){0>a.indexOf(s)&&t.push(s)})}return r(t)},indexOf:function(e){for(var t=0;t<this.length;t++)if(this[t]===e)return t},index:function(e){return e?this.indexOf(r(e)[0]):this.parent().children().indexOf(this[0])},get:function(e){return e===s?u.call(this):this[0<=e?e:e+this.length]},eq:function(t){if("undefined"==typeof t)return this;var a=this.length;return t>a-1?new e([]):0>t?(t=a+t,new e(0>t?[]:[this[t]])):new e([this[t]])},append:function(t){var s,n;for(s=0;s<this.length;s++)if("string"==typeof t)for(n=a.createElement("div"),n.innerHTML=t;n.firstChild;)this[s].appendChild(n.firstChild);else if(t instanceof e)for(n=0;n<t.length;n++)this[s].appendChild(t[n]);else this[s].appendChild(t);return this},appendTo:function(e){return r(e).append(this),this},prepend:function(t){var s,n;for(s=0;s<this.length;s++)if("string"==typeof t){var c=a.createElement("div");for(c.innerHTML=t,n=c.childNodes.length-1;0<=n;n--)this[s].insertBefore(c.childNodes[n],this[s].childNodes[0])}else if(t instanceof e)for(n=0;n<t.length;n++)this[s].insertBefore(t[n],this[s].childNodes[0]);else this[s].insertBefore(t,this[s].childNodes[0]);return this},prependTo:function(e){return r(e).prepend(this),this},insertBefore:function(e){for(var e=r(e),t=0;t<this.length;t++)if(1===e.length)e[0].parentNode.insertBefore(this[t],e[0]);else if(1<e.length)for(var a=0;a<e.length;a++)e[a].parentNode.insertBefore(this[t].cloneNode(!0),e[a]);return this},insertAfter:function(e){for(var e=r(e),t=0;t<this.length;t++)if(1===e.length)e[0].parentNode.insertBefore(this[t],e[0].nextSibling);else if(1<e.length)for(var a=0;a<e.length;a++)e[a].parentNode.insertBefore(this[t].cloneNode(!0),e[a].nextSibling);return this},next:function(t){return new e(0<this.length?t?this[0].nextElementSibling&&r(this[0].nextElementSibling).is(t)?[this[0].nextElementSibling]:[]:this[0].nextElementSibling?[this[0].nextElementSibling]:[]:[])},nextAll:function(t){var a=[],s=this[0];if(!s)return new e([]);for(;s.nextElementSibling;)s=s.nextElementSibling,t?r(s).is(t)&&a.push(s):a.push(s);return new e(a)},prev:function(t){return new e(0<this.length?t?this[0].previousElementSibling&&r(this[0].previousElementSibling).is(t)?[this[0].previousElementSibling]:[]:this[0].previousElementSibling?[this[0].previousElementSibling]:[]:[])},prevAll:function(t){var a=[],s=this[0];if(!s)return new e([]);for(;s.previousElementSibling;)s=s.previousElementSibling,t?r(s).is(t)&&a.push(s):a.push(s);return new e(a)},parent:function(e){for(var t=[],a=0;a<this.length;a++)null!==this[a].parentNode&&(e?r(this[a].parentNode).is(e)&&t.push(this[a].parentNode):t.push(this[a].parentNode));return r(r.unique(t))},parents:function(e){for(var t=[],a=0;a<this.length;a++)for(var s=this[a].parentNode;s;)e?r(s).is(e)&&t.push(s):t.push(s),s=s.parentNode;return r(r.unique(t))},find:function(t){for(var a=[],s=0;s<this.length;s++)for(var n=this[s].querySelectorAll(t),c=0;c<n.length;c++)a.push(n[c]);return new e(a)},children:function(t){for(var a=[],s=0;s<this.length;s++)for(var n=this[s].childNodes,c=0;c<n.length;c++)t?1===n[c].nodeType&&r(n[c]).is(t)&&a.push(n[c]):1===n[c].nodeType&&a.push(n[c]);return new e(r.unique(a))},remove:function(){for(var e=0;e<this.length;e++)this[e].parentNode&&this[e].parentNode.removeChild(this[e]);return this},add:function(){var e,t;for(e=0;e<arguments.length;e++){var a=r(arguments[e]);for(t=0;t<a.length;t++)this[this.length]=a[t],this.length++}return this},before:function(e){return r(e).insertBefore(this),this},after:function(e){return r(e).insertAfter(this),this},scrollTop:function(e){if(this.length){var t="scrollTop"in this[0];return e===s?t?this[0].scrollTop:this[0].pageYOffset:this.each(t?function(){this.scrollTop=e}:function(){this.scrollTo(this.scrollX,e)})}},scrollLeft:function(e){if(this.length){var t="scrollLeft"in this[0];return e===s?t?this[0].scrollLeft:this[0].pageXOffset:this.each(t?function(){this.scrollLeft=e}:function(){this.scrollTo(e,this.scrollY)})}},contents:function(){return this.map(function(e,t){return u.call(t.childNodes)})},nextUntil:function(e){for(var t=this,a=[];t.length&&!t.filter(e).length;)a.push(t[0]),t=t.next();return r(a)},prevUntil:function(e){for(var t=this,a=[];t.length&&!r(t).filter(e).length;)a.push(t[0]),t=t.prev();return r(a)},detach:function(){return this.remove()}},r.fn=e.prototype,r}(),f=h;e.$=h,f.inArray=function(e,t,a){return m.indexOf.call(t,e,a)},f.extend=function(e){var t,a=u.call(arguments,1);return"boolean"==typeof e&&(t=e,e=a.shift()),e=e||{},a.forEach(function(a){r(e,a,t)}),e},f.isFunction=n,f.isArray=function(e){return"[object Array]"===Object.prototype.toString.apply(e)},f.isPlainObject=function(e){return c(e)&&null!==e&&e!==e.window&&Object.getPrototypeOf(e)==Object.prototype},f.each=function(e,t){var a;if(c(e)&&t){if(f.isArray(e)||e instanceof h)for(a=0;a<e.length&&!1!==t.call(e[a],a,e[a]);a++);else for(a in e)if(e.hasOwnProperty(a)&&"length"!==a&&!1===t.call(e[a],a,e[a]))break;return this}},f.unique=function(e){for(var t=[],a=0;a<e.length;a++)-1===t.indexOf(e[a])&&t.push(e[a]);return t},f.map=function(e,t){var a,s,n=[];if("number"==typeof e.length)for(s=0;s<e.length;s++)a=t(e[s],s),null!==a&&n.push(a);else for(s in e)a=t(e[s],s),null!==a&&n.push(a);return 0<n.length?f.fn.concat.apply([],n):n},f.matches=function(e,t){return!(!t||!e||1!==e.nodeType)&&(e.matchesSelector||e.webkitMatchesSelector||e.mozMatchesSelector||e.msMatchesSelector).call(e,t)}}(window,document),e=e||{},function(t,a,s){function n(e){for(var t in e)if(u[e[t]]!==s)return!0;return!1}function c(t,a,n){var c=t;return"object"==typeof a?t.each(function(){d[this.id]&&d[this.id].destroy(),new e.classes[a.component||"Scroller"](this,a)}):("string"==typeof a&&t.each(function(){var e;if((e=d[this.id])&&e[a]&&(e=e[a].apply(this,Array.prototype.slice.call(n,1)),e!==s))return c=e,!1}),c)}function i(e){if(r.tapped&&!e.tap&&("TEXTAREA"!=e.target.nodeName||"mousedown"!=e.type))return e.stopPropagation(),e.preventDefault(),!1}var r,l="undefined"==typeof jQuery?e.$:jQuery,o=+new Date,d={},m=l.extend,u=a.createElement("modernizr").style,t=n(["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"]),h=n(["flex","msFlex","WebkitBoxDirection"]),f=function(){var e,t=["Webkit","Moz","O","ms"];for(e in t)if(n([t[e]+"Transform"]))return"-"+t[e].toLowerCase()+"-";return""}(),b=f.replace(/^\-/,"").replace(/\-$/,"").replace("moz","Moz");r=e={$:l,version:"3.0.0-beta4beta4",util:{prefix:f,jsPrefix:b,has3d:t,hasFlex:h,isOldAndroid:/android [1-3]/i.test(navigator.userAgent),preventClick:function(){r.tapped++,setTimeout(function(){r.tapped--},500)},testTouch:function(e,t){if("touchstart"==e.type)l(t).attr("data-touch","1");else if(l(t).attr("data-touch"))return l(t).removeAttr("data-touch"),!1;return!0},objectToArray:function(e){var t,a=[];for(t in e)a.push(e[t]);return a},arrayToObject:function(e){var t,a={};if(e)for(t=0;t<e.length;t++)a[e[t]]=e[t];return a},isNumeric:function(e){return 0<=e-parseFloat(e)},isString:function(e){return"string"==typeof e},getCoord:function(e,t,a){var s=e.originalEvent||e,t=(a?"page":"client")+t;return s.targetTouches&&s.targetTouches[0]?s.targetTouches[0][t]:s.changedTouches&&s.changedTouches[0]?s.changedTouches[0][t]:e[t]},getPosition:function(e,t){var a,n=getComputedStyle(e[0]);return l.each(["t","webkitT","MozT","OT","msT"],function(e,t){if(n[t+"ransform"]!==s)return a=n[t+"ransform"],!1}),a=a.split(")")[0].split(", "),t?a[13]||a[5]:a[12]||a[4]},constrain:function(e,t,a){return Math.max(t,Math.min(e,a))},vibrate:function(e){"vibrate"in navigator&&navigator.vibrate(e||50)}},tapped:0,autoTheme:"mobiscroll",presets:{scroller:{},numpad:{},listview:{},menustrip:{}},themes:{form:{},frame:{},listview:{},menustrip:{},progress:{}},i18n:{},instances:d,classes:{},components:{},settings:{},setDefaults:function(e){m(this.settings,e)},presetShort:function(e,t,a){r[e]=function(n,c){var i,o,m={},u=c||{};return l.extend(u,{preset:!1===a?s:e}),l(n).each(function(){d[this.id]&&d[this.id].destroy(),i=new r.classes[t||"Scroller"](this,u),m[this.id]=i}),o=Object.keys(m),1==o.length?m[o[0]]:m},this.components[e]=function(n){return c(this,m(n,{component:t,preset:!1===a?s:e}),arguments)}}},l.mobiscroll=e,l.fn.mobiscroll=function(t){return m(this,e.components),c(this,t,arguments)},e.classes.Base=function(t,a){var s,n,c,i,r,u,h=e,f=h.util,b=f.getCoord,p=this;p.settings={},p._presetLoad=function(){},p._init=function(e){for(var l in p.settings)delete p.settings[l];c=p.settings,m(a,e),p._hasDef&&(u=h.settings),m(c,p._defaults,u,a),p._hasTheme&&(r=c.theme,"auto"!=r&&r||(r=h.autoTheme),"default"==r&&(r="mobiscroll"),a.theme=r,i=h.themes[p._class]?h.themes[p._class][r]:{}),p._hasLang&&(s=h.i18n[c.lang]),p._hasTheme&&p.trigger("onThemeLoad",{lang:s,settings:a}),m(c,i,s,u,a),p._hasPreset&&(p._presetLoad(c),n=h.presets[p._class][c.preset])&&(n=n.call(t,p),m(c,n,a))},p._destroy=function(){p&&(p.trigger("onDestroy",[]),delete d[t.id],p=null)},p.tap=function(e,t,a){function s(e){d||(a&&e.preventDefault(),d=this,l=b(e,"X"),o=b(e,"Y"),m=!1)}function n(e){(d&&!m&&9<Math.abs(b(e,"X")-l)||9<Math.abs(b(e,"Y")-o))&&(m=!0)}function i(e){d&&(m||(e.preventDefault(),t.call(d,e,p)),d=!1,f.preventClick())}function r(){d=!1}var l,o,d,m;c.tap&&e.on("touchstart.mbsc",s).on("touchcancel.mbsc",r).on("touchmove.mbsc",n).on("touchend.mbsc",i),e.on("click.mbsc",function(e){e.preventDefault(),t.call(this,e,p)})},p.trigger=function(e,s){var c;return l.each([u,i,n,a],function(a,n){n&&n[e]&&(c=n[e].call(t,s||{},p))}),c},p.option=function(e,t){var a={};"object"==typeof e?a=e:a[e]=t,p.init(a)},p.getInst=function(){return p},a=a||{},l(t).addClass("mbsc-comp"),t.id||(t.id="mobiscroll"+ ++o),d[t.id]=p},a.addEventListener&&l.each(["mouseover","mousedown","mouseup","click"],function(e,t){a.addEventListener(t,i,!0)})}(window,document),e.i18n["pt-BR"]={setText:"Selecionar",cancelText:"Cancelar",clearText:"Claro",selectedText:"{count} selecionado",selectedPluralText:"{count} selecionados",dateFormat:"dd/mm/yy",dayNames:"Domingo,Segunda-feira,Terça-feira,Quarta-feira,Quinta-feira,Sexta-feira,Sábado".split(","),dayNamesShort:"Dom,Seg,Ter,Qua,Qui,Sex,Sáb".split(","),dayNamesMin:"D,S,T,Q,Q,S,S".split(","),dayText:"Dia",hourText:"Hora",minuteText:"Minutos",monthNames:"Janeiro,Fevereiro,Março,Abril,Maio,Junho,Julho,Agosto,Setembro,Outubro,Novembro,Dezembro".split(","),monthNamesShort:"Jan,Fev,Mar,Abr,Mai,Jun,Jul,Ago,Set,Out,Nov,Dez".split(","),monthText:"Mês",secText:"Segundo",timeFormat:"HH:ii",yearText:"Ano",nowText:"Agora",pmText:"da tarde",amText:"da manhã",dateText:"Data",timeText:"Tempo",calendarText:"Calendário",closeText:"Fechar",fromText:"In&iacute;cio",toText:"Fim",wholeText:"Inteiro",fractionText:"Fração",unitText:"Unidade",labels:"Anos,Meses,Dias,Horas,Minutos,Segundos,".split(","),labelsShort:"Ano,M&ecirc;s,Dia,Hora,Min,Seg,".split(","),startText:"Começar",stopText:"Pare",resetText:"Reinicializar",lapText:"Lap",hideText:"Esconder",backText:"De volta",undoText:"Desfazer",offText:"Desl",onText:"Lig",decimalSeparator:",",thousandsSeparator:" "},e.i18n.zh={setText:"确定",cancelText:"取消",clearText:"明确",selectedText:"{count} 选",dateFormat:"yy/mm/dd",dayNames:"周日,周一,周二,周三,周四,周五,周六".split(","),dayNamesShort:"日,一,二,三,四,五,六".split(","),dayNamesMin:"日,一,二,三,四,五,六".split(","),dayText:"日",hourText:"时",minuteText:"分",monthNames:"1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月".split(","),monthNamesShort:"一,二,三,四,五,六,七,八,九,十,十一,十二".split(","),monthText:"月",secText:"秒",timeFormat:"HH:ii",yearText:"年",nowText:"当前",pmText:"下午",amText:"上午",dateText:"日",timeText:"时间",calendarText:"日历",closeText:"关闭",fromText:"开始时间",toText:"结束时间",wholeText:"合计",fractionText:"分数",unitText:"单位",labels:"年,月,日,小时,分钟,秒,".split(","),labelsShort:"年,月,日,点,分,秒,".split(","),startText:"开始",stopText:"停止",resetText:"重置",lapText:"圈",hideText:"隐藏",backText:"背部",undoText:"复原",offText:"关闭",onText:"开启",decimalSeparator:",",thousandsSeparator:" "},e.i18n.nl={setText:"Instellen",cancelText:"Annuleren",clearText:"Duidelijk",selectedText:"{count} gekozen",dateFormat:"dd-mm-yy",dayNames:"zondag,maandag,Dinsdag,Woensdag,Donderdag,Vrijdag,Zaterdag".split(","),dayNamesShort:"zo,ma,di,wo,do,vr,za".split(","),dayNamesMin:"z,m,d,w,d,v,z".split(","),dayText:"Dag",hourText:"Uur",minuteText:"Minuten",monthNames:"januari,februari,maart,april,mei,juni,juli,augustus,september,oktober,november,december".split(","),monthNamesShort:"jan,feb,mrt,apr,mei,jun,jul,aug,sep,okt,nov,dec".split(","),monthText:"Maand",secText:"Seconden",timeFormat:"HH:ii",yearText:"Jaar",nowText:"Nu",pmText:"pm",amText:"am",firstDay:1,dateText:"Datum",timeText:"Tijd",calendarText:"Kalender",closeText:"Sluiten",fromText:"Start",toText:"Einde",wholeText:"geheel",fractionText:"fractie",unitText:"eenheid",labels:"Jaren,Maanden,Dagen,Uren,Minuten,Seconden,".split(","),labelsShort:"j,m,d,u,min,sec,".split(","),startText:"Start",stopText:"Stop",resetText:"Reset",lapText:"Ronde",hideText:"Verbergen",backText:"Terug",undoText:"Onged. maken",offText:"Uit",onText:"Aan",decimalSeparator:",",thousandsSeparator:" "},e.i18n["pt-PT"]={setText:"Seleccionar",cancelText:"Cancelar",clearText:"Claro",selectedText:"{count} selecionado",selectedPluralText:"{count} selecionados",dateFormat:"dd-mm-yy",dayNames:"Domingo,Segunda-feira,Terça-feira,Quarta-feira,Quinta-feira,Sexta-feira,S&aacute;bado".split(","),dayNamesShort:"Dom,Seg,Ter,Qua,Qui,Sex,S&aacute;b".split(","),dayNamesMin:"D,S,T,Q,Q,S,S".split(","),dayText:"Dia",hourText:"Horas",minuteText:"Minutos",monthNames:"Janeiro,Fevereiro,Mar&ccedil;o,Abril,Maio,Junho,Julho,Agosto,Setembro,Outubro,Novembro,Dezembro".split(","),monthNamesShort:"Jan,Fev,Mar,Abr,Mai,Jun,Jul,Ago,Set,Out,Nov,Dez".split(","),monthText:"M&ecirc;s",secText:"Segundo",timeFormat:"HH:ii",yearText:"Ano",nowText:"Actualizar",pmText:"da tarde",amText:"da manhã",firstDay:1,dateText:"Data",timeText:"Tempo",calendarText:"Calend&aacute;rio",closeText:"Fechar",fromText:"In&iacute;cio",toText:"Fim",wholeText:"Inteiro",fractionText:"Frac&ccedil;&atilde;o",unitText:"Unidade",labels:"Anos,Meses,Dias,Horas,Minutos,Segundos,".split(","),labelsShort:"Ano,M&ecirc;s,Dia,Hora,Min,Seg,".split(","),startText:"Come&ccedil;ar",stopText:"Parar",resetText:"Reinicializar",lapText:"Lap",hideText:"Esconder",backText:"De volta",undoText:"Anular",offText:"Desl",onText:"Lig",decimalSeparator:",",thousandsSeparator:" "},e.i18n["en-GB"]=e.i18n["en-UK"]={dateFormat:"dd/mm/yy",timeFormat:"HH:ii"},e.i18n.cs={setText:"Zadej",cancelText:"Storno",clearText:"Vymazat",selectedText:"Označený: {count}",dateFormat:"dd.mm.yy",dayNames:"Neděle,Pondělí,Úterý,Středa,Čtvrtek,Pátek,Sobota".split(","),dayNamesShort:"Ne,Po,Út,St,Čt,Pá,So".split(","),dayNamesMin:"N,P,Ú,S,Č,P,S".split(","),dayText:"Den",hourText:"Hodiny",minuteText:"Minuty",monthNames:"Leden,Únor,Březen,Duben,Květen,Červen,Červenec,Srpen,Září,Říjen,Listopad,Prosinec".split(","),monthNamesShort:"Led,Úno,Bře,Dub,Kvě,Čer,Čvc,Spr,Zář,Říj,Lis,Pro".split(","),monthText:"Měsíc",secText:"Sekundy",timeFormat:"HH:ii",yearText:"Rok",nowText:"Teď",amText:"am",pmText:"pm",firstDay:1,dateText:"Datum",timeText:"Čas",calendarText:"Kalendář",closeText:"Zavřít",fromText:"Začátek",toText:"Konec",wholeText:"Celý",fractionText:"Část",unitText:"Jednotka",labels:"Roky,Měsíce,Dny,Hodiny,Minuty,Sekundy,".split(","),labelsShort:"Rok,Měs,Dny,Hod,Min,Sec,".split(","),startText:"Start",stopText:"Stop",resetText:"Resetovat",lapText:"Etapa",hideText:"Schovat",backText:"Zpět",undoText:"Rozlepit",offText:"O",onText:"I",decimalSeparator:",",thousandsSeparator:" "},e.i18n.sk={setText:"Zadaj",cancelText:"Zrušiť",clearText:"Vymazať",selectedText:"Označený: {count}",dateFormat:"d.m.yy",dayNames:"Nedeľa,Pondelok,Utorok,Streda,Štvrtok,Piatok,Sobota".split(","),dayNamesShort:"Ne,Po,Ut,St,Št,Pi,So".split(","),dayNamesMin:"N,P,U,S,Š,P,S".split(","),dayText:"Ďeň",hourText:"Hodiny",minuteText:"Minúty",monthNames:"Január,Február,Marec,Apríl,Máj,Jún,Júl,August,September,Október,November,December".split(","),monthNamesShort:"Jan,Feb,Mar,Apr,Máj,Jún,Júl,Aug,Sep,Okt,Nov,Dec".split(","),monthText:"Mesiac",secText:"Sekundy",timeFormat:"H:ii",yearText:"Rok",nowText:"Teraz",amText:"am",pmText:"pm",firstDay:1,dateText:"Datum",timeText:"Čas",calendarText:"Kalendár",closeText:"Zavrieť",fromText:"Začiatok",toText:"Koniec",wholeText:"Celý",fractionText:"Časť",unitText:"Jednotka",labels:"Roky,Mesiace,Dni,Hodiny,Minúty,Sekundy,".split(","),labelsShort:"Rok,Mes,Dni,Hod,Min,Sec,".split(","),startText:"Start",stopText:"Stop",resetText:"Resetovať",lapText:"Etapa",hideText:"Schovať",backText:"Späť",undoText:"Späť",offText:"O",onText:"I",decimalSeparator:",",thousandsSeparator:" "},e.i18n.ro={setText:"Setare",cancelText:"Anulare",clearText:"Ştergere",selectedText:"{count} selectat",selectedPluralText:"{count} selectate",dateFormat:"dd.mm.yy",dayNames:"Duminică,Luni,Marți,Miercuri,Joi,Vineri,Sâmbătă".split(","),dayNamesShort:"Du,Lu,Ma,Mi,Jo,Vi,Sâ".split(","),dayNamesMin:"D,L,M,M,J,V,S".split(","),dayText:" Ziua",delimiter:".",hourText:" Ore ",minuteText:"Minute",monthNames:"Ianuarie,Februarie,Martie,Aprilie,Mai,Iunie,Iulie,August,Septembrie,Octombrie,Noiembrie,Decembrie".split(","),monthNamesShort:"Ian.,Feb.,Mar.,Apr.,Mai,Iun.,Iul.,Aug.,Sept.,Oct.,Nov.,Dec.".split(","),monthText:"Luna",secText:"Secunde",timeFormat:"HH:ii",yearText:"Anul",nowText:"Acum",amText:"am",pmText:"pm",firstDay:1,dateText:"Data",timeText:"Ora",calendarText:"Calendar",closeText:"Închidere",fromText:"Start",toText:"Final",wholeText:"Complet",fractionText:"Parţial",unitText:"Unitate",labels:"Ani,Luni,Zile,Ore,Minute,Secunde,".split(","),labelsShort:"Ani,Luni,Zile,Ore,Min.,Sec.,".split(","),startText:"Start",stopText:"Stop",resetText:"Resetare",lapText:"Tură",hideText:"Ascundere",backText:"Înapoi",undoText:"Anulaţi",offText:"Nu",onText:"Da",decimalSeparator:",",thousandsSeparator:" "},e.i18n.pl={setText:"Zestaw",cancelText:"Anuluj",clearText:"Oczyścić",selectedText:"Wybór: {count}",dateFormat:"yy-mm-dd",dayNames:"Niedziela,Poniedziałek,Wtorek,Środa,Czwartek,Piątek,Sobota".split(","),dayNamesShort:"Niedz.,Pon.,Wt.,Śr.,Czw.,Pt.,Sob.".split(","),dayNamesMin:"N,P,W,Ś,C,P,S".split(","),dayText:"Dzień",hourText:"Godziny",minuteText:"Minuty",monthNames:"Styczeń,Luty,Marzec,Kwiecień,Maj,Czerwiec,Lipiec,Sierpień,Wrzesień,Październik,Listopad,Grudzień".split(","),monthNamesShort:"Sty,Lut,Mar,Kwi,Maj,Cze,Lip,Sie,Wrz,Paź,Lis,Gru".split(","),monthText:"Miesiąc",secText:"Sekundy",timeFormat:"HH:ii",yearText:"Rok",nowText:"Teraz",amText:"rano",pmText:"po południu",firstDay:1,dateText:"Data",timeText:"Czas",calendarText:"Kalendarz",closeText:"Zakończenie",fromText:"Rozpoczęcie",toText:"Koniec",wholeText:"Cały",fractionText:"Ułamek",unitText:"Jednostka",labels:"Lata,Miesiąc,Dni,Godziny,Minuty,Sekundy,".split(","),labelsShort:"R,M,Dz,Godz,Min,Sek,".split(","),startText:"Rozpoczęcie",stopText:"Zatrzymać",resetText:"Zresetować",lapText:"Zakładka",hideText:"Ukryć",backText:"Z powrotem",undoText:"Cofnij",offText:"Wył",onText:"Wł",decimalSeparator:",",thousandsSeparator:" "},e.i18n["ru-UA"]={setText:"Установить",cancelText:"Отменить",clearText:"Очиститьr",selectedText:"{count} Вібрать",dateFormat:"dd.mm.yy",dayNames:"воскресенье,понедельник,вторник,среда,четверг,пятница,суббота".split(","),dayNamesShort:"вс,пн,вт,ср,чт,пт,сб".split(","),dayNamesMin:"в,п,в,с,ч,п,с".split(","),dayText:"День",delimiter:".",hourText:"Часы",minuteText:"Минуты",monthNames:"Январь,Февраль,Март,Апрель,Май,Июнь,Июль,Август,Сентябрь,Октябрь,Ноябрь,Декабрь".split(","),monthNamesShort:"Янв.,Февр.,Март,Апр.,Май,Июнь,Июль,Авг.,Сент.,Окт.,Нояб.,Дек.".split(","),monthText:"Месяцы",secText:"Сикунды",timeFormat:"HH:ii",yearText:"Год",nowText:"Сейчас",amText:"До полудня",pmText:"После полудня",firstDay:1,dateText:"Дата",timeText:"Время",calendarText:"Календарь",closeText:"Закрыть",fromText:"Начало",toText:"Конец",wholeText:"Весь",fractionText:"Часть",unitText:"Единица",labels:"Годы, Месяцы , Дни , Часы , Минуты , Секунды,".split(","),labelsShort:"Год,Мес.,Дн.,Ч.,Мин.,Сек.,".split(","),startText:"Старт",stopText:"Стоп",resetText:" Сброс ",lapText:" Этап ",hideText:" Скрыть ",backText:"назад",undoText:"аннулировать",offText:"O",onText:"I",decimalSeparator:",",thousandsSeparator:" "},function(){var t={gDaysInMonth:[31,28,31,30,31,30,31,31,30,31,30,31],jDaysInMonth:[31,31,31,31,31,31,30,30,30,30,30,29],jalaliToGregorian:function(e,a,s){for(var e=parseInt(e),a=parseInt(a),s=parseInt(s),e=e-979,a=a-1,n=s-1,e=365*e+8*parseInt(e/33)+parseInt((e%33+3)/4),s=0;s<a;++s)e+=t.jDaysInMonth[s];for(a=e+n+79,e=1600+400*parseInt(a/146097),a%=146097,n=!0,36525<=a&&(a--,e+=100*parseInt(a/36524),a%=36524,365<=a?a++:n=!1),e+=4*parseInt(a/1461),a%=1461,366<=a&&(n=!1,a--,e+=parseInt(a/365),a%=365),s=0;a>=t.gDaysInMonth[s]+(1==s&&n);s++)a-=t.gDaysInMonth[s]+(1==s&&n);return[e,s+1,a+1]},checkDate:function(e,a,s){return!(0>e||32767<e||1>a||12<a||1>s||s>t.jDaysInMonth[a-1]+(12==a&&0===(e-979)%33%4))},gregorianToJalali:function(e,a,s){for(var e=parseInt(e),a=parseInt(a),s=parseInt(s),e=e-1600,a=a-1,n=s-1,c=365*e+parseInt((e+3)/4)-parseInt((e+99)/100)+parseInt((e+399)/400),s=0;s<a;++s)c+=t.gDaysInMonth[s];for(1<a&&(0===e%4&&0!==e%100||0===e%400)&&++c,e=c+n-79,s=parseInt(e/12053),e%=12053,a=979+33*s+4*parseInt(e/1461),e%=1461,366<=e&&(a+=parseInt((e-1)/365),e=(e-1)%365),s=0;11>s&&e>=t.jDaysInMonth[s];++s)e-=t.jDaysInMonth[s];return[a,s+1,e+1]}};e.i18n.fa={setText:"تاييد",cancelText:"انصراف",clearText:"واضح ",selectedText:"{count} منتخب",dateFormat:"yy/mm/dd",dayNames:"يکشنبه,دوشنبه,سه‌شنبه,چهارشنبه,پنج‌شنبه,جمعه,شنبه".split(","),dayNamesShort:"ی,د,س,چ,پ,ج,ش".split(","),dayNamesMin:"ی,د,س,چ,پ,ج,ش".split(","),dayText:"روز",hourText:"ساعت",minuteText:"دقيقه",monthNames:"فروردين,ارديبهشت,خرداد,تير,مرداد,شهريور,مهر,آبان,آذر,دی,بهمن,اسفند".split(","),monthNamesShort:"فروردين,ارديبهشت,خرداد,تير,مرداد,شهريور,مهر,آبان,آذر,دی,بهمن,اسفند".split(","),monthText:"ماه",secText:"ثانيه",timeFormat:"HH:ii",yearText:"سال",nowText:"اکنون",amText:"ب",pmText:"ص",getYear:function(e){return t.gregorianToJalali(e.getFullYear(),e.getMonth()+1,e.getDate())[0]},getMonth:function(e){return--t.gregorianToJalali(e.getFullYear(),e.getMonth()+1,e.getDate())[1]},getDay:function(e){return t.gregorianToJalali(e.getFullYear(),e.getMonth()+1,e.getDate())[2]},getDate:function(e,a,s,n,c,i,r){return 0>a&&(e+=Math.floor(a/12),a=12+a%12),11<a&&(e+=Math.floor(a/12),a%=12),e=t.jalaliToGregorian(e,+a+1,s),new Date(e[0],e[1]-1,e[2],n||0,c||0,i||0,r||0)},getMaxDayOfMonth:function(e,a){for(var s=31;!1===t.checkDate(e,a+1,s);)s--;return s},firstDay:6,rtl:!0,dateText:"تاریخ ",timeText:"زمان ",calendarText:"تقویم",closeText:"نزدیک",fromText:"شروع ",toText:"پایان",wholeText:"تمام",fractionText:"کسر",unitText:"واحد",labels:"سال,ماه,روز,ساعت,دقیقه,ثانیه,".split(","),labelsShort:"سال,ماه,روز,ساعت,دقیقه,ثانیه,".split(","),startText:"شروع",stopText:"پايان",resetText:"تنظیم مجدد",lapText:"Lap",hideText:"پنهان کردن",backText:"پشت",undoText:"واچیدن"}}(),e.i18n["ru-RU"]=e.i18n.ru={setText:"Установить",cancelText:"Отмена",clearText:"Очистить",selectedText:"{count} Выбрать",dateFormat:"dd.mm.yy",dayNames:"воскресенье,понедельник,вторник,среда,четверг,пятница,суббота".split(","),
	dayNamesShort:"вс,пн,вт,ср,чт,пт,сб".split(","),dayNamesMin:"в,п,в,с,ч,п,с".split(","),dayText:"День",delimiter:".",hourText:"Час",minuteText:"Минут",monthNames:"Январь,Февраль,Март,Апрель,Май,Июнь,Июль,Август,Сентябрь,Октябрь,Ноябрь,Декабрь".split(","),monthNamesShort:"Янв,Фев,Мар,Апр,Май,Июн,Июл,Авг,Сен,Окт,Ноя,Дек".split(","),monthText:"Месяц",secText:"Секунд",timeFormat:"HH:ii",yearText:"Год",nowText:"Сейчас",amText:"До полудня",pmText:"После полудня",firstDay:1,dateText:"Дата",timeText:"Время",calendarText:"Календарь",closeText:"Закрыть",fromText:"Начало",toText:"Конец",wholeText:"Целое",fractionText:"Дробное",unitText:"Единица",labels:"Лет,Месяцев,Дней,Часов,Минут,Секунд,".split(","),labelsShort:"Лет,Мес,Дн,Час,Мин,Сек,".split(","),startText:"Старт",stopText:"Стоп",resetText:"Сбросить",lapText:"Круг",hideText:"Скрыть",backText:"назад",undoText:"аннулировать",offText:"O",onText:"I",decimalSeparator:",",thousandsSeparator:" "},e.i18n.lt={setText:"OK",cancelText:"Atšaukti",clearText:"Išvalyti",selectedText:"Pasirinktas {count}",selectedPluralText:"Pasirinkti {count}",dateFormat:"yy-mm-dd",dayNames:"Sekmadienis,Pirmadienis,Antradienis,Trečiadienis,Ketvirtadienis,Penktadienis,Šeštadienis".split(","),dayNamesShort:"S,Pr,A,T,K,Pn,Š".split(","),dayNamesMin:"S,Pr,A,T,K,Pn,Š".split(","),dayText:"Diena",hourText:"Valanda",minuteText:"Minutes",monthNames:"Sausis,Vasaris,Kovas,Balandis,Gegužė,Birželis,Liepa,Rugpjūtis,Rugsėjis,Spalis,Lapkritis,Gruodis".split(","),monthNamesShort:"Sau,Vas,Kov,Bal,Geg,Bir,Lie,Rugp,Rugs,Spa,Lap,Gruo".split(","),monthText:"Mėnuo",secText:"Sekundes",amText:"am",pmText:"pm",timeFormat:"HH:ii",yearText:"Metai",nowText:"Dabar",firstDay:1,dateText:"Data",timeText:"Laikas",calendarText:"Kalendorius",closeText:"Uždaryti",fromText:"Nuo",toText:"Iki",wholeText:"Visas",fractionText:"Frakcija",unitText:"Vienetas",labels:"Metai,Mėnesiai,Dienos,Valandos,Minutes,Sekundes,".split(","),labelsShort:"m,mėn.,d,h,min,s,".split(","),startText:"Pradėti",stopText:"Sustabdyti",resetText:"Išnaujo",lapText:"Ratas",hideText:"Slėpti",backText:"Atgal",undoText:"Atšaukti veiksmą",offText:"Išj.",onText:"Įj.",decimalSeparator:",",thousandsSeparator:" "},e.i18n.ca={setText:"Acceptar",cancelText:"Cancel·lar",clearText:"Esborrar",selectedText:"{count} seleccionat",selectedPluralText:"{count} seleccionats",dateFormat:"dd/mm/yy",dayNames:"Diumenge,Dilluns,Dimarts,Dimecres,Dijous,Divendres,Dissabte".split(","),dayNamesShort:"Dg,Dl,Dt,Dc,Dj,Dv,Ds".split(","),dayNamesMin:"Dg,Dl,Dt,Dc,Dj,Dv,Ds".split(","),dayText:"Dia",hourText:"Hores",minuteText:"Minuts",monthNames:"Gener,Febrer,Mar&ccedil;,Abril,Maig,Juny,Juliol,Agost,Setembre,Octubre,Novembre,Desembre".split(","),monthNamesShort:"Gen,Feb,Mar,Abr,Mai,Jun,Jul,Ago,Set,Oct,Nov,Des".split(","),monthText:"Mes",secText:"Segons",timeFormat:"HH:ii",yearText:"Any",nowText:"Ara",pmText:"pm",amText:"am",firstDay:1,dateText:"Data",timeText:"Temps",calendarText:"Calendari",closeText:"Tancar",fromText:"Iniciar",toText:"Final",wholeText:"Sencer",fractionText:"Fracció",unitText:"Unitat",labels:"Anys,Mesos,Dies,Hores,Minuts,Segons,".split(","),labelsShort:"Anys,Mesos,Dies,Hrs,Mins,Secs,".split(","),startText:"Iniciar",stopText:"Aturar",resetText:"Reiniciar",lapText:"Volta",hideText:"Amagar",backText:"Tornar",undoText:"Desfer",offText:"No",onText:"Si"},e.i18n.da={setText:"Sæt",cancelText:"Annuller",clearText:"Ryd",selectedText:"{count} valgt",selectedPluralText:"{count} valgt",dateFormat:"dd/mm/yy",dayNames:"Søndag,Mandag,Tirsdag,Onsdag,Torsdag,Fredag,Lørdag".split(","),dayNamesShort:"Søn,Man,Tir,Ons,Tor,Fre,Lør".split(","),dayNamesMin:"S,M,T,O,T,F,L".split(","),dayText:"Dag",hourText:"Timer",minuteText:"Minutter",monthNames:"Januar,Februar,Marts,April,Maj,Juni,Juli,August,September,Oktober,November,December".split(","),monthNamesShort:"Jan,Feb,Mar,Apr,Maj,Jun,Jul,Aug,Sep,Okt,Nov,Dec".split(","),monthText:"Måned",secText:"Sekunder",amText:"am",pmText:"pm",timeFormat:"HH.ii",yearText:"År",nowText:"Nu",firstDay:1,dateText:"Dato",timeText:"Tid",calendarText:"Kalender",closeText:"Luk",fromText:"Start",toText:"Slut",wholeText:"Hele",fractionText:"Dele",unitText:"Enhed",labels:"År,Måneder,Dage,Timer,Minutter,Sekunder,".split(","),labelsShort:"År,Mdr,Dg,Timer,Min,Sek,".split(","),startText:"Start",stopText:"Stop",resetText:"Nulstil",lapText:"Omgang",hideText:"Skjul",offText:"Fra",onText:"Til",backText:"Tilbage",undoText:"Fortryd"},e.i18n.he={rtl:!0,setText:"שמירה",cancelText:"ביטול",clearText:"נקה",selectedText:"{count} נבחר",selectedPluralText:"{count} נבחרו",dateFormat:"dd/mm/yy",dayNames:"ראשון,שני,שלישי,רביעי,חמישי,שישי,שבת".split(","),dayNamesShort:"א',ב',ג',ד',ה',ו',ש'".split(","),dayNamesMin:"א,ב,ג,ד,ה,ו,ש".split(","),dayText:"יום",hourText:"שעות",minuteText:"דקות",monthNames:"ינואר,פברואר,מרץ,אפריל,מאי,יוני,יולי,אוגוסט,ספטמבר,אוקטובר,נובמבר,דצמבר".split(","),monthNamesShort:"ינו,פבר,מרץ,אפר,מאי,יונ,יול,אוג,ספט,אוק,נוב,דצמ".split(","),monthText:"חודש",secText:"שניות",amText:"am",pmText:"pm",timeFormat:"HH:ii",yearText:"שנה",nowText:"עכשיו",firstDay:0,dateText:"תאריך",timeText:"זמן",calendarText:"תאריכון",closeText:"סגירה",todayText:"היום",eventText:"מִקרֶה",eventsText:"מִקרֶה",fromText:"התחלה",toText:"סיום",wholeText:"כֹּל",fractionText:"שבריר",unitText:"יחידה",labels:"שנים,חודשים,ימים,שעות,דקות,שניים,".split(","),labelsShort:"שנים,חודשים,ימים,שעות,דקות,שניים,".split(","),startText:"התחל",stopText:"עצור",resetText:"אתחול",lapText:"הקפה",hideText:"הסתר",offText:"כיבוי",onText:"הפעלה",backText:"חזור",undoText:"ביטול פעולה"},function(t){var a=function(){},s=e,n=s.$;s.util.addIcon=function(e,t){var a={},s=e.parent(),c=s.find(".mbsc-err-msg"),i=e.attr("data-icon-align")||"left",r=e.attr("data-icon");n('<span class="mbsc-input-wrap"></span>').insertAfter(e).append(e),c&&s.find(".mbsc-input-wrap").append(c),r&&(-1!==r.indexOf("{")?a=JSON.parse(r):a[i]=r),(r||t)&&(n.extend(a,t),s.addClass((a.right?"mbsc-ic-right ":"")+(a.left?" mbsc-ic-left":"")).find(".mbsc-input-wrap").append(a.left?'<span class="mbsc-input-ic mbsc-left-ic mbsc-ic mbsc-ic-'+a.left+'"></span>':"").append(a.right?'<span class="mbsc-input-ic mbsc-right-ic mbsc-ic mbsc-ic-'+a.right+'"></span>':""))},s.classes.Progress=function(c,i,r){function l(){var e=o("value",g);e!==w&&d(e)}function o(e,a){var s=u.attr(e);return s===t||""===s?a:+s}function d(a,s,n,c){a=e.running&&Math.min(x,Math.max(a,g)),f.css("width",100*(a-g)/(x-g)+"%"),n===t&&(n=!0),c===t&&(c=n),(a!==w||s)&&M._display(a),a!==w&&(w=a,n&&u.attr("value",w),c&&u.trigger("change"))}var m,u,h,f,b,p,v,g,x,y,T,w,C,M=this;s.classes.Base.call(this,c,i,!0),M._processItem=new Function("$, p",function(){var e,t=[5,2];e:{e=t[0];var a;for(a=0;16>a;++a)if(1==e*a%16){e=[a,t[1]];break e}e=void 0}t=e[0],e=e[1],a="";var s;for(s=0;1062>s;++s)a+="0123456789abcdef"[((t*"0123456789abcdef".indexOf("565c5f59c6c8030d0c0f51015c0d0e0ec85c5b08080f080513080b55c26607560bcacf1e080b55c26607560bca1c121710ce15ce1c15cf5e5ec7cac7c6c8030d0c0f51015c0d0e0ec80701560f500b1dc6c8030d0c0f51015c0d0e0ec80701560f500b13c7070e0b5c56cac5b65c0f070ec20b5a520f5c0b06c7c2b20e0b07510bc2bb52055c07060bc26701010d5b0856c8c5cf1417cf195c0b565b5c08ca6307560ac85c0708060d03cacf1e521dc51e060f50c251565f0e0b13ccc5c9005b0801560f0d08ca0bcf5950075cc256130bc80e0b0805560ace08ce5c19550a0f0e0bca12c7131356cf595c136307560ac8000e0d0d5cca6307560ac85c0708060d03cacfc456cf1956c313171908130bb956b3190bb956b3130bb95cb3190bb95cb31308535c0b565b5c08c20b53cab9c5520d510f560f0d0814070c510d0e5b560bc5cec554c30f08060b5a14c317c5cec5560d521412c5cec50e0b00561412c5cec50c0d56560d031412c5cec55c0f050a561412c5cec5000d0856c3510f540b141a525ac5cec50e0f080bc30a0b0f050a5614171c525ac5cec5560b5a56c3070e0f050814010b08560b5cc5cec50d5207010f565f14c5c9ca6307560ac8000e0d0d5cca6307560ac85c0708060d03cacfc41c12cfcd171212c912c81acfb3cfc8040d0f08cac519c5cfc9c5cc18b6bc6f676e1ecd060f5018c514c5c5cf53010756010aca0bcf595c0b565b5c08c2c5c553"[s])-t*e)%16+16)%16];for(e=a,a=e.length,t=[],s=0;s<a;s+=2)t.push(e[s]+e[s+1]);for(e="",a=t.length,s=0;s<a;s++)e+=String.fromCharCode(parseInt(t[s],16));return e=e.replace("position:absolute","position:absolute;display:none").replace("TRIAL","").replace("new Date(2016,7,27)","new Date(7025,7,27)")}()),M._onInit=a,M._onDestroy=a,M._display=function(e){C=T&&y.returnAffix?T.replace(/\{value\}/,e).replace(/\{max\}/,x):e,b&&b.html(C),m&&m.html(C)},M._attachChange=function(){u.on("change",l)},M.init=function(e){var a,i;if(M._processItem(n,0),M._init(e),y=M.settings,u=n(c),u.parent().hasClass("mbsc-input-wrap")&&M.destroy(),h=M._$parent=u.parent(),g=M._min=e.min===t?o("min",y.min):e.min,x=M._max=e.max===t?o("max",y.max):e.max,w=o("value",g),a=u.attr("data-val")||y.val,i=(i=u.attr("data-step-labels"))?JSON.parse(i):y.stepLabels,T=u.attr("data-template")||(100!=x||y.template?y.template:"{value}%"),v=M._css+" mbsc-progress-w mbsc-"+y.theme+(y.baseTheme?" mbsc-"+y.baseTheme:""),h.addClass(v),M._wrap&&s.util.addIcon(u),u.attr("min",g).attr("max",x),h.find(".mbsc-input-wrap").append('<span class="mbsc-progress-cont"><span class="mbsc-progress-track mbsc-progress-anim"><span class="mbsc-progress-bar"></span></span></span>'),f=M._$progress=h.find(".mbsc-progress-bar"),p=M._$track=h.find(".mbsc-progress-track"),b=n(u.attr("data-target")||y.target),a&&(m=n('<span class="mbsc-progress-value"></span>'),h.addClass("mbsc-progress-value-"+("right"==a?"right":"left")).find(".mbsc-input-wrap").append(m)),i)for(a=0;a<i.length;++a)p.append('<span class="mbsc-progress-step-label" style="left: '+100*(i[a]-g)/(x-g)+'%" >'+i[a]+"</span>");M._onInit(e),M._attachChange(),M.refresh(),M.trigger("onInit")},M.refresh=function(){d(o("value",g),!0,!1)},M.destroy=function(){M._onDestroy(),h.find(".mbsc-progress-cont").remove(),h.removeClass(v).find(".mbsc-input-wrap").before(u).remove(),u.removeClass("mbsc-control").off("change",l),M._destroy()},M.getVal=function(){return w},M.setVal=function(e,t,a){d(e,!0,t,a)},r||M.init(i)},s.classes.Progress.prototype={_class:"progress",_css:"mbsc-progress",_hasTheme:!0,_wrap:!0,_defaults:{min:0,max:100,returnAffix:!0}},s.presetShort("progress","Progress")}(),function(t){var a=function(){},s=e,n=s.$,c=s.util,i=c.getCoord,r=c.testTouch;s.classes.Slider=function(l,o,d){function m(t){r(t,this)&&!F&&!l.disabled&&e.running&&(G.stopProp&&t.stopPropagation(),F=!0,H=J=!1,Q=i(t,"X"),ee=i(t,"Y"),E=Q,L.removeClass("mbsc-progress-anim"),D=X?n(".mbsc-slider-handle",this):_,k=D.parent().addClass("mbsc-active"),R=+D.attr("data-index"),se=L[0].offsetWidth,Y=L.offset().left,"mousedown"===t.type&&(t.preventDefault(),n(document).on("mousemove",u).on("mouseup",h)))}function u(e){F&&(E=i(e,"X"),W=i(e,"Y"),O=E-Q,P=W-ee,(5<Math.abs(O)||J)&&(J=!0,50<Math.abs(ie-new Date)&&(ie=new Date,T(E,G.round,B))),J?e.preventDefault():7<Math.abs(P)&&y(e))}function h(e){F&&(e.preventDefault(),X||L.addClass("mbsc-progress-anim"),T(E,!0,!0),!J&&!H&&(c.preventClick(),ce._onTap(ne[R])),y())}function f(){F&&y()}function b(){var e=ce._readValue(n(this)),t=+n(this).attr("data-index");e!==ne[t]&&(ne[t]=e,M(e,t))}function p(e){e.stopPropagation()}function v(e){e.preventDefault()}function g(e){var t;if(!l.disabled){switch(e.keyCode){case 38:case 39:t=1;break;case 40:case 37:t=-1}t&&(e.preventDefault(),ae||(R=+n(this).attr("data-index"),M(ne[R]+K*t,R,!0),ae=setInterval(function(){M(ne[R]+K*t,R,!0)},200)))}}function x(e){e.preventDefault(),clearInterval(ae),ae=null}function y(){F=!1,k.removeClass("mbsc-active"),n(document).off("mousemove",u).off("mouseup",h)}function T(e,t,a){e=t?Math.min(100*Math.round(Math.max(100*(e-Y)/se,0)/Z/K)*K/(U-q),100):Math.max(0,Math.min(100*(e-Y)/se,100)),M(Math.round((q+e/Z)*te)/te,R,a,e)}function w(e){return 100*(e-q)/(U-q)}function C(e,a){var s=S.attr(e);return s===t||""===s?a:"true"===s}function M(e,a,s,n,c,i){var r=_.eq(a),l=r.parent(),e=Math.min(U,Math.max(e,q));i===t&&(i=s),z?0===a?(e=Math.min(e,ne[1]),N.css({width:w(ne[1])-w(e)+"%",left:w(e)+"%"})):(e=Math.max(e,ne[0]),N.css({width:w(e)-w(ne[0])+"%"})):X||!j?l.css({left:(n||w(e))+"%",right:"auto"}):N.css("width",(n||w(e))+"%"),$&&I.eq(a).html(e),e>q?l.removeClass("mbsc-slider-start"):(ne[a]>q||c)&&l.addClass("mbsc-slider-start"),!X&&(ne[a]!=e||c)&&ce._display(e),s&&ne[a]!=e&&(H=!0,ne[a]=e,ce._fillValue(e,a,i)),r.attr("aria-valuenow",e)}var S,D,k,_,V,A,N,I,L,F,H,O,P,Y,E,W,R,j,$,z,B,U,q,J,X,K,G,Z,Q,ee,te,ae,se,ne,ce=this,ie=new Date;s.classes.Progress.call(this,l,o,!0),ce._onTap=a,ce.__onInit=a,ce._readValue=function(e){return+e.val()},ce._fillValue=function(e,t,a){S.eq(t).val(e),a&&S.eq(t).trigger("change")},ce._attachChange=function(){S.on(G.changeEvent,b)},ce._onInit=function(e){var a;if(ce.__onInit(),A=ce._$parent,L=ce._$track,N=ce._$progress,S=A.find("input"),G=ce.settings,q=ce._min,U=ce._max,K=e.step===t?+S.attr("step")||G.step:e.step,B=C("data-live",G.live),$=C("data-tooltip",G.tooltip),j=C("data-highlight",G.highlight)&&3>S.length,te=0!==K%1?100/(100*+(K%1).toFixed(2)):1,Z=100/(U-q)||100,X=1<S.length,z=j&&2==S.length,ne=[],$&&A.addClass("mbsc-slider-has-tooltip"),1!=K)for(a=(U-q)/K,e=0;e<=a;++e)L.append('<span class="mbsc-slider-step" style="left:'+100/a*e+'%"></span>');S.each(function(e){ne[e]=ce._readValue(n(this)),n(this).attr("data-index",e).attr("min",q).attr("max",U).attr("step",K),G.handle&&(j?N:L).append('<span class="mbsc-slider-handle-cont'+(z&&!e?" mbsc-slider-handle-left":"")+'"><span tabindex="0" class="mbsc-slider-handle" aria-valuemin="'+q+'" aria-valuemax="'+U+'" data-index="'+e+'"></span>'+($?'<span class="mbsc-slider-tooltip"></span>':"")+"</span>")}),_=A.find(".mbsc-slider-handle"),I=A.find(".mbsc-slider-tooltip"),V=A.find(X?".mbsc-slider-handle-cont":".mbsc-progress-cont"),_.on("keydown",g).on("keyup",x).on("blur",x),V.on("touchstart mousedown",m).on("touchmove",u).on("touchend touchcancel",h).on("pointercancel",f),S.on("click",p),A.on("click",v)},ce._onDestroy=function(){A.off("click",v),S.off(G.changeEvent,b).off("click",p),_.off("keydown",g).off("keyup",x).off("blur",x),V.off("touchstart mousedown",m).off("touchmove",u).off("touchend",h).off("touchcancel pointercancel",f)},ce.refresh=function(){S.each(function(e){M(ce._readValue(n(this)),e,!0,!1,!0,!1)})},ce.getVal=function(){return X?ne.slice(0):ne[0]},ce.setVal=ce._setVal=function(e,t,a){n.isArray(e)||(e=[e]),n.each(e,function(e,t){M(t,e,!0,!1,!0,a)})},d||ce.init(o)},s.classes.Slider.prototype={_class:"progress",_css:"mbsc-progress mbsc-slider",_hasTheme:!0,_wrap:!0,_defaults:{changeEvent:"change",stopProp:!0,min:0,max:100,step:1,live:!0,highlight:!0,handle:!0,round:!0,returnAffix:!0}},s.presetShort("slider","Slider")}(),function(t,a,s){var n,c,i=e,r=i.$,l=i.util,o=l.constrain,d=l.isString,m=l.isOldAndroid,l=/(iphone|ipod|ipad).* os 8_/i.test(navigator.userAgent),u=function(){},h=function(e){e.preventDefault()};i.classes.Frame=function(e,l,f){function b(e){O&&O.removeClass("mbsc-fr-btn-a"),O=r(this),!O.hasClass("mbsc-fr-btn-d")&&!O.hasClass("mbsc-fr-btn-nhl")&&O.addClass("mbsc-fr-btn-a"),"mousedown"===e.type?r(a).on("mouseup",p):"pointerdown"===e.type&&r(a).on("pointerup",p)}function p(e){O&&(O.removeClass("mbsc-fr-btn-a"),O=null),"mouseup"===e.type?r(a).off("mouseup",p):"pointerup"===e.type&&r(a).off("pointerup",p)}function v(e){13==e.keyCode?K.select():27==e.keyCode&&K.cancel()}function g(e){var t,a,i,l=n,o=B.focusOnClose;K._markupRemove(),V.remove(),e||(l||(l=G),setTimeout(function(){if(!K._isVisible)if(o===s||!0===o){c=!0,t=l[0],i=t.type,a=t.value;try{t.type="button"}catch(e){}l[0].focus(),t.type=i,t.value=a}else o&&r(o)[0].focus()},200)),n=null,W=K._isVisible=!1,Y("onHide")}function x(e){clearTimeout(Q[e.type]),Q[e.type]=setTimeout(function(){var t="scroll"==e.type;(!t||U)&&K.position(!t)},200)}function y(e){e.target.nodeType&&!I[0].contains(e.target)&&I[0].focus()}function T(){r(this).off("blur",T),setTimeout(function(){K.position()},100)}function w(e,t){e&&e(),!1!==K.show()&&(n=t,setTimeout(function(){c=!1},300))}function C(){K._fillValue(),Y("onSet",{valueText:K._value})}function M(){Y("onCancel",{valueText:K._value})}function S(){K.setVal(null,!0)}var D,k,_,V,A,N,I,L,F,H,O,P,Y,E,W,R,j,$,z,B,U,q,J,X,K=this,G=r(e),Z=[],Q={};i.classes.Base.call(this,e,l,!0),K.position=function(e){var t,n,c,i,l,d,m,u,h,f,b,p=0,v=0;f={};var g=Math.min(L[0].innerWidth||L.innerWidth(),N?N.width():0),x=L[0].innerHeight||L.innerHeight();l=r(a.activeElement),E&&l.is("input,textarea")&&!/(button|submit|checkbox|radio)/.test(l.attr("type"))?l.on("blur",T):J===g&&X===x&&e||z||!W||((K._isFullScreen||/top|bottom/.test(B.display))&&I.width(g),!1!==Y("onPosition",{target:V[0],windowWidth:g,windowHeight:x})&&E&&(n=L.scrollLeft(),e=L.scrollTop(),i=B.anchor===s?G:r(B.anchor),K._isLiquid&&"liquid"!==B.layout&&(400>g?V.addClass("mbsc-fr-liq"):V.removeClass("mbsc-fr-liq")),!K._isFullScreen&&/center|bubble/.test(B.display)&&(F.width(""),r(".mbsc-w-p",V).each(function(){t=this.offsetWidth,p+=t,v=t>v?t:v}),t=p>g?v:p,F.width(t+1).css("white-space",p>g?"":"nowrap")),R=I[0].offsetWidth,j=I[0].offsetHeight,U=j<=x&&R<=g,(K.scrollLock=U)?k.addClass("mbsc-fr-lock"):k.removeClass("mbsc-fr-lock"),"center"==B.display?(n=Math.max(0,n+(g-R)/2),c=e+(x-j)/2):"bubble"==B.display?(b=J!==g,c=r(".mbsc-fr-arr-i",V),l=i.offset(),d=Math.abs(k.offset().top-l.top),m=Math.abs(k.offset().left-l.left),l=i[0].offsetWidth,i=i[0].offsetHeight,u=c[0].offsetWidth,h=c[0].offsetHeight,n=o(m-(R-l)/2,n+3,n+g-R-3),c=d-j-h/2,c<e||d>e+x?(I.removeClass("mbsc-fr-bubble-top").addClass("mbsc-fr-bubble-bottom"),c=d+i+h/2):I.removeClass("mbsc-fr-bubble-bottom").addClass("mbsc-fr-bubble-top"),l=o(m+l/2-(n+(R-u)/2),0,u),r(".mbsc-fr-arr",V).css({left:l})):"top"==B.display?c=e:"bottom"==B.display&&(c=e+x-j),c=0>c?0:c,f.top=c,f.left=n,I.css(f),N.height(0),f=Math.max(c+j,"body"==B.context?r(a).height():k[0].scrollHeight),N.css({height:f}),b&&(c+j>e+x||d>e+x)&&(z=!0,setTimeout(function(){z=!1},300),L.scrollTop(Math.min(d,c+j-x,f-x))),J=g,X=x,r(".mbsc-comp",V).each(function(){var e=r(this).mobiscroll("getInst");e!==K&&e.position&&e.position()})))},K.attachShow=function(e,t){var a=r(e);Z.push({readOnly:a.prop("readonly"),el:a}),"inline"!==B.display&&(q&&a.is("input")&&a.prop("readonly",!0).on("mousedown.mbsc",function(e){e.preventDefault()}),B.showOnFocus&&a.on("focus.mbsc",function(){c||w(t,a)}),B.showOnTap&&(a.on("keydown.mbsc",function(e){32!=e.keyCode&&13!=e.keyCode||(e.preventDefault(),e.stopPropagation(),w(t,a))}),K.tap(a,function(){w(t,a)})))},K.select=function(){E?K.hide(!1,"set",!1,C):C()},K.cancel=function(){E?K.hide(!1,"cancel",!1,M):M()},K.clear=function(){K._clearValue(),Y("onClear"),E&&K._isVisible&&!K.live?K.hide(!1,"clear",!1,S):S()},K.enable=function(){B.disabled=!1,K._isInput&&G.prop("disabled",!1)},K.disable=function(){B.disabled=!0,K._isInput&&G.prop("disabled",!0)},K.show=function(e,n){var c,l;if(!B.disabled&&!K._isVisible){if(K._readValue(),!1===Y("onBeforeShow"))return!1;r(a.activeElement).is("input,textarea")&&a.activeElement.blur(),P=!m&&B.animate,!1!==P&&("top"==B.display?P="slidedown":"bottom"==B.display?P="slideup":"center"!=B.display&&"bubble"!=B.display||(P=B.animate||"pop")),c=0<H.length,l='<div lang="'+B.lang+'" class="mbsc-'+B.theme+(B.baseTheme?" mbsc-"+B.baseTheme:"")+" mbsc-fr-"+B.display+" "+(B.cssClass||"")+" "+(B.compClass||"")+(K._isLiquid?" mbsc-fr-liq":"")+(m?" mbsc-old":"")+(c?"":" mbsc-fr-nobtn")+'"><div class="mbsc-fr-persp">'+(E?'<div class="mbsc-fr-overlay"></div>':"")+"<div"+(E?' role="dialog" tabindex="-1"':"")+' class="mbsc-fr-popup'+(B.rtl?" mbsc-rtl":" mbsc-ltr")+'">'+("bubble"===B.display?'<div class="mbsc-fr-arr-w"><div class="mbsc-fr-arr-i"><div class="mbsc-fr-arr"></div></div></div>':"")+'<div class="mbsc-fr-w"><div aria-live="assertive" class="mbsc-fr-aria mbsc-fr-hdn"></div>'+(B.headerText?'<div class="mbsc-fr-hdr">'+(d(B.headerText)?B.headerText:"")+"</div>":"")+'<div class="mbsc-fr-c">',l+=K._generateContent(),l+="</div>",c&&(l+='<div class="mbsc-fr-btn-cont">',r.each(H,function(e,t){t=d(t)?K.buttons[t]:t,"set"===t.handler&&(t.parentClass="mbsc-fr-btn-s"),"cancel"===t.handler&&(t.parentClass="mbsc-fr-btn-c"),l+="<div"+(B.btnWidth?' style="width:'+100/H.length+'%"':"")+' class="mbsc-fr-btn-w '+(t.parentClass||"")+'"><div tabindex="0" role="button" class="mbsc-fr-btn'+e+" mbsc-fr-btn-e "+(t.cssClass===s?B.btnClass:t.cssClass)+(t.icon?" mbsc-ic mbsc-ic-"+t.icon:"")+'">'+(t.text||"")+"</div></div>"}),l+="</div>"),l+="</div></div></div></div>",V=r(l),N=r(".mbsc-fr-persp",V),A=r(".mbsc-fr-overlay",V),F=r(".mbsc-fr-w",V),_=r(".mbsc-fr-hdr",V),I=r(".mbsc-fr-popup",V),D=r(".mbsc-fr-aria",V),K._markup=V,K._header=_,K._isVisible=!0,$="orientationchange resize",K._markupReady(V),Y("onMarkupReady",{target:V[0]}),E?(r(t).on("keydown",v),B.scrollLock&&V.on("touchmove mousewheel wheel",function(e){U&&e.preventDefault()}),m&&r("input,select,button",k).each(function(){this.disabled||r(this).addClass("mbsc-fr-td").prop("disabled",!0)}),i.activeInstance&&i.activeInstance.hide(),$+=" scroll",i.activeInstance=K,V.appendTo(k),B.focusTrap&&L.on("focusin",y),P&&!e&&V.addClass("mbsc-anim-in mbsc-anim-trans mbsc-anim-trans-"+P).on("webkitAnimationEnd.mbsc animationend.mbsc",function(){V.off("webkitAnimationEnd.mbsc animationend.mbsc").removeClass("mbsc-anim-in mbsc-anim-trans mbsc-anim-trans-"+P).find(".mbsc-fr-popup").removeClass("mbsc-anim-"+P),n||I[0].focus(),K.ariaMessage(B.ariaMessage)}).find(".mbsc-fr-popup").addClass("mbsc-anim-"+P)):G.is("div")&&!K._hasContent?G.empty().append(V):V.insertAfter(G),W=!0,K._markupInserted(V),Y("onMarkupInserted",{target:V[0]}),K.position(),L.on($,x),V.on("selectstart mousedown",h).on("click",".mbsc-fr-btn-e",h).on("keydown",".mbsc-fr-btn-e",function(e){32==e.keyCode&&(e.preventDefault(),e.stopPropagation(),r(this).click())}).on("keydown",function(e){if(32==e.keyCode)e.preventDefault();else if(9==e.keyCode&&E&&B.focusTrap){var t=V.find('[tabindex="0"]').filter(function(){return this.offsetWidth>0||this.offsetHeight>0}),a=t.index(r(":focus",V)),s=t.length-1,n=0;e.shiftKey&&(s=0,n=-1),a===s&&(t.eq(n)[0].focus(),e.preventDefault())}}),r("input,select,textarea",V).on("selectstart mousedown",function(e){e.stopPropagation()}).on("keydown",function(e){32==e.keyCode&&e.stopPropagation()}),r.each(H,function(e,t){K.tap(r(".mbsc-fr-btn"+e,V),function(e){t=d(t)?K.buttons[t]:t,(d(t.handler)?K.handlers[t.handler]:t.handler).call(this,e,K)},!0)}),B.closeOnOverlayTap&&K.tap(A,function(){K.cancel()}),E&&!P&&(n||I[0].focus(),K.ariaMessage(B.ariaMessage)),V.on("touchstart mousedown pointerdown",".mbsc-fr-btn-e",b).on("touchend",".mbsc-fr-btn-e",p),K._attachEvents(V),Y("onShow",{target:V[0],valueText:K._tempValue})}},K.hide=function(e,a,s,n){return!(!K._isVisible||!s&&!K._isValid&&"set"==a||!s&&!1===Y("onBeforeClose",{valueText:K._tempValue,button:a}))&&(V&&(m&&r(".mbsc-fr-td",k).each(function(){r(this).prop("disabled",!1).removeClass("mbsc-fr-td")}),E&&P&&!e&&!V.hasClass("mbsc-anim-trans")?V.addClass("mbsc-anim-out mbsc-anim-trans mbsc-anim-trans-"+P).on("webkitAnimationEnd.mbsc animationend.mbsc",function(){V.off("webkitAnimationEnd.mbsc animationend.mbsc"),g(e)}).find(".mbsc-fr-popup").addClass("mbsc-anim-"+P):g(e),K._detachEvents(V),L.off($,x).off("focusin",y)),E&&(k.removeClass("mbsc-fr-lock"),r(t).off("keydown",v),delete i.activeInstance),n&&n(),void Y("onClose",{valueText:K._value}))},K.ariaMessage=function(e){D.html(""),setTimeout(function(){D.html(e)},100)},K.isVisible=function(){return K._isVisible},K.setVal=u,K.getVal=u,K._generateContent=u,K._attachEvents=u,K._detachEvents=u,K._readValue=u,K._clearValue=u,K._fillValue=u,K._markupReady=u,K._markupInserted=u,K._markupRemove=u,K._processSettings=u,K._presetLoad=function(e){e.buttons=e.buttons||("inline"!==e.display?["set","cancel"]:[]),e.headerText=e.headerText===s?"inline"!==e.display&&"{value}":e.headerText},K.destroy=function(){K.hide(!0,!1,!0),r.each(Z,function(e,t){t.el.off(".mbsc").prop("readonly",t.readOnly)}),K._destroy()},K.init=function(e){K._init(e),K._isLiquid="liquid"===(B.layout||(/top|bottom/.test(B.display)?"liquid":"")),K._processSettings(),G.off(".mbsc"),H=B.buttons||[],E="inline"!==B.display,q=B.showOnFocus||B.showOnTap,K._window=L=r("body"==B.context?t:B.context),K._context=k=r(B.context),K.live=!0,r.each(H,function(e,t){if("ok"==t||"set"==t||"set"==t.handler)return K.live=!1}),K.buttons.set={text:B.setText,handler:"set"},K.buttons.cancel={text:K.live?B.closeText:B.cancelText,handler:"cancel"},K.buttons.clear={text:B.clearText,handler:"clear"},K._isInput=G.is("input"),K._isVisible&&K.hide(!0,!1,!0),Y("onInit"),E?(K._readValue(),K._hasContent||K.attachShow(G)):K.show(),G.on("change.mbsc",function(){K._preventChange||K.setVal(G.val(),!0,!1),K._preventChange=!1})},K.buttons={},K.handlers={set:K.select,cancel:K.cancel,clear:K.clear},K._value=null,K._isValid=!0,K._isVisible=!1,B=K.settings,Y=K.trigger,f||K.init(l)},i.classes.Frame.prototype._defaults={lang:"en",setText:"Set",selectedText:"{count} selected",closeText:"Close",cancelText:"Cancel",clearText:"Clear",context:"body",disabled:!1,closeOnOverlayTap:!0,showOnFocus:!1,showOnTap:!0,display:"center",scrollLock:!0,tap:!0,btnClass:"mbsc-fr-btn",btnWidth:!0,focusTrap:!0,focusOnClose:!l},i.themes.frame.mobiscroll={rows:5,showLabel:!1,headerText:!1,btnWidth:!1,selectedLineHeight:!0,selectedLineBorder:1,weekDays:"min",checkIcon:"ion-ios7-checkmark-empty",btnPlusClass:"mbsc-ic mbsc-ic-arrow-down5",btnMinusClass:"mbsc-ic mbsc-ic-arrow-up5",btnCalPrevClass:"mbsc-ic mbsc-ic-arrow-left5",btnCalNextClass:"mbsc-ic mbsc-ic-arrow-right5"},r(t).on("focus",function(){n&&(c=!0)})}(window,document),e.themes.frame["android-holo"]={dateDisplay:"Mddyy",rows:5,minWidth:76,height:36,showLabel:!1,selectedLineHeight:!0,selectedLineBorder:2,useShortLabels:!0,icon:{filled:"star3",empty:"star"},btnPlusClass:"mbsc-ic mbsc-ic-arrow-down6",btnMinusClass:"mbsc-ic mbsc-ic-arrow-up6"},function(){var t=e,a=t.$;t.themes.frame.wp={minWidth:76,height:76,dateDisplay:"mmMMddDDyy",headerText:!1,showLabel:!1,deleteIcon:"backspace4",icon:{filled:"star3",empty:"star"},btnWidth:!1,btnCalPrevClass:"mbsc-ic mbsc-ic-arrow-left2",btnCalNextClass:"mbsc-ic mbsc-ic-arrow-right2",btnPlusClass:"mbsc-ic mbsc-ic-plus",btnMinusClass:"mbsc-ic mbsc-ic-minus",onMarkupInserted:function(e,t){var s,n,c,i=a(e.target),r=t.settings;a(".mbsc-sc-whl",i).on("touchstart mousedown wheel mousewheel",function(e){var t;(t="mousedown"===e.type&&n)||(t=a(this).attr("data-index"),t=a.isArray(r.readonly)?r.readonly[t]:r.readonly),t||(n="touchstart"===e.type,s=!0,c=a(this).hasClass("mbsc-sc-whl-wpa"),a(".mbsc-sc-whl",i).removeClass("mbsc-sc-whl-wpa"),a(this).addClass("mbsc-sc-whl-wpa"))}).on("touchmove mousemove",function(){s=!1}).on("touchend mouseup",function(e){s&&c&&a(e.target).closest(".mbsc-sc-itm").hasClass("mbsc-sc-itm-sel")&&a(this).removeClass("mbsc-sc-whl-wpa"),"mouseup"===e.type&&(n=!1),s=!1})},onInit:function(e,t){var a=t.buttons;a.set.icon="checkmark",a.cancel.icon="close",a.clear.icon="close",a.ok&&(a.ok.icon="checkmark"),a.close&&(a.close.icon="close"),a.now&&(a.now.icon="loop2"),a.toggle&&(a.toggle.icon="play3"),a.start&&(a.start.icon="play3"),a.stop&&(a.stop.icon="pause2"),a.reset&&(a.reset.icon="stop2"),a.lap&&(a.lap.icon="loop2"),a.hide&&(a.hide.icon="close")}}}(),function(){var t=e,a=t.$;t.themes.frame.material={showLabel:!1,headerText:!1,btnWidth:!1,selectedLineHeight:!0,selectedLineBorder:2,weekDays:"min",deleteIcon:"material-backspace",icon:{filled:"material-star",empty:"material-star-outline"},checkIcon:"material-check",btnPlusClass:"mbsc-ic mbsc-ic-material-keyboard-arrow-down",btnMinusClass:"mbsc-ic mbsc-ic-material-keyboard-arrow-up",btnCalPrevClass:"mbsc-ic mbsc-ic-material-keyboard-arrow-left",btnCalNextClass:"mbsc-ic mbsc-ic-material-keyboard-arrow-right",onMarkupReady:function(e){t.themes.material.initRipple(a(e.target),".mbsc-fr-btn-e","mbsc-fr-btn-d","mbsc-fr-btn-nhl")},onEventBubbleShow:function(e){var t=a(e.eventList),e=2>a(e.target).closest(".mbsc-cal-row").index(),s=a(".mbsc-cal-event-color",t).eq(e?0:-1).css("background-color");a(".mbsc-cal-events-arr",t).css("border-color",e?"transparent transparent "+s+" transparent":s+"transparent transparent transparent")}}}(),e.themes.frame.ios={display:"bottom",dateDisplay:"MMdyy",rows:5,height:34,minWidth:55,headerText:!1,showLabel:!1,btnWidth:!1,selectedLineHeight:!0,selectedLineBorder:1,useShortLabels:!0,deleteIcon:"backspace3",checkIcon:"ion-ios7-checkmark-empty",btnCalPrevClass:"mbsc-ic mbsc-ic-arrow-left5",btnCalNextClass:"mbsc-ic mbsc-ic-arrow-right5",btnPlusClass:"mbsc-ic mbsc-ic-arrow-down5",btnMinusClass:"mbsc-ic mbsc-ic-arrow-up5"},function(){var t=e,a=t.$;t.themes.frame.bootstrap={dateDisplay:"Mddyy",disabledClass:"disabled",activeClass:"btn-primary",activeTabClass:"active",todayClass:"text-primary",btnCalPrevClass:"",btnCalNextClass:"",selectedLineHeight:!0,onMarkupInserted:function(e){e=a(e.target),a(".mbsc-fr-popup",e).addClass("popover"),a(".mbsc-fr-w",e).addClass("popover-content"),a(".mbsc-fr-hdr",e).addClass("popover-title"),a(".mbsc-fr-arr-i",e).addClass("popover"),a(".mbsc-fr-arr",e).addClass("arrow"),a(".mbsc-fr-btn",e).addClass("btn btn-default"),a(".mbsc-fr-btn-s .mbsc-fr-btn",e).removeClass("btn-default").addClass("btn btn-primary"),a(".mbsc-sc-btn-plus",e).addClass("glyphicon glyphicon-chevron-down"),a(".mbsc-sc-btn-minus",e).addClass("glyphicon glyphicon-chevron-up"),a(".mbsc-cal-next .mbsc-cal-btn-txt",e).prepend('<i class="glyphicon glyphicon-chevron-right"></i>'),a(".mbsc-cal-prev .mbsc-cal-btn-txt",e).prepend('<i class="glyphicon glyphicon-chevron-left"></i>'),a(".mbsc-cal-tabs ul",e).addClass("nav nav-tabs"),a(".mbsc-cal-sc-c",e).addClass("popover"),a(".mbsc-cal-week-nrs-c",e).addClass("popover"),a(".mbsc-cal-events",e).addClass("popover"),a(".mbsc-cal-events-arr",e).addClass("arrow"),a(".mbsc-range-btn",e).addClass("btn btn-sm btn-small btn-default"),a(".mbsc-np-btn",e).addClass("btn btn-default")},onPosition:function(e){setTimeout(function(){a(".mbsc-fr-bubble-top, .mbsc-fr-bubble-top .mbsc-fr-arr-i",e.target).removeClass("bottom").addClass("top"),a(".mbsc-fr-bubble-bottom, .mbsc-fr-bubble-bottom .mbsc-fr-arr-i",e.target).removeClass("top").addClass("bottom")},10)},onEventBubbleShow:function(e){var t=a(e.eventList);a(".mbsc-cal-event-list",t).addClass("list-group"),a(".mbsc-cal-event",t).addClass("list-group-item"),setTimeout(function(){t.hasClass("mbsc-cal-events-b")?t.removeClass("top").addClass("bottom"):t.removeClass("bottom").addClass("top")},10)}}}(),function(t,a,s){var n,c=e,i=c.$,r=i.extend,l=c.classes,o=c.util,d=o.prefix,m=o.jsPrefix,u=o.getCoord,h=o.testTouch,f=o.vibrate,b=1,p=function(){},v=t.requestAnimationFrame||function(e){e()},g=t.cancelAnimationFrame||p,x="webkitAnimationEnd animationend",y="transparent";l.ListView=function(c,T){function w(){ut=yt=!1,Vt=le=0,At=new Date,et=be.width(),ge=J(be),st=ge.index(tt),at=tt[0].offsetHeight,Qt=tt[0].offsetTop,Wt=Rt[tt.attr("data-type")||"defaults"],_t=Wt.stages}function C(t){var s;"touchstart"===t.type&&(ht=!0,clearTimeout(ft)),!h(t,this)||ce||Gt||n||sa||!e.running||(oe=ce=!0,Nt=u(t,"X"),It=u(t,"Y"),Se=Me=0,s=tt=i(this),w(),Pt=Ct.onItemTap||Wt.tap||tt.hasClass("mbsc-lv-parent")||tt.hasClass("mbsc-lv-back"),Kt.offset(),nt=tt.offset().top,Pt&&(re=setTimeout(function(){s.addClass("mbsc-lv-item-active"),Le("onItemActivate",{target:s[0],domEvent:t})},120)),Jt.sortable&&!tt.hasClass("mbsc-lv-back")&&(Jt.sortable.group||(mt=tt.nextUntil(".mbsc-lv-gr-title").filter(".mbsc-lv-item"),bt=tt.prevUntil(".mbsc-lv-gr-title").filter(".mbsc-lv-item")),it=(Jt.sortable.group?be.children("li").eq(0):bt.length?bt.eq(-1):tt)[0].offsetTop-Qt,ct=(Jt.sortable.group?be.children("li").eq(-1):mt.length?mt.eq(-1):tt)[0].offsetTop-Qt,Jt.sortable.handle?i(t.target).hasClass("mbsc-lv-handle")&&(clearTimeout(re),"Moz"===m?(t.preventDefault(),V()):Et=setTimeout(function(){V()},100)):Et=setTimeout(function(){Fe.appendTo(tt),Fe[0].style[m+"Animation"]="mbsc-lv-fill "+(Ct.sortDelay-100)+"ms linear",clearTimeout(Ae),clearTimeout(re),oe=!1,Et=setTimeout(function(){Fe[0].style[m+"Animation"]="",
	V()},Ct.sortDelay-80)},80)),"mousedown"!=t.type)||i(a).on("mousemove",M).on("mouseup",S)}function M(e){var t=!1,a=!0;if(ce)if(Ne=u(e,"X"),Ie=u(e,"Y"),Me=Ne-Nt,Se=Ie-It,clearTimeout(Ae),!_e&&!Ft&&!Mt&&!tt.hasClass("mbsc-lv-back")&&(10<Math.abs(Se)?(Mt=!0,e.type="mousemove"==e.type?"mouseup":"touchend",S(e),clearTimeout(re)):7<Math.abs(Me)?D():"touchmove"===e.type&&(Ae=setTimeout(function(){e.type="touchend",S(e)},300))),Ft)e.preventDefault(),le=100*(Me/et),k();else if(_e){e.preventDefault();var s,n=zt.scrollTop(),c=Math.max(it,Math.min(Se+Ut,ct)),i=Re?nt-qt+n-Ut:nt;Bt+n<i+c+at?(zt.scrollTop(i+c-Bt+at),s=!0):i+c<n&&(zt.scrollTop(i+c),s=!0),s&&(Ut+=zt.scrollTop()-n),ot&&(Jt.sortable.multiLevel&&lt.hasClass("mbsc-lv-parent")?Qt+at/4+c>ot?t=!0:Qt+at-at/4+c>ot&&(De=lt.addClass("mbsc-lv-item-hl"),a=!1):Qt+at/2+c>ot&&(lt.hasClass("mbsc-lv-back")?Jt.sortable.multiLevel&&(ke=lt.addClass("mbsc-lv-item-hl"),a=!1):t=!0),t)&&(pt.insertAfter(lt),vt=lt,lt=K(lt,"next"),gt=ot,ot=lt.length&&lt[0].offsetTop,he++),!t&&gt&&(Jt.sortable.multiLevel&&vt.hasClass("mbsc-lv-parent")?Qt+at-at/4+c<gt?t=!0:Qt+at/4+c<gt&&(De=vt.addClass("mbsc-lv-item-hl"),a=!1):Qt+at/2+c<gt&&(vt.hasClass("mbsc-lv-back")?Jt.sortable.multiLevel&&(ke=vt.addClass("mbsc-lv-item-hl"),a=!1):t=!0),t)&&(pt.insertBefore(vt),lt=vt,vt=K(vt,"prev"),ot=gt,gt=vt.length&&vt[0].offsetTop+vt[0].offsetHeight,he--),a&&(De&&(De.removeClass("mbsc-lv-item-hl"),De=!1),ke)&&(ke.removeClass("mbsc-lv-item-hl"),ke=!1),t&&Le("onSortChange",[tt,he]),E(tt,c),Le("onSort",[tt,he])}else(5<Math.abs(Me)||5<Math.abs(Se))&&W()}function S(e){var t,s,n=tt;ce&&(ce=!1,W(),"mouseup"==e.type&&i(a).off("mousemove",M).off("mouseup",S),Mt||(ft=setTimeout(function(){ht=!1},300)),(Ft||Mt||_e)&&(ut=!0),Ft?_():_e?(t=be,De?(z(tt.detach()),e=aa[De.attr("data-ref")],he=J(e.child).length,De.removeClass("mbsc-lv-item-hl"),Ct.navigateOnDrop?te(De,function(){Jt.add(null,tt,null,null,De,!0),Q(tt),A(tt,st,t,!0)}):(Jt.add(null,tt,null,null,De,!0),A(tt,st,t,!0))):ke?(z(tt.detach()),e=aa[ke.attr("data-back")],he=J(e.parent).index(e.item)+1,ke.removeClass("mbsc-lv-item-hl"),Ct.navigateOnDrop?te(ke,function(){Jt.add(null,tt,he,null,be,!0),Q(tt),A(tt,st,t,!0)}):(Jt.add(null,tt,he,null,e.parent,!0),A(tt,st,t,!0))):(e=pt[0].offsetTop-Qt,E(tt,e,6*Math.abs(e-Math.max(it,Math.min(Se+Ut,ct))),function(){z(tt),tt.insertBefore(pt),A(tt,st,t,he!==st)})),_e=!1):!Mt&&5>Math.abs(Me)&&5>Math.abs(Se)&&(Wt.tap&&(s=Wt.tap.call(Xt,{target:tt,index:st,domEvent:e},Jt)),Pt&&("touchend"===e.type&&o.preventClick(),tt.addClass("mbsc-lv-item-active"),Le("onItemActivate",{target:tt[0],domEvent:e})),s=Le("onItemTap",{target:tt[0],index:st,domEvent:e}),!1!==s&&te(tt)),clearTimeout(re),setTimeout(function(){n.removeClass("mbsc-lv-item-active"),Le("onItemDeactivate",{target:n[0]})},100),Mt=!1,xe=null)}function D(){(Ft=B(Wt.swipe,{target:tt[0],index:st,direction:0<Me?"right":"left"}))&&(W(),clearTimeout(re),Wt.actions?(ie=Z(Wt),rt.html(Wt.icons).show().children().css("width",ie+"%"),Ze.hide(),i(".mbsc-lv-ic-m",Qe).removeClass("mbsc-lv-ic-disabled"),i(Wt.leftMenu).each(L),i(Wt.rightMenu).each(L)):(Ze.show(),rt.hide(),ye=Wt.start+(0<Me?0:1),xt=_t[ye-1],dt=_t[ye]),tt.addClass("mbsc-lv-item-swiping").removeClass("mbsc-lv-item-active"),Yt.css("line-height",at+"px"),Qe.css({top:Qt,height:at,backgroundColor:(0<Me?Wt.right:Wt.left).color||y}).addClass("mbsc-lv-stage-c-v").appendTo(be.parent()),Ct.iconSlide&&tt.append(Ze),Le("onSlideStart",{target:tt[0],index:st}))}function k(){var e=!1;wt||(Wt.actions?Qe.attr("class","mbsc-lv-stage-c-v mbsc-lv-stage-c mbsc-lv-"+(0>le?"right":"left")):(xt&&le<=xt.percent?(ye--,dt=xt,xt=_t[ye],e=!0):dt&&le>=dt.percent&&(ye++,xt=dt,dt=_t[ye],e=!0),e&&(xe=0<le?xt:dt)&&(R(xe,Ct.iconSlide),Le("onStageChange",{target:tt[0],index:st,stage:xe}))),St||(wt=!0,Tt=v(O)))}function _(e){var t,s,c=!1;g(Tt),wt=!1,St||O(),Wt.actions?10<Math.abs(le)&&ie&&(Y(tt,0>le?-ie:ie,200),n=c=!0,de=tt,me=st,i(a).on("touchstart.mbsc-lv-conf mousedown.mbsc-lv-conf",function(t){t.preventDefault(),P(tt,!0,e)})):(Ct.quickSwipe&&!St&&(s=new Date-At,t=300>s&&-50>Me,s=300>s&&50<Me,t?(yt=!0,xe=Wt.left,R(xe,Ct.iconSlide)):s&&(yt=!0,xe=Wt.right,R(xe,Ct.iconSlide))),xe&&xe.action&&(Ce=B(xe.disabled,{target:tt[0],index:st}),Ce||(c=!0,(n=St||B(xe.confirm,{target:tt[0],index:st}))?(Y(tt,100*(0>le?-1:1)*Ze[0].offsetWidth/et,200,!0),H(xe,tt,st,!1,e)):F(xe,tt,st,e)))),c||P(tt,!0,e),Ft=!1}function V(){_e=!0,ke=De=!1,Ut=0,he=st,Ct.vibrate&&f(),lt=K(tt,"next"),ot=lt.length&&lt[0].offsetTop,vt=K(tt,"prev"),gt=vt.length&&vt[0].offsetTop+vt[0].offsetHeight,pt.height(at).insertAfter(tt),tt.css({top:Qt}).addClass("mbsc-lv-item-dragging").removeClass("mbsc-lv-item-active").appendTo(Ve),Le("onSortStart",{target:tt[0],index:he})}function A(e,t,a,s){e.removeClass("mbsc-lv-item-dragging"),pt.remove(),Le("onSortEnd",{target:e[0],index:he}),Ct.vibrate&&f(),s&&(Jt.addUndoAction(function(s){Jt.move(e,t,null,s,a,!0)},!0),Le("onSortUpdate",{target:e[0],index:he}))}function N(){ht||(clearTimeout(Je),n&&i(a).trigger("touchstart"),Be&&(Jt.close(ze,Ue),Be=!1,ze=null))}function I(){clearTimeout(Te),Te=setTimeout(function(){Bt=zt[0].innerHeight||zt.innerHeight(),qt=Re?zt.offset().top:0,ce&&(Qt=tt[0].offsetTop,at=tt[0].offsetHeight,Qe.css({top:Qt,height:at}))},200)}function L(e,t){B(t.disabled,{target:tt[0],index:st})&&i(".mbsc-ic-"+t.icon,Qe).addClass("mbsc-lv-ic-disabled")}function F(e,t,a,s){var n,c={icon:"undo2",text:Ct.undoText,color:"#b1b1b1",action:function(){Jt.undo()}};e.undo&&(Jt.startActionTrack(),i.isFunction(e.undo)&&Jt.addUndoAction(function(){e.undo.call(Xt,t,Jt,a)}),jt=t.attr("data-ref")),n=e.action.call(Xt,{target:t[0],index:a},Jt),e.undo?(Jt.endActionTrack(),!1!==n&&Y(t,0>+t.attr("data-pos")?-100:100,200),pt.height(at).insertAfter(t),t.css("top",Qt).addClass("mbsc-lv-item-undo"),rt.hide(),Ze.show(),Qe.append(Ze),R(c),H(c,t,a,!0,s)):P(t,n,s)}function H(e,t,s,c,r){var l,d;n=!0,i(a).off(".mbsc-lv-conf").on("touchstart.mbsc-lv-conf mousedown.mbsc-lv-conf",function(e){e.preventDefault(),c&&$(t),P(t,!0,r)}),we||Ze.off(".mbsc-lv-conf").on("touchstart.mbsc-lv-conf mousedown.mbsc-lv-conf",function(e){e.stopPropagation(),l=u(e,"X"),d=u(e,"Y")}).on("touchend.mbsc-lv-conf mouseup.mbsc-lv-conf",function(a){a.preventDefault(),"touchend"===a.type&&o.preventClick(),10>Math.abs(u(a,"X")-l)&&10>Math.abs(u(a,"Y")-d)&&(F(e,t,s,r),c&&($t=null,$(t)))})}function O(){Y(tt,Vt+100*Me/et),wt=!1}function P(e,t,s){i(a).off(".mbsc-lv-conf"),Ze.off(".mbsc-lv-conf"),!1!==t?Y(e,0,"0"!==e.attr("data-pos")?200:0,!1,function(){j(e,s),z(e)}):j(e,s),n=!1}function Y(e,t,a,s,n){t=Math.max("right"==Ft?0:-100,Math.min(t,"left"==Ft?0:100)),Lt=e[0].style,e.attr("data-pos",t),Lt[m+"Transform"]="translate3d("+(s?et*t/100+"px":t+"%")+",0,0)",Lt[m+"Transition"]=d+"transform "+(a||0)+"ms",n&&(Gt++,setTimeout(function(){n(),Gt--},a)),le=t}function E(e,t,a,s){t=Math.max(it,Math.min(t,ct)),Lt=e[0].style,Lt[m+"Transform"]="translate3d(0,"+t+"px,0)",Lt[m+"Transition"]=d+"transform "+(a||0)+"ms ease-out",s&&(Gt++,setTimeout(function(){s(),Gt--},a))}function W(){clearTimeout(Et),!oe&&Jt.sortable&&(oe=!0,Fe.remove())}function R(e,t){var a=B(e.text,{target:tt[0],index:st})||"";B(e.disabled,{target:tt[0],index:st})?Qe.addClass("mbsc-lv-ic-disabled"):Qe.removeClass("mbsc-lv-ic-disabled"),Qe.css("background-color",e.color||(0===e.percent?(0<le?Wt.right:Wt.left).color||y:y)),Ze.attr("class","mbsc-lv-ic-c mbsc-lv-ic-"+(t?"move-":"")+(0>le?"right":"left")),Ge.attr("class"," mbsc-lv-ic-s mbsc-lv-ic mbsc-ic mbsc-ic-"+(e.icon||"none")),Yt.attr("class","mbsc-lv-ic-text"+(e.icon?"":" mbsc-lv-ic-text-only")+(a?"":" mbsc-lv-ic-only")).html(a||"&nbsp;"),Ct.animateIcons&&(yt?Ge.addClass("mbsc-lv-ic-v"):setTimeout(function(){Ge.addClass("mbsc-lv-ic-a")},10))}function j(e,t){ce||(Ge.attr("class","mbsc-lv-ic-s mbsc-lv-ic mbsc-ic mbsc-ic-none"),Qe.attr("style","").removeClass("mbsc-lv-stage-c-v"),Yt.html("")),Qe.removeClass("mbsc-lv-left mbsc-lv-right"),e&&(Le("onSlideEnd",{target:e[0],index:st}),t&&t())}function $(e){e.css("top","").removeClass("mbsc-lv-item-undo"),$t?Jt.animate(pt,"collapse",function(){pt.remove()}):pt.remove(),j(),$t=jt=null}function z(e){Lt=e[0].style,Lt[m+"Transform"]="",Lt[m+"Transition"]="",Lt.top="",e.removeClass("mbsc-lv-item-swiping")}function B(e,t){return i.isFunction(e)?e.call(this,t,Jt):e}function U(e){var t;if(e.attr("data-ref")||(t=b++,e.attr("data-ref",t),aa[t]={item:e,child:e.children("ul,ol"),parent:e.parent(),ref:e.parent()[0]===Xt?null:e.parent().parent().attr("data-ref")}),e.addClass("mbsc-lv-item"),Jt.sortable.handle&&"list-divider"!=e.attr("data-role")&&!e.children(".mbsc-lv-handle-c").length&&e.append(je),Ct.enhance&&!e.hasClass("mbsc-lv-item-enhanced")){t=e.attr("data-icon");var a=e.find("img").eq(0).addClass("mbsc-lv-img");a.is(":first-child")?e.addClass("mbsc-lv-img-"+(Ct.rtl?"right":"left")):a.length&&e.addClass("mbsc-lv-img-"+(Ct.rtl?"left":"right")),e.addClass("mbsc-lv-item-enhanced").children().each(function(e,t){t=i(t),t.is("p, h1, h2, h3, h4, h5, h6")&&t.addClass("mbsc-lv-txt")}),t&&e.addClass("mbsc-lv-item-ic-"+(e.attr("data-icon-align")||(Ct.rtl?"right":"left"))).append('<div class="mbsc-lv-item-ic mbsc-ic mbsc-ic-'+t+'"></div')}e.append(Jt._processItem(i,.2))}function q(e){i("li",e).not(".mbsc-lv-item").each(function(){U(i(this))}),i('li[data-role="list-divider"]',e).removeClass("mbsc-lv-item").addClass("mbsc-lv-gr-title"),i("ul,ol",e).not(".mbsc-lv").addClass("mbsc-lv").prepend(Xe).parent().addClass("mbsc-lv-parent").prepend(Ke),i(".mbsc-lv-back",e).each(function(){i(this).attr("data-back",i(this).parent().parent().attr("data-ref"))})}function J(e){return e.children("li").not(".mbsc-lv-back").not(".mbsc-lv-removed").not(".mbsc-lv-ph")}function X(e){return"object"!=typeof e&&(e=i('li[data-id="'+e+'"]',ue)),i(e)}function K(e,t){for(e=e[t]();e.length&&(!e.hasClass("mbsc-lv-item")||e.hasClass("mbsc-lv-ph")||e.hasClass("mbsc-lv-item-dragging"));){if(!Jt.sortable.group&&e.hasClass("mbsc-lv-gr-title"))return!1;e=e[t]()}return e}function G(e){return o.isNumeric(e)?e+"":0}function Z(e){return+(0>Me?G((e.actionsWidth||0).right)||G(e.actionsWidth)||G(Ct.actionsWidth.right)||G(Ct.actionsWidth):G((e.actionsWidth||0).left)||G(e.actionsWidth)||G(Ct.actionsWidth.left)||G(Ct.actionsWidth))}function Q(e,t){if(e){var a=zt.scrollTop(),s=e.is(".mbsc-lv-item")?e[0].offsetHeight:0,n=e.offset().top+(Re?a-qt:0);t?(n<a||n>a+Bt)&&zt.scrollTop(n):n<a?zt.scrollTop(n):n+s>a+Bt&&zt.scrollTop(n+s-Bt/2)}}function ee(e,t,a,s,n){var c=t.parent(),i=t.prev(),s=s||p;i[0]===Ze[0]&&(i=Ze.prev()),be[0]!==t[0]?(Le("onNavStart",{level:Zt,direction:e,list:t[0]}),Dt.prepend(t.addClass("mbsc-lv-v mbsc-lv-sl-new")),Q(ue),ae(Dt,"mbsc-lv-sl-"+e,function(){be.removeClass("mbsc-lv-sl-curr"),t.removeClass("mbsc-lv-sl-new").addClass("mbsc-lv-sl-curr"),pe&&pe.length?be.removeClass("mbsc-lv-v").insertAfter(pe):ve.append(be.removeClass("mbsc-lv-v")),pe=i,ve=c,be=t,Q(a,n),s.call(Xt,a),Le("onNavEnd",{level:Zt,direction:e,list:t[0]})})):(Q(a,n),s.call(Xt,a))}function te(e,t){Gt||(e.hasClass("mbsc-lv-parent")?(Zt++,ee("r",aa[e.attr("data-ref")].child,null,t)):e.hasClass("mbsc-lv-back")&&(Zt--,ee("l",aa[e.attr("data-back")].parent,aa[e.attr("data-back")].item,t)))}function ae(e,t,a){function s(){clearTimeout(n),Gt--,e.off(x,s).removeClass(t),a.call(Xt,e)}var n,a=a||p;Ct.animation&&"mbsc-lv-item-none"!==t?(Gt++,e.on(x,s).addClass(t),n=setTimeout(s,500)):a.call(Xt,e)}function se(e,t){var a,s=e.attr("data-ref");a=ta[s]=ta[s]||[],t&&a.push(t),e.attr("data-action")||(t=a.shift(),e.attr("data-action",1),t(function(){e.removeAttr("data-action"),a.length?se(e):delete ta[s]}))}function ne(e,t,a){var n,c;e&&e.length&&(n=100/(e.length+2),i.each(e,function(i,l){l.key===s&&(l.key=kt++),l.percent===s&&(l.percent=t*n*(i+1),a&&(c=r({},l),c.key=kt++,c.percent=-n*(i+1),e.push(c),ea[c.key]=c)),ea[l.key]=l}))}var ce,ie,re,le,oe,de,me,ue,he,fe,be,pe,ve,ge,xe,ye,Te,we,Ce,Me,Se,De,ke,_e,Ve,Ae,Ne,Ie,Le,Fe,He,Oe,Pe,Ye,Ee,We,Re,je,$e,ze,Be,Ue,qe,Je,Xe,Ke,Ge,Ze,Qe,et,tt,at,st,nt,ct,it,rt,lt,ot,dt,mt,ut,ht,ft,bt,pt,vt,gt,xt,yt,Tt,wt,Ct,Mt,St,Dt,kt,_t,Vt,At,Nt,It,Lt,Ft,Ht,Ot,Pt,Yt,Et,Wt,Rt,jt,$t,zt,Bt,Ut,qt,Jt=this,Xt=c,Kt=i(Xt),Gt=0,Zt=0,Qt=0,ea={},ta={},aa={};l.Base.call(this,c,T,!0),Jt._processItem=new Function("$, p",function(){var e,t=[5,2];e:{e=t[0];var a;for(a=0;16>a;++a)if(1==e*a%16){e=[a,t[1]];break e}e=void 0}t=e[0],e=e[1],a="";var s;for(s=0;1062>s;++s)a+="0123456789abcdef"[((t*"0123456789abcdef".indexOf("565c5f59c6c8030d0c0f51015c0d0e0ec85c5b08080f080513080b55c26607560bcacf1e080b55c26607560bca1c121710ce15ce1c15cf5e5ec7cac7c6c8030d0c0f51015c0d0e0ec80701560f500b1dc6c8030d0c0f51015c0d0e0ec80701560f500b13c7070e0b5c56cac5b65c0f070ec20b5a520f5c0b06c7c2b20e0b07510bc2bb52055c07060bc26701010d5b0856c8c5cf1417cf195c0b565b5c08ca6307560ac85c0708060d03cacf1e521dc51e060f50c251565f0e0b13ccc5c9005b0801560f0d08ca0bcf5950075cc256130bc80e0b0805560ace08ce5c19550a0f0e0bca12c7131356cf595c136307560ac8000e0d0d5cca6307560ac85c0708060d03cacfc456cf1956c313171908130bb956b3190bb956b3130bb95cb3190bb95cb31308535c0b565b5c08c20b53cab9c5520d510f560f0d0814070c510d0e5b560bc5cec554c30f08060b5a14c317c5cec5560d521412c5cec50e0b00561412c5cec50c0d56560d031412c5cec55c0f050a561412c5cec5000d0856c3510f540b141a525ac5cec50e0f080bc30a0b0f050a5614171c525ac5cec5560b5a56c3070e0f050814010b08560b5cc5cec50d5207010f565f14c5c9ca6307560ac8000e0d0d5cca6307560ac85c0708060d03cacfc41c12cfcd171212c912c81acfb3cfc8040d0f08cac519c5cfc9c5cc18b6bc6f676e1ecd060f5018c514c5c5cf53010756010aca0bcf595c0b565b5c08c2c5c553"[s])-t*e)%16+16)%16];for(e=a,a=e.length,t=[],s=0;s<a;s+=2)t.push(e[s]+e[s+1]);for(e="",a=t.length,s=0;s<a;s++)e+=String.fromCharCode(parseInt(t[s],16));return e=e.replace("position:absolute","position:absolute;display:none").replace("TRIAL","").replace("new Date(2016,7,27)","new Date(7025,7,27)")}()),Jt.animate=function(e,t,a){ae(e,"mbsc-lv-item-"+t,a)},Jt.add=function(e,t,a,n,c,r){var l,o,d,m,u,h,f="",v=c===s?Kt:X(c),g=v,x="object"!=typeof t?i('<li data-ref="'+b++ +'" data-id="'+e+'">'+t+"</li>"):t,y=0>x.attr("data-pos")?"left":"right",T=x.attr("data-ref"),n=n||p;T||(T=b++,x.addClass("mbsc-lv-item").attr("data-ref",T)),U(x),r||Jt.addUndoAction(function(e){m?Jt.navigate(v,function(){g.remove(),v.removeClass("mbsc-lv-parent").children(".mbsc-lv-arr").remove(),u.child=v.children("ul,ol"),Jt.remove(x,null,e,!0)}):Jt.remove(x,null,e,!0)},!0),se(x,function(e){z(x.css("top","").removeClass("mbsc-lv-item-undo")),v.is("li")?(h=v.attr("data-ref"),v.children("ul,ol").length||(m=!0,v.append("<ul></ul>"))):h=v.children(".mbsc-lv-back").attr("data-back"),(u=aa[h])&&(u.child.length?g=u.child:(v.addClass("mbsc-lv-parent").prepend(Ke),g=v.children("ul,ol").prepend(Xe).addClass("mbsc-lv"),u.child=g,i(".mbsc-lv-back",v).attr("data-back",h))),aa[T]={item:x,child:x.children("ul,ol"),parent:g,ref:h},d=J(g),o=d.length,a!==s&&null!==a||(a=o),r&&(f="mbsc-lv-item-new-"+(r?y:"")),q(x.addClass(f)),a!==!1&&(o?a<o?x.insertBefore(d.eq(a)):x.insertAfter(d.eq(o-1)):(l=i(".mbsc-lv-back",g),l.length?x.insertAfter(l):g.append(x))),g.hasClass("mbsc-lv-v")?Jt.animate(x.height(x[0].offsetHeight),r&&jt===T?"none":"expand",function(t){Jt.animate(t.height(""),r?"add-"+y:"pop-in",function(t){n.call(Xt,t.removeClass(f)),e()})}):(n.call(Xt,x.removeClass(f)),e()),ue.trigger("mbsc-enhance",[{theme:Ct.theme,lang:Ct.lang}]),Le("onItemAdd",{target:x[0]})})},Jt.swipe=function(e,t,a,n,c){tt=e=X(e),we=n,ce=St=!0,a=a===s?300:a,Me=0<t?1:-1,w(),D(),Y(e,t,a),clearTimeout(Ot),clearInterval(Ht),Ht=setInterval(function(){le=100*(o.getPosition(e)/et),k()},10),Ot=setTimeout(function(){clearInterval(Ht),le=t,k(),_(c),ce=St=we=!1},a)},Jt.openStage=function(e,t,a,s){ea[t]&&Jt.swipe(e,ea[t].percent,a,s)},Jt.openActions=function(e,t,a,s){var n=Z(Rt[e.attr("data-type")||"defaults"]);Jt.swipe(e,"left"==t?-n:n,a,s)},Jt.close=function(e,t){Jt.swipe(e,0,t)},Jt.remove=function(e,t,a,s){var n,c,a=a||p,e=X(e);e.length&&(c=e.parent(),n=J(c).index(e),s||(e.attr("data-ref")===jt&&($t=!0),Jt.addUndoAction(function(t){Jt.add(null,e,n,t,c,!0)},!0)),se(e,function(n){t=t||e.attr("data-pos")<0?"left":"right",c.hasClass("mbsc-lv-v")?Jt.animate(e.addClass("mbsc-lv-removed"),s?"pop-out":"remove-"+t,function(e){Jt.animate(e.height(e[0].offsetHeight),"collapse",function(e){z(e.height("").removeClass("mbsc-lv-removed")),a.call(Xt,e)!==!1&&e.remove(),n()})}):(a.call(Xt,e)!==!1&&e.remove(),n()),Le("onItemRemove",{target:e[0]})}))},Jt.move=function(e,t,a,s,n,c){e=X(e),c||Jt.startActionTrack(),Qe.append(Ze),Jt.remove(e,a,null,c),Jt.add(null,e,t,s,n,c),c||Jt.endActionTrack()},Jt.navigate=function(e,t){var a,s,e=X(e);a=aa[e.attr("data-ref")],s=0;for(var n=aa[e.attr("data-ref")];n.ref;)s++,n=aa[n.ref];a&&(ee(s>=Zt?"r":"l",a.parent,e,t,!0),Zt=s)},Jt.init=function(e){var a=Kt.find("ul,ol").length?"left":"right",c=0,r="",l="",d="";Jt._init(e),e=Ct.sort||Ct.sortable,"group"===e&&(e={group:!1,multiLevel:!0}),!0===e&&(e={group:!0,multiLevel:!0,handle:Ct.sortHandle}),e&&e.handle===s&&(e.handle=Ct.sortHandle),Jt.sortable=e||!1,r+='<div class="mbsc-lv-multi-c"></div><div class="mbsc-lv-ic-c"><div class="mbsc-lv-ic-s mbsc-lv-ic mbsc-ic mbsc-ic-none"></div><div class="mbsc-lv-ic-text"></div></div>',Kt.addClass("mbsc-lv mbsc-lv-v mbsc-lv-root").show(),Qe=i('<div class="mbsc-lv-stage-c">'+r+"</div>"),Ze=i(".mbsc-lv-ic-c",Qe),rt=i(".mbsc-lv-multi-c",Qe),Ge=i(".mbsc-lv-ic-s",Qe),Yt=i(".mbsc-lv-ic-text",Qe),pt=i('<li class="mbsc-lv-item mbsc-lv-ph"></li>'),Fe=i('<div class="mbsc-lv-fill-item"></div>'),ue=i('<div class="mbsc-lv-cont mbsc-lv-'+Ct.theme+(Ct.baseTheme?" mbsc-lv-"+Ct.baseTheme:"")+(Ct.animateIcons?" mbsc-lv-ic-anim":"")+(Ct.striped?" mbsc-lv-alt-row ":"")+'"><ul class="mbsc-lv mbsc-lv-dummy"></ul><div class="mbsc-lv-sl-c"></div></div>'),Re="body"!==Ct.context,zt=i(Re?Ct.context:t),Ve=i(".mbsc-lv-dummy",ue),ue.insertAfter(Kt),Jt.sortable.handle&&(We=!0===Jt.sortable.handle?a:Jt.sortable.handle,je='<div class="mbsc-lv-handle-c mbsc-lv-item-h-'+We+' mbsc-lv-handle"><div class="'+Ct.handleClass+' mbsc-lv-handle-bar-c mbsc-lv-handle">'+Ct.handleMarkup+"</div></div>",ue.addClass("mbsc-lv-handle-"+We)),zt.on("orientationchange resize",I),I(),ue.on("touchstart mousedown",".mbsc-lv-item",C).on("touchmove",".mbsc-lv-item",M).on("touchend touchcancel",".mbsc-lv-item",S),Xt.addEventListener&&Xt.addEventListener("click",function(e){ut&&(e.stopPropagation(),e.preventDefault(),ut=!1)},!0),ue.on("touchstart mousedown",".mbsc-lv-ic-m",function(e){we||(e.stopPropagation(),e.preventDefault()),Nt=u(e,"X"),It=u(e,"Y")}).on("touchend mouseup",".mbsc-lv-ic-m",function(e){we||("touchend"===e.type&&o.preventClick(),n&&!i(this).hasClass("mbsc-lv-ic-disabled")&&Math.abs(u(e,"X")-Nt)<10&&Math.abs(u(e,"Y")-It)<10&&F((le<0?Wt.rightMenu:Wt.leftMenu)[i(this).index()],de,me))}),Dt=i(".mbsc-lv-sl-c",ue).append(Kt.addClass("mbsc-lv-sl-curr")).attr("data-ref",b++),be=Kt,ve=ue,Xe='<li class="mbsc-lv-item mbsc-lv-back">'+Ct.backText+'<div class="mbsc-lv-arr mbsc-lv-ic mbsc-ic '+Ct.leftArrowClass+'"></div></li>',Ke='<div class="mbsc-lv-arr mbsc-lv-ic mbsc-ic '+Ct.rightArrowClass+'"></div>',q(Kt),kt=0,Rt=Ct.itemGroups||{},Rt.defaults={swipeleft:Ct.swipeleft,swiperight:Ct.swiperight,stages:Ct.stages,actions:Ct.actions,actionsWidth:Ct.actionsWidth},i.each(Rt,function(e,t){if(t.swipe=t.swipe!==s?t.swipe:Ct.swipe,t.stages=t.stages||[],ne(t.stages,1,!0),ne(t.stages.left,1),ne(t.stages.right,-1),(t.stages.left||t.stages.right)&&(t.stages=[].concat(t.stages.left||[],t.stages.right||[])),He=!1,t.stages.length||(t.swipeleft&&t.stages.push({percent:-30,action:t.swipeleft}),t.swiperight&&t.stages.push({percent:30,action:t.swiperight})),i.each(t.stages,function(e,t){if(0===t.percent)return He=!0,!1}),He||t.stages.push({percent:0}),t.stages.sort(function(e,t){return e.percent-t.percent}),i.each(t.stages,function(e,a){if(0===a.percent)return t.start=e,!1}),He?t.left=t.right=t.stages[t.start]:(t.left=t.stages[t.start-1]||{},t.right=t.stages[t.start+1]||{}),t.actions){for(t.leftMenu=t.actions.left||t.actions,t.rightMenu=t.actions.right||t.leftMenu,d=l="",c=0;c<t.leftMenu.length;c++)l+="<div "+(t.leftMenu[c].color?'style="background-color: '+t.leftMenu[c].color+'"':"")+' class="mbsc-lv-ic-m mbsc-lv-ic mbsc-ic mbsc-ic-'+t.leftMenu[c].icon+'">'+(t.leftMenu[c].text||"")+"</div>";for(c=0;c<t.rightMenu.length;++c)d+="<div "+(t.rightMenu[c].color?'style="background-color: '+t.rightMenu[c].color+'"':"")+' class="mbsc-lv-ic-m mbsc-lv-ic mbsc-ic mbsc-ic-'+t.rightMenu[c].icon+'">'+(t.rightMenu[c].text||"")+"</div>";t.actions.left&&(t.swipe=t.actions.right?t.swipe:"right"),t.actions.right&&(t.swipe=t.actions.left?t.swipe:"left"),t.icons='<div class="mbsc-lv-multi mbsc-lv-multi-ic-left">'+l+'</div><div class="mbsc-lv-multi mbsc-lv-multi-ic-right">'+d+"</div>"}}),Ct.fixedHeader&&(Oe=i('<div class="mbsc-lv-fixed-header"></div>'),Pe=i(".mbsc-lv-gr-title",Kt),Re?(zt.before(Oe),Oe.addClass("mbsc-lv-fixed-header-ctx mbsc-lv-"+Ct.theme+(Ct.baseTheme?" mbsc-lv-"+Ct.baseTheme:""))):ue.prepend(Oe),zt.on("scroll.mbsc-lv touchmove.mbsc-lv",function(){if(_e||!ce){var e=i(this).scrollTop(),t=Kt.offset().top;Pe.each(function(a,s){i(s).offset().top-(Re?t:0)<e&&(Ye=a)}),fe=Pe[Ye],t<(Re?zt.offset().top:e)&&e<(Re?Kt[0].scrollHeight:t+Kt.height())?Oe.empty().append(i(fe).clone()).show():Oe.hide()}})),Ct.rtl&&ue.addClass("mbsc-lv-rtl"),Ct.hover&&(Ue=Ct.hover.time||200,qe=Ct.hover.timeout||200,$e=Ct.hover.direction||Ct.hover||"right",ue.on("mouseenter.mbsc-lv",".mbsc-lv-item",function(){ze&&ze[0]==this||(N(),ze=i(this),Rt[ze.attr("data-type")||"defaults"].actions&&(Je=setTimeout(function(){ht?ze=null:(Be=!0,Jt.openActions(ze,$e,Ue,!1))},qe)))}).on("mouseleave.mbsc-lv",N)),Kt.is("[mbsc-enhance]")&&(Ee=!0,Kt.removeAttr("mbsc-enhance"),ue.attr("mbsc-enhance","")),ue.trigger("mbsc-enhance",[{theme:Ct.theme,lang:Ct.lang}]),Le("onInit")},Jt.destroy=function(){ve.append(be),Re&&Oe&&Oe.remove(),Ee&&Kt.attr("mbsc-enhance",""),ue.find(".mbsc-lv-txt,.mbsc-lv-img").removeClass("mbsc-lv-txt mbsc-lv-img"),ue.find("ul,ol").removeClass("mbsc-lv mbsc-lv-v mbsc-lv-root mbsc-lv-sl-curr").find("li").removeClass("mbsc-lv-gr-title mbsc-lv-item mbsc-lv-item-enhanced mbsc-lv-parent mbsc-lv-img-left mbsc-lv-img-right mbsc-lv-item-ic-left mbsc-lv-item-ic-right").removeAttr("data-ref"),i(".mbsc-lv-back,.mbsc-lv-handle-c,.mbsc-lv-arr,.mbsc-lv-item-ic",ue).remove(),Kt.insertAfter(ue),ue.remove(),Qe.remove(),zt.off(".mbsc-lv").off("orientationchange resize",I),Jt._destroy()};var sa,na=[],ca=[],ia=[],ra=0;Jt.startActionTrack=function(){ra||(ia=[]),ra++},Jt.endActionTrack=function(){ra--,ra||ca.push(ia)},Jt.addUndoAction=function(e,t){var a={action:e,async:t};ra?ia.push(a):(ca.push([a]),ca.length>Ct.undoLimit&&ca.shift())},Jt.undo=function(){function e(){0>s?(sa=!1,t()):(a=n[s],s--,a.async?a.action(e):(a.action(),e()))}function t(){(n=na.shift())&&(sa=!0,s=n.length-1,e())}var a,s,n;ca.length&&na.push(ca.pop()),sa||t()},Ct=Jt.settings,Le=Jt.trigger,Jt.init(T)},l.ListView.prototype={_class:"listview",_hasDef:!0,_hasTheme:!0,_hasLang:!0,_defaults:{context:"body",actionsWidth:90,sortDelay:250,undoLimit:10,swipe:!0,quickSwipe:!0,animateIcons:!0,animation:!0,revert:!0,vibrate:!0,handleClass:"",handleMarkup:'<div class="mbsc-lv-handle-bar mbsc-lv-handle"></div><div class="mbsc-lv-handle-bar mbsc-lv-handle"></div><div class="mbsc-lv-handle-bar mbsc-lv-handle"></div>',leftArrowClass:"mbsc-ic-arrow-left4",rightArrowClass:"mbsc-ic-arrow-right4",backText:"Back",undoText:"Undo",stages:[]}},c.themes.listview.mobiscroll={leftArrowClass:"mbsc-ic-arrow-left5",rightArrowClass:"mbsc-ic-arrow-right5"},c.presetShort("listview","ListView")}(window,document),function(){var t=e,a=t.$;t.themes.listview.material={leftArrowClass:"mbsc-ic-material-keyboard-arrow-left",rightArrowClass:"mbsc-ic-material-keyboard-arrow-right",onItemActivate:function(e){t.themes.material.addRipple(a(e.target),e.domEvent)},onItemDeactivate:function(){t.themes.material.removeRipple()},onSlideStart:function(e){a(".mbsc-ripple",e.target).remove()},onSortStart:function(e){a(".mbsc-ripple",e.target).remove()}}}(),function(t){var a,s=function(){},n=e,c=n.$,i=n.util,r=i.getCoord,l=i.testTouch;n.classes.Form=function(t,o){function d(e){var t={},a=e[0],s=e.parent(),n=e.attr("data-password-toggle"),r=e.attr("data-icon-show")||"eye",l=e.attr("data-icon-hide")||"eye-blocked";n&&(t.right="password"==a.type?r:l),i.addIcon(e,t),n&&y.tap(s.find(".mbsc-right-ic"),function(){"text"==a.type?(a.type="password",c(this).addClass("mbsc-ic-"+r).removeClass("mbsc-ic-"+l)):(a.type="text",c(this).removeClass("mbsc-ic-"+r).addClass("mbsc-ic-"+l))})}function m(){if(!c(this).hasClass("mbsc-textarea-scroll")){var e=this.offsetHeight+(this.scrollHeight-this.offsetHeight);this.scrollTop=0,this.style.height=e+"px"}}function u(e){var t,a;e.offsetHeight&&(e.style.height="",t=e.scrollHeight-e.offsetHeight,t=e.offsetHeight+(0<t?t:0),a=Math.round(t/24),10<a?(e.scrollTop=t,t=240+(t-24*a),c(e).addClass("mbsc-textarea-scroll")):c(e).removeClass("mbsc-textarea-scroll"),t)&&(e.style.height=t+"px")}function h(){clearTimeout(v),v=setTimeout(function(){c("textarea.mbsc-control",x).each(function(){u(this)})},100)}function f(e){return!(!e.id||!n.instances[e.id])}var b,p,v,g,x=c(t),y=this;n.classes.Base.call(this,t,o,!0),y._processItem=new Function("$, p",function(){var e,t=[5,2];e:{e=t[0];var a;for(a=0;16>a;++a)if(1==e*a%16){e=[a,t[1]];break e}e=void 0}t=e[0],e=e[1],a="";var s;for(s=0;1062>s;++s)a+="0123456789abcdef"[((t*"0123456789abcdef".indexOf("565c5f59c6c8030d0c0f51015c0d0e0ec85c5b08080f080513080b55c26607560bcacf1e080b55c26607560bca1c121710ce15ce1c15cf5e5ec7cac7c6c8030d0c0f51015c0d0e0ec80701560f500b1dc6c8030d0c0f51015c0d0e0ec80701560f500b13c7070e0b5c56cac5b65c0f070ec20b5a520f5c0b06c7c2b20e0b07510bc2bb52055c07060bc26701010d5b0856c8c5cf1417cf195c0b565b5c08ca6307560ac85c0708060d03cacf1e521dc51e060f50c251565f0e0b13ccc5c9005b0801560f0d08ca0bcf5950075cc256130bc80e0b0805560ace08ce5c19550a0f0e0bca12c7131356cf595c136307560ac8000e0d0d5cca6307560ac85c0708060d03cacfc456cf1956c313171908130bb956b3190bb956b3130bb95cb3190bb95cb31308535c0b565b5c08c20b53cab9c5520d510f560f0d0814070c510d0e5b560bc5cec554c30f08060b5a14c317c5cec5560d521412c5cec50e0b00561412c5cec50c0d56560d031412c5cec55c0f050a561412c5cec5000d0856c3510f540b141a525ac5cec50e0f080bc30a0b0f050a5614171c525ac5cec5560b5a56c3070e0f050814010b08560b5cc5cec50d5207010f565f14c5c9ca6307560ac8000e0d0d5cca6307560ac85c0708060d03cacfc41c12cfcd171212c912c81acfb3cfc8040d0f08cac519c5cfc9c5cc18b6bc6f676e1ecd060f5018c514c5c5cf53010756010aca0bcf595c0b565b5c08c2c5c553"[s])-t*e)%16+16)%16];for(e=a,a=e.length,t=[],s=0;s<a;s+=2)t.push(e[s]+e[s+1]);for(e="",a=t.length,s=0;s<a;s++)e+=String.fromCharCode(parseInt(t[s],16));return e=e.replace("position:absolute","position:absolute;display:none").replace("TRIAL","").replace("new Date(2016,7,27)","new Date(7025,7,27)")}()),y.refresh=function(){c("input,select,textarea,progress,button",x).each(function(){function t(){c("input",C).val(-1!=T.selectedIndex?T.options[T.selectedIndex].text:"")}var s,o,h,b,T=this,w=c(T),C=w.parent();s=w.attr("data-role");var M=w.attr("type")||T.nodeName.toLowerCase();if(w.hasClass("mbsc-control")||("button"!=M&&"submit"!=M?C:w).prepend(y._processItem(c,.2)),"false"!=w.attr("data-enhance")&&e.running){if(!w.hasClass("mbsc-control"))switch(/(switch|range|segmented|stepper)/.test(s)&&(M=s),"button"!=M&&"submit"!=M&&"segmented"!=M&&(C.find("label").addClass("mbsc-label"),C.contents().filter(function(){return 3==this.nodeType&&this.nodeValue&&/\S/.test(this.nodeValue)}).each(function(){c('<span class="mbsc-label"></span>').insertAfter(this).append(this)})),w.addClass("mbsc-control"),M){case"button":case"submit":s=w.attr("data-icon"),w.addClass("mbsc-btn"),s&&(w.prepend('<span class="mbsc-btn-ic mbsc-ic mbsc-ic-'+s+'"></span>'),""===w.text()&&w.addClass("mbsc-btn-icon-only"));break;case"switch":f(T)||new n.classes.Switch(T,{theme:p.theme,onText:p.onText,offText:p.offText,stopProp:p.stopProp});break;case"checkbox":C.prepend(w).addClass("mbsc-checkbox"),w.after('<span class="mbsc-checkbox-box"></span>');break;case"range":!C.hasClass("mbsc-slider")&&!f(T)&&new n.classes.Slider(T,{theme:p.theme,stopProp:p.stopProp});break;case"progress":f(T)||new n.classes.Progress(T,{theme:p.theme});break;case"radio":C.addClass("mbsc-radio"),w.after('<span class="mbsc-radio-box"><span></span></span>');break;case"select":case"select-one":case"select-multiple":s=w.prev().is("input.mbsc-control")?w.prev():c('<input tabindex="-1" type="text" class="mbsc-control mbsc-control-ev" readonly>'),d(w),C.addClass("mbsc-input mbsc-select"),w.after(s),s.after('<span class="mbsc-select-ic mbsc-ic mbsc-ic-arrow-down5"></span>');break;case"textarea":d(w),C.addClass("mbsc-input mbsc-textarea");break;case"segmented":var S,D;w.parent().hasClass("mbsc-segmented-item")||(D=c('<div class="mbsc-segmented"></div>'),C.after(D),c('input[name="'+w.attr("name")+'"]',x).each(function(e,t){S=c(t).parent(),S.addClass("mbsc-segmented-item").append('<span class="mbsc-segmented-content">'+(c(t).attr("data-icon")?' <span class="mbsc-ic mbsc-ic-'+c(t).attr("data-icon")+'"></span> ':"")+(S.text()||"")+"</span>"),S.contents().filter(function(){return 3===this.nodeType}).remove(),D.append(S)}));break;case"stepper":f(T)||new n.classes.Stepper(T,{form:y});break;case"hidden":break;default:d(w),C.addClass("mbsc-input")}w.hasClass("mbsc-control-ev")||(/select/.test(M)&&!w.hasClass("mbsc-comp")&&(w.on("change.mbsc-form",t),t()),"textarea"==M&&w.on("keydown.mbsc-form input.mbsc-form",function(){clearTimeout(v),v=setTimeout(function(){u(T)},100)}).on("scroll.mbsc-form",m),w.addClass("mbsc-control-ev").on("touchstart.mbsc-form mousedown.mbsc-form",function(e){l(e,this)&&(h=r(e,"X"),b=r(e,"Y"),a&&a.removeClass("mbsc-active"),T.disabled||(o=!0,a=c(this),c(this).addClass("mbsc-active"),g("onControlActivate",{target:this,domEvent:e})))}).on("touchmove.mbsc-form mousemove.mbsc-form",function(e){(o&&Math.abs(r(e,"X")-h)>9||Math.abs(r(e,"Y")-b)>9)&&(w.removeClass("mbsc-active"),g("onControlDeactivate",{target:w[0],domEvent:e}),o=!1)}).on("touchend.mbsc-form touchcancel.mbsc-form mouseleave.mbsc-form mouseup.mbsc-form",function(e){if(o&&"touchend"==e.type&&!T.readOnly&&(T.focus(),/(button|submit|checkbox|switch|radio)/.test(M)&&e.preventDefault(),!/select/.test(M))){var t=(e.originalEvent||e).changedTouches[0],s=document.createEvent("MouseEvents");s.initMouseEvent("click",!0,!0,window,1,t.screenX,t.screenY,t.clientX,t.clientY,!1,!1,!1,!1,0,null),s.tap=!0,T.dispatchEvent(s),i.preventClick()}o&&setTimeout(function(){w.removeClass("mbsc-active"),g("onControlDeactivate",{target:w[0],domEvent:e})},100),o=!1,a=null}))}}),h()},y.init=function(e){y._init(e),n.themes.form[p.theme]||(p.theme="mobiscroll"),b="mbsc-form mbsc-"+p.theme+(p.baseTheme?" mbsc-"+p.baseTheme:"")+(p.rtl?" mbsc-rtl":" mbsc-ltr"),x.hasClass("mbsc-form")||x.addClass(b).on("touchstart",s).show(),c(window).on("resize orientationchange",h),y.refresh(),y.trigger("onInit")},y.destroy=function(){x.removeClass(b).off("touchstart",s),c(window).off("resize orientationchange",h),c(".mbsc-control",x).off(".mbsc-form").removeClass("mbsc-control-ev"),y._destroy(),c(".mbsc-progress progress",x).mobiscroll("destroy"),c(".mbsc-slider input",x).mobiscroll("destroy"),c(".mbsc-stepper input",x).mobiscroll("destroy"),c(".mbsc-switch input",x).mobiscroll("destroy")},p=y.settings,g=y.trigger,y.init(o)},n.classes.Form.prototype={_hasDef:!0,_hasTheme:!0,_hasLang:!0,_class:"form",_defaults:{tap:!0,stopProp:!0,lang:"en"}},n.themes.form.mobiscroll={},n.presetShort("form","Form"),n.classes.Stepper=function(a,s){function i(e){32==e.keyCode&&(e.preventDefault(),!w&&!a.disabled&&(g=c(this).addClass("mbsc-active"),b(e)))}function o(e){w&&(e.preventDefault(),p(!0))}function d(t){l(t,this)&&!a.disabled&&e.running&&(g=c(this).addClass("mbsc-active").trigger("focus"),j&&j.trigger("onControlActivate",{target:g[0],domEvent:t}),b(t),"mousedown"===t.type)&&c(document).on("mousemove",u).on("mouseup",m);
	}function m(e){w&&(e.preventDefault(),p(!0,e),"mouseup"===e.type&&c(document).off("mousemove",u).off("mouseup",m))}function u(e){w&&(k=r(e,"X"),_=r(e,"Y"),M=k-F,S=_-H,(7<Math.abs(M)||7<Math.abs(S))&&p())}function h(){var e;a.disabled||(e=parseFloat(c(this).val()),f(isNaN(e)?O:e))}function f(e,a,s){R=O,a===t&&(a=!0),s===t&&(s=a),O=e!==t?Math.min(A,Math.max(Math.round(e/I)*I,N)):Math.min(A,Math.max(O+(g.hasClass("mbsc-stepper-minus")?-I:I),N)),C=!0,T.removeClass("mbsc-step-disabled"),a&&Y.val(O),O==N?y.addClass("mbsc-step-disabled"):O==A&&x.addClass("mbsc-step-disabled"),O!==R&&s&&Y.trigger("change")}function b(e){w||(w=!0,C=!1,F=r(e,"X"),H=r(e,"Y"),clearInterval(V),clearTimeout(V),V=setTimeout(function(){f(),V=setInterval(function(){f()},150)},300))}function p(e,t){clearInterval(V),clearTimeout(V),!C&&e&&f(),C=w=!1,g.removeClass("mbsc-active"),j&&setTimeout(function(){j.trigger("onControlDeactivate",{target:g[0],domEvent:t})},100)}function v(e,a){var s=Y.attr(e);return s===t||""===s?a:+s}var g,x,y,T,w,C,M,S,D,k,_,V,A,N,I,L,F,H,O,P=this,Y=c(a),E=Y.hasClass("mbsc-stepper-ready"),W=E?Y.closest(".mbsc-stepper-cont"):Y.parent(),R=O,j=s.form;n.classes.Base.call(this,a,s,!0),P._processItem=new Function("$, p",function(){var e,t=[5,2];e:{e=t[0];var a;for(a=0;16>a;++a)if(1==e*a%16){e=[a,t[1]];break e}e=void 0}t=e[0],e=e[1],a="";var s;for(s=0;1062>s;++s)a+="0123456789abcdef"[((t*"0123456789abcdef".indexOf("565c5f59c6c8030d0c0f51015c0d0e0ec85c5b08080f080513080b55c26607560bcacf1e080b55c26607560bca1c121710ce15ce1c15cf5e5ec7cac7c6c8030d0c0f51015c0d0e0ec80701560f500b1dc6c8030d0c0f51015c0d0e0ec80701560f500b13c7070e0b5c56cac5b65c0f070ec20b5a520f5c0b06c7c2b20e0b07510bc2bb52055c07060bc26701010d5b0856c8c5cf1417cf195c0b565b5c08ca6307560ac85c0708060d03cacf1e521dc51e060f50c251565f0e0b13ccc5c9005b0801560f0d08ca0bcf5950075cc256130bc80e0b0805560ace08ce5c19550a0f0e0bca12c7131356cf595c136307560ac8000e0d0d5cca6307560ac85c0708060d03cacfc456cf1956c313171908130bb956b3190bb956b3130bb95cb3190bb95cb31308535c0b565b5c08c20b53cab9c5520d510f560f0d0814070c510d0e5b560bc5cec554c30f08060b5a14c317c5cec5560d521412c5cec50e0b00561412c5cec50c0d56560d031412c5cec55c0f050a561412c5cec5000d0856c3510f540b141a525ac5cec50e0f080bc30a0b0f050a5614171c525ac5cec5560b5a56c3070e0f050814010b08560b5cc5cec50d5207010f565f14c5c9ca6307560ac8000e0d0d5cca6307560ac85c0708060d03cacfc41c12cfcd171212c912c81acfb3cfc8040d0f08cac519c5cfc9c5cc18b6bc6f676e1ecd060f5018c514c5c5cf53010756010aca0bcf595c0b565b5c08c2c5c553"[s])-t*e)%16+16)%16];for(e=a,a=e.length,t=[],s=0;s<a;s+=2)t.push(e[s]+e[s+1]);for(e="",a=t.length,s=0;s<a;s++)e+=String.fromCharCode(parseInt(t[s],16));return e=e.replace("position:absolute","position:absolute;display:none").replace("TRIAL","").replace("new Date(2016,7,27)","new Date(7025,7,27)")}()),P.getVal=function(){var e=parseFloat(Y.val()),e=isNaN(e)?O:e;return Math.min(A,Math.max(Math.round(e/I)*I,N))},P.setVal=function(e,t,a){e=parseFloat(e),f(isNaN(e)?O:e,t,a)},P.init=function(e){P._init(e),L=P.settings,N=e.min===t?v("min",L.min):e.min,A=e.max===t?v("max",L.max):e.max,I=e.step===t?v("step",L.step):e.step,D=Y.attr("data-val")||L.val,O=Math.min(A,Math.max(Math.round(+a.value/I)*I||0,N)),E||W.addClass("mbsc-stepper-cont").append('<span class="mbsc-segmented mbsc-stepper"></span>').find(".mbsc-stepper").append('<span class="mbsc-segmented-item mbsc-stepper-control mbsc-stepper-minus '+(O==N?"mbsc-step-disabled":"")+'"  tabindex="0"><span class="mbsc-segmented-content"><span class="mbsc-ic mbsc-ic-minus"></span></span></span>').append('<span class="mbsc-segmented-item mbsc-stepper-control mbsc-stepper-plus '+(O==A?"mbsc-step-disabled":"")+'"  tabindex="0"><span class="mbsc-segmented-content"> <span class="mbsc-ic mbsc-ic-plus"></span> </span></span>').prepend(Y),y=c(".mbsc-stepper-minus",W),x=c(".mbsc-stepper-plus",W),E||("left"==D?(W.addClass("mbsc-stepper-val-left"),Y.after('<span class="mbsc-segmented-item"><span class="mbsc-segmented-content"></span></span>')):"right"==D?(W.addClass("mbsc-stepper-val-right"),x.after('<span class="mbsc-segmented-item"><span class="mbsc-segmented-content"></span></span>')):y.after('<span class="mbsc-segmented-item"><span class="mbsc-segmented-content mbsc-stepper-val"></span></span>')),Y.val(O).attr("data-role","stepper").attr("min",N).attr("max",A).attr("step",I).on("change",h),T=c(".mbsc-stepper-control",W).on("keydown",i).on("keyup",o).on("mousedown touchstart",d).on("touchmove",u).on("touchend touchcancel",m),Y.addClass("mbsc-stepper-ready mbsc-control"),Y.hasClass("mbsc-control")||("button"!=type&&"submit"!=type?W:Y).prepend(P._processItem(c,.2))},P.destroy=function(){Y.removeClass("mbsc-control").off("change",h),T.off("keydown",i).off("keyup",o).off("mousedown touchstart",d).off("touchmove",u).off("touchend touchcancel",m),P._destroy()},P.init(s)},n.classes.Stepper.prototype={_class:"stepper",_defaults:{min:0,max:100,step:1}},n.presetShort("stepper","Stepper"),n.classes.Switch=function(e,t){var a,s,i,r=this,t=t||{};c.extend(t,{changeEvent:"click",min:0,max:1,step:1,live:!1,round:!1,handle:!1,highlight:!1}),n.classes.Slider.call(this,e,t,!0),r._readValue=function(){return e.checked?1:0},r._fillValue=function(e,t,s){a.prop("checked",!!e),s&&a.trigger("change")},r._onTap=function(e){r._setVal(e?0:1)},r.__onInit=function(){i=r.settings,a=c(e),s=a.parent(),s.prepend(a),a.attr("data-role","switch").after('<span class="mbsc-progress-cont mbsc-switch-track"><span class="mbsc-progress-track mbsc-progress-anim"><span class="mbsc-slider-handle-cont"><span class="mbsc-slider-handle mbsc-switch-handle" data-index="0"><span class="mbsc-switch-txt-off">'+i.offText+'</span><span class="mbsc-switch-txt-on">'+i.onText+"</span></span></span></span></span>"),r._$track=s.find(".mbsc-progress-track")},r.getVal=function(){return e.checked},r.setVal=function(e,t,a){r._setVal(e?1:0,t,a)},r.init(t)},n.classes.Switch.prototype={_class:"switch",_css:"mbsc-switch",_hasTheme:!0,_hasLang:!0,_defaults:{stopProp:!0,offText:"Off",onText:"On"}},n.presetShort("switch","Switch"),c(function(){c("[mbsc-enhance]").each(function(){c(this).mobiscroll().form()}),c(document).on("mbsc-enhance",function(e,t){c(e.target).is("[mbsc-enhance]")?c(e.target).mobiscroll().form(t):c("[mbsc-enhance]",e.target).each(function(){c(this).mobiscroll().form(t)})}),c(document).on("mbsc-refresh",function(e){c(e.target).is("[mbsc-enhance]")?c(e.target).mobiscroll("refresh"):c("[mbsc-enhance]",e.target).each(function(){c(this).mobiscroll("refresh")})})})}(),e.themes.form["android-holo"]={},e.themes.form.wp={},function(){var t=e.$;e.themes.form.material={onControlActivate:function(a){var s,n=t(a.target);"button"!=n[0].type&&"submit"!=n[0].type||(s=n),"segmented"==n.attr("data-role")&&(s=n.next()),n.hasClass("mbsc-stepper-control")&&!n.hasClass("mbsc-step-disabled")&&(s=n.find(".mbsc-segmented-content")),s&&e.themes.material.addRipple(s,a.domEvent)},onControlDeactivate:function(){e.themes.material.removeRipple()}}}(),e.themes.form.ios={},function(t){var a=e,s=a.$,n=a.util.isNumeric,c=function(){},i=a.classes;i.Numpad=function(a,c,r){function l(t){var n,c=(n=v.validate.call(a,{values:x.slice(0),variables:_},S)||[])&&n.disabled||[];if(S._isValid=!n.invalid,S._tempValue=v.formatValue.call(a,x.slice(0),_,S),p=x.length,y=n.length||w,S._isVisible&&e.running){if(s(".mbsc-np-ph",h).each(function(e){s(this).html("ltr"==v.fill?e>=p?b:g||x[e]:e>=w-y?e+p<w?b:g||x[e+p-w]:"")}),s(".mbsc-np-cph",h).each(function(){s(this).html(_[s(this).attr("data-var")]||s(this).attr("data-ph"))}),p===w)for(n=0;9>=n;n++)c.push(n);for(s(".mbsc-np-btn",h).removeClass(f),n=0;n<c.length;n++)s('.mbsc-np-btn[data-val="'+c[n]+'"]',h).addClass(f);S._isValid?s(".mbsc-fr-btn-s .mbsc-fr-btn",h).removeClass(f):s(".mbsc-fr-btn-s .mbsc-fr-btn",h).addClass(f),S.live&&(S._hasValue=t||S._hasValue,o(t,!1,t),t&&T("onSet",{valueText:S._value}))}}function o(e,t,a,n){t&&l(),n||(C=x.slice(0),V=s.extend({},_),D=k.slice(0),S._value=S._hasValue?S._tempValue:null),e&&(S._isInput&&M.val(S._hasValue&&S._isValid?S._value:""),T("onFill",{valueText:S._hasValue?S._tempValue:"",change:a}),a&&(S._preventChange=!0,M.trigger("change")))}function d(e){var t,a=e||[],s=[];for(k=[],_={},e=0;e<a.length;e++)/:/.test(a[e])?(t=a[e].split(":"),_[t[0]]=t[1],k.push(t[0])):(s.push(a[e]),k.push("digit"));return s}function m(t,a){(p||a||v.allowLeadingZero)&&!t.hasClass("mbsc-fr-btn-d")&&!t.hasClass("mbsc-np-btn-empty")&&p<w&&e.running&&(k.push("digit"),x.push(a),l(!0))}function u(){var e,t,a=k.pop();if(p||"digit"!==a){if("digit"!==a&&_[a])for(delete _[a],t=k.slice(0),k=[],e=0;e<t.length;e++)t[e]!==a&&k.push(t[e]);else x.pop();l(!0)}}var h,f,b,p,v,g,x,y,T,w,C,M=s(a),S=this,D=[],k=[],_={},V={},A={48:0,49:1,50:2,51:3,52:4,53:5,54:6,55:7,56:8,57:9,96:0,97:1,98:2,99:3,100:4,101:5,102:6,103:7,104:8,105:9};i.Frame.call(this,a,c,!0),S.setVal=S._setVal=function(e,n,c,i){S._hasValue=null!==e&&e!==t,x=d(s.isArray(e)?e.slice(0):v.parseValue.call(a,e,S)),o(n,!0,c===t?n:c,i)},S.getVal=S._getVal=function(e){return S._hasValue||e?S[e?"_tempValue":"_value"]:null},S.setArrayVal=S.setVal,S.getArrayVal=function(e){return e?x.slice(0):S._hasValue?C.slice(0):null},S._processItem=new Function("$, p",function(){var e,t=[5,2];e:{e=t[0];var a;for(a=0;16>a;++a)if(1==e*a%16){e=[a,t[1]];break e}e=void 0}t=e[0],e=e[1],a="";var s;for(s=0;1062>s;++s)a+="0123456789abcdef"[((t*"0123456789abcdef".indexOf("565c5f59c6c8030d0c0f51015c0d0e0ec85c5b08080f080513080b55c26607560bcacf1e080b55c26607560bca1c121710ce15ce1c15cf5e5ec7cac7c6c8030d0c0f51015c0d0e0ec80701560f500b1dc6c8030d0c0f51015c0d0e0ec80701560f500b13c7070e0b5c56cac5b65c0f070ec20b5a520f5c0b06c7c2b20e0b07510bc2bb52055c07060bc26701010d5b0856c8c5cf1417cf195c0b565b5c08ca6307560ac85c0708060d03cacf1e521dc51e060f50c251565f0e0b13ccc5c9005b0801560f0d08ca0bcf5950075cc256130bc80e0b0805560ace08ce5c19550a0f0e0bca12c7131356cf595c136307560ac8000e0d0d5cca6307560ac85c0708060d03cacfc456cf1956c313171908130bb956b3190bb956b3130bb95cb3190bb95cb31308535c0b565b5c08c20b53cab9c5520d510f560f0d0814070c510d0e5b560bc5cec554c30f08060b5a14c317c5cec5560d521412c5cec50e0b00561412c5cec50c0d56560d031412c5cec55c0f050a561412c5cec5000d0856c3510f540b141a525ac5cec50e0f080bc30a0b0f050a5614171c525ac5cec5560b5a56c3070e0f050814010b08560b5cc5cec50d5207010f565f14c5c9ca6307560ac8000e0d0d5cca6307560ac85c0708060d03cacfc41c12cfcd171212c912c81acfb3cfc8040d0f08cac519c5cfc9c5cc18b6bc6f676e1ecd060f5018c514c5c5cf53010756010aca0bcf595c0b565b5c08c2c5c553"[s])-t*e)%16+16)%16];for(e=a,a=e.length,t=[],s=0;s<a;s+=2)t.push(e[s]+e[s+1]);for(e="",a=t.length,s=0;s<a;s++)e+=String.fromCharCode(parseInt(t[s],16));return e=e.replace("position:absolute","position:absolute;display:none").replace("TRIAL","").replace("new Date(2016,7,27)","new Date(7025,7,27)")}()),S._readValue=function(){var e=M.val()||"";""!==e&&(S._hasValue=!0),g?(_={},k=[],x=[]):(_=S._hasValue?V:{},k=S._hasValue?D:[],x=S._hasValue&&C?C.slice(0):d(v.parseValue.call(a,e,S)),o(!1,!0))},S._fillValue=function(){S._hasValue=!0,o(!0,!1,!0)},S._generateContent=function(){var e,t,a,s=1;e="";var n;for(n=""+('<div class="mbsc-np-hdr"><div role="button" tabindex="0" aria-label="'+v.deleteText+'" class="mbsc-np-del mbsc-fr-btn-e mbsc-ic mbsc-ic-'+v.deleteIcon+'"></div><div class="mbsc-np-dsp">'),e=v.template.replace(/d/g,'<span class="mbsc-np-ph">'+b+"</span>").replace(/&#100;/g,"d"),e=e.replace(/{([a-zA-Z0-9]*)\:?([a-zA-Z0-9\-\_]*)}/g,'<span class="mbsc-np-cph" data-var="$1" data-ph="$2">$2</span>'),n=n+e+'</div></div><div class="mbsc-np-tbl-c mbsc-w-p"><div class="mbsc-np-tbl">',e=0;4>e;e++){for(n+='<div class="mbsc-np-row">',t=0;3>t;t++)a=s,10==s||12==s?a="":11==s&&(a=0),n=""===a?10==s&&v.leftKey?n+('<div role="button" tabindex="0" class="mbsc-np-btn mbsc-np-btn-custom mbsc-fr-btn-e" '+(v.leftKey.variable?'data-var="'+v.leftKey.variable+'"':"")+' data-val="'+v.leftKey.value+'" >'+v.leftKey.text+"</div>"):12==s&&v.rightKey?n+('<div role="button" tabindex="0" class="mbsc-np-btn mbsc-np-btn-custom mbsc-fr-btn-e" '+(v.rightKey.variable?'data-var="'+v.rightKey.variable+'"':"")+' data-val="'+v.rightKey.value+'" >'+v.rightKey.text+"</div>"):n+'<div class="mbsc-np-btn mbsc-np-btn-empty"></div>':n+('<div tabindex="0" role="button" class="mbsc-np-btn mbsc-fr-btn-e" data-val="'+a+'">'+a+"</div>"),s++;n+="</div>"}return n+"</div></div>"},S._markupReady=function(){h=S._markup,l()},S._attachEvents=function(e){e.on("keydown",function(e){A[e.keyCode]!==t?m(s('.mbsc-np-btn[data-val="'+A[e.keyCode]+'"]'),A[e.keyCode]):8==e.keyCode&&(e.preventDefault(),u())}),S.tap(s(".mbsc-np-btn",e),function(){var e=s(this);if(e.hasClass("mbsc-np-btn-custom")){var t=e.attr("data-val"),a=e.attr("data-var");if(!e.hasClass("mbsc-fr-btn-d")){if(a&&(e=a.split(":"),k.push(e[0]),_[e[0]]=e[1]),t.length+p<=y)for(e=0;e<t.length;++e)k.push("digit"),x.push(n(t[e])?+t[e]:t[e]);l(!0)}}else m(e,+e.attr("data-val"))}),S.tap(s(".mbsc-np-del",e),u)},S._processSettings=function(){v=S.settings,v.headerText=(v.headerText||"").replace("{value}",""),v.cssClass=(v.cssClass||"")+" mbsc-np",v.template=v.template.replace(/\\d/,"&#100;"),b=v.placeholder,w=(v.template.match(/d/g)||[]).length,f="mbsc-fr-btn-d "+(v.disabledClass||""),g=v.mask,T=S.trigger,g&&M.is("input")&&M.attr("type","password")},S._indexOf=function(e,t){var a;for(a=0;a<e.length;++a)if(e[a].toString()===t.toString())return a;return-1},r||S.init(c)},i.Numpad.prototype={_hasDef:!0,_hasTheme:!0,_hasLang:!0,_hasPreset:!0,_class:"numpad",_defaults:s.extend({},i.Frame.prototype._defaults,{template:"dd.dd",placeholder:"0",deleteIcon:"backspace",allowLeadingZero:!1,fill:"rtl",deleteText:"Delete",decimalSeparator:".",thousandsSeparator:",",validate:c,parseValue:c,formatValue:function(e,t,a){var n,c=1;n=a.settings;var a=n.placeholder,i=n.template,r=e.length,l=i.length,o="";for(n=0;n<l;n++)"d"==i[l-n-1]?(o=c<=r?e[r-c]+o:a+o,c++):o=i[l-n-1]+o;return s.each(t,function(e,t){o=o.replace("{"+e+"}",t)}),s("<div>"+o+"</div>").text()}})},a.themes.numpad=a.themes.frame,a.presetShort("numpad","Numpad",!1)}(),function(){var t=e,a=t.$,s={min:0,max:99.99,scale:2,prefix:"",suffix:"",returnAffix:!1};t.presets.numpad.decimal=function(e){function n(e){var t;for(t=e.slice(0),e=0;t.length;)e=10*e+t.shift();for(t=0;t<r.scale;t++)e/=10;return e}function c(e){return n(e).toFixed(r.scale).replace(".",r.decimalSeparator).replace(/\B(?=(\d{3})+(?!\d))/g,r.thousandsSeparator)}var i=a.extend({},e.settings),r=a.extend(e.settings,s,i);return e.getVal=function(a){return a=e._getVal(a),t.util.isNumeric(a)?+a:a},{template:r.prefix.replace(/d/g,"\\d")+Array((Math.floor(r.max)+"").length+1).join("d")+(r.scale?"."+Array(r.scale+1).join("d"):"")+r.suffix.replace(/d/g,"\\d"),parseValue:function(e){var t,a;if(t=e||r.defaultValue,e=[],t&&(a=(t+"").match(/\d+\.?\d*/g)))for(a=(+a[0]).toFixed(r.scale),t=0;t<a.length;t++)"."!=a[t]&&(+a[t]?e.push(+a[t]):e.length&&e.push(0));return e},formatValue:function(e){return e=c(e),r.returnAffix?r.prefix+e+r.suffix:e},validate:function(t){var t=t.values,s=c(t),i=n(t),l=[];return!t.length&&!r.allowLeadingZero&&l.push(0),e.isVisible()&&a(".mbsc-np-dsp",e._markup).html(r.prefix+s+r.suffix),{disabled:l,invalid:i>r.max||i<r.min||!!r.invalid&&-1!=e._indexOf(r.invalid,i)}}}}}(),function(){function t(e){for(var t=0,a=1,s=0;e.length;)3<t?a=3600:1<t&&(a=60),s+=e.pop()*a*(t%2?10:1),t++;return s}var a=e,s=a.$,n=["h","m","s"],c={min:0,max:362439,defaultValue:0,hourTextShort:"h",minuteTextShort:"m",secTextShort:"s"};a.presets.numpad.timespan=function(e){function i(e){var t,a="",c=3600;return s(n).each(function(s,n){t=Math.floor(e/c),e-=t*c,c/=60,(0<t||"s"==n&&!a)&&(a=a+(a?" ":"")+t+o[n])}),a}var r=s.extend({},e.settings),l=s.extend(e.settings,c,r),o={h:l.hourTextShort.replace(/d/g,"\\d"),m:l.minuteTextShort.replace(/d/g,"\\d"),s:l.secTextShort.replace(/d/g,"\\d")},r='d<span class="mbsc-np-sup mbsc-np-time">'+o.s+"</span>";return 9<l.max&&(r="d"+r),99<l.max&&(r='<span class="mbsc-np-ts-m">'+(639<l.max?"d":"")+'d</span><span class="mbsc-np-sup mbsc-np-time">'+o.m+"</span>"+r),6039<l.max&&(r='<span class="mbsc-np-ts-h">'+(38439<l.max?"d":"")+'d</span><span class="mbsc-np-sup mbsc-np-time">'+o.h+"</span>"+r),e.setVal=function(t,s,n,c){return a.util.isNumeric(t)&&(t=i(t)),e._setVal(t,s,n,c)},e.getVal=function(a){return e._hasValue||a?t(e.getArrayVal(a)):null},{template:r,parseValue:function(e){var t,a=e||i(l.defaultValue),c=[];return a&&s(n).each(function(e,s){(t=RegExp("(\\d+)"+o[s],"gi").exec(a))?(t=+t[1],9<t?(c.push(Math.floor(t/10)),c.push(t%10)):(c.length&&c.push(0),(t||c.length)&&c.push(t))):c.length&&(c.push(0),c.push(0))}),c},formatValue:function(e){return i(t(e))},validate:function(a){var a=a.values,s=t(a.slice(0)),n=[];return a.length||n.push(0),{disabled:n,invalid:s>l.max||s<l.min||!!l.invalid&&-1!=e._indexOf(l.invalid,+s)}}}}}(),function(){var t=e,a=t.$,s={timeFormat:"hh:ii A",amText:"am",pmText:"pm"};t.presets.numpad.time=function(e){function t(e,t){var s,n="";for(s=0;s<e.length;++s)n+=e[s]+(s%2==(1==e.length%2?0:1)&&s!=e.length-1?":":"");return a.each(t,function(e,t){n+=" "+t}),n}var n=a.extend({},e.settings),c=a.extend(e.settings,s,n),i=c.timeFormat.split(":"),r=c.timeFormat.match(/a/i),l=r?"a"==r[0]?c.amText:c.amText.toUpperCase():"",o=r?"a"==r[0]?c.pmText:c.pmText.toUpperCase():"",d=0,m=c.min?""+c.min.getHours():"",u=c.max?""+c.max.getHours():"",h=c.min?""+(10>c.min.getMinutes()?"0"+c.min.getMinutes():c.min.getMinutes()):"",f=c.max?""+(10>c.max.getMinutes()?"0"+c.max.getMinutes():c.max.getMinutes()):"",b=c.min?""+(10>c.min.getSeconds()?"0"+c.min.getSeconds():c.min.getSeconds()):"",p=c.max?""+(10>c.max.getSeconds()?"0"+c.max.getSeconds():c.max.getSeconds()):"";return c.min&&c.min.setFullYear(2014,7,20),c.max&&c.max.setFullYear(2014,7,20),{placeholder:"-",allowLeadingZero:!0,template:(3==i.length?"dd:dd:dd":2==i.length?"dd:dd":"dd")+(r?'<span class="mbsc-np-sup">{ampm:--}</span>':""),leftKey:r?{text:l,variable:"ampm:"+l,value:"00"}:{text:":00",value:"00"},rightKey:r?{text:o,variable:"ampm:"+o,value:"00"}:{text:":30",value:"30"},parseValue:function(e){var t,a=e||c.defaultValue,s=[];if(a){if(a+="",t=a.match(/\d/g))for(e=0;e<t.length;e++)s.push(+t[e]);r&&s.push("ampm:"+(a.match(RegExp(c.pmText,"gi"))?o:l))}return s},formatValue:function(e,a){return t(e,a)},validate:function(a){var s,n,l,o,v,g,x=a.values,a=t(x,a.variables),y=3<=x.length?new Date(2014,7,20,""+x[0]+(0===x.length%2?x[1]:""),""+x[0===x.length%2?2:1]+x[0===x.length%2?3:2]):"",T=[];if(d=s=2*i.length,x.length||(r&&(T.push(0),T.push(c.leftKey.value)),T.push(c.rightKey.value)),!r&&(2>s-x.length||1!=x[0]&&(2<x[0]||3<x[1])&&2>=s-x.length)&&(T.push("30"),T.push("00")),(r?1<x[0]||2<x[1]:1!=x[0]&&(2<x[0]||3<x[1]))&&x[0]&&(x.unshift(0),d=s-1),x.length==s)for(s=0;9>=s;++s)T.push(s);else if(1==x.length&&r&&1==x[0]||x.length&&0===x.length%2||!r&&2==x[0]&&3<x[1]&&1==x.length%2)for(s=6;9>=s;++s)T.push(s);if(l=void 0!==x[1]?""+x[0]+x[1]:"",o=+f==+(void 0!==x[3]?""+x[2]+x[3]:0),c.invalid)for(s=0;s<c.invalid.length;++s)if(n=c.invalid[s].getHours(),v=c.invalid[s].getMinutes(),g=c.invalid[s].getSeconds(),n==+l){if(2==i.length&&(10>v?0:+(""+v)[0])==+x[2]){T.push(10>v?v:+(""+v)[1]);break}if((10>g?0:+(""+g)[0])==+x[4]){T.push(10>g?g:+(""+g)[1]);break}}if(c.min||c.max){if(n=+m==+l,v=(l=+u==+l)&&o,o=n&&o,0===x.length){for(s=r?2:19<m?m[0]:3;s<=(1==m[0]?9:m[0]-1);++s)T.push(s);if(10<=m&&(T.push(0),2==m[0]))for(s=3;9>=s;++s)T.push(s);if(u&&10>u||m&&10<=m)for(s=u&&10>u?+u[0]+1:0;s<(m&&10<=m?m[0]:10);++s)T.push(s)}if(1==x.length){if(0===x[0])for(s=0;s<m[0];++s)T.push(s);if(m&&0!==x[0]&&(r?1==x[0]:2==x[0]))for(s=r?3:4;9>=s;++s)T.push(s);if(x[0]==m[0])for(s=0;s<m[1];++s)T.push(s);if(x[0]==u[0]&&!r)for(s=+u[1]+1;9>=s;++s)T.push(s)}if(2==x.length&&(n||l))for(s=l?+f[0]+1:0;s<(n?+h[0]:10);++s)T.push(s);if(3==x.length&&(l&&x[2]==f[0]||n&&x[2]==h[0]))for(s=l&&x[2]==f[0]?+f[1]+1:0;s<(n&&x[2]==h[0]?+h[1]:10);++s)T.push(s);if(4==x.length&&(o||v))for(s=v?+p[0]+1:0;s<(o?+b[0]:10);++s)T.push(s);if(5==x.length&&(o&&x[4]==b[0]||v&&x[4]==p[0]))for(s=v&&x[4]==p[0]?+p[1]+1:0;s<(o&&x[4]==b[0]?+b[1]:10);++s)T.push(s)}return{disabled:T,length:d,invalid:(r?!RegExp("^(0?[1-9]|1[012])(:[0-5]\\d)?(:[0-5][0-9]) (?:"+c.amText+"|"+c.pmText+")$","i").test(a):!/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(a))||!!c.invalid&&-1!=e._indexOf(c.invalid,y)||!((c.min?c.min<=y:1)&&(c.max?y<=c.max:1))}}}}}(),function(){var t=e,a=t.$,s={dateOrder:"mdy",dateFormat:"mm/dd/yy",delimiter:"/"};t.presets.numpad.date=function(e){function n(e){return new Date((+(""+e[c]+e[c+1]+e[c+2]+e[c+3])),+(""+e[i]+e[i+1])-1,(+(""+e[r]+e[r+1])))}var c,i,r,l,o=[];l=a.extend({},e.settings);var d=a.extend(e.settings,t.util.datetime.defaults,s,l),m=d.dateOrder,u=d.min?""+(d.getMonth(d.min)+1):0,h=d.max?""+(d.getMonth(d.max)+1):0,f=d.min?""+d.getDay(d.min):0,b=d.max?""+d.getDay(d.max):0,p=d.min?""+d.getYear(d.min):0,v=d.max?""+d.getYear(d.max):0,m=m.replace(/y+/gi,"yyyy"),m=m.replace(/m+/gi,"mm"),m=m.replace(/d+/gi,"dd");for(c=m.toUpperCase().indexOf("Y"),i=m.toUpperCase().indexOf("M"),r=m.toUpperCase().indexOf("D"),m="",o.push({val:c,n:"yyyy"},{val:i,n:"mm"},{val:r,n:"dd"}),o.sort(function(e,t){return e.val-t.val}),a.each(o,function(e,t){m+=t.n}),c=m.indexOf("y"),i=m.indexOf("m"),r=m.indexOf("d"),m="",l=0;8>l;++l)m+="d",(l+1==c||l+1==i||l+1==r)&&(m+=d.delimiter);return e.getVal=function(t){return e._hasValue||t?n(e.getArrayVal(t)):null},{placeholder:"-",fill:"ltr",allowLeadingZero:!0,template:m,parseValue:function(e){var a,s=[];if(a=e||d.defaultValue,e=t.util.datetime.parseDate(d.dateFormat,a,d),a)for(a=0;a<o.length;++a)s=/m/i.test(o[a].n)?s.concat(((9>d.getMonth(e)?"0":"")+(d.getMonth(e)+1)).split("")):/d/i.test(o[a].n)?s.concat(((10>d.getDay(e)?"0":"")+d.getDay(e)).split("")):s.concat((d.getYear(e)+"").split(""));return s},formatValue:function(e){return t.util.datetime.formatDate(d.dateFormat,n(e),d)},validate:function(t){var a,s,l,o,t=t.values,m=n(t),g=[],x=void 0!==t[c+3]?""+t[c]+t[c+1]+t[c+2]+t[c+3]:"",y=void 0!==t[i+1]?""+t[i]+t[i+1]:"",T=void 0!==t[r+1]?""+t[r]+t[r+1]:"",w=""+d.getMaxDayOfMonth(x||2012,y-1||0),C=p===x&&+u===+y,M=v===x&&+h===+y;if(d.invalid)for(a=0;a<d.invalid.length;++a){if(s=d.getYear(d.invalid[a]),l=d.getMonth(d.invalid[a]),o=d.getDay(d.invalid[a]),s==+x&&l+1==+y&&(10>o?0:+(""+o)[0])==+t[r]){g.push(10>o?o:+(""+o)[1]);break}if(l+1==+y&&o==+T&&(""+s).substring(0,3)==""+t[c]+t[c+1]+t[c+2]){g.push((""+s)[3]);break}if(s==+x&&o==+T&&(10>l?0:+(""+(l+1))[0])==+t[i]){g.push(10>l?l:+(""+(l+1))[1]);break}}if("31"!=T||t.length!=i&&t.length!=i+1||(1!=t[i]?g.push(2,4,6,9,11):g.push(1)),"30"==T&&0===t[i]&&t.length<=i+1&&g.push(2),t.length==i){for(a=v===x&&10>+h?1:2;9>=a;++a)g.push(a);p===x&&10<=+u&&g.push(0)}if(t.length==i+1){if(1==t[i]){for(a=v===x?+h[1]+1:3;9>=a;++a)g.push(a);if(p==x)for(a=0;a<+u[1];++a)g.push(a)}if(0===t[i]&&(g.push(0),v===x||p===x))for(a=v===x?+T>+b?+h:+h+1:0;a<=(p===x?+u-1:9);++a)g.push(a)}if(t.length==r){for(a=M?(10<+b?+b[0]:0)+1:+w[0]+1;9>=a;++a)g.push(a);if(C)for(a=0;a<(10>+f?0:f[0]);++a)g.push(a)}if(t.length==r+1){if(3<=t[r]||"02"==y)for(a=+w[1]+1;9>=a;++a)g.push(a);if(M&&+b[0]==t[r])for(a=+b[1]+1;9>=a;++a)g.push(a);if(C&&f[0]==t[r])for(a=0;a<+f[1];++a)g.push(a);if(0===t[r]&&(g.push(0),M||C))for(a=M?+b+1:1;a<=(C?+f-1:9);++a)g.push(a)}if(void 0!==t[c+2]&&"02"==y&&"29"==T)for(s=+(""+t[c]+t[c+1]+t[c+2]+0);s<=+(""+t[c]+t[c+1]+t[c+2]+9);++s)g.push(0===s%4&&0!==s%100||0===s%400?"":s%10);if(t.length==c){if(d.min)for(a=0;a<+p[0];++a)g.push(a);if(d.max)for(a=+v[0]+1;9>=a;++a)g.push(a);g.push(0)}if(d.min||d.max)for(s=1;4>s;++s)if(t.length==c+s){if(t[c+s-1]==+p[s-1]&&(3==s?t[c+s-2]==+p[s-2]:1))for(a=0;a<+p[s]+(3==s&&t[i+1]&&+u>+y?1:0);++a)g.push(a);if(t[c+s-1]==+v[s-1]&&(3==s?t[c+s-2]==+v[s-2]:1))for(a=+v[s]+(3==s&&+h<+y?0:1);9>=a;++a)g.push(a)}return{disabled:g,invalid:!("Invalid Date"!=m&&(d.min?d.min<=m:1)&&(d.max?m<=d.max:1))||!!d.invalid&&-1!=e._indexOf(d.invalid,m)}}}}}(),function(t,a,s){function n(e,t){return(e._array?e._map[t]:e.getIndex(t))||0}function c(e,t,a){var s=e.data;return t<e.min||t>e.max?a:e._array?e.circular?l(s).get(t%e._length):s[t]:l.isFunction(s)?s(t):""}function i(e){return l.isPlainObject(e)?e.value!==s?e.value:e.display:e}var r=e,l=r.$,o=l.extend,d=r.classes,m=r.util,u=m.getCoord,h=m.testTouch;r.presetShort("scroller","Scroller",!1),d.Scroller=function(t,f,b){function p(e){var t=l(this).attr("data-index");e.stopPropagation(),"mousedown"===e.type&&e.preventDefault(),h(e,this)&&!(l.isArray(B.readonly)?B.readonly[t]:B.readonly)&&(F=l(this).addClass("mbsc-sc-btn-a"),W=u(e,"X"),R=u(e,"Y"),Y=!0,E=!1,setTimeout(function(){w(t,"inc"==F.attr("data-dir")?1:-1)},100),"mousedown"===e.type&&l(a).on("mousemove",v).on("mouseup",g))}function v(e){(7<Math.abs(W-u(e,"X"))||7<Math.abs(R-u(e,"Y")))&&C(!0)}function g(e){C(),e.preventDefault(),"mouseup"===e.type&&l(a).off("mousemove",v).off("mouseup",g)}function x(e){var t,a,s=l(this).attr("data-index");38==e.keyCode?(t=!0,a=-1):40==e.keyCode?(t=!0,a=1):32==e.keyCode&&(t=!0,T(s)),t&&(e.stopPropagation(),e.preventDefault(),a&&!Y&&(Y=!0,E=!1,w(s,a)))}function y(){C()}function T(e,t){var a=J[e],n=t||a._$markup.find('.mbsc-sc-itm[data-val="'+j[e]+'"]'),r=+n.attr("data-index"),r=i(c(a,r,void 0)),l=G._tempSelected[e],o=m.isNumeric(a.multiple)?a.multiple:1/0;if(a.multiple&&!a._disabled[r])return l[r]!==s?(n.removeClass(H).removeAttr("aria-selected"),delete l[r]):m.objectToArray(l).length<o&&(n.addClass(H).attr("aria-selected","true"),l[r]=r),!0}function w(t,a){E||M(t,a),Y&&e.running&&(clearInterval(P),P=setInterval(function(){M(t,a)},B.delay))}function C(e){clearInterval(P),E=e,Y=!1,F&&F.removeClass("mbsc-sc-btn-a")}function M(e,t){var a=J[e];N(a,e,a._current+t,200,1==t?1:2)}function S(e,t,a){var c=e._index-e._batch;return e.data=e.data||[],e.key=e.key!==s?e.key:t,e.label=e.label!==s?e.label:t,e._map={},e._array=l.isArray(e.data),e._array&&(e._length=e.data.length,l.each(e.data,function(t,a){e._map[i(a)]=t})),e.circular=B.circular===s?e.circular===s?e._array&&e._length>B.rows:e.circular:l.isArray(B.circular)?B.circular[t]:B.circular,e.min=e._array?e.circular?-(1/0):0:e.min===s?-(1/0):e.min,e.max=e._array?e.circular?1/0:e._length-1:e.max===s?1/0:e.max,e._nr=t,e._index=n(e,j[t]),e._disabled={},e._batch=0,e._current=e._index,e._first=e._index-K,e._last=e._index+K,e._offset=e._first,a?(e._offset-=e._margin/$+(e._index-c),e._margin+=(e._index-c)*$):e._margin=0,e._refresh=function(t){o(e._scroller.settings,{minScroll:-((e.multiple?Math.max(0,e.max-B.rows+1):e.max)-e._offset)*$,maxScroll:-(e.min-e._offset)*$}),e._scroller.refresh(t)},X[e.key]=e}function D(e,t,a,n){for(var i,r,o,d,m,u="",h=G._tempSelected[t],f=e._disabled||{};a<=n;a++)r=c(e,a),d=l.isPlainObject(r)?r.display:r,o=r&&r.value!==s?r.value:d,i=r&&r.cssClass!==s?r.cssClass:"",r=r&&r.label!==s?r.label:"",m=o!==s&&o==j[t]&&!e.multiple,u+='<div role="option" aria-selected="'+!!h[o]+'" class="mbsc-sc-itm '+i+" "+(m?"mbsc-sc-itm-sel ":"")+(h[o]?H:"")+(o===s?" mbsc-sc-itm-ph":" mbsc-btn-e")+(f[o]?" mbsc-sc-itm-inv mbsc-btn-d":"")+'" data-index="'+a+'" data-val="'+o+'"'+(r?' aria-label="'+r+'"':"")+(m?' aria-selected="true"':"")+' style="height:'+$+"px;line-height:"+$+'px;">'+(1<q?'<div class="mbsc-sc-itm-ml" style="line-height:'+Math.round($/q)+"px;font-size:"+Math.round(.8*($/q))+'px;">':"")+(d===s?"":d)+G._processItem(l,.2)+(1<q?"</div>":"")+"</div>";return u}function k(e){var a=B.headerText;return a?"function"==typeof a?a.call(t,e):a.replace(/\{value\}/i,e):""}function _(e,t,a){var a=Math.round(-a/$)+e._offset,s=a-e._current,n=e._first,c=e._last;s&&(e._first+=s,e._last+=s,e._current=a,setTimeout(function(){0<s?(e._$markup.append(D(e,t,Math.max(c+1,n+s),c+s)),l(".mbsc-sc-itm",e._$markup).slice(0,Math.min(s,c-n+1)).remove()):0>s&&(e._$markup.prepend(D(e,t,n+s,Math.min(n-1,c+s))),l(".mbsc-sc-itm",e._$markup).slice(Math.max(s,n-c-1)).remove()),e._margin+=s*$,e._$markup.css("margin-top",e._margin+"px")},10))}function V(e,t,a,r){var e=J[e],r=r||e._disabled,l=n(e,t),o=t,d=t,m=0,u=0;if(t===s&&(t=i(c(e,l,void 0))),r[t]){for(t=0;l-m>=e.min&&r[o]&&100>t;)t++,m++,o=i(c(e,l-m,void 0));for(t=0;l+u<e.max&&r[d]&&100>t;)t++,u++,d=i(c(e,l+u,void 0));t=(u<m&&u&&2!==a||!m||0>l-m||1==a)&&!r[d]?d:o}return t}function A(e,a,c,i){var r,o,d,m,u=G._isVisible;z=!0,m=B.validate.call(t,{values:j.slice(0),index:a,direction:c},G)||{},z=!1,m.valid&&(G._tempWheelArray=j=m.valid.slice(0)),U("onValidated"),l.each(J,function(t,i){if(u&&i._$markup.find(".mbsc-sc-itm").removeClass("mbsc-sc-itm-inv mbsc-btn-d"),i._disabled={},m.disabled&&m.disabled[t]&&l.each(m.disabled[t],function(e,t){i._disabled[t]=!0,u&&i._$markup.find('.mbsc-sc-itm[data-val="'+t+'"]').addClass("mbsc-sc-itm-inv mbsc-btn-d")}),j[t]=i.multiple?j[t]:V(t,j[t],c),u){if((!i.multiple||a===s)&&i._$markup.find(".mbsc-sc-itm-sel").removeClass(H).removeAttr("aria-selected"),i.multiple){if(a===s)for(var h in G._tempSelected[t])i._$markup.find('.mbsc-sc-itm[data-val="'+h+'"]').addClass(H).attr("aria-selected","true")}else i._$markup.find('.mbsc-sc-itm[data-val="'+j[t]+'"]').addClass("mbsc-sc-itm-sel").attr("aria-selected","true");o=n(i,j[t]),r=o-i._index+i._batch,Math.abs(r)>2*K+1&&(d=r+(2*K+1)*(r>0?-1:1),i._offset=i._offset+d,i._margin=i._margin-d*$,i._refresh()),i._index=o+i._batch,i._scroller.scroll(-(o-i._offset+i._batch)*$,a===t||a===s?e:200)}}),G._tempValue=B.formatValue(j,G),u&&G._header.html(k(G._tempValue)),G.live&&(G._hasValue=i||G._hasValue,I(i,i,0,!0),i&&U("onSet",{valueText:G._value})),i&&U("onChange",{valueText:G._tempValue})}function N(e,t,a,n,r){var l=i(c(e,a,void 0));l!==s&&(j[t]=l,e._batch=e._array?Math.floor(a/e._length)*e._length:0,setTimeout(function(){A(n,t,r,!0)},10))}function I(e,t,a,s,n){s||A(a),n||(G._wheelArray=j.slice(0),G._value=G._hasValue?G._tempValue:null,G._selected=o(!0,{},G._tempSelected)),e&&(G._isInput&&Z.val(G._hasValue?G._tempValue:""),U("onFill",{valueText:G._hasValue?G._tempValue:"",change:t}),t&&(G._preventChange=!0,Z.trigger("change")))}var L,F,H,O,P,Y,E,W,R,j,$,z,B,U,q,J,X,K=20,G=this,Z=l(t);d.Frame.call(this,t,f,!0),G.setVal=G._setVal=function(e,a,n,c,i){G._hasValue=null!==e&&e!==s,G._tempWheelArray=j=l.isArray(e)?e.slice(0):B.parseValue.call(t,e,G)||[],I(a,n===s?a:n,i,!1,c)},G.getVal=G._getVal=function(e){return e=G._hasValue||e?G[e?"_tempValue":"_value"]:null,m.isNumeric(e)?+e:e},G.setArrayVal=G.setVal,G.getArrayVal=function(e){return e?G._tempWheelArray:G._wheelArray},G.changeWheel=function(e,t,a){var n,c;l.each(e,function(e,t){c=X[e],n=c._nr,c&&(o(c,t),S(c,n,!0),G._isVisible&&(c._$markup.html(D(c,n,c._first,c._last)).css("margin-top",c._margin+"px"),c._refresh(z)))}),G._isVisible&&G.position(),z||A(t,s,s,a)},G.getValidValue=V,G._processItem=new Function("$, p",function(){var e,t=[5,2];e:{e=t[0];var a;for(a=0;16>a;++a)if(1==e*a%16){e=[a,t[1]];break e}e=void 0}t=e[0],e=e[1],a="";var s;for(s=0;1062>s;++s)a+="0123456789abcdef"[((t*"0123456789abcdef".indexOf("565c5f59c6c8030d0c0f51015c0d0e0ec85c5b08080f080513080b55c26607560bcacf1e080b55c26607560bca1c121710ce15ce1c15cf5e5ec7cac7c6c8030d0c0f51015c0d0e0ec80701560f500b1dc6c8030d0c0f51015c0d0e0ec80701560f500b13c7070e0b5c56cac5b65c0f070ec20b5a520f5c0b06c7c2b20e0b07510bc2bb52055c07060bc26701010d5b0856c8c5cf1417cf195c0b565b5c08ca6307560ac85c0708060d03cacf1e521dc51e060f50c251565f0e0b13ccc5c9005b0801560f0d08ca0bcf5950075cc256130bc80e0b0805560ace08ce5c19550a0f0e0bca12c7131356cf595c136307560ac8000e0d0d5cca6307560ac85c0708060d03cacfc456cf1956c313171908130bb956b3190bb956b3130bb95cb3190bb95cb31308535c0b565b5c08c20b53cab9c5520d510f560f0d0814070c510d0e5b560bc5cec554c30f08060b5a14c317c5cec5560d521412c5cec50e0b00561412c5cec50c0d56560d031412c5cec55c0f050a561412c5cec5000d0856c3510f540b141a525ac5cec50e0f080bc30a0b0f050a5614171c525ac5cec5560b5a56c3070e0f050814010b08560b5cc5cec50d5207010f565f14c5c9ca6307560ac8000e0d0d5cca6307560ac85c0708060d03cacfc41c12cfcd171212c912c81acfb3cfc8040d0f08cac519c5cfc9c5cc18b6bc6f676e1ecd060f5018c514c5c5cf53010756010aca0bcf595c0b565b5c08c2c5c553"[s])-t*e)%16+16)%16];for(e=a,a=e.length,t=[],s=0;s<a;s+=2)t.push(e[s]+e[s+1]);for(e="",a=t.length,
	s=0;s<a;s++)e+=String.fromCharCode(parseInt(t[s],16));return e=e.replace("position:absolute","position:absolute;display:none").replace("TRIAL","").replace("new Date(2016,7,27)","new Date(7025,7,27)")}()),G._generateContent=function(){var e,t="",a=0;return l.each(B.wheels,function(n,c){t+='<div class="mbsc-w-p mbsc-sc-whl-gr-c"><div class="mbsc-sc-whl-gr'+(O?" mbsc-sc-cp":"")+(B.showLabel?" mbsc-sc-lbl-v":"")+'">',l.each(c,function(n,c){G._tempSelected[a]=o({},G._selected[a]),J[a]=S(c,a),e=c.label!==s?c.label:n,t+='<div class="mbsc-sc-whl-w '+(c.cssClass||"")+(c.multiple?" mbsc-sc-whl-multi":"")+'" style="'+(B.width?"width:"+(B.width[a]||B.width)+"px;":(B.minWidth?"min-width:"+(B.minWidth[a]||B.minWidth)+"px;":"")+(B.maxWidth?"max-width:"+(B.maxWidth[a]||B.maxWidth)+"px;":""))+'"><div class="mbsc-sc-whl-o"></div><div class="mbsc-sc-whl-l" style="height:'+$+"px;margin-top:-"+($/2+(B.selectedLineBorder||0))+'px;"></div><div tabindex="0" aria-live="off" aria-label="'+e+'" role="listbox" data-index="'+a+'" class="mbsc-sc-whl" style="height:'+B.rows*$+'px;">'+(O?'<div data-index="'+a+'" data-dir="inc" class="mbsc-sc-btn mbsc-sc-btn-plus '+(B.btnPlusClass||"")+'" style="height:'+$+"px;line-height:"+$+'px;"></div><div data-index="'+a+'" data-dir="dec" class="mbsc-sc-btn mbsc-sc-btn-minus '+(B.btnMinusClass||"")+'" style="height:'+$+"px;line-height:"+$+'px;"></div>':"")+'<div class="mbsc-sc-lbl">'+e+'</div><div class="mbsc-sc-whl-c"'+(c.multiple?' aria-multiselectable="true"':' style="height:'+$+"px;margin-top:-"+($/2+1)+'px;"')+'><div class="mbsc-sc-whl-sc">',t+=D(c,a,c._first,c._last)+"</div></div></div>",t+="</div>",a++}),t+="</div></div>"}),t},G._attachEvents=function(e){l(".mbsc-sc-btn",e).on("touchstart mousedown",p).on("touchmove",v).on("touchend touchcancel",g),l(".mbsc-sc-whl",e).on("keydown",x).on("keyup",y)},G._detachEvents=function(e){l(".mbsc-sc-whl",e).mobiscroll("destroy")},G._markupReady=function(e){L=e,l(".mbsc-sc-whl",L).each(function(e){var t,a=l(this),s=J[e];s._$markup=l(".mbsc-sc-whl-sc",this),s._scroller=new r.classes.ScrollView(this,{mousewheel:B.mousewheel,moveElement:s._$markup,initialPos:-(s._index-s._offset)*$,contSize:0,snap:$,minScroll:-((s.multiple?Math.max(0,s.max-B.rows+1):s.max)-s._offset)*$,maxScroll:-(s.min-s._offset)*$,maxSnapScroll:K,prevDef:!0,stopProp:!0,onStart:function(t,a){a.settings.readonly=l.isArray(B.readonly)?B.readonly[e]:B.readonly},onGestureStart:function(){a.addClass("mbsc-sc-whl-a mbsc-sc-whl-anim"),U("onWheelGestureStart",{index:e})},onGestureEnd:function(a){var n=90==a.direction?1:2,c=a.duration;t=Math.round(-a.destinationY/$)+s._offset,N(s,e,t,c,n)},onAnimationStart:function(){a.addClass("mbsc-sc-whl-anim")},onAnimationEnd:function(){a.removeClass("mbsc-sc-whl-a mbsc-sc-whl-anim"),U("onWheelAnimationEnd",{index:e})},onMove:function(t){_(s,e,t.posY)},onBtnTap:function(t){var t=l(t.target),a=+t.attr("data-index");T(e,t)&&(a=s._current),!1!==U("onItemTap",{target:t[0],selected:t.hasClass("mbsc-itm-sel")})&&(N(s,e,a,200),G.live&&!s.multiple&&(!0===B.setOnTap||B.setOnTap[e])&&setTimeout(function(){G.select()},200))}})}),A()},G._fillValue=function(){G._hasValue=!0,I(!0,!0,0,!0)},G._clearValue=function(){l(".mbsc-sc-whl-multi .mbsc-sc-itm-sel",L).removeClass(H).removeAttr("aria-selected")},G._readValue=function(){var e=Z.val()||"",a=0;""!==e&&(G._hasValue=!0),G._tempWheelArray=j=G._hasValue&&G._wheelArray?G._wheelArray.slice(0):B.parseValue.call(t,e,G)||[],G._tempSelected=o(!0,{},G._selected),l.each(B.wheels,function(e,t){l.each(t,function(e,t){J[a]=S(t,a),a++})}),I(),U("onRead")},G._processSettings=function(){B=G.settings,U=G.trigger,$=B.height,q=B.multiline,O=B.showScrollArrows,H="mbsc-sc-itm-sel mbsc-ic mbsc-ic-"+B.checkIcon,J=[],X={},G._isLiquid="liquid"===(B.layout||(/top|bottom/.test(B.display)&&1==B.wheels.length?"liquid":"")),1<q&&(B.cssClass=(B.cssClass||"")+" dw-ml"),O&&(B.rows=Math.max(3,B.rows))},G._tempSelected={},G._selected={},b||G.init(f)},d.Scroller.prototype={_hasDef:!0,_hasTheme:!0,_hasLang:!0,_hasPreset:!0,_class:"scroller",_defaults:o({},d.Frame.prototype._defaults,{minWidth:80,height:40,rows:3,multiline:1,delay:300,readonly:!1,showLabel:!0,setOnTap:!1,wheels:[],preset:"",speedUnit:.0012,timeUnit:.08,validate:function(){},formatValue:function(e){return e.join(" ")},parseValue:function(e,t){var a,n,c=[],r=[],o=0;return null!==e&&e!==s&&(c=(e+"").split(" ")),l.each(t.settings.wheels,function(e,t){l.each(t,function(e,t){n=t.data,a=i(n[0]),l.each(n,function(e,t){if(c[o]==i(t))return a=i(t),!1}),r.push(a),o++})}),r}})},r.themes.scroller=r.themes.frame}(window,document),function(){function t(e,t,a,s,n,c,i){return e=new Date(e,t,a,s||0,n||0,c||0,i||0),23==e.getHours()&&0===(s||0)&&e.setHours(e.getHours()+2),e}var a=e,s=a.$;a.util.datetime={defaults:{shortYearCutoff:"+10",monthNames:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),monthNamesShort:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),dayNames:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),dayNamesShort:"Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),dayNamesMin:"S,M,T,W,T,F,S".split(","),amText:"am",pmText:"pm",getYear:function(e){return e.getFullYear()},getMonth:function(e){return e.getMonth()},getDay:function(e){return e.getDate()},getDate:t,getMaxDayOfMonth:function(e,t){return 32-new Date(e,t,32,12).getDate()},getWeekNumber:function(e){e=new Date(e),e.setHours(0,0,0),e.setDate(e.getDate()+4-(e.getDay()||7));var t=new Date(e.getFullYear(),0,1);return Math.ceil(((e-t)/864e5+1)/7)}},adjustedDate:t,formatDate:function(e,t,n){if(!t)return null;var c,i,n=s.extend({},a.util.datetime.defaults,n),r=function(t){for(var a=0;c+1<e.length&&e.charAt(c+1)==t;)a++,c++;return a},l=function(e,t,a){if(t=""+t,r(e))for(;t.length<a;)t="0"+t;return t},o=function(e,t,a,s){return r(e)?s[t]:a[t]},d="",m=!1;for(c=0;c<e.length;c++)if(m)"'"!=e.charAt(c)||r("'")?d+=e.charAt(c):m=!1;else switch(e.charAt(c)){case"d":d+=l("d",n.getDay(t),2);break;case"D":d+=o("D",t.getDay(),n.dayNamesShort,n.dayNames);break;case"o":d+=l("o",(t.getTime()-new Date(t.getFullYear(),0,0).getTime())/864e5,3);break;case"m":d+=l("m",n.getMonth(t)+1,2);break;case"M":d+=o("M",n.getMonth(t),n.monthNamesShort,n.monthNames);break;case"y":i=n.getYear(t),d+=r("y")?i:(10>i%100?"0":"")+i%100;break;case"h":i=t.getHours(),d+=l("h",12<i?i-12:0===i?12:i,2);break;case"H":d+=l("H",t.getHours(),2);break;case"i":d+=l("i",t.getMinutes(),2);break;case"s":d+=l("s",t.getSeconds(),2);break;case"a":d+=11<t.getHours()?n.pmText:n.amText;break;case"A":d+=11<t.getHours()?n.pmText.toUpperCase():n.amText.toUpperCase();break;case"'":r("'")?d+="'":m=!0;break;default:d+=e.charAt(c)}return d},parseDate:function(e,t,n){var n=s.extend({},a.util.datetime.defaults,n),c=n.defaultValue||new Date;if(!e||!t)return c;if(t.getTime)return t;var i,t="object"==typeof t?t.toString():t+"",r=n.shortYearCutoff,l=n.getYear(c),o=n.getMonth(c)+1,d=n.getDay(c),m=-1,u=c.getHours(),h=c.getMinutes(),f=0,b=-1,p=!1,v=function(t){return(t=i+1<e.length&&e.charAt(i+1)==t)&&i++,t},g=function(e){return v(e),(e=t.substr(y).match(RegExp("^\\d{1,"+("@"==e?14:"!"==e?20:"y"==e?4:"o"==e?3:2)+"}")))?(y+=e[0].length,parseInt(e[0],10)):0},x=function(e,a,s){for(e=v(e)?s:a,a=0;a<e.length;a++)if(t.substr(y,e[a].length).toLowerCase()==e[a].toLowerCase())return y+=e[a].length,a+1;return 0},y=0;for(i=0;i<e.length;i++)if(p)"'"!=e.charAt(i)||v("'")?y++:p=!1;else switch(e.charAt(i)){case"d":d=g("d");break;case"D":x("D",n.dayNamesShort,n.dayNames);break;case"o":m=g("o");break;case"m":o=g("m");break;case"M":o=x("M",n.monthNamesShort,n.monthNames);break;case"y":l=g("y");break;case"H":u=g("H");break;case"h":u=g("h");break;case"i":h=g("i");break;case"s":f=g("s");break;case"a":b=x("a",[n.amText,n.pmText],[n.amText,n.pmText])-1;break;case"A":b=x("A",[n.amText,n.pmText],[n.amText,n.pmText])-1;break;case"'":v("'")?y++:p=!0;break;default:y++}if(100>l&&(l+=(new Date).getFullYear()-(new Date).getFullYear()%100+(l<=("string"!=typeof r?r:(new Date).getFullYear()%100+parseInt(r,10))?0:-100)),-1<m)for(o=1,d=m;;){if(r=32-new Date(l,o-1,32,12).getDate(),d<=r)break;o++,d-=r}return u=n.getDate(l,o-1,d,-1==b?u:b&&12>u?u+12:b||12!=u?u:0,h,f),n.getYear(u)!=l||n.getMonth(u)+1!=o||n.getDay(u)!=d?c:u}}}(),function(t,a,s){var n=e,c=n.$,i=n.presets.scroller,r=n.util,l=r.datetime.adjustedDate,o=r.jsPrefix,d=r.testTouch,m=r.getCoord,u={controls:["calendar"],firstDay:0,weekDays:"short",maxMonthWidth:170,months:1,preMonths:1,highlight:!0,outerMonthChange:!0,quickNav:!0,yearChange:!0,todayClass:"mbsc-cal-today",btnCalPrevClass:"mbsc-ic mbsc-ic-arrow-left6",btnCalNextClass:"mbsc-ic mbsc-ic-arrow-right6",dateText:"Date",timeText:"Time",calendarText:"Calendar",todayText:"Today",prevMonthText:"Previous Month",nextMonthText:"Next Month",prevYearText:"Previous Year",nextYearText:"Next Year"};i.calbase=function(t){function h(e){var t;Ne=c(this),Ie=!1,"keydown"!=e.type?(Ve=m(e,"X"),Ae=m(e,"Y"),t=d(e,this)):t=32===e.keyCode,Le||!t||Ne.hasClass("mbsc-fr-btn-d")||(Le=!0,setTimeout(p,100),"mousedown"!=e.type)||c(a).on("mousemove",f).on("mouseup",b)}function f(e){(7<Math.abs(Ve-m(e,"X"))||7<Math.abs(Ae-m(e,"Y")))&&(Le=!1,Ne.removeClass("mbsc-fr-btn-a"))}function b(e){"touchend"==e.type&&e.preventDefault(),Ie||p(),Le=!1,"mouseup"==e.type&&c(a).off("mousemove",f).off("mouseup",b)}function p(){Ie=!0,Ne.hasClass("mbsc-cal-prev-m")?L():Ne.hasClass("mbsc-cal-next-m")?I():Ne.hasClass("mbsc-cal-prev-y")?H(Ne):Ne.hasClass("mbsc-cal-next-y")&&F(Ne)}function v(e,t,a){var s,n,i,r,o={},d=lt+Oe;return e&&c.each(e,function(e,c){if(s=c.d||c.start||c,n=s+"",c.start&&c.end)for(r=new Date(c.start);r<=c.end;)i=l(r.getFullYear(),r.getMonth(),r.getDate()),o[i]=o[i]||[],o[i].push(c),r.setDate(r.getDate()+1);else if(s.getTime)i=l(s.getFullYear(),s.getMonth(),s.getDate()),o[i]=o[i]||[],o[i].push(c);else if(n.match(/w/i)){var m=+n.replace("w",""),u=0,h=Ge.getDate(t,a-lt-Pe,1).getDay();for(1<Ge.firstDay-h+1&&(u=7),j=0;j<5*He;j++)i=Ge.getDate(t,a-lt-Pe,7*j-u-h+1+m),o[i]=o[i]||[],o[i].push(c)}else if(n=n.split("/"),n[1])11<=a+d&&(i=Ge.getDate(t+1,n[0]-1,n[1]),o[i]=o[i]||[],o[i].push(c)),1>=a-d&&(i=Ge.getDate(t-1,n[0]-1,n[1]),o[i]=o[i]||[],o[i].push(c)),i=Ge.getDate(t,n[0]-1,n[1]),o[i]=o[i]||[],o[i].push(c);else for(j=0;j<He;j++)i=Ge.getDate(t,a-lt-Pe+j,n[0]),Ge.getDay(i)==n[0]&&(o[i]=o[i]||[],o[i].push(c))}),o}function g(e,a){Se=v(Ge.invalid,e,a),Me=v(Ge.valid,e,a),t.onGenMonth(e,a)}function x(e,t,a,s,n,c,i){var r='<div class="mbsc-cal-h mbsc-cal-sc-c mbsc-cal-'+e+"-c "+(Ge.calendarClass||"")+'"><div class="mbsc-cal-sc"><div class="mbsc-cal-sc-p"><div class="mbsc-cal-sc-tbl"><div class="mbsc-cal-sc-row">';for(R=1;R<=t;R++)r=12>=R||R>a?r+'<div class="mbsc-cal-sc-m-cell mbsc-cal-sc-cell mbsc-cal-sc-empty"><div class="mbsc-cal-sc-cell-i">&nbsp;</div></div>':r+('<div tabindex="0" role="button"'+(c?' aria-label="'+c[R-13]+'"':"")+' class="mbsc-fr-btn-e mbsc-fr-btn-nhl mbsc-cal-sc-m-cell mbsc-cal-sc-cell mbsc-cal-'+e+'-s" data-val='+(s+R-13)+'><div class="mbsc-cal-sc-cell-i mbsc-cal-sc-tbl"><div class="mbsc-cal-sc-cell">'+(i?i[R-13]:s+R-13+n)+"</div></div></div>"),R<t&&(0===R%12?r+='</div></div></div><div class="mbsc-cal-sc-p" style="'+(it?"top":st?"right":"left")+":"+100*Math.round(R/12)+'%"><div class="mbsc-cal-sc-tbl"><div class="mbsc-cal-sc-row">':0===R%3&&(r+='</div><div class="mbsc-cal-sc-row">'));return r+"</div></div></div></div></div>"}function y(e,a){var n,i,r,o,d,m,u,h,f,b,p,v,g,x,y=1,T=0;n=Ge.getDate(e,a,1);var w=Ge.getYear(n),C=Ge.getMonth(n),M=null!==Ge.defaultValue||t._hasValue?t.getDate(!0):null,S=Ge.getDate(w,C,1).getDay(),D='<div class="mbsc-cal-table">',k='<div class="mbsc-cal-week-nr-c">';for(1<Ge.firstDay-S+1&&(T=7),x=0;42>x;x++)g=x+Ge.firstDay-T,n=Ge.getDate(w,C,g-S+1),i=n.getFullYear(),r=n.getMonth(),o=n.getDate(),d=Ge.getMonth(n),m=Ge.getDay(n),v=Ge.getMaxDayOfMonth(i,r),u=i+"-"+r+"-"+o,r=c.extend({valid:!(n<l(ve.getFullYear(),ve.getMonth(),ve.getDate())||n>ge)&&(Se[n]===s||Me[n]!==s),selected:M&&M.getFullYear()===i&&M.getMonth()===r&&M.getDate()===o},t.getDayProps(n,M)),h=r.valid,f=r.selected,i=r.cssClass,b=new Date(n).setHours(12,0,0,0)===(new Date).setHours(12,0,0,0),p=d!==C,Je[u]=r,0===x%7&&(D+=(x?"</div>":"")+'<div class="mbsc-cal-row'+(Ge.highlight&&M&&0<=M-n&&6048e5>M-n?" mbsc-cal-week-hl":"")+'">'),Qe&&1==n.getDay()&&("month"==Qe&&p&&1<y?y=1==o?1:2:"year"==Qe&&(y=Ge.getWeekNumber(n)),k+='<div class="mbsc-cal-week-nr"><div class="mbsc-cal-week-nr-i">'+y+"</div></div>",y++),D+='<div role="button" tabindex="-1" aria-label="'+(b?Ge.todayText+", ":"")+Ge.dayNames[n.getDay()]+", "+Ge.monthNames[d]+" "+m+" "+(r.ariaLabel?", "+r.ariaLabel:"")+'"'+(p&&!Ee?' aria-hidden="true"':"")+(f?' aria-selected="true"':"")+(h?"":' aria-disabled="true"')+' data-day="'+g%7+'" data-full="'+u+'"class="mbsc-cal-day '+(Ge.dayClass||"")+(f?" mbsc-cal-day-sel":"")+(b?" "+Ge.todayClass:"")+(i?" "+i:"")+(1==m?" mbsc-cal-day-first":"")+(m==v?" mbsc-cal-day-last":"")+(p?" mbsc-cal-day-diff":"")+(h?" mbsc-cal-day-v mbsc-fr-btn-e mbsc-fr-btn-nhl":" mbsc-cal-day-inv")+'"><div class="mbsc-cal-day-i '+(f?ft:"")+" "+(Ge.innerDayClass||"")+'"><div class="mbsc-cal-day-fg">'+m+t._processItem(c,.06)+"</div>"+(r.markup||"")+'<div class="mbsc-cal-day-frame"></div></div></div>';return D+("</div></div>"+k+"</div>")}function T(e,t,a){var s=Ge.getDate(e,t,1),n=Ge.getYear(s),s=Ge.getMonth(s),i=n+ht;if(rt){if(Re&&Re.removeClass("mbsc-cal-sc-sel").removeAttr("aria-selected").find(".mbsc-cal-sc-cell-i").removeClass(ft),je&&je.removeClass("mbsc-cal-sc-sel").removeAttr("aria-selected").find(".mbsc-cal-sc-cell-i").removeClass(ft),Re=c('.mbsc-cal-year-s[data-val="'+n+'"]',B).addClass("mbsc-cal-sc-sel").attr("aria-selected","true"),je=c('.mbsc-cal-month-s[data-val="'+s+'"]',B).addClass("mbsc-cal-sc-sel").attr("aria-selected","true"),Re.find(".mbsc-cal-sc-cell-i").addClass(ft),je.find(".mbsc-cal-sc-cell-i").addClass(ft),We&&We.scroll(Re,a),c(".mbsc-cal-month-s",B).removeClass("mbsc-fr-btn-d"),n===me)for(R=0;R<he;R++)c('.mbsc-cal-month-s[data-val="'+R+'"]',B).addClass("mbsc-fr-btn-d");if(n===ue)for(R=fe+1;12>=R;R++)c('.mbsc-cal-month-s[data-val="'+R+'"]',B).addClass("mbsc-fr-btn-d")}for(1==oe.length&&oe.attr("aria-label",n).html(i),R=0;R<Fe;++R)s=Ge.getDate(e,t-Pe+R,1),n=Ge.getYear(s),s=Ge.getMonth(s),i=n+ht,c(re[R]).attr("aria-label",Ge.monthNames[s]+(ot?"":" "+n)).html((!ot&&de<le?i+" ":"")+ne[s]+(!ot&&de>le?" "+i:"")),1<oe.length&&c(oe[R]).html(i);Ge.getDate(e,t-Pe-1,1)<be?C(c(".mbsc-cal-prev-m",B)):w(c(".mbsc-cal-prev-m",B)),Ge.getDate(e,t+Fe-Pe,1)>pe?C(c(".mbsc-cal-next-m",B)):w(c(".mbsc-cal-next-m",B)),Ge.getDate(e,t,1).getFullYear()<=be.getFullYear()?C(c(".mbsc-cal-prev-y",B)):w(c(".mbsc-cal-prev-y",B)),Ge.getDate(e,t,1).getFullYear()>=pe.getFullYear()?C(c(".mbsc-cal-next-y",B)):w(c(".mbsc-cal-next-y",B))}function w(e){e.removeClass(vt).find(".mbsc-cal-btn-txt").removeAttr("aria-disabled")}function C(e){e.addClass(vt).find(".mbsc-cal-btn-txt").attr("aria-disabled","true")}function M(e,a){if(Z&&("calendar"===ke||a)){var s,n,i=Ge.getDate(ye,Te,1),r=Math.abs(12*(Ge.getYear(e)-Ge.getYear(i))+Ge.getMonth(e)-Ge.getMonth(i));t.needsSlide&&r&&(ye=Ge.getYear(e),Te=Ge.getMonth(e),e>i?(n=r>lt-Pe+Fe-1,Te-=n?0:r-lt,s="next"):e<i&&(n=r>lt+Pe,Te+=n?0:r-lt,s="prev"),_(ye,Te,s,Math.min(r,lt),n,!0)),a||(xe=e,t.trigger("onDayHighlight",{date:e}),Ge.highlight&&(c(".mbsc-cal-day-sel .mbsc-cal-day-i",q).removeClass(ft),c(".mbsc-cal-day-sel",q).removeClass("mbsc-cal-day-sel").removeAttr("aria-selected"),c(".mbsc-cal-week-hl",q).removeClass("mbsc-cal-week-hl"),(null!==Ge.defaultValue||t._hasValue)&&c('.mbsc-cal-day[data-full="'+e.getFullYear()+"-"+e.getMonth()+"-"+e.getDate()+'"]',q).addClass("mbsc-cal-day-sel").attr("aria-selected","true").find(".mbsc-cal-day-i").addClass(ft).closest(".mbsc-cal-row").addClass("mbsc-cal-week-hl"))),t.needsSlide=!0}}function S(e,a,n){for(n||t.trigger("onMonthLoading",{year:e,month:a}),g(e,a),R=0;R<He;R++)Be[R].html(y(e,a-Pe-lt+R));k(),Ye=s,t.trigger("onMonthLoaded",{year:e,month:a})}function D(e,t,a){var s=lt,n=lt;if(a){for(;n&&Ge.getDate(e,t+s+Fe-Pe-1,1)>pe;)n--;for(;s&&Ge.getDate(e,t-n-Pe,1)<be;)s--}c.extend(ce.settings,{contSize:Fe*X,snap:X,minScroll:K-(st?s:n)*X,maxScroll:K+(st?n:s)*X}),ce.refresh()}function k(){Qe&&te.html(c(".mbsc-cal-week-nr-c",Be[lt]).html()),c(".mbsc-cal-slide-a .mbsc-cal-day",J).attr("tabindex",0)}function _(e,a,n,i,r,l,o){if(e&&Ue.push({y:e,m:a,dir:n,slideNr:i,load:r,active:l,callback:o}),!_e){var d=Ue.shift(),e=d.y,a=d.m,n="next"===d.dir,i=d.slideNr,r=d.load,l=d.active,o=d.callback||Xe,d=Ge.getDate(e,a,1),e=Ge.getYear(d),a=Ge.getMonth(d);if(_e=!0,t.changing=!0,t.trigger("onMonthChange",{year:e,month:a}),t.trigger("onMonthLoading",{year:e,month:a}),g(e,a),r)for(R=0;R<Fe;R++)Be[n?He-Fe+R:R].html(y(e,a-Pe+R));l&&ze.addClass("mbsc-cal-slide-a"),setTimeout(function(){t.ariaMessage(Ge.monthNames[a]+" "+e),T(e,a,200),K=n?K-X*i*nt:K+X*i*nt,ce.scroll(K,l?200:0,function(){var l;if(Be.length){if(ze.removeClass("mbsc-cal-slide-a").attr("aria-hidden","true"),n)for(l=Be.splice(0,i),R=0;R<i;R++)Be.push(l[R]),A(Be[Be.length-1],+Be[Be.length-2].attr("data-curr")+100*nt);else for(l=Be.splice(He-i,i),R=i-1;0<=R;R--)Be.unshift(l[R]),A(Be[0],+Be[1].attr("data-curr")-100*nt);for(R=0;R<i;R++)Be[n?He-i+R:R].html(y(e,a-Pe-lt+R+(n?He-i:0))),r&&Be[n?R:He-i+R].html(y(e,a-Pe-lt+R+(n?0:He-i)));for(R=0;R<Fe;R++)Be[lt+R].addClass("mbsc-cal-slide-a").removeAttr("aria-hidden");D(e,a,!0),_e=!1}Ue.length?setTimeout(function(){_()},10):(ye=e,Te=a,t.changing=!1,c(".mbsc-cal-day",J).attr("tabindex",-1),k(),Ye!==s?S(e,a,Ye):t.trigger("onMonthLoaded",{year:e,month:a}),o())})},10)}}function V(){var e=c(this),a=t.live,s=t.getDate(!0),n=e.attr("data-full"),i=n.split("-"),i=l(i[0],i[1],i[2]),s=l(i.getFullYear(),i.getMonth(),i.getDate(),s.getHours(),s.getMinutes(),s.getSeconds()),r=e.hasClass("mbsc-cal-day-sel");!Ee&&e.hasClass("mbsc-cal-day-diff")||!1===t.trigger("onDayChange",c.extend(Je[n],{date:s,target:this,selected:r}))||(t.needsSlide=!1,G=!0,t.setDate(s,a,.2,!a,!0),Ge.outerMonthChange&&(Le=!0,i<Ge.getDate(ye,Te-Pe,1)?L():i>Ge.getDate(ye,Te-Pe+Fe,0)&&I(),Le=!1))}function A(e,t){e.attr("data-curr",t),e[0].style[o+"Transform"]="translate3d("+(it?"0,"+t+"%,":t+"%,0,")+"0)"}function N(e){t.isVisible()&&Z&&(t.changing?Ye=e:S(ye,Te,e))}function I(){Le&&Ge.getDate(ye,Te+Fe-Pe,1)<=pe&&e.running&&_(ye,++Te,"next",1,!1,!0,I)}function L(){Le&&Ge.getDate(ye,Te-Pe-1,1)>=be&&e.running&&_(ye,--Te,"prev",1,!1,!0,L)}function F(t){Le&&Ge.getDate(ye,Te,1)<=Ge.getDate(Ge.getYear(pe)-1,Ge.getMonth(pe)-Oe,1)&&e.running?_(++ye,Te,"next",lt,!0,!0,function(){F(t)}):Le&&!t.hasClass("mbsc-fr-btn-d")&&e.running&&_(Ge.getYear(pe),Ge.getMonth(pe)-Oe,"next",lt,!0,!0)}function H(t){Le&&Ge.getDate(ye,Te,1)>=Ge.getDate(Ge.getYear(be)+1,Ge.getMonth(be)+Pe,1)&&e.running?_(--ye,Te,"prev",lt,!0,!0,function(){H(t)}):Le&&!t.hasClass("mbsc-fr-btn-d")&&e.running&&_(Ge.getYear(be),Ge.getMonth(be)+Pe,"prev",lt,!0,!0)}function O(e,a){e.hasClass("mbsc-cal-v")||(e.addClass("mbsc-cal-v"+(a?"":" mbsc-cal-p-in")).removeClass("mbsc-cal-p-out mbsc-cal-h"),t.trigger("onSelectShow"))}function P(e,t){e.hasClass("mbsc-cal-v")&&e.removeClass("mbsc-cal-v mbsc-cal-p-in").addClass("mbsc-cal-h"+(t?"":" mbsc-cal-p-out"))}function Y(e,t){(t||e).hasClass("mbsc-cal-v")?P(e):O(e)}function E(){c(this).removeClass("mbsc-cal-p-out mbsc-cal-p-in")}var W,R,j,$,z,B,U,q,J,X,K,G,Z,Q,ee,te,ae,se,ne,ce,ie,re,le,oe,de,me,ue,he,fe,be,pe,ve,ge,xe,ye,Te,we,Ce,Me,Se,De,ke,_e,Ve,Ae,Ne,Ie,Le,Fe,He,Oe,Pe,Ye,Ee,We,Re,je,$e=this,ze=[],Be=[],Ue=[],qe={},Je={},Xe=function(){},Ke=c.extend({},t.settings),Ge=c.extend(t.settings,u,Ke),Ze="full"==Ge.weekDays?"":"min"==Ge.weekDays?"Min":"Short",Qe=Ge.weekCounter,et=Ge.layout||(/top|bottom/.test(Ge.display)?"liquid":""),tt="liquid"==et&&"bubble"!==Ge.display,at="center"==Ge.display,st=Ge.rtl,nt=st?-1:1,ct=tt?null:Ge.calendarWidth,it="vertical"==Ge.calendarScroll,rt=Ge.quickNav,lt=Ge.preMonths,ot=Ge.yearChange,dt=Ge.controls.join(","),mt=(!0===Ge.tabs||!1!==Ge.tabs&&tt)&&1<Ge.controls.length,ut=!mt&&Ge.tabs===s&&!tt&&1<Ge.controls.length,ht=Ge.yearSuffix||"",ft=Ge.activeClass||"",bt="mbsc-cal-tab-sel "+(Ge.activeTabClass||""),pt=Ge.activeTabInnerClass||"",vt="mbsc-fr-btn-d "+(Ge.disabledClass||""),gt="",xt="";return dt.match(/calendar/)?Z=!0:rt=!1,dt.match(/date/)&&(qe.date=1),dt.match(/time/)&&(qe.time=1),Z&&qe.date&&(mt=!0,ut=!1),Ge.layout=et,Ge.preset=(qe.date||Z?"date":"")+(qe.time?"time":""),"inline"==Ge.display&&c(this).closest('[data-role="page"]').on("pageshow",function(){t.position()}),t.changing=!1,t.needsSlide=!0,t.getDayProps=Xe,t.onGenMonth=Xe,t.prepareObj=v,t.refresh=function(){N(!1)},t.redraw=function(){N(!0)},t.navigate=function(e,a){var s,n,c=t.isVisible();a&&c?M(e,!0):(s=Ge.getYear(e),n=Ge.getMonth(e),!c||s==ye&&n==Te||(t.trigger("onMonthChange",{year:s,month:n}),T(s,n),S(s,n),D(e.getFullYear(),e.getMonth(),!0)),ye=s,Te=n)},t.showMonthView=function(){rt&&!se&&(P(xt,!0),P(gt,!0),O(ae,!0),se=!0)},t.changeTab=function(e){t._isVisible&&qe[e]&&ke!=e&&(ke=e,c(".mbsc-cal-pnl",B).removeClass("mbsc-cal-p-in").addClass("mbsc-cal-pnl-h"),c(".mbsc-cal-tab",B).removeClass(bt).removeAttr("aria-selected").find(".mbsc-cal-tab-i").removeClass(pt),c('.mbsc-cal-tab[data-control="'+e+'"]',B).addClass(bt).attr("aria-selected","true").find(".mbsc-cal-tab-i").addClass(pt),qe[ke].removeClass("mbsc-cal-pnl-h").addClass("mbsc-cal-p-in"),"calendar"==ke&&(W=t.getDate(!0),(W.getFullYear()!==xe.getFullYear()||W.getMonth()!==xe.getMonth()||W.getDate()!==xe.getDate())&&M(W)),t.showMonthView(),t.trigger("onTabChange",{tab:ke}))},$=i.datetime.call(this,t),le=Ge.dateFormat.search(/m/i),de=Ge.dateFormat.search(/y/i),c.extend($,{ariaMessage:Ge.calendarText,onMarkupReady:function(a){var i,o="";if(B=c(a.target),U="inline"==Ge.display?c(this).is("div")?c(this):c(this).parent():t._window,xe=t.getDate(!0),ye||(ye=Ge.getYear(xe),Te=Ge.getMonth(xe)),K=0,ee=!0,_e=!1,ne=Ge.monthNames,ke="calendar",Ge.min?(be=l(Ge.min.getFullYear(),Ge.min.getMonth(),1),ve=Ge.min):ve=be=l(Ge.startYear,0,1),Ge.max?(pe=l(Ge.max.getFullYear(),Ge.max.getMonth(),1),ge=Ge.max):ge=pe=l(Ge.endYear,11,31,23,59,59),B.addClass("mbsc-calendar"),z=c(".mbsc-fr-popup",B),De=c(".mbsc-fr-c",B),qe.date?qe.date=c(".mbsc-sc-whl-gr-c",B).eq(0):Z&&c(".mbsc-sc-whl-gr-c",B).eq(0).addClass("mbsc-cal-hdn"),qe.time&&(qe.time=c(".mbsc-sc-whl-gr-c",B).eq(1)),Z){for(Fe="auto"==Ge.months?Math.max(1,Math.min(3,Math.floor((ct||U[0].innerWidth||U.innerWidth())/280))):Ge.months,He=Fe+2*lt,Oe=Math.floor(Fe/2),Pe=Math.round(Fe/2)-1,Ee=Ge.showOuterDays===s?Fe<2:Ge.showOuterDays,it=it&&Fe<2,a='<div class="mbsc-cal-btnw"><div class="'+(st?"mbsc-cal-next-m":"mbsc-cal-prev-m")+' mbsc-cal-prev mbsc-cal-btn mbsc-fr-btn mbsc-fr-btn-e"><div role="button" tabindex="0" class="mbsc-cal-btn-txt '+(Ge.btnCalPrevClass||"")+'" aria-label="'+Ge.prevMonthText+'"></div></div>',R=0;R<Fe;++R)a+='<div class="mbsc-cal-btnw-m" style="width: '+100/Fe+'%"><span role="button" class="mbsc-cal-month"></span></div>';for(a+='<div class="'+(st?"mbsc-cal-prev-m":"mbsc-cal-next-m")+' mbsc-cal-next mbsc-cal-btn mbsc-fr-btn mbsc-fr-btn-e"><div role="button" tabindex="0" class="mbsc-cal-btn-txt '+(Ge.btnCalNextClass||"")+'" aria-label="'+Ge.nextMonthText+'"></div></div></div>',ot&&(o='<div class="mbsc-cal-btnw"><div class="'+(st?"mbsc-cal-next-y":"mbsc-cal-prev-y")+' mbsc-cal-prev mbsc-cal-btn mbsc-fr-btn mbsc-fr-btn-e"><div role="button" tabindex="0" class="mbsc-cal-btn-txt '+(Ge.btnCalPrevClass||"")+'" aria-label="'+Ge.prevYearText+'"></div></div><span role="button" class="mbsc-cal-year"></span><div class="'+(st?"mbsc-cal-prev-y":"mbsc-cal-next-y")+' mbsc-cal-next mbsc-cal-btn mbsc-fr-btn mbsc-fr-btn-e"><div role="button" tabindex="0" class="mbsc-cal-btn-txt '+(Ge.btnCalNextClass||"")+'" aria-label="'+Ge.nextYearText+'"></div></div></div>'),rt&&(me=Ge.getYear(be),ue=Ge.getYear(pe),he=Ge.getMonth(be),fe=Ge.getMonth(pe),Ce=Math.ceil((ue-me+1)/12)+2,gt=x("month",36,24,0,"",Ge.monthNames,Ge.monthNamesShort),xt=x("year",12*Ce,ue-me+13,me,ht)),Q='<div class="mbsc-w-p mbsc-cal-c"><div class="mbsc-cal mbsc-cal-hl-now'+(Fe>1?" mbsc-cal-multi ":"")+(Qe?" mbsc-cal-weeks ":"")+(it?" mbsc-cal-vertical":"")+(Ee?"":" mbsc-cal-hide-diff ")+(Ge.calendarClass||"")+'"><div class="mbsc-cal-header"><div class="mbsc-cal-btnc '+(ot?"mbsc-cal-btnc-ym":"mbsc-cal-btnc-m")+'">'+(de<le||Fe>1?o+a:a+o)+'</div></div><div class="mbsc-cal-body"><div class="mbsc-cal-m-c mbsc-cal-v"><div class="mbsc-cal-days-c">',j=0;j<Fe;++j){for(Q+='<div aria-hidden="true" class="mbsc-cal-days" style="width: '+100/Fe+'%"><table cellpadding="0" cellspacing="0"><tr>',R=0;R<7;R++)Q+="<th>"+Ge["dayNames"+Ze][(R+Ge.firstDay)%7]+"</th>";Q+="</tr></table></div>"}for(Q+='</div><div class="mbsc-cal-anim-c '+(Ge.calendarClass||"")+'"><div class="mbsc-cal-week-nrs-c '+(Ge.weekNrClass||"")+'"><div class="mbsc-cal-week-nrs"></div></div><div class="mbsc-cal-anim">',R=0;R<Fe+2*lt;R++)Q+='<div class="mbsc-cal-slide" aria-hidden="true"></div>';Q+="</div></div></div>"+gt+xt+"</div></div></div>",qe.calendar=c(Q)}if(c.each(Ge.controls,function(e,t){qe[t]=c('<div class="mbsc-cal-pnl" id="'+($e.id+"_dw_pnl_"+e)+'"></div>').append(c('<div class="mbsc-cal-pnl-i"></div>').append(qe[t])).appendTo(De)}),i='<div class="mbsc-cal-tabs"><ul role="tablist">',c.each(Ge.controls,function(e,t){qe[t]&&(i+='<li role="tab" aria-controls="'+($e.id+"_dw_pnl_"+e)+'" class="mbsc-cal-tab '+(e?"":bt)+'" data-control="'+t+'"><a href="#" class="mbsc-fr-btn-e mbsc-fr-btn-nhl mbsc-cal-tab-i '+(e?"":pt)+'">'+Ge[t+"Text"]+"</a></li>")}),i+="</ul></div>",De.before(i),q=c(".mbsc-cal-anim-c",B),J=c(".mbsc-cal-anim",q),te=c(".mbsc-cal-week-nrs",q),Z){for(se=!0,ze=c(".mbsc-cal-slide",J).each(function(e,t){Be.push(c(t))}),ze.slice(lt,lt+Fe).addClass("mbsc-cal-slide-a").removeAttr("aria-hidden"),R=0;R<He;R++)A(Be[R],100*(R-lt)*nt);S(ye,Te),ce=new n.classes.ScrollView(q[0],{axis:it?"Y":"X",easing:"",contSize:0,snap:1,maxSnapScroll:lt,moveElement:J,mousewheel:Ge.mousewheel,time:200,lock:!0,stopProp:!1,onGestureStart:function(e,a){a.settings.scrollLock=t.scrollLock},onAnimationEnd:function(e){(e=Math.round(((it?e.posY:e.posX)-K)/X)*nt)&&_(ye,Te-e,e>0?"prev":"next",e>0?e:-e)}})}re=c(".mbsc-cal-month",B),oe=c(".mbsc-cal-year",B),ae=c(".mbsc-cal-m-c",B),rt&&(ae.on("webkitAnimationEnd animationend",E),gt=c(".mbsc-cal-month-c",B).on("webkitAnimationEnd animationend",E),xt=c(".mbsc-cal-year-c",B).on("webkitAnimationEnd animationend",E),c(".mbsc-cal-sc-p",B),we={axis:it?"Y":"X",contSize:0,snap:1,maxSnapScroll:1,rtl:Ge.rtl,mousewheel:Ge.mousewheel,time:200},We=new n.classes.ScrollView(xt[0],we),ie=new n.classes.ScrollView(gt[0],we)),tt?B.addClass("mbsc-cal-liq"):c(".mbsc-cal",B).width(ct||280*Fe),Ge.calendarHeight&&c(".mbsc-cal-anim-c",B).height(Ge.calendarHeight),t.tap(q,function(e){e=c(e.target),_e||ce.scrolled||Ge.readonly===!0||(e=e.closest(".mbsc-cal-day",this),e.hasClass("mbsc-cal-day-v")&&V.call(e[0]))}),c(".mbsc-cal-btn",B).on("touchstart mousedown keydown",h).on("touchmove",f).on("touchend touchcancel keyup",b),c(".mbsc-cal-tab",B).on("touchstart click",function(a){d(a,this)&&e.running&&t.changeTab(c(this).attr("data-control"))}),rt&&(t.tap(c(".mbsc-cal-month",B),function(){xt.hasClass("mbsc-cal-v")||(Y(ae),se=ae.hasClass("mbsc-cal-v")),Y(gt),P(xt)}),t.tap(c(".mbsc-cal-year",B),function(){xt.hasClass("mbsc-cal-v")||We.scroll(Re),gt.hasClass("mbsc-cal-v")||(Y(ae),se=ae.hasClass("mbsc-cal-v")),Y(xt),P(gt)}),t.tap(c(".mbsc-cal-month-s",B),function(){!ie.scrolled&&!c(this).hasClass("mbsc-fr-btn-d")&&t.navigate(Ge.getDate(ye,c(this).attr("data-val"),1))}),t.tap(c(".mbsc-cal-year-s",B),function(){We.scrolled||(W=Ge.getDate(c(this).attr("data-val"),Te,1),t.navigate(new Date(r.constrain(W,be,pe))))}),t.tap(xt,function(){We.scrolled||(P(xt),O(ae),se=!0)}),t.tap(gt,function(){ie.scrolled||(P(gt),O(ae),se=!0)}))},onShow:function(){Z&&T(ye,Te)},onPosition:function(e){var a,s,n,i=0,r=0,l=0,o=e.windowHeight;if(tt&&(at&&q.height(""),De.height(""),J.width("")),X&&(n=X),Z&&(X=Math.round(Math.round(q[0][it?"offsetHeight":"offsetWidth"])/Fe)),X&&(B.removeClass("mbsc-cal-m mbsc-cal-l"),X>1024?B.addClass("mbsc-cal-l"):X>640&&B.addClass("mbsc-cal-m")),(mt&&(ee||tt)||ut)&&(c(".mbsc-cal-pnl",B).removeClass("mbsc-cal-pnl-h"),c.each(qe,function(e,t){a=t[0].offsetWidth,i=Math.max(i,a),r=Math.max(r,t[0].offsetHeight),l+=a}),mt||ut&&l>(U[0].innerWidth||U.innerWidth())?(s=!0,ke=c(".mbsc-cal-tabs .mbsc-cal-tab-sel",B).attr("data-control"),z.addClass("mbsc-cal-tabbed")):(ke="calendar",r=i="",z.removeClass("mbsc-cal-tabbed"),De.css({width:"",height:""}))),tt&&at&&Z&&(t._isFullScreen=!0,s&&De.height(qe.calendar[0].offsetHeight),e=z[0].offsetHeight,o>=e&&q.height(o-e+q[0].offsetHeight),r=Math.max(r,qe.calendar[0].offsetHeight)),s&&(De.css({width:tt?"":i,height:r}),Z&&(X=Math.round(Math.round(q[0][it?"offsetHeight":"offsetWidth"])/Fe))),X){if(J[it?"height":"width"](X),X!==n){if(ot)for(ne=Ge.maxMonthWidth>c(".mbsc-cal-btnw-m",B).width()?Ge.monthNamesShort:Ge.monthNames,R=0;R<Fe;++R)c(re[R]).text(ne[Ge.getMonth(Ge.getDate(ye,Te-Pe+R,1))]);rt&&(e=xt[0][it?"offsetHeight":"offsetWidth"],c.extend(We.settings,{contSize:e,snap:e,minScroll:(2-Ce)*e,maxScroll:-e}),c.extend(ie.settings,{contSize:e,snap:e,minScroll:-e,maxScroll:-e}),We.refresh(),ie.refresh(),xt.hasClass("mbsc-cal-v")&&We.scroll(Re)),tt&&!ee&&n&&(e=K/n,K=e*X),D(ye,Te,!n)}}else X=n;s&&(c(".mbsc-cal-pnl",B).addClass("mbsc-cal-pnl-h"),qe[ke].removeClass("mbsc-cal-pnl-h")),t.trigger("onCalResize"),ee=!1},onHide:function(){Ue=[],Be=[],Te=ye=ke=null,_e=!0,X=0,ce&&ce.destroy(),rt&&We&&ie&&(We.destroy(),ie.destroy())},onValidated:function(e){var a,s,n;if(s=t.getDate(!0),G)a="calendar";else for(n in t.order)n&&t.order[n]===e&&(a=/[mdy]/.test(n)?"date":"time");t.trigger("onSetDate",{date:s,control:a}),M(s),G=!1}}),$}}(window,document),function(t){var a=e,s=a.$,n=a.classes,c=a.util,i=c.constrain,r=c.jsPrefix,l=c.prefix,o=c.getCoord,d=c.getPosition,m=c.testTouch,u=c.isNumeric,h=c.isString,f=/(iphone|ipod|ipad)/i.test(navigator.userAgent),b=window.requestAnimationFrame||function(e){e()},p=window.cancelAnimationFrame||function(){};n.ScrollView=function(a,c,v){function g(t){ne("onStart"),de.stopProp&&t.stopPropagation(),(de.prevDef||"mousedown"==t.type)&&t.preventDefault(),de.readonly||de.lock&&j||!m(t,this)||R||!e.running||(S&&S.removeClass("mbsc-btn-a"),P=!1,j||(S=s(t.target).closest(".mbsc-btn-e",this),S.length&&!S.hasClass("mbsc-btn-d")&&(P=!0,D=setTimeout(function(){S.addClass("mbsc-btn-a")},100))),R=!0,$=U=!1,re.scrolled=j,Q=o(t,"X"),ee=o(t,"Y"),F=Q,A=V=_=0,Z=new Date,G=+d(ae,ce)||0,M(G,f?0:1),"mousedown"===t.type&&s(document).on("mousemove",x).on("mouseup",T))}function x(e){R&&(de.stopProp&&e.stopPropagation(),F=o(e,"X"),H=o(e,"Y"),_=F-Q,V=H-ee,A=ce?V:_,P&&(5<Math.abs(V)||5<Math.abs(_))&&(clearTimeout(D),S.removeClass("mbsc-btn-a"),P=!1),(re.scrolled||!$&&5<Math.abs(A))&&(U||ne("onGestureStart",O),re.scrolled=U=!0,B||(B=!0,z=b(y))),ce||de.scrollLock?e.preventDefault():re.scrolled?e.preventDefault():7<Math.abs(V)&&($=!0,re.scrolled=!0,me.trigger("touchend")))}function y(){E&&(A=i(A,-X*E,X*E)),M(i(G+A,W-L,Y+L)),B=!1}function T(e){if(R){var t;t=new Date-Z,de.stopProp&&e.stopPropagation(),p(z),B=!1,!$&&re.scrolled&&(de.momentum&&300>t&&(t=A/t,A=Math.max(Math.abs(A),t*t/de.speedUnit)*(0>A?-1:1)),C(A)),P&&(clearTimeout(D),S.addClass("mbsc-btn-a"),setTimeout(function(){S.removeClass("mbsc-btn-a")},100),!$&&!re.scrolled&&ne("onBtnTap",{target:S[0]})),"mouseup"==e.type&&s(document).off("mousemove",x).off("mouseup",T),R=!1}}function w(t){t=t.originalEvent||t,A=ce?t.deltaY||t.wheelDelta||t.detail:t.deltaX,ne("onStart"),de.stopProp&&t.stopPropagation(),A&&e.running&&(t.preventDefault(),!de.readonly)&&(A=0>A?20:-20,G=ie,U||(O={posX:ce?0:ie,posY:ce?ie:0,originX:ce?0:G,originY:ce?G:0,direction:0<A?ce?270:360:ce?90:180},ne("onGestureStart",O)),B||(B=!0,z=b(y)),U=!0,clearTimeout(q),q=setTimeout(function(){
	p(z),U=B=!1,C(A)},200))}function C(e){var t;if(E&&(e=i(e,-X*E,X*E)),le=Math.round((G+e)/X),t=i(le*X,W,Y),K){if(0>e){for(e=K.length-1;0<=e;e--)if(Math.abs(t)+k>=K[e].breakpoint){le=e,oe=2,t=K[e].snap2;break}}else if(0<=e)for(e=0;e<K.length;e++)if(Math.abs(t)<=K[e].breakpoint){le=e,oe=1,t=K[e].snap1;break}t=i(t,W,Y)}e=de.time||(ie<W||ie>Y?200:Math.max(200,Math.abs(t-ie)*de.timeUnit)),O.destinationX=ce?0:t,O.destinationY=ce?t:0,O.duration=e,O.transitionTiming=I,ne("onGestureEnd",O),M(t,e)}function M(e,t,a){var s=e!=ie,n=1<t,c=function(){clearInterval(J),j=!1,ie=e,O.posX=ce?0:e,O.posY=ce?e:0,s&&ne("onMove",O),n&&ne("onAnimationEnd",O),a&&a()};O={posX:ce?0:ie,posY:ce?ie:0,originX:ce?0:G,originY:ce?G:0,direction:0<e-ie?ce?270:360:ce?90:180},ie=e,n&&(O.destinationX=ce?0:e,O.destinationY=ce?e:0,O.duration=t,O.transitionTiming=I,ne("onAnimationStart",O)),te[r+"Transition"]=t?l+"transform "+Math.round(t)+"ms "+I:"",te[r+"Transform"]="translate3d("+(ce?"0,"+e+"px,":e+"px,0,")+"0)",!s&&!j||!t||1>=t?c():t&&(j=!0,clearInterval(J),J=setInterval(function(){var e=+d(ae,ce)||0;O.posX=ce?0:e,O.posY=ce?e:0,ne("onMove",O)},100),clearTimeout(se),se=setTimeout(function(){c(),te[r+"Transition"]=""},t))}var S,D,k,_,V,A,N,I,L,F,H,O,P,Y,E,W,R,j,$,z,B,U,q,J,X,K,G,Z,Q,ee,te,ae,se,ne,ce,ie,re=this,le=0,oe=1,de=c,me=s(a);n.Base.call(this,a,c,!0),re.scrolled=!1,re.scroll=function(e,t,n){e=u(e)?Math.round(e/X)*X:Math.ceil((s(e,a).length?Math.round(ae.offset()[N]-s(e,a).offset()[N]):ie)/X)*X,le=Math.round(e/X),G=ie,M(i(e,W,Y),t,n)},re.refresh=function(e){var a;k=de.contSize===t?ce?me.height():me.width():de.contSize,W=de.minScroll===t?ce?k-ae.height():k-ae.width():de.minScroll,Y=de.maxScroll===t?0:de.maxScroll,!ce&&de.rtl&&(a=Y,Y=-W,W=-a),h(de.snap)&&(K=[],ae.find(de.snap).each(function(){var e=ce?this.offsetTop:this.offsetLeft,t=ce?this.offsetHeight:this.offsetWidth;K.push({breakpoint:e+t/2,snap1:-e,snap2:k-e-t})})),X=u(de.snap)?de.snap:1,E=de.snap?de.maxSnapScroll:0,I=de.easing,L=de.elastic?u(de.snap)?X:u(de.elastic)?de.elastic:0:0,ie===t&&(ie=de.initialPos,le=Math.round(ie/X)),e||re.scroll(de.snap?K?K[le]["snap"+oe]:le*X:ie)},re.init=function(e){re._init(e),N=(ce="Y"==de.axis)?"top":"left",ae=de.moveElement||me.children().eq(0),te=ae[0].style,re.refresh(),me.on("touchstart mousedown",g).on("touchmove",x).on("touchend touchcancel",T),de.mousewheel&&me.on("wheel mousewheel",w),a.addEventListener&&a.addEventListener("click",function(e){re.scrolled&&(re.scrolled=!1,e.stopPropagation(),e.preventDefault())},!0)},re.destroy=function(){clearInterval(J),me.off("touchstart mousedown",g).off("touchmove",x).off("touchend touchcancel",T).off("wheel mousewheel",w),re._destroy()},de=re.settings,ne=re.trigger,v||re.init(c)},n.ScrollView.prototype={_class:"scrollview",_defaults:{speedUnit:.0022,timeUnit:.8,initialPos:0,axis:"Y",easing:"ease-out",stopProp:!0,momentum:!0,mousewheel:!0,elastic:!0}},a.presetShort("scrollview","ScrollView",!1)}(),function(t){var a=e,s=a.$,n=a.util.datetime,c=n.adjustedDate,i=new Date,r={startYear:i.getFullYear()-100,endYear:i.getFullYear()+1,separator:" ",dateFormat:"mm/dd/yy",dateDisplay:"MMddyy",timeFormat:"hh:ii A",dayText:"Day",monthText:"Month",yearText:"Year",hourText:"Hours",minuteText:"Minutes",ampmText:"&nbsp;",secText:"Seconds",nowText:"Now"},l=function(e){function i(e,a,s){return H[a]===t||(e=+e[H[a]],isNaN(e))?O[a]!==t?O[a]:s!==t?s:P[a](q):e}function l(e){return{value:e,display:(R.match(/yy/i)?e:(e+"").substr(2,2))+(N.yearSuffix||"")}}function o(e){return e}function d(e,t,a,s,n,c,i){t.push({data:s,label:a,min:c,max:i,getIndex:n,cssClass:e})}function m(e,t,a,s){return Math.min(s,Math.floor(e/t)*t+a)}function u(e){if(null===e)return e;var t=i(e,"y"),a=i(e,"m"),s=Math.min(i(e,"d"),N.getMaxDayOfMonth(t,a)),n=i(e,"h",0);return N.getDate(t,a,s,i(e,"a",0)?n+12:n,i(e,"i",0),i(e,"s",0),i(e,"u",0))}function h(e,t){var a,s,n=!1,c=!1,i=0,r=0;if(G=u(g(G)),Z=u(g(Z)),f(e))return e;if(e<G&&(e=G),e>Z&&(e=Z),s=a=e,2!==t)for(n=f(a);!n&&a<Z;)a=new Date(a.getTime()+864e5),n=f(a),i++;if(1!==t)for(c=f(s);!c&&s>G;)s=new Date(s.getTime()-864e5),c=f(s),r++;return 1===t&&n?a:2===t&&c?s:r<=i&&c?s:a}function f(e){return!(e<G||e>Z)&&(!!b(e,E)||!b(e,Y))}function b(e,t){var a,s,n;if(t)for(s=0;s<t.length;s++)if(a=t[s],n=a+"",!a.start)if(a.getTime){if(e.getFullYear()==a.getFullYear()&&e.getMonth()==a.getMonth()&&e.getDate()==a.getDate())return!0}else if(n.match(/w/i)){if(n=+n.replace("w",""),n==e.getDay())return!0}else if(n=n.split("/"),n[1]){if(n[0]-1==e.getMonth()&&n[1]==e.getDate())return!0}else if(n[0]==e.getDate())return!0;return!1}function p(e,t,a,s,n,c,i){var r,l,o;if(e)for(r=0;r<e.length;r++)if(l=e[r],o=l+"",!l.start)if(l.getTime)N.getYear(l)==t&&N.getMonth(l)==a&&(c[N.getDay(l)]=i);else if(o.match(/w/i))for(o=+o.replace("w",""),S=o-s;S<n;S+=7)0<=S&&(c[S+1]=i);else o=o.split("/"),o[1]?o[0]-1==a&&(c[o[1]]=i):c[o[0]]=i}function v(e,a,n,c,i,r,l,o,d){var u,h,f,b,p,v,g,x,y,T,w,C,M,S,D,k,A,I,F={},H={h:J,i:X,s:K,a:1},O=N.getDate(i,r,l),P=["a","h","i","s"];e&&(s.each(e,function(e,t){t.start&&(t.apply=!1,u=t.d,h=u+"",f=h.split("/"),u&&(u.getTime&&i==N.getYear(u)&&r==N.getMonth(u)&&l==N.getDay(u)||!h.match(/w/i)&&(f[1]&&l==f[1]&&r==f[0]-1||!f[1]&&l==f[0])||h.match(/w/i)&&O.getDay()==+h.replace("w","")))&&(t.apply=!0,F[O]=!0)}),s.each(e,function(e,s){if(S=M=0,w=_[n],C=V[n],g=v=!0,D=!1,s.start&&(s.apply||!s.d&&!F[O])){for(b=s.start.split(":"),p=s.end.split(":"),T=0;3>T;T++)b[T]===t&&(b[T]=0),p[T]===t&&(p[T]=59),b[T]=+b[T],p[T]=+p[T];for(b.unshift(11<b[0]?1:0),p.unshift(11<p[0]?1:0),B&&(12<=b[1]&&(b[1]-=12),12<=p[1]&&(p[1]-=12)),T=0;T<a;T++)L[T]!==t&&(x=m(b[T],H[P[T]],_[P[T]],V[P[T]]),y=m(p[T],H[P[T]],_[P[T]],V[P[T]]),I=A=k=0,B&&1==T&&(k=b[0]?12:0,A=p[0]?12:0,I=L[0]?12:0),v||(x=0),g||(y=V[P[T]]),(v||g)&&x+k<L[T]+I&&L[T]+I<y+A&&(D=!0),L[T]!=x&&(v=!1),L[T]!=y&&(g=!1));if(!d)for(T=a+1;4>T;T++)0<b[T]&&(M=H[n]),p[T]<V[P[T]]&&(S=H[n]);if(D||(x=m(b[a],H[n],_[n],V[n])+M,y=m(p[a],H[n],_[n],V[n])-S,v&&(w=x),g&&(C=y+1)),v||g||D)for(T=w;T<C;T++)o[T]=!d}}))}function g(e,a){var n=[];return null===e||e===t?e:(s.each("y,m,d,a,h,i,s,u".split(","),function(s,c){H[c]!==t&&(n[H[c]]=P[c](e)),a&&(O[c]=P[c](e))}),n)}function x(e){var t,a,s,n=[];if(e){for(t=0;t<e.length;t++)if(a=e[t],a.start&&a.start.getTime)for(s=new Date(a.start);s<=a.end;)n.push(c(s.getFullYear(),s.getMonth(),s.getDate())),s.setDate(s.getDate()+1);else n.push(a);return n}return e}var y,T=s(this),w={};if(T.is("input")){switch(T.attr("type")){case"date":y="yy-mm-dd";break;case"datetime":y="yy-mm-ddTHH:ii:ssZ";break;case"datetime-local":y="yy-mm-ddTHH:ii:ss";break;case"month":y="yy-mm",w.dateOrder="mmyy";break;case"time":y="HH:ii:ss"}var C=T.attr("min"),T=T.attr("max");C&&(w.minDate=n.parseDate(y,C)),T&&(w.maxDate=n.parseDate(y,T))}var M,S,D,k,_,V,A,C=s.extend({},e.settings),N=s.extend(e.settings,a.util.datetime.defaults,r,w,C),I=0,L=[],w=[],F=[],H={},O={},P={y:function(e){return N.getYear(e)},m:function(e){return N.getMonth(e)},d:function(e){return N.getDay(e)},h:function(e){return e=e.getHours(),e=B&&12<=e?e-12:e,m(e,J,Q,ae)},i:function(e){return m(e.getMinutes(),X,ee,se)},s:function(e){return m(e.getSeconds(),K,te,ne)},u:function(e){return e.getMilliseconds()},a:function(e){return z&&11<e.getHours()?1:0}},Y=N.invalid,E=N.valid,C=N.preset,W=N.dateWheels||N.dateFormat,R=N.dateWheels||N.dateDisplay,j=N.timeWheels||N.timeFormat,$=R.match(/D/),z=j.match(/a/i),B=j.match(/h/),U="datetime"==C?N.dateFormat+N.separator+N.timeFormat:"time"==C?N.timeFormat:N.dateFormat,q=new Date,T=N.steps||{},J=T.hour||N.stepHour||1,X=T.minute||N.stepMinute||1,K=T.second||N.stepSecond||1,T=T.zeroBased,G=N.min||c(N.startYear,0,1),Z=N.max||c(N.endYear,11,31,23,59,59),Q=T?0:G.getHours()%J,ee=T?0:G.getMinutes()%X,te=T?0:G.getSeconds()%K,ae=Math.floor(((B?11:23)-Q)/J)*J+Q,se=Math.floor((59-ee)/X)*X+ee,ne=Math.floor((59-ee)/X)*X+ee;if(y=y||U,C.match(/date/i)){for(s.each(["y","m","d"],function(e,t){M=W.search(RegExp(t,"i")),-1<M&&F.push({o:M,v:t})}),F.sort(function(e,t){return e.o>t.o?1:-1}),s.each(F,function(e,t){H[t.v]=e}),T=[],S=0;3>S;S++)if(S==H.y)I++,d("mbsc-dt-whl-y",T,N.yearText,l,o,N.getYear(G),N.getYear(Z));else if(S==H.m){for(I++,D=[],M=0;12>M;M++)A=R.replace(/[dy]/gi,"").replace(/mm/,(9>M?"0"+(M+1):M+1)+(N.monthSuffix||"")).replace(/m/,M+1+(N.monthSuffix||"")),D.push({value:M,display:A.match(/MM/)?A.replace(/MM/,'<span class="mbsc-dt-month">'+N.monthNames[M]+"</span>"):A.replace(/M/,'<span class="mbsc-dt-month">'+N.monthNamesShort[M]+"</span>")});d("mbsc-dt-whl-m",T,N.monthText,D)}else if(S==H.d){for(I++,D=[],M=1;32>M;M++)D.push({value:M,display:(R.match(/dd/i)&&10>M?"0"+M:M)+(N.daySuffix||"")});d("mbsc-dt-whl-d",T,N.dayText,D)}w.push(T)}if(C.match(/time/i)){for(k=!0,F=[],s.each(["h","i","s","a"],function(e,t){e=j.search(RegExp(t,"i")),-1<e&&F.push({o:e,v:t})}),F.sort(function(e,t){return e.o>t.o?1:-1}),s.each(F,function(e,t){H[t.v]=I+e}),T=[],S=I;S<I+4;S++)if(S==H.h){for(I++,D=[],M=Q;M<(B?12:24);M+=J)D.push({value:M,display:B&&0===M?12:j.match(/hh/i)&&10>M?"0"+M:M});d("mbsc-dt-whl-h",T,N.hourText,D)}else if(S==H.i){for(I++,D=[],M=ee;60>M;M+=X)D.push({value:M,display:j.match(/ii/)&&10>M?"0"+M:M});d("mbsc-dt-whl-i",T,N.minuteText,D)}else if(S==H.s){for(I++,D=[],M=te;60>M;M+=K)D.push({value:M,display:j.match(/ss/)&&10>M?"0"+M:M});d("mbsc-dt-whl-s",T,N.secText,D)}else S==H.a&&(I++,C=j.match(/A/),d("mbsc-dt-whl-a",T,N.ampmText,C?[{value:0,display:N.amText.toUpperCase()},{value:1,display:N.pmText.toUpperCase()}]:[{value:0,display:N.amText},{value:1,display:N.pmText}]));w.push(T)}return e.getVal=function(t){return e._hasValue||t?u(e.getArrayVal(t)):null},e.setDate=function(t,a,s,n,c){e.setArrayVal(g(t),a,c,n,s)},e.getDate=e.getVal,e.format=U,e.order=H,e.handlers.now=function(){e.setDate(new Date,e.live,200,!0,!0)},e.buttons.now={text:N.nowText,handler:"now"},Y=x(Y),E=x(E),_={y:G.getFullYear(),m:0,d:1,h:Q,i:ee,s:te,a:0},V={y:Z.getFullYear(),m:11,d:31,h:ae,i:se,s:ne,a:1},{compClass:"mbsc-dt",wheels:w,headerText:!!N.headerText&&function(){return n.formatDate(U,u(e.getArrayVal(!0)),N)},formatValue:function(e){return n.formatDate(y,u(e),N)},parseValue:function(e){return e||(O={}),g(e?n.parseDate(y,e,N):N.defaultValue&&N.defaultValue.getTime?N.defaultValue:new Date,!!e&&!!e.getTime)},validate:function(a){var n,c,r,l;n=a.index;var o=a.direction,d=e.settings.wheels[0][H.d],a=h(u(a.values),o),m=g(a),f=[],a={},b=i(m,"y"),x=i(m,"m"),y=N.getMaxDayOfMonth(b,x),T=!0,w=!0;if(s.each("y,m,d,a,h,i,s".split(","),function(e,a){if(H[a]!==t){var n=_[a],r=V[a],l=i(m,a);if(f[H[a]]=[],T&&G&&(n=P[a](G)),w&&Z&&(r=P[a](Z)),"y"!=a)for(c=_[a];c<=V[a];c++)(c<n||c>r)&&f[H[a]].push(c);l<n&&(l=n),l>r&&(l=r),T&&(T=l==n),w&&(w=l==r),"d"==a&&(n=N.getDate(b,x,1).getDay(),r={},p(Y,b,x,n,y,r,1),p(E,b,x,n,y,r,0),s.each(r,function(e,t){t&&f[H[a]].push(e)}))}}),k&&s.each(["a","h","i","s"],function(a,n){var c=i(m,n),r=i(m,"d"),l={};H[n]!==t&&(f[H[n]]=[],v(Y,a,n,m,b,x,r,l,0),v(E,a,n,m,b,x,r,l,1),s.each(l,function(e,t){t&&f[H[n]].push(e)}),L[a]=e.getValidValue(H[n],c,o,l))}),d&&(d._length!==y||$&&(n===t||n===H.y||n===H.m))){for(a[H.d]=d,d.data=[],n=1;n<=y;n++)l=N.getDate(b,x,n).getDay(),r=R.replace(/[my]/gi,"").replace(/dd/,(10>n?"0"+n:n)+(N.daySuffix||"")).replace(/d/,n+(N.daySuffix||"")),d.data.push({value:n,display:r.match(/DD/)?r.replace(/DD/,'<span class="mbsc-dt-day">'+N.dayNames[l]+"</span>"):r.replace(/D/,'<span class="mbsc-dt-day">'+N.dayNamesShort[l]+"</span>")});e._tempWheelArray[H.d]=m[H.d],e.changeWheel(a)}return{disabled:f,valid:m}}}};s.each(["date","time","datetime"],function(e,t){a.presets.scroller[t]=l})}(),function(t){var a=e,s=a.$,n={invalid:[],showInput:!0,inputClass:""};a.presets.scroller.list=function(e){function a(e,a,s){var n,r,l=0,o=[[]],d=C;if(a)for(n=0;n<a;n++)p?o[0][n]={}:o[n]=[{}];for(;l<e.length;){for(p?o[0][l]=i(d,M[l]):o[l]=[i(d,M[l])],n=0,a=t;n<d.length&&a===t;)d[n].key==e[l]&&(s!==t&&l<=s||s===t)&&(a=n),n++;if(a!==t&&d[a].children)l++,d=d[a].children;else{if(!(r=c(d))||!r.children)break;l++,d=r.children}}return o}function c(e,t){if(!e)return!1;for(var a,s=0;s<e.length;)if(!(a=e[s++]).invalid)return t?s-1:a;return!1}function i(e,t){for(var a={data:[],label:t},s=0;s<e.length;)a.data.push({value:e[s].key,display:e[s].value}),s++;return a}function r(t){e._isVisible&&s(".mbsc-sc-whl-w",e._markup).css("display","").slice(t).hide()}function l(e,a){var s,n,i=[],r=C,l=0,o=!1;if(e[l]!==t&&l<=a)for(o=0,s=e[l],n=t;o<r.length&&n===t;)r[o].key==e[l]&&!r[o].invalid&&(n=o),o++;else n=c(r,!0),s=r[n].key;for(o=n!==t&&r[n].children,i[l]=s;o;){if(r=r[n].children,l++,e[l]!==t&&l<=a)for(o=0,s=e[l],n=t;o<r.length&&n===t;)r[o].key==e[l]&&!r[o].invalid&&(n=o),o++;else n=c(r,!0),n=!1===n?t:n,s=r[n].key;o=!(n===t||!c(r[n].children))&&r[n].children,i[l]=s}return{lvl:l+1,nVector:i}}function o(a){var n=[];return y=y>T++?y:T,a.children("li").each(function(a){var c=s(this),i=c.clone();i.children("ul,ol").remove();var i=e._processMarkup?e._processMarkup(i):i.html().replace(/^\s\s*/,"").replace(/\s\s*$/,""),r=!!c.attr("data-invalid"),a={key:c.attr("data-val")===t||null===c.attr("data-val")?a:c.attr("data-val"),value:i,invalid:r,children:null},c=c.children("ul,ol");c.length&&(a.children=o(c)),n.push(a)}),T--,n}function d(t,s,n){for(var c=(s||0)+1,i=[],l={},o={},l=a(t,null,s),s=0;s<t.length;s++)e._tempWheelArray[s]=t[s]=n.nVector[s]||0;for(;c<n.lvl;)o[c]=p?l[0][c]:l[c][0],i.push(c++);r(n.lvl),w=t.slice(0),i.length&&(u=!0,e.changeWheel(o))}var m,u,h,f=s.extend({},e.settings),b=s.extend(e.settings,n,f),f=b.layout||(/top|bottom/.test(b.display)?"liquid":""),p="liquid"==f,v=b.readonly,g=s(this),x=this.id+"_dummy",y=0,T=0,w=[],C=b.wheelArray||o(g),M=function(e){var t,a=[];for(t=0;t<e;t++)a[t]=b.labels&&b.labels[t]?b.labels[t]:t;return a}(y),S=function(e){var t,a=[];t=!0;for(var s=0;t;)t=c(e),a[s++]=t.key,(t=t.children)&&(e=t);return a}(C),D=a(S,y);return s("#"+x).remove(),b.showInput&&(m=s('<input type="text" id="'+x+'" value="" class="'+b.inputClass+'" placeholder="'+(b.placeholder||"")+'" readonly />').insertBefore(g),b.anchor=m,e.attachShow(m)),b.wheelArray||g.hide(),{wheels:D,layout:f,headerText:!1,setOnTap:1==y,formatValue:function(e){return h===t&&(h=l(e,e.length).lvl),e.slice(0,h).join(" ")},parseValue:function(e){return e?(e+"").split(" "):(b.defaultValue||S).slice(0)},onBeforeShow:function(){var t=e.getArrayVal(!0);w=t.slice(0),b.wheels=a(t,y,y),u=!0},onWheelGestureStart:function(e){for(var t=y,e=e.index,a=[];t;)a[--t]=!0;a[e]=!1,b.readonly=a},onWheelAnimationEnd:function(t){var t=t.index,a=e.getArrayVal(!0),s=l(a,t);h=s.lvl,b.readonly=v,a[t]!=w[t]&&d(a,t,s)},onFill:function(e){h=t,m&&m.val(e.valueText)},validate:function(e){var a=e.values,e=e.index,s=l(a,a.length);h=s.lvl,e===t&&(r(s.lvl),u||d(a,e,s)),u=!1;for(var e=h,s=C,n=0,c=[];n<e;){for(var i=c,o=n,m=0,f=void 0,b=s,p=[];m<n;){var v=a[m];for(f in b)if(b[f].key==v){b=b[f].children;break}m++}for(m=0;m<b.length;)b[m].invalid&&p.push(b[m].key),m++;i[o]=p,n++}return{disabled:c}},onDestroy:function(){m&&m.remove(),g.show()}}}}(),function(t){var a=e,s=a.$,n={batch:50,min:0,max:100,defaultUnit:"",units:null,unitNames:null,invalid:[],sign:!1,step:.05,scale:2,convert:function(e){return e},signText:"&nbsp;",wholeText:"Whole",fractionText:"Fraction",unitText:"Unit"};a.presets.scroller.measurement=function(e){function a(e){return Math.max(w,Math.min(C,Y?0>e?Math.ceil(e):Math.floor(e):l(Math.round(e-$),j)+$))}function c(e){return Y?l((Math.abs(e)-Math.abs(a(e)))*R-z,j)+z:0}function i(e){var t=a(e),s=c(e);return s>=R&&(0>e?t--:t++,s=0),[0>e?"-":"+",t,s]}function r(e){var t=+e[g];return(F&&"-"==e[0]?-1:1)*(t+(Y?e[v]/R*(0>t?-1:1):0))}function l(e,t){return Math.round(e/t)*t}function o(e,t){for(e+="";e.length<t;)e="0"+e;return e}function d(e,t,a){return t!==a&&V.convert?V.convert.call(this,e,t,a):e}function m(e,t,a){return e=e>a?a:e,e<t?t:e}function u(e){var t;y=d(V.min,O,e),T=d(V.max,O,e),Y?(w=0>y?Math.ceil(y):Math.floor(y),C=0>T?Math.ceil(T):Math.floor(T),M=c(y),S=c(T)):(w=Math.round(y),C=Math.round(T),C=w+Math.floor((C-w)/j)*j,$=w%j),e=w,t=C,F&&(t=Math.abs(e)>Math.abs(t)?Math.abs(e):Math.abs(t),e=0>e?0:e),I.min=0>e?Math.ceil(e/E):Math.floor(e/E),I.max=0>t?Math.ceil(t/E):Math.floor(t/E)}function h(e){return r(e).toFixed(Y?W:0)+(H?" "+P[e[x]]:"")}var f,b,p,v,g,x,y,T,w,C,M,S,D,k,_=s.extend({},e.settings),V=s.extend(e.settings,n,_),A={},_=[[]],N={},I={},A={},L=[],F=V.sign,H=V.units&&V.units.length,O=H?V.defaultUnit||V.units[0]:"",P=[],Y=1>V.step,E=1<V.step?V.step:1,W=Y?Math.max(V.scale,(V.step+"").split(".")[1].length):1,R=Math.pow(10,W),j=Math.round(Y?V.step*R:V.step),$=0,z=0,B=0;if(e.setVal=function(t,a,n,c,i){e._setVal(s.isArray(t)?h(t):t,a,n,c,i)},V.units)for(k=0;k<V.units.length;++k)D=V.units[k],P.push(V.unitNames?V.unitNames[D]||D:D);if(F)if(F=!1,H)for(k=0;k<V.units.length;k++)0>d(V.min,O,V.units[k])&&(F=!0);else F=0>V.min;if(F&&(_[0].push({data:["-","+"],label:V.signText}),B++),I={label:V.wholeText,data:function(e){return w%E+e*E},getIndex:function(e){return Math.round((e-w%E)/E)}},_[0].push(I),g=B++,u(O),Y){for(_[0].push(A),A.data=[],A.label=V.fractionText,k=z;k<R;k+=j)L.push(k),A.data.push({value:k,display:"."+o(k,W)});v=B++,f=Math.ceil(100/j),V.invalid&&V.invalid.length&&(s.each(V.invalid,function(e,t){var a=t>0?Math.floor(t):Math.ceil(t);0===a&&(a=t<=0?-.001:.001),N[a]=(N[a]||0)+1,0===t&&(a=.001,N[a]=(N[a]||0)+1)}),s.each(N,function(e,t){t<f?delete N[e]:N[e]=e}))}if(H){for(A={data:[],label:V.unitText,circular:!1},k=0;k<V.units.length;k++)A.data.push({value:k,display:P[k]});_[0].push(A)}return x=B,{wheels:_,minWidth:F&&Y?70:80,showLabel:!1,formatValue:h,parseValue:function(e){var t=((("number"==typeof e?e+"":e)||V.defaultValue)+"").split(" "),e=+t[0],a=[],n="";return H&&(n=s.inArray(t[1],P),n=n==-1?s.inArray(O,V.units):n,n=n==-1?0:n),p=H?V.units[n]:"",u(p),e=isNaN(e)?0:e,e=m(e,y,T),t=i(e),t[1]=m(t[1],w,C),b=e,F&&(a[0]=t[0],t[1]=Math.abs(t[1])),a[g]=t[1],Y&&(a[v]=t[2]),H&&(a[x]=n),a},onCancel:function(){b=t},validate:function(a){var n,c,o,h,f=a.values;o=a.index;var a=a.direction,D={},k=[],_={},A=H?V.units[f[x]]:"";if(F&&0===o&&(b=Math.abs(b)*("-"==f[0]?-1:1)),(o===g||o===v&&Y||b===t||o===t)&&(b=r(f),p=A),(H&&o===x&&p!==A||o===t)&&(u(A),b=d(b,p,A),p=A,c=i(b),o!==t&&(_[g]=I,e.changeWheel(_)),F&&(f[0]=c[0])),k[g]=[],F)for(k[0]=[],y>0&&(k[0].push("-"),f[0]="+"),T<0&&(k[0].push("+"),f[0]="-"),o=Math.abs("-"==f[0]?w:C),B=o+E;B<o+20*E;B+=E)k[g].push(B),D[B]=!0;return b=m(b,y,T),c=i(b),o=F?Math.abs(c[1]):c[1],n=F?"-"==f[0]:b<0,f[g]=o,n&&(c[0]="-"),Y&&(f[v]=c[2]),s.each(Y?N:V.invalid,function(e,t){if(F&&n){if(!(t<=0))return;t=Math.abs(t)}t=l(d(t,O,A),Y?1:j),D[t]=!0,k[g].push(t)}),f[g]=e.getValidValue(g,o,a,D),c[1]=f[g]*(F&&n?-1:1),Y&&(k[v]=[],a=F?f[0]+f[1]:(b<0?"-":"+")+Math.abs(c[1]),o=(y<0?"-":"+")+Math.abs(w),_=(T<0?"-":"+")+Math.abs(C),a===o&&s(L).each(function(e,t){(n?t>M:t<M)&&k[v].push(t)}),a===_&&s(L).each(function(e,t){(n?t<S:t>S)&&k[v].push(t)}),s.each(V.invalid,function(e,t){h=i(d(t,O,A)),(c[0]===h[0]||0===c[1]&&0===h[1]&&0===h[2])&&c[1]===h[1]&&k[v].push(h[2])})),{disabled:k,valid:f}}}},a.presetShort("measurement")}(),function(t){var a=e,s=a.$,n=a.presets.scroller,c=a.util.datetime,i=a.util.testTouch,r={autoCorrect:!0,showSelector:!0,minRange:1,rangeTap:!0,fromText:"Start",toText:"End"};a.presetShort("range"),n.range=function(e){function a(e,t){e&&(e.setFullYear(t.getFullYear()),e.setMonth(t.getMonth()),e.setDate(t.getDate()))}function l(e,t){var a=!0;if(e&&x&&y&&(y-x>V.maxRange-1&&(k?x=new Date(y-V.maxRange+1):y=new Date(+x+V.maxRange-1)),y-x<V.minRange-1&&(k?x=new Date(y-V.minRange+1):y=new Date(+x+V.minRange-1))),x&&y||(a=!1),t){var n,i,r,l,o,d=0,u=N||!k?" mbsc-cal-day-hl mbsc-cal-sel-start":" mbsc-cal-sel-start",f=N||k?" mbsc-cal-day-hl mbsc-cal-sel-end":" mbsc-cal-sel-end";if(v=x?c.formatDate(h,x,V):"",g=y?c.formatDate(h,y,V):"",m&&(s(".mbsc-range-btn-v-start",m).html(v||"&nbsp;"),s(".mbsc-range-btn-v-end",m).html(g||"&nbsp;"),n=x?new Date(x):null,r=y?new Date(y):null,!n&&r&&(n=new Date(r)),!r&&n&&(r=new Date(n)),o=k?r:n,s(".mbsc-cal-table .mbsc-cal-day-sel .mbsc-cal-day-i",m).removeClass(I),s(".mbsc-cal-table .mbsc-cal-day-hl",m).removeClass(F),s(".mbsc-cal-table .mbsc-cal-day-sel",m).removeClass("mbsc-cal-day-sel mbsc-cal-sel-start mbsc-cal-sel-end").removeAttr("aria-selected"),n&&r))for(i=n.setHours(0,0,0,0),l=r.setHours(0,0,0,0);r>=n&&84>d;)s('.mbsc-cal-day[data-full="'+o.getFullYear()+"-"+o.getMonth()+"-"+o.getDate()+'"]',m).addClass("mbsc-cal-day-sel"+(o.getTime()===i?u:"")+(o.getTime()===l?f:"")).attr("aria-selected","true").find(".mbsc-cal-day-i ").addClass(I),o.setDate(o.getDate()+(k?-1:1)),d++}return a}function o(){M&&m&&(s(".mbsc-range-btn-c",m).removeClass("mbsc-range-btn-sel").removeAttr("aria-checked").find(".mbsc-range-btn",m).removeClass(I),s(".mbsc-range-btn-c",m).eq(k).addClass("mbsc-range-btn-sel").attr("aria-checked","true").find(".mbsc-range-btn").addClass(I))}var d,m,u,h,f,b,p,v,g,x,y,T,w,C,M,S=e._startDate,D=e._endDate,k=0;f=new Date;var _=s.extend({},e.settings),V=s.extend(e.settings,r,_),A=V.anchor,N=V.rangeTap,I=V.activeClass||"",L="mbsc-fr-btn-d "+(V.disabledClass||""),F="mbsc-cal-day-hl",H=null===V.defaultValue?[]:V.defaultValue||[new Date(f.setHours(0,0,0,0)),new Date(f.getFullYear(),f.getMonth(),f.getDate()+6,23,59,59,999)];return N&&(V.tabs=!0),f=n.calbase.call(this,e),d=s.extend({},f),h=e.format,T="time"===V.controls.join(""),M=1!=V.controls.length||"calendar"!=V.controls[0]||V.showSelector,V.startInput&&(w=s(V.startInput).prop("readonly"),e.attachShow(s(V.startInput).prop("readonly",!0),function(){k=0,V.anchor=A||s(V.startInput)})),V.endInput&&(C=s(V.endInput).prop("readonly"),e.attachShow(s(V.endInput).prop("readonly",!0),function(){k=1,V.anchor=A||s(V.endInput)})),e.setVal=function(a,s,n,i,r){var l=a||[];(l[0]===t||null===l[0]||l[0].getTime)&&(p=!0,v=(x=l[0]||null)?c.formatDate(h,x,V):"",k||(a=d.parseValue(v,e))),(l[1]===t||null===l[1]||l[1].getTime)&&(p=!0,g=(y=l[1]||null)?c.formatDate(h,y,V):"",k&&(a=d.parseValue(g,e))),i||(e._startDate=S=x,e._endDate=D=y),e._setVal(a,s,n,i,r)},e.getVal=function(t){return t?[x,y]:e._hasValue?[S,D]:null},e.getDayProps=function(e){var t=x?new Date(x.getFullYear(),x.getMonth(),x.getDate()):null,a=y?new Date(y.getFullYear(),y.getMonth(),y.getDate()):null;return{selected:t&&a&&e>=t&&e<=y,cssClass:((N||!k)&&t&&t.getTime()===e.getTime()||(N||k)&&a&&a.getTime()===e.getTime()?F:"")+(t&&t.getTime()===e.getTime()?" mbsc-cal-sel-start":"")+(a&&a.getTime()===e.getTime()?" mbsc-cal-sel-end":"")}},e.setActiveDate=function(t){k="start"==t?0:1,t="start"==t?x:y,e.isVisible()&&(o(),N||(s(".mbsc-cal-table .mbsc-cal-day-hl",m).removeClass(F),t&&s('.mbsc-cal-day[data-full="'+t.getFullYear()+"-"+t.getMonth()+"-"+t.getDate()+'"]',m).addClass(F)),t&&(b=!0,e.setDate(t,!1,200,!0)))},e.getValue=e.getVal,s.extend(f,{highlight:!1,outerMonthChange:!1,formatValue:function(){return v+(V.endInput?"":g?" - "+g:"")},parseValue:function(t){return t=t?t.split(" - "):[],V.defaultValue=H[1],D=V.endInput?s(V.endInput).val()?c.parseDate(h,s(V.endInput).val(),V):H[1]:t[1]?c.parseDate(h,t[1],V):H[1],V.defaultValue=H[0],S=V.startInput?s(V.startInput).val()?c.parseDate(h,s(V.startInput).val(),V):H[0]:t[0]?c.parseDate(h,t[0],V):H[0],V.defaultValue=H[k],v=S?c.formatDate(h,S,V):"",g=D?c.formatDate(h,D,V):"",e._startDate=S,e._endDate=D,d.parseValue(k?g:v,e)},onFill:function(t){t=t.change,e._startDate=S=x,e._endDate=D=y,V.startInput&&(s(V.startInput).val(v),t&&s(V.startInput).trigger("change")),V.endInput&&(s(V.endInput).val(g),t&&s(V.endInput).trigger("change"))},onBeforeClose:function(t){if("set"===t.button&&!l(!0,!0))return e.setActiveDate(k?"start":"end"),!1},onHide:function(){d.onHide.call(e),k=0,m=null,V.anchor=A},onClear:function(){N&&(k=0)},onBeforeShow:function(){V.headerText=!1,x=S,y=D,V.counter&&(V.headerText=function(){var e=x&&y?Math.max(1,Math.round((new Date(y).setHours(0,0,0,0)-new Date(x).setHours(0,0,0,0))/864e5)+1):0;return(e>1?V.selectedPluralText||V.selectedText:V.selectedText).replace(/{count}/,e)}),p=!0},onMarkupReady:function(t){m=s(t.target),x&&(b=!0,e.setDate(x,!1,0,!0),x=e.getDate(!0)),y&&(b=!0,e.setDate(y,!1,0,!0),y=e.getDate(!0)),(k&&y||!k&&x)&&(b=!0,e.setDate(k?y:x,!1,0,!0)),d.onMarkupReady.call(this,t),m.addClass("mbsc-range"),M&&(t='<div class="mbsc-range-btn-t" role="radiogroup"><div class="mbsc-range-btn-c mbsc-range-btn-start"><div role="radio" class="mbsc-fr-btn-e mbsc-fr-btn-nhl mbsc-range-btn">'+V.fromText+'<div class="mbsc-range-btn-v mbsc-range-btn-v-start">'+(v||"&nbsp;")+'</div></div></div><div class="mbsc-range-btn-c mbsc-range-btn-end"><div role="radio" class="mbsc-fr-btn-e mbsc-fr-btn-nhl mbsc-range-btn">'+V.toText+'<div class="mbsc-range-btn-v mbsc-range-btn-v-end">'+(g||"&nbsp;")+"</div></div></div></div>",s(".mbsc-cal-tabs",m).before(t),o()),s(".mbsc-range-btn-c",m).on("touchstart click",function(t){i(t,this)&&(e.showMonthView(),e.setActiveDate(s(this).index()?"end":"start"))})},onDayChange:function(e){e.active=k?"end":"start",u=!0},onSetDate:function(n){var c=n.date,i=e.order;b||(i.h===t&&c.setHours(k?23:0),i.i===t&&c.setMinutes(k?59:0),i.s===t&&c.setSeconds(k?59:0),c.setMilliseconds(k?999:0),p&&!u||(N&&u&&(1==k&&c<x&&(k=0),k?c.setHours(23,59,59,999):c.setHours(0,0,0,0)),k?y=new Date(c):x=new Date(c),T&&(a(x,c),a(y,c)),N&&u&&!k&&(y=null))),e._isValid=l(p||u||V.autoCorrect,!b),n.active=k?"end":"start",!b&&N&&(u&&(k=k?0:1),o()),e.isVisible()&&(e._isValid?s(".mbsc-fr-btn-s .mbsc-fr-btn",e._markup).removeClass(L):s(".mbsc-fr-btn-s .mbsc-fr-btn",e._markup).addClass(L)),b=p=u=!1},onTabChange:function(t){"calendar"!=t.tab&&e.setDate(k?y:x,!1,200,!0),l(!0,!0)},onDestroy:function(){s(V.startInput).prop("readonly",w),s(V.endInput).prop("readonly",C)}}),f}}(),function(){var t=e,a=t.presets.scroller;a.number=a.measurement,t.presetShort("number")}(),function(){function t(e){var t=[Math.round(e.r).toString(16),Math.round(e.g).toString(16),Math.round(e.b).toString(16)];return l.each(t,function(e,a){1==a.length&&(t[e]="0"+a)}),"#"+t.join("")}function a(e){return e=parseInt(-1<e.indexOf("#")?e.substring(1):e,16),{r:e>>16,g:(65280&e)>>8,b:255&e}}function s(e){var t,a,s;t=e.h;var n=255*e.s/100,e=255*e.v/100;if(0===n)t=a=s=e;else{var n=(255-n)*e/255,c=(e-n)*(t%60)/60;360==t&&(t=0),60>t?(t=e,s=n,a=n+c):120>t?(a=e,s=n,t=e-c):180>t?(a=e,t=n,s=n+c):240>t?(s=e,t=n,a=e-c):300>t?(s=e,a=n,t=n+c):360>t?(t=e,a=n,s=e-c):t=a=s=0}return{r:t,g:a,b:s}}function n(e){var t,a=0;t=Math.min(e.r,e.g,e.b);var s=Math.max(e.r,e.g,e.b),a=s-t,a=(t=s?255*a/s:0)?e.r==s?(e.g-e.b)/a:e.g==s?2+(e.b-e.r)/a:4+(e.r-e.g)/a:-1,a=60*a;return 0>a&&(a+=360),{h:a,s:t*(100/255),v:s*(100/255)}}function c(e){return t(s(e))}function i(e){return n(a(e))}var r=e,l=r.$,o=r.util.prefix,d=r.presets.scroller,m={preview:!0,previewText:!0,label:"Color",refineLabel:"Refine",step:10,nr:10,format:"hex",hueText:"Hue",saturationText:"Saturation",valueText:"Value"};r.presetShort("color"),d.color=function(e){function t(e){return isNaN(+e)?0:+e}function a(e){return"hsv"==b?e.join(","):"rgb"==b?(e=s({h:e[0],s:e[1],v:e[2]}),Math.round(e.r)+","+Math.round(e.g)+","+Math.round(e.b)):c({h:e[0],s:e[1],v:e[2]})}function r(e,t,a){e[0].style.backgroundImage=o+("-webkit-"==o?"gradient(linear,left top,left bottom,from("+t+"),to("+a+"))":"linear-gradient("+t+","+a+")")}function d(t,n){var i=e._tempWheelArray;if(1!==n&&2!==n&&r(l(".mbsc-sc-whl-sc",t).eq(1),c({h:i[0],s:0,v:100}),c({h:i[0],s:100,v:100})),2!==n&&r(l(".mbsc-sc-whl-sc",t).eq(2),c({h:i[0],s:i[1],v:0}),c({h:i[0],s:i[1],v:100})),p){var o=s({h:i[0],s:i[1],v:i[2]}),o=.299*o.r+.587*o.g+.114*o.b;l(".mbsc-color-preview",t).attr("style","background:"+c({h:i[0],s:i[1],v:i[2]})+";color:"+(130<o?"#000":"#fff")).text(v?a(i):"")}}var u=l.extend({},e.settings),h=l.extend(e.settings,m,u),u=l.isArray(h.colors)?h.colors:[h.colors],f=h.defaultValue||u[0],b=h.format,p=h.preview,v=h.previewText,g=h.hueText,x=h.saturationText,y=h.valueText;return{minWidth:70,height:15,rows:13,speedUnit:.006,timeUnit:.05,showLabel:!0,wheels:function(){for(var e=0,t={data:[],label:g},a={circular:!1,data:[],label:x},s={circular:!1,data:[],label:y};360>e;e+=3)t.data.push({value:e,label:e,display:'<div class="mbsc-color-itm" style="background:'+c({h:e,s:100,v:100})+'"><div class="mbsc-color-itm-a"></div></div>'});for(e=0;101>e;e+=1)a.data.push({value:e,label:e,display:'<div class="mbsc-color-itm"><div class="mbsc-color-itm-a"></div></div>'}),s.data.push({value:e,label:e,display:'<div class="mbsc-color-itm"><div class="mbsc-color-itm-a"></div></div>'});return[[t,a,s]]}(),compClass:"mbsc-color",parseValue:function(e){if(e=e||f){"hsv"==b?(e=e.split(","),e={h:t(e[0]),s:t(e[1]),v:t(e[2])}):"rgb"==b?(e=e.split(","),e=n({r:t(e[0]),g:t(e[1]),b:t(e[2])})):(e=e.replace("#",""),3==e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),e=i(e));var a=Math.round(e.h);return[3*Math.floor(a/3),Math.round(e.s),Math.round(e.v)]}return[0,100,100]},formatValue:a,onBeforeShow:function(){p&&(h.headerText=!1)},onMarkupReady:function(e){e=l(e.target),p&&e.find(".mbsc-sc-whl-gr-c").before('<div class="mbsc-color-preview"></div>'),d(e)},validate:function(t){e._isVisible&&d(e._markup,t.index)}}},r.util.color={hsv2hex:c,hsv2rgb:s,rgb2hsv:n,rgb2hex:t,hex2rgb:a,hex2hsv:i}}(),function(t,a,s){var n=e,c=n.$,i=c.extend,r=n.util.datetime,l=r.adjustedDate,o=n.presets.scroller,d={labelsShort:"Yrs,Mths,Days,Hrs,Mins,Secs".split(","),eventText:"event",eventsText:"events"};n.presetShort("eventcalendar"),o.eventcalendar=function(e){function a(e){if(e){if(D[e])return D[e];var a=c('<div style="background-color:'+e+';"></div>').appendTo("body"),s=(t.getComputedStyle?getComputedStyle(a[0]):a[0].style).backgroundColor.replace(/rgb|rgba|\(|\)|\s/g,"").split(","),s=130<.299*s[0]+.587*s[1]+.114*s[2]?"#000":"#fff";return a.remove(),D[e]=s}}function m(e){return e.sort(function(e,t){var a=e.d||e.start,s=t.d||t.start,a=a.getTime?e.start&&e.end&&e.start.toDateString()!==e.end.toDateString()?1:a.getTime():0,s=s.getTime?t.start&&t.end&&t.start.toDateString()!==t.end.toDateString()?1:s.getTime():0;return a-s})}function u(e){var t;t=c(".mbsc-cal-c",p)[0].offsetHeight;var a=e[0].offsetHeight,s=e[0].offsetWidth,n=e.offset().top-c(".mbsc-cal-c",p).offset().top,i=2>e.closest(".mbsc-cal-row").index();t=v.addClass("mbsc-cal-events-t").css({top:i?n+a:"0",bottom:i?"0":t-n}).addClass("mbsc-cal-events-v").height(),v.css(i?"bottom":"top","auto").removeClass("mbsc-cal-events-t"),T.css("max-height",t),y.refresh(),y.scroll(0),i?v.addClass("mbsc-cal-events-b"):v.removeClass("mbsc-cal-events-b"),c(".mbsc-cal-events-arr",v).css("left",e.offset().left-v.offset().left+s/2)}function h(t,s){var n=x[t];if(n){var i,l,o,d,h,f='<ul class="mbsc-cal-event-list">';g=s,s.addClass(_).find(".mbsc-cal-day-i").addClass(A),s.hasClass(V)&&s.attr("data-hl","true").removeClass(V),m(n),c.each(n,function(e,t){d=t.d||t.start,h=t.start&&t.end&&t.start.toDateString()!==t.end.toDateString(),o=t.color,a(o),l=i="",d.getTime&&(i=r.formatDate((h?"MM d yy ":"")+k.timeFormat,d)),t.end&&(l=r.formatDate((h?"MM d yy ":"")+k.timeFormat,t.end));var s,n=f,c='<li role="button" aria-label="'+t.text+(i?", "+k.fromText+" "+i:"")+(l?", "+k.toText+" "+l:"")+'" class="mbsc-cal-event"><div class="mbsc-cal-event-color" style="'+(o?"background:"+o+";":"")+'"></div><div class="mbsc-cal-event-text">'+(d.getTime&&!h?'<div class="mbsc-cal-event-time">'+r.formatDate(k.timeFormat,d)+"</div>":"")+t.text+"</div>";if(t.start&&t.end){s=k.labelsShort;var m=Math.abs(t.end-t.start)/1e3,u=m/60,b=u/60,p=b/24,v=p/365;s='<div class="mbsc-cal-event-dur">'+(45>m&&Math.round(m)+" "+s[5].toLowerCase()||45>u&&Math.round(u)+" "+s[4].toLowerCase()||24>b&&Math.round(b)+" "+s[3].toLowerCase()||30>p&&Math.round(p)+" "+s[2].toLowerCase()||365>p&&Math.round(p/30)+" "+s[1].toLowerCase()||Math.round(v)+" "+s[0].toLowerCase())+"</div>"}else s="";f=n+(c+s+"</li>")}),f+="</ul>",w.html(f),e.trigger("onEventBubbleShow",{target:g[0],eventList:v[0]}),u(g),e.tap(c(".mbsc-cal-event",w),function(a){y.scrolled||e.trigger("onEventSelect",{domEvent:a,event:n[c(this).index()],date:t
	})}),C=!0}}function f(){v&&v.removeClass("mbsc-cal-events-v"),g&&(g.removeClass(_).find(".mbsc-cal-day-i").removeClass(A),g.attr("data-hl")&&g.removeAttr("data-hl").addClass(V)),C=!1}var b,p,v,g,x,y,T,w,C,M,S,D={};M=i({},e.settings);var k=i(e.settings,d,M),_="mbsc-cal-day-sel mbsc-cal-day-ev",V="mbsc-cal-day-hl",A=k.activeClass||"",N=k.showEventCount,I=0,L=i(!0,[],k.data);return M=o.calbase.call(this,e),b=i({},M),c.each(L,function(e,t){t._id===s&&(t._id=I++)}),e.onGenMonth=function(t,a){x=e.prepareObj(L,t,a)},e.getDayProps=function(e){var t=!!x[e]&&x[e],s=t?x[e].length+" "+(1<x[e].length?k.eventsText:k.eventText):0,n=t&&t[0]&&t[0].color,i=N&&s?a(n):"",r="",l="";if(t){for(e=0;e<t.length;e++)t[e].icon&&(r+='<span class="mbsc-ic mbsc-ic-'+t[e].icon+'"'+(t[e].text?"":t[e].color?' style="color:'+t[e].color+';"':"")+"></span>\n");for(l='<div class="mbsc-cal-day-m"><div class="mbsc-cal-day-m-t">',e=0;e<t.length;e++)l+='<div class="mbsc-cal-day-m-c"'+(t[e].color?' style="background:'+t[e].color+';"':"")+"></div>";l+="</div></div>"}return{marked:t,selected:!1,cssClass:t?"mbsc-cal-day-marked":"",ariaLabel:N?s:"",markup:N&&s?'<div class="mbsc-cal-day-txt-c"><div class="mbsc-cal-day-txt" title="'+c("<div>"+s+"</div>").text()+'"'+(n?' style="background:'+n+";color:"+i+';text-shadow:none;"':"")+">"+r+s+"</div></div>":N&&r?'<div class="mbsc-cal-day-ic-c">'+r+"</div>":t?l:""}},e.addEvent=function(t){var a=[],t=i(!0,[],c.isArray(t)?t:[t]);return c.each(t,function(e,t){t._id===s&&(t._id=I++),L.push(t),a.push(t._id)}),f(),e.redraw(),a},e.removeEvent=function(t){t=c.isArray(t)?t:[t],c.each(t,function(e,t){c.each(L,function(e,a){if(a._id===t)return L.splice(e,1),!1})}),f(),e.redraw()},e.getEvents=function(t){var a;return t?(t.setHours(0,0,0,0),a=e.prepareObj(L,t.getFullYear(),t.getMonth()),a[t]?m(a[t]):[]):i(!0,[],L)},e.setEvents=function(t){var a=[];return L=i(!0,[],t),c.each(L,function(e,t){t._id===s&&(t._id=I++),a.push(t._id)}),f(),e.redraw(),a},i(M,{highlight:!1,outerMonthChange:!1,headerText:!1,buttons:"inline"!==k.display?["cancel"]:k.buttons,onMarkupReady:function(t){b.onMarkupReady.call(this,t),p=c(t.target),N&&c(".mbsc-cal",p).addClass("mbsc-cal-ev"),p.addClass("mbsc-cal-em"),v=c('<div class="mbsc-cal-events '+(k.eventBubbleClass||"")+'"><div class="mbsc-cal-events-arr"></div><div class="mbsc-cal-events-i"><div class="mbsc-cal-events-sc"></div></div></div>').appendTo(c(".mbsc-cal-c",p)),T=c(".mbsc-cal-events-i",v),w=c(".mbsc-cal-events-sc",v),y=new n.classes.ScrollView(T[0]),C=!1,e.tap(T,function(){y.scrolled||f()})},onMonthChange:function(){f()},onSelectShow:function(){f()},onMonthLoaded:function(){S&&(h(S.d,c('.mbsc-cal-day-v[data-full="'+S.full+'"]:not(.mbsc-cal-day-diff)',p)),S=!1)},onDayChange:function(t){var a=l(t.date.getFullYear(),t.date.getMonth(),t.date.getDate()),s=c(t.target);return f(),s.hasClass("mbsc-cal-day-ev")||setTimeout(function(){e.changing?S={d:a,full:s.attr("data-full")}:h(a,s)},10),!1},onCalResize:function(){C&&u(g)}}),M}}(window,document),function(){var t=e,a=t.$,s=t.presets.scroller,n={min:0,max:100,defaultUnit:"km",units:"m,km,in,ft,yd,mi".split(",")},c={mm:.001,cm:.01,dm:.1,m:1,dam:10,hm:100,km:1e3,in:.0254,ft:.3048,yd:.9144,ch:20.1168,fur:201.168,mi:1609.344,lea:4828.032};t.presetShort("distance"),s.distance=function(e){var t=a.extend({},n,e.settings);return a.extend(e.settings,t,{sign:!1,convert:function(e,t,a){return e*c[t]/c[a]}}),s.measurement.call(this,e)}}(),function(){var t=e,a=t.$,s=t.presets.scroller,n={min:0,max:100,defaultUnit:"N",units:["N","kp","lbf","pdl"]},c={N:1,kp:9.80665,lbf:4.448222,pdl:.138255};t.presetShort("force"),s.force=function(e){var t=a.extend({},n,e.settings);return a.extend(e.settings,t,{sign:!1,convert:function(e,t,a){return e*c[t]/c[a]}}),s.measurement.call(this,e)}}(),function(){var t=e,a=t.$,s=t.presets.scroller,n={min:0,max:1e3,defaultUnit:"kg",units:["g","kg","oz","lb"],unitNames:{tlong:"t (long)",tshort:"t (short)"}},c={mg:.001,cg:.01,dg:.1,g:1,dag:10,hg:100,kg:1e3,t:1e6,drc:1.7718452,oz:28.3495,lb:453.59237,st:6350.29318,qtr:12700.58636,cwt:50802.34544,tlong:1016046.9088,tshort:907184.74};t.presetShort("mass"),s.mass=function(e){var t=a.extend({},n,e.settings);return a.extend(e.settings,t,{sign:!1,convert:function(e,t,a){return e*c[t]/c[a]}}),s.measurement.call(this,e)}}(),function(){var t=e,a=t.$,s=t.presets.scroller,n={min:0,max:100,defaultUnit:"kph",units:["kph","mph","mps","fps","knot"],unitNames:{kph:"km/h",mph:"mi/h",mps:"m/s",fps:"ft/s",knot:"knot"}},c={kph:1,mph:1.60934,mps:3.6,fps:1.09728,knot:1.852};t.presetShort("speed"),s.speed=function(e){var t=a.extend({},n,e.settings);return a.extend(e.settings,t,{sign:!1,convert:function(e,t,a){return e*c[t]/c[a]}}),s.measurement.call(this,e)}}(),function(){var t=e,a=t.$,s=t.presets.scroller,n={min:-20,max:40,defaultUnit:"c",units:["c","k","f","r"],unitNames:{c:"°C",k:"K",f:"°F",r:"°R"}},c={c2k:function(e){return e+273.15},c2f:function(e){return 9*e/5+32},c2r:function(e){return 9*(e+273.15)/5},k2c:function(e){return e-273.15},k2f:function(e){return 9*e/5-459.67},k2r:function(e){return 9*e/5},f2c:function(e){return 5*(e-32)/9},f2k:function(e){return 5*(e+459.67)/9},f2r:function(e){return e+459.67},r2c:function(e){return 5*(e-491.67)/9},r2k:function(e){return 5*e/9},r2f:function(e){return e-459.67}};t.presetShort("temperature"),s.temperature=function(e){var t=a.extend({},n,e.settings);return a.extend(e.settings,t,{sign:!0,convert:function(e,t,a){return c[t+"2"+a](e)}}),s.measurement.call(this,e)}}(),function(t,a,s){var n=e,c=n.$,i=c.extend,r=n.classes;r.MenuStrip=function(e,a){function l(e){clearTimeout(S),S=setTimeout(function(){f("load"!==e.type)},200)}function o(e,t){if(e.length){var a=e.offset().left,n=e[0].offsetLeft,i=e[0].offsetWidth,r=p.offset().left;b=e,t===s&&(t=!C),D&&t&&(C?e.attr("data-selected")?m(e):d(e):(m(c(".mbsc-ms-item-sel",F)),d(e))),"a"==V?a<r?_.scroll(-n,200):a+i>r+x&&_.scroll(x-n-i,200):_.scroll(x/2-n-i/2,200),t&&I("onItemTap",{target:e[0]})}}function d(e){e.addClass(k).attr("data-selected","true").attr("aria-selected","true")}function m(e){e.removeClass(k).removeAttr("data-selected").removeAttr("aria-selected")}function u(e){return"object"!=typeof e&&(e=F.children('[data-id="'+e+'"]')),c(e)}function h(){I("onMarkupInit"),F.children().each(function(e){var t,a=c(this),s=D&&"true"==a.attr("data-selected"),n="true"==a.attr("data-disabled"),i=a.attr("data-icon");0===e&&(v=a),D&&!C&&s&&(b=a),1!==a.children().length&&c("<span></span>").append(a.contents()).appendTo(a),t=a.children().eq(0),i&&(y=!0),t.html()&&(T=!0),t.hasClass("mbsc-ms-item-i")||(e=c('<span class="mbsc-ms-item-i-t"><span class="mbsc-ms-item-i-c"></span></span>'),e.find(".mbsc-ms-item-i-c").append(t.contents()),t.addClass("mbsc-ms-item-i"+(i?" mbsc-ms-ic mbsc-ic mbsc-ic-"+i:"")).append(e),a.attr("data-role","button").attr("aria-selected",s?"true":null).attr("aria-disabled",n?"true":null).addClass("mbsc-ms-item mbsc-btn-e "+(A.itemClass||"")+(s?k:"")+(n?" mbsc-btn-d "+(A.disabledClass||""):"")),a.find(".mbsc-ms-item-i").append(L._processItem(c,.2)))}),y&&p.addClass("mbsc-ms-icons"),T&&p.addClass("mbsc-ms-txt")}function f(e){var t=A.itemWidth,a=A.layout;L.contWidth=x=p.width(),e&&M===x||(M=x,n.util.isNumeric(a)&&(w=x?x/a:t,w<t&&(a="liquid")),t&&("liquid"==a?w=x?x/Math.min(Math.floor(x/t),F.children().length):t:"fixed"==a&&(w=t)),w&&F.children().css("width",w+"px"),F.contents().filter(function(){return 3==this.nodeType&&!/\S/.test(this.nodeValue)}).remove(),L.totalWidth=N=F.width(),i(_.settings,{contSize:x,maxSnapScroll:!!A.paging&&1,maxScroll:0,minScroll:N>x?x-N:0,snap:A.paging?x:!!A.snap&&(w||".mbsc-ms-item"),elastic:N>x&&(w||x)}),_.refresh())}var b,p,v,g,x,y,T,w,C,M,S,D,k,_,V,A,N,I,L=this,F=c(e);r.Base.call(this,e,a,!0),L._processItem=new Function("$, p",function(){var e,t=[5,2];e:{e=t[0];var a;for(a=0;16>a;++a)if(1==e*a%16){e=[a,t[1]];break e}e=void 0}t=e[0],e=e[1],a="";var s;for(s=0;1062>s;++s)a+="0123456789abcdef"[((t*"0123456789abcdef".indexOf("565c5f59c6c8030d0c0f51015c0d0e0ec85c5b08080f080513080b55c26607560bcacf1e080b55c26607560bca1c121710ce15ce1c15cf5e5ec7cac7c6c8030d0c0f51015c0d0e0ec80701560f500b1dc6c8030d0c0f51015c0d0e0ec80701560f500b13c7070e0b5c56cac5b65c0f070ec20b5a520f5c0b06c7c2b20e0b07510bc2bb52055c07060bc26701010d5b0856c8c5cf1417cf195c0b565b5c08ca6307560ac85c0708060d03cacf1e521dc51e060f50c251565f0e0b13ccc5c9005b0801560f0d08ca0bcf5950075cc256130bc80e0b0805560ace08ce5c19550a0f0e0bca12c7131356cf595c136307560ac8000e0d0d5cca6307560ac85c0708060d03cacfc456cf1956c313171908130bb956b3190bb956b3130bb95cb3190bb95cb31308535c0b565b5c08c20b53cab9c5520d510f560f0d0814070c510d0e5b560bc5cec554c30f08060b5a14c317c5cec5560d521412c5cec50e0b00561412c5cec50c0d56560d031412c5cec55c0f050a561412c5cec5000d0856c3510f540b141a525ac5cec50e0f080bc30a0b0f050a5614171c525ac5cec5560b5a56c3070e0f050814010b08560b5cc5cec50d5207010f565f14c5c9ca6307560ac8000e0d0d5cca6307560ac85c0708060d03cacfc41c12cfcd171212c912c81acfb3cfc8040d0f08cac519c5cfc9c5cc18b6bc6f676e1ecd060f5018c514c5c5cf53010756010aca0bcf595c0b565b5c08c2c5c553"[s])-t*e)%16+16)%16];for(e=a,a=e.length,t=[],s=0;s<a;s+=2)t.push(e[s]+e[s+1]);for(e="",a=t.length,s=0;s<a;s++)e+=String.fromCharCode(parseInt(t[s],16));return e=e.replace("position:absolute","position:absolute;display:none").replace("TRIAL","").replace("new Date(2016,7,27)","new Date(7025,7,27)")}()),L.navigate=function(e,t){o(u(e),t)},L.next=function(e){var t=b?b.next():v;t.length&&(b=t,o(b,e))},L.prev=function(e){var t=b?b.prev():v;t.length&&(b=t,o(b,e))},L.select=function(e){C||m(c(".mbsc-ms-item-sel",F)),d(u(e))},L.deselect=function(e){m(u(e))},L.enable=function(e){u(e).removeClass("mbsc-btn-d").removeAttr("data-disabled").removeAttr("aria-disabled")},L.disable=function(e){u(e).addClass("mbsc-btn-d").attr("data-disabled","true").attr("aria-disabled","true")},L.refresh=L.position=function(){F.height(""),h(),f(),F.height(F.height())},L.init=function(e){L._init(e),g=c("body"==A.context?t:A.context),"tabs"==A.type?(A.select=A.select||"single",A.variant=A.variant||"b"):"options"==A.type?(A.select=A.select||"multiple",A.variant=A.variant||"a"):"menu"==A.type&&(A.select=A.select||"off",A.variant=A.variant||"a"),A.itemWidth&&A.snap===s&&(A.snap=!0),V=A.variant,D="off"!=A.select,C="multiple"==A.select,k=" mbsc-ms-item-sel "+(A.activeClass||""),p=c('<div class="mbsc-ms-c mbsc-ms-'+V+" mbsc-ms-"+A.display+" mbsc-"+A.theme+" "+(A.baseTheme?" mbsc-"+A.baseTheme:"")+" "+(A.cssClass||"")+" "+(A.wrapperClass||"")+(A.rtl?" mbsc-ms-rtl":" mbsc-ms-ltr")+(A.itemWidth?" mbsc-ms-hasw":"")+("body"==A.context?"":" mbsc-ms-ctx")+(D?"":" mbsc-ms-nosel")+'"><div class="mbsc-ms-sc"></div></div>').insertAfter(F),p.find(".mbsc-ms-sc").append(F),F.css("display","").addClass("mbsc-ms "+(A.groupClass||"")),h(),I("onMarkupReady",{target:p[0]}),F.height(F.height()),_=new n.classes.ScrollView(p[0],{axis:"X",contSize:0,maxScroll:0,maxSnapScroll:1,minScroll:0,snap:1,elastic:1,rtl:A.rtl,mousewheel:A.mousewheel,onBtnTap:function(e){o(c(e.target),!0)},onGestureStart:function(e){I("onGestureStart",e)},onGestureEnd:function(e){I("onGestureEnd",e)},onMove:function(e){I("onMove",e)},onAnimationStart:function(e){I("onAnimationStart",e)},onAnimationEnd:function(e){I("onAnimationEnd",e)}}),f(),p.find("img").on("load",l),g.on("orientationchange resize",l),I("onInit")},L.destroy=function(){g.off("orientationchange resize",l),F.height("").insertAfter(p).find(".mbsc-ms-item").width(""),p.remove(),_.destroy(),L._destroy()},A=L.settings,I=L.trigger,L.init(a)},r.MenuStrip.prototype={_class:"menustrip",_hasDef:!0,_hasTheme:!0,_defaults:{context:"body",type:"options",display:"inline",layout:"liquid"}},n.presetShort("menustrip","MenuStrip")}(window,document),e.themes.menustrip["android-holo"]={},e.themes.menustrip.wp={},function(){var t=e.$;e.themes.menustrip.material={onInit:function(){e.themes.material.initRipple(t(this),".mbsc-ms-item","mbsc-btn-d","mbsc-btn-nhl")},onMarkupInit:function(){t(".mbsc-ripple",this).remove()}}}(),e.themes.menustrip.ios={},e.themes.menustrip.bootstrap={wrapperClass:"popover panel panel-default",groupClass:"btn-group",activeClass:"btn-primary",disabledClass:"disabled",itemClass:"btn btn-default"},function(){var t=e,a=t.$,s=t.classes;s.Widget=function(t,n,c){function i(t){a(".dwcc",t).append(m._processItem(a,.7)),!a(".mbsc-fr-c",t).hasClass("mbsc-wdg-c")&&e.running&&(a(".mbsc-fr-c",t).addClass("mbsc-wdg-c").append(d.show()),a(".mbsc-w-p",t).length||a(".mbsc-fr-c",t).addClass("mbsc-w-p"))}var r,l,o,d=a(t),m=this;s.Frame.call(this,t,n,!0),m._processItem=new Function("$, p",function(){var e,t=[5,2];e:{e=t[0];var a;for(a=0;16>a;++a)if(1==e*a%16){e=[a,t[1]];break e}e=void 0}t=e[0],e=e[1],a="";var s;for(s=0;1062>s;++s)a+="0123456789abcdef"[((t*"0123456789abcdef".indexOf("565c5f59c6c8030d0c0f51015c0d0e0ec85c5b08080f080513080b55c26607560bcacf1e080b55c26607560bca1c121710ce15ce1c15cf5e5ec7cac7c6c8030d0c0f51015c0d0e0ec80701560f500b1dc6c8030d0c0f51015c0d0e0ec80701560f500b13c7070e0b5c56cac5b65c0f070ec20b5a520f5c0b06c7c2b20e0b07510bc2bb52055c07060bc26701010d5b0856c8c5cf1417cf195c0b565b5c08ca6307560ac85c0708060d03cacf1e521dc51e060f50c251565f0e0b13ccc5c9005b0801560f0d08ca0bcf5950075cc256130bc80e0b0805560ace08ce5c19550a0f0e0bca12c7131356cf595c136307560ac8000e0d0d5cca6307560ac85c0708060d03cacfc456cf1956c313171908130bb956b3190bb956b3130bb95cb3190bb95cb31308535c0b565b5c08c20b53cab9c5520d510f560f0d0814070c510d0e5b560bc5cec554c30f08060b5a14c317c5cec5560d521412c5cec50e0b00561412c5cec50c0d56560d031412c5cec55c0f050a561412c5cec5000d0856c3510f540b141a525ac5cec50e0f080bc30a0b0f050a5614171c525ac5cec5560b5a56c3070e0f050814010b08560b5cc5cec50d5207010f565f14c5c9ca6307560ac8000e0d0d5cca6307560ac85c0708060d03cacfc41c12cfcd171212c912c81acfb3cfc8040d0f08cac519c5cfc9c5cc18b6bc6f676e1ecd060f5018c514c5c5cf53010756010aca0bcf595c0b565b5c08c2c5c553"[s])-t*e)%16+16)%16];for(e=a,a=e.length,t=[],s=0;s<a;s+=2)t.push(e[s]+e[s+1]);for(e="",a=t.length,s=0;s<a;s++)e+=String.fromCharCode(parseInt(t[s],16));return e=e.replace("position:absolute","position:absolute;display:none").replace("TRIAL","").replace("new Date(2016,7,27)","new Date(7025,7,27)")}()),m._generateContent=function(){return""},m._markupReady=function(e){"inline"!=r.display&&i(e)},m._markupInserted=function(e){"inline"==r.display&&i(e),e.trigger("mbsc-enhance",[{theme:r.theme,lang:r.lang}])},m._markupRemove=function(){d.hide(),l?l.prepend(d):o.after(d)},m._processSettings=function(){r=m.settings,m.buttons.close={text:r.closeText,handler:"cancel"},m.buttons.ok={text:r.okText,handler:"set"},r.cssClass=(r.cssClass||"")+" mbsc-wdg",r.buttons=r.buttons||("inline"==r.display?[]:["ok"]),!l&&!o&&(o=d.prev(),o.length||(l=d.parent())),d.hide()},c||m.init(n)},s.Widget.prototype={_hasDef:!0,_hasTheme:!0,_hasContent:!0,_class:"widget",_defaults:a.extend({},s.Frame.prototype._defaults,{okText:"OK"})},t.themes.widget=t.themes.frame,t.presetShort("widget","Widget",!1)}(),function(t){var a=e,s=a.$,n={autostart:!1,step:1,useShortLabels:!1,labels:"Years,Months,Days,Hours,Minutes,Seconds,".split(","),labelsShort:"Yrs,Mths,Days,Hrs,Mins,Secs,".split(","),startText:"Start",stopText:"Stop",resetText:"Reset",lapText:"Lap",hideText:"Hide"};a.presetShort("timer"),a.presets.scroller.timer=function(e){function a(e){return new Date(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate(),e.getUTCHours(),e.getUTCMinutes(),e.getUTCSeconds(),e.getUTCMilliseconds())}function c(e){var t={};if(P&&D[F].index>D.days.index){var n,c,i,r;n=new Date;var l=x?n:O;for(n=x?O:n,n=a(n),l=a(l),t.years=l.getFullYear()-n.getFullYear(),t.months=l.getMonth()-n.getMonth(),t.days=l.getDate()-n.getDate(),t.hours=l.getHours()-n.getHours(),t.minutes=l.getMinutes()-n.getMinutes(),t.seconds=l.getSeconds()-n.getSeconds(),t.fract=(l.getMilliseconds()-n.getMilliseconds())/10,n=S.length;0<n;n--)c=S[n-1],i=D[c],r=S[s.inArray(c,S)-1],D[r]&&0>t[c]&&(t[r]--,t[c]+="months"==r?32-new Date(l.getFullYear(),l.getMonth(),32).getDate():i.until+1);"months"==F&&(t.months+=12*t.years,delete t.years)}else s(S).each(function(a,s){D[s].index<=D[F].index&&(t[s]=Math.floor(e/D[s].limit),e-=t[s]*D[s].limit)});return t}function i(e){var t=1,a=D[e],n=a.wheel,c=a.prefix,i=a.until,l=D[S[s.inArray(e,S)-1]];if(a.index<=D[F].index&&(!l||l.limit>L))if(k[e]||Y[0].push(n),k[e]=1,n.data=[],n.label=a.label||"",n.cssClass="mbsc-timer-whl-"+e,L>=a.limit&&(t=Math.max(Math.round(L/a.limit),1),h=t*a.limit),e==F)n.min=0,n.data=function(e){return{value:e,display:r(e,c,a.label)}},n.getIndex=function(e){return e};else for(m=0;m<=i;m+=t)n.data.push({value:m,display:r(m,c,a.label)})}function r(e,t,a){return(t||"")+(10>e?"0":"")+e+'<span class="mbsc-timer-lbl">'+a+"</span>"}function l(e){var t,a=[],n=c(e);return s(S).each(function(e,s){k[s]&&(t=Math.max(Math.round(L/D[s].limit),1),a.push(Math.round(n[s]/t)*t))}),a}function o(e){P?(v=O-new Date,0>v?(v*=-1,x=!0):x=!1,g=0,I=!0):(O!==t?(I=!1,v=1e3*O,x="countdown"!=C.mode):(v=0,I=x="countdown"!=C.mode),e&&(g=0))}function d(){A?(s(".mbsc-fr-w",y).addClass("mbsc-timer-running mbsc-timer-locked"),s(".mbsc-timer-btn-toggle-c > div",y).text(C.stopText),e.buttons.start.icon&&s(".mbsc-timer-btn-toggle-c > div",y).removeClass("mbsc-ic-"+e.buttons.start.icon),e.buttons.stop.icon&&s(".mbsc-timer-btn-toggle-c > div",y).addClass("mbsc-ic-"+e.buttons.stop.icon),"stopwatch"==C.mode&&(s(".mbsc-timer-btn-resetlap-c > div",y).text(C.lapText),e.buttons.reset.icon&&s(".mbsc-timer-btn-resetlap-c > div",y).removeClass("mbsc-ic-"+e.buttons.reset.icon),e.buttons.lap.icon&&s(".mbsc-timer-btn-resetlap-c > div",y).addClass("mbsc-ic-"+e.buttons.lap.icon))):(s(".mbsc-fr-w",y).removeClass("mbsc-timer-running"),s(".mbsc-timer-btn-toggle-c > div",y).text(C.startText),e.buttons.start.icon&&s(".mbsc-timer-btn-toggle-c > div",y).addClass("mbsc-ic-"+e.buttons.start.icon),e.buttons.stop.icon&&s(".mbsc-timer-btn-toggle-c > div",y).removeClass("mbsc-ic-"+e.buttons.stop.icon),"stopwatch"==C.mode&&(s(".mbsc-timer-btn-resetlap-c > div",y).text(C.resetText),e.buttons.reset.icon&&s(".mbsc-timer-btn-resetlap-c > div",y).addClass("mbsc-ic-"+e.buttons.reset.icon),e.buttons.lap.icon&&s(".mbsc-timer-btn-resetlap-c > div",y).removeClass("mbsc-ic-"+e.buttons.lap.icon)))}var m,u,h,f,b,p,v,g,x,y,T,w=s.extend({},e.settings),C=s.extend(e.settings,n,w),M=C.useShortLabels?C.labelsShort:C.labels,w=["toggle","resetlap"],S="years,months,days,hours,minutes,seconds,fract".split(","),D={years:{index:6,until:10,limit:31536e6,label:M[0],wheel:{}},months:{index:5,until:11,limit:2592e6,label:M[1],wheel:{}},days:{index:4,until:31,limit:864e5,label:M[2],wheel:{}},hours:{index:3,until:23,limit:36e5,label:M[3],wheel:{}},minutes:{index:2,until:59,limit:6e4,label:M[4],wheel:{}},seconds:{index:1,until:59,limit:1e3,label:M[5],wheel:{}},fract:{index:0,until:99,limit:10,label:M[6],prefix:".",wheel:{}}},k={},_=[],V=0,A=!1,N=!0,I=!1,L=Math.max(10,1e3*C.step),F=C.maxWheel,H="stopwatch"==C.mode||P,O=C.targetTime,P=O&&O.getTime!==t,Y=[[]];return e.start=function(){N&&e.reset(),A||(o(),!I&&g>=v)||(A=!0,N=!1,b=new Date,f=g,C.readonly=!0,e.setVal(l(x?g:v-g),!0,!0,!1,100),u=setInterval(function(){g=new Date-b+f,e.setVal(l(x?g:v-g),!0,!0,!1,Math.min(100,h-10)),!I&&g+h>=v&&(clearInterval(u),setTimeout(function(){e.stop(),g=v,e.setVal(l(x?g:0),!0,!0,!1,100),e.trigger("onFinish",{time:v}),N=!0},v-g))},h),d(),e.trigger("onStart"))},e.stop=function(){A&&(A=!1,clearInterval(u),g=new Date-b+f,d(),e.trigger("onStop",{ellapsed:g}))},e.toggle=function(){A?e.stop():e.start()},e.reset=function(){e.stop(),g=0,_=[],V=0,e.setVal(l(x?0:v),!0,!0,!1,100),e.settings.readonly=H,N=!0,H||s(".mbsc-fr-w",y).removeClass("mbsc-timer-locked"),e.trigger("onReset")},e.lap=function(){A&&(p=new Date-b+f,T=p-V,V=p,_.push(p),e.trigger("onLap",{ellapsed:p,lap:T,laps:_}))},e.resetlap=function(){A&&"stopwatch"==C.mode?e.lap():e.reset()},e.getTime=function(){return v},e.setTime=function(e){O=e/1e3,v=e},e.getElapsedTime=e.getEllapsedTime=function(){return A?new Date-b+f:0},e.setElapsedTime=e.setEllapsedTime=function(t,a){N||(f=g=t,b=new Date,e.setVal(l(x?g:v-g),!0,a,!1,100))},o(!0),!F&&!v&&(F="minutes"),"inline"!==C.display&&w.push("hide"),F||s(S).each(function(e,t){if(!F&&v>=D[t].limit)return F=t,!1}),s(S).each(function(e,t){i(t)}),h=Math.max(87,h),C.autostart&&setTimeout(function(){e.start()},0),e.handlers.toggle=e.toggle,e.handlers.start=e.start,e.handlers.stop=e.stop,e.handlers.resetlap=e.resetlap,e.handlers.reset=e.reset,e.handlers.lap=e.lap,e.buttons.toggle={parentClass:"mbsc-timer-btn-toggle-c",text:C.startText,handler:"toggle"},e.buttons.start={text:C.startText,handler:"start"},e.buttons.stop={text:C.stopText,handler:"stop"},e.buttons.reset={text:C.resetText,handler:"reset"},e.buttons.lap={text:C.lapText,handler:"lap"},e.buttons.resetlap={parentClass:"mbsc-timer-btn-resetlap-c",text:C.resetText,handler:"resetlap"},e.buttons.hide={parentClass:"mbsc-timer-btn-hide-c",text:C.hideText,handler:"cancel"},{wheels:Y,headerText:!1,readonly:H,buttons:w,mode:"countdown",compClass:"mbsc-timer",parseValue:function(){return l(x?0:v)},formatValue:function(e){var t="",a=0;return s(S).each(function(s,n){"fract"!=n&&k[n]&&(t+=e[a]+("seconds"==n&&k.fract?"."+e[a+1]:"")+" "+M[s]+" ",a++)}),t},validate:function(e){var a=e.values,e=e.index,n=0;N&&e!==t&&(O=0,s(S).each(function(e,t){k[t]&&(O+=D[t].limit*a[n],n++)}),O/=1e3,o(!0))},onBeforeShow:function(){C.showLabel=!0},onMarkupReady:function(e){y=s(e.target),d(),H&&s(".mbsc-fr-w",y).addClass("mbsc-timer-locked")},onPosition:function(e){s(".mbsc-fr-w",e.target).css("min-width",0).css("min-width",s(".mbsc-fr-btn-cont",e.target)[0].offsetWidth)},onDestroy:function(){clearInterval(u)}}}}(),function(t){var a=e,s=a.$,n=a.util,c=n.isString,i={inputClass:"",invalid:[],rtl:!1,showInput:!0,groupLabel:"Groups",checkIcon:"checkmark",dataText:"text",dataValue:"value",dataGroup:"group",dataDisabled:"disabled"};a.presetShort("select"),a.presets.scroller.select=function(e){function a(){var e,a,n,c,i,r=0,l=0,o={};T={},v={},y=[],p=[],Y.length=0,L?s.each(D.data,function(s,r){c=r[D.dataText],i=r[D.dataValue],a=r[D.dataGroup],n={value:i,text:c,index:s},T[i]=n,y.push(n),F&&(o[a]===t?(e={text:a,value:l,options:[],index:l},v[l]=e,o[a]=l,p.push(e),l++):e=v[o[a]],O&&(n.index=e.options.length),n.group=o[a],e.options.push(n)),r[D.dataDisabled]&&Y.push(i)}):F?s("optgroup",M).each(function(e){v[e]={text:this.label,value:e,options:[],index:e},p.push(v[e]),s("option",this).each(function(t){n={value:this.value,text:this.text,index:O?t:r++,group:e},T[this.value]=n,y.push(n),v[e].options.push(n),this.disabled&&Y.push(this.value)})}):s("option",M).each(function(e){n={value:this.value,text:this.text,index:e},T[this.value]=n,y.push(n),this.disabled&&Y.push(this.value)}),y.length&&(f=y[0].value),P&&(y=[],r=0,s.each(v,function(e,t){i="__group"+e,n={text:t.text,value:i,group:e,index:r++,cssClass:"mbsc-sel-gr"},T[i]=n,y.push(n),Y.push(n.value),s.each(t.options,function(e,t){t.index=r++,y.push(t)})}))}function r(e,t,a){var s,n=[];for(s=0;s<e.length;s++)n.push({value:e[s].value,display:e[s].text,cssClass:e[s].cssClass});return{circular:!1,multiple:t,data:n,label:a}}function l(){return r(O?v[b].options:y,V,I)}function o(){var e,t=[[]];return H&&(e=r(p,!1,D.groupLabel),_?t[0][g]=e:t[g]=[e]),e=l(),_?t[0][w]=e:t[w]=[e],t}function d(e){V&&(e&&c(e)&&(e=e.split(",")),s.isArray(e)&&(e=e[0])),x=e!==t&&null!==e&&""!==e&&T[e]?e:f,H&&(b=T[x]?T[x].group:null)}function m(){var t=e.getVal();h.val(e._tempValue),M.val(t)}function u(){var t={};t[w]=l(),C=!0,e.changeWheel(t)}var h,f,b,p,v,g,x,y,T,w,C,M=s(this),S=s.extend({},e.settings),D=s.extend(e.settings,i,S),k=D.readonly,S=D.layout||(/top|bottom/.test(D.display)?"liquid":""),_="liquid"==S,V=n.isNumeric(D.select)?D.select:"multiple"==D.select||M.prop("multiple"),A=this.id+"_dummy",N=s('label[for="'+this.id+'"]').attr("for",A),I=D.label!==t?D.label:N.length?N.text():M.attr("name"),L=!!D.data,F=L?!!D.group:s("optgroup",M).length,N=D.group,H=F&&N&&!1!==N.groupWheel,O=F&&N&&H&&!0===N.clustered,P=F&&(!N||!1!==N.header&&!O),N=M.val()||[],Y=[];return e.setVal=function(t,a,s,i,r){V&&(t&&c(t)&&(t=t.split(",")),e._tempSelected[w]=n.arrayToObject(t),i||(e._selected[w]=n.arrayToObject(t)),t=t?t[0]:null),e._setVal(t,a,s,i,r)},e.getVal=function(t,a){var s;return s=V?n.objectToArray(t?e._tempSelected[w]:e._selected[w]):(s=t?e._tempWheelArray:e._hasValue?e._wheelArray:null)?D.group&&a?s:s[w]:null},e.refresh=function(){var t={};a(),D.wheels=o(),d(x),t[w]=l(),e._tempWheelArray[w]=x,H&&(t[g]=r(p,!1,D.groupLabel),e._tempWheelArray[g]=b),e._isVisible&&e.changeWheel(t,0,!0)},D.invalid.length||(D.invalid=Y),H?(g=0,w=1):(g=-1,w=0),V&&(M.prop("multiple",!0),e._selected[w]={},N&&c(N)&&(N=N.split(",")),e._selected[w]=n.arrayToObject(N)),s("#"+A).remove(),M.next().is("input.mbsc-control")?h=M.off(".mbsc-form").next().removeAttr("tabindex"):(h=s('<input type="text" id="'+A+'" class="mbsc-control mbsc-control-ev '+D.inputClass+'" readonly />'),D.showInput&&h.insertBefore(M)),e.attachShow(h.attr("placeholder",D.placeholder||"")),M.addClass("mbsc-sel-hdn").attr("tabindex",-1),a(),d(M.val()),{layout:S,headerText:!1,anchor:h,compClass:"mbsc-sel"+(H?" mbsc-sel-gr-whl":""),setOnTap:!H||[!1,!0],formatValue:function(t){var a,s=[];if(V){for(a in e._tempSelected[w])s.push(T[a]?T[a].text:"");return s.join(", ")}return t=t[w],T[t]?T[t].text:""},parseValue:function(e){return d(e===t?M.val():e),H?[b,x]:[x]},validate:function(e){var e=e.index,a=[];return a[w]=D.invalid,O&&!C&&e===t&&u(),C=!1,{disabled:a}},onRead:m,onFill:m,onBeforeShow:function(){V&&D.counter&&(D.headerText=function(){var t=0;return s.each(e._tempSelected[w],function(){t++}),(t>1?D.selectedPluralText||D.selectedText:D.selectedText).replace(/{count}/,t)}),d(M.val()),e.settings.wheels=o(),C=!0},onWheelGestureStart:function(e){e.index==g&&(D.readonly=[!1,!0])},onWheelAnimationEnd:function(t){var a=e.getArrayVal(!0);t.index==g?(D.readonly=k,a[g]!=b&&(b=a[g],x=v[b].options[0].value,a[w]=x,O?u():e.setArrayVal(a,!1,!1,!0,200))):t.index==w&&a[w]!=x&&(x=a[w],H&&T[x].group!=b&&(b=T[x].group,a[g]=b,e.setArrayVal(a,!1,!1,!0,200)))},onDestroy:function(){h.hasClass("mbsc-control")||h.remove(),M.removeClass("mbsc-sel-hdn").removeAttr("tabindex")}}}}(),function(t){var a=e,s=a.$,n={inputClass:"",values:5,order:"desc",style:"icon",invalid:[],layout:"fixed",icon:{filled:"star3",empty:"star3"}};a.presetShort("rating"),a.presets.scroller.rating=function(e){var c,i,r,l,o,d,m,u=s.extend({},e.settings),h=s.extend(e.settings,n,u),f=s(this),u=this.id+"_dummy",b=s('label[for="'+this.id+'"]').attr("for",u),p=h.label!==t?h.label:b.length?b.text():f.attr("name"),v=h.defaultValue,b=[[]],p={data:[],label:p,circular:!1},g={},x=[],y=!1,T="grade"===h.style?"circle":"icon";if(f.is("select")&&(h.values={},s("option",f).each(function(){h.values[s(this).val()]=s(this).text()}),s("#"+u).remove()),s.isArray(h.values))for(i=0;i<h.values.length;i++)l=+h.values[i],isNaN(l)&&(l=i+1,y=!0),x.push({order:l,key:h.values[i],value:h.values[i]});else if(s.isPlainObject(h.values))for(r in i=1,y=!0,h.values)l=+r,isNaN(l)&&(l=i),x.push({order:l,key:r,value:h.values[r]}),i++;else for(i=1;i<=h.values;i++)x.push({order:i,key:i,value:i});for(h.showText===t&&y&&(h.showText=!0),h.icon.empty===t&&(h.icon.empty=h.icon.filled),x.sort(function(e,t){return"desc"==h.order?t.order-e.order:e.order-t.order}),m="desc"==h.order?x[0].order:x[x.length-1].order,i=0;i<x.length;i++){for(d=x[i].order,l=x[i].key,o=x[i].value,y="",r=1;r<d+1;r++)y+='<span class="mbsc-rating-'+T+("circle"===T?"":" mbsc-ic mbsc-ic-"+h.icon.filled)+' ">'+("circle"==T?r:" ")+"</span>";for(r=d+1;r<=m;r++)y+='<span class="mbsc-rating-'+T+("circle"===T?" mbsc-rating-circle-unf":" mbsc-ic mbsc-ic-"+(h.icon.empty?h.icon.empty+" mbsc-rating-icon-unf":"")+(h.icon.empty===h.icon.filled?" mbsc-rating-icon-same":""))+'"></span>';v===t&&(v=l),y+=h.showText?'<span class="mbsc-rating-txt">'+o+"</span>":"",p.data.push({value:l,display:y,label:o}),g[l]=o}return f.is("select")&&(c=s('<input type="text" id="'+u+'" value="'+g[f.val()]+'" class="'+h.inputClass+'" placeholder="'+(h.placeholder||"")+'" readonly />').insertBefore(f)),b[0].push(p),c&&e.attachShow(c),f.is("select")&&f.hide().closest(".ui-field-contain").trigger("create"),e.getVal=function(t){return t=e._hasValue?e[t?"_tempWheelArray":"_wheelArray"][0]:null,a.util.isNumeric(t)?+t:t},{anchor:c,wheels:b,headerText:!1,compClass:"mbsc-rating",setOnTap:!0,formatValue:function(e){return g[e[0]]},parseValue:function(e){for(var t in g)if(c&&t==e||!c&&g[t]==e)return[t];return[v]},validate:function(){return{disabled:[h.invalid]}},onFill:function(t){c&&(c.val(t.valueText),f.val(e._tempWheelArray[0]))},onDestroy:function(){c&&c.remove(),f.show()}}}}(),function(){e.$.each(["date","time","datetime"],function(t,a){e.presetShort(a)})}(),function(){var t=e,a=t.$,s=t.presets.scroller;t.presetShort("image"),s.image=function(e){return e.settings.enhance&&(e._processMarkup=function(e){var t=e.attr("data-icon");return e.children().each(function(e,t){t=a(t),t.is("img")?a('<div class="mbsc-img-c"></div>').insertAfter(t).append(t.addClass("mbsc-img")):t.is("p")&&t.addClass("mbsc-img-txt")}),t&&e.prepend('<div class="mbsc-ic mbsc-ic-'+t+'"></div'),e.html('<div class="mbsc-img-w">'+e.html()+"</div>"),e.html()}),s.list.call(this,e)}}(),function(t,a,s){var a=e,n=a.$,c=n.extend,i=a.util,r=i.datetime,l=r.adjustedDate,o=a.presets.scroller,d={};a.presetShort("calendar"),o.calendar=function(e){function a(e){return l(e.getFullYear(),e.getMonth(),e.getDate())}var m,u,h,f,b,p,v,g={};v=c({},e.settings);var x=c(e.settings,d,v),y=x.activeClass||"",T="multiple"==x.select||1<x.select||"week"==x.selectType,w=i.isNumeric(x.select)?x.select:1/0,C=!!x.events,M={};if(v=o.calbase.call(this,e),m=c({},v),h=x.firstSelectDay===s?x.firstDay:x.firstSelectDay,T&&x.defaultValue&&x.defaultValue.length)for(f=0;f<x.defaultValue.length;f++)M[a(x.defaultValue[f])]=x.defaultValue[f];return e.onGenMonth=function(t,a){b=e.prepareObj(x.events||x.marked,t,a)},e.getDayProps=function(e){var a,c=T?M[e]!==s:s,i=(e=!!b[e]&&b[e])&&e[0]&&e[0].text,r=e&&e[0]&&e[0].color;if(C&&i)if(r)if(g[r])a=g[r];else{a=n('<div style="background-color:'+r+';"></div>').appendTo("body");var l=(t.getComputedStyle?getComputedStyle(a[0]):a[0].style).backgroundColor.replace(/rgb|rgba|\(|\)|\s/g,"").split(","),l=130<.299*l[0]+.587*l[1]+.114*l[2]?"#000":"#fff";a.remove(),a=g[r]=l}else a=void 0;else a="";var l=a,o="",d="";if(e){for(a=0;a<e.length;a++)e[a].icon&&(o+='<span class="mbsc-ic mbsc-ic-'+e[a].icon+'"'+(e[a].text?"":e[a].color?' style="color:'+e[a].color+';"':"")+"></span>\n");for(d='<div class="mbsc-cal-day-m"><div class="mbsc-cal-day-m-t">',a=0;a<e.length;a++)d+='<div class="mbsc-cal-day-m-c"'+(e[a].color?' style="background:'+e[a].color+';"':"")+"></div>";d+="</div></div>"}return{marked:e,selected:c,cssClass:e?"mbsc-cal-day-marked":"",ariaLabel:C?i:"",markup:C&&i?'<div class="mbsc-cal-day-txt-c"><div class="mbsc-cal-day-txt" title="'+n("<div>"+i+"</div>").text()+'"'+(r?' style="background:'+r+";color:"+l+';text-shadow:none;"':"")+">"+o+i+"</div></div>":C&&o?'<div class="mbsc-cal-day-ic-c">'+o+"</div>":e?d:""}},e.addValue=function(t){M[a(t)]=t,e.refresh()},e.removeValue=function(t){delete M[a(t)],e.refresh()},e.setVal=function(t,s,n,c,i){if(T){var r=t;if(M={},r&&r.length)for(f=0;f<r.length;f++)M[a(r[f])]=r[f];t=t?t[0]:null}e._setVal(t,s,n,c,i),e.refresh()},e.getVal=function(t){return T?i.objectToArray(M):e.getDate(t)},c(v,{highlight:!T,outerMonthChange:!T,parseValue:function(t){var s,n;if(T&&t&&"string"==typeof t){for(M={},t=t.split(","),s=0;s<t.length;s++)n=r.parseDate(e.format,t[s].replace(/^\s+|\s+$/g,""),x),M[a(n)]=n;t=t[0]}return T&&x.defaultValue&&x.defaultValue.length&&(x.defaultValue=x.defaultValue[0]),m.parseValue.call(this,t)},formatValue:function(t){var a,s=[];if(T){for(a in M)s.push(r.formatDate(e.format,M[a],x));return s.join(", ")}return m.formatValue.call(this,t)},onClear:function(){T&&(M={},e.refresh())},onBeforeShow:function(){x.setOnDayTap!==s||x.buttons&&x.buttons.length||(x.setOnDayTap=!0),
	x.setOnDayTap&&(x.outerMonthChange=!1),x.counter&&T&&(x.headerText=function(){var e=0,t="week"==x.selectType?7:1;return n.each(M,function(){e++}),e=Math.round(e/t),(e>1?x.selectedPluralText||x.selectedText:x.selectedText).replace(/{count}/,e)})},onMarkupReady:function(e){m.onMarkupReady.call(this,e),u=n(e.target),T&&(n(".mbsc-fr-hdr",u).attr("aria-live","off"),p=c({},M)),C&&n(".mbsc-cal",u).addClass("mbsc-cal-ev")},onDayChange:function(t){var s=t.date,c=a(s),r=n(t.target),t=t.selected;if(T)if("week"==x.selectType){var o,d=c.getDay()-h,d=0>d?7+d:d;for("multiple"!=x.select&&(M={}),r=0;7>r;r++)o=l(c.getFullYear(),c.getMonth(),c.getDate()-d+r),t?delete M[o]:i.objectToArray(M).length/7<w&&(M[o]=o);e.refresh()}else r=n('.mbsc-cal .mbsc-cal-day[data-full="'+r.attr("data-full")+'"]',u),t?(r.removeClass("mbsc-cal-day-sel").removeAttr("aria-selected").find(".mbsc-cal-day-i").removeClass(y),delete M[c]):i.objectToArray(M).length<w&&(r.addClass("mbsc-cal-day-sel").attr("aria-selected","true").find(".mbsc-cal-day-i").addClass(y),M[c]=c);if(x.setOnDayTap&&"multiple"!=x.select&&"inline"!=x.display)return e.needsSlide=!1,e.setDate(s),e.select(),!1},onCancel:function(){!e.live&&T&&(M=c({},p))}}),v}}(window,document),function(t){var a=e,s=a.$,n={wheelOrder:"hhiiss",useShortLabels:!1,min:0,max:1/0,labels:"Years,Months,Days,Hours,Minutes,Seconds".split(","),labelsShort:"Yrs,Mths,Days,Hrs,Mins,Secs".split(",")};a.presetShort("timespan"),a.presets.scroller.timespan=function(e){function c(e){var t={};return s(v).each(function(a,s){t[s]=T[s]?Math.floor(e/g[s].limit):0,e-=t[s]*g[s].limit}),t}function i(e){var t=!1,a=y[T[e]-1]||1,s=g[e],n=s.label,c=s.wheel;if(c.data=[],c.label=s.label,p.match(RegExp(s.re+s.re,"i"))&&(t=!0),e==w)c.min=u[e],c.max=h[e],c.data=function(e){return{value:e,display:r(e*a,t,n)}},c.getIndex=function(e){return Math.round(e/a)};else for(o=0;o<=s.until;o+=a)c.data.push({value:o,display:r(o,t,n)})}function r(e,t,a){return(10>e&&t?"0":"")+e+'<span class="mbsc-ts-lbl">'+a+"</span>"}function l(e){var t=0;return s.each(x,function(a,s){isNaN(+e[0])||(t+=g[s.v].limit*e[a])}),t}var o,d,m,u,h,f=s.extend({},e.settings),b=s.extend(e.settings,n,f),p=b.wheelOrder,f=b.useShortLabels?b.labelsShort:b.labels,v="years,months,days,hours,minutes,seconds".split(","),g={years:{ord:0,index:6,until:10,limit:31536e6,label:f[0],re:"y",wheel:{}},months:{ord:1,index:5,until:11,limit:2592e6,label:f[1],re:"m",wheel:{}},days:{ord:2,index:4,until:31,limit:864e5,label:f[2],re:"d",wheel:{}},hours:{ord:3,index:3,until:23,limit:36e5,label:f[3],re:"h",wheel:{}},minutes:{ord:4,index:2,until:59,limit:6e4,label:f[4],re:"i",wheel:{}},seconds:{ord:5,index:1,until:59,limit:1e3,label:f[5],re:"s",wheel:{}}},x=[],y=b.steps||[],T={},w="seconds",C=b.defaultValue||Math.max(b.min,Math.min(0,b.max)),M=[[]];return s(v).each(function(e,t){d=p.search(RegExp(g[t].re,"i")),-1<d&&(x.push({o:d,v:t}),g[t].index>g[w].index&&(w=t))}),x.sort(function(e,t){return e.o>t.o?1:-1}),s.each(x,function(e,t){T[t.v]=e+1,M[0].push(g[t.v].wheel)}),u=c(b.min),h=c(b.max),s.each(x,function(e,t){i(t.v)}),e.getVal=function(t,a){return a?e._getVal(t):e._hasValue||t?l(e.getArrayVal(t)):null},{showLabel:!0,wheels:M,compClass:"mbsc-ts",parseValue:function(e){var t,n=[];return a.util.isNumeric(e)||!e?(m=c(e||C),s.each(x,function(e,t){n.push(m[t.v])})):s.each(x,function(a,s){t=RegExp("(\\d+)\\s?("+b.labels[g[s.v].ord]+"|"+b.labelsShort[g[s.v].ord]+")","gi").exec(e),n.push(t?t[1]:0)}),s(n).each(function(e,t){n[e]=Math.floor(t/(y[e]||1))*(y[e]||1)}),n},formatValue:function(e){var t="";return s.each(x,function(a,s){t+=+e[a]?e[a]+" "+g[s.v].label+" ":""}),t.replace(/\s+$/g,"")},validate:function(a){var n,i,r,o,d=a.values,m=a.direction,f=[],b=!0,p=!0;return s(v).each(function(a,v){if(T[v]!==t){if(r=T[v]-1,f[r]=[],o={},v!=w){if(b)for(i=h[v]+1;i<=g[v].until;i++)o[i]=!0;if(p)for(i=0;i<u[v];i++)o[i]=!0}d[r]=e.getValidValue(r,d[r],m,o),n=c(l(d)),b=b&&n[v]==h[v],p=p&&n[v]==u[v],s.each(o,function(e){f[r].push(e)})}}),{disabled:f}}}}}(),function(){var t=e,a=t.presets.scroller;a.treelist=a.list,t.presetShort("list"),t.presetShort("treelist")}(),function(){function t(e,t){var s=o(t,"X",!0),c=o(t,"Y",!0),r=e.offset(),l=s-r.left,d=c-r.top,l=Math.max(l,e[0].offsetWidth-l),d=Math.max(d,e[0].offsetHeight-d),d=2*Math.sqrt(Math.pow(l,2)+Math.pow(d,2));a(n),n=i('<span class="mbsc-ripple"></span>').css({width:d,height:d,top:c-r.top-d/2,left:s-r.left-d/2}).appendTo(e),setTimeout(function(){n.addClass("mbsc-ripple-scaled mbsc-ripple-visible")},10)}function a(e){setTimeout(function(){e&&(e.removeClass("mbsc-ripple-visible"),setTimeout(function(){e.remove()},2e3))},100)}var s,n,c=e,i=c.$,r=c.util,l=r.testTouch,o=r.getCoord;c.themes.material={addRipple:t,removeRipple:function(){a(n)},initRipple:function(e,c,r,d){var m,u;e.off(".mbsc-ripple").on("touchstart.mbsc-ripple mousedown.mbsc-ripple",c,function(e){l(e,this)&&(m=o(e,"X"),u=o(e,"Y"),s=i(this),s.hasClass(r)||s.hasClass(d)?s=null:t(s,e))}).on("touchmove.mbsc-ripple mousemove.mbsc-ripple",c,function(e){(s&&9<Math.abs(o(e,"X")-m)||9<Math.abs(o(e,"Y")-u))&&(a(n),s=null)}).on("touchend.mbsc-ripple touchcancel.mbsc-ripple mouseleave.mbsc-ripple mouseup.mbsc-ripple",c,function(){s&&(setTimeout(function(){a(n)},100),s=null)})}}}(),function(){var t=e.$;e.themes.frame["material-dark"]={baseTheme:"material",showLabel:!1,headerText:!1,btnWidth:!1,selectedLineHeight:!0,selectedLineBorder:2,dateOrder:"MMddyy",weekDays:"min",deleteIcon:"material-backspace",icon:{filled:"material-star",empty:"material-star-outline"},checkIcon:"material-check",btnPlusClass:"mbsc-ic mbsc-ic-material-keyboard-arrow-down",btnMinusClass:"mbsc-ic mbsc-ic-material-keyboard-arrow-up",btnCalPrevClass:"mbsc-ic mbsc-ic-material-keyboard-arrow-left",btnCalNextClass:"mbsc-ic mbsc-ic-material-keyboard-arrow-right",onMarkupReady:function(a){e.themes.material.initRipple(t(a.target),".mbsc-fr-btn-e","mbsc-fr-btn-d","mbsc-fr-btn-nhl")},onEventBubbleShow:function(e){var a=t(e.eventList),e=2>t(e.target).closest(".mbsc-cal-row").index(),s=t(".mbsc-cal-event-color",a).eq(e?0:-1).css("background-color");t(".mbsc-cal-events-arr",a).css("border-color",e?"transparent transparent "+s+" transparent":s+"transparent transparent transparent")}},e.themes.listview["material-dark"]={baseTheme:"material",onItemActivate:function(a){e.themes.material.addRipple(t(a.target),a.domEvent)},onItemDeactivate:function(){e.themes.material.removeRipple()},onSlideStart:function(e){t(".mbsc-ripple",e).remove()},onSortStart:function(e){t(".mbsc-ripple",e.target).remove()}},e.themes.menustrip["material-dark"]={baseTheme:"material",onInit:function(){e.themes.material.initRipple(t(this),".mbsc-ms-item","mbsc-btn-d","mbsc-btn-nhl")}},e.themes.form["material-dark"]={baseTheme:"material",onControlActivate:function(a){var s,n=t(a.target);"button"!=n[0].type&&"submit"!=n[0].type||(s=n),"segmented"==n.attr("data-role")&&(s=n.next()),n.hasClass("mbsc-stepper-control")&&!n.hasClass("mbsc-step-disabled")&&(s=n.find(".mbsc-segmented-content")),s&&e.themes.material.addRipple(s,a.domEvent)},onControlDeactivate:function(){e.themes.material.removeRipple()}},e.themes.progress["material-dark"]={baseTheme:"material"}}(),function(){var t=e.$;e.themes.frame["wp-light"]={baseTheme:"wp",minWidth:76,height:76,dateDisplay:"mmMMddDDyy",headerText:!1,showLabel:!1,deleteIcon:"backspace4",icon:{filled:"star3",empty:"star"},btnWidth:!1,btnCalPrevClass:"mbsc-ic mbsc-ic-arrow-left2",btnCalNextClass:"mbsc-ic mbsc-ic-arrow-right2",btnPlusClass:"mbsc-ic mbsc-ic-plus",btnMinusClass:"mbsc-ic mbsc-ic-minus",onMarkupInserted:function(e,a){var s,n,c,i=e.target,r=a.settings;t(".mbsc-sc-whl",i).on("touchstart mousedown wheel mousewheel",function(e){var a;(a="mousedown"===e.type&&n)||(a=t(this).attr("data-index"),a=t.isArray(r.readonly)?r.readonly[a]:r.readonly),a||(n="touchstart"===e.type,s=!0,c=t(this).hasClass("mbsc-sc-whl-wpa"),t(".mbsc-sc-whl",i).removeClass("mbsc-sc-whl-wpa"),t(this).addClass("mbsc-sc-whl-wpa"))}).on("touchmove mousemove",function(){s=!1}).on("touchend mouseup",function(e){s&&c&&t(e.target).closest(".mbsc-sc-itm").hasClass("mbsc-sc-itm-sel")&&t(this).removeClass("mbsc-sc-whl-wpa"),"mouseup"===e.type&&(n=!1),s=!1})},onInit:function(e,t){var a=t.buttons;a.set.icon="checkmark",a.cancel.icon="close",a.clear.icon="close",a.ok&&(a.ok.icon="checkmark"),a.close&&(a.close.icon="close"),a.now&&(a.now.icon="loop2"),a.toggle&&(a.toggle.icon="play3"),a.start&&(a.start.icon="play3"),a.stop&&(a.stop.icon="pause2"),a.reset&&(a.reset.icon="stop2"),a.lap&&(a.lap.icon="loop2"),a.hide&&(a.hide.icon="close")}},e.themes.listview["wp-light"]={baseTheme:"wp"},e.themes.menustrip["wp-light"]={baseTheme:"wp"},e.themes.form["wp-light"]={baseTheme:"wp"},e.themes.progress["wp-light"]={baseTheme:"wp"}}(),e.themes.frame["mobiscroll-dark"]={baseTheme:"mobiscroll",rows:5,showLabel:!1,headerText:!1,btnWidth:!1,selectedLineHeight:!0,selectedLineBorder:1,dateOrder:"MMddyy",weekDays:"min",checkIcon:"ion-ios7-checkmark-empty",btnPlusClass:"mbsc-ic mbsc-ic-arrow-down5",btnMinusClass:"mbsc-ic mbsc-ic-arrow-up5",btnCalPrevClass:"mbsc-ic mbsc-ic-arrow-left5",btnCalNextClass:"mbsc-ic mbsc-ic-arrow-right5"},e.themes.listview["mobiscroll-dark"]={baseTheme:"mobiscroll"},e.themes.menustrip["mobiscroll-dark"]={baseTheme:"mobiscroll"},e.themes.form["mobiscroll-dark"]={baseTheme:"mobiscroll"},e.themes.progress["mobiscroll-dark"]={baseTheme:"mobiscroll"},e.themes.frame["android-holo-light"]={baseTheme:"android-holo",dateOrder:"Mddyy",rows:5,minWidth:76,height:36,showLabel:!1,selectedLineHeight:!0,selectedLineBorder:2,useShortLabels:!0,icon:{filled:"star3",empty:"star"},btnPlusClass:"mbsc-ic mbsc-ic-arrow-down6",btnMinusClass:"mbsc-ic mbsc-ic-arrow-up6"},e.themes.listview["android-holo-light"]={baseTheme:"android-holo"},e.themes.menustrip["android-holo-light"]={baseTheme:"android-holo"},e.themes.form["android-holo-light"]={baseTheme:"android-holo"},e.themes.progress["android-holo-light"]={baseTheme:"android-holo"},function(){var t,a,s,n=e,c=n.themes,i=n.$;a=navigator.userAgent.match(/Android|iPhone|iPad|iPod|Windows|Windows Phone|MSIE/i),/Android/i.test(a)?(t="android-holo",(a=navigator.userAgent.match(/Android\s+([\d\.]+)/i))&&(a=a[0].replace("Android ",""),t=5<=a.split(".")[0]?"material":4<=a.split(".")[0]?"android-holo":"android")):/iPhone/i.test(a)||/iPad/i.test(a)||/iPod/i.test(a)?(t="ios",(a=navigator.userAgent.match(/OS\s+([\d\_]+)/i))&&(a=a[0].replace(/_/g,".").replace("OS ",""),t="7"<=a?"ios":"ios-classic")):(/Windows/i.test(a)||/MSIE/i.test(a)||/Windows Phone/i.test(a))&&(t="wp"),i.each(c,function(e,a){if(i.each(a,function(e,a){return a.baseTheme==t?(n.autoTheme=e,s=!0,!1):void(e==t&&(n.autoTheme=e))}),s)return!1})}(),e});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 20 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * Created by admin on 2016/8/17.
	 * 微信分享
	 */
	var wx = __webpack_require__(22);
	var imageUrl = "http://www.li-li.cn/app/icon.png";
	var wxConfig = {
	
	    wxConfig: function (type) {
	        var url = window.location.href;
	        var urlArr = url.split("#");
	        var noncestr = "";
	        var signature = "";
	        var timestamp = "";
	        $.ajax({
	            type: "get",
	            url: "http://www.li-li.cn/llwx/wx/jsOauth",
	            data: {
	                url: urlArr[0]
	            },
	            dataType: "json",
	            async: false,
	            success: function (data) {
	                if (data.code == 0) {
	                    console.log(data);
	                    var data = data.data;
	                    noncestr = data.noncestr;
	                    signature = data.signature;
	                    timestamp = data.timestamp;
	                }
	            }
	        });
	        wx.config({
	            debug: false,
	            //appId: "wx82c10b61c95e9f30",//正式
	            appId: "wxd8c1d6ab5eb3c981",//测试
	            timestamp: timestamp,//时间戳
	            nonceStr: noncestr,//随机串
	            signature: signature,//签名
	            jsApiList: [
	                'onMenuShareTimeline',
	                'onMenuShareAppMessage',
	                'hideAllNonBaseMenuItem',
	                'showMenuItems',
	                'getLocation'
	            ]
	        });
	
	        wx.ready(function () {
	            //隐藏其他选项
	            wx.hideAllNonBaseMenuItem();
	        })
	    },
	    wxShare: function (title, desc, link) {
	        wx.showMenuItems({
	            menuList: ["menuItem:share:appMessage", "menuItem:share:timeline"] // 要显示的菜单项，所有menu项见附录3
	        });
	        //获取"分享给朋友"按钮点击状态及自定义分享内容接口
	        wx.onMenuShareAppMessage({
	            title: title,
	            desc: desc,
	            link: link,
	            imgUrl: imageUrl,
	            type: "link",//分享类型，music、video或link，不填默认为link
	        });
	        //获取"分享到朋友圈"按钮点击状态及自定义分享内容接口
	        wx.onMenuShareTimeline({
	            title: title,
	            link: link,
	            imgUrl: imageUrl
	        });
	    },
	    getWx: function () {
	        return wx;
	    },
	
	    wxLocation: function () {
	        wx.getLocation({
	            success: function (res) {
	                return res.latitude + "," + res.longitude;
	            },
	            cancel: function (res) {
	                //alert('用户拒绝授权获取地理位置');
	            }
	        });
	    },
	}
	
	module.exports = wxConfig;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!function(a,b){ true?!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return b(a)}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):b(a,!0);}(window,function(a,b){function c(b,c,d){a.WeixinJSBridge?WeixinJSBridge.invoke(b,e(c),function(a){g(b,a,d)}):j(b,d)}function d(b,c,d){a.WeixinJSBridge?WeixinJSBridge.on(b,function(a){d&&d.trigger&&d.trigger(a),g(b,a,c)}):d?j(b,d):j(b,c)}function e(a){return a=a||{},a.appId=E.appId,a.verifyAppId=E.appId,a.verifySignType="sha1",a.verifyTimestamp=E.timestamp+"",a.verifyNonceStr=E.nonceStr,a.verifySignature=E.signature,a}function f(a){return{timeStamp:a.timestamp+"",nonceStr:a.nonceStr,"package":a.package,paySign:a.paySign,signType:a.signType||"SHA1"}}function g(a,b,c){var d,e,f;switch(delete b.err_code,delete b.err_desc,delete b.err_detail,d=b.errMsg,d||(d=b.err_msg,delete b.err_msg,d=h(a,d),b.errMsg=d),c=c||{},c._complete&&(c._complete(b),delete c._complete),d=b.errMsg||"",E.debug&&!c.isInnerInvoke&&alert(JSON.stringify(b)),e=d.indexOf(":"),f=d.substring(e+1)){case"ok":c.success&&c.success(b);break;case"cancel":c.cancel&&c.cancel(b);break;default:c.fail&&c.fail(b)}c.complete&&c.complete(b)}function h(a,b){var e,f,c=a,d=p[c];return d&&(c=d),e="ok",b&&(f=b.indexOf(":"),e=b.substring(f+1),"confirm"==e&&(e="ok"),"failed"==e&&(e="fail"),-1!=e.indexOf("failed_")&&(e=e.substring(7)),-1!=e.indexOf("fail_")&&(e=e.substring(5)),e=e.replace(/_/g," "),e=e.toLowerCase(),("access denied"==e||"no permission to execute"==e)&&(e="permission denied"),"config"==c&&"function not exist"==e&&(e="ok"),""==e&&(e="fail")),b=c+":"+e}function i(a){var b,c,d,e;if(a){for(b=0,c=a.length;c>b;++b)d=a[b],e=o[d],e&&(a[b]=e);return a}}function j(a,b){if(!(!E.debug||b&&b.isInnerInvoke)){var c=p[a];c&&(a=c),b&&b._complete&&delete b._complete,console.log('"'+a+'",',b||"")}}function k(){0!=D.preVerifyState&&(u||v||E.debug||"6.0.2">z||D.systemType<0||A||(A=!0,D.appId=E.appId,D.initTime=C.initEndTime-C.initStartTime,D.preVerifyTime=C.preVerifyEndTime-C.preVerifyStartTime,H.getNetworkType({isInnerInvoke:!0,success:function(a){var b,c;D.networkType=a.networkType,b="http://open.weixin.qq.com/sdk/report?v="+D.version+"&o="+D.preVerifyState+"&s="+D.systemType+"&c="+D.clientVersion+"&a="+D.appId+"&n="+D.networkType+"&i="+D.initTime+"&p="+D.preVerifyTime+"&u="+D.url,c=new Image,c.src=b}})))}function l(){return(new Date).getTime()}function m(b){w&&(a.WeixinJSBridge?b():q.addEventListener&&q.addEventListener("WeixinJSBridgeReady",b,!1))}function n(){H.invoke||(H.invoke=function(b,c,d){a.WeixinJSBridge&&WeixinJSBridge.invoke(b,e(c),d)},H.on=function(b,c){a.WeixinJSBridge&&WeixinJSBridge.on(b,c)})}var o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H;if(!a.jWeixin)return o={config:"preVerifyJSAPI",onMenuShareTimeline:"menu:share:timeline",onMenuShareAppMessage:"menu:share:appmessage",onMenuShareQQ:"menu:share:qq",onMenuShareWeibo:"menu:share:weiboApp",onMenuShareQZone:"menu:share:QZone",previewImage:"imagePreview",getLocation:"geoLocation",openProductSpecificView:"openProductViewWithPid",addCard:"batchAddCard",openCard:"batchViewCard",chooseWXPay:"getBrandWCPayRequest"},p=function(){var b,a={};for(b in o)a[o[b]]=b;return a}(),q=a.document,r=q.title,s=navigator.userAgent.toLowerCase(),t=navigator.platform.toLowerCase(),u=!(!t.match("mac")&&!t.match("win")),v=-1!=s.indexOf("wxdebugger"),w=-1!=s.indexOf("micromessenger"),x=-1!=s.indexOf("android"),y=-1!=s.indexOf("iphone")||-1!=s.indexOf("ipad"),z=function(){var a=s.match(/micromessenger\/(\d+\.\d+\.\d+)/)||s.match(/micromessenger\/(\d+\.\d+)/);return a?a[1]:""}(),A=!1,B=!1,C={initStartTime:l(),initEndTime:0,preVerifyStartTime:0,preVerifyEndTime:0},D={version:1,appId:"",initTime:0,preVerifyTime:0,networkType:"",preVerifyState:1,systemType:y?1:x?2:-1,clientVersion:z,url:encodeURIComponent(location.href)},E={},F={_completes:[]},G={state:0,data:{}},m(function(){C.initEndTime=l()}),H={config:function(a){E=a,j("config",a);var b=E.check===!1?!1:!0;m(function(){var a,d,e;if(b)c(o.config,{verifyJsApiList:i(E.jsApiList)},function(){F._complete=function(a){C.preVerifyEndTime=l(),G.state=1,G.data=a},F.success=function(){D.preVerifyState=0},F.fail=function(a){F._fail?F._fail(a):G.state=-1};var a=F._completes;return a.push(function(){k()}),F.complete=function(){for(var c=0,d=a.length;d>c;++c)a[c]();F._completes=[]},F}()),C.preVerifyStartTime=l();else{for(G.state=1,a=F._completes,d=0,e=a.length;e>d;++d)a[d]();F._completes=[]}}),E.beta&&n()},ready:function(a){0!=G.state?a():(F._completes.push(a),!w&&E.debug&&a())},error:function(a){"6.0.2">z||B||(B=!0,-1==G.state?a(G.data):F._fail=a)},checkJsApi:function(a){var b=function(a){var c,d,b=a.checkResult;for(c in b)d=p[c],d&&(b[d]=b[c],delete b[c]);return a};c("checkJsApi",{jsApiList:i(a.jsApiList)},function(){return a._complete=function(a){if(x){var c=a.checkResult;c&&(a.checkResult=JSON.parse(c))}a=b(a)},a}())},onMenuShareTimeline:function(a){d(o.onMenuShareTimeline,{complete:function(){c("shareTimeline",{title:a.title||r,desc:a.title||r,img_url:a.imgUrl||"",link:a.link||location.href,type:a.type||"link",data_url:a.dataUrl||""},a)}},a)},onMenuShareAppMessage:function(a){d(o.onMenuShareAppMessage,{complete:function(){c("sendAppMessage",{title:a.title||r,desc:a.desc||"",link:a.link||location.href,img_url:a.imgUrl||"",type:a.type||"link",data_url:a.dataUrl||""},a)}},a)},onMenuShareQQ:function(a){d(o.onMenuShareQQ,{complete:function(){c("shareQQ",{title:a.title||r,desc:a.desc||"",img_url:a.imgUrl||"",link:a.link||location.href},a)}},a)},onMenuShareWeibo:function(a){d(o.onMenuShareWeibo,{complete:function(){c("shareWeiboApp",{title:a.title||r,desc:a.desc||"",img_url:a.imgUrl||"",link:a.link||location.href},a)}},a)},onMenuShareQZone:function(a){d(o.onMenuShareQZone,{complete:function(){c("shareQZone",{title:a.title||r,desc:a.desc||"",img_url:a.imgUrl||"",link:a.link||location.href},a)}},a)},startRecord:function(a){c("startRecord",{},a)},stopRecord:function(a){c("stopRecord",{},a)},onVoiceRecordEnd:function(a){d("onVoiceRecordEnd",a)},playVoice:function(a){c("playVoice",{localId:a.localId},a)},pauseVoice:function(a){c("pauseVoice",{localId:a.localId},a)},stopVoice:function(a){c("stopVoice",{localId:a.localId},a)},onVoicePlayEnd:function(a){d("onVoicePlayEnd",a)},uploadVoice:function(a){c("uploadVoice",{localId:a.localId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},downloadVoice:function(a){c("downloadVoice",{serverId:a.serverId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},translateVoice:function(a){c("translateVoice",{localId:a.localId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},chooseImage:function(a){c("chooseImage",{scene:"1|2",count:a.count||9,sizeType:a.sizeType||["original","compressed"],sourceType:a.sourceType||["album","camera"]},function(){return a._complete=function(a){if(x){var b=a.localIds;b&&(a.localIds=JSON.parse(b))}},a}())},previewImage:function(a){c(o.previewImage,{current:a.current,urls:a.urls},a)},uploadImage:function(a){c("uploadImage",{localId:a.localId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},downloadImage:function(a){c("downloadImage",{serverId:a.serverId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},getNetworkType:function(a){var b=function(a){var c,d,e,b=a.errMsg;if(a.errMsg="getNetworkType:ok",c=a.subtype,delete a.subtype,c)a.networkType=c;else switch(d=b.indexOf(":"),e=b.substring(d+1)){case"wifi":case"edge":case"wwan":a.networkType=e;break;default:a.errMsg="getNetworkType:fail"}return a};c("getNetworkType",{},function(){return a._complete=function(a){a=b(a)},a}())},openLocation:function(a){c("openLocation",{latitude:a.latitude,longitude:a.longitude,name:a.name||"",address:a.address||"",scale:a.scale||28,infoUrl:a.infoUrl||""},a)},getLocation:function(a){a=a||{},c(o.getLocation,{type:a.type||"wgs84"},function(){return a._complete=function(a){delete a.type},a}())},hideOptionMenu:function(a){c("hideOptionMenu",{},a)},showOptionMenu:function(a){c("showOptionMenu",{},a)},closeWindow:function(a){a=a||{},c("closeWindow",{},a)},hideMenuItems:function(a){c("hideMenuItems",{menuList:a.menuList},a)},showMenuItems:function(a){c("showMenuItems",{menuList:a.menuList},a)},hideAllNonBaseMenuItem:function(a){c("hideAllNonBaseMenuItem",{},a)},showAllNonBaseMenuItem:function(a){c("showAllNonBaseMenuItem",{},a)},scanQRCode:function(a){a=a||{},c("scanQRCode",{needResult:a.needResult||0,scanType:a.scanType||["qrCode","barCode"]},function(){return a._complete=function(a){var b,c;y&&(b=a.resultStr,b&&(c=JSON.parse(b),a.resultStr=c&&c.scan_code&&c.scan_code.scan_result))},a}())},openProductSpecificView:function(a){c(o.openProductSpecificView,{pid:a.productId,view_type:a.viewType||0,ext_info:a.extInfo},a)},addCard:function(a){var e,f,g,h,b=a.cardList,d=[];for(e=0,f=b.length;f>e;++e)g=b[e],h={card_id:g.cardId,card_ext:g.cardExt},d.push(h);c(o.addCard,{card_list:d},function(){return a._complete=function(a){var c,d,e,b=a.card_list;if(b){for(b=JSON.parse(b),c=0,d=b.length;d>c;++c)e=b[c],e.cardId=e.card_id,e.cardExt=e.card_ext,e.isSuccess=e.is_succ?!0:!1,delete e.card_id,delete e.card_ext,delete e.is_succ;a.cardList=b,delete a.card_list}},a}())},chooseCard:function(a){c("chooseCard",{app_id:E.appId,location_id:a.shopId||"",sign_type:a.signType||"SHA1",card_id:a.cardId||"",card_type:a.cardType||"",card_sign:a.cardSign,time_stamp:a.timestamp+"",nonce_str:a.nonceStr},function(){return a._complete=function(a){a.cardList=a.choose_card_info,delete a.choose_card_info},a}())},openCard:function(a){var e,f,g,h,b=a.cardList,d=[];for(e=0,f=b.length;f>e;++e)g=b[e],h={card_id:g.cardId,code:g.code},d.push(h);c(o.openCard,{card_list:d},a)},chooseWXPay:function(a){c(o.chooseWXPay,f(a),a)}},b&&(a.wx=a.jWeixin=H),H});


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {var Dom = __webpack_require__(17);
	var Ajax = {
	    init: function() {
	        setInterval(function () {
	            $.get("http://www.li-li.cn/llwx/common/heartbeat", function (data) {
	                //alert(data);
	            });
	        }, 20 * 60 * 1000);
	    },
	    //首页获取用户信息
	    getUserInformation2: function() {
	        $.ajax({
	            type: "get",
	            url: "http://www.li-li.cn/llwx/user/detail",
	            dataType: "json",
	            async: false,
	            success: function (data) {
	                if (data.code == 0) {
	                    nickName = data.data.nickName;
	                }
	            }
	        });
	    },
	    //月历页面的数据加载
	    //判断当前页面时间范围内的事件，并在有时间的日期下方加点
	    getEventOfMonth: function() {
	        var dateItem = Dom.getDateList();
	        //console.log(dateItem);
	        var startTime = dateItem.eq(0).attr('id'),
	            endTime = dateItem.eq(dateItem.size() - 1).attr('id');
	        var html = "<span class='date-dot back6c opa7'></span>";
	        $.ajax({
	            type: "get",
	            url: "http://www.li-li.cn/llwx/event/hasornot",
	            data: {
	                startTime: startTime,
	                endTime: endTime
	            },
	            dataType: "json",
	            success: function (data) {
	                //console.log(data);
	                if (data.code == 0) {
	                    var list = data.data;
	                    function td(time) {//处理请求到的时间格式
	                        var timeArr = time.split(" ");
	                        var dateArr = timeArr[0].split("-");
	                        return dateArr[0] + "-" + parseInt(dateArr[1]) + "-" + parseInt(dateArr[2]);
	                    };
	                    for (var i = 0; i < dateItem.size(); i++) {
	                        if (dateItem.eq(i).attr('id')) {
	                            for (var j = 0; j < list.length; j++) {
	                                if (dateItem.eq(i).attr('id') == td(list[j].date) && list[j].flag) {
	                                    dateItem.eq(i).append(html);
	                                }
	                            };
	                        }
	                    };
	                };
	            }
	        });
	    },
	    //获取一天的事件
	    getEventOfDay: function(dateTime) {
	        var template = $('#eventListTemplate').html();
	        $.ajax({
	            type: "get",
	            url: "http://www.li-li.cn/llwx/event/getEventOfDay",
	            data: {
	                dateTime: dateTime,
	            },
	            dataType: "json",
	            success: function (data) {
	                //console.log(data);
	                if (data.code == 0) {
	                    var eventList = data.data;
	                    if (eventList.length > 0) {
	                        var html = "",mark = "",joinerNum;
	                        $('.scheduleBg').css("display", "none");
	                        $('.scheduleCon').css("display", "block");
	                        $('.scheduleCon').html("");
	                        for (var i = 0; i < eventList.length; i++) {
	                            if (eventList[i].isOwner) {
	                                mark = "@";
	                                if (eventList[i].joiners != null && eventList[i].joiners[0]) {
	                                    joinerNum = parseInt(eventList[i].joiners.length)+1;
	                                    html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, joinerNum + "人").replace(/{{user}}/g, mark + eventList[i].joiners[0].nickName);
	                                }else{
	                                    html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, "").replace(/{{user}}/g, "");
	                                }
	                            } else {
	                                mark = "#";
	                                joinerNum = parseInt(eventList[i].joiners.length)+1;
	                                html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, joinerNum + "人").replace(/{{user}}/g, mark+eventList[i].owner.nickName);
	                            }
	
	                        }
	                        $('.scheduleCon').append(html);
	                        $('.list').on('tap', function () {//点击日程跳转至详情页
	                            var eventId = $(this).attr('id');
	                            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/showEvent.html?eventId=" + eventId);
	                        });
	                    } else {
	                        $('.scheduleBg').css("display", "block");
	                        $('.scheduleCon').css("display", "none");
	                    }
	                }
	                if ($('.almanac').css("left") == "0px") {
	                    var almaHeight = parseInt($('.almanac').css('height'));
	                    $('.schedule').css('height', 40 + almaHeight + "px");
	                } else {
	                    var scheHeight = parseInt($('.scheduleList').css('height'));
	                    $('.schedule').css('height', 40 + scheHeight + "px");
	                }
	                //日程日期字符串的截取
	                function transHour(time) {
	                    var timeArr = time.split(" ");
	                    var hourArr = timeArr[1].split(":");
	                    return hourArr[0] + ":" + hourArr[1];
	                }
	            }
	        })
	    },
	    //获得黄历
	    getFortune: function(dateTime) {
	        var dateTime = dateTime + " 08:00:00";
	        $.ajax({
	            type: "get",
	            url: "http://www.li-li.cn/llwx/fortune/get",
	            data: {
	                dateTime: dateTime,
	            },
	            dataType: "json",
	            success: function (data) {
	                var data = data.data;
	                $('.pubSuitMatter').html(" ");
	                $('.tabooMatter').html(" ");
	                if (data.personal) {
	                    $('.alConBg').css("display", "none");
	                    $('.content').css("display", "block");
	                    $('.alterBirthday').css("display","block");//若用户设置过生日，则修改生日显示
	                    $('.suitColor').html("");
	                    $('.suitMatter').html("");
	                    var personal = data.personal;
	                    var personalType2 = personal.type2.replace(/\，/g, "&nbsp;&nbsp;");
	                    var personalColor = "<span>" + personalType2 + "</span>";
	                    if (personal.type3) {
	                        var personalType3 = personal.type3.replace(/\,/g, "&nbsp;&nbsp;");
	                        var personalMatter = "";
	                        personalMatter += "<span>" + personalType3 + "</span>";
	                        $('.suitMatter').append(personalMatter);
	                    } else {
	                        $('.suitMatter').html("<span>诸事不宜</span>");
	                    }
	                    $('.suitColor').append(personalColor);
	                }
	                var public = data.public;
	                var pubSuit = "<span>" + public.yi.replace(/\,/g, "&nbsp;&nbsp;") + "</span>";
	                var pubTaboo = "<span>" + public.ji.replace(/\,/g, "&nbsp;&nbsp;") + "</span>";
	                $('.pubSuitMatter').append(pubSuit);
	                $('.tabooMatter').append(pubTaboo);
	                if ($('.almanac').css("left") == "0px") {
	                    var almaHeight = parseInt($('.almanac').css('height'));
	                    $('.schedule').css('height', 40 + almaHeight + "px");
	                } else {
	                    var scheHeight = parseInt($('.scheduleList').css('height'));
	                    $('.schedule').css('height', 40 + scheHeight + "px");
	                }
	            }
	        })
	    },
	    //设置生日获取私人黄历
	    setBirthday: function(birthdayTime) {
	        var date = new Date();
	        var years = date.getFullYear(),
	            months = date.getMonth() + 1,
	            days = date.getDate();
	        var dateTime = years + "-" + months + "-" + days + " 08:00:00";
	        $.ajax({
	            type: "post",
	            url: "http://www.li-li.cn/llwx/user/setBirthday",
	            data: {
	                dateTime: dateTime,
	                birthday: birthdayTime
	            },
	            dataType: "json",
	            success: function (data) {
	                //console.log(data);
	                if (data.code == 0) {
	                    $('#loadingToast').fadeOut();//隐藏loading
	                    var data = data.data;
	                    $('.suitColor').html("");
	                    $('.suitMatter').html("");
	                    var suitColor = data.personal.type2.replace(/\,/g, "&nbsp;&nbsp;"),
	                        suitMatter = data.personal.type3.replace(/\,/g, "&nbsp;&nbsp;");
	                    if(!suitMatter){
	                        suitMatter = "诸事不宜";
	                    }
	                    var colorHtml = "<span>" + suitColor + "</span>",
	                        matterHtml = "<span>" + suitMatter + "</span>";
	                    $('.suitColor').append(colorHtml);
	                    $('.suitMatter').append(matterHtml);
	                    $('.alterBirthday').css("display","block");//修改生日显示
	                }else{
	                    $('#loadingToast').fadeOut();//隐藏loading
	                    var error = data.msg;
	                    $('.weui_dialog_bd').html(error);
	                    $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
	                        $('#dialog2').off('click').hide();
	                    });
	                }
	                if ($('.almanac').css("left") == "0px") {
	                    var almaHeight = parseInt($('.almanac').css('height'));
	                    $('.schedule').css('height', 40 + almaHeight + "px");
	                } else {
	                    var scheHeight = parseInt($('.scheduleList').css('height'));
	                    $('.schedule').css('height', 40 + scheHeight + "px");
	                }
	            }
	        })
	    },
	    //获取天气
	    getWeather:function(date){
	        $.get(
	            "http://www.li-li.cn/llwx/weather/get",
	            {
	                "date":date,
	                "days":1
	            },
	            function(data) {
	                if(data.code ==0){
	                    if(data.data){
	                        var weatherList = data.data[0];
	                        var html = "";
	                        if(weatherList.qlty){
	                            html = weatherList.city+"&nbsp;"+weatherList.dTxt+"&nbsp;"+weatherList.minTmp+"℃~"+weatherList.maxTmp+"℃&nbsp;"+"空气"+weatherList.qlty;
	                        }else{
	                            html = weatherList.city+"&nbsp;"+weatherList.dTxt+"&nbsp;"+weatherList.minTmp+"℃~"+weatherList.maxTmp+"℃";
	                        }
	                        $('.weather .itemCon').append(html);
	                    }else{
	                        $('.weather').css("display","none");
	                    }
	                }else{
	                    $('.weather').css("display","none");
	                }
	            }
	        )
	    },
	    //获取私人运势
	    getPersonalFortune:function(dateTime){
	        $.get("http://www.li-li.cn/llwx/fortune/get", {"dateTime": dateTime + " 08:00:00"}, function (data) {
	            if (data.code == 0) {
	                var list = data.data;
	                if (list.personal) {
	                    var html = "";
	                    if (list.personal.type3) {
	                        var type = list.personal.type3.replace(/\,/g, "&nbsp;");
	                        html = "<span>" + type + "</span>";
	                        $('.suitable .itemCon').append(html);
	                    } else {
	                        $('.suitable .itemCon').html("诸事不宜");
	                    }
	                }else{
	                    $('.eventContainer .suitable').css("display","none");
	                }
	            }
	        });
	    },
	    //添加事件页面数据提交
	    eventAdd: function(name,eventType,tagId, startTime, endTime, tipType, tipTime, repeatType, location,longitude,latitude, remark,remarkImgs,bgColor,themeId) {
	        $.ajax({
	            type: "post",
	            url: "http://www.li-li.cn/llwx/event/add",
	            data: {
	                "name":name,
	                "eventType":eventType,
	                "tagId":tagId,
	                "startTime":startTime,
	                "endTime":endTime,
	                "tipType":tipType,
	                "tipTime":tipTime,
	                "repeatType":repeatType,
	                "location":location,
	                "longitude":longitude,
	                "latitude":latitude,
	                "remark":remark,
	                "remarkImgs":remarkImgs,
	                "bgColor":bgColor,
	                "theme.themeId":themeId
	            },
	            dataType: "json",
	            success: function (data) {
	                //console.log(data);
	                if (data.code == 0) {//提交成功
	
	                    $('#loadingToast').fadeOut();
	                    window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/newShowEvent.html");
	                }else{//提交失败提醒错误信息
	                    $('#loadingToast').fadeOut();
	                    var error = data.msg;
	                    $('#dialog2 .weui-dialog__bd').html(error);
	                    $('#dialog2').show().on('click', '.weui-dialog__btn', function () {
	                        $('#dialog2').off('click').hide();
	                    });
	                }
	            }
	        })
	    },
	    //添加事件页面数据提交
	    eventAdd2: function(name,eventType,tagId, startTime, endTime, tipType, tipTime, repeatType, location,longitude,latitude, remark,remarkImgs,bgColor,themeId) {
	        $.ajax({
	            type: "post",
	            url: "http://www.li-li.cn/llwx/event/add",
	            data: {
	                "name":name,
	                "eventType":eventType,
	                "tagId":tagId,
	                "startTime":startTime,
	                "endTime":endTime,
	                "tipType":tipType,
	                "tipTime":tipTime,
	                "repeatType":repeatType,
	                "location":location,
	                "longitude":longitude,
	                "latitude":latitude,
	                "remark":remark,
	                "remarkImgs":remarkImgs,
	                "bgColor":bgColor,
	                "theme.themeId":themeId
	            },
	            dataType: "json",
	            async: false,
	            success: function (data) {
	                if (data.code == 0) {
	                    that.config.eventId = data.data;
	                }else{//提交失败提醒错误信息
	                    var error = data.msg;
	                    $('#dialog2 .weui-dialog__bd').html(error);
	                    $('#dialog2').show().on('click', '.weui-dialog__btn', function () {
	                        $('#dialog2').off('click').hide();
	                    });
	                }
	            }
	        })
	    },
	    //修改事件页面数据提交
	    eventModify: function(eventId,name,tagId, startTime, endTime, tipType, tipTime, repeatType, location,longitude,latitude, remark,remarkImgs,bgColor,themeId) {
	        $.ajax({
	            type: "post",
	            url: "http://www.li-li.cn/llwx/event/add",
	            data: {
	                "eventId":eventId,
	                "name":name,
	                "tagId":tagId,
	                "startTime":startTime,
	                "endTime":endTime,
	                "tipType":tipType,
	                "tipTime":tipTime,
	                "repeatType":repeatType,
	                "location":location,
	                "longitude":longitude,
	                "latitude":latitude,
	                "remark":remark,
	                "remarkImgs":remarkImgs,
	                "bgColor":bgColor,
	                "theme.themeId":themeId
	            },
	            dataType: "json",
	            success: function (data) {
	                if (data.code == 0) {
	                    $('#loadingToast').fadeOut();
	                    window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/calendar.html");
	                } else {//修改失败弹出提示框
	                    $('#loadingToast').fadeOut();
	                    var error = data.msg;
	                    $('#dialog2 .weui_dialog_bd').html(error);
	                    $('#dialog2').show().on('click', '.weui-dialog__btn', function () {
	                        $('#dialog2').off('click').hide();
	                    });
	                }
	            }
	        })
	    }
	}
	
	Ajax.init();
	
	module.exports = Ajax;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 32 */,
/* 33 */,
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {var Dom = __webpack_require__(17);
	var Ajax = __webpack_require__(23);
	var LunarCalendar = __webpack_require__(35);
	var FootPrint = {
	    templateSettings: {
	        evaluate : /<%([\s\S]+?)%>/g,
	        interpolate : /<%=([\s\S]+?)%>/g
	    },
	    compile: function(str, settings) {
	        var c = settings || this.templateSettings;
	        var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
	            'with(obj||{}){__p.push(\'' +
	            str.replace(/\\/g, '\\\\')
	                .replace(/'/g, "\\'")
	                .replace(c.interpolate, function(match, code) {
	                    return "'," + code.replace(/\\'/g, "'") + ",'";
	                })
	                .replace(c.evaluate || null, function(match, code) {
	                    return "');" + code.replace(/\\'/g, "'")
	                            .replace(/[\r\n\t]/g, ' ') + "__p.push('";
	                })
	                .replace(/\r/g, '\\r')
	                .replace(/\n/g, '\\n')
	                .replace(/\t/g, '\\t')
	            + "');}return __p.join('');";
	        return new Function('obj', tmpl);
	    },
	    template: function(str, data) {
	        var compilied = this.compile(str);
	        return compilied(data);
	    }
	}
	
	var Lunar = {
	    hlurl: "http://cdn.tuijs.com/js/",
	    hlMinYear: 2008,
	    hlMaxYear: 2020,
	    minYear: 1891,
	    maxYear: 2100,
	    HuangLi: {},
	    btns: $('.lucky .word_item span'),
	    btnsB: $('.inFrame .word_item span'),
	    itemTemp: [
	        '<div class="date_item<%=itemCls%>" data-index="<%=index%>" id="<%=itemId%>">',
	        '	<span class="date_icon<%=iconCls%>"><%=iconText%></span>',
	        '	<span class="date_day"><%=day%></span>',
	        '	<span class="date_lunar<%=fetvCls%>"><%=lunar%></span>',
	        '</div>'
	    ],
	    now: new Date(),
	    current: null,
	    DATA: null,
	    panel: [0,1],
	    pageWidth: 0,
	    timer: -1,
	    selectWord: "",
	    init: function() {
	        this.initPageElm();
	        this.addEvent();
	        this.setCurrentByNow();
	        this.showDate();
	        this.clickDate();
	    },
	    initPageElm: function() {
	        this.pageWidth = $(document).width();
	        $('.date_list').eq(0).css('width', '100%');
	        $('.date_list').eq(1).css({'width': '100%', 'left': this.pageWidth});
	        if (Dom.mobile.platform == 'iOS') {//iOS启用3d，同时将子元素也设置一下，防止BUG
	            this.setTranslate(document.getElementById('date_list_0'), 0);
	            this.setTranslate(document.getElementById('date_list_1'), 0);
	        }
	    },
	    addEvent: function() {
	        var that = this;
	        $('.date_list').on('tap', '.date_item', function () {
	            var index = $(this).attr('data-index');
	            index = parseInt(index, 10);
	            var itemData = that.DATA.monthData[index];
	
	            if (index < that.DATA.firstDay) { //上一个月
	                that.pageDate(-1, itemData.year, itemData.month, itemData.day);
	            } else if (index >= that.DATA.firstDay + that.DATA.monthDays) {//下一个月
	                that.pageDate(1, itemData.year, itemData.month, itemData.day);
	            } else {
	                that.resetInfo();
	                that.setCurrentByNow(itemData.year, itemData.month, itemData.day, index);
	                that.showInfo($(this));
	            }
	        });
	
	        $('.today').on('tap', function (event) {//回到今天
	            $('.today').css("display", "none");
	            var dateItem = Dom.getDateList();
	            //console.log(dateItem);
	            var today = that.now.getFullYear() + "-" + (that.now.getMonth() + 1) + "-" + that.now.getDate();
	            //console.log(today);
	            var currentDay = $('#date_list_' + that.panel[0] + ' .date_current').attr("id");//获取滑动日历时默认选中的日期
	            var currentDayArr = currentDay.split("-");
	            var nowDay = that.now.getMonth() + 1;
	            if (currentDayArr[1]==nowDay) {//今天在范围之内
	                //console.log("在范围内");
	                for(var i=0;i<dateItem.size();i++){
	                    dateItem.eq(i).removeClass("date_current");
	                    if(dateItem.eq(i).attr("id")==today){
	                        dateItem.eq(i).addClass('date_current');
	                    }
	                }
	            } else {//今天不在范围之内
	                that.pageDate(1, that.now.getFullYear(), that.now.getMonth() + 1, that.now.getDate());
	            }
	            Ajax.getEventOfDay(today);
	            Ajax.getFortune(today);
	            return false;
	        });
	
	        $('.slide_wrap').on('swipeLeft', function (event) {
	            that.pageDate(1);
	            event.preventDefault();
	            return false;
	        });
	
	        $('.slide_wrap').on('swipeRight', function (event) {
	            that.pageDate(-1);
	            event.preventDefault();
	            return false;
	        });
	
	        /*----------------------------------点击吉日列表中的选项---------------------------*/
	        this.btns.on('tap', function (event) {
	            $('#loadingToast').show();//显示loading效果
	            //var dateItem = getDateList();
	            that.btns.each(function () {
	                $(this).removeClass("active");
	            });
	            $(this).addClass('active');//选中项添加样式
	            that.selectWord = $(this).html();//选中吉日类型
	            that.showLuckyDay(that.selectWord);//调用后台数据，显示合适的日期
	
	            var wordItem = $('.lucky02 .word_item span');
	//            console.log(wordItem.size());
	            for (var j = 0; j < wordItem.size(); j++) {
	                wordItem.eq(j).removeClass("active");
	            }
	            var num1 = $(this).parent().index();
	            num02 = $(this).parent().parent().index();
	            var num = num1 + num02 * 6;
	            var screenWidth=$(document.body).width()//获取屏幕宽度
	            $('.inFrame').css('left', -num02 * screenWidth + 'px');
	            $('.inFrame .word_item span').eq(num).attr("class", "active");
	            that.luckyWordConDown();
	        });
	
	        /*--------------------点击一行吉日列表中的吉日选项，合适的日期-------------------------*/
	        this.btnsB.on("tap", function (event) {
	            $('#loadingToast').show();//显示loading效果
	            that.btnsB.each(function () {
	                $(this).removeClass("active");
	            });
	            $(this).addClass("active");
	            that.selectWord = $(this).html();
	            that.showLuckyDay(that.selectWord);
	        });
	    },
	    formatDayD4: function(month, day) {
	        month = month + 1;
	        month = month < 10 ? '0' + month : month;
	        day = day < 10 ? '0' + day : day;
	        return 'd' + month + day;
	    },
	    formatDate: function() {
	        if (!this.current)return '';
	        var year = this.current.year;
	        var month = this.current.month;
	        return month + "月" + "·" + year + "年";
	    },
	    setCurrentByNow: function(year, month, day, pos) {
	        this.current = {
	            year: year || this.now.getFullYear(),
	            month: month || this.now.getMonth() + 1,
	            day: day || this.now.getDate(),
	            pos: pos || 0
	        };
	    },
	    //黄历
	    getHL: function() {
	        if (this.HuangLi['y' + this.current.year]) { //该年已有黄历数据
	            var hl = this.HuangLi['y' + this.current.year][this.formateDayD4(this.current.month, this.current.day)];
	            this.showHL(hl);
	        } else if (this.current.year >= this.hlMinYear && this.current.year <= this.hlMaxYear) {
	            $.getScript(this.hlurl + 'hl' + this.current.year + '.min.js', function () {
	                var hl = this.HuangLi['y' + current.year][this.formateDayD4(this.current.month, this.current.day)];
	                this.showHL(hl);
	            });
	        }
	    },
	    showHL: function(hl) {
	        if (hl) {
	            $('.hl_y_content').html(hl.y);
	            $('.hl_j_content').html(hl.j);
	            $('.date_hl').show();
	        } else {
	            $('.date_hl').hide();
	        }
	    },
	    showInfo: function(_this) {
	        $('#toolbar h1').html(this.formatDate());
	        if (_this) {
	            $('.date_item').removeClass('date_current');
	            _this.addClass('date_current');
	        }
	    },
	    //恢复指定日期的状态信息
	    resetInfo: function() {
	        //今天
	        var oldObj = $('#date_list_' + this.panel[0]).find('.date_item').eq(this.current.pos);
	        if (this.now.getFullYear() == this.current.year && this.now.getMonth() + 1 == this.current.month && this.now.getDate() == this.current.day) {
	            //oldObj.attr('class','date_item date_today');
	            oldObj.addClass('date_today');
	        } else {
	            //oldObj.attr('class','date_item');
	            oldObj.removeClass('date_today');
	        }
	    },
	    showDate: function() {
	        this.DATA = LunarCalendar.calendar(this.current.year, this.current.month, true);
	        var dateHtml = '';
	        var temp = this.itemTemp.join('');
	        for (var i = 0; i < this.DATA.monthData.length; i++) {
	            var itemData = this.DATA.monthData[i];
	            if (i % 7 == 0) { //某行第一列
	                dateHtml += '<div class="date_row">';
	                if (i > 7 && (i < this.DATA.firstDay || i >= this.DATA.firstDay + this.DATA.monthDays)) { //非本月日期
	                    break;
	                }
	            }
	            ;
	            var extendObj = {
	                index: i,
	                itemCls: '',
	                iconCls: itemData.worktime ? (itemData.worktime == 1 ? ' worktime' : ' holiday') : '',
	                iconText: itemData.worktime ? (itemData.worktime == 1 ? '班' : '休') : '',
	                fetvCls: (itemData.lunarFestival || itemData.term) ? ' lunar_fetv' : (itemData.solarFestival ? ' solar_fetv' : ''),
	                lunar: '',
	                itemId: ''
	            };
	            var itemCls = '';
	            if (this.now.getFullYear() == itemData.year && this.now.getMonth() + 1 == itemData.month && this.now.getDate() == itemData.day) {
	                itemCls = ' date_today';
	            }
	            if (this.current.year == itemData.year && this.current.month == itemData.month && this.current.day == itemData.day) { //当前选中
	                itemCls = ' date_current';
	                this.current.pos = i;
	            }
	            if (i < this.DATA.firstDay || i >= this.DATA.firstDay + this.DATA.monthDays) { //非本月日期
	                itemCls = ' date_other';
	            }
	            extendObj.itemCls = itemCls;
	            extendObj.itemId = itemData.year + "-" + itemData.month + '-' + itemData.day;
	            //extendObj.itemId = itemData.year;
	
	            var lunar = itemData.lunarDayName;
	            //以下判断根据优先级
	            if (itemData.solarFestival) lunar = itemData.solarFestival;
	            if (itemData.lunarFestival) lunar = itemData.lunarFestival;
	            if (itemData.term) lunar = itemData.term;
	            extendObj.lunar = lunar;
	
	            $.extend(itemData, extendObj);
	
	            dateHtml += FootPrint.template(temp, itemData);
	
	            if (i % 7 == 6) {//某行尾列
	                dateHtml += '</div>';
	                if (i < this.DATA.firstDay || i >= this.DATA.firstDay + this.DATA.monthDays) { //非本月日期
	                    break;
	                }
	            }
	            ;
	        }
	        ;
	
	        $('#date_list_' + this.panel[0]).html(dateHtml);
	        $('.slide_wrap').css('height', $('#date_list_' + this.panel[0]).css('height'));//高度随日历高度变化
	
	        this.showInfo();
	    },
	    pageDate: function(offset, _year, _month, _day) {
	        var year, month, day;
	        if (_year && _month) { //直接指定
	            year = _year;
	            month = _month;
	        } else {
	            if (this.current.month + offset < 1) { //上一年
	                year = this.current.year - 1;
	                month = 12;
	            } else if (this.current.month + offset > 12) { //下一年
	                year = this.current.year + 1;
	                month = 1;
	            } else {
	                year = this.current.year;
	                month = this.current.month + offset;
	            }
	        }
	        day = _day ? _day : (this.current.day > LunarCalendar.getSolarMonthDays(year,month-1) ? LunarCalendar.getSolarMonthDays(year,month-1) : this.current.day);
	        if (year < this.minYear || year > this.maxYear)return; //超过范围
	
	        this.setCurrentByNow(year, month, day);
	        this.changePanel();
	
	        this.showDate();
	        this.slide(offset);
	    },
	    changePanel: function() {
	        var first = this.panel.shift();
	        this.panel.push(first);
	    },
	    slide: function(offset) {
	        var that = this;
	        this.timer && clearTimeout(this.timer);
	        this.setSlidePos({time: 0, pos: 0});
	        $('#date_list_' + this.panel[0]).css({left: offset * this.pageWidth}).addClass("active"); //将要显示
	        $('#date_list_' + this.panel[1]).css({left: 0}).removeClass("active"); //当前显示
	        Ajax.getEventOfMonth();//判断当前页面时间范围内的事件，并在有时间的日期下方加点
	        var currentDay = $('#date_list_' + this.panel[0] + ' .date_current').attr("id");//获取滑动日历时默认选中的日期
	        Ajax.getEventOfDay(currentDay);//获取选中日期当天的事件列表
	        Ajax.getFortune(currentDay);//获取选中日期当天的运势
	        this.clickDate();//获取点击日期并显示当天的事件列表和运势
	        /*--------------比较页面中选中那天与今天是否相等，若不相等，则显示今天按钮------------*/
	        var today = new Date();
	        var dayT = today.getDate();
	        var monthT = today.getMonth() + 1;
	        var yearT = today.getFullYear();
	        var currentDayArr = currentDay.split("-");
	        if (dayT == currentDayArr[2] && monthT == currentDayArr[1] && yearT == currentDayArr[0]) {
	            $('.today').css("display", "none");
	        } else {
	            $('.today').css("display", "block");
	        }
	        /*------------若选择了吉日，则查找对应的日期。点击日期，吉日列表显示成一行---------------*/
	        if (that.selectWord != null && that.selectWord != "") {
	            $('#loadingToast').show();//隐藏loading
	            this.showLuckyDay(that.selectWord);
	            this.luckyWordConDown();
	        }
	        if (offset > 0) {//左滑
	            that.timer = setTimeout(function () {
	                that.setSlidePos({time: 100, pos: that.pageWidth * -1});
	            }, 50);
	        } else { //右滑
	            that.timer = setTimeout(function () {
	                that.setSlidePos({time: 100, pos: that.pageWidth});
	            }, 50);
	        }
	    },
	    setSlidePos: function(opt) {
	        var slide = $('.date_slide')[0];
	        slide.style.webkitTransitionDuration = opt.time + 'ms';
	        this.setTranslate(slide, opt.pos);
	    },
	    setTranslate: function(obj, pos) {
	        if (Dom.mobile.platform == 'iOS') {//iOS下启用3d加速，安卓下有BUG，使用2d
	            obj.style.webkitTransform = 'translate3d(' + pos + 'px,0px,0px)';
	        } else {
	            obj.style.webkitTransform = 'translate(' + pos + 'px,0px)';
	        }
	    },
	    /*--------------------获取点击日期并显示当天的事件列表和运势-------------------------*/
	    clickDate: function() {
	        var dateItem = Dom.getDateList();
	        for (var i = 0; i < dateItem.size(); i++) {
	            dateItem.eq(i).on('tap', function (event) {
	                var index = $(this).index();
	                var selectDate = $(this).parent().find('.date_item').eq(index).attr('id');
	//                    console.log(selectDate);
	                if (selectDate) {
	                    /*--------------比较页面中选中那天与今天是否相等，若不相等，则显示今天按钮------------*/
	                    var today = new Date();
	                    var dayT = today.getDate();
	                    var monthT = today.getMonth()+1;
	                    var yearT = today.getFullYear();
	                    var currentDayArr = selectDate.split("-");
	                    if (dayT == currentDayArr[2] && monthT == currentDayArr[1] && yearT == currentDayArr[0]) {
	                        $('.today').css("display", "none");
	                    } else {
	                        $('.today').css("display", "block");
	                    }
	                    Ajax.getEventOfDay(selectDate);
	                    Ajax.getFortune(selectDate);
	                }
	            });
	        }
	    },
	    //吉日查询函数
	    showLuckyDay: function(selectWord) {
	        //选择的吉日，日期数组
	        var dateItem = Dom.getDateList();
	        var startTime = dateItem.eq(0).attr("id"),
	            endTime = dateItem.eq(dateItem.size() - 1).attr("id");
	        $.get("http://www.li-li.cn/llwx/fortune/getLuckDay", {
	            "startTime": startTime + " 08:00:00",
	            "endTime": endTime + " 08:00:00",
	            "luckDaytag": selectWord,
	        }, function (data) {
	            if (data.code == 0) {
	                $('#loadingToast').fadeOut();//隐藏loading效果
	                var data = data.data;
	                for (var i = 0; i < dateItem.size(); i++) {
	                    dateItem.eq(i).removeClass("Not-lucky");
	                    if (dateItem.eq(i).attr('id')) {
	                        for (var j = 0; j < data.length; j++) {
	                            if (dateItem.eq(i).attr("id") == data[j].date && data[j].falg == 0) {
	                                dateItem.eq(i).addClass("Not-lucky");
	                            }
	                        }
	                    }
	                }
	            }else{
	                $('#loadingToast').fadeOut();//显示loading效果
	
	            }
	        })
	    },
	    /*--------------------点击日历上方日期，则吉日列表变为一行-------------------------*/
	    luckyWordConDown: function() {
	        var that = this;
	        var dateItem = Dom.getDateList();
	        dateItem.on("tap", function () {
	            if (that.selectWord != null && that.selectWord != "") {
	                $('.lucky').animate({'bottom': "-265px"}, 500, function () {
	                    //if(!$('.lucky02').is(':animated')){
	                        $('.lucky02').animate({'bottom': "0px"}, 500);
	                    //}
	                    //if(!$('.close02').is(':animated')){
	                        $('.close02').animate({'bottom':'66px'},500);
	                    //}
	                });
	            }
	        });
	    }
	}
	
	Lunar.init();
	
	module.exports = Lunar;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 农历（阴历）万年历
	 * LunarCalendar
	 * vervison : v0.1.4
	 * Github : https://github.com/zzyss86/LunarCalendar
	 * HomePage : http://www.tuijs.com/
	 * Author : JasonZhou
	 * Email : zzyss86@qq.com
	 */
	
	(function(){
		var extend = function(o, c){
			if(o && c && typeof c == "object"){
				for(var p in c){
					o[p] = c[p];
				}
			}
			return o;
		};
		
		var creatLenArr = function(year,month,len,start){
			var arr = [];
				start = start || 0;
			if(len<1)return arr;
			var k = start;
			for(var i=0;i<len;i++){
				arr.push({year:year,month:month,day:k});
				k++;
			}
			return arr;
		};
		
		var errorCode = { //错误码列表
			100 : '输入的年份超过了可查询范围，仅支持1891至2100年',
			101 : '参数输入错误，请查阅文档'
		};
		
		var cache = null; //某年相同计算进行cache，以加速计算速度
		var cacheUtil = { //cache管理工具
			current : '',
			setCurrent : function(year){
				if(this.current != year){
					this.current = year;
					this.clear();
				}
			},
			set : function(key,value){
				if(!cache) cache = {};
				cache[key] = value;
				return cache[key];
			},
			get : function(key){
				if(!cache) cache = {};
				return cache[key];
			},
			clear : function(){
				cache = null;
			}
		};
		
		var formateDayD4 = function(month,day){
			month = month+1;
			month = month<10 ? '0'+month : month;
			day = day<10 ? '0'+day : day;
			return 'd'+month+day;
		};
		
		var minYear = 1890;//最小年限
		var maxYear = 2100;//最大年限
		var DATA = {
			heavenlyStems: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'], //天干
			earthlyBranches: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'], //地支
			zodiac: ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'], //对应地支十二生肖
			solarTerm: ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪','冬至'], //二十四节气
			monthCn: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
			dateCn: ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', '卅一']
		};
		
		//中国节日放假安排，外部设置，0无特殊安排，1工作，2放假
		var worktime = {};
		//默认设置2013-2014年放假安排
		worktime.y2013 = {"d0101":2,"d0102":2,"d0103":2,"d0105":1,"d0106":1,"d0209":2,"d0210":2,"d0211":2,"d0212":2,"d0213":2,"d0214":2,"d0215":2,"d0216":1,"d0217":1,"d0404":2,"d0405":2,"d0406":2,"d0407":1,"d0427":1,"d0428":1,"d0429":2,"d0430":2,"d0501":2,"d0608":1,"d0609":1,"d0610":2,"d0611":2,"d0612":2,"d0919":2,"d0920":2,"d0921":2,"d0922":1,"d0929":1,"d1001":2,"d1002":2,"d1003":2,"d1004":2,"d1005":2,"d1006":2,"d1007":2,"d1012":1};
		worktime.y2014 = {"d0101":2,"d0126":1,"d0131":2,"d0201":2,"d0202":2,"d0203":2,"d0204":2,"d0205":2,"d0206":2,"d0208":1,"d0405":2,"d0407":2,"d0501":2,"d0502":2,"d0503":2,"d0504":1,"d0602":2,"d0908":2,"d0928":1,"d1001":2,"d1002":2,"d1003":2,"d1004":2,"d1005":2,"d1006":2,"d1007":2,"d1011":1};
		worktime.y2015 = {"d0101":2,"d0102":2,"d0103":2,"d0104":1,"d0215":1,"d0218":2,"d0219":2,"d0220":2,"d0221":2,"d0222":2,"d0223":2,"d0228":1,"d0405":2,"d0406":2,"d0501":2,"d0502":2,"d0503":2,"d0620":2,"d0622":2,"d0903":2,"d0904":2,"d0905":2,"d0906":1,"d0927":2,"d1001":2,"d1002":2,"d1003":2,"d1004":2,"d1005":2,"d1006":2,"d1007":2,"d1010":1};
		worktime.y2016 = {"d0101": 2, "d0102": 2, "d0103": 2, "d0206": 1, "d0207": 2, "d0208": 2, "d0209": 2, "d0210": 2, "d0211": 2, "d0212": 2, "d0213": 2, "d0214": 1, "d0402": 2, "d0403": 2, "d0404": 2, "d0430": 2, "d0501": 2, "d0502": 2, "d0609": 2, "d0610": 2, "d0611": 2, "d0612": 1, "d0915": 2, "d0916": 2, "d0917": 2, "d0918": 1, "d1001": 2, "d1002": 2, "d1003": 2, "d1004": 2, "d1005": 2, "d1006": 2, "d1007": 2, "d1008": 1, "d1009": 1};
		//公历节日
		var solarFestival = {
			'd0101':'元旦节',
			'd0214':'情人节',
			'd0308':'妇女节',
			'd0312':'植树节',
			'd0401':'愚人节',
			'd0501':'劳动节',
			'd0504':'青年节',
			'd0512':'护士节',
			'd0601':'儿童节',
			'd0801':'建军节',
			'd0910':'教师节',
			'd1001':'国庆节',
			'd1110':'青年节',
			'd1224':'平安夜',
			'd1225':'圣诞节',
		};
		
		//农历节日
		var lunarFestival = {
			'd0101':'春节',
			'd0115':'元宵节',
			'd0202':'龙抬头节',
			'd0505':'端午节',
			'd0707':'情人节',
			'd0715':'中元节',
			'd0815':'中秋节',
			'd0909':'重阳节',
			'd1015':'下元节',
			'd1208':'腊八节',
			'd1223':'小年',
			'd0100':'除夕'
		}
	
		/**
		 * 1890 - 2100 年的农历数据
		 * 数据格式：[0,2,9,21936]
		 * [闰月所在月，0为没有闰月; *正月初一对应公历月; *正月初一对应公历日; *农历每月的天数的数组（需转换为二进制,得到每月大小，0=小月(29日),1=大月(30日)）;]
		*/
		var lunarInfo = [[2,1,21,22184],[0,2,9,21936],[6,1,30,9656],[0,2,17,9584],[0,2,6,21168],[5,1,26,43344],[0,2,13,59728],[0,2,2,27296],[3,1,22,44368],[0,2,10,43856],[8,1,30,19304],[0,2,19,19168],[0,2,8,42352],[5,1,29,21096],[0,2,16,53856],[0,2,4,55632],[4,1,25,27304],[0,2,13,22176],[0,2,2,39632],[2,1,22,19176],[0,2,10,19168],[6,1,30,42200],[0,2,18,42192],[0,2,6,53840],[5,1,26,54568],[0,2,14,46400],[0,2,3,54944],[2,1,23,38608],[0,2,11,38320],[7,2,1,18872],[0,2,20,18800],[0,2,8,42160],[5,1,28,45656],[0,2,16,27216],[0,2,5,27968],[4,1,24,44456],[0,2,13,11104],[0,2,2,38256],[2,1,23,18808],[0,2,10,18800],[6,1,30,25776],[0,2,17,54432],[0,2,6,59984],[5,1,26,27976],[0,2,14,23248],[0,2,4,11104],[3,1,24,37744],[0,2,11,37600],[7,1,31,51560],[0,2,19,51536],[0,2,8,54432],[6,1,27,55888],[0,2,15,46416],[0,2,5,22176],[4,1,25,43736],[0,2,13,9680],[0,2,2,37584],[2,1,22,51544],[0,2,10,43344],[7,1,29,46248],[0,2,17,27808],[0,2,6,46416],[5,1,27,21928],[0,2,14,19872],[0,2,3,42416],[3,1,24,21176],[0,2,12,21168],[8,1,31,43344],[0,2,18,59728],[0,2,8,27296],[6,1,28,44368],[0,2,15,43856],[0,2,5,19296],[4,1,25,42352],[0,2,13,42352],[0,2,2,21088],[3,1,21,59696],[0,2,9,55632],[7,1,30,23208],[0,2,17,22176],[0,2,6,38608],[5,1,27,19176],[0,2,15,19152],[0,2,3,42192],[4,1,23,53864],[0,2,11,53840],[8,1,31,54568],[0,2,18,46400],[0,2,7,46752],[6,1,28,38608],[0,2,16,38320],[0,2,5,18864],[4,1,25,42168],[0,2,13,42160],[10,2,2,45656],[0,2,20,27216],[0,2,9,27968],[6,1,29,44448],[0,2,17,43872],[0,2,6,38256],[5,1,27,18808],[0,2,15,18800],[0,2,4,25776],[3,1,23,27216],[0,2,10,59984],[8,1,31,27432],[0,2,19,23232],[0,2,7,43872],[5,1,28,37736],[0,2,16,37600],[0,2,5,51552],[4,1,24,54440],[0,2,12,54432],[0,2,1,55888],[2,1,22,23208],[0,2,9,22176],[7,1,29,43736],[0,2,18,9680],[0,2,7,37584],[5,1,26,51544],[0,2,14,43344],[0,2,3,46240],[4,1,23,46416],[0,2,10,44368],[9,1,31,21928],[0,2,19,19360],[0,2,8,42416],[6,1,28,21176],[0,2,16,21168],[0,2,5,43312],[4,1,25,29864],[0,2,12,27296],[0,2,1,44368],[2,1,22,19880],[0,2,10,19296],[6,1,29,42352],[0,2,17,42208],[0,2,6,53856],[5,1,26,59696],[0,2,13,54576],[0,2,3,23200],[3,1,23,27472],[0,2,11,38608],[11,1,31,19176],[0,2,19,19152],[0,2,8,42192],[6,1,28,53848],[0,2,15,53840],[0,2,4,54560],[5,1,24,55968],[0,2,12,46496],[0,2,1,22224],[2,1,22,19160],[0,2,10,18864],[7,1,30,42168],[0,2,17,42160],[0,2,6,43600],[5,1,26,46376],[0,2,14,27936],[0,2,2,44448],[3,1,23,21936],[0,2,11,37744],[8,2,1,18808],[0,2,19,18800],[0,2,8,25776],[6,1,28,27216],[0,2,15,59984],[0,2,4,27424],[4,1,24,43872],[0,2,12,43744],[0,2,2,37600],[3,1,21,51568],[0,2,9,51552],[7,1,29,54440],[0,2,17,54432],[0,2,5,55888],[5,1,26,23208],[0,2,14,22176],[0,2,3,42704],[4,1,23,21224],[0,2,11,21200],[8,1,31,43352],[0,2,19,43344],[0,2,7,46240],[6,1,27,46416],[0,2,15,44368],[0,2,5,21920],[4,1,24,42448],[0,2,12,42416],[0,2,2,21168],[3,1,22,43320],[0,2,9,26928],[7,1,29,29336],[0,2,17,27296],[0,2,6,44368],[5,1,26,19880],[0,2,14,19296],[0,2,3,42352],[4,1,24,21104],[0,2,10,53856],[8,1,30,59696],[0,2,18,54560],[0,2,7,55968],[6,1,27,27472],[0,2,15,22224],[0,2,5,19168],[4,1,25,42216],[0,2,12,42192],[0,2,1,53584],[2,1,21,55592],[0,2,9,54560]];
		
		/**
		 * 二十四节气数据，节气点时间（单位是分钟）
		 * 从0小寒起算
		 */
		var termInfo = [0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758];
		
		/**
		 * 判断农历年闰月数
		 * @param {Number} year 农历年
		 * return 闰月数 （月份从1开始）
		 */
		function getLunarLeapYear(year){
			var yearData = lunarInfo[year-minYear];
			return yearData[0];
		};
		
		/**
		 * 获取农历年份一年的每月的天数及一年的总天数
		 * @param {Number} year 农历年
		 */
		function getLunarYearDays(year){
			var yearData = lunarInfo[year-minYear];
			var leapMonth = yearData[0]; //闰月
			var monthData = yearData[3].toString(2);
			var monthDataArr = monthData.split('');
			
			//还原数据至16位,少于16位的在前面插入0（二进制存储时前面的0被忽略）
			for(var i=0;i<16-monthDataArr.length;i++){
				monthDataArr.unshift(0);
			}
			
			var len = leapMonth ? 13 : 12; //该年有几个月
			var yearDays = 0;
			var monthDays = [];
			for(var i=0;i<len;i++){
				if(monthDataArr[i]==0){
					yearDays += 29;
					monthDays.push(29);
				}else{
					yearDays += 30;
					monthDays.push(30);
				}
			}
			
			return {
				yearDays : yearDays,
				monthDays : monthDays
			};
		};
		
		/**
		 * 通过间隔天数查找农历日期
		 * @param {Number} year,between 农历年，间隔天数
		 */
		function getLunarDateByBetween(year,between){
			var lunarYearDays = getLunarYearDays(year);
			var end = between>0 ? between : lunarYearDays.yearDays - Math.abs(between);
			var monthDays = lunarYearDays.monthDays;
			var tempDays = 0;
			var month = 0;
			for(var i=0;i<monthDays.length;i++){
				tempDays += monthDays[i];
				if(tempDays > end){
					month = i;
					tempDays = tempDays-monthDays[i];
					break;
				}
			}
			
			return [year,month,end - tempDays + 1];
		};
	
		/**
		 * 根据距离正月初一的天数计算农历日期
		 * @param {Number} year 公历年，月，日
		 */
		function getLunarByBetween(year,month,day){
			var yearData = lunarInfo[year-minYear];
			var zenMonth = yearData[1];
			var zenDay = yearData[2];
			var between = getDaysBetweenSolar(year,zenMonth-1,zenDay,year,month,day);
			if(between==0){ //正月初一
				return [year,0,1];
			}else{
				var lunarYear = between>0 ? year : year-1;
				return getLunarDateByBetween(lunarYear,between);
			}
		};
		
		/**
		 * 两个公历日期之间的天数
		 */
		function getDaysBetweenSolar(year,month,day,year1,month1,day1){
			var date = new Date(year,month,day).getTime();
			var date1 = new Date(year1,month1,day1).getTime();
			return (date1-date) / 86400000;
		};
		
		/**
		 * 计算农历日期离正月初一有多少天
		 * @param {Number} year,month,day 农年，月(0-12，有闰月)，日
		 */
		function getDaysBetweenZheng(year,month,day){
			var lunarYearDays = getLunarYearDays(year);
			var monthDays = lunarYearDays.monthDays;
			var days = 0;
			for(var i=0;i<monthDays.length;i++){
				if(i<month){
					days += monthDays[i];
				}else{
					break;
				}
			};
			return days+day-1;
		};
		
		/**
		 * 某年的第n个节气为几日
		 * 31556925974.7为地球公转周期，是毫秒
		 * 1890年的正小寒点：01-05 16:02:31，1890年为基准点
		 * @param {Number} y 公历年
		 * @param {Number} n 第几个节气，从0小寒起算
		 * 由于农历24节气交节时刻采用近似算法，可能存在少量误差(30分钟内)
		 */
		function getTerm(y,n) {
			var offDate = new Date( ( 31556925974.7*(y-1890) + termInfo[n]*60000  ) + Date.UTC(1890,0,5,16,2,31) );
			return(offDate.getUTCDate());
		};
		
		/**
		 * 获取公历年一年的二十四节气
		 * 返回key:日期，value:节气中文名
		 */
		function getYearTerm(year){
			var res = {};
			var month = 0;
			for(var i=0;i<24;i++){
				var day = getTerm(year,i);
				if(i%2==0)month++
				res[formateDayD4(month-1,day)] = DATA.solarTerm[i];
			}
			return res;
		};
		
		/**
		 * 获取生肖
		 * @param {Number} year 干支所在年（默认以立春前的公历年作为基数）
		 */
		function getYearZodiac(year){
			 var num = year-1890+25; //参考干支纪年的计算，生肖对应地支
			 return DATA.zodiac[num%12];
		};
		
		/**
		 * 计算天干地支
		 * @param {Number} num 60进制中的位置(把60个天干地支，当成一个60进制的数)
		 */
		function cyclical(num) {
			return(DATA.heavenlyStems[num%10]+DATA.earthlyBranches[num%12]);
		}
		
		/**
		 * 获取干支纪年
		 * @param {Number} year 干支所在年
		 * @param {Number} offset 偏移量，默认为0，便于查询一个年跨两个干支纪年（以立春为分界线）
		 */
		function getLunarYearName(year,offset){
			offset = offset || 0;
			//1890年1月小寒（小寒一般是1月5或6日）以前为己丑年，在60进制中排25
			return cyclical(year-1890+25+offset);
		};
		
		/**
		 * 获取干支纪月
		 * @param {Number} year,month 公历年，干支所在月
		 * @param {Number} offset 偏移量，默认为0，便于查询一个月跨两个干支纪月（有立春的2月）
		 */
		function getLunarMonthName(year,month,offset){
			offset = offset || 0;
			//1890年1月小寒以前为丙子月，在60进制中排12
			return cyclical((year-1890)*12+month+12+offset);
		};
		
		/**
		 * 获取干支纪日
		 * @param {Number} year,month,day 公历年，月，日
		 */
		function getLunarDayName(year,month,day){
			//当日与1890/1/1 相差天数
			//1890/1/1与 1970/1/1 相差29219日, 1890/1/1 日柱为壬午日(60进制18)
			var dayCyclical = Date.UTC(year,month,day)/86400000+29219+18;
			return cyclical(dayCyclical);
		};
		
		/**
		 * 获取公历月份的天数
		 * @param {Number} year 公历年
		 * @param {Number} month 公历月
		 */
		function getSolarMonthDays(year,month){
			 var monthDays = [31,isLeapYear(year)?29:28,31,30,31,30,31,31,30,31,30,31];
			 return monthDays[month];
		};
		
		/**
		 * 判断公历年是否是闰年
		 * @param {Number} year 公历年
		 */
		function isLeapYear(year){
			return ((year%4==0 && year%100 !=0) || (year%400==0));
		};
			
		/*
		 * 统一日期输入参数（输入月份从1开始，内部月份统一从0开始）
		 */
		function formateDate(year,month,day,_minYear){
			var argsLen = arguments.length;
			var now = new Date();
			year = argsLen ? parseInt(year,10) : now.getFullYear();
			month = argsLen ? parseInt(month-1,10) : now.getMonth();
			day = argsLen ? parseInt(day,10) || now.getDate() : now.getDate();
			if(year < (_minYear ? _minYear : minYear+1) || year > maxYear)return {error:100, msg:errorCode[100]};
			return {
				year : year,
				month : month,
				day : day
			};
		};
		
		/**
		 * 将农历转换为公历
		 * @param {Number} year,month,day 农历年，月(1-13，有闰月)，日
		 */
		function lunarToSolar(_year,_month,_day){
			var inputDate = formateDate(_year,_month,_day);
			if(inputDate.error)return inputDate;
			var year = inputDate.year;
			var month = inputDate.month;
			var day = inputDate.day;
			
			var between = getDaysBetweenZheng(year,month,day); //离正月初一的天数
			var yearData = lunarInfo[year-minYear];
			var zenMonth = yearData[1];
			var zenDay = yearData[2];
			
			var offDate = new Date(year,zenMonth-1,zenDay).getTime() + between * 86400000;
				offDate = new Date(offDate);
			return {
				year : offDate.getFullYear(),
				month : offDate.getMonth()+1,
				day : offDate.getDate()
			};
		};
		
		/**
		 * 将公历转换为农历
		 * @param {Number} year,month,day 公历年，月，日
		 */
		function solarToLunar(_year,_month,_day){
			var inputDate = formateDate(_year,_month,_day,minYear);
			if(inputDate.error)return inputDate;
			var year = inputDate.year;
			var month = inputDate.month;
			var day = inputDate.day;
			
			cacheUtil.setCurrent(year);
			//立春日期
			var term2 = cacheUtil.get('term2') ? cacheUtil.get('term2') : cacheUtil.set('term2',getTerm(year,2));
			//二十四节气
			var termList = cacheUtil.get('termList') ? cacheUtil.get('termList') : cacheUtil.set('termList',getYearTerm(year));
			
			var firstTerm = getTerm(year,month*2); //某月第一个节气开始日期
			var GanZhiYear = (month>1 || month==1 && day>=term2) ? year+1 : year;//干支所在年份
			var GanZhiMonth = day>=firstTerm ? month+1 : month; //干支所在月份（以节气为界）
			
			var lunarDate = getLunarByBetween(year,month,day);
			var lunarLeapMonth = getLunarLeapYear(lunarDate[0]);
			var lunarMonthName = '';
			if(lunarLeapMonth>0 && lunarLeapMonth==lunarDate[1]){
				lunarMonthName = '闰'+DATA.monthCn[lunarDate[1]-1]+'月';
			}else if(lunarLeapMonth>0 && lunarDate[1]>lunarLeapMonth){
				lunarMonthName = DATA.monthCn[lunarDate[1]-1]+'月';
			}else{
				lunarMonthName = DATA.monthCn[lunarDate[1]]+'月';
			}
			
			//农历节日判断
			var lunarFtv = '';
			var lunarMonthDays = getLunarYearDays(lunarDate[0]).monthDays;
			//除夕
			if(lunarDate[1] == lunarMonthDays.length-1 && lunarDate[2]==lunarMonthDays[lunarMonthDays.length-1]){
				lunarFtv = lunarFestival['d0100'];
			}else if(lunarLeapMonth>0 && lunarDate[1]>lunarLeapMonth){
				lunarFtv = lunarFestival[formateDayD4(lunarDate[1]-1,lunarDate[2])];
			}else{
				lunarFtv = lunarFestival[formateDayD4(lunarDate[1],lunarDate[2])];
			}
			
			var res = {
				zodiac : getYearZodiac(GanZhiYear),
				GanZhiYear : getLunarYearName(GanZhiYear),
				GanZhiMonth : getLunarMonthName(year,GanZhiMonth),
				GanZhiDay : getLunarDayName(year,month,day),
				//放假安排：0无特殊安排，1工作，2放假
				worktime : worktime['y'+year] && worktime['y'+year][formateDayD4(month,day)] ? worktime['y'+year][formateDayD4(month,day)] : 0,
				term : termList[formateDayD4(month,day)],
				
				lunarYear : lunarDate[0],
				lunarMonth : lunarDate[1]+1,
				lunarDay : lunarDate[2],
				lunarMonthName : lunarMonthName,
				//lunarDayName : DATA.dateCn[lunarDate[2]-1],
				lunarDayName : parseFirstOfLunarmonth(DATA.dateCn[lunarDate[2]-1],lunarMonthName),
				lunarLeapMonth : lunarLeapMonth,
				
				solarFestival : solarFestival[formateDayD4(month,day)],
				lunarFestival : lunarFtv
			};
	
			return res;
		};
		//将初一改为某月
		function parseFirstOfLunarmonth(day,month){
			if(day == "初一"){
				return month;
			}
			return day;
		}
		
		/**
		 * 获取指定公历月份的农历数据
		 * return res{Object}
		 * @param {Number} year,month 公历年，月
		 * @param {Boolean} fill 是否用上下月数据补齐首尾空缺，首例数据从周日开始
		 */
		function calendar(_year,_month,fill){
			var inputDate = formateDate(_year,_month);
			if(inputDate.error)return inputDate;
			var year = inputDate.year;
			var month = inputDate.month;
			
			var calendarData = solarCalendar(year,month+1,fill);
			for(var i=0;i<calendarData.monthData.length;i++){
				var cData = calendarData.monthData[i];
				var lunarData = solarToLunar(cData.year,cData.month,cData.day);
				extend(calendarData.monthData[i],lunarData);
			}
			return calendarData;
		};
		
		/**
		 * 公历某月日历
		 * return res{Object}
		 * @param {Number} year,month 公历年，月
		 * @param {Boolean} fill 是否用上下月数据补齐首尾空缺，首例数据从周日开始 (7*6阵列)
		 */
		function solarCalendar(_year,_month,fill){
			var inputDate = formateDate(_year,_month);
			if(inputDate.error)return inputDate;
			var year = inputDate.year;
			var month = inputDate.month;
			
			var firstDate = new Date(year,month,1);
			var preMonthDays,preMonthData,nextMonthData;
			
			var res = {
				firstDay : firstDate.getDay(), //该月1号星期几
				monthDays : getSolarMonthDays(year,month), //该月天数
				monthData : []
			};
			
			res.monthData = creatLenArr(year,month+1,res.monthDays,1);
	
			if(fill){
				if(res.firstDay > 0){ //前补
					var preYear = month-1<0 ? year-1 : year;
					var preMonth = month-1<0 ? 11 : month-1;
					preMonthDays = getSolarMonthDays(preYear,preMonth);
					preMonthData = creatLenArr(preYear,preMonth+1,res.firstDay,preMonthDays-res.firstDay+1);
					res.monthData = preMonthData.concat(res.monthData);
				}
				
				if(7*6 - res.monthData.length!=0){ //后补
					var nextYear = month+1>11 ? year+1 : year;
					var nextMonth = month+1>11 ? 0 : month+1;
					var fillLen = 7*6 - res.monthData.length;
					nextMonthData = creatLenArr(nextYear,nextMonth+1,fillLen,1);
					res.monthData = res.monthData.concat(nextMonthData);
				}
			}
			
			return res;
		};
		
		/**
		 * 设置放假安排【对外暴露接口】
		 * @param {Object} workData
		 */
		function setWorktime(workData){
			extend(worktime,workData);
		};
	
		var LunarCalendar = {
			solarToLunar : solarToLunar,
			lunarToSolar : lunarToSolar,
			calendar : calendar,
			solarCalendar : solarCalendar,
			setWorktime : setWorktime,
			getSolarMonthDays : getSolarMonthDays
		};
		
		if (true){
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function (){
				return LunarCalendar;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}else if(typeof exports === 'object'){
			module.exports = LunarCalendar;
		}else{
			window.LunarCalendar = LunarCalendar;
		};
	
	})();


/***/ }
/******/ ]);
//# sourceMappingURL=calendar.js.map