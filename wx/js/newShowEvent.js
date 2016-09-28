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
/******/ 	var hotCurrentHash = "695897ba9d78ce7b553f"; // eslint-disable-line no-unused-vars
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
/******/ 			var chunkId = 6;
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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * Created by admin on 2016/9/26.
	 */
	__webpack_require__(74);
	var pageLoad = __webpack_require__(15);
	__webpack_require__(16);
	var Dom = __webpack_require__(17);
	var wx = __webpack_require__(21);
	var Ajax = __webpack_require__(23);
	var fastClick = __webpack_require__(24);
	
	var fuc = {
	    config:{
	        eventId: "",
	        nickName: "",
	        eventType:"",
	        shareImg:""
	    },
	
	    init:function(){
	        pageLoad({backgroundColor: "#66cccc"});
	        this.config.eventId = Dom.getRequest("eventId");
	        this.rem();
	        this.renderPage();
	        this.bindEvent();
	    },
	
	    rem:function(){
	        fastClick.attach(document.body);
	    },
	
	    renderPage:function(){
	        var that = this;
	        wx.wxConfig(1);
	        that.getJoiner();
	        that.getData();
	
	        /*----------获取用户分享的图片------------*/
	        $.get(
	            "http://www.li-li.cn/llwx/share/genPic",
	            {
	                "eventId":that.config.eventId
	            },
	            function(data){
	                if(data.code == 0){
	                    var imgUrl = data.data;
	                    that.config.shareImg = data.data;
	                    $('.shadowImg img').attr("src",imgUrl);
	                }
	            }
	        )
	
	    },
	    /*-----------------获取事件参与者-------------------*/
	    getJoiner:function(){
	        var that = this;
	        var peopleTemplate = $('#peopleListTemplate').html();
	        $.get(
	            "http://www.li-li.cn/llwx/event/joiner/list",
	            {
	                "pageNo":1,
	                "pageSize":10,
	                "eventId":that.config.eventId
	            },
	            function(data){
	                if(data.code == 0){
	                    var list = data.data,html="";
	                    var peopleCount = list.pagination.totalCount +1;
	                    $('.count').html(peopleCount);
	                    if(list.list.length == 0){
	                        $('.morePeople').css("display","none");
	                    }else if(list.list.length < 10){
	                        $('.morePeople').css("display","none");
	                    }else{
	                        for(var i=0;i<list.list.length;i++){
	                            html += peopleTemplate.replace(/{{imgUrl}}/g,list.list[i].headImgUrl).replace(/{{nickName}}/g,list.list[i].nickName);
	                        }
	                        $('.peopleList').prepend(html,$('.morePeople'));
	                        var joiner = $('.joinerItem');
	                        if(joiner.size()==list.pagination.totalCount){
	                            $('.morePeople').css("display","none");
	                        }
	                    }
	                }
	            }
	        )
	    },
	
	    getData: function() {
	        //进入页面时的数据加载
	        var that = this;
	        //console.log(that.config.eventId);
	        $.get(
	            "http://www.li-li.cn/llwx/event/detail",
	            {"eventId": that.config.eventId},
	            function (data) {
	                if(data.code == 0) {
	                        console.log(data);
	                        var dataList = data.data;
	                        that.config.eventType = dataList.event.eventType;
	                        $('.eventName').html(dataList.event.name);
	                        if (dataList.event.eventType == 0) {//提醒事件
	                            $('.time .itemCon').html(Dom.transStartTime(dataList.event.startTime));
	                            $('.avtivityCon').css("display", "none");
	                            $('.bottom').css("display", "none");
	                            Ajax.getWeather(Dom.getDate(dataList.event.startTime));
	                            Ajax.getPersonalFortune(Dom.getDate(dataList.event.startTime));
	                        } else if(dataList.event.eventType == 1) {//活动事件
	                            $('.suitable').css("display", "none");
	                            $('.weather').css("display", "none");
	                            var times = Dom.compareTimes(dataList.event.startTime, dataList.event.endTime);
	                            $('.time .itemCon').html(times);
	                            if (dataList.event.location) {//如果有地点
	                                $('.site .itemCon').html(dataList.event.location);
	                            } else {
	                                $('.site').css("display", "none");
	                            }
	                            if(dataList.event.bgColor){//若用户设置了背景颜色
	                                $('.topCon').css("height","100px");
	                            }else if(dataList.event.theme){//若用户没有设置背景颜色，则从主题中选择
	                                $('.topCon').css({"height":"200px","background-image":"url("+dataList.event.theme.themeUrl+")"});
	                                $('.compile').css("background",dataList.event.theme.themeColor);
	                            }
	                            if (dataList.event.remarkImgs !="") {//如果有备注
	                                var imgArr = dataList.event.remarkImgs.split(",");//图片数组
	                                //todo 填充备注中的图片样式
	                                if (dataList.event.remark != "") {
	                                    $('.remarkText').html(dataList.event.remark);
	                                }
	                            } else{
	                                if (dataList.event.remark !="") {
	                                    $('.remarkText').html(dataList.event.remark);
	                                }else{
	                                    $('.remark').css("display", "none");
	                                }
	                            }
	                            if(dataList.isOwner){//如果是发起者
	                                $('.bottom').css("display","block").animate({"bottom":"0"},200);
	                            }else{
	                                $('.compile').css("display","none");
	                            }
	                            if(dataList.isJoiner){//如果用户已参与该事件
	                                $('.bottom3').css("display","block").animate({"bottom":"0"},200);
	                            }else{//用户未参与该事件
	                                $('.bottom2').css("display","block").animate({"bottom":"0"},200);
	                            }
	                            //事件创建者头像及昵称显示
	                            $('.eventOwner').attr("src",dataList.owner.headImgUrl);
	                            $('.ownerNickName .nickName').html(dataList.owner.nickName);
	                            if(dataList.user){
	                                wx.wxShare(dataList.user + " 邀请您参加 「" + dataList.event.name + "」", Dom.tranDate(dataList.event.startTime),
	                                "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/newShowEvent.html?eventId=" + dataList.event.eventId));
	                            }else{//用户没有关注历历
	                                wx.wxShare(dataList.owner.nickName + " 邀请您参加 「" + dataList.event.name + "」", Dom.tranDate(dataList.event.startTime),
	                                "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/newShowEvent.html?eventId=" + dataList.event.eventId));
	                            }
	                        }
	                }
	            }
	        )
	    },
	
	    bindEvent:function(){
	        var that = this;
	        /*------------点击编辑按钮，跳转至事件添加页--------------*/
	        $('.compile').click(function(){
	            console.log(that.config.eventType);
	            if(that.config.eventType == 0){//提醒事件
	                window.location.href="http://www.li-li.cn/llwx/common/to?url2="+encodeURIComponent("http://www.li-li.cn/wx/view/remind.html?eventId="+that.config.eventId);
	            }else if(that.config.eventType == 1){//活动事件
	                window.location.href = "http://www.li-li.cn/llwx/common/to?url2="+encodeURIComponent("http://www.li-li.cn/wx/view/activity.html?eventId="+that.config.eventId);
	            }
	        });
	        /*----------------点击更多---------------------*/
	        $('.morePeople').click(function(){
	            that.getJoiner();
	        });
	        /*---------------点击邀请好友-----------------*/
	        $('.share').click(function(){
	            //that.showShareShadow;
	            var shareShadow = $('.shareShadow');
	            shareShadow.fadeIn();//显示分享提示层
	            shareShadow.click(function(){
	                $(this).fadeOut();
	                event.stopPropagation();
	            });
	            var share = document.getElementById('shareShadow');
	            share.addEventListener('touchmove', function (e) {
	                e.preventDefault();
	            });
	        });
	        /*---------------点击分享弹层中的按钮-----------------*/
	        $('.shareImgClose').click(function(){
	            event.preventDefault();
	            $.get(
	                "http://www.li-li.cn/llwx/share/seePic",
	                {
	                    "picUrl":that.config.shareImg
	                },
	                function(data){
	                    if(data.code == 0){//请求成功
	                        $('.shareShadow').fadeOut();
	                    }
	                }
	            )
	        });
	        /*-----------------点击接受邀请----------------*/
	        $('.join').click(function(){
	            $('#loadingToast').fadeIn();//显示loading
	            $.get("http://www.li-li.cn/llwx/wx/isSubscribe", function (data) {
	                if (data.code == 0) {
	                    if (data.data) {//已经关注了我们
	                        //数据提交
	                        $.post(
	                            'http://www.li-li.cn/llwx/event/accept',
	                            {
	                                "eventId": that.config.eventId
	                            },
	                            function (data) {
	                                if (data.code == 0) {//加入成功后弹出
	                                    $('#loadingToast').fadeOut();//隐藏loading
	                                    $('#toast').fadeIn();
	                                    setTimeout(function () {
	                                        $('#toast').fadeOut();
	                                    }, 1500);
	                                    $('.bottom2').css('display','none').animate({'bottom': '-0.72rem'}, 500, function () {
	                                        $('.bottom3').css('display','block').animate({'bottom': '0rem'}, 500);
	                                    });
	                                    // todo 修改该方法
	                                    that.refreshJoiner();//刷新参与人数量
	                                } else {//加入失败收弹出
	                                    $('#loadingToast').fadeOut();//隐藏loading
	                                    var error = data.msg;
	                                    $('#dialog2 .weui-dialog__bd').html(error);
	                                    $('#dialog2').fadeIn().on('click', '.weui-dialog__btn', function () {
	                                        $('#dialog2').off('click').fadeOut();
	                                    });
	                                }
	                            }
	                        )
	                    } else {//没有关注我们，弹出二维码
	                        $.get(
	                            "http://www.li-li.cn/llwx/wx/qrcode/ticket",
	                            {"sceneId": that.config.eventId},
	                            function (data) {//获取带参数的二维码
	                                if (data.code == 0) {
	                                    $('#loadingToast').fadeOut();//隐藏loading
	                                    var ticket = data.data.ticket;
	                                    var html = "<img src='https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + ticket + "' />";
	                                    $('.qrcodeImg').html("");
	                                    $('.qrcodeImg').append(html);
	                                    $('.wxQrcode').css("display", "block");
	                                }
	                            }
	                        );
	                    }
	                }
	            });
	        });
	        /*--------------------关闭二维码弹层----------------------*/
	        $('.wxQrcodeClose').click(function () {
	            $('.wxQrcode').css("display", "none");
	        });
	        /*------------------点击退出（已加入）-----------------*/
	        $('.exit').click(function(){
	            $('#dialog1').fadeIn();
	            $('#cancel').click(function(){
	                $('#dialog1').fadeOut();
	            });
	            $('#confirm').click(function(){
	                $('#dialog1').hide();
	                $('#loadingToast').fadeIn();//显示loading
	            });
	            $.post(
	                "http://www.li-li.cn/llwx/event/exit",
	                {
	                    "eventId":that.config.eventId
	                },
	                function(data){
	                    if(data.code==0){
	                        $('#loadingToast').fadeOut();//隐藏loading
	                        $('#toast').fadeIn();
	                        setTimeout(function () {
	                            $('#toast').fadeOut();
	                        }, 1500);
	                        $('.bottom3').css('display','none').animate({'bottom': '-50px'}, 500, function () {
	                            $('.bottom2').css('display','block').animate({'bottom': '0'}, 500);
	                        });
	                        that.refreshJoiner();
	                    }else{
	                        $('#loadingToast').fadeOut();//隐藏loading
	                        var error = data.msg;
	                        $('#dialog2 .weui-dialog__bd').html(error);
	                        $('#dialog2').fadeIn().on('click', '.weui-dialog__btn', function () {
	                            $('#dialog2').off('click').fadeOut();
	                        });
	                    }
	                }
	            )
	        })
	    },
	
	    /*-----------------------局部刷新参与人---------------------*/
	    refreshJoiner: function() {
	        var that = this;
	        $.get("http://www.li-li.cn/llwx/event/detail", {"eventId": that.config.eventId}, function (data) {
	            if (data.code == 0) {
	                var list = data.data;
	                if (list.joiner[0]) {//如果存在参与者
	                    $('.participant').css("display", "block");
	                    if(list.owner.headImgUrl){
	                        var html = that.config.template.replace(/{{dataImg}}/g,list.owner.headImgUrl).replace(/{{img}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{joinerName}}/g, list.owner.nickName);
	                    }else{
	                        var html = that.config.template.replace(/{{dataImg}}/g,"../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{img}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{joinerName}}/g, list.owner.nickName);
	                    }
	                    var joinerCount = list.joiner.length + 1;//获得参与者数组长度即参与人数
	                    $('.joinerCount').html(joinerCount);
	                    if(list.joiner.length> this.config.rowsCount*2){
	                        $('.acceptPeople').css("height","130px");
	                        $('.showAll').css("display","block");
	                    }
	                    for (var m = 0; m < list.joiner.length; m++) {
	                        if (list.joiner[m].headImgUrl) {
	                            html += that.config.template.replace(/{{dataImg}}/g,list.joiner[m].headImgUrl).replace(/{{img}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{joinerName}}/g, list.joiner[m].nickName);
	                        } else {
	                            html += that.config.template.replace(/{{dataImg}}/g,"../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{img}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{joinerName}}/g, list.joiner[m].nickName);
	                        }
	                    }
	                    $('.acceptPeople').html("").append(html);
	                    $('.scrollLoading').scrollLoading();
	                } else {
	                    $('.participant').css("display", "none");
	                }
	            } else {//数据获取失败
	
	            }
	        });
	    },
	    /*------------------分享提示层---------------------*/
	    showShareShadow: function() {
	        var shareShadow = $('.shareShadow');
	        shareShadow.fadeIn();//显示分享提示层
	        shareShadow.click(function(){
	            $(this).fadeOut();
	            event.stopPropagation();
	        });
	        var share = document.getElementById('shareShadow');
	        share.addEventListener('touchmove', function (e) {
	            e.preventDefault();
	        });
	    }
	}
	
	fuc.init();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },

/***/ 7:
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

/***/ 15:
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

/***/ 16:
/***/ function(module, exports) {

	(function ($) {
	    $.fn.slideDown = function (duration) {
	        // get old position to restore it then
	        var position = this.css('position');
	
	        // show element if it is hidden (it is needed if display is none)
	        this.show();
	
	        // place it so it displays as usually but hidden
	        this.css({
	            position: 'absolute',
	            visibility: 'hidden'
	        });
	
	        // get naturally height
	        var height = this.height();
	
	        // set initial css for animation
	        this.css({
	            position: position,
	            visibility: 'visible',
	            overflow: 'hidden',
	            height: 0
	        });
	
	        // animate to gotten height
	        this.animate({
	            height: height
	        }, duration);
	    };
	
	    (function ($) {
	        $.fn.slideUp = function (duration) {
	            // get old position to restore it then
	            var position = this.css('position');
	
	            // show element if it is hidden (it is needed if display is none)
	            this.show();
	
	            // place it so it displays as usually but hidden
	            this.css({
	                position: 'absolute',
	                visibility: 'hidden'
	            });
	
	            // get naturally height
	            var height = this.height();
	
	            // set initial css for animation
	            this.css({
	                position: position,
	                visibility: 'visible',
	                overflow: 'hidden',
	                height: height
	            });
	
	            // animate to gotten height
	            this.animate({
	                height: 0
	            }, duration);
	        };
	    })(Zepto);
	
	    (function($) {
	        $.fn.scrollTo = function(ops) {
	            this.options = $.extend({
	                toTo: 0,
	                duration: 500
	            }, ops);
	            var curPos = $(document.body).scrollTop();
	            var distance = this.options.toTo - curPos;
	            var times = parseInt((this.options.duration / 20), 10);
	            var step = parseInt(distance / times ,10);
	            var that = this;
	            var fuc = setInterval(function() {
	                if(distance > 0) {
	                    if($(document.body).scrollTop() >= that.options.toTo) {
	                        $(document.body).scrollTop(that.options.toTo);
	                        clearInterval(fuc);
	                    } else {
	                        $(document.body).scrollTop($(document.body).scrollTop() + step);
	                    }
	                } else {
	                    if($(document.body).scrollTop() <= that.options.toTo) {
	                        $(document.body).scrollTop(that.options.toTo)
	                        clearInterval(fuc);
	                    } else {
	                        $(document.body).scrollTop($(document.body).scrollTop() + step);
	                    }
	                }
	            }, 20);
	        }
	    })(Zepto);
	})(Zepto);

/***/ },

/***/ 17:
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
	    }
	}
	
	Dom.checkUserAgent();
	module.exports = Dom;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },

/***/ 18:
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

/***/ 21:
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

/***/ 22:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!function(a,b){ true?!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return b(a)}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):b(a,!0);}(window,function(a,b){function c(b,c,d){a.WeixinJSBridge?WeixinJSBridge.invoke(b,e(c),function(a){g(b,a,d)}):j(b,d)}function d(b,c,d){a.WeixinJSBridge?WeixinJSBridge.on(b,function(a){d&&d.trigger&&d.trigger(a),g(b,a,c)}):d?j(b,d):j(b,c)}function e(a){return a=a||{},a.appId=E.appId,a.verifyAppId=E.appId,a.verifySignType="sha1",a.verifyTimestamp=E.timestamp+"",a.verifyNonceStr=E.nonceStr,a.verifySignature=E.signature,a}function f(a){return{timeStamp:a.timestamp+"",nonceStr:a.nonceStr,"package":a.package,paySign:a.paySign,signType:a.signType||"SHA1"}}function g(a,b,c){var d,e,f;switch(delete b.err_code,delete b.err_desc,delete b.err_detail,d=b.errMsg,d||(d=b.err_msg,delete b.err_msg,d=h(a,d),b.errMsg=d),c=c||{},c._complete&&(c._complete(b),delete c._complete),d=b.errMsg||"",E.debug&&!c.isInnerInvoke&&alert(JSON.stringify(b)),e=d.indexOf(":"),f=d.substring(e+1)){case"ok":c.success&&c.success(b);break;case"cancel":c.cancel&&c.cancel(b);break;default:c.fail&&c.fail(b)}c.complete&&c.complete(b)}function h(a,b){var e,f,c=a,d=p[c];return d&&(c=d),e="ok",b&&(f=b.indexOf(":"),e=b.substring(f+1),"confirm"==e&&(e="ok"),"failed"==e&&(e="fail"),-1!=e.indexOf("failed_")&&(e=e.substring(7)),-1!=e.indexOf("fail_")&&(e=e.substring(5)),e=e.replace(/_/g," "),e=e.toLowerCase(),("access denied"==e||"no permission to execute"==e)&&(e="permission denied"),"config"==c&&"function not exist"==e&&(e="ok"),""==e&&(e="fail")),b=c+":"+e}function i(a){var b,c,d,e;if(a){for(b=0,c=a.length;c>b;++b)d=a[b],e=o[d],e&&(a[b]=e);return a}}function j(a,b){if(!(!E.debug||b&&b.isInnerInvoke)){var c=p[a];c&&(a=c),b&&b._complete&&delete b._complete,console.log('"'+a+'",',b||"")}}function k(){0!=D.preVerifyState&&(u||v||E.debug||"6.0.2">z||D.systemType<0||A||(A=!0,D.appId=E.appId,D.initTime=C.initEndTime-C.initStartTime,D.preVerifyTime=C.preVerifyEndTime-C.preVerifyStartTime,H.getNetworkType({isInnerInvoke:!0,success:function(a){var b,c;D.networkType=a.networkType,b="http://open.weixin.qq.com/sdk/report?v="+D.version+"&o="+D.preVerifyState+"&s="+D.systemType+"&c="+D.clientVersion+"&a="+D.appId+"&n="+D.networkType+"&i="+D.initTime+"&p="+D.preVerifyTime+"&u="+D.url,c=new Image,c.src=b}})))}function l(){return(new Date).getTime()}function m(b){w&&(a.WeixinJSBridge?b():q.addEventListener&&q.addEventListener("WeixinJSBridgeReady",b,!1))}function n(){H.invoke||(H.invoke=function(b,c,d){a.WeixinJSBridge&&WeixinJSBridge.invoke(b,e(c),d)},H.on=function(b,c){a.WeixinJSBridge&&WeixinJSBridge.on(b,c)})}var o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H;if(!a.jWeixin)return o={config:"preVerifyJSAPI",onMenuShareTimeline:"menu:share:timeline",onMenuShareAppMessage:"menu:share:appmessage",onMenuShareQQ:"menu:share:qq",onMenuShareWeibo:"menu:share:weiboApp",onMenuShareQZone:"menu:share:QZone",previewImage:"imagePreview",getLocation:"geoLocation",openProductSpecificView:"openProductViewWithPid",addCard:"batchAddCard",openCard:"batchViewCard",chooseWXPay:"getBrandWCPayRequest"},p=function(){var b,a={};for(b in o)a[o[b]]=b;return a}(),q=a.document,r=q.title,s=navigator.userAgent.toLowerCase(),t=navigator.platform.toLowerCase(),u=!(!t.match("mac")&&!t.match("win")),v=-1!=s.indexOf("wxdebugger"),w=-1!=s.indexOf("micromessenger"),x=-1!=s.indexOf("android"),y=-1!=s.indexOf("iphone")||-1!=s.indexOf("ipad"),z=function(){var a=s.match(/micromessenger\/(\d+\.\d+\.\d+)/)||s.match(/micromessenger\/(\d+\.\d+)/);return a?a[1]:""}(),A=!1,B=!1,C={initStartTime:l(),initEndTime:0,preVerifyStartTime:0,preVerifyEndTime:0},D={version:1,appId:"",initTime:0,preVerifyTime:0,networkType:"",preVerifyState:1,systemType:y?1:x?2:-1,clientVersion:z,url:encodeURIComponent(location.href)},E={},F={_completes:[]},G={state:0,data:{}},m(function(){C.initEndTime=l()}),H={config:function(a){E=a,j("config",a);var b=E.check===!1?!1:!0;m(function(){var a,d,e;if(b)c(o.config,{verifyJsApiList:i(E.jsApiList)},function(){F._complete=function(a){C.preVerifyEndTime=l(),G.state=1,G.data=a},F.success=function(){D.preVerifyState=0},F.fail=function(a){F._fail?F._fail(a):G.state=-1};var a=F._completes;return a.push(function(){k()}),F.complete=function(){for(var c=0,d=a.length;d>c;++c)a[c]();F._completes=[]},F}()),C.preVerifyStartTime=l();else{for(G.state=1,a=F._completes,d=0,e=a.length;e>d;++d)a[d]();F._completes=[]}}),E.beta&&n()},ready:function(a){0!=G.state?a():(F._completes.push(a),!w&&E.debug&&a())},error:function(a){"6.0.2">z||B||(B=!0,-1==G.state?a(G.data):F._fail=a)},checkJsApi:function(a){var b=function(a){var c,d,b=a.checkResult;for(c in b)d=p[c],d&&(b[d]=b[c],delete b[c]);return a};c("checkJsApi",{jsApiList:i(a.jsApiList)},function(){return a._complete=function(a){if(x){var c=a.checkResult;c&&(a.checkResult=JSON.parse(c))}a=b(a)},a}())},onMenuShareTimeline:function(a){d(o.onMenuShareTimeline,{complete:function(){c("shareTimeline",{title:a.title||r,desc:a.title||r,img_url:a.imgUrl||"",link:a.link||location.href,type:a.type||"link",data_url:a.dataUrl||""},a)}},a)},onMenuShareAppMessage:function(a){d(o.onMenuShareAppMessage,{complete:function(){c("sendAppMessage",{title:a.title||r,desc:a.desc||"",link:a.link||location.href,img_url:a.imgUrl||"",type:a.type||"link",data_url:a.dataUrl||""},a)}},a)},onMenuShareQQ:function(a){d(o.onMenuShareQQ,{complete:function(){c("shareQQ",{title:a.title||r,desc:a.desc||"",img_url:a.imgUrl||"",link:a.link||location.href},a)}},a)},onMenuShareWeibo:function(a){d(o.onMenuShareWeibo,{complete:function(){c("shareWeiboApp",{title:a.title||r,desc:a.desc||"",img_url:a.imgUrl||"",link:a.link||location.href},a)}},a)},onMenuShareQZone:function(a){d(o.onMenuShareQZone,{complete:function(){c("shareQZone",{title:a.title||r,desc:a.desc||"",img_url:a.imgUrl||"",link:a.link||location.href},a)}},a)},startRecord:function(a){c("startRecord",{},a)},stopRecord:function(a){c("stopRecord",{},a)},onVoiceRecordEnd:function(a){d("onVoiceRecordEnd",a)},playVoice:function(a){c("playVoice",{localId:a.localId},a)},pauseVoice:function(a){c("pauseVoice",{localId:a.localId},a)},stopVoice:function(a){c("stopVoice",{localId:a.localId},a)},onVoicePlayEnd:function(a){d("onVoicePlayEnd",a)},uploadVoice:function(a){c("uploadVoice",{localId:a.localId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},downloadVoice:function(a){c("downloadVoice",{serverId:a.serverId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},translateVoice:function(a){c("translateVoice",{localId:a.localId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},chooseImage:function(a){c("chooseImage",{scene:"1|2",count:a.count||9,sizeType:a.sizeType||["original","compressed"],sourceType:a.sourceType||["album","camera"]},function(){return a._complete=function(a){if(x){var b=a.localIds;b&&(a.localIds=JSON.parse(b))}},a}())},previewImage:function(a){c(o.previewImage,{current:a.current,urls:a.urls},a)},uploadImage:function(a){c("uploadImage",{localId:a.localId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},downloadImage:function(a){c("downloadImage",{serverId:a.serverId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},getNetworkType:function(a){var b=function(a){var c,d,e,b=a.errMsg;if(a.errMsg="getNetworkType:ok",c=a.subtype,delete a.subtype,c)a.networkType=c;else switch(d=b.indexOf(":"),e=b.substring(d+1)){case"wifi":case"edge":case"wwan":a.networkType=e;break;default:a.errMsg="getNetworkType:fail"}return a};c("getNetworkType",{},function(){return a._complete=function(a){a=b(a)},a}())},openLocation:function(a){c("openLocation",{latitude:a.latitude,longitude:a.longitude,name:a.name||"",address:a.address||"",scale:a.scale||28,infoUrl:a.infoUrl||""},a)},getLocation:function(a){a=a||{},c(o.getLocation,{type:a.type||"wgs84"},function(){return a._complete=function(a){delete a.type},a}())},hideOptionMenu:function(a){c("hideOptionMenu",{},a)},showOptionMenu:function(a){c("showOptionMenu",{},a)},closeWindow:function(a){a=a||{},c("closeWindow",{},a)},hideMenuItems:function(a){c("hideMenuItems",{menuList:a.menuList},a)},showMenuItems:function(a){c("showMenuItems",{menuList:a.menuList},a)},hideAllNonBaseMenuItem:function(a){c("hideAllNonBaseMenuItem",{},a)},showAllNonBaseMenuItem:function(a){c("showAllNonBaseMenuItem",{},a)},scanQRCode:function(a){a=a||{},c("scanQRCode",{needResult:a.needResult||0,scanType:a.scanType||["qrCode","barCode"]},function(){return a._complete=function(a){var b,c;y&&(b=a.resultStr,b&&(c=JSON.parse(b),a.resultStr=c&&c.scan_code&&c.scan_code.scan_result))},a}())},openProductSpecificView:function(a){c(o.openProductSpecificView,{pid:a.productId,view_type:a.viewType||0,ext_info:a.extInfo},a)},addCard:function(a){var e,f,g,h,b=a.cardList,d=[];for(e=0,f=b.length;f>e;++e)g=b[e],h={card_id:g.cardId,card_ext:g.cardExt},d.push(h);c(o.addCard,{card_list:d},function(){return a._complete=function(a){var c,d,e,b=a.card_list;if(b){for(b=JSON.parse(b),c=0,d=b.length;d>c;++c)e=b[c],e.cardId=e.card_id,e.cardExt=e.card_ext,e.isSuccess=e.is_succ?!0:!1,delete e.card_id,delete e.card_ext,delete e.is_succ;a.cardList=b,delete a.card_list}},a}())},chooseCard:function(a){c("chooseCard",{app_id:E.appId,location_id:a.shopId||"",sign_type:a.signType||"SHA1",card_id:a.cardId||"",card_type:a.cardType||"",card_sign:a.cardSign,time_stamp:a.timestamp+"",nonce_str:a.nonceStr},function(){return a._complete=function(a){a.cardList=a.choose_card_info,delete a.choose_card_info},a}())},openCard:function(a){var e,f,g,h,b=a.cardList,d=[];for(e=0,f=b.length;f>e;++e)g=b[e],h={card_id:g.cardId,code:g.code},d.push(h);c(o.openCard,{card_list:d},a)},chooseWXPay:function(a){c(o.chooseWXPay,f(a),a)}},b&&(a.wx=a.jWeixin=H),H});


/***/ },

/***/ 23:
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
	                    window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/calendar.html");
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

/***/ 24:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_RESULT__;;(function () {
	    'use strict';
	
	    /**
	     * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	     *
	     * @codingstandard ftlabs-jsv2
	     * @copyright The Financial Times Limited [All Rights Reserved]
	     * @license MIT License (see LICENSE.txt)
	     */
	
	    /*jslint browser:true, node:true*/
	    /*global define, Event, Node*/
	
	
	    /**
	     * Instantiate fast-clicking listeners on the specified layer.
	     *
	     * @constructor
	     * @param {Element} layer The layer to listen on
	     * @param {Object} [options={}] The options to override the defaults
	     */
	    function FastClick(layer, options) {
	        var oldOnClick;
	
	        options = options || {};
	
	        /**
	         * Whether a click is currently being tracked.
	         *
	         * @type boolean
	         */
	        this.trackingClick = false;
	
	
	        /**
	         * Timestamp for when click tracking started.
	         *
	         * @type number
	         */
	        this.trackingClickStart = 0;
	
	
	        /**
	         * The element being tracked for a click.
	         *
	         * @type EventTarget
	         */
	        this.targetElement = null;
	
	
	        /**
	         * X-coordinate of touch start event.
	         *
	         * @type number
	         */
	        this.touchStartX = 0;
	
	
	        /**
	         * Y-coordinate of touch start event.
	         *
	         * @type number
	         */
	        this.touchStartY = 0;
	
	
	        /**
	         * ID of the last touch, retrieved from Touch.identifier.
	         *
	         * @type number
	         */
	        this.lastTouchIdentifier = 0;
	
	
	        /**
	         * Touchmove boundary, beyond which a click will be cancelled.
	         *
	         * @type number
	         */
	        this.touchBoundary = options.touchBoundary || 10;
	
	
	        /**
	         * The FastClick layer.
	         *
	         * @type Element
	         */
	        this.layer = layer;
	
	        /**
	         * The minimum time between tap(touchstart and touchend) events
	         *
	         * @type number
	         */
	        this.tapDelay = options.tapDelay || 200;
	
	        /**
	         * The maximum time for a tap
	         *
	         * @type number
	         */
	        this.tapTimeout = options.tapTimeout || 700;
	
	        if (FastClick.notNeeded(layer)) {
	            return;
	        }
	
	        // Some old versions of Android don't have Function.prototype.bind
	        function bind(method, context) {
	            return function() { return method.apply(context, arguments); };
	        }
	
	
	        var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
	        var context = this;
	        for (var i = 0, l = methods.length; i < l; i++) {
	            context[methods[i]] = bind(context[methods[i]], context);
	        }
	
	        // Set up event handlers as required
	        if (deviceIsAndroid) {
	            layer.addEventListener('mouseover', this.onMouse, true);
	            layer.addEventListener('mousedown', this.onMouse, true);
	            layer.addEventListener('mouseup', this.onMouse, true);
	        }
	
	        layer.addEventListener('click', this.onClick, true);
	        layer.addEventListener('touchstart', this.onTouchStart, false);
	        layer.addEventListener('touchmove', this.onTouchMove, false);
	        layer.addEventListener('touchend', this.onTouchEnd, false);
	        layer.addEventListener('touchcancel', this.onTouchCancel, false);
	
	        // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	        // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	        // layer when they are cancelled.
	        if (!Event.prototype.stopImmediatePropagation) {
	            layer.removeEventListener = function(type, callback, capture) {
	                var rmv = Node.prototype.removeEventListener;
	                if (type === 'click') {
	                    rmv.call(layer, type, callback.hijacked || callback, capture);
	                } else {
	                    rmv.call(layer, type, callback, capture);
	                }
	            };
	
	            layer.addEventListener = function(type, callback, capture) {
	                var adv = Node.prototype.addEventListener;
	                if (type === 'click') {
	                    adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
	                            if (!event.propagationStopped) {
	                                callback(event);
	                            }
	                        }), capture);
	                } else {
	                    adv.call(layer, type, callback, capture);
	                }
	            };
	        }
	
	        // If a handler is already declared in the element's onclick attribute, it will be fired before
	        // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	        // adding it as listener.
	        if (typeof layer.onclick === 'function') {
	
	            // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
	            // - the old one won't work if passed to addEventListener directly.
	            oldOnClick = layer.onclick;
	            layer.addEventListener('click', function(event) {
	                oldOnClick(event);
	            }, false);
	            layer.onclick = null;
	        }
	    }
	
	    /**
	     * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	     *
	     * @type boolean
	     */
	    var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;
	
	    /**
	     * Android requires exceptions.
	     *
	     * @type boolean
	     */
	    var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;
	
	
	    /**
	     * iOS requires exceptions.
	     *
	     * @type boolean
	     */
	    var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;
	
	
	    /**
	     * iOS 4 requires an exception for select elements.
	     *
	     * @type boolean
	     */
	    var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);
	
	
	    /**
	     * iOS 6.0-7.* requires the target element to be manually derived
	     *
	     * @type boolean
	     */
	    var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);
	
	    /**
	     * BlackBerry requires exceptions.
	     *
	     * @type boolean
	     */
	    var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;
	
	    /**
	     * Determine whether a given element requires a native click.
	     *
	     * @param {EventTarget|Element} target Target DOM element
	     * @returns {boolean} Returns true if the element needs a native click
	     */
	    FastClick.prototype.needsClick = function(target) {
	        switch (target.nodeName.toLowerCase()) {
	
	            // Don't send a synthetic click to disabled inputs (issue #62)
	            case 'button':
	            case 'select':
	            case 'textarea':
	                if (target.disabled) {
	                    return true;
	                }
	
	                break;
	            case 'input':
	
	                // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
	                if ((deviceIsIOS && target.type === 'file') || target.disabled) {
	                    return true;
	                }
	
	                break;
	            case 'label':
	            case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
	            case 'video':
	                return true;
	        }
	
	        return (/\bneedsclick\b/).test(target.className);
	    };
	
	
	    /**
	     * Determine whether a given element requires a call to focus to simulate click into element.
	     *
	     * @param {EventTarget|Element} target Target DOM element
	     * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	     */
	    FastClick.prototype.needsFocus = function(target) {
	        switch (target.nodeName.toLowerCase()) {
	            case 'textarea':
	                return true;
	            case 'select':
	                return !deviceIsAndroid;
	            case 'input':
	                switch (target.type) {
	                    case 'button':
	                    case 'checkbox':
	                    case 'file':
	                    case 'image':
	                    case 'radio':
	                    case 'submit':
	                        return false;
	                }
	
	                // No point in attempting to focus disabled inputs
	                return !target.disabled && !target.readOnly;
	            default:
	                return (/\bneedsfocus\b/).test(target.className);
	        }
	    };
	
	
	    /**
	     * Send a click event to the specified element.
	     *
	     * @param {EventTarget|Element} targetElement
	     * @param {Event} event
	     */
	    FastClick.prototype.sendClick = function(targetElement, event) {
	        var clickEvent, touch;
	
	        // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	        if (document.activeElement && document.activeElement !== targetElement) {
	            document.activeElement.blur();
	        }
	
	        touch = event.changedTouches[0];
	
	        // Synthesise a click event, with an extra attribute so it can be tracked
	        clickEvent = document.createEvent('MouseEvents');
	        clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	        clickEvent.forwardedTouchEvent = true;
	        targetElement.dispatchEvent(clickEvent);
	    };
	
	    FastClick.prototype.determineEventType = function(targetElement) {
	
	        //Issue #159: Android Chrome Select Box does not open with a synthetic click event
	        if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
	            return 'mousedown';
	        }
	
	        return 'click';
	    };
	
	
	    /**
	     * @param {EventTarget|Element} targetElement
	     */
	    FastClick.prototype.focus = function(targetElement) {
	        var length;
	
	        // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	        if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
	            length = targetElement.value.length;
	            targetElement.setSelectionRange(length, length);
	        } else {
	            targetElement.focus();
	        }
	    };
	
	
	    /**
	     * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	     *
	     * @param {EventTarget|Element} targetElement
	     */
	    FastClick.prototype.updateScrollParent = function(targetElement) {
	        var scrollParent, parentElement;
	
	        scrollParent = targetElement.fastClickScrollParent;
	
	        // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	        // target element was moved to another parent.
	        if (!scrollParent || !scrollParent.contains(targetElement)) {
	            parentElement = targetElement;
	            do {
	                if (parentElement.scrollHeight > parentElement.offsetHeight) {
	                    scrollParent = parentElement;
	                    targetElement.fastClickScrollParent = parentElement;
	                    break;
	                }
	
	                parentElement = parentElement.parentElement;
	            } while (parentElement);
	        }
	
	        // Always update the scroll top tracker if possible.
	        if (scrollParent) {
	            scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	        }
	    };
	
	
	    /**
	     * @param {EventTarget} targetElement
	     * @returns {Element|EventTarget}
	     */
	    FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	
	        // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	        if (eventTarget.nodeType === Node.TEXT_NODE) {
	            return eventTarget.parentNode;
	        }
	
	        return eventTarget;
	    };
	
	
	    /**
	     * On touch start, record the position and scroll offset.
	     *
	     * @param {Event} event
	     * @returns {boolean}
	     */
	    FastClick.prototype.onTouchStart = function(event) {
	        var targetElement, touch, selection;
	
	        // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	        if (event.targetTouches.length > 1) {
	            return true;
	        }
	
	        targetElement = this.getTargetElementFromEventTarget(event.target);
	        touch = event.targetTouches[0];
	
	        if (deviceIsIOS) {
	
	            // Only trusted events will deselect text on iOS (issue #49)
	            selection = window.getSelection();
	            if (selection.rangeCount && !selection.isCollapsed) {
	                return true;
	            }
	
	            if (!deviceIsIOS4) {
	
	                // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
	                // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
	                // with the same identifier as the touch event that previously triggered the click that triggered the alert.
	                // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
	                // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
	                // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
	                // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
	                // random integers, it's safe to to continue if the identifier is 0 here.
	                if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
	                    event.preventDefault();
	                    return false;
	                }
	
	                this.lastTouchIdentifier = touch.identifier;
	
	                // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
	                // 1) the user does a fling scroll on the scrollable layer
	                // 2) the user stops the fling scroll with another tap
	                // then the event.target of the last 'touchend' event will be the element that was under the user's finger
	                // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
	                // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
	                this.updateScrollParent(targetElement);
	            }
	        }
	
	        this.trackingClick = true;
	        this.trackingClickStart = event.timeStamp;
	        this.targetElement = targetElement;
	
	        this.touchStartX = touch.pageX;
	        this.touchStartY = touch.pageY;
	
	        // Prevent phantom clicks on fast double-tap (issue #36)
	        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
	            event.preventDefault();
	        }
	
	        return true;
	    };
	
	
	    /**
	     * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	     *
	     * @param {Event} event
	     * @returns {boolean}
	     */
	    FastClick.prototype.touchHasMoved = function(event) {
	        var touch = event.changedTouches[0], boundary = this.touchBoundary;
	
	        if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
	            return true;
	        }
	
	        return false;
	    };
	
	
	    /**
	     * Update the last position.
	     *
	     * @param {Event} event
	     * @returns {boolean}
	     */
	    FastClick.prototype.onTouchMove = function(event) {
	        if (!this.trackingClick) {
	            return true;
	        }
	
	        // If the touch has moved, cancel the click tracking
	        if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
	            this.trackingClick = false;
	            this.targetElement = null;
	        }
	
	        return true;
	    };
	
	
	    /**
	     * Attempt to find the labelled control for the given label element.
	     *
	     * @param {EventTarget|HTMLLabelElement} labelElement
	     * @returns {Element|null}
	     */
	    FastClick.prototype.findControl = function(labelElement) {
	
	        // Fast path for newer browsers supporting the HTML5 control attribute
	        if (labelElement.control !== undefined) {
	            return labelElement.control;
	        }
	
	        // All browsers under test that support touch events also support the HTML5 htmlFor attribute
	        if (labelElement.htmlFor) {
	            return document.getElementById(labelElement.htmlFor);
	        }
	
	        // If no for attribute exists, attempt to retrieve the first labellable descendant element
	        // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	        return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	    };
	
	
	    /**
	     * On touch end, determine whether to send a click event at once.
	     *
	     * @param {Event} event
	     * @returns {boolean}
	     */
	    FastClick.prototype.onTouchEnd = function(event) {
	        var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;
	
	        if (!this.trackingClick) {
	            return true;
	        }
	
	        // Prevent phantom clicks on fast double-tap (issue #36)
	        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
	            this.cancelNextClick = true;
	            return true;
	        }
	
	        if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
	            return true;
	        }
	
	        // Reset to prevent wrong click cancel on input (issue #156).
	        this.cancelNextClick = false;
	
	        this.lastClickTime = event.timeStamp;
	
	        trackingClickStart = this.trackingClickStart;
	        this.trackingClick = false;
	        this.trackingClickStart = 0;
	
	        // On some iOS devices, the targetElement supplied with the event is invalid if the layer
	        // is performing a transition or scroll, and has to be re-detected manually. Note that
	        // for this to function correctly, it must be called *after* the event target is checked!
	        // See issue #57; also filed as rdar://13048589 .
	        if (deviceIsIOSWithBadTarget) {
	            touch = event.changedTouches[0];
	
	            // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
	            targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
	            targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	        }
	
	        targetTagName = targetElement.tagName.toLowerCase();
	        if (targetTagName === 'label') {
	            forElement = this.findControl(targetElement);
	            if (forElement) {
	                this.focus(targetElement);
	                if (deviceIsAndroid) {
	                    return false;
	                }
	
	                targetElement = forElement;
	            }
	        } else if (this.needsFocus(targetElement)) {
	
	            // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
	            // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
	            if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
	                this.targetElement = null;
	                return false;
	            }
	
	            this.focus(targetElement);
	            this.sendClick(targetElement, event);
	
	            // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
	            // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
	            if (!deviceIsIOS || targetTagName !== 'select') {
	                this.targetElement = null;
	                event.preventDefault();
	            }
	
	            return false;
	        }
	
	        if (deviceIsIOS && !deviceIsIOS4) {
	
	            // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
	            // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
	            scrollParent = targetElement.fastClickScrollParent;
	            if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
	                return true;
	            }
	        }
	
	        // Prevent the actual click from going though - unless the target node is marked as requiring
	        // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	        if (!this.needsClick(targetElement)) {
	            event.preventDefault();
	            this.sendClick(targetElement, event);
	        }
	
	        return false;
	    };
	
	
	    /**
	     * On touch cancel, stop tracking the click.
	     *
	     * @returns {void}
	     */
	    FastClick.prototype.onTouchCancel = function() {
	        this.trackingClick = false;
	        this.targetElement = null;
	    };
	
	
	    /**
	     * Determine mouse events which should be permitted.
	     *
	     * @param {Event} event
	     * @returns {boolean}
	     */
	    FastClick.prototype.onMouse = function(event) {
	
	        // If a target element was never set (because a touch event was never fired) allow the event
	        if (!this.targetElement) {
	            return true;
	        }
	
	        if (event.forwardedTouchEvent) {
	            return true;
	        }
	
	        // Programmatically generated events targeting a specific element should be permitted
	        if (!event.cancelable) {
	            return true;
	        }
	
	        // Derive and check the target element to see whether the mouse event needs to be permitted;
	        // unless explicitly enabled, prevent non-touch click events from triggering actions,
	        // to prevent ghost/doubleclicks.
	        if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
	
	            // Prevent any user-added listeners declared on FastClick element from being fired.
	            if (event.stopImmediatePropagation) {
	                event.stopImmediatePropagation();
	            } else {
	
	                // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	                event.propagationStopped = true;
	            }
	
	            // Cancel the event
	            event.stopPropagation();
	            event.preventDefault();
	
	            return false;
	        }
	
	        // If the mouse event is permitted, return true for the action to go through.
	        return true;
	    };
	
	
	    /**
	     * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	     * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	     * an actual click which should be permitted.
	     *
	     * @param {Event} event
	     * @returns {boolean}
	     */
	    FastClick.prototype.onClick = function(event) {
	        var permitted;
	
	        // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	        if (this.trackingClick) {
	            this.targetElement = null;
	            this.trackingClick = false;
	            return true;
	        }
	
	        // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	        if (event.target.type === 'submit' && event.detail === 0) {
	            return true;
	        }
	
	        permitted = this.onMouse(event);
	
	        // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	        if (!permitted) {
	            this.targetElement = null;
	        }
	
	        // If clicks are permitted, return true for the action to go through.
	        return permitted;
	    };
	
	
	    /**
	     * Remove all FastClick's event listeners.
	     *
	     * @returns {void}
	     */
	    FastClick.prototype.destroy = function() {
	        var layer = this.layer;
	
	        if (deviceIsAndroid) {
	            layer.removeEventListener('mouseover', this.onMouse, true);
	            layer.removeEventListener('mousedown', this.onMouse, true);
	            layer.removeEventListener('mouseup', this.onMouse, true);
	        }
	
	        layer.removeEventListener('click', this.onClick, true);
	        layer.removeEventListener('touchstart', this.onTouchStart, false);
	        layer.removeEventListener('touchmove', this.onTouchMove, false);
	        layer.removeEventListener('touchend', this.onTouchEnd, false);
	        layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	    };
	
	
	    /**
	     * Check whether FastClick is needed.
	     *
	     * @param {Element} layer The layer to listen on
	     */
	    FastClick.notNeeded = function(layer) {
	        var metaViewport;
	        var chromeVersion;
	        var blackberryVersion;
	        var firefoxVersion;
	
	        // Devices that don't support touch don't need FastClick
	        if (typeof window.ontouchstart === 'undefined') {
	            return true;
	        }
	
	        // Chrome version - zero for other browsers
	        chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];
	
	        if (chromeVersion) {
	
	            if (deviceIsAndroid) {
	                metaViewport = document.querySelector('meta[name=viewport]');
	
	                if (metaViewport) {
	                    // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
	                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
	                        return true;
	                    }
	                    // Chrome 32 and above with width=device-width or less don't need FastClick
	                    if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
	                        return true;
	                    }
	                }
	
	                // Chrome desktop doesn't need FastClick (issue #15)
	            } else {
	                return true;
	            }
	        }
	
	        if (deviceIsBlackBerry10) {
	            blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);
	
	            // BlackBerry 10.3+ does not require Fastclick library.
	            // https://github.com/ftlabs/fastclick/issues/251
	            if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
	                metaViewport = document.querySelector('meta[name=viewport]');
	
	                if (metaViewport) {
	                    // user-scalable=no eliminates click delay.
	                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
	                        return true;
	                    }
	                    // width=device-width (or less than device-width) eliminates click delay.
	                    if (document.documentElement.scrollWidth <= window.outerWidth) {
	                        return true;
	                    }
	                }
	            }
	        }
	
	        // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
	        if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
	            return true;
	        }
	
	        // Firefox version - zero for other browsers
	        firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];
	
	        if (firefoxVersion >= 27) {
	            // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896
	
	            metaViewport = document.querySelector('meta[name=viewport]');
	            if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
	                return true;
	            }
	        }
	
	        // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
	        // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
	        if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
	            return true;
	        }
	
	        return false;
	    };
	
	
	    /**
	     * Factory method for creating a FastClick object
	     *
	     * @param {Element} layer The layer to listen on
	     * @param {Object} [options={}] The options to override the defaults
	     */
	    FastClick.attach = function(layer, options) {
	        return new FastClick(layer, options);
	    };
	
	
	    if (true) {
	
	        // AMD. Register as an anonymous module.
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return FastClick;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module.exports) {
	        module.exports = FastClick.attach;
	        module.exports.FastClick = FastClick;
	    } else {
	        window.FastClick = FastClick;
	    }
	}());
	;(function () {
	    'use strict';
	
	    /**
	     * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	     *
	     * @codingstandard ftlabs-jsv2
	     * @copyright The Financial Times Limited [All Rights Reserved]
	     * @license MIT License (see LICENSE.txt)
	     */
	
	    /*jslint browser:true, node:true*/
	    /*global define, Event, Node*/
	
	
	    /**
	     * Instantiate fast-clicking listeners on the specified layer.
	     *
	     * @constructor
	     * @param {Element} layer The layer to listen on
	     * @param {Object} [options={}] The options to override the defaults
	     */
	    function FastClick(layer, options) {
	        var oldOnClick;
	
	        options = options || {};
	
	        /**
	         * Whether a click is currently being tracked.
	         *
	         * @type boolean
	         */
	        this.trackingClick = false;
	
	
	        /**
	         * Timestamp for when click tracking started.
	         *
	         * @type number
	         */
	        this.trackingClickStart = 0;
	
	
	        /**
	         * The element being tracked for a click.
	         *
	         * @type EventTarget
	         */
	        this.targetElement = null;
	
	
	        /**
	         * X-coordinate of touch start event.
	         *
	         * @type number
	         */
	        this.touchStartX = 0;
	
	
	        /**
	         * Y-coordinate of touch start event.
	         *
	         * @type number
	         */
	        this.touchStartY = 0;
	
	
	        /**
	         * ID of the last touch, retrieved from Touch.identifier.
	         *
	         * @type number
	         */
	        this.lastTouchIdentifier = 0;
	
	
	        /**
	         * Touchmove boundary, beyond which a click will be cancelled.
	         *
	         * @type number
	         */
	        this.touchBoundary = options.touchBoundary || 10;
	
	
	        /**
	         * The FastClick layer.
	         *
	         * @type Element
	         */
	        this.layer = layer;
	
	        /**
	         * The minimum time between tap(touchstart and touchend) events
	         *
	         * @type number
	         */
	        this.tapDelay = options.tapDelay || 200;
	
	        /**
	         * The maximum time for a tap
	         *
	         * @type number
	         */
	        this.tapTimeout = options.tapTimeout || 700;
	
	        if (FastClick.notNeeded(layer)) {
	            return;
	        }
	
	        // Some old versions of Android don't have Function.prototype.bind
	        function bind(method, context) {
	            return function() { return method.apply(context, arguments); };
	        }
	
	
	        var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
	        var context = this;
	        for (var i = 0, l = methods.length; i < l; i++) {
	            context[methods[i]] = bind(context[methods[i]], context);
	        }
	
	        // Set up event handlers as required
	        if (deviceIsAndroid) {
	            layer.addEventListener('mouseover', this.onMouse, true);
	            layer.addEventListener('mousedown', this.onMouse, true);
	            layer.addEventListener('mouseup', this.onMouse, true);
	        }
	
	        layer.addEventListener('click', this.onClick, true);
	        layer.addEventListener('touchstart', this.onTouchStart, false);
	        layer.addEventListener('touchmove', this.onTouchMove, false);
	        layer.addEventListener('touchend', this.onTouchEnd, false);
	        layer.addEventListener('touchcancel', this.onTouchCancel, false);
	
	        // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	        // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	        // layer when they are cancelled.
	        if (!Event.prototype.stopImmediatePropagation) {
	            layer.removeEventListener = function(type, callback, capture) {
	                var rmv = Node.prototype.removeEventListener;
	                if (type === 'click') {
	                    rmv.call(layer, type, callback.hijacked || callback, capture);
	                } else {
	                    rmv.call(layer, type, callback, capture);
	                }
	            };
	
	            layer.addEventListener = function(type, callback, capture) {
	                var adv = Node.prototype.addEventListener;
	                if (type === 'click') {
	                    adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
	                            if (!event.propagationStopped) {
	                                callback(event);
	                            }
	                        }), capture);
	                } else {
	                    adv.call(layer, type, callback, capture);
	                }
	            };
	        }
	
	        // If a handler is already declared in the element's onclick attribute, it will be fired before
	        // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	        // adding it as listener.
	        if (typeof layer.onclick === 'function') {
	
	            // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
	            // - the old one won't work if passed to addEventListener directly.
	            oldOnClick = layer.onclick;
	            layer.addEventListener('click', function(event) {
	                oldOnClick(event);
	            }, false);
	            layer.onclick = null;
	        }
	    }
	
	    /**
	     * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	     *
	     * @type boolean
	     */
	    var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;
	
	    /**
	     * Android requires exceptions.
	     *
	     * @type boolean
	     */
	    var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;
	
	
	    /**
	     * iOS requires exceptions.
	     *
	     * @type boolean
	     */
	    var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;
	
	
	    /**
	     * iOS 4 requires an exception for select elements.
	     *
	     * @type boolean
	     */
	    var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);
	
	
	    /**
	     * iOS 6.0-7.* requires the target element to be manually derived
	     *
	     * @type boolean
	     */
	    var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);
	
	    /**
	     * BlackBerry requires exceptions.
	     *
	     * @type boolean
	     */
	    var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;
	
	    /**
	     * Determine whether a given element requires a native click.
	     *
	     * @param {EventTarget|Element} target Target DOM element
	     * @returns {boolean} Returns true if the element needs a native click
	     */
	    FastClick.prototype.needsClick = function(target) {
	        switch (target.nodeName.toLowerCase()) {
	
	            // Don't send a synthetic click to disabled inputs (issue #62)
	            case 'button':
	            case 'select':
	            case 'textarea':
	                if (target.disabled) {
	                    return true;
	                }
	
	                break;
	            case 'input':
	
	                // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
	                if ((deviceIsIOS && target.type === 'file') || target.disabled) {
	                    return true;
	                }
	
	                break;
	            case 'label':
	            case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
	            case 'video':
	                return true;
	        }
	
	        return (/\bneedsclick\b/).test(target.className);
	    };
	
	
	    /**
	     * Determine whether a given element requires a call to focus to simulate click into element.
	     *
	     * @param {EventTarget|Element} target Target DOM element
	     * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	     */
	    FastClick.prototype.needsFocus = function(target) {
	        switch (target.nodeName.toLowerCase()) {
	            case 'textarea':
	                return true;
	            case 'select':
	                return !deviceIsAndroid;
	            case 'input':
	                switch (target.type) {
	                    case 'button':
	                    case 'checkbox':
	                    case 'file':
	                    case 'image':
	                    case 'radio':
	                    case 'submit':
	                        return false;
	                }
	
	                // No point in attempting to focus disabled inputs
	                return !target.disabled && !target.readOnly;
	            default:
	                return (/\bneedsfocus\b/).test(target.className);
	        }
	    };
	
	
	    /**
	     * Send a click event to the specified element.
	     *
	     * @param {EventTarget|Element} targetElement
	     * @param {Event} event
	     */
	    FastClick.prototype.sendClick = function(targetElement, event) {
	        var clickEvent, touch;
	
	        // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	        if (document.activeElement && document.activeElement !== targetElement) {
	            document.activeElement.blur();
	        }
	
	        touch = event.changedTouches[0];
	
	        // Synthesise a click event, with an extra attribute so it can be tracked
	        clickEvent = document.createEvent('MouseEvents');
	        clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	        clickEvent.forwardedTouchEvent = true;
	        targetElement.dispatchEvent(clickEvent);
	    };
	
	    FastClick.prototype.determineEventType = function(targetElement) {
	
	        //Issue #159: Android Chrome Select Box does not open with a synthetic click event
	        if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
	            return 'mousedown';
	        }
	
	        return 'click';
	    };
	
	
	    /**
	     * @param {EventTarget|Element} targetElement
	     */
	    FastClick.prototype.focus = function(targetElement) {
	        var length;
	
	        // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	        if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
	            length = targetElement.value.length;
	            targetElement.setSelectionRange(length, length);
	        } else {
	            targetElement.focus();
	        }
	    };
	
	
	    /**
	     * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	     *
	     * @param {EventTarget|Element} targetElement
	     */
	    FastClick.prototype.updateScrollParent = function(targetElement) {
	        var scrollParent, parentElement;
	
	        scrollParent = targetElement.fastClickScrollParent;
	
	        // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	        // target element was moved to another parent.
	        if (!scrollParent || !scrollParent.contains(targetElement)) {
	            parentElement = targetElement;
	            do {
	                if (parentElement.scrollHeight > parentElement.offsetHeight) {
	                    scrollParent = parentElement;
	                    targetElement.fastClickScrollParent = parentElement;
	                    break;
	                }
	
	                parentElement = parentElement.parentElement;
	            } while (parentElement);
	        }
	
	        // Always update the scroll top tracker if possible.
	        if (scrollParent) {
	            scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	        }
	    };
	
	
	    /**
	     * @param {EventTarget} targetElement
	     * @returns {Element|EventTarget}
	     */
	    FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	
	        // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	        if (eventTarget.nodeType === Node.TEXT_NODE) {
	            return eventTarget.parentNode;
	        }
	
	        return eventTarget;
	    };
	
	
	    /**
	     * On touch start, record the position and scroll offset.
	     *
	     * @param {Event} event
	     * @returns {boolean}
	     */
	    FastClick.prototype.onTouchStart = function(event) {
	        var targetElement, touch, selection;
	
	        // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	        if (event.targetTouches.length > 1) {
	            return true;
	        }
	
	        targetElement = this.getTargetElementFromEventTarget(event.target);
	        touch = event.targetTouches[0];
	
	        if (deviceIsIOS) {
	
	            // Only trusted events will deselect text on iOS (issue #49)
	            selection = window.getSelection();
	            if (selection.rangeCount && !selection.isCollapsed) {
	                return true;
	            }
	
	            if (!deviceIsIOS4) {
	
	                // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
	                // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
	                // with the same identifier as the touch event that previously triggered the click that triggered the alert.
	                // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
	                // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
	                // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
	                // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
	                // random integers, it's safe to to continue if the identifier is 0 here.
	                if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
	                    event.preventDefault();
	                    return false;
	                }
	
	                this.lastTouchIdentifier = touch.identifier;
	
	                // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
	                // 1) the user does a fling scroll on the scrollable layer
	                // 2) the user stops the fling scroll with another tap
	                // then the event.target of the last 'touchend' event will be the element that was under the user's finger
	                // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
	                // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
	                this.updateScrollParent(targetElement);
	            }
	        }
	
	        this.trackingClick = true;
	        this.trackingClickStart = event.timeStamp;
	        this.targetElement = targetElement;
	
	        this.touchStartX = touch.pageX;
	        this.touchStartY = touch.pageY;
	
	        // Prevent phantom clicks on fast double-tap (issue #36)
	        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
	            event.preventDefault();
	        }
	
	        return true;
	    };
	
	
	    /**
	     * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	     *
	     * @param {Event} event
	     * @returns {boolean}
	     */
	    FastClick.prototype.touchHasMoved = function(event) {
	        var touch = event.changedTouches[0], boundary = this.touchBoundary;
	
	        if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
	            return true;
	        }
	
	        return false;
	    };
	
	
	    /**
	     * Update the last position.
	     *
	     * @param {Event} event
	     * @returns {boolean}
	     */
	    FastClick.prototype.onTouchMove = function(event) {
	        if (!this.trackingClick) {
	            return true;
	        }
	
	        // If the touch has moved, cancel the click tracking
	        if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
	            this.trackingClick = false;
	            this.targetElement = null;
	        }
	
	        return true;
	    };
	
	
	    /**
	     * Attempt to find the labelled control for the given label element.
	     *
	     * @param {EventTarget|HTMLLabelElement} labelElement
	     * @returns {Element|null}
	     */
	    FastClick.prototype.findControl = function(labelElement) {
	
	        // Fast path for newer browsers supporting the HTML5 control attribute
	        if (labelElement.control !== undefined) {
	            return labelElement.control;
	        }
	
	        // All browsers under test that support touch events also support the HTML5 htmlFor attribute
	        if (labelElement.htmlFor) {
	            return document.getElementById(labelElement.htmlFor);
	        }
	
	        // If no for attribute exists, attempt to retrieve the first labellable descendant element
	        // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	        return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	    };
	
	
	    /**
	     * On touch end, determine whether to send a click event at once.
	     *
	     * @param {Event} event
	     * @returns {boolean}
	     */
	    FastClick.prototype.onTouchEnd = function(event) {
	        var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;
	
	        if (!this.trackingClick) {
	            return true;
	        }
	
	        // Prevent phantom clicks on fast double-tap (issue #36)
	        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
	            this.cancelNextClick = true;
	            return true;
	        }
	
	        if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
	            return true;
	        }
	
	        // Reset to prevent wrong click cancel on input (issue #156).
	        this.cancelNextClick = false;
	
	        this.lastClickTime = event.timeStamp;
	
	        trackingClickStart = this.trackingClickStart;
	        this.trackingClick = false;
	        this.trackingClickStart = 0;
	
	        // On some iOS devices, the targetElement supplied with the event is invalid if the layer
	        // is performing a transition or scroll, and has to be re-detected manually. Note that
	        // for this to function correctly, it must be called *after* the event target is checked!
	        // See issue #57; also filed as rdar://13048589 .
	        if (deviceIsIOSWithBadTarget) {
	            touch = event.changedTouches[0];
	
	            // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
	            targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
	            targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	        }
	
	        targetTagName = targetElement.tagName.toLowerCase();
	        if (targetTagName === 'label') {
	            forElement = this.findControl(targetElement);
	            if (forElement) {
	                this.focus(targetElement);
	                if (deviceIsAndroid) {
	                    return false;
	                }
	
	                targetElement = forElement;
	            }
	        } else if (this.needsFocus(targetElement)) {
	
	            // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
	            // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
	            if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
	                this.targetElement = null;
	                return false;
	            }
	
	            this.focus(targetElement);
	            this.sendClick(targetElement, event);
	
	            // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
	            // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
	            if (!deviceIsIOS || targetTagName !== 'select') {
	                this.targetElement = null;
	                event.preventDefault();
	            }
	
	            return false;
	        }
	
	        if (deviceIsIOS && !deviceIsIOS4) {
	
	            // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
	            // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
	            scrollParent = targetElement.fastClickScrollParent;
	            if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
	                return true;
	            }
	        }
	
	        // Prevent the actual click from going though - unless the target node is marked as requiring
	        // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	        if (!this.needsClick(targetElement)) {
	            event.preventDefault();
	            this.sendClick(targetElement, event);
	        }
	
	        return false;
	    };
	
	
	    /**
	     * On touch cancel, stop tracking the click.
	     *
	     * @returns {void}
	     */
	    FastClick.prototype.onTouchCancel = function() {
	        this.trackingClick = false;
	        this.targetElement = null;
	    };
	
	
	    /**
	     * Determine mouse events which should be permitted.
	     *
	     * @param {Event} event
	     * @returns {boolean}
	     */
	    FastClick.prototype.onMouse = function(event) {
	
	        // If a target element was never set (because a touch event was never fired) allow the event
	        if (!this.targetElement) {
	            return true;
	        }
	
	        if (event.forwardedTouchEvent) {
	            return true;
	        }
	
	        // Programmatically generated events targeting a specific element should be permitted
	        if (!event.cancelable) {
	            return true;
	        }
	
	        // Derive and check the target element to see whether the mouse event needs to be permitted;
	        // unless explicitly enabled, prevent non-touch click events from triggering actions,
	        // to prevent ghost/doubleclicks.
	        if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
	
	            // Prevent any user-added listeners declared on FastClick element from being fired.
	            if (event.stopImmediatePropagation) {
	                event.stopImmediatePropagation();
	            } else {
	
	                // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	                event.propagationStopped = true;
	            }
	
	            // Cancel the event
	            event.stopPropagation();
	            event.preventDefault();
	
	            return false;
	        }
	
	        // If the mouse event is permitted, return true for the action to go through.
	        return true;
	    };
	
	
	    /**
	     * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	     * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	     * an actual click which should be permitted.
	     *
	     * @param {Event} event
	     * @returns {boolean}
	     */
	    FastClick.prototype.onClick = function(event) {
	        var permitted;
	
	        // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	        if (this.trackingClick) {
	            this.targetElement = null;
	            this.trackingClick = false;
	            return true;
	        }
	
	        // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	        if (event.target.type === 'submit' && event.detail === 0) {
	            return true;
	        }
	
	        permitted = this.onMouse(event);
	
	        // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	        if (!permitted) {
	            this.targetElement = null;
	        }
	
	        // If clicks are permitted, return true for the action to go through.
	        return permitted;
	    };
	
	
	    /**
	     * Remove all FastClick's event listeners.
	     *
	     * @returns {void}
	     */
	    FastClick.prototype.destroy = function() {
	        var layer = this.layer;
	
	        if (deviceIsAndroid) {
	            layer.removeEventListener('mouseover', this.onMouse, true);
	            layer.removeEventListener('mousedown', this.onMouse, true);
	            layer.removeEventListener('mouseup', this.onMouse, true);
	        }
	
	        layer.removeEventListener('click', this.onClick, true);
	        layer.removeEventListener('touchstart', this.onTouchStart, false);
	        layer.removeEventListener('touchmove', this.onTouchMove, false);
	        layer.removeEventListener('touchend', this.onTouchEnd, false);
	        layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	    };
	
	
	    /**
	     * Check whether FastClick is needed.
	     *
	     * @param {Element} layer The layer to listen on
	     */
	    FastClick.notNeeded = function(layer) {
	        var metaViewport;
	        var chromeVersion;
	        var blackberryVersion;
	        var firefoxVersion;
	
	        // Devices that don't support touch don't need FastClick
	        if (typeof window.ontouchstart === 'undefined') {
	            return true;
	        }
	
	        // Chrome version - zero for other browsers
	        chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];
	
	        if (chromeVersion) {
	
	            if (deviceIsAndroid) {
	                metaViewport = document.querySelector('meta[name=viewport]');
	
	                if (metaViewport) {
	                    // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
	                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
	                        return true;
	                    }
	                    // Chrome 32 and above with width=device-width or less don't need FastClick
	                    if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
	                        return true;
	                    }
	                }
	
	                // Chrome desktop doesn't need FastClick (issue #15)
	            } else {
	                return true;
	            }
	        }
	
	        if (deviceIsBlackBerry10) {
	            blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);
	
	            // BlackBerry 10.3+ does not require Fastclick library.
	            // https://github.com/ftlabs/fastclick/issues/251
	            if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
	                metaViewport = document.querySelector('meta[name=viewport]');
	
	                if (metaViewport) {
	                    // user-scalable=no eliminates click delay.
	                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
	                        return true;
	                    }
	                    // width=device-width (or less than device-width) eliminates click delay.
	                    if (document.documentElement.scrollWidth <= window.outerWidth) {
	                        return true;
	                    }
	                }
	            }
	        }
	
	        // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
	        if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
	            return true;
	        }
	
	        // Firefox version - zero for other browsers
	        firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];
	
	        if (firefoxVersion >= 27) {
	            // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896
	
	            metaViewport = document.querySelector('meta[name=viewport]');
	            if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
	                return true;
	            }
	        }
	
	        // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
	        // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
	        if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
	            return true;
	        }
	
	        return false;
	    };
	
	
	    /**
	     * Factory method for creating a FastClick object
	     *
	     * @param {Element} layer The layer to listen on
	     * @param {Object} [options={}] The options to override the defaults
	     */
	    FastClick.attach = function(layer, options) {
	        return new FastClick(layer, options);
	    };
	
	
	    if (true) {
	
	        // AMD. Register as an anonymous module.
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return FastClick;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module.exports) {
	        module.exports = FastClick.attach;
	        module.exports.FastClick = FastClick;
	    } else {
	        window.FastClick = FastClick;
	    }
	}());


/***/ },

/***/ 74:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });
//# sourceMappingURL=newShowEvent.js.map