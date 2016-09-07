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
/******/ 	var hotCurrentHash = "6f5de4947133366dc7ca"; // eslint-disable-line no-unused-vars
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
/******/ 			var chunkId = 0;
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
/******/ 	__webpack_require__.p = "/dist/";
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

	__webpack_require__(1);
	__webpack_require__(6);

/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(7);
	__webpack_require__(8);

/***/ },
/* 7 */
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
		//公历节日
		var solarFestival = {
			'd0101':'元旦节',
			'd0202':'世界湿地日',
			'd0210':'国际气象节',
			'd0214':'情人节',
			'd0301':'国际海豹日',
			'd0303':'全国爱耳日',
			'd0305':'学雷锋纪念日',
			'd0308':'妇女节',
			'd0312':'植树节 孙中山逝世纪念日',
			'd0314':'国际警察日',
			'd0315':'消费者权益日',
			'd0317':'中国国医节 国际航海日',
			'd0321':'世界森林日 消除种族歧视国际日 世界儿歌日',
			'd0322':'世界水日',
			'd0323':'世界气象日',
			'd0324':'世界防治结核病日',
			'd0325':'全国中小学生安全教育日',
			'd0330':'巴勒斯坦国土日',
			'd0401':'愚人节 全国爱国卫生运动月(四月) 税收宣传月(四月)',
			'd0407':'世界卫生日',
			'd0422':'世界地球日',
			'd0423':'世界图书和版权日',
			'd0424':'亚非新闻工作者日',
			'd0501':'劳动节',
			'd0504':'青年节',
			'd0505':'碘缺乏病防治日',
			'd0508':'世界红十字日',
			'd0512':'国际护士节',
			'd0515':'国际家庭日',
			'd0517':'世界电信日',
			'd0518':'国际博物馆日',
			'd0520':'全国学生营养日',
			'd0522':'国际生物多样性日',
			'd0523':'国际牛奶日',
			'd0531':'世界无烟日', 
			'd0601':'国际儿童节',
			'd0605':'世界环境日',
			'd0606':'全国爱眼日',
			'd0617':'防治荒漠化和干旱日',
			'd0623':'国际奥林匹克日',
			'd0625':'全国土地日',
			'd0626':'国际禁毒日',
			'd0701':'香港回归纪念日 中共诞辰 世界建筑日',
			'd0702':'国际体育记者日',
			'd0707':'抗日战争纪念日',
			'd0711':'世界人口日',
			'd0730':'非洲妇女日',
			'd0801':'建军节',
			'd0808':'中国男子节(爸爸节)',
			'd0815':'抗日战争胜利纪念',
			'd0908':'国际扫盲日 国际新闻工作者日',
			'd0909':'毛泽东逝世纪念',
			'd0910':'中国教师节', 
			'd0914':'世界清洁地球日',
			'd0916':'国际臭氧层保护日',
			'd0918':'九一八事变纪念日',
			'd0920':'国际爱牙日',
			'd0927':'世界旅游日',
			'd0928':'孔子诞辰',
			'd1001':'国庆节 世界音乐日 国际老人节',
			'd1002':'国际和平与民主自由斗争日',
			'd1004':'世界动物日',
			'd1006':'老人节',
			'd1008':'全国高血压日 世界视觉日',
			'd1009':'世界邮政日 万国邮联日',
			'd1010':'辛亥革命纪念日 世界精神卫生日',
			'd1013':'世界保健日 国际教师节',
			'd1014':'世界标准日',
			'd1015':'国际盲人节(白手杖节)',
			'd1016':'世界粮食日',
			'd1017':'世界消除贫困日',
			'd1022':'世界传统医药日',
			'd1024':'联合国日 世界发展信息日',
			'd1031':'世界勤俭日',
			'd1107':'十月社会主义革命纪念日',
			'd1108':'中国记者日',
			'd1109':'全国消防安全宣传教育日',
			'd1110':'世界青年节',
			'd1111':'国际科学与和平周(本日所属的一周)',
			'd1112':'孙中山诞辰纪念日',
			'd1114':'世界糖尿病日',
			'd1117':'国际大学生节 世界学生节',
			'd1121':'世界问候日 世界电视日',
			'd1129':'国际声援巴勒斯坦人民国际日',
			'd1201':'世界艾滋病日',
			'd1203':'世界残疾人日',
			'd1205':'国际经济和社会发展志愿人员日',
			'd1208':'国际儿童电视日',
			'd1209':'世界足球日',
			'd1210':'世界人权日',
			'd1212':'西安事变纪念日',
			'd1213':'南京大屠杀(1937年)纪念日！紧记血泪史！',
			'd1220':'澳门回归纪念',
			'd1221':'国际篮球日',
			'd1224':'平安夜',
			'd1225':'圣诞节',
			'd1226':'毛泽东诞辰纪念'
		};
		
		//农历节日
		var lunarFestival = {
			'd0101':'春节',
			'd0115':'元宵节',
			'd0202':'龙抬头节',
			'd0323':'妈祖生辰',
			'd0505':'端午节',
			'd0707':'七夕情人节',
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
				lunarDayName : DATA.dateCn[lunarDate[2]-1],
				lunarLeapMonth : lunarLeapMonth,
				
				solarFestival : solarFestival[formateDayD4(month,day)],
				lunarFestival : lunarFtv
			};
	
			return res;
		};
		
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {window.HuangLi = window.HuangLi || {};
	var LunarCalendar = __webpack_require__(7);
	(function () {
	    var mobile = {
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
	    mobile.init();
	    this.mobile = mobile;
	} ());
	
	(function() {
	    /**
	     * 动态加载js文件
	     * @param  {string}   url      js文件的url地址
	     * @param  {Function} callback 加载完成后的回调函数
	     */
	    var _getScript = function(url, callback) {
	        var head = document.getElementsByTagName('head')[0],
	            js = document.createElement('script');
	
	        js.setAttribute('type', 'text/javascript'); 
	        js.setAttribute('src', url); 
	
	        head.appendChild(js);
	
	        //执行回调
	        var callbackFn = function(){
				if(typeof callback === 'function'){
					callback();
				}
	        };
	
	        if (document.all) { //IE
	            js.onreadystatechange = function() {
	                if (js.readyState == 'loaded' || js.readyState == 'complete') {
	                    callbackFn();
	                }
	            }
	        } else {
	            js.onload = function() {
	                callbackFn();
	            }
	        }
	    }
	
	    //如果使用的是zepto，就添加扩展函数
	    if($){
	        $.getScript = _getScript;
	    }
	})();
	
	
	(function () {
	    var Footprint = function () {};
	      // Default template settings, uses ASP/PHP/JSP delimiters, change the
	      // following template settings to use alternative delimiters.
	    var templateSettings = {
	        evaluate : /<%([\s\S]+?)%>/g,
	        interpolate : /<%=([\s\S]+?)%>/g
	    };
	
	      // JavaScript micro-templating, similar to John Resig's implementation.
	      // Underscore templating handles arbitrary delimiters, preserves whitespace,
	      // and correctly escapes quotes within interpolated code.
	    Footprint.compile = function(str, settings) {
	        var c = settings || templateSettings;
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
	    };
	
	    // Preserves template method for compatible with legacy call.
	    Footprint.template = function (str, data) {
	        var compilied = Footprint.compile(str);
	        return compilied(data);
	    };
	  
	    if (true) {
	        exports.Footprint = Footprint;
	    } else {
	        window.Footprint = Footprint;
	    }
	
		//如果使用的是zepto，就添加扩展函数
	    if($){
	        $.template = Footprint.template;
	    }
	}());
	
	var Calendar = (function(){
		var hlMinYear = 2008;
		var hlMaxYear = 2020;
		var minYear = 1891;//最小年限
		var maxYear = 2100;//最大年限
		var itemTemp = [
			'<div class="date_item<%=itemCls%>" data-index="<%=index%>">',
			'	<span class="date_icon<%=iconCls%>"><%=iconText%></span>',
			'	<span class="date_day"><%=day%></span>',
			'	<span class="date_lunar<%=fetvCls%>"><%=lunar%></span>',
			'</div>'
		];
		
		var now = new Date();
		var current = null;
		var DATA = null;
		var panel = [0,1]; //当前显示面板panel[0]
		var pageWidth = 0; //设备宽度
		var slideIng = false; //是否滑动中
		var timer = -1;
		
		var formateDayD4 = function(month,day){
			month = month+1;
			month = month<10 ? '0'+month : month;
			day = day<10 ? '0'+day : day;
			return 'd'+month+day;
		};
		
		function formatDate(){
			if(!current)return '';
			var year = current.year;
			var month = current.month;
			var day = current.day;
			month = month<10 ? '0'+month : month;
			day = day<10 ? '0'+day : day;
			return year+'-'+month+'-'+day;
		};
		
		function setCurrentByNow(year,month,day,pos){
			current = {
				year : year || now.getFullYear(),
				month : month || now.getMonth()+1,
				day : day || now.getDate(),
				pos : pos || 0
			};
		};
		
		//黄历
		function getHL(){
			if(HuangLi['y'+current.year]){ //该年已有黄历数据
				var hl = HuangLi['y'+current.year][formateDayD4(current.month,current.day)];
				showHL(hl);
			}else if(current.year>=hlMinYear && current.year<=hlMaxYear){
	            __webpack_require__(10)("./hl"+current.year+'.js');
	            var hl = HuangLi['y'+current.year][formateDayD4(current.month,current.day)];
	            showHL(hl);
			}
		}
		function showHL(hl){
			if(hl){
				$('.hl_y_content').html(hl.y);
				$('.hl_j_content').html(hl.j);
				$('.date_hl').show();
			}else{
				$('.date_hl').hide();
			}
		};
		
		function showInfo(_this){
			var currentLunar = LunarCalendar.solarToLunar(current.year,current.month,current.day);
			var weekday = new Date(current.year,current.month-1,current.day).getDay();
			var weekList = ['日','一','二','三','四','五','六'];
			$('#toolbar h1').html(formatDate());
			$('.date_lunar_info').html('农历'+currentLunar.lunarMonthName+currentLunar.lunarDayName+' 星期'+weekList[weekday]);
			$('.date_gan_zhi').html(currentLunar.GanZhiYear+'年['+currentLunar.zodiac+'年] '+currentLunar.GanZhiMonth+'月 '+currentLunar.GanZhiDay+'日');
			
			var fetv = [];
			if(currentLunar.term) fetv.push(currentLunar.term);
			if(currentLunar.lunarFestival) fetv.push(currentLunar.lunarFestival);
			if(currentLunar.solarFestival) fetv.push(currentLunar.solarFestival.split(' '));
			$('.date_fetv').html(fetv.length>0 ? '节假日纪念日：'+fetv.join('，') : '');
			
			//当前日期
			if(_this){
				_this.attr('class','date_item date_current');
			}
			
			//拉取黄历
			getHL();
		};
		
		//恢复指定日期的状态信息
		function resetInfo(){
			//今天
			var oldObj = $('#date_list_'+panel[0]).find('.date_item').eq(current.pos);
			if(now.getFullYear()==current.year && now.getMonth()+1==current.month && now.getDate()==current.day){
				oldObj.attr('class','date_item date_today');
			}else{
				oldObj.attr('class','date_item');
			}
		};
		
		function showDate(){
			DATA = LunarCalendar.calendar(current.year,current.month,true);
			
			var dateHtml = '';
			var temp = itemTemp.join('');
			
			for(var i=0;i<DATA.monthData.length;i++){
				var itemData = DATA.monthData[i];
				
				if(i%7==0){ //某行第一列
					dateHtml+='<div class="date_row">'
				};
				
				var extendObj = {
					index : i,
					itemCls: '',
					iconCls: itemData.worktime ? (itemData.worktime==1 ? ' worktime' : ' holiday') : '',
					iconText: itemData.worktime ? (itemData.worktime==1 ? '班' : '休') : '',
					fetvCls: (itemData.lunarFestival || itemData.term) ? ' lunar_fetv' : (itemData.solarFestival ? ' solar_fetv' : ''),
					lunar: ''
				};
				
				var itemCls = '';
				if(now.getFullYear()==itemData.year && now.getMonth()+1==itemData.month && now.getDate()==itemData.day){
					itemCls = ' date_today';
				}
				if(current.year==itemData.year && current.month==itemData.month && current.day==itemData.day){ //当前选中
					itemCls = ' date_current';
					current.pos = i;
				}
				if(i<DATA.firstDay || i>=DATA.firstDay+DATA.monthDays){ //非本月日期
					itemCls = ' date_other';
				}
				extendObj.itemCls = itemCls;
				
				var lunar = itemData.lunarDayName;
				//以下判断根据优先级
				if(itemData.solarFestival) lunar = itemData.solarFestival;
				if(itemData.lunarFestival) lunar = itemData.lunarFestival;
				if(itemData.term) lunar = itemData.term;
				extendObj.lunar = lunar;
				
				$.extend(itemData,extendObj);
				
				dateHtml += $.template(temp,itemData);
				
				if(i%7==6){//某行尾列
					dateHtml+='</div>';
				};
			};
			
			$('#date_list_'+panel[0]).html(dateHtml);
			
			showInfo();
		};
		
		//切换月份，可指定
		function pageDate(offset,_year,_month,_day){
			var year,month,day;
			if(_year && _month){ //直接指定
				year = _year;
				month = _month;
			}else{
				if(current.month+offset<1){ //上一年
					year = current.year-1;
					month = 12;
				}else if(current.month+offset>12){ //下一年
					year = current.year+1;
					month = 1;
				}else{
					year = current.year;
					month = current.month+offset;
				}
			}
			day = _day ? _day : (current.day > LunarCalendar.getSolarMonthDays[month-1] ? LunarCalendar.getSolarMonthDays[month-1] : current.day);
			if(year<minYear || year>maxYear)return; //超过范围
			
			setCurrentByNow(year,month,day);
			changePanel();
			showDate();
			
			slide(offset);
		};
		function changePanel(){
			var first = panel.shift();
			panel.push(first);
		};
		//滑动
		function slide(offset){
			timer && clearTimeout(timer);
			setSlidePos({time:0,pos:0});
			$('#date_list_'+panel[0]).css({left:offset * pageWidth}); //将要显示
			$('#date_list_'+panel[1]).css({left:0}); //当前显示
			
			if(offset>0){//左滑
				timer = setTimeout(function(){
					setSlidePos({time:300,pos:pageWidth * -1});
				},50);
			}else{ //右滑
				timer = setTimeout(function(){
					setSlidePos({time:300,pos:pageWidth});
				},50);
			}
		};
		function setSlidePos(opt){
			var slide = $('.date_slide')[0];
			slide.style.webkitTransitionDuration = opt.time+'ms';
			setTranslate(slide,opt.pos);
		};
		function setTranslate(obj,pos){
			if(mobile.platform=='iOS'){//iOS下启用3d加速，安卓下有BUG，使用2d
				obj.style.webkitTransform = 'translate3d('+pos+'px,0px,0px)';
			}else{
				obj.style.webkitTransform = 'translate('+pos+'px,0px)';
			}
		};
		
		function addEvent(){ //base hammer.js
			$('body').delegate('.date_item','tap',function(){
				var index = $(this).attr('data-index');
				index = parseInt(index,10);
				var itemData = DATA.monthData[index];
				
				if(index<DATA.firstDay){ //上一个月
					pageDate(-1,itemData.year,itemData.month,itemData.day);
				}else if(index>=DATA.firstDay+DATA.monthDays){//下一个月
					pageDate(1,itemData.year,itemData.month,itemData.day);
				}else{
					resetInfo();
					setCurrentByNow(itemData.year,itemData.month,itemData.day,index);
					showInfo($(this));
				}
			});
			
			$('.today').on('tap',function(event){
				pageDate(1,now.getFullYear(),now.getMonth()+1,now.getDate());
				return false;
			});
			
			$('.slide_wrap').on('swipeleft',function(event){
				pageDate(1);
				event.preventDefault();
				event.gesture.preventDefault();
				return false;
			});
			
			$('.slide_wrap').on('swiperight',function(event){
				pageDate(-1);
				event.preventDefault();
				event.gesture.preventDefault();
				return false;
			});
		};
		
		function initPageElm(){
			pageWidth = $(document).width();
			$('.date_list').eq(0).css('width',pageWidth);
			$('.date_list').eq(1).css({'width':pageWidth,'left':pageWidth});
			if(mobile.platform=='iOS'){//iOS启用3d，同时将子元素也设置一下，防止BUG
				setTranslate(document.getElementById('date_list_0'),0);
				setTranslate(document.getElementById('date_list_1'),0);
			}
		};
		
		function init(){
			initPageElm();
			addEvent();
			setCurrentByNow();
			showDate();
		};
		
		return {
			init : init
		};
	})();
	
	$(function(){
		Calendar.init();
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ },
/* 9 */
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
	
	window.Zepto = Zepto
	'$' in window || (window.$ = Zepto)
	
	if ( true ) {
	  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () { return Zepto; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./hl2008.js": 11,
		"./hl2009.js": 12,
		"./hl2010.js": 13,
		"./hl2011.js": 14,
		"./hl2012.js": 15,
		"./hl2013.js": 16,
		"./hl2014.js": 17,
		"./hl2015.js": 18,
		"./hl2016.js": 19,
		"./hl2017.js": 20,
		"./hl2018.js": 21,
		"./hl2019.js": 22,
		"./hl2020.js": 23
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 10;


/***/ },
/* 11 */
/***/ function(module, exports) {

	window.HuangLi = window.HuangLi || {};
	HuangLi.y2008 = {
		"d0101": {
			"y": "教牛马.余事勿取xixi.",
			"j": "入宅.动土.破土.余事勿取."
		},
		"d0102": {
			"y": "嫁娶.出行.求医.治病.祭祀.祈福.上梁.纳畜.",
			"j": "开市.安葬."
		},
		"d0103": {
			"y": "开市.立券.开光.解除.安机械.上梁.启攒.安葬.",
			"j": "嫁娶.祈福."
		},
		"d0104": {
			"y": "平治道涂.余事勿取.",
			"j": "诸事不宜."
		},
		"d0105": {
			"y": "求嗣.斋醮.塑绘.订盟.纳采.出火.拆卸.修造.动土.造桥.安机械.栽种.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.",
			"j": "开市.嫁娶."
		},
		"d0106": {
			"y": "嫁娶.订盟.纳采.会亲友.祭祀.安机械.移徙.入宅.造屋.安床.起基.定磉.安香.出火.挂匾.拆卸.置产.",
			"j": "开市.出行.安葬.行丧."
		},
		"d0107": {
			"y": "沐浴.捕捉.畋猎.理发.整手足甲.入殓.除服.成服.破土.安葬.谢土.立碑.修坟.启攒.",
			"j": "纳采.订盟.嫁娶.上梁.开市.斋醮.造屋.安门."
		},
		"d0108": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "斋醮.嫁娶.开市."
		},
		"d0109": {
			"y": "沐浴.开仓.出货财.开市.交易.立券.纳财.栽种.纳畜.牧养.畋猎.入殓.破土.安葬.",
			"j": "祈福.嫁娶.安床.入宅.造船."
		},
		"d0110": {
			"y": "祭祀.沐浴.补垣.塞穴.断蚁.解除.余事勿取.",
			"j": "造庙.入宅.修造.安葬.行丧.嫁娶."
		},
		"d0111": {
			"y": "嫁娶.纳采.订盟.问名.祭祀.冠笄.裁衣.会亲友.进人口.纳财.捕捉.作灶.",
			"j": "开市.安床.安葬.修坟."
		},
		"d0112": {
			"y": "订盟.纳采.会亲友.祭祀.斋醮.沐浴.塑绘.出火.开光.竖柱.上梁.开市.交易.立券.作梁.开柱眼.伐木.架马.安门.安床.拆卸.牧养.造畜椆栖.掘井.",
			"j": "造庙.嫁娶.出行.动土.安葬.行丧."
		},
		"d0113": {
			"y": "交易.立券.纳财.安床.裁衣.造畜椆栖.安葬.谢土.启攒.除服.成服.修坟.立碑.移柩.入殓.",
			"j": "开光.嫁娶.开市.动土.破土."
		},
		"d0114": {
			"y": "祭祀.解除.教牛马.会亲友.余事勿取.",
			"j": "破土.动土.安葬."
		},
		"d0115": {
			"y": "纳采.订盟.移徙.纳财.开市.交易.立券.入宅.会亲友.解除.求医.治病.入学.安床.安门.安香.出火.拆卸.扫舍.入宅.挂匾.开生坟.合寿木.破土.修坟.启攒.入殓.",
			"j": "探病.祭祀.出行.上梁.造屋.谢土.安葬."
		},
		"d0116": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求嗣.会亲友.解除.出行.入学.纳财.开市.交易.立券.习艺.经络.安床.开仓.出货财.纳畜.安葬.启攒.修坟.入殓.",
			"j": "入宅.开光.开市.动土."
		},
		"d0117": {
			"y": "祭祀.冠笄.嫁娶.会亲友.进人口.裁衣.结网.平治道涂.",
			"j": "移徙.入宅.造庙.作灶.治病.安葬."
		},
		"d0118": {
			"y": "祭祀.安碓硙.结网.余事勿取.",
			"j": "嫁娶.安葬."
		},
		"d0119": {
			"y": "嫁娶.祭祀.沐浴.裁衣.出行.理发.移徙.捕捉.畋猎.放水.入宅.除服.成服.启攒.安葬.移柩.入殓.",
			"j": "造屋.开市.动土.破土."
		},
		"d0120": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "嫁娶.开市.安葬."
		},
		"d0121": {
			"y": "纳采.订盟.祭祀.求嗣.出火.塑绘.裁衣.会亲友.入学.拆卸.扫舍.造仓.挂匾.掘井.开池.结网.栽种.纳畜.破土.修坟.立碑.安葬.入殓.",
			"j": "祈福.嫁娶.造庙.安床.谢土."
		},
		"d0122": {
			"y": "入殓.除服.成服.移柩.启攒.安葬.修坟.立碑.",
			"j": "开市.伐木.嫁娶.作梁."
		},
		"d0123": {
			"y": "祭祀.作灶.入殓.除服.余事勿取.",
			"j": "开市.安床."
		},
		"d0124": {
			"y": "塑绘.开光.沐浴.冠笄.会亲友.作灶.放水.造畜椆栖.",
			"j": "嫁娶.入殓.安葬.出行."
		},
		"d0125": {
			"y": "祭祀.沐浴.祈福.斋醮.订盟.纳采.裁衣.拆卸.起基.竖柱.上梁.安床.入殓.除服.成服.移柩.启攒.挂匾.求嗣.出行.合帐.造畜椆栖.",
			"j": "开仓.嫁娶.移徙.入宅."
		},
		"d0126": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜."
		},
		"d0127": {
			"y": "沐浴.解除.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.移徙.入宅.除服.成服.移柩.破土.启攒.安葬.扫舍.修坟.伐木.纳财.交易.立券.",
			"j": "作灶.祭祀.上梁.出行."
		},
		"d0128": {
			"y": "出行.嫁娶.订盟.纳采.入殓.安床.启攒.安葬.祭祀.裁衣.会亲友.进人口.",
			"j": "作灶.掘井.谢土.入宅."
		},
		"d0129": {
			"y": "修饰垣墙.平治道涂.入殓.移柩.余事勿取.",
			"j": "嫁娶.移徙.入宅.开光."
		},
		"d0130": {
			"y": "会亲友.纳采.进人口.修造.动土.竖柱.上梁.祭祀.开光.塑绘.祈福.斋醮.嫁娶.安床.移徙.入宅.安香.纳畜.",
			"j": "出行.治病.安葬.开市."
		},
		"d0131": {
			"y": "祭祀.会亲友.出行.订盟.纳采.沐浴.修造.动土.祈福.斋醮.嫁娶.拆卸.安床.入殓.移柩.安葬.谢土.赴任.裁衣.竖柱.上梁.伐木.捕捉.栽种.破土.安门.",
			"j": "造屋.开市.作灶.入宅."
		},
		"d0201": {
			"y": "解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜."
		},
		"d0202": {
			"y": "塑绘.开光.出行.订盟.纳采.除服.成服.嫁娶.纳婿.入殓.移柩.启攒.安葬.立碑.",
			"j": "入宅.安床."
		},
		"d0203": {
			"y": "入殓.除服.成服.移柩.启攒.安葬.立碑.余事勿取.",
			"j": "破土.伐木."
		},
		"d0204": {
			"y": "塞穴.结网.取渔.畋猎.",
			"j": "嫁娶.安门.移徙.入宅.安葬."
		},
		"d0205": {
			"y": "纳采.祭祀.祈福.出行.会亲友.修造.动土.移徙.入宅.",
			"j": "嫁娶.开市.安葬.破土."
		},
		"d0206": {
			"y": "纳采.嫁娶.祭祀.祈福.出行.开市.会亲友.动土.破土.启攒.",
			"j": "移徙.入宅.出火.安门.安葬."
		},
		"d0207": {
			"y": "祭祀.祈福.求嗣.斋醮.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "嫁娶.动土.开光.造屋.破土."
		},
		"d0208": {
			"y": "纳采.会亲友.竖柱.上梁.立券.入殓.移柩.安葬.启攒.",
			"j": "祭祀.移徙.入宅.动土.破土."
		},
		"d0209": {
			"y": "祭祀.祈福.斋醮.出行.开市.立券.动土.移徙.入宅.破土.安葬.",
			"j": "开光.嫁娶.作灶.掘井.纳畜."
		},
		"d0210": {
			"y": "会亲友.求嗣.理发.冠笄.结网.捕捉.开光.理发.",
			"j": "开市.动土.安葬.破土."
		},
		"d0211": {
			"y": "祭祀.平治道涂.余事勿取.",
			"j": "嫁娶.祈福.掘井.安葬."
		},
		"d0212": {
			"y": "祈福.求嗣.斋醮.纳采.嫁娶.伐木.修造.动土.移徙.入宅.造庙.安机械.开市.入殓.除服.成服.移柩.安葬.破土.谢土.",
			"j": "置产.造屋.合脊.开光.探病.安门.作灶."
		},
		"d0213": {
			"y": "入学.习艺.出行.纳采.订盟.嫁娶.会亲友.进人口.牧养.捕捉.入殓.移柩.安葬.启攒.",
			"j": "开光.开市.入宅.动土.造屋."
		},
		"d0214": {
			"y": "祭祀.沐浴.求医.治病.扫舍.破屋.坏垣.解除.余事勿取.",
			"j": "入宅.开市.安葬."
		},
		"d0215": {
			"y": "祭祀.冠笄.嫁娶.拆卸.修造.动土.起基.上梁.造屋.入宅.开市.开池.塞穴.入殓.除服.成服.移柩.安葬.破土.",
			"j": "安床.栽种.治病.作灶."
		},
		"d0216": {
			"y": "",
			"j": ""
		},
		"d0217": {
			"y": "塑绘.开光.祈福.求嗣.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.起基.安门.安床.移徙.造仓.结网.纳畜.",
			"j": "伐木.作灶.安葬.取渔.入宅."
		},
		"d0218": {
			"y": "祭祀.沐浴.开光.塑绘.祈福.求嗣.订盟.纳采.冠笄.裁衣.嫁娶.动土.除服.成服.移柩.破土.启攒.出行.安碓硙.放水.开市.立券.交易.",
			"j": "安葬.上梁.入宅.作灶."
		},
		"d0219": {
			"y": "祭祀.祈福.求嗣.酬神.裁衣.安床.立券.交易.入殓.除服.成服.移柩.谢土.启攒.",
			"j": "出行.嫁娶.入宅.动土."
		},
		"d0220": {
			"y": "裁衣.合帐.入殓.除服.成服.会亲友.纳财.",
			"j": "祭祀.祈福.移徙.嫁娶.入宅."
		},
		"d0221": {
			"y": "祭祀.斋醮.裁衣.合帐.冠笄.订盟.纳采.嫁娶.入宅.安香.谢土.入殓.移柩.破土.立碑.安香.会亲友.出行.祈福.求嗣.立碑.上梁.放水.",
			"j": "掘井."
		},
		"d0222": {
			"y": "安床.合帐.入宅.问名.纳采.求嗣.祭祀.开仓.",
			"j": "斋醮.作灶.安床.安葬."
		},
		"d0223": {
			"y": "",
			"j": ""
		},
		"d0224": {
			"y": "塑绘.开光.酬神.斋醮.订盟.纳采.裁衣.合帐.拆卸.动土.上梁.安床.安香.造庙.挂匾.会亲友.进人口.出行.修造.纳财.伐木.放水.出火.纳畜.沐浴.安门.",
			"j": "造屋.栽种.安葬.作灶."
		},
		"d0225": {
			"y": "祭祀.祈福.酬神.订盟.纳采.冠笄.裁衣.合帐.嫁娶.安床.移徙.入宅.安香.入殓.移柩.启攒.安葬.解除.取渔.捕捉.伐木.安门.出火.",
			"j": "栽种.动土.开市.作灶."
		},
		"d0226": {
			"y": "求医.破屋.",
			"j": "诸事不宜."
		},
		"d0227": {
			"y": "祈福.求嗣.斋醮.塑绘.开光.订盟.纳采.嫁娶.动土.入宅.安香.移柩.安葬.谢土.出行.沐浴.修造.竖柱.上梁.纳财.破土.解除.安门.放水.",
			"j": "作灶.安床."
		},
		"d0228": {
			"y": "取渔.入殓.除服.成服.移柩.破土.安葬.立碑.",
			"j": "嫁娶.上梁.入宅.作灶."
		},
		"d0229": {
			"y": "祭祀.求嗣.沐浴.酬神.订盟.纳采.裁衣.合帐.冠笄.安机械.安床.造仓.开池.经络.纳财.开市.立券.交易.结网.取渔.纳畜.捕捉.",
			"j": "安葬.作灶.伐木.作梁."
		},
		"d0301": {
			"y": "祭祀.沐浴.祈福.求嗣.斋醮.订盟.纳采.裁衣.冠笄.开市.立券.交易.纳财.沐浴.除服.谢土.出行.移柩.",
			"j": "入殓.安葬.作灶.入宅."
		},
		"d0302": {
			"y": "祭祀.祈福.求嗣.入殓.启攒.安葬.移柩.",
			"j": "开光.掘井.针灸.出行.嫁娶.入宅.移徙.作灶.动土."
		},
		"d0303": {
			"y": "安床.解除.裁衣.竖柱.上梁.交易.立券.纳财.纳畜.牧养.入殓.移柩.安葬.启攒.",
			"j": "嫁娶.出行.动土.开渠.入宅.祭祀.掘井."
		},
		"d0304": {
			"y": "嫁娶.安床.开光.出行.祭祀.动土.出火.解除.会亲友.开市.交易.立券.挂匾.入宅.移徙.拆卸.破土.启攒.安葬.",
			"j": "掘井.词讼."
		},
		"d0305": {
			"y": "祭祀.沐浴.解除.扫舍.塞穴.牧养.",
			"j": "嫁娶.安葬.行丧.安门."
		},
		"d0306": {
			"y": "",
			"j": ""
		},
		"d0307": {
			"y": "嫁娶.冠笄.会亲友.安机械.纳财.交易.立券.置产.",
			"j": "开市.造屋.治病.作灶."
		},
		"d0308": {
			"y": "嫁娶.造车器.纳采.订盟.祭祀.祈福.安机械.移徙.入宅.开市.立券.破土.安葬.",
			"j": "纳畜.理发.合寿木."
		},
		"d0309": {
			"y": "祈福.斋醮.出行.移徙.入宅.修造.动土.破土.安葬.",
			"j": "纳采.开光.安床.嫁娶.开市."
		},
		"d0310": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "嫁娶.移徙.开市.入宅."
		},
		"d0311": {
			"y": "嫁娶.冠笄.祭祀.出行.会亲友.修造.动土.入殓.破土.",
			"j": "塑绘.开光.造桥.除服.成服."
		},
		"d0312": {
			"y": "开光.求嗣.出行.纳采.冠笄.出火.拆卸.起基.修造.动土.上梁.移徙.造船.开市.交易.立券.纳财.",
			"j": "祈福.嫁娶.安葬.破土."
		},
		"d0313": {
			"y": "理发.冠笄.嫁娶.进人口.栽种.捕捉.针灸.",
			"j": "纳财.开市.安葬.破土."
		},
		"d0314": {
			"y": "开光.祈福.求嗣.出行.解除.伐木.造屋.起基.修造.架马.安门.移徙.入宅.造庙.除服.成服.移柩.谢土.纳畜.牧养.",
			"j": "纳采.动土.开市.交易.安门."
		},
		"d0315": {
			"y": "裁衣.经络.伐木.开柱眼.拆卸.修造.动土.上梁.合脊.合寿木.入殓.除服.成服.移柩.破土.安葬.启攒.修坟.立碑.",
			"j": "祭祀.嫁娶.出行.上梁.掘井."
		},
		"d0316": {
			"y": "祭祀.会亲友.立券.交易.裁衣.合帐.嫁娶.冠笄.进人口.",
			"j": "栽种.动土.安葬.掘井.修坟.探病."
		},
		"d0317": {
			"y": "扫舍.塞穴.余事勿取.",
			"j": "诸事不宜."
		},
		"d0318": {
			"y": "塑绘.开光.订盟.纳采.裁衣.合帐.冠笄.安机械.会亲友.纳财.开市.立券.交易.安床.竖柱.上梁.结网.栽种.解除.经络.",
			"j": "作灶.出行.入宅.安葬."
		},
		"d0319": {
			"y": "祭祀.嫁娶.纳婿.除服.成服.入殓.移柩.",
			"j": "动土.作灶.入宅.开光.安床."
		},
		"d0320": {
			"y": "祈福.求嗣.开光.塑绘.斋醮.订盟.纳采.嫁娶.拆卸.安床.入宅.安香.移柩.修坟.安葬.谢土.栽种.解除.冠笄.裁衣.移徙.修造.动土.竖柱.放水.启攒.立碑.",
			"j": "赴任."
		},
		"d0321": {
			"y": "祭祀.解除.入殓.除服.成服.移柩.启攒.安葬.修坟.立碑.谢土.沐浴.扫舍.捕捉.取渔.结网.畋猎.理发.",
			"j": "安床.嫁娶.作灶.入宅."
		},
		"d0322": {
			"y": "破屋.坏垣.",
			"j": "诸事不宜."
		},
		"d0323": {
			"y": "祭祀.出行.订盟.纳采.裁衣.合帐.冠笄.进人口.动土.安床.作灶.入殓.移柩.安葬.破土.结网.取渔.畋猎.",
			"j": "作梁.造庙."
		},
		"d0324": {
			"y": "祭祀.开光.塑绘.订盟.纳采.合帐.冠笄.拆卸.动土.起基.上梁.入宅.安香.开市.立券.纳财.沐浴.求嗣.出火.竖柱.安门.",
			"j": "造庙.嫁娶.伐木.安葬."
		},
		"d0325": {
			"y": "祭祀.沐浴.捕捉.栽种.",
			"j": "嫁娶.入宅.移徙.作灶.安葬."
		},
		"d0326": {
			"y": "祭祀.开光.塑绘.酬神.斋醮.订盟.纳采.嫁娶.裁衣.动土.起基.出火.拆卸.移徙.入宅.安香.修造.竖柱.上梁.纳畜.牧养.祈福.求嗣.解除.伐木.定磉.造屋.安门.",
			"j": "栽种.安葬."
		},
		"d0327": {
			"y": "订盟.纳采.冠笄.拆卸.修造.动土.安床.入殓.除服.成服.移柩.安葬.破土.启攒.造仓.",
			"j": "作灶.开光.嫁娶.开市.入宅."
		},
		"d0328": {
			"y": "祈福.开光.塑绘.酬神.订盟.纳采.裁衣.安床.开市.立券.入殓.除服.成服.移柩.启攒.安葬.立碑.赴任.会亲友.出行.交易.竖柱.",
			"j": "作灶.掘井.动土.栽种."
		},
		"d0329": {
			"y": "祭祀.扫舍.塞穴.",
			"j": "栽种.作灶.安葬.嫁娶."
		},
		"d0330": {
			"y": "开光.塑绘.裁衣.冠笄.伐木.拆卸.竖柱.上梁.开仓.会亲友.安机械.造仓.造屋.交易.解除.开市.立券.纳财.",
			"j": "出行.嫁娶.入宅.安葬."
		},
		"d0331": {
			"y": "冠笄.入殓.除服.成服.移柩.平治道涂.修饰垣墙.",
			"j": "造屋.作灶.治病.探病."
		},
		"d0401": {
			"y": "祭祀.嫁娶.祈福.纳采.裁衣.合帐.安床.入宅.安香.入殓.移柩.安葬.谢土.修造.安碓硙.求嗣.会亲友.挂匾.交易.立券.纳财.造仓.放水.",
			"j": "栽种.伐木."
		},
		"d0402": {
			"y": "祭祀.祈福.斋醮.订盟.纳采.裁衣.合帐.拆卸.修造.动土.上梁.起基.移柩.安葬.谢土.沐浴.扫舍.开柱眼.伐木.出火.",
			"j": "安床.开市.立券.作灶."
		},
		"d0403": {
			"y": "",
			"j": ""
		},
		"d0404": {
			"y": "祭祀.沐浴.解除.求医.治病.破屋.坏垣.余事勿取.",
			"j": "祈福.斋醮.开市.安葬."
		},
		"d0405": {
			"y": "沐浴.捕捉.畋猎.结网.取渔.",
			"j": "祭祀.嫁娶.入宅.作灶.安葬."
		},
		"d0406": {
			"y": "祭祀.祈福.求嗣.斋醮.纳采.订盟.开光.竖柱.上梁.开仓.出货财.造屋.起基.定磉.安门.诸事不宜.破土.入殓.启攒.谢土.",
			"j": "出火.嫁娶.开市."
		},
		"d0407": {
			"y": "祭祀.捕捉.解除.余事勿取.",
			"j": "嫁娶.安葬."
		},
		"d0408": {
			"y": "纳采.嫁娶.出行.开市.立券.纳畜.牧养.出火.移徙.入宅.",
			"j": "祈福.动土.破土.安葬.入殓."
		},
		"d0409": {
			"y": "祭祀.祈福.求嗣.斋醮.冠笄.作灶.纳财.交易.",
			"j": "开光.嫁娶.掘井.安葬.安门.探病."
		},
		"d0410": {
			"y": "祭祀.解除.教牛马.出行.余事勿取.",
			"j": "动土.破土.行丧.开光.作梁.安葬.探病."
		},
		"d0411": {
			"y": "沐浴.斋醮.解除.求医.治病.会亲友.造畜椆栖.栽种.理发.扫舍.",
			"j": "开市.嫁娶.移徙.入宅.掘井.安葬."
		},
		"d0412": {
			"y": "求嗣.出行.解除.订盟.纳采.嫁娶.会亲友.进人口.安床.开市.交易.纳畜.牧养.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "祈福.开市.修造.动土.破土.谢土."
		},
		"d0413": {
			"y": "祭祀.作灶.平治道涂.余事勿取.",
			"j": "嫁娶.安葬.动土.安床.治病."
		},
		"d0414": {
			"y": "造车器.祭祀.祈福.求嗣.斋醮.开市.交易.安机械.雕刻.开光.造屋.合脊.起基.定磉.安门.纳畜.安葬.开生坟.立碑.谢土.斋醮.",
			"j": "入宅.动土.开仓.出货财."
		},
		"d0415": {
			"y": "祭祀.祈福.开光.求嗣.斋醮.纳采.订盟.求医.治病.起基.定磉.造船.取渔.解除.安葬.启攒.谢土.入殓.",
			"j": "开市.动土.掘井.开池."
		},
		"d0416": {
			"y": "祭祀.沐浴.破屋.坏垣.求医.治病.解除.余事勿取.",
			"j": "嫁娶.开市.交易.入宅.安葬."
		},
		"d0417": {
			"y": "诸事不宜.",
			"j": "诸事不宜."
		},
		"d0418": {
			"y": "祭祀.塑绘.开光.订盟.纳采.冠笄.裁衣.安机械.拆卸.修造.动土.安床.经络.开市.",
			"j": "出火.入宅.安葬.伐木."
		},
		"d0419": {
			"y": "祭祀.余事勿取.",
			"j": "造庙.嫁娶.安床.余事勿取."
		},
		"d0420": {
			"y": "订盟.纳采.嫁娶.进人口.会亲友.交易.立券.动土.除服.谢土.移柩.破土.启攒.赴任.出行.开市.纳财.栽种.",
			"j": "入殓.安葬.入宅.安床."
		},
		"d0421": {
			"y": "祭祀.祈福.裁衣.合帐.安床.入殓.除服.成服.移柩.破土.启攒.安葬.谢土.立碑.造畜椆栖.",
			"j": "掘井.安门.嫁娶.纳采."
		},
		"d0422": {
			"y": "祭祀.进人口.嫁娶.安床.解除.冠笄.出行.裁衣.扫舍.",
			"j": "掘井.动土.破土.安葬.开光."
		},
		"d0423": {
			"y": "纳采.开光.求医.治病.动土.上梁.移徙.入宅.",
			"j": "嫁娶.开市.安葬."
		},
		"d0424": {
			"y": "祭祀.会亲友.开市.安床.启攒.安葬.",
			"j": "嫁娶.动土.破土."
		},
		"d0425": {
			"y": "祭祀.作灶.掘井.平治道涂.",
			"j": "嫁娶.安葬."
		},
		"d0426": {
			"y": "祭祀.斋醮.开市.动土.入殓.破土.安葬.",
			"j": "嫁娶.移徙.入宅."
		},
		"d0427": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.移徙.求医.",
			"j": "开市.动土.破土."
		},
		"d0428": {
			"y": "祭祀.求医.治病.解除.余事勿取.",
			"j": "诸事不宜."
		},
		"d0429": {
			"y": "沐浴.结网.取渔.",
			"j": "嫁娶.入宅.安葬."
		},
		"d0430": {
			"y": "",
			"j": "诸事不宜."
		},
		"d0501": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜."
		},
		"d0502": {
			"y": "嫁娶.开光.出行.出火.拆卸.进人口.开市.立券.交易.挂匾.入宅.移徙.安床.栽种.",
			"j": "祈福.入殓.祭祀.作灶.安葬.探病."
		},
		"d0503": {
			"y": "嫁娶.出行.合帐.冠笄.安床.除服.成服.作灶.交易.立券.入殓.移柩.破土.安葬.",
			"j": "词讼.开光.开市."
		},
		"d0504": {
			"y": "出行.修饰垣墙.造畜椆栖.教牛马.余事勿取.",
			"j": "诸事不宜."
		},
		"d0505": {
			"y": "祭祀.解除.断蚁.会亲友.余事勿取.",
			"j": "嫁娶.安葬."
		},
		"d0506": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.治病.造车器.修造.动土.移徙.入宅.",
			"j": "开市.出行.安床.作灶.安葬."
		},
		"d0507": {
			"y": "嫁娶.纳采.订盟.会亲友.安机械.结网.冠笄.祭祀.求嗣.进人口.经络.",
			"j": "开市.作灶.动土.行丧.安葬."
		},
		"d0508": {
			"y": "祭祀.沐浴.移徙.破土.安葬.扫舍.平治道涂.",
			"j": "祈福.嫁娶.入宅.安床.作灶."
		},
		"d0509": {
			"y": "祭祀.祈福.斋醮.求嗣.安机械.纳畜.移徙.入宅.安机械.塑绘.开光.起基.竖柱.上梁.作灶.安门.安香.出火.造屋.启攒.安葬.",
			"j": "动土.破土.嫁娶.嫁娶."
		},
		"d0510": {
			"y": "嫁娶.纳采.订盟.斋醮.开光.祭祀.祈福.求医.治病.会亲友.动土.解除.捕捉.纳畜.牧养.入殓.破土.安葬.",
			"j": "移徙.入宅.造屋.架马."
		},
		"d0511": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "行丧.安葬."
		},
		"d0512": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "斋醮.开市.嫁娶.作灶."
		},
		"d0513": {
			"y": "开市.交易.立券.安机械.会亲友.开光.求医.治病.造屋.起基.修造.动土.定磉.竖柱.上梁.安门.作灶.放水.作厕.开池.栽种.牧养.造畜椆栖.破土.安葬.立碑.",
			"j": "嫁娶.出火.移徙.入宅."
		},
		"d0514": {
			"y": "栽种.捕捉.畋猎.余事勿取.",
			"j": "开市.动土.祭祀.斋醮.安葬.探病."
		},
		"d0515": {
			"y": "嫁娶.祭祀.祈福.求嗣.斋醮.订盟.纳采.解除.出行.动土.破土.习艺.针灸.理发.会亲友.起基.修造.动土.竖柱.定磉.安床.拆卸.纳畜.牧养.放水.破土.除服.成服.修坟.立碑.",
			"j": "开市.入宅.探病.出火.造屋."
		},
		"d0516": {
			"y": "余事勿取.",
			"j": "余事勿取."
		},
		"d0517": {
			"y": "塞穴.断蚁.结网.余事勿取.",
			"j": "破土.安葬."
		},
		"d0518": {
			"y": "开光.出行.纳采.嫁娶.伐木.架马.出火.拆卸.移徙.入宅.造庙.造桥.造船.造畜椆栖.开市.入殓.除服.成服.移柩.安葬.",
			"j": ""
		},
		"d0519": {
			"y": "进人口.牧养.置产.塞穴.结网.余事勿取.",
			"j": "诸事不宜."
		},
		"d0520": {
			"y": "开光.出行.嫁娶.",
			"j": "会亲友.进人口.修造.动土.起基.移徙.开市.纳畜.入殓.除服.成服.移柩.破土.安葬.修坟.立碑.会亲友."
		},
		"d0521": {
			"y": "嫁娶.纳采.出行.祭祀.祈福.开市.动土.移徙.入宅.破土.安葬.",
			"j": "安门."
		},
		"d0522": {
			"y": "嫁娶.纳采.求医.治病.修造.动土.移徙.入宅.破土.安葬.",
			"j": "开市.开光."
		},
		"d0523": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "诸事不宜."
		},
		"d0524": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "祈福.斋醮."
		},
		"d0525": {
			"y": "纳采.祭祀.祈福.开市.求医.治病.动土.纳畜.",
			"j": "嫁娶.安葬."
		},
		"d0526": {
			"y": "嫁娶.纳采.出行.移徙.入宅.",
			"j": "动土.破土.安葬."
		},
		"d0527": {
			"y": "订盟.纳采.祭祀.动土.破土.交易.立券.",
			"j": "嫁娶.安葬."
		},
		"d0528": {
			"y": "嫁娶.裁衣.祭祀.出行.安床.作灶.移徙.入宅.破土.安葬.",
			"j": "赴任.捕捉."
		},
		"d0529": {
			"y": "塞穴.结网.余事勿取.",
			"j": "诸事不宜."
		},
		"d0530": {
			"y": "",
			"j": ""
		},
		"d0531": {
			"y": "订盟.纳采.会亲友.安床.作灶.造畜椆栖.",
			"j": "开市.安葬."
		},
		"d0601": {
			"y": "沐浴.平治道涂.扫舍.入殓.移柩.破土.启攒.安葬.余事勿取.",
			"j": "诸事不宜."
		},
		"d0602": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.动土.上梁.进人口.入宅.移徙.安床.安门.开市.交易.立券.挂匾.栽种.破土.安葬.",
			"j": ""
		},
		"d0603": {
			"y": "祭祀.开光.出行.解除.塑绘.裁衣.入殓.移柩.破土.启攒.安葬.除服.成服.",
			"j": "嫁娶.上梁.修造.拆卸.架马.入宅.伐木.动土.出火.开柱眼."
		},
		"d0604": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜."
		},
		"d0605": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "入宅.嫁娶.移徙."
		},
		"d0606": {
			"y": "嫁娶.安机械.交易.出行.祭祀.祈福.求嗣.斋醮.塑绘.开光.合帐.裁衣.放水.开池.掘井.",
			"j": "作灶.理发.造桥.行丧.安葬."
		},
		"d0607": {
			"y": "纳采.冠笄.求医.治病.开市.立券.修造.动土.安机械.破土.安葬.",
			"j": "斋醮.祭祀.移徙.入宅.上梁.嫁娶."
		},
		"d0608": {
			"y": "祭祀.作灶.余事勿取.",
			"j": "开市.安葬.破土.修坟.掘井."
		},
		"d0609": {
			"y": "祭祀.祈福.求嗣.斋醮.安香.解除.移徙.入宅.会亲友.求医.治病.动土.破土.开生坟.合寿木.",
			"j": "合帐.上梁.经络.安葬.入殓."
		},
		"d0610": {
			"y": "嫁娶.冠笄.修造.动土.作灶.移徙.入宅.补垣.塞穴.纳畜.牧养.架马.修造.动土.起基.定磉.开池.造船.",
			"j": "祈福.开光.掘井.开市.安葬."
		},
		"d0611": {
			"y": "祭祀.交易.纳财.",
			"j": "斋醮.开渠.上梁.动土.破土."
		},
		"d0612": {
			"y": "嫁娶.订盟.纳采.冠笄.会亲友.安机械.造车器.祭祀.出行.纳财.入宅.安香.出火.入学.塑绘.开光.拆卸.起基.修造.动土.牧养.栽种.安门.作厕.",
			"j": "行丧.伐木.作梁.作灶."
		},
		"d0613": {
			"y": "开光.求嗣.出行.冠笄.嫁娶.伐木.架马.开柱眼.修造.移徙.入宅.开市.交易.立券.出行.安香.出火.挂匾.起基.修造.开生坟.合寿木.入殓.除服.成服.移柩.安葬.",
			"j": "安床.出货财.作灶.动土.破土."
		},
		"d0614": {
			"y": "祭祀.沐浴.理发.嫁娶.作灶.整手足甲.扫舍.修饰垣墙.平治道涂.",
			"j": "斋醮.出行.治病.合寿木."
		},
		"d0615": {
			"y": "安机械.移徙.入宅.出行.祭祀.祈福.斋醮.纳采.订盟.安香.出火.解除.会亲友.修造.动土.拆卸.起基.定磉.移徙.入宅.造屋.安床.修造.破土.安葬.入殓.立碑.",
			"j": "开市.伐木.作梁.作灶."
		},
		"d0616": {
			"y": "祭祀.沐浴.捕捉.结网.畋猎.取渔.余事勿取.",
			"j": "开市.交易.嫁娶.安葬.行丧."
		},
		"d0617": {
			"y": "破屋.坏垣.求医.治病.畋猎.余事勿取.",
			"j": "嫁娶.入宅."
		},
		"d0618": {
			"y": "嫁娶.出行.安机械.祭祀.塑绘.开光.治病.经络.安床.结网.塞穴.破土.入殓.",
			"j": "开市.安门.掘井.作灶."
		},
		"d0619": {
			"y": "订盟.纳采.会亲友.进人口.雕刻.拆卸.修造.动土.起基.开市.栽种.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.",
			"j": ""
		},
		"d0620": {
			"y": "祭祀.捕捉.取渔.修饰垣墙.余事勿取.",
			"j": "诸事不宜."
		},
		"d0621": {
			"y": "嫁娶.纳采.祭祀.祈福.求医.治病.出行.动土.移徙.入宅.",
			"j": "开市.安门."
		},
		"d0622": {
			"y": "裁衣.作灶.移徙.入宅.纳畜.",
			"j": "嫁娶.安葬."
		},
		"d0623": {
			"y": "祭祀.入殓.移柩.启攒.安葬.",
			"j": "上梁.动土.破土."
		},
		"d0624": {
			"y": "订盟.纳采.出行.祈福.斋醮.安床.会亲友.",
			"j": "移徙.入宅.安葬."
		},
		"d0625": {
			"y": "嫁娶.纳采.出行.求医.治病.开市.移徙.入宅.启攒.安葬.",
			"j": "动土.破土."
		},
		"d0626": {
			"y": "嫁娶.祭祀.沐浴.扫舍.修饰垣墙.",
			"j": "行丧.安葬."
		},
		"d0627": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "作灶."
		},
		"d0628": {
			"y": "订盟.纳采.出行.祭祀.祈福.修造.动土.移徙.入宅.",
			"j": "开市.安葬."
		},
		"d0629": {
			"y": "诸事不宜.",
			"j": "诸事不宜."
		},
		"d0630": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.入殓.破土.安葬.",
			"j": "开光.开市."
		},
		"d0701": {
			"y": "开光.求医.治病.动土.上梁.入殓.破土.安葬.",
			"j": "嫁娶.开光."
		},
		"d0702": {
			"y": "祭祀.栽种.余事勿取.",
			"j": "诸事不宜."
		},
		"d0703": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.出行.解除.伐木.入宅.移徙.安床.出火.拆卸.修造.上梁.栽种.移柩.",
			"j": "安葬.开市.交易.立券."
		},
		"d0704": {
			"y": "求嗣.嫁娶.纳采.合帐.裁衣.冠笄.伐木.作梁.修造.动土.起基.竖柱.上梁.安门.作灶.筑堤.造畜椆栖.",
			"j": "安葬.出行.祈福.栽种."
		},
		"d0705": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜."
		},
		"d0706": {
			"y": "嫁娶.祭祀.祈福.出火.开光.求嗣.出行.拆卸.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.动土.",
			"j": "安葬.行丧.伐木.作梁."
		},
		"d0707": {
			"y": "祭祀.沐浴.塑绘.开光.入学.解除.扫舍.治病.开池.牧养.",
			"j": "嫁娶.出行.纳采.入宅.作灶."
		},
		"d0708": {
			"y": "纳财.开市.交易.立券.出行.祭祀.祈福.求嗣.开光.解除.扫舍.起基.竖柱.安床.移徙.开仓.出货财.补垣.塞穴.栽种.纳畜.牧养.",
			"j": "斋醮.入宅.安门.安葬.破土.行丧."
		},
		"d0709": {
			"y": "祭祀.修饰垣墙.平治道涂.",
			"j": "开市.动土.破土.嫁娶.修造.安葬."
		},
		"d0710": {
			"y": "订盟.纳采.祭祀.祈福.开光.安香.出火.立券.安机械.移徙.入宅.竖柱.上梁.会亲友.安床.拆卸.挂匾.牧养.教牛马.",
			"j": "嫁娶.安葬.行丧.破土.修坟."
		},
		"d0711": {
			"y": "沐浴.理发.捕捉.入殓.移柩.破土.启攒.安葬.",
			"j": "出火.嫁娶.入宅.作灶.破土.上梁.动土."
		},
		"d0712": {
			"y": "求医.治病.破屋.坏垣.余事勿取.",
			"j": "嫁娶.出行."
		},
		"d0713": {
			"y": "纳采.订盟.嫁娶.移徙.入宅.出行.开市.交易.立券.纳财.会亲友.安香.出火.拆卸.造屋.起基.安床.作灶.挂匾.安葬.破土.启攒.立碑.入殓.移柩.",
			"j": "祈福.上梁.开仓.掘井.牧养."
		},
		"d0714": {
			"y": "祭祀.祈福.斋醮.出行.纳采.订盟.安机械.出火.拆卸.修造.动土.起基.移徙.入宅.造庙.入殓.除服.成服.移柩.破土.安葬.谢土.",
			"j": "嫁娶.开市.栽种.合寿木."
		},
		"d0715": {
			"y": "祭祀.进人口.纳财.纳畜.牧养.捕捉.余事勿取.",
			"j": "开市.入宅.安床.动土.安葬."
		},
		"d0716": {
			"y": "祭祀.塑绘.开光.求医.治病.嫁娶.会亲友.放水.掘井.牧养.纳畜.开渠.安碓硙.",
			"j": "造屋.入宅.作灶.入学.安葬.行丧."
		},
		"d0717": {
			"y": "祭祀.塞穴.结网.畋猎.余事勿取.",
			"j": "移徙.开市.入宅.嫁娶.开光.安门."
		},
		"d0718": {
			"y": "开市.纳财.祭祀.塑绘.安机械.冠笄.会亲友.裁衣.开仓.经络.纳畜.造畜椆栖.教牛马.牧养.",
			"j": "动土.破土.安葬.治病."
		},
		"d0719": {
			"y": "移徙.入宅.治病.会亲友.祭祀.祈福.斋醮.安香.移徙.嫁娶.造屋.起基.",
			"j": "开市.斋醮.安床.出行.经络."
		},
		"d0720": {
			"y": "塑绘.出行.冠笄.嫁娶.进人口.裁衣.纳婿.造畜椆栖.交易.立券.牧养.开生坟.入殓.除服.成服.移柩.安葬.启攒.",
			"j": ""
		},
		"d0721": {
			"y": "祭祀.冠笄.嫁娶.捕捉.结网.畋猎.取渔.余事勿取.",
			"j": "余事勿取."
		},
		"d0722": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "诸事不宜."
		},
		"d0723": {
			"y": "纳采.祭祀.祈福.解除.动土.破土.安葬.",
			"j": "嫁娶.移徙.入宅."
		},
		"d0724": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "诸事不宜."
		},
		"d0725": {
			"y": "嫁娶.纳采.开市.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "祭祀.祈福."
		},
		"d0726": {
			"y": "嫁娶.纳采.开市.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "赴任."
		},
		"d0727": {
			"y": "祭祀.作灶.纳财.捕捉.",
			"j": "开市.破土."
		},
		"d0728": {
			"y": "嫁娶.开市.立券.祭祀.祈福.动土.移徙.入宅.",
			"j": "造庙.安葬."
		},
		"d0729": {
			"y": "补垣.塞穴.结网.入殓.除服.成服.移柩.安葬.启攒.余事勿取.",
			"j": "诸事不宜."
		},
		"d0730": {
			"y": "嫁娶.纳采.出行.祭祀.祈福.解除.移徙.入宅.",
			"j": "动土.安葬."
		},
		"d0731": {
			"y": "嫁娶.祭祀.祈福.斋醮.治病.破土.安葬.",
			"j": "开市.入宅."
		},
		"d0801": {
			"y": "嫁娶.出行.开市.安床.入殓.启攒.安葬.",
			"j": "祈福.动土.破土."
		},
		"d0802": {
			"y": "嫁娶.祭祀.裁衣.结网.冠笄.沐浴.",
			"j": "开仓.出货财.置产.安葬.动土.破土.掘井.栽种."
		},
		"d0803": {
			"y": "入宅.移徙.安床.开光.祈福.求嗣.进人口.开市.交易.立券.出火.拆卸.修造.动土.",
			"j": "嫁娶.破土.置产.栽种.安葬.修坟.行丧."
		},
		"d0804": {
			"y": "祭祀.解除.沐浴.整手足甲.入殓.移柩.破土.启攒.安葬.",
			"j": "嫁娶.入宅.移徙.作灶.开市.交易.安门.栽种."
		},
		"d0805": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜."
		},
		"d0806": {
			"y": "嫁娶.开光.出行.理发.作梁.出火.拆卸.修造.开市.交易.立券.挂匾.动土.入宅.移徙.安床.栽种.",
			"j": "伐木.祭祀.纳畜.祭祀."
		},
		"d0807": {
			"y": "订盟.纳采.祭祀.祈福.安香.出火.开市.立券.入宅.挂匾.造桥.启攒.安葬.",
			"j": "动土.破土.嫁娶.掘井.安床."
		},
		"d0808": {
			"y": "嫁娶.祭祀.祈福.斋醮.普渡.移徙.入宅.动土.治病.开市.交易.立券.开光.修造.造车器.安香.安床.捕捉.畋猎.结网.",
			"j": "纳采.订盟.经络.行丧.安葬.探病."
		},
		"d0809": {
			"y": "嫁娶.订盟.纳采.作灶.冠笄.裁衣.会亲友.纳畜.牧养.安机械.开市.立券.纳财.安床.",
			"j": "掘井.出行.破土.行丧.安葬."
		},
		"d0810": {
			"y": "嫁娶.订盟.纳采.祭祀.斋醮.普渡.解除.出行.会亲友.开市.纳财.修造.动土.竖柱.上梁.开光.开仓.出货财.纳畜.牧养.开池.破土.启攒.",
			"j": "出火.入宅.造屋.安门.安葬."
		},
		"d0811": {
			"y": "嫁娶.普渡.祭祀.祈福.补垣.塞穴.断蚁.筑堤.入殓.除服.成服.安葬.",
			"j": "动土.破土.掘井.开光.上梁.词讼."
		},
		"d0812": {
			"y": "嫁娶.冠笄.祭祀.沐浴.普渡.出行.纳财.扫舍.纳畜.赴任.",
			"j": "开市.动土.破土.安床.开仓.上梁."
		},
		"d0813": {
			"y": "祭祀.沐浴.理发.整手足甲.冠笄.解除.入殓.移柩.破土.启攒.安葬.",
			"j": "嫁娶.出行.入宅.开市.安门."
		},
		"d0814": {
			"y": "塑绘.冠笄.嫁娶.会亲友.进人口.经络.裁衣.栽种.纳畜.牧养.补垣.塞穴.捕捉.",
			"j": "祈福.开市.动土.行丧.安葬."
		},
		"d0815": {
			"y": "出行.沐浴.订盟.纳采.裁衣.竖柱.上梁.移徙.纳畜.牧养.",
			"j": "嫁娶.安门.动土.安葬."
		},
		"d0816": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.普渡.开光.安香.出火.移徙.入宅.竖柱.修造.动土.竖柱.上梁.起基.造屋.安门.造庙.造桥.破土.启攒.安葬.",
			"j": "开市.立券.纳财.作灶."
		},
		"d0817": {
			"y": "祭祀.捕捉.畋猎.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.启攒.",
			"j": "嫁娶.纳采.订盟.开市.入宅."
		},
		"d0818": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "行丧.安葬."
		},
		"d0819": {
			"y": "祈福.斋醮.出行.冠笄.嫁娶.雕刻.开柱眼.入宅.造桥.开市.交易.立券.纳财.入殓.除服.成服.移柩.破土.安葬.启攒.",
			"j": "动土.破土.订盟.安床.开池."
		},
		"d0820": {
			"y": "祈福.求嗣.解除.订盟.纳采.动土.起基.放水.造仓.开市.纳畜.牧养.开生坟.入殓.除服.成服.移柩.破土.安葬.",
			"j": ""
		},
		"d0821": {
			"y": "塑绘.开光.解除.订盟.纳采.嫁娶.出火.修造.动土.移徙.入宅.拆卸.起基.安门.分居.开市.交易.立券.纳财.纳畜.牧养.",
			"j": ""
		},
		"d0822": {
			"y": "祈福.出行.订盟.纳采.嫁娶.裁衣.动土.安床.放水.开市.掘井.交易.立券.栽种.开渠.除服.成服.移柩.破土.",
			"j": ""
		},
		"d0823": {
			"y": "嫁娶.祭祀.祈福.斋醮.作灶.移徙.入宅.",
			"j": "动土.破土."
		},
		"d0824": {
			"y": "嫁娶.出行.纳畜.祭祀.入殓.启攒.安葬.",
			"j": "作灶.动土.破土."
		},
		"d0825": {
			"y": "订盟.纳采.祭祀.祈福.修造.动土.上梁.破土.安葬.",
			"j": "嫁娶.开市."
		},
		"d0826": {
			"y": "订盟.纳采.出行.会亲友.修造.上梁.移徙.入宅.",
			"j": "开市.安葬."
		},
		"d0827": {
			"y": "沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.祈福.余事勿取."
		},
		"d0828": {
			"y": "嫁娶.祭祀.祈福.斋醮.动土.移徙.入宅.",
			"j": "开市.安葬."
		},
		"d0829": {
			"y": "捕捉.结网.入殓.破土.安葬.",
			"j": "嫁娶.入宅."
		},
		"d0830": {
			"y": "沐浴.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜."
		},
		"d0831": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.移徙.入宅.启攒.安葬.",
			"j": "动土.破土."
		},
		"d0901": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求医.治病.动土.移徙.入宅.破土.安葬.",
			"j": "开光.针灸."
		},
		"d0902": {
			"y": "订盟.纳采.祭祀.祈福.安机械.作灶.纳畜.",
			"j": "动土.安葬."
		},
		"d0903": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.动土.安床.掘井.破土.启攒.",
			"j": "入宅.作梁.安门.伐木.修造.上梁.入殓.造屋."
		},
		"d0904": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.修造.移徙.动土.安床.入殓.破土.安葬.启攒.",
			"j": "造屋.开光.理发.造船.掘井.作灶."
		},
		"d0905": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.上梁.造屋.移徙.安门.纳财.牧养.纳畜.安葬.启攒.入殓.",
			"j": "破土.置产.掘井.动土.安床."
		},
		"d0906": {
			"y": "祭祀.解除.沐浴.理发.整手足甲.入殓.移柩.破土.安葬.扫舍.",
			"j": "嫁娶.会亲友.进人口.出行.入宅.移徙.赴任.作灶."
		},
		"d0907": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.修造.动土.移徙.入宅.",
			"j": "针灸.伐木.作梁.造庙.行丧.安葬."
		},
		"d0908": {
			"y": "出行.开市.交易.立券.安机械.出火.上梁.移徙.",
			"j": "嫁娶.安葬.动土.造桥."
		},
		"d0909": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "斋醮.嫁娶.移徙.出行.上梁.入宅."
		},
		"d0910": {
			"y": "嫁娶.造车器.安机械.祭祀.祈福.开光.安香.出火.出行.开市.立券.修造.动土.移徙.入宅.破土.安葬.",
			"j": "纳采.订盟.架马.词讼.开渠."
		},
		"d0911": {
			"y": "沐浴.捕捉.入殓.除服.成服.破土.启攒.安葬.",
			"j": "祭祀.嫁娶.安床.开市.入宅.探病.上梁."
		},
		"d0912": {
			"y": "余事勿取.",
			"j": "探病.余事勿取."
		},
		"d0913": {
			"y": "订盟.纳采.祭祀.祈福.安香.出火.修造.动土.上梁.安门.起基.竖柱.上梁.定磉.开池.移徙.入宅.立券.破土.",
			"j": "嫁娶.造庙.造桥.造船.作灶.安葬."
		},
		"d0914": {
			"y": "开光.求嗣.雕刻.嫁娶.订盟.纳采.出火.拆卸.修造.动土.起基.上梁.放水.移徙.入宅.造仓.造船.开市.开池.纳畜.牧养.挂匾.",
			"j": "行丧.安葬.合寿木."
		},
		"d0915": {
			"y": "祭祀.嫁娶.捕捉.",
			"j": "开光.动土.破土.开市.修造.入宅.安门."
		},
		"d0916": {
			"y": "祭祀.普渡.解除.会亲友.捕捉.畋猎.启攒.除服.成服.移柩.",
			"j": "嫁娶.开市.动土.掘井.开池.安葬."
		},
		"d0917": {
			"y": "祭祀.出行.解除.冠笄.嫁娶.伐木.架马.开柱眼.修造.动土.移徙.入宅.开生坟.合寿木.入殓.移柩.破土.安葬.修坟.",
			"j": "开光.安床."
		},
		"d0918": {
			"y": "祭祀.祈福.求嗣.出行.沐浴.交易.扫舍.教牛马.",
			"j": "动土.作灶.行丧.安葬.修坟."
		},
		"d0919": {
			"y": "出行.解除.纳采.冠笄.雕刻.修造.动土.起基.上梁.合脊.安床.移徙.入宅.开市.栽种.作厕.",
			"j": "造庙.安门.行丧.安葬."
		},
		"d0920": {
			"y": "祭祀.沐浴.解除.理发.冠笄.安机械.作灶.造仓.开市.开池.作厕.补垣.塞穴.断蚁.结网.",
			"j": "嫁娶.安葬."
		},
		"d0921": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.",
			"j": "嫁娶.入宅."
		},
		"d0922": {
			"y": "祭祀.会亲友.纳采.嫁娶.开光.塑绘.斋醮.安香.开市.立券.除服.成服.入殓.移柩.安葬.赴任.进人口.出行.裁衣.修造.动土.上梁.经络.交易.",
			"j": "入宅.伐木."
		},
		"d0923": {
			"y": "祭祀.冠笄.会亲友.拆卸.起基.除服.成服.移柩.启攒.安葬.沐浴.捕捉.开光.塑绘.",
			"j": "作灶.祭祀.入宅.嫁娶."
		},
		"d0924": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "移徙.入宅.出行.栽种."
		},
		"d0925": {
			"y": "祭祀.塑绘.开光.出行.解除.订盟.嫁娶.拆卸.起基.安床.入宅.开市.入殓.除服.成服.移柩.破土.谢土.挂匾.开柱眼.交易.",
			"j": "造桥.冠笄.造屋.掘井."
		},
		"d0926": {
			"y": "祭祀.赴任.动土.上梁.开光.塑绘.冠笄.拆卸.起基.安床.开市.立券.赴任.经络.",
			"j": "定磉.安葬."
		},
		"d0927": {
			"y": "祭祀.裁衣.冠笄.嫁娶.纳婿.会亲友.除服.成服.移柩.捕捉.进人口.入殓.",
			"j": "移徙.入宅.作灶.安葬."
		},
		"d0928": {
			"y": "祭祀.诸事不宜.",
			"j": "入殓.安葬.开市.交易."
		},
		"d0929": {
			"y": "祭祀.裁衣.冠笄.嫁娶.安机械.拆卸.动土.起基.移徙.入宅.入殓.启攒.安葬.造仓.经络.",
			"j": "安床.开光.开市.交易."
		},
		"d0930": {
			"y": "祭祀.出行.成服.除服.沐浴.入殓.",
			"j": "动土.冠笄.移徙.入宅.开市.竖柱.上梁."
		},
		"d1001": {
			"y": "祭祀.沐浴.赴任.出行.余事勿取.",
			"j": "诸事不宜."
		},
		"d1002": {
			"y": "诸事不宜.",
			"j": "诸事不宜."
		},
		"d1003": {
			"y": "沐浴.入殓.移柩.除服.成服.破土.平治道涂.",
			"j": "嫁娶.移徙.入宅.开市."
		},
		"d1004": {
			"y": "嫁娶.祭祀.祈福.求嗣.沐浴.出火.出行.拆卸.修造.动土.进人口.开市.交易.立券.入宅.移徙.安床.栽种.纳畜.入殓.安葬.启攒.除服.成服.",
			"j": ""
		},
		"d1005": {
			"y": "开光.解除.起基.动土.拆卸.上梁.立碑.修坟.安葬.破土.启攒.移柩.",
			"j": "嫁娶.出行.安床.作灶.祭祀.入宅.移徙.出火.进人口.置产."
		},
		"d1006": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜."
		},
		"d1007": {
			"y": "嫁娶.祈福.求嗣.出行.出火.拆卸.修造.动土.上梁.开光.进人口.开市.交易.立券.挂匾.安床.入宅.移徙.栽种.伐木.入殓.破土.除服.成服.",
			"j": ""
		},
		"d1008": {
			"y": "订盟.纳采.会亲友.交易.立券.纳财.栽种.纳畜.牧养.",
			"j": "嫁娶.开市.入宅.祈福.安葬."
		},
		"d1009": {
			"y": "造车器.嫁娶.订盟.纳采.会亲友.祭祀.出行.开市.立券.移徙.入宅.破土.安葬.",
			"j": "上梁.开光.造屋.架马.合寿木."
		},
		"d1010": {
			"y": "祭祀.作灶.纳财.捕捉.畋猎.余事勿取.",
			"j": "动土.破土.开市.安葬."
		},
		"d1011": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.求医.治病.出火.移徙.入宅.",
			"j": "开市.开仓.出货财.安床.安门.安葬."
		},
		"d1012": {
			"y": "冠笄.祭祀.沐浴.作灶.理发.整手足甲.扫舍.补垣.塞穴.入殓.破土.启攒.",
			"j": "开光.嫁娶.会亲友.栽种.针灸.安葬."
		},
		"d1013": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.置产.求医.治病.开市.交易.立券.会亲友.移徙.竖柱.上梁.造屋.合脊.安门.放水.捕捉.纳畜.",
			"j": "造庙.造船.动土.破土.安葬."
		},
		"d1014": {
			"y": "出行.造车器.造畜椆栖.解除.冠笄.裁衣.作梁.雕刻.会亲友.移徙.入宅.安机械.造畜椆栖.开市.扫舍.",
			"j": "嫁娶.动土.破土.修坟."
		},
		"d1015": {
			"y": "沐浴.理发.冠笄.安床.开市.立券.会亲友.交易.纳财.结网.教牛马.",
			"j": "移徙.入宅.出行.祈福.嫁娶."
		},
		"d1016": {
			"y": "祭祀.造畜椆栖.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.开市.安床.掘井."
		},
		"d1017": {
			"y": "捕捉.结网.入殓.除服.成服.移柩.破土.安葬.启攒.立碑.",
			"j": "嫁娶.祭祀.入宅.造屋.移徙."
		},
		"d1018": {
			"y": "祭祀.祈福.求嗣.斋醮.造庙.出火.安机械.会亲友.开市.交易.立券.纳财.习艺.经络.求医.治病.开池.作厕.畋猎.结网.栽种.牧养.安葬.破土.启攒.",
			"j": "开光.嫁娶.掘井.伐木.作梁."
		},
		"d1019": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜."
		},
		"d1020": {
			"y": "会亲友.嫁娶.订盟.纳采.纳婿.拆卸.修造.动土.起基.竖柱.上梁.安床.会亲友.纳财.",
			"j": "出行.祈福.安葬.作灶."
		},
		"d1021": {
			"y": "祭祀.塑绘.开光.祈福.斋醮.出行.订盟.纳采.裁衣.嫁娶.拆卸.修造.安床.入宅.安香.入殓.启攒.安葬.谢土.赴任.会亲友.进人口.出行.移徙.上梁.经络.开市.交易.立券.纳财.",
			"j": "开仓.冠笄.伐木.作梁."
		},
		"d1022": {
			"y": "祭祀.作灶.入殓.除服.成服.畋猎.",
			"j": "栽种.动土.安葬.开市."
		},
		"d1023": {
			"y": "祭祀.祈福.斋醮.沐浴.竖柱.订盟.纳采.嫁娶.拆卸.入宅.移柩.启攒.谢土.赴任.出火.纳畜.",
			"j": "作灶.入殓.安葬.安床."
		},
		"d1024": {
			"y": "嫁娶.祭祀.安机械.入殓.破土.安葬.",
			"j": "动土.上梁."
		},
		"d1025": {
			"y": "作灶.造畜椆栖.",
			"j": "行丧.安葬."
		},
		"d1026": {
			"y": "沐浴.理发.入学.习艺.进人口.",
			"j": "嫁娶.入宅."
		},
		"d1027": {
			"y": "开光.针灸.会亲友.启攒.安葬.",
			"j": "开市.动土.破土."
		},
		"d1028": {
			"y": "祭祀.结网.造畜椆栖.余事勿取.",
			"j": "余事勿取."
		},
		"d1029": {
			"y": "入殓.除服.成服.移柩.破土.启攒.安葬.",
			"j": "移徙.入宅."
		},
		"d1030": {
			"y": "嫁娶.订盟.纳采.出行.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "开市.赴任."
		},
		"d1031": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "余事勿取."
		},
		"d1101": {
			"y": "订盟.纳采.会亲友.安机械.纳财.牧养.",
			"j": "祈福.安葬."
		},
		"d1102": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "斋醮.安门."
		},
		"d1103": {
			"y": "祭祀.塞穴.余事勿取.",
			"j": "诸事不宜."
		},
		"d1104": {
			"y": "祭祀.祈福.求嗣.开光.开市.出行.解除.动土.起基.置产.栽种.",
			"j": "嫁娶.作灶.修坟.安门.入宅.立碑.安葬.安床."
		},
		"d1105": {
			"y": "祭祀.解除.裁衣.理发.安床.作灶.造畜椆栖.放水.筑堤.补垣.塞穴.整手足甲.扫舍.",
			"j": "嫁娶.开光.会亲友.掘井.安门.栽种."
		},
		"d1106": {
			"y": "祭祀.出行.裁衣.冠笄.会亲友.造畜椆栖.嫁娶.竖柱.上梁.移徙.纳财.纳畜.",
			"j": "动土.伐木.作梁.行丧.安葬.开生坟."
		},
		"d1107": {
			"y": "祭祀.沐浴.出行.余事勿取.",
			"j": "开市.动土.破土.行丧.安葬."
		},
		"d1108": {
			"y": "嫁娶.造车器.出行.会亲友.移徙.入宅.修造.动土.雕刻.开光.安香.出火.理发.会亲友.造屋.合脊.起基.归岫.安门.拆卸.扫舍.栽种.造畜椆栖.",
			"j": "开市.纳采.造庙.安床.开渠.安葬."
		},
		"d1109": {
			"y": "塑绘.会亲友.安机械.塞穴.结网.裁衣.经络.",
			"j": "嫁娶.开市.祈福.斋醮.安葬."
		},
		"d1110": {
			"y": "纳采.移徙.纳财.开市.交易.立券.纳财.入宅.修造.动土.竖柱.起基.定磉.造庙.安香.出火.修饰垣墙.平治道涂.会亲友.出行.开池.作厕.",
			"j": "开仓.造屋.造桥.祭祀."
		},
		"d1111": {
			"y": "订盟.纳采.纳财.开市.立券.祭祀.祈福.移徙.入宅.出行.造屋.起基.修造.动土.竖柱.上梁.安门.安香.出火.教牛马.会亲友.破土.",
			"j": "嫁娶.安葬.掘井.置产.造船."
		},
		"d1112": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.塑绘.开光.移徙.安床.伐木.作梁.捕捉.畋猎.结网.求医.治病.解除.安葬.除服.成服.移柩.入殓.立碑.谢土.",
			"j": "开市.造庙.动土.破土."
		},
		"d1113": {
			"y": "破屋.坏垣.祭祀.余事勿取.",
			"j": "嫁娶.安葬."
		},
		"d1114": {
			"y": "嫁娶.纳采.订盟.祭祀.冠笄.裁衣.伐木.作梁.架马.定磉.开柱眼.作灶.移徙.安床.畋猎.结网.开池.作厕.除服.成服.启攒.入殓.移柩.安葬.",
			"j": "造屋.造船.动土.破土."
		},
		"d1115": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.斋醮.开光.会亲友.解除.入学.纳财.交易.立券.经络.起基.动土.定磉.开池.栽种.纳畜.牧养.破土.入殓.立碑.安葬.",
			"j": "嫁娶.开市.入宅.出火.移徙."
		},
		"d1116": {
			"y": "捕捉.畋猎.会亲友.解除.入殓.除服.成服.移柩.余事勿取.",
			"j": "安床.安门.破土.修坟.安葬."
		},
		"d1117": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.冠笄.出行.理发.拆卸.解除.起基.动土.定磉.安碓硙.开池.掘井.扫舍.除服.成服.移柩.启攒.立碑.谢土.",
			"j": "移徙.入宅.安门.作梁.安葬."
		},
		"d1118": {
			"y": "嫁娶.冠笄.安床.纳采.会亲友.塞穴.捕捉.置产.造畜椆栖.",
			"j": "开光.掘井.安葬.谢土.修坟."
		},
		"d1119": {
			"y": "祭祀.沐浴.余事勿取.",
			"j": "诸事不宜."
		},
		"d1120": {
			"y": "祭祀.会亲友.嫁娶.沐浴.修造.动土.祈福.开光.塑绘.出行.订盟.纳采.裁衣.入殓.除服.成服.移柩.启攒.赴任.竖柱.上梁.纳财.扫舍.栽种.纳畜.伐木.",
			"j": "入宅.作灶.安床.开仓."
		},
		"d1121": {
			"y": "理发.会亲友.补垣.塞穴.结网.",
			"j": "嫁娶.入宅.安门.移徙."
		},
		"d1122": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.拆卸.修造.动土.起基.安床.移徙.入宅.安香.除服.成服.入殓.移柩.安葬.谢土.赴任.会亲友.进人口.出行.竖柱.上梁.经络.开市.交易.立券.纳财.开仓.",
			"j": "作灶.治病.伐木.作梁."
		},
		"d1123": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.拆卸.修造.动土.起基.安床.移徙.入宅.安香.入殓.移柩.安葬.谢土.赴任.进人口.会亲友.",
			"j": "作灶.治病."
		},
		"d1124": {
			"y": "祭祀.塑绘.开光.订盟.纳采.嫁娶.安床.进人口.入殓.除服.成服.移柩.启攒.安葬.立碑.",
			"j": "开市.交易.破土.作灶."
		},
		"d1125": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜."
		},
		"d1126": {
			"y": "祭祀.解除.祈福.开光.塑绘.斋醮.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.入殓.除服.成服.移柩.启攒.安床.赴任.出行.移徙.竖柱.上梁.伐木.栽种.破土.安葬.纳畜.",
			"j": "造屋.治病."
		},
		"d1127": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.合帐.冠笄.安机械.安床.造畜椆栖.入殓.移柩.启攒.安葬.谢土.除服.成服.会亲友.竖柱.上梁.经络.开市.交易.立券.纳财.纳畜.筑堤.",
			"j": "嫁娶.入宅.治病.赴任."
		},
		"d1128": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "诸事不宜."
		},
		"d1129": {
			"y": "诸事不宜.",
			"j": "诸事不宜."
		},
		"d1130": {
			"y": "祈福.斋醮.出行.订盟.纳采.入殓.移柩.破土.安葬.立碑.结网.",
			"j": "入宅.作灶."
		},
		"d1201": {
			"y": "祭祀.沐浴.出行.冠笄.进人口.余事勿取.",
			"j": "嫁娶.动土.安葬.作灶."
		},
		"d1202": {
			"y": "祭祀.祈福.斋醮.塑绘.开光.订盟.纳采.裁衣.冠笄.嫁娶.拆卸.入宅.安香.入殓.移柩.理发.安葬.修坟.谢土.赴任.移徙.沐浴.治病.破土.启攒.整手足甲.入学.作梁.",
			"j": "开市."
		},
		"d1203": {
			"y": "诸事不宜.",
			"j": "诸事不宜."
		},
		"d1204": {
			"y": "开市.交易.立券.挂匾.纳财.开光.出行.入宅.移徙.安床.纳畜.入殓.移柩.安葬.",
			"j": "栽种.破土.置产.祭祀.嫁娶.动土.作灶.祈福."
		},
		"d1205": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.出行.拆卸.进人口.入宅.移徙.安床.栽种.动土.修造.纳畜.入殓.安葬.立碑.除服.成服.",
			"j": ""
		},
		"d1206": {
			"y": "开光.解除.拆卸.修造.动土.安床.纳畜.安葬.启攒.入殓.",
			"j": "嫁娶.开市.出火.栽种.破土.动土.入宅.移徙.安香.分居.掘井.作灶."
		},
		"d1207": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求嗣.斋醮.安香.出火.修造.起基.造屋.合脊.安门.安碓硙.动土.上梁.移徙.入宅.",
			"j": "出行.掘井.破土.行丧.安葬."
		},
		"d1208": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "嫁娶.移徙.入宅.探病.出行.造屋."
		},
		"d1209": {
			"y": "冠笄.纳财.掘井.开池.出火.安床.交易.立券.畋猎.结网.理发.放水.",
			"j": "安门.动土.破土.行丧.安葬.成服."
		},
		"d1210": {
			"y": "纳采.订盟.移徙.入宅.出行.安机械.会亲友.祭祀.祈福.斋醮.开光.安香.出火.解除.求医.针灸.治病.造屋.起基.修造.安门.造船.纳畜.牧养.移柩.入殓.启攒.谢土.修坟.立碑.",
			"j": "嫁娶.动土.安床.造桥.掘井."
		},
		"d1211": {
			"y": "祭祀.沐浴.作灶.纳财.捕捉.畋猎.安床.扫舍.",
			"j": "开市.斋醮.破土.安葬."
		},
		"d1212": {
			"y": "祈福.斋醮.纳采.订盟.解除.架马.开柱眼.修造.动土.起基.上梁.归岫.造屋.合脊.掘井.除服.成服.破土.栽种.",
			"j": "移徙.开市.入宅.安葬."
		},
		"d1213": {
			"y": "纳采.订盟.祭祀.沐浴.冠笄.合帐.裁衣.修造.动土.拆卸.移徙.入宅.安门.开仓.筑堤.作厕.栽种.纳畜.补垣.塞穴.",
			"j": "嫁娶.祈福.开光.掘井.安葬.行丧."
		},
		"d1214": {
			"y": "合帐.裁衣.教牛马.余事勿取.",
			"j": "入宅.动土.破土.嫁娶.作灶.造船."
		},
		"d1215": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.安香.出火.出行.会亲友.经络.求医.治病.解除.拆卸.起基.修造.动土.定磉.扫舍.栽种.牧养.造畜椆栖.",
			"j": "斋醮.作梁.掘井.行丧.安葬."
		},
		"d1216": {
			"y": "纳财.开市.交易.立券.会亲友.进人口.经络.祭祀.祈福.安香.出火.求医.治病.修造.动土.拆卸.扫舍.安床.栽种.牧养.开生坟.合寿木.入殓.安葬.启攒.",
			"j": "嫁娶.祈福.出火.移徙.入宅."
		},
		"d1217": {
			"y": "祭祀.入殓.移柩.余事勿取.",
			"j": "入宅.修造.动土.破土.安门.上梁."
		},
		"d1218": {
			"y": "塑绘.开光.订盟.纳采.裁衣.冠笄.拆卸.修造.安床.入宅.出火.安葬.谢土.赴任.",
			"j": "掘井.伐木.斋醮.作灶."
		},
		"d1219": {
			"y": "祭祀.塑绘.开光.裁衣.冠笄.嫁娶.纳采.拆卸.修造.动土.竖柱.上梁.安床.移徙.入宅.安香.结网.捕捉.畋猎.伐木.进人口.放水.",
			"j": "出行.安葬.修坟.开市."
		},
		"d1220": {
			"y": "祭祀.求医.破屋.坏垣.余事勿取.",
			"j": "诸事不宜."
		},
		"d1221": {
			"y": "祭祀.祈福.斋醮.出行.冠笄.安机械.移徙.入宅.安香.安床.除服.成服.移柩.启攒.",
			"j": "开光.栽种.治病.安门.作灶."
		},
		"d1222": {
			"y": "塑绘.斋醮.出行.拆卸.解除.修造.移徙.造船.入殓.除服.成服.移柩.启攒.修坟.立碑.谢土.",
			"j": ""
		},
		"d1223": {
			"y": "祭祀.沐浴.安床.纳财.畋猎.捕捉.",
			"j": "开市.破土."
		},
		"d1224": {
			"y": "订盟.纳采.祭祀.祈福.修造.动土.上梁.破土.",
			"j": "嫁娶.作灶."
		},
		"d1225": {
			"y": "出行.沐浴.理发.补垣.塞穴.",
			"j": "入宅.安葬."
		},
		"d1226": {
			"y": "教牛马.余事勿取.",
			"j": "入宅.动土.破土.余事勿取."
		},
		"d1227": {
			"y": "嫁娶.出行.求医.治病.祭祀.祈福.上梁.纳畜.",
			"j": "开市.安葬."
		},
		"d1228": {
			"y": "开市.立券.开光.解除.安机械.上梁.启攒.安葬.",
			"j": "嫁娶.祈福."
		},
		"d1229": {
			"y": "平治道涂.余事勿取.",
			"j": "诸事不宜."
		},
		"d1230": {
			"y": "求嗣.斋醮.塑绘.订盟.纳采.出火.拆卸.修造.动土.造桥.安机械.栽种.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.",
			"j": "开市.嫁娶."
		},
		"d1231": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.修造.动土.移徙.入宅.",
			"j": "开市.安葬."
		}
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	window.HuangLi = window.HuangLi || {};
	HuangLi.y2009 = {
		"d1221": {
			"y": "教牛马.余事勿取.",
			"j": "入宅.动土.破土.余事勿取.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1121": {
			"y": "祭祀.解除.祈福.开光.塑绘.斋醮.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.入殓.除服.成服.移柩.启攒.安床.赴任.出行.移徙.竖柱.上梁.伐木.栽种.破土.安葬.纳畜.",
			"j": "造屋.治病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1201": {
			"y": "开光.解除.拆卸.修造.动土.安床.纳畜.安葬.启攒.入殓.",
			"j": "嫁娶.开市.出火.栽种.破土.动土.入宅.移徙.安香.分居.掘井.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1202": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1203": {
			"y": "嫁娶.祭祀.开光.出火.出行.拆卸.修造.动土.解除.开市.交易.立券.挂匾.纳财.入宅.移徙.安床.栽种.纳畜.",
			"j": "探病.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1204": {
			"y": "祭祀.祈福.求嗣.开光.解除.理发.会亲友.栽种.纳畜.牧养.安葬.修坟.立碑.启攒.",
			"j": "入宅.作灶.词讼.移徙.出行.赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1205": {
			"y": "祭祀.沐浴.结网.移柩.入殓.除服.成服.",
			"j": "安床.开市.交易.出货财.安葬.修坟.嫁娶.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1206": {
			"y": "解除.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1207": {
			"y": "祈福.斋醮.纳采.订盟.解除.架马.开柱眼.修造.动土.起基.上梁.归岫.造屋.合脊.掘井.除服.成服.破土.栽种.",
			"j": "移徙.开市.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1208": {
			"y": "纳采.订盟.祭祀.沐浴.冠笄.合帐.裁衣.修造.动土.拆卸.移徙.入宅.安门.开仓.筑堤.作厕.栽种.纳畜.补垣.塞穴.",
			"j": "嫁娶.祈福.开光.掘井.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1209": {
			"y": "合帐.裁衣.教牛马.余事勿取.",
			"j": "入宅.动土.破土.嫁娶.作灶.造船.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1210": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.安香.出火.出行.会亲友.经络.求医.治病.解除.拆卸.起基.修造.动土.定磉.扫舍.栽种.牧养.造畜椆栖.",
			"j": "斋醮.作梁.掘井.行丧.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1211": {
			"y": "纳财.开市.交易.立券.会亲友.进人口.经络.祭祀.祈福.安香.出火.求医.治病.修造.动土.拆卸.扫舍.安床.栽种.牧养.开生坟.合寿木.入殓.安葬.启攒.",
			"j": "嫁娶.祈福.出火.移徙.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1212": {
			"y": "祭祀.入殓.移柩.余事勿取.",
			"j": "入宅.修造.动土.破土.安门.上梁.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1213": {
			"y": "塑绘.开光.订盟.纳采.裁衣.冠笄.拆卸.修造.安床.入宅.出火.安葬.谢土.赴任.",
			"j": "掘井.伐木.斋醮.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1214": {
			"y": "祭祀.塑绘.开光.裁衣.冠笄.嫁娶.纳采.拆卸.修造.动土.竖柱.上梁.安床.移徙.入宅.安香.结网.捕捉.畋猎.伐木.进人口.放水.",
			"j": "出行.安葬.修坟.开市.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1215": {
			"y": "祭祀.求医.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1216": {
			"y": "祭祀.祈福.斋醮.出行.冠笄.安机械.移徙.入宅.安香.安床.除服.成服.移柩.启攒.",
			"j": "开光.栽种.治病.安门.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1217": {
			"y": "塑绘.斋醮.出行.拆卸.解除.修造.移徙.造船.入殓.除服.成服.移柩.启攒.修坟.立碑.谢土.",
			"j": "",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1218": {
			"y": "祭祀.沐浴.安床.纳财.畋猎.捕捉.",
			"j": "开市.破土.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1219": {
			"y": "订盟.纳采.祭祀.祈福.修造.动土.上梁.破土.",
			"j": "嫁娶.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1220": {
			"y": "出行.沐浴.理发.补垣.塞穴.",
			"j": "入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1222": {
			"y": "嫁娶.出行.求医.治病.祭祀.祈福.上梁.纳畜.",
			"j": "开市.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1223": {
			"y": "开市.立券.开光.解除.安机械.上梁.启攒.安葬.",
			"j": "嫁娶.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1224": {
			"y": "平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1225": {
			"y": "求嗣.斋醮.塑绘.订盟.纳采.出火.拆卸.修造.动土.造桥.安机械.栽种.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.",
			"j": "开市.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1226": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.修造.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1227": {
			"y": "治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1228": {
			"y": "祭祀.祈福.求嗣.斋醮.开光.入学.订盟.冠笄.伐木.修造.动土.起基.放水.交易.开池.",
			"j": "造桥.安门.理发.造庙.栽种.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1229": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1230": {
			"y": "沐浴.理发.扫舍.",
			"j": "伐木.纳畜.上梁.入宅.作灶.造畜椆栖.嫁娶.安葬.作梁.造船.安门.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d1231": {
			"y": "祭祀.开光.祈福.解除.作梁.动土.安床.掘井.栽种.纳畜.破土.移柩.",
			"j": "嫁娶.出行.赴任.造屋.入殓.入宅.移徙.出火.进人口.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1101": {
			"y": "祭祀.出行.裁衣.冠笄.会亲友.造畜椆栖.嫁娶.竖柱.上梁.移徙.纳财.纳畜.",
			"j": "动土.伐木.作梁.行丧.安葬.开生坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1103": {
			"y": "开市.交易.立券.纳财.会亲友.开光.理发.入殓.移柩.安葬.启攒.",
			"j": "嫁娶.作灶.出火.出行.入宅.移徙.安床.祈福.上梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1021": {
			"y": "沐浴.理发.入学.习艺.进人口.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1102": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.移徙.伐木.安床.纳畜.出火.拆卸.",
			"j": "安葬.修坟.作灶.破土.造庙.动土.嫁娶.纳采.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1104": {
			"y": "造畜椆栖.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1105": {
			"y": "入殓.破土.安葬.启攒.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1106": {
			"y": "祭祀.入殓.移柩.开生坟.破土.启攒.安葬.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1107": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.塑绘.开光.移徙.安床.伐木.作梁.捕捉.畋猎.结网.求医.治病.解除.安葬.除服.成服.移柩.入殓.立碑.谢土.",
			"j": "开市.造庙.动土.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1108": {
			"y": "破屋.坏垣.祭祀.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1109": {
			"y": "嫁娶.纳采.订盟.祭祀.冠笄.裁衣.伐木.作梁.架马.定磉.开柱眼.作灶.移徙.安床.畋猎.结网.开池.作厕.除服.成服.启攒.入殓.移柩.安葬.",
			"j": "造屋.造船.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1110": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.斋醮.开光.会亲友.解除.入学.纳财.交易.立券.经络.起基.动土.定磉.开池.栽种.纳畜.牧养.破土.入殓.立碑.安葬.",
			"j": "嫁娶.开市.入宅.出火.移徙.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1111": {
			"y": "捕捉.畋猎.会亲友.解除.入殓.除服.成服.移柩.余事勿取.",
			"j": "安床.安门.破土.修坟.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1112": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.冠笄.出行.理发.拆卸.解除.起基.动土.定磉.安碓硙.开池.掘井.扫舍.除服.成服.移柩.启攒.立碑.谢土.",
			"j": "移徙.入宅.安门.作梁.安葬.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1113": {
			"y": "嫁娶.冠笄.安床.纳采.会亲友.塞穴.捕捉.置产.造畜椆栖.",
			"j": "开光.掘井.安葬.谢土.修坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1114": {
			"y": "祭祀.沐浴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1115": {
			"y": "祭祀.会亲友.嫁娶.沐浴.修造.动土.祈福.开光.塑绘.出行.订盟.纳采.裁衣.入殓.除服.成服.移柩.启攒.赴任.竖柱.上梁.纳财.扫舍.栽种.纳畜.伐木.",
			"j": "入宅.作灶.安床.开仓.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1116": {
			"y": "理发.会亲友.补垣.塞穴.结网.",
			"j": "嫁娶.入宅.安门.移徙.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1117": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.拆卸.修造.动土.起基.安床.移徙.入宅.安香.除服.成服.入殓.移柩.安葬.谢土.赴任.会亲友.进人口.出行.竖柱.上梁.经络.开市.交易.立券.纳财.开仓.",
			"j": "作灶.治病.伐木.作梁.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1118": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.拆卸.修造.动土.起基.安床.移徙.入宅.安香.入殓.移柩.安葬.谢土.赴任.进人口.会亲友.",
			"j": "作灶.治病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1119": {
			"y": "祭祀.塑绘.开光.订盟.纳采.嫁娶.安床.进人口.入殓.除服.成服.移柩.启攒.安葬.立碑.",
			"j": "开市.交易.破土.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1120": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1122": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.合帐.冠笄.安机械.安床.造畜椆栖.入殓.移柩.启攒.安葬.谢土.除服.成服.会亲友.竖柱.上梁.经络.开市.交易.立券.纳财.纳畜.筑堤.",
			"j": "嫁娶.入宅.治病.赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1123": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1124": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1125": {
			"y": "祈福.斋醮.出行.订盟.纳采.入殓.移柩.破土.安葬.立碑.结网.",
			"j": "入宅.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1126": {
			"y": "祭祀.沐浴.出行.冠笄.进人口.余事勿取.",
			"j": "嫁娶.动土.安葬.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1127": {
			"y": "祭祀.祈福.斋醮.塑绘.开光.订盟.纳采.裁衣.冠笄.嫁娶.拆卸.入宅.安香.入殓.移柩.理发.安葬.修坟.谢土.赴任.移徙.沐浴.治病.破土.启攒.整手足甲.入学.作梁.",
			"j": "开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1128": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1129": {
			"y": "开市.交易.立券.挂匾.纳财.开光.出行.入宅.移徙.安床.纳畜.入殓.移柩.安葬.",
			"j": "栽种.破土.置产.祭祀.嫁娶.动土.作灶.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1130": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.出行.拆卸.进人口.入宅.移徙.安床.栽种.动土.修造.纳畜.入殓.安葬.立碑.除服.成服.",
			"j": "",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1131": {
			"y": "开光.解除.拆卸.修造.动土.安床.纳畜.安葬.启攒.入殓.",
			"j": "嫁娶.开市.出火.栽种.破土.动土.入宅.移徙.安香.分居.掘井.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1001": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0921": {
			"y": "祭祀.赴任.动土.上梁.开光.塑绘.冠笄.拆卸.起基.安床.开市.立券.赴任.经络.",
			"j": "定磉.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1002": {
			"y": "嫁娶.祈福.求嗣.出行.出火.拆卸.修造.动土.上梁.开光.进人口.开市.交易.立券.挂匾.安床.入宅.移徙.栽种.伐木.入殓.破土.除服.成服.",
			"j": "",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1003": {
			"y": "开市.交易.立券.挂匾.祭祀.开光.进人口.入宅.安床.出火.拆卸.修造.动土.栽种.",
			"j": "嫁娶.立碑.出行.伐木.安葬.行丧.移徙.纳畜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1004": {
			"y": "祭祀.理发.会亲友.进人口.嫁娶.针灸.入殓.移柩.",
			"j": "探病.开渠.安葬.伐木.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1005": {
			"y": "祭祀.立碑.修坟.启攒.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1006": {
			"y": "嫁娶.出行.伐木.拆卸.修造.动土.移徙.安葬.破土.修坟.立碑.",
			"j": "掘井.祈福.安床.开市.入宅.挂匾.开光.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1007": {
			"y": "祭祀.出行.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1008": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.置产.求医.治病.开市.交易.立券.会亲友.移徙.竖柱.上梁.造屋.合脊.安门.放水.捕捉.纳畜.",
			"j": "造庙.造船.动土.破土.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1009": {
			"y": "出行.造车器.造畜椆栖.解除.冠笄.裁衣.作梁.雕刻.会亲友.移徙.入宅.安机械.造畜椆栖.开市.扫舍.",
			"j": "嫁娶.动土.破土.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1010": {
			"y": "沐浴.理发.冠笄.安床.开市.立券.会亲友.交易.纳财.结网.教牛马.",
			"j": "移徙.入宅.出行.祈福.嫁娶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1011": {
			"y": "祭祀.造畜椆栖.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.开市.安床.掘井.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1012": {
			"y": "捕捉.结网.入殓.除服.成服.移柩.破土.安葬.启攒.立碑.",
			"j": "嫁娶.祭祀.入宅.造屋.移徙.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1013": {
			"y": "祭祀.祈福.求嗣.斋醮.造庙.出火.安机械.会亲友.开市.交易.立券.纳财.习艺.经络.求医.治病.开池.作厕.畋猎.结网.栽种.牧养.安葬.破土.启攒.",
			"j": "开光.嫁娶.掘井.伐木.作梁.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1014": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1015": {
			"y": "会亲友.嫁娶.订盟.纳采.纳婿.拆卸.修造.动土.起基.竖柱.上梁.安床.会亲友.纳财.",
			"j": "出行.祈福.安葬.作灶.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1016": {
			"y": "祭祀.塑绘.开光.祈福.斋醮.出行.订盟.纳采.裁衣.嫁娶.拆卸.修造.安床.入宅.安香.入殓.启攒.安葬.谢土.赴任.会亲友.进人口.出行.移徙.上梁.经络.开市.交易.立券.纳财.",
			"j": "开仓.冠笄.伐木.作梁.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1017": {
			"y": "祭祀.作灶.入殓.除服.成服.畋猎.",
			"j": "栽种.动土.安葬.开市.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1018": {
			"y": "祭祀.祈福.斋醮.沐浴.竖柱.订盟.纳采.嫁娶.拆卸.入宅.移柩.启攒.谢土.赴任.出火.纳畜.",
			"j": "作灶.入殓.安葬.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1019": {
			"y": "嫁娶.祭祀.安机械.入殓.破土.安葬.",
			"j": "动土.上梁.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1020": {
			"y": "作灶.造畜椆栖.",
			"j": "行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1022": {
			"y": "开光.针灸.会亲友.启攒.安葬.",
			"j": "开市.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1023": {
			"y": "祭祀.结网.造畜椆栖.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1024": {
			"y": "入殓.除服.成服.移柩.破土.启攒.安葬.",
			"j": "移徙.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1025": {
			"y": "嫁娶.订盟.纳采.出行.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "开市.赴任.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1026": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1027": {
			"y": "订盟.纳采.会亲友.安机械.纳财.牧养.",
			"j": "祈福.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1028": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "斋醮.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1029": {
			"y": "祭祀.塞穴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1030": {
			"y": "祭祀.祈福.求嗣.开光.开市.出行.解除.动土.起基.置产.栽种.",
			"j": "嫁娶.作灶.修坟.安门.入宅.立碑.安葬.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1031": {
			"y": "祭祀.解除.裁衣.理发.安床.作灶.造畜椆栖.放水.筑堤.补垣.塞穴.整手足甲.扫舍.",
			"j": "嫁娶.开光.会亲友.掘井.安门.栽种.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0901": {
			"y": "祭祀.解除.沐浴.理发.整手足甲.入殓.移柩.破土.安葬.扫舍.",
			"j": "嫁娶.会亲友.进人口.出行.入宅.移徙.赴任.作灶.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0821": {
			"y": "订盟.纳采.出行.会亲友.修造.上梁.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0902": {
			"y": "塑绘.开光.进人口.纳畜.补垣.塞穴.栽种.牧养.",
			"j": "嫁娶.纳财.祈福.安葬.修造.开市.交易.立券.动土.上梁.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0903": {
			"y": "祭祀.作灶.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0904": {
			"y": "祭祀.求嗣.开光.出行.伐木.作梁.出火.解除.拆卸.进人口.修造.动土.起基.安床.栽种.纳畜.入殓.破土.安葬.除服.成服.",
			"j": "嫁娶.移徙.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0905": {
			"y": "祭祀.求医.捕捉.栽种.塞穴.入殓.破土.安葬.移柩.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0906": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0907": {
			"y": "余事勿取.",
			"j": "探病.余事勿取.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0908": {
			"y": "订盟.纳采.祭祀.祈福.安香.出火.修造.动土.上梁.安门.起基.竖柱.上梁.定磉.开池.移徙.入宅.立券.破土.",
			"j": "嫁娶.造庙.造桥.造船.作灶.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0909": {
			"y": "开光.求嗣.雕刻.嫁娶.订盟.纳采.出火.拆卸.修造.动土.起基.上梁.放水.移徙.入宅.造仓.造船.开市.开池.纳畜.牧养.挂匾.",
			"j": "行丧.安葬.合寿木.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0910": {
			"y": "祭祀.嫁娶.捕捉.",
			"j": "开光.动土.破土.开市.修造.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0911": {
			"y": "祭祀.普渡.解除.会亲友.捕捉.畋猎.启攒.除服.成服.移柩.",
			"j": "嫁娶.开市.动土.掘井.开池.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0912": {
			"y": "祭祀.出行.解除.冠笄.嫁娶.伐木.架马.开柱眼.修造.动土.移徙.入宅.开生坟.合寿木.入殓.移柩.破土.安葬.修坟.",
			"j": "开光.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0913": {
			"y": "祭祀.祈福.求嗣.出行.沐浴.交易.扫舍.教牛马.",
			"j": "动土.作灶.行丧.安葬.修坟.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0914": {
			"y": "出行.解除.纳采.冠笄.雕刻.修造.动土.起基.上梁.合脊.安床.移徙.入宅.开市.栽种.作厕.",
			"j": "造庙.安门.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0915": {
			"y": "祭祀.沐浴.解除.理发.冠笄.安机械.作灶.造仓.开市.开池.作厕.补垣.塞穴.断蚁.结网.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0916": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0917": {
			"y": "祭祀.会亲友.纳采.嫁娶.开光.塑绘.斋醮.安香.开市.立券.除服.成服.入殓.移柩.安葬.赴任.进人口.出行.裁衣.修造.动土.上梁.经络.交易.",
			"j": "入宅.伐木.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0918": {
			"y": "祭祀.冠笄.会亲友.拆卸.起基.除服.成服.移柩.启攒.安葬.沐浴.捕捉.开光.塑绘.",
			"j": "作灶.祭祀.入宅.嫁娶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0919": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "移徙.入宅.出行.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0920": {
			"y": "祭祀.塑绘.开光.出行.解除.订盟.嫁娶.拆卸.起基.安床.入宅.开市.入殓.除服.成服.移柩.破土.谢土.挂匾.开柱眼.交易.",
			"j": "造桥.冠笄.造屋.掘井.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0922": {
			"y": "祭祀.裁衣.冠笄.嫁娶.纳婿.会亲友.除服.成服.移柩.捕捉.进人口.入殓.",
			"j": "移徙.入宅.作灶.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0923": {
			"y": "祭祀.诸事不宜.",
			"j": "入殓.安葬.开市.交易.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0924": {
			"y": "祭祀.裁衣.冠笄.嫁娶.安机械.拆卸.动土.起基.移徙.入宅.入殓.启攒.安葬.造仓.经络.",
			"j": "安床.开光.开市.交易.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0925": {
			"y": "祭祀.出行.成服.除服.沐浴.入殓.",
			"j": "动土.冠笄.移徙.入宅.开市.竖柱.上梁.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0926": {
			"y": "祭祀.沐浴.赴任.出行.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0927": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0928": {
			"y": "沐浴.入殓.移柩.除服.成服.破土.平治道涂.",
			"j": "嫁娶.移徙.入宅.开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0929": {
			"y": "嫁娶.祭祀.祈福.求嗣.沐浴.出火.出行.拆卸.修造.动土.进人口.开市.交易.立券.入宅.移徙.安床.栽种.纳畜.入殓.安葬.启攒.除服.成服.",
			"j": "",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0930": {
			"y": "开光.解除.起基.动土.拆卸.上梁.立碑.修坟.安葬.破土.启攒.移柩.",
			"j": "嫁娶.出行.安床.作灶.祭祀.入宅.移徙.出火.进人口.置产.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0931": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0721": {
			"y": "嫁娶.纳采.开市.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "赴任.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0801": {
			"y": "嫁娶.开光.出行.理发.作梁.出火.拆卸.修造.开市.交易.立券.挂匾.动土.入宅.移徙.安床.栽种.",
			"j": "伐木.祭祀.纳畜.祭祀.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0802": {
			"y": "嫁娶.开光.出行.祈福.求嗣.解除.拆卸.动土.修造.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.纳畜.入殓.移柩.安葬.",
			"j": "",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0803": {
			"y": "祭祀.作灶.纳财.栽种.纳畜.进人口.",
			"j": "安葬.经络.修坟.破土.开市.安床.启攒.立碑.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0804": {
			"y": "祭祀.祈福.求嗣.开光.开市.牧养.理发.",
			"j": "嫁娶.出行.安葬.入殓.入宅.作灶.冠笄.上梁.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0805": {
			"y": "祭祀.入殓.破土.除服.成服.移柩.启攒.安葬.谢土.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0806": {
			"y": "祭祀.出行.交易.割蜜.造畜椆栖.",
			"j": "嫁娶.作灶.安葬.动土.词讼.作梁.伐木.掘井.破土.移徙.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0807": {
			"y": "嫁娶.冠笄.祭祀.沐浴.普渡.出行.纳财.扫舍.纳畜.赴任.",
			"j": "开市.动土.破土.安床.开仓.上梁.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0808": {
			"y": "祭祀.沐浴.理发.整手足甲.冠笄.解除.入殓.移柩.破土.启攒.安葬.",
			"j": "嫁娶.出行.入宅.开市.安门.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0809": {
			"y": "塑绘.冠笄.嫁娶.会亲友.进人口.经络.裁衣.栽种.纳畜.牧养.补垣.塞穴.捕捉.",
			"j": "祈福.开市.动土.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0810": {
			"y": "出行.沐浴.订盟.纳采.裁衣.竖柱.上梁.移徙.纳畜.牧养.",
			"j": "嫁娶.安门.动土.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0811": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.普渡.开光.安香.出火.移徙.入宅.竖柱.修造.动土.竖柱.上梁.起基.造屋.安门.造庙.造桥.破土.启攒.安葬.",
			"j": "开市.立券.纳财.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0812": {
			"y": "祭祀.捕捉.畋猎.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.启攒.",
			"j": "嫁娶.纳采.订盟.开市.入宅.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0813": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "行丧.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0814": {
			"y": "祈福.斋醮.出行.冠笄.嫁娶.雕刻.开柱眼.入宅.造桥.开市.交易.立券.纳财.入殓.除服.成服.移柩.破土.安葬.启攒.",
			"j": "动土.破土.订盟.安床.开池.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0815": {
			"y": "祈福.求嗣.解除.订盟.纳采.动土.起基.放水.造仓.开市.纳畜.牧养.开生坟.入殓.除服.成服.移柩.破土.安葬.",
			"j": "",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0816": {
			"y": "塑绘.开光.解除.订盟.纳采.嫁娶.出火.修造.动土.移徙.入宅.拆卸.起基.安门.分居.开市.交易.立券.纳财.纳畜.牧养.",
			"j": "",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0817": {
			"y": "祈福.出行.订盟.纳采.嫁娶.裁衣.动土.安床.放水.开市.掘井.交易.立券.栽种.开渠.除服.成服.移柩.破土.",
			"j": "",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0818": {
			"y": "嫁娶.祭祀.祈福.斋醮.作灶.移徙.入宅.",
			"j": "动土.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0819": {
			"y": "嫁娶.出行.纳畜.祭祀.入殓.启攒.安葬.",
			"j": "作灶.动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0820": {
			"y": "订盟.纳采.祭祀.祈福.修造.动土.上梁.破土.安葬.",
			"j": "嫁娶.开市.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0822": {
			"y": "沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.祈福.余事勿取.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0823": {
			"y": "嫁娶.祭祀.祈福.斋醮.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0824": {
			"y": "捕捉.结网.入殓.破土.安葬.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0825": {
			"y": "沐浴.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0826": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.移徙.入宅.启攒.安葬.",
			"j": "动土.破土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0827": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求医.治病.动土.移徙.入宅.破土.安葬.",
			"j": "开光.针灸.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0828": {
			"y": "订盟.纳采.祭祀.祈福.安机械.作灶.纳畜.",
			"j": "动土.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0829": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.动土.安床.掘井.破土.启攒.",
			"j": "入宅.作梁.安门.伐木.修造.上梁.入殓.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0830": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.修造.移徙.动土.安床.入殓.破土.安葬.启攒.",
			"j": "造屋.开光.理发.造船.掘井.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0831": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.上梁.造屋.移徙.安门.纳财.牧养.纳畜.安葬.启攒.入殓.",
			"j": "破土.置产.掘井.动土.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0621": {
			"y": "嫁娶.祭祀.沐浴.扫舍.修饰垣墙.",
			"j": "行丧.安葬.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0701": {
			"y": "嫁娶.祭祀.祈福.出火.开光.求嗣.出行.拆卸.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.动土.",
			"j": "安葬.行丧.伐木.作梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0702": {
			"y": "开光.求嗣.出行.解除.伐木.出火.拆卸.修造.上梁.起基.入宅.移徙.开市.交易.立券.栽种.牧养.入殓.安葬.除服.成服.",
			"j": "置产.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0703": {
			"y": "祭祀.理发.修饰垣墙.平治道涂.沐浴.整手足甲.扫舍.",
			"j": "出行.安门.修造.嫁娶.上梁.入宅.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0704": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.出火.拆卸.动土.修造.进人口.入宅.移徙.安床.挂匾.交易.立券.栽种.纳畜.入殓.破土.启攒.安葬.",
			"j": "",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0705": {
			"y": "祭祀.祈福.求嗣.开光.出行.伐木.出火.拆卸.修造.动土.起基.安床.入宅.移徙.",
			"j": "嫁娶.开市.交易.行丧.安葬.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0706": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0707": {
			"y": "求医.治病.破屋.坏垣.余事勿取.",
			"j": "嫁娶.出行.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0708": {
			"y": "纳采.订盟.嫁娶.移徙.入宅.出行.开市.交易.立券.纳财.会亲友.安香.出火.拆卸.造屋.起基.安床.作灶.挂匾.安葬.破土.启攒.立碑.入殓.移柩.",
			"j": "祈福.上梁.开仓.掘井.牧养.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0709": {
			"y": "祭祀.祈福.斋醮.出行.纳采.订盟.安机械.出火.拆卸.修造.动土.起基.移徙.入宅.造庙.入殓.除服.成服.移柩.破土.安葬.谢土.",
			"j": "嫁娶.开市.栽种.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0710": {
			"y": "祭祀.进人口.纳财.纳畜.牧养.捕捉.余事勿取.",
			"j": "开市.入宅.安床.动土.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0711": {
			"y": "祭祀.塑绘.开光.求医.治病.嫁娶.会亲友.放水.掘井.牧养.纳畜.开渠.安碓硙.",
			"j": "造屋.入宅.作灶.入学.安葬.行丧.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0712": {
			"y": "祭祀.塞穴.结网.畋猎.余事勿取.",
			"j": "移徙.开市.入宅.嫁娶.开光.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0713": {
			"y": "开市.纳财.祭祀.塑绘.安机械.冠笄.会亲友.裁衣.开仓.经络.纳畜.造畜椆栖.教牛马.牧养.",
			"j": "动土.破土.安葬.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0714": {
			"y": "移徙.入宅.治病.会亲友.祭祀.祈福.斋醮.安香.移徙.嫁娶.造屋.起基.",
			"j": "开市.斋醮.安床.出行.经络.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0715": {
			"y": "塑绘.出行.冠笄.嫁娶.进人口.裁衣.纳婿.造畜椆栖.交易.立券.牧养.开生坟.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0716": {
			"y": "祭祀.冠笄.嫁娶.捕捉.结网.畋猎.取渔.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0717": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0718": {
			"y": "纳采.祭祀.祈福.解除.动土.破土.安葬.",
			"j": "嫁娶.移徙.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0719": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0720": {
			"y": "嫁娶.纳采.开市.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "祭祀.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0722": {
			"y": "祭祀.作灶.纳财.捕捉.",
			"j": "开市.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0723": {
			"y": "嫁娶.开市.立券.祭祀.祈福.动土.移徙.入宅.",
			"j": "造庙.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0724": {
			"y": "补垣.塞穴.结网.入殓.除服.成服.移柩.安葬.启攒.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0725": {
			"y": "嫁娶.纳采.出行.祭祀.祈福.解除.移徙.入宅.",
			"j": "动土.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0726": {
			"y": "嫁娶.祭祀.祈福.斋醮.治病.破土.安葬.",
			"j": "开市.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0727": {
			"y": "嫁娶.出行.开市.安床.入殓.启攒.安葬.",
			"j": "祈福.动土.破土.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0728": {
			"y": "嫁娶.祭祀.裁衣.结网.冠笄.沐浴.",
			"j": "开仓.出货财.置产.安葬.动土.破土.掘井.栽种.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0729": {
			"y": "入宅.移徙.安床.开光.祈福.求嗣.进人口.开市.交易.立券.出火.拆卸.修造.动土.",
			"j": "嫁娶.破土.置产.栽种.安葬.修坟.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0730": {
			"y": "祭祀.解除.沐浴.整手足甲.入殓.移柩.破土.启攒.安葬.",
			"j": "嫁娶.入宅.移徙.作灶.开市.交易.安门.栽种.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0731": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0521": {
			"y": "嫁娶.纳采.出行.移徙.入宅.",
			"j": "动土.破土.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0601": {
			"y": "开市.交易.立券.祭祀.祈福.开光.伐木.进人口.安床.拆卸.修造.动土.栽种.破土.移柩.安葬.",
			"j": "入宅.移徙.理发.出火.嫁娶.出行.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0602": {
			"y": "结网.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0603": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.开市.交易.立券.安床.出行.拆卸.",
			"j": "纳畜.入宅.移徙.安葬.探病.伐木.上梁.安门.入殓.动土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0604": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.修造.动土.入宅.移徙.安床.作灶.塞穴.栽种.破土.安葬.",
			"j": "开光.掘井.开仓.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0605": {
			"y": "嫁娶.冠笄.修造.动土.作灶.移徙.入宅.补垣.塞穴.纳畜.牧养.架马.修造.动土.起基.定磉.开池.造船.",
			"j": "祈福.开光.掘井.开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0606": {
			"y": "祭祀.交易.纳财.",
			"j": "斋醮.开渠.上梁.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0607": {
			"y": "嫁娶.订盟.纳采.冠笄.会亲友.安机械.造车器.祭祀.出行.纳财.入宅.安香.出火.入学.塑绘.开光.拆卸.起基.修造.动土.牧养.栽种.安门.作厕.",
			"j": "行丧.伐木.作梁.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0608": {
			"y": "开光.求嗣.出行.冠笄.嫁娶.伐木.架马.开柱眼.修造.移徙.入宅.开市.交易.立券.出行.安香.出火.挂匾.起基.修造.开生坟.合寿木.入殓.除服.成服.移柩.安葬.",
			"j": "安床.出货财.作灶.动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0609": {
			"y": "祭祀.沐浴.理发.嫁娶.作灶.整手足甲.扫舍.修饰垣墙.平治道涂.",
			"j": "斋醮.出行.治病.合寿木.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0610": {
			"y": "安机械.移徙.入宅.出行.祭祀.祈福.斋醮.纳采.订盟.安香.出火.解除.会亲友.修造.动土.拆卸.起基.定磉.移徙.入宅.造屋.安床.修造.破土.安葬.入殓.立碑.",
			"j": "开市.伐木.作梁.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0611": {
			"y": "祭祀.沐浴.捕捉.结网.畋猎.取渔.余事勿取.",
			"j": "开市.交易.嫁娶.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0612": {
			"y": "破屋.坏垣.求医.治病.畋猎.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0613": {
			"y": "嫁娶.出行.安机械.祭祀.塑绘.开光.治病.经络.安床.结网.塞穴.破土.入殓.",
			"j": "开市.安门.掘井.作灶.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0614": {
			"y": "订盟.纳采.会亲友.进人口.雕刻.拆卸.修造.动土.起基.开市.栽种.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.",
			"j": "",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0615": {
			"y": "祭祀.捕捉.取渔.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0616": {
			"y": "嫁娶.纳采.祭祀.祈福.求医.治病.出行.动土.移徙.入宅.",
			"j": "开市.安门.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0617": {
			"y": "裁衣.作灶.移徙.入宅.纳畜.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0618": {
			"y": "祭祀.入殓.移柩.启攒.安葬.",
			"j": "上梁.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0619": {
			"y": "订盟.纳采.出行.祈福.斋醮.安床.会亲友.",
			"j": "移徙.入宅.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0620": {
			"y": "嫁娶.纳采.出行.求医.治病.开市.移徙.入宅.启攒.安葬.",
			"j": "动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0622": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0623": {
			"y": "订盟.纳采.出行.祭祀.祈福.修造.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0624": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0625": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.入殓.破土.安葬.",
			"j": "开光.开市.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0626": {
			"y": "开光.求医.治病.动土.上梁.入殓.破土.安葬.",
			"j": "嫁娶.开光.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0627": {
			"y": "祭祀.栽种.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0628": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.出行.解除.伐木.入宅.移徙.安床.出火.拆卸.修造.上梁.栽种.移柩.",
			"j": "安葬.开市.交易.立券.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0629": {
			"y": "求嗣.嫁娶.纳采.合帐.裁衣.冠笄.伐木.作梁.修造.动土.起基.竖柱.上梁.安门.作灶.筑堤.造畜椆栖.",
			"j": "安葬.出行.祈福.栽种.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0630": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0631": {
			"y": "嫁娶.祭祀.祈福.出火.开光.求嗣.出行.拆卸.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.动土.",
			"j": "安葬.行丧.伐木.作梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0501": {
			"y": "纳采.嫁娶.开光.出行.理发.会亲友.开市.安床.栽种.牧养.入殓.移柩.启攒.",
			"j": "谢土.祈福.上梁.作灶.斋醮.修造.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0421": {
			"y": "祭祀.斋醮.开市.动土.入殓.破土.安葬.",
			"j": "嫁娶.移徙.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0502": {
			"y": "祭祀.平治道涂.解除.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0503": {
			"y": "祭祀.祈福.开光.解除.动土.纳财.交易.纳畜.扫舍.",
			"j": "进人口.出行.嫁娶.置产.安床.赴任.安葬.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0504": {
			"y": "祭祀.祈福.求嗣.开光.解除.出火.拆卸.入宅.安床.修造.安门.纳畜.启攒.安葬.",
			"j": "动土.破土.纳财.掘井.挂匾.开市.伐木.交易.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0505": {
			"y": "嫁娶.纳采.订盟.斋醮.开光.祭祀.祈福.求医.治病.会亲友.动土.解除.捕捉.纳畜.牧养.入殓.破土.安葬.",
			"j": "移徙.入宅.造屋.架马.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0506": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0507": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "斋醮.开市.嫁娶.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0508": {
			"y": "开市.交易.立券.安机械.会亲友.开光.求医.治病.造屋.起基.修造.动土.定磉.竖柱.上梁.安门.作灶.放水.作厕.开池.栽种.牧养.造畜椆栖.破土.安葬.立碑.",
			"j": "嫁娶.出火.移徙.入宅.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0509": {
			"y": "栽种.捕捉.畋猎.余事勿取.",
			"j": "开市.动土.祭祀.斋醮.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0510": {
			"y": "嫁娶.祭祀.祈福.求嗣.斋醮.订盟.纳采.解除.出行.动土.破土.习艺.针灸.理发.会亲友.起基.修造.动土.竖柱.定磉.安床.拆卸.纳畜.牧养.放水.破土.除服.成服.修坟.立碑.",
			"j": "开市.入宅.探病.出火.造屋.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0511": {
			"y": "余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0512": {
			"y": "塞穴.断蚁.结网.余事勿取.",
			"j": "破土.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0513": {
			"y": "开光.出行.纳采.嫁娶.伐木.架马.出火.拆卸.移徙.入宅.造庙.造桥.造船.造畜椆栖.开市.入殓.除服.成服.移柩.安葬.",
			"j": "",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0514": {
			"y": "进人口.牧养.置产.塞穴.结网.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0515": {
			"y": "开光.出行.嫁娶.",
			"j": "会亲友.进人口.修造.动土.起基.移徙.开市.纳畜.入殓.除服.成服.移柩.破土.安葬.修坟.立碑.会亲友.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0516": {
			"y": "嫁娶.纳采.出行.祭祀.祈福.开市.动土.移徙.入宅.破土.安葬.",
			"j": "安门.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0517": {
			"y": "嫁娶.纳采.求医.治病.修造.动土.移徙.入宅.破土.安葬.",
			"j": "开市.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0518": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0519": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "祈福.斋醮.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0520": {
			"y": "纳采.祭祀.祈福.开市.求医.治病.动土.纳畜.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0522": {
			"y": "订盟.纳采.祭祀.动土.破土.交易.立券.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0523": {
			"y": "嫁娶.裁衣.祭祀.出行.安床.作灶.移徙.入宅.破土.安葬.",
			"j": "赴任.捕捉.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0524": {
			"y": "塞穴.结网.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0525": {
			"y": "嫁娶.订盟.纳采.出行.祭祀.祈福.斋醮.动土.上梁.破土.安葬.",
			"j": "移徙.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0526": {
			"y": "订盟.纳采.会亲友.安床.作灶.造畜椆栖.",
			"j": "开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0527": {
			"y": "沐浴.平治道涂.扫舍.入殓.移柩.破土.启攒.安葬.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0528": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.动土.上梁.进人口.入宅.移徙.安床.安门.开市.交易.立券.挂匾.栽种.破土.安葬.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0529": {
			"y": "祭祀.开光.出行.解除.塑绘.裁衣.入殓.移柩.破土.启攒.安葬.除服.成服.",
			"j": "嫁娶.上梁.修造.拆卸.架马.入宅.伐木.动土.出火.开柱眼.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0530": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0531": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.拆卸.动土.上梁.出火.进人口.入宅.移徙.安床.栽种.纳畜.牧养.竖柱.安门.修造.解除.会亲友.",
			"j": "",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0321": {
			"y": "祭祀.开光.塑绘.酬神.斋醮.订盟.纳采.嫁娶.裁衣.动土.起基.出火.拆卸.移徙.入宅.安香.修造.竖柱.上梁.纳畜.牧养.祈福.求嗣.解除.伐木.定磉.造屋.安门.",
			"j": "栽种.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0401": {
			"y": "裁衣.合帐.冠笄.嫁娶.纳婿.安床.入殓.纳财.",
			"j": "作灶.开市.安葬.作梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0402": {
			"y": "祭祀.订盟.纳采.修造.动土.祈福.塑绘.斋醮.沐浴.拆卸.起基.入宅.安香.造庙.移柩.谢土.除服.成服.入学.习艺.出行.竖柱.上梁.掘井.求嗣.解除.伐木.",
			"j": "作灶.安葬.开市.造屋.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0403": {
			"y": "订盟.纳采.裁衣.合帐.冠笄.安机械.拆卸.安床.入殓.除服.成服.移柩.破土.启攒.安葬.修坟.立碑.经络.交易.立券.纳财.筑堤.造仓.补垣.塞穴.纳畜.伐木.架马.",
			"j": "祭祀.开光.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0404": {
			"y": "祭祀.祈福.求嗣.斋醮.冠笄.作灶.纳财.交易.",
			"j": "开光.嫁娶.掘井.安葬.安门.探病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0405": {
			"y": "祭祀.解除.教牛马.出行.余事勿取.",
			"j": "动土.破土.行丧.开光.作梁.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0406": {
			"y": "沐浴.斋醮.解除.求医.治病.会亲友.造畜椆栖.栽种.理发.扫舍.",
			"j": "开市.嫁娶.移徙.入宅.掘井.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0407": {
			"y": "求嗣.出行.解除.订盟.纳采.嫁娶.会亲友.进人口.安床.开市.交易.纳畜.牧养.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "祈福.开市.修造.动土.破土.谢土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0408": {
			"y": "祭祀.作灶.平治道涂.余事勿取.",
			"j": "嫁娶.安葬.动土.安床.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0409": {
			"y": "造车器.祭祀.祈福.求嗣.斋醮.开市.交易.安机械.雕刻.开光.造屋.合脊.起基.定磉.安门.纳畜.安葬.开生坟.立碑.谢土.斋醮.",
			"j": "入宅.动土.开仓.出货财.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0410": {
			"y": "祭祀.祈福.开光.求嗣.斋醮.纳采.订盟.求医.治病.起基.定磉.造船.取渔.解除.安葬.启攒.谢土.入殓.",
			"j": "开市.动土.掘井.开池.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0411": {
			"y": "祭祀.沐浴.破屋.坏垣.求医.治病.解除.余事勿取.",
			"j": "嫁娶.开市.交易.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0412": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0413": {
			"y": "祭祀.塑绘.开光.订盟.纳采.冠笄.裁衣.安机械.拆卸.修造.动土.安床.经络.开市.",
			"j": "出火.入宅.安葬.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0414": {
			"y": "祭祀.余事勿取.",
			"j": "造庙.嫁娶.安床.余事勿取.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0415": {
			"y": "订盟.纳采.嫁娶.进人口.会亲友.交易.立券.动土.除服.谢土.移柩.破土.启攒.赴任.出行.开市.纳财.栽种.",
			"j": "入殓.安葬.入宅.安床.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0416": {
			"y": "祭祀.祈福.裁衣.合帐.安床.入殓.除服.成服.移柩.破土.启攒.安葬.谢土.立碑.造畜椆栖.",
			"j": "掘井.安门.嫁娶.纳采.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0417": {
			"y": "祭祀.进人口.嫁娶.安床.解除.冠笄.出行.裁衣.扫舍.",
			"j": "掘井.动土.破土.安葬.开光.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0418": {
			"y": "纳采.开光.求医.治病.动土.上梁.移徙.入宅.",
			"j": "嫁娶.开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0419": {
			"y": "祭祀.会亲友.开市.安床.启攒.安葬.",
			"j": "嫁娶.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0420": {
			"y": "祭祀.作灶.掘井.平治道涂.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0422": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.移徙.求医.",
			"j": "开市.动土.破土.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0423": {
			"y": "祭祀.求医.治病.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0424": {
			"y": "沐浴.结网.取渔.",
			"j": "嫁娶.入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0425": {
			"y": "",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0426": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0427": {
			"y": "嫁娶.开光.出行.出火.拆卸.进人口.开市.立券.交易.挂匾.入宅.移徙.安床.栽种.",
			"j": "祈福.入殓.祭祀.作灶.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0428": {
			"y": "嫁娶.出行.合帐.冠笄.安床.除服.成服.作灶.交易.立券.入殓.移柩.破土.安葬.",
			"j": "词讼.开光.开市.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0429": {
			"y": "出行.修饰垣墙.造畜椆栖.教牛马.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0430": {
			"y": "祭祀.祈福.开光.求嗣.解除.伐木.出火.入宅.移徙.安床.拆卸.修造.动土.造畜椆栖.",
			"j": "嫁娶.纳财.安葬.出行.开市.立券.作灶.栽种.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0431": {
			"y": "纳采.嫁娶.开光.出行.理发.会亲友.开市.安床.栽种.牧养.入殓.移柩.启攒.",
			"j": "谢土.祈福.上梁.作灶.斋醮.修造.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0221": {
			"y": "祈福.求嗣.斋醮.塑绘.开光.订盟.纳采.嫁娶.动土.入宅.安香.移柩.安葬.谢土.出行.沐浴.修造.竖柱.上梁.纳财.破土.解除.安门.放水.",
			"j": "作灶.安床.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0301": {
			"y": "作灶.解除.平治道涂.",
			"j": "栽种.出行.祈福.行丧.纳畜.安葬.安门.伐木.作梁.牧养.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0302": {
			"y": "解除.沐浴.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0303": {
			"y": "嫁娶.祭祀.祈福.出行.解除.出火.拆卸.动土.入宅.移徙.安床.上梁.栽种.纳畜.破土.启攒.安葬.",
			"j": "开市.立券.理发.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0304": {
			"y": "祭祀.解除.治病.破屋.坏垣.扫舍.",
			"j": "余事勿取.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0305": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "嫁娶.移徙.开市.入宅.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0306": {
			"y": "嫁娶.冠笄.祭祀.出行.会亲友.修造.动土.入殓.破土.",
			"j": "塑绘.开光.造桥.除服.成服.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0307": {
			"y": "开光.求嗣.出行.纳采.冠笄.出火.拆卸.起基.修造.动土.上梁.移徙.造船.开市.交易.立券.纳财.",
			"j": "祈福.嫁娶.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0308": {
			"y": "理发.冠笄.嫁娶.进人口.栽种.捕捉.针灸.",
			"j": "纳财.开市.安葬.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0309": {
			"y": "开光.祈福.求嗣.出行.解除.伐木.造屋.起基.修造.架马.安门.移徙.入宅.造庙.除服.成服.移柩.谢土.纳畜.牧养.",
			"j": "纳采.动土.开市.交易.安门.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0310": {
			"y": "裁衣.经络.伐木.开柱眼.拆卸.修造.动土.上梁.合脊.合寿木.入殓.除服.成服.移柩.破土.安葬.启攒.修坟.立碑.",
			"j": "祭祀.嫁娶.出行.上梁.掘井.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0311": {
			"y": "祭祀.会亲友.立券.交易.裁衣.合帐.嫁娶.冠笄.进人口.",
			"j": "栽种.动土.安葬.掘井.修坟.探病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0312": {
			"y": "扫舍.塞穴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0313": {
			"y": "塑绘.开光.订盟.纳采.裁衣.合帐.冠笄.安机械.会亲友.纳财.开市.立券.交易.安床.竖柱.上梁.结网.栽种.解除.经络.",
			"j": "作灶.出行.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0314": {
			"y": "祭祀.嫁娶.纳婿.除服.成服.入殓.移柩.",
			"j": "动土.作灶.入宅.开光.安床.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0315": {
			"y": "祈福.求嗣.开光.塑绘.斋醮.订盟.纳采.嫁娶.拆卸.安床.入宅.安香.移柩.修坟.安葬.谢土.栽种.解除.冠笄.裁衣.移徙.修造.动土.竖柱.放水.启攒.立碑.",
			"j": "赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0316": {
			"y": "祭祀.解除.入殓.除服.成服.移柩.启攒.安葬.修坟.立碑.谢土.沐浴.扫舍.捕捉.取渔.结网.畋猎.理发.",
			"j": "安床.嫁娶.作灶.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0317": {
			"y": "破屋.坏垣.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0318": {
			"y": "祭祀.出行.订盟.纳采.裁衣.合帐.冠笄.进人口.动土.安床.作灶.入殓.移柩.安葬.破土.结网.取渔.畋猎.",
			"j": "作梁.造庙.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0319": {
			"y": "祭祀.开光.塑绘.订盟.纳采.合帐.冠笄.拆卸.动土.起基.上梁.入宅.安香.开市.立券.纳财.沐浴.求嗣.出火.竖柱.安门.",
			"j": "造庙.嫁娶.伐木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0320": {
			"y": "祭祀.沐浴.捕捉.栽种.",
			"j": "嫁娶.入宅.移徙.作灶.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0322": {
			"y": "订盟.纳采.冠笄.拆卸.修造.动土.安床.入殓.除服.成服.移柩.安葬.破土.启攒.造仓.",
			"j": "作灶.开光.嫁娶.开市.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0323": {
			"y": "祈福.开光.塑绘.酬神.订盟.纳采.裁衣.安床.开市.立券.入殓.除服.成服.移柩.启攒.安葬.立碑.赴任.会亲友.出行.交易.竖柱.",
			"j": "作灶.掘井.动土.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0324": {
			"y": "祭祀.扫舍.塞穴.",
			"j": "栽种.作灶.安葬.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0325": {
			"y": "开光.塑绘.裁衣.冠笄.伐木.拆卸.竖柱.上梁.开仓.会亲友.安机械.造仓.造屋.交易.解除.开市.立券.纳财.",
			"j": "出行.嫁娶.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0326": {
			"y": "冠笄.入殓.除服.成服.移柩.平治道涂.修饰垣墙.",
			"j": "造屋.作灶.治病.探病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0327": {
			"y": "祭祀.嫁娶.祈福.纳采.裁衣.合帐.安床.入宅.安香.入殓.移柩.安葬.谢土.修造.安碓硙.求嗣.会亲友.挂匾.交易.立券.纳财.造仓.放水.",
			"j": "栽种.伐木.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0328": {
			"y": "祭祀.祈福.斋醮.订盟.纳采.裁衣.合帐.拆卸.修造.动土.上梁.起基.移柩.安葬.谢土.沐浴.扫舍.开柱眼.伐木.出火.",
			"j": "安床.开市.立券.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0329": {
			"y": "破屋.坏垣.求医.治病.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0330": {
			"y": "祭祀.动土.上梁.订盟.纳采.嫁娶.安机械.拆卸.安床.入宅.安香.入殓.移柩.破土.安葬.立碑.谢土.赴任.出行.移徙.祈福.求嗣.解除.造仓.进人口.",
			"j": "开光.出货财.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0331": {
			"y": "祭祀.开光.塑绘.纳采.裁衣.拆卸.安床.起基.动土.竖柱.上梁.移徙.入宅.安香.开市.立券.挂匾.沐浴.出行.求嗣.安门.",
			"j": "嫁娶.栽种.伐木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0201": {
			"y": "解除.扫舍.祭祀.教牛马.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0121": {
			"y": "沐浴.解除.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.移徙.入宅.除服.成服.移柩.破土.启攒.安葬.扫舍.修坟.伐木.纳财.交易.立券.",
			"j": "作灶.祭祀.上梁.出行.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0202": {
			"y": "开市.交易.立券.挂匾.开光.解除.伐木.作梁.出火.入宅.移徙.安床.拆卸.动土.上梁.栽种.纳畜.安葬.",
			"j": "嫁娶.祭祀.出行.置产.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0203": {
			"y": "开市.交易.立券.纳财.开池.补垣.嫁娶.纳采.纳畜.取渔.安床.",
			"j": "修造.上梁.入宅.祈福.探病.掘井.动土.安门.安葬.作灶.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0204": {
			"y": "会亲友.求嗣.理发.冠笄.结网.捕捉.开光.理发.",
			"j": "开市.动土.安葬.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0205": {
			"y": "祭祀.平治道涂.余事勿取.",
			"j": "嫁娶.祈福.掘井.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0206": {
			"y": "祈福.求嗣.斋醮.纳采.嫁娶.伐木.修造.动土.移徙.入宅.造庙.安机械.开市.入殓.除服.成服.移柩.安葬.破土.谢土.",
			"j": "置产.造屋.合脊.开光.探病.安门.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0207": {
			"y": "入学.习艺.出行.纳采.订盟.嫁娶.会亲友.进人口.牧养.捕捉.入殓.移柩.安葬.启攒.",
			"j": "开光.开市.入宅.动土.造屋.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0208": {
			"y": "祭祀.沐浴.求医.治病.扫舍.破屋.坏垣.解除.余事勿取.",
			"j": "入宅.开市.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0209": {
			"y": "祭祀.冠笄.嫁娶.拆卸.修造.动土.起基.上梁.造屋.入宅.开市.开池.塞穴.入殓.除服.成服.移柩.安葬.破土.",
			"j": "安床.栽种.治病.作灶.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0210": {
			"y": "祭祀.结网.入殓.除服.成服.移柩.安葬.破土.",
			"j": "余事勿取.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0211": {
			"y": "塑绘.开光.祈福.求嗣.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.起基.安门.安床.移徙.造仓.结网.纳畜.",
			"j": "伐木.作灶.安葬.取渔.入宅.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0212": {
			"y": "祭祀.沐浴.开光.塑绘.祈福.求嗣.订盟.纳采.冠笄.裁衣.嫁娶.动土.除服.成服.移柩.破土.启攒.出行.安碓硙.放水.开市.立券.交易.",
			"j": "安葬.上梁.入宅.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0213": {
			"y": "祭祀.祈福.求嗣.酬神.裁衣.安床.立券.交易.入殓.除服.成服.移柩.谢土.启攒.",
			"j": "出行.嫁娶.入宅.动土.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0214": {
			"y": "裁衣.合帐.入殓.除服.成服.会亲友.纳财.",
			"j": "祭祀.祈福.移徙.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0215": {
			"y": "祭祀.斋醮.裁衣.合帐.冠笄.订盟.纳采.嫁娶.入宅.安香.谢土.入殓.移柩.破土.立碑.安香.会亲友.出行.祈福.求嗣.立碑.上梁.放水.",
			"j": "掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0216": {
			"y": "安床.合帐.入宅.问名.纳采.求嗣.祭祀.开仓.",
			"j": "斋醮.作灶.安床.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0217": {
			"y": "作灶.平治道涂.",
			"j": "祭祀.祈福.安葬.安门.余事勿取.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0218": {
			"y": "塑绘.开光.酬神.斋醮.订盟.纳采.裁衣.合帐.拆卸.动土.上梁.安床.安香.造庙.挂匾.会亲友.进人口.出行.修造.纳财.伐木.放水.出火.纳畜.沐浴.安门.",
			"j": "造屋.栽种.安葬.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0219": {
			"y": "祭祀.祈福.酬神.订盟.纳采.冠笄.裁衣.合帐.嫁娶.安床.移徙.入宅.安香.入殓.移柩.启攒.安葬.解除.取渔.捕捉.伐木.安门.出火.",
			"j": "栽种.动土.开市.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0220": {
			"y": "求医.破屋.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0222": {
			"y": "取渔.入殓.除服.成服.移柩.破土.安葬.立碑.",
			"j": "嫁娶.上梁.入宅.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0223": {
			"y": "祭祀.求嗣.沐浴.酬神.订盟.纳采.裁衣.合帐.冠笄.安机械.安床.造仓.开池.经络.纳财.开市.立券.交易.结网.取渔.纳畜.捕捉.",
			"j": "安葬.作灶.伐木.作梁.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0224": {
			"y": "祭祀.沐浴.祈福.求嗣.斋醮.订盟.纳采.裁衣.冠笄.开市.立券.交易.纳财.沐浴.除服.谢土.出行.移柩.",
			"j": "入殓.安葬.作灶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0225": {
			"y": "祭祀.祈福.求嗣.入殓.启攒.安葬.移柩.",
			"j": "开光.掘井.针灸.出行.嫁娶.入宅.移徙.作灶.动土.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0226": {
			"y": "安床.解除.裁衣.竖柱.上梁.交易.立券.纳财.纳畜.牧养.入殓.移柩.安葬.启攒.",
			"j": "嫁娶.出行.动土.开渠.入宅.祭祀.掘井.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0227": {
			"y": "嫁娶.安床.开光.出行.祭祀.动土.出火.解除.会亲友.开市.交易.立券.挂匾.入宅.移徙.拆卸.破土.启攒.安葬.",
			"j": "掘井.词讼.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0228": {
			"y": "嫁娶.开光.求嗣.会亲友.安床.牧养.塑绘.针灸.",
			"j": "入宅.移徙.出火.分居.安香.作灶.开市.交易.立券.安葬.动土.伐木.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0229": {
			"y": "作灶.解除.平治道涂.",
			"j": "栽种.出行.祈福.行丧.纳畜.安葬.安门.伐木.作梁.牧养.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0230": {
			"y": "作灶.解除.平治道涂.",
			"j": "栽种.出行.祈福.行丧.纳畜.安葬.安门.伐木.作梁.牧养.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0231": {
			"y": "作灶.解除.平治道涂.",
			"j": "栽种.出行.祈福.行丧.纳畜.安葬.安门.伐木.作梁.牧养.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0101": {
			"y": "治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0102": {
			"y": "祭祀.祈福.求嗣.斋醮.开光.入学.订盟.冠笄.伐木.修造.动土.起基.放水.交易.开池.",
			"j": "造桥.安门.理发.造庙.栽种.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0103": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0104": {
			"y": "沐浴.理发.扫舍.",
			"j": "伐木.纳畜.上梁.入宅.作灶.造畜椆栖.嫁娶.安葬.作梁.造船.安门.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0105": {
			"y": "嫁娶.纳采.订盟.问名.祭祀.冠笄.裁衣.会亲友.进人口.纳财.捕捉.作灶.",
			"j": "开市.安床.安葬.修坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0106": {
			"y": "订盟.纳采.会亲友.祭祀.斋醮.沐浴.塑绘.出火.开光.竖柱.上梁.开市.交易.立券.作梁.开柱眼.伐木.架马.安门.安床.拆卸.牧养.造畜椆栖.掘井.",
			"j": "造庙.嫁娶.出行.动土.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0107": {
			"y": "交易.立券.纳财.安床.裁衣.造畜椆栖.安葬.谢土.启攒.除服.成服.修坟.立碑.移柩.入殓.",
			"j": "开光.嫁娶.开市.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0108": {
			"y": "祭祀.解除.教牛马.会亲友.余事勿取.",
			"j": "破土.动土.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0109": {
			"y": "纳采.订盟.移徙.纳财.开市.交易.立券.入宅.会亲友.解除.求医.治病.入学.安床.安门.安香.出火.拆卸.扫舍.入宅.挂匾.开生坟.合寿木.破土.修坟.启攒.入殓.",
			"j": "探病.祭祀.出行.上梁.造屋.谢土.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0110": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求嗣.会亲友.解除.出行.入学.纳财.开市.交易.立券.习艺.经络.安床.开仓.出货财.纳畜.安葬.启攒.修坟.入殓.",
			"j": "入宅.开光.开市.动土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0111": {
			"y": "祭祀.冠笄.嫁娶.会亲友.进人口.裁衣.结网.平治道涂.",
			"j": "移徙.入宅.造庙.作灶.治病.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0112": {
			"y": "祭祀.安碓硙.结网.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0113": {
			"y": "嫁娶.祭祀.沐浴.裁衣.出行.理发.移徙.捕捉.畋猎.放水.入宅.除服.成服.启攒.安葬.移柩.入殓.",
			"j": "造屋.开市.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0114": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "嫁娶.开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0115": {
			"y": "纳采.订盟.祭祀.求嗣.出火.塑绘.裁衣.会亲友.入学.拆卸.扫舍.造仓.挂匾.掘井.开池.结网.栽种.纳畜.破土.修坟.立碑.安葬.入殓.",
			"j": "祈福.嫁娶.造庙.安床.谢土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0116": {
			"y": "入殓.除服.成服.移柩.启攒.安葬.修坟.立碑.",
			"j": "开市.伐木.嫁娶.作梁.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0117": {
			"y": "祭祀.作灶.入殓.除服.余事勿取.",
			"j": "开市.安床.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0118": {
			"y": "塑绘.开光.沐浴.冠笄.会亲友.作灶.放水.造畜椆栖.",
			"j": "嫁娶.入殓.安葬.出行.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0119": {
			"y": "祭祀.沐浴.祈福.斋醮.订盟.纳采.裁衣.拆卸.起基.竖柱.上梁.安床.入殓.除服.成服.移柩.启攒.挂匾.求嗣.出行.合帐.造畜椆栖.",
			"j": "开仓.嫁娶.移徙.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0120": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0122": {
			"y": "出行.嫁娶.订盟.纳采.入殓.安床.启攒.安葬.祭祀.裁衣.会亲友.进人口.",
			"j": "作灶.掘井.谢土.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0123": {
			"y": "修饰垣墙.平治道涂.入殓.移柩.余事勿取.",
			"j": "嫁娶.移徙.入宅.开光.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0124": {
			"y": "会亲友.纳采.进人口.修造.动土.竖柱.上梁.祭祀.开光.塑绘.祈福.斋醮.嫁娶.安床.移徙.入宅.安香.纳畜.",
			"j": "出行.治病.安葬.开市.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0125": {
			"y": "祭祀.会亲友.出行.订盟.纳采.沐浴.修造.动土.祈福.斋醮.嫁娶.拆卸.安床.入殓.移柩.安葬.谢土.赴任.裁衣.竖柱.上梁.伐木.捕捉.栽种.破土.安门.",
			"j": "造屋.开市.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0126": {
			"y": "解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0127": {
			"y": "塑绘.开光.出行.订盟.纳采.除服.成服.嫁娶.纳婿.入殓.移柩.启攒.安葬.立碑.",
			"j": "入宅.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0128": {
			"y": "入殓.除服.成服.移柩.启攒.安葬.立碑.余事勿取.",
			"j": "破土.伐木.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0129": {
			"y": "祭祀.祈福.斋醮.塑绘.开光.除服.成服.入殓.作灶.嫁娶.捕捉.畋猎.纳财.",
			"j": "开仓.造屋.安葬.安床.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0130": {
			"y": "祭祀.出行.沐浴.裁衣.祈福.斋醮.订盟.纳采.嫁娶.安机械.开市.立券.安碓硙.纳畜.",
			"j": "栽种.嫁娶.入殓.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0131": {
			"y": "祭祀.祈福.斋醮.沐浴.安床.安机械.造车器.入殓.移柩.启攒.安葬.立碑.合帐.经络.交易.",
			"j": "作灶.掘井.嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		}
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	window.HuangLi = window.HuangLi || {};
	HuangLi.y2010 = {
		"d1221": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.修造.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1121": {
			"y": "祭祀.沐浴.出行.冠笄.进人口.余事勿取.",
			"j": "嫁娶.动土.安葬.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1201": {
			"y": "解除.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1202": {
			"y": "安床.祭祀.开池.补垣.入殓.移柩.破土.启攒.",
			"j": "入宅.移徙.嫁娶.掘井.作灶.出火.进人口.开市.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1203": {
			"y": "祭祀.沐浴.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1204": {
			"y": "嫁娶.开光.出行.解除.出火.拆卸.修造.进人口.动土.入宅.移徙.栽种.纳畜.掘井.安葬.除服.成服.",
			"j": "置产.安床.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1205": {
			"y": "开光.裁衣.安门.会亲友.安床.结网.理发.",
			"j": "嫁娶.冠笄.出行.祈福.安葬.伐木.入宅.移徙.出火.栽种.动土.上梁.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1206": {
			"y": "嫁娶.开光.出行.出火.拆卸.修造.动土.入宅.移徙.安床.上梁.开市.交易.立券.栽种.",
			"j": "祈福.祭祀.伐木.掘井.作灶.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1207": {
			"y": "祭祀.入殓.移柩.余事勿取.",
			"j": "入宅.修造.动土.破土.安门.上梁.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1208": {
			"y": "塑绘.开光.订盟.纳采.裁衣.冠笄.拆卸.修造.安床.入宅.出火.安葬.谢土.赴任.",
			"j": "掘井.伐木.斋醮.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1209": {
			"y": "祭祀.塑绘.开光.裁衣.冠笄.嫁娶.纳采.拆卸.修造.动土.竖柱.上梁.安床.移徙.入宅.安香.结网.捕捉.畋猎.伐木.进人口.放水.",
			"j": "出行.安葬.修坟.开市.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1210": {
			"y": "祭祀.求医.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1211": {
			"y": "祭祀.祈福.斋醮.出行.冠笄.安机械.移徙.入宅.安香.安床.除服.成服.移柩.启攒.",
			"j": "开光.栽种.治病.安门.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1212": {
			"y": "塑绘.斋醮.出行.拆卸.解除.修造.移徙.造船.入殓.除服.成服.移柩.启攒.修坟.立碑.谢土.",
			"j": "",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1213": {
			"y": "祭祀.沐浴.安床.纳财.畋猎.捕捉.",
			"j": "开市.破土.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1214": {
			"y": "订盟.纳采.祭祀.祈福.修造.动土.上梁.破土.",
			"j": "嫁娶.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1215": {
			"y": "出行.沐浴.理发.补垣.塞穴.",
			"j": "入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1216": {
			"y": "教牛马.余事勿取.",
			"j": "入宅.动土.破土.余事勿取.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1217": {
			"y": "嫁娶.出行.求医.治病.祭祀.祈福.上梁.纳畜.",
			"j": "开市.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1218": {
			"y": "开市.立券.开光.解除.安机械.上梁.启攒.安葬.",
			"j": "嫁娶.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1219": {
			"y": "平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1220": {
			"y": "求嗣.斋醮.塑绘.订盟.纳采.出火.拆卸.修造.动土.造桥.安机械.栽种.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.",
			"j": "开市.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1222": {
			"y": "治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1223": {
			"y": "祭祀.祈福.求嗣.斋醮.开光.入学.订盟.冠笄.伐木.修造.动土.起基.放水.交易.开池.",
			"j": "造桥.安门.理发.造庙.栽种.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1224": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1225": {
			"y": "沐浴.理发.扫舍.",
			"j": "伐木.纳畜.上梁.入宅.作灶.造畜椆栖.嫁娶.安葬.作梁.造船.安门.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d1226": {
			"y": "祭祀.开光.祈福.解除.作梁.动土.安床.掘井.栽种.纳畜.破土.移柩.",
			"j": "嫁娶.出行.赴任.造屋.入殓.入宅.移徙.出火.进人口.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1227": {
			"y": "诸事不宜.作梁.修造.动土.安门.作灶.塞穴.开池.作厕.筑堤.补垣.栽种.",
			"j": "嫁娶.祈福.掘井.行丧.安葬.安床.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1228": {
			"y": "安葬.启攒.移柩.入殓.除服.成服.",
			"j": "余事勿取.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1229": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.",
			"j": "作灶.塑绘.行丧.词讼.伐木.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1230": {
			"y": "理发.开光.解除.拆卸.修造.安葬.开市.交易.立券.挂匾.安床.栽种.",
			"j": "入宅.移徙.作灶.祈福.祭祀.嫁娶.谢土.掘井.造屋.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1231": {
			"y": "祭祀.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1021": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1101": {
			"y": "祭祀.入殓.移柩.开生坟.破土.启攒.安葬.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1102": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1103": {
			"y": "嫁娶.求嗣.纳采.进人口.纳财.结网.纳畜.牧养.会亲友.",
			"j": "上梁.作灶.伐木.出行.安葬.安门.理发.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1104": {
			"y": "嫁娶.祭祀.开市.开光.出行.入宅.移徙.出火.拆卸.修造.安床.",
			"j": "纳畜.伐木.置产.作梁.行丧.安葬.修坟.立碑.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1105": {
			"y": "嫁娶.祭祀.作灶.纳财.",
			"j": "安葬.开市.修坟.立碑.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1106": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.进人口.开市.交易.立券.挂匾.纳财.入宅.移徙.栽种.破土.谢土.",
			"j": "安床.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1107": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.冠笄.出行.理发.拆卸.解除.起基.动土.定磉.安碓硙.开池.掘井.扫舍.除服.成服.移柩.启攒.立碑.谢土.",
			"j": "移徙.入宅.安门.作梁.安葬.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1108": {
			"y": "嫁娶.冠笄.安床.纳采.会亲友.塞穴.捕捉.置产.造畜椆栖.",
			"j": "开光.掘井.安葬.谢土.修坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1109": {
			"y": "祭祀.沐浴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1110": {
			"y": "祭祀.会亲友.嫁娶.沐浴.修造.动土.祈福.开光.塑绘.出行.订盟.纳采.裁衣.入殓.除服.成服.移柩.启攒.赴任.竖柱.上梁.纳财.扫舍.栽种.纳畜.伐木.",
			"j": "入宅.作灶.安床.开仓.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1111": {
			"y": "理发.会亲友.补垣.塞穴.结网.",
			"j": "嫁娶.入宅.安门.移徙.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1112": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.拆卸.修造.动土.起基.安床.移徙.入宅.安香.除服.成服.入殓.移柩.安葬.谢土.赴任.会亲友.进人口.出行.竖柱.上梁.经络.开市.交易.立券.纳财.开仓.",
			"j": "作灶.治病.伐木.作梁.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1113": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.拆卸.修造.动土.起基.安床.移徙.入宅.安香.入殓.移柩.安葬.谢土.赴任.进人口.会亲友.",
			"j": "作灶.治病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1114": {
			"y": "祭祀.塑绘.开光.订盟.纳采.嫁娶.安床.进人口.入殓.除服.成服.移柩.启攒.安葬.立碑.",
			"j": "开市.交易.破土.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1115": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1116": {
			"y": "祭祀.解除.祈福.开光.塑绘.斋醮.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.入殓.除服.成服.移柩.启攒.安床.赴任.出行.移徙.竖柱.上梁.伐木.栽种.破土.安葬.纳畜.",
			"j": "造屋.治病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1117": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.合帐.冠笄.安机械.安床.造畜椆栖.入殓.移柩.启攒.安葬.谢土.除服.成服.会亲友.竖柱.上梁.经络.开市.交易.立券.纳财.纳畜.筑堤.",
			"j": "嫁娶.入宅.治病.赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1118": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1119": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1120": {
			"y": "祈福.斋醮.出行.订盟.纳采.入殓.移柩.破土.安葬.立碑.结网.",
			"j": "入宅.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1122": {
			"y": "祭祀.祈福.斋醮.塑绘.开光.订盟.纳采.裁衣.冠笄.嫁娶.拆卸.入宅.安香.入殓.移柩.理发.安葬.修坟.谢土.赴任.移徙.沐浴.治病.破土.启攒.整手足甲.入学.作梁.",
			"j": "开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1123": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1124": {
			"y": "开市.交易.立券.挂匾.纳财.开光.出行.入宅.移徙.安床.纳畜.入殓.移柩.安葬.",
			"j": "栽种.破土.置产.祭祀.嫁娶.动土.作灶.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1125": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.出行.拆卸.进人口.入宅.移徙.安床.栽种.动土.修造.纳畜.入殓.安葬.立碑.除服.成服.",
			"j": "",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1126": {
			"y": "开光.解除.拆卸.修造.动土.安床.纳畜.安葬.启攒.入殓.",
			"j": "嫁娶.开市.出火.栽种.破土.动土.入宅.移徙.安香.分居.掘井.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1127": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1128": {
			"y": "嫁娶.祭祀.开光.出火.出行.拆卸.修造.动土.解除.开市.交易.立券.挂匾.纳财.入宅.移徙.安床.栽种.纳畜.",
			"j": "探病.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1129": {
			"y": "祭祀.祈福.求嗣.开光.解除.理发.会亲友.栽种.纳畜.牧养.安葬.修坟.立碑.启攒.",
			"j": "入宅.作灶.词讼.移徙.出行.赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1130": {
			"y": "祭祀.沐浴.结网.移柩.入殓.除服.成服.",
			"j": "安床.开市.交易.出货财.安葬.修坟.嫁娶.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0921": {
			"y": "祭祀.沐浴.赴任.出行.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1001": {
			"y": "嫁娶.出行.伐木.拆卸.修造.动土.移徙.安葬.破土.修坟.立碑.",
			"j": "掘井.祈福.安床.开市.入宅.挂匾.开光.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1002": {
			"y": "祭祀.出行.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1003": {
			"y": "嫁娶.祭祀.塑绘.开光.出行.解除.理发.整手足甲.动土.安床.开池.放水.扫舍.",
			"j": "伐木.行丧.作灶.作梁.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1004": {
			"y": "开市.交易.立券.挂匾.开光.出行.入宅.移徙.安床.出火.上梁.",
			"j": "作灶.行丧.理发.乘船.嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1005": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1006": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.开市.交易.立券.挂匾.栽种.纳畜.入殓.安葬.除服.成服.",
			"j": "",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1007": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1008": {
			"y": "祭祀.祈福.求嗣.斋醮.造庙.出火.安机械.会亲友.开市.交易.立券.纳财.习艺.经络.求医.治病.开池.作厕.畋猎.结网.栽种.牧养.安葬.破土.启攒.",
			"j": "开光.嫁娶.掘井.伐木.作梁.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1009": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1010": {
			"y": "会亲友.嫁娶.订盟.纳采.纳婿.拆卸.修造.动土.起基.竖柱.上梁.安床.会亲友.纳财.",
			"j": "出行.祈福.安葬.作灶.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1011": {
			"y": "祭祀.塑绘.开光.祈福.斋醮.出行.订盟.纳采.裁衣.嫁娶.拆卸.修造.安床.入宅.安香.入殓.启攒.安葬.谢土.赴任.会亲友.进人口.出行.移徙.上梁.经络.开市.交易.立券.纳财.",
			"j": "开仓.冠笄.伐木.作梁.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1012": {
			"y": "祭祀.作灶.入殓.除服.成服.畋猎.",
			"j": "栽种.动土.安葬.开市.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1013": {
			"y": "祭祀.祈福.斋醮.沐浴.竖柱.订盟.纳采.嫁娶.拆卸.入宅.移柩.启攒.谢土.赴任.出火.纳畜.",
			"j": "作灶.入殓.安葬.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1014": {
			"y": "嫁娶.祭祀.安机械.入殓.破土.安葬.",
			"j": "动土.上梁.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1131": {
			"y": "解除.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1015": {
			"y": "作灶.造畜椆栖.",
			"j": "行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1016": {
			"y": "沐浴.理发.入学.习艺.进人口.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1017": {
			"y": "开光.针灸.会亲友.启攒.安葬.",
			"j": "开市.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1018": {
			"y": "祭祀.结网.造畜椆栖.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1019": {
			"y": "入殓.除服.成服.移柩.破土.启攒.安葬.",
			"j": "移徙.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1020": {
			"y": "嫁娶.订盟.纳采.出行.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "开市.赴任.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1022": {
			"y": "订盟.纳采.会亲友.安机械.纳财.牧养.",
			"j": "祈福.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1023": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "斋醮.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1024": {
			"y": "祭祀.塞穴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1025": {
			"y": "祭祀.祈福.求嗣.开光.开市.出行.解除.动土.起基.置产.栽种.",
			"j": "嫁娶.作灶.修坟.安门.入宅.立碑.安葬.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1026": {
			"y": "祭祀.解除.裁衣.理发.安床.作灶.造畜椆栖.放水.筑堤.补垣.塞穴.整手足甲.扫舍.",
			"j": "嫁娶.开光.会亲友.掘井.安门.栽种.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d1027": {
			"y": "祭祀.出行.裁衣.冠笄.会亲友.造畜椆栖.嫁娶.竖柱.上梁.移徙.纳财.纳畜.",
			"j": "动土.伐木.作梁.行丧.安葬.开生坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1028": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.移徙.伐木.安床.纳畜.出火.拆卸.",
			"j": "安葬.修坟.作灶.破土.造庙.动土.嫁娶.纳采.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1029": {
			"y": "开市.交易.立券.纳财.会亲友.开光.理发.入殓.移柩.安葬.启攒.",
			"j": "嫁娶.作灶.出火.出行.入宅.移徙.安床.祈福.上梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1030": {
			"y": "造畜椆栖.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1031": {
			"y": "入殓.破土.安葬.启攒.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0821": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.移徙.入宅.启攒.安葬.",
			"j": "动土.破土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0901": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0902": {
			"y": "祭祀.结网.入殓.移柩.启攒.安葬.移柩.除服.成服.合寿木.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0903": {
			"y": "嫁娶.出火.拆卸.祭祀.祈福.开光.伐木.动土.开市.交易.立券.入宅.移徙.安床.纳畜.入殓.安葬.",
			"j": "栽种.作灶.针灸.出行.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0904": {
			"y": "祭祀.开光.解除.移徙.裁衣.开市.立券.祈福.求嗣.进人口.交易.纳财.纳畜.",
			"j": "动土.破土.理发.出行.入宅.分居.安香.出火.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0905": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.安床.栽种.移柩.进人口.会亲友.除服.成服.",
			"j": "造屋.入殓.安葬.伐木.入宅.移徙.置产.纳畜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0906": {
			"y": "祭祀.动土.筑堤.开池.会亲友.塞穴.入殓.移柩.破土.安葬.",
			"j": "开光.出行.修造.上梁.入宅.安门.作灶.裁衣.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0907": {
			"y": "祭祀.裁衣.安门.纳财.扫舍.出行.进人口.作灶.纳畜.造畜椆栖.",
			"j": "安床.动土.安葬.开生坟.合寿木.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0908": {
			"y": "祭祀.祈福.求嗣.出行.沐浴.交易.扫舍.教牛马.",
			"j": "动土.作灶.行丧.安葬.修坟.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0909": {
			"y": "出行.解除.纳采.冠笄.雕刻.修造.动土.起基.上梁.合脊.安床.移徙.入宅.开市.栽种.作厕.",
			"j": "造庙.安门.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0910": {
			"y": "祭祀.沐浴.解除.理发.冠笄.安机械.作灶.造仓.开市.开池.作厕.补垣.塞穴.断蚁.结网.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0911": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0912": {
			"y": "祭祀.会亲友.纳采.嫁娶.开光.塑绘.斋醮.安香.开市.立券.除服.成服.入殓.移柩.安葬.赴任.进人口.出行.裁衣.修造.动土.上梁.经络.交易.",
			"j": "入宅.伐木.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0913": {
			"y": "祭祀.冠笄.会亲友.拆卸.起基.除服.成服.移柩.启攒.安葬.沐浴.捕捉.开光.塑绘.",
			"j": "作灶.祭祀.入宅.嫁娶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0914": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "移徙.入宅.出行.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0915": {
			"y": "祭祀.塑绘.开光.出行.解除.订盟.嫁娶.拆卸.起基.安床.入宅.开市.入殓.除服.成服.移柩.破土.谢土.挂匾.开柱眼.交易.",
			"j": "造桥.冠笄.造屋.掘井.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0916": {
			"y": "祭祀.赴任.动土.上梁.开光.塑绘.冠笄.拆卸.起基.安床.开市.立券.赴任.经络.",
			"j": "定磉.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0917": {
			"y": "祭祀.裁衣.冠笄.嫁娶.纳婿.会亲友.除服.成服.移柩.捕捉.进人口.入殓.",
			"j": "移徙.入宅.作灶.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0918": {
			"y": "祭祀.诸事不宜.",
			"j": "入殓.安葬.开市.交易.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0919": {
			"y": "祭祀.裁衣.冠笄.嫁娶.安机械.拆卸.动土.起基.移徙.入宅.入殓.启攒.安葬.造仓.经络.",
			"j": "安床.开光.开市.交易.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0920": {
			"y": "祭祀.出行.成服.除服.沐浴.入殓.",
			"j": "动土.冠笄.移徙.入宅.开市.竖柱.上梁.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0922": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0923": {
			"y": "沐浴.入殓.移柩.除服.成服.破土.平治道涂.",
			"j": "嫁娶.移徙.入宅.开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0924": {
			"y": "嫁娶.祭祀.祈福.求嗣.沐浴.出火.出行.拆卸.修造.动土.进人口.开市.交易.立券.入宅.移徙.安床.栽种.纳畜.入殓.安葬.启攒.除服.成服.",
			"j": "",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0925": {
			"y": "开光.解除.起基.动土.拆卸.上梁.立碑.修坟.安葬.破土.启攒.移柩.",
			"j": "嫁娶.出行.安床.作灶.祭祀.入宅.移徙.出火.进人口.置产.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0926": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0927": {
			"y": "嫁娶.祈福.求嗣.出行.出火.拆卸.修造.动土.上梁.开光.进人口.开市.交易.立券.挂匾.安床.入宅.移徙.栽种.伐木.入殓.破土.除服.成服.",
			"j": "",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0928": {
			"y": "开市.交易.立券.挂匾.祭祀.开光.进人口.入宅.安床.出火.拆卸.修造.动土.栽种.",
			"j": "嫁娶.立碑.出行.伐木.安葬.行丧.移徙.纳畜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0929": {
			"y": "祭祀.理发.会亲友.进人口.嫁娶.针灸.入殓.移柩.",
			"j": "探病.开渠.安葬.伐木.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0930": {
			"y": "祭祀.立碑.修坟.启攒.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0931": {
			"y": "嫁娶.出行.伐木.拆卸.修造.动土.移徙.安葬.破土.修坟.立碑.",
			"j": "掘井.祈福.安床.开市.入宅.挂匾.开光.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0801": {
			"y": "祭祀.出行.交易.割蜜.造畜椆栖.",
			"j": "嫁娶.作灶.安葬.动土.词讼.作梁.伐木.掘井.破土.移徙.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0721": {
			"y": "嫁娶.祭祀.祈福.斋醮.治病.破土.安葬.",
			"j": "开市.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0802": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.拆卸.修造.动土.进人口.开市.交易.立券.挂匾.入宅.移徙.栽种.纳畜.入殓.启攒.除服.成服.",
			"j": "",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0803": {
			"y": "嫁娶.开光.解除.安床.牧养.理发.开市.入殓.启攒.移柩.安葬.扫舍.",
			"j": "作灶.动土.上梁.栽种.入宅.移徙.修造.祈福.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0804": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0805": {
			"y": "祭祀.祈福.求嗣.开光.伐木.出火.拆卸.入宅.安床.修造.动土.上梁.挂匾.纳畜.",
			"j": "嫁娶.栽种.行丧.理发.修坟.行丧.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0806": {
			"y": "解除.祭祀.理发.入殓.安葬.破土.",
			"j": "嫁娶.开市.出火.作灶.置产.斋醮.入宅.移徙.安门.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0807": {
			"y": "祭祀.捕捉.畋猎.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.启攒.",
			"j": "嫁娶.纳采.订盟.开市.入宅.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0808": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "行丧.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0809": {
			"y": "祈福.斋醮.出行.冠笄.嫁娶.雕刻.开柱眼.入宅.造桥.开市.交易.立券.纳财.入殓.除服.成服.移柩.破土.安葬.启攒.",
			"j": "动土.破土.订盟.安床.开池.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0810": {
			"y": "祈福.求嗣.解除.订盟.纳采.动土.起基.放水.造仓.开市.纳畜.牧养.开生坟.入殓.除服.成服.移柩.破土.安葬.",
			"j": "",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0811": {
			"y": "塑绘.开光.解除.订盟.纳采.嫁娶.出火.修造.动土.移徙.入宅.拆卸.起基.安门.分居.开市.交易.立券.纳财.纳畜.牧养.",
			"j": "",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0812": {
			"y": "祈福.出行.订盟.纳采.嫁娶.裁衣.动土.安床.放水.开市.掘井.交易.立券.栽种.开渠.除服.成服.移柩.破土.",
			"j": "",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0813": {
			"y": "嫁娶.祭祀.祈福.斋醮.作灶.移徙.入宅.",
			"j": "动土.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0814": {
			"y": "嫁娶.出行.纳畜.祭祀.入殓.启攒.安葬.",
			"j": "作灶.动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0815": {
			"y": "订盟.纳采.祭祀.祈福.修造.动土.上梁.破土.安葬.",
			"j": "嫁娶.开市.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0816": {
			"y": "订盟.纳采.出行.会亲友.修造.上梁.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0817": {
			"y": "沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.祈福.余事勿取.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0818": {
			"y": "嫁娶.祭祀.祈福.斋醮.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0819": {
			"y": "捕捉.结网.入殓.破土.安葬.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0820": {
			"y": "沐浴.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0822": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求医.治病.动土.移徙.入宅.破土.安葬.",
			"j": "开光.针灸.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0823": {
			"y": "订盟.纳采.祭祀.祈福.安机械.作灶.纳畜.",
			"j": "动土.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0824": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.动土.安床.掘井.破土.启攒.",
			"j": "入宅.作梁.安门.伐木.修造.上梁.入殓.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0825": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.修造.移徙.动土.安床.入殓.破土.安葬.启攒.",
			"j": "造屋.开光.理发.造船.掘井.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0826": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.上梁.造屋.移徙.安门.纳财.牧养.纳畜.安葬.启攒.入殓.",
			"j": "破土.置产.掘井.动土.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0827": {
			"y": "祭祀.解除.沐浴.理发.整手足甲.入殓.移柩.破土.安葬.扫舍.",
			"j": "嫁娶.会亲友.进人口.出行.入宅.移徙.赴任.作灶.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0828": {
			"y": "塑绘.开光.进人口.纳畜.补垣.塞穴.栽种.牧养.",
			"j": "嫁娶.纳财.祈福.安葬.修造.开市.交易.立券.动土.上梁.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0829": {
			"y": "祭祀.作灶.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0830": {
			"y": "祭祀.求嗣.开光.出行.伐木.作梁.出火.解除.拆卸.进人口.修造.动土.起基.安床.栽种.纳畜.入殓.破土.安葬.除服.成服.",
			"j": "嫁娶.移徙.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0831": {
			"y": "祭祀.求医.捕捉.栽种.塞穴.入殓.破土.安葬.移柩.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0701": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0621": {
			"y": "开光.求医.治病.动土.上梁.入殓.破土.安葬.",
			"j": "嫁娶.开光.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0702": {
			"y": "开市.交易.立券.纳财.开池.作厕.结网.祭祀.修造.动土.安床.放水.经络.破土.",
			"j": "嫁娶.造桥.词讼.移徙.安门.作灶.栽种.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0703": {
			"y": "开市.交易.立券.纳财.栽种.安床.拆卸.修造.动土.上梁.入殓.安葬.破土.除服.成服.",
			"j": "嫁娶.出火.伐木.祭祀.入宅.移徙.纳畜.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0704": {
			"y": "祭祀.作灶.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0705": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0706": {
			"y": "修造.动土.起基.安门.安床.栽种.筑堤.补垣.造畜椆栖.",
			"j": "嫁娶.掘井.入宅.移徙.出火.出行.行丧.安葬.开光.理发.进人口.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0707": {
			"y": "祭祀.塞穴.结网.畋猎.余事勿取.",
			"j": "移徙.开市.入宅.嫁娶.开光.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0708": {
			"y": "开市.纳财.祭祀.塑绘.安机械.冠笄.会亲友.裁衣.开仓.经络.纳畜.造畜椆栖.教牛马.牧养.",
			"j": "动土.破土.安葬.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0709": {
			"y": "移徙.入宅.治病.会亲友.祭祀.祈福.斋醮.安香.移徙.嫁娶.造屋.起基.",
			"j": "开市.斋醮.安床.出行.经络.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0710": {
			"y": "塑绘.出行.冠笄.嫁娶.进人口.裁衣.纳婿.造畜椆栖.交易.立券.牧养.开生坟.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0711": {
			"y": "祭祀.冠笄.嫁娶.捕捉.结网.畋猎.取渔.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0712": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0713": {
			"y": "纳采.祭祀.祈福.解除.动土.破土.安葬.",
			"j": "嫁娶.移徙.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0714": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0715": {
			"y": "嫁娶.纳采.开市.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "祭祀.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0716": {
			"y": "嫁娶.纳采.开市.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "赴任.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0717": {
			"y": "祭祀.作灶.纳财.捕捉.",
			"j": "开市.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0718": {
			"y": "嫁娶.开市.立券.祭祀.祈福.动土.移徙.入宅.",
			"j": "造庙.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0719": {
			"y": "补垣.塞穴.结网.入殓.除服.成服.移柩.安葬.启攒.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0720": {
			"y": "嫁娶.纳采.出行.祭祀.祈福.解除.移徙.入宅.",
			"j": "动土.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0722": {
			"y": "嫁娶.出行.开市.安床.入殓.启攒.安葬.",
			"j": "祈福.动土.破土.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0723": {
			"y": "嫁娶.祭祀.裁衣.结网.冠笄.沐浴.",
			"j": "开仓.出货财.置产.安葬.动土.破土.掘井.栽种.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0724": {
			"y": "入宅.移徙.安床.开光.祈福.求嗣.进人口.开市.交易.立券.出火.拆卸.修造.动土.",
			"j": "嫁娶.破土.置产.栽种.安葬.修坟.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0725": {
			"y": "祭祀.解除.沐浴.整手足甲.入殓.移柩.破土.启攒.安葬.",
			"j": "嫁娶.入宅.移徙.作灶.开市.交易.安门.栽种.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0726": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0727": {
			"y": "嫁娶.开光.出行.理发.作梁.出火.拆卸.修造.开市.交易.立券.挂匾.动土.入宅.移徙.安床.栽种.",
			"j": "伐木.祭祀.纳畜.祭祀.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0728": {
			"y": "嫁娶.开光.出行.祈福.求嗣.解除.拆卸.动土.修造.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.纳畜.入殓.移柩.安葬.",
			"j": "",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0729": {
			"y": "祭祀.作灶.纳财.栽种.纳畜.进人口.",
			"j": "安葬.经络.修坟.破土.开市.安床.启攒.立碑.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0730": {
			"y": "祭祀.祈福.求嗣.开光.开市.牧养.理发.",
			"j": "嫁娶.出行.安葬.入殓.入宅.作灶.冠笄.上梁.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0731": {
			"y": "祭祀.入殓.破土.除服.成服.移柩.启攒.安葬.谢土.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0601": {
			"y": "开市.交易.立券.挂匾.开光.出行.拆卸.进人口.入宅.移柩.动土.安门.上梁.栽种.破土.修坟.安葬.",
			"j": "嫁娶.安床.探病.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0602": {
			"y": "进人口.会亲友.",
			"j": "塞穴.上梁.动土.伐木.安葬.词讼.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0603": {
			"y": "沐浴.平治道涂.扫舍.入殓.破土.安葬.除服.成服.",
			"j": "嫁娶.移徙.伐木.作梁.安床.祭祀.祈福.造屋.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0521": {
			"y": "订盟.纳采.会亲友.安床.作灶.造畜椆栖.",
			"j": "开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0604": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.出行.拆卸.动土.解除.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.安门.上梁.安葬.破土.谢土.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0605": {
			"y": "祭祀.祈福.求嗣.开光.解除.合帐.冠笄.伐木.架马.作梁.修造.进人口.嫁娶.裁衣.合帐.安床.动土.起基.上梁.竖柱.放水.会亲友.",
			"j": "",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0606": {
			"y": "祭祀.沐浴.捕捉.结网.畋猎.取渔.余事勿取.",
			"j": "开市.交易.嫁娶.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0607": {
			"y": "破屋.坏垣.求医.治病.畋猎.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0608": {
			"y": "嫁娶.出行.安机械.祭祀.塑绘.开光.治病.经络.安床.结网.塞穴.破土.入殓.",
			"j": "开市.安门.掘井.作灶.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0609": {
			"y": "订盟.纳采.会亲友.进人口.雕刻.拆卸.修造.动土.起基.开市.栽种.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.",
			"j": "",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0610": {
			"y": "祭祀.捕捉.取渔.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0611": {
			"y": "嫁娶.纳采.祭祀.祈福.求医.治病.出行.动土.移徙.入宅.",
			"j": "开市.安门.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0612": {
			"y": "裁衣.作灶.移徙.入宅.纳畜.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0613": {
			"y": "祭祀.入殓.移柩.启攒.安葬.",
			"j": "上梁.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0614": {
			"y": "订盟.纳采.出行.祈福.斋醮.安床.会亲友.",
			"j": "移徙.入宅.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0615": {
			"y": "嫁娶.纳采.出行.求医.治病.开市.移徙.入宅.启攒.安葬.",
			"j": "动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0616": {
			"y": "嫁娶.祭祀.沐浴.扫舍.修饰垣墙.",
			"j": "行丧.安葬.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0617": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0618": {
			"y": "订盟.纳采.出行.祭祀.祈福.修造.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0619": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0620": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.入殓.破土.安葬.",
			"j": "开光.开市.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0622": {
			"y": "祭祀.栽种.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0623": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.出行.解除.伐木.入宅.移徙.安床.出火.拆卸.修造.上梁.栽种.移柩.",
			"j": "安葬.开市.交易.立券.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0624": {
			"y": "求嗣.嫁娶.纳采.合帐.裁衣.冠笄.伐木.作梁.修造.动土.起基.竖柱.上梁.安门.作灶.筑堤.造畜椆栖.",
			"j": "安葬.出行.祈福.栽种.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0625": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0626": {
			"y": "嫁娶.祭祀.祈福.出火.开光.求嗣.出行.拆卸.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.动土.",
			"j": "安葬.行丧.伐木.作梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0627": {
			"y": "开光.求嗣.出行.解除.伐木.出火.拆卸.修造.上梁.起基.入宅.移徙.开市.交易.立券.栽种.牧养.入殓.安葬.除服.成服.",
			"j": "置产.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0628": {
			"y": "祭祀.理发.修饰垣墙.平治道涂.沐浴.整手足甲.扫舍.",
			"j": "出行.安门.修造.嫁娶.上梁.入宅.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0629": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.出火.拆卸.动土.修造.进人口.入宅.移徙.安床.挂匾.交易.立券.栽种.纳畜.入殓.破土.启攒.安葬.",
			"j": "",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0630": {
			"y": "祭祀.祈福.求嗣.开光.出行.伐木.出火.拆卸.修造.动土.起基.安床.入宅.移徙.",
			"j": "嫁娶.开市.交易.行丧.安葬.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0631": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0501": {
			"y": "塞穴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0502": {
			"y": "祭祀.祈福.求嗣.开光.解除.纳采.冠笄.出火.拆卸.进人口.安床.动土.上梁.造庙.掘井.开池.入殓.移柩.安葬.破土.",
			"j": "",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0421": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0503": {
			"y": "解除.破屋.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0504": {
			"y": "嫁娶.祈福.求嗣.开光.出行.解除.拆卸.出火.开市.立券.交易.入宅.移徙.安床.动土.破土.谢土.",
			"j": "祭祀.入殓.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0505": {
			"y": "嫁娶.祭祀.祈福.求嗣.斋醮.订盟.纳采.解除.出行.动土.破土.习艺.针灸.理发.会亲友.起基.修造.动土.竖柱.定磉.安床.拆卸.纳畜.牧养.放水.破土.除服.成服.修坟.立碑.",
			"j": "开市.入宅.探病.出火.造屋.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0506": {
			"y": "余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0507": {
			"y": "塞穴.断蚁.结网.余事勿取.",
			"j": "破土.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0508": {
			"y": "开光.出行.纳采.嫁娶.伐木.架马.出火.拆卸.移徙.入宅.造庙.造桥.造船.造畜椆栖.开市.入殓.除服.成服.移柩.安葬.",
			"j": "",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0509": {
			"y": "进人口.牧养.置产.塞穴.结网.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0510": {
			"y": "开光.出行.嫁娶.",
			"j": "会亲友.进人口.修造.动土.起基.移徙.开市.纳畜.入殓.除服.成服.移柩.破土.安葬.修坟.立碑.会亲友.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0511": {
			"y": "嫁娶.纳采.出行.祭祀.祈福.开市.动土.移徙.入宅.破土.安葬.",
			"j": "安门.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0512": {
			"y": "嫁娶.纳采.求医.治病.修造.动土.移徙.入宅.破土.安葬.",
			"j": "开市.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0513": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0514": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "祈福.斋醮.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0515": {
			"y": "纳采.祭祀.祈福.开市.求医.治病.动土.纳畜.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0516": {
			"y": "嫁娶.纳采.出行.移徙.入宅.",
			"j": "动土.破土.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0517": {
			"y": "订盟.纳采.祭祀.动土.破土.交易.立券.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0518": {
			"y": "嫁娶.裁衣.祭祀.出行.安床.作灶.移徙.入宅.破土.安葬.",
			"j": "赴任.捕捉.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0519": {
			"y": "塞穴.结网.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0520": {
			"y": "嫁娶.订盟.纳采.出行.祭祀.祈福.斋醮.动土.上梁.破土.安葬.",
			"j": "移徙.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0522": {
			"y": "沐浴.平治道涂.扫舍.入殓.移柩.破土.启攒.安葬.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0523": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.动土.上梁.进人口.入宅.移徙.安床.安门.开市.交易.立券.挂匾.栽种.破土.安葬.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0524": {
			"y": "祭祀.开光.出行.解除.塑绘.裁衣.入殓.移柩.破土.启攒.安葬.除服.成服.",
			"j": "嫁娶.上梁.修造.拆卸.架马.入宅.伐木.动土.出火.开柱眼.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0525": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0526": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.拆卸.动土.上梁.出火.进人口.入宅.移徙.安床.栽种.纳畜.牧养.竖柱.安门.修造.解除.会亲友.",
			"j": "",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0527": {
			"y": "开市.交易.立券.祭祀.祈福.开光.伐木.进人口.安床.拆卸.修造.动土.栽种.破土.移柩.安葬.",
			"j": "入宅.移徙.理发.出火.嫁娶.出行.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0528": {
			"y": "结网.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0529": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.开市.交易.立券.安床.出行.拆卸.",
			"j": "纳畜.入宅.移徙.安葬.探病.伐木.上梁.安门.入殓.动土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0530": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.修造.动土.入宅.移徙.安床.作灶.塞穴.栽种.破土.安葬.",
			"j": "开光.掘井.开仓.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0531": {
			"y": "解除.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0401": {
			"y": "开光.塑绘.求嗣.纳采.裁衣.合帐.冠笄.安机械.作梁.开柱眼.安门.安床.造仓.祭祀.会亲友.祈福.经络.纳财.开市.立券.交易.入学.求嗣.理发.架马.",
			"j": "出行.斋醮.安葬.嫁娶.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0402": {
			"y": "祭祀.嫁娶.纳婿.安葬.",
			"j": "栽种.造屋.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0321": {
			"y": "冠笄.入殓.除服.成服.移柩.平治道涂.修饰垣墙.",
			"j": "造屋.作灶.治病.探病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0403": {
			"y": "祭祀.会亲友.订盟.裁衣.合帐.安机械.拆卸.上梁.安门.入殓.除服.成服.移柩.启攒.安葬.立碑.开光.塑绘.入学.出行.起基.定磉.放水.移徙.入宅.竖柱.立券.经络.",
			"j": "伐木.作梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0404": {
			"y": "祭祀.开光.塑绘.祈福.斋醮.裁衣.合帐.冠笄.嫁娶.拆卸.动土.移徙.入宅.入殓.移柩.安葬.谢土.求嗣.入学.理发.伐木.架马.作梁.出火.修造.起基.定磉.放水.赴任.",
			"j": "入宅.安门.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0405": {
			"y": "祭祀.祈福.开光.求嗣.斋醮.纳采.订盟.求医.治病.起基.定磉.造船.取渔.解除.安葬.启攒.谢土.入殓.",
			"j": "开市.动土.掘井.开池.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0406": {
			"y": "祭祀.沐浴.破屋.坏垣.求医.治病.解除.余事勿取.",
			"j": "嫁娶.开市.交易.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0407": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0408": {
			"y": "祭祀.塑绘.开光.订盟.纳采.冠笄.裁衣.安机械.拆卸.修造.动土.安床.经络.开市.",
			"j": "出火.入宅.安葬.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0409": {
			"y": "祭祀.余事勿取.",
			"j": "造庙.嫁娶.安床.余事勿取.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0410": {
			"y": "订盟.纳采.嫁娶.进人口.会亲友.交易.立券.动土.除服.谢土.移柩.破土.启攒.赴任.出行.开市.纳财.栽种.",
			"j": "入殓.安葬.入宅.安床.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0411": {
			"y": "祭祀.祈福.裁衣.合帐.安床.入殓.除服.成服.移柩.破土.启攒.安葬.谢土.立碑.造畜椆栖.",
			"j": "掘井.安门.嫁娶.纳采.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0412": {
			"y": "祭祀.进人口.嫁娶.安床.解除.冠笄.出行.裁衣.扫舍.",
			"j": "掘井.动土.破土.安葬.开光.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0413": {
			"y": "纳采.开光.求医.治病.动土.上梁.移徙.入宅.",
			"j": "嫁娶.开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0414": {
			"y": "祭祀.会亲友.开市.安床.启攒.安葬.",
			"j": "嫁娶.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0415": {
			"y": "祭祀.作灶.掘井.平治道涂.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0416": {
			"y": "祭祀.斋醮.开市.动土.入殓.破土.安葬.",
			"j": "嫁娶.移徙.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0417": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.移徙.求医.",
			"j": "开市.动土.破土.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0418": {
			"y": "祭祀.求医.治病.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0419": {
			"y": "沐浴.结网.取渔.",
			"j": "嫁娶.入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0420": {
			"y": "",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0422": {
			"y": "嫁娶.开光.出行.出火.拆卸.进人口.开市.立券.交易.挂匾.入宅.移徙.安床.栽种.",
			"j": "祈福.入殓.祭祀.作灶.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0423": {
			"y": "嫁娶.出行.合帐.冠笄.安床.除服.成服.作灶.交易.立券.入殓.移柩.破土.安葬.",
			"j": "词讼.开光.开市.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0424": {
			"y": "出行.修饰垣墙.造畜椆栖.教牛马.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0425": {
			"y": "祭祀.祈福.开光.求嗣.解除.伐木.出火.入宅.移徙.安床.拆卸.修造.动土.造畜椆栖.",
			"j": "嫁娶.纳财.安葬.出行.开市.立券.作灶.栽种.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0426": {
			"y": "纳采.嫁娶.开光.出行.理发.会亲友.开市.安床.栽种.牧养.入殓.移柩.启攒.",
			"j": "谢土.祈福.上梁.作灶.斋醮.修造.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0427": {
			"y": "祭祀.平治道涂.解除.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0428": {
			"y": "祭祀.祈福.开光.解除.动土.纳财.交易.纳畜.扫舍.",
			"j": "进人口.出行.嫁娶.置产.安床.赴任.安葬.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0429": {
			"y": "祭祀.祈福.求嗣.开光.解除.出火.拆卸.入宅.安床.修造.安门.纳畜.启攒.安葬.",
			"j": "动土.破土.纳财.掘井.挂匾.开市.伐木.交易.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0430": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0301": {
			"y": "结网.入殓.除服.成服.移柩.安葬.破土.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0431": {
			"y": "塞穴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0302": {
			"y": "移徙.祭祀.开光.祈福.出行.解除.进人口.雇庸.安床.动土.起基.上梁.安门.解除.",
			"j": "嫁娶.安葬.破土.作梁.纳畜.牧养.行丧.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0221": {
			"y": "安床.解除.裁衣.竖柱.上梁.交易.立券.纳财.纳畜.牧养.入殓.移柩.安葬.启攒.",
			"j": "嫁娶.出行.动土.开渠.入宅.祭祀.掘井.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0303": {
			"y": "嫁娶.开光.祈福.求嗣.解除.动土.安床.栽种.开池.掘井.祭祀.破土.启攒.",
			"j": "入宅.作灶.伐木.安葬.出火.出行.纳畜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0304": {
			"y": "祭祀.合帐.裁衣.经络.伐木.作梁.安床.作灶.入殓.安葬.启攒.移柩.",
			"j": "词讼.出火.入宅.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0305": {
			"y": "裁衣.伐木.作梁.纳财.交易.立券.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0306": {
			"y": "祭祀.会亲友.立券.交易.裁衣.合帐.嫁娶.冠笄.进人口.",
			"j": "栽种.动土.安葬.掘井.修坟.探病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0307": {
			"y": "扫舍.塞穴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0308": {
			"y": "塑绘.开光.订盟.纳采.裁衣.合帐.冠笄.安机械.会亲友.纳财.开市.立券.交易.安床.竖柱.上梁.结网.栽种.解除.经络.",
			"j": "作灶.出行.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0309": {
			"y": "祭祀.嫁娶.纳婿.除服.成服.入殓.移柩.",
			"j": "动土.作灶.入宅.开光.安床.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0310": {
			"y": "祈福.求嗣.开光.塑绘.斋醮.订盟.纳采.嫁娶.拆卸.安床.入宅.安香.移柩.修坟.安葬.谢土.栽种.解除.冠笄.裁衣.移徙.修造.动土.竖柱.放水.启攒.立碑.",
			"j": "赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0311": {
			"y": "祭祀.解除.入殓.除服.成服.移柩.启攒.安葬.修坟.立碑.谢土.沐浴.扫舍.捕捉.取渔.结网.畋猎.理发.",
			"j": "安床.嫁娶.作灶.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0312": {
			"y": "破屋.坏垣.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0313": {
			"y": "祭祀.出行.订盟.纳采.裁衣.合帐.冠笄.进人口.动土.安床.作灶.入殓.移柩.安葬.破土.结网.取渔.畋猎.",
			"j": "作梁.造庙.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0314": {
			"y": "祭祀.开光.塑绘.订盟.纳采.合帐.冠笄.拆卸.动土.起基.上梁.入宅.安香.开市.立券.纳财.沐浴.求嗣.出火.竖柱.安门.",
			"j": "造庙.嫁娶.伐木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0315": {
			"y": "祭祀.沐浴.捕捉.栽种.",
			"j": "嫁娶.入宅.移徙.作灶.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0316": {
			"y": "祭祀.开光.塑绘.酬神.斋醮.订盟.纳采.嫁娶.裁衣.动土.起基.出火.拆卸.移徙.入宅.安香.修造.竖柱.上梁.纳畜.牧养.祈福.求嗣.解除.伐木.定磉.造屋.安门.",
			"j": "栽种.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0317": {
			"y": "订盟.纳采.冠笄.拆卸.修造.动土.安床.入殓.除服.成服.移柩.安葬.破土.启攒.造仓.",
			"j": "作灶.开光.嫁娶.开市.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0318": {
			"y": "祈福.开光.塑绘.酬神.订盟.纳采.裁衣.安床.开市.立券.入殓.除服.成服.移柩.启攒.安葬.立碑.赴任.会亲友.出行.交易.竖柱.",
			"j": "作灶.掘井.动土.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0319": {
			"y": "祭祀.扫舍.塞穴.",
			"j": "栽种.作灶.安葬.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0320": {
			"y": "开光.塑绘.裁衣.冠笄.伐木.拆卸.竖柱.上梁.开仓.会亲友.安机械.造仓.造屋.交易.解除.开市.立券.纳财.",
			"j": "出行.嫁娶.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0322": {
			"y": "祭祀.嫁娶.祈福.纳采.裁衣.合帐.安床.入宅.安香.入殓.移柩.安葬.谢土.修造.安碓硙.求嗣.会亲友.挂匾.交易.立券.纳财.造仓.放水.",
			"j": "栽种.伐木.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0323": {
			"y": "祭祀.祈福.斋醮.订盟.纳采.裁衣.合帐.拆卸.修造.动土.上梁.起基.移柩.安葬.谢土.沐浴.扫舍.开柱眼.伐木.出火.",
			"j": "安床.开市.立券.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0324": {
			"y": "破屋.坏垣.求医.治病.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0325": {
			"y": "祭祀.动土.上梁.订盟.纳采.嫁娶.安机械.拆卸.安床.入宅.安香.入殓.移柩.破土.安葬.立碑.谢土.赴任.出行.移徙.祈福.求嗣.解除.造仓.进人口.",
			"j": "开光.出货财.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0326": {
			"y": "祭祀.开光.塑绘.纳采.裁衣.拆卸.安床.起基.动土.竖柱.上梁.移徙.入宅.安香.开市.立券.挂匾.沐浴.出行.求嗣.安门.",
			"j": "嫁娶.栽种.伐木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0327": {
			"y": "裁衣.合帐.冠笄.嫁娶.纳婿.安床.入殓.纳财.",
			"j": "作灶.开市.安葬.作梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0328": {
			"y": "祭祀.订盟.纳采.修造.动土.祈福.塑绘.斋醮.沐浴.拆卸.起基.入宅.安香.造庙.移柩.谢土.除服.成服.入学.习艺.出行.竖柱.上梁.掘井.求嗣.解除.伐木.",
			"j": "作灶.安葬.开市.造屋.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0329": {
			"y": "订盟.纳采.裁衣.合帐.冠笄.安机械.拆卸.安床.入殓.除服.成服.移柩.破土.启攒.安葬.修坟.立碑.经络.交易.立券.纳财.筑堤.造仓.补垣.塞穴.纳畜.伐木.架马.",
			"j": "祭祀.开光.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0330": {
			"y": "祭祀.出行.嫁娶.冠笄.安床.入殓.移柩.安葬.",
			"j": "掘井.动土.作灶.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0331": {
			"y": "塞穴.诸事不宜.",
			"j": "安门.作灶.安葬.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0201": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.入宅.移徙.安床.修造.动土.进人口.",
			"j": "掘井.安葬.栽种.出行.作灶.开市.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0121": {
			"y": "解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0202": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0203": {
			"y": "嫁娶.开市.交易.立券.开光.出行.出火.拆卸.修造.入宅.移徙.动土.破土.移柩.安葬.启攒.除服.成服.",
			"j": "安床.伐木.祈福.纳畜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0204": {
			"y": "祭祀.冠笄.嫁娶.拆卸.修造.动土.起基.上梁.造屋.入宅.开市.开池.塞穴.入殓.除服.成服.移柩.安葬.破土.",
			"j": "安床.栽种.治病.作灶.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0205": {
			"y": "祭祀.结网.入殓.除服.成服.移柩.安葬.破土.",
			"j": "余事勿取.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0206": {
			"y": "塑绘.开光.祈福.求嗣.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.起基.安门.安床.移徙.造仓.结网.纳畜.",
			"j": "伐木.作灶.安葬.取渔.入宅.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0207": {
			"y": "祭祀.沐浴.开光.塑绘.祈福.求嗣.订盟.纳采.冠笄.裁衣.嫁娶.动土.除服.成服.移柩.破土.启攒.出行.安碓硙.放水.开市.立券.交易.",
			"j": "安葬.上梁.入宅.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0208": {
			"y": "祭祀.祈福.求嗣.酬神.裁衣.安床.立券.交易.入殓.除服.成服.移柩.谢土.启攒.",
			"j": "出行.嫁娶.入宅.动土.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0209": {
			"y": "裁衣.合帐.入殓.除服.成服.会亲友.纳财.",
			"j": "祭祀.祈福.移徙.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0210": {
			"y": "祭祀.斋醮.裁衣.合帐.冠笄.订盟.纳采.嫁娶.入宅.安香.谢土.入殓.移柩.破土.立碑.安香.会亲友.出行.祈福.求嗣.立碑.上梁.放水.",
			"j": "掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0211": {
			"y": "安床.合帐.入宅.问名.纳采.求嗣.祭祀.开仓.",
			"j": "斋醮.作灶.安床.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0212": {
			"y": "作灶.平治道涂.",
			"j": "祭祀.祈福.安葬.安门.余事勿取.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0213": {
			"y": "塑绘.开光.酬神.斋醮.订盟.纳采.裁衣.合帐.拆卸.动土.上梁.安床.安香.造庙.挂匾.会亲友.进人口.出行.修造.纳财.伐木.放水.出火.纳畜.沐浴.安门.",
			"j": "造屋.栽种.安葬.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0214": {
			"y": "祭祀.祈福.酬神.订盟.纳采.冠笄.裁衣.合帐.嫁娶.安床.移徙.入宅.安香.入殓.移柩.启攒.安葬.解除.取渔.捕捉.伐木.安门.出火.",
			"j": "栽种.动土.开市.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0215": {
			"y": "求医.破屋.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0216": {
			"y": "祈福.求嗣.斋醮.塑绘.开光.订盟.纳采.嫁娶.动土.入宅.安香.移柩.安葬.谢土.出行.沐浴.修造.竖柱.上梁.纳财.破土.解除.安门.放水.",
			"j": "作灶.安床.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0217": {
			"y": "取渔.入殓.除服.成服.移柩.破土.安葬.立碑.",
			"j": "嫁娶.上梁.入宅.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0218": {
			"y": "祭祀.求嗣.沐浴.酬神.订盟.纳采.裁衣.合帐.冠笄.安机械.安床.造仓.开池.经络.纳财.开市.立券.交易.结网.取渔.纳畜.捕捉.",
			"j": "安葬.作灶.伐木.作梁.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0219": {
			"y": "祭祀.沐浴.祈福.求嗣.斋醮.订盟.纳采.裁衣.冠笄.开市.立券.交易.纳财.沐浴.除服.谢土.出行.移柩.",
			"j": "入殓.安葬.作灶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0220": {
			"y": "祭祀.祈福.求嗣.入殓.启攒.安葬.移柩.",
			"j": "开光.掘井.针灸.出行.嫁娶.入宅.移徙.作灶.动土.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0222": {
			"y": "嫁娶.安床.开光.出行.祭祀.动土.出火.解除.会亲友.开市.交易.立券.挂匾.入宅.移徙.拆卸.破土.启攒.安葬.",
			"j": "掘井.词讼.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0223": {
			"y": "嫁娶.开光.求嗣.会亲友.安床.牧养.塑绘.针灸.",
			"j": "入宅.移徙.出火.分居.安香.作灶.开市.交易.立券.安葬.动土.伐木.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0224": {
			"y": "作灶.解除.平治道涂.",
			"j": "栽种.出行.祈福.行丧.纳畜.安葬.安门.伐木.作梁.牧养.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0225": {
			"y": "解除.沐浴.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0226": {
			"y": "嫁娶.祭祀.祈福.出行.解除.出火.拆卸.动土.入宅.移徙.安床.上梁.栽种.纳畜.破土.启攒.安葬.",
			"j": "开市.立券.理发.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0227": {
			"y": "祭祀.解除.治病.破屋.坏垣.扫舍.",
			"j": "余事勿取.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0228": {
			"y": "祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.入宅.移徙.上梁.挂匾.开池.入殓.安葬.破土.启攒.",
			"j": "嫁娶.作灶.安床.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0230": {
			"y": "结网.入殓.除服.成服.移柩.安葬.破土.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0101": {
			"y": "诸事不宜.作梁.修造.动土.安门.作灶.塞穴.开池.作厕.筑堤.补垣.栽种.",
			"j": "嫁娶.祈福.掘井.行丧.安葬.安床.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0231": {
			"y": "结网.入殓.除服.成服.移柩.安葬.破土.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0102": {
			"y": "安葬.启攒.移柩.入殓.除服.成服.",
			"j": "余事勿取.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0103": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.",
			"j": "作灶.塑绘.行丧.词讼.伐木.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0229": {
			"y": "结网.入殓.除服.成服.移柩.安葬.破土.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0104": {
			"y": "理发.开光.解除.拆卸.修造.安葬.开市.交易.立券.挂匾.安床.栽种.",
			"j": "入宅.移徙.作灶.祈福.祭祀.嫁娶.谢土.掘井.造屋.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0105": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求嗣.会亲友.解除.出行.入学.纳财.开市.交易.立券.习艺.经络.安床.开仓.出货财.纳畜.安葬.启攒.修坟.入殓.",
			"j": "入宅.开光.开市.动土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0106": {
			"y": "祭祀.冠笄.嫁娶.会亲友.进人口.裁衣.结网.平治道涂.",
			"j": "移徙.入宅.造庙.作灶.治病.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0107": {
			"y": "祭祀.安碓硙.结网.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0108": {
			"y": "嫁娶.祭祀.沐浴.裁衣.出行.理发.移徙.捕捉.畋猎.放水.入宅.除服.成服.启攒.安葬.移柩.入殓.",
			"j": "造屋.开市.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0109": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "嫁娶.开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0110": {
			"y": "纳采.订盟.祭祀.求嗣.出火.塑绘.裁衣.会亲友.入学.拆卸.扫舍.造仓.挂匾.掘井.开池.结网.栽种.纳畜.破土.修坟.立碑.安葬.入殓.",
			"j": "祈福.嫁娶.造庙.安床.谢土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0111": {
			"y": "入殓.除服.成服.移柩.启攒.安葬.修坟.立碑.",
			"j": "开市.伐木.嫁娶.作梁.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0112": {
			"y": "祭祀.作灶.入殓.除服.余事勿取.",
			"j": "开市.安床.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0113": {
			"y": "塑绘.开光.沐浴.冠笄.会亲友.作灶.放水.造畜椆栖.",
			"j": "嫁娶.入殓.安葬.出行.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0114": {
			"y": "祭祀.沐浴.祈福.斋醮.订盟.纳采.裁衣.拆卸.起基.竖柱.上梁.安床.入殓.除服.成服.移柩.启攒.挂匾.求嗣.出行.合帐.造畜椆栖.",
			"j": "开仓.嫁娶.移徙.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0115": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0116": {
			"y": "沐浴.解除.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.移徙.入宅.除服.成服.移柩.破土.启攒.安葬.扫舍.修坟.伐木.纳财.交易.立券.",
			"j": "作灶.祭祀.上梁.出行.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0117": {
			"y": "出行.嫁娶.订盟.纳采.入殓.安床.启攒.安葬.祭祀.裁衣.会亲友.进人口.",
			"j": "作灶.掘井.谢土.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0118": {
			"y": "修饰垣墙.平治道涂.入殓.移柩.余事勿取.",
			"j": "嫁娶.移徙.入宅.开光.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0119": {
			"y": "会亲友.纳采.进人口.修造.动土.竖柱.上梁.祭祀.开光.塑绘.祈福.斋醮.嫁娶.安床.移徙.入宅.安香.纳畜.",
			"j": "出行.治病.安葬.开市.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0120": {
			"y": "祭祀.会亲友.出行.订盟.纳采.沐浴.修造.动土.祈福.斋醮.嫁娶.拆卸.安床.入殓.移柩.安葬.谢土.赴任.裁衣.竖柱.上梁.伐木.捕捉.栽种.破土.安门.",
			"j": "造屋.开市.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0122": {
			"y": "塑绘.开光.出行.订盟.纳采.除服.成服.嫁娶.纳婿.入殓.移柩.启攒.安葬.立碑.",
			"j": "入宅.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0123": {
			"y": "入殓.除服.成服.移柩.启攒.安葬.立碑.余事勿取.",
			"j": "破土.伐木.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0124": {
			"y": "祭祀.祈福.斋醮.塑绘.开光.除服.成服.入殓.作灶.嫁娶.捕捉.畋猎.纳财.",
			"j": "开仓.造屋.安葬.安床.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0125": {
			"y": "祭祀.出行.沐浴.裁衣.祈福.斋醮.订盟.纳采.嫁娶.安机械.开市.立券.安碓硙.纳畜.",
			"j": "栽种.嫁娶.入殓.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0126": {
			"y": "祭祀.祈福.斋醮.沐浴.安床.安机械.造车器.入殓.移柩.启攒.安葬.立碑.合帐.经络.交易.",
			"j": "作灶.掘井.嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0127": {
			"y": "解除.扫舍.祭祀.教牛马.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0128": {
			"y": "开市.交易.立券.挂匾.开光.解除.伐木.作梁.出火.入宅.移徙.安床.拆卸.动土.上梁.栽种.纳畜.安葬.",
			"j": "嫁娶.祭祀.出行.置产.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0129": {
			"y": "开市.交易.立券.纳财.开池.补垣.嫁娶.纳采.纳畜.取渔.安床.",
			"j": "修造.上梁.入宅.祈福.探病.掘井.动土.安门.安葬.作灶.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0130": {
			"y": "祭祀.解除.修饰垣墙.平治道涂.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0131": {
			"y": "嫁娶.祭祀.祈福.求嗣.动土.会亲友.起基.造仓.纳畜.牧养.作厕.进人口.",
			"j": "掘井.安葬.栽种.出行.作灶.开市.入宅.安门.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		}
	};


/***/ },
/* 14 */
/***/ function(module, exports) {

	window.HuangLi = window.HuangLi || {};
	HuangLi.y2011 = {
		"d1221": {
			"y": "祭祀.开光.祈福.解除.作梁.动土.安床.掘井.栽种.纳畜.破土.移柩.",
			"j": "嫁娶.出行.赴任.造屋.入殓.入宅.移徙.出火.进人口.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1121": {
			"y": "开光.解除.拆卸.修造.动土.安床.纳畜.安葬.启攒.入殓.",
			"j": "嫁娶.开市.出火.栽种.破土.动土.入宅.移徙.安香.分居.掘井.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1201": {
			"y": "嫁娶.开光.出行.出火.拆卸.修造.动土.入宅.移徙.安床.上梁.开市.交易.立券.栽种.",
			"j": "祈福.祭祀.伐木.掘井.作灶.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1202": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.出行.拆卸.开市.交易.立券.挂匾.伐木.入宅.移徙.安床.安葬.",
			"j": "栽种.掘井.置产.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1203": {
			"y": "祭祀.理发.针灸.解除.进人口.整手足甲.",
			"j": "嫁娶.动土.造船.开池.掘井.出行.修造.入宅.上梁.移徙.安葬.破土.作灶.开市.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1204": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1205": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.雕刻.移徙.开市.入宅.出行.动土.会亲友.入学.修造.动土.起基.安门.安床.造庙.解除.纳财.开池.造畜椆栖.牧养.牧养.",
			"j": "上梁.开仓.出货财.造屋.造船.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1206": {
			"y": "祭祀.祈福.求嗣.开光.解除.伐木.拆卸.修造.栽种.纳畜.安葬.修坟.立碑.",
			"j": "嫁娶.进人口.入宅.移徙.出火.出行.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1207": {
			"y": "塑绘.斋醮.出行.拆卸.解除.修造.移徙.造船.入殓.除服.成服.移柩.启攒.修坟.立碑.谢土.",
			"j": "",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1208": {
			"y": "祭祀.沐浴.安床.纳财.畋猎.捕捉.",
			"j": "开市.破土.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1209": {
			"y": "订盟.纳采.祭祀.祈福.修造.动土.上梁.破土.",
			"j": "嫁娶.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1210": {
			"y": "出行.沐浴.理发.补垣.塞穴.",
			"j": "入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1211": {
			"y": "教牛马.余事勿取.",
			"j": "入宅.动土.破土.余事勿取.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1212": {
			"y": "嫁娶.出行.求医.治病.祭祀.祈福.上梁.纳畜.",
			"j": "开市.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1213": {
			"y": "开市.立券.开光.解除.安机械.上梁.启攒.安葬.",
			"j": "嫁娶.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1214": {
			"y": "平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1215": {
			"y": "求嗣.斋醮.塑绘.订盟.纳采.出火.拆卸.修造.动土.造桥.安机械.栽种.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.",
			"j": "开市.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1216": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.修造.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1217": {
			"y": "治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1218": {
			"y": "祭祀.祈福.求嗣.斋醮.开光.入学.订盟.冠笄.伐木.修造.动土.起基.放水.交易.开池.",
			"j": "造桥.安门.理发.造庙.栽种.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1219": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1220": {
			"y": "沐浴.理发.扫舍.",
			"j": "伐木.纳畜.上梁.入宅.作灶.造畜椆栖.嫁娶.安葬.作梁.造船.安门.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d1222": {
			"y": "诸事不宜.作梁.修造.动土.安门.作灶.塞穴.开池.作厕.筑堤.补垣.栽种.",
			"j": "嫁娶.祈福.掘井.行丧.安葬.安床.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1223": {
			"y": "安葬.启攒.移柩.入殓.除服.成服.",
			"j": "余事勿取.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1224": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.",
			"j": "作灶.塑绘.行丧.词讼.伐木.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1225": {
			"y": "理发.开光.解除.拆卸.修造.安葬.开市.交易.立券.挂匾.安床.栽种.",
			"j": "入宅.移徙.作灶.祈福.祭祀.嫁娶.谢土.掘井.造屋.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1226": {
			"y": "祭祀.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1227": {
			"y": "入宅.安床.开光.祭祀.出火.拆卸.动土.挂匾.入殓.破土.安葬.纳畜.",
			"j": "嫁娶.开市.作灶.置产.作梁.伐木.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1228": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1229": {
			"y": "破屋.坏垣.祭祀.沐浴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1230": {
			"y": "安床.祭祀.祈福.求嗣.冠笄.伐木.架马.动土.开池.作厕.结网.入殓.除服.成服.",
			"j": "安门.栽种.作灶.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1231": {
			"y": "解除.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1101": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.进人口.开市.交易.立券.挂匾.纳财.入宅.移徙.栽种.破土.谢土.",
			"j": "安床.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1103": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.上梁.入宅.移徙.安床.安门.纳财.纳畜.造畜椆栖.",
			"j": "伐木.行丧.破土.嫁娶.安葬.开渠.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1102": {
			"y": "嫁娶.祭祀.祈福.求嗣.动土.安床.扫舍.入殓.移柩.破土.启攒.安葬.作灶.整手足甲.补垣.除服.成服.",
			"j": "开光.栽种.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1104": {
			"y": "祭祀.开光.出行.解除.理发.伐木.出火.拆卸.上梁.合脊.安床.造畜椆栖.",
			"j": "嫁娶.安葬.行丧.词讼.造桥.作灶.破土.动土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1105": {
			"y": "纳采.订盟.会亲友.沐浴.理发.裁衣.冠笄.安床.除服.成服.启攒.移柩.安葬.会亲友.开生坟.",
			"j": "开市.入宅.出行.嫁娶.修坟.祈福.动土.入宅.安门.谢土.上梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1106": {
			"y": "解除.祭祀.修饰垣墙.平治道涂.造畜椆栖.余事勿取.",
			"j": "嫁娶.开市.交易.入宅.入学.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1107": {
			"y": "入殓.破土.启攒.安葬.除服.成服.余事勿取.",
			"j": "开市.入宅.祭祀.置产.补垣.塞穴.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1108": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.拆卸.修造.动土.起基.安床.移徙.入宅.安香.入殓.移柩.安葬.谢土.赴任.进人口.会亲友.",
			"j": "作灶.治病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1109": {
			"y": "祭祀.塑绘.开光.订盟.纳采.嫁娶.安床.进人口.入殓.除服.成服.移柩.启攒.安葬.立碑.",
			"j": "开市.交易.破土.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1110": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1111": {
			"y": "祭祀.解除.祈福.开光.塑绘.斋醮.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.入殓.除服.成服.移柩.启攒.安床.赴任.出行.移徙.竖柱.上梁.伐木.栽种.破土.安葬.纳畜.",
			"j": "造屋.治病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1112": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.合帐.冠笄.安机械.安床.造畜椆栖.入殓.移柩.启攒.安葬.谢土.除服.成服.会亲友.竖柱.上梁.经络.开市.交易.立券.纳财.纳畜.筑堤.",
			"j": "嫁娶.入宅.治病.赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1113": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1114": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1115": {
			"y": "祈福.斋醮.出行.订盟.纳采.入殓.移柩.破土.安葬.立碑.结网.",
			"j": "入宅.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1116": {
			"y": "祭祀.沐浴.出行.冠笄.进人口.余事勿取.",
			"j": "嫁娶.动土.安葬.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1117": {
			"y": "祭祀.祈福.斋醮.塑绘.开光.订盟.纳采.裁衣.冠笄.嫁娶.拆卸.入宅.安香.入殓.移柩.理发.安葬.修坟.谢土.赴任.移徙.沐浴.治病.破土.启攒.整手足甲.入学.作梁.",
			"j": "开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1118": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1119": {
			"y": "开市.交易.立券.挂匾.纳财.开光.出行.入宅.移徙.安床.纳畜.入殓.移柩.安葬.",
			"j": "栽种.破土.置产.祭祀.嫁娶.动土.作灶.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1120": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.出行.拆卸.进人口.入宅.移徙.安床.栽种.动土.修造.纳畜.入殓.安葬.立碑.除服.成服.",
			"j": "",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1122": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1123": {
			"y": "嫁娶.祭祀.开光.出火.出行.拆卸.修造.动土.解除.开市.交易.立券.挂匾.纳财.入宅.移徙.安床.栽种.纳畜.",
			"j": "探病.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1124": {
			"y": "祭祀.祈福.求嗣.开光.解除.理发.会亲友.栽种.纳畜.牧养.安葬.修坟.立碑.启攒.",
			"j": "入宅.作灶.词讼.移徙.出行.赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1126": {
			"y": "解除.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1125": {
			"y": "祭祀.沐浴.结网.移柩.入殓.除服.成服.",
			"j": "安床.开市.交易.出货财.安葬.修坟.嫁娶.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1127": {
			"y": "安床.祭祀.开池.补垣.入殓.移柩.破土.启攒.",
			"j": "入宅.移徙.嫁娶.掘井.作灶.出火.进人口.开市.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1128": {
			"y": "祭祀.沐浴.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1129": {
			"y": "嫁娶.开光.出行.解除.出火.拆卸.修造.进人口.动土.入宅.移徙.栽种.纳畜.掘井.安葬.除服.成服.",
			"j": "置产.安床.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1130": {
			"y": "开光.裁衣.安门.会亲友.安床.结网.理发.",
			"j": "嫁娶.冠笄.出行.祈福.安葬.伐木.入宅.移徙.出火.栽种.动土.上梁.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1131": {
			"y": "嫁娶.开光.出行.出火.拆卸.修造.动土.入宅.移徙.安床.上梁.开市.交易.立券.栽种.",
			"j": "祈福.祭祀.伐木.掘井.作灶.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1001": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.开市.交易.立券.挂匾.栽种.纳畜.入殓.安葬.除服.成服.",
			"j": "",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1003": {
			"y": "祭祀.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1002": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1005": {
			"y": "开市.交易.立券.纳财.挂匾.栽种.祭祀.祈福.开光.拆卸.动土.安床.",
			"j": "嫁娶.破土.进人口.出行.入宅.移徙.出火.纳畜.词讼.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1004": {
			"y": "嫁娶.纳采.订盟.祭祀.开光.出行.理发.作梁.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.移徙.拆卸.挂匾.栽种.纳畜.破土.安葬.入殓.除服.成服.",
			"j": "开市.掘井.开渠.造桥.造船.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1006": {
			"y": "嫁娶.祭祀.理发.进人口.作灶.移柩.冠笄.会亲友.",
			"j": "开仓.出货财.伐木.纳畜.开市.上梁.造屋.破土.启攒.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1007": {
			"y": "祭祀.修坟.除服.成服.启攒.移柩.余事勿取.",
			"j": "开市.入宅.嫁娶.动土.破土.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1008": {
			"y": "祭祀.祈福.斋醮.沐浴.竖柱.订盟.纳采.嫁娶.拆卸.入宅.移柩.启攒.谢土.赴任.出火.纳畜.",
			"j": "作灶.入殓.安葬.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1010": {
			"y": "作灶.造畜椆栖.",
			"j": "行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1009": {
			"y": "嫁娶.祭祀.安机械.入殓.破土.安葬.",
			"j": "动土.上梁.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1011": {
			"y": "沐浴.理发.入学.习艺.进人口.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1012": {
			"y": "开光.针灸.会亲友.启攒.安葬.",
			"j": "开市.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1013": {
			"y": "祭祀.结网.造畜椆栖.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1015": {
			"y": "嫁娶.订盟.纳采.出行.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "开市.赴任.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1014": {
			"y": "入殓.除服.成服.移柩.破土.启攒.安葬.",
			"j": "移徙.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1016": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1017": {
			"y": "订盟.纳采.会亲友.安机械.纳财.牧养.",
			"j": "祈福.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1018": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "斋醮.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1019": {
			"y": "祭祀.塞穴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1020": {
			"y": "祭祀.祈福.求嗣.开光.开市.出行.解除.动土.起基.置产.栽种.",
			"j": "嫁娶.作灶.修坟.安门.入宅.立碑.安葬.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1022": {
			"y": "祭祀.出行.裁衣.冠笄.会亲友.造畜椆栖.嫁娶.竖柱.上梁.移徙.纳财.纳畜.",
			"j": "动土.伐木.作梁.行丧.安葬.开生坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1023": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.移徙.伐木.安床.纳畜.出火.拆卸.",
			"j": "安葬.修坟.作灶.破土.造庙.动土.嫁娶.纳采.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1024": {
			"y": "开市.交易.立券.纳财.会亲友.开光.理发.入殓.移柩.安葬.启攒.",
			"j": "嫁娶.作灶.出火.出行.入宅.移徙.安床.祈福.上梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1026": {
			"y": "入殓.破土.安葬.启攒.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1025": {
			"y": "造畜椆栖.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1028": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1027": {
			"y": "祭祀.入殓.移柩.开生坟.破土.启攒.安葬.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1029": {
			"y": "嫁娶.求嗣.纳采.进人口.纳财.结网.纳畜.牧养.会亲友.",
			"j": "上梁.作灶.伐木.出行.安葬.安门.理发.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1030": {
			"y": "嫁娶.祭祀.开市.开光.出行.入宅.移徙.出火.拆卸.修造.安床.",
			"j": "纳畜.伐木.置产.作梁.行丧.安葬.修坟.立碑.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1031": {
			"y": "嫁娶.祭祀.作灶.纳财.",
			"j": "安葬.开市.修坟.立碑.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0901": {
			"y": "祭祀.动土.筑堤.开池.会亲友.塞穴.入殓.移柩.破土.安葬.",
			"j": "开光.出行.修造.上梁.入宅.安门.作灶.裁衣.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1021": {
			"y": "祭祀.解除.裁衣.理发.安床.作灶.造畜椆栖.放水.筑堤.补垣.塞穴.整手足甲.扫舍.",
			"j": "嫁娶.开光.会亲友.掘井.安门.栽种.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0902": {
			"y": "祭祀.裁衣.安门.纳财.扫舍.出行.进人口.作灶.纳畜.造畜椆栖.",
			"j": "安床.动土.安葬.开生坟.合寿木.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0903": {
			"y": "祭祀.解除.拆卸.修造.动土.起基.上梁.安床.安门.开渠.开池.入殓.破土.启攒.",
			"j": "嫁娶.出行.进人口.作灶.入宅.移徙.栽种.赴任.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0905": {
			"y": "修饰垣墙.平治道涂.祭祀.沐浴.作灶.",
			"j": "嫁娶.词讼.治病.置产.作梁.祈福.安葬.栽种.伐木.安门.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0904": {
			"y": "纳采.订盟.开光.出行.解除.安香.出火.拆卸.入宅.移徙.修造.上梁.安床.栽种.纳畜.会亲友.安机械.经络.",
			"j": "伐木.谢土.行丧.祭祀.作灶.动土.破土.安葬.祈福.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0906": {
			"y": "嫁娶.祭祀.祈福.求嗣.出火.出行.开光.解除.拆卸.修造.进人口.安香.交易.立券.入宅.移徙.安床.动土.破土.谢土.安葬.入殓.除服.成服.",
			"j": "斋醮.开市.开仓.作灶.造船.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0908": {
			"y": "祭祀.冠笄.会亲友.拆卸.起基.除服.成服.移柩.启攒.安葬.沐浴.捕捉.开光.塑绘.",
			"j": "作灶.祭祀.入宅.嫁娶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0907": {
			"y": "破土.安葬.移柩.入殓.祭祀.捕捉.除服.成服.余事勿取.",
			"j": "嫁娶.入宅.开市.交易.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0909": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "移徙.入宅.出行.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0912": {
			"y": "祭祀.裁衣.冠笄.嫁娶.纳婿.会亲友.除服.成服.移柩.捕捉.进人口.入殓.",
			"j": "移徙.入宅.作灶.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0910": {
			"y": "祭祀.塑绘.开光.出行.解除.订盟.嫁娶.拆卸.起基.安床.入宅.开市.入殓.除服.成服.移柩.破土.谢土.挂匾.开柱眼.交易.",
			"j": "造桥.冠笄.造屋.掘井.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0913": {
			"y": "祭祀.诸事不宜.",
			"j": "入殓.安葬.开市.交易.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0915": {
			"y": "祭祀.出行.成服.除服.沐浴.入殓.",
			"j": "动土.冠笄.移徙.入宅.开市.竖柱.上梁.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0911": {
			"y": "祭祀.赴任.动土.上梁.开光.塑绘.冠笄.拆卸.起基.安床.开市.立券.赴任.经络.",
			"j": "定磉.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0916": {
			"y": "祭祀.沐浴.赴任.出行.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0914": {
			"y": "祭祀.裁衣.冠笄.嫁娶.安机械.拆卸.动土.起基.移徙.入宅.入殓.启攒.安葬.造仓.经络.",
			"j": "安床.开光.开市.交易.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0917": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0918": {
			"y": "沐浴.入殓.移柩.除服.成服.破土.平治道涂.",
			"j": "嫁娶.移徙.入宅.开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0919": {
			"y": "嫁娶.祭祀.祈福.求嗣.沐浴.出火.出行.拆卸.修造.动土.进人口.开市.交易.立券.入宅.移徙.安床.栽种.纳畜.入殓.安葬.启攒.除服.成服.",
			"j": "",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0922": {
			"y": "嫁娶.祈福.求嗣.出行.出火.拆卸.修造.动土.上梁.开光.进人口.开市.交易.立券.挂匾.安床.入宅.移徙.栽种.伐木.入殓.破土.除服.成服.",
			"j": "",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0920": {
			"y": "开光.解除.起基.动土.拆卸.上梁.立碑.修坟.安葬.破土.启攒.移柩.",
			"j": "嫁娶.出行.安床.作灶.祭祀.入宅.移徙.出火.进人口.置产.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0923": {
			"y": "开市.交易.立券.挂匾.祭祀.开光.进人口.入宅.安床.出火.拆卸.修造.动土.栽种.",
			"j": "嫁娶.立碑.出行.伐木.安葬.行丧.移徙.纳畜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0924": {
			"y": "祭祀.理发.会亲友.进人口.嫁娶.针灸.入殓.移柩.",
			"j": "探病.开渠.安葬.伐木.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0926": {
			"y": "嫁娶.出行.伐木.拆卸.修造.动土.移徙.安葬.破土.修坟.立碑.",
			"j": "掘井.祈福.安床.开市.入宅.挂匾.开光.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0925": {
			"y": "祭祀.立碑.修坟.启攒.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0928": {
			"y": "嫁娶.祭祀.塑绘.开光.出行.解除.理发.整手足甲.动土.安床.开池.放水.扫舍.",
			"j": "伐木.行丧.作灶.作梁.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0927": {
			"y": "祭祀.出行.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0929": {
			"y": "开市.交易.立券.挂匾.开光.出行.入宅.移徙.安床.出火.上梁.",
			"j": "作灶.行丧.理发.乘船.嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0930": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0931": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.开市.交易.立券.挂匾.栽种.纳畜.入殓.安葬.除服.成服.",
			"j": "",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0801": {
			"y": "解除.祭祀.理发.入殓.安葬.破土.",
			"j": "嫁娶.开市.出火.作灶.置产.斋醮.入宅.移徙.安门.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0921": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0802": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0803": {
			"y": "开市.交易.立券.纳财.动土.开光.出行.嫁娶.纳采.订盟.出行.纳财.入学.开仓.出货财.纳畜.牧养.栽种.破土.启攒.安葬.立碑.",
			"j": "入宅.移徙.作灶.祭祀.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0805": {
			"y": "祭祀.冠笄.作灶.交易.纳财.栽种.结网.纳畜.牧养.进人口.",
			"j": "开渠.造船.安床.安葬.破土.出行.修坟.掘井.开市.开生坟.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0804": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.入殓.破土.谢土.安葬.",
			"j": "掘井.伐木.纳畜.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0806": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.纳采.裁衣.冠笄.开光.安床.作梁.修造.动土.作灶.起基.上梁.造屋.纳畜.牧养.",
			"j": "移徙.栽种.出行.行丧.破土.安葬.词讼.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0808": {
			"y": "嫁娶.祭祀.祈福.斋醮.作灶.移徙.入宅.",
			"j": "动土.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0807": {
			"y": "经络.祭祀.沐浴.补垣.塞穴.除服.成服.移柩.入殓.启攒.立碑.",
			"j": "开光.治病.嫁娶.掘井.破土.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0809": {
			"y": "嫁娶.出行.纳畜.祭祀.入殓.启攒.安葬.",
			"j": "作灶.动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0812": {
			"y": "沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.祈福.余事勿取.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0810": {
			"y": "订盟.纳采.祭祀.祈福.修造.动土.上梁.破土.安葬.",
			"j": "嫁娶.开市.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0813": {
			"y": "嫁娶.祭祀.祈福.斋醮.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0815": {
			"y": "沐浴.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0811": {
			"y": "订盟.纳采.出行.会亲友.修造.上梁.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0816": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.移徙.入宅.启攒.安葬.",
			"j": "动土.破土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0814": {
			"y": "捕捉.结网.入殓.破土.安葬.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0817": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求医.治病.动土.移徙.入宅.破土.安葬.",
			"j": "开光.针灸.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0818": {
			"y": "订盟.纳采.祭祀.祈福.安机械.作灶.纳畜.",
			"j": "动土.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0819": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.动土.安床.掘井.破土.启攒.",
			"j": "入宅.作梁.安门.伐木.修造.上梁.入殓.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0822": {
			"y": "祭祀.解除.沐浴.理发.整手足甲.入殓.移柩.破土.安葬.扫舍.",
			"j": "嫁娶.会亲友.进人口.出行.入宅.移徙.赴任.作灶.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0820": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.修造.移徙.动土.安床.入殓.破土.安葬.启攒.",
			"j": "造屋.开光.理发.造船.掘井.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0823": {
			"y": "塑绘.开光.进人口.纳畜.补垣.塞穴.栽种.牧养.",
			"j": "嫁娶.纳财.祈福.安葬.修造.开市.交易.立券.动土.上梁.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0824": {
			"y": "祭祀.作灶.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0826": {
			"y": "祭祀.求医.捕捉.栽种.塞穴.入殓.破土.安葬.移柩.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0825": {
			"y": "祭祀.求嗣.开光.出行.伐木.作梁.出火.解除.拆卸.进人口.修造.动土.起基.安床.栽种.纳畜.入殓.破土.安葬.除服.成服.",
			"j": "嫁娶.移徙.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0828": {
			"y": "祭祀.结网.入殓.移柩.启攒.安葬.移柩.除服.成服.合寿木.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0827": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0829": {
			"y": "嫁娶.出火.拆卸.祭祀.祈福.开光.伐木.动土.开市.交易.立券.入宅.移徙.安床.纳畜.入殓.安葬.",
			"j": "栽种.作灶.针灸.出行.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0830": {
			"y": "祭祀.开光.解除.移徙.裁衣.开市.立券.祈福.求嗣.进人口.交易.纳财.纳畜.",
			"j": "动土.破土.理发.出行.入宅.分居.安香.出火.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0831": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.安床.栽种.移柩.进人口.会亲友.除服.成服.",
			"j": "造屋.入殓.安葬.伐木.入宅.移徙.置产.纳畜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0821": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.上梁.造屋.移徙.安门.纳财.牧养.纳畜.安葬.启攒.入殓.",
			"j": "破土.置产.掘井.动土.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0701": {
			"y": "修造.动土.起基.安门.安床.栽种.筑堤.补垣.造畜椆栖.",
			"j": "嫁娶.掘井.入宅.移徙.出火.出行.行丧.安葬.开光.理发.进人口.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0703": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.开市.纳财.立券.移徙.出行.修造.动土.起基.定磉.竖柱.拆卸.扫舍.放水.安香.安床.造船.开池.掘井.造畜椆栖.栽种.",
			"j": "行丧.安葬.破土.作灶.伐木.斋醮.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0702": {
			"y": "祭祀.教牛马.断蚁.余事勿取.",
			"j": "斋醮.移徙.入宅.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0704": {
			"y": "嫁娶.开光.祭祀.祈福.出行.解除.移徙.入宅.开市.纳财.起基.修造.竖柱.上梁.造屋.作灶.出火.安香.补垣.塞穴.拆卸.放水.扫舍.造仓.造船.栽种.安葬.",
			"j": "纳采.订盟.安床.谢土.破土.动土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0705": {
			"y": "嫁娶.祭祀.理发.作灶.修饰垣墙.平治道涂.整手足甲.沐浴.冠笄.",
			"j": "破土.出行.栽种.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0706": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.进人口.入宅.移徙.安床.交易.立券.挂匾.纳财.入殓.安葬.启攒.除服.成服.",
			"j": "动土.掘井.破土.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0707": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0708": {
			"y": "纳采.祭祀.祈福.解除.动土.破土.安葬.",
			"j": "嫁娶.移徙.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0709": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0712": {
			"y": "祭祀.作灶.纳财.捕捉.",
			"j": "开市.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0710": {
			"y": "嫁娶.纳采.开市.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "祭祀.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0715": {
			"y": "嫁娶.纳采.出行.祭祀.祈福.解除.移徙.入宅.",
			"j": "动土.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0713": {
			"y": "嫁娶.开市.立券.祭祀.祈福.动土.移徙.入宅.",
			"j": "造庙.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0716": {
			"y": "嫁娶.祭祀.祈福.斋醮.治病.破土.安葬.",
			"j": "开市.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0711": {
			"y": "嫁娶.纳采.开市.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "赴任.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0714": {
			"y": "补垣.塞穴.结网.入殓.除服.成服.移柩.安葬.启攒.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0717": {
			"y": "嫁娶.出行.开市.安床.入殓.启攒.安葬.",
			"j": "祈福.动土.破土.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0718": {
			"y": "嫁娶.祭祀.裁衣.结网.冠笄.沐浴.",
			"j": "开仓.出货财.置产.安葬.动土.破土.掘井.栽种.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0719": {
			"y": "入宅.移徙.安床.开光.祈福.求嗣.进人口.开市.交易.立券.出火.拆卸.修造.动土.",
			"j": "嫁娶.破土.置产.栽种.安葬.修坟.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0720": {
			"y": "祭祀.解除.沐浴.整手足甲.入殓.移柩.破土.启攒.安葬.",
			"j": "嫁娶.入宅.移徙.作灶.开市.交易.安门.栽种.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0722": {
			"y": "嫁娶.开光.出行.理发.作梁.出火.拆卸.修造.开市.交易.立券.挂匾.动土.入宅.移徙.安床.栽种.",
			"j": "伐木.祭祀.纳畜.祭祀.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0723": {
			"y": "嫁娶.开光.出行.祈福.求嗣.解除.拆卸.动土.修造.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.纳畜.入殓.移柩.安葬.",
			"j": "",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0724": {
			"y": "祭祀.作灶.纳财.栽种.纳畜.进人口.",
			"j": "安葬.经络.修坟.破土.开市.安床.启攒.立碑.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0725": {
			"y": "祭祀.祈福.求嗣.开光.开市.牧养.理发.",
			"j": "嫁娶.出行.安葬.入殓.入宅.作灶.冠笄.上梁.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0726": {
			"y": "祭祀.入殓.破土.除服.成服.移柩.启攒.安葬.谢土.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0728": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.拆卸.修造.动土.进人口.开市.交易.立券.挂匾.入宅.移徙.栽种.纳畜.入殓.启攒.除服.成服.",
			"j": "",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0727": {
			"y": "祭祀.出行.交易.割蜜.造畜椆栖.",
			"j": "嫁娶.作灶.安葬.动土.词讼.作梁.伐木.掘井.破土.移徙.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0729": {
			"y": "嫁娶.开光.解除.安床.牧养.理发.开市.入殓.启攒.移柩.安葬.扫舍.",
			"j": "作灶.动土.上梁.栽种.入宅.移徙.修造.祈福.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0730": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0731": {
			"y": "祭祀.祈福.求嗣.开光.伐木.出火.拆卸.入宅.安床.修造.动土.上梁.挂匾.纳畜.",
			"j": "嫁娶.栽种.行丧.理发.修坟.行丧.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0721": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0601": {
			"y": "破屋.坏垣.沐浴.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0603": {
			"y": "开市.交易.立券.祭祀.祈福.开光.动土.安床.出行.栽种.纳畜.牧养.竖柱.上梁.解除.破土.",
			"j": "嫁娶.掘井.入宅.移徙.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0602": {
			"y": "纳采.订盟.嫁娶.造车器.祭祀.祈福.求嗣.开光.出火.拆卸.修造.动土.进人口.挂匾.入宅.移徙.安床.栽种.入殓.破土.安葬.除服.成服.",
			"j": "开市.立券.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0604": {
			"y": "解除.出行.纳采.冠笄.竖柱.上梁.移徙.作灶.进人口.入宅.纳畜.牧养.",
			"j": "祭祀.伐木.架马.安床.修造.动土.安葬.修坟.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0605": {
			"y": "祭祀.祈福.求嗣.开光.出行.开市.交易.立券.栽种.安床.纳畜.移徙.起基.动土.定磉.造仓.置产.破土.启攒.修坟.",
			"j": "入宅.移徙.修造.安门.伐木.入殓.安葬.造屋.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0606": {
			"y": "嫁娶.纳采.祭祀.祈福.求医.治病.出行.动土.移徙.入宅.",
			"j": "开市.安门.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0607": {
			"y": "裁衣.作灶.移徙.入宅.纳畜.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0608": {
			"y": "祭祀.入殓.移柩.启攒.安葬.",
			"j": "上梁.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0609": {
			"y": "订盟.纳采.出行.祈福.斋醮.安床.会亲友.",
			"j": "移徙.入宅.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0612": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0610": {
			"y": "嫁娶.纳采.出行.求医.治病.开市.移徙.入宅.启攒.安葬.",
			"j": "动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0615": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.入殓.破土.安葬.",
			"j": "开光.开市.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0613": {
			"y": "订盟.纳采.出行.祭祀.祈福.修造.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0616": {
			"y": "开光.求医.治病.动土.上梁.入殓.破土.安葬.",
			"j": "嫁娶.开光.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0611": {
			"y": "嫁娶.祭祀.沐浴.扫舍.修饰垣墙.",
			"j": "行丧.安葬.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0617": {
			"y": "祭祀.栽种.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0614": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0619": {
			"y": "求嗣.嫁娶.纳采.合帐.裁衣.冠笄.伐木.作梁.修造.动土.起基.竖柱.上梁.安门.作灶.筑堤.造畜椆栖.",
			"j": "安葬.出行.祈福.栽种.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0618": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.出行.解除.伐木.入宅.移徙.安床.出火.拆卸.修造.上梁.栽种.移柩.",
			"j": "安葬.开市.交易.立券.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0620": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0622": {
			"y": "开光.求嗣.出行.解除.伐木.出火.拆卸.修造.上梁.起基.入宅.移徙.开市.交易.立券.栽种.牧养.入殓.安葬.除服.成服.",
			"j": "置产.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0623": {
			"y": "祭祀.理发.修饰垣墙.平治道涂.沐浴.整手足甲.扫舍.",
			"j": "出行.安门.修造.嫁娶.上梁.入宅.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0624": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.出火.拆卸.动土.修造.进人口.入宅.移徙.安床.挂匾.交易.立券.栽种.纳畜.入殓.破土.启攒.安葬.",
			"j": "",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0625": {
			"y": "祭祀.祈福.求嗣.开光.出行.伐木.出火.拆卸.修造.动土.起基.安床.入宅.移徙.",
			"j": "嫁娶.开市.交易.行丧.安葬.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0626": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0628": {
			"y": "开市.交易.立券.纳财.栽种.安床.拆卸.修造.动土.上梁.入殓.安葬.破土.除服.成服.",
			"j": "嫁娶.出火.伐木.祭祀.入宅.移徙.纳畜.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0627": {
			"y": "开市.交易.立券.纳财.开池.作厕.结网.祭祀.修造.动土.安床.放水.经络.破土.",
			"j": "嫁娶.造桥.词讼.移徙.安门.作灶.栽种.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0629": {
			"y": "祭祀.作灶.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0630": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0631": {
			"y": "修造.动土.起基.安门.安床.栽种.筑堤.补垣.造畜椆栖.",
			"j": "嫁娶.掘井.入宅.移徙.出火.出行.行丧.安葬.开光.理发.进人口.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0621": {
			"y": "嫁娶.祭祀.祈福.出火.开光.求嗣.出行.拆卸.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.动土.",
			"j": "安葬.行丧.伐木.作梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0501": {
			"y": "祭祀.出行.教牛马.扫舍.余事勿取.",
			"j": "开光.伐木.安葬.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0503": {
			"y": "开光.出行.交易.塞穴.嫁娶.理发.开市.安床.",
			"j": "祈福.出火.置产.动土.破土.安葬.修造.上梁.置产.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0502": {
			"y": "祭祀.祈福.求嗣.开光.纳采.订盟.解除.栽种.纳畜.牧养.扫舍.进人口.",
			"j": "修坟.造桥.作灶.出行.安葬.造屋.入宅.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0504": {
			"y": "祭祀.作灶.畋猎.结网.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.安床.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0505": {
			"y": "沐浴.祭祀.解除.安葬.破土.谢土.移柩.余事勿取.",
			"j": "斋醮.开光.嫁娶.入宅.上梁.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0507": {
			"y": "嫁娶.纳采.求医.治病.修造.动土.移徙.入宅.破土.安葬.",
			"j": "开市.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0506": {
			"y": "嫁娶.纳采.出行.祭祀.祈福.开市.动土.移徙.入宅.破土.安葬.",
			"j": "安门.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0508": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0509": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "祈福.斋醮.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0512": {
			"y": "订盟.纳采.祭祀.动土.破土.交易.立券.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0510": {
			"y": "纳采.祭祀.祈福.开市.求医.治病.动土.纳畜.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0513": {
			"y": "嫁娶.裁衣.祭祀.出行.安床.作灶.移徙.入宅.破土.安葬.",
			"j": "赴任.捕捉.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0515": {
			"y": "嫁娶.订盟.纳采.出行.祭祀.祈福.斋醮.动土.上梁.破土.安葬.",
			"j": "移徙.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0516": {
			"y": "订盟.纳采.会亲友.安床.作灶.造畜椆栖.",
			"j": "开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0511": {
			"y": "嫁娶.纳采.出行.移徙.入宅.",
			"j": "动土.破土.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0517": {
			"y": "沐浴.平治道涂.扫舍.入殓.移柩.破土.启攒.安葬.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0519": {
			"y": "祭祀.开光.出行.解除.塑绘.裁衣.入殓.移柩.破土.启攒.安葬.除服.成服.",
			"j": "嫁娶.上梁.修造.拆卸.架马.入宅.伐木.动土.出火.开柱眼.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0514": {
			"y": "塞穴.结网.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0518": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.动土.上梁.进人口.入宅.移徙.安床.安门.开市.交易.立券.挂匾.栽种.破土.安葬.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0520": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0522": {
			"y": "开市.交易.立券.祭祀.祈福.开光.伐木.进人口.安床.拆卸.修造.动土.栽种.破土.移柩.安葬.",
			"j": "入宅.移徙.理发.出火.嫁娶.出行.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0523": {
			"y": "结网.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0524": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.开市.交易.立券.安床.出行.拆卸.",
			"j": "纳畜.入宅.移徙.安葬.探病.伐木.上梁.安门.入殓.动土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0525": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.修造.动土.入宅.移徙.安床.作灶.塞穴.栽种.破土.安葬.",
			"j": "开光.掘井.开仓.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0526": {
			"y": "解除.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0528": {
			"y": "进人口.会亲友.",
			"j": "塞穴.上梁.动土.伐木.安葬.词讼.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0527": {
			"y": "开市.交易.立券.挂匾.开光.出行.拆卸.进人口.入宅.移柩.动土.安门.上梁.栽种.破土.修坟.安葬.",
			"j": "嫁娶.安床.探病.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0529": {
			"y": "沐浴.平治道涂.扫舍.入殓.破土.安葬.除服.成服.",
			"j": "嫁娶.移徙.伐木.作梁.安床.祭祀.祈福.造屋.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0531": {
			"y": "祭祀.祈福.求嗣.开光.解除.合帐.冠笄.伐木.架马.作梁.修造.进人口.嫁娶.裁衣.合帐.安床.动土.起基.上梁.竖柱.放水.会亲友.",
			"j": "",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0530": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.出行.拆卸.动土.解除.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.安门.上梁.安葬.破土.谢土.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0521": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.拆卸.动土.上梁.出火.进人口.入宅.移徙.安床.栽种.纳畜.牧养.竖柱.安门.修造.解除.会亲友.",
			"j": "",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0403": {
			"y": "理发.冠笄.嫁娶.进人口.",
			"j": "置产.伐木.纳畜.造畜椆栖.安葬.破土.作梁.作灶.开生坟.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0401": {
			"y": "嫁娶.祭祀.出行.冠笄.立券.交易.进人口.开市.移徙.修造.动土.安床.入殓.移柩.破土.",
			"j": "开光.作灶.斋醮.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0402": {
			"y": "开市.立券.交易.挂匾.祭祀.祈福.开光.入宅.移徙.安床.拆卸.动土.上梁.进人口.",
			"j": "嫁娶.行丧.架马.作梁.理发.牧养.安葬.纳畜.伐木.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0404": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出火.入宅.移徙.安床.拆卸.动土.破土.谢土.",
			"j": "合帐.开市.安葬.入殓.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0405": {
			"y": "订盟.纳采.嫁娶.进人口.会亲友.交易.立券.动土.除服.谢土.移柩.破土.启攒.赴任.出行.开市.纳财.栽种.",
			"j": "入殓.安葬.入宅.安床.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0407": {
			"y": "祭祀.进人口.嫁娶.安床.解除.冠笄.出行.裁衣.扫舍.",
			"j": "掘井.动土.破土.安葬.开光.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0408": {
			"y": "纳采.开光.求医.治病.动土.上梁.移徙.入宅.",
			"j": "嫁娶.开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0406": {
			"y": "祭祀.祈福.裁衣.合帐.安床.入殓.除服.成服.移柩.破土.启攒.安葬.谢土.立碑.造畜椆栖.",
			"j": "掘井.安门.嫁娶.纳采.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0409": {
			"y": "祭祀.会亲友.开市.安床.启攒.安葬.",
			"j": "嫁娶.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0412": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.移徙.求医.",
			"j": "开市.动土.破土.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0410": {
			"y": "祭祀.作灶.掘井.平治道涂.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0413": {
			"y": "祭祀.求医.治病.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0415": {
			"y": "",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0416": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0411": {
			"y": "祭祀.斋醮.开市.动土.入殓.破土.安葬.",
			"j": "嫁娶.移徙.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0417": {
			"y": "嫁娶.开光.出行.出火.拆卸.进人口.开市.立券.交易.挂匾.入宅.移徙.安床.栽种.",
			"j": "祈福.入殓.祭祀.作灶.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0419": {
			"y": "出行.修饰垣墙.造畜椆栖.教牛马.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0414": {
			"y": "沐浴.结网.取渔.",
			"j": "嫁娶.入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0418": {
			"y": "嫁娶.出行.合帐.冠笄.安床.除服.成服.作灶.交易.立券.入殓.移柩.破土.安葬.",
			"j": "词讼.开光.开市.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0420": {
			"y": "祭祀.祈福.开光.求嗣.解除.伐木.出火.入宅.移徙.安床.拆卸.修造.动土.造畜椆栖.",
			"j": "嫁娶.纳财.安葬.出行.开市.立券.作灶.栽种.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0422": {
			"y": "祭祀.平治道涂.解除.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0423": {
			"y": "祭祀.祈福.开光.解除.动土.纳财.交易.纳畜.扫舍.",
			"j": "进人口.出行.嫁娶.置产.安床.赴任.安葬.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0424": {
			"y": "祭祀.祈福.求嗣.开光.解除.出火.拆卸.入宅.安床.修造.安门.纳畜.启攒.安葬.",
			"j": "动土.破土.纳财.掘井.挂匾.开市.伐木.交易.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0425": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0426": {
			"y": "塞穴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0428": {
			"y": "解除.破屋.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0427": {
			"y": "祭祀.祈福.求嗣.开光.解除.纳采.冠笄.出火.拆卸.进人口.安床.动土.上梁.造庙.掘井.开池.入殓.移柩.安葬.破土.",
			"j": "",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0429": {
			"y": "嫁娶.祈福.求嗣.开光.出行.解除.拆卸.出火.开市.立券.交易.入宅.移徙.安床.动土.破土.谢土.",
			"j": "祭祀.入殓.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0431": {
			"y": "祭祀.出行.教牛马.扫舍.余事勿取.",
			"j": "开光.伐木.安葬.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0421": {
			"y": "纳采.嫁娶.开光.出行.理发.会亲友.开市.安床.栽种.牧养.入殓.移柩.启攒.",
			"j": "谢土.祈福.上梁.作灶.斋醮.修造.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0430": {
			"y": "祭祀.裁衣.冠笄.安床.交易.立券.开池.补垣.塞穴.入殓.破土.启攒.安葬.谢土.除服.成服.",
			"j": "嫁娶.掘井.探病.开市.开光.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0303": {
			"y": "修饰垣墙.平治道涂.祭祀.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0301": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.动土.上梁.进人口.入宅.移徙.安床.开市.交易.立券.挂匾.入殓.破土.安葬.启攒.除服.成服.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0304": {
			"y": "造车器.纳采.订盟.祭祀.祈福.求嗣.移徙.出行.开市.出火.入宅.立券.交易.入宅.安门.安床.安葬.谢土.",
			"j": "开光.造屋.动土.作灶.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0302": {
			"y": "嫁娶.冠笄.纳采.出行.会亲友.上梁.安机械.安床.牧养.畋猎.祭祀.祈福.开光.修造.安门.造屋.起基.",
			"j": "入宅.作灶.治病.安葬.移徙.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0305": {
			"y": "动土.入殓.嫁娶.移柩.安葬.破土.",
			"j": "开市.作灶.安床.入宅.上梁.裁衣.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0307": {
			"y": "破屋.坏垣.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0306": {
			"y": "祭祀.解除.入殓.除服.成服.移柩.启攒.安葬.修坟.立碑.谢土.沐浴.扫舍.捕捉.取渔.结网.畋猎.理发.",
			"j": "安床.嫁娶.作灶.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0308": {
			"y": "祭祀.出行.订盟.纳采.裁衣.合帐.冠笄.进人口.动土.安床.作灶.入殓.移柩.安葬.破土.结网.取渔.畋猎.",
			"j": "作梁.造庙.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0309": {
			"y": "祭祀.开光.塑绘.订盟.纳采.合帐.冠笄.拆卸.动土.起基.上梁.入宅.安香.开市.立券.纳财.沐浴.求嗣.出火.竖柱.安门.",
			"j": "造庙.嫁娶.伐木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0312": {
			"y": "订盟.纳采.冠笄.拆卸.修造.动土.安床.入殓.除服.成服.移柩.安葬.破土.启攒.造仓.",
			"j": "作灶.开光.嫁娶.开市.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0310": {
			"y": "祭祀.沐浴.捕捉.栽种.",
			"j": "嫁娶.入宅.移徙.作灶.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0313": {
			"y": "祈福.开光.塑绘.酬神.订盟.纳采.裁衣.安床.开市.立券.入殓.除服.成服.移柩.启攒.安葬.立碑.赴任.会亲友.出行.交易.竖柱.",
			"j": "作灶.掘井.动土.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0316": {
			"y": "冠笄.入殓.除服.成服.移柩.平治道涂.修饰垣墙.",
			"j": "造屋.作灶.治病.探病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0315": {
			"y": "开光.塑绘.裁衣.冠笄.伐木.拆卸.竖柱.上梁.开仓.会亲友.安机械.造仓.造屋.交易.解除.开市.立券.纳财.",
			"j": "出行.嫁娶.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0311": {
			"y": "祭祀.开光.塑绘.酬神.斋醮.订盟.纳采.嫁娶.裁衣.动土.起基.出火.拆卸.移徙.入宅.安香.修造.竖柱.上梁.纳畜.牧养.祈福.求嗣.解除.伐木.定磉.造屋.安门.",
			"j": "栽种.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0317": {
			"y": "祭祀.嫁娶.祈福.纳采.裁衣.合帐.安床.入宅.安香.入殓.移柩.安葬.谢土.修造.安碓硙.求嗣.会亲友.挂匾.交易.立券.纳财.造仓.放水.",
			"j": "栽种.伐木.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0319": {
			"y": "破屋.坏垣.求医.治病.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0314": {
			"y": "祭祀.扫舍.塞穴.",
			"j": "栽种.作灶.安葬.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0318": {
			"y": "祭祀.祈福.斋醮.订盟.纳采.裁衣.合帐.拆卸.修造.动土.上梁.起基.移柩.安葬.谢土.沐浴.扫舍.开柱眼.伐木.出火.",
			"j": "安床.开市.立券.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0320": {
			"y": "祭祀.动土.上梁.订盟.纳采.嫁娶.安机械.拆卸.安床.入宅.安香.入殓.移柩.破土.安葬.立碑.谢土.赴任.出行.移徙.祈福.求嗣.解除.造仓.进人口.",
			"j": "开光.出货财.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0322": {
			"y": "裁衣.合帐.冠笄.嫁娶.纳婿.安床.入殓.纳财.",
			"j": "作灶.开市.安葬.作梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0323": {
			"y": "祭祀.订盟.纳采.修造.动土.祈福.塑绘.斋醮.沐浴.拆卸.起基.入宅.安香.造庙.移柩.谢土.除服.成服.入学.习艺.出行.竖柱.上梁.掘井.求嗣.解除.伐木.",
			"j": "作灶.安葬.开市.造屋.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0325": {
			"y": "祭祀.出行.嫁娶.冠笄.安床.入殓.移柩.安葬.",
			"j": "掘井.动土.作灶.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0326": {
			"y": "塞穴.诸事不宜.",
			"j": "安门.作灶.安葬.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0324": {
			"y": "订盟.纳采.裁衣.合帐.冠笄.安机械.拆卸.安床.入殓.除服.成服.移柩.破土.启攒.安葬.修坟.立碑.经络.交易.立券.纳财.筑堤.造仓.补垣.塞穴.纳畜.伐木.架马.",
			"j": "祭祀.开光.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0328": {
			"y": "祭祀.嫁娶.纳婿.安葬.",
			"j": "栽种.造屋.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0329": {
			"y": "祭祀.会亲友.订盟.裁衣.合帐.安机械.拆卸.上梁.安门.入殓.除服.成服.移柩.启攒.安葬.立碑.开光.塑绘.入学.出行.起基.定磉.放水.移徙.入宅.竖柱.立券.经络.",
			"j": "伐木.作梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0327": {
			"y": "开光.塑绘.求嗣.纳采.裁衣.合帐.冠笄.安机械.作梁.开柱眼.安门.安床.造仓.祭祀.会亲友.祈福.经络.纳财.开市.立券.交易.入学.求嗣.理发.架马.",
			"j": "出行.斋醮.安葬.嫁娶.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "满",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0321": {
			"y": "祭祀.开光.塑绘.纳采.裁衣.拆卸.安床.起基.动土.竖柱.上梁.移徙.入宅.安香.开市.立券.挂匾.沐浴.出行.求嗣.安门.",
			"j": "嫁娶.栽种.伐木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0331": {
			"y": "祭祀.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0330": {
			"y": "祭祀.开光.塑绘.祈福.斋醮.裁衣.合帐.冠笄.嫁娶.拆卸.动土.移徙.入宅.入殓.移柩.安葬.谢土.求嗣.入学.理发.伐木.架马.作梁.出火.修造.起基.定磉.放水.赴任.",
			"j": "入宅.安门.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0203": {
			"y": "祭祀.解除.造畜椆栖.教牛马.针灸.余事勿取.",
			"j": "嫁娶.动土.开池.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0201": {
			"y": "开市.交易.立券.纳财.纳畜.造畜椆栖.入宅.移徙.安床.开光.祈福.求嗣.动土.",
			"j": "嫁娶.栽种.安葬.理发.造庙.作灶.入殓.行丧.造桥.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0202": {
			"y": "安床.裁衣.交易.立券.入殓.移柩.安葬.除服.成服.",
			"j": "置产.嫁娶.出行.开光.栽种.动土.破土.入宅.治病.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0204": {
			"y": "裁衣.合帐.入殓.除服.成服.会亲友.纳财.",
			"j": "祭祀.祈福.移徙.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0205": {
			"y": "祭祀.斋醮.裁衣.合帐.冠笄.订盟.纳采.嫁娶.入宅.安香.谢土.入殓.移柩.破土.立碑.安香.会亲友.出行.祈福.求嗣.立碑.上梁.放水.",
			"j": "掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0207": {
			"y": "作灶.平治道涂.",
			"j": "祭祀.祈福.安葬.安门.余事勿取.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0206": {
			"y": "安床.合帐.入宅.问名.纳采.求嗣.祭祀.开仓.",
			"j": "斋醮.作灶.安床.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0208": {
			"y": "塑绘.开光.酬神.斋醮.订盟.纳采.裁衣.合帐.拆卸.动土.上梁.安床.安香.造庙.挂匾.会亲友.进人口.出行.修造.纳财.伐木.放水.出火.纳畜.沐浴.安门.",
			"j": "造屋.栽种.安葬.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0209": {
			"y": "祭祀.祈福.酬神.订盟.纳采.冠笄.裁衣.合帐.嫁娶.安床.移徙.入宅.安香.入殓.移柩.启攒.安葬.解除.取渔.捕捉.伐木.安门.出火.",
			"j": "栽种.动土.开市.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0212": {
			"y": "取渔.入殓.除服.成服.移柩.破土.安葬.立碑.",
			"j": "嫁娶.上梁.入宅.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0210": {
			"y": "求医.破屋.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0213": {
			"y": "祭祀.求嗣.沐浴.酬神.订盟.纳采.裁衣.合帐.冠笄.安机械.安床.造仓.开池.经络.纳财.开市.立券.交易.结网.取渔.纳畜.捕捉.",
			"j": "安葬.作灶.伐木.作梁.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0216": {
			"y": "安床.解除.裁衣.竖柱.上梁.交易.立券.纳财.纳畜.牧养.入殓.移柩.安葬.启攒.",
			"j": "嫁娶.出行.动土.开渠.入宅.祭祀.掘井.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0215": {
			"y": "祭祀.祈福.求嗣.入殓.启攒.安葬.移柩.",
			"j": "开光.掘井.针灸.出行.嫁娶.入宅.移徙.作灶.动土.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0211": {
			"y": "祈福.求嗣.斋醮.塑绘.开光.订盟.纳采.嫁娶.动土.入宅.安香.移柩.安葬.谢土.出行.沐浴.修造.竖柱.上梁.纳财.破土.解除.安门.放水.",
			"j": "作灶.安床.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0217": {
			"y": "嫁娶.安床.开光.出行.祭祀.动土.出火.解除.会亲友.开市.交易.立券.挂匾.入宅.移徙.拆卸.破土.启攒.安葬.",
			"j": "掘井.词讼.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0219": {
			"y": "作灶.解除.平治道涂.",
			"j": "栽种.出行.祈福.行丧.纳畜.安葬.安门.伐木.作梁.牧养.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0214": {
			"y": "祭祀.沐浴.祈福.求嗣.斋醮.订盟.纳采.裁衣.冠笄.开市.立券.交易.纳财.沐浴.除服.谢土.出行.移柩.",
			"j": "入殓.安葬.作灶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0218": {
			"y": "嫁娶.开光.求嗣.会亲友.安床.牧养.塑绘.针灸.",
			"j": "入宅.移徙.出火.分居.安香.作灶.开市.交易.立券.安葬.动土.伐木.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0220": {
			"y": "解除.沐浴.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0222": {
			"y": "祭祀.解除.治病.破屋.坏垣.扫舍.",
			"j": "余事勿取.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0223": {
			"y": "祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.入宅.移徙.上梁.挂匾.开池.入殓.安葬.破土.启攒.",
			"j": "嫁娶.作灶.安床.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0225": {
			"y": "移徙.祭祀.开光.祈福.出行.解除.进人口.雇庸.安床.动土.起基.上梁.安门.解除.",
			"j": "嫁娶.安葬.破土.作梁.纳畜.牧养.行丧.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0226": {
			"y": "嫁娶.开光.祈福.求嗣.解除.动土.安床.栽种.开池.掘井.祭祀.破土.启攒.",
			"j": "入宅.作灶.伐木.安葬.出火.出行.纳畜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0224": {
			"y": "结网.入殓.除服.成服.移柩.安葬.破土.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0228": {
			"y": "裁衣.伐木.作梁.纳财.交易.立券.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0229": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.动土.上梁.进人口.入宅.移徙.安床.开市.交易.立券.挂匾.入殓.破土.安葬.启攒.除服.成服.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0227": {
			"y": "祭祀.合帐.裁衣.经络.伐木.作梁.安床.作灶.入殓.安葬.启攒.移柩.",
			"j": "词讼.出火.入宅.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0221": {
			"y": "嫁娶.祭祀.祈福.出行.解除.出火.拆卸.动土.入宅.移徙.安床.上梁.栽种.纳畜.破土.启攒.安葬.",
			"j": "开市.立券.理发.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0231": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.动土.上梁.进人口.入宅.移徙.安床.开市.交易.立券.挂匾.入殓.破土.安葬.启攒.除服.成服.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0230": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.动土.上梁.进人口.入宅.移徙.安床.开市.交易.立券.挂匾.入殓.破土.安葬.启攒.除服.成服.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0103": {
			"y": "破屋.坏垣.祭祀.沐浴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0102": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0101": {
			"y": "入宅.安床.开光.祭祀.出火.拆卸.动土.挂匾.入殓.破土.安葬.纳畜.",
			"j": "嫁娶.开市.作灶.置产.作梁.伐木.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0104": {
			"y": "安床.祭祀.祈福.求嗣.冠笄.伐木.架马.动土.开池.作厕.结网.入殓.除服.成服.",
			"j": "安门.栽种.作灶.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0107": {
			"y": "祭祀.作灶.入殓.除服.余事勿取.",
			"j": "开市.安床.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0105": {
			"y": "解除.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0106": {
			"y": "入殓.除服.成服.移柩.启攒.安葬.修坟.立碑.",
			"j": "开市.伐木.嫁娶.作梁.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0108": {
			"y": "塑绘.开光.沐浴.冠笄.会亲友.作灶.放水.造畜椆栖.",
			"j": "嫁娶.入殓.安葬.出行.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0109": {
			"y": "祭祀.沐浴.祈福.斋醮.订盟.纳采.裁衣.拆卸.起基.竖柱.上梁.安床.入殓.除服.成服.移柩.启攒.挂匾.求嗣.出行.合帐.造畜椆栖.",
			"j": "开仓.嫁娶.移徙.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0112": {
			"y": "出行.嫁娶.订盟.纳采.入殓.安床.启攒.安葬.祭祀.裁衣.会亲友.进人口.",
			"j": "作灶.掘井.谢土.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0110": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0116": {
			"y": "解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0113": {
			"y": "修饰垣墙.平治道涂.入殓.移柩.余事勿取.",
			"j": "嫁娶.移徙.入宅.开光.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0115": {
			"y": "祭祀.会亲友.出行.订盟.纳采.沐浴.修造.动土.祈福.斋醮.嫁娶.拆卸.安床.入殓.移柩.安葬.谢土.赴任.裁衣.竖柱.上梁.伐木.捕捉.栽种.破土.安门.",
			"j": "造屋.开市.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0111": {
			"y": "沐浴.解除.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.移徙.入宅.除服.成服.移柩.破土.启攒.安葬.扫舍.修坟.伐木.纳财.交易.立券.",
			"j": "作灶.祭祀.上梁.出行.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0117": {
			"y": "塑绘.开光.出行.订盟.纳采.除服.成服.嫁娶.纳婿.入殓.移柩.启攒.安葬.立碑.",
			"j": "入宅.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0119": {
			"y": "祭祀.祈福.斋醮.塑绘.开光.除服.成服.入殓.作灶.嫁娶.捕捉.畋猎.纳财.",
			"j": "开仓.造屋.安葬.安床.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0114": {
			"y": "会亲友.纳采.进人口.修造.动土.竖柱.上梁.祭祀.开光.塑绘.祈福.斋醮.嫁娶.安床.移徙.入宅.安香.纳畜.",
			"j": "出行.治病.安葬.开市.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0118": {
			"y": "入殓.除服.成服.移柩.启攒.安葬.立碑.余事勿取.",
			"j": "破土.伐木.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0120": {
			"y": "祭祀.出行.沐浴.裁衣.祈福.斋醮.订盟.纳采.嫁娶.安机械.开市.立券.安碓硙.纳畜.",
			"j": "栽种.嫁娶.入殓.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0122": {
			"y": "解除.扫舍.祭祀.教牛马.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "建",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0123": {
			"y": "开市.交易.立券.挂匾.开光.解除.伐木.作梁.出火.入宅.移徙.安床.拆卸.动土.上梁.栽种.纳畜.安葬.",
			"j": "嫁娶.祭祀.出行.置产.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0125": {
			"y": "祭祀.解除.修饰垣墙.平治道涂.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0124": {
			"y": "开市.交易.立券.纳财.开池.补垣.嫁娶.纳采.纳畜.取渔.安床.",
			"j": "修造.上梁.入宅.祈福.探病.掘井.动土.安门.安葬.作灶.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0126": {
			"y": "嫁娶.祭祀.祈福.求嗣.动土.会亲友.起基.造仓.纳畜.牧养.作厕.进人口.",
			"j": "掘井.安葬.栽种.出行.作灶.开市.入宅.安门.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0129": {
			"y": "嫁娶.开市.交易.立券.开光.出行.出火.拆卸.修造.入宅.移徙.动土.破土.移柩.安葬.启攒.除服.成服.",
			"j": "安床.伐木.祈福.纳畜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0127": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.入宅.移徙.安床.修造.动土.进人口.",
			"j": "掘井.安葬.栽种.出行.作灶.开市.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0128": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0121": {
			"y": "祭祀.祈福.斋醮.沐浴.安床.安机械.造车器.入殓.移柩.启攒.安葬.立碑.合帐.经络.交易.",
			"j": "作灶.掘井.嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0131": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0130": {
			"y": "祭祀.入殓.破土.除服.成服.启攒.安葬.修坟.立碑.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		}
	};


/***/ },
/* 15 */
/***/ function(module, exports) {

	window.HuangLi = window.HuangLi || {};
	HuangLi.y2012 = {
		"d0101": {
			"y": "祭祀.开光.理发.整手足甲.安床.作灶.扫舍.教牛马.",
			"j": "伐木.纳畜.破土.安葬.开生坟.嫁娶.开市.动土.交易.作梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0201": {
			"y": "解除.平治道涂.余事勿取.",
			"j": "移徙.入宅.掘井.造庙.栽种.针灸.治病.开池.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0102": {
			"y": "祭祀.祈福.求嗣.开光.拆卸.修造.动土.上梁.安床.置产.栽种.破土.",
			"j": "嫁娶.进人口.安葬.出行.赴任.入宅.移徙.入殓.开渠.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0103": {
			"y": "沐浴.冠笄.补垣.塞穴.合帐.裁衣.修造.作梁.开柱眼.安碓硙.筑堤.作厕.断蚁.",
			"j": "移徙.入宅.嫁娶.祈福.开光.掘井.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0104": {
			"y": "交易.进人口.祭祀.沐浴.捕捉.入殓.除服.成服.安葬.谢土.启攒.修坟.",
			"j": "斋醮.入宅.修造.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0105": {
			"y": "嫁娶.纳采.订盟.造车器.祭祀.祈福.造庙.安香.出火.出行.归宁.入学.入宅.交易.立券.求医.治病.修造.动土.竖柱.上梁.造屋.起基.安门.",
			"j": "斋醮.伐木.作梁.安葬.行丧.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0106": {
			"y": "沐浴.解除.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.移徙.入宅.除服.成服.移柩.破土.启攒.安葬.扫舍.修坟.伐木.纳财.交易.立券.",
			"j": "作灶.祭祀.上梁.出行.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0107": {
			"y": "出行.嫁娶.订盟.纳采.入殓.安床.启攒.安葬.祭祀.裁衣.会亲友.进人口.",
			"j": "作灶.掘井.谢土.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0108": {
			"y": "修饰垣墙.平治道涂.入殓.移柩.余事勿取.",
			"j": "嫁娶.移徙.入宅.开光.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0109": {
			"y": "会亲友.纳采.进人口.修造.动土.竖柱.上梁.祭祀.开光.塑绘.祈福.斋醮.嫁娶.安床.移徙.入宅.安香.纳畜.",
			"j": "出行.治病.安葬.开市.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0110": {
			"y": "祭祀.会亲友.出行.订盟.纳采.沐浴.修造.动土.祈福.斋醮.嫁娶.拆卸.安床.入殓.移柩.安葬.谢土.赴任.裁衣.竖柱.上梁.伐木.捕捉.栽种.破土.安门.",
			"j": "造屋.开市.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0111": {
			"y": "解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0112": {
			"y": "塑绘.开光.出行.订盟.纳采.除服.成服.嫁娶.纳婿.入殓.移柩.启攒.安葬.立碑.",
			"j": "入宅.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0113": {
			"y": "入殓.除服.成服.移柩.启攒.安葬.立碑.余事勿取.",
			"j": "破土.伐木.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0114": {
			"y": "祭祀.祈福.斋醮.塑绘.开光.除服.成服.入殓.作灶.嫁娶.捕捉.畋猎.纳财.",
			"j": "开仓.造屋.安葬.安床.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0115": {
			"y": "祭祀.出行.沐浴.裁衣.祈福.斋醮.订盟.纳采.嫁娶.安机械.开市.立券.安碓硙.纳畜.",
			"j": "栽种.嫁娶.入殓.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0116": {
			"y": "祭祀.祈福.斋醮.沐浴.安床.安机械.造车器.入殓.移柩.启攒.安葬.立碑.合帐.经络.交易.",
			"j": "作灶.掘井.嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0117": {
			"y": "解除.扫舍.祭祀.教牛马.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0118": {
			"y": "开市.交易.立券.挂匾.开光.解除.伐木.作梁.出火.入宅.移徙.安床.拆卸.动土.上梁.栽种.纳畜.安葬.",
			"j": "嫁娶.祭祀.出行.置产.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0119": {
			"y": "开市.交易.立券.纳财.开池.补垣.嫁娶.纳采.纳畜.取渔.安床.",
			"j": "修造.上梁.入宅.祈福.探病.掘井.动土.安门.安葬.作灶.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0120": {
			"y": "祭祀.解除.修饰垣墙.平治道涂.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0121": {
			"y": "嫁娶.祭祀.祈福.求嗣.动土.会亲友.起基.造仓.纳畜.牧养.作厕.进人口.",
			"j": "掘井.安葬.栽种.出行.作灶.开市.入宅.安门.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0122": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.入宅.移徙.安床.修造.动土.进人口.",
			"j": "掘井.安葬.栽种.出行.作灶.开市.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0123": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0124": {
			"y": "嫁娶.开市.交易.立券.开光.出行.出火.拆卸.修造.入宅.移徙.动土.破土.移柩.安葬.启攒.除服.成服.",
			"j": "安床.伐木.祈福.纳畜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0125": {
			"y": "祭祀.入殓.破土.除服.成服.启攒.安葬.修坟.立碑.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0126": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0127": {
			"y": "开市.交易.立券.纳财.纳畜.造畜椆栖.入宅.移徙.安床.开光.祈福.求嗣.动土.",
			"j": "嫁娶.栽种.安葬.理发.造庙.作灶.入殓.行丧.造桥.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0128": {
			"y": "安床.裁衣.交易.立券.入殓.移柩.安葬.除服.成服.",
			"j": "置产.嫁娶.出行.开光.栽种.动土.破土.入宅.治病.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0129": {
			"y": "祭祀.解除.造畜椆栖.教牛马.针灸.余事勿取.",
			"j": "嫁娶.动土.开池.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0130": {
			"y": "沐浴.塑绘.开光.纳采.订盟.开市.交易.立券.纳财.起基.动土.定磉.放水.安葬.破土.启攒.修坟.立碑.移柩.",
			"j": "入宅.安门.祭祀.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0131": {
			"y": "嫁娶.出行.理发.安床.启攒.安葬.修坟.开市.交易.立券.纳财.开池.牧养.",
			"j": "掘井.祈福.谢土.动土.入宅.上梁.修造.作灶.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0215": {
			"y": "解除.沐浴.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0205": {
			"y": "求医.破屋.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0226": {
			"y": "修饰垣墙.平治道涂.祭祀.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0216": {
			"y": "嫁娶.祭祀.祈福.出行.解除.出火.拆卸.动土.入宅.移徙.安床.上梁.栽种.纳畜.破土.启攒.安葬.",
			"j": "开市.立券.理发.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0225": {
			"y": "嫁娶.冠笄.纳采.出行.会亲友.上梁.安机械.安床.牧养.畋猎.祭祀.祈福.开光.修造.安门.造屋.起基.",
			"j": "入宅.作灶.治病.安葬.移徙.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0224": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.动土.上梁.进人口.入宅.移徙.安床.开市.交易.立券.挂匾.入殓.破土.安葬.启攒.除服.成服.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0222": {
			"y": "祭祀.合帐.裁衣.经络.伐木.作梁.安床.作灶.入殓.安葬.启攒.移柩.",
			"j": "词讼.出火.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0212": {
			"y": "嫁娶.安床.开光.出行.祭祀.动土.出火.解除.会亲友.开市.交易.立券.挂匾.入宅.移徙.拆卸.破土.启攒.安葬.",
			"j": "掘井.词讼.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0326": {
			"y": "嫁娶.祭祀.出行.冠笄.立券.交易.进人口.开市.移徙.修造.动土.安床.入殓.移柩.破土.",
			"j": "开光.作灶.斋醮.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0202": {
			"y": "嫁娶.祭祀.开光.伐木.出火.拆卸.入宅.移徙.修造.动土.上梁.安床.纳畜.",
			"j": "开市.行丧.栽种.出行.出货财.安葬.置产.词讼.治病.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0203": {
			"y": "嫁娶.纳采.订盟.入宅.移徙.安床.祭祀.祈福.开光.出行.解除.出火.拆卸.动土.纳畜.谢土.安葬.破土.",
			"j": "伐木.开市.交易.上梁.作灶.安门.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0204": {
			"y": "祭祀.祈福.酬神.订盟.纳采.冠笄.裁衣.合帐.嫁娶.安床.移徙.入宅.安香.入殓.移柩.启攒.安葬.解除.取渔.捕捉.伐木.安门.出火.",
			"j": "栽种.动土.开市.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0206": {
			"y": "祈福.求嗣.斋醮.塑绘.开光.订盟.纳采.嫁娶.动土.入宅.安香.移柩.安葬.谢土.出行.沐浴.修造.竖柱.上梁.纳财.破土.解除.安门.放水.",
			"j": "作灶.安床.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0207": {
			"y": "取渔.入殓.除服.成服.移柩.破土.安葬.立碑.",
			"j": "嫁娶.上梁.入宅.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0208": {
			"y": "祭祀.求嗣.沐浴.酬神.订盟.纳采.裁衣.合帐.冠笄.安机械.安床.造仓.开池.经络.纳财.开市.立券.交易.结网.取渔.纳畜.捕捉.",
			"j": "安葬.作灶.伐木.作梁.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0209": {
			"y": "祭祀.沐浴.祈福.求嗣.斋醮.订盟.纳采.裁衣.冠笄.开市.立券.交易.纳财.沐浴.除服.谢土.出行.移柩.",
			"j": "入殓.安葬.作灶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0210": {
			"y": "祭祀.祈福.求嗣.入殓.启攒.安葬.移柩.",
			"j": "开光.掘井.针灸.出行.嫁娶.入宅.移徙.作灶.动土.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0211": {
			"y": "安床.解除.裁衣.竖柱.上梁.交易.立券.纳财.纳畜.牧养.入殓.移柩.安葬.启攒.",
			"j": "嫁娶.出行.动土.开渠.入宅.祭祀.掘井.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0213": {
			"y": "嫁娶.开光.求嗣.会亲友.安床.牧养.塑绘.针灸.",
			"j": "入宅.移徙.出火.分居.安香.作灶.开市.交易.立券.安葬.动土.伐木.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0214": {
			"y": "作灶.解除.平治道涂.",
			"j": "栽种.出行.祈福.行丧.纳畜.安葬.安门.伐木.作梁.牧养.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0217": {
			"y": "祭祀.解除.治病.破屋.坏垣.扫舍.",
			"j": "余事勿取.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0218": {
			"y": "祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.入宅.移徙.上梁.挂匾.开池.入殓.安葬.破土.启攒.",
			"j": "嫁娶.作灶.安床.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0219": {
			"y": "结网.入殓.除服.成服.移柩.安葬.破土.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0220": {
			"y": "移徙.祭祀.开光.祈福.出行.解除.进人口.雇庸.安床.动土.起基.上梁.安门.解除.",
			"j": "嫁娶.安葬.破土.作梁.纳畜.牧养.行丧.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0221": {
			"y": "嫁娶.开光.祈福.求嗣.解除.动土.安床.栽种.开池.掘井.祭祀.破土.启攒.",
			"j": "入宅.作灶.伐木.安葬.出火.出行.纳畜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0223": {
			"y": "裁衣.伐木.作梁.纳财.交易.立券.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0227": {
			"y": "造车器.纳采.订盟.祭祀.祈福.求嗣.移徙.出行.开市.出火.入宅.立券.交易.入宅.安门.安床.安葬.谢土.",
			"j": "开光.造屋.动土.作灶.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0228": {
			"y": "动土.入殓.嫁娶.移柩.安葬.破土.",
			"j": "开市.作灶.安床.入宅.上梁.裁衣.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0229": {
			"y": "求医.治病.破屋.坏垣.余事勿取.",
			"j": "开市.嫁娶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0327": {
			"y": "开市.立券.交易.挂匾.祭祀.祈福.开光.入宅.移徙.安床.拆卸.动土.上梁.进人口.",
			"j": "嫁娶.行丧.架马.作梁.理发.牧养.安葬.纳畜.伐木.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0319": {
			"y": "祭祀.出行.嫁娶.冠笄.安床.入殓.移柩.安葬.",
			"j": "掘井.动土.作灶.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0329": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出火.入宅.移徙.安床.拆卸.动土.破土.谢土.",
			"j": "合帐.开市.安葬.入殓.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0427": {
			"y": "开光.出行.交易.塞穴.嫁娶.理发.开市.安床.",
			"j": "祈福.出火.置产.动土.破土.安葬.修造.上梁.置产.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0301": {
			"y": "祭祀.斋醮.沐浴.开生坟.除服.成服.移柩.入殓.破土.安葬.合寿木.",
			"j": "开市.嫁娶.安床.会亲友.入宅.作灶.上梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0302": {
			"y": "祭祀.塞穴.结网.破土.谢土.安葬.移柩.除服.成服.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0303": {
			"y": "祭祀.沐浴.理发.作灶.结网.栽种.",
			"j": "嫁娶.词讼.行丧.安葬.牧养.伐木.作梁.开市.纳畜.造畜椆栖.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0304": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.开市.交易.立券.动土.纳财.掘井.会亲友.",
			"j": "入宅.安葬.伐木.作梁.纳畜.造畜椆栖.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0305": {
			"y": "祭祀.开光.塑绘.酬神.斋醮.订盟.纳采.嫁娶.裁衣.动土.起基.出火.拆卸.移徙.入宅.安香.修造.竖柱.上梁.纳畜.牧养.祈福.求嗣.解除.伐木.定磉.造屋.安门.",
			"j": "栽种.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0306": {
			"y": "订盟.纳采.冠笄.拆卸.修造.动土.安床.入殓.除服.成服.移柩.安葬.破土.启攒.造仓.",
			"j": "作灶.开光.嫁娶.开市.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0307": {
			"y": "祈福.开光.塑绘.酬神.订盟.纳采.裁衣.安床.开市.立券.入殓.除服.成服.移柩.启攒.安葬.立碑.赴任.会亲友.出行.交易.竖柱.",
			"j": "作灶.掘井.动土.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0308": {
			"y": "祭祀.扫舍.塞穴.",
			"j": "栽种.作灶.安葬.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0309": {
			"y": "开光.塑绘.裁衣.冠笄.伐木.拆卸.竖柱.上梁.开仓.会亲友.安机械.造仓.造屋.交易.解除.开市.立券.纳财.",
			"j": "出行.嫁娶.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0310": {
			"y": "冠笄.入殓.除服.成服.移柩.平治道涂.修饰垣墙.",
			"j": "造屋.作灶.治病.探病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0311": {
			"y": "祭祀.嫁娶.祈福.纳采.裁衣.合帐.安床.入宅.安香.入殓.移柩.安葬.谢土.修造.安碓硙.求嗣.会亲友.挂匾.交易.立券.纳财.造仓.放水.",
			"j": "栽种.伐木.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0312": {
			"y": "祭祀.祈福.斋醮.订盟.纳采.裁衣.合帐.拆卸.修造.动土.上梁.起基.移柩.安葬.谢土.沐浴.扫舍.开柱眼.伐木.出火.",
			"j": "安床.开市.立券.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0313": {
			"y": "破屋.坏垣.求医.治病.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0314": {
			"y": "祭祀.动土.上梁.订盟.纳采.嫁娶.安机械.拆卸.安床.入宅.安香.入殓.移柩.破土.安葬.立碑.谢土.赴任.出行.移徙.祈福.求嗣.解除.造仓.进人口.",
			"j": "开光.出货财.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0315": {
			"y": "祭祀.开光.塑绘.纳采.裁衣.拆卸.安床.起基.动土.竖柱.上梁.移徙.入宅.安香.开市.立券.挂匾.沐浴.出行.求嗣.安门.",
			"j": "嫁娶.栽种.伐木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0316": {
			"y": "裁衣.合帐.冠笄.嫁娶.纳婿.安床.入殓.纳财.",
			"j": "作灶.开市.安葬.作梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0317": {
			"y": "祭祀.订盟.纳采.修造.动土.祈福.塑绘.斋醮.沐浴.拆卸.起基.入宅.安香.造庙.移柩.谢土.除服.成服.入学.习艺.出行.竖柱.上梁.掘井.求嗣.解除.伐木.",
			"j": "作灶.安葬.开市.造屋.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0318": {
			"y": "订盟.纳采.裁衣.合帐.冠笄.安机械.拆卸.安床.入殓.除服.成服.移柩.破土.启攒.安葬.修坟.立碑.经络.交易.立券.纳财.筑堤.造仓.补垣.塞穴.纳畜.伐木.架马.",
			"j": "祭祀.开光.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0320": {
			"y": "塞穴.诸事不宜.",
			"j": "安门.作灶.安葬.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0321": {
			"y": "开光.塑绘.求嗣.纳采.裁衣.合帐.冠笄.安机械.作梁.开柱眼.安门.安床.造仓.祭祀.会亲友.祈福.经络.纳财.开市.立券.交易.入学.求嗣.理发.架马.",
			"j": "出行.斋醮.安葬.嫁娶.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0322": {
			"y": "祭祀.嫁娶.纳婿.安葬.",
			"j": "栽种.造屋.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0323": {
			"y": "祭祀.会亲友.订盟.裁衣.合帐.安机械.拆卸.上梁.安门.入殓.除服.成服.移柩.启攒.安葬.立碑.开光.塑绘.入学.出行.起基.定磉.放水.移徙.入宅.竖柱.立券.经络.",
			"j": "伐木.作梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0324": {
			"y": "祭祀.开光.塑绘.祈福.斋醮.裁衣.合帐.冠笄.嫁娶.拆卸.动土.移徙.入宅.入殓.移柩.安葬.谢土.求嗣.入学.理发.伐木.架马.作梁.出火.修造.起基.定磉.放水.赴任.",
			"j": "入宅.安门.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0325": {
			"y": "祭祀.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0328": {
			"y": "理发.冠笄.嫁娶.进人口.",
			"j": "置产.伐木.纳畜.造畜椆栖.安葬.破土.作梁.作灶.开生坟.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0330": {
			"y": "安床.伐木.拆卸.修造.动土.上梁.立券.交易.栽种.纳畜.牧养.入殓.安葬.",
			"j": "嫁娶.祭祀.开光.出行.出火.移徙.入宅.安门.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0331": {
			"y": "祭祀.祈福.求嗣.斋醮.嫁娶.冠笄.出行.开市.交易.会亲友.教牛马.除服.成服.启攒.安葬.移柩.",
			"j": "祈福.动土.移徙.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0527": {
			"y": "纳采.订盟.嫁娶.造车器.祭祀.祈福.求嗣.开光.出火.拆卸.修造.动土.进人口.挂匾.入宅.移徙.安床.栽种.入殓.破土.安葬.除服.成服.",
			"j": "开市.立券.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0401": {
			"y": "塞穴.整手足甲.解除.捕捉.畋猎.结网.余事勿取.诸事不宜.",
			"j": "嫁娶.作灶.掘井.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0402": {
			"y": "纳财.开市.立券.交易.开光.安床.上梁.造屋.修造.起基.",
			"j": "动土.破土.安葬.行丧.赴任.出行.嫁娶.入宅.移徙.谢土.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0403": {
			"y": "祭祀.祈福.嫁娶.冠笄.修饰垣墙.置产.平治道涂.",
			"j": "开仓.出货财.造屋.作灶.开市.交易.立券.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0404": {
			"y": "祭祀.作灶.掘井.平治道涂.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0405": {
			"y": "祭祀.斋醮.开市.动土.入殓.破土.安葬.",
			"j": "嫁娶.移徙.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0406": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.移徙.求医.",
			"j": "开市.动土.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0407": {
			"y": "祭祀.求医.治病.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0408": {
			"y": "沐浴.结网.取渔.",
			"j": "嫁娶.入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0409": {
			"y": "",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0410": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0411": {
			"y": "嫁娶.开光.出行.出火.拆卸.进人口.开市.立券.交易.挂匾.入宅.移徙.安床.栽种.",
			"j": "祈福.入殓.祭祀.作灶.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0412": {
			"y": "嫁娶.出行.合帐.冠笄.安床.除服.成服.作灶.交易.立券.入殓.移柩.破土.安葬.",
			"j": "词讼.开光.开市.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0413": {
			"y": "出行.修饰垣墙.造畜椆栖.教牛马.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0414": {
			"y": "祭祀.祈福.开光.求嗣.解除.伐木.出火.入宅.移徙.安床.拆卸.修造.动土.造畜椆栖.",
			"j": "嫁娶.纳财.安葬.出行.开市.立券.作灶.栽种.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0415": {
			"y": "纳采.嫁娶.开光.出行.理发.会亲友.开市.安床.栽种.牧养.入殓.移柩.启攒.",
			"j": "谢土.祈福.上梁.作灶.斋醮.修造.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0416": {
			"y": "祭祀.平治道涂.解除.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0417": {
			"y": "祭祀.祈福.开光.解除.动土.纳财.交易.纳畜.扫舍.",
			"j": "进人口.出行.嫁娶.置产.安床.赴任.安葬.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0418": {
			"y": "祭祀.祈福.求嗣.开光.解除.出火.拆卸.入宅.安床.修造.安门.纳畜.启攒.安葬.",
			"j": "动土.破土.纳财.掘井.挂匾.开市.伐木.交易.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0419": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0420": {
			"y": "塞穴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0421": {
			"y": "祭祀.祈福.求嗣.开光.解除.纳采.冠笄.出火.拆卸.进人口.安床.动土.上梁.造庙.掘井.开池.入殓.移柩.安葬.破土.",
			"j": "",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0422": {
			"y": "解除.破屋.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0423": {
			"y": "嫁娶.祈福.求嗣.开光.出行.解除.拆卸.出火.开市.立券.交易.入宅.移徙.安床.动土.破土.谢土.",
			"j": "祭祀.入殓.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0424": {
			"y": "祭祀.裁衣.冠笄.安床.交易.立券.开池.补垣.塞穴.入殓.破土.启攒.安葬.谢土.除服.成服.",
			"j": "嫁娶.掘井.探病.开市.开光.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0425": {
			"y": "祭祀.出行.教牛马.扫舍.余事勿取.",
			"j": "开光.伐木.安葬.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0426": {
			"y": "祭祀.祈福.求嗣.开光.纳采.订盟.解除.栽种.纳畜.牧养.扫舍.进人口.",
			"j": "修坟.造桥.作灶.出行.安葬.造屋.入宅.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0428": {
			"y": "祭祀.作灶.畋猎.结网.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.安床.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0429": {
			"y": "沐浴.祭祀.解除.安葬.破土.谢土.移柩.余事勿取.",
			"j": "斋醮.开光.嫁娶.入宅.上梁.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0430": {
			"y": "祭祀.解除.入殓.移柩.启攒.安葬.整手足甲.捕捉.畋猎.取渔.除服.成服.扫舍.谢土.斋醮.",
			"j": "动土.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0522": {
			"y": "进人口.会亲友.",
			"j": "塞穴.上梁.动土.伐木.安葬.词讼.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0517": {
			"y": "结网.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0529": {
			"y": "解除.出行.纳采.冠笄.竖柱.上梁.移徙.作灶.进人口.入宅.纳畜.牧养.",
			"j": "祭祀.伐木.架马.安床.修造.动土.安葬.修坟.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0519": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.修造.动土.入宅.移徙.安床.作灶.塞穴.栽种.破土.安葬.",
			"j": "开光.掘井.开仓.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0629": {
			"y": "嫁娶.祭祀.理发.作灶.修饰垣墙.平治道涂.整手足甲.沐浴.冠笄.",
			"j": "破土.出行.栽种.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0501": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.开市.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0502": {
			"y": "沐浴.塞穴.畋猎.结网.取渔.扫舍.余事勿取.",
			"j": "祈福.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0503": {
			"y": "开市.交易.立券.挂匾.祭祀.开光.祈福.求嗣.安床.解除.修造.安葬.",
			"j": "纳采.问名.订盟.嫁娶.入宅.开仓.出火.动土.破土.纳畜.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0504": {
			"y": "祭祀.修门.取渔.纳财.纳畜.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0505": {
			"y": "嫁娶.纳采.出行.移徙.入宅.",
			"j": "动土.破土.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0506": {
			"y": "订盟.纳采.祭祀.动土.破土.交易.立券.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0507": {
			"y": "嫁娶.裁衣.祭祀.出行.安床.作灶.移徙.入宅.破土.安葬.",
			"j": "赴任.捕捉.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0508": {
			"y": "塞穴.结网.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0509": {
			"y": "嫁娶.订盟.纳采.出行.祭祀.祈福.斋醮.动土.上梁.破土.安葬.",
			"j": "移徙.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0510": {
			"y": "订盟.纳采.会亲友.安床.作灶.造畜椆栖.",
			"j": "开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0511": {
			"y": "沐浴.平治道涂.扫舍.入殓.移柩.破土.启攒.安葬.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0512": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.动土.上梁.进人口.入宅.移徙.安床.安门.开市.交易.立券.挂匾.栽种.破土.安葬.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0513": {
			"y": "祭祀.开光.出行.解除.塑绘.裁衣.入殓.移柩.破土.启攒.安葬.除服.成服.",
			"j": "嫁娶.上梁.修造.拆卸.架马.入宅.伐木.动土.出火.开柱眼.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0514": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0515": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.拆卸.动土.上梁.出火.进人口.入宅.移徙.安床.栽种.纳畜.牧养.竖柱.安门.修造.解除.会亲友.",
			"j": "",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0516": {
			"y": "开市.交易.立券.祭祀.祈福.开光.伐木.进人口.安床.拆卸.修造.动土.栽种.破土.移柩.安葬.",
			"j": "入宅.移徙.理发.出火.嫁娶.出行.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0518": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.开市.交易.立券.安床.出行.拆卸.",
			"j": "纳畜.入宅.移徙.安葬.探病.伐木.上梁.安门.入殓.动土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0520": {
			"y": "解除.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0521": {
			"y": "开市.交易.立券.挂匾.开光.出行.拆卸.进人口.入宅.移柩.动土.安门.上梁.栽种.破土.修坟.安葬.",
			"j": "嫁娶.安床.探病.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0523": {
			"y": "沐浴.平治道涂.扫舍.入殓.破土.安葬.除服.成服.",
			"j": "嫁娶.移徙.伐木.作梁.安床.祭祀.祈福.造屋.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0524": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.出行.拆卸.动土.解除.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.安门.上梁.安葬.破土.谢土.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0525": {
			"y": "祭祀.祈福.求嗣.开光.解除.合帐.冠笄.伐木.架马.作梁.修造.进人口.嫁娶.裁衣.合帐.安床.动土.起基.上梁.竖柱.放水.会亲友.",
			"j": "",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0526": {
			"y": "破屋.坏垣.沐浴.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0528": {
			"y": "开市.交易.立券.祭祀.祈福.开光.动土.安床.出行.栽种.纳畜.牧养.竖柱.上梁.解除.破土.",
			"j": "嫁娶.掘井.入宅.移徙.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0530": {
			"y": "祭祀.祈福.求嗣.开光.出行.开市.交易.立券.栽种.安床.纳畜.移徙.起基.动土.定磉.造仓.置产.破土.启攒.修坟.",
			"j": "入宅.移徙.修造.安门.伐木.入殓.安葬.造屋.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0531": {
			"y": "嫁娶.交易.立券.作厕.补垣.塞穴.畋猎.取渔.开生坟.",
			"j": "安床.开渠.上梁.修造.开市.开光.入宅.移徙.安床.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0624": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0622": {
			"y": "开市.交易.立券.纳财.栽种.安床.拆卸.修造.动土.上梁.入殓.安葬.破土.除服.成服.",
			"j": "嫁娶.出火.伐木.祭祀.入宅.移徙.纳畜.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0614": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0612": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.出行.解除.伐木.入宅.移徙.安床.出火.拆卸.修造.上梁.栽种.移柩.",
			"j": "安葬.开市.交易.立券.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0619": {
			"y": "祭祀.祈福.求嗣.开光.出行.伐木.出火.拆卸.修造.动土.起基.安床.入宅.移徙.",
			"j": "嫁娶.开市.交易.行丧.安葬.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0627": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.开市.纳财.立券.移徙.出行.修造.动土.起基.定磉.竖柱.拆卸.扫舍.放水.安香.安床.造船.开池.掘井.造畜椆栖.栽种.",
			"j": "行丧.安葬.破土.作灶.伐木.斋醮.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0604": {
			"y": "纳采.嫁娶.裁衣.理发.出行.修造.动土.进人口.开市.交易.立券.挂匾.移徙.上梁.栽种.纳畜.",
			"j": "伐木.安葬.安床.祭祀.祈福.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0727": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0601": {
			"y": "塞穴.断蚁.结网.畋猎.余事勿取.",
			"j": "嫁娶.安葬.入宅.出行.动土.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0602": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.开光.解除.出行.出火.入宅.移徙.栽种.纳畜.牧养.动土.破土.入殓.安葬.",
			"j": "作灶.安床.开仓.造屋.动土.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0603": {
			"y": "开光.纳采.裁衣.冠笄.安床.作灶.进人口.造仓.塞穴.",
			"j": "嫁娶.栽种.修造.动土.出行.伐木.作梁.安葬.谢土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0605": {
			"y": "嫁娶.祭祀.沐浴.扫舍.修饰垣墙.",
			"j": "行丧.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0606": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0607": {
			"y": "订盟.纳采.出行.祭祀.祈福.修造.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0608": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0609": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.入殓.破土.安葬.",
			"j": "开光.开市.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0610": {
			"y": "开光.求医.治病.动土.上梁.入殓.破土.安葬.",
			"j": "嫁娶.开光.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0611": {
			"y": "祭祀.栽种.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0613": {
			"y": "求嗣.嫁娶.纳采.合帐.裁衣.冠笄.伐木.作梁.修造.动土.起基.竖柱.上梁.安门.作灶.筑堤.造畜椆栖.",
			"j": "安葬.出行.祈福.栽种.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0615": {
			"y": "嫁娶.祭祀.祈福.出火.开光.求嗣.出行.拆卸.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.动土.",
			"j": "安葬.行丧.伐木.作梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0616": {
			"y": "开光.求嗣.出行.解除.伐木.出火.拆卸.修造.上梁.起基.入宅.移徙.开市.交易.立券.栽种.牧养.入殓.安葬.除服.成服.",
			"j": "置产.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0617": {
			"y": "祭祀.理发.修饰垣墙.平治道涂.沐浴.整手足甲.扫舍.",
			"j": "出行.安门.修造.嫁娶.上梁.入宅.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0618": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.出火.拆卸.动土.修造.进人口.入宅.移徙.安床.挂匾.交易.立券.栽种.纳畜.入殓.破土.启攒.安葬.",
			"j": "",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0620": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0621": {
			"y": "开市.交易.立券.纳财.开池.作厕.结网.祭祀.修造.动土.安床.放水.经络.破土.",
			"j": "嫁娶.造桥.词讼.移徙.安门.作灶.栽种.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0623": {
			"y": "祭祀.作灶.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0625": {
			"y": "修造.动土.起基.安门.安床.栽种.筑堤.补垣.造畜椆栖.",
			"j": "嫁娶.掘井.入宅.移徙.出火.出行.行丧.安葬.开光.理发.进人口.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0626": {
			"y": "祭祀.教牛马.断蚁.余事勿取.",
			"j": "斋醮.移徙.入宅.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0628": {
			"y": "嫁娶.开光.祭祀.祈福.出行.解除.移徙.入宅.开市.纳财.起基.修造.竖柱.上梁.造屋.作灶.出火.安香.补垣.塞穴.拆卸.放水.扫舍.造仓.造船.栽种.安葬.",
			"j": "纳采.订盟.安床.谢土.破土.动土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0630": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.进人口.入宅.移徙.安床.交易.立券.挂匾.纳财.入殓.安葬.启攒.除服.成服.",
			"j": "动土.掘井.破土.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0728": {
			"y": "开市.交易.立券.纳财.动土.开光.出行.嫁娶.纳采.订盟.出行.纳财.入学.开仓.出货财.纳畜.牧养.栽种.破土.启攒.安葬.立碑.",
			"j": "入宅.移徙.作灶.祭祀.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0725": {
			"y": "祭祀.祈福.求嗣.开光.伐木.出火.拆卸.入宅.安床.修造.动土.上梁.挂匾.纳畜.",
			"j": "嫁娶.栽种.行丧.理发.修坟.行丧.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0718": {
			"y": "祭祀.作灶.纳财.栽种.纳畜.进人口.",
			"j": "安葬.经络.修坟.破土.开市.安床.启攒.立碑.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0708": {
			"y": "补垣.塞穴.结网.入殓.除服.成服.移柩.安葬.启攒.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0717": {
			"y": "嫁娶.开光.出行.祈福.求嗣.解除.拆卸.动土.修造.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.纳畜.入殓.移柩.安葬.",
			"j": "",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0707": {
			"y": "嫁娶.开市.立券.祭祀.祈福.动土.移徙.入宅.",
			"j": "造庙.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0722": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.拆卸.修造.动土.进人口.开市.交易.立券.挂匾.入宅.移徙.栽种.纳畜.入殓.启攒.除服.成服.",
			"j": "",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0726": {
			"y": "解除.祭祀.理发.入殓.安葬.破土.",
			"j": "嫁娶.开市.出火.作灶.置产.斋醮.入宅.移徙.安门.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0716": {
			"y": "嫁娶.开光.出行.理发.作梁.出火.拆卸.修造.开市.交易.立券.挂匾.动土.入宅.移徙.安床.栽种.",
			"j": "伐木.祭祀.纳畜.祭祀.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0712": {
			"y": "嫁娶.祭祀.裁衣.结网.冠笄.沐浴.",
			"j": "开仓.出货财.置产.安葬.动土.破土.掘井.栽种.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0702": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "移徙.入宅.开仓.出货财.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0706": {
			"y": "嫁娶.纳采.订盟.冠笄.造车器.祭祀.开光.祈福.求嗣.出行.解除.伐木.出火.入宅.拆卸.修造.动土.上梁.安床.栽种.破土.",
			"j": "行丧.置产.入宅.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0729": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.入殓.破土.谢土.安葬.",
			"j": "掘井.伐木.纳畜.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0719": {
			"y": "祭祀.祈福.求嗣.开光.开市.牧养.理发.",
			"j": "嫁娶.出行.安葬.入殓.入宅.作灶.冠笄.上梁.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0715": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0826": {
			"y": "祭祀.动土.筑堤.开池.会亲友.塞穴.入殓.移柩.破土.安葬.",
			"j": "开光.出行.修造.上梁.入宅.安门.作灶.裁衣.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0701": {
			"y": "畋猎.捕捉.结网.取渔.祭祀.沐浴.余事勿取.",
			"j": "嫁娶.开市.安葬.启攒.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0703": {
			"y": "祭祀.斋醮.塑绘.开光.出行.修造.动土.造畜椆栖.安床.放水.掘井.开池.作厕.结网.破土.",
			"j": "出火.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0704": {
			"y": "开市.交易.立券.挂匾.开光.解除.拆卸.动土.安床.修造.上梁.置产.栽种.破土.安葬.",
			"j": "作灶.出火.祭祀.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0705": {
			"y": "祭祀.结网.余事勿取.",
			"j": "入宅.出行.掘井.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0709": {
			"y": "嫁娶.纳采.出行.祭祀.祈福.解除.移徙.入宅.",
			"j": "动土.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0710": {
			"y": "嫁娶.祭祀.祈福.斋醮.治病.破土.安葬.",
			"j": "开市.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0711": {
			"y": "嫁娶.出行.开市.安床.入殓.启攒.安葬.",
			"j": "祈福.动土.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0713": {
			"y": "入宅.移徙.安床.开光.祈福.求嗣.进人口.开市.交易.立券.出火.拆卸.修造.动土.",
			"j": "嫁娶.破土.置产.栽种.安葬.修坟.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0714": {
			"y": "祭祀.解除.沐浴.整手足甲.入殓.移柩.破土.启攒.安葬.",
			"j": "嫁娶.入宅.移徙.作灶.开市.交易.安门.栽种.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0720": {
			"y": "祭祀.入殓.破土.除服.成服.移柩.启攒.安葬.谢土.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0721": {
			"y": "祭祀.出行.交易.割蜜.造畜椆栖.",
			"j": "嫁娶.作灶.安葬.动土.词讼.作梁.伐木.掘井.破土.移徙.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0723": {
			"y": "嫁娶.开光.解除.安床.牧养.理发.开市.入殓.启攒.移柩.安葬.扫舍.",
			"j": "作灶.动土.上梁.栽种.入宅.移徙.修造.祈福.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0724": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0730": {
			"y": "祭祀.冠笄.作灶.交易.纳财.栽种.结网.纳畜.牧养.进人口.",
			"j": "开渠.造船.安床.安葬.破土.出行.修坟.掘井.开市.开生坟.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0731": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.纳采.裁衣.冠笄.开光.安床.作梁.修造.动土.作灶.起基.上梁.造屋.纳畜.牧养.",
			"j": "移徙.栽种.出行.行丧.破土.安葬.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0816": {
			"y": "祭祀.解除.沐浴.理发.整手足甲.入殓.移柩.破土.安葬.扫舍.",
			"j": "嫁娶.会亲友.进人口.出行.入宅.移徙.赴任.作灶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0822": {
			"y": "祭祀.结网.入殓.移柩.启攒.安葬.移柩.除服.成服.合寿木.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0812": {
			"y": "订盟.纳采.祭祀.祈福.安机械.作灶.纳畜.",
			"j": "动土.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0802": {
			"y": "嫁娶.祭祀.出行.裁衣.冠笄.交易.雕刻.纳财.造畜椆栖.造车器.雕刻.教牛马.",
			"j": "移徙.入宅.栽种.动土.破土.作灶.安葬.行丧.伐木.上梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0829": {
			"y": "纳采.订盟.开光.出行.解除.安香.出火.拆卸.入宅.移徙.修造.上梁.安床.栽种.纳畜.会亲友.安机械.经络.",
			"j": "伐木.谢土.行丧.祭祀.作灶.动土.破土.安葬.祈福.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0929": {
			"y": "开市.交易.立券.纳财.挂匾.栽种.祭祀.祈福.开光.拆卸.动土.安床.",
			"j": "嫁娶.破土.进人口.出行.入宅.移徙.出火.纳畜.词讼.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0801": {
			"y": "经络.祭祀.沐浴.补垣.塞穴.除服.成服.移柩.入殓.启攒.立碑.",
			"j": "开光.治病.嫁娶.掘井.破土.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0803": {
			"y": "修造.动土.安机械.祭祀.沐浴.解除.拆卸.治病.作灶.造屋.起基.开池.扫舍.造畜椆栖.开生坟.合寿木.安葬.破土.启攒.移柩.入殓.立碑.",
			"j": "开市.入宅.出行.安床.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0804": {
			"y": "嫁娶.纳采.订盟.造车器.开光.出行.拆卸.起基.安床.除服.成服.开市.交易.立券.栽种.牧养.入殓.移柩.启攒.",
			"j": "上梁.入宅.修造.动土.破土.祭祀.祈福.斋醮.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0805": {
			"y": "祭祀.嫁娶.畋猎.结网.",
			"j": "动土.破土.治病.开渠.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0806": {
			"y": "纳采.订盟.会亲友.入学.祭祀.祈福.求嗣.开光.出行.解除.理发.动土.起基.开市.交易.立券.纳财.造仓.栽种.纳畜.牧养.",
			"j": "嫁娶.作灶.出火.置产.嫁娶.入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0807": {
			"y": "嫁娶.祭祀.祈福.斋醮.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0808": {
			"y": "捕捉.结网.入殓.破土.安葬.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0809": {
			"y": "沐浴.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0810": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.移徙.入宅.启攒.安葬.",
			"j": "动土.破土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0811": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求医.治病.动土.移徙.入宅.破土.安葬.",
			"j": "开光.针灸.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0813": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.动土.安床.掘井.破土.启攒.",
			"j": "入宅.作梁.安门.伐木.修造.上梁.入殓.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0814": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.修造.移徙.动土.安床.入殓.破土.安葬.启攒.",
			"j": "造屋.开光.理发.造船.掘井.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0815": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.上梁.造屋.移徙.安门.纳财.牧养.纳畜.安葬.启攒.入殓.",
			"j": "破土.置产.掘井.动土.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0817": {
			"y": "塑绘.开光.进人口.纳畜.补垣.塞穴.栽种.牧养.",
			"j": "嫁娶.纳财.祈福.安葬.修造.开市.交易.立券.动土.上梁.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0818": {
			"y": "祭祀.作灶.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0819": {
			"y": "祭祀.求嗣.开光.出行.伐木.作梁.出火.解除.拆卸.进人口.修造.动土.起基.安床.栽种.纳畜.入殓.破土.安葬.除服.成服.",
			"j": "嫁娶.移徙.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0820": {
			"y": "祭祀.求医.捕捉.栽种.塞穴.入殓.破土.安葬.移柩.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "执",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0821": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0823": {
			"y": "嫁娶.出火.拆卸.祭祀.祈福.开光.伐木.动土.开市.交易.立券.入宅.移徙.安床.纳畜.入殓.安葬.",
			"j": "栽种.作灶.针灸.出行.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0824": {
			"y": "祭祀.开光.解除.移徙.裁衣.开市.立券.祈福.求嗣.进人口.交易.纳财.纳畜.",
			"j": "动土.破土.理发.出行.入宅.分居.安香.出火.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0825": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.安床.栽种.移柩.进人口.会亲友.除服.成服.",
			"j": "造屋.入殓.安葬.伐木.入宅.移徙.置产.纳畜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0827": {
			"y": "祭祀.裁衣.安门.纳财.扫舍.出行.进人口.作灶.纳畜.造畜椆栖.",
			"j": "安床.动土.安葬.开生坟.合寿木.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0828": {
			"y": "祭祀.解除.拆卸.修造.动土.起基.上梁.安床.安门.开渠.开池.入殓.破土.启攒.",
			"j": "嫁娶.出行.进人口.作灶.入宅.移徙.栽种.赴任.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0830": {
			"y": "修饰垣墙.平治道涂.祭祀.沐浴.作灶.",
			"j": "嫁娶.词讼.治病.置产.作梁.祈福.安葬.栽种.伐木.安门.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0831": {
			"y": "嫁娶.祭祀.祈福.求嗣.出火.出行.开光.解除.拆卸.修造.进人口.安香.交易.立券.入宅.移徙.安床.动土.破土.谢土.安葬.入殓.除服.成服.",
			"j": "斋醮.开市.开仓.作灶.造船.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0925": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.开市.交易.立券.挂匾.栽种.纳畜.入殓.安葬.除服.成服.",
			"j": "",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1029": {
			"y": "祭祀.开光.出行.解除.理发.伐木.出火.拆卸.上梁.合脊.安床.造畜椆栖.",
			"j": "嫁娶.安葬.行丧.词讼.造桥.作灶.破土.动土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0901": {
			"y": "破土.安葬.移柩.入殓.祭祀.捕捉.除服.成服.余事勿取.",
			"j": "嫁娶.入宅.开市.交易.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0902": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "祈福.纳采.订盟.嫁娶.入宅.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0903": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.安香.出火.解除.伐木.入宅.移徙.安床.开市.交易.立券.栽种.出火.出行.安葬.",
			"j": "掘井.理发.作灶.动土.破土.开池.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0904": {
			"y": "安机械.纳采.订盟.祭祀.祈福.求嗣.开光.普渡.出行.出火.拆卸.修造.动土.进人口.开市.交易.立券.移徙.安床.栽种.上梁.纳畜.破土.移柩.安葬.",
			"j": "入宅.嫁娶.掘井.牧养.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0905": {
			"y": "嫁娶.祭祀.祈福.求嗣.裁衣.冠笄.经络.修造.进人口.安床.动土.竖柱.上梁.移徙.交易.立券.栽种.会亲友.",
			"j": "行丧.安葬.出行.作梁.纳畜.伐木.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0906": {
			"y": "嫁娶.纳采.订盟.开光.祭祀.出行.理发.动土.安床.放水.开渠.栽种.进人口.",
			"j": "入宅.上梁.入殓.造屋.探病.作灶.安门.安葬.纳畜.伐木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0907": {
			"y": "祭祀.诸事不宜.",
			"j": "入殓.安葬.开市.交易.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0908": {
			"y": "祭祀.裁衣.冠笄.嫁娶.安机械.拆卸.动土.起基.移徙.入宅.入殓.启攒.安葬.造仓.经络.",
			"j": "安床.开光.开市.交易.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0909": {
			"y": "祭祀.出行.成服.除服.沐浴.入殓.",
			"j": "动土.冠笄.移徙.入宅.开市.竖柱.上梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0910": {
			"y": "祭祀.沐浴.赴任.出行.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0911": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0912": {
			"y": "沐浴.入殓.移柩.除服.成服.破土.平治道涂.",
			"j": "嫁娶.移徙.入宅.开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0913": {
			"y": "嫁娶.祭祀.祈福.求嗣.沐浴.出火.出行.拆卸.修造.动土.进人口.开市.交易.立券.入宅.移徙.安床.栽种.纳畜.入殓.安葬.启攒.除服.成服.",
			"j": "",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0914": {
			"y": "开光.解除.起基.动土.拆卸.上梁.立碑.修坟.安葬.破土.启攒.移柩.",
			"j": "嫁娶.出行.安床.作灶.祭祀.入宅.移徙.出火.进人口.置产.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0915": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0916": {
			"y": "嫁娶.祈福.求嗣.出行.出火.拆卸.修造.动土.上梁.开光.进人口.开市.交易.立券.挂匾.安床.入宅.移徙.栽种.伐木.入殓.破土.除服.成服.",
			"j": "",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0917": {
			"y": "开市.交易.立券.挂匾.祭祀.开光.进人口.入宅.安床.出火.拆卸.修造.动土.栽种.",
			"j": "嫁娶.立碑.出行.伐木.安葬.行丧.移徙.纳畜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0918": {
			"y": "祭祀.理发.会亲友.进人口.嫁娶.针灸.入殓.移柩.",
			"j": "探病.开渠.安葬.伐木.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0919": {
			"y": "祭祀.立碑.修坟.启攒.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0920": {
			"y": "嫁娶.出行.伐木.拆卸.修造.动土.移徙.安葬.破土.修坟.立碑.",
			"j": "掘井.祈福.安床.开市.入宅.挂匾.开光.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0921": {
			"y": "祭祀.出行.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0922": {
			"y": "嫁娶.祭祀.塑绘.开光.出行.解除.理发.整手足甲.动土.安床.开池.放水.扫舍.",
			"j": "伐木.行丧.作灶.作梁.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0923": {
			"y": "开市.交易.立券.挂匾.开光.出行.入宅.移徙.安床.出火.上梁.",
			"j": "作灶.行丧.理发.乘船.嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0924": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0926": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0927": {
			"y": "祭祀.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0928": {
			"y": "嫁娶.纳采.订盟.祭祀.开光.出行.理发.作梁.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.移徙.拆卸.挂匾.栽种.纳畜.破土.安葬.入殓.除服.成服.",
			"j": "开市.掘井.开渠.造桥.造船.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0930": {
			"y": "嫁娶.祭祀.理发.进人口.作灶.移柩.冠笄.会亲友.",
			"j": "开仓.出货财.伐木.纳畜.开市.上梁.造屋.破土.启攒.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1025": {
			"y": "嫁娶.祭祀.作灶.纳财.",
			"j": "安葬.开市.修坟.立碑.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1015": {
			"y": "祭祀.解除.裁衣.理发.安床.作灶.造畜椆栖.放水.筑堤.补垣.塞穴.整手足甲.扫舍.",
			"j": "嫁娶.开光.会亲友.掘井.安门.栽种.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d1030": {
			"y": "纳采.订盟.会亲友.沐浴.理发.裁衣.冠笄.安床.除服.成服.启攒.移柩.安葬.会亲友.开生坟.",
			"j": "开市.入宅.出行.嫁娶.修坟.祈福.动土.入宅.安门.谢土.上梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1005": {
			"y": "纳采.订盟.开市.交易.立券.挂匾.纳财.栽种.进人口.入宅.移徙.安床.开光.出火.拆卸.安门.修造.",
			"j": "斋醮.嫁娶.行丧.动土.作灶.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1125": {
			"y": "嫁娶.开光.出行.出火.拆卸.修造.动土.入宅.移徙.安床.上梁.开市.交易.立券.栽种.",
			"j": "祈福.祭祀.伐木.掘井.作灶.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1001": {
			"y": "祭祀.修坟.除服.成服.启攒.移柩.余事勿取.",
			"j": "开市.入宅.嫁娶.动土.破土.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1002": {
			"y": "嫁娶.冠笄.安机械.解除.纳畜.牧养.沐浴.伐木.架马.作梁.安门.扫舍.合寿木.安葬.启攒.立碑.修坟.",
			"j": "祈福.开光.开市.入宅.动土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1003": {
			"y": "祭祀.出行.沐浴.扫舍.安葬.余事勿取.",
			"j": "动土.破土.置产.掘井.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1004": {
			"y": "嫁娶.纳采.祭祀.解除.出行.修造.动土.开市.上梁.安床.整手足甲.扫舍.求医.治病.起基.定磉.造屋.合脊.",
			"j": "造庙.行丧.安葬.伐木.作灶.造船.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1006": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.入宅.安床.出行.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1007": {
			"y": "开光.祈福.求嗣.斋醮.修造.动土.纳财.造仓.作厕.栽种.牧养.会亲友.",
			"j": "作灶.出火.进人口.开渠.入宅.移徙.祭祀.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1008": {
			"y": "入殓.除服.成服.移柩.破土.启攒.安葬.",
			"j": "移徙.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1009": {
			"y": "嫁娶.订盟.纳采.出行.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "开市.赴任.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1010": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1011": {
			"y": "订盟.纳采.会亲友.安机械.纳财.牧养.",
			"j": "祈福.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1012": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "斋醮.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1013": {
			"y": "祭祀.塞穴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1014": {
			"y": "祭祀.祈福.求嗣.开光.开市.出行.解除.动土.起基.置产.栽种.",
			"j": "嫁娶.作灶.修坟.安门.入宅.立碑.安葬.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1016": {
			"y": "祭祀.出行.裁衣.冠笄.会亲友.造畜椆栖.嫁娶.竖柱.上梁.移徙.纳财.纳畜.",
			"j": "动土.伐木.作梁.行丧.安葬.开生坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1017": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.移徙.伐木.安床.纳畜.出火.拆卸.",
			"j": "安葬.修坟.作灶.破土.造庙.动土.嫁娶.纳采.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1018": {
			"y": "开市.交易.立券.纳财.会亲友.开光.理发.入殓.移柩.安葬.启攒.",
			"j": "嫁娶.作灶.出火.出行.入宅.移徙.安床.祈福.上梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1019": {
			"y": "造畜椆栖.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1020": {
			"y": "入殓.破土.安葬.启攒.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1021": {
			"y": "祭祀.入殓.移柩.开生坟.破土.启攒.安葬.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1022": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1023": {
			"y": "嫁娶.求嗣.纳采.进人口.纳财.结网.纳畜.牧养.会亲友.",
			"j": "上梁.作灶.伐木.出行.安葬.安门.理发.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1024": {
			"y": "嫁娶.祭祀.开市.开光.出行.入宅.移徙.出火.拆卸.修造.安床.",
			"j": "纳畜.伐木.置产.作梁.行丧.安葬.修坟.立碑.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1026": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.进人口.开市.交易.立券.挂匾.纳财.入宅.移徙.栽种.破土.谢土.",
			"j": "安床.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1027": {
			"y": "嫁娶.祭祀.祈福.求嗣.动土.安床.扫舍.入殓.移柩.破土.启攒.安葬.作灶.整手足甲.补垣.除服.成服.",
			"j": "开光.栽种.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1028": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.上梁.入宅.移徙.安床.安门.纳财.纳畜.造畜椆栖.",
			"j": "伐木.行丧.破土.嫁娶.安葬.开渠.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1031": {
			"y": "解除.祭祀.修饰垣墙.平治道涂.造畜椆栖.余事勿取.",
			"j": "嫁娶.开市.交易.入宅.入学.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1121": {
			"y": "安床.祭祀.开池.补垣.入殓.移柩.破土.启攒.",
			"j": "入宅.移徙.嫁娶.掘井.作灶.出火.进人口.开市.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1221": {
			"y": "入宅.安床.开光.祭祀.出火.拆卸.动土.挂匾.入殓.破土.安葬.纳畜.",
			"j": "嫁娶.开市.作灶.置产.作梁.伐木.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1101": {
			"y": "入殓.破土.启攒.安葬.除服.成服.余事勿取.",
			"j": "开市.入宅.祭祀.置产.补垣.塞穴.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1102": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.拆卸.修造.动土.上梁.安床.纳畜.入殓.破土.",
			"j": "入宅.移徙.掘井.理发.伐木.交易.开市.作灶.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1103": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "嫁娶.入宅.上梁.出行.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1104": {
			"y": "祭祀.求嗣.冠笄.进人口.会亲友.安门.安床.经络.纳财.牧养.畋猎.放水.割蜜.",
			"j": "祈福.斋醮.纳采.订盟.嫁娶.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1105": {
			"y": "嫁娶.纳采.订盟.开市.交易.立券.挂匾.祭祀.祈福.开光.造车器.挂匾.出行.入宅.移徙.安床.安门.拆卸.修造.动土.栽种.安葬.破土.启攒.除服.成服.入殓.立碑.",
			"j": "探病.纳畜.伐木.起基.作梁.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1106": {
			"y": "祭祀.冠笄.移徙.会亲友.纳财.理发.捕捉.",
			"j": "嫁娶.开市.开池.作厕.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1107": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1108": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1109": {
			"y": "祈福.斋醮.出行.订盟.纳采.入殓.移柩.破土.安葬.立碑.结网.",
			"j": "入宅.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1110": {
			"y": "祭祀.沐浴.出行.冠笄.进人口.余事勿取.",
			"j": "嫁娶.动土.安葬.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1111": {
			"y": "祭祀.祈福.斋醮.塑绘.开光.订盟.纳采.裁衣.冠笄.嫁娶.拆卸.入宅.安香.入殓.移柩.理发.安葬.修坟.谢土.赴任.移徙.沐浴.治病.破土.启攒.整手足甲.入学.作梁.",
			"j": "开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1112": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1113": {
			"y": "开市.交易.立券.挂匾.纳财.开光.出行.入宅.移徙.安床.纳畜.入殓.移柩.安葬.",
			"j": "栽种.破土.置产.祭祀.嫁娶.动土.作灶.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1114": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.出行.拆卸.进人口.入宅.移徙.安床.栽种.动土.修造.纳畜.入殓.安葬.立碑.除服.成服.",
			"j": "",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1115": {
			"y": "开光.解除.拆卸.修造.动土.安床.纳畜.安葬.启攒.入殓.",
			"j": "嫁娶.开市.出火.栽种.破土.动土.入宅.移徙.安香.分居.掘井.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1116": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1117": {
			"y": "嫁娶.祭祀.开光.出火.出行.拆卸.修造.动土.解除.开市.交易.立券.挂匾.纳财.入宅.移徙.安床.栽种.纳畜.",
			"j": "探病.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1118": {
			"y": "祭祀.祈福.求嗣.开光.解除.理发.会亲友.栽种.纳畜.牧养.安葬.修坟.立碑.启攒.",
			"j": "入宅.作灶.词讼.移徙.出行.赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1119": {
			"y": "祭祀.沐浴.结网.移柩.入殓.除服.成服.",
			"j": "安床.开市.交易.出货财.安葬.修坟.嫁娶.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1120": {
			"y": "解除.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "开",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1122": {
			"y": "祭祀.沐浴.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1123": {
			"y": "嫁娶.开光.出行.解除.出火.拆卸.修造.进人口.动土.入宅.移徙.栽种.纳畜.掘井.安葬.除服.成服.",
			"j": "置产.安床.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1124": {
			"y": "开光.裁衣.安门.会亲友.安床.结网.理发.",
			"j": "嫁娶.冠笄.出行.祈福.安葬.伐木.入宅.移徙.出火.栽种.动土.上梁.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1126": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.出行.拆卸.开市.交易.立券.挂匾.伐木.入宅.移徙.安床.安葬.",
			"j": "栽种.掘井.置产.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1127": {
			"y": "祭祀.理发.针灸.解除.进人口.整手足甲.",
			"j": "嫁娶.动土.造船.开池.掘井.出行.修造.入宅.上梁.移徙.安葬.破土.作灶.开市.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1128": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1129": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.雕刻.移徙.开市.入宅.出行.动土.会亲友.入学.修造.动土.起基.安门.安床.造庙.解除.纳财.开池.造畜椆栖.牧养.牧养.",
			"j": "上梁.开仓.出货财.造屋.造船.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1130": {
			"y": "祭祀.祈福.求嗣.开光.解除.伐木.拆卸.修造.栽种.纳畜.安葬.修坟.立碑.",
			"j": "嫁娶.进人口.入宅.移徙.出火.出行.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1228": {
			"y": "沐浴.冠笄.补垣.塞穴.合帐.裁衣.修造.作梁.开柱眼.安碓硙.筑堤.作厕.断蚁.",
			"j": "移徙.入宅.嫁娶.祈福.开光.掘井.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1226": {
			"y": "祭祀.开光.理发.整手足甲.安床.作灶.扫舍.教牛马.",
			"j": "伐木.纳畜.破土.安葬.开生坟.嫁娶.开市.动土.交易.作梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1206": {
			"y": "祭祀.塑绘.理发.会亲友.牧养.开池.造畜椆栖.畋猎.结网.",
			"j": "祈福.谢土.安葬.上梁.作灶.开市.嫁娶.出行.入宅.动土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1223": {
			"y": "破屋.坏垣.祭祀.沐浴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1225": {
			"y": "解除.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1201": {
			"y": "沐浴.扫舍.捕捉.畋猎.解除.塞穴.余事勿取.",
			"j": "嫁娶.入宅.开市.安床.破土.修坟.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1202": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.斋醮.开光.出行.解除.动土.开市.交易.立券.挂匾.拆卸.破土.",
			"j": "伐木.上梁.修造.入殓.理发.会亲友.入宅.安门.安葬.作灶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1203": {
			"y": "合帐.裁衣.嫁娶.安床.入殓.移柩.破土.造畜椆栖.",
			"j": "置产.造船.开光.掘井.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1204": {
			"y": "解除.修饰垣墙.冠笄.出行.余事勿取.",
			"j": "开市.动土.破土.嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1205": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.开光.出行.解除.进人口.开市.立券.挂匾.入宅.移徙.安门.栽种.动土.求医.治病.会亲友.起基.修造.造屋.安葬.",
			"j": "作灶.经络.安床.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1207": {
			"y": "开市.立券.开光.解除.安机械.上梁.启攒.安葬.",
			"j": "嫁娶.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1208": {
			"y": "平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1209": {
			"y": "求嗣.斋醮.塑绘.订盟.纳采.出火.拆卸.修造.动土.造桥.安机械.栽种.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.",
			"j": "开市.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1210": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.修造.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1211": {
			"y": "治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1212": {
			"y": "祭祀.祈福.求嗣.斋醮.开光.入学.订盟.冠笄.伐木.修造.动土.起基.放水.交易.开池.",
			"j": "造桥.安门.理发.造庙.栽种.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1213": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1214": {
			"y": "沐浴.理发.扫舍.",
			"j": "伐木.纳畜.上梁.入宅.作灶.造畜椆栖.嫁娶.安葬.作梁.造船.安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d1215": {
			"y": "祭祀.开光.祈福.解除.作梁.动土.安床.掘井.栽种.纳畜.破土.移柩.",
			"j": "嫁娶.出行.赴任.造屋.入殓.入宅.移徙.出火.进人口.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1216": {
			"y": "诸事不宜.作梁.修造.动土.安门.作灶.塞穴.开池.作厕.筑堤.补垣.栽种.",
			"j": "嫁娶.祈福.掘井.行丧.安葬.安床.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1217": {
			"y": "安葬.启攒.移柩.入殓.除服.成服.",
			"j": "余事勿取.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1218": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.",
			"j": "作灶.塑绘.行丧.词讼.伐木.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1219": {
			"y": "理发.开光.解除.拆卸.修造.安葬.开市.交易.立券.挂匾.安床.栽种.",
			"j": "入宅.移徙.作灶.祈福.祭祀.嫁娶.谢土.掘井.造屋.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1220": {
			"y": "祭祀.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1222": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1224": {
			"y": "安床.祭祀.祈福.求嗣.冠笄.伐木.架马.动土.开池.作厕.结网.入殓.除服.成服.",
			"j": "安门.栽种.作灶.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1227": {
			"y": "祭祀.祈福.求嗣.开光.拆卸.修造.动土.上梁.安床.置产.栽种.破土.",
			"j": "嫁娶.进人口.安葬.出行.赴任.入宅.移徙.入殓.开渠.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1229": {
			"y": "交易.进人口.祭祀.沐浴.捕捉.入殓.除服.成服.安葬.谢土.启攒.修坟.",
			"j": "斋醮.入宅.修造.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1230": {
			"y": "嫁娶.纳采.订盟.造车器.祭祀.祈福.造庙.安香.出火.出行.归宁.入学.入宅.交易.立券.求医.治病.修造.动土.竖柱.上梁.造屋.起基.安门.",
			"j": "斋醮.伐木.作梁.安葬.行丧.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1231": {
			"y": "纳采.订盟.开市.交易.立券.出行.会亲友.安机械.竖柱.上梁.平治道涂.伐木.拆卸.造屋.起基.安床.安门.解除.安葬.启攒.除服.成服.修坟.立碑.移柩.入殓.",
			"j": "嫁娶.动土.破土.祈福.出火.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		}
	};


/***/ },
/* 16 */
/***/ function(module, exports) {

	window.HuangLi = window.HuangLi || {};
	HuangLi.y2013 = {
		"d0101": {
			"y": "祭祀.平治道涂.除服.成服.安葬.余事勿取.",
			"j": "嫁娶.入宅.纳采.订盟.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0201": {
			"y": "祭祀.斋醮.纳财.捕捉.畋猎.",
			"j": "嫁娶.开市.入宅.安床.破土.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0102": {
			"y": "纳采.订盟.祭祀.祈福.开光.安香.出火.出行.会亲友.安机械.修造.动土.竖柱.上梁.造屋.起基.定磉.安床.安门.拆卸.移徙.造桥.造船.安葬.破土.入殓.",
			"j": "开市.造庙.置产.掘井.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0103": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.斋醮.进人口.会亲友.伐木.作梁.开柱眼.安床.掘井.捕捉.畋猎.",
			"j": "开生坟.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0104": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "移徙.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0105": {
			"y": "解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0106": {
			"y": "塑绘.开光.出行.订盟.纳采.除服.成服.嫁娶.纳婿.入殓.移柩.启攒.安葬.立碑.",
			"j": "入宅.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0107": {
			"y": "入殓.除服.成服.移柩.启攒.安葬.立碑.余事勿取.",
			"j": "破土.伐木.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0108": {
			"y": "祭祀.祈福.斋醮.塑绘.开光.除服.成服.入殓.作灶.嫁娶.捕捉.畋猎.纳财.",
			"j": "开仓.造屋.安葬.安床.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0109": {
			"y": "祭祀.出行.沐浴.裁衣.祈福.斋醮.订盟.纳采.嫁娶.安机械.开市.立券.安碓硙.纳畜.",
			"j": "栽种.嫁娶.入殓.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0110": {
			"y": "祭祀.祈福.斋醮.沐浴.安床.安机械.造车器.入殓.移柩.启攒.安葬.立碑.合帐.经络.交易.",
			"j": "作灶.掘井.嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0111": {
			"y": "解除.扫舍.祭祀.教牛马.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0112": {
			"y": "开市.交易.立券.挂匾.开光.解除.伐木.作梁.出火.入宅.移徙.安床.拆卸.动土.上梁.栽种.纳畜.安葬.",
			"j": "嫁娶.祭祀.出行.置产.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0113": {
			"y": "开市.交易.立券.纳财.开池.补垣.嫁娶.纳采.纳畜.取渔.安床.",
			"j": "修造.上梁.入宅.祈福.探病.掘井.动土.安门.安葬.作灶.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0114": {
			"y": "祭祀.解除.修饰垣墙.平治道涂.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0115": {
			"y": "嫁娶.祭祀.祈福.求嗣.动土.会亲友.起基.造仓.纳畜.牧养.作厕.进人口.",
			"j": "掘井.安葬.栽种.出行.作灶.开市.入宅.安门.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0116": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.入宅.移徙.安床.修造.动土.进人口.",
			"j": "掘井.安葬.栽种.出行.作灶.开市.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0117": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0118": {
			"y": "嫁娶.开市.交易.立券.开光.出行.出火.拆卸.修造.入宅.移徙.动土.破土.移柩.安葬.启攒.除服.成服.",
			"j": "安床.伐木.祈福.纳畜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0119": {
			"y": "祭祀.入殓.破土.除服.成服.启攒.安葬.修坟.立碑.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0120": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0121": {
			"y": "开市.交易.立券.纳财.纳畜.造畜椆栖.入宅.移徙.安床.开光.祈福.求嗣.动土.",
			"j": "嫁娶.栽种.安葬.理发.造庙.作灶.入殓.行丧.造桥.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0122": {
			"y": "安床.裁衣.交易.立券.入殓.移柩.安葬.除服.成服.",
			"j": "置产.嫁娶.出行.开光.栽种.动土.破土.入宅.治病.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0123": {
			"y": "祭祀.解除.造畜椆栖.教牛马.针灸.余事勿取.",
			"j": "嫁娶.动土.开池.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0124": {
			"y": "沐浴.塑绘.开光.纳采.订盟.开市.交易.立券.纳财.起基.动土.定磉.放水.安葬.破土.启攒.修坟.立碑.移柩.",
			"j": "入宅.安门.祭祀.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0125": {
			"y": "嫁娶.出行.理发.安床.启攒.安葬.修坟.开市.交易.立券.纳财.开池.牧养.",
			"j": "掘井.祈福.谢土.动土.入宅.上梁.修造.作灶.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0126": {
			"y": "解除.平治道涂.余事勿取.",
			"j": "移徙.入宅.掘井.造庙.栽种.针灸.治病.开池.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0127": {
			"y": "嫁娶.祭祀.开光.伐木.出火.拆卸.入宅.移徙.修造.动土.上梁.安床.纳畜.",
			"j": "开市.行丧.栽种.出行.出货财.安葬.置产.词讼.治病.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0128": {
			"y": "嫁娶.纳采.订盟.入宅.移徙.安床.祭祀.祈福.开光.出行.解除.出火.拆卸.动土.纳畜.谢土.安葬.破土.",
			"j": "伐木.开市.交易.上梁.作灶.安门.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0129": {
			"y": "祭祀.破屋.坏垣.解除.余事勿取.",
			"j": "开市.动土.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0130": {
			"y": "嫁娶.纳采.订盟.开光.安香.出火.纳财.开市.交易.立券.裁衣.造屋.起基.修造.动土.安门.移徙.入宅.栽种.牧养.畋猎.掘井.开池.安葬.破土.入殓.除服.成服.立碑.",
			"j": "祈福.造庙.祭祀.安床.谢土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0131": {
			"y": "祭祀.斋醮.入殓.破土.启攒.安葬.修坟.立碑.除服.成服.",
			"j": "嫁娶.入宅.作灶.纳采.订盟.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0216": {
			"y": "祭祀.合帐.裁衣.经络.伐木.作梁.安床.作灶.入殓.安葬.启攒.移柩.",
			"j": "词讼.出火.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0206": {
			"y": "嫁娶.安床.开光.出行.祭祀.动土.出火.解除.会亲友.开市.交易.立券.挂匾.入宅.移徙.拆卸.破土.启攒.安葬.",
			"j": "掘井.词讼.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0219": {
			"y": "嫁娶.冠笄.纳采.出行.会亲友.上梁.安机械.安床.牧养.畋猎.祭祀.祈福.开光.修造.安门.造屋.起基.",
			"j": "入宅.作灶.治病.安葬.移徙.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0226": {
			"y": "祭祀.沐浴.理发.作灶.结网.栽种.",
			"j": "嫁娶.词讼.行丧.安葬.牧养.伐木.作梁.开市.纳畜.造畜椆栖.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0224": {
			"y": "祭祀.斋醮.沐浴.开生坟.除服.成服.移柩.入殓.破土.安葬.合寿木.",
			"j": "开市.嫁娶.安床.会亲友.入宅.作灶.上梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0214": {
			"y": "移徙.祭祀.开光.祈福.出行.解除.进人口.雇庸.安床.动土.起基.上梁.安门.解除.",
			"j": "嫁娶.安葬.破土.作梁.纳畜.牧养.行丧.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0204": {
			"y": "祭祀.祈福.求嗣.入殓.启攒.安葬.移柩.",
			"j": "开光.掘井.针灸.出行.嫁娶.入宅.移徙.作灶.动土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0221": {
			"y": "造车器.纳采.订盟.祭祀.祈福.求嗣.移徙.出行.开市.出火.入宅.立券.交易.入宅.安门.安床.安葬.谢土.",
			"j": "开光.造屋.动土.作灶.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0326": {
			"y": "祭祀.祈福.求嗣.斋醮.嫁娶.冠笄.出行.开市.交易.会亲友.教牛马.除服.成服.启攒.安葬.移柩.",
			"j": "祈福.动土.移徙.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0202": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.斋醮.沐浴.进人口.会亲友.入学.治病.安碓硙.掘井.开池.纳畜.牧养.造畜椆栖.",
			"j": "嫁娶.合帐.入宅.行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0203": {
			"y": "祭祀.祈福.求嗣.沐浴.问名.交易.纳财.入殓.移柩.安葬.修坟.立碑.谢土.造畜椆栖.教牛马.",
			"j": "入宅.置产.嫁娶.动土.栽种.开市.开光.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0205": {
			"y": "安床.解除.裁衣.竖柱.上梁.交易.立券.纳财.纳畜.牧养.入殓.移柩.安葬.启攒.",
			"j": "嫁娶.出行.动土.开渠.入宅.祭祀.掘井.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0207": {
			"y": "嫁娶.开光.求嗣.会亲友.安床.牧养.塑绘.针灸.",
			"j": "入宅.移徙.出火.分居.安香.作灶.开市.交易.立券.安葬.动土.伐木.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0316": {
			"y": "开光.塑绘.求嗣.纳采.裁衣.合帐.冠笄.安机械.作梁.开柱眼.安门.安床.造仓.祭祀.会亲友.祈福.经络.纳财.开市.立券.交易.入学.求嗣.理发.架马.",
			"j": "出行.斋醮.安葬.嫁娶.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0208": {
			"y": "作灶.解除.平治道涂.",
			"j": "栽种.出行.祈福.行丧.纳畜.安葬.安门.伐木.作梁.牧养.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0209": {
			"y": "解除.沐浴.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0210": {
			"y": "嫁娶.祭祀.祈福.出行.解除.出火.拆卸.动土.入宅.移徙.安床.上梁.栽种.纳畜.破土.启攒.安葬.",
			"j": "开市.立券.理发.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0211": {
			"y": "祭祀.解除.治病.破屋.坏垣.扫舍.",
			"j": "余事勿取.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0212": {
			"y": "祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.入宅.移徙.上梁.挂匾.开池.入殓.安葬.破土.启攒.",
			"j": "嫁娶.作灶.安床.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0213": {
			"y": "结网.入殓.除服.成服.移柩.安葬.破土.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0215": {
			"y": "嫁娶.开光.祈福.求嗣.解除.动土.安床.栽种.开池.掘井.祭祀.破土.启攒.",
			"j": "入宅.作灶.伐木.安葬.出火.出行.纳畜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0217": {
			"y": "裁衣.伐木.作梁.纳财.交易.立券.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0218": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.动土.上梁.进人口.入宅.移徙.安床.开市.交易.立券.挂匾.入殓.破土.安葬.启攒.除服.成服.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0220": {
			"y": "修饰垣墙.平治道涂.祭祀.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0222": {
			"y": "动土.入殓.嫁娶.移柩.安葬.破土.",
			"j": "开市.作灶.安床.入宅.上梁.裁衣.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0223": {
			"y": "求医.治病.破屋.坏垣.余事勿取.",
			"j": "开市.嫁娶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0225": {
			"y": "祭祀.塞穴.结网.破土.谢土.安葬.移柩.除服.成服.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0227": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.开市.交易.立券.动土.纳财.掘井.会亲友.",
			"j": "入宅.安葬.伐木.作梁.纳畜.造畜椆栖.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0228": {
			"y": "祭祀.祈福.求嗣.纳畜.入殓.启攒.谢土.除服.成服.",
			"j": "栽种.开光.出行.针灸.嫁娶.入宅.动土.破土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0327": {
			"y": "塞穴.整手足甲.解除.捕捉.畋猎.结网.余事勿取.诸事不宜.",
			"j": "嫁娶.作灶.掘井.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0427": {
			"y": "沐浴.塞穴.畋猎.结网.取渔.扫舍.余事勿取.",
			"j": "祈福.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0301": {
			"y": "开光.解除.伐木.竖柱.上梁.交易.立券.纳畜.入殓.移柩.安葬.",
			"j": "入宅.出行.移徙.祭祀.嫁娶.动土.破土.作灶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0302": {
			"y": "祭祀.祈福.求嗣.开光.嫁娶.出行.解除.伐木.拆卸.进人口.安床.动土.起基.上梁.栽种.纳畜.破土.谢土.启攒.安葬.",
			"j": "移徙.入宅.出火.作灶.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0303": {
			"y": "会亲友.冠笄.安床.会亲友.安机械.祭祀.祈福.求嗣.经络.",
			"j": "嫁娶.开市.动土.作灶.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0304": {
			"y": "作灶.解除.平治道涂.余事勿取.",
			"j": "祭祀.祈福.安葬.安门.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0305": {
			"y": "冠笄.入殓.除服.成服.移柩.平治道涂.修饰垣墙.",
			"j": "造屋.作灶.治病.探病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0306": {
			"y": "祭祀.嫁娶.祈福.纳采.裁衣.合帐.安床.入宅.安香.入殓.移柩.安葬.谢土.修造.安碓硙.求嗣.会亲友.挂匾.交易.立券.纳财.造仓.放水.",
			"j": "栽种.伐木.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0307": {
			"y": "祭祀.祈福.斋醮.订盟.纳采.裁衣.合帐.拆卸.修造.动土.上梁.起基.移柩.安葬.谢土.沐浴.扫舍.开柱眼.伐木.出火.",
			"j": "安床.开市.立券.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0308": {
			"y": "破屋.坏垣.求医.治病.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0309": {
			"y": "祭祀.动土.上梁.订盟.纳采.嫁娶.安机械.拆卸.安床.入宅.安香.入殓.移柩.破土.安葬.立碑.谢土.赴任.出行.移徙.祈福.求嗣.解除.造仓.进人口.",
			"j": "开光.出货财.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0310": {
			"y": "祭祀.开光.塑绘.纳采.裁衣.拆卸.安床.起基.动土.竖柱.上梁.移徙.入宅.安香.开市.立券.挂匾.沐浴.出行.求嗣.安门.",
			"j": "嫁娶.栽种.伐木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0311": {
			"y": "裁衣.合帐.冠笄.嫁娶.纳婿.安床.入殓.纳财.",
			"j": "作灶.开市.安葬.作梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0312": {
			"y": "祭祀.订盟.纳采.修造.动土.祈福.塑绘.斋醮.沐浴.拆卸.起基.入宅.安香.造庙.移柩.谢土.除服.成服.入学.习艺.出行.竖柱.上梁.掘井.求嗣.解除.伐木.",
			"j": "作灶.安葬.开市.造屋.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0313": {
			"y": "订盟.纳采.裁衣.合帐.冠笄.安机械.拆卸.安床.入殓.除服.成服.移柩.破土.启攒.安葬.修坟.立碑.经络.交易.立券.纳财.筑堤.造仓.补垣.塞穴.纳畜.伐木.架马.",
			"j": "祭祀.开光.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0314": {
			"y": "祭祀.出行.嫁娶.冠笄.安床.入殓.移柩.安葬.",
			"j": "掘井.动土.作灶.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0315": {
			"y": "塞穴.诸事不宜.",
			"j": "安门.作灶.安葬.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0317": {
			"y": "祭祀.嫁娶.纳婿.安葬.",
			"j": "栽种.造屋.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0318": {
			"y": "祭祀.会亲友.订盟.裁衣.合帐.安机械.拆卸.上梁.安门.入殓.除服.成服.移柩.启攒.安葬.立碑.开光.塑绘.入学.出行.起基.定磉.放水.移徙.入宅.竖柱.立券.经络.",
			"j": "伐木.作梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0319": {
			"y": "祭祀.开光.塑绘.祈福.斋醮.裁衣.合帐.冠笄.嫁娶.拆卸.动土.移徙.入宅.入殓.移柩.安葬.谢土.求嗣.入学.理发.伐木.架马.作梁.出火.修造.起基.定磉.放水.赴任.",
			"j": "入宅.安门.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0320": {
			"y": "祭祀.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0321": {
			"y": "嫁娶.祭祀.出行.冠笄.立券.交易.进人口.开市.移徙.修造.动土.安床.入殓.移柩.破土.",
			"j": "开光.作灶.斋醮.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0322": {
			"y": "开市.立券.交易.挂匾.祭祀.祈福.开光.入宅.移徙.安床.拆卸.动土.上梁.进人口.",
			"j": "嫁娶.行丧.架马.作梁.理发.牧养.安葬.纳畜.伐木.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0323": {
			"y": "理发.冠笄.嫁娶.进人口.",
			"j": "置产.伐木.纳畜.造畜椆栖.安葬.破土.作梁.作灶.开生坟.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0324": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出火.入宅.移徙.安床.拆卸.动土.破土.谢土.",
			"j": "合帐.开市.安葬.入殓.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0325": {
			"y": "安床.伐木.拆卸.修造.动土.上梁.立券.交易.栽种.纳畜.牧养.入殓.安葬.",
			"j": "嫁娶.祭祀.开光.出行.出火.移徙.入宅.安门.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0328": {
			"y": "纳财.开市.立券.交易.开光.安床.上梁.造屋.修造.起基.",
			"j": "动土.破土.安葬.行丧.赴任.出行.嫁娶.入宅.移徙.谢土.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0329": {
			"y": "祭祀.祈福.嫁娶.冠笄.修饰垣墙.置产.平治道涂.",
			"j": "开仓.出货财.造屋.作灶.开市.交易.立券.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0330": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.出火.进人口.入宅.移徙.安床.拆卸.修造.安门.挂匾.纳财.扫舍.",
			"j": "动土.伐木.安葬.行丧.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0331": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.出行.出火.入宅.移徙.解除.栽种.伐木.破土.谢土.安葬.",
			"j": "开市.交易.作灶.纳财.上梁.安床.造屋.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0426": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.开市.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0416": {
			"y": "祭祀.祈福.求嗣.开光.解除.纳采.冠笄.出火.拆卸.进人口.安床.动土.上梁.造庙.掘井.开池.入殓.移柩.安葬.破土.",
			"j": "",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0428": {
			"y": "开市.交易.立券.挂匾.祭祀.开光.祈福.求嗣.安床.解除.修造.安葬.",
			"j": "纳采.问名.订盟.嫁娶.入宅.开仓.出火.动土.破土.纳畜.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0430": {
			"y": "安香.出火.纳采.订盟.嫁娶.开市.立券.交易.挂匾.开光.出行.解除.安床.栽种.置产.拆卸.修造.动土.",
			"j": "作灶.安葬.祭祀.入殓.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0425": {
			"y": "祭祀.解除.入殓.移柩.启攒.安葬.整手足甲.捕捉.畋猎.取渔.除服.成服.扫舍.谢土.斋醮.",
			"j": "动土.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0420": {
			"y": "祭祀.出行.教牛马.扫舍.余事勿取.",
			"j": "开光.伐木.安葬.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0527": {
			"y": "塞穴.断蚁.结网.畋猎.余事勿取.",
			"j": "嫁娶.安葬.入宅.出行.动土.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0401": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "开光.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0402": {
			"y": "纳采.交易.立券.安床.安机械.安葬.移柩.动土.破土.立碑.",
			"j": "嫁娶.开光.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0403": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.开光.理发.经络.解除.治病.治病.立碑.栽种.牧养.掘井.开池.",
			"j": "嫁娶.定磉.合寿木.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0404": {
			"y": "",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0405": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0406": {
			"y": "嫁娶.开光.出行.出火.拆卸.进人口.开市.立券.交易.挂匾.入宅.移徙.安床.栽种.",
			"j": "祈福.入殓.祭祀.作灶.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0407": {
			"y": "嫁娶.出行.合帐.冠笄.安床.除服.成服.作灶.交易.立券.入殓.移柩.破土.安葬.",
			"j": "词讼.开光.开市.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0408": {
			"y": "出行.修饰垣墙.造畜椆栖.教牛马.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0409": {
			"y": "祭祀.祈福.开光.求嗣.解除.伐木.出火.入宅.移徙.安床.拆卸.修造.动土.造畜椆栖.",
			"j": "嫁娶.纳财.安葬.出行.开市.立券.作灶.栽种.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0410": {
			"y": "纳采.嫁娶.开光.出行.理发.会亲友.开市.安床.栽种.牧养.入殓.移柩.启攒.",
			"j": "谢土.祈福.上梁.作灶.斋醮.修造.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0411": {
			"y": "祭祀.平治道涂.解除.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0412": {
			"y": "祭祀.祈福.开光.解除.动土.纳财.交易.纳畜.扫舍.",
			"j": "进人口.出行.嫁娶.置产.安床.赴任.安葬.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0413": {
			"y": "祭祀.祈福.求嗣.开光.解除.出火.拆卸.入宅.安床.修造.安门.纳畜.启攒.安葬.",
			"j": "动土.破土.纳财.掘井.挂匾.开市.伐木.交易.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0414": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0415": {
			"y": "塞穴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0417": {
			"y": "解除.破屋.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0418": {
			"y": "嫁娶.祈福.求嗣.开光.出行.解除.拆卸.出火.开市.立券.交易.入宅.移徙.安床.动土.破土.谢土.",
			"j": "祭祀.入殓.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0419": {
			"y": "祭祀.裁衣.冠笄.安床.交易.立券.开池.补垣.塞穴.入殓.破土.启攒.安葬.谢土.除服.成服.",
			"j": "嫁娶.掘井.探病.开市.开光.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0421": {
			"y": "祭祀.祈福.求嗣.开光.纳采.订盟.解除.栽种.纳畜.牧养.扫舍.进人口.",
			"j": "修坟.造桥.作灶.出行.安葬.造屋.入宅.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0422": {
			"y": "开光.出行.交易.塞穴.嫁娶.理发.开市.安床.",
			"j": "祈福.出火.置产.动土.破土.安葬.修造.上梁.置产.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0423": {
			"y": "祭祀.作灶.畋猎.结网.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.安床.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0424": {
			"y": "沐浴.祭祀.解除.安葬.破土.谢土.移柩.余事勿取.",
			"j": "斋醮.开光.嫁娶.入宅.上梁.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0429": {
			"y": "祭祀.修门.取渔.纳财.纳畜.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0627": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "移徙.入宅.开仓.出货财.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0501": {
			"y": "祭祀.出行.修造.动土.合帐.造畜椆栖.安床.移徙.入殓.移柩.破土.启攒.安葬.开生坟.合寿木.补垣.塞穴.",
			"j": "移徙.入宅.作灶.理发.开光.安门.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0502": {
			"y": "祭祀.修饰垣墙.余事勿取.",
			"j": "开光.修造.动土.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0503": {
			"y": "嫁娶.祭祀.祈福.求嗣.斋醮.开光.出火.移徙.入宅.竖柱.上梁.会亲友.造屋.起基.治病.治病.安门.造车器.掘井.开池.",
			"j": "纳采.出行.修坟.安葬.开市.立券.作灶.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0504": {
			"y": "祭祀.塑绘.开光.纳采.嫁娶.开市.出行.会亲友.安床.结网.除服.成服.启攒.安葬.移柩.",
			"j": "祈福.入宅.造屋.动土.破土.探病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0505": {
			"y": "订盟.纳采.会亲友.安床.作灶.造畜椆栖.",
			"j": "开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0506": {
			"y": "沐浴.平治道涂.扫舍.入殓.移柩.破土.启攒.安葬.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0507": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.动土.上梁.进人口.入宅.移徙.安床.安门.开市.交易.立券.挂匾.栽种.破土.安葬.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0508": {
			"y": "祭祀.开光.出行.解除.塑绘.裁衣.入殓.移柩.破土.启攒.安葬.除服.成服.",
			"j": "嫁娶.上梁.修造.拆卸.架马.入宅.伐木.动土.出火.开柱眼.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0509": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0510": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.拆卸.动土.上梁.出火.进人口.入宅.移徙.安床.栽种.纳畜.牧养.竖柱.安门.修造.解除.会亲友.",
			"j": "",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0511": {
			"y": "开市.交易.立券.祭祀.祈福.开光.伐木.进人口.安床.拆卸.修造.动土.栽种.破土.移柩.安葬.",
			"j": "入宅.移徙.理发.出火.嫁娶.出行.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0512": {
			"y": "结网.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0513": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.开市.交易.立券.安床.出行.拆卸.",
			"j": "纳畜.入宅.移徙.安葬.探病.伐木.上梁.安门.入殓.动土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0514": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.修造.动土.入宅.移徙.安床.作灶.塞穴.栽种.破土.安葬.",
			"j": "开光.掘井.开仓.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0515": {
			"y": "解除.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0516": {
			"y": "开市.交易.立券.挂匾.开光.出行.拆卸.进人口.入宅.移柩.动土.安门.上梁.栽种.破土.修坟.安葬.",
			"j": "嫁娶.安床.探病.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0517": {
			"y": "进人口.会亲友.",
			"j": "塞穴.上梁.动土.伐木.安葬.词讼.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0518": {
			"y": "沐浴.平治道涂.扫舍.入殓.破土.安葬.除服.成服.",
			"j": "嫁娶.移徙.伐木.作梁.安床.祭祀.祈福.造屋.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0519": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.出行.拆卸.动土.解除.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.安门.上梁.安葬.破土.谢土.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0520": {
			"y": "祭祀.祈福.求嗣.开光.解除.合帐.冠笄.伐木.架马.作梁.修造.进人口.嫁娶.裁衣.合帐.安床.动土.起基.上梁.竖柱.放水.会亲友.",
			"j": "",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0521": {
			"y": "破屋.坏垣.沐浴.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0522": {
			"y": "纳采.订盟.嫁娶.造车器.祭祀.祈福.求嗣.开光.出火.拆卸.修造.动土.进人口.挂匾.入宅.移徙.安床.栽种.入殓.破土.安葬.除服.成服.",
			"j": "开市.立券.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0523": {
			"y": "开市.交易.立券.祭祀.祈福.开光.动土.安床.出行.栽种.纳畜.牧养.竖柱.上梁.解除.破土.",
			"j": "嫁娶.掘井.入宅.移徙.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0524": {
			"y": "解除.出行.纳采.冠笄.竖柱.上梁.移徙.作灶.进人口.入宅.纳畜.牧养.",
			"j": "祭祀.伐木.架马.安床.修造.动土.安葬.修坟.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0525": {
			"y": "祭祀.祈福.求嗣.开光.出行.开市.交易.立券.栽种.安床.纳畜.移徙.起基.动土.定磉.造仓.置产.破土.启攒.修坟.",
			"j": "入宅.移徙.修造.安门.伐木.入殓.安葬.造屋.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0526": {
			"y": "嫁娶.交易.立券.作厕.补垣.塞穴.畋猎.取渔.开生坟.",
			"j": "安床.开渠.上梁.修造.开市.开光.入宅.移徙.安床.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0528": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.开光.解除.出行.出火.入宅.移徙.栽种.纳畜.牧养.动土.破土.入殓.安葬.",
			"j": "作灶.安床.开仓.造屋.动土.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0529": {
			"y": "开光.纳采.裁衣.冠笄.安床.作灶.进人口.造仓.塞穴.",
			"j": "嫁娶.栽种.修造.动土.出行.伐木.作梁.安葬.谢土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0530": {
			"y": "纳采.嫁娶.裁衣.理发.出行.修造.动土.进人口.开市.交易.立券.挂匾.移徙.上梁.栽种.纳畜.",
			"j": "伐木.安葬.安床.祭祀.祈福.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0531": {
			"y": "开市.交易.立券.挂匾.祭祀.祈福.斋醮.出行.开市.交易.立券.造屋.起基.修造.动土.定磉.安床.安机械.安葬.破土.启攒.除服.成服.立碑.",
			"j": "作灶.嫁娶.移徙.入宅.理发.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0617": {
			"y": "开市.交易.立券.纳财.栽种.安床.拆卸.修造.动土.上梁.入殓.安葬.破土.除服.成服.",
			"j": "嫁娶.出火.伐木.祭祀.入宅.移徙.纳畜.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0630": {
			"y": "祭祀.结网.余事勿取.",
			"j": "入宅.出行.掘井.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0628": {
			"y": "祭祀.斋醮.塑绘.开光.出行.修造.动土.造畜椆栖.安床.放水.掘井.开池.作厕.结网.破土.",
			"j": "出火.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0728": {
			"y": "嫁娶.祭祀.出行.裁衣.冠笄.交易.雕刻.纳财.造畜椆栖.造车器.雕刻.教牛马.",
			"j": "移徙.入宅.栽种.动土.破土.作灶.安葬.行丧.伐木.上梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0601": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.动土.修造.进人口.入宅.移徙.安床.解除.挂匾.栽种.破土.谢土.入殓.移柩.安葬.",
			"j": "开市.立券.造船.合寿木.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0602": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "开光.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0603": {
			"y": "订盟.纳采.嫁娶.解除.祭祀.祈福.求嗣.开光.出行.解除.出火.拆卸.入宅.移徙.安床.栽种.纳畜.动土.破土.谢土.安葬.修坟.",
			"j": "作灶.开市.经络.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0604": {
			"y": "祭祀.祈福.求嗣.开光.订盟.纳采.解除.动土.起基.进人口.开市.交易.立券.纳财.造仓.开池.栽种.纳畜.破土.安葬.",
			"j": "安床.上梁.裁衣.入宅.嫁娶.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0605": {
			"y": "开光.求医.治病.动土.上梁.入殓.破土.安葬.",
			"j": "嫁娶.开光.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0606": {
			"y": "祭祀.栽种.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0607": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.出行.解除.伐木.入宅.移徙.安床.出火.拆卸.修造.上梁.栽种.移柩.",
			"j": "安葬.开市.交易.立券.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0608": {
			"y": "求嗣.嫁娶.纳采.合帐.裁衣.冠笄.伐木.作梁.修造.动土.起基.竖柱.上梁.安门.作灶.筑堤.造畜椆栖.",
			"j": "安葬.出行.祈福.栽种.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "闭",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0609": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0610": {
			"y": "嫁娶.祭祀.祈福.出火.开光.求嗣.出行.拆卸.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.动土.",
			"j": "安葬.行丧.伐木.作梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0611": {
			"y": "开光.求嗣.出行.解除.伐木.出火.拆卸.修造.上梁.起基.入宅.移徙.开市.交易.立券.栽种.牧养.入殓.安葬.除服.成服.",
			"j": "置产.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0612": {
			"y": "祭祀.理发.修饰垣墙.平治道涂.沐浴.整手足甲.扫舍.",
			"j": "出行.安门.修造.嫁娶.上梁.入宅.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0613": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.出火.拆卸.动土.修造.进人口.入宅.移徙.安床.挂匾.交易.立券.栽种.纳畜.入殓.破土.启攒.安葬.",
			"j": "",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0614": {
			"y": "祭祀.祈福.求嗣.开光.出行.伐木.出火.拆卸.修造.动土.起基.安床.入宅.移徙.",
			"j": "嫁娶.开市.交易.行丧.安葬.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0615": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0616": {
			"y": "开市.交易.立券.纳财.开池.作厕.结网.祭祀.修造.动土.安床.放水.经络.破土.",
			"j": "嫁娶.造桥.词讼.移徙.安门.作灶.栽种.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0618": {
			"y": "祭祀.作灶.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0619": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0620": {
			"y": "修造.动土.起基.安门.安床.栽种.筑堤.补垣.造畜椆栖.",
			"j": "嫁娶.掘井.入宅.移徙.出火.出行.行丧.安葬.开光.理发.进人口.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0621": {
			"y": "祭祀.教牛马.断蚁.余事勿取.",
			"j": "斋醮.移徙.入宅.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0622": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.开市.纳财.立券.移徙.出行.修造.动土.起基.定磉.竖柱.拆卸.扫舍.放水.安香.安床.造船.开池.掘井.造畜椆栖.栽种.",
			"j": "行丧.安葬.破土.作灶.伐木.斋醮.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0623": {
			"y": "嫁娶.开光.祭祀.祈福.出行.解除.移徙.入宅.开市.纳财.起基.修造.竖柱.上梁.造屋.作灶.出火.安香.补垣.塞穴.拆卸.放水.扫舍.造仓.造船.栽种.安葬.",
			"j": "纳采.订盟.安床.谢土.破土.动土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0624": {
			"y": "嫁娶.祭祀.理发.作灶.修饰垣墙.平治道涂.整手足甲.沐浴.冠笄.",
			"j": "破土.出行.栽种.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0625": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.进人口.入宅.移徙.安床.交易.立券.挂匾.纳财.入殓.安葬.启攒.除服.成服.",
			"j": "动土.掘井.破土.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0626": {
			"y": "畋猎.捕捉.结网.取渔.祭祀.沐浴.余事勿取.",
			"j": "嫁娶.开市.安葬.启攒.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0629": {
			"y": "开市.交易.立券.挂匾.开光.解除.拆卸.动土.安床.修造.上梁.置产.栽种.破土.安葬.",
			"j": "作灶.出火.祭祀.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0723": {
			"y": "开市.交易.立券.纳财.动土.开光.出行.嫁娶.纳采.订盟.出行.纳财.入学.开仓.出货财.纳畜.牧养.栽种.破土.启攒.安葬.立碑.",
			"j": "入宅.移徙.作灶.祭祀.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0828": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "祈福.纳采.订盟.嫁娶.入宅.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0701": {
			"y": "嫁娶.纳采.订盟.冠笄.造车器.祭祀.开光.祈福.求嗣.出行.解除.伐木.出火.入宅.拆卸.修造.动土.上梁.安床.栽种.破土.",
			"j": "行丧.置产.入宅.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0702": {
			"y": "嫁娶.合帐.裁衣.冠笄.伐木.上梁.出火.拆卸.移徙.修造.动土.安门.纳财.筑堤.栽种.塞穴.",
			"j": "安床.祈福.出行.安葬.行丧.开光.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0703": {
			"y": "出行.教牛马.割蜜.余事勿取.",
			"j": "斋醮.造屋.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0704": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.拆卸.修造.进人口.入宅.移徙.动土.安床.纳畜.栽种.纳财.交易.立券.挂匾.造畜椆栖.",
			"j": "安葬.开生坟.合寿木.行丧.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0705": {
			"y": "安机械.祭祀.祈福.求嗣.沐浴.解除.纳采.开市.修造.竖柱.上梁.开柱眼.安碓硙.归岫.补垣.塞穴.拆卸.放水.出火.扫舍.开生坟.合寿木.安葬.谢土.启攒.除服.成服.",
			"j": "嫁娶.安床.作灶.动土.破土.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0706": {
			"y": "祭祀.沐浴.理发.整手足甲.修饰垣墙.平治道涂.余事勿取.",
			"j": "开市.入宅.出行.修造.词讼.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0707": {
			"y": "嫁娶.祭祀.裁衣.结网.冠笄.沐浴.",
			"j": "开仓.出货财.置产.安葬.动土.破土.掘井.栽种.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0708": {
			"y": "入宅.移徙.安床.开光.祈福.求嗣.进人口.开市.交易.立券.出火.拆卸.修造.动土.",
			"j": "嫁娶.破土.置产.栽种.安葬.修坟.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0709": {
			"y": "祭祀.解除.沐浴.整手足甲.入殓.移柩.破土.启攒.安葬.",
			"j": "嫁娶.入宅.移徙.作灶.开市.交易.安门.栽种.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0710": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0711": {
			"y": "嫁娶.开光.出行.理发.作梁.出火.拆卸.修造.开市.交易.立券.挂匾.动土.入宅.移徙.安床.栽种.",
			"j": "伐木.祭祀.纳畜.祭祀.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0712": {
			"y": "嫁娶.开光.出行.祈福.求嗣.解除.拆卸.动土.修造.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.纳畜.入殓.移柩.安葬.",
			"j": "",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0713": {
			"y": "祭祀.作灶.纳财.栽种.纳畜.进人口.",
			"j": "安葬.经络.修坟.破土.开市.安床.启攒.立碑.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0714": {
			"y": "祭祀.祈福.求嗣.开光.开市.牧养.理发.",
			"j": "嫁娶.出行.安葬.入殓.入宅.作灶.冠笄.上梁.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0715": {
			"y": "祭祀.入殓.破土.除服.成服.移柩.启攒.安葬.谢土.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0716": {
			"y": "祭祀.出行.交易.割蜜.造畜椆栖.",
			"j": "嫁娶.作灶.安葬.动土.词讼.作梁.伐木.掘井.破土.移徙.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0717": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.拆卸.修造.动土.进人口.开市.交易.立券.挂匾.入宅.移徙.栽种.纳畜.入殓.启攒.除服.成服.",
			"j": "",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0718": {
			"y": "嫁娶.开光.解除.安床.牧养.理发.开市.入殓.启攒.移柩.安葬.扫舍.",
			"j": "作灶.动土.上梁.栽种.入宅.移徙.修造.祈福.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0719": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0720": {
			"y": "祭祀.祈福.求嗣.开光.伐木.出火.拆卸.入宅.安床.修造.动土.上梁.挂匾.纳畜.",
			"j": "嫁娶.栽种.行丧.理发.修坟.行丧.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0721": {
			"y": "解除.祭祀.理发.入殓.安葬.破土.",
			"j": "嫁娶.开市.出火.作灶.置产.斋醮.入宅.移徙.安门.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0722": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0724": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.入殓.破土.谢土.安葬.",
			"j": "掘井.伐木.纳畜.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0725": {
			"y": "祭祀.冠笄.作灶.交易.纳财.栽种.结网.纳畜.牧养.进人口.",
			"j": "开渠.造船.安床.安葬.破土.出行.修坟.掘井.开市.开生坟.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0726": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.纳采.裁衣.冠笄.开光.安床.作梁.修造.动土.作灶.起基.上梁.造屋.纳畜.牧养.",
			"j": "移徙.栽种.出行.行丧.破土.安葬.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0727": {
			"y": "经络.祭祀.沐浴.补垣.塞穴.除服.成服.移柩.入殓.启攒.立碑.",
			"j": "开光.治病.嫁娶.掘井.破土.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0729": {
			"y": "修造.动土.安机械.祭祀.沐浴.解除.拆卸.治病.作灶.造屋.起基.开池.扫舍.造畜椆栖.开生坟.合寿木.安葬.破土.启攒.移柩.入殓.立碑.",
			"j": "开市.入宅.出行.安床.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0730": {
			"y": "嫁娶.纳采.订盟.造车器.开光.出行.拆卸.起基.安床.除服.成服.开市.交易.立券.栽种.牧养.入殓.移柩.启攒.",
			"j": "上梁.入宅.修造.动土.破土.祭祀.祈福.斋醮.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0731": {
			"y": "祭祀.嫁娶.畋猎.结网.",
			"j": "动土.破土.治病.开渠.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0818": {
			"y": "嫁娶.出火.拆卸.祭祀.祈福.开光.伐木.动土.开市.交易.立券.入宅.移徙.安床.纳畜.入殓.安葬.",
			"j": "栽种.作灶.针灸.出行.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0829": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.安香.出火.解除.伐木.入宅.移徙.安床.开市.交易.立券.栽种.出火.出行.安葬.",
			"j": "掘井.理发.作灶.动土.破土.开池.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0831": {
			"y": "嫁娶.祭祀.祈福.求嗣.裁衣.冠笄.经络.修造.进人口.安床.动土.竖柱.上梁.移徙.交易.立券.栽种.会亲友.",
			"j": "行丧.安葬.出行.作梁.纳畜.伐木.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0823": {
			"y": "祭祀.解除.拆卸.修造.动土.起基.上梁.安床.安门.开渠.开池.入殓.破土.启攒.",
			"j": "嫁娶.出行.进人口.作灶.入宅.移徙.栽种.赴任.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0923": {
			"y": "嫁娶.纳采.订盟.祭祀.开光.出行.理发.作梁.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.移徙.拆卸.挂匾.栽种.纳畜.破土.安葬.入殓.除服.成服.",
			"j": "开市.掘井.开渠.造桥.造船.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0801": {
			"y": "纳采.订盟.会亲友.入学.祭祀.祈福.求嗣.开光.出行.解除.理发.动土.起基.开市.交易.立券.纳财.造仓.栽种.纳畜.牧养.",
			"j": "嫁娶.作灶.出火.置产.嫁娶.入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0802": {
			"y": "祭祀.祈福.解除.整手足甲.安床.沐浴.入殓.移柩.破土.启攒.安葬.谢土.",
			"j": "嫁娶.斋醮.开市.出火.入宅.移徙.出行.作灶.安门.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0803": {
			"y": "破屋.坏垣.解除.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0804": {
			"y": "嫁娶.开市.立券.移徙.入宅.安机械.会亲友.经络.安门.安床.挂匾.拆卸.开仓.出货财.开池.栽种.纳畜.牧养.破土.安葬.启攒.移柩.入殓.立碑.",
			"j": "祭祀.祈福.探病.谢土.造桥.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0805": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.斋醮.开光.会亲友.求医.治病.造屋.起基.竖柱.上梁.安门.安碓硙.筑堤.开池.破土.安葬.除服.成服.",
			"j": "入宅.开市.掘井.词讼.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0806": {
			"y": "纳采.订盟.嫁娶.移徙.入宅.出行.祭祀.祈福.斋醮.塑绘.开光.安香.出火.会亲友.解除.入学.竖柱.上梁.拆卸.造屋.起基.栽种.牧养.纳畜.",
			"j": "安葬.破土.开市.开仓.出货财.启攒.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0807": {
			"y": "订盟.纳采.祭祀.祈福.安机械.作灶.纳畜.",
			"j": "动土.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0808": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.动土.安床.掘井.破土.启攒.",
			"j": "入宅.作梁.安门.伐木.修造.上梁.入殓.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0809": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.修造.移徙.动土.安床.入殓.破土.安葬.启攒.",
			"j": "造屋.开光.理发.造船.掘井.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0810": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.上梁.造屋.移徙.安门.纳财.牧养.纳畜.安葬.启攒.入殓.",
			"j": "破土.置产.掘井.动土.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0811": {
			"y": "祭祀.解除.沐浴.理发.整手足甲.入殓.移柩.破土.安葬.扫舍.",
			"j": "嫁娶.会亲友.进人口.出行.入宅.移徙.赴任.作灶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0812": {
			"y": "塑绘.开光.进人口.纳畜.补垣.塞穴.栽种.牧养.",
			"j": "嫁娶.纳财.祈福.安葬.修造.开市.交易.立券.动土.上梁.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0813": {
			"y": "祭祀.作灶.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0814": {
			"y": "祭祀.求嗣.开光.出行.伐木.作梁.出火.解除.拆卸.进人口.修造.动土.起基.安床.栽种.纳畜.入殓.破土.安葬.除服.成服.",
			"j": "嫁娶.移徙.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0815": {
			"y": "祭祀.求医.捕捉.栽种.塞穴.入殓.破土.安葬.移柩.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0816": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0817": {
			"y": "祭祀.结网.入殓.移柩.启攒.安葬.移柩.除服.成服.合寿木.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0819": {
			"y": "祭祀.开光.解除.移徙.裁衣.开市.立券.祈福.求嗣.进人口.交易.纳财.纳畜.",
			"j": "动土.破土.理发.出行.入宅.分居.安香.出火.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0820": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.安床.栽种.移柩.进人口.会亲友.除服.成服.",
			"j": "造屋.入殓.安葬.伐木.入宅.移徙.置产.纳畜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0821": {
			"y": "祭祀.动土.筑堤.开池.会亲友.塞穴.入殓.移柩.破土.安葬.",
			"j": "开光.出行.修造.上梁.入宅.安门.作灶.裁衣.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0822": {
			"y": "祭祀.裁衣.安门.纳财.扫舍.出行.进人口.作灶.纳畜.造畜椆栖.",
			"j": "安床.动土.安葬.开生坟.合寿木.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0824": {
			"y": "纳采.订盟.开光.出行.解除.安香.出火.拆卸.入宅.移徙.修造.上梁.安床.栽种.纳畜.会亲友.安机械.经络.",
			"j": "伐木.谢土.行丧.祭祀.作灶.动土.破土.安葬.祈福.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0825": {
			"y": "修饰垣墙.平治道涂.祭祀.沐浴.作灶.",
			"j": "嫁娶.词讼.治病.置产.作梁.祈福.安葬.栽种.伐木.安门.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0826": {
			"y": "嫁娶.祭祀.祈福.求嗣.出火.出行.开光.解除.拆卸.修造.进人口.安香.交易.立券.入宅.移徙.安床.动土.破土.谢土.安葬.入殓.除服.成服.",
			"j": "斋醮.开市.开仓.作灶.造船.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0827": {
			"y": "破土.安葬.移柩.入殓.祭祀.捕捉.除服.成服.余事勿取.",
			"j": "嫁娶.入宅.开市.交易.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0830": {
			"y": "安机械.纳采.订盟.祭祀.祈福.求嗣.开光.普渡.出行.出火.拆卸.修造.动土.进人口.开市.交易.立券.移徙.安床.栽种.上梁.纳畜.破土.移柩.安葬.",
			"j": "入宅.嫁娶.掘井.牧养.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0930": {
			"y": "纳采.订盟.开市.交易.立券.挂匾.纳财.栽种.进人口.入宅.移徙.安床.开光.出火.拆卸.安门.修造.",
			"j": "斋醮.嫁娶.行丧.动土.作灶.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0922": {
			"y": "祭祀.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0929": {
			"y": "嫁娶.纳采.祭祀.解除.出行.修造.动土.开市.上梁.安床.整手足甲.扫舍.求医.治病.起基.定磉.造屋.合脊.",
			"j": "造庙.行丧.安葬.伐木.作灶.造船.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0928": {
			"y": "祭祀.出行.沐浴.扫舍.安葬.余事勿取.",
			"j": "动土.破土.置产.掘井.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0912": {
			"y": "开市.交易.立券.挂匾.祭祀.开光.进人口.入宅.安床.出火.拆卸.修造.动土.栽种.",
			"j": "嫁娶.立碑.出行.伐木.安葬.行丧.移徙.纳畜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0920": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.开市.交易.立券.挂匾.栽种.纳畜.入殓.安葬.除服.成服.",
			"j": "",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0910": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1029": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "嫁娶.入宅.上梁.出行.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0901": {
			"y": "嫁娶.纳采.订盟.开光.祭祀.出行.理发.动土.安床.放水.开渠.栽种.进人口.",
			"j": "入宅.上梁.入殓.造屋.探病.作灶.安门.安葬.纳畜.伐木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0902": {
			"y": "祭祀.出行.作梁.出火.拆卸.修造.动土.起基.安床.补垣.塞穴.入殓.破土.安葬.移柩.造畜椆栖.",
			"j": "嫁娶.入宅.斋醮.开光.针灸.掘井.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0903": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.出行.解除.竖柱.入宅.移徙.纳财.上梁.纳畜.入殓.安葬.启攒.",
			"j": "栽种.掘井.动土.安床.破土.置产.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0904": {
			"y": "解除.祭祀.祈福.求嗣.修造.动土.竖柱.上梁.安床.纳畜.造屋.合脊.起基.入殓.破土.安葬.",
			"j": "出火.嫁娶.开光.进人口.出行.词讼.开市.入宅.移徙.赴任.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0905": {
			"y": "沐浴.理发.会亲友.塑绘.开光.栽种.牧养.嫁娶.经络.补垣.塞穴.",
			"j": "开市.入宅.动土.破土.安葬.作灶.上梁.安床.开仓.祈福.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0906": {
			"y": "祭祀.理发.作灶.沐浴.修饰垣墙.平治道涂.",
			"j": "嫁娶.栽种.祈福.造桥.安葬.安门.伐木.作梁.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0907": {
			"y": "沐浴.入殓.移柩.除服.成服.破土.平治道涂.",
			"j": "嫁娶.移徙.入宅.开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0908": {
			"y": "嫁娶.祭祀.祈福.求嗣.沐浴.出火.出行.拆卸.修造.动土.进人口.开市.交易.立券.入宅.移徙.安床.栽种.纳畜.入殓.安葬.启攒.除服.成服.",
			"j": "",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0909": {
			"y": "开光.解除.起基.动土.拆卸.上梁.立碑.修坟.安葬.破土.启攒.移柩.",
			"j": "嫁娶.出行.安床.作灶.祭祀.入宅.移徙.出火.进人口.置产.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0911": {
			"y": "嫁娶.祈福.求嗣.出行.出火.拆卸.修造.动土.上梁.开光.进人口.开市.交易.立券.挂匾.安床.入宅.移徙.栽种.伐木.入殓.破土.除服.成服.",
			"j": "",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0913": {
			"y": "祭祀.理发.会亲友.进人口.嫁娶.针灸.入殓.移柩.",
			"j": "探病.开渠.安葬.伐木.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0914": {
			"y": "祭祀.立碑.修坟.启攒.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0915": {
			"y": "嫁娶.出行.伐木.拆卸.修造.动土.移徙.安葬.破土.修坟.立碑.",
			"j": "掘井.祈福.安床.开市.入宅.挂匾.开光.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0916": {
			"y": "祭祀.出行.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0917": {
			"y": "嫁娶.祭祀.塑绘.开光.出行.解除.理发.整手足甲.动土.安床.开池.放水.扫舍.",
			"j": "伐木.行丧.作灶.作梁.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0918": {
			"y": "开市.交易.立券.挂匾.开光.出行.入宅.移徙.安床.出火.上梁.",
			"j": "作灶.行丧.理发.乘船.嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0919": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0921": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0924": {
			"y": "开市.交易.立券.纳财.挂匾.栽种.祭祀.祈福.开光.拆卸.动土.安床.",
			"j": "嫁娶.破土.进人口.出行.入宅.移徙.出火.纳畜.词讼.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0925": {
			"y": "嫁娶.祭祀.理发.进人口.作灶.移柩.冠笄.会亲友.",
			"j": "开仓.出货财.伐木.纳畜.开市.上梁.造屋.破土.启攒.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0926": {
			"y": "祭祀.修坟.除服.成服.启攒.移柩.余事勿取.",
			"j": "开市.入宅.嫁娶.动土.破土.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0927": {
			"y": "嫁娶.冠笄.安机械.解除.纳畜.牧养.沐浴.伐木.架马.作梁.安门.扫舍.合寿木.安葬.启攒.立碑.修坟.",
			"j": "祈福.开光.开市.入宅.动土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1027": {
			"y": "入殓.破土.启攒.安葬.除服.成服.余事勿取.",
			"j": "开市.入宅.祭祀.置产.补垣.塞穴.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1025": {
			"y": "纳采.订盟.会亲友.沐浴.理发.裁衣.冠笄.安床.除服.成服.启攒.移柩.安葬.会亲友.开生坟.",
			"j": "开市.入宅.出行.嫁娶.修坟.祈福.动土.入宅.安门.谢土.上梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1125": {
			"y": "祭祀.祈福.求嗣.开光.解除.伐木.拆卸.修造.栽种.纳畜.安葬.修坟.立碑.",
			"j": "嫁娶.进人口.入宅.移徙.出火.出行.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1001": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.入宅.安床.出行.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1002": {
			"y": "开光.祈福.求嗣.斋醮.修造.动土.纳财.造仓.作厕.栽种.牧养.会亲友.",
			"j": "作灶.出火.进人口.开渠.入宅.移徙.祭祀.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1003": {
			"y": "开光.解除.拆卸.修造.动土.竖柱.安门.牧养.安葬.修坟.破土.移柩.",
			"j": "出火.入宅.移徙.祈福.祭祀.安床.开市.嫁娶.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1004": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "移徙.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1005": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出行.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.上梁.合脊.放水.掘井.破土.移柩.谢土.除服.成服.",
			"j": "开市.开仓.安门.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1006": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.解除.进人口.入宅.移徙.出火.安床.开市.交易.立券.挂匾.",
			"j": "安葬.纳畜.出行.行丧.伐木.栽种.造庙.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1007": {
			"y": "祭祀.冠笄.捕捉.余事勿取.",
			"j": "嫁娶.开市.造屋.作梁.合寿木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1008": {
			"y": "祭祀.塞穴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1009": {
			"y": "祭祀.祈福.求嗣.开光.开市.出行.解除.动土.起基.置产.栽种.",
			"j": "嫁娶.作灶.修坟.安门.入宅.立碑.安葬.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1010": {
			"y": "祭祀.解除.裁衣.理发.安床.作灶.造畜椆栖.放水.筑堤.补垣.塞穴.整手足甲.扫舍.",
			"j": "嫁娶.开光.会亲友.掘井.安门.栽种.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d1011": {
			"y": "祭祀.出行.裁衣.冠笄.会亲友.造畜椆栖.嫁娶.竖柱.上梁.移徙.纳财.纳畜.",
			"j": "动土.伐木.作梁.行丧.安葬.开生坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1012": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.移徙.伐木.安床.纳畜.出火.拆卸.",
			"j": "安葬.修坟.作灶.破土.造庙.动土.嫁娶.纳采.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1013": {
			"y": "开市.交易.立券.纳财.会亲友.开光.理发.入殓.移柩.安葬.启攒.",
			"j": "嫁娶.作灶.出火.出行.入宅.移徙.安床.祈福.上梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1014": {
			"y": "造畜椆栖.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1015": {
			"y": "入殓.破土.安葬.启攒.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1016": {
			"y": "祭祀.入殓.移柩.开生坟.破土.启攒.安葬.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1017": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1018": {
			"y": "嫁娶.求嗣.纳采.进人口.纳财.结网.纳畜.牧养.会亲友.",
			"j": "上梁.作灶.伐木.出行.安葬.安门.理发.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1019": {
			"y": "嫁娶.祭祀.开市.开光.出行.入宅.移徙.出火.拆卸.修造.安床.",
			"j": "纳畜.伐木.置产.作梁.行丧.安葬.修坟.立碑.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1020": {
			"y": "嫁娶.祭祀.作灶.纳财.",
			"j": "安葬.开市.修坟.立碑.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1021": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.进人口.开市.交易.立券.挂匾.纳财.入宅.移徙.栽种.破土.谢土.",
			"j": "安床.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1022": {
			"y": "嫁娶.祭祀.祈福.求嗣.动土.安床.扫舍.入殓.移柩.破土.启攒.安葬.作灶.整手足甲.补垣.除服.成服.",
			"j": "开光.栽种.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1023": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.上梁.入宅.移徙.安床.安门.纳财.纳畜.造畜椆栖.",
			"j": "伐木.行丧.破土.嫁娶.安葬.开渠.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1024": {
			"y": "祭祀.开光.出行.解除.理发.伐木.出火.拆卸.上梁.合脊.安床.造畜椆栖.",
			"j": "嫁娶.安葬.行丧.词讼.造桥.作灶.破土.动土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1026": {
			"y": "解除.祭祀.修饰垣墙.平治道涂.造畜椆栖.余事勿取.",
			"j": "嫁娶.开市.交易.入宅.入学.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1028": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.拆卸.修造.动土.上梁.安床.纳畜.入殓.破土.",
			"j": "入宅.移徙.掘井.理发.伐木.交易.开市.作灶.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1030": {
			"y": "祭祀.求嗣.冠笄.进人口.会亲友.安门.安床.经络.纳财.牧养.畋猎.放水.割蜜.",
			"j": "祈福.斋醮.纳采.订盟.嫁娶.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1031": {
			"y": "嫁娶.纳采.订盟.开市.交易.立券.挂匾.祭祀.祈福.开光.造车器.挂匾.出行.入宅.移徙.安床.安门.拆卸.修造.动土.栽种.安葬.破土.启攒.除服.成服.入殓.立碑.",
			"j": "探病.纳畜.伐木.起基.作梁.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1105": {
			"y": "祭祀.开光.出行.解除.伐木.作梁.出火.拆卸.入宅.移徙.安床.修造.造畜椆栖.扫舍.",
			"j": "造庙.嫁娶.掘井.栽种.造桥.作灶.动土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1128": {
			"y": "合帐.裁衣.嫁娶.安床.入殓.移柩.破土.造畜椆栖.",
			"j": "置产.造船.开光.掘井.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1115": {
			"y": "解除.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1108": {
			"y": "开市.交易.立券.挂匾.纳财.开光.出行.入宅.移徙.安床.纳畜.入殓.移柩.安葬.",
			"j": "栽种.破土.置产.祭祀.嫁娶.动土.作灶.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1126": {
			"y": "沐浴.扫舍.捕捉.畋猎.解除.塞穴.余事勿取.",
			"j": "嫁娶.入宅.开市.安床.破土.修坟.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1120": {
			"y": "嫁娶.开光.出行.出火.拆卸.修造.动土.入宅.移徙.安床.上梁.开市.交易.立券.栽种.",
			"j": "祈福.祭祀.伐木.掘井.作灶.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1130": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.开光.出行.解除.进人口.开市.立券.挂匾.入宅.移徙.安门.栽种.动土.求医.治病.会亲友.起基.修造.造屋.安葬.",
			"j": "作灶.经络.安床.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1225": {
			"y": "嫁娶.纳采.订盟.造车器.祭祀.祈福.造庙.安香.出火.出行.归宁.入学.入宅.交易.立券.求医.治病.修造.动土.竖柱.上梁.造屋.起基.安门.",
			"j": "斋醮.伐木.作梁.安葬.行丧.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1101": {
			"y": "祭祀.冠笄.移徙.会亲友.纳财.理发.捕捉.",
			"j": "嫁娶.开市.开池.作厕.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1102": {
			"y": "祭祀.祈福.求嗣.斋醮.开光.出行.嫁娶.求医.治病.动土.破土.入学.起基.扫舍.竖柱.上梁.开仓.出货财.置产.栽种.牧养.开生坟.谢土.立碑.",
			"j": "安门.安床.裁衣.入宅.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1103": {
			"y": "嫁娶.裁衣.冠笄.合帐.祭祀.出行.安床.移徙.塞穴.入殓.破土.移柩.安葬.",
			"j": "开市.出行.栽种.置产.词讼.安门.掘井.开光.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1104": {
			"y": "祭祀.造车器.出行.修造.上梁.造屋.安门.安床.造畜椆栖.教牛马.",
			"j": "出货财.开仓.动土.破土.安葬.行丧.伐木.开渠.栽种.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1106": {
			"y": "纳采.订盟.开市.交易.立券.会亲友.纳畜.牧养.问名.移徙.解除.作厕.入学.起基.安床.开仓.出货财.安葬.启攒.入殓.除服.成服.",
			"j": "入宅.上梁.斋醮.出火.谢土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1107": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1109": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.出行.拆卸.进人口.入宅.移徙.安床.栽种.动土.修造.纳畜.入殓.安葬.立碑.除服.成服.",
			"j": "",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1110": {
			"y": "开光.解除.拆卸.修造.动土.安床.纳畜.安葬.启攒.入殓.",
			"j": "嫁娶.开市.出火.栽种.破土.动土.入宅.移徙.安香.分居.掘井.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1111": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1112": {
			"y": "嫁娶.祭祀.开光.出火.出行.拆卸.修造.动土.解除.开市.交易.立券.挂匾.纳财.入宅.移徙.安床.栽种.纳畜.",
			"j": "探病.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1113": {
			"y": "祭祀.祈福.求嗣.开光.解除.理发.会亲友.栽种.纳畜.牧养.安葬.修坟.立碑.启攒.",
			"j": "入宅.作灶.词讼.移徙.出行.赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1114": {
			"y": "祭祀.沐浴.结网.移柩.入殓.除服.成服.",
			"j": "安床.开市.交易.出货财.安葬.修坟.嫁娶.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1116": {
			"y": "安床.祭祀.开池.补垣.入殓.移柩.破土.启攒.",
			"j": "入宅.移徙.嫁娶.掘井.作灶.出火.进人口.开市.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1117": {
			"y": "祭祀.沐浴.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1118": {
			"y": "嫁娶.开光.出行.解除.出火.拆卸.修造.进人口.动土.入宅.移徙.栽种.纳畜.掘井.安葬.除服.成服.",
			"j": "置产.安床.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1119": {
			"y": "开光.裁衣.安门.会亲友.安床.结网.理发.",
			"j": "嫁娶.冠笄.出行.祈福.安葬.伐木.入宅.移徙.出火.栽种.动土.上梁.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1121": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.出行.拆卸.开市.交易.立券.挂匾.伐木.入宅.移徙.安床.安葬.",
			"j": "栽种.掘井.置产.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1122": {
			"y": "祭祀.理发.针灸.解除.进人口.整手足甲.",
			"j": "嫁娶.动土.造船.开池.掘井.出行.修造.入宅.上梁.移徙.安葬.破土.作灶.开市.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1123": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1124": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.雕刻.移徙.开市.入宅.出行.动土.会亲友.入学.修造.动土.起基.安门.安床.造庙.解除.纳财.开池.造畜椆栖.牧养.牧养.",
			"j": "上梁.开仓.出货财.造屋.造船.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1127": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.斋醮.开光.出行.解除.动土.开市.交易.立券.挂匾.拆卸.破土.",
			"j": "伐木.上梁.修造.入殓.理发.会亲友.入宅.安门.安葬.作灶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1129": {
			"y": "解除.修饰垣墙.冠笄.出行.余事勿取.",
			"j": "开市.动土.破土.嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1201": {
			"y": "祭祀.塑绘.理发.会亲友.牧养.开池.造畜椆栖.畋猎.结网.",
			"j": "祈福.谢土.安葬.上梁.作灶.开市.嫁娶.出行.入宅.动土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1202": {
			"y": "出行.纳财.开市.交易.立券.动土.移徙.入宅.裁衣.会亲友.拆卸.进人口.安香.经络.出货财.修饰垣墙.平治道涂.",
			"j": "造庙.谢土.作灶.作梁.伐木.安葬.行丧.修坟.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1203": {
			"y": "嫁娶.纳采.订盟.祭祀.斋醮.开光.安香.出火.出行.出火.拆卸.动土.祈福.进人口.纳财.交易.立券.移徙.安床.修造.安葬.除服.成服.",
			"j": "置产.掘井.词讼.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1204": {
			"y": "嫁娶.纳采.订盟.祭祀.开光.出行.解除.伐木.出火.入宅.移徙.拆卸.修造.栽种.安葬.入殓.",
			"j": "破土.动土.安门.作灶.开市.交易.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1205": {
			"y": "祭祀.解除.破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1206": {
			"y": "祭祀.扫舍.破土.安葬.除服.成服.启攒.移柩.入殓.立碑.余事勿取.",
			"j": "祭祀.嫁娶.入宅.修造.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1207": {
			"y": "祭祀.祈福.求嗣.斋醮.开光.入学.订盟.冠笄.伐木.修造.动土.起基.放水.交易.开池.",
			"j": "造桥.安门.理发.造庙.栽种.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1208": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1209": {
			"y": "沐浴.理发.扫舍.",
			"j": "伐木.纳畜.上梁.入宅.作灶.造畜椆栖.嫁娶.安葬.作梁.造船.安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d1210": {
			"y": "祭祀.开光.祈福.解除.作梁.动土.安床.掘井.栽种.纳畜.破土.移柩.",
			"j": "嫁娶.出行.赴任.造屋.入殓.入宅.移徙.出火.进人口.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1211": {
			"y": "诸事不宜.作梁.修造.动土.安门.作灶.塞穴.开池.作厕.筑堤.补垣.栽种.",
			"j": "嫁娶.祈福.掘井.行丧.安葬.安床.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1212": {
			"y": "安葬.启攒.移柩.入殓.除服.成服.",
			"j": "余事勿取.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1213": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.",
			"j": "作灶.塑绘.行丧.词讼.伐木.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1214": {
			"y": "理发.开光.解除.拆卸.修造.安葬.开市.交易.立券.挂匾.安床.栽种.",
			"j": "入宅.移徙.作灶.祈福.祭祀.嫁娶.谢土.掘井.造屋.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1215": {
			"y": "祭祀.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1216": {
			"y": "入宅.安床.开光.祭祀.出火.拆卸.动土.挂匾.入殓.破土.安葬.纳畜.",
			"j": "嫁娶.开市.作灶.置产.作梁.伐木.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1217": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1218": {
			"y": "破屋.坏垣.祭祀.沐浴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1219": {
			"y": "安床.祭祀.祈福.求嗣.冠笄.伐木.架马.动土.开池.作厕.结网.入殓.除服.成服.",
			"j": "安门.栽种.作灶.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1220": {
			"y": "解除.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1221": {
			"y": "祭祀.开光.理发.整手足甲.安床.作灶.扫舍.教牛马.",
			"j": "伐木.纳畜.破土.安葬.开生坟.嫁娶.开市.动土.交易.作梁.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1222": {
			"y": "祭祀.祈福.求嗣.开光.拆卸.修造.动土.上梁.安床.置产.栽种.破土.",
			"j": "嫁娶.进人口.安葬.出行.赴任.入宅.移徙.入殓.开渠.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1223": {
			"y": "沐浴.冠笄.补垣.塞穴.合帐.裁衣.修造.作梁.开柱眼.安碓硙.筑堤.作厕.断蚁.",
			"j": "移徙.入宅.嫁娶.祈福.开光.掘井.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1224": {
			"y": "交易.进人口.祭祀.沐浴.捕捉.入殓.除服.成服.安葬.谢土.启攒.修坟.",
			"j": "斋醮.入宅.修造.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1226": {
			"y": "纳采.订盟.开市.交易.立券.出行.会亲友.安机械.竖柱.上梁.平治道涂.伐木.拆卸.造屋.起基.安床.安门.解除.安葬.启攒.除服.成服.修坟.立碑.移柩.入殓.",
			"j": "嫁娶.动土.破土.祈福.出火.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1227": {
			"y": "祭祀.平治道涂.除服.成服.安葬.余事勿取.",
			"j": "嫁娶.入宅.纳采.订盟.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1228": {
			"y": "纳采.订盟.祭祀.祈福.开光.安香.出火.出行.会亲友.安机械.修造.动土.竖柱.上梁.造屋.起基.定磉.安床.安门.拆卸.移徙.造桥.造船.安葬.破土.入殓.",
			"j": "开市.造庙.置产.掘井.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1229": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.斋醮.进人口.会亲友.伐木.作梁.开柱眼.安床.掘井.捕捉.畋猎.",
			"j": "开生坟.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1230": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "移徙.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1231": {
			"y": "安床.架马.祭祀.塑绘.开光.出行.理发.伐木.作梁.开柱眼.作厕.畋猎.破土.入殓.除服.成服.移柩.启攒.修坟.立碑.",
			"j": "作灶.安门.造桥.开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		}
	};


/***/ },
/* 17 */
/***/ function(module, exports) {

	window.HuangLi = window.HuangLi || {};
	HuangLi.y2014 = {
		"d0101": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.入宅.移徙.纳畜.入殓.破土.修坟.立碑.",
			"j": "伐木.作梁.动土.安床.破土.栽种.造桥.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0201": {
			"y": "出行.起基.安床.纳财.交易.立券.嫁娶.栽种.入殓.移柩.安葬.",
			"j": "挂匾.入宅.上梁.祈福.词讼.作梁.作灶.开池.安门.动土.破土.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0102": {
			"y": "祭祀.沐浴.理发.纳财.进人口.栽种.扫舍.捕捉.畋猎.结网.",
			"j": "会亲友.安葬.入宅.移徙.安床.开市.行丧.出火.作灶.安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0103": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.塑绘.解除.拆卸.修造.动土.竖柱.上梁.安门.置产.开池.掘井.纳畜.安床.栽种.造畜椆栖.破土.移柩.立碑.",
			"j": "嫁娶.开市.出火.进人口.入殓.赴任.入宅.移徙.出行.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0104": {
			"y": "入宅.移徙.出行.进人口.修造.动土.起基.上梁.安门.造仓.补垣.塞穴.造畜椆栖.",
			"j": "嫁娶.开市.安床.栽种.安葬.祈福.开光.掘井.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0105": {
			"y": "祭祀.祈福.斋醮.沐浴.安床.安机械.造车器.入殓.移柩.启攒.安葬.立碑.合帐.经络.交易.",
			"j": "作灶.掘井.嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0106": {
			"y": "解除.扫舍.祭祀.教牛马.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0107": {
			"y": "开市.交易.立券.挂匾.开光.解除.伐木.作梁.出火.入宅.移徙.安床.拆卸.动土.上梁.栽种.纳畜.安葬.",
			"j": "嫁娶.祭祀.出行.置产.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0108": {
			"y": "开市.交易.立券.纳财.开池.补垣.嫁娶.纳采.纳畜.取渔.安床.",
			"j": "修造.上梁.入宅.祈福.探病.掘井.动土.安门.安葬.作灶.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0109": {
			"y": "祭祀.解除.修饰垣墙.平治道涂.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0110": {
			"y": "嫁娶.祭祀.祈福.求嗣.动土.会亲友.起基.造仓.纳畜.牧养.作厕.进人口.",
			"j": "掘井.安葬.栽种.出行.作灶.开市.入宅.安门.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0111": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.入宅.移徙.安床.修造.动土.进人口.",
			"j": "掘井.安葬.栽种.出行.作灶.开市.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0112": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0113": {
			"y": "嫁娶.开市.交易.立券.开光.出行.出火.拆卸.修造.入宅.移徙.动土.破土.移柩.安葬.启攒.除服.成服.",
			"j": "安床.伐木.祈福.纳畜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0114": {
			"y": "祭祀.入殓.破土.除服.成服.启攒.安葬.修坟.立碑.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0115": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0116": {
			"y": "开市.交易.立券.纳财.纳畜.造畜椆栖.入宅.移徙.安床.开光.祈福.求嗣.动土.",
			"j": "嫁娶.栽种.安葬.理发.造庙.作灶.入殓.行丧.造桥.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0117": {
			"y": "安床.裁衣.交易.立券.入殓.移柩.安葬.除服.成服.",
			"j": "置产.嫁娶.出行.开光.栽种.动土.破土.入宅.治病.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0118": {
			"y": "祭祀.解除.造畜椆栖.教牛马.针灸.余事勿取.",
			"j": "嫁娶.动土.开池.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0119": {
			"y": "沐浴.塑绘.开光.纳采.订盟.开市.交易.立券.纳财.起基.动土.定磉.放水.安葬.破土.启攒.修坟.立碑.移柩.",
			"j": "入宅.安门.祭祀.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0120": {
			"y": "嫁娶.出行.理发.安床.启攒.安葬.修坟.开市.交易.立券.纳财.开池.牧养.",
			"j": "掘井.祈福.谢土.动土.入宅.上梁.修造.作灶.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0121": {
			"y": "解除.平治道涂.余事勿取.",
			"j": "移徙.入宅.掘井.造庙.栽种.针灸.治病.开池.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0122": {
			"y": "嫁娶.祭祀.开光.伐木.出火.拆卸.入宅.移徙.修造.动土.上梁.安床.纳畜.",
			"j": "开市.行丧.栽种.出行.出货财.安葬.置产.词讼.治病.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0123": {
			"y": "嫁娶.纳采.订盟.入宅.移徙.安床.祭祀.祈福.开光.出行.解除.出火.拆卸.动土.纳畜.谢土.安葬.破土.",
			"j": "伐木.开市.交易.上梁.作灶.安门.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0124": {
			"y": "祭祀.破屋.坏垣.解除.余事勿取.",
			"j": "开市.动土.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0125": {
			"y": "嫁娶.纳采.订盟.开光.安香.出火.纳财.开市.交易.立券.裁衣.造屋.起基.修造.动土.安门.移徙.入宅.栽种.牧养.畋猎.掘井.开池.安葬.破土.入殓.除服.成服.立碑.",
			"j": "祈福.造庙.祭祀.安床.谢土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0126": {
			"y": "祭祀.斋醮.入殓.破土.启攒.安葬.修坟.立碑.除服.成服.",
			"j": "嫁娶.入宅.作灶.纳采.订盟.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0127": {
			"y": "祭祀.斋醮.纳财.捕捉.畋猎.",
			"j": "嫁娶.开市.入宅.安床.破土.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0128": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.斋醮.沐浴.进人口.会亲友.入学.治病.安碓硙.掘井.开池.纳畜.牧养.造畜椆栖.",
			"j": "嫁娶.合帐.入宅.行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0129": {
			"y": "祭祀.祈福.求嗣.沐浴.问名.交易.纳财.入殓.移柩.安葬.修坟.立碑.谢土.造畜椆栖.教牛马.",
			"j": "入宅.置产.嫁娶.动土.栽种.开市.开光.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0130": {
			"y": "祭祀.教牛马.造畜椆栖.祭祀.会亲友.解除.余事勿取.",
			"j": "嫁娶.入宅.出行.动土.破土.安葬.行丧.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0131": {
			"y": "嫁娶.开光.解除.出火.拆卸.修造.进人口.入宅.移徙.安床.栽种.入殓.修坟.动土.除服.成服.",
			"j": "作灶.安葬.祭祀.开市.纳采.订盟.纳畜.谢土.出行.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0210": {
			"y": "嫁娶.开光.祈福.求嗣.解除.动土.安床.栽种.开池.掘井.祭祀.破土.启攒.",
			"j": "入宅.作灶.伐木.安葬.出火.出行.纳畜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0225": {
			"y": "祭祀.祈福.求嗣.开光.嫁娶.出行.解除.伐木.拆卸.进人口.安床.动土.起基.上梁.栽种.纳畜.破土.谢土.启攒.安葬.",
			"j": "移徙.入宅.出火.作灶.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0215": {
			"y": "修饰垣墙.平治道涂.祭祀.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0220": {
			"y": "祭祀.塞穴.结网.破土.谢土.安葬.移柩.除服.成服.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0227": {
			"y": "作灶.解除.平治道涂.余事勿取.",
			"j": "祭祀.祈福.安葬.安门.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0223": {
			"y": "祭祀.祈福.求嗣.纳畜.入殓.启攒.谢土.除服.成服.",
			"j": "栽种.开光.出行.针灸.嫁娶.入宅.动土.破土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0330": {
			"y": "纳财.交易.立券.栽种.捕捉.结网.取渔.进人口.教牛马.理发.",
			"j": "入宅.造屋.竖柱.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0202": {
			"y": "平治道涂.余事勿取.",
			"j": "开光.嫁娶.开仓.出货财.造船.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0203": {
			"y": "嫁娶.订盟.纳采.会亲友.祭祀.安机械.移徙.入宅.造屋.安床.起基.定磉.安香.出火.挂匾.拆卸.置产.",
			"j": "开市.出行.安葬.行丧.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0204": {
			"y": "解除.沐浴.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0205": {
			"y": "嫁娶.祭祀.祈福.出行.解除.出火.拆卸.动土.入宅.移徙.安床.上梁.栽种.纳畜.破土.启攒.安葬.",
			"j": "开市.立券.理发.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0206": {
			"y": "祭祀.解除.治病.破屋.坏垣.扫舍.",
			"j": "余事勿取.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0207": {
			"y": "祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.入宅.移徙.上梁.挂匾.开池.入殓.安葬.破土.启攒.",
			"j": "嫁娶.作灶.安床.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0208": {
			"y": "结网.入殓.除服.成服.移柩.安葬.破土.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0209": {
			"y": "移徙.祭祀.开光.祈福.出行.解除.进人口.雇庸.安床.动土.起基.上梁.安门.解除.",
			"j": "嫁娶.安葬.破土.作梁.纳畜.牧养.行丧.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0211": {
			"y": "祭祀.合帐.裁衣.经络.伐木.作梁.安床.作灶.入殓.安葬.启攒.移柩.",
			"j": "词讼.出火.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0212": {
			"y": "裁衣.伐木.作梁.纳财.交易.立券.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0213": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.动土.上梁.进人口.入宅.移徙.安床.开市.交易.立券.挂匾.入殓.破土.安葬.启攒.除服.成服.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0214": {
			"y": "嫁娶.冠笄.纳采.出行.会亲友.上梁.安机械.安床.牧养.畋猎.祭祀.祈福.开光.修造.安门.造屋.起基.",
			"j": "入宅.作灶.治病.安葬.移徙.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0216": {
			"y": "造车器.纳采.订盟.祭祀.祈福.求嗣.移徙.出行.开市.出火.入宅.立券.交易.入宅.安门.安床.安葬.谢土.",
			"j": "开光.造屋.动土.作灶.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0217": {
			"y": "动土.入殓.嫁娶.移柩.安葬.破土.",
			"j": "开市.作灶.安床.入宅.上梁.裁衣.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0218": {
			"y": "求医.治病.破屋.坏垣.余事勿取.",
			"j": "开市.嫁娶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0219": {
			"y": "祭祀.斋醮.沐浴.开生坟.除服.成服.移柩.入殓.破土.安葬.合寿木.",
			"j": "开市.嫁娶.安床.会亲友.入宅.作灶.上梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0221": {
			"y": "祭祀.沐浴.理发.作灶.结网.栽种.",
			"j": "嫁娶.词讼.行丧.安葬.牧养.伐木.作梁.开市.纳畜.造畜椆栖.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0222": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.开市.交易.立券.动土.纳财.掘井.会亲友.",
			"j": "入宅.安葬.伐木.作梁.纳畜.造畜椆栖.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0224": {
			"y": "开光.解除.伐木.竖柱.上梁.交易.立券.纳畜.入殓.移柩.安葬.",
			"j": "入宅.出行.移徙.祭祀.嫁娶.动土.破土.作灶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0226": {
			"y": "会亲友.冠笄.安床.会亲友.安机械.祭祀.祈福.求嗣.经络.",
			"j": "嫁娶.开市.动土.作灶.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0228": {
			"y": "嫁娶.祭祀.冠笄.修饰垣墙.置产.",
			"j": "经络.探病.造屋.作灶.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0319": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出火.入宅.移徙.安床.拆卸.动土.破土.谢土.",
			"j": "合帐.开市.安葬.入殓.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0328": {
			"y": "纳采.交易.立券.安床.安机械.安葬.移柩.动土.破土.立碑.",
			"j": "嫁娶.开光.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0318": {
			"y": "理发.冠笄.嫁娶.进人口.",
			"j": "置产.伐木.纳畜.造畜椆栖.安葬.破土.作梁.作灶.开生坟.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0308": {
			"y": "订盟.纳采.裁衣.合帐.冠笄.安机械.拆卸.安床.入殓.除服.成服.移柩.破土.启攒.安葬.修坟.立碑.经络.交易.立券.纳财.筑堤.造仓.补垣.塞穴.纳畜.伐木.架马.",
			"j": "祭祀.开光.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0320": {
			"y": "安床.伐木.拆卸.修造.动土.上梁.立券.交易.栽种.纳畜.牧养.入殓.安葬.",
			"j": "嫁娶.祭祀.开光.出行.出火.移徙.入宅.安门.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0331": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.修造.动土.移徙.入宅.破土.出火.安门.安床.上梁.立碑.移柩.",
			"j": "开市.交易.合帐.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0321": {
			"y": "祭祀.祈福.求嗣.斋醮.嫁娶.冠笄.出行.开市.交易.会亲友.教牛马.除服.成服.启攒.安葬.移柩.",
			"j": "祈福.动土.移徙.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0310": {
			"y": "塞穴.诸事不宜.",
			"j": "安门.作灶.安葬.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0428": {
			"y": "嫁娶.祭祀.祈福.求嗣.斋醮.开光.出火.移徙.入宅.竖柱.上梁.会亲友.造屋.起基.治病.治病.安门.造车器.掘井.开池.",
			"j": "纳采.出行.修坟.安葬.开市.立券.作灶.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0301": {
			"y": "纳采.嫁娶.祭祀.祈福.出行.修造.动土.移徙.入宅.安葬.破土.",
			"j": "开市.入宅.斋醮.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0302": {
			"y": "祭祀.沐浴.解除.理发.扫舍.破屋.坏垣.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0303": {
			"y": "纳采.订盟.祭祀.祈福.安香.出火.修造.出行.开市.移徙.入宅.动土.安葬.破土.",
			"j": "安床.作灶.造船.会亲友.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0304": {
			"y": "塞穴.结网.取渔.畋猎.",
			"j": "嫁娶.安门.移徙.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0305": {
			"y": "纳采.祭祀.祈福.出行.会亲友.修造.动土.移徙.入宅.",
			"j": "嫁娶.开市.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0306": {
			"y": "裁衣.合帐.冠笄.嫁娶.纳婿.安床.入殓.纳财.",
			"j": "作灶.开市.安葬.作梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0307": {
			"y": "祭祀.订盟.纳采.修造.动土.祈福.塑绘.斋醮.沐浴.拆卸.起基.入宅.安香.造庙.移柩.谢土.除服.成服.入学.习艺.出行.竖柱.上梁.掘井.求嗣.解除.伐木.",
			"j": "作灶.安葬.开市.造屋.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0309": {
			"y": "祭祀.出行.嫁娶.冠笄.安床.入殓.移柩.安葬.",
			"j": "掘井.动土.作灶.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0311": {
			"y": "开光.塑绘.求嗣.纳采.裁衣.合帐.冠笄.安机械.作梁.开柱眼.安门.安床.造仓.祭祀.会亲友.祈福.经络.纳财.开市.立券.交易.入学.求嗣.理发.架马.",
			"j": "出行.斋醮.安葬.嫁娶.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0312": {
			"y": "祭祀.嫁娶.纳婿.安葬.",
			"j": "栽种.造屋.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0313": {
			"y": "祭祀.会亲友.订盟.裁衣.合帐.安机械.拆卸.上梁.安门.入殓.除服.成服.移柩.启攒.安葬.立碑.开光.塑绘.入学.出行.起基.定磉.放水.移徙.入宅.竖柱.立券.经络.",
			"j": "伐木.作梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0314": {
			"y": "祭祀.开光.塑绘.祈福.斋醮.裁衣.合帐.冠笄.嫁娶.拆卸.动土.移徙.入宅.入殓.移柩.安葬.谢土.求嗣.入学.理发.伐木.架马.作梁.出火.修造.起基.定磉.放水.赴任.",
			"j": "入宅.安门.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0315": {
			"y": "祭祀.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0316": {
			"y": "嫁娶.祭祀.出行.冠笄.立券.交易.进人口.开市.移徙.修造.动土.安床.入殓.移柩.破土.",
			"j": "开光.作灶.斋醮.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0317": {
			"y": "开市.立券.交易.挂匾.祭祀.祈福.开光.入宅.移徙.安床.拆卸.动土.上梁.进人口.",
			"j": "嫁娶.行丧.架马.作梁.理发.牧养.安葬.纳畜.伐木.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0322": {
			"y": "塞穴.整手足甲.解除.捕捉.畋猎.结网.余事勿取.诸事不宜.",
			"j": "嫁娶.作灶.掘井.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0323": {
			"y": "纳财.开市.立券.交易.开光.安床.上梁.造屋.修造.起基.",
			"j": "动土.破土.安葬.行丧.赴任.出行.嫁娶.入宅.移徙.谢土.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0324": {
			"y": "祭祀.祈福.嫁娶.冠笄.修饰垣墙.置产.平治道涂.",
			"j": "开仓.出货财.造屋.作灶.开市.交易.立券.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0325": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.出火.进人口.入宅.移徙.安床.拆卸.修造.安门.挂匾.纳财.扫舍.",
			"j": "动土.伐木.安葬.行丧.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0326": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.出行.出火.入宅.移徙.解除.栽种.伐木.破土.谢土.安葬.",
			"j": "开市.交易.作灶.纳财.上梁.安床.造屋.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0327": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "开光.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0329": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.开光.理发.经络.解除.治病.治病.立碑.栽种.牧养.掘井.开池.",
			"j": "嫁娶.定磉.合寿木.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0426": {
			"y": "祭祀.出行.修造.动土.合帐.造畜椆栖.安床.移徙.入殓.移柩.破土.启攒.安葬.开生坟.合寿木.补垣.塞穴.",
			"j": "移徙.入宅.作灶.理发.开光.安门.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0416": {
			"y": "祭祀.祈福.求嗣.开光.纳采.订盟.解除.栽种.纳畜.牧养.扫舍.进人口.",
			"j": "修坟.造桥.作灶.出行.安葬.造屋.入宅.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0425": {
			"y": "安香.出火.纳采.订盟.嫁娶.开市.立券.交易.挂匾.开光.出行.解除.安床.栽种.置产.拆卸.修造.动土.",
			"j": "作灶.安葬.祭祀.入殓.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0422": {
			"y": "沐浴.塞穴.畋猎.结网.取渔.扫舍.余事勿取.",
			"j": "祈福.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0406": {
			"y": "祭祀.平治道涂.解除.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0412": {
			"y": "解除.破屋.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0526": {
			"y": "开市.交易.立券.挂匾.祭祀.祈福.斋醮.出行.开市.交易.立券.造屋.起基.修造.动土.定磉.安床.安机械.安葬.破土.启攒.除服.成服.立碑.",
			"j": "作灶.嫁娶.移徙.入宅.理发.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0401": {
			"y": "冠笄.立券.交易.修造.动土.安机械.入殓.安葬.破土.",
			"j": "嫁娶.祈福.出火.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0402": {
			"y": "祭祀.会亲友.出行.立券.交易.冠笄.纳财.",
			"j": "嫁娶.动土.掘井.起基.定磉.破土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0403": {
			"y": "祭祀.沐浴.解除.扫舍.塞穴.牧养.",
			"j": "嫁娶.安葬.行丧.安门.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0404": {
			"y": "纳财.开市.交易.立券.开光.针灸.会亲友.理发.安床.造仓.结网.",
			"j": "移徙.入宅.栽种.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0405": {
			"y": "纳采.嫁娶.开光.出行.理发.会亲友.开市.安床.栽种.牧养.入殓.移柩.启攒.",
			"j": "谢土.祈福.上梁.作灶.斋醮.修造.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0407": {
			"y": "祭祀.祈福.开光.解除.动土.纳财.交易.纳畜.扫舍.",
			"j": "进人口.出行.嫁娶.置产.安床.赴任.安葬.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0408": {
			"y": "祭祀.祈福.求嗣.开光.解除.出火.拆卸.入宅.安床.修造.安门.纳畜.启攒.安葬.",
			"j": "动土.破土.纳财.掘井.挂匾.开市.伐木.交易.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0409": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0410": {
			"y": "塞穴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0411": {
			"y": "祭祀.祈福.求嗣.开光.解除.纳采.冠笄.出火.拆卸.进人口.安床.动土.上梁.造庙.掘井.开池.入殓.移柩.安葬.破土.",
			"j": "",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0413": {
			"y": "嫁娶.祈福.求嗣.开光.出行.解除.拆卸.出火.开市.立券.交易.入宅.移徙.安床.动土.破土.谢土.",
			"j": "祭祀.入殓.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0414": {
			"y": "祭祀.裁衣.冠笄.安床.交易.立券.开池.补垣.塞穴.入殓.破土.启攒.安葬.谢土.除服.成服.",
			"j": "嫁娶.掘井.探病.开市.开光.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0415": {
			"y": "祭祀.出行.教牛马.扫舍.余事勿取.",
			"j": "开光.伐木.安葬.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0417": {
			"y": "开光.出行.交易.塞穴.嫁娶.理发.开市.安床.",
			"j": "祈福.出火.置产.动土.破土.安葬.修造.上梁.置产.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0418": {
			"y": "祭祀.作灶.畋猎.结网.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.安床.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0419": {
			"y": "沐浴.祭祀.解除.安葬.破土.谢土.移柩.余事勿取.",
			"j": "斋醮.开光.嫁娶.入宅.上梁.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0420": {
			"y": "祭祀.解除.入殓.移柩.启攒.安葬.整手足甲.捕捉.畋猎.取渔.除服.成服.扫舍.谢土.斋醮.",
			"j": "动土.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0421": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.开市.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0423": {
			"y": "开市.交易.立券.挂匾.祭祀.开光.祈福.求嗣.安床.解除.修造.安葬.",
			"j": "纳采.问名.订盟.嫁娶.入宅.开仓.出火.动土.破土.纳畜.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0424": {
			"y": "祭祀.修门.取渔.纳财.纳畜.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0427": {
			"y": "祭祀.修饰垣墙.余事勿取.",
			"j": "开光.修造.动土.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0429": {
			"y": "祭祀.塑绘.开光.纳采.嫁娶.开市.出行.会亲友.安床.结网.除服.成服.启攒.安葬.移柩.",
			"j": "祈福.入宅.造屋.动土.破土.探病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0430": {
			"y": "祭祀.作灶.平治道涂.余事勿取.",
			"j": "安床.入宅.安碓硙.栽种.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0523": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.开光.解除.出行.出火.入宅.移徙.栽种.纳畜.牧养.动土.破土.入殓.安葬.",
			"j": "作灶.安床.开仓.造屋.动土.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0623": {
			"y": "祭祀.斋醮.塑绘.开光.出行.修造.动土.造畜椆栖.安床.放水.掘井.开池.作厕.结网.破土.",
			"j": "出火.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0501": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.纳畜.入殓.破土.安葬.",
			"j": "移徙.入宅.嫁娶.出行.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0502": {
			"y": "纳采.祭祀.祈福.求嗣.斋醮.出行.起基.造屋.定磉.安门.入殓.安葬.",
			"j": "嫁娶.开市.纳财.出火.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0503": {
			"y": "祭祀.沐浴.解除.求医.治病.破屋.坏垣.余事勿取.",
			"j": "祈福.斋醮.开市.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0504": {
			"y": "沐浴.捕捉.畋猎.结网.取渔.",
			"j": "祭祀.嫁娶.入宅.作灶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0505": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.拆卸.动土.上梁.出火.进人口.入宅.移徙.安床.栽种.纳畜.牧养.竖柱.安门.修造.解除.会亲友.",
			"j": "",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0506": {
			"y": "开市.交易.立券.祭祀.祈福.开光.伐木.进人口.安床.拆卸.修造.动土.栽种.破土.移柩.安葬.",
			"j": "入宅.移徙.理发.出火.嫁娶.出行.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0507": {
			"y": "结网.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0508": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.开市.交易.立券.安床.出行.拆卸.",
			"j": "纳畜.入宅.移徙.安葬.探病.伐木.上梁.安门.入殓.动土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0509": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.修造.动土.入宅.移徙.安床.作灶.塞穴.栽种.破土.安葬.",
			"j": "开光.掘井.开仓.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0510": {
			"y": "解除.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0511": {
			"y": "开市.交易.立券.挂匾.开光.出行.拆卸.进人口.入宅.移柩.动土.安门.上梁.栽种.破土.修坟.安葬.",
			"j": "嫁娶.安床.探病.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0512": {
			"y": "进人口.会亲友.",
			"j": "塞穴.上梁.动土.伐木.安葬.词讼.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0513": {
			"y": "沐浴.平治道涂.扫舍.入殓.破土.安葬.除服.成服.",
			"j": "嫁娶.移徙.伐木.作梁.安床.祭祀.祈福.造屋.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0514": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.出行.拆卸.动土.解除.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.安门.上梁.安葬.破土.谢土.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0515": {
			"y": "祭祀.祈福.求嗣.开光.解除.合帐.冠笄.伐木.架马.作梁.修造.进人口.嫁娶.裁衣.合帐.安床.动土.起基.上梁.竖柱.放水.会亲友.",
			"j": "",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0516": {
			"y": "破屋.坏垣.沐浴.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0517": {
			"y": "纳采.订盟.嫁娶.造车器.祭祀.祈福.求嗣.开光.出火.拆卸.修造.动土.进人口.挂匾.入宅.移徙.安床.栽种.入殓.破土.安葬.除服.成服.",
			"j": "开市.立券.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0518": {
			"y": "开市.交易.立券.祭祀.祈福.开光.动土.安床.出行.栽种.纳畜.牧养.竖柱.上梁.解除.破土.",
			"j": "嫁娶.掘井.入宅.移徙.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0519": {
			"y": "解除.出行.纳采.冠笄.竖柱.上梁.移徙.作灶.进人口.入宅.纳畜.牧养.",
			"j": "祭祀.伐木.架马.安床.修造.动土.安葬.修坟.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0520": {
			"y": "祭祀.祈福.求嗣.开光.出行.开市.交易.立券.栽种.安床.纳畜.移徙.起基.动土.定磉.造仓.置产.破土.启攒.修坟.",
			"j": "入宅.移徙.修造.安门.伐木.入殓.安葬.造屋.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0521": {
			"y": "嫁娶.交易.立券.作厕.补垣.塞穴.畋猎.取渔.开生坟.",
			"j": "安床.开渠.上梁.修造.开市.开光.入宅.移徙.安床.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0522": {
			"y": "塞穴.断蚁.结网.畋猎.余事勿取.",
			"j": "嫁娶.安葬.入宅.出行.动土.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0524": {
			"y": "开光.纳采.裁衣.冠笄.安床.作灶.进人口.造仓.塞穴.",
			"j": "嫁娶.栽种.修造.动土.出行.伐木.作梁.安葬.谢土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0525": {
			"y": "纳采.嫁娶.裁衣.理发.出行.修造.动土.进人口.开市.交易.立券.挂匾.移徙.上梁.栽种.纳畜.",
			"j": "伐木.安葬.安床.祭祀.祈福.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0527": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.动土.修造.进人口.入宅.移徙.安床.解除.挂匾.栽种.破土.谢土.入殓.移柩.安葬.",
			"j": "开市.立券.造船.合寿木.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0528": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "开光.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0529": {
			"y": "订盟.纳采.嫁娶.解除.祭祀.祈福.求嗣.开光.出行.解除.出火.拆卸.入宅.移徙.安床.栽种.纳畜.动土.破土.谢土.安葬.修坟.",
			"j": "作灶.开市.经络.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0530": {
			"y": "祭祀.祈福.求嗣.开光.订盟.纳采.解除.动土.起基.进人口.开市.交易.立券.纳财.造仓.开池.栽种.纳畜.破土.安葬.",
			"j": "安床.上梁.裁衣.入宅.嫁娶.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0531": {
			"y": "祭祀.结网.捕捉.余事勿取.",
			"j": "探病.嫁娶.开市.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0626": {
			"y": "嫁娶.纳采.订盟.冠笄.造车器.祭祀.开光.祈福.求嗣.出行.解除.伐木.出火.入宅.拆卸.修造.动土.上梁.安床.栽种.破土.",
			"j": "行丧.置产.入宅.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0613": {
			"y": "祭祀.作灶.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0603": {
			"y": "祭祀.解除.断蚁.会亲友.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0628": {
			"y": "出行.教牛马.割蜜.余事勿取.",
			"j": "斋醮.造屋.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0618": {
			"y": "嫁娶.开光.祭祀.祈福.出行.解除.移徙.入宅.开市.纳财.起基.修造.竖柱.上梁.造屋.作灶.出火.安香.补垣.塞穴.拆卸.放水.扫舍.造仓.造船.栽种.安葬.",
			"j": "纳采.订盟.安床.谢土.破土.动土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0630": {
			"y": "安机械.祭祀.祈福.求嗣.沐浴.解除.纳采.开市.修造.竖柱.上梁.开柱眼.安碓硙.归岫.补垣.塞穴.拆卸.放水.出火.扫舍.开生坟.合寿木.安葬.谢土.启攒.除服.成服.",
			"j": "嫁娶.安床.作灶.动土.破土.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0726": {
			"y": "祭祀.嫁娶.畋猎.结网.",
			"j": "动土.破土.治病.开渠.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0601": {
			"y": "祭祀.祈福.求嗣.开光.纳采.订盟.嫁娶.出行.动土.破土.会亲友.开市.交易.立券.习艺.拆卸.起基.安碓硙.放水.开池.造仓.开渠.栽种.谢土.启攒.修坟.立碑.",
			"j": "入宅.安门.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0602": {
			"y": "嫁娶.冠笄.祭祀.出行.移徙.入宅.作灶.造车器.补垣.塞穴.作厕.破土.启攒.除服.成服.入殓.",
			"j": "入宅.造屋.造桥.安门.安葬.上梁.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0604": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.治病.造车器.修造.动土.移徙.入宅.",
			"j": "开市.出行.安床.作灶.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0605": {
			"y": "嫁娶.纳采.订盟.会亲友.安机械.结网.冠笄.祭祀.求嗣.进人口.经络.",
			"j": "开市.作灶.动土.行丧.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0606": {
			"y": "开光.求嗣.出行.解除.伐木.出火.拆卸.修造.上梁.起基.入宅.移徙.开市.交易.立券.栽种.牧养.入殓.安葬.除服.成服.",
			"j": "置产.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0607": {
			"y": "祭祀.理发.修饰垣墙.平治道涂.沐浴.整手足甲.扫舍.",
			"j": "出行.安门.修造.嫁娶.上梁.入宅.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0608": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.出火.拆卸.动土.修造.进人口.入宅.移徙.安床.挂匾.交易.立券.栽种.纳畜.入殓.破土.启攒.安葬.",
			"j": "",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0609": {
			"y": "祭祀.祈福.求嗣.开光.出行.伐木.出火.拆卸.修造.动土.起基.安床.入宅.移徙.",
			"j": "嫁娶.开市.交易.行丧.安葬.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0610": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0611": {
			"y": "开市.交易.立券.纳财.开池.作厕.结网.祭祀.修造.动土.安床.放水.经络.破土.",
			"j": "嫁娶.造桥.词讼.移徙.安门.作灶.栽种.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0612": {
			"y": "开市.交易.立券.纳财.栽种.安床.拆卸.修造.动土.上梁.入殓.安葬.破土.除服.成服.",
			"j": "嫁娶.出火.伐木.祭祀.入宅.移徙.纳畜.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0614": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0615": {
			"y": "修造.动土.起基.安门.安床.栽种.筑堤.补垣.造畜椆栖.",
			"j": "嫁娶.掘井.入宅.移徙.出火.出行.行丧.安葬.开光.理发.进人口.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0616": {
			"y": "祭祀.教牛马.断蚁.余事勿取.",
			"j": "斋醮.移徙.入宅.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0617": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.开市.纳财.立券.移徙.出行.修造.动土.起基.定磉.竖柱.拆卸.扫舍.放水.安香.安床.造船.开池.掘井.造畜椆栖.栽种.",
			"j": "行丧.安葬.破土.作灶.伐木.斋醮.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0619": {
			"y": "嫁娶.祭祀.理发.作灶.修饰垣墙.平治道涂.整手足甲.沐浴.冠笄.",
			"j": "破土.出行.栽种.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0620": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.进人口.入宅.移徙.安床.交易.立券.挂匾.纳财.入殓.安葬.启攒.除服.成服.",
			"j": "动土.掘井.破土.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0621": {
			"y": "畋猎.捕捉.结网.取渔.祭祀.沐浴.余事勿取.",
			"j": "嫁娶.开市.安葬.启攒.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0622": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "移徙.入宅.开仓.出货财.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0624": {
			"y": "开市.交易.立券.挂匾.开光.解除.拆卸.动土.安床.修造.上梁.置产.栽种.破土.安葬.",
			"j": "作灶.出火.祭祀.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0625": {
			"y": "祭祀.结网.余事勿取.",
			"j": "入宅.出行.掘井.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0627": {
			"y": "嫁娶.合帐.裁衣.冠笄.伐木.上梁.出火.拆卸.移徙.修造.动土.安门.纳财.筑堤.栽种.塞穴.",
			"j": "安床.祈福.出行.安葬.行丧.开光.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0629": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.拆卸.修造.进人口.入宅.移徙.动土.安床.纳畜.栽种.纳财.交易.立券.挂匾.造畜椆栖.",
			"j": "安葬.开生坟.合寿木.行丧.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0730": {
			"y": "嫁娶.开市.立券.移徙.入宅.安机械.会亲友.经络.安门.安床.挂匾.拆卸.开仓.出货财.开池.栽种.纳畜.牧养.破土.安葬.启攒.移柩.入殓.立碑.",
			"j": "祭祀.祈福.探病.谢土.造桥.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0723": {
			"y": "嫁娶.祭祀.出行.裁衣.冠笄.交易.雕刻.纳财.造畜椆栖.造车器.雕刻.教牛马.",
			"j": "移徙.入宅.栽种.动土.破土.作灶.安葬.行丧.伐木.上梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0720": {
			"y": "祭祀.冠笄.作灶.交易.纳财.栽种.结网.纳畜.牧养.进人口.",
			"j": "开渠.造船.安床.安葬.破土.出行.修坟.掘井.开市.开生坟.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0725": {
			"y": "嫁娶.纳采.订盟.造车器.开光.出行.拆卸.起基.安床.除服.成服.开市.交易.立券.栽种.牧养.入殓.移柩.启攒.",
			"j": "上梁.入宅.修造.动土.破土.祭祀.祈福.斋醮.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0825": {
			"y": "安机械.纳采.订盟.祭祀.祈福.求嗣.开光.普渡.出行.出火.拆卸.修造.动土.进人口.开市.交易.立券.移徙.安床.栽种.上梁.纳畜.破土.移柩.安葬.",
			"j": "入宅.嫁娶.掘井.牧养.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0701": {
			"y": "祭祀.沐浴.理发.整手足甲.修饰垣墙.平治道涂.余事勿取.",
			"j": "开市.入宅.出行.修造.词讼.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0702": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.立券.移徙.入宅.动土.破土.安葬.",
			"j": "开光.作灶.造屋.架马.开仓.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0703": {
			"y": "纳采.订盟.冠笄.祭祀.祈福.斋醮.出行.修造.动土.移徙.入宅.安香.出火.拆卸.造屋.起基.竖柱.上梁.定磉.安门.开池.",
			"j": "嫁娶.开市.合寿木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0704": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "入宅.嫁娶.移徙.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0705": {
			"y": "嫁娶.安机械.交易.出行.祭祀.祈福.求嗣.斋醮.塑绘.开光.合帐.裁衣.放水.开池.掘井.",
			"j": "作灶.理发.造桥.行丧.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0706": {
			"y": "纳采.冠笄.求医.治病.开市.立券.修造.动土.安机械.破土.安葬.",
			"j": "斋醮.祭祀.移徙.入宅.上梁.嫁娶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0707": {
			"y": "嫁娶.开光.出行.祈福.求嗣.解除.拆卸.动土.修造.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.纳畜.入殓.移柩.安葬.",
			"j": "",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0708": {
			"y": "祭祀.作灶.纳财.栽种.纳畜.进人口.",
			"j": "安葬.经络.修坟.破土.开市.安床.启攒.立碑.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0709": {
			"y": "祭祀.祈福.求嗣.开光.开市.牧养.理发.",
			"j": "嫁娶.出行.安葬.入殓.入宅.作灶.冠笄.上梁.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0710": {
			"y": "祭祀.入殓.破土.除服.成服.移柩.启攒.安葬.谢土.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0711": {
			"y": "祭祀.出行.交易.割蜜.造畜椆栖.",
			"j": "嫁娶.作灶.安葬.动土.词讼.作梁.伐木.掘井.破土.移徙.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0712": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.拆卸.修造.动土.进人口.开市.交易.立券.挂匾.入宅.移徙.栽种.纳畜.入殓.启攒.除服.成服.",
			"j": "",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0713": {
			"y": "嫁娶.开光.解除.安床.牧养.理发.开市.入殓.启攒.移柩.安葬.扫舍.",
			"j": "作灶.动土.上梁.栽种.入宅.移徙.修造.祈福.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0714": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0715": {
			"y": "祭祀.祈福.求嗣.开光.伐木.出火.拆卸.入宅.安床.修造.动土.上梁.挂匾.纳畜.",
			"j": "嫁娶.栽种.行丧.理发.修坟.行丧.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0716": {
			"y": "解除.祭祀.理发.入殓.安葬.破土.",
			"j": "嫁娶.开市.出火.作灶.置产.斋醮.入宅.移徙.安门.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0717": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0718": {
			"y": "开市.交易.立券.纳财.动土.开光.出行.嫁娶.纳采.订盟.出行.纳财.入学.开仓.出货财.纳畜.牧养.栽种.破土.启攒.安葬.立碑.",
			"j": "入宅.移徙.作灶.祭祀.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0719": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.入殓.破土.谢土.安葬.",
			"j": "掘井.伐木.纳畜.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0721": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.纳采.裁衣.冠笄.开光.安床.作梁.修造.动土.作灶.起基.上梁.造屋.纳畜.牧养.",
			"j": "移徙.栽种.出行.行丧.破土.安葬.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0722": {
			"y": "经络.祭祀.沐浴.补垣.塞穴.除服.成服.移柩.入殓.启攒.立碑.",
			"j": "开光.治病.嫁娶.掘井.破土.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0724": {
			"y": "修造.动土.安机械.祭祀.沐浴.解除.拆卸.治病.作灶.造屋.起基.开池.扫舍.造畜椆栖.开生坟.合寿木.安葬.破土.启攒.移柩.入殓.立碑.",
			"j": "开市.入宅.出行.安床.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0727": {
			"y": "纳采.订盟.会亲友.入学.祭祀.祈福.求嗣.开光.出行.解除.理发.动土.起基.开市.交易.立券.纳财.造仓.栽种.纳畜.牧养.",
			"j": "嫁娶.作灶.出火.置产.嫁娶.入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0728": {
			"y": "祭祀.祈福.解除.整手足甲.安床.沐浴.入殓.移柩.破土.启攒.安葬.谢土.",
			"j": "嫁娶.斋醮.开市.出火.入宅.移徙.出行.作灶.安门.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0729": {
			"y": "破屋.坏垣.解除.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0731": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.斋醮.开光.会亲友.求医.治病.造屋.起基.竖柱.上梁.安门.安碓硙.筑堤.开池.破土.安葬.除服.成服.",
			"j": "入宅.开市.掘井.词讼.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0815": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.安床.栽种.移柩.进人口.会亲友.除服.成服.",
			"j": "造屋.入殓.安葬.伐木.入宅.移徙.置产.纳畜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0829": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.出行.解除.竖柱.入宅.移徙.纳财.上梁.纳畜.入殓.安葬.启攒.",
			"j": "栽种.掘井.动土.安床.破土.置产.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0822": {
			"y": "破土.安葬.移柩.入殓.祭祀.捕捉.除服.成服.余事勿取.",
			"j": "嫁娶.入宅.开市.交易.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0922": {
			"y": "嫁娶.冠笄.安机械.解除.纳畜.牧养.沐浴.伐木.架马.作梁.安门.扫舍.合寿木.安葬.启攒.立碑.修坟.",
			"j": "祈福.开光.开市.入宅.动土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0801": {
			"y": "纳采.订盟.嫁娶.移徙.入宅.出行.祭祀.祈福.斋醮.塑绘.开光.安香.出火.会亲友.解除.入学.竖柱.上梁.拆卸.造屋.起基.栽种.牧养.纳畜.",
			"j": "安葬.破土.开市.开仓.出货财.启攒.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0802": {
			"y": "纳采.订盟.嫁娶.祭祀.沐浴.塑绘.开光.出火.治病.习艺.伐木.造屋.竖柱.上梁.安床.作灶.安碓硙.挂匾.掘井.纳畜.",
			"j": "出行.安葬.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0803": {
			"y": "祭祀.入殓.除服.成服.移柩.破土.启攒.安葬.塞穴.断蚁.结网.",
			"j": "开市.入宅.嫁娶.开光.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0804": {
			"y": "祭祀.修造.出行.造屋.竖柱.造车器.教牛马.造畜椆栖.割蜜.",
			"j": "动土.破土.掘井.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0805": {
			"y": "祭祀.沐浴.塑绘.开光.入学.解除.扫舍.治病.开池.牧养.",
			"j": "嫁娶.出行.纳采.入宅.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0806": {
			"y": "纳财.开市.交易.立券.出行.祭祀.祈福.求嗣.开光.解除.扫舍.起基.竖柱.安床.移徙.开仓.出货财.补垣.塞穴.栽种.纳畜.牧养.",
			"j": "斋醮.入宅.安门.安葬.破土.行丧.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0807": {
			"y": "塑绘.开光.进人口.纳畜.补垣.塞穴.栽种.牧养.",
			"j": "嫁娶.纳财.祈福.安葬.修造.开市.交易.立券.动土.上梁.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0808": {
			"y": "祭祀.作灶.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0809": {
			"y": "祭祀.求嗣.开光.出行.伐木.作梁.出火.解除.拆卸.进人口.修造.动土.起基.安床.栽种.纳畜.入殓.破土.安葬.除服.成服.",
			"j": "嫁娶.移徙.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0810": {
			"y": "祭祀.求医.捕捉.栽种.塞穴.入殓.破土.安葬.移柩.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0811": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0812": {
			"y": "祭祀.结网.入殓.移柩.启攒.安葬.移柩.除服.成服.合寿木.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0813": {
			"y": "嫁娶.出火.拆卸.祭祀.祈福.开光.伐木.动土.开市.交易.立券.入宅.移徙.安床.纳畜.入殓.安葬.",
			"j": "栽种.作灶.针灸.出行.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0814": {
			"y": "祭祀.开光.解除.移徙.裁衣.开市.立券.祈福.求嗣.进人口.交易.纳财.纳畜.",
			"j": "动土.破土.理发.出行.入宅.分居.安香.出火.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0816": {
			"y": "祭祀.动土.筑堤.开池.会亲友.塞穴.入殓.移柩.破土.安葬.",
			"j": "开光.出行.修造.上梁.入宅.安门.作灶.裁衣.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0817": {
			"y": "祭祀.裁衣.安门.纳财.扫舍.出行.进人口.作灶.纳畜.造畜椆栖.",
			"j": "安床.动土.安葬.开生坟.合寿木.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0818": {
			"y": "祭祀.解除.拆卸.修造.动土.起基.上梁.安床.安门.开渠.开池.入殓.破土.启攒.",
			"j": "嫁娶.出行.进人口.作灶.入宅.移徙.栽种.赴任.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0819": {
			"y": "纳采.订盟.开光.出行.解除.安香.出火.拆卸.入宅.移徙.修造.上梁.安床.栽种.纳畜.会亲友.安机械.经络.",
			"j": "伐木.谢土.行丧.祭祀.作灶.动土.破土.安葬.祈福.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0820": {
			"y": "修饰垣墙.平治道涂.祭祀.沐浴.作灶.",
			"j": "嫁娶.词讼.治病.置产.作梁.祈福.安葬.栽种.伐木.安门.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0821": {
			"y": "嫁娶.祭祀.祈福.求嗣.出火.出行.开光.解除.拆卸.修造.进人口.安香.交易.立券.入宅.移徙.安床.动土.破土.谢土.安葬.入殓.除服.成服.",
			"j": "斋醮.开市.开仓.作灶.造船.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0823": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "祈福.纳采.订盟.嫁娶.入宅.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0824": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.安香.出火.解除.伐木.入宅.移徙.安床.开市.交易.立券.栽种.出火.出行.安葬.",
			"j": "掘井.理发.作灶.动土.破土.开池.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0826": {
			"y": "嫁娶.祭祀.祈福.求嗣.裁衣.冠笄.经络.修造.进人口.安床.动土.竖柱.上梁.移徙.交易.立券.栽种.会亲友.",
			"j": "行丧.安葬.出行.作梁.纳畜.伐木.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0827": {
			"y": "嫁娶.纳采.订盟.开光.祭祀.出行.理发.动土.安床.放水.开渠.栽种.进人口.",
			"j": "入宅.上梁.入殓.造屋.探病.作灶.安门.安葬.纳畜.伐木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0828": {
			"y": "祭祀.出行.作梁.出火.拆卸.修造.动土.起基.安床.补垣.塞穴.入殓.破土.安葬.移柩.造畜椆栖.",
			"j": "嫁娶.入宅.斋醮.开光.针灸.掘井.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0830": {
			"y": "解除.祭祀.祈福.求嗣.修造.动土.竖柱.上梁.安床.纳畜.造屋.合脊.起基.入殓.破土.安葬.",
			"j": "出火.嫁娶.开光.进人口.出行.词讼.开市.入宅.移徙.赴任.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "除",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0831": {
			"y": "沐浴.理发.会亲友.塑绘.开光.栽种.牧养.嫁娶.经络.补垣.塞穴.",
			"j": "开市.入宅.动土.破土.安葬.作灶.上梁.安床.开仓.祈福.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0930": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出行.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.上梁.合脊.放水.掘井.破土.移柩.谢土.除服.成服.",
			"j": "开市.开仓.安门.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1022": {
			"y": "入殓.破土.启攒.安葬.除服.成服.余事勿取.",
			"j": "开市.入宅.祭祀.置产.补垣.塞穴.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0901": {
			"y": "祭祀.理发.作灶.沐浴.修饰垣墙.平治道涂.",
			"j": "嫁娶.栽种.祈福.造桥.安葬.安门.伐木.作梁.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0902": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.斋醮.普渡.移徙.入宅.出行.安机械.开光.修造.动土.竖柱.上梁.造屋.起基.定磉.安门.安葬.破土.",
			"j": "开市.立券.置产.作灶.造桥.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0903": {
			"y": "祭祀.普渡.捕捉.解除.结网.畋猎.入殓.破土.安葬.",
			"j": "开市.交易.入宅.嫁娶.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0904": {
			"y": "沐浴.破屋.坏垣.余事勿取.",
			"j": "斋醮.开市.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0905": {
			"y": "订盟.纳采.祭祀.祈福.安香.出火.开市.立券.入宅.挂匾.造桥.启攒.安葬.",
			"j": "动土.破土.嫁娶.掘井.安床.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0906": {
			"y": "嫁娶.祭祀.祈福.斋醮.普渡.移徙.入宅.动土.治病.开市.交易.立券.开光.修造.造车器.安香.安床.捕捉.畋猎.结网.",
			"j": "纳采.订盟.经络.行丧.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0907": {
			"y": "嫁娶.订盟.纳采.作灶.冠笄.裁衣.会亲友.纳畜.牧养.安机械.开市.立券.纳财.安床.",
			"j": "掘井.出行.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0908": {
			"y": "祭祀.理发.会亲友.进人口.嫁娶.针灸.入殓.移柩.",
			"j": "探病.开渠.安葬.伐木.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0909": {
			"y": "祭祀.立碑.修坟.启攒.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0910": {
			"y": "嫁娶.出行.伐木.拆卸.修造.动土.移徙.安葬.破土.修坟.立碑.",
			"j": "掘井.祈福.安床.开市.入宅.挂匾.开光.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0911": {
			"y": "祭祀.出行.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0912": {
			"y": "嫁娶.祭祀.塑绘.开光.出行.解除.理发.整手足甲.动土.安床.开池.放水.扫舍.",
			"j": "伐木.行丧.作灶.作梁.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0913": {
			"y": "开市.交易.立券.挂匾.开光.出行.入宅.移徙.安床.出火.上梁.",
			"j": "作灶.行丧.理发.乘船.嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0914": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0915": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.开市.交易.立券.挂匾.栽种.纳畜.入殓.安葬.除服.成服.",
			"j": "",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0916": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0917": {
			"y": "祭祀.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0918": {
			"y": "嫁娶.纳采.订盟.祭祀.开光.出行.理发.作梁.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.移徙.拆卸.挂匾.栽种.纳畜.破土.安葬.入殓.除服.成服.",
			"j": "开市.掘井.开渠.造桥.造船.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0919": {
			"y": "开市.交易.立券.纳财.挂匾.栽种.祭祀.祈福.开光.拆卸.动土.安床.",
			"j": "嫁娶.破土.进人口.出行.入宅.移徙.出火.纳畜.词讼.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0920": {
			"y": "嫁娶.祭祀.理发.进人口.作灶.移柩.冠笄.会亲友.",
			"j": "开仓.出货财.伐木.纳畜.开市.上梁.造屋.破土.启攒.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0921": {
			"y": "祭祀.修坟.除服.成服.启攒.移柩.余事勿取.",
			"j": "开市.入宅.嫁娶.动土.破土.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0923": {
			"y": "祭祀.出行.沐浴.扫舍.安葬.余事勿取.",
			"j": "动土.破土.置产.掘井.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0924": {
			"y": "嫁娶.纳采.祭祀.解除.出行.修造.动土.开市.上梁.安床.整手足甲.扫舍.求医.治病.起基.定磉.造屋.合脊.",
			"j": "造庙.行丧.安葬.伐木.作灶.造船.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0925": {
			"y": "纳采.订盟.开市.交易.立券.挂匾.纳财.栽种.进人口.入宅.移徙.安床.开光.出火.拆卸.安门.修造.",
			"j": "斋醮.嫁娶.行丧.动土.作灶.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0926": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.入宅.安床.出行.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0927": {
			"y": "开光.祈福.求嗣.斋醮.修造.动土.纳财.造仓.作厕.栽种.牧养.会亲友.",
			"j": "作灶.出火.进人口.开渠.入宅.移徙.祭祀.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0928": {
			"y": "开光.解除.拆卸.修造.动土.竖柱.安门.牧养.安葬.修坟.破土.移柩.",
			"j": "出火.入宅.移徙.祈福.祭祀.安床.开市.嫁娶.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0929": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "移徙.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1027": {
			"y": "祭祀.冠笄.移徙.会亲友.纳财.理发.捕捉.",
			"j": "嫁娶.开市.开池.作厕.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1122": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.斋醮.开光.出行.解除.动土.开市.交易.立券.挂匾.拆卸.破土.",
			"j": "伐木.上梁.修造.入殓.理发.会亲友.入宅.安门.安葬.作灶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1001": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.解除.进人口.入宅.移徙.出火.安床.开市.交易.立券.挂匾.",
			"j": "安葬.纳畜.出行.行丧.伐木.栽种.造庙.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1002": {
			"y": "祭祀.冠笄.捕捉.余事勿取.",
			"j": "嫁娶.开市.造屋.作梁.合寿木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1003": {
			"y": "祭祀.解除.结网.畋猎.取渔.会亲友.入学.移柩.启攒.除服.成服.",
			"j": "开市.祈福.动土.破土.入殓.安葬.造船.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1004": {
			"y": "冠笄.沐浴.出行.修造.动土.移徙.入宅.破土.安葬.",
			"j": "嫁娶.开市.祭祀.祈福.斋醮.纳采.修坟.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1005": {
			"y": "祭祀.出行.",
			"j": "嫁娶.入宅.修造.动土.会亲友.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d1006": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.修造.动土.移徙.入宅.",
			"j": "针灸.伐木.作梁.造庙.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1007": {
			"y": "出行.开市.交易.立券.安机械.出火.上梁.移徙.",
			"j": "嫁娶.安葬.动土.造桥.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1008": {
			"y": "开市.交易.立券.纳财.会亲友.开光.理发.入殓.移柩.安葬.启攒.",
			"j": "嫁娶.作灶.出火.出行.入宅.移徙.安床.祈福.上梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1009": {
			"y": "造畜椆栖.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1010": {
			"y": "入殓.破土.安葬.启攒.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1011": {
			"y": "祭祀.入殓.移柩.开生坟.破土.启攒.安葬.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1012": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1013": {
			"y": "嫁娶.求嗣.纳采.进人口.纳财.结网.纳畜.牧养.会亲友.",
			"j": "上梁.作灶.伐木.出行.安葬.安门.理发.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1014": {
			"y": "嫁娶.祭祀.开市.开光.出行.入宅.移徙.出火.拆卸.修造.安床.",
			"j": "纳畜.伐木.置产.作梁.行丧.安葬.修坟.立碑.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1015": {
			"y": "嫁娶.祭祀.作灶.纳财.",
			"j": "安葬.开市.修坟.立碑.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1016": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.进人口.开市.交易.立券.挂匾.纳财.入宅.移徙.栽种.破土.谢土.",
			"j": "安床.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1017": {
			"y": "嫁娶.祭祀.祈福.求嗣.动土.安床.扫舍.入殓.移柩.破土.启攒.安葬.作灶.整手足甲.补垣.除服.成服.",
			"j": "开光.栽种.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1018": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.上梁.入宅.移徙.安床.安门.纳财.纳畜.造畜椆栖.",
			"j": "伐木.行丧.破土.嫁娶.安葬.开渠.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1019": {
			"y": "祭祀.开光.出行.解除.理发.伐木.出火.拆卸.上梁.合脊.安床.造畜椆栖.",
			"j": "嫁娶.安葬.行丧.词讼.造桥.作灶.破土.动土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1020": {
			"y": "纳采.订盟.会亲友.沐浴.理发.裁衣.冠笄.安床.除服.成服.启攒.移柩.安葬.会亲友.开生坟.",
			"j": "开市.入宅.出行.嫁娶.修坟.祈福.动土.入宅.安门.谢土.上梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1021": {
			"y": "解除.祭祀.修饰垣墙.平治道涂.造畜椆栖.余事勿取.",
			"j": "嫁娶.开市.交易.入宅.入学.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1023": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.拆卸.修造.动土.上梁.安床.纳畜.入殓.破土.",
			"j": "入宅.移徙.掘井.理发.伐木.交易.开市.作灶.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1024": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "嫁娶.入宅.上梁.出行.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1025": {
			"y": "祭祀.求嗣.冠笄.进人口.会亲友.安门.安床.经络.纳财.牧养.畋猎.放水.割蜜.",
			"j": "祈福.斋醮.纳采.订盟.嫁娶.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1026": {
			"y": "嫁娶.纳采.订盟.开市.交易.立券.挂匾.祭祀.祈福.开光.造车器.挂匾.出行.入宅.移徙.安床.安门.拆卸.修造.动土.栽种.安葬.破土.启攒.除服.成服.入殓.立碑.",
			"j": "探病.纳畜.伐木.起基.作梁.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1028": {
			"y": "祭祀.祈福.求嗣.斋醮.开光.出行.嫁娶.求医.治病.动土.破土.入学.起基.扫舍.竖柱.上梁.开仓.出货财.置产.栽种.牧养.开生坟.谢土.立碑.",
			"j": "安门.安床.裁衣.入宅.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1029": {
			"y": "嫁娶.裁衣.冠笄.合帐.祭祀.出行.安床.移徙.塞穴.入殓.破土.移柩.安葬.",
			"j": "开市.出行.栽种.置产.词讼.安门.掘井.开光.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1030": {
			"y": "祭祀.造车器.出行.修造.上梁.造屋.安门.安床.造畜椆栖.教牛马.",
			"j": "出货财.开仓.动土.破土.安葬.行丧.伐木.开渠.栽种.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1031": {
			"y": "祭祀.开光.出行.解除.伐木.作梁.出火.拆卸.入宅.移徙.安床.修造.造畜椆栖.扫舍.",
			"j": "造庙.嫁娶.掘井.栽种.造桥.作灶.动土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1128": {
			"y": "嫁娶.纳采.订盟.祭祀.斋醮.开光.安香.出火.出行.出火.拆卸.动土.祈福.进人口.纳财.交易.立券.移徙.安床.修造.安葬.除服.成服.",
			"j": "置产.掘井.词讼.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1125": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.开光.出行.解除.进人口.开市.立券.挂匾.入宅.移徙.安门.栽种.动土.求医.治病.会亲友.起基.修造.造屋.安葬.",
			"j": "作灶.经络.安床.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1225": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "移徙.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1101": {
			"y": "纳采.订盟.开市.交易.立券.会亲友.纳畜.牧养.问名.移徙.解除.作厕.入学.起基.安床.开仓.出货财.安葬.启攒.入殓.除服.成服.",
			"j": "入宅.上梁.斋醮.出火.谢土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1102": {
			"y": "祭祀.平治道涂.余事勿取.",
			"j": "嫁娶.开市.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1103": {
			"y": "捕捉.畋猎.余事勿取.",
			"j": "开市.交易.祭祀.入宅.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1104": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.斋醮.开光.安香.出火.造庙.移徙.出行.入宅.造庙.起基.竖柱.上梁.安床.纳畜.捕捉.纳婿.安葬.",
			"j": "开市.破土.掘井.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1105": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "开市.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1106": {
			"y": "订盟.纳采.会亲友.交易.立券.纳财.栽种.纳畜.牧养.",
			"j": "嫁娶.开市.入宅.祈福.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1107": {
			"y": "嫁娶.祭祀.开光.出火.出行.拆卸.修造.动土.解除.开市.交易.立券.挂匾.纳财.入宅.移徙.安床.栽种.纳畜.",
			"j": "探病.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1108": {
			"y": "祭祀.祈福.求嗣.开光.解除.理发.会亲友.栽种.纳畜.牧养.安葬.修坟.立碑.启攒.",
			"j": "入宅.作灶.词讼.移徙.出行.赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1109": {
			"y": "祭祀.沐浴.结网.移柩.入殓.除服.成服.",
			"j": "安床.开市.交易.出货财.安葬.修坟.嫁娶.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1110": {
			"y": "解除.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1111": {
			"y": "安床.祭祀.开池.补垣.入殓.移柩.破土.启攒.",
			"j": "入宅.移徙.嫁娶.掘井.作灶.出火.进人口.开市.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1112": {
			"y": "祭祀.沐浴.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1113": {
			"y": "嫁娶.开光.出行.解除.出火.拆卸.修造.进人口.动土.入宅.移徙.栽种.纳畜.掘井.安葬.除服.成服.",
			"j": "置产.安床.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1114": {
			"y": "开光.裁衣.安门.会亲友.安床.结网.理发.",
			"j": "嫁娶.冠笄.出行.祈福.安葬.伐木.入宅.移徙.出火.栽种.动土.上梁.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1115": {
			"y": "嫁娶.开光.出行.出火.拆卸.修造.动土.入宅.移徙.安床.上梁.开市.交易.立券.栽种.",
			"j": "祈福.祭祀.伐木.掘井.作灶.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1116": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.出行.拆卸.开市.交易.立券.挂匾.伐木.入宅.移徙.安床.安葬.",
			"j": "栽种.掘井.置产.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1117": {
			"y": "祭祀.理发.针灸.解除.进人口.整手足甲.",
			"j": "嫁娶.动土.造船.开池.掘井.出行.修造.入宅.上梁.移徙.安葬.破土.作灶.开市.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1118": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1119": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.雕刻.移徙.开市.入宅.出行.动土.会亲友.入学.修造.动土.起基.安门.安床.造庙.解除.纳财.开池.造畜椆栖.牧养.牧养.",
			"j": "上梁.开仓.出货财.造屋.造船.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1120": {
			"y": "祭祀.祈福.求嗣.开光.解除.伐木.拆卸.修造.栽种.纳畜.安葬.修坟.立碑.",
			"j": "嫁娶.进人口.入宅.移徙.出火.出行.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1121": {
			"y": "沐浴.扫舍.捕捉.畋猎.解除.塞穴.余事勿取.",
			"j": "嫁娶.入宅.开市.安床.破土.修坟.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1123": {
			"y": "合帐.裁衣.嫁娶.安床.入殓.移柩.破土.造畜椆栖.",
			"j": "置产.造船.开光.掘井.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1124": {
			"y": "解除.修饰垣墙.冠笄.出行.余事勿取.",
			"j": "开市.动土.破土.嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1126": {
			"y": "祭祀.塑绘.理发.会亲友.牧养.开池.造畜椆栖.畋猎.结网.",
			"j": "祈福.谢土.安葬.上梁.作灶.开市.嫁娶.出行.入宅.动土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1127": {
			"y": "出行.纳财.开市.交易.立券.动土.移徙.入宅.裁衣.会亲友.拆卸.进人口.安香.经络.出货财.修饰垣墙.平治道涂.",
			"j": "造庙.谢土.作灶.作梁.伐木.安葬.行丧.修坟.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1129": {
			"y": "嫁娶.纳采.订盟.祭祀.开光.出行.解除.伐木.出火.入宅.移徙.拆卸.修造.栽种.安葬.入殓.",
			"j": "破土.动土.安门.作灶.开市.交易.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1130": {
			"y": "祭祀.解除.破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1201": {
			"y": "祭祀.扫舍.破土.安葬.除服.成服.启攒.移柩.入殓.立碑.余事勿取.",
			"j": "祭祀.嫁娶.入宅.修造.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1202": {
			"y": "订盟.纳采.会亲友.祭祀.祈福.修造.动土.安机械.破土.安葬.",
			"j": "嫁娶.移徙.出火.开市.入宅.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1203": {
			"y": "祭祀.沐浴.捕捉.畋猎.结网.扫舍.",
			"j": "嫁娶.纳采.订盟.安床.动土.破土.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1204": {
			"y": "开市.纳财.出行.祭祀.祈福.求嗣.斋醮.问名.入学.起基.定磉.置产.开渠.掘井.拆卸.栽种.纳畜.牧养.动土.破土.启攒.",
			"j": "移徙.入宅.出火.入殓.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d1205": {
			"y": "祭祀.理发.置产.塞穴.除服.成服.移柩.入殓.破土.安葬.",
			"j": "嫁娶.入宅.安床.掘井.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1206": {
			"y": "祭祀.沐浴.出行.余事勿取.",
			"j": "开市.动土.破土.行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1207": {
			"y": "安葬.启攒.移柩.入殓.除服.成服.",
			"j": "余事勿取.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1208": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.",
			"j": "作灶.塑绘.行丧.词讼.伐木.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1209": {
			"y": "理发.开光.解除.拆卸.修造.安葬.开市.交易.立券.挂匾.安床.栽种.",
			"j": "入宅.移徙.作灶.祈福.祭祀.嫁娶.谢土.掘井.造屋.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1210": {
			"y": "祭祀.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1211": {
			"y": "入宅.安床.开光.祭祀.出火.拆卸.动土.挂匾.入殓.破土.安葬.纳畜.",
			"j": "嫁娶.开市.作灶.置产.作梁.伐木.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1212": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1213": {
			"y": "破屋.坏垣.祭祀.沐浴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1214": {
			"y": "安床.祭祀.祈福.求嗣.冠笄.伐木.架马.动土.开池.作厕.结网.入殓.除服.成服.",
			"j": "安门.栽种.作灶.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1215": {
			"y": "解除.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1216": {
			"y": "祭祀.开光.理发.整手足甲.安床.作灶.扫舍.教牛马.",
			"j": "伐木.纳畜.破土.安葬.开生坟.嫁娶.开市.动土.交易.作梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1217": {
			"y": "祭祀.祈福.求嗣.开光.拆卸.修造.动土.上梁.安床.置产.栽种.破土.",
			"j": "嫁娶.进人口.安葬.出行.赴任.入宅.移徙.入殓.开渠.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1218": {
			"y": "沐浴.冠笄.补垣.塞穴.合帐.裁衣.修造.作梁.开柱眼.安碓硙.筑堤.作厕.断蚁.",
			"j": "移徙.入宅.嫁娶.祈福.开光.掘井.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1219": {
			"y": "交易.进人口.祭祀.沐浴.捕捉.入殓.除服.成服.安葬.谢土.启攒.修坟.",
			"j": "斋醮.入宅.修造.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1220": {
			"y": "嫁娶.纳采.订盟.造车器.祭祀.祈福.造庙.安香.出火.出行.归宁.入学.入宅.交易.立券.求医.治病.修造.动土.竖柱.上梁.造屋.起基.安门.",
			"j": "斋醮.伐木.作梁.安葬.行丧.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1221": {
			"y": "纳采.订盟.开市.交易.立券.出行.会亲友.安机械.竖柱.上梁.平治道涂.伐木.拆卸.造屋.起基.安床.安门.解除.安葬.启攒.除服.成服.修坟.立碑.移柩.入殓.",
			"j": "嫁娶.动土.破土.祈福.出火.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1222": {
			"y": "祭祀.平治道涂.除服.成服.安葬.余事勿取.",
			"j": "嫁娶.入宅.纳采.订盟.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1223": {
			"y": "纳采.订盟.祭祀.祈福.开光.安香.出火.出行.会亲友.安机械.修造.动土.竖柱.上梁.造屋.起基.定磉.安床.安门.拆卸.移徙.造桥.造船.安葬.破土.入殓.",
			"j": "开市.造庙.置产.掘井.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1224": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.斋醮.进人口.会亲友.伐木.作梁.开柱眼.安床.掘井.捕捉.畋猎.",
			"j": "开生坟.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1226": {
			"y": "安床.架马.祭祀.塑绘.开光.出行.理发.伐木.作梁.开柱眼.作厕.畋猎.破土.入殓.除服.成服.移柩.启攒.修坟.立碑.",
			"j": "作灶.安门.造桥.开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1227": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.入宅.移徙.纳畜.入殓.破土.修坟.立碑.",
			"j": "伐木.作梁.动土.安床.破土.栽种.造桥.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1228": {
			"y": "祭祀.沐浴.理发.纳财.进人口.栽种.扫舍.捕捉.畋猎.结网.",
			"j": "会亲友.安葬.入宅.移徙.安床.开市.行丧.出火.作灶.安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1229": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.塑绘.解除.拆卸.修造.动土.竖柱.上梁.安门.置产.开池.掘井.纳畜.安床.栽种.造畜椆栖.破土.移柩.立碑.",
			"j": "嫁娶.开市.出火.进人口.入殓.赴任.入宅.移徙.出行.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1230": {
			"y": "入宅.移徙.出行.进人口.修造.动土.起基.上梁.安门.造仓.补垣.塞穴.造畜椆栖.",
			"j": "嫁娶.开市.安床.栽种.安葬.祈福.开光.掘井.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1231": {
			"y": "造畜椆栖.教牛马.",
			"j": "入宅.移徙.分居.作灶.出火.安香.动土.嫁娶.掘井.扫舍.造桥.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		}
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	window.HuangLi = window.HuangLi || {};
	HuangLi.y2015 = {
		"d0101": {
			"y": "订盟.纳采.造车器.祭祀.祈福.出行.安香.修造.动土.上梁.开市.交易.立券.移徙.入宅.会亲友.安机械.栽种.纳畜.造屋.起基.安床.造畜椆栖.",
			"j": "破土.安葬.行丧.开生坟.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0201": {
			"y": "沐浴.开仓.出货财.开市.交易.立券.纳财.栽种.纳畜.牧养.畋猎.入殓.破土.安葬.",
			"j": "祈福.嫁娶.安床.入宅.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0102": {
			"y": "订盟.纳采.会亲友.安机械.开光.修造.动土.竖柱.上梁.造屋.起基.造桥.栽种.纳畜.造畜椆栖.移柩.入殓.启攒.修坟.立碑.安葬.",
			"j": "祈福.出火.嫁娶.入宅.开市.动土.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0103": {
			"y": "祭祀.平治道涂.修坟.除服.成服.余事勿取.",
			"j": "移徙.入宅.嫁娶.掘井.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0104": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.雕刻.开光.安香.出行.入学.修造.动土.竖柱.上梁.造屋.起基.安门.出火.移徙.入宅.掘井.造畜椆栖.安葬.破土.除服.成服.",
			"j": "开市.纳采.订盟.作灶.造庙.造船.经络.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0105": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求嗣.斋醮.安香.出火.修造.起基.造屋.合脊.安门.安碓硙.动土.上梁.移徙.入宅.",
			"j": "出行.掘井.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0106": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.入宅.移徙.安床.修造.动土.进人口.",
			"j": "掘井.安葬.栽种.出行.作灶.开市.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0107": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0108": {
			"y": "嫁娶.开市.交易.立券.开光.出行.出火.拆卸.修造.入宅.移徙.动土.破土.移柩.安葬.启攒.除服.成服.",
			"j": "安床.伐木.祈福.纳畜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0109": {
			"y": "祭祀.入殓.破土.除服.成服.启攒.安葬.修坟.立碑.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0110": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0111": {
			"y": "开市.交易.立券.纳财.纳畜.造畜椆栖.入宅.移徙.安床.开光.祈福.求嗣.动土.",
			"j": "嫁娶.栽种.安葬.理发.造庙.作灶.入殓.行丧.造桥.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0112": {
			"y": "安床.裁衣.交易.立券.入殓.移柩.安葬.除服.成服.",
			"j": "置产.嫁娶.出行.开光.栽种.动土.破土.入宅.治病.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0113": {
			"y": "祭祀.解除.造畜椆栖.教牛马.针灸.余事勿取.",
			"j": "嫁娶.动土.开池.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0114": {
			"y": "沐浴.塑绘.开光.纳采.订盟.开市.交易.立券.纳财.起基.动土.定磉.放水.安葬.破土.启攒.修坟.立碑.移柩.",
			"j": "入宅.安门.祭祀.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0115": {
			"y": "嫁娶.出行.理发.安床.启攒.安葬.修坟.开市.交易.立券.纳财.开池.牧养.",
			"j": "掘井.祈福.谢土.动土.入宅.上梁.修造.作灶.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0116": {
			"y": "解除.平治道涂.余事勿取.",
			"j": "移徙.入宅.掘井.造庙.栽种.针灸.治病.开池.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0117": {
			"y": "嫁娶.祭祀.开光.伐木.出火.拆卸.入宅.移徙.修造.动土.上梁.安床.纳畜.",
			"j": "开市.行丧.栽种.出行.出货财.安葬.置产.词讼.治病.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0118": {
			"y": "嫁娶.纳采.订盟.入宅.移徙.安床.祭祀.祈福.开光.出行.解除.出火.拆卸.动土.纳畜.谢土.安葬.破土.",
			"j": "伐木.开市.交易.上梁.作灶.安门.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0119": {
			"y": "祭祀.破屋.坏垣.解除.余事勿取.",
			"j": "开市.动土.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0120": {
			"y": "嫁娶.纳采.订盟.开光.安香.出火.纳财.开市.交易.立券.裁衣.造屋.起基.修造.动土.安门.移徙.入宅.栽种.牧养.畋猎.掘井.开池.安葬.破土.入殓.除服.成服.立碑.",
			"j": "祈福.造庙.祭祀.安床.谢土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0121": {
			"y": "祭祀.斋醮.入殓.破土.启攒.安葬.修坟.立碑.除服.成服.",
			"j": "嫁娶.入宅.作灶.纳采.订盟.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0122": {
			"y": "祭祀.斋醮.纳财.捕捉.畋猎.",
			"j": "嫁娶.开市.入宅.安床.破土.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0123": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.斋醮.沐浴.进人口.会亲友.入学.治病.安碓硙.掘井.开池.纳畜.牧养.造畜椆栖.",
			"j": "嫁娶.合帐.入宅.行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0124": {
			"y": "祭祀.祈福.求嗣.沐浴.问名.交易.纳财.入殓.移柩.安葬.修坟.立碑.谢土.造畜椆栖.教牛马.",
			"j": "入宅.置产.嫁娶.动土.栽种.开市.开光.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0125": {
			"y": "祭祀.教牛马.造畜椆栖.祭祀.会亲友.解除.余事勿取.",
			"j": "嫁娶.入宅.出行.动土.破土.安葬.行丧.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0126": {
			"y": "嫁娶.开光.解除.出火.拆卸.修造.进人口.入宅.移徙.安床.栽种.入殓.修坟.动土.除服.成服.",
			"j": "作灶.安葬.祭祀.开市.纳采.订盟.纳畜.谢土.出行.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0127": {
			"y": "出行.起基.安床.纳财.交易.立券.嫁娶.栽种.入殓.移柩.安葬.",
			"j": "挂匾.入宅.上梁.祈福.词讼.作梁.作灶.开池.安门.动土.破土.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0128": {
			"y": "平治道涂.余事勿取.",
			"j": "开光.嫁娶.开仓.出货财.造船.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0129": {
			"y": "嫁娶.订盟.纳采.会亲友.祭祀.安机械.移徙.入宅.造屋.安床.起基.定磉.安香.出火.挂匾.拆卸.置产.",
			"j": "开市.出行.安葬.行丧.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0130": {
			"y": "沐浴.捕捉.畋猎.理发.整手足甲.入殓.除服.成服.破土.安葬.谢土.立碑.修坟.启攒.",
			"j": "纳采.订盟.嫁娶.上梁.开市.斋醮.造屋.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0131": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "斋醮.嫁娶.开市.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0213": {
			"y": "求医.治病.破屋.坏垣.余事勿取.",
			"j": "开市.嫁娶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0226": {
			"y": "纳采.订盟.祭祀.祈福.安香.出火.修造.出行.开市.移徙.入宅.动土.安葬.破土.",
			"j": "安床.作灶.造船.会亲友.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0216": {
			"y": "祭祀.沐浴.理发.作灶.结网.栽种.",
			"j": "嫁娶.词讼.行丧.安葬.牧养.伐木.作梁.开市.纳畜.造畜椆栖.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0223": {
			"y": "嫁娶.祭祀.冠笄.修饰垣墙.置产.",
			"j": "经络.探病.造屋.作灶.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0203": {
			"y": "嫁娶.纳采.订盟.问名.祭祀.冠笄.裁衣.会亲友.进人口.纳财.捕捉.作灶.",
			"j": "开市.安床.安葬.修坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0206": {
			"y": "祭祀.合帐.裁衣.经络.伐木.作梁.安床.作灶.入殓.安葬.启攒.移柩.",
			"j": "词讼.出火.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0227": {
			"y": "塞穴.结网.取渔.畋猎.",
			"j": "嫁娶.安门.移徙.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0301": {
			"y": "纳采.嫁娶.祭祀.祈福.出行.开市.会亲友.动土.破土.启攒.",
			"j": "移徙.入宅.出火.安门.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0202": {
			"y": "祭祀.沐浴.补垣.塞穴.断蚁.解除.余事勿取.",
			"j": "造庙.入宅.修造.安葬.行丧.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0204": {
			"y": "移徙.祭祀.开光.祈福.出行.解除.进人口.雇庸.安床.动土.起基.上梁.安门.解除.",
			"j": "嫁娶.安葬.破土.作梁.纳畜.牧养.行丧.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0205": {
			"y": "嫁娶.开光.祈福.求嗣.解除.动土.安床.栽种.开池.掘井.祭祀.破土.启攒.",
			"j": "入宅.作灶.伐木.安葬.出火.出行.纳畜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0207": {
			"y": "裁衣.伐木.作梁.纳财.交易.立券.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0208": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.动土.上梁.进人口.入宅.移徙.安床.开市.交易.立券.挂匾.入殓.破土.安葬.启攒.除服.成服.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0209": {
			"y": "嫁娶.冠笄.纳采.出行.会亲友.上梁.安机械.安床.牧养.畋猎.祭祀.祈福.开光.修造.安门.造屋.起基.",
			"j": "入宅.作灶.治病.安葬.移徙.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0210": {
			"y": "修饰垣墙.平治道涂.祭祀.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0211": {
			"y": "造车器.纳采.订盟.祭祀.祈福.求嗣.移徙.出行.开市.出火.入宅.立券.交易.入宅.安门.安床.安葬.谢土.",
			"j": "开光.造屋.动土.作灶.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0212": {
			"y": "动土.入殓.嫁娶.移柩.安葬.破土.",
			"j": "开市.作灶.安床.入宅.上梁.裁衣.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0214": {
			"y": "祭祀.斋醮.沐浴.开生坟.除服.成服.移柩.入殓.破土.安葬.合寿木.",
			"j": "开市.嫁娶.安床.会亲友.入宅.作灶.上梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0215": {
			"y": "祭祀.塞穴.结网.破土.谢土.安葬.移柩.除服.成服.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0217": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.开市.交易.立券.动土.纳财.掘井.会亲友.",
			"j": "入宅.安葬.伐木.作梁.纳畜.造畜椆栖.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0218": {
			"y": "祭祀.祈福.求嗣.纳畜.入殓.启攒.谢土.除服.成服.",
			"j": "栽种.开光.出行.针灸.嫁娶.入宅.动土.破土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0219": {
			"y": "开光.解除.伐木.竖柱.上梁.交易.立券.纳畜.入殓.移柩.安葬.",
			"j": "入宅.出行.移徙.祭祀.嫁娶.动土.破土.作灶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0220": {
			"y": "祭祀.祈福.求嗣.开光.嫁娶.出行.解除.伐木.拆卸.进人口.安床.动土.起基.上梁.栽种.纳畜.破土.谢土.启攒.安葬.",
			"j": "移徙.入宅.出火.作灶.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0221": {
			"y": "会亲友.冠笄.安床.会亲友.安机械.祭祀.祈福.求嗣.经络.",
			"j": "嫁娶.开市.动土.作灶.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0222": {
			"y": "作灶.解除.平治道涂.余事勿取.",
			"j": "祭祀.祈福.安葬.安门.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0224": {
			"y": "纳采.嫁娶.祭祀.祈福.出行.修造.动土.移徙.入宅.安葬.破土.",
			"j": "开市.入宅.斋醮.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0225": {
			"y": "祭祀.沐浴.解除.理发.扫舍.破屋.坏垣.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0228": {
			"y": "纳采.祭祀.祈福.出行.会亲友.修造.动土.移徙.入宅.",
			"j": "嫁娶.开市.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0327": {
			"y": "冠笄.立券.交易.修造.动土.安机械.入殓.安葬.破土.",
			"j": "嫁娶.祈福.出火.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0317": {
			"y": "塞穴.整手足甲.解除.捕捉.畋猎.结网.余事勿取.诸事不宜.",
			"j": "嫁娶.作灶.掘井.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0328": {
			"y": "祭祀.会亲友.出行.立券.交易.冠笄.纳财.",
			"j": "嫁娶.动土.掘井.起基.定磉.破土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0323": {
			"y": "纳采.交易.立券.安床.安机械.安葬.移柩.动土.破土.立碑.",
			"j": "嫁娶.开光.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0307": {
			"y": "祭祀.嫁娶.纳婿.安葬.",
			"j": "栽种.造屋.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0326": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.修造.动土.移徙.入宅.破土.出火.安门.安床.上梁.立碑.移柩.",
			"j": "开市.交易.合帐.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0325": {
			"y": "纳财.交易.立券.栽种.捕捉.结网.取渔.进人口.教牛马.理发.",
			"j": "入宅.造屋.竖柱.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0427": {
			"y": "纳采.祭祀.祈福.求嗣.斋醮.出行.起基.造屋.定磉.安门.入殓.安葬.",
			"j": "嫁娶.开市.纳财.出火.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0302": {
			"y": "祭祀.祈福.求嗣.斋醮.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "嫁娶.动土.开光.造屋.破土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0303": {
			"y": "纳采.会亲友.竖柱.上梁.立券.入殓.移柩.安葬.启攒.",
			"j": "祭祀.移徙.入宅.动土.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0304": {
			"y": "祭祀.祈福.斋醮.出行.开市.立券.动土.移徙.入宅.破土.安葬.",
			"j": "开光.嫁娶.作灶.掘井.纳畜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0305": {
			"y": "会亲友.求嗣.理发.冠笄.结网.捕捉.开光.理发.",
			"j": "开市.动土.安葬.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0306": {
			"y": "开光.塑绘.求嗣.纳采.裁衣.合帐.冠笄.安机械.作梁.开柱眼.安门.安床.造仓.祭祀.会亲友.祈福.经络.纳财.开市.立券.交易.入学.求嗣.理发.架马.",
			"j": "出行.斋醮.安葬.嫁娶.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0308": {
			"y": "祭祀.会亲友.订盟.裁衣.合帐.安机械.拆卸.上梁.安门.入殓.除服.成服.移柩.启攒.安葬.立碑.开光.塑绘.入学.出行.起基.定磉.放水.移徙.入宅.竖柱.立券.经络.",
			"j": "伐木.作梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0309": {
			"y": "祭祀.开光.塑绘.祈福.斋醮.裁衣.合帐.冠笄.嫁娶.拆卸.动土.移徙.入宅.入殓.移柩.安葬.谢土.求嗣.入学.理发.伐木.架马.作梁.出火.修造.起基.定磉.放水.赴任.",
			"j": "入宅.安门.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0310": {
			"y": "祭祀.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0311": {
			"y": "嫁娶.祭祀.出行.冠笄.立券.交易.进人口.开市.移徙.修造.动土.安床.入殓.移柩.破土.",
			"j": "开光.作灶.斋醮.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0312": {
			"y": "开市.立券.交易.挂匾.祭祀.祈福.开光.入宅.移徙.安床.拆卸.动土.上梁.进人口.",
			"j": "嫁娶.行丧.架马.作梁.理发.牧养.安葬.纳畜.伐木.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0313": {
			"y": "理发.冠笄.嫁娶.进人口.",
			"j": "置产.伐木.纳畜.造畜椆栖.安葬.破土.作梁.作灶.开生坟.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0314": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出火.入宅.移徙.安床.拆卸.动土.破土.谢土.",
			"j": "合帐.开市.安葬.入殓.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0315": {
			"y": "安床.伐木.拆卸.修造.动土.上梁.立券.交易.栽种.纳畜.牧养.入殓.安葬.",
			"j": "嫁娶.祭祀.开光.出行.出火.移徙.入宅.安门.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0316": {
			"y": "祭祀.祈福.求嗣.斋醮.嫁娶.冠笄.出行.开市.交易.会亲友.教牛马.除服.成服.启攒.安葬.移柩.",
			"j": "祈福.动土.移徙.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0318": {
			"y": "纳财.开市.立券.交易.开光.安床.上梁.造屋.修造.起基.",
			"j": "动土.破土.安葬.行丧.赴任.出行.嫁娶.入宅.移徙.谢土.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0319": {
			"y": "祭祀.祈福.嫁娶.冠笄.修饰垣墙.置产.平治道涂.",
			"j": "开仓.出货财.造屋.作灶.开市.交易.立券.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0320": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.出火.进人口.入宅.移徙.安床.拆卸.修造.安门.挂匾.纳财.扫舍.",
			"j": "动土.伐木.安葬.行丧.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0321": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.出行.出火.入宅.移徙.解除.栽种.伐木.破土.谢土.安葬.",
			"j": "开市.交易.作灶.纳财.上梁.安床.造屋.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0322": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "开光.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0324": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.开光.理发.经络.解除.治病.治病.立碑.栽种.牧养.掘井.开池.",
			"j": "嫁娶.定磉.合寿木.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0329": {
			"y": "祭祀.沐浴.解除.扫舍.塞穴.牧养.",
			"j": "嫁娶.安葬.行丧.安门.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0330": {
			"y": "纳财.开市.交易.立券.开光.针灸.会亲友.理发.安床.造仓.结网.",
			"j": "移徙.入宅.栽种.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0331": {
			"y": "嫁娶.冠笄.会亲友.安机械.纳财.交易.立券.置产.",
			"j": "开市.造屋.治病.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0422": {
			"y": "祭祀.修饰垣墙.余事勿取.",
			"j": "开光.修造.动土.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0402": {
			"y": "祈福.斋醮.出行.移徙.入宅.修造.动土.破土.安葬.",
			"j": "纳采.开光.安床.嫁娶.开市.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0412": {
			"y": "开光.出行.交易.塞穴.嫁娶.理发.开市.安床.",
			"j": "祈福.出火.置产.动土.破土.安葬.修造.上梁.置产.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0421": {
			"y": "祭祀.出行.修造.动土.合帐.造畜椆栖.安床.移徙.入殓.移柩.破土.启攒.安葬.开生坟.合寿木.补垣.塞穴.",
			"j": "移徙.入宅.作灶.理发.开光.安门.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0522": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.动土.修造.进人口.入宅.移徙.安床.解除.挂匾.栽种.破土.谢土.入殓.移柩.安葬.",
			"j": "开市.立券.造船.合寿木.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0401": {
			"y": "嫁娶.造车器.纳采.订盟.祭祀.祈福.安机械.移徙.入宅.开市.立券.破土.安葬.",
			"j": "纳畜.理发.合寿木.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0403": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "嫁娶.移徙.开市.入宅.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0404": {
			"y": "嫁娶.冠笄.祭祀.出行.会亲友.修造.动土.入殓.破土.",
			"j": "塑绘.开光.造桥.除服.成服.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0405": {
			"y": "塞穴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0406": {
			"y": "祭祀.祈福.求嗣.开光.解除.纳采.冠笄.出火.拆卸.进人口.安床.动土.上梁.造庙.掘井.开池.入殓.移柩.安葬.破土.",
			"j": "",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0407": {
			"y": "解除.破屋.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0408": {
			"y": "嫁娶.祈福.求嗣.开光.出行.解除.拆卸.出火.开市.立券.交易.入宅.移徙.安床.动土.破土.谢土.",
			"j": "祭祀.入殓.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0409": {
			"y": "祭祀.裁衣.冠笄.安床.交易.立券.开池.补垣.塞穴.入殓.破土.启攒.安葬.谢土.除服.成服.",
			"j": "嫁娶.掘井.探病.开市.开光.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0410": {
			"y": "祭祀.出行.教牛马.扫舍.余事勿取.",
			"j": "开光.伐木.安葬.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0411": {
			"y": "祭祀.祈福.求嗣.开光.纳采.订盟.解除.栽种.纳畜.牧养.扫舍.进人口.",
			"j": "修坟.造桥.作灶.出行.安葬.造屋.入宅.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0413": {
			"y": "祭祀.作灶.畋猎.结网.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.安床.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0414": {
			"y": "沐浴.祭祀.解除.安葬.破土.谢土.移柩.余事勿取.",
			"j": "斋醮.开光.嫁娶.入宅.上梁.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0415": {
			"y": "祭祀.解除.入殓.移柩.启攒.安葬.整手足甲.捕捉.畋猎.取渔.除服.成服.扫舍.谢土.斋醮.",
			"j": "动土.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0416": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.开市.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0417": {
			"y": "沐浴.塞穴.畋猎.结网.取渔.扫舍.余事勿取.",
			"j": "祈福.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0418": {
			"y": "开市.交易.立券.挂匾.祭祀.开光.祈福.求嗣.安床.解除.修造.安葬.",
			"j": "纳采.问名.订盟.嫁娶.入宅.开仓.出火.动土.破土.纳畜.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0419": {
			"y": "祭祀.修门.取渔.纳财.纳畜.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0420": {
			"y": "安香.出火.纳采.订盟.嫁娶.开市.立券.交易.挂匾.开光.出行.解除.安床.栽种.置产.拆卸.修造.动土.",
			"j": "作灶.安葬.祭祀.入殓.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0423": {
			"y": "嫁娶.祭祀.祈福.求嗣.斋醮.开光.出火.移徙.入宅.竖柱.上梁.会亲友.造屋.起基.治病.治病.安门.造车器.掘井.开池.",
			"j": "纳采.出行.修坟.安葬.开市.立券.作灶.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0424": {
			"y": "祭祀.塑绘.开光.纳采.嫁娶.开市.出行.会亲友.安床.结网.除服.成服.启攒.安葬.移柩.",
			"j": "祈福.入宅.造屋.动土.破土.探病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0425": {
			"y": "祭祀.作灶.平治道涂.余事勿取.",
			"j": "安床.入宅.安碓硙.栽种.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0426": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.纳畜.入殓.破土.安葬.",
			"j": "移徙.入宅.嫁娶.出行.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0428": {
			"y": "祭祀.沐浴.解除.求医.治病.破屋.坏垣.余事勿取.",
			"j": "祈福.斋醮.开市.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0429": {
			"y": "沐浴.捕捉.畋猎.结网.取渔.",
			"j": "祭祀.嫁娶.入宅.作灶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0430": {
			"y": "祭祀.祈福.求嗣.斋醮.纳采.订盟.开光.竖柱.上梁.开仓.出货财.造屋.起基.定磉.安门.诸事不宜.破土.入殓.启攒.谢土.",
			"j": "出火.嫁娶.开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0526": {
			"y": "祭祀.结网.捕捉.余事勿取.",
			"j": "探病.嫁娶.开市.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0516": {
			"y": "嫁娶.交易.立券.作厕.补垣.塞穴.畋猎.取渔.开生坟.",
			"j": "安床.开渠.上梁.修造.开市.开光.入宅.移徙.安床.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0512": {
			"y": "纳采.订盟.嫁娶.造车器.祭祀.祈福.求嗣.开光.出火.拆卸.修造.动土.进人口.挂匾.入宅.移徙.安床.栽种.入殓.破土.安葬.除服.成服.",
			"j": "开市.立券.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0506": {
			"y": "开市.交易.立券.挂匾.开光.出行.拆卸.进人口.入宅.移柩.动土.安门.上梁.栽种.破土.修坟.安葬.",
			"j": "嫁娶.安床.探病.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0523": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "开光.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0513": {
			"y": "开市.交易.立券.祭祀.祈福.开光.动土.安床.出行.栽种.纳畜.牧养.竖柱.上梁.解除.破土.",
			"j": "嫁娶.掘井.入宅.移徙.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0503": {
			"y": "祭祀.祈福.求嗣.斋醮.冠笄.作灶.纳财.交易.",
			"j": "开光.嫁娶.掘井.安葬.安门.探病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0528": {
			"y": "嫁娶.冠笄.祭祀.出行.移徙.入宅.作灶.造车器.补垣.塞穴.作厕.破土.启攒.除服.成服.入殓.",
			"j": "入宅.造屋.造桥.安门.安葬.上梁.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0518": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.开光.解除.出行.出火.入宅.移徙.栽种.纳畜.牧养.动土.破土.入殓.安葬.",
			"j": "作灶.安床.开仓.造屋.动土.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0530": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.治病.造车器.修造.动土.移徙.入宅.",
			"j": "开市.出行.安床.作灶.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0626": {
			"y": "祭祀.沐浴.理发.整手足甲.修饰垣墙.平治道涂.余事勿取.",
			"j": "开市.入宅.出行.修造.词讼.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0501": {
			"y": "祭祀.捕捉.解除.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0502": {
			"y": "纳采.嫁娶.出行.开市.立券.纳畜.牧养.出火.移徙.入宅.",
			"j": "祈福.动土.破土.安葬.入殓.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0504": {
			"y": "祭祀.解除.教牛马.出行.余事勿取.",
			"j": "动土.破土.行丧.开光.作梁.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0505": {
			"y": "沐浴.斋醮.解除.求医.治病.会亲友.造畜椆栖.栽种.理发.扫舍.",
			"j": "开市.嫁娶.移徙.入宅.掘井.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0507": {
			"y": "进人口.会亲友.",
			"j": "塞穴.上梁.动土.伐木.安葬.词讼.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0508": {
			"y": "沐浴.平治道涂.扫舍.入殓.破土.安葬.除服.成服.",
			"j": "嫁娶.移徙.伐木.作梁.安床.祭祀.祈福.造屋.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0509": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.出行.拆卸.动土.解除.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.安门.上梁.安葬.破土.谢土.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0510": {
			"y": "祭祀.祈福.求嗣.开光.解除.合帐.冠笄.伐木.架马.作梁.修造.进人口.嫁娶.裁衣.合帐.安床.动土.起基.上梁.竖柱.放水.会亲友.",
			"j": "",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0511": {
			"y": "破屋.坏垣.沐浴.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0514": {
			"y": "解除.出行.纳采.冠笄.竖柱.上梁.移徙.作灶.进人口.入宅.纳畜.牧养.",
			"j": "祭祀.伐木.架马.安床.修造.动土.安葬.修坟.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0515": {
			"y": "祭祀.祈福.求嗣.开光.出行.开市.交易.立券.栽种.安床.纳畜.移徙.起基.动土.定磉.造仓.置产.破土.启攒.修坟.",
			"j": "入宅.移徙.修造.安门.伐木.入殓.安葬.造屋.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0517": {
			"y": "塞穴.断蚁.结网.畋猎.余事勿取.",
			"j": "嫁娶.安葬.入宅.出行.动土.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0519": {
			"y": "开光.纳采.裁衣.冠笄.安床.作灶.进人口.造仓.塞穴.",
			"j": "嫁娶.栽种.修造.动土.出行.伐木.作梁.安葬.谢土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0520": {
			"y": "纳采.嫁娶.裁衣.理发.出行.修造.动土.进人口.开市.交易.立券.挂匾.移徙.上梁.栽种.纳畜.",
			"j": "伐木.安葬.安床.祭祀.祈福.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0521": {
			"y": "开市.交易.立券.挂匾.祭祀.祈福.斋醮.出行.开市.交易.立券.造屋.起基.修造.动土.定磉.安床.安机械.安葬.破土.启攒.除服.成服.立碑.",
			"j": "作灶.嫁娶.移徙.入宅.理发.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0524": {
			"y": "订盟.纳采.嫁娶.解除.祭祀.祈福.求嗣.开光.出行.解除.出火.拆卸.入宅.移徙.安床.栽种.纳畜.动土.破土.谢土.安葬.修坟.",
			"j": "作灶.开市.经络.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0525": {
			"y": "祭祀.祈福.求嗣.开光.订盟.纳采.解除.动土.起基.进人口.开市.交易.立券.纳财.造仓.开池.栽种.纳畜.破土.安葬.",
			"j": "安床.上梁.裁衣.入宅.嫁娶.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0527": {
			"y": "祭祀.祈福.求嗣.开光.纳采.订盟.嫁娶.出行.动土.破土.会亲友.开市.交易.立券.习艺.拆卸.起基.安碓硙.放水.开池.造仓.开渠.栽种.谢土.启攒.修坟.立碑.",
			"j": "入宅.安门.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0529": {
			"y": "祭祀.解除.断蚁.会亲友.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0531": {
			"y": "嫁娶.纳采.订盟.会亲友.安机械.结网.冠笄.祭祀.求嗣.进人口.经络.",
			"j": "开市.作灶.动土.行丧.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0624": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.拆卸.修造.进人口.入宅.移徙.动土.安床.纳畜.栽种.纳财.交易.立券.挂匾.造畜椆栖.",
			"j": "安葬.开生坟.合寿木.行丧.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0614": {
			"y": "嫁娶.祭祀.理发.作灶.修饰垣墙.平治道涂.整手足甲.沐浴.冠笄.",
			"j": "破土.出行.栽种.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0622": {
			"y": "嫁娶.合帐.裁衣.冠笄.伐木.上梁.出火.拆卸.移徙.修造.动土.安门.纳财.筑堤.栽种.塞穴.",
			"j": "安床.祈福.出行.安葬.行丧.开光.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0629": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "入宅.嫁娶.移徙.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0604": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0628": {
			"y": "纳采.订盟.冠笄.祭祀.祈福.斋醮.出行.修造.动土.移徙.入宅.安香.出火.拆卸.造屋.起基.竖柱.上梁.定磉.安门.开池.",
			"j": "嫁娶.开市.合寿木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0618": {
			"y": "祭祀.斋醮.塑绘.开光.出行.修造.动土.造畜椆栖.安床.放水.掘井.开池.作厕.结网.破土.",
			"j": "出火.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0608": {
			"y": "祭祀.作灶.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0625": {
			"y": "安机械.祭祀.祈福.求嗣.沐浴.解除.纳采.开市.修造.竖柱.上梁.开柱眼.安碓硙.归岫.补垣.塞穴.拆卸.放水.出火.扫舍.开生坟.合寿木.安葬.谢土.启攒.除服.成服.",
			"j": "嫁娶.安床.作灶.动土.破土.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0630": {
			"y": "嫁娶.安机械.交易.出行.祭祀.祈福.求嗣.斋醮.塑绘.开光.合帐.裁衣.放水.开池.掘井.",
			"j": "作灶.理发.造桥.行丧.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0620": {
			"y": "祭祀.结网.余事勿取.",
			"j": "入宅.出行.掘井.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0726": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.斋醮.开光.会亲友.求医.治病.造屋.起基.竖柱.上梁.安门.安碓硙.筑堤.开池.破土.安葬.除服.成服.",
			"j": "入宅.开市.掘井.词讼.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0601": {
			"y": "祭祀.沐浴.移徙.破土.安葬.扫舍.平治道涂.",
			"j": "祈福.嫁娶.入宅.安床.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0602": {
			"y": "祭祀.祈福.斋醮.求嗣.安机械.纳畜.移徙.入宅.安机械.塑绘.开光.起基.竖柱.上梁.作灶.安门.安香.出火.造屋.启攒.安葬.",
			"j": "动土.破土.嫁娶.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0603": {
			"y": "嫁娶.纳采.订盟.斋醮.开光.祭祀.祈福.求医.治病.会亲友.动土.解除.捕捉.纳畜.牧养.入殓.破土.安葬.",
			"j": "移徙.入宅.造屋.架马.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0605": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "斋醮.开市.嫁娶.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0606": {
			"y": "开市.交易.立券.纳财.开池.作厕.结网.祭祀.修造.动土.安床.放水.经络.破土.",
			"j": "嫁娶.造桥.词讼.移徙.安门.作灶.栽种.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0607": {
			"y": "开市.交易.立券.纳财.栽种.安床.拆卸.修造.动土.上梁.入殓.安葬.破土.除服.成服.",
			"j": "嫁娶.出火.伐木.祭祀.入宅.移徙.纳畜.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0609": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0610": {
			"y": "修造.动土.起基.安门.安床.栽种.筑堤.补垣.造畜椆栖.",
			"j": "嫁娶.掘井.入宅.移徙.出火.出行.行丧.安葬.开光.理发.进人口.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0611": {
			"y": "祭祀.教牛马.断蚁.余事勿取.",
			"j": "斋醮.移徙.入宅.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0612": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.开市.纳财.立券.移徙.出行.修造.动土.起基.定磉.竖柱.拆卸.扫舍.放水.安香.安床.造船.开池.掘井.造畜椆栖.栽种.",
			"j": "行丧.安葬.破土.作灶.伐木.斋醮.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0613": {
			"y": "嫁娶.开光.祭祀.祈福.出行.解除.移徙.入宅.开市.纳财.起基.修造.竖柱.上梁.造屋.作灶.出火.安香.补垣.塞穴.拆卸.放水.扫舍.造仓.造船.栽种.安葬.",
			"j": "纳采.订盟.安床.谢土.破土.动土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0615": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.进人口.入宅.移徙.安床.交易.立券.挂匾.纳财.入殓.安葬.启攒.除服.成服.",
			"j": "动土.掘井.破土.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0616": {
			"y": "畋猎.捕捉.结网.取渔.祭祀.沐浴.余事勿取.",
			"j": "嫁娶.开市.安葬.启攒.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0617": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "移徙.入宅.开仓.出货财.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0619": {
			"y": "开市.交易.立券.挂匾.开光.解除.拆卸.动土.安床.修造.上梁.置产.栽种.破土.安葬.",
			"j": "作灶.出火.祭祀.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0621": {
			"y": "嫁娶.纳采.订盟.冠笄.造车器.祭祀.开光.祈福.求嗣.出行.解除.伐木.出火.入宅.拆卸.修造.动土.上梁.安床.栽种.破土.",
			"j": "行丧.置产.入宅.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0623": {
			"y": "出行.教牛马.割蜜.余事勿取.",
			"j": "斋醮.造屋.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0627": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.立券.移徙.入宅.动土.破土.安葬.",
			"j": "开光.作灶.造屋.架马.开仓.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0728": {
			"y": "纳采.订盟.嫁娶.祭祀.沐浴.塑绘.开光.出火.治病.习艺.伐木.造屋.竖柱.上梁.安床.作灶.安碓硙.挂匾.掘井.纳畜.",
			"j": "出行.安葬.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0730": {
			"y": "祭祀.修造.出行.造屋.竖柱.造车器.教牛马.造畜椆栖.割蜜.",
			"j": "动土.破土.掘井.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0727": {
			"y": "纳采.订盟.嫁娶.移徙.入宅.出行.祭祀.祈福.斋醮.塑绘.开光.安香.出火.会亲友.解除.入学.竖柱.上梁.拆卸.造屋.起基.栽种.牧养.纳畜.",
			"j": "安葬.破土.开市.开仓.出货财.启攒.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0720": {
			"y": "嫁娶.纳采.订盟.造车器.开光.出行.拆卸.起基.安床.除服.成服.开市.交易.立券.栽种.牧养.入殓.移柩.启攒.",
			"j": "上梁.入宅.修造.动土.破土.祭祀.祈福.斋醮.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0717": {
			"y": "经络.祭祀.沐浴.补垣.塞穴.除服.成服.移柩.入殓.启攒.立碑.",
			"j": "开光.治病.嫁娶.掘井.破土.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0707": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.拆卸.修造.动土.进人口.开市.交易.立券.挂匾.入宅.移徙.栽种.纳畜.入殓.启攒.除服.成服.",
			"j": "",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0718": {
			"y": "嫁娶.祭祀.出行.裁衣.冠笄.交易.雕刻.纳财.造畜椆栖.造车器.雕刻.教牛马.",
			"j": "移徙.入宅.栽种.动土.破土.作灶.安葬.行丧.伐木.上梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0708": {
			"y": "嫁娶.开光.解除.安床.牧养.理发.开市.入殓.启攒.移柩.安葬.扫舍.",
			"j": "作灶.动土.上梁.栽种.入宅.移徙.修造.祈福.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0828": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.斋醮.普渡.移徙.入宅.出行.安机械.开光.修造.动土.竖柱.上梁.造屋.起基.定磉.安门.安葬.破土.",
			"j": "开市.立券.置产.作灶.造桥.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0701": {
			"y": "纳采.冠笄.求医.治病.开市.立券.修造.动土.安机械.破土.安葬.",
			"j": "斋醮.祭祀.移徙.入宅.上梁.嫁娶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0702": {
			"y": "祭祀.作灶.余事勿取.",
			"j": "开市.安葬.破土.修坟.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0703": {
			"y": "祭祀.祈福.求嗣.斋醮.安香.解除.移徙.入宅.会亲友.求医.治病.动土.破土.开生坟.合寿木.",
			"j": "合帐.上梁.经络.安葬.入殓.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0704": {
			"y": "嫁娶.冠笄.修造.动土.作灶.移徙.入宅.补垣.塞穴.纳畜.牧养.架马.修造.动土.起基.定磉.开池.造船.",
			"j": "祈福.开光.掘井.开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0705": {
			"y": "祭祀.交易.纳财.",
			"j": "斋醮.开渠.上梁.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0706": {
			"y": "嫁娶.订盟.纳采.冠笄.会亲友.安机械.造车器.祭祀.出行.纳财.入宅.安香.出火.入学.塑绘.开光.拆卸.起基.修造.动土.牧养.栽种.安门.作厕.",
			"j": "行丧.伐木.作梁.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0709": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0710": {
			"y": "祭祀.祈福.求嗣.开光.伐木.出火.拆卸.入宅.安床.修造.动土.上梁.挂匾.纳畜.",
			"j": "嫁娶.栽种.行丧.理发.修坟.行丧.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0711": {
			"y": "解除.祭祀.理发.入殓.安葬.破土.",
			"j": "嫁娶.开市.出火.作灶.置产.斋醮.入宅.移徙.安门.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0712": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0713": {
			"y": "开市.交易.立券.纳财.动土.开光.出行.嫁娶.纳采.订盟.出行.纳财.入学.开仓.出货财.纳畜.牧养.栽种.破土.启攒.安葬.立碑.",
			"j": "入宅.移徙.作灶.祭祀.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0714": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.入殓.破土.谢土.安葬.",
			"j": "掘井.伐木.纳畜.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0715": {
			"y": "祭祀.冠笄.作灶.交易.纳财.栽种.结网.纳畜.牧养.进人口.",
			"j": "开渠.造船.安床.安葬.破土.出行.修坟.掘井.开市.开生坟.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0716": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.纳采.裁衣.冠笄.开光.安床.作梁.修造.动土.作灶.起基.上梁.造屋.纳畜.牧养.",
			"j": "移徙.栽种.出行.行丧.破土.安葬.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0719": {
			"y": "修造.动土.安机械.祭祀.沐浴.解除.拆卸.治病.作灶.造屋.起基.开池.扫舍.造畜椆栖.开生坟.合寿木.安葬.破土.启攒.移柩.入殓.立碑.",
			"j": "开市.入宅.出行.安床.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0721": {
			"y": "祭祀.嫁娶.畋猎.结网.",
			"j": "动土.破土.治病.开渠.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0722": {
			"y": "纳采.订盟.会亲友.入学.祭祀.祈福.求嗣.开光.出行.解除.理发.动土.起基.开市.交易.立券.纳财.造仓.栽种.纳畜.牧养.",
			"j": "嫁娶.作灶.出火.置产.嫁娶.入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0723": {
			"y": "祭祀.祈福.解除.整手足甲.安床.沐浴.入殓.移柩.破土.启攒.安葬.谢土.",
			"j": "嫁娶.斋醮.开市.出火.入宅.移徙.出行.作灶.安门.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0724": {
			"y": "破屋.坏垣.解除.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0725": {
			"y": "嫁娶.开市.立券.移徙.入宅.安机械.会亲友.经络.安门.安床.挂匾.拆卸.开仓.出货财.开池.栽种.纳畜.牧养.破土.安葬.启攒.移柩.入殓.立碑.",
			"j": "祭祀.祈福.探病.谢土.造桥.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0729": {
			"y": "祭祀.入殓.除服.成服.移柩.破土.启攒.安葬.塞穴.断蚁.结网.",
			"j": "开市.入宅.嫁娶.开光.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0731": {
			"y": "祭祀.沐浴.塑绘.开光.入学.解除.扫舍.治病.开池.牧养.",
			"j": "嫁娶.出行.纳采.入宅.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0827": {
			"y": "祭祀.理发.作灶.沐浴.修饰垣墙.平治道涂.",
			"j": "嫁娶.栽种.祈福.造桥.安葬.安门.伐木.作梁.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0825": {
			"y": "解除.祭祀.祈福.求嗣.修造.动土.竖柱.上梁.安床.纳畜.造屋.合脊.起基.入殓.破土.安葬.",
			"j": "出火.嫁娶.开光.进人口.出行.词讼.开市.入宅.移徙.赴任.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0817": {
			"y": "破土.安葬.移柩.入殓.祭祀.捕捉.除服.成服.余事勿取.",
			"j": "嫁娶.入宅.开市.交易.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0815": {
			"y": "修饰垣墙.平治道涂.祭祀.沐浴.作灶.",
			"j": "嫁娶.词讼.治病.置产.作梁.祈福.安葬.栽种.伐木.安门.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0830": {
			"y": "沐浴.破屋.坏垣.余事勿取.",
			"j": "斋醮.开市.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0824": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.出行.解除.竖柱.入宅.移徙.纳财.上梁.纳畜.入殓.安葬.启攒.",
			"j": "栽种.掘井.动土.安床.破土.置产.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0814": {
			"y": "纳采.订盟.开光.出行.解除.安香.出火.拆卸.入宅.移徙.修造.上梁.安床.栽种.纳畜.会亲友.安机械.经络.",
			"j": "伐木.谢土.行丧.祭祀.作灶.动土.破土.安葬.祈福.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0823": {
			"y": "祭祀.出行.作梁.出火.拆卸.修造.动土.起基.安床.补垣.塞穴.入殓.破土.安葬.移柩.造畜椆栖.",
			"j": "嫁娶.入宅.斋醮.开光.针灸.掘井.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0831": {
			"y": "订盟.纳采.祭祀.祈福.安香.出火.开市.立券.入宅.挂匾.造桥.启攒.安葬.",
			"j": "动土.破土.嫁娶.掘井.安床.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0818": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "祈福.纳采.订盟.嫁娶.入宅.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0805": {
			"y": "求医.治病.破屋.坏垣.余事勿取.",
			"j": "嫁娶.出行.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0930": {
			"y": "祭祀.出行.",
			"j": "嫁娶.入宅.修造.动土.会亲友.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0801": {
			"y": "纳财.开市.交易.立券.出行.祭祀.祈福.求嗣.开光.解除.扫舍.起基.竖柱.安床.移徙.开仓.出货财.补垣.塞穴.栽种.纳畜.牧养.",
			"j": "斋醮.入宅.安门.安葬.破土.行丧.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0802": {
			"y": "祭祀.修饰垣墙.平治道涂.",
			"j": "开市.动土.破土.嫁娶.修造.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0803": {
			"y": "订盟.纳采.祭祀.祈福.开光.安香.出火.立券.安机械.移徙.入宅.竖柱.上梁.会亲友.安床.拆卸.挂匾.牧养.教牛马.",
			"j": "嫁娶.安葬.行丧.破土.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0804": {
			"y": "沐浴.理发.捕捉.入殓.移柩.破土.启攒.安葬.",
			"j": "出火.嫁娶.入宅.作灶.破土.上梁.动土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0806": {
			"y": "纳采.订盟.嫁娶.移徙.入宅.出行.开市.交易.立券.纳财.会亲友.安香.出火.拆卸.造屋.起基.安床.作灶.挂匾.安葬.破土.启攒.立碑.入殓.移柩.",
			"j": "祈福.上梁.开仓.掘井.牧养.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0807": {
			"y": "祭祀.祈福.斋醮.出行.纳采.订盟.安机械.出火.拆卸.修造.动土.起基.移徙.入宅.造庙.入殓.除服.成服.移柩.破土.安葬.谢土.",
			"j": "嫁娶.开市.栽种.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0808": {
			"y": "嫁娶.出火.拆卸.祭祀.祈福.开光.伐木.动土.开市.交易.立券.入宅.移徙.安床.纳畜.入殓.安葬.",
			"j": "栽种.作灶.针灸.出行.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0809": {
			"y": "祭祀.开光.解除.移徙.裁衣.开市.立券.祈福.求嗣.进人口.交易.纳财.纳畜.",
			"j": "动土.破土.理发.出行.入宅.分居.安香.出火.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0810": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.安床.栽种.移柩.进人口.会亲友.除服.成服.",
			"j": "造屋.入殓.安葬.伐木.入宅.移徙.置产.纳畜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0811": {
			"y": "祭祀.动土.筑堤.开池.会亲友.塞穴.入殓.移柩.破土.安葬.",
			"j": "开光.出行.修造.上梁.入宅.安门.作灶.裁衣.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0812": {
			"y": "祭祀.裁衣.安门.纳财.扫舍.出行.进人口.作灶.纳畜.造畜椆栖.",
			"j": "安床.动土.安葬.开生坟.合寿木.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0813": {
			"y": "祭祀.解除.拆卸.修造.动土.起基.上梁.安床.安门.开渠.开池.入殓.破土.启攒.",
			"j": "嫁娶.出行.进人口.作灶.入宅.移徙.栽种.赴任.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0816": {
			"y": "嫁娶.祭祀.祈福.求嗣.出火.出行.开光.解除.拆卸.修造.进人口.安香.交易.立券.入宅.移徙.安床.动土.破土.谢土.安葬.入殓.除服.成服.",
			"j": "斋醮.开市.开仓.作灶.造船.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0819": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.安香.出火.解除.伐木.入宅.移徙.安床.开市.交易.立券.栽种.出火.出行.安葬.",
			"j": "掘井.理发.作灶.动土.破土.开池.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0820": {
			"y": "安机械.纳采.订盟.祭祀.祈福.求嗣.开光.普渡.出行.出火.拆卸.修造.动土.进人口.开市.交易.立券.移徙.安床.栽种.上梁.纳畜.破土.移柩.安葬.",
			"j": "入宅.嫁娶.掘井.牧养.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0821": {
			"y": "嫁娶.祭祀.祈福.求嗣.裁衣.冠笄.经络.修造.进人口.安床.动土.竖柱.上梁.移徙.交易.立券.栽种.会亲友.",
			"j": "行丧.安葬.出行.作梁.纳畜.伐木.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0822": {
			"y": "嫁娶.纳采.订盟.开光.祭祀.出行.理发.动土.安床.放水.开渠.栽种.进人口.",
			"j": "入宅.上梁.入殓.造屋.探病.作灶.安门.安葬.纳畜.伐木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0826": {
			"y": "沐浴.理发.会亲友.塑绘.开光.栽种.牧养.嫁娶.经络.补垣.塞穴.",
			"j": "开市.入宅.动土.破土.安葬.作灶.上梁.安床.开仓.祈福.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0829": {
			"y": "祭祀.普渡.捕捉.解除.结网.畋猎.入殓.破土.安葬.",
			"j": "开市.交易.入宅.嫁娶.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0920": {
			"y": "纳采.订盟.开市.交易.立券.挂匾.纳财.栽种.进人口.入宅.移徙.安床.开光.出火.拆卸.安门.修造.",
			"j": "斋醮.嫁娶.行丧.动土.作灶.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1030": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.斋醮.开光.安香.出火.造庙.移徙.出行.入宅.造庙.起基.竖柱.上梁.安床.纳畜.捕捉.纳婿.安葬.",
			"j": "开市.破土.掘井.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0901": {
			"y": "嫁娶.祭祀.祈福.斋醮.普渡.移徙.入宅.动土.治病.开市.交易.立券.开光.修造.造车器.安香.安床.捕捉.畋猎.结网.",
			"j": "纳采.订盟.经络.行丧.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0902": {
			"y": "嫁娶.订盟.纳采.作灶.冠笄.裁衣.会亲友.纳畜.牧养.安机械.开市.立券.纳财.安床.",
			"j": "掘井.出行.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0903": {
			"y": "嫁娶.订盟.纳采.祭祀.斋醮.普渡.解除.出行.会亲友.开市.纳财.修造.动土.竖柱.上梁.开光.开仓.出货财.纳畜.牧养.开池.破土.启攒.",
			"j": "出火.入宅.造屋.安门.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0904": {
			"y": "嫁娶.普渡.祭祀.祈福.补垣.塞穴.断蚁.筑堤.入殓.除服.成服.安葬.",
			"j": "动土.破土.掘井.开光.上梁.词讼.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0905": {
			"y": "嫁娶.冠笄.祭祀.沐浴.普渡.出行.纳财.扫舍.纳畜.赴任.",
			"j": "开市.动土.破土.安床.开仓.上梁.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0906": {
			"y": "祭祀.沐浴.理发.整手足甲.冠笄.解除.入殓.移柩.破土.启攒.安葬.",
			"j": "嫁娶.出行.入宅.开市.安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0907": {
			"y": "塑绘.冠笄.嫁娶.会亲友.进人口.经络.裁衣.栽种.纳畜.牧养.补垣.塞穴.捕捉.",
			"j": "祈福.开市.动土.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0908": {
			"y": "开市.交易.立券.挂匾.开光.出行.入宅.移徙.安床.出火.上梁.",
			"j": "作灶.行丧.理发.乘船.嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0909": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0910": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.开市.交易.立券.挂匾.栽种.纳畜.入殓.安葬.除服.成服.",
			"j": "",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0911": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0912": {
			"y": "祭祀.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0913": {
			"y": "嫁娶.纳采.订盟.祭祀.开光.出行.理发.作梁.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.移徙.拆卸.挂匾.栽种.纳畜.破土.安葬.入殓.除服.成服.",
			"j": "开市.掘井.开渠.造桥.造船.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0914": {
			"y": "开市.交易.立券.纳财.挂匾.栽种.祭祀.祈福.开光.拆卸.动土.安床.",
			"j": "嫁娶.破土.进人口.出行.入宅.移徙.出火.纳畜.词讼.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0915": {
			"y": "嫁娶.祭祀.理发.进人口.作灶.移柩.冠笄.会亲友.",
			"j": "开仓.出货财.伐木.纳畜.开市.上梁.造屋.破土.启攒.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0916": {
			"y": "祭祀.修坟.除服.成服.启攒.移柩.余事勿取.",
			"j": "开市.入宅.嫁娶.动土.破土.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0917": {
			"y": "嫁娶.冠笄.安机械.解除.纳畜.牧养.沐浴.伐木.架马.作梁.安门.扫舍.合寿木.安葬.启攒.立碑.修坟.",
			"j": "祈福.开光.开市.入宅.动土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0918": {
			"y": "祭祀.出行.沐浴.扫舍.安葬.余事勿取.",
			"j": "动土.破土.置产.掘井.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0919": {
			"y": "嫁娶.纳采.祭祀.解除.出行.修造.动土.开市.上梁.安床.整手足甲.扫舍.求医.治病.起基.定磉.造屋.合脊.",
			"j": "造庙.行丧.安葬.伐木.作灶.造船.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0921": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.入宅.安床.出行.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0922": {
			"y": "开光.祈福.求嗣.斋醮.修造.动土.纳财.造仓.作厕.栽种.牧养.会亲友.",
			"j": "作灶.出火.进人口.开渠.入宅.移徙.祭祀.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0923": {
			"y": "开光.解除.拆卸.修造.动土.竖柱.安门.牧养.安葬.修坟.破土.移柩.",
			"j": "出火.入宅.移徙.祈福.祭祀.安床.开市.嫁娶.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0924": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "移徙.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0925": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出行.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.上梁.合脊.放水.掘井.破土.移柩.谢土.除服.成服.",
			"j": "开市.开仓.安门.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0926": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.解除.进人口.入宅.移徙.出火.安床.开市.交易.立券.挂匾.",
			"j": "安葬.纳畜.出行.行丧.伐木.栽种.造庙.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0927": {
			"y": "祭祀.冠笄.捕捉.余事勿取.",
			"j": "嫁娶.开市.造屋.作梁.合寿木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0928": {
			"y": "祭祀.解除.结网.畋猎.取渔.会亲友.入学.移柩.启攒.除服.成服.",
			"j": "开市.祈福.动土.破土.入殓.安葬.造船.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0929": {
			"y": "冠笄.沐浴.出行.修造.动土.移徙.入宅.破土.安葬.",
			"j": "嫁娶.开市.祭祀.祈福.斋醮.纳采.修坟.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1020": {
			"y": "祭祀.求嗣.冠笄.进人口.会亲友.安门.安床.经络.纳财.牧养.畋猎.放水.割蜜.",
			"j": "祈福.斋醮.纳采.订盟.嫁娶.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1022": {
			"y": "祭祀.冠笄.移徙.会亲友.纳财.理发.捕捉.",
			"j": "嫁娶.开市.开池.作厕.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1010": {
			"y": "嫁娶.祭祀.作灶.纳财.",
			"j": "安葬.开市.修坟.立碑.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1024": {
			"y": "嫁娶.裁衣.冠笄.合帐.祭祀.出行.安床.移徙.塞穴.入殓.破土.移柩.安葬.",
			"j": "开市.出行.栽种.置产.词讼.安门.掘井.开光.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1012": {
			"y": "嫁娶.祭祀.祈福.求嗣.动土.安床.扫舍.入殓.移柩.破土.启攒.安葬.作灶.整手足甲.补垣.除服.成服.",
			"j": "开光.栽种.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1002": {
			"y": "出行.开市.交易.立券.安机械.出火.上梁.移徙.",
			"j": "嫁娶.安葬.动土.造桥.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1027": {
			"y": "纳采.订盟.开市.交易.立券.会亲友.纳畜.牧养.问名.移徙.解除.作厕.入学.起基.安床.开仓.出货财.安葬.启攒.入殓.除服.成服.",
			"j": "入宅.上梁.斋醮.出火.谢土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1124": {
			"y": "嫁娶.纳采.订盟.祭祀.开光.出行.解除.伐木.出火.入宅.移徙.拆卸.修造.栽种.安葬.入殓.",
			"j": "破土.动土.安门.作灶.开市.交易.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1001": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.修造.动土.移徙.入宅.",
			"j": "针灸.伐木.作梁.造庙.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1003": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "斋醮.嫁娶.移徙.出行.上梁.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1004": {
			"y": "嫁娶.造车器.安机械.祭祀.祈福.开光.安香.出火.出行.开市.立券.修造.动土.移徙.入宅.破土.安葬.",
			"j": "纳采.订盟.架马.词讼.开渠.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1005": {
			"y": "沐浴.捕捉.入殓.除服.成服.破土.启攒.安葬.",
			"j": "祭祀.嫁娶.安床.开市.入宅.探病.上梁.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1006": {
			"y": "余事勿取.",
			"j": "探病.余事勿取.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1007": {
			"y": "订盟.纳采.祭祀.祈福.安香.出火.修造.动土.上梁.安门.起基.竖柱.上梁.定磉.开池.移徙.入宅.立券.破土.",
			"j": "嫁娶.造庙.造桥.造船.作灶.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1008": {
			"y": "嫁娶.求嗣.纳采.进人口.纳财.结网.纳畜.牧养.会亲友.",
			"j": "上梁.作灶.伐木.出行.安葬.安门.理发.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1009": {
			"y": "嫁娶.祭祀.开市.开光.出行.入宅.移徙.出火.拆卸.修造.安床.",
			"j": "纳畜.伐木.置产.作梁.行丧.安葬.修坟.立碑.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1011": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.进人口.开市.交易.立券.挂匾.纳财.入宅.移徙.栽种.破土.谢土.",
			"j": "安床.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1013": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.上梁.入宅.移徙.安床.安门.纳财.纳畜.造畜椆栖.",
			"j": "伐木.行丧.破土.嫁娶.安葬.开渠.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1014": {
			"y": "祭祀.开光.出行.解除.理发.伐木.出火.拆卸.上梁.合脊.安床.造畜椆栖.",
			"j": "嫁娶.安葬.行丧.词讼.造桥.作灶.破土.动土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1015": {
			"y": "纳采.订盟.会亲友.沐浴.理发.裁衣.冠笄.安床.除服.成服.启攒.移柩.安葬.会亲友.开生坟.",
			"j": "开市.入宅.出行.嫁娶.修坟.祈福.动土.入宅.安门.谢土.上梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1016": {
			"y": "解除.祭祀.修饰垣墙.平治道涂.造畜椆栖.余事勿取.",
			"j": "嫁娶.开市.交易.入宅.入学.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1017": {
			"y": "入殓.破土.启攒.安葬.除服.成服.余事勿取.",
			"j": "开市.入宅.祭祀.置产.补垣.塞穴.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1018": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.拆卸.修造.动土.上梁.安床.纳畜.入殓.破土.",
			"j": "入宅.移徙.掘井.理发.伐木.交易.开市.作灶.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1019": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "嫁娶.入宅.上梁.出行.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1021": {
			"y": "嫁娶.纳采.订盟.开市.交易.立券.挂匾.祭祀.祈福.开光.造车器.挂匾.出行.入宅.移徙.安床.安门.拆卸.修造.动土.栽种.安葬.破土.启攒.除服.成服.入殓.立碑.",
			"j": "探病.纳畜.伐木.起基.作梁.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1023": {
			"y": "祭祀.祈福.求嗣.斋醮.开光.出行.嫁娶.求医.治病.动土.破土.入学.起基.扫舍.竖柱.上梁.开仓.出货财.置产.栽种.牧养.开生坟.谢土.立碑.",
			"j": "安门.安床.裁衣.入宅.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1025": {
			"y": "祭祀.造车器.出行.修造.上梁.造屋.安门.安床.造畜椆栖.教牛马.",
			"j": "出货财.开仓.动土.破土.安葬.行丧.伐木.开渠.栽种.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1026": {
			"y": "祭祀.开光.出行.解除.伐木.作梁.出火.拆卸.入宅.移徙.安床.修造.造畜椆栖.扫舍.",
			"j": "造庙.嫁娶.掘井.栽种.造桥.作灶.动土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1028": {
			"y": "祭祀.平治道涂.余事勿取.",
			"j": "嫁娶.开市.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1029": {
			"y": "捕捉.畋猎.余事勿取.",
			"j": "开市.交易.祭祀.入宅.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1031": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "开市.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1104": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.求医.治病.出火.移徙.入宅.",
			"j": "开市.开仓.出货财.安床.安门.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1121": {
			"y": "祭祀.塑绘.理发.会亲友.牧养.开池.造畜椆栖.畋猎.结网.",
			"j": "祈福.谢土.安葬.上梁.作灶.开市.嫁娶.出行.入宅.动土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1224": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.塑绘.解除.拆卸.修造.动土.竖柱.上梁.安门.置产.开池.掘井.纳畜.安床.栽种.造畜椆栖.破土.移柩.立碑.",
			"j": "嫁娶.开市.出火.进人口.入殓.赴任.入宅.移徙.出行.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1101": {
			"y": "订盟.纳采.会亲友.交易.立券.纳财.栽种.纳畜.牧养.",
			"j": "嫁娶.开市.入宅.祈福.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1102": {
			"y": "造车器.嫁娶.订盟.纳采.会亲友.祭祀.出行.开市.立券.移徙.入宅.破土.安葬.",
			"j": "上梁.开光.造屋.架马.合寿木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1103": {
			"y": "祭祀.作灶.纳财.捕捉.畋猎.余事勿取.",
			"j": "动土.破土.开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1105": {
			"y": "冠笄.祭祀.沐浴.作灶.理发.整手足甲.扫舍.补垣.塞穴.入殓.破土.启攒.",
			"j": "开光.嫁娶.会亲友.栽种.针灸.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1106": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.置产.求医.治病.开市.交易.立券.会亲友.移徙.竖柱.上梁.造屋.合脊.安门.放水.捕捉.纳畜.",
			"j": "造庙.造船.动土.破土.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1107": {
			"y": "出行.造车器.造畜椆栖.解除.冠笄.裁衣.作梁.雕刻.会亲友.移徙.入宅.安机械.造畜椆栖.开市.扫舍.",
			"j": "嫁娶.动土.破土.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1108": {
			"y": "嫁娶.开光.出行.解除.出火.拆卸.修造.进人口.动土.入宅.移徙.栽种.纳畜.掘井.安葬.除服.成服.",
			"j": "置产.安床.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1109": {
			"y": "开光.裁衣.安门.会亲友.安床.结网.理发.",
			"j": "嫁娶.冠笄.出行.祈福.安葬.伐木.入宅.移徙.出火.栽种.动土.上梁.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1110": {
			"y": "嫁娶.开光.出行.出火.拆卸.修造.动土.入宅.移徙.安床.上梁.开市.交易.立券.栽种.",
			"j": "祈福.祭祀.伐木.掘井.作灶.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1111": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出火.出行.拆卸.开市.交易.立券.挂匾.伐木.入宅.移徙.安床.安葬.",
			"j": "栽种.掘井.置产.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1112": {
			"y": "祭祀.理发.针灸.解除.进人口.整手足甲.",
			"j": "嫁娶.动土.造船.开池.掘井.出行.修造.入宅.上梁.移徙.安葬.破土.作灶.开市.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1113": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1114": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.雕刻.移徙.开市.入宅.出行.动土.会亲友.入学.修造.动土.起基.安门.安床.造庙.解除.纳财.开池.造畜椆栖.牧养.牧养.",
			"j": "上梁.开仓.出货财.造屋.造船.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1115": {
			"y": "祭祀.祈福.求嗣.开光.解除.伐木.拆卸.修造.栽种.纳畜.安葬.修坟.立碑.",
			"j": "嫁娶.进人口.入宅.移徙.出火.出行.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1116": {
			"y": "沐浴.扫舍.捕捉.畋猎.解除.塞穴.余事勿取.",
			"j": "嫁娶.入宅.开市.安床.破土.修坟.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1117": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.斋醮.开光.出行.解除.动土.开市.交易.立券.挂匾.拆卸.破土.",
			"j": "伐木.上梁.修造.入殓.理发.会亲友.入宅.安门.安葬.作灶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1118": {
			"y": "合帐.裁衣.嫁娶.安床.入殓.移柩.破土.造畜椆栖.",
			"j": "置产.造船.开光.掘井.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1119": {
			"y": "解除.修饰垣墙.冠笄.出行.余事勿取.",
			"j": "开市.动土.破土.嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1120": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.开光.出行.解除.进人口.开市.立券.挂匾.入宅.移徙.安门.栽种.动土.求医.治病.会亲友.起基.修造.造屋.安葬.",
			"j": "作灶.经络.安床.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1122": {
			"y": "出行.纳财.开市.交易.立券.动土.移徙.入宅.裁衣.会亲友.拆卸.进人口.安香.经络.出货财.修饰垣墙.平治道涂.",
			"j": "造庙.谢土.作灶.作梁.伐木.安葬.行丧.修坟.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1123": {
			"y": "嫁娶.纳采.订盟.祭祀.斋醮.开光.安香.出火.出行.出火.拆卸.动土.祈福.进人口.纳财.交易.立券.移徙.安床.修造.安葬.除服.成服.",
			"j": "置产.掘井.词讼.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1125": {
			"y": "祭祀.解除.破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "破",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1126": {
			"y": "祭祀.扫舍.破土.安葬.除服.成服.启攒.移柩.入殓.立碑.余事勿取.",
			"j": "祭祀.嫁娶.入宅.修造.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1127": {
			"y": "订盟.纳采.会亲友.祭祀.祈福.修造.动土.安机械.破土.安葬.",
			"j": "嫁娶.移徙.出火.开市.入宅.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1128": {
			"y": "祭祀.沐浴.捕捉.畋猎.结网.扫舍.",
			"j": "嫁娶.纳采.订盟.安床.动土.破土.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1129": {
			"y": "开市.纳财.出行.祭祀.祈福.求嗣.斋醮.问名.入学.起基.定磉.置产.开渠.掘井.拆卸.栽种.纳畜.牧养.动土.破土.启攒.",
			"j": "移徙.入宅.出火.入殓.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d1130": {
			"y": "祭祀.理发.置产.塞穴.除服.成服.移柩.入殓.破土.安葬.",
			"j": "嫁娶.入宅.安床.掘井.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1214": {
			"y": "交易.进人口.祭祀.沐浴.捕捉.入殓.除服.成服.安葬.谢土.启攒.修坟.",
			"j": "斋醮.入宅.修造.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1204": {
			"y": "纳采.移徙.纳财.开市.交易.立券.纳财.入宅.修造.动土.竖柱.起基.定磉.造庙.安香.出火.修饰垣墙.平治道涂.会亲友.出行.开池.作厕.",
			"j": "开仓.造屋.造桥.祭祀.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1221": {
			"y": "安床.架马.祭祀.塑绘.开光.出行.理发.伐木.作梁.开柱眼.作厕.畋猎.破土.入殓.除服.成服.移柩.启攒.修坟.立碑.",
			"j": "作灶.安门.造桥.开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1228": {
			"y": "订盟.纳采.会亲友.安机械.开光.修造.动土.竖柱.上梁.造屋.起基.造桥.栽种.纳畜.造畜椆栖.移柩.入殓.启攒.修坟.立碑.安葬.",
			"j": "祈福.出火.嫁娶.入宅.开市.动土.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1208": {
			"y": "破屋.坏垣.祭祀.沐浴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1201": {
			"y": "祭祀.沐浴.出行.余事勿取.",
			"j": "开市.动土.破土.行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1202": {
			"y": "嫁娶.造车器.出行.会亲友.移徙.入宅.修造.动土.雕刻.开光.安香.出火.理发.会亲友.造屋.合脊.起基.归岫.安门.拆卸.扫舍.栽种.造畜椆栖.",
			"j": "开市.纳采.造庙.安床.开渠.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1203": {
			"y": "塑绘.会亲友.安机械.塞穴.结网.裁衣.经络.",
			"j": "嫁娶.开市.祈福.斋醮.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1205": {
			"y": "订盟.纳采.纳财.开市.立券.祭祀.祈福.移徙.入宅.出行.造屋.起基.修造.动土.竖柱.上梁.安门.安香.出火.教牛马.会亲友.破土.",
			"j": "嫁娶.安葬.掘井.置产.造船.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1206": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.塑绘.开光.移徙.安床.伐木.作梁.捕捉.畋猎.结网.求医.治病.解除.安葬.除服.成服.移柩.入殓.立碑.谢土.",
			"j": "开市.造庙.动土.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1207": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1209": {
			"y": "安床.祭祀.祈福.求嗣.冠笄.伐木.架马.动土.开池.作厕.结网.入殓.除服.成服.",
			"j": "安门.栽种.作灶.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1210": {
			"y": "解除.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1211": {
			"y": "祭祀.开光.理发.整手足甲.安床.作灶.扫舍.教牛马.",
			"j": "伐木.纳畜.破土.安葬.开生坟.嫁娶.开市.动土.交易.作梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1212": {
			"y": "祭祀.祈福.求嗣.开光.拆卸.修造.动土.上梁.安床.置产.栽种.破土.",
			"j": "嫁娶.进人口.安葬.出行.赴任.入宅.移徙.入殓.开渠.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1213": {
			"y": "沐浴.冠笄.补垣.塞穴.合帐.裁衣.修造.作梁.开柱眼.安碓硙.筑堤.作厕.断蚁.",
			"j": "移徙.入宅.嫁娶.祈福.开光.掘井.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1215": {
			"y": "嫁娶.纳采.订盟.造车器.祭祀.祈福.造庙.安香.出火.出行.归宁.入学.入宅.交易.立券.求医.治病.修造.动土.竖柱.上梁.造屋.起基.安门.",
			"j": "斋醮.伐木.作梁.安葬.行丧.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1216": {
			"y": "纳采.订盟.开市.交易.立券.出行.会亲友.安机械.竖柱.上梁.平治道涂.伐木.拆卸.造屋.起基.安床.安门.解除.安葬.启攒.除服.成服.修坟.立碑.移柩.入殓.",
			"j": "嫁娶.动土.破土.祈福.出火.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1217": {
			"y": "祭祀.平治道涂.除服.成服.安葬.余事勿取.",
			"j": "嫁娶.入宅.纳采.订盟.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1218": {
			"y": "纳采.订盟.祭祀.祈福.开光.安香.出火.出行.会亲友.安机械.修造.动土.竖柱.上梁.造屋.起基.定磉.安床.安门.拆卸.移徙.造桥.造船.安葬.破土.入殓.",
			"j": "开市.造庙.置产.掘井.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1219": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.斋醮.进人口.会亲友.伐木.作梁.开柱眼.安床.掘井.捕捉.畋猎.",
			"j": "开生坟.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1220": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "移徙.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1222": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.入宅.移徙.纳畜.入殓.破土.修坟.立碑.",
			"j": "伐木.作梁.动土.安床.破土.栽种.造桥.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1223": {
			"y": "祭祀.沐浴.理发.纳财.进人口.栽种.扫舍.捕捉.畋猎.结网.",
			"j": "会亲友.安葬.入宅.移徙.安床.开市.行丧.出火.作灶.安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1225": {
			"y": "入宅.移徙.出行.进人口.修造.动土.起基.上梁.安门.造仓.补垣.塞穴.造畜椆栖.",
			"j": "嫁娶.开市.安床.栽种.安葬.祈福.开光.掘井.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1226": {
			"y": "造畜椆栖.教牛马.",
			"j": "入宅.移徙.分居.作灶.出火.安香.动土.嫁娶.掘井.扫舍.造桥.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1227": {
			"y": "订盟.纳采.造车器.祭祀.祈福.出行.安香.修造.动土.上梁.开市.交易.立券.移徙.入宅.会亲友.安机械.栽种.纳畜.造屋.起基.安床.造畜椆栖.",
			"j": "破土.安葬.行丧.开生坟.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1229": {
			"y": "祭祀.平治道涂.修坟.除服.成服.余事勿取.",
			"j": "移徙.入宅.嫁娶.掘井.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1230": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.雕刻.开光.安香.出行.入学.修造.动土.竖柱.上梁.造屋.起基.安门.出火.移徙.入宅.掘井.造畜椆栖.安葬.破土.除服.成服.",
			"j": "开市.纳采.订盟.作灶.造庙.造船.经络.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1231": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求嗣.斋醮.安香.出火.修造.起基.造屋.合脊.安门.安碓硙.动土.上梁.移徙.入宅.",
			"j": "出行.掘井.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		}
	};


/***/ },
/* 19 */
/***/ function(module, exports) {

	window.HuangLi = window.HuangLi || {};
	HuangLi.y2016 = {
		"d0101": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "嫁娶.移徙.入宅.探病.出行.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0201": {
			"y": "祭祀.解除.教牛马.会亲友.余事勿取.",
			"j": "破土.动土.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0102": {
			"y": "冠笄.纳财.掘井.开池.出火.安床.交易.立券.畋猎.结网.理发.放水.",
			"j": "安门.动土.破土.行丧.安葬.成服.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0103": {
			"y": "纳采.订盟.移徙.入宅.出行.安机械.会亲友.祭祀.祈福.斋醮.开光.安香.出火.解除.求医.针灸.治病.造屋.起基.修造.安门.造船.纳畜.牧养.移柩.入殓.启攒.谢土.修坟.立碑.",
			"j": "嫁娶.动土.安床.造桥.掘井.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0104": {
			"y": "祭祀.沐浴.作灶.纳财.捕捉.畋猎.安床.扫舍.",
			"j": "开市.斋醮.破土.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0105": {
			"y": "祈福.斋醮.纳采.订盟.解除.架马.开柱眼.修造.动土.起基.上梁.归岫.造屋.合脊.掘井.除服.成服.破土.栽种.",
			"j": "移徙.开市.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0106": {
			"y": "开市.交易.立券.纳财.纳畜.造畜椆栖.入宅.移徙.安床.开光.祈福.求嗣.动土.",
			"j": "嫁娶.栽种.安葬.理发.造庙.作灶.入殓.行丧.造桥.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0107": {
			"y": "安床.裁衣.交易.立券.入殓.移柩.安葬.除服.成服.",
			"j": "置产.嫁娶.出行.开光.栽种.动土.破土.入宅.治病.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0108": {
			"y": "祭祀.解除.造畜椆栖.教牛马.针灸.余事勿取.",
			"j": "嫁娶.动土.开池.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0109": {
			"y": "沐浴.塑绘.开光.纳采.订盟.开市.交易.立券.纳财.起基.动土.定磉.放水.安葬.破土.启攒.修坟.立碑.移柩.",
			"j": "入宅.安门.祭祀.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0110": {
			"y": "嫁娶.出行.理发.安床.启攒.安葬.修坟.开市.交易.立券.纳财.开池.牧养.",
			"j": "掘井.祈福.谢土.动土.入宅.上梁.修造.作灶.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0111": {
			"y": "解除.平治道涂.余事勿取.",
			"j": "移徙.入宅.掘井.造庙.栽种.针灸.治病.开池.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0112": {
			"y": "嫁娶.祭祀.开光.伐木.出火.拆卸.入宅.移徙.修造.动土.上梁.安床.纳畜.",
			"j": "开市.行丧.栽种.出行.出货财.安葬.置产.词讼.治病.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0113": {
			"y": "嫁娶.纳采.订盟.入宅.移徙.安床.祭祀.祈福.开光.出行.解除.出火.拆卸.动土.纳畜.谢土.安葬.破土.",
			"j": "伐木.开市.交易.上梁.作灶.安门.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0114": {
			"y": "祭祀.破屋.坏垣.解除.余事勿取.",
			"j": "开市.动土.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0115": {
			"y": "嫁娶.纳采.订盟.开光.安香.出火.纳财.开市.交易.立券.裁衣.造屋.起基.修造.动土.安门.移徙.入宅.栽种.牧养.畋猎.掘井.开池.安葬.破土.入殓.除服.成服.立碑.",
			"j": "祈福.造庙.祭祀.安床.谢土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0116": {
			"y": "祭祀.斋醮.入殓.破土.启攒.安葬.修坟.立碑.除服.成服.",
			"j": "嫁娶.入宅.作灶.纳采.订盟.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0117": {
			"y": "祭祀.斋醮.纳财.捕捉.畋猎.",
			"j": "嫁娶.开市.入宅.安床.破土.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0118": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.斋醮.沐浴.进人口.会亲友.入学.治病.安碓硙.掘井.开池.纳畜.牧养.造畜椆栖.",
			"j": "嫁娶.合帐.入宅.行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0119": {
			"y": "祭祀.祈福.求嗣.沐浴.问名.交易.纳财.入殓.移柩.安葬.修坟.立碑.谢土.造畜椆栖.教牛马.",
			"j": "入宅.置产.嫁娶.动土.栽种.开市.开光.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0120": {
			"y": "祭祀.教牛马.造畜椆栖.祭祀.会亲友.解除.余事勿取.",
			"j": "嫁娶.入宅.出行.动土.破土.安葬.行丧.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0121": {
			"y": "嫁娶.开光.解除.出火.拆卸.修造.进人口.入宅.移徙.安床.栽种.入殓.修坟.动土.除服.成服.",
			"j": "作灶.安葬.祭祀.开市.纳采.订盟.纳畜.谢土.出行.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0122": {
			"y": "出行.起基.安床.纳财.交易.立券.嫁娶.栽种.入殓.移柩.安葬.",
			"j": "挂匾.入宅.上梁.祈福.词讼.作梁.作灶.开池.安门.动土.破土.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0123": {
			"y": "平治道涂.余事勿取.",
			"j": "开光.嫁娶.开仓.出货财.造船.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0124": {
			"y": "嫁娶.订盟.纳采.会亲友.祭祀.安机械.移徙.入宅.造屋.安床.起基.定磉.安香.出火.挂匾.拆卸.置产.",
			"j": "开市.出行.安葬.行丧.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0125": {
			"y": "沐浴.捕捉.畋猎.理发.整手足甲.入殓.除服.成服.破土.安葬.谢土.立碑.修坟.启攒.",
			"j": "纳采.订盟.嫁娶.上梁.开市.斋醮.造屋.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0126": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "斋醮.嫁娶.开市.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0127": {
			"y": "沐浴.开仓.出货财.开市.交易.立券.纳财.栽种.纳畜.牧养.畋猎.入殓.破土.安葬.",
			"j": "祈福.嫁娶.安床.入宅.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0128": {
			"y": "祭祀.沐浴.补垣.塞穴.断蚁.解除.余事勿取.",
			"j": "造庙.入宅.修造.安葬.行丧.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0129": {
			"y": "嫁娶.纳采.订盟.问名.祭祀.冠笄.裁衣.会亲友.进人口.纳财.捕捉.作灶.",
			"j": "开市.安床.安葬.修坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0130": {
			"y": "订盟.纳采.会亲友.祭祀.斋醮.沐浴.塑绘.出火.开光.竖柱.上梁.开市.交易.立券.作梁.开柱眼.伐木.架马.安门.安床.拆卸.牧养.造畜椆栖.掘井.",
			"j": "造庙.嫁娶.出行.动土.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0131": {
			"y": "交易.立券.纳财.安床.裁衣.造畜椆栖.安葬.谢土.启攒.除服.成服.修坟.立碑.移柩.入殓.",
			"j": "开光.嫁娶.开市.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0214": {
			"y": "开光.解除.伐木.竖柱.上梁.交易.立券.纳畜.入殓.移柩.安葬.",
			"j": "入宅.出行.移徙.祭祀.嫁娶.动土.破土.作灶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0204": {
			"y": "嫁娶.冠笄.纳采.出行.会亲友.上梁.安机械.安床.牧养.畋猎.祭祀.祈福.开光.修造.安门.造屋.起基.",
			"j": "入宅.作灶.治病.安葬.移徙.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0219": {
			"y": "纳采.嫁娶.祭祀.祈福.出行.修造.动土.移徙.入宅.安葬.破土.",
			"j": "开市.入宅.斋醮.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0229": {
			"y": "祭祀.平治道涂.余事勿取.",
			"j": "嫁娶.祈福.掘井.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0224": {
			"y": "纳采.嫁娶.祭祀.祈福.出行.开市.会亲友.动土.破土.启攒.",
			"j": "移徙.入宅.出火.安门.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0225": {
			"y": "祭祀.祈福.求嗣.斋醮.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "嫁娶.动土.开光.造屋.破土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0215": {
			"y": "祭祀.祈福.求嗣.开光.嫁娶.出行.解除.伐木.拆卸.进人口.安床.动土.起基.上梁.栽种.纳畜.破土.谢土.启攒.安葬.",
			"j": "移徙.入宅.出火.作灶.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0209": {
			"y": "祭祀.斋醮.沐浴.开生坟.除服.成服.移柩.入殓.破土.安葬.合寿木.",
			"j": "开市.嫁娶.安床.会亲友.入宅.作灶.上梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0205": {
			"y": "修饰垣墙.平治道涂.祭祀.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0226": {
			"y": "纳采.会亲友.竖柱.上梁.立券.入殓.移柩.安葬.启攒.",
			"j": "祭祀.移徙.入宅.动土.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0221": {
			"y": "纳采.订盟.祭祀.祈福.安香.出火.修造.出行.开市.移徙.入宅.动土.安葬.破土.",
			"j": "安床.作灶.造船.会亲友.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0326": {
			"y": "嫁娶.造车器.纳采.订盟.祭祀.祈福.安机械.移徙.入宅.开市.立券.破土.安葬.",
			"j": "纳畜.理发.合寿木.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0202": {
			"y": "纳采.订盟.移徙.纳财.开市.交易.立券.入宅.会亲友.解除.求医.治病.入学.安床.安门.安香.出火.拆卸.扫舍.入宅.挂匾.开生坟.合寿木.破土.修坟.启攒.入殓.",
			"j": "探病.祭祀.出行.上梁.造屋.谢土.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0203": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求嗣.会亲友.解除.出行.入学.纳财.开市.交易.立券.习艺.经络.安床.开仓.出货财.纳畜.安葬.启攒.修坟.入殓.",
			"j": "入宅.开光.开市.动土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0206": {
			"y": "造车器.纳采.订盟.祭祀.祈福.求嗣.移徙.出行.开市.出火.入宅.立券.交易.入宅.安门.安床.安葬.谢土.",
			"j": "开光.造屋.动土.作灶.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0207": {
			"y": "动土.入殓.嫁娶.移柩.安葬.破土.",
			"j": "开市.作灶.安床.入宅.上梁.裁衣.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0208": {
			"y": "求医.治病.破屋.坏垣.余事勿取.",
			"j": "开市.嫁娶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0210": {
			"y": "祭祀.塞穴.结网.破土.谢土.安葬.移柩.除服.成服.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0211": {
			"y": "祭祀.沐浴.理发.作灶.结网.栽种.",
			"j": "嫁娶.词讼.行丧.安葬.牧养.伐木.作梁.开市.纳畜.造畜椆栖.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0212": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.开市.交易.立券.动土.纳财.掘井.会亲友.",
			"j": "入宅.安葬.伐木.作梁.纳畜.造畜椆栖.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0213": {
			"y": "祭祀.祈福.求嗣.纳畜.入殓.启攒.谢土.除服.成服.",
			"j": "栽种.开光.出行.针灸.嫁娶.入宅.动土.破土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0216": {
			"y": "会亲友.冠笄.安床.会亲友.安机械.祭祀.祈福.求嗣.经络.",
			"j": "嫁娶.开市.动土.作灶.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0217": {
			"y": "作灶.解除.平治道涂.余事勿取.",
			"j": "祭祀.祈福.安葬.安门.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0218": {
			"y": "嫁娶.祭祀.冠笄.修饰垣墙.置产.",
			"j": "经络.探病.造屋.作灶.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0220": {
			"y": "祭祀.沐浴.解除.理发.扫舍.破屋.坏垣.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0222": {
			"y": "塞穴.结网.取渔.畋猎.",
			"j": "嫁娶.安门.移徙.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0223": {
			"y": "纳采.祭祀.祈福.出行.会亲友.修造.动土.移徙.入宅.",
			"j": "嫁娶.开市.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0227": {
			"y": "祭祀.祈福.斋醮.出行.开市.立券.动土.移徙.入宅.破土.安葬.",
			"j": "开光.嫁娶.作灶.掘井.纳畜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0228": {
			"y": "会亲友.求嗣.理发.冠笄.结网.捕捉.开光.理发.",
			"j": "开市.动土.安葬.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0324": {
			"y": "纳财.开市.交易.立券.开光.针灸.会亲友.理发.安床.造仓.结网.",
			"j": "移徙.入宅.栽种.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0328": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "嫁娶.移徙.开市.入宅.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0327": {
			"y": "祈福.斋醮.出行.移徙.入宅.修造.动土.破土.安葬.",
			"j": "纳采.开光.安床.嫁娶.开市.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0320": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.修造.动土.移徙.入宅.破土.出火.安门.安床.上梁.立碑.移柩.",
			"j": "开市.交易.合帐.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0428": {
			"y": "祭祀.解除.教牛马.出行.余事勿取.",
			"j": "动土.破土.行丧.开光.作梁.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0301": {
			"y": "祈福.求嗣.斋醮.纳采.嫁娶.伐木.修造.动土.移徙.入宅.造庙.安机械.开市.入殓.除服.成服.移柩.安葬.破土.谢土.",
			"j": "置产.造屋.合脊.开光.探病.安门.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0302": {
			"y": "入学.习艺.出行.纳采.订盟.嫁娶.会亲友.进人口.牧养.捕捉.入殓.移柩.安葬.启攒.",
			"j": "开光.开市.入宅.动土.造屋.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0303": {
			"y": "祭祀.沐浴.求医.治病.扫舍.破屋.坏垣.解除.余事勿取.",
			"j": "入宅.开市.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0304": {
			"y": "祭祀.冠笄.嫁娶.拆卸.修造.动土.起基.上梁.造屋.入宅.开市.开池.塞穴.入殓.除服.成服.移柩.安葬.破土.",
			"j": "安床.栽种.治病.作灶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0305": {
			"y": "嫁娶.祭祀.出行.冠笄.立券.交易.进人口.开市.移徙.修造.动土.安床.入殓.移柩.破土.",
			"j": "开光.作灶.斋醮.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0306": {
			"y": "开市.立券.交易.挂匾.祭祀.祈福.开光.入宅.移徙.安床.拆卸.动土.上梁.进人口.",
			"j": "嫁娶.行丧.架马.作梁.理发.牧养.安葬.纳畜.伐木.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0307": {
			"y": "理发.冠笄.嫁娶.进人口.",
			"j": "置产.伐木.纳畜.造畜椆栖.安葬.破土.作梁.作灶.开生坟.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0308": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出火.入宅.移徙.安床.拆卸.动土.破土.谢土.",
			"j": "合帐.开市.安葬.入殓.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0309": {
			"y": "安床.伐木.拆卸.修造.动土.上梁.立券.交易.栽种.纳畜.牧养.入殓.安葬.",
			"j": "嫁娶.祭祀.开光.出行.出火.移徙.入宅.安门.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0310": {
			"y": "祭祀.祈福.求嗣.斋醮.嫁娶.冠笄.出行.开市.交易.会亲友.教牛马.除服.成服.启攒.安葬.移柩.",
			"j": "祈福.动土.移徙.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0311": {
			"y": "塞穴.整手足甲.解除.捕捉.畋猎.结网.余事勿取.诸事不宜.",
			"j": "嫁娶.作灶.掘井.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0312": {
			"y": "纳财.开市.立券.交易.开光.安床.上梁.造屋.修造.起基.",
			"j": "动土.破土.安葬.行丧.赴任.出行.嫁娶.入宅.移徙.谢土.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0313": {
			"y": "祭祀.祈福.嫁娶.冠笄.修饰垣墙.置产.平治道涂.",
			"j": "开仓.出货财.造屋.作灶.开市.交易.立券.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0314": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.出火.进人口.入宅.移徙.安床.拆卸.修造.安门.挂匾.纳财.扫舍.",
			"j": "动土.伐木.安葬.行丧.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0315": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.出行.出火.入宅.移徙.解除.栽种.伐木.破土.谢土.安葬.",
			"j": "开市.交易.作灶.纳财.上梁.安床.造屋.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0316": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "开光.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0317": {
			"y": "纳采.交易.立券.安床.安机械.安葬.移柩.动土.破土.立碑.",
			"j": "嫁娶.开光.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0318": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.开光.理发.经络.解除.治病.治病.立碑.栽种.牧养.掘井.开池.",
			"j": "嫁娶.定磉.合寿木.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0319": {
			"y": "纳财.交易.立券.栽种.捕捉.结网.取渔.进人口.教牛马.理发.",
			"j": "入宅.造屋.竖柱.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0321": {
			"y": "冠笄.立券.交易.修造.动土.安机械.入殓.安葬.破土.",
			"j": "嫁娶.祈福.出火.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0322": {
			"y": "祭祀.会亲友.出行.立券.交易.冠笄.纳财.",
			"j": "嫁娶.动土.掘井.起基.定磉.破土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0323": {
			"y": "祭祀.沐浴.解除.扫舍.塞穴.牧养.",
			"j": "嫁娶.安葬.行丧.安门.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0325": {
			"y": "嫁娶.冠笄.会亲友.安机械.纳财.交易.立券.置产.",
			"j": "开市.造屋.治病.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0329": {
			"y": "嫁娶.冠笄.祭祀.出行.会亲友.修造.动土.入殓.破土.",
			"j": "塑绘.开光.造桥.除服.成服.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0330": {
			"y": "开光.求嗣.出行.纳采.冠笄.出火.拆卸.起基.修造.动土.上梁.移徙.造船.开市.交易.立券.纳财.",
			"j": "祈福.嫁娶.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0331": {
			"y": "理发.冠笄.嫁娶.进人口.栽种.捕捉.针灸.",
			"j": "纳财.开市.安葬.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0427": {
			"y": "祭祀.祈福.求嗣.斋醮.冠笄.作灶.纳财.交易.",
			"j": "开光.嫁娶.掘井.安葬.安门.探病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0423": {
			"y": "沐浴.捕捉.畋猎.结网.取渔.",
			"j": "祭祀.嫁娶.入宅.作灶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0413": {
			"y": "祭祀.修门.取渔.纳财.纳畜.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0403": {
			"y": "祭祀.会亲友.立券.交易.裁衣.合帐.嫁娶.冠笄.进人口.",
			"j": "栽种.动土.安葬.掘井.修坟.探病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0418": {
			"y": "祭祀.塑绘.开光.纳采.嫁娶.开市.出行.会亲友.安床.结网.除服.成服.启攒.安葬.移柩.",
			"j": "祈福.入宅.造屋.动土.破土.探病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0424": {
			"y": "祭祀.祈福.求嗣.斋醮.纳采.订盟.开光.竖柱.上梁.开仓.出货财.造屋.起基.定磉.安门.诸事不宜.破土.入殓.启攒.谢土.",
			"j": "出火.嫁娶.开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0414": {
			"y": "安香.出火.纳采.订盟.嫁娶.开市.立券.交易.挂匾.开光.出行.解除.安床.栽种.置产.拆卸.修造.动土.",
			"j": "作灶.安葬.祭祀.入殓.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0429": {
			"y": "沐浴.斋醮.解除.求医.治病.会亲友.造畜椆栖.栽种.理发.扫舍.",
			"j": "开市.嫁娶.移徙.入宅.掘井.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0422": {
			"y": "祭祀.沐浴.解除.求医.治病.破屋.坏垣.余事勿取.",
			"j": "祈福.斋醮.开市.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0524": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.治病.造车器.修造.动土.移徙.入宅.",
			"j": "开市.出行.安床.作灶.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0401": {
			"y": "开光.祈福.求嗣.出行.解除.伐木.造屋.起基.修造.架马.安门.移徙.入宅.造庙.除服.成服.移柩.谢土.纳畜.牧养.",
			"j": "纳采.动土.开市.交易.安门.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0402": {
			"y": "裁衣.经络.伐木.开柱眼.拆卸.修造.动土.上梁.合脊.合寿木.入殓.除服.成服.移柩.破土.安葬.启攒.修坟.立碑.",
			"j": "祭祀.嫁娶.出行.上梁.掘井.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0404": {
			"y": "祭祀.出行.教牛马.扫舍.余事勿取.",
			"j": "开光.伐木.安葬.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0405": {
			"y": "祭祀.祈福.求嗣.开光.纳采.订盟.解除.栽种.纳畜.牧养.扫舍.进人口.",
			"j": "修坟.造桥.作灶.出行.安葬.造屋.入宅.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0406": {
			"y": "开光.出行.交易.塞穴.嫁娶.理发.开市.安床.",
			"j": "祈福.出火.置产.动土.破土.安葬.修造.上梁.置产.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0407": {
			"y": "祭祀.作灶.畋猎.结网.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.安床.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0408": {
			"y": "沐浴.祭祀.解除.安葬.破土.谢土.移柩.余事勿取.",
			"j": "斋醮.开光.嫁娶.入宅.上梁.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0409": {
			"y": "祭祀.解除.入殓.移柩.启攒.安葬.整手足甲.捕捉.畋猎.取渔.除服.成服.扫舍.谢土.斋醮.",
			"j": "动土.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0410": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.开市.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0411": {
			"y": "沐浴.塞穴.畋猎.结网.取渔.扫舍.余事勿取.",
			"j": "祈福.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0412": {
			"y": "开市.交易.立券.挂匾.祭祀.开光.祈福.求嗣.安床.解除.修造.安葬.",
			"j": "纳采.问名.订盟.嫁娶.入宅.开仓.出火.动土.破土.纳畜.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0415": {
			"y": "祭祀.出行.修造.动土.合帐.造畜椆栖.安床.移徙.入殓.移柩.破土.启攒.安葬.开生坟.合寿木.补垣.塞穴.",
			"j": "移徙.入宅.作灶.理发.开光.安门.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0416": {
			"y": "祭祀.修饰垣墙.余事勿取.",
			"j": "开光.修造.动土.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0417": {
			"y": "嫁娶.祭祀.祈福.求嗣.斋醮.开光.出火.移徙.入宅.竖柱.上梁.会亲友.造屋.起基.治病.治病.安门.造车器.掘井.开池.",
			"j": "纳采.出行.修坟.安葬.开市.立券.作灶.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0419": {
			"y": "祭祀.作灶.平治道涂.余事勿取.",
			"j": "安床.入宅.安碓硙.栽种.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0420": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.纳畜.入殓.破土.安葬.",
			"j": "移徙.入宅.嫁娶.出行.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0421": {
			"y": "纳采.祭祀.祈福.求嗣.斋醮.出行.起基.造屋.定磉.安门.入殓.安葬.",
			"j": "嫁娶.开市.纳财.出火.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0425": {
			"y": "祭祀.捕捉.解除.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0426": {
			"y": "纳采.嫁娶.出行.开市.立券.纳畜.牧养.出火.移徙.入宅.",
			"j": "祈福.动土.破土.安葬.入殓.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0430": {
			"y": "求嗣.出行.解除.订盟.纳采.嫁娶.会亲友.进人口.安床.开市.交易.纳畜.牧养.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "祈福.开市.修造.动土.破土.谢土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0514": {
			"y": "纳采.嫁娶.裁衣.理发.出行.修造.动土.进人口.开市.交易.立券.挂匾.移徙.上梁.栽种.纳畜.",
			"j": "伐木.安葬.安床.祭祀.祈福.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0504": {
			"y": "祭祀.沐浴.破屋.坏垣.求医.治病.解除.余事勿取.",
			"j": "嫁娶.开市.交易.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0624": {
			"y": "嫁娶.安机械.交易.出行.祭祀.祈福.求嗣.斋醮.塑绘.开光.合帐.裁衣.放水.开池.掘井.",
			"j": "作灶.理发.造桥.行丧.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0501": {
			"y": "祭祀.作灶.平治道涂.余事勿取.",
			"j": "嫁娶.安葬.动土.安床.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0502": {
			"y": "造车器.祭祀.祈福.求嗣.斋醮.开市.交易.安机械.雕刻.开光.造屋.合脊.起基.定磉.安门.纳畜.安葬.开生坟.立碑.谢土.斋醮.",
			"j": "入宅.动土.开仓.出货财.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0503": {
			"y": "祭祀.祈福.开光.求嗣.斋醮.纳采.订盟.求医.治病.起基.定磉.造船.取渔.解除.安葬.启攒.谢土.入殓.",
			"j": "开市.动土.掘井.开池.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0505": {
			"y": "破屋.坏垣.沐浴.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0506": {
			"y": "纳采.订盟.嫁娶.造车器.祭祀.祈福.求嗣.开光.出火.拆卸.修造.动土.进人口.挂匾.入宅.移徙.安床.栽种.入殓.破土.安葬.除服.成服.",
			"j": "开市.立券.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0507": {
			"y": "开市.交易.立券.祭祀.祈福.开光.动土.安床.出行.栽种.纳畜.牧养.竖柱.上梁.解除.破土.",
			"j": "嫁娶.掘井.入宅.移徙.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0508": {
			"y": "解除.出行.纳采.冠笄.竖柱.上梁.移徙.作灶.进人口.入宅.纳畜.牧养.",
			"j": "祭祀.伐木.架马.安床.修造.动土.安葬.修坟.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0509": {
			"y": "祭祀.祈福.求嗣.开光.出行.开市.交易.立券.栽种.安床.纳畜.移徙.起基.动土.定磉.造仓.置产.破土.启攒.修坟.",
			"j": "入宅.移徙.修造.安门.伐木.入殓.安葬.造屋.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0510": {
			"y": "嫁娶.交易.立券.作厕.补垣.塞穴.畋猎.取渔.开生坟.",
			"j": "安床.开渠.上梁.修造.开市.开光.入宅.移徙.安床.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0511": {
			"y": "塞穴.断蚁.结网.畋猎.余事勿取.",
			"j": "嫁娶.安葬.入宅.出行.动土.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0512": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.开光.解除.出行.出火.入宅.移徙.栽种.纳畜.牧养.动土.破土.入殓.安葬.",
			"j": "作灶.安床.开仓.造屋.动土.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0513": {
			"y": "开光.纳采.裁衣.冠笄.安床.作灶.进人口.造仓.塞穴.",
			"j": "嫁娶.栽种.修造.动土.出行.伐木.作梁.安葬.谢土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0515": {
			"y": "开市.交易.立券.挂匾.祭祀.祈福.斋醮.出行.开市.交易.立券.造屋.起基.修造.动土.定磉.安床.安机械.安葬.破土.启攒.除服.成服.立碑.",
			"j": "作灶.嫁娶.移徙.入宅.理发.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0516": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.动土.修造.进人口.入宅.移徙.安床.解除.挂匾.栽种.破土.谢土.入殓.移柩.安葬.",
			"j": "开市.立券.造船.合寿木.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0517": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "开光.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0518": {
			"y": "订盟.纳采.嫁娶.解除.祭祀.祈福.求嗣.开光.出行.解除.出火.拆卸.入宅.移徙.安床.栽种.纳畜.动土.破土.谢土.安葬.修坟.",
			"j": "作灶.开市.经络.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0519": {
			"y": "祭祀.祈福.求嗣.开光.订盟.纳采.解除.动土.起基.进人口.开市.交易.立券.纳财.造仓.开池.栽种.纳畜.破土.安葬.",
			"j": "安床.上梁.裁衣.入宅.嫁娶.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0520": {
			"y": "祭祀.结网.捕捉.余事勿取.",
			"j": "探病.嫁娶.开市.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0521": {
			"y": "祭祀.祈福.求嗣.开光.纳采.订盟.嫁娶.出行.动土.破土.会亲友.开市.交易.立券.习艺.拆卸.起基.安碓硙.放水.开池.造仓.开渠.栽种.谢土.启攒.修坟.立碑.",
			"j": "入宅.安门.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0522": {
			"y": "嫁娶.冠笄.祭祀.出行.移徙.入宅.作灶.造车器.补垣.塞穴.作厕.破土.启攒.除服.成服.入殓.",
			"j": "入宅.造屋.造桥.安门.安葬.上梁.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0523": {
			"y": "祭祀.解除.断蚁.会亲友.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0525": {
			"y": "嫁娶.纳采.订盟.会亲友.安机械.结网.冠笄.祭祀.求嗣.进人口.经络.",
			"j": "开市.作灶.动土.行丧.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0526": {
			"y": "祭祀.沐浴.移徙.破土.安葬.扫舍.平治道涂.",
			"j": "祈福.嫁娶.入宅.安床.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0527": {
			"y": "祭祀.祈福.斋醮.求嗣.安机械.纳畜.移徙.入宅.安机械.塑绘.开光.起基.竖柱.上梁.作灶.安门.安香.出火.造屋.启攒.安葬.",
			"j": "动土.破土.嫁娶.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0528": {
			"y": "嫁娶.纳采.订盟.斋醮.开光.祭祀.祈福.求医.治病.会亲友.动土.解除.捕捉.纳畜.牧养.入殓.破土.安葬.",
			"j": "移徙.入宅.造屋.架马.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0529": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0530": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "斋醮.开市.嫁娶.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0531": {
			"y": "开市.交易.立券.安机械.会亲友.开光.求医.治病.造屋.起基.修造.动土.定磉.竖柱.上梁.安门.作灶.放水.作厕.开池.栽种.牧养.造畜椆栖.破土.安葬.立碑.",
			"j": "嫁娶.出火.移徙.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0622": {
			"y": "纳采.订盟.冠笄.祭祀.祈福.斋醮.出行.修造.动土.移徙.入宅.安香.出火.拆卸.造屋.起基.竖柱.上梁.定磉.安门.开池.",
			"j": "嫁娶.开市.合寿木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0612": {
			"y": "祭祀.斋醮.塑绘.开光.出行.修造.动土.造畜椆栖.安床.放水.掘井.开池.作厕.结网.破土.",
			"j": "出火.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0626": {
			"y": "祭祀.作灶.余事勿取.",
			"j": "开市.安葬.破土.修坟.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0602": {
			"y": "嫁娶.祭祀.祈福.求嗣.斋醮.订盟.纳采.解除.出行.动土.破土.习艺.针灸.理发.会亲友.起基.修造.动土.竖柱.定磉.安床.拆卸.纳畜.牧养.放水.破土.除服.成服.修坟.立碑.",
			"j": "开市.入宅.探病.出火.造屋.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0630": {
			"y": "嫁娶.订盟.纳采.冠笄.会亲友.安机械.造车器.祭祀.出行.纳财.入宅.安香.出火.入学.塑绘.开光.拆卸.起基.修造.动土.牧养.栽种.安门.作厕.",
			"j": "行丧.伐木.作梁.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0625": {
			"y": "纳采.冠笄.求医.治病.开市.立券.修造.动土.安机械.破土.安葬.",
			"j": "斋醮.祭祀.移徙.入宅.上梁.嫁娶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0614": {
			"y": "祭祀.结网.余事勿取.",
			"j": "入宅.出行.掘井.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0623": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "入宅.嫁娶.移徙.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0615": {
			"y": "嫁娶.纳采.订盟.冠笄.造车器.祭祀.开光.祈福.求嗣.出行.解除.伐木.出火.入宅.拆卸.修造.动土.上梁.安床.栽种.破土.",
			"j": "行丧.置产.入宅.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0613": {
			"y": "开市.交易.立券.挂匾.开光.解除.拆卸.动土.安床.修造.上梁.置产.栽种.破土.安葬.",
			"j": "作灶.出火.祭祀.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0604": {
			"y": "塞穴.断蚁.结网.余事勿取.",
			"j": "破土.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0603": {
			"y": "余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0616": {
			"y": "嫁娶.合帐.裁衣.冠笄.伐木.上梁.出火.拆卸.移徙.修造.动土.安门.纳财.筑堤.栽种.塞穴.",
			"j": "安床.祈福.出行.安葬.行丧.开光.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0605": {
			"y": "祭祀.教牛马.断蚁.余事勿取.",
			"j": "斋醮.移徙.入宅.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0726": {
			"y": "纳财.开市.交易.立券.出行.祭祀.祈福.求嗣.开光.解除.扫舍.起基.竖柱.安床.移徙.开仓.出货财.补垣.塞穴.栽种.纳畜.牧养.",
			"j": "斋醮.入宅.安门.安葬.破土.行丧.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0601": {
			"y": "栽种.捕捉.畋猎.余事勿取.",
			"j": "开市.动土.祭祀.斋醮.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0606": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.开市.纳财.立券.移徙.出行.修造.动土.起基.定磉.竖柱.拆卸.扫舍.放水.安香.安床.造船.开池.掘井.造畜椆栖.栽种.",
			"j": "行丧.安葬.破土.作灶.伐木.斋醮.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0607": {
			"y": "嫁娶.开光.祭祀.祈福.出行.解除.移徙.入宅.开市.纳财.起基.修造.竖柱.上梁.造屋.作灶.出火.安香.补垣.塞穴.拆卸.放水.扫舍.造仓.造船.栽种.安葬.",
			"j": "纳采.订盟.安床.谢土.破土.动土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0608": {
			"y": "嫁娶.祭祀.理发.作灶.修饰垣墙.平治道涂.整手足甲.沐浴.冠笄.",
			"j": "破土.出行.栽种.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0609": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.进人口.入宅.移徙.安床.交易.立券.挂匾.纳财.入殓.安葬.启攒.除服.成服.",
			"j": "动土.掘井.破土.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0610": {
			"y": "畋猎.捕捉.结网.取渔.祭祀.沐浴.余事勿取.",
			"j": "嫁娶.开市.安葬.启攒.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0611": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "移徙.入宅.开仓.出货财.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0617": {
			"y": "出行.教牛马.割蜜.余事勿取.",
			"j": "斋醮.造屋.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0618": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.拆卸.修造.进人口.入宅.移徙.动土.安床.纳畜.栽种.纳财.交易.立券.挂匾.造畜椆栖.",
			"j": "安葬.开生坟.合寿木.行丧.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0619": {
			"y": "安机械.祭祀.祈福.求嗣.沐浴.解除.纳采.开市.修造.竖柱.上梁.开柱眼.安碓硙.归岫.补垣.塞穴.拆卸.放水.出火.扫舍.开生坟.合寿木.安葬.谢土.启攒.除服.成服.",
			"j": "嫁娶.安床.作灶.动土.破土.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0620": {
			"y": "祭祀.沐浴.理发.整手足甲.修饰垣墙.平治道涂.余事勿取.",
			"j": "开市.入宅.出行.修造.词讼.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0621": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.立券.移徙.入宅.动土.破土.安葬.",
			"j": "开光.作灶.造屋.架马.开仓.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0627": {
			"y": "祭祀.祈福.求嗣.斋醮.安香.解除.移徙.入宅.会亲友.求医.治病.动土.破土.开生坟.合寿木.",
			"j": "合帐.上梁.经络.安葬.入殓.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0628": {
			"y": "嫁娶.冠笄.修造.动土.作灶.移徙.入宅.补垣.塞穴.纳畜.牧养.架马.修造.动土.起基.定磉.开池.造船.",
			"j": "祈福.开光.掘井.开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0629": {
			"y": "祭祀.交易.纳财.",
			"j": "斋醮.开渠.上梁.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0716": {
			"y": "纳采.订盟.会亲友.入学.祭祀.祈福.求嗣.开光.出行.解除.理发.动土.起基.开市.交易.立券.纳财.造仓.栽种.纳畜.牧养.",
			"j": "嫁娶.作灶.出火.置产.嫁娶.入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0706": {
			"y": "嫁娶.出行.安机械.祭祀.塑绘.开光.治病.经络.安床.结网.塞穴.破土.入殓.",
			"j": "开市.安门.掘井.作灶.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0727": {
			"y": "祭祀.修饰垣墙.平治道涂.",
			"j": "开市.动土.破土.嫁娶.修造.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0717": {
			"y": "祭祀.祈福.解除.整手足甲.安床.沐浴.入殓.移柩.破土.启攒.安葬.谢土.",
			"j": "嫁娶.斋醮.开市.出火.入宅.移徙.出行.作灶.安门.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0731": {
			"y": "纳采.订盟.嫁娶.移徙.入宅.出行.开市.交易.立券.纳财.会亲友.安香.出火.拆卸.造屋.起基.安床.作灶.挂匾.安葬.破土.启攒.立碑.入殓.移柩.",
			"j": "祈福.上梁.开仓.掘井.牧养.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0827": {
			"y": "嫁娶.订盟.纳采.作灶.冠笄.裁衣.会亲友.纳畜.牧养.安机械.开市.立券.纳财.安床.",
			"j": "掘井.出行.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0701": {
			"y": "开光.求嗣.出行.冠笄.嫁娶.伐木.架马.开柱眼.修造.移徙.入宅.开市.交易.立券.出行.安香.出火.挂匾.起基.修造.开生坟.合寿木.入殓.除服.成服.移柩.安葬.",
			"j": "安床.出货财.作灶.动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0702": {
			"y": "祭祀.沐浴.理发.嫁娶.作灶.整手足甲.扫舍.修饰垣墙.平治道涂.",
			"j": "斋醮.出行.治病.合寿木.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0703": {
			"y": "安机械.移徙.入宅.出行.祭祀.祈福.斋醮.纳采.订盟.安香.出火.解除.会亲友.修造.动土.拆卸.起基.定磉.移徙.入宅.造屋.安床.修造.破土.安葬.入殓.立碑.",
			"j": "开市.伐木.作梁.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0704": {
			"y": "祭祀.沐浴.捕捉.结网.畋猎.取渔.余事勿取.",
			"j": "开市.交易.嫁娶.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0705": {
			"y": "破屋.坏垣.求医.治病.畋猎.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0707": {
			"y": "开市.交易.立券.纳财.动土.开光.出行.嫁娶.纳采.订盟.出行.纳财.入学.开仓.出货财.纳畜.牧养.栽种.破土.启攒.安葬.立碑.",
			"j": "入宅.移徙.作灶.祭祀.谢土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0708": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.修造.动土.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.入殓.破土.谢土.安葬.",
			"j": "掘井.伐木.纳畜.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0709": {
			"y": "祭祀.冠笄.作灶.交易.纳财.栽种.结网.纳畜.牧养.进人口.",
			"j": "开渠.造船.安床.安葬.破土.出行.修坟.掘井.开市.开生坟.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0710": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.纳采.裁衣.冠笄.开光.安床.作梁.修造.动土.作灶.起基.上梁.造屋.纳畜.牧养.",
			"j": "移徙.栽种.出行.行丧.破土.安葬.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0711": {
			"y": "经络.祭祀.沐浴.补垣.塞穴.除服.成服.移柩.入殓.启攒.立碑.",
			"j": "开光.治病.嫁娶.掘井.破土.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0712": {
			"y": "嫁娶.祭祀.出行.裁衣.冠笄.交易.雕刻.纳财.造畜椆栖.造车器.雕刻.教牛马.",
			"j": "移徙.入宅.栽种.动土.破土.作灶.安葬.行丧.伐木.上梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0713": {
			"y": "修造.动土.安机械.祭祀.沐浴.解除.拆卸.治病.作灶.造屋.起基.开池.扫舍.造畜椆栖.开生坟.合寿木.安葬.破土.启攒.移柩.入殓.立碑.",
			"j": "开市.入宅.出行.安床.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0714": {
			"y": "嫁娶.纳采.订盟.造车器.开光.出行.拆卸.起基.安床.除服.成服.开市.交易.立券.栽种.牧养.入殓.移柩.启攒.",
			"j": "上梁.入宅.修造.动土.破土.祭祀.祈福.斋醮.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0715": {
			"y": "祭祀.嫁娶.畋猎.结网.",
			"j": "动土.破土.治病.开渠.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0718": {
			"y": "破屋.坏垣.解除.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0719": {
			"y": "嫁娶.开市.立券.移徙.入宅.安机械.会亲友.经络.安门.安床.挂匾.拆卸.开仓.出货财.开池.栽种.纳畜.牧养.破土.安葬.启攒.移柩.入殓.立碑.",
			"j": "祭祀.祈福.探病.谢土.造桥.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0720": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.斋醮.开光.会亲友.求医.治病.造屋.起基.竖柱.上梁.安门.安碓硙.筑堤.开池.破土.安葬.除服.成服.",
			"j": "入宅.开市.掘井.词讼.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0721": {
			"y": "纳采.订盟.嫁娶.移徙.入宅.出行.祭祀.祈福.斋醮.塑绘.开光.安香.出火.会亲友.解除.入学.竖柱.上梁.拆卸.造屋.起基.栽种.牧养.纳畜.",
			"j": "安葬.破土.开市.开仓.出货财.启攒.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0722": {
			"y": "纳采.订盟.嫁娶.祭祀.沐浴.塑绘.开光.出火.治病.习艺.伐木.造屋.竖柱.上梁.安床.作灶.安碓硙.挂匾.掘井.纳畜.",
			"j": "出行.安葬.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0723": {
			"y": "祭祀.入殓.除服.成服.移柩.破土.启攒.安葬.塞穴.断蚁.结网.",
			"j": "开市.入宅.嫁娶.开光.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0724": {
			"y": "祭祀.修造.出行.造屋.竖柱.造车器.教牛马.造畜椆栖.割蜜.",
			"j": "动土.破土.掘井.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0725": {
			"y": "祭祀.沐浴.塑绘.开光.入学.解除.扫舍.治病.开池.牧养.",
			"j": "嫁娶.出行.纳采.入宅.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0728": {
			"y": "订盟.纳采.祭祀.祈福.开光.安香.出火.立券.安机械.移徙.入宅.竖柱.上梁.会亲友.安床.拆卸.挂匾.牧养.教牛马.",
			"j": "嫁娶.安葬.行丧.破土.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0729": {
			"y": "沐浴.理发.捕捉.入殓.移柩.破土.启攒.安葬.",
			"j": "出火.嫁娶.入宅.作灶.破土.上梁.动土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0730": {
			"y": "求医.治病.破屋.坏垣.余事勿取.",
			"j": "嫁娶.出行.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0817": {
			"y": "祭祀.出行.作梁.出火.拆卸.修造.动土.起基.安床.补垣.塞穴.入殓.破土.安葬.移柩.造畜椆栖.",
			"j": "嫁娶.入宅.斋醮.开光.针灸.掘井.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0807": {
			"y": "祭祀.解除.拆卸.修造.动土.起基.上梁.安床.安门.开渠.开池.入殓.破土.启攒.",
			"j": "嫁娶.出行.进人口.作灶.入宅.移徙.栽种.赴任.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0822": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.斋醮.普渡.移徙.入宅.出行.安机械.开光.修造.动土.竖柱.上梁.造屋.起基.定磉.安门.安葬.破土.",
			"j": "开市.立券.置产.作灶.造桥.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0812": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "祈福.纳采.订盟.嫁娶.入宅.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0802": {
			"y": "祭祀.进人口.纳财.纳畜.牧养.捕捉.余事勿取.",
			"j": "开市.入宅.安床.动土.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0831": {
			"y": "祭祀.沐浴.理发.整手足甲.冠笄.解除.入殓.移柩.破土.启攒.安葬.",
			"j": "嫁娶.出行.入宅.开市.安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0826": {
			"y": "嫁娶.祭祀.祈福.斋醮.普渡.移徙.入宅.动土.治病.开市.交易.立券.开光.修造.造车器.安香.安床.捕捉.畋猎.结网.",
			"j": "纳采.订盟.经络.行丧.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0821": {
			"y": "祭祀.理发.作灶.沐浴.修饰垣墙.平治道涂.",
			"j": "嫁娶.栽种.祈福.造桥.安葬.安门.伐木.作梁.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0816": {
			"y": "嫁娶.纳采.订盟.开光.祭祀.出行.理发.动土.安床.放水.开渠.栽种.进人口.",
			"j": "入宅.上梁.入殓.造屋.探病.作灶.安门.安葬.纳畜.伐木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0806": {
			"y": "移徙.入宅.治病.会亲友.祭祀.祈福.斋醮.安香.移徙.嫁娶.造屋.起基.",
			"j": "开市.斋醮.安床.出行.经络.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0921": {
			"y": "祭祀.冠笄.捕捉.余事勿取.",
			"j": "嫁娶.开市.造屋.作梁.合寿木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0801": {
			"y": "祭祀.祈福.斋醮.出行.纳采.订盟.安机械.出火.拆卸.修造.动土.起基.移徙.入宅.造庙.入殓.除服.成服.移柩.破土.安葬.谢土.",
			"j": "嫁娶.开市.栽种.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0803": {
			"y": "祭祀.塑绘.开光.求医.治病.嫁娶.会亲友.放水.掘井.牧养.纳畜.开渠.安碓硙.",
			"j": "造屋.入宅.作灶.入学.安葬.行丧.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0804": {
			"y": "祭祀.塞穴.结网.畋猎.余事勿取.",
			"j": "移徙.开市.入宅.嫁娶.开光.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0805": {
			"y": "开市.纳财.祭祀.塑绘.安机械.冠笄.会亲友.裁衣.开仓.经络.纳畜.造畜椆栖.教牛马.牧养.",
			"j": "动土.破土.安葬.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0808": {
			"y": "纳采.订盟.开光.出行.解除.安香.出火.拆卸.入宅.移徙.修造.上梁.安床.栽种.纳畜.会亲友.安机械.经络.",
			"j": "伐木.谢土.行丧.祭祀.作灶.动土.破土.安葬.祈福.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0809": {
			"y": "修饰垣墙.平治道涂.祭祀.沐浴.作灶.",
			"j": "嫁娶.词讼.治病.置产.作梁.祈福.安葬.栽种.伐木.安门.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0810": {
			"y": "嫁娶.祭祀.祈福.求嗣.出火.出行.开光.解除.拆卸.修造.进人口.安香.交易.立券.入宅.移徙.安床.动土.破土.谢土.安葬.入殓.除服.成服.",
			"j": "斋醮.开市.开仓.作灶.造船.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0811": {
			"y": "破土.安葬.移柩.入殓.祭祀.捕捉.除服.成服.余事勿取.",
			"j": "嫁娶.入宅.开市.交易.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0813": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.安香.出火.解除.伐木.入宅.移徙.安床.开市.交易.立券.栽种.出火.出行.安葬.",
			"j": "掘井.理发.作灶.动土.破土.开池.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0814": {
			"y": "安机械.纳采.订盟.祭祀.祈福.求嗣.开光.普渡.出行.出火.拆卸.修造.动土.进人口.开市.交易.立券.移徙.安床.栽种.上梁.纳畜.破土.移柩.安葬.",
			"j": "入宅.嫁娶.掘井.牧养.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0815": {
			"y": "嫁娶.祭祀.祈福.求嗣.裁衣.冠笄.经络.修造.进人口.安床.动土.竖柱.上梁.移徙.交易.立券.栽种.会亲友.",
			"j": "行丧.安葬.出行.作梁.纳畜.伐木.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0818": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.出行.解除.竖柱.入宅.移徙.纳财.上梁.纳畜.入殓.安葬.启攒.",
			"j": "栽种.掘井.动土.安床.破土.置产.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0819": {
			"y": "解除.祭祀.祈福.求嗣.修造.动土.竖柱.上梁.安床.纳畜.造屋.合脊.起基.入殓.破土.安葬.",
			"j": "出火.嫁娶.开光.进人口.出行.词讼.开市.入宅.移徙.赴任.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0820": {
			"y": "沐浴.理发.会亲友.塑绘.开光.栽种.牧养.嫁娶.经络.补垣.塞穴.",
			"j": "开市.入宅.动土.破土.安葬.作灶.上梁.安床.开仓.祈福.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0823": {
			"y": "祭祀.普渡.捕捉.解除.结网.畋猎.入殓.破土.安葬.",
			"j": "开市.交易.入宅.嫁娶.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0824": {
			"y": "沐浴.破屋.坏垣.余事勿取.",
			"j": "斋醮.开市.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0825": {
			"y": "订盟.纳采.祭祀.祈福.安香.出火.开市.立券.入宅.挂匾.造桥.启攒.安葬.",
			"j": "动土.破土.嫁娶.掘井.安床.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0828": {
			"y": "嫁娶.订盟.纳采.祭祀.斋醮.普渡.解除.出行.会亲友.开市.纳财.修造.动土.竖柱.上梁.开光.开仓.出货财.纳畜.牧养.开池.破土.启攒.",
			"j": "出火.入宅.造屋.安门.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0829": {
			"y": "嫁娶.普渡.祭祀.祈福.补垣.塞穴.断蚁.筑堤.入殓.除服.成服.安葬.",
			"j": "动土.破土.掘井.开光.上梁.词讼.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0830": {
			"y": "嫁娶.冠笄.祭祀.沐浴.普渡.出行.纳财.扫舍.纳畜.赴任.",
			"j": "开市.动土.破土.安床.开仓.上梁.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0919": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出行.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.上梁.合脊.放水.掘井.破土.移柩.谢土.除服.成服.",
			"j": "开市.开仓.安门.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0909": {
			"y": "嫁娶.祭祀.理发.进人口.作灶.移柩.冠笄.会亲友.",
			"j": "开仓.出货财.伐木.纳畜.开市.上梁.造屋.破土.启攒.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1021": {
			"y": "纳采.订盟.开市.交易.立券.会亲友.纳畜.牧养.问名.移徙.解除.作厕.入学.起基.安床.开仓.出货财.安葬.启攒.入殓.除服.成服.",
			"j": "入宅.上梁.斋醮.出火.谢土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0901": {
			"y": "塑绘.冠笄.嫁娶.会亲友.进人口.经络.裁衣.栽种.纳畜.牧养.补垣.塞穴.捕捉.",
			"j": "祈福.开市.动土.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0902": {
			"y": "出行.沐浴.订盟.纳采.裁衣.竖柱.上梁.移徙.纳畜.牧养.",
			"j": "嫁娶.安门.动土.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0903": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.普渡.开光.安香.出火.移徙.入宅.竖柱.修造.动土.竖柱.上梁.起基.造屋.安门.造庙.造桥.破土.启攒.安葬.",
			"j": "开市.立券.纳财.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0904": {
			"y": "祭祀.捕捉.畋猎.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.启攒.",
			"j": "嫁娶.纳采.订盟.开市.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0905": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "行丧.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0906": {
			"y": "祈福.斋醮.出行.冠笄.嫁娶.雕刻.开柱眼.入宅.造桥.开市.交易.立券.纳财.入殓.除服.成服.移柩.破土.安葬.启攒.",
			"j": "动土.破土.订盟.安床.开池.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0907": {
			"y": "嫁娶.纳采.订盟.祭祀.开光.出行.理发.作梁.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.移徙.拆卸.挂匾.栽种.纳畜.破土.安葬.入殓.除服.成服.",
			"j": "开市.掘井.开渠.造桥.造船.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0908": {
			"y": "开市.交易.立券.纳财.挂匾.栽种.祭祀.祈福.开光.拆卸.动土.安床.",
			"j": "嫁娶.破土.进人口.出行.入宅.移徙.出火.纳畜.词讼.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0910": {
			"y": "祭祀.修坟.除服.成服.启攒.移柩.余事勿取.",
			"j": "开市.入宅.嫁娶.动土.破土.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0911": {
			"y": "嫁娶.冠笄.安机械.解除.纳畜.牧养.沐浴.伐木.架马.作梁.安门.扫舍.合寿木.安葬.启攒.立碑.修坟.",
			"j": "祈福.开光.开市.入宅.动土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0912": {
			"y": "祭祀.出行.沐浴.扫舍.安葬.余事勿取.",
			"j": "动土.破土.置产.掘井.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0913": {
			"y": "嫁娶.纳采.祭祀.解除.出行.修造.动土.开市.上梁.安床.整手足甲.扫舍.求医.治病.起基.定磉.造屋.合脊.",
			"j": "造庙.行丧.安葬.伐木.作灶.造船.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0914": {
			"y": "纳采.订盟.开市.交易.立券.挂匾.纳财.栽种.进人口.入宅.移徙.安床.开光.出火.拆卸.安门.修造.",
			"j": "斋醮.嫁娶.行丧.动土.作灶.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0915": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.入宅.安床.出行.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0916": {
			"y": "开光.祈福.求嗣.斋醮.修造.动土.纳财.造仓.作厕.栽种.牧养.会亲友.",
			"j": "作灶.出火.进人口.开渠.入宅.移徙.祭祀.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0917": {
			"y": "开光.解除.拆卸.修造.动土.竖柱.安门.牧养.安葬.修坟.破土.移柩.",
			"j": "出火.入宅.移徙.祈福.祭祀.安床.开市.嫁娶.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0918": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "移徙.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0920": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.解除.进人口.入宅.移徙.出火.安床.开市.交易.立券.挂匾.",
			"j": "安葬.纳畜.出行.行丧.伐木.栽种.造庙.造桥.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "成",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0922": {
			"y": "祭祀.解除.结网.畋猎.取渔.会亲友.入学.移柩.启攒.除服.成服.",
			"j": "开市.祈福.动土.破土.入殓.安葬.造船.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0923": {
			"y": "冠笄.沐浴.出行.修造.动土.移徙.入宅.破土.安葬.",
			"j": "嫁娶.开市.祭祀.祈福.斋醮.纳采.修坟.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0924": {
			"y": "祭祀.出行.",
			"j": "嫁娶.入宅.修造.动土.会亲友.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0925": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.修造.动土.移徙.入宅.",
			"j": "针灸.伐木.作梁.造庙.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0926": {
			"y": "出行.开市.交易.立券.安机械.出火.上梁.移徙.",
			"j": "嫁娶.安葬.动土.造桥.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0927": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "斋醮.嫁娶.移徙.出行.上梁.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0928": {
			"y": "嫁娶.造车器.安机械.祭祀.祈福.开光.安香.出火.出行.开市.立券.修造.动土.移徙.入宅.破土.安葬.",
			"j": "纳采.订盟.架马.词讼.开渠.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0929": {
			"y": "沐浴.捕捉.入殓.除服.成服.破土.启攒.安葬.",
			"j": "祭祀.嫁娶.安床.开市.入宅.探病.上梁.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0930": {
			"y": "余事勿取.",
			"j": "探病.余事勿取.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1027": {
			"y": "造车器.嫁娶.订盟.纳采.会亲友.祭祀.出行.开市.立券.移徙.入宅.破土.安葬.",
			"j": "上梁.开光.造屋.架马.合寿木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1023": {
			"y": "捕捉.畋猎.余事勿取.",
			"j": "开市.交易.祭祀.入宅.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1127": {
			"y": "塑绘.会亲友.安机械.塞穴.结网.裁衣.经络.",
			"j": "嫁娶.开市.祈福.斋醮.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1001": {
			"y": "订盟.纳采.祭祀.祈福.安香.出火.修造.动土.上梁.安门.起基.竖柱.上梁.定磉.开池.移徙.入宅.立券.破土.",
			"j": "嫁娶.造庙.造桥.造船.作灶.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1002": {
			"y": "开光.求嗣.雕刻.嫁娶.订盟.纳采.出火.拆卸.修造.动土.起基.上梁.放水.移徙.入宅.造仓.造船.开市.开池.纳畜.牧养.挂匾.",
			"j": "行丧.安葬.合寿木.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1003": {
			"y": "祭祀.嫁娶.捕捉.",
			"j": "开光.动土.破土.开市.修造.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1004": {
			"y": "祭祀.普渡.解除.会亲友.捕捉.畋猎.启攒.除服.成服.移柩.",
			"j": "嫁娶.开市.动土.掘井.开池.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1005": {
			"y": "祭祀.出行.解除.冠笄.嫁娶.伐木.架马.开柱眼.修造.动土.移徙.入宅.开生坟.合寿木.入殓.移柩.破土.安葬.修坟.",
			"j": "开光.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1006": {
			"y": "祭祀.祈福.求嗣.出行.沐浴.交易.扫舍.教牛马.",
			"j": "动土.作灶.行丧.安葬.修坟.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1007": {
			"y": "出行.解除.纳采.冠笄.雕刻.修造.动土.起基.上梁.合脊.安床.移徙.入宅.开市.栽种.作厕.",
			"j": "造庙.安门.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1008": {
			"y": "祭祀.开光.出行.解除.理发.伐木.出火.拆卸.上梁.合脊.安床.造畜椆栖.",
			"j": "嫁娶.安葬.行丧.词讼.造桥.作灶.破土.动土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1009": {
			"y": "纳采.订盟.会亲友.沐浴.理发.裁衣.冠笄.安床.除服.成服.启攒.移柩.安葬.会亲友.开生坟.",
			"j": "开市.入宅.出行.嫁娶.修坟.祈福.动土.入宅.安门.谢土.上梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1010": {
			"y": "解除.祭祀.修饰垣墙.平治道涂.造畜椆栖.余事勿取.",
			"j": "嫁娶.开市.交易.入宅.入学.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1011": {
			"y": "入殓.破土.启攒.安葬.除服.成服.余事勿取.",
			"j": "开市.入宅.祭祀.置产.补垣.塞穴.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1012": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.拆卸.修造.动土.上梁.安床.纳畜.入殓.破土.",
			"j": "入宅.移徙.掘井.理发.伐木.交易.开市.作灶.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1013": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "嫁娶.入宅.上梁.出行.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1014": {
			"y": "祭祀.求嗣.冠笄.进人口.会亲友.安门.安床.经络.纳财.牧养.畋猎.放水.割蜜.",
			"j": "祈福.斋醮.纳采.订盟.嫁娶.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1015": {
			"y": "嫁娶.纳采.订盟.开市.交易.立券.挂匾.祭祀.祈福.开光.造车器.挂匾.出行.入宅.移徙.安床.安门.拆卸.修造.动土.栽种.安葬.破土.启攒.除服.成服.入殓.立碑.",
			"j": "探病.纳畜.伐木.起基.作梁.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1016": {
			"y": "祭祀.冠笄.移徙.会亲友.纳财.理发.捕捉.",
			"j": "嫁娶.开市.开池.作厕.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1017": {
			"y": "祭祀.祈福.求嗣.斋醮.开光.出行.嫁娶.求医.治病.动土.破土.入学.起基.扫舍.竖柱.上梁.开仓.出货财.置产.栽种.牧养.开生坟.谢土.立碑.",
			"j": "安门.安床.裁衣.入宅.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1018": {
			"y": "嫁娶.裁衣.冠笄.合帐.祭祀.出行.安床.移徙.塞穴.入殓.破土.移柩.安葬.",
			"j": "开市.出行.栽种.置产.词讼.安门.掘井.开光.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1019": {
			"y": "祭祀.造车器.出行.修造.上梁.造屋.安门.安床.造畜椆栖.教牛马.",
			"j": "出货财.开仓.动土.破土.安葬.行丧.伐木.开渠.栽种.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1020": {
			"y": "祭祀.开光.出行.解除.伐木.作梁.出火.拆卸.入宅.移徙.安床.修造.造畜椆栖.扫舍.",
			"j": "造庙.嫁娶.掘井.栽种.造桥.作灶.动土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1022": {
			"y": "祭祀.平治道涂.余事勿取.",
			"j": "嫁娶.开市.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1024": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.斋醮.开光.安香.出火.造庙.移徙.出行.入宅.造庙.起基.竖柱.上梁.安床.纳畜.捕捉.纳婿.安葬.",
			"j": "开市.破土.掘井.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1025": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "开市.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1026": {
			"y": "订盟.纳采.会亲友.交易.立券.纳财.栽种.纳畜.牧养.",
			"j": "嫁娶.开市.入宅.祈福.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1028": {
			"y": "祭祀.作灶.纳财.捕捉.畋猎.余事勿取.",
			"j": "动土.破土.开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1029": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.求医.治病.出火.移徙.入宅.",
			"j": "开市.开仓.出货财.安床.安门.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1030": {
			"y": "冠笄.祭祀.沐浴.作灶.理发.整手足甲.扫舍.补垣.塞穴.入殓.破土.启攒.",
			"j": "开光.嫁娶.会亲友.栽种.针灸.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1031": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.置产.求医.治病.开市.交易.立券.会亲友.移徙.竖柱.上梁.造屋.合脊.安门.放水.捕捉.纳畜.",
			"j": "造庙.造船.动土.破土.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1107": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1117": {
			"y": "嫁娶.纳采.订盟.祭祀.斋醮.开光.安香.出火.出行.出火.拆卸.动土.祈福.进人口.纳财.交易.立券.移徙.安床.修造.安葬.除服.成服.",
			"j": "置产.掘井.词讼.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1128": {
			"y": "纳采.移徙.纳财.开市.交易.立券.纳财.入宅.修造.动土.竖柱.起基.定磉.造庙.安香.出火.修饰垣墙.平治道涂.会亲友.出行.开池.作厕.",
			"j": "开仓.造屋.造桥.祭祀.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1108": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.雕刻.移徙.开市.入宅.出行.动土.会亲友.入学.修造.动土.起基.安门.安床.造庙.解除.纳财.开池.造畜椆栖.牧养.牧养.",
			"j": "上梁.开仓.出货财.造屋.造船.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1126": {
			"y": "嫁娶.造车器.出行.会亲友.移徙.入宅.修造.动土.雕刻.开光.安香.出火.理发.会亲友.造屋.合脊.起基.归岫.安门.拆卸.扫舍.栽种.造畜椆栖.",
			"j": "开市.纳采.造庙.安床.开渠.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1118": {
			"y": "嫁娶.纳采.订盟.祭祀.开光.出行.解除.伐木.出火.入宅.移徙.拆卸.修造.栽种.安葬.入殓.",
			"j": "破土.动土.安门.作灶.开市.交易.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1122": {
			"y": "祭祀.沐浴.捕捉.畋猎.结网.扫舍.",
			"j": "嫁娶.纳采.订盟.安床.动土.破土.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1226": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "嫁娶.移徙.入宅.探病.出行.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1101": {
			"y": "出行.造车器.造畜椆栖.解除.冠笄.裁衣.作梁.雕刻.会亲友.移徙.入宅.安机械.造畜椆栖.开市.扫舍.",
			"j": "嫁娶.动土.破土.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1102": {
			"y": "沐浴.理发.冠笄.安床.开市.立券.会亲友.交易.纳财.结网.教牛马.",
			"j": "移徙.入宅.出行.祈福.嫁娶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1103": {
			"y": "祭祀.造畜椆栖.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.开市.安床.掘井.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1104": {
			"y": "捕捉.结网.入殓.除服.成服.移柩.破土.安葬.启攒.立碑.",
			"j": "嫁娶.祭祀.入宅.造屋.移徙.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1105": {
			"y": "祭祀.祈福.求嗣.斋醮.造庙.出火.安机械.会亲友.开市.交易.立券.纳财.习艺.经络.求医.治病.开池.作厕.畋猎.结网.栽种.牧养.安葬.破土.启攒.",
			"j": "开光.嫁娶.掘井.伐木.作梁.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1106": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1109": {
			"y": "祭祀.祈福.求嗣.开光.解除.伐木.拆卸.修造.栽种.纳畜.安葬.修坟.立碑.",
			"j": "嫁娶.进人口.入宅.移徙.出火.出行.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1110": {
			"y": "沐浴.扫舍.捕捉.畋猎.解除.塞穴.余事勿取.",
			"j": "嫁娶.入宅.开市.安床.破土.修坟.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1111": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.斋醮.开光.出行.解除.动土.开市.交易.立券.挂匾.拆卸.破土.",
			"j": "伐木.上梁.修造.入殓.理发.会亲友.入宅.安门.安葬.作灶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1112": {
			"y": "合帐.裁衣.嫁娶.安床.入殓.移柩.破土.造畜椆栖.",
			"j": "置产.造船.开光.掘井.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1113": {
			"y": "解除.修饰垣墙.冠笄.出行.余事勿取.",
			"j": "开市.动土.破土.嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1114": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.开光.出行.解除.进人口.开市.立券.挂匾.入宅.移徙.安门.栽种.动土.求医.治病.会亲友.起基.修造.造屋.安葬.",
			"j": "作灶.经络.安床.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1115": {
			"y": "祭祀.塑绘.理发.会亲友.牧养.开池.造畜椆栖.畋猎.结网.",
			"j": "祈福.谢土.安葬.上梁.作灶.开市.嫁娶.出行.入宅.动土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1116": {
			"y": "出行.纳财.开市.交易.立券.动土.移徙.入宅.裁衣.会亲友.拆卸.进人口.安香.经络.出货财.修饰垣墙.平治道涂.",
			"j": "造庙.谢土.作灶.作梁.伐木.安葬.行丧.修坟.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1119": {
			"y": "祭祀.解除.破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1120": {
			"y": "祭祀.扫舍.破土.安葬.除服.成服.启攒.移柩.入殓.立碑.余事勿取.",
			"j": "祭祀.嫁娶.入宅.修造.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1121": {
			"y": "订盟.纳采.会亲友.祭祀.祈福.修造.动土.安机械.破土.安葬.",
			"j": "嫁娶.移徙.出火.开市.入宅.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1123": {
			"y": "开市.纳财.出行.祭祀.祈福.求嗣.斋醮.问名.入学.起基.定磉.置产.开渠.掘井.拆卸.栽种.纳畜.牧养.动土.破土.启攒.",
			"j": "移徙.入宅.出火.入殓.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d1124": {
			"y": "祭祀.理发.置产.塞穴.除服.成服.移柩.入殓.破土.安葬.",
			"j": "嫁娶.入宅.安床.掘井.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1125": {
			"y": "祭祀.沐浴.出行.余事勿取.",
			"j": "开市.动土.破土.行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1129": {
			"y": "订盟.纳采.纳财.开市.立券.祭祀.祈福.移徙.入宅.出行.造屋.起基.修造.动土.竖柱.上梁.安门.安香.出火.教牛马.会亲友.破土.",
			"j": "嫁娶.安葬.掘井.置产.造船.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1130": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.塑绘.开光.移徙.安床.伐木.作梁.捕捉.畋猎.结网.求医.治病.解除.安葬.除服.成服.移柩.入殓.立碑.谢土.",
			"j": "开市.造庙.动土.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1206": {
			"y": "嫁娶.冠笄.安床.纳采.会亲友.塞穴.捕捉.置产.造畜椆栖.",
			"j": "开光.掘井.安葬.谢土.修坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1216": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.入宅.移徙.纳畜.入殓.破土.修坟.立碑.",
			"j": "伐木.作梁.动土.安床.破土.栽种.造桥.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1229": {
			"y": "祭祀.沐浴.作灶.纳财.捕捉.畋猎.安床.扫舍.",
			"j": "开市.斋醮.破土.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1222": {
			"y": "订盟.纳采.会亲友.安机械.开光.修造.动土.竖柱.上梁.造屋.起基.造桥.栽种.纳畜.造畜椆栖.移柩.入殓.启攒.修坟.立碑.安葬.",
			"j": "祈福.出火.嫁娶.入宅.开市.动土.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1209": {
			"y": "嫁娶.纳采.订盟.造车器.祭祀.祈福.造庙.安香.出火.出行.归宁.入学.入宅.交易.立券.求医.治病.修造.动土.竖柱.上梁.造屋.起基.安门.",
			"j": "斋醮.伐木.作梁.安葬.行丧.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1228": {
			"y": "纳采.订盟.移徙.入宅.出行.安机械.会亲友.祭祀.祈福.斋醮.开光.安香.出火.解除.求医.针灸.治病.造屋.起基.修造.安门.造船.纳畜.牧养.移柩.入殓.启攒.谢土.修坟.立碑.",
			"j": "嫁娶.动土.安床.造桥.掘井.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1208": {
			"y": "交易.进人口.祭祀.沐浴.捕捉.入殓.除服.成服.安葬.谢土.启攒.修坟.",
			"j": "斋醮.入宅.修造.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1201": {
			"y": "破屋.坏垣.祭祀.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1202": {
			"y": "嫁娶.纳采.订盟.祭祀.冠笄.裁衣.伐木.作梁.架马.定磉.开柱眼.作灶.移徙.安床.畋猎.结网.开池.作厕.除服.成服.启攒.入殓.移柩.安葬.",
			"j": "造屋.造船.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1203": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.斋醮.开光.会亲友.解除.入学.纳财.交易.立券.经络.起基.动土.定磉.开池.栽种.纳畜.牧养.破土.入殓.立碑.安葬.",
			"j": "嫁娶.开市.入宅.出火.移徙.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1204": {
			"y": "捕捉.畋猎.会亲友.解除.入殓.除服.成服.移柩.余事勿取.",
			"j": "安床.安门.破土.修坟.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1205": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.冠笄.出行.理发.拆卸.解除.起基.动土.定磉.安碓硙.开池.掘井.扫舍.除服.成服.移柩.启攒.立碑.谢土.",
			"j": "移徙.入宅.安门.作梁.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1207": {
			"y": "沐浴.冠笄.补垣.塞穴.合帐.裁衣.修造.作梁.开柱眼.安碓硙.筑堤.作厕.断蚁.",
			"j": "移徙.入宅.嫁娶.祈福.开光.掘井.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1210": {
			"y": "纳采.订盟.开市.交易.立券.出行.会亲友.安机械.竖柱.上梁.平治道涂.伐木.拆卸.造屋.起基.安床.安门.解除.安葬.启攒.除服.成服.修坟.立碑.移柩.入殓.",
			"j": "嫁娶.动土.破土.祈福.出火.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1211": {
			"y": "祭祀.平治道涂.除服.成服.安葬.余事勿取.",
			"j": "嫁娶.入宅.纳采.订盟.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1212": {
			"y": "纳采.订盟.祭祀.祈福.开光.安香.出火.出行.会亲友.安机械.修造.动土.竖柱.上梁.造屋.起基.定磉.安床.安门.拆卸.移徙.造桥.造船.安葬.破土.入殓.",
			"j": "开市.造庙.置产.掘井.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1213": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.斋醮.进人口.会亲友.伐木.作梁.开柱眼.安床.掘井.捕捉.畋猎.",
			"j": "开生坟.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1214": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "移徙.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1215": {
			"y": "安床.架马.祭祀.塑绘.开光.出行.理发.伐木.作梁.开柱眼.作厕.畋猎.破土.入殓.除服.成服.移柩.启攒.修坟.立碑.",
			"j": "作灶.安门.造桥.开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1217": {
			"y": "祭祀.沐浴.理发.纳财.进人口.栽种.扫舍.捕捉.畋猎.结网.",
			"j": "会亲友.安葬.入宅.移徙.安床.开市.行丧.出火.作灶.安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1218": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.塑绘.解除.拆卸.修造.动土.竖柱.上梁.安门.置产.开池.掘井.纳畜.安床.栽种.造畜椆栖.破土.移柩.立碑.",
			"j": "嫁娶.开市.出火.进人口.入殓.赴任.入宅.移徙.出行.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1219": {
			"y": "入宅.移徙.出行.进人口.修造.动土.起基.上梁.安门.造仓.补垣.塞穴.造畜椆栖.",
			"j": "嫁娶.开市.安床.栽种.安葬.祈福.开光.掘井.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1220": {
			"y": "造畜椆栖.教牛马.",
			"j": "入宅.移徙.分居.作灶.出火.安香.动土.嫁娶.掘井.扫舍.造桥.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1221": {
			"y": "订盟.纳采.造车器.祭祀.祈福.出行.安香.修造.动土.上梁.开市.交易.立券.移徙.入宅.会亲友.安机械.栽种.纳畜.造屋.起基.安床.造畜椆栖.",
			"j": "破土.安葬.行丧.开生坟.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1223": {
			"y": "祭祀.平治道涂.修坟.除服.成服.余事勿取.",
			"j": "移徙.入宅.嫁娶.掘井.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1224": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.雕刻.开光.安香.出行.入学.修造.动土.竖柱.上梁.造屋.起基.安门.出火.移徙.入宅.掘井.造畜椆栖.安葬.破土.除服.成服.",
			"j": "开市.纳采.订盟.作灶.造庙.造船.经络.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1225": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求嗣.斋醮.安香.出火.修造.起基.造屋.合脊.安门.安碓硙.动土.上梁.移徙.入宅.",
			"j": "出行.掘井.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1227": {
			"y": "冠笄.纳财.掘井.开池.出火.安床.交易.立券.畋猎.结网.理发.放水.",
			"j": "安门.动土.破土.行丧.安葬.成服.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1230": {
			"y": "祈福.斋醮.纳采.订盟.解除.架马.开柱眼.修造.动土.起基.上梁.归岫.造屋.合脊.掘井.除服.成服.破土.栽种.",
			"j": "移徙.开市.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1231": {
			"y": "纳采.订盟.祭祀.沐浴.冠笄.合帐.裁衣.修造.动土.拆卸.移徙.入宅.安门.开仓.筑堤.作厕.栽种.纳畜.补垣.塞穴.",
			"j": "嫁娶.祈福.开光.掘井.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		}
	};


/***/ },
/* 20 */
/***/ function(module, exports) {

	window.HuangLi = window.HuangLi || {};
	HuangLi.y2017 = {
		"d0101": {
			"y": "合帐.裁衣.教牛马.余事勿取.",
			"j": "入宅.动土.破土.嫁娶.作灶.造船.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0201": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "嫁娶.开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0102": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.安香.出火.出行.会亲友.经络.求医.治病.解除.拆卸.起基.修造.动土.定磉.扫舍.栽种.牧养.造畜椆栖.",
			"j": "斋醮.作梁.掘井.行丧.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0103": {
			"y": "纳财.开市.交易.立券.会亲友.进人口.经络.祭祀.祈福.安香.出火.求医.治病.修造.动土.拆卸.扫舍.安床.栽种.牧养.开生坟.合寿木.入殓.安葬.启攒.",
			"j": "嫁娶.祈福.出火.移徙.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0104": {
			"y": "祭祀.入殓.移柩.余事勿取.",
			"j": "入宅.修造.动土.破土.安门.上梁.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0105": {
			"y": "解除.平治道涂.余事勿取.",
			"j": "移徙.入宅.掘井.造庙.栽种.针灸.治病.开池.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0106": {
			"y": "嫁娶.祭祀.开光.伐木.出火.拆卸.入宅.移徙.修造.动土.上梁.安床.纳畜.",
			"j": "开市.行丧.栽种.出行.出货财.安葬.置产.词讼.治病.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0107": {
			"y": "嫁娶.纳采.订盟.入宅.移徙.安床.祭祀.祈福.开光.出行.解除.出火.拆卸.动土.纳畜.谢土.安葬.破土.",
			"j": "伐木.开市.交易.上梁.作灶.安门.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0108": {
			"y": "祭祀.破屋.坏垣.解除.余事勿取.",
			"j": "开市.动土.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0109": {
			"y": "嫁娶.纳采.订盟.开光.安香.出火.纳财.开市.交易.立券.裁衣.造屋.起基.修造.动土.安门.移徙.入宅.栽种.牧养.畋猎.掘井.开池.安葬.破土.入殓.除服.成服.立碑.",
			"j": "祈福.造庙.祭祀.安床.谢土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0110": {
			"y": "祭祀.斋醮.入殓.破土.启攒.安葬.修坟.立碑.除服.成服.",
			"j": "嫁娶.入宅.作灶.纳采.订盟.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0111": {
			"y": "祭祀.斋醮.纳财.捕捉.畋猎.",
			"j": "嫁娶.开市.入宅.安床.破土.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0112": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.斋醮.沐浴.进人口.会亲友.入学.治病.安碓硙.掘井.开池.纳畜.牧养.造畜椆栖.",
			"j": "嫁娶.合帐.入宅.行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0113": {
			"y": "祭祀.祈福.求嗣.沐浴.问名.交易.纳财.入殓.移柩.安葬.修坟.立碑.谢土.造畜椆栖.教牛马.",
			"j": "入宅.置产.嫁娶.动土.栽种.开市.开光.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0114": {
			"y": "祭祀.教牛马.造畜椆栖.祭祀.会亲友.解除.余事勿取.",
			"j": "嫁娶.入宅.出行.动土.破土.安葬.行丧.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0115": {
			"y": "嫁娶.开光.解除.出火.拆卸.修造.进人口.入宅.移徙.安床.栽种.入殓.修坟.动土.除服.成服.",
			"j": "作灶.安葬.祭祀.开市.纳采.订盟.纳畜.谢土.出行.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0116": {
			"y": "出行.起基.安床.纳财.交易.立券.嫁娶.栽种.入殓.移柩.安葬.",
			"j": "挂匾.入宅.上梁.祈福.词讼.作梁.作灶.开池.安门.动土.破土.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0117": {
			"y": "平治道涂.余事勿取.",
			"j": "开光.嫁娶.开仓.出货财.造船.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0118": {
			"y": "嫁娶.订盟.纳采.会亲友.祭祀.安机械.移徙.入宅.造屋.安床.起基.定磉.安香.出火.挂匾.拆卸.置产.",
			"j": "开市.出行.安葬.行丧.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0119": {
			"y": "沐浴.捕捉.畋猎.理发.整手足甲.入殓.除服.成服.破土.安葬.谢土.立碑.修坟.启攒.",
			"j": "纳采.订盟.嫁娶.上梁.开市.斋醮.造屋.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0120": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "斋醮.嫁娶.开市.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0121": {
			"y": "沐浴.开仓.出货财.开市.交易.立券.纳财.栽种.纳畜.牧养.畋猎.入殓.破土.安葬.",
			"j": "祈福.嫁娶.安床.入宅.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0122": {
			"y": "祭祀.沐浴.补垣.塞穴.断蚁.解除.余事勿取.",
			"j": "造庙.入宅.修造.安葬.行丧.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0123": {
			"y": "嫁娶.纳采.订盟.问名.祭祀.冠笄.裁衣.会亲友.进人口.纳财.捕捉.作灶.",
			"j": "开市.安床.安葬.修坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0124": {
			"y": "订盟.纳采.会亲友.祭祀.斋醮.沐浴.塑绘.出火.开光.竖柱.上梁.开市.交易.立券.作梁.开柱眼.伐木.架马.安门.安床.拆卸.牧养.造畜椆栖.掘井.",
			"j": "造庙.嫁娶.出行.动土.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0125": {
			"y": "交易.立券.纳财.安床.裁衣.造畜椆栖.安葬.谢土.启攒.除服.成服.修坟.立碑.移柩.入殓.",
			"j": "开光.嫁娶.开市.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0126": {
			"y": "祭祀.解除.教牛马.会亲友.余事勿取.",
			"j": "破土.动土.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0127": {
			"y": "纳采.订盟.移徙.纳财.开市.交易.立券.入宅.会亲友.解除.求医.治病.入学.安床.安门.安香.出火.拆卸.扫舍.入宅.挂匾.开生坟.合寿木.破土.修坟.启攒.入殓.",
			"j": "探病.祭祀.出行.上梁.造屋.谢土.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0128": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求嗣.会亲友.解除.出行.入学.纳财.开市.交易.立券.习艺.经络.安床.开仓.出货财.纳畜.安葬.启攒.修坟.入殓.",
			"j": "入宅.开光.开市.动土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0129": {
			"y": "祭祀.冠笄.嫁娶.会亲友.进人口.裁衣.结网.平治道涂.",
			"j": "移徙.入宅.造庙.作灶.治病.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0130": {
			"y": "祭祀.安碓硙.结网.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0131": {
			"y": "嫁娶.祭祀.沐浴.裁衣.出行.理发.移徙.捕捉.畋猎.放水.入宅.除服.成服.启攒.安葬.移柩.入殓.",
			"j": "造屋.开市.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0202": {
			"y": "纳采.订盟.祭祀.求嗣.出火.塑绘.裁衣.会亲友.入学.拆卸.扫舍.造仓.挂匾.掘井.开池.结网.栽种.纳畜.破土.修坟.立碑.安葬.入殓.",
			"j": "祈福.嫁娶.造庙.安床.谢土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0225": {
			"y": "入学.习艺.出行.纳采.订盟.嫁娶.会亲友.进人口.牧养.捕捉.入殓.移柩.安葬.启攒.",
			"j": "开光.开市.入宅.动土.造屋.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0215": {
			"y": "纳采.订盟.祭祀.祈福.安香.出火.修造.出行.开市.移徙.入宅.动土.安葬.破土.",
			"j": "安床.作灶.造船.会亲友.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0222": {
			"y": "会亲友.求嗣.理发.冠笄.结网.捕捉.开光.理发.",
			"j": "开市.动土.安葬.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0212": {
			"y": "嫁娶.祭祀.冠笄.修饰垣墙.置产.",
			"j": "经络.探病.造屋.作灶.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0227": {
			"y": "祭祀.冠笄.嫁娶.拆卸.修造.动土.起基.上梁.造屋.入宅.开市.开池.塞穴.入殓.除服.成服.移柩.安葬.破土.",
			"j": "安床.栽种.治病.作灶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0301": {
			"y": "塑绘.开光.祈福.求嗣.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.起基.安门.安床.移徙.造仓.结网.纳畜.",
			"j": "伐木.作灶.安葬.取渔.入宅.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0203": {
			"y": "祭祀.斋醮.沐浴.开生坟.除服.成服.移柩.入殓.破土.安葬.合寿木.",
			"j": "开市.嫁娶.安床.会亲友.入宅.作灶.上梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0204": {
			"y": "祭祀.塞穴.结网.破土.谢土.安葬.移柩.除服.成服.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0205": {
			"y": "祭祀.沐浴.理发.作灶.结网.栽种.",
			"j": "嫁娶.词讼.行丧.安葬.牧养.伐木.作梁.开市.纳畜.造畜椆栖.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0206": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.开市.交易.立券.动土.纳财.掘井.会亲友.",
			"j": "入宅.安葬.伐木.作梁.纳畜.造畜椆栖.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0207": {
			"y": "祭祀.祈福.求嗣.纳畜.入殓.启攒.谢土.除服.成服.",
			"j": "栽种.开光.出行.针灸.嫁娶.入宅.动土.破土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0208": {
			"y": "开光.解除.伐木.竖柱.上梁.交易.立券.纳畜.入殓.移柩.安葬.",
			"j": "入宅.出行.移徙.祭祀.嫁娶.动土.破土.作灶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0209": {
			"y": "祭祀.祈福.求嗣.开光.嫁娶.出行.解除.伐木.拆卸.进人口.安床.动土.起基.上梁.栽种.纳畜.破土.谢土.启攒.安葬.",
			"j": "移徙.入宅.出火.作灶.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0210": {
			"y": "会亲友.冠笄.安床.会亲友.安机械.祭祀.祈福.求嗣.经络.",
			"j": "嫁娶.开市.动土.作灶.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0211": {
			"y": "作灶.解除.平治道涂.余事勿取.",
			"j": "祭祀.祈福.安葬.安门.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0213": {
			"y": "纳采.嫁娶.祭祀.祈福.出行.修造.动土.移徙.入宅.安葬.破土.",
			"j": "开市.入宅.斋醮.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0214": {
			"y": "祭祀.沐浴.解除.理发.扫舍.破屋.坏垣.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0216": {
			"y": "塞穴.结网.取渔.畋猎.",
			"j": "嫁娶.安门.移徙.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0217": {
			"y": "纳采.祭祀.祈福.出行.会亲友.修造.动土.移徙.入宅.",
			"j": "嫁娶.开市.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0218": {
			"y": "纳采.嫁娶.祭祀.祈福.出行.开市.会亲友.动土.破土.启攒.",
			"j": "移徙.入宅.出火.安门.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0219": {
			"y": "祭祀.祈福.求嗣.斋醮.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "嫁娶.动土.开光.造屋.破土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0220": {
			"y": "纳采.会亲友.竖柱.上梁.立券.入殓.移柩.安葬.启攒.",
			"j": "祭祀.移徙.入宅.动土.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0221": {
			"y": "祭祀.祈福.斋醮.出行.开市.立券.动土.移徙.入宅.破土.安葬.",
			"j": "开光.嫁娶.作灶.掘井.纳畜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0223": {
			"y": "祭祀.平治道涂.余事勿取.",
			"j": "嫁娶.祈福.掘井.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0224": {
			"y": "祈福.求嗣.斋醮.纳采.嫁娶.伐木.修造.动土.移徙.入宅.造庙.安机械.开市.入殓.除服.成服.移柩.安葬.破土.谢土.",
			"j": "置产.造屋.合脊.开光.探病.安门.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0226": {
			"y": "祭祀.沐浴.求医.治病.扫舍.破屋.坏垣.解除.余事勿取.",
			"j": "入宅.开市.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0228": {
			"y": "祭祀.结网.入殓.除服.成服.移柩.安葬.破土.",
			"j": "余事勿取.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0401": {
			"y": "祭祀.嫁娶.纳婿.除服.成服.入殓.移柩.",
			"j": "动土.作灶.入宅.开光.安床.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0302": {
			"y": "祭祀.沐浴.开光.塑绘.祈福.求嗣.订盟.纳采.冠笄.裁衣.嫁娶.动土.除服.成服.移柩.破土.启攒.出行.安碓硙.放水.开市.立券.交易.",
			"j": "安葬.上梁.入宅.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0303": {
			"y": "祭祀.祈福.求嗣.酬神.裁衣.安床.立券.交易.入殓.除服.成服.移柩.谢土.启攒.",
			"j": "出行.嫁娶.入宅.动土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0304": {
			"y": "裁衣.合帐.入殓.除服.成服.会亲友.纳财.",
			"j": "祭祀.祈福.移徙.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0305": {
			"y": "祭祀.祈福.求嗣.斋醮.嫁娶.冠笄.出行.开市.交易.会亲友.教牛马.除服.成服.启攒.安葬.移柩.",
			"j": "祈福.动土.移徙.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0306": {
			"y": "塞穴.整手足甲.解除.捕捉.畋猎.结网.余事勿取.诸事不宜.",
			"j": "嫁娶.作灶.掘井.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0307": {
			"y": "纳财.开市.立券.交易.开光.安床.上梁.造屋.修造.起基.",
			"j": "动土.破土.安葬.行丧.赴任.出行.嫁娶.入宅.移徙.谢土.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0308": {
			"y": "祭祀.祈福.嫁娶.冠笄.修饰垣墙.置产.平治道涂.",
			"j": "开仓.出货财.造屋.作灶.开市.交易.立券.栽种.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0309": {
			"y": "嫁娶.祭祀.开光.祈福.求嗣.出行.出火.进人口.入宅.移徙.安床.拆卸.修造.安门.挂匾.纳财.扫舍.",
			"j": "动土.伐木.安葬.行丧.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0310": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.出行.出火.入宅.移徙.解除.栽种.伐木.破土.谢土.安葬.",
			"j": "开市.交易.作灶.纳财.上梁.安床.造屋.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0311": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "开光.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0312": {
			"y": "纳采.交易.立券.安床.安机械.安葬.移柩.动土.破土.立碑.",
			"j": "嫁娶.开光.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0313": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.开光.理发.经络.解除.治病.治病.立碑.栽种.牧养.掘井.开池.",
			"j": "嫁娶.定磉.合寿木.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0314": {
			"y": "纳财.交易.立券.栽种.捕捉.结网.取渔.进人口.教牛马.理发.",
			"j": "入宅.造屋.竖柱.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0315": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.修造.动土.移徙.入宅.破土.出火.安门.安床.上梁.立碑.移柩.",
			"j": "开市.交易.合帐.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0316": {
			"y": "冠笄.立券.交易.修造.动土.安机械.入殓.安葬.破土.",
			"j": "嫁娶.祈福.出火.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0317": {
			"y": "祭祀.会亲友.出行.立券.交易.冠笄.纳财.",
			"j": "嫁娶.动土.掘井.起基.定磉.破土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0318": {
			"y": "祭祀.沐浴.解除.扫舍.塞穴.牧养.",
			"j": "嫁娶.安葬.行丧.安门.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0319": {
			"y": "纳财.开市.交易.立券.开光.针灸.会亲友.理发.安床.造仓.结网.",
			"j": "移徙.入宅.栽种.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0320": {
			"y": "嫁娶.冠笄.会亲友.安机械.纳财.交易.立券.置产.",
			"j": "开市.造屋.治病.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0321": {
			"y": "嫁娶.造车器.纳采.订盟.祭祀.祈福.安机械.移徙.入宅.开市.立券.破土.安葬.",
			"j": "纳畜.理发.合寿木.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0322": {
			"y": "祈福.斋醮.出行.移徙.入宅.修造.动土.破土.安葬.",
			"j": "纳采.开光.安床.嫁娶.开市.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0323": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "嫁娶.移徙.开市.入宅.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0324": {
			"y": "嫁娶.冠笄.祭祀.出行.会亲友.修造.动土.入殓.破土.",
			"j": "塑绘.开光.造桥.除服.成服.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0325": {
			"y": "开光.求嗣.出行.纳采.冠笄.出火.拆卸.起基.修造.动土.上梁.移徙.造船.开市.交易.立券.纳财.",
			"j": "祈福.嫁娶.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0326": {
			"y": "理发.冠笄.嫁娶.进人口.栽种.捕捉.针灸.",
			"j": "纳财.开市.安葬.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0327": {
			"y": "开光.祈福.求嗣.出行.解除.伐木.造屋.起基.修造.架马.安门.移徙.入宅.造庙.除服.成服.移柩.谢土.纳畜.牧养.",
			"j": "纳采.动土.开市.交易.安门.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0328": {
			"y": "裁衣.经络.伐木.开柱眼.拆卸.修造.动土.上梁.合脊.合寿木.入殓.除服.成服.移柩.破土.安葬.启攒.修坟.立碑.",
			"j": "祭祀.嫁娶.出行.上梁.掘井.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0329": {
			"y": "祭祀.会亲友.立券.交易.裁衣.合帐.嫁娶.冠笄.进人口.",
			"j": "栽种.动土.安葬.掘井.修坟.探病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0330": {
			"y": "扫舍.塞穴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0331": {
			"y": "塑绘.开光.订盟.纳采.裁衣.合帐.冠笄.安机械.会亲友.纳财.开市.立券.交易.安床.竖柱.上梁.结网.栽种.解除.经络.",
			"j": "作灶.出行.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0425": {
			"y": "求嗣.出行.解除.订盟.纳采.嫁娶.会亲友.进人口.安床.开市.交易.纳畜.牧养.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "祈福.开市.修造.动土.破土.谢土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0428": {
			"y": "祭祀.祈福.开光.求嗣.斋醮.纳采.订盟.求医.治病.起基.定磉.造船.取渔.解除.安葬.启攒.谢土.入殓.",
			"j": "开市.动土.掘井.开池.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0418": {
			"y": "沐浴.捕捉.畋猎.结网.取渔.",
			"j": "祭祀.嫁娶.入宅.作灶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0408": {
			"y": "祭祀.修门.取渔.纳财.纳畜.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0531": {
			"y": "开光.出行.纳采.嫁娶.伐木.架马.出火.拆卸.移徙.入宅.造庙.造桥.造船.造畜椆栖.开市.入殓.除服.成服.移柩.安葬.",
			"j": "",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0501": {
			"y": "祭祀.塑绘.开光.订盟.纳采.冠笄.裁衣.安机械.拆卸.修造.动土.安床.经络.开市.",
			"j": "出火.入宅.安葬.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0402": {
			"y": "祈福.求嗣.开光.塑绘.斋醮.订盟.纳采.嫁娶.拆卸.安床.入宅.安香.移柩.修坟.安葬.谢土.栽种.解除.冠笄.裁衣.移徙.修造.动土.竖柱.放水.启攒.立碑.",
			"j": "赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0403": {
			"y": "祭祀.解除.入殓.除服.成服.移柩.启攒.安葬.修坟.立碑.谢土.沐浴.扫舍.捕捉.取渔.结网.畋猎.理发.",
			"j": "安床.嫁娶.作灶.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0404": {
			"y": "祭祀.解除.入殓.移柩.启攒.安葬.整手足甲.捕捉.畋猎.取渔.除服.成服.扫舍.谢土.斋醮.",
			"j": "动土.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0405": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.开市.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0406": {
			"y": "沐浴.塞穴.畋猎.结网.取渔.扫舍.余事勿取.",
			"j": "祈福.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0407": {
			"y": "开市.交易.立券.挂匾.祭祀.开光.祈福.求嗣.安床.解除.修造.安葬.",
			"j": "纳采.问名.订盟.嫁娶.入宅.开仓.出火.动土.破土.纳畜.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0409": {
			"y": "安香.出火.纳采.订盟.嫁娶.开市.立券.交易.挂匾.开光.出行.解除.安床.栽种.置产.拆卸.修造.动土.",
			"j": "作灶.安葬.祭祀.入殓.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0410": {
			"y": "祭祀.出行.修造.动土.合帐.造畜椆栖.安床.移徙.入殓.移柩.破土.启攒.安葬.开生坟.合寿木.补垣.塞穴.",
			"j": "移徙.入宅.作灶.理发.开光.安门.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0411": {
			"y": "祭祀.修饰垣墙.余事勿取.",
			"j": "开光.修造.动土.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0412": {
			"y": "嫁娶.祭祀.祈福.求嗣.斋醮.开光.出火.移徙.入宅.竖柱.上梁.会亲友.造屋.起基.治病.治病.安门.造车器.掘井.开池.",
			"j": "纳采.出行.修坟.安葬.开市.立券.作灶.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0413": {
			"y": "祭祀.塑绘.开光.纳采.嫁娶.开市.出行.会亲友.安床.结网.除服.成服.启攒.安葬.移柩.",
			"j": "祈福.入宅.造屋.动土.破土.探病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0414": {
			"y": "祭祀.作灶.平治道涂.余事勿取.",
			"j": "安床.入宅.安碓硙.栽种.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0415": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.纳畜.入殓.破土.安葬.",
			"j": "移徙.入宅.嫁娶.出行.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0416": {
			"y": "纳采.祭祀.祈福.求嗣.斋醮.出行.起基.造屋.定磉.安门.入殓.安葬.",
			"j": "嫁娶.开市.纳财.出火.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0417": {
			"y": "祭祀.沐浴.解除.求医.治病.破屋.坏垣.余事勿取.",
			"j": "祈福.斋醮.开市.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0419": {
			"y": "祭祀.祈福.求嗣.斋醮.纳采.订盟.开光.竖柱.上梁.开仓.出货财.造屋.起基.定磉.安门.诸事不宜.破土.入殓.启攒.谢土.",
			"j": "出火.嫁娶.开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0420": {
			"y": "祭祀.捕捉.解除.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0421": {
			"y": "纳采.嫁娶.出行.开市.立券.纳畜.牧养.出火.移徙.入宅.",
			"j": "祈福.动土.破土.安葬.入殓.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0422": {
			"y": "祭祀.祈福.求嗣.斋醮.冠笄.作灶.纳财.交易.",
			"j": "开光.嫁娶.掘井.安葬.安门.探病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0423": {
			"y": "祭祀.解除.教牛马.出行.余事勿取.",
			"j": "动土.破土.行丧.开光.作梁.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0424": {
			"y": "沐浴.斋醮.解除.求医.治病.会亲友.造畜椆栖.栽种.理发.扫舍.",
			"j": "开市.嫁娶.移徙.入宅.掘井.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0426": {
			"y": "祭祀.作灶.平治道涂.余事勿取.",
			"j": "嫁娶.安葬.动土.安床.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0427": {
			"y": "造车器.祭祀.祈福.求嗣.斋醮.开市.交易.安机械.雕刻.开光.造屋.合脊.起基.定磉.安门.纳畜.安葬.开生坟.立碑.谢土.斋醮.",
			"j": "入宅.动土.开仓.出货财.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0429": {
			"y": "祭祀.沐浴.破屋.坏垣.求医.治病.解除.余事勿取.",
			"j": "嫁娶.开市.交易.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0430": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0529": {
			"y": "余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0524": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0519": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.治病.造车器.修造.动土.移徙.入宅.",
			"j": "开市.出行.安床.作灶.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0624": {
			"y": "祭祀.交易.纳财.",
			"j": "斋醮.开渠.上梁.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0502": {
			"y": "祭祀.余事勿取.",
			"j": "造庙.嫁娶.安床.余事勿取.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0503": {
			"y": "订盟.纳采.嫁娶.进人口.会亲友.交易.立券.动土.除服.谢土.移柩.破土.启攒.赴任.出行.开市.纳财.栽种.",
			"j": "入殓.安葬.入宅.安床.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0504": {
			"y": "祭祀.祈福.裁衣.合帐.安床.入殓.除服.成服.移柩.破土.启攒.安葬.谢土.立碑.造畜椆栖.",
			"j": "掘井.安门.嫁娶.纳采.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0505": {
			"y": "嫁娶.交易.立券.作厕.补垣.塞穴.畋猎.取渔.开生坟.",
			"j": "安床.开渠.上梁.修造.开市.开光.入宅.移徙.安床.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0506": {
			"y": "塞穴.断蚁.结网.畋猎.余事勿取.",
			"j": "嫁娶.安葬.入宅.出行.动土.词讼.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0507": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.开光.解除.出行.出火.入宅.移徙.栽种.纳畜.牧养.动土.破土.入殓.安葬.",
			"j": "作灶.安床.开仓.造屋.动土.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0508": {
			"y": "开光.纳采.裁衣.冠笄.安床.作灶.进人口.造仓.塞穴.",
			"j": "嫁娶.栽种.修造.动土.出行.伐木.作梁.安葬.谢土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0509": {
			"y": "纳采.嫁娶.裁衣.理发.出行.修造.动土.进人口.开市.交易.立券.挂匾.移徙.上梁.栽种.纳畜.",
			"j": "伐木.安葬.安床.祭祀.祈福.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0510": {
			"y": "开市.交易.立券.挂匾.祭祀.祈福.斋醮.出行.开市.交易.立券.造屋.起基.修造.动土.定磉.安床.安机械.安葬.破土.启攒.除服.成服.立碑.",
			"j": "作灶.嫁娶.移徙.入宅.理发.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0511": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.动土.修造.进人口.入宅.移徙.安床.解除.挂匾.栽种.破土.谢土.入殓.移柩.安葬.",
			"j": "开市.立券.造船.合寿木.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0512": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "开光.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0513": {
			"y": "订盟.纳采.嫁娶.解除.祭祀.祈福.求嗣.开光.出行.解除.出火.拆卸.入宅.移徙.安床.栽种.纳畜.动土.破土.谢土.安葬.修坟.",
			"j": "作灶.开市.经络.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0514": {
			"y": "祭祀.祈福.求嗣.开光.订盟.纳采.解除.动土.起基.进人口.开市.交易.立券.纳财.造仓.开池.栽种.纳畜.破土.安葬.",
			"j": "安床.上梁.裁衣.入宅.嫁娶.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0515": {
			"y": "祭祀.结网.捕捉.余事勿取.",
			"j": "探病.嫁娶.开市.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0516": {
			"y": "祭祀.祈福.求嗣.开光.纳采.订盟.嫁娶.出行.动土.破土.会亲友.开市.交易.立券.习艺.拆卸.起基.安碓硙.放水.开池.造仓.开渠.栽种.谢土.启攒.修坟.立碑.",
			"j": "入宅.安门.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0517": {
			"y": "嫁娶.冠笄.祭祀.出行.移徙.入宅.作灶.造车器.补垣.塞穴.作厕.破土.启攒.除服.成服.入殓.",
			"j": "入宅.造屋.造桥.安门.安葬.上梁.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0518": {
			"y": "祭祀.解除.断蚁.会亲友.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0520": {
			"y": "嫁娶.纳采.订盟.会亲友.安机械.结网.冠笄.祭祀.求嗣.进人口.经络.",
			"j": "开市.作灶.动土.行丧.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0521": {
			"y": "祭祀.沐浴.移徙.破土.安葬.扫舍.平治道涂.",
			"j": "祈福.嫁娶.入宅.安床.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0522": {
			"y": "祭祀.祈福.斋醮.求嗣.安机械.纳畜.移徙.入宅.安机械.塑绘.开光.起基.竖柱.上梁.作灶.安门.安香.出火.造屋.启攒.安葬.",
			"j": "动土.破土.嫁娶.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0523": {
			"y": "嫁娶.纳采.订盟.斋醮.开光.祭祀.祈福.求医.治病.会亲友.动土.解除.捕捉.纳畜.牧养.入殓.破土.安葬.",
			"j": "移徙.入宅.造屋.架马.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0525": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "斋醮.开市.嫁娶.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0526": {
			"y": "开市.交易.立券.安机械.会亲友.开光.求医.治病.造屋.起基.修造.动土.定磉.竖柱.上梁.安门.作灶.放水.作厕.开池.栽种.牧养.造畜椆栖.破土.安葬.立碑.",
			"j": "嫁娶.出火.移徙.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0527": {
			"y": "栽种.捕捉.畋猎.余事勿取.",
			"j": "开市.动土.祭祀.斋醮.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0528": {
			"y": "嫁娶.祭祀.祈福.求嗣.斋醮.订盟.纳采.解除.出行.动土.破土.习艺.针灸.理发.会亲友.起基.修造.动土.竖柱.定磉.安床.拆卸.纳畜.牧养.放水.破土.除服.成服.修坟.立碑.",
			"j": "开市.入宅.探病.出火.造屋.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0530": {
			"y": "塞穴.断蚁.结网.余事勿取.",
			"j": "破土.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0614": {
			"y": "安机械.祭祀.祈福.求嗣.沐浴.解除.纳采.开市.修造.竖柱.上梁.开柱眼.安碓硙.归岫.补垣.塞穴.拆卸.放水.出火.扫舍.开生坟.合寿木.安葬.谢土.启攒.除服.成服.",
			"j": "嫁娶.安床.作灶.动土.破土.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0604": {
			"y": "嫁娶.纳采.求医.治病.修造.动土.移徙.入宅.破土.安葬.",
			"j": "开市.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0613": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.拆卸.修造.进人口.入宅.移徙.动土.安床.纳畜.栽种.纳财.交易.立券.挂匾.造畜椆栖.",
			"j": "安葬.开生坟.合寿木.行丧.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0623": {
			"y": "嫁娶.冠笄.修造.动土.作灶.移徙.入宅.补垣.塞穴.纳畜.牧养.架马.修造.动土.起基.定磉.开池.造船.",
			"j": "祈福.开光.掘井.开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0627": {
			"y": "祭祀.沐浴.理发.嫁娶.作灶.整手足甲.扫舍.修饰垣墙.平治道涂.",
			"j": "斋醮.出行.治病.合寿木.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0724": {
			"y": "沐浴.理发.捕捉.入殓.移柩.破土.启攒.安葬.",
			"j": "出火.嫁娶.入宅.作灶.破土.上梁.动土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0601": {
			"y": "进人口.牧养.置产.塞穴.结网.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0602": {
			"y": "开光.出行.嫁娶.",
			"j": "会亲友.进人口.修造.动土.起基.移徙.开市.纳畜.入殓.除服.成服.移柩.破土.安葬.修坟.立碑.会亲友.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0603": {
			"y": "嫁娶.纳采.出行.祭祀.祈福.开市.动土.移徙.入宅.破土.安葬.",
			"j": "安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0605": {
			"y": "畋猎.捕捉.结网.取渔.祭祀.沐浴.余事勿取.",
			"j": "嫁娶.开市.安葬.启攒.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0606": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "移徙.入宅.开仓.出货财.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0607": {
			"y": "祭祀.斋醮.塑绘.开光.出行.修造.动土.造畜椆栖.安床.放水.掘井.开池.作厕.结网.破土.",
			"j": "出火.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0608": {
			"y": "开市.交易.立券.挂匾.开光.解除.拆卸.动土.安床.修造.上梁.置产.栽种.破土.安葬.",
			"j": "作灶.出火.祭祀.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0609": {
			"y": "祭祀.结网.余事勿取.",
			"j": "入宅.出行.掘井.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0610": {
			"y": "嫁娶.纳采.订盟.冠笄.造车器.祭祀.开光.祈福.求嗣.出行.解除.伐木.出火.入宅.拆卸.修造.动土.上梁.安床.栽种.破土.",
			"j": "行丧.置产.入宅.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0611": {
			"y": "嫁娶.合帐.裁衣.冠笄.伐木.上梁.出火.拆卸.移徙.修造.动土.安门.纳财.筑堤.栽种.塞穴.",
			"j": "安床.祈福.出行.安葬.行丧.开光.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0612": {
			"y": "出行.教牛马.割蜜.余事勿取.",
			"j": "斋醮.造屋.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0615": {
			"y": "祭祀.沐浴.理发.整手足甲.修饰垣墙.平治道涂.余事勿取.",
			"j": "开市.入宅.出行.修造.词讼.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0616": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.立券.移徙.入宅.动土.破土.安葬.",
			"j": "开光.作灶.造屋.架马.开仓.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0617": {
			"y": "纳采.订盟.冠笄.祭祀.祈福.斋醮.出行.修造.动土.移徙.入宅.安香.出火.拆卸.造屋.起基.竖柱.上梁.定磉.安门.开池.",
			"j": "嫁娶.开市.合寿木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0618": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "入宅.嫁娶.移徙.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0619": {
			"y": "嫁娶.安机械.交易.出行.祭祀.祈福.求嗣.斋醮.塑绘.开光.合帐.裁衣.放水.开池.掘井.",
			"j": "作灶.理发.造桥.行丧.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0620": {
			"y": "纳采.冠笄.求医.治病.开市.立券.修造.动土.安机械.破土.安葬.",
			"j": "斋醮.祭祀.移徙.入宅.上梁.嫁娶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0621": {
			"y": "祭祀.作灶.余事勿取.",
			"j": "开市.安葬.破土.修坟.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0622": {
			"y": "祭祀.祈福.求嗣.斋醮.安香.解除.移徙.入宅.会亲友.求医.治病.动土.破土.开生坟.合寿木.",
			"j": "合帐.上梁.经络.安葬.入殓.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0625": {
			"y": "嫁娶.订盟.纳采.冠笄.会亲友.安机械.造车器.祭祀.出行.纳财.入宅.安香.出火.入学.塑绘.开光.拆卸.起基.修造.动土.牧养.栽种.安门.作厕.",
			"j": "行丧.伐木.作梁.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0626": {
			"y": "开光.求嗣.出行.冠笄.嫁娶.伐木.架马.开柱眼.修造.移徙.入宅.开市.交易.立券.出行.安香.出火.挂匾.起基.修造.开生坟.合寿木.入殓.除服.成服.移柩.安葬.",
			"j": "安床.出货财.作灶.动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0628": {
			"y": "安机械.移徙.入宅.出行.祭祀.祈福.斋醮.纳采.订盟.安香.出火.解除.会亲友.修造.动土.拆卸.起基.定磉.移徙.入宅.造屋.安床.修造.破土.安葬.入殓.立碑.",
			"j": "开市.伐木.作梁.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0629": {
			"y": "祭祀.沐浴.捕捉.结网.畋猎.取渔.余事勿取.",
			"j": "开市.交易.嫁娶.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0630": {
			"y": "破屋.坏垣.求医.治病.畋猎.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0726": {
			"y": "纳采.订盟.嫁娶.移徙.入宅.出行.开市.交易.立券.纳财.会亲友.安香.出火.拆卸.造屋.起基.安床.作灶.挂匾.安葬.破土.启攒.立碑.入殓.移柩.",
			"j": "祈福.上梁.开仓.掘井.牧养.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0716": {
			"y": "纳采.订盟.嫁娶.移徙.入宅.出行.祭祀.祈福.斋醮.塑绘.开光.安香.出火.会亲友.解除.入学.竖柱.上梁.拆卸.造屋.起基.栽种.牧养.纳畜.",
			"j": "安葬.破土.开市.开仓.出货财.启攒.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0731": {
			"y": "开市.纳财.祭祀.塑绘.安机械.冠笄.会亲友.裁衣.开仓.经络.纳畜.造畜椆栖.教牛马.牧养.",
			"j": "动土.破土.安葬.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0728": {
			"y": "祭祀.进人口.纳财.纳畜.牧养.捕捉.余事勿取.",
			"j": "开市.入宅.安床.动土.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0730": {
			"y": "祭祀.塞穴.结网.畋猎.余事勿取.",
			"j": "移徙.开市.入宅.嫁娶.开光.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0718": {
			"y": "祭祀.入殓.除服.成服.移柩.破土.启攒.安葬.塞穴.断蚁.结网.",
			"j": "开市.入宅.嫁娶.开光.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0826": {
			"y": "祭祀.沐浴.理发.整手足甲.冠笄.解除.入殓.移柩.破土.启攒.安葬.",
			"j": "嫁娶.出行.入宅.开市.安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0701": {
			"y": "嫁娶.出行.安机械.祭祀.塑绘.开光.治病.经络.安床.结网.塞穴.破土.入殓.",
			"j": "开市.安门.掘井.作灶.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0702": {
			"y": "订盟.纳采.会亲友.进人口.雕刻.拆卸.修造.动土.起基.开市.栽种.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.",
			"j": "",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0703": {
			"y": "祭祀.捕捉.取渔.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0704": {
			"y": "嫁娶.纳采.祭祀.祈福.求医.治病.出行.动土.移徙.入宅.",
			"j": "开市.安门.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0705": {
			"y": "裁衣.作灶.移徙.入宅.纳畜.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0706": {
			"y": "祭祀.入殓.移柩.启攒.安葬.",
			"j": "上梁.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0707": {
			"y": "嫁娶.祭祀.出行.裁衣.冠笄.交易.雕刻.纳财.造畜椆栖.造车器.雕刻.教牛马.",
			"j": "移徙.入宅.栽种.动土.破土.作灶.安葬.行丧.伐木.上梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0708": {
			"y": "修造.动土.安机械.祭祀.沐浴.解除.拆卸.治病.作灶.造屋.起基.开池.扫舍.造畜椆栖.开生坟.合寿木.安葬.破土.启攒.移柩.入殓.立碑.",
			"j": "开市.入宅.出行.安床.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0709": {
			"y": "嫁娶.纳采.订盟.造车器.开光.出行.拆卸.起基.安床.除服.成服.开市.交易.立券.栽种.牧养.入殓.移柩.启攒.",
			"j": "上梁.入宅.修造.动土.破土.祭祀.祈福.斋醮.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0710": {
			"y": "祭祀.嫁娶.畋猎.结网.",
			"j": "动土.破土.治病.开渠.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0711": {
			"y": "纳采.订盟.会亲友.入学.祭祀.祈福.求嗣.开光.出行.解除.理发.动土.起基.开市.交易.立券.纳财.造仓.栽种.纳畜.牧养.",
			"j": "嫁娶.作灶.出火.置产.嫁娶.入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0712": {
			"y": "祭祀.祈福.解除.整手足甲.安床.沐浴.入殓.移柩.破土.启攒.安葬.谢土.",
			"j": "嫁娶.斋醮.开市.出火.入宅.移徙.出行.作灶.安门.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0713": {
			"y": "破屋.坏垣.解除.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0714": {
			"y": "嫁娶.开市.立券.移徙.入宅.安机械.会亲友.经络.安门.安床.挂匾.拆卸.开仓.出货财.开池.栽种.纳畜.牧养.破土.安葬.启攒.移柩.入殓.立碑.",
			"j": "祭祀.祈福.探病.谢土.造桥.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0715": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.斋醮.开光.会亲友.求医.治病.造屋.起基.竖柱.上梁.安门.安碓硙.筑堤.开池.破土.安葬.除服.成服.",
			"j": "入宅.开市.掘井.词讼.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0717": {
			"y": "纳采.订盟.嫁娶.祭祀.沐浴.塑绘.开光.出火.治病.习艺.伐木.造屋.竖柱.上梁.安床.作灶.安碓硙.挂匾.掘井.纳畜.",
			"j": "出行.安葬.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0719": {
			"y": "祭祀.修造.出行.造屋.竖柱.造车器.教牛马.造畜椆栖.割蜜.",
			"j": "动土.破土.掘井.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0720": {
			"y": "祭祀.沐浴.塑绘.开光.入学.解除.扫舍.治病.开池.牧养.",
			"j": "嫁娶.出行.纳采.入宅.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0721": {
			"y": "纳财.开市.交易.立券.出行.祭祀.祈福.求嗣.开光.解除.扫舍.起基.竖柱.安床.移徙.开仓.出货财.补垣.塞穴.栽种.纳畜.牧养.",
			"j": "斋醮.入宅.安门.安葬.破土.行丧.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0722": {
			"y": "祭祀.修饰垣墙.平治道涂.",
			"j": "开市.动土.破土.嫁娶.修造.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0723": {
			"y": "订盟.纳采.祭祀.祈福.开光.安香.出火.立券.安机械.移徙.入宅.竖柱.上梁.会亲友.安床.拆卸.挂匾.牧养.教牛马.",
			"j": "嫁娶.安葬.行丧.破土.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0725": {
			"y": "求医.治病.破屋.坏垣.余事勿取.",
			"j": "嫁娶.出行.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0727": {
			"y": "祭祀.祈福.斋醮.出行.纳采.订盟.安机械.出火.拆卸.修造.动土.起基.移徙.入宅.造庙.入殓.除服.成服.移柩.破土.安葬.谢土.",
			"j": "嫁娶.开市.栽种.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0729": {
			"y": "祭祀.塑绘.开光.求医.治病.嫁娶.会亲友.放水.掘井.牧养.纳畜.开渠.安碓硙.",
			"j": "造屋.入宅.作灶.入学.安葬.行丧.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0824": {
			"y": "嫁娶.普渡.祭祀.祈福.补垣.塞穴.断蚁.筑堤.入殓.除服.成服.安葬.",
			"j": "动土.破土.掘井.开光.上梁.词讼.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0823": {
			"y": "嫁娶.订盟.纳采.祭祀.斋醮.普渡.解除.出行.会亲友.开市.纳财.修造.动土.竖柱.上梁.开光.开仓.出货财.纳畜.牧养.开池.破土.启攒.",
			"j": "出火.入宅.造屋.安门.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0814": {
			"y": "解除.祭祀.祈福.求嗣.修造.动土.竖柱.上梁.安床.纳畜.造屋.合脊.起基.入殓.破土.安葬.",
			"j": "出火.嫁娶.开光.进人口.出行.词讼.开市.入宅.移徙.赴任.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0923": {
			"y": "嫁娶.造车器.安机械.祭祀.祈福.开光.安香.出火.出行.开市.立券.修造.动土.移徙.入宅.破土.安葬.",
			"j": "纳采.订盟.架马.词讼.开渠.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0801": {
			"y": "移徙.入宅.治病.会亲友.祭祀.祈福.斋醮.安香.移徙.嫁娶.造屋.起基.",
			"j": "开市.斋醮.安床.出行.经络.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0802": {
			"y": "塑绘.出行.冠笄.嫁娶.进人口.裁衣.纳婿.造畜椆栖.交易.立券.牧养.开生坟.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0803": {
			"y": "祭祀.冠笄.嫁娶.捕捉.结网.畋猎.取渔.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0804": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0805": {
			"y": "纳采.祭祀.祈福.解除.动土.破土.安葬.",
			"j": "嫁娶.移徙.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0806": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0807": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "祈福.纳采.订盟.嫁娶.入宅.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0808": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.安香.出火.解除.伐木.入宅.移徙.安床.开市.交易.立券.栽种.出火.出行.安葬.",
			"j": "掘井.理发.作灶.动土.破土.开池.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0809": {
			"y": "安机械.纳采.订盟.祭祀.祈福.求嗣.开光.普渡.出行.出火.拆卸.修造.动土.进人口.开市.交易.立券.移徙.安床.栽种.上梁.纳畜.破土.移柩.安葬.",
			"j": "入宅.嫁娶.掘井.牧养.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0810": {
			"y": "嫁娶.祭祀.祈福.求嗣.裁衣.冠笄.经络.修造.进人口.安床.动土.竖柱.上梁.移徙.交易.立券.栽种.会亲友.",
			"j": "行丧.安葬.出行.作梁.纳畜.伐木.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0811": {
			"y": "嫁娶.纳采.订盟.开光.祭祀.出行.理发.动土.安床.放水.开渠.栽种.进人口.",
			"j": "入宅.上梁.入殓.造屋.探病.作灶.安门.安葬.纳畜.伐木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0812": {
			"y": "祭祀.出行.作梁.出火.拆卸.修造.动土.起基.安床.补垣.塞穴.入殓.破土.安葬.移柩.造畜椆栖.",
			"j": "嫁娶.入宅.斋醮.开光.针灸.掘井.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0813": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.出行.解除.竖柱.入宅.移徙.纳财.上梁.纳畜.入殓.安葬.启攒.",
			"j": "栽种.掘井.动土.安床.破土.置产.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0815": {
			"y": "沐浴.理发.会亲友.塑绘.开光.栽种.牧养.嫁娶.经络.补垣.塞穴.",
			"j": "开市.入宅.动土.破土.安葬.作灶.上梁.安床.开仓.祈福.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0816": {
			"y": "祭祀.理发.作灶.沐浴.修饰垣墙.平治道涂.",
			"j": "嫁娶.栽种.祈福.造桥.安葬.安门.伐木.作梁.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0817": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.斋醮.普渡.移徙.入宅.出行.安机械.开光.修造.动土.竖柱.上梁.造屋.起基.定磉.安门.安葬.破土.",
			"j": "开市.立券.置产.作灶.造桥.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0818": {
			"y": "祭祀.普渡.捕捉.解除.结网.畋猎.入殓.破土.安葬.",
			"j": "开市.交易.入宅.嫁娶.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0819": {
			"y": "沐浴.破屋.坏垣.余事勿取.",
			"j": "斋醮.开市.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0820": {
			"y": "订盟.纳采.祭祀.祈福.安香.出火.开市.立券.入宅.挂匾.造桥.启攒.安葬.",
			"j": "动土.破土.嫁娶.掘井.安床.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0821": {
			"y": "嫁娶.祭祀.祈福.斋醮.普渡.移徙.入宅.动土.治病.开市.交易.立券.开光.修造.造车器.安香.安床.捕捉.畋猎.结网.",
			"j": "纳采.订盟.经络.行丧.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0822": {
			"y": "嫁娶.订盟.纳采.作灶.冠笄.裁衣.会亲友.纳畜.牧养.安机械.开市.立券.纳财.安床.",
			"j": "掘井.出行.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0825": {
			"y": "嫁娶.冠笄.祭祀.沐浴.普渡.出行.纳财.扫舍.纳畜.赴任.",
			"j": "开市.动土.破土.安床.开仓.上梁.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0827": {
			"y": "塑绘.冠笄.嫁娶.会亲友.进人口.经络.裁衣.栽种.纳畜.牧养.补垣.塞穴.捕捉.",
			"j": "祈福.开市.动土.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0828": {
			"y": "出行.沐浴.订盟.纳采.裁衣.竖柱.上梁.移徙.纳畜.牧养.",
			"j": "嫁娶.安门.动土.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0829": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.普渡.开光.安香.出火.移徙.入宅.竖柱.修造.动土.竖柱.上梁.起基.造屋.安门.造庙.造桥.破土.启攒.安葬.",
			"j": "开市.立券.纳财.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0830": {
			"y": "祭祀.捕捉.畋猎.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.启攒.",
			"j": "嫁娶.纳采.订盟.开市.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0831": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "行丧.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0913": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "移徙.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0903": {
			"y": "塑绘.开光.解除.订盟.纳采.嫁娶.出火.修造.动土.移徙.入宅.拆卸.起基.安门.分居.开市.交易.立券.纳财.纳畜.牧养.",
			"j": "",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1023": {
			"y": "祭祀.作灶.纳财.捕捉.畋猎.余事勿取.",
			"j": "动土.破土.开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0901": {
			"y": "祈福.斋醮.出行.冠笄.嫁娶.雕刻.开柱眼.入宅.造桥.开市.交易.立券.纳财.入殓.除服.成服.移柩.破土.安葬.启攒.",
			"j": "动土.破土.订盟.安床.开池.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0902": {
			"y": "祈福.求嗣.解除.订盟.纳采.动土.起基.放水.造仓.开市.纳畜.牧养.开生坟.入殓.除服.成服.移柩.破土.安葬.",
			"j": "",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0904": {
			"y": "祈福.出行.订盟.纳采.嫁娶.裁衣.动土.安床.放水.开市.掘井.交易.立券.栽种.开渠.除服.成服.移柩.破土.",
			"j": "",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0905": {
			"y": "嫁娶.祭祀.祈福.斋醮.作灶.移徙.入宅.",
			"j": "动土.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0906": {
			"y": "嫁娶.出行.纳畜.祭祀.入殓.启攒.安葬.",
			"j": "作灶.动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0907": {
			"y": "祭祀.出行.沐浴.扫舍.安葬.余事勿取.",
			"j": "动土.破土.置产.掘井.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0908": {
			"y": "嫁娶.纳采.祭祀.解除.出行.修造.动土.开市.上梁.安床.整手足甲.扫舍.求医.治病.起基.定磉.造屋.合脊.",
			"j": "造庙.行丧.安葬.伐木.作灶.造船.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0909": {
			"y": "纳采.订盟.开市.交易.立券.挂匾.纳财.栽种.进人口.入宅.移徙.安床.开光.出火.拆卸.安门.修造.",
			"j": "斋醮.嫁娶.行丧.动土.作灶.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0910": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.入宅.安床.出行.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0911": {
			"y": "开光.祈福.求嗣.斋醮.修造.动土.纳财.造仓.作厕.栽种.牧养.会亲友.",
			"j": "作灶.出火.进人口.开渠.入宅.移徙.祭祀.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0912": {
			"y": "开光.解除.拆卸.修造.动土.竖柱.安门.牧养.安葬.修坟.破土.移柩.",
			"j": "出火.入宅.移徙.祈福.祭祀.安床.开市.嫁娶.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0914": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出行.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.上梁.合脊.放水.掘井.破土.移柩.谢土.除服.成服.",
			"j": "开市.开仓.安门.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0915": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.解除.进人口.入宅.移徙.出火.安床.开市.交易.立券.挂匾.",
			"j": "安葬.纳畜.出行.行丧.伐木.栽种.造庙.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0916": {
			"y": "祭祀.冠笄.捕捉.余事勿取.",
			"j": "嫁娶.开市.造屋.作梁.合寿木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0917": {
			"y": "祭祀.解除.结网.畋猎.取渔.会亲友.入学.移柩.启攒.除服.成服.",
			"j": "开市.祈福.动土.破土.入殓.安葬.造船.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0918": {
			"y": "冠笄.沐浴.出行.修造.动土.移徙.入宅.破土.安葬.",
			"j": "嫁娶.开市.祭祀.祈福.斋醮.纳采.修坟.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0919": {
			"y": "祭祀.出行.",
			"j": "嫁娶.入宅.修造.动土.会亲友.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0920": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.修造.动土.移徙.入宅.",
			"j": "针灸.伐木.作梁.造庙.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0921": {
			"y": "出行.开市.交易.立券.安机械.出火.上梁.移徙.",
			"j": "嫁娶.安葬.动土.造桥.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0922": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "斋醮.嫁娶.移徙.出行.上梁.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0924": {
			"y": "沐浴.捕捉.入殓.除服.成服.破土.启攒.安葬.",
			"j": "祭祀.嫁娶.安床.开市.入宅.探病.上梁.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0925": {
			"y": "余事勿取.",
			"j": "探病.余事勿取.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0926": {
			"y": "订盟.纳采.祭祀.祈福.安香.出火.修造.动土.上梁.安门.起基.竖柱.上梁.定磉.开池.移徙.入宅.立券.破土.",
			"j": "嫁娶.造庙.造桥.造船.作灶.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0927": {
			"y": "开光.求嗣.雕刻.嫁娶.订盟.纳采.出火.拆卸.修造.动土.起基.上梁.放水.移徙.入宅.造仓.造船.开市.开池.纳畜.牧养.挂匾.",
			"j": "行丧.安葬.合寿木.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0928": {
			"y": "祭祀.嫁娶.捕捉.",
			"j": "开光.动土.破土.开市.修造.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0929": {
			"y": "祭祀.普渡.解除.会亲友.捕捉.畋猎.启攒.除服.成服.移柩.",
			"j": "嫁娶.开市.动土.掘井.开池.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0930": {
			"y": "祭祀.出行.解除.冠笄.嫁娶.伐木.架马.开柱眼.修造.动土.移徙.入宅.开生坟.合寿木.入殓.移柩.破土.安葬.修坟.",
			"j": "开光.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1028": {
			"y": "沐浴.理发.冠笄.安床.开市.立券.会亲友.交易.纳财.结网.教牛马.",
			"j": "移徙.入宅.出行.祈福.嫁娶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1025": {
			"y": "冠笄.祭祀.沐浴.作灶.理发.整手足甲.扫舍.补垣.塞穴.入殓.破土.启攒.",
			"j": "开光.嫁娶.会亲友.栽种.针灸.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1015": {
			"y": "祭祀.开光.出行.解除.伐木.作梁.出火.拆卸.入宅.移徙.安床.修造.造畜椆栖.扫舍.",
			"j": "造庙.嫁娶.掘井.栽种.造桥.作灶.动土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1005": {
			"y": "祭祀.会亲友.纳采.嫁娶.开光.塑绘.斋醮.安香.开市.立券.除服.成服.入殓.移柩.安葬.赴任.进人口.出行.裁衣.修造.动土.上梁.经络.交易.",
			"j": "入宅.伐木.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1031": {
			"y": "祭祀.祈福.求嗣.斋醮.造庙.出火.安机械.会亲友.开市.交易.立券.纳财.习艺.经络.求医.治病.开池.作厕.畋猎.结网.栽种.牧养.安葬.破土.启攒.",
			"j": "开光.嫁娶.掘井.伐木.作梁.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1024": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.求医.治病.出火.移徙.入宅.",
			"j": "开市.开仓.出货财.安床.安门.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1029": {
			"y": "祭祀.造畜椆栖.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.开市.安床.掘井.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1125": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.塑绘.开光.移徙.安床.伐木.作梁.捕捉.畋猎.结网.求医.治病.解除.安葬.除服.成服.移柩.入殓.立碑.谢土.",
			"j": "开市.造庙.动土.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1001": {
			"y": "祭祀.祈福.求嗣.出行.沐浴.交易.扫舍.教牛马.",
			"j": "动土.作灶.行丧.安葬.修坟.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1002": {
			"y": "出行.解除.纳采.冠笄.雕刻.修造.动土.起基.上梁.合脊.安床.移徙.入宅.开市.栽种.作厕.",
			"j": "造庙.安门.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1003": {
			"y": "祭祀.沐浴.解除.理发.冠笄.安机械.作灶.造仓.开市.开池.作厕.补垣.塞穴.断蚁.结网.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1004": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1006": {
			"y": "祭祀.冠笄.会亲友.拆卸.起基.除服.成服.移柩.启攒.安葬.沐浴.捕捉.开光.塑绘.",
			"j": "作灶.祭祀.入宅.嫁娶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1007": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "移徙.入宅.出行.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1008": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "嫁娶.入宅.上梁.出行.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1009": {
			"y": "祭祀.求嗣.冠笄.进人口.会亲友.安门.安床.经络.纳财.牧养.畋猎.放水.割蜜.",
			"j": "祈福.斋醮.纳采.订盟.嫁娶.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1010": {
			"y": "嫁娶.纳采.订盟.开市.交易.立券.挂匾.祭祀.祈福.开光.造车器.挂匾.出行.入宅.移徙.安床.安门.拆卸.修造.动土.栽种.安葬.破土.启攒.除服.成服.入殓.立碑.",
			"j": "探病.纳畜.伐木.起基.作梁.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1011": {
			"y": "祭祀.冠笄.移徙.会亲友.纳财.理发.捕捉.",
			"j": "嫁娶.开市.开池.作厕.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1012": {
			"y": "祭祀.祈福.求嗣.斋醮.开光.出行.嫁娶.求医.治病.动土.破土.入学.起基.扫舍.竖柱.上梁.开仓.出货财.置产.栽种.牧养.开生坟.谢土.立碑.",
			"j": "安门.安床.裁衣.入宅.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1013": {
			"y": "嫁娶.裁衣.冠笄.合帐.祭祀.出行.安床.移徙.塞穴.入殓.破土.移柩.安葬.",
			"j": "开市.出行.栽种.置产.词讼.安门.掘井.开光.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1014": {
			"y": "祭祀.造车器.出行.修造.上梁.造屋.安门.安床.造畜椆栖.教牛马.",
			"j": "出货财.开仓.动土.破土.安葬.行丧.伐木.开渠.栽种.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1016": {
			"y": "纳采.订盟.开市.交易.立券.会亲友.纳畜.牧养.问名.移徙.解除.作厕.入学.起基.安床.开仓.出货财.安葬.启攒.入殓.除服.成服.",
			"j": "入宅.上梁.斋醮.出火.谢土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1017": {
			"y": "祭祀.平治道涂.余事勿取.",
			"j": "嫁娶.开市.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1018": {
			"y": "捕捉.畋猎.余事勿取.",
			"j": "开市.交易.祭祀.入宅.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1019": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.斋醮.开光.安香.出火.造庙.移徙.出行.入宅.造庙.起基.竖柱.上梁.安床.纳畜.捕捉.纳婿.安葬.",
			"j": "开市.破土.掘井.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1020": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "开市.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1021": {
			"y": "订盟.纳采.会亲友.交易.立券.纳财.栽种.纳畜.牧养.",
			"j": "嫁娶.开市.入宅.祈福.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1022": {
			"y": "造车器.嫁娶.订盟.纳采.会亲友.祭祀.出行.开市.立券.移徙.入宅.破土.安葬.",
			"j": "上梁.开光.造屋.架马.合寿木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1026": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.置产.求医.治病.开市.交易.立券.会亲友.移徙.竖柱.上梁.造屋.合脊.安门.放水.捕捉.纳畜.",
			"j": "造庙.造船.动土.破土.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1027": {
			"y": "出行.造车器.造畜椆栖.解除.冠笄.裁衣.作梁.雕刻.会亲友.移徙.入宅.安机械.造畜椆栖.开市.扫舍.",
			"j": "嫁娶.动土.破土.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1030": {
			"y": "捕捉.结网.入殓.除服.成服.移柩.破土.安葬.启攒.立碑.",
			"j": "嫁娶.祭祀.入宅.造屋.移徙.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1127": {
			"y": "嫁娶.纳采.订盟.祭祀.冠笄.裁衣.伐木.作梁.架马.定磉.开柱眼.作灶.移徙.安床.畋猎.结网.开池.作厕.除服.成服.启攒.入殓.移柩.安葬.",
			"j": "造屋.造船.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1122": {
			"y": "塑绘.会亲友.安机械.塞穴.结网.裁衣.经络.",
			"j": "嫁娶.开市.祈福.斋醮.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1227": {
			"y": "合帐.裁衣.教牛马.余事勿取.",
			"j": "入宅.动土.破土.嫁娶.作灶.造船.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1101": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1102": {
			"y": "会亲友.嫁娶.订盟.纳采.纳婿.拆卸.修造.动土.起基.竖柱.上梁.安床.会亲友.纳财.",
			"j": "出行.祈福.安葬.作灶.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1103": {
			"y": "祭祀.塑绘.开光.祈福.斋醮.出行.订盟.纳采.裁衣.嫁娶.拆卸.修造.安床.入宅.安香.入殓.启攒.安葬.谢土.赴任.会亲友.进人口.出行.移徙.上梁.经络.开市.交易.立券.纳财.",
			"j": "开仓.冠笄.伐木.作梁.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1104": {
			"y": "祭祀.作灶.入殓.除服.成服.畋猎.",
			"j": "栽种.动土.安葬.开市.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1105": {
			"y": "祭祀.祈福.斋醮.沐浴.竖柱.订盟.纳采.嫁娶.拆卸.入宅.移柩.启攒.谢土.赴任.出火.纳畜.",
			"j": "作灶.入殓.安葬.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1106": {
			"y": "嫁娶.祭祀.安机械.入殓.破土.安葬.",
			"j": "动土.上梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1107": {
			"y": "合帐.裁衣.嫁娶.安床.入殓.移柩.破土.造畜椆栖.",
			"j": "置产.造船.开光.掘井.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1108": {
			"y": "解除.修饰垣墙.冠笄.出行.余事勿取.",
			"j": "开市.动土.破土.嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1109": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.开光.出行.解除.进人口.开市.立券.挂匾.入宅.移徙.安门.栽种.动土.求医.治病.会亲友.起基.修造.造屋.安葬.",
			"j": "作灶.经络.安床.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1110": {
			"y": "祭祀.塑绘.理发.会亲友.牧养.开池.造畜椆栖.畋猎.结网.",
			"j": "祈福.谢土.安葬.上梁.作灶.开市.嫁娶.出行.入宅.动土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1111": {
			"y": "出行.纳财.开市.交易.立券.动土.移徙.入宅.裁衣.会亲友.拆卸.进人口.安香.经络.出货财.修饰垣墙.平治道涂.",
			"j": "造庙.谢土.作灶.作梁.伐木.安葬.行丧.修坟.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1112": {
			"y": "嫁娶.纳采.订盟.祭祀.斋醮.开光.安香.出火.出行.出火.拆卸.动土.祈福.进人口.纳财.交易.立券.移徙.安床.修造.安葬.除服.成服.",
			"j": "置产.掘井.词讼.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1113": {
			"y": "嫁娶.纳采.订盟.祭祀.开光.出行.解除.伐木.出火.入宅.移徙.拆卸.修造.栽种.安葬.入殓.",
			"j": "破土.动土.安门.作灶.开市.交易.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1114": {
			"y": "祭祀.解除.破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1115": {
			"y": "祭祀.扫舍.破土.安葬.除服.成服.启攒.移柩.入殓.立碑.余事勿取.",
			"j": "祭祀.嫁娶.入宅.修造.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1116": {
			"y": "订盟.纳采.会亲友.祭祀.祈福.修造.动土.安机械.破土.安葬.",
			"j": "嫁娶.移徙.出火.开市.入宅.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1117": {
			"y": "祭祀.沐浴.捕捉.畋猎.结网.扫舍.",
			"j": "嫁娶.纳采.订盟.安床.动土.破土.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1118": {
			"y": "开市.纳财.出行.祭祀.祈福.求嗣.斋醮.问名.入学.起基.定磉.置产.开渠.掘井.拆卸.栽种.纳畜.牧养.动土.破土.启攒.",
			"j": "移徙.入宅.出火.入殓.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d1119": {
			"y": "祭祀.理发.置产.塞穴.除服.成服.移柩.入殓.破土.安葬.",
			"j": "嫁娶.入宅.安床.掘井.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1120": {
			"y": "祭祀.沐浴.出行.余事勿取.",
			"j": "开市.动土.破土.行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1121": {
			"y": "嫁娶.造车器.出行.会亲友.移徙.入宅.修造.动土.雕刻.开光.安香.出火.理发.会亲友.造屋.合脊.起基.归岫.安门.拆卸.扫舍.栽种.造畜椆栖.",
			"j": "开市.纳采.造庙.安床.开渠.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1123": {
			"y": "纳采.移徙.纳财.开市.交易.立券.纳财.入宅.修造.动土.竖柱.起基.定磉.造庙.安香.出火.修饰垣墙.平治道涂.会亲友.出行.开池.作厕.",
			"j": "开仓.造屋.造桥.祭祀.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1124": {
			"y": "订盟.纳采.纳财.开市.立券.祭祀.祈福.移徙.入宅.出行.造屋.起基.修造.动土.竖柱.上梁.安门.安香.出火.教牛马.会亲友.破土.",
			"j": "嫁娶.安葬.掘井.置产.造船.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1126": {
			"y": "破屋.坏垣.祭祀.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1128": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.斋醮.开光.会亲友.解除.入学.纳财.交易.立券.经络.起基.动土.定磉.开池.栽种.纳畜.牧养.破土.入殓.立碑.安葬.",
			"j": "嫁娶.开市.入宅.出火.移徙.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1129": {
			"y": "捕捉.畋猎.会亲友.解除.入殓.除服.成服.移柩.余事勿取.",
			"j": "安床.安门.破土.修坟.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1130": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.冠笄.出行.理发.拆卸.解除.起基.动土.定磉.安碓硙.开池.掘井.扫舍.除服.成服.移柩.启攒.立碑.谢土.",
			"j": "移徙.入宅.安门.作梁.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1207": {
			"y": "纳采.订盟.祭祀.祈福.开光.安香.出火.出行.会亲友.安机械.修造.动土.竖柱.上梁.造屋.起基.定磉.安床.安门.拆卸.移徙.造桥.造船.安葬.破土.入殓.",
			"j": "开市.造庙.置产.掘井.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1217": {
			"y": "订盟.纳采.会亲友.安机械.开光.修造.动土.竖柱.上梁.造屋.起基.造桥.栽种.纳畜.造畜椆栖.移柩.入殓.启攒.修坟.立碑.安葬.",
			"j": "祈福.出火.嫁娶.入宅.开市.动土.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1221": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "嫁娶.移徙.入宅.探病.出行.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1220": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求嗣.斋醮.安香.出火.修造.起基.造屋.合脊.安门.安碓硙.动土.上梁.移徙.入宅.",
			"j": "出行.掘井.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1230": {
			"y": "祭祀.入殓.移柩.余事勿取.",
			"j": "入宅.修造.动土.破土.安门.上梁.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1224": {
			"y": "祭祀.沐浴.作灶.纳财.捕捉.畋猎.安床.扫舍.",
			"j": "开市.斋醮.破土.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1223": {
			"y": "纳采.订盟.移徙.入宅.出行.安机械.会亲友.祭祀.祈福.斋醮.开光.安香.出火.解除.求医.针灸.治病.造屋.起基.修造.安门.造船.纳畜.牧养.移柩.入殓.启攒.谢土.修坟.立碑.",
			"j": "嫁娶.动土.安床.造桥.掘井.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1210": {
			"y": "安床.架马.祭祀.塑绘.开光.出行.理发.伐木.作梁.开柱眼.作厕.畋猎.破土.入殓.除服.成服.移柩.启攒.修坟.立碑.",
			"j": "作灶.安门.造桥.开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1222": {
			"y": "冠笄.纳财.掘井.开池.出火.安床.交易.立券.畋猎.结网.理发.放水.",
			"j": "安门.动土.破土.行丧.安葬.成服.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1228": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.安香.出火.出行.会亲友.经络.求医.治病.解除.拆卸.起基.修造.动土.定磉.扫舍.栽种.牧养.造畜椆栖.",
			"j": "斋醮.作梁.掘井.行丧.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1201": {
			"y": "嫁娶.冠笄.安床.纳采.会亲友.塞穴.捕捉.置产.造畜椆栖.",
			"j": "开光.掘井.安葬.谢土.修坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1202": {
			"y": "祭祀.沐浴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1203": {
			"y": "祭祀.会亲友.嫁娶.沐浴.修造.动土.祈福.开光.塑绘.出行.订盟.纳采.裁衣.入殓.除服.成服.移柩.启攒.赴任.竖柱.上梁.纳财.扫舍.栽种.纳畜.伐木.",
			"j": "入宅.作灶.安床.开仓.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1204": {
			"y": "理发.会亲友.补垣.塞穴.结网.",
			"j": "嫁娶.入宅.安门.移徙.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1205": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.拆卸.修造.动土.起基.安床.移徙.入宅.安香.除服.成服.入殓.移柩.安葬.谢土.赴任.会亲友.进人口.出行.竖柱.上梁.经络.开市.交易.立券.纳财.开仓.",
			"j": "作灶.治病.伐木.作梁.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1206": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.拆卸.修造.动土.起基.安床.移徙.入宅.安香.入殓.移柩.安葬.谢土.赴任.进人口.会亲友.",
			"j": "作灶.治病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1208": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.斋醮.进人口.会亲友.伐木.作梁.开柱眼.安床.掘井.捕捉.畋猎.",
			"j": "开生坟.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1209": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "移徙.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1211": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.入宅.移徙.纳畜.入殓.破土.修坟.立碑.",
			"j": "伐木.作梁.动土.安床.破土.栽种.造桥.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1212": {
			"y": "祭祀.沐浴.理发.纳财.进人口.栽种.扫舍.捕捉.畋猎.结网.",
			"j": "会亲友.安葬.入宅.移徙.安床.开市.行丧.出火.作灶.安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1213": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.塑绘.解除.拆卸.修造.动土.竖柱.上梁.安门.置产.开池.掘井.纳畜.安床.栽种.造畜椆栖.破土.移柩.立碑.",
			"j": "嫁娶.开市.出火.进人口.入殓.赴任.入宅.移徙.出行.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1214": {
			"y": "入宅.移徙.出行.进人口.修造.动土.起基.上梁.安门.造仓.补垣.塞穴.造畜椆栖.",
			"j": "嫁娶.开市.安床.栽种.安葬.祈福.开光.掘井.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1215": {
			"y": "造畜椆栖.教牛马.",
			"j": "入宅.移徙.分居.作灶.出火.安香.动土.嫁娶.掘井.扫舍.造桥.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1216": {
			"y": "订盟.纳采.造车器.祭祀.祈福.出行.安香.修造.动土.上梁.开市.交易.立券.移徙.入宅.会亲友.安机械.栽种.纳畜.造屋.起基.安床.造畜椆栖.",
			"j": "破土.安葬.行丧.开生坟.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1218": {
			"y": "祭祀.平治道涂.修坟.除服.成服.余事勿取.",
			"j": "移徙.入宅.嫁娶.掘井.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1219": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.雕刻.开光.安香.出行.入学.修造.动土.竖柱.上梁.造屋.起基.安门.出火.移徙.入宅.掘井.造畜椆栖.安葬.破土.除服.成服.",
			"j": "开市.纳采.订盟.作灶.造庙.造船.经络.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1225": {
			"y": "祈福.斋醮.纳采.订盟.解除.架马.开柱眼.修造.动土.起基.上梁.归岫.造屋.合脊.掘井.除服.成服.破土.栽种.",
			"j": "移徙.开市.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1226": {
			"y": "纳采.订盟.祭祀.沐浴.冠笄.合帐.裁衣.修造.动土.拆卸.移徙.入宅.安门.开仓.筑堤.作厕.栽种.纳畜.补垣.塞穴.",
			"j": "嫁娶.祈福.开光.掘井.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1229": {
			"y": "纳财.开市.交易.立券.会亲友.进人口.经络.祭祀.祈福.安香.出火.求医.治病.修造.动土.拆卸.扫舍.安床.栽种.牧养.开生坟.合寿木.入殓.安葬.启攒.",
			"j": "嫁娶.祈福.出火.移徙.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1231": {
			"y": "塑绘.开光.订盟.纳采.裁衣.冠笄.拆卸.修造.安床.入宅.出火.安葬.谢土.赴任.",
			"j": "掘井.伐木.斋醮.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		}
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	window.HuangLi = window.HuangLi || {};
	HuangLi.y2018 = {
		"d0101": {
			"y": "祭祀.塑绘.开光.裁衣.冠笄.嫁娶.纳采.拆卸.修造.动土.竖柱.上梁.安床.移徙.入宅.安香.结网.捕捉.畋猎.伐木.进人口.放水.",
			"j": "出行.安葬.修坟.开市.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0201": {
			"y": "祭祀.沐浴.祈福.斋醮.订盟.纳采.裁衣.拆卸.起基.竖柱.上梁.安床.入殓.除服.成服.移柩.启攒.挂匾.求嗣.出行.合帐.造畜椆栖.",
			"j": "开仓.嫁娶.移徙.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0102": {
			"y": "祭祀.求医.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0103": {
			"y": "祭祀.祈福.斋醮.出行.冠笄.安机械.移徙.入宅.安香.安床.除服.成服.移柩.启攒.",
			"j": "开光.栽种.治病.安门.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0104": {
			"y": "塑绘.斋醮.出行.拆卸.解除.修造.移徙.造船.入殓.除服.成服.移柩.启攒.修坟.立碑.谢土.",
			"j": "",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0105": {
			"y": "祭祀.斋醮.入殓.破土.启攒.安葬.修坟.立碑.除服.成服.",
			"j": "嫁娶.入宅.作灶.纳采.订盟.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0106": {
			"y": "祭祀.斋醮.纳财.捕捉.畋猎.",
			"j": "嫁娶.开市.入宅.安床.破土.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0107": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.斋醮.沐浴.进人口.会亲友.入学.治病.安碓硙.掘井.开池.纳畜.牧养.造畜椆栖.",
			"j": "嫁娶.合帐.入宅.行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0108": {
			"y": "祭祀.祈福.求嗣.沐浴.问名.交易.纳财.入殓.移柩.安葬.修坟.立碑.谢土.造畜椆栖.教牛马.",
			"j": "入宅.置产.嫁娶.动土.栽种.开市.开光.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0109": {
			"y": "祭祀.教牛马.造畜椆栖.祭祀.会亲友.解除.余事勿取.",
			"j": "嫁娶.入宅.出行.动土.破土.安葬.行丧.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0110": {
			"y": "嫁娶.开光.解除.出火.拆卸.修造.进人口.入宅.移徙.安床.栽种.入殓.修坟.动土.除服.成服.",
			"j": "作灶.安葬.祭祀.开市.纳采.订盟.纳畜.谢土.出行.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0111": {
			"y": "出行.起基.安床.纳财.交易.立券.嫁娶.栽种.入殓.移柩.安葬.",
			"j": "挂匾.入宅.上梁.祈福.词讼.作梁.作灶.开池.安门.动土.破土.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0112": {
			"y": "平治道涂.余事勿取.",
			"j": "开光.嫁娶.开仓.出货财.造船.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0113": {
			"y": "嫁娶.订盟.纳采.会亲友.祭祀.安机械.移徙.入宅.造屋.安床.起基.定磉.安香.出火.挂匾.拆卸.置产.",
			"j": "开市.出行.安葬.行丧.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0114": {
			"y": "沐浴.捕捉.畋猎.理发.整手足甲.入殓.除服.成服.破土.安葬.谢土.立碑.修坟.启攒.",
			"j": "纳采.订盟.嫁娶.上梁.开市.斋醮.造屋.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0115": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "斋醮.嫁娶.开市.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0116": {
			"y": "沐浴.开仓.出货财.开市.交易.立券.纳财.栽种.纳畜.牧养.畋猎.入殓.破土.安葬.",
			"j": "祈福.嫁娶.安床.入宅.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0117": {
			"y": "祭祀.沐浴.补垣.塞穴.断蚁.解除.余事勿取.",
			"j": "造庙.入宅.修造.安葬.行丧.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0118": {
			"y": "嫁娶.纳采.订盟.问名.祭祀.冠笄.裁衣.会亲友.进人口.纳财.捕捉.作灶.",
			"j": "开市.安床.安葬.修坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0119": {
			"y": "订盟.纳采.会亲友.祭祀.斋醮.沐浴.塑绘.出火.开光.竖柱.上梁.开市.交易.立券.作梁.开柱眼.伐木.架马.安门.安床.拆卸.牧养.造畜椆栖.掘井.",
			"j": "造庙.嫁娶.出行.动土.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0120": {
			"y": "交易.立券.纳财.安床.裁衣.造畜椆栖.安葬.谢土.启攒.除服.成服.修坟.立碑.移柩.入殓.",
			"j": "开光.嫁娶.开市.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0121": {
			"y": "祭祀.解除.教牛马.会亲友.余事勿取.",
			"j": "破土.动土.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0122": {
			"y": "纳采.订盟.移徙.纳财.开市.交易.立券.入宅.会亲友.解除.求医.治病.入学.安床.安门.安香.出火.拆卸.扫舍.入宅.挂匾.开生坟.合寿木.破土.修坟.启攒.入殓.",
			"j": "探病.祭祀.出行.上梁.造屋.谢土.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0123": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求嗣.会亲友.解除.出行.入学.纳财.开市.交易.立券.习艺.经络.安床.开仓.出货财.纳畜.安葬.启攒.修坟.入殓.",
			"j": "入宅.开光.开市.动土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0124": {
			"y": "祭祀.冠笄.嫁娶.会亲友.进人口.裁衣.结网.平治道涂.",
			"j": "移徙.入宅.造庙.作灶.治病.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0125": {
			"y": "祭祀.安碓硙.结网.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0126": {
			"y": "嫁娶.祭祀.沐浴.裁衣.出行.理发.移徙.捕捉.畋猎.放水.入宅.除服.成服.启攒.安葬.移柩.入殓.",
			"j": "造屋.开市.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0127": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "嫁娶.开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0128": {
			"y": "纳采.订盟.祭祀.求嗣.出火.塑绘.裁衣.会亲友.入学.拆卸.扫舍.造仓.挂匾.掘井.开池.结网.栽种.纳畜.破土.修坟.立碑.安葬.入殓.",
			"j": "祈福.嫁娶.造庙.安床.谢土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0129": {
			"y": "入殓.除服.成服.移柩.启攒.安葬.修坟.立碑.",
			"j": "开市.伐木.嫁娶.作梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0130": {
			"y": "祭祀.作灶.入殓.除服.余事勿取.",
			"j": "开市.安床.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0131": {
			"y": "塑绘.开光.沐浴.冠笄.会亲友.作灶.放水.造畜椆栖.",
			"j": "嫁娶.入殓.安葬.出行.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0227": {
			"y": "裁衣.合帐.入殓.除服.成服.会亲友.纳财.",
			"j": "祭祀.祈福.移徙.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0212": {
			"y": "纳采.祭祀.祈福.出行.会亲友.修造.动土.移徙.入宅.",
			"j": "嫁娶.开市.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0202": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0222": {
			"y": "祭祀.冠笄.嫁娶.拆卸.修造.动土.起基.上梁.造屋.入宅.开市.开池.塞穴.入殓.除服.成服.移柩.安葬.破土.",
			"j": "安床.栽种.治病.作灶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0217": {
			"y": "会亲友.求嗣.理发.冠笄.结网.捕捉.开光.理发.",
			"j": "开市.动土.安葬.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0225": {
			"y": "祭祀.沐浴.开光.塑绘.祈福.求嗣.订盟.纳采.冠笄.裁衣.嫁娶.动土.除服.成服.移柩.破土.启攒.出行.安碓硙.放水.开市.立券.交易.",
			"j": "安葬.上梁.入宅.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0215": {
			"y": "纳采.会亲友.竖柱.上梁.立券.入殓.移柩.安葬.启攒.",
			"j": "祭祀.移徙.入宅.动土.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0207": {
			"y": "嫁娶.祭祀.冠笄.修饰垣墙.置产.",
			"j": "经络.探病.造屋.作灶.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0224": {
			"y": "塑绘.开光.祈福.求嗣.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.起基.安门.安床.移徙.造仓.结网.纳畜.",
			"j": "伐木.作灶.安葬.取渔.入宅.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0315": {
			"y": "嫁娶.冠笄.会亲友.安机械.纳财.交易.立券.置产.",
			"j": "开市.造屋.治病.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0203": {
			"y": "沐浴.解除.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.移徙.入宅.除服.成服.移柩.破土.启攒.安葬.扫舍.修坟.伐木.纳财.交易.立券.",
			"j": "作灶.祭祀.上梁.出行.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0204": {
			"y": "祭祀.祈福.求嗣.开光.嫁娶.出行.解除.伐木.拆卸.进人口.安床.动土.起基.上梁.栽种.纳畜.破土.谢土.启攒.安葬.",
			"j": "移徙.入宅.出火.作灶.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0205": {
			"y": "会亲友.冠笄.安床.会亲友.安机械.祭祀.祈福.求嗣.经络.",
			"j": "嫁娶.开市.动土.作灶.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0206": {
			"y": "作灶.解除.平治道涂.余事勿取.",
			"j": "祭祀.祈福.安葬.安门.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0208": {
			"y": "纳采.嫁娶.祭祀.祈福.出行.修造.动土.移徙.入宅.安葬.破土.",
			"j": "开市.入宅.斋醮.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0209": {
			"y": "祭祀.沐浴.解除.理发.扫舍.破屋.坏垣.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0210": {
			"y": "纳采.订盟.祭祀.祈福.安香.出火.修造.出行.开市.移徙.入宅.动土.安葬.破土.",
			"j": "安床.作灶.造船.会亲友.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0211": {
			"y": "塞穴.结网.取渔.畋猎.",
			"j": "嫁娶.安门.移徙.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0213": {
			"y": "纳采.嫁娶.祭祀.祈福.出行.开市.会亲友.动土.破土.启攒.",
			"j": "移徙.入宅.出火.安门.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0214": {
			"y": "祭祀.祈福.求嗣.斋醮.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "嫁娶.动土.开光.造屋.破土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0216": {
			"y": "祭祀.祈福.斋醮.出行.开市.立券.动土.移徙.入宅.破土.安葬.",
			"j": "开光.嫁娶.作灶.掘井.纳畜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0218": {
			"y": "祭祀.平治道涂.余事勿取.",
			"j": "嫁娶.祈福.掘井.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0219": {
			"y": "祈福.求嗣.斋醮.纳采.嫁娶.伐木.修造.动土.移徙.入宅.造庙.安机械.开市.入殓.除服.成服.移柩.安葬.破土.谢土.",
			"j": "置产.造屋.合脊.开光.探病.安门.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0220": {
			"y": "入学.习艺.出行.纳采.订盟.嫁娶.会亲友.进人口.牧养.捕捉.入殓.移柩.安葬.启攒.",
			"j": "开光.开市.入宅.动土.造屋.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0221": {
			"y": "祭祀.沐浴.求医.治病.扫舍.破屋.坏垣.解除.余事勿取.",
			"j": "入宅.开市.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0223": {
			"y": "祭祀.结网.入殓.除服.成服.移柩.安葬.破土.",
			"j": "余事勿取.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0226": {
			"y": "祭祀.祈福.求嗣.酬神.裁衣.安床.立券.交易.入殓.除服.成服.移柩.谢土.启攒.",
			"j": "出行.嫁娶.入宅.动土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0228": {
			"y": "祭祀.斋醮.裁衣.合帐.冠笄.订盟.纳采.嫁娶.入宅.安香.谢土.入殓.移柩.破土.立碑.安香.会亲友.出行.祈福.求嗣.立碑.上梁.放水.",
			"j": "掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0325": {
			"y": "扫舍.塞穴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0415": {
			"y": "祭祀.捕捉.解除.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0301": {
			"y": "安床.合帐.入宅.问名.纳采.求嗣.祭祀.开仓.",
			"j": "斋醮.作灶.安床.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0302": {
			"y": "作灶.平治道涂.",
			"j": "祭祀.祈福.安葬.安门.余事勿取.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0303": {
			"y": "塑绘.开光.酬神.斋醮.订盟.纳采.裁衣.合帐.拆卸.动土.上梁.安床.安香.造庙.挂匾.会亲友.进人口.出行.修造.纳财.伐木.放水.出火.纳畜.沐浴.安门.",
			"j": "造屋.栽种.安葬.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0304": {
			"y": "祭祀.祈福.酬神.订盟.纳采.冠笄.裁衣.合帐.嫁娶.安床.移徙.入宅.安香.入殓.移柩.启攒.安葬.解除.取渔.捕捉.伐木.安门.出火.",
			"j": "栽种.动土.开市.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0305": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.出行.出火.入宅.移徙.解除.栽种.伐木.破土.谢土.安葬.",
			"j": "开市.交易.作灶.纳财.上梁.安床.造屋.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0306": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "开光.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0307": {
			"y": "纳采.交易.立券.安床.安机械.安葬.移柩.动土.破土.立碑.",
			"j": "嫁娶.开光.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0308": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.开光.理发.经络.解除.治病.治病.立碑.栽种.牧养.掘井.开池.",
			"j": "嫁娶.定磉.合寿木.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0309": {
			"y": "纳财.交易.立券.栽种.捕捉.结网.取渔.进人口.教牛马.理发.",
			"j": "入宅.造屋.竖柱.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0310": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.修造.动土.移徙.入宅.破土.出火.安门.安床.上梁.立碑.移柩.",
			"j": "开市.交易.合帐.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0311": {
			"y": "冠笄.立券.交易.修造.动土.安机械.入殓.安葬.破土.",
			"j": "嫁娶.祈福.出火.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0312": {
			"y": "祭祀.会亲友.出行.立券.交易.冠笄.纳财.",
			"j": "嫁娶.动土.掘井.起基.定磉.破土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0313": {
			"y": "祭祀.沐浴.解除.扫舍.塞穴.牧养.",
			"j": "嫁娶.安葬.行丧.安门.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0314": {
			"y": "纳财.开市.交易.立券.开光.针灸.会亲友.理发.安床.造仓.结网.",
			"j": "移徙.入宅.栽种.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0316": {
			"y": "嫁娶.造车器.纳采.订盟.祭祀.祈福.安机械.移徙.入宅.开市.立券.破土.安葬.",
			"j": "纳畜.理发.合寿木.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0317": {
			"y": "祈福.斋醮.出行.移徙.入宅.修造.动土.破土.安葬.",
			"j": "纳采.开光.安床.嫁娶.开市.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0318": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "嫁娶.移徙.开市.入宅.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0319": {
			"y": "嫁娶.冠笄.祭祀.出行.会亲友.修造.动土.入殓.破土.",
			"j": "塑绘.开光.造桥.除服.成服.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0320": {
			"y": "开光.求嗣.出行.纳采.冠笄.出火.拆卸.起基.修造.动土.上梁.移徙.造船.开市.交易.立券.纳财.",
			"j": "祈福.嫁娶.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0321": {
			"y": "理发.冠笄.嫁娶.进人口.栽种.捕捉.针灸.",
			"j": "纳财.开市.安葬.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0322": {
			"y": "开光.祈福.求嗣.出行.解除.伐木.造屋.起基.修造.架马.安门.移徙.入宅.造庙.除服.成服.移柩.谢土.纳畜.牧养.",
			"j": "纳采.动土.开市.交易.安门.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0323": {
			"y": "裁衣.经络.伐木.开柱眼.拆卸.修造.动土.上梁.合脊.合寿木.入殓.除服.成服.移柩.破土.安葬.启攒.修坟.立碑.",
			"j": "祭祀.嫁娶.出行.上梁.掘井.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0324": {
			"y": "祭祀.会亲友.立券.交易.裁衣.合帐.嫁娶.冠笄.进人口.",
			"j": "栽种.动土.安葬.掘井.修坟.探病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0326": {
			"y": "塑绘.开光.订盟.纳采.裁衣.合帐.冠笄.安机械.会亲友.纳财.开市.立券.交易.安床.竖柱.上梁.结网.栽种.解除.经络.",
			"j": "作灶.出行.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0327": {
			"y": "祭祀.嫁娶.纳婿.除服.成服.入殓.移柩.",
			"j": "动土.作灶.入宅.开光.安床.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0328": {
			"y": "祈福.求嗣.开光.塑绘.斋醮.订盟.纳采.嫁娶.拆卸.安床.入宅.安香.移柩.修坟.安葬.谢土.栽种.解除.冠笄.裁衣.移徙.修造.动土.竖柱.放水.启攒.立碑.",
			"j": "赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0329": {
			"y": "祭祀.解除.入殓.除服.成服.移柩.启攒.安葬.修坟.立碑.谢土.沐浴.扫舍.捕捉.取渔.结网.畋猎.理发.",
			"j": "安床.嫁娶.作灶.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0330": {
			"y": "破屋.坏垣.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0331": {
			"y": "祭祀.出行.订盟.纳采.裁衣.合帐.冠笄.进人口.动土.安床.作灶.入殓.移柩.安葬.破土.结网.取渔.畋猎.",
			"j": "作梁.造庙.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0425": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0426": {
			"y": "祭祀.塑绘.开光.订盟.纳采.冠笄.裁衣.安机械.拆卸.修造.动土.安床.经络.开市.",
			"j": "出火.入宅.安葬.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0416": {
			"y": "纳采.嫁娶.出行.开市.立券.纳畜.牧养.出火.移徙.入宅.",
			"j": "祈福.动土.破土.安葬.入殓.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0406": {
			"y": "祭祀.修饰垣墙.余事勿取.",
			"j": "开光.修造.动土.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0423": {
			"y": "祭祀.祈福.开光.求嗣.斋醮.纳采.订盟.求医.治病.起基.定磉.造船.取渔.解除.安葬.启攒.谢土.入殓.",
			"j": "开市.动土.掘井.开池.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0427": {
			"y": "祭祀.余事勿取.",
			"j": "造庙.嫁娶.安床.余事勿取.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0526": {
			"y": "开光.出行.纳采.嫁娶.伐木.架马.出火.拆卸.移徙.入宅.造庙.造桥.造船.造畜椆栖.开市.入殓.除服.成服.移柩.安葬.",
			"j": "",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0401": {
			"y": "祭祀.开光.塑绘.订盟.纳采.合帐.冠笄.拆卸.动土.起基.上梁.入宅.安香.开市.立券.纳财.沐浴.求嗣.出火.竖柱.安门.",
			"j": "造庙.嫁娶.伐木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0402": {
			"y": "祭祀.沐浴.捕捉.栽种.",
			"j": "嫁娶.入宅.移徙.作灶.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0403": {
			"y": "祭祀.开光.塑绘.酬神.斋醮.订盟.纳采.嫁娶.裁衣.动土.起基.出火.拆卸.移徙.入宅.安香.修造.竖柱.上梁.纳畜.牧养.祈福.求嗣.解除.伐木.定磉.造屋.安门.",
			"j": "栽种.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0404": {
			"y": "订盟.纳采.冠笄.拆卸.修造.动土.安床.入殓.除服.成服.移柩.安葬.破土.启攒.造仓.",
			"j": "作灶.开光.嫁娶.开市.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0405": {
			"y": "祭祀.出行.修造.动土.合帐.造畜椆栖.安床.移徙.入殓.移柩.破土.启攒.安葬.开生坟.合寿木.补垣.塞穴.",
			"j": "移徙.入宅.作灶.理发.开光.安门.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0407": {
			"y": "嫁娶.祭祀.祈福.求嗣.斋醮.开光.出火.移徙.入宅.竖柱.上梁.会亲友.造屋.起基.治病.治病.安门.造车器.掘井.开池.",
			"j": "纳采.出行.修坟.安葬.开市.立券.作灶.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0408": {
			"y": "祭祀.塑绘.开光.纳采.嫁娶.开市.出行.会亲友.安床.结网.除服.成服.启攒.安葬.移柩.",
			"j": "祈福.入宅.造屋.动土.破土.探病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0409": {
			"y": "祭祀.作灶.平治道涂.余事勿取.",
			"j": "安床.入宅.安碓硙.栽种.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0410": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.纳畜.入殓.破土.安葬.",
			"j": "移徙.入宅.嫁娶.出行.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0411": {
			"y": "纳采.祭祀.祈福.求嗣.斋醮.出行.起基.造屋.定磉.安门.入殓.安葬.",
			"j": "嫁娶.开市.纳财.出火.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0412": {
			"y": "祭祀.沐浴.解除.求医.治病.破屋.坏垣.余事勿取.",
			"j": "祈福.斋醮.开市.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0413": {
			"y": "沐浴.捕捉.畋猎.结网.取渔.",
			"j": "祭祀.嫁娶.入宅.作灶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0414": {
			"y": "祭祀.祈福.求嗣.斋醮.纳采.订盟.开光.竖柱.上梁.开仓.出货财.造屋.起基.定磉.安门.诸事不宜.破土.入殓.启攒.谢土.",
			"j": "出火.嫁娶.开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0417": {
			"y": "祭祀.祈福.求嗣.斋醮.冠笄.作灶.纳财.交易.",
			"j": "开光.嫁娶.掘井.安葬.安门.探病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0418": {
			"y": "祭祀.解除.教牛马.出行.余事勿取.",
			"j": "动土.破土.行丧.开光.作梁.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0419": {
			"y": "沐浴.斋醮.解除.求医.治病.会亲友.造畜椆栖.栽种.理发.扫舍.",
			"j": "开市.嫁娶.移徙.入宅.掘井.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0420": {
			"y": "求嗣.出行.解除.订盟.纳采.嫁娶.会亲友.进人口.安床.开市.交易.纳畜.牧养.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "祈福.开市.修造.动土.破土.谢土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0421": {
			"y": "祭祀.作灶.平治道涂.余事勿取.",
			"j": "嫁娶.安葬.动土.安床.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0422": {
			"y": "造车器.祭祀.祈福.求嗣.斋醮.开市.交易.安机械.雕刻.开光.造屋.合脊.起基.定磉.安门.纳畜.安葬.开生坟.立碑.谢土.斋醮.",
			"j": "入宅.动土.开仓.出货财.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0424": {
			"y": "祭祀.沐浴.破屋.坏垣.求医.治病.解除.余事勿取.",
			"j": "嫁娶.开市.交易.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0428": {
			"y": "订盟.纳采.嫁娶.进人口.会亲友.交易.立券.动土.除服.谢土.移柩.破土.启攒.赴任.出行.开市.纳财.栽种.",
			"j": "入殓.安葬.入宅.安床.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0429": {
			"y": "祭祀.祈福.裁衣.合帐.安床.入殓.除服.成服.移柩.破土.启攒.安葬.谢土.立碑.造畜椆栖.",
			"j": "掘井.安门.嫁娶.纳采.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0430": {
			"y": "祭祀.进人口.嫁娶.安床.解除.冠笄.出行.裁衣.扫舍.",
			"j": "掘井.动土.破土.安葬.开光.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0524": {
			"y": "余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0529": {
			"y": "嫁娶.纳采.出行.祭祀.祈福.开市.动土.移徙.入宅.破土.安葬.",
			"j": "安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0519": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0522": {
			"y": "栽种.捕捉.畋猎.余事勿取.",
			"j": "开市.动土.祭祀.斋醮.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0516": {
			"y": "祭祀.沐浴.移徙.破土.安葬.扫舍.平治道涂.",
			"j": "祈福.嫁娶.入宅.安床.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0512": {
			"y": "嫁娶.冠笄.祭祀.出行.移徙.入宅.作灶.造车器.补垣.塞穴.作厕.破土.启攒.除服.成服.入殓.",
			"j": "入宅.造屋.造桥.安门.安葬.上梁.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0502": {
			"y": "祭祀.会亲友.开市.安床.启攒.安葬.",
			"j": "嫁娶.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0528": {
			"y": "开光.出行.嫁娶.",
			"j": "会亲友.进人口.修造.动土.起基.移徙.开市.纳畜.入殓.除服.成服.移柩.破土.安葬.修坟.立碑.会亲友.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0518": {
			"y": "嫁娶.纳采.订盟.斋醮.开光.祭祀.祈福.求医.治病.会亲友.动土.解除.捕捉.纳畜.牧养.入殓.破土.安葬.",
			"j": "移徙.入宅.造屋.架马.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0521": {
			"y": "开市.交易.立券.安机械.会亲友.开光.求医.治病.造屋.起基.修造.动土.定磉.竖柱.上梁.安门.作灶.放水.作厕.开池.栽种.牧养.造畜椆栖.破土.安葬.立碑.",
			"j": "嫁娶.出火.移徙.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0508": {
			"y": "订盟.纳采.嫁娶.解除.祭祀.祈福.求嗣.开光.出行.解除.出火.拆卸.入宅.移徙.安床.栽种.纳畜.动土.破土.谢土.安葬.修坟.",
			"j": "作灶.开市.经络.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0527": {
			"y": "进人口.牧养.置产.塞穴.结网.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0621": {
			"y": "开光.求嗣.出行.冠笄.嫁娶.伐木.架马.开柱眼.修造.移徙.入宅.开市.交易.立券.出行.安香.出火.挂匾.起基.修造.开生坟.合寿木.入殓.除服.成服.移柩.安葬.",
			"j": "安床.出货财.作灶.动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0501": {
			"y": "纳采.开光.求医.治病.动土.上梁.移徙.入宅.",
			"j": "嫁娶.开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0503": {
			"y": "祭祀.作灶.掘井.平治道涂.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0504": {
			"y": "祭祀.斋醮.开市.动土.入殓.破土.安葬.",
			"j": "嫁娶.移徙.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0505": {
			"y": "开市.交易.立券.挂匾.祭祀.祈福.斋醮.出行.开市.交易.立券.造屋.起基.修造.动土.定磉.安床.安机械.安葬.破土.启攒.除服.成服.立碑.",
			"j": "作灶.嫁娶.移徙.入宅.理发.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0506": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出火.出行.拆卸.动土.修造.进人口.入宅.移徙.安床.解除.挂匾.栽种.破土.谢土.入殓.移柩.安葬.",
			"j": "开市.立券.造船.合寿木.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0507": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "开光.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0509": {
			"y": "祭祀.祈福.求嗣.开光.订盟.纳采.解除.动土.起基.进人口.开市.交易.立券.纳财.造仓.开池.栽种.纳畜.破土.安葬.",
			"j": "安床.上梁.裁衣.入宅.嫁娶.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0510": {
			"y": "祭祀.结网.捕捉.余事勿取.",
			"j": "探病.嫁娶.开市.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0511": {
			"y": "祭祀.祈福.求嗣.开光.纳采.订盟.嫁娶.出行.动土.破土.会亲友.开市.交易.立券.习艺.拆卸.起基.安碓硙.放水.开池.造仓.开渠.栽种.谢土.启攒.修坟.立碑.",
			"j": "入宅.安门.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0513": {
			"y": "祭祀.解除.断蚁.会亲友.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0514": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.治病.造车器.修造.动土.移徙.入宅.",
			"j": "开市.出行.安床.作灶.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0515": {
			"y": "嫁娶.纳采.订盟.会亲友.安机械.结网.冠笄.祭祀.求嗣.进人口.经络.",
			"j": "开市.作灶.动土.行丧.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0517": {
			"y": "祭祀.祈福.斋醮.求嗣.安机械.纳畜.移徙.入宅.安机械.塑绘.开光.起基.竖柱.上梁.作灶.安门.安香.出火.造屋.启攒.安葬.",
			"j": "动土.破土.嫁娶.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0520": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "斋醮.开市.嫁娶.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0523": {
			"y": "嫁娶.祭祀.祈福.求嗣.斋醮.订盟.纳采.解除.出行.动土.破土.习艺.针灸.理发.会亲友.起基.修造.动土.竖柱.定磉.安床.拆卸.纳畜.牧养.放水.破土.除服.成服.修坟.立碑.",
			"j": "开市.入宅.探病.出火.造屋.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0525": {
			"y": "塞穴.断蚁.结网.余事勿取.",
			"j": "破土.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0530": {
			"y": "嫁娶.纳采.求医.治病.修造.动土.移徙.入宅.破土.安葬.",
			"j": "开市.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0531": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0611": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.立券.移徙.入宅.动土.破土.安葬.",
			"j": "开光.作灶.造屋.架马.开仓.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0613": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "入宅.嫁娶.移徙.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0623": {
			"y": "安机械.移徙.入宅.出行.祭祀.祈福.斋醮.纳采.订盟.安香.出火.解除.会亲友.修造.动土.拆卸.起基.定磉.移徙.入宅.造屋.安床.修造.破土.安葬.入殓.立碑.",
			"j": "开市.伐木.作梁.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0622": {
			"y": "祭祀.沐浴.理发.嫁娶.作灶.整手足甲.扫舍.修饰垣墙.平治道涂.",
			"j": "斋醮.出行.治病.合寿木.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0612": {
			"y": "纳采.订盟.冠笄.祭祀.祈福.斋醮.出行.修造.动土.移徙.入宅.安香.出火.拆卸.造屋.起基.竖柱.上梁.定磉.安门.开池.",
			"j": "嫁娶.开市.合寿木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0731": {
			"y": "纳采.祭祀.祈福.解除.动土.破土.安葬.",
			"j": "嫁娶.移徙.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0601": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "祈福.斋醮.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0602": {
			"y": "纳采.祭祀.祈福.开市.求医.治病.动土.纳畜.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0603": {
			"y": "嫁娶.纳采.出行.移徙.入宅.",
			"j": "动土.破土.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0604": {
			"y": "订盟.纳采.祭祀.动土.破土.交易.立券.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0605": {
			"y": "嫁娶.裁衣.祭祀.出行.安床.作灶.移徙.入宅.破土.安葬.",
			"j": "赴任.捕捉.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0606": {
			"y": "嫁娶.合帐.裁衣.冠笄.伐木.上梁.出火.拆卸.移徙.修造.动土.安门.纳财.筑堤.栽种.塞穴.",
			"j": "安床.祈福.出行.安葬.行丧.开光.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0607": {
			"y": "出行.教牛马.割蜜.余事勿取.",
			"j": "斋醮.造屋.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0608": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.拆卸.修造.进人口.入宅.移徙.动土.安床.纳畜.栽种.纳财.交易.立券.挂匾.造畜椆栖.",
			"j": "安葬.开生坟.合寿木.行丧.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0609": {
			"y": "安机械.祭祀.祈福.求嗣.沐浴.解除.纳采.开市.修造.竖柱.上梁.开柱眼.安碓硙.归岫.补垣.塞穴.拆卸.放水.出火.扫舍.开生坟.合寿木.安葬.谢土.启攒.除服.成服.",
			"j": "嫁娶.安床.作灶.动土.破土.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0610": {
			"y": "祭祀.沐浴.理发.整手足甲.修饰垣墙.平治道涂.余事勿取.",
			"j": "开市.入宅.出行.修造.词讼.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0614": {
			"y": "嫁娶.安机械.交易.出行.祭祀.祈福.求嗣.斋醮.塑绘.开光.合帐.裁衣.放水.开池.掘井.",
			"j": "作灶.理发.造桥.行丧.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0615": {
			"y": "纳采.冠笄.求医.治病.开市.立券.修造.动土.安机械.破土.安葬.",
			"j": "斋醮.祭祀.移徙.入宅.上梁.嫁娶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0616": {
			"y": "祭祀.作灶.余事勿取.",
			"j": "开市.安葬.破土.修坟.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0617": {
			"y": "祭祀.祈福.求嗣.斋醮.安香.解除.移徙.入宅.会亲友.求医.治病.动土.破土.开生坟.合寿木.",
			"j": "合帐.上梁.经络.安葬.入殓.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0618": {
			"y": "嫁娶.冠笄.修造.动土.作灶.移徙.入宅.补垣.塞穴.纳畜.牧养.架马.修造.动土.起基.定磉.开池.造船.",
			"j": "祈福.开光.掘井.开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0619": {
			"y": "祭祀.交易.纳财.",
			"j": "斋醮.开渠.上梁.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0620": {
			"y": "嫁娶.订盟.纳采.冠笄.会亲友.安机械.造车器.祭祀.出行.纳财.入宅.安香.出火.入学.塑绘.开光.拆卸.起基.修造.动土.牧养.栽种.安门.作厕.",
			"j": "行丧.伐木.作梁.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0624": {
			"y": "祭祀.沐浴.捕捉.结网.畋猎.取渔.余事勿取.",
			"j": "开市.交易.嫁娶.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0625": {
			"y": "破屋.坏垣.求医.治病.畋猎.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0626": {
			"y": "嫁娶.出行.安机械.祭祀.塑绘.开光.治病.经络.安床.结网.塞穴.破土.入殓.",
			"j": "开市.安门.掘井.作灶.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0627": {
			"y": "订盟.纳采.会亲友.进人口.雕刻.拆卸.修造.动土.起基.开市.栽种.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.",
			"j": "",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0628": {
			"y": "祭祀.捕捉.取渔.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0629": {
			"y": "嫁娶.纳采.祭祀.祈福.求医.治病.出行.动土.移徙.入宅.",
			"j": "开市.安门.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0630": {
			"y": "裁衣.作灶.移徙.入宅.纳畜.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0728": {
			"y": "塑绘.出行.冠笄.嫁娶.进人口.裁衣.纳婿.造畜椆栖.交易.立券.牧养.开生坟.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0831": {
			"y": "嫁娶.祭祀.祈福.斋醮.作灶.移徙.入宅.",
			"j": "动土.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0701": {
			"y": "祭祀.入殓.移柩.启攒.安葬.",
			"j": "上梁.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0702": {
			"y": "订盟.纳采.出行.祈福.斋醮.安床.会亲友.",
			"j": "移徙.入宅.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0703": {
			"y": "嫁娶.纳采.出行.求医.治病.开市.移徙.入宅.启攒.安葬.",
			"j": "动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0704": {
			"y": "嫁娶.祭祀.沐浴.扫舍.修饰垣墙.",
			"j": "行丧.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0705": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0706": {
			"y": "订盟.纳采.出行.祭祀.祈福.修造.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0707": {
			"y": "祭祀.祈福.解除.整手足甲.安床.沐浴.入殓.移柩.破土.启攒.安葬.谢土.",
			"j": "嫁娶.斋醮.开市.出火.入宅.移徙.出行.作灶.安门.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0708": {
			"y": "破屋.坏垣.解除.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0709": {
			"y": "嫁娶.开市.立券.移徙.入宅.安机械.会亲友.经络.安门.安床.挂匾.拆卸.开仓.出货财.开池.栽种.纳畜.牧养.破土.安葬.启攒.移柩.入殓.立碑.",
			"j": "祭祀.祈福.探病.谢土.造桥.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0710": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.斋醮.开光.会亲友.求医.治病.造屋.起基.竖柱.上梁.安门.安碓硙.筑堤.开池.破土.安葬.除服.成服.",
			"j": "入宅.开市.掘井.词讼.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0711": {
			"y": "纳采.订盟.嫁娶.移徙.入宅.出行.祭祀.祈福.斋醮.塑绘.开光.安香.出火.会亲友.解除.入学.竖柱.上梁.拆卸.造屋.起基.栽种.牧养.纳畜.",
			"j": "安葬.破土.开市.开仓.出货财.启攒.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0712": {
			"y": "纳采.订盟.嫁娶.祭祀.沐浴.塑绘.开光.出火.治病.习艺.伐木.造屋.竖柱.上梁.安床.作灶.安碓硙.挂匾.掘井.纳畜.",
			"j": "出行.安葬.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0713": {
			"y": "祭祀.入殓.除服.成服.移柩.破土.启攒.安葬.塞穴.断蚁.结网.",
			"j": "开市.入宅.嫁娶.开光.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0714": {
			"y": "祭祀.修造.出行.造屋.竖柱.造车器.教牛马.造畜椆栖.割蜜.",
			"j": "动土.破土.掘井.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0715": {
			"y": "祭祀.沐浴.塑绘.开光.入学.解除.扫舍.治病.开池.牧养.",
			"j": "嫁娶.出行.纳采.入宅.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0716": {
			"y": "纳财.开市.交易.立券.出行.祭祀.祈福.求嗣.开光.解除.扫舍.起基.竖柱.安床.移徙.开仓.出货财.补垣.塞穴.栽种.纳畜.牧养.",
			"j": "斋醮.入宅.安门.安葬.破土.行丧.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0717": {
			"y": "祭祀.修饰垣墙.平治道涂.",
			"j": "开市.动土.破土.嫁娶.修造.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0718": {
			"y": "订盟.纳采.祭祀.祈福.开光.安香.出火.立券.安机械.移徙.入宅.竖柱.上梁.会亲友.安床.拆卸.挂匾.牧养.教牛马.",
			"j": "嫁娶.安葬.行丧.破土.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0719": {
			"y": "沐浴.理发.捕捉.入殓.移柩.破土.启攒.安葬.",
			"j": "出火.嫁娶.入宅.作灶.破土.上梁.动土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0720": {
			"y": "求医.治病.破屋.坏垣.余事勿取.",
			"j": "嫁娶.出行.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0721": {
			"y": "纳采.订盟.嫁娶.移徙.入宅.出行.开市.交易.立券.纳财.会亲友.安香.出火.拆卸.造屋.起基.安床.作灶.挂匾.安葬.破土.启攒.立碑.入殓.移柩.",
			"j": "祈福.上梁.开仓.掘井.牧养.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0722": {
			"y": "祭祀.祈福.斋醮.出行.纳采.订盟.安机械.出火.拆卸.修造.动土.起基.移徙.入宅.造庙.入殓.除服.成服.移柩.破土.安葬.谢土.",
			"j": "嫁娶.开市.栽种.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0723": {
			"y": "祭祀.进人口.纳财.纳畜.牧养.捕捉.余事勿取.",
			"j": "开市.入宅.安床.动土.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0724": {
			"y": "祭祀.塑绘.开光.求医.治病.嫁娶.会亲友.放水.掘井.牧养.纳畜.开渠.安碓硙.",
			"j": "造屋.入宅.作灶.入学.安葬.行丧.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0725": {
			"y": "祭祀.塞穴.结网.畋猎.余事勿取.",
			"j": "移徙.开市.入宅.嫁娶.开光.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0726": {
			"y": "开市.纳财.祭祀.塑绘.安机械.冠笄.会亲友.裁衣.开仓.经络.纳畜.造畜椆栖.教牛马.牧养.",
			"j": "动土.破土.安葬.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0727": {
			"y": "移徙.入宅.治病.会亲友.祭祀.祈福.斋醮.安香.移徙.嫁娶.造屋.起基.",
			"j": "开市.斋醮.安床.出行.经络.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0729": {
			"y": "祭祀.冠笄.嫁娶.捕捉.结网.畋猎.取渔.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0730": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0801": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0802": {
			"y": "嫁娶.纳采.开市.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "祭祀.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0803": {
			"y": "嫁娶.纳采.开市.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "赴任.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0804": {
			"y": "祭祀.作灶.纳财.捕捉.",
			"j": "开市.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0805": {
			"y": "嫁娶.开市.立券.祭祀.祈福.动土.移徙.入宅.",
			"j": "造庙.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0806": {
			"y": "补垣.塞穴.结网.入殓.除服.成服.移柩.安葬.启攒.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0807": {
			"y": "祭祀.出行.作梁.出火.拆卸.修造.动土.起基.安床.补垣.塞穴.入殓.破土.安葬.移柩.造畜椆栖.",
			"j": "嫁娶.入宅.斋醮.开光.针灸.掘井.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0808": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.出行.解除.竖柱.入宅.移徙.纳财.上梁.纳畜.入殓.安葬.启攒.",
			"j": "栽种.掘井.动土.安床.破土.置产.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0809": {
			"y": "解除.祭祀.祈福.求嗣.修造.动土.竖柱.上梁.安床.纳畜.造屋.合脊.起基.入殓.破土.安葬.",
			"j": "出火.嫁娶.开光.进人口.出行.词讼.开市.入宅.移徙.赴任.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0810": {
			"y": "沐浴.理发.会亲友.塑绘.开光.栽种.牧养.嫁娶.经络.补垣.塞穴.",
			"j": "开市.入宅.动土.破土.安葬.作灶.上梁.安床.开仓.祈福.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0811": {
			"y": "祭祀.理发.作灶.沐浴.修饰垣墙.平治道涂.",
			"j": "嫁娶.栽种.祈福.造桥.安葬.安门.伐木.作梁.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0812": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.斋醮.普渡.移徙.入宅.出行.安机械.开光.修造.动土.竖柱.上梁.造屋.起基.定磉.安门.安葬.破土.",
			"j": "开市.立券.置产.作灶.造桥.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0813": {
			"y": "祭祀.普渡.捕捉.解除.结网.畋猎.入殓.破土.安葬.",
			"j": "开市.交易.入宅.嫁娶.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0814": {
			"y": "沐浴.破屋.坏垣.余事勿取.",
			"j": "斋醮.开市.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0815": {
			"y": "订盟.纳采.祭祀.祈福.安香.出火.开市.立券.入宅.挂匾.造桥.启攒.安葬.",
			"j": "动土.破土.嫁娶.掘井.安床.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0816": {
			"y": "嫁娶.祭祀.祈福.斋醮.普渡.移徙.入宅.动土.治病.开市.交易.立券.开光.修造.造车器.安香.安床.捕捉.畋猎.结网.",
			"j": "纳采.订盟.经络.行丧.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0817": {
			"y": "嫁娶.订盟.纳采.作灶.冠笄.裁衣.会亲友.纳畜.牧养.安机械.开市.立券.纳财.安床.",
			"j": "掘井.出行.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0818": {
			"y": "嫁娶.订盟.纳采.祭祀.斋醮.普渡.解除.出行.会亲友.开市.纳财.修造.动土.竖柱.上梁.开光.开仓.出货财.纳畜.牧养.开池.破土.启攒.",
			"j": "出火.入宅.造屋.安门.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0819": {
			"y": "嫁娶.普渡.祭祀.祈福.补垣.塞穴.断蚁.筑堤.入殓.除服.成服.安葬.",
			"j": "动土.破土.掘井.开光.上梁.词讼.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0820": {
			"y": "嫁娶.冠笄.祭祀.沐浴.普渡.出行.纳财.扫舍.纳畜.赴任.",
			"j": "开市.动土.破土.安床.开仓.上梁.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0821": {
			"y": "祭祀.沐浴.理发.整手足甲.冠笄.解除.入殓.移柩.破土.启攒.安葬.",
			"j": "嫁娶.出行.入宅.开市.安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0822": {
			"y": "塑绘.冠笄.嫁娶.会亲友.进人口.经络.裁衣.栽种.纳畜.牧养.补垣.塞穴.捕捉.",
			"j": "祈福.开市.动土.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0823": {
			"y": "出行.沐浴.订盟.纳采.裁衣.竖柱.上梁.移徙.纳畜.牧养.",
			"j": "嫁娶.安门.动土.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0824": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.普渡.开光.安香.出火.移徙.入宅.竖柱.修造.动土.竖柱.上梁.起基.造屋.安门.造庙.造桥.破土.启攒.安葬.",
			"j": "开市.立券.纳财.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0825": {
			"y": "祭祀.捕捉.畋猎.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.启攒.",
			"j": "嫁娶.纳采.订盟.开市.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0826": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "行丧.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0827": {
			"y": "祈福.斋醮.出行.冠笄.嫁娶.雕刻.开柱眼.入宅.造桥.开市.交易.立券.纳财.入殓.除服.成服.移柩.破土.安葬.启攒.",
			"j": "动土.破土.订盟.安床.开池.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0828": {
			"y": "祈福.求嗣.解除.订盟.纳采.动土.起基.放水.造仓.开市.纳畜.牧养.开生坟.入殓.除服.成服.移柩.破土.安葬.",
			"j": "",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0829": {
			"y": "塑绘.开光.解除.订盟.纳采.嫁娶.出火.修造.动土.移徙.入宅.拆卸.起基.安门.分居.开市.交易.立券.纳财.纳畜.牧养.",
			"j": "",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0830": {
			"y": "祈福.出行.订盟.纳采.嫁娶.裁衣.动土.安床.放水.开市.掘井.交易.立券.栽种.开渠.除服.成服.移柩.破土.",
			"j": "",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0921": {
			"y": "订盟.纳采.祭祀.祈福.安香.出火.修造.动土.上梁.安门.起基.竖柱.上梁.定磉.开池.移徙.入宅.立券.破土.",
			"j": "嫁娶.造庙.造桥.造船.作灶.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0925": {
			"y": "祭祀.出行.解除.冠笄.嫁娶.伐木.架马.开柱眼.修造.动土.移徙.入宅.开生坟.合寿木.入殓.移柩.破土.安葬.修坟.",
			"j": "开光.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0930": {
			"y": "祭祀.会亲友.纳采.嫁娶.开光.塑绘.斋醮.安香.开市.立券.除服.成服.入殓.移柩.安葬.赴任.进人口.出行.裁衣.修造.动土.上梁.经络.交易.",
			"j": "入宅.伐木.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0926": {
			"y": "祭祀.祈福.求嗣.出行.沐浴.交易.扫舍.教牛马.",
			"j": "动土.作灶.行丧.安葬.修坟.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0920": {
			"y": "余事勿取.",
			"j": "探病.余事勿取.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1031": {
			"y": "祭祀.祈福.斋醮.沐浴.竖柱.订盟.纳采.嫁娶.拆卸.入宅.移柩.启攒.谢土.赴任.出火.纳畜.",
			"j": "作灶.入殓.安葬.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0901": {
			"y": "嫁娶.出行.纳畜.祭祀.入殓.启攒.安葬.",
			"j": "作灶.动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0902": {
			"y": "订盟.纳采.祭祀.祈福.修造.动土.上梁.破土.安葬.",
			"j": "嫁娶.开市.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0903": {
			"y": "订盟.纳采.出行.会亲友.修造.上梁.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0904": {
			"y": "沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.祈福.余事勿取.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0905": {
			"y": "嫁娶.祭祀.祈福.斋醮.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0906": {
			"y": "捕捉.结网.入殓.破土.安葬.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0907": {
			"y": "沐浴.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0908": {
			"y": "破屋.坏垣.求医.治病.余事勿取.",
			"j": "移徙.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0909": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.出行.出火.拆卸.修造.动土.进人口.入宅.移徙.安床.上梁.合脊.放水.掘井.破土.移柩.谢土.除服.成服.",
			"j": "开市.开仓.安门.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0910": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.开光.解除.进人口.入宅.移徙.出火.安床.开市.交易.立券.挂匾.",
			"j": "安葬.纳畜.出行.行丧.伐木.栽种.造庙.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0911": {
			"y": "祭祀.冠笄.捕捉.余事勿取.",
			"j": "嫁娶.开市.造屋.作梁.合寿木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0912": {
			"y": "祭祀.解除.结网.畋猎.取渔.会亲友.入学.移柩.启攒.除服.成服.",
			"j": "开市.祈福.动土.破土.入殓.安葬.造船.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0913": {
			"y": "冠笄.沐浴.出行.修造.动土.移徙.入宅.破土.安葬.",
			"j": "嫁娶.开市.祭祀.祈福.斋醮.纳采.修坟.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0914": {
			"y": "祭祀.出行.",
			"j": "嫁娶.入宅.修造.动土.会亲友.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0915": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.修造.动土.移徙.入宅.",
			"j": "针灸.伐木.作梁.造庙.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0916": {
			"y": "出行.开市.交易.立券.安机械.出火.上梁.移徙.",
			"j": "嫁娶.安葬.动土.造桥.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0917": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "斋醮.嫁娶.移徙.出行.上梁.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0918": {
			"y": "嫁娶.造车器.安机械.祭祀.祈福.开光.安香.出火.出行.开市.立券.修造.动土.移徙.入宅.破土.安葬.",
			"j": "纳采.订盟.架马.词讼.开渠.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0919": {
			"y": "沐浴.捕捉.入殓.除服.成服.破土.启攒.安葬.",
			"j": "祭祀.嫁娶.安床.开市.入宅.探病.上梁.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0922": {
			"y": "开光.求嗣.雕刻.嫁娶.订盟.纳采.出火.拆卸.修造.动土.起基.上梁.放水.移徙.入宅.造仓.造船.开市.开池.纳畜.牧养.挂匾.",
			"j": "行丧.安葬.合寿木.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0923": {
			"y": "祭祀.嫁娶.捕捉.",
			"j": "开光.动土.破土.开市.修造.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0924": {
			"y": "祭祀.普渡.解除.会亲友.捕捉.畋猎.启攒.除服.成服.移柩.",
			"j": "嫁娶.开市.动土.掘井.开池.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0927": {
			"y": "出行.解除.纳采.冠笄.雕刻.修造.动土.起基.上梁.合脊.安床.移徙.入宅.开市.栽种.作厕.",
			"j": "造庙.安门.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0928": {
			"y": "祭祀.沐浴.解除.理发.冠笄.安机械.作灶.造仓.开市.开池.作厕.补垣.塞穴.断蚁.结网.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0929": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1021": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.置产.求医.治病.开市.交易.立券.会亲友.移徙.竖柱.上梁.造屋.合脊.安门.放水.捕捉.纳畜.",
			"j": "造庙.造船.动土.破土.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1029": {
			"y": "祭祀.塑绘.开光.祈福.斋醮.出行.订盟.纳采.裁衣.嫁娶.拆卸.修造.安床.入宅.安香.入殓.启攒.安葬.谢土.赴任.会亲友.进人口.出行.移徙.上梁.经络.开市.交易.立券.纳财.",
			"j": "开仓.冠笄.伐木.作梁.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1024": {
			"y": "祭祀.造畜椆栖.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.开市.安床.掘井.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1014": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.斋醮.开光.安香.出火.造庙.移徙.出行.入宅.造庙.起基.竖柱.上梁.安床.纳畜.捕捉.纳婿.安葬.",
			"j": "开市.破土.掘井.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1011": {
			"y": "纳采.订盟.开市.交易.立券.会亲友.纳畜.牧养.问名.移徙.解除.作厕.入学.起基.安床.开仓.出货财.安葬.启攒.入殓.除服.成服.",
			"j": "入宅.上梁.斋醮.出火.谢土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1022": {
			"y": "出行.造车器.造畜椆栖.解除.冠笄.裁衣.作梁.雕刻.会亲友.移徙.入宅.安机械.造畜椆栖.开市.扫舍.",
			"j": "嫁娶.动土.破土.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1027": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1017": {
			"y": "造车器.嫁娶.订盟.纳采.会亲友.祭祀.出行.开市.立券.移徙.入宅.破土.安葬.",
			"j": "上梁.开光.造屋.架马.合寿木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1129": {
			"y": "理发.会亲友.补垣.塞穴.结网.",
			"j": "嫁娶.入宅.安门.移徙.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1001": {
			"y": "祭祀.冠笄.会亲友.拆卸.起基.除服.成服.移柩.启攒.安葬.沐浴.捕捉.开光.塑绘.",
			"j": "作灶.祭祀.入宅.嫁娶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1002": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "移徙.入宅.出行.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1003": {
			"y": "祭祀.塑绘.开光.出行.解除.订盟.嫁娶.拆卸.起基.安床.入宅.开市.入殓.除服.成服.移柩.破土.谢土.挂匾.开柱眼.交易.",
			"j": "造桥.冠笄.造屋.掘井.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1004": {
			"y": "祭祀.赴任.动土.上梁.开光.塑绘.冠笄.拆卸.起基.安床.开市.立券.赴任.经络.",
			"j": "定磉.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1005": {
			"y": "祭祀.裁衣.冠笄.嫁娶.纳婿.会亲友.除服.成服.移柩.捕捉.进人口.入殓.",
			"j": "移徙.入宅.作灶.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1006": {
			"y": "祭祀.诸事不宜.",
			"j": "入殓.安葬.开市.交易.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1007": {
			"y": "祭祀.裁衣.冠笄.嫁娶.安机械.拆卸.动土.起基.移徙.入宅.入殓.启攒.安葬.造仓.经络.",
			"j": "安床.开光.开市.交易.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1008": {
			"y": "嫁娶.裁衣.冠笄.合帐.祭祀.出行.安床.移徙.塞穴.入殓.破土.移柩.安葬.",
			"j": "开市.出行.栽种.置产.词讼.安门.掘井.开光.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1009": {
			"y": "祭祀.造车器.出行.修造.上梁.造屋.安门.安床.造畜椆栖.教牛马.",
			"j": "出货财.开仓.动土.破土.安葬.行丧.伐木.开渠.栽种.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1010": {
			"y": "祭祀.开光.出行.解除.伐木.作梁.出火.拆卸.入宅.移徙.安床.修造.造畜椆栖.扫舍.",
			"j": "造庙.嫁娶.掘井.栽种.造桥.作灶.动土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1012": {
			"y": "祭祀.平治道涂.余事勿取.",
			"j": "嫁娶.开市.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1013": {
			"y": "捕捉.畋猎.余事勿取.",
			"j": "开市.交易.祭祀.入宅.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1015": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "开市.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1016": {
			"y": "订盟.纳采.会亲友.交易.立券.纳财.栽种.纳畜.牧养.",
			"j": "嫁娶.开市.入宅.祈福.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1018": {
			"y": "祭祀.作灶.纳财.捕捉.畋猎.余事勿取.",
			"j": "动土.破土.开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1019": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.求医.治病.出火.移徙.入宅.",
			"j": "开市.开仓.出货财.安床.安门.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1020": {
			"y": "冠笄.祭祀.沐浴.作灶.理发.整手足甲.扫舍.补垣.塞穴.入殓.破土.启攒.",
			"j": "开光.嫁娶.会亲友.栽种.针灸.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1023": {
			"y": "沐浴.理发.冠笄.安床.开市.立券.会亲友.交易.纳财.结网.教牛马.",
			"j": "移徙.入宅.出行.祈福.嫁娶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1025": {
			"y": "捕捉.结网.入殓.除服.成服.移柩.破土.安葬.启攒.立碑.",
			"j": "嫁娶.祭祀.入宅.造屋.移徙.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1026": {
			"y": "祭祀.祈福.求嗣.斋醮.造庙.出火.安机械.会亲友.开市.交易.立券.纳财.习艺.经络.求医.治病.开池.作厕.畋猎.结网.栽种.牧养.安葬.破土.启攒.",
			"j": "开光.嫁娶.掘井.伐木.作梁.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1028": {
			"y": "会亲友.嫁娶.订盟.纳采.纳婿.拆卸.修造.动土.起基.竖柱.上梁.安床.会亲友.纳财.",
			"j": "出行.祈福.安葬.作灶.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1030": {
			"y": "祭祀.作灶.入殓.除服.成服.畋猎.",
			"j": "栽种.动土.安葬.开市.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1121": {
			"y": "破屋.坏垣.祭祀.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1229": {
			"y": "祭祀.祈福.斋醮.出行.冠笄.安机械.移徙.入宅.安香.安床.除服.成服.移柩.启攒.",
			"j": "开光.栽种.治病.安门.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1101": {
			"y": "嫁娶.祭祀.安机械.入殓.破土.安葬.",
			"j": "动土.上梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1102": {
			"y": "作灶.造畜椆栖.",
			"j": "行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1103": {
			"y": "沐浴.理发.入学.习艺.进人口.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1104": {
			"y": "开光.针灸.会亲友.启攒.安葬.",
			"j": "开市.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1105": {
			"y": "祭祀.结网.造畜椆栖.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1106": {
			"y": "入殓.除服.成服.移柩.破土.启攒.安葬.",
			"j": "移徙.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1107": {
			"y": "嫁娶.纳采.订盟.祭祀.斋醮.开光.安香.出火.出行.出火.拆卸.动土.祈福.进人口.纳财.交易.立券.移徙.安床.修造.安葬.除服.成服.",
			"j": "置产.掘井.词讼.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1108": {
			"y": "嫁娶.纳采.订盟.祭祀.开光.出行.解除.伐木.出火.入宅.移徙.拆卸.修造.栽种.安葬.入殓.",
			"j": "破土.动土.安门.作灶.开市.交易.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1109": {
			"y": "祭祀.解除.破屋.坏垣.求医.治病.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1110": {
			"y": "祭祀.扫舍.破土.安葬.除服.成服.启攒.移柩.入殓.立碑.余事勿取.",
			"j": "祭祀.嫁娶.入宅.修造.动土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1111": {
			"y": "订盟.纳采.会亲友.祭祀.祈福.修造.动土.安机械.破土.安葬.",
			"j": "嫁娶.移徙.出火.开市.入宅.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1112": {
			"y": "祭祀.沐浴.捕捉.畋猎.结网.扫舍.",
			"j": "嫁娶.纳采.订盟.安床.动土.破土.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1113": {
			"y": "开市.纳财.出行.祭祀.祈福.求嗣.斋醮.问名.入学.起基.定磉.置产.开渠.掘井.拆卸.栽种.纳畜.牧养.动土.破土.启攒.",
			"j": "移徙.入宅.出火.入殓.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d1114": {
			"y": "祭祀.理发.置产.塞穴.除服.成服.移柩.入殓.破土.安葬.",
			"j": "嫁娶.入宅.安床.掘井.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1115": {
			"y": "祭祀.沐浴.出行.余事勿取.",
			"j": "开市.动土.破土.行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1116": {
			"y": "嫁娶.造车器.出行.会亲友.移徙.入宅.修造.动土.雕刻.开光.安香.出火.理发.会亲友.造屋.合脊.起基.归岫.安门.拆卸.扫舍.栽种.造畜椆栖.",
			"j": "开市.纳采.造庙.安床.开渠.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1117": {
			"y": "塑绘.会亲友.安机械.塞穴.结网.裁衣.经络.",
			"j": "嫁娶.开市.祈福.斋醮.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1118": {
			"y": "纳采.移徙.纳财.开市.交易.立券.纳财.入宅.修造.动土.竖柱.起基.定磉.造庙.安香.出火.修饰垣墙.平治道涂.会亲友.出行.开池.作厕.",
			"j": "开仓.造屋.造桥.祭祀.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1119": {
			"y": "订盟.纳采.纳财.开市.立券.祭祀.祈福.移徙.入宅.出行.造屋.起基.修造.动土.竖柱.上梁.安门.安香.出火.教牛马.会亲友.破土.",
			"j": "嫁娶.安葬.掘井.置产.造船.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1120": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.塑绘.开光.移徙.安床.伐木.作梁.捕捉.畋猎.结网.求医.治病.解除.安葬.除服.成服.移柩.入殓.立碑.谢土.",
			"j": "开市.造庙.动土.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1122": {
			"y": "嫁娶.纳采.订盟.祭祀.冠笄.裁衣.伐木.作梁.架马.定磉.开柱眼.作灶.移徙.安床.畋猎.结网.开池.作厕.除服.成服.启攒.入殓.移柩.安葬.",
			"j": "造屋.造船.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1123": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.斋醮.开光.会亲友.解除.入学.纳财.交易.立券.经络.起基.动土.定磉.开池.栽种.纳畜.牧养.破土.入殓.立碑.安葬.",
			"j": "嫁娶.开市.入宅.出火.移徙.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1124": {
			"y": "捕捉.畋猎.会亲友.解除.入殓.除服.成服.移柩.余事勿取.",
			"j": "安床.安门.破土.修坟.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1125": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.冠笄.出行.理发.拆卸.解除.起基.动土.定磉.安碓硙.开池.掘井.扫舍.除服.成服.移柩.启攒.立碑.谢土.",
			"j": "移徙.入宅.安门.作梁.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1126": {
			"y": "嫁娶.冠笄.安床.纳采.会亲友.塞穴.捕捉.置产.造畜椆栖.",
			"j": "开光.掘井.安葬.谢土.修坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1127": {
			"y": "祭祀.沐浴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1128": {
			"y": "祭祀.会亲友.嫁娶.沐浴.修造.动土.祈福.开光.塑绘.出行.订盟.纳采.裁衣.入殓.除服.成服.移柩.启攒.赴任.竖柱.上梁.纳财.扫舍.栽种.纳畜.伐木.",
			"j": "入宅.作灶.安床.开仓.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1130": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.拆卸.修造.动土.起基.安床.移徙.入宅.安香.除服.成服.入殓.移柩.安葬.谢土.赴任.会亲友.进人口.出行.竖柱.上梁.经络.开市.交易.立券.纳财.开仓.",
			"j": "作灶.治病.伐木.作梁.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1226": {
			"y": "塑绘.开光.订盟.纳采.裁衣.冠笄.拆卸.修造.安床.入宅.出火.安葬.谢土.赴任.",
			"j": "掘井.伐木.斋醮.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1206": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1216": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "嫁娶.移徙.入宅.探病.出行.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1227": {
			"y": "祭祀.塑绘.开光.裁衣.冠笄.嫁娶.纳采.拆卸.修造.动土.竖柱.上梁.安床.移徙.入宅.安香.结网.捕捉.畋猎.伐木.进人口.放水.",
			"j": "出行.安葬.修坟.开市.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1207": {
			"y": "祭祀.沐浴.理发.纳财.进人口.栽种.扫舍.捕捉.畋猎.结网.",
			"j": "会亲友.安葬.入宅.移徙.安床.开市.行丧.出火.作灶.安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1222": {
			"y": "合帐.裁衣.教牛马.余事勿取.",
			"j": "入宅.动土.破土.嫁娶.作灶.造船.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1217": {
			"y": "冠笄.纳财.掘井.开池.出火.安床.交易.立券.畋猎.结网.理发.放水.",
			"j": "安门.动土.破土.行丧.安葬.成服.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1209": {
			"y": "入宅.移徙.出行.进人口.修造.动土.起基.上梁.安门.造仓.补垣.塞穴.造畜椆栖.",
			"j": "嫁娶.开市.安床.栽种.安葬.祈福.开光.掘井.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1220": {
			"y": "祈福.斋醮.纳采.订盟.解除.架马.开柱眼.修造.动土.起基.上梁.归岫.造屋.合脊.掘井.除服.成服.破土.栽种.",
			"j": "移徙.开市.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1228": {
			"y": "祭祀.求医.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1201": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.拆卸.修造.动土.起基.安床.移徙.入宅.安香.入殓.移柩.安葬.谢土.赴任.进人口.会亲友.",
			"j": "作灶.治病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1202": {
			"y": "祭祀.塑绘.开光.订盟.纳采.嫁娶.安床.进人口.入殓.除服.成服.移柩.启攒.安葬.立碑.",
			"j": "开市.交易.破土.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1203": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1204": {
			"y": "祭祀.解除.祈福.开光.塑绘.斋醮.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.入殓.除服.成服.移柩.启攒.安床.赴任.出行.移徙.竖柱.上梁.伐木.栽种.破土.安葬.纳畜.",
			"j": "造屋.治病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1205": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.合帐.冠笄.安机械.安床.造畜椆栖.入殓.移柩.启攒.安葬.谢土.除服.成服.会亲友.竖柱.上梁.经络.开市.交易.立券.纳财.纳畜.筑堤.",
			"j": "嫁娶.入宅.治病.赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1208": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.塑绘.解除.拆卸.修造.动土.竖柱.上梁.安门.置产.开池.掘井.纳畜.安床.栽种.造畜椆栖.破土.移柩.立碑.",
			"j": "嫁娶.开市.出火.进人口.入殓.赴任.入宅.移徙.出行.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1210": {
			"y": "造畜椆栖.教牛马.",
			"j": "入宅.移徙.分居.作灶.出火.安香.动土.嫁娶.掘井.扫舍.造桥.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1211": {
			"y": "订盟.纳采.造车器.祭祀.祈福.出行.安香.修造.动土.上梁.开市.交易.立券.移徙.入宅.会亲友.安机械.栽种.纳畜.造屋.起基.安床.造畜椆栖.",
			"j": "破土.安葬.行丧.开生坟.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1212": {
			"y": "订盟.纳采.会亲友.安机械.开光.修造.动土.竖柱.上梁.造屋.起基.造桥.栽种.纳畜.造畜椆栖.移柩.入殓.启攒.修坟.立碑.安葬.",
			"j": "祈福.出火.嫁娶.入宅.开市.动土.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1213": {
			"y": "祭祀.平治道涂.修坟.除服.成服.余事勿取.",
			"j": "移徙.入宅.嫁娶.掘井.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1214": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.雕刻.开光.安香.出行.入学.修造.动土.竖柱.上梁.造屋.起基.安门.出火.移徙.入宅.掘井.造畜椆栖.安葬.破土.除服.成服.",
			"j": "开市.纳采.订盟.作灶.造庙.造船.经络.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1215": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求嗣.斋醮.安香.出火.修造.起基.造屋.合脊.安门.安碓硙.动土.上梁.移徙.入宅.",
			"j": "出行.掘井.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1218": {
			"y": "纳采.订盟.移徙.入宅.出行.安机械.会亲友.祭祀.祈福.斋醮.开光.安香.出火.解除.求医.针灸.治病.造屋.起基.修造.安门.造船.纳畜.牧养.移柩.入殓.启攒.谢土.修坟.立碑.",
			"j": "嫁娶.动土.安床.造桥.掘井.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1219": {
			"y": "祭祀.沐浴.作灶.纳财.捕捉.畋猎.安床.扫舍.",
			"j": "开市.斋醮.破土.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1221": {
			"y": "纳采.订盟.祭祀.沐浴.冠笄.合帐.裁衣.修造.动土.拆卸.移徙.入宅.安门.开仓.筑堤.作厕.栽种.纳畜.补垣.塞穴.",
			"j": "嫁娶.祈福.开光.掘井.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1223": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.安香.出火.出行.会亲友.经络.求医.治病.解除.拆卸.起基.修造.动土.定磉.扫舍.栽种.牧养.造畜椆栖.",
			"j": "斋醮.作梁.掘井.行丧.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1224": {
			"y": "纳财.开市.交易.立券.会亲友.进人口.经络.祭祀.祈福.安香.出火.求医.治病.修造.动土.拆卸.扫舍.安床.栽种.牧养.开生坟.合寿木.入殓.安葬.启攒.",
			"j": "嫁娶.祈福.出火.移徙.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1225": {
			"y": "祭祀.入殓.移柩.余事勿取.",
			"j": "入宅.修造.动土.破土.安门.上梁.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1230": {
			"y": "塑绘.斋醮.出行.拆卸.解除.修造.移徙.造船.入殓.除服.成服.移柩.启攒.修坟.立碑.谢土.",
			"j": "",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1231": {
			"y": "祭祀.沐浴.安床.纳财.畋猎.捕捉.",
			"j": "开市.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		}
	};


/***/ },
/* 22 */
/***/ function(module, exports) {

	window.HuangLi = window.HuangLi || {};
	HuangLi.y2019 = {
		"d0101": {
			"y": "订盟.纳采.祭祀.祈福.修造.动土.上梁.破土.",
			"j": "嫁娶.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0201": {
			"y": "会亲友.纳采.进人口.修造.动土.竖柱.上梁.祭祀.开光.塑绘.祈福.斋醮.嫁娶.安床.移徙.入宅.安香.纳畜.",
			"j": "出行.治病.安葬.开市.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0102": {
			"y": "出行.沐浴.理发.补垣.塞穴.",
			"j": "入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0103": {
			"y": "教牛马.余事勿取.",
			"j": "入宅.动土.破土.余事勿取.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0104": {
			"y": "嫁娶.出行.求医.治病.祭祀.祈福.上梁.纳畜.",
			"j": "开市.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0105": {
			"y": "嫁娶.开光.解除.出火.拆卸.修造.进人口.入宅.移徙.安床.栽种.入殓.修坟.动土.除服.成服.",
			"j": "作灶.安葬.祭祀.开市.纳采.订盟.纳畜.谢土.出行.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0106": {
			"y": "出行.起基.安床.纳财.交易.立券.嫁娶.栽种.入殓.移柩.安葬.",
			"j": "挂匾.入宅.上梁.祈福.词讼.作梁.作灶.开池.安门.动土.破土.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0107": {
			"y": "平治道涂.余事勿取.",
			"j": "开光.嫁娶.开仓.出货财.造船.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0108": {
			"y": "嫁娶.订盟.纳采.会亲友.祭祀.安机械.移徙.入宅.造屋.安床.起基.定磉.安香.出火.挂匾.拆卸.置产.",
			"j": "开市.出行.安葬.行丧.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0109": {
			"y": "沐浴.捕捉.畋猎.理发.整手足甲.入殓.除服.成服.破土.安葬.谢土.立碑.修坟.启攒.",
			"j": "纳采.订盟.嫁娶.上梁.开市.斋醮.造屋.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0110": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "斋醮.嫁娶.开市.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0111": {
			"y": "沐浴.开仓.出货财.开市.交易.立券.纳财.栽种.纳畜.牧养.畋猎.入殓.破土.安葬.",
			"j": "祈福.嫁娶.安床.入宅.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0112": {
			"y": "祭祀.沐浴.补垣.塞穴.断蚁.解除.余事勿取.",
			"j": "造庙.入宅.修造.安葬.行丧.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0113": {
			"y": "嫁娶.纳采.订盟.问名.祭祀.冠笄.裁衣.会亲友.进人口.纳财.捕捉.作灶.",
			"j": "开市.安床.安葬.修坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0114": {
			"y": "订盟.纳采.会亲友.祭祀.斋醮.沐浴.塑绘.出火.开光.竖柱.上梁.开市.交易.立券.作梁.开柱眼.伐木.架马.安门.安床.拆卸.牧养.造畜椆栖.掘井.",
			"j": "造庙.嫁娶.出行.动土.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0115": {
			"y": "交易.立券.纳财.安床.裁衣.造畜椆栖.安葬.谢土.启攒.除服.成服.修坟.立碑.移柩.入殓.",
			"j": "开光.嫁娶.开市.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0116": {
			"y": "祭祀.解除.教牛马.会亲友.余事勿取.",
			"j": "破土.动土.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0117": {
			"y": "纳采.订盟.移徙.纳财.开市.交易.立券.入宅.会亲友.解除.求医.治病.入学.安床.安门.安香.出火.拆卸.扫舍.入宅.挂匾.开生坟.合寿木.破土.修坟.启攒.入殓.",
			"j": "探病.祭祀.出行.上梁.造屋.谢土.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0118": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求嗣.会亲友.解除.出行.入学.纳财.开市.交易.立券.习艺.经络.安床.开仓.出货财.纳畜.安葬.启攒.修坟.入殓.",
			"j": "入宅.开光.开市.动土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0119": {
			"y": "祭祀.冠笄.嫁娶.会亲友.进人口.裁衣.结网.平治道涂.",
			"j": "移徙.入宅.造庙.作灶.治病.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0120": {
			"y": "祭祀.安碓硙.结网.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0121": {
			"y": "嫁娶.祭祀.沐浴.裁衣.出行.理发.移徙.捕捉.畋猎.放水.入宅.除服.成服.启攒.安葬.移柩.入殓.",
			"j": "造屋.开市.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0122": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "嫁娶.开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0123": {
			"y": "纳采.订盟.祭祀.求嗣.出火.塑绘.裁衣.会亲友.入学.拆卸.扫舍.造仓.挂匾.掘井.开池.结网.栽种.纳畜.破土.修坟.立碑.安葬.入殓.",
			"j": "祈福.嫁娶.造庙.安床.谢土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0124": {
			"y": "入殓.除服.成服.移柩.启攒.安葬.修坟.立碑.",
			"j": "开市.伐木.嫁娶.作梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0125": {
			"y": "祭祀.作灶.入殓.除服.余事勿取.",
			"j": "开市.安床.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0126": {
			"y": "塑绘.开光.沐浴.冠笄.会亲友.作灶.放水.造畜椆栖.",
			"j": "嫁娶.入殓.安葬.出行.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0127": {
			"y": "祭祀.沐浴.祈福.斋醮.订盟.纳采.裁衣.拆卸.起基.竖柱.上梁.安床.入殓.除服.成服.移柩.启攒.挂匾.求嗣.出行.合帐.造畜椆栖.",
			"j": "开仓.嫁娶.移徙.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0128": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0129": {
			"y": "沐浴.解除.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.移徙.入宅.除服.成服.移柩.破土.启攒.安葬.扫舍.修坟.伐木.纳财.交易.立券.",
			"j": "作灶.祭祀.上梁.出行.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0130": {
			"y": "出行.嫁娶.订盟.纳采.入殓.安床.启攒.安葬.祭祀.裁衣.会亲友.进人口.",
			"j": "作灶.掘井.谢土.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0131": {
			"y": "修饰垣墙.平治道涂.入殓.移柩.余事勿取.",
			"j": "嫁娶.移徙.入宅.开光.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0210": {
			"y": "纳采.会亲友.竖柱.上梁.立券.入殓.移柩.安葬.启攒.",
			"j": "祭祀.移徙.入宅.动土.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0218": {
			"y": "祭祀.结网.入殓.除服.成服.移柩.安葬.破土.",
			"j": "余事勿取.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0228": {
			"y": "求医.破屋.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0220": {
			"y": "祭祀.沐浴.开光.塑绘.祈福.求嗣.订盟.纳采.冠笄.裁衣.嫁娶.动土.除服.成服.移柩.破土.启攒.出行.安碓硙.放水.开市.立券.交易.",
			"j": "安葬.上梁.入宅.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0208": {
			"y": "纳采.嫁娶.祭祀.祈福.出行.开市.会亲友.动土.破土.启攒.",
			"j": "移徙.入宅.出火.安门.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0226": {
			"y": "塑绘.开光.酬神.斋醮.订盟.纳采.裁衣.合帐.拆卸.动土.上梁.安床.安香.造庙.挂匾.会亲友.进人口.出行.修造.纳财.伐木.放水.出火.纳畜.沐浴.安门.",
			"j": "造屋.栽种.安葬.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0216": {
			"y": "祭祀.沐浴.求医.治病.扫舍.破屋.坏垣.解除.余事勿取.",
			"j": "入宅.开市.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0227": {
			"y": "祭祀.祈福.酬神.订盟.纳采.冠笄.裁衣.合帐.嫁娶.安床.移徙.入宅.安香.入殓.移柩.启攒.安葬.解除.取渔.捕捉.伐木.安门.出火.",
			"j": "栽种.动土.开市.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0217": {
			"y": "祭祀.冠笄.嫁娶.拆卸.修造.动土.起基.上梁.造屋.入宅.开市.开池.塞穴.入殓.除服.成服.移柩.安葬.破土.",
			"j": "安床.栽种.治病.作灶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0207": {
			"y": "纳采.祭祀.祈福.出行.会亲友.修造.动土.移徙.入宅.",
			"j": "嫁娶.开市.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0206": {
			"y": "塞穴.结网.取渔.畋猎.",
			"j": "嫁娶.安门.移徙.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0331": {
			"y": "祈福.开光.塑绘.酬神.订盟.纳采.裁衣.安床.开市.立券.入殓.除服.成服.移柩.启攒.安葬.立碑.赴任.会亲友.出行.交易.竖柱.",
			"j": "作灶.掘井.动土.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0202": {
			"y": "祭祀.会亲友.出行.订盟.纳采.沐浴.修造.动土.祈福.斋醮.嫁娶.拆卸.安床.入殓.移柩.安葬.谢土.赴任.裁衣.竖柱.上梁.伐木.捕捉.栽种.破土.安门.",
			"j": "造屋.开市.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0203": {
			"y": "解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0204": {
			"y": "祭祀.沐浴.解除.理发.扫舍.破屋.坏垣.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0205": {
			"y": "纳采.订盟.祭祀.祈福.安香.出火.修造.出行.开市.移徙.入宅.动土.安葬.破土.",
			"j": "安床.作灶.造船.会亲友.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0209": {
			"y": "祭祀.祈福.求嗣.斋醮.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "嫁娶.动土.开光.造屋.破土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0211": {
			"y": "祭祀.祈福.斋醮.出行.开市.立券.动土.移徙.入宅.破土.安葬.",
			"j": "开光.嫁娶.作灶.掘井.纳畜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0212": {
			"y": "会亲友.求嗣.理发.冠笄.结网.捕捉.开光.理发.",
			"j": "开市.动土.安葬.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0213": {
			"y": "祭祀.平治道涂.余事勿取.",
			"j": "嫁娶.祈福.掘井.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0214": {
			"y": "祈福.求嗣.斋醮.纳采.嫁娶.伐木.修造.动土.移徙.入宅.造庙.安机械.开市.入殓.除服.成服.移柩.安葬.破土.谢土.",
			"j": "置产.造屋.合脊.开光.探病.安门.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0215": {
			"y": "入学.习艺.出行.纳采.订盟.嫁娶.会亲友.进人口.牧养.捕捉.入殓.移柩.安葬.启攒.",
			"j": "开光.开市.入宅.动土.造屋.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0219": {
			"y": "塑绘.开光.祈福.求嗣.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.起基.安门.安床.移徙.造仓.结网.纳畜.",
			"j": "伐木.作灶.安葬.取渔.入宅.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0221": {
			"y": "祭祀.祈福.求嗣.酬神.裁衣.安床.立券.交易.入殓.除服.成服.移柩.谢土.启攒.",
			"j": "出行.嫁娶.入宅.动土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0222": {
			"y": "裁衣.合帐.入殓.除服.成服.会亲友.纳财.",
			"j": "祭祀.祈福.移徙.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0223": {
			"y": "祭祀.斋醮.裁衣.合帐.冠笄.订盟.纳采.嫁娶.入宅.安香.谢土.入殓.移柩.破土.立碑.安香.会亲友.出行.祈福.求嗣.立碑.上梁.放水.",
			"j": "掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0224": {
			"y": "安床.合帐.入宅.问名.纳采.求嗣.祭祀.开仓.",
			"j": "斋醮.作灶.安床.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0225": {
			"y": "作灶.平治道涂.",
			"j": "祭祀.祈福.安葬.安门.余事勿取.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0319": {
			"y": "祭祀.会亲友.立券.交易.裁衣.合帐.嫁娶.冠笄.进人口.",
			"j": "栽种.动土.安葬.掘井.修坟.探病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0323": {
			"y": "祈福.求嗣.开光.塑绘.斋醮.订盟.纳采.嫁娶.拆卸.安床.入宅.安香.移柩.修坟.安葬.谢土.栽种.解除.冠笄.裁衣.移徙.修造.动土.竖柱.放水.启攒.立碑.",
			"j": "赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0419": {
			"y": "祭祀.沐浴.破屋.坏垣.求医.治病.解除.余事勿取.",
			"j": "嫁娶.开市.交易.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0301": {
			"y": "祈福.求嗣.斋醮.塑绘.开光.订盟.纳采.嫁娶.动土.入宅.安香.移柩.安葬.谢土.出行.沐浴.修造.竖柱.上梁.纳财.破土.解除.安门.放水.",
			"j": "作灶.安床.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0302": {
			"y": "取渔.入殓.除服.成服.移柩.破土.安葬.立碑.",
			"j": "嫁娶.上梁.入宅.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0303": {
			"y": "祭祀.求嗣.沐浴.酬神.订盟.纳采.裁衣.合帐.冠笄.安机械.安床.造仓.开池.经络.纳财.开市.立券.交易.结网.取渔.纳畜.捕捉.",
			"j": "安葬.作灶.伐木.作梁.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0304": {
			"y": "祭祀.沐浴.祈福.求嗣.斋醮.订盟.纳采.裁衣.冠笄.开市.立券.交易.纳财.沐浴.除服.谢土.出行.移柩.",
			"j": "入殓.安葬.作灶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0305": {
			"y": "祭祀.祈福.求嗣.入殓.启攒.安葬.移柩.",
			"j": "开光.掘井.针灸.出行.嫁娶.入宅.移徙.作灶.动土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0306": {
			"y": "冠笄.立券.交易.修造.动土.安机械.入殓.安葬.破土.",
			"j": "嫁娶.祈福.出火.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0307": {
			"y": "祭祀.会亲友.出行.立券.交易.冠笄.纳财.",
			"j": "嫁娶.动土.掘井.起基.定磉.破土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0308": {
			"y": "祭祀.沐浴.解除.扫舍.塞穴.牧养.",
			"j": "嫁娶.安葬.行丧.安门.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0309": {
			"y": "纳财.开市.交易.立券.开光.针灸.会亲友.理发.安床.造仓.结网.",
			"j": "移徙.入宅.栽种.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0310": {
			"y": "嫁娶.冠笄.会亲友.安机械.纳财.交易.立券.置产.",
			"j": "开市.造屋.治病.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0311": {
			"y": "嫁娶.造车器.纳采.订盟.祭祀.祈福.安机械.移徙.入宅.开市.立券.破土.安葬.",
			"j": "纳畜.理发.合寿木.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0312": {
			"y": "祈福.斋醮.出行.移徙.入宅.修造.动土.破土.安葬.",
			"j": "纳采.开光.安床.嫁娶.开市.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0313": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "嫁娶.移徙.开市.入宅.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0314": {
			"y": "嫁娶.冠笄.祭祀.出行.会亲友.修造.动土.入殓.破土.",
			"j": "塑绘.开光.造桥.除服.成服.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0315": {
			"y": "开光.求嗣.出行.纳采.冠笄.出火.拆卸.起基.修造.动土.上梁.移徙.造船.开市.交易.立券.纳财.",
			"j": "祈福.嫁娶.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0316": {
			"y": "理发.冠笄.嫁娶.进人口.栽种.捕捉.针灸.",
			"j": "纳财.开市.安葬.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0317": {
			"y": "开光.祈福.求嗣.出行.解除.伐木.造屋.起基.修造.架马.安门.移徙.入宅.造庙.除服.成服.移柩.谢土.纳畜.牧养.",
			"j": "纳采.动土.开市.交易.安门.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0318": {
			"y": "裁衣.经络.伐木.开柱眼.拆卸.修造.动土.上梁.合脊.合寿木.入殓.除服.成服.移柩.破土.安葬.启攒.修坟.立碑.",
			"j": "祭祀.嫁娶.出行.上梁.掘井.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0320": {
			"y": "扫舍.塞穴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0321": {
			"y": "塑绘.开光.订盟.纳采.裁衣.合帐.冠笄.安机械.会亲友.纳财.开市.立券.交易.安床.竖柱.上梁.结网.栽种.解除.经络.",
			"j": "作灶.出行.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0322": {
			"y": "祭祀.嫁娶.纳婿.除服.成服.入殓.移柩.",
			"j": "动土.作灶.入宅.开光.安床.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0324": {
			"y": "祭祀.解除.入殓.除服.成服.移柩.启攒.安葬.修坟.立碑.谢土.沐浴.扫舍.捕捉.取渔.结网.畋猎.理发.",
			"j": "安床.嫁娶.作灶.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0325": {
			"y": "破屋.坏垣.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0326": {
			"y": "祭祀.出行.订盟.纳采.裁衣.合帐.冠笄.进人口.动土.安床.作灶.入殓.移柩.安葬.破土.结网.取渔.畋猎.",
			"j": "作梁.造庙.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0327": {
			"y": "祭祀.开光.塑绘.订盟.纳采.合帐.冠笄.拆卸.动土.起基.上梁.入宅.安香.开市.立券.纳财.沐浴.求嗣.出火.竖柱.安门.",
			"j": "造庙.嫁娶.伐木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0328": {
			"y": "祭祀.沐浴.捕捉.栽种.",
			"j": "嫁娶.入宅.移徙.作灶.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0329": {
			"y": "祭祀.开光.塑绘.酬神.斋醮.订盟.纳采.嫁娶.裁衣.动土.起基.出火.拆卸.移徙.入宅.安香.修造.竖柱.上梁.纳畜.牧养.祈福.求嗣.解除.伐木.定磉.造屋.安门.",
			"j": "栽种.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0330": {
			"y": "订盟.纳采.冠笄.拆卸.修造.动土.安床.入殓.除服.成服.移柩.安葬.破土.启攒.造仓.",
			"j": "作灶.开光.嫁娶.开市.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0426": {
			"y": "纳采.开光.求医.治病.动土.上梁.移徙.入宅.",
			"j": "嫁娶.开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0406": {
			"y": "纳采.祭祀.祈福.求嗣.斋醮.出行.起基.造屋.定磉.安门.入殓.安葬.",
			"j": "嫁娶.开市.纳财.出火.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0429": {
			"y": "祭祀.斋醮.开市.动土.入殓.破土.安葬.",
			"j": "嫁娶.移徙.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0424": {
			"y": "祭祀.祈福.裁衣.合帐.安床.入殓.除服.成服.移柩.破土.启攒.安葬.谢土.立碑.造畜椆栖.",
			"j": "掘井.安门.嫁娶.纳采.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0409": {
			"y": "祭祀.祈福.求嗣.斋醮.纳采.订盟.开光.竖柱.上梁.开仓.出货财.造屋.起基.定磉.安门.诸事不宜.破土.入殓.启攒.谢土.",
			"j": "出火.嫁娶.开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0416": {
			"y": "祭祀.作灶.平治道涂.余事勿取.",
			"j": "嫁娶.安葬.动土.安床.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0414": {
			"y": "沐浴.斋醮.解除.求医.治病.会亲友.造畜椆栖.栽种.理发.扫舍.",
			"j": "开市.嫁娶.移徙.入宅.掘井.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0404": {
			"y": "祭祀.嫁娶.祈福.纳采.裁衣.合帐.安床.入宅.安香.入殓.移柩.安葬.谢土.修造.安碓硙.求嗣.会亲友.挂匾.交易.立券.纳财.造仓.放水.",
			"j": "栽种.伐木.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0427": {
			"y": "祭祀.会亲友.开市.安床.启攒.安葬.",
			"j": "嫁娶.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0428": {
			"y": "祭祀.作灶.掘井.平治道涂.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0417": {
			"y": "造车器.祭祀.祈福.求嗣.斋醮.开市.交易.安机械.雕刻.开光.造屋.合脊.起基.定磉.安门.纳畜.安葬.开生坟.立碑.谢土.斋醮.",
			"j": "入宅.动土.开仓.出货财.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0422": {
			"y": "祭祀.余事勿取.",
			"j": "造庙.嫁娶.安床.余事勿取.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0528": {
			"y": "纳采.祭祀.祈福.开市.求医.治病.动土.纳畜.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0401": {
			"y": "祭祀.扫舍.塞穴.",
			"j": "栽种.作灶.安葬.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0402": {
			"y": "开光.塑绘.裁衣.冠笄.伐木.拆卸.竖柱.上梁.开仓.会亲友.安机械.造仓.造屋.交易.解除.开市.立券.纳财.",
			"j": "出行.嫁娶.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0403": {
			"y": "冠笄.入殓.除服.成服.移柩.平治道涂.修饰垣墙.",
			"j": "造屋.作灶.治病.探病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0405": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.纳畜.入殓.破土.安葬.",
			"j": "移徙.入宅.嫁娶.出行.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0407": {
			"y": "祭祀.沐浴.解除.求医.治病.破屋.坏垣.余事勿取.",
			"j": "祈福.斋醮.开市.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0408": {
			"y": "沐浴.捕捉.畋猎.结网.取渔.",
			"j": "祭祀.嫁娶.入宅.作灶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0410": {
			"y": "祭祀.捕捉.解除.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞东",
			"ch": "收",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0411": {
			"y": "纳采.嫁娶.出行.开市.立券.纳畜.牧养.出火.移徙.入宅.",
			"j": "祈福.动土.破土.安葬.入殓.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0412": {
			"y": "祭祀.祈福.求嗣.斋醮.冠笄.作灶.纳财.交易.",
			"j": "开光.嫁娶.掘井.安葬.安门.探病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0413": {
			"y": "祭祀.解除.教牛马.出行.余事勿取.",
			"j": "动土.破土.行丧.开光.作梁.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0415": {
			"y": "求嗣.出行.解除.订盟.纳采.嫁娶.会亲友.进人口.安床.开市.交易.纳畜.牧养.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "祈福.开市.修造.动土.破土.谢土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0418": {
			"y": "祭祀.祈福.开光.求嗣.斋醮.纳采.订盟.求医.治病.起基.定磉.造船.取渔.解除.安葬.启攒.谢土.入殓.",
			"j": "开市.动土.掘井.开池.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0420": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0421": {
			"y": "祭祀.塑绘.开光.订盟.纳采.冠笄.裁衣.安机械.拆卸.修造.动土.安床.经络.开市.",
			"j": "出火.入宅.安葬.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0423": {
			"y": "订盟.纳采.嫁娶.进人口.会亲友.交易.立券.动土.除服.谢土.移柩.破土.启攒.赴任.出行.开市.纳财.栽种.",
			"j": "入殓.安葬.入宅.安床.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0425": {
			"y": "祭祀.进人口.嫁娶.安床.解除.冠笄.出行.裁衣.扫舍.",
			"j": "掘井.动土.破土.安葬.开光.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0430": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.移徙.求医.",
			"j": "开市.动土.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0521": {
			"y": "开光.出行.纳采.嫁娶.伐木.架马.出火.拆卸.移徙.入宅.造庙.造桥.造船.造畜椆栖.开市.入殓.除服.成服.移柩.安葬.",
			"j": "",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0511": {
			"y": "祭祀.沐浴.移徙.破土.安葬.扫舍.平治道涂.",
			"j": "祈福.嫁娶.入宅.安床.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0501": {
			"y": "祭祀.求医.治病.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0525": {
			"y": "嫁娶.纳采.求医.治病.修造.动土.移徙.入宅.破土.安葬.",
			"j": "开市.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0523": {
			"y": "开光.出行.嫁娶.",
			"j": "会亲友.进人口.修造.动土.起基.移徙.开市.纳畜.入殓.除服.成服.移柩.破土.安葬.修坟.立碑.会亲友.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0621": {
			"y": "嫁娶.出行.安机械.祭祀.塑绘.开光.治病.经络.安床.结网.塞穴.破土.入殓.",
			"j": "开市.安门.掘井.作灶.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0502": {
			"y": "沐浴.结网.取渔.",
			"j": "嫁娶.入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0503": {
			"y": "",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0504": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0505": {
			"y": "嫁娶.开光.出行.出火.拆卸.进人口.开市.立券.交易.挂匾.入宅.移徙.安床.栽种.",
			"j": "祈福.入殓.祭祀.作灶.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0506": {
			"y": "祭祀.祈福.求嗣.开光.纳采.订盟.嫁娶.出行.动土.破土.会亲友.开市.交易.立券.习艺.拆卸.起基.安碓硙.放水.开池.造仓.开渠.栽种.谢土.启攒.修坟.立碑.",
			"j": "入宅.安门.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0507": {
			"y": "嫁娶.冠笄.祭祀.出行.移徙.入宅.作灶.造车器.补垣.塞穴.作厕.破土.启攒.除服.成服.入殓.",
			"j": "入宅.造屋.造桥.安门.安葬.上梁.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0508": {
			"y": "祭祀.解除.断蚁.会亲友.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0509": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.治病.造车器.修造.动土.移徙.入宅.",
			"j": "开市.出行.安床.作灶.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0510": {
			"y": "嫁娶.纳采.订盟.会亲友.安机械.结网.冠笄.祭祀.求嗣.进人口.经络.",
			"j": "开市.作灶.动土.行丧.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0512": {
			"y": "祭祀.祈福.斋醮.求嗣.安机械.纳畜.移徙.入宅.安机械.塑绘.开光.起基.竖柱.上梁.作灶.安门.安香.出火.造屋.启攒.安葬.",
			"j": "动土.破土.嫁娶.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0513": {
			"y": "嫁娶.纳采.订盟.斋醮.开光.祭祀.祈福.求医.治病.会亲友.动土.解除.捕捉.纳畜.牧养.入殓.破土.安葬.",
			"j": "移徙.入宅.造屋.架马.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0514": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0515": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "斋醮.开市.嫁娶.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0516": {
			"y": "开市.交易.立券.安机械.会亲友.开光.求医.治病.造屋.起基.修造.动土.定磉.竖柱.上梁.安门.作灶.放水.作厕.开池.栽种.牧养.造畜椆栖.破土.安葬.立碑.",
			"j": "嫁娶.出火.移徙.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0517": {
			"y": "栽种.捕捉.畋猎.余事勿取.",
			"j": "开市.动土.祭祀.斋醮.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0518": {
			"y": "嫁娶.祭祀.祈福.求嗣.斋醮.订盟.纳采.解除.出行.动土.破土.习艺.针灸.理发.会亲友.起基.修造.动土.竖柱.定磉.安床.拆卸.纳畜.牧养.放水.破土.除服.成服.修坟.立碑.",
			"j": "开市.入宅.探病.出火.造屋.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0519": {
			"y": "余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0520": {
			"y": "塞穴.断蚁.结网.余事勿取.",
			"j": "破土.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0522": {
			"y": "进人口.牧养.置产.塞穴.结网.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0524": {
			"y": "嫁娶.纳采.出行.祭祀.祈福.开市.动土.移徙.入宅.破土.安葬.",
			"j": "安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0526": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0527": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "祈福.斋醮.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0529": {
			"y": "嫁娶.纳采.出行.移徙.入宅.",
			"j": "动土.破土.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0530": {
			"y": "订盟.纳采.祭祀.动土.破土.交易.立券.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0531": {
			"y": "嫁娶.裁衣.祭祀.出行.安床.作灶.移徙.入宅.破土.安葬.",
			"j": "赴任.捕捉.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0626": {
			"y": "祭祀.入殓.移柩.启攒.安葬.",
			"j": "上梁.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0726": {
			"y": "纳采.祭祀.祈福.解除.动土.破土.安葬.",
			"j": "嫁娶.移徙.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0601": {
			"y": "塞穴.结网.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0602": {
			"y": "嫁娶.订盟.纳采.出行.祭祀.祈福.斋醮.动土.上梁.破土.安葬.",
			"j": "移徙.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0603": {
			"y": "订盟.纳采.会亲友.安床.作灶.造畜椆栖.",
			"j": "开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0604": {
			"y": "沐浴.平治道涂.扫舍.入殓.移柩.破土.启攒.安葬.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0605": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.动土.上梁.进人口.入宅.移徙.安床.安门.开市.交易.立券.挂匾.栽种.破土.安葬.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0606": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.立券.移徙.入宅.动土.破土.安葬.",
			"j": "开光.作灶.造屋.架马.开仓.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0607": {
			"y": "纳采.订盟.冠笄.祭祀.祈福.斋醮.出行.修造.动土.移徙.入宅.安香.出火.拆卸.造屋.起基.竖柱.上梁.定磉.安门.开池.",
			"j": "嫁娶.开市.合寿木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0608": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "入宅.嫁娶.移徙.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0609": {
			"y": "嫁娶.安机械.交易.出行.祭祀.祈福.求嗣.斋醮.塑绘.开光.合帐.裁衣.放水.开池.掘井.",
			"j": "作灶.理发.造桥.行丧.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0610": {
			"y": "纳采.冠笄.求医.治病.开市.立券.修造.动土.安机械.破土.安葬.",
			"j": "斋醮.祭祀.移徙.入宅.上梁.嫁娶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0611": {
			"y": "祭祀.作灶.余事勿取.",
			"j": "开市.安葬.破土.修坟.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0612": {
			"y": "祭祀.祈福.求嗣.斋醮.安香.解除.移徙.入宅.会亲友.求医.治病.动土.破土.开生坟.合寿木.",
			"j": "合帐.上梁.经络.安葬.入殓.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0613": {
			"y": "嫁娶.冠笄.修造.动土.作灶.移徙.入宅.补垣.塞穴.纳畜.牧养.架马.修造.动土.起基.定磉.开池.造船.",
			"j": "祈福.开光.掘井.开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0614": {
			"y": "祭祀.交易.纳财.",
			"j": "斋醮.开渠.上梁.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0615": {
			"y": "嫁娶.订盟.纳采.冠笄.会亲友.安机械.造车器.祭祀.出行.纳财.入宅.安香.出火.入学.塑绘.开光.拆卸.起基.修造.动土.牧养.栽种.安门.作厕.",
			"j": "行丧.伐木.作梁.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0616": {
			"y": "开光.求嗣.出行.冠笄.嫁娶.伐木.架马.开柱眼.修造.移徙.入宅.开市.交易.立券.出行.安香.出火.挂匾.起基.修造.开生坟.合寿木.入殓.除服.成服.移柩.安葬.",
			"j": "安床.出货财.作灶.动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0617": {
			"y": "祭祀.沐浴.理发.嫁娶.作灶.整手足甲.扫舍.修饰垣墙.平治道涂.",
			"j": "斋醮.出行.治病.合寿木.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0618": {
			"y": "安机械.移徙.入宅.出行.祭祀.祈福.斋醮.纳采.订盟.安香.出火.解除.会亲友.修造.动土.拆卸.起基.定磉.移徙.入宅.造屋.安床.修造.破土.安葬.入殓.立碑.",
			"j": "开市.伐木.作梁.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0619": {
			"y": "祭祀.沐浴.捕捉.结网.畋猎.取渔.余事勿取.",
			"j": "开市.交易.嫁娶.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0620": {
			"y": "破屋.坏垣.求医.治病.畋猎.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0622": {
			"y": "订盟.纳采.会亲友.进人口.雕刻.拆卸.修造.动土.起基.开市.栽种.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.",
			"j": "",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0623": {
			"y": "祭祀.捕捉.取渔.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0624": {
			"y": "嫁娶.纳采.祭祀.祈福.求医.治病.出行.动土.移徙.入宅.",
			"j": "开市.安门.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0625": {
			"y": "裁衣.作灶.移徙.入宅.纳畜.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0627": {
			"y": "订盟.纳采.出行.祈福.斋醮.安床.会亲友.",
			"j": "移徙.入宅.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0628": {
			"y": "嫁娶.纳采.出行.求医.治病.开市.移徙.入宅.启攒.安葬.",
			"j": "动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0629": {
			"y": "嫁娶.祭祀.沐浴.扫舍.修饰垣墙.",
			"j": "行丧.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0630": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0716": {
			"y": "纳采.订盟.嫁娶.移徙.入宅.出行.开市.交易.立券.纳财.会亲友.安香.出火.拆卸.造屋.起基.安床.作灶.挂匾.安葬.破土.启攒.立碑.入殓.移柩.",
			"j": "祈福.上梁.开仓.掘井.牧养.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0721": {
			"y": "开市.纳财.祭祀.塑绘.安机械.冠笄.会亲友.裁衣.开仓.经络.纳畜.造畜椆栖.教牛马.牧养.",
			"j": "动土.破土.安葬.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0724": {
			"y": "祭祀.冠笄.嫁娶.捕捉.结网.畋猎.取渔.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0706": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.出行.解除.伐木.入宅.移徙.安床.出火.拆卸.修造.上梁.栽种.移柩.",
			"j": "安葬.开市.交易.立券.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0730": {
			"y": "祭祀.作灶.纳财.捕捉.",
			"j": "开市.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0720": {
			"y": "祭祀.塞穴.结网.畋猎.余事勿取.",
			"j": "移徙.开市.入宅.嫁娶.开光.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0710": {
			"y": "祭祀.沐浴.塑绘.开光.入学.解除.扫舍.治病.开池.牧养.",
			"j": "嫁娶.出行.纳采.入宅.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0728": {
			"y": "嫁娶.纳采.开市.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "祭祀.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0714": {
			"y": "沐浴.理发.捕捉.入殓.移柩.破土.启攒.安葬.",
			"j": "出火.嫁娶.入宅.作灶.破土.上梁.动土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0718": {
			"y": "祭祀.进人口.纳财.纳畜.牧养.捕捉.余事勿取.",
			"j": "开市.入宅.安床.动土.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0729": {
			"y": "嫁娶.纳采.开市.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "赴任.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0719": {
			"y": "祭祀.塑绘.开光.求医.治病.嫁娶.会亲友.放水.掘井.牧养.纳畜.开渠.安碓硙.",
			"j": "造屋.入宅.作灶.入学.安葬.行丧.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0708": {
			"y": "祭祀.入殓.除服.成服.移柩.破土.启攒.安葬.塞穴.断蚁.结网.",
			"j": "开市.入宅.嫁娶.开光.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0709": {
			"y": "祭祀.修造.出行.造屋.竖柱.造车器.教牛马.造畜椆栖.割蜜.",
			"j": "动土.破土.掘井.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0725": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0824": {
			"y": "塑绘.开光.解除.订盟.纳采.嫁娶.出火.修造.动土.移徙.入宅.拆卸.起基.安门.分居.开市.交易.立券.纳财.纳畜.牧养.",
			"j": "",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0701": {
			"y": "订盟.纳采.出行.祭祀.祈福.修造.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0702": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0703": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.入殓.破土.安葬.",
			"j": "开光.开市.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0704": {
			"y": "开光.求医.治病.动土.上梁.入殓.破土.安葬.",
			"j": "嫁娶.开光.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0705": {
			"y": "祭祀.栽种.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0707": {
			"y": "纳采.订盟.嫁娶.祭祀.沐浴.塑绘.开光.出火.治病.习艺.伐木.造屋.竖柱.上梁.安床.作灶.安碓硙.挂匾.掘井.纳畜.",
			"j": "出行.安葬.造桥.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0711": {
			"y": "纳财.开市.交易.立券.出行.祭祀.祈福.求嗣.开光.解除.扫舍.起基.竖柱.安床.移徙.开仓.出货财.补垣.塞穴.栽种.纳畜.牧养.",
			"j": "斋醮.入宅.安门.安葬.破土.行丧.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0712": {
			"y": "祭祀.修饰垣墙.平治道涂.",
			"j": "开市.动土.破土.嫁娶.修造.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0713": {
			"y": "订盟.纳采.祭祀.祈福.开光.安香.出火.立券.安机械.移徙.入宅.竖柱.上梁.会亲友.安床.拆卸.挂匾.牧养.教牛马.",
			"j": "嫁娶.安葬.行丧.破土.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0715": {
			"y": "求医.治病.破屋.坏垣.余事勿取.",
			"j": "嫁娶.出行.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0717": {
			"y": "祭祀.祈福.斋醮.出行.纳采.订盟.安机械.出火.拆卸.修造.动土.起基.移徙.入宅.造庙.入殓.除服.成服.移柩.破土.安葬.谢土.",
			"j": "嫁娶.开市.栽种.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0722": {
			"y": "移徙.入宅.治病.会亲友.祭祀.祈福.斋醮.安香.移徙.嫁娶.造屋.起基.",
			"j": "开市.斋醮.安床.出行.经络.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0723": {
			"y": "塑绘.出行.冠笄.嫁娶.进人口.裁衣.纳婿.造畜椆栖.交易.立券.牧养.开生坟.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0727": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0731": {
			"y": "嫁娶.开市.立券.祭祀.祈福.动土.移徙.入宅.",
			"j": "造庙.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0829": {
			"y": "订盟.纳采.出行.会亲友.修造.上梁.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0802": {
			"y": "嫁娶.纳采.出行.祭祀.祈福.解除.移徙.入宅.",
			"j": "动土.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0830": {
			"y": "沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.祈福.余事勿取.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0812": {
			"y": "嫁娶.订盟.纳采.作灶.冠笄.裁衣.会亲友.纳畜.牧养.安机械.开市.立券.纳财.安床.",
			"j": "掘井.出行.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0820": {
			"y": "祭祀.捕捉.畋猎.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.启攒.",
			"j": "嫁娶.纳采.订盟.开市.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0822": {
			"y": "祈福.斋醮.出行.冠笄.嫁娶.雕刻.开柱眼.入宅.造桥.开市.交易.立券.纳财.入殓.除服.成服.移柩.破土.安葬.启攒.",
			"j": "动土.破土.订盟.安床.开池.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0810": {
			"y": "订盟.纳采.祭祀.祈福.安香.出火.开市.立券.入宅.挂匾.造桥.启攒.安葬.",
			"j": "动土.破土.嫁娶.掘井.安床.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0819": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.普渡.开光.安香.出火.移徙.入宅.竖柱.修造.动土.竖柱.上梁.起基.造屋.安门.造庙.造桥.破土.启攒.安葬.",
			"j": "开市.立券.纳财.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0930": {
			"y": "祭祀.裁衣.冠笄.嫁娶.纳婿.会亲友.除服.成服.移柩.捕捉.进人口.入殓.",
			"j": "移徙.入宅.作灶.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0801": {
			"y": "补垣.塞穴.结网.入殓.除服.成服.移柩.安葬.启攒.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0803": {
			"y": "嫁娶.祭祀.祈福.斋醮.治病.破土.安葬.",
			"j": "开市.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0804": {
			"y": "嫁娶.出行.开市.安床.入殓.启攒.安葬.",
			"j": "祈福.动土.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0805": {
			"y": "嫁娶.祭祀.裁衣.结网.冠笄.沐浴.",
			"j": "开仓.出货财.置产.安葬.动土.破土.掘井.栽种.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0806": {
			"y": "入宅.移徙.安床.开光.祈福.求嗣.进人口.开市.交易.立券.出火.拆卸.修造.动土.",
			"j": "嫁娶.破土.置产.栽种.安葬.修坟.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0807": {
			"y": "祭祀.解除.沐浴.整手足甲.入殓.移柩.破土.启攒.安葬.",
			"j": "嫁娶.入宅.移徙.作灶.开市.交易.安门.栽种.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0808": {
			"y": "祭祀.普渡.捕捉.解除.结网.畋猎.入殓.破土.安葬.",
			"j": "开市.交易.入宅.嫁娶.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0809": {
			"y": "沐浴.破屋.坏垣.余事勿取.",
			"j": "斋醮.开市.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0811": {
			"y": "嫁娶.祭祀.祈福.斋醮.普渡.移徙.入宅.动土.治病.开市.交易.立券.开光.修造.造车器.安香.安床.捕捉.畋猎.结网.",
			"j": "纳采.订盟.经络.行丧.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0813": {
			"y": "嫁娶.订盟.纳采.祭祀.斋醮.普渡.解除.出行.会亲友.开市.纳财.修造.动土.竖柱.上梁.开光.开仓.出货财.纳畜.牧养.开池.破土.启攒.",
			"j": "出火.入宅.造屋.安门.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0814": {
			"y": "嫁娶.普渡.祭祀.祈福.补垣.塞穴.断蚁.筑堤.入殓.除服.成服.安葬.",
			"j": "动土.破土.掘井.开光.上梁.词讼.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0815": {
			"y": "嫁娶.冠笄.祭祀.沐浴.普渡.出行.纳财.扫舍.纳畜.赴任.",
			"j": "开市.动土.破土.安床.开仓.上梁.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0816": {
			"y": "祭祀.沐浴.理发.整手足甲.冠笄.解除.入殓.移柩.破土.启攒.安葬.",
			"j": "嫁娶.出行.入宅.开市.安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0817": {
			"y": "塑绘.冠笄.嫁娶.会亲友.进人口.经络.裁衣.栽种.纳畜.牧养.补垣.塞穴.捕捉.",
			"j": "祈福.开市.动土.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0818": {
			"y": "出行.沐浴.订盟.纳采.裁衣.竖柱.上梁.移徙.纳畜.牧养.",
			"j": "嫁娶.安门.动土.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0821": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "行丧.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0823": {
			"y": "祈福.求嗣.解除.订盟.纳采.动土.起基.放水.造仓.开市.纳畜.牧养.开生坟.入殓.除服.成服.移柩.破土.安葬.",
			"j": "",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0825": {
			"y": "祈福.出行.订盟.纳采.嫁娶.裁衣.动土.安床.放水.开市.掘井.交易.立券.栽种.开渠.除服.成服.移柩.破土.",
			"j": "",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0826": {
			"y": "嫁娶.祭祀.祈福.斋醮.作灶.移徙.入宅.",
			"j": "动土.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0827": {
			"y": "嫁娶.出行.纳畜.祭祀.入殓.启攒.安葬.",
			"j": "作灶.动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0828": {
			"y": "订盟.纳采.祭祀.祈福.修造.动土.上梁.破土.安葬.",
			"j": "嫁娶.开市.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0831": {
			"y": "嫁娶.祭祀.祈福.斋醮.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1030": {
			"y": "开光.针灸.会亲友.启攒.安葬.",
			"j": "开市.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0901": {
			"y": "捕捉.结网.入殓.破土.安葬.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0902": {
			"y": "沐浴.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0903": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.移徙.入宅.启攒.安葬.",
			"j": "动土.破土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0904": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求医.治病.动土.移徙.入宅.破土.安葬.",
			"j": "开光.针灸.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0905": {
			"y": "订盟.纳采.祭祀.祈福.安机械.作灶.纳畜.",
			"j": "动土.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0906": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.动土.安床.掘井.破土.启攒.",
			"j": "入宅.作梁.安门.伐木.修造.上梁.入殓.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0907": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.修造.移徙.动土.安床.入殓.破土.安葬.启攒.",
			"j": "造屋.开光.理发.造船.掘井.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0908": {
			"y": "冠笄.沐浴.出行.修造.动土.移徙.入宅.破土.安葬.",
			"j": "嫁娶.开市.祭祀.祈福.斋醮.纳采.修坟.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0909": {
			"y": "祭祀.出行.",
			"j": "嫁娶.入宅.修造.动土.会亲友.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0910": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.修造.动土.移徙.入宅.",
			"j": "针灸.伐木.作梁.造庙.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0911": {
			"y": "出行.开市.交易.立券.安机械.出火.上梁.移徙.",
			"j": "嫁娶.安葬.动土.造桥.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0912": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "斋醮.嫁娶.移徙.出行.上梁.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0913": {
			"y": "嫁娶.造车器.安机械.祭祀.祈福.开光.安香.出火.出行.开市.立券.修造.动土.移徙.入宅.破土.安葬.",
			"j": "纳采.订盟.架马.词讼.开渠.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0914": {
			"y": "沐浴.捕捉.入殓.除服.成服.破土.启攒.安葬.",
			"j": "祭祀.嫁娶.安床.开市.入宅.探病.上梁.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0915": {
			"y": "余事勿取.",
			"j": "探病.余事勿取.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0916": {
			"y": "订盟.纳采.祭祀.祈福.安香.出火.修造.动土.上梁.安门.起基.竖柱.上梁.定磉.开池.移徙.入宅.立券.破土.",
			"j": "嫁娶.造庙.造桥.造船.作灶.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0917": {
			"y": "开光.求嗣.雕刻.嫁娶.订盟.纳采.出火.拆卸.修造.动土.起基.上梁.放水.移徙.入宅.造仓.造船.开市.开池.纳畜.牧养.挂匾.",
			"j": "行丧.安葬.合寿木.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0918": {
			"y": "祭祀.嫁娶.捕捉.",
			"j": "开光.动土.破土.开市.修造.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0919": {
			"y": "祭祀.普渡.解除.会亲友.捕捉.畋猎.启攒.除服.成服.移柩.",
			"j": "嫁娶.开市.动土.掘井.开池.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0920": {
			"y": "祭祀.出行.解除.冠笄.嫁娶.伐木.架马.开柱眼.修造.动土.移徙.入宅.开生坟.合寿木.入殓.移柩.破土.安葬.修坟.",
			"j": "开光.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0921": {
			"y": "祭祀.祈福.求嗣.出行.沐浴.交易.扫舍.教牛马.",
			"j": "动土.作灶.行丧.安葬.修坟.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0922": {
			"y": "出行.解除.纳采.冠笄.雕刻.修造.动土.起基.上梁.合脊.安床.移徙.入宅.开市.栽种.作厕.",
			"j": "造庙.安门.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0923": {
			"y": "祭祀.沐浴.解除.理发.冠笄.安机械.作灶.造仓.开市.开池.作厕.补垣.塞穴.断蚁.结网.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0924": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0925": {
			"y": "祭祀.会亲友.纳采.嫁娶.开光.塑绘.斋醮.安香.开市.立券.除服.成服.入殓.移柩.安葬.赴任.进人口.出行.裁衣.修造.动土.上梁.经络.交易.",
			"j": "入宅.伐木.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0926": {
			"y": "祭祀.冠笄.会亲友.拆卸.起基.除服.成服.移柩.启攒.安葬.沐浴.捕捉.开光.塑绘.",
			"j": "作灶.祭祀.入宅.嫁娶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0927": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "移徙.入宅.出行.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0928": {
			"y": "祭祀.塑绘.开光.出行.解除.订盟.嫁娶.拆卸.起基.安床.入宅.开市.入殓.除服.成服.移柩.破土.谢土.挂匾.开柱眼.交易.",
			"j": "造桥.冠笄.造屋.掘井.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0929": {
			"y": "祭祀.赴任.动土.上梁.开光.塑绘.冠笄.拆卸.起基.安床.开市.立券.赴任.经络.",
			"j": "定磉.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1020": {
			"y": "捕捉.结网.入殓.除服.成服.移柩.破土.安葬.启攒.立碑.",
			"j": "嫁娶.祭祀.入宅.造屋.移徙.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1010": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "开市.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1026": {
			"y": "祭祀.祈福.斋醮.沐浴.竖柱.订盟.纳采.嫁娶.拆卸.入宅.移柩.启攒.谢土.赴任.出火.纳畜.",
			"j": "作灶.入殓.安葬.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1023": {
			"y": "会亲友.嫁娶.订盟.纳采.纳婿.拆卸.修造.动土.起基.竖柱.上梁.安床.会亲友.纳财.",
			"j": "出行.祈福.安葬.作灶.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1126": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.拆卸.修造.动土.起基.安床.移徙.入宅.安香.入殓.移柩.安葬.谢土.赴任.进人口.会亲友.",
			"j": "作灶.治病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1001": {
			"y": "祭祀.诸事不宜.",
			"j": "入殓.安葬.开市.交易.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1002": {
			"y": "祭祀.裁衣.冠笄.嫁娶.安机械.拆卸.动土.起基.移徙.入宅.入殓.启攒.安葬.造仓.经络.",
			"j": "安床.开光.开市.交易.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1003": {
			"y": "祭祀.出行.成服.除服.沐浴.入殓.",
			"j": "动土.冠笄.移徙.入宅.开市.竖柱.上梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1004": {
			"y": "祭祀.沐浴.赴任.出行.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1005": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1006": {
			"y": "沐浴.入殓.移柩.除服.成服.破土.平治道涂.",
			"j": "嫁娶.移徙.入宅.开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1007": {
			"y": "嫁娶.祭祀.祈福.求嗣.沐浴.出火.出行.拆卸.修造.动土.进人口.开市.交易.立券.入宅.移徙.安床.栽种.纳畜.入殓.安葬.启攒.除服.成服.",
			"j": "",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1008": {
			"y": "捕捉.畋猎.余事勿取.",
			"j": "开市.交易.祭祀.入宅.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1009": {
			"y": "嫁娶.纳采.订盟.祭祀.祈福.求嗣.斋醮.开光.安香.出火.造庙.移徙.出行.入宅.造庙.起基.竖柱.上梁.安床.纳畜.捕捉.纳婿.安葬.",
			"j": "开市.破土.掘井.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1011": {
			"y": "订盟.纳采.会亲友.交易.立券.纳财.栽种.纳畜.牧养.",
			"j": "嫁娶.开市.入宅.祈福.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1012": {
			"y": "造车器.嫁娶.订盟.纳采.会亲友.祭祀.出行.开市.立券.移徙.入宅.破土.安葬.",
			"j": "上梁.开光.造屋.架马.合寿木.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1013": {
			"y": "祭祀.作灶.纳财.捕捉.畋猎.余事勿取.",
			"j": "动土.破土.开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1014": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.求医.治病.出火.移徙.入宅.",
			"j": "开市.开仓.出货财.安床.安门.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1015": {
			"y": "冠笄.祭祀.沐浴.作灶.理发.整手足甲.扫舍.补垣.塞穴.入殓.破土.启攒.",
			"j": "开光.嫁娶.会亲友.栽种.针灸.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1016": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.置产.求医.治病.开市.交易.立券.会亲友.移徙.竖柱.上梁.造屋.合脊.安门.放水.捕捉.纳畜.",
			"j": "造庙.造船.动土.破土.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1017": {
			"y": "出行.造车器.造畜椆栖.解除.冠笄.裁衣.作梁.雕刻.会亲友.移徙.入宅.安机械.造畜椆栖.开市.扫舍.",
			"j": "嫁娶.动土.破土.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1018": {
			"y": "沐浴.理发.冠笄.安床.开市.立券.会亲友.交易.纳财.结网.教牛马.",
			"j": "移徙.入宅.出行.祈福.嫁娶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1019": {
			"y": "祭祀.造畜椆栖.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.开市.安床.掘井.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1021": {
			"y": "祭祀.祈福.求嗣.斋醮.造庙.出火.安机械.会亲友.开市.交易.立券.纳财.习艺.经络.求医.治病.开池.作厕.畋猎.结网.栽种.牧养.安葬.破土.启攒.",
			"j": "开光.嫁娶.掘井.伐木.作梁.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1022": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1024": {
			"y": "祭祀.塑绘.开光.祈福.斋醮.出行.订盟.纳采.裁衣.嫁娶.拆卸.修造.安床.入宅.安香.入殓.启攒.安葬.谢土.赴任.会亲友.进人口.出行.移徙.上梁.经络.开市.交易.立券.纳财.",
			"j": "开仓.冠笄.伐木.作梁.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1025": {
			"y": "祭祀.作灶.入殓.除服.成服.畋猎.",
			"j": "栽种.动土.安葬.开市.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1027": {
			"y": "嫁娶.祭祀.安机械.入殓.破土.安葬.",
			"j": "动土.上梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1028": {
			"y": "作灶.造畜椆栖.",
			"j": "行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1029": {
			"y": "沐浴.理发.入学.习艺.进人口.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1031": {
			"y": "祭祀.结网.造畜椆栖.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1129": {
			"y": "祭祀.解除.祈福.开光.塑绘.斋醮.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.入殓.除服.成服.移柩.启攒.安床.赴任.出行.移徙.竖柱.上梁.伐木.栽种.破土.安葬.纳畜.",
			"j": "造屋.治病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1120": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.冠笄.出行.理发.拆卸.解除.起基.动土.定磉.安碓硙.开池.掘井.扫舍.除服.成服.移柩.启攒.立碑.谢土.",
			"j": "移徙.入宅.安门.作梁.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1128": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1122": {
			"y": "祭祀.沐浴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1127": {
			"y": "祭祀.塑绘.开光.订盟.纳采.嫁娶.安床.进人口.入殓.除服.成服.移柩.启攒.安葬.立碑.",
			"j": "开市.交易.破土.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1220": {
			"y": "祭祀.入殓.移柩.余事勿取.",
			"j": "入宅.修造.动土.破土.安门.上梁.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1101": {
			"y": "入殓.除服.成服.移柩.破土.启攒.安葬.",
			"j": "移徙.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1102": {
			"y": "嫁娶.订盟.纳采.出行.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "开市.赴任.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1103": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1104": {
			"y": "订盟.纳采.会亲友.安机械.纳财.牧养.",
			"j": "祈福.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1105": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "斋醮.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1106": {
			"y": "祭祀.塞穴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1107": {
			"y": "祭祀.祈福.求嗣.开光.开市.出行.解除.动土.起基.置产.栽种.",
			"j": "嫁娶.作灶.修坟.安门.入宅.立碑.安葬.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1108": {
			"y": "开市.纳财.出行.祭祀.祈福.求嗣.斋醮.问名.入学.起基.定磉.置产.开渠.掘井.拆卸.栽种.纳畜.牧养.动土.破土.启攒.",
			"j": "移徙.入宅.出火.入殓.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d1109": {
			"y": "祭祀.理发.置产.塞穴.除服.成服.移柩.入殓.破土.安葬.",
			"j": "嫁娶.入宅.安床.掘井.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1110": {
			"y": "祭祀.沐浴.出行.余事勿取.",
			"j": "开市.动土.破土.行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1111": {
			"y": "嫁娶.造车器.出行.会亲友.移徙.入宅.修造.动土.雕刻.开光.安香.出火.理发.会亲友.造屋.合脊.起基.归岫.安门.拆卸.扫舍.栽种.造畜椆栖.",
			"j": "开市.纳采.造庙.安床.开渠.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1112": {
			"y": "塑绘.会亲友.安机械.塞穴.结网.裁衣.经络.",
			"j": "嫁娶.开市.祈福.斋醮.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1113": {
			"y": "纳采.移徙.纳财.开市.交易.立券.纳财.入宅.修造.动土.竖柱.起基.定磉.造庙.安香.出火.修饰垣墙.平治道涂.会亲友.出行.开池.作厕.",
			"j": "开仓.造屋.造桥.祭祀.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1114": {
			"y": "订盟.纳采.纳财.开市.立券.祭祀.祈福.移徙.入宅.出行.造屋.起基.修造.动土.竖柱.上梁.安门.安香.出火.教牛马.会亲友.破土.",
			"j": "嫁娶.安葬.掘井.置产.造船.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1115": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.塑绘.开光.移徙.安床.伐木.作梁.捕捉.畋猎.结网.求医.治病.解除.安葬.除服.成服.移柩.入殓.立碑.谢土.",
			"j": "开市.造庙.动土.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1116": {
			"y": "破屋.坏垣.祭祀.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1117": {
			"y": "嫁娶.纳采.订盟.祭祀.冠笄.裁衣.伐木.作梁.架马.定磉.开柱眼.作灶.移徙.安床.畋猎.结网.开池.作厕.除服.成服.启攒.入殓.移柩.安葬.",
			"j": "造屋.造船.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1118": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.斋醮.开光.会亲友.解除.入学.纳财.交易.立券.经络.起基.动土.定磉.开池.栽种.纳畜.牧养.破土.入殓.立碑.安葬.",
			"j": "嫁娶.开市.入宅.出火.移徙.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1119": {
			"y": "捕捉.畋猎.会亲友.解除.入殓.除服.成服.移柩.余事勿取.",
			"j": "安床.安门.破土.修坟.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1121": {
			"y": "嫁娶.冠笄.安床.纳采.会亲友.塞穴.捕捉.置产.造畜椆栖.",
			"j": "开光.掘井.安葬.谢土.修坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1123": {
			"y": "祭祀.会亲友.嫁娶.沐浴.修造.动土.祈福.开光.塑绘.出行.订盟.纳采.裁衣.入殓.除服.成服.移柩.启攒.赴任.竖柱.上梁.纳财.扫舍.栽种.纳畜.伐木.",
			"j": "入宅.作灶.安床.开仓.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1124": {
			"y": "理发.会亲友.补垣.塞穴.结网.",
			"j": "嫁娶.入宅.安门.移徙.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1125": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.拆卸.修造.动土.起基.安床.移徙.入宅.安香.除服.成服.入殓.移柩.安葬.谢土.赴任.会亲友.进人口.出行.竖柱.上梁.经络.开市.交易.立券.纳财.开仓.",
			"j": "作灶.治病.伐木.作梁.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1130": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.合帐.冠笄.安机械.安床.造畜椆栖.入殓.移柩.启攒.安葬.谢土.除服.成服.会亲友.竖柱.上梁.经络.开市.交易.立券.纳财.纳畜.筑堤.",
			"j": "嫁娶.入宅.治病.赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1230": {
			"y": "嫁娶.出行.求医.治病.祭祀.祈福.上梁.纳畜.",
			"j": "开市.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1229": {
			"y": "教牛马.余事勿取.",
			"j": "入宅.动土.破土.余事勿取.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1226": {
			"y": "祭祀.沐浴.安床.纳财.畋猎.捕捉.",
			"j": "开市.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1222": {
			"y": "祭祀.塑绘.开光.裁衣.冠笄.嫁娶.纳采.拆卸.修造.动土.竖柱.上梁.安床.移徙.入宅.安香.结网.捕捉.畋猎.伐木.进人口.放水.",
			"j": "出行.安葬.修坟.开市.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1206": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1225": {
			"y": "塑绘.斋醮.出行.拆卸.解除.修造.移徙.造船.入殓.除服.成服.移柩.启攒.修坟.立碑.谢土.",
			"j": "",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1202": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1205": {
			"y": "祭祀.祈福.斋醮.塑绘.开光.订盟.纳采.裁衣.冠笄.嫁娶.拆卸.入宅.安香.入殓.移柩.理发.安葬.修坟.谢土.赴任.移徙.沐浴.治病.破土.启攒.整手足甲.入学.作梁.",
			"j": "开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1209": {
			"y": "嫁娶.冠笄.祭祀.祈福.求嗣.雕刻.开光.安香.出行.入学.修造.动土.竖柱.上梁.造屋.起基.安门.出火.移徙.入宅.掘井.造畜椆栖.安葬.破土.除服.成服.",
			"j": "开市.纳采.订盟.作灶.造庙.造船.经络.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1219": {
			"y": "纳财.开市.交易.立券.会亲友.进人口.经络.祭祀.祈福.安香.出火.求医.治病.修造.动土.拆卸.扫舍.安床.栽种.牧养.开生坟.合寿木.入殓.安葬.启攒.",
			"j": "嫁娶.祈福.出火.移徙.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1212": {
			"y": "冠笄.纳财.掘井.开池.出火.安床.交易.立券.畋猎.结网.理发.放水.",
			"j": "安门.动土.破土.行丧.安葬.成服.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1201": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1203": {
			"y": "祈福.斋醮.出行.订盟.纳采.入殓.移柩.破土.安葬.立碑.结网.",
			"j": "入宅.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1204": {
			"y": "祭祀.沐浴.出行.冠笄.进人口.余事勿取.",
			"j": "嫁娶.动土.安葬.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1207": {
			"y": "订盟.纳采.会亲友.安机械.开光.修造.动土.竖柱.上梁.造屋.起基.造桥.栽种.纳畜.造畜椆栖.移柩.入殓.启攒.修坟.立碑.安葬.",
			"j": "祈福.出火.嫁娶.入宅.开市.动土.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1208": {
			"y": "祭祀.平治道涂.修坟.除服.成服.余事勿取.",
			"j": "移徙.入宅.嫁娶.掘井.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1210": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求嗣.斋醮.安香.出火.修造.起基.造屋.合脊.安门.安碓硙.动土.上梁.移徙.入宅.",
			"j": "出行.掘井.破土.行丧.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1211": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "嫁娶.移徙.入宅.探病.出行.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1213": {
			"y": "纳采.订盟.移徙.入宅.出行.安机械.会亲友.祭祀.祈福.斋醮.开光.安香.出火.解除.求医.针灸.治病.造屋.起基.修造.安门.造船.纳畜.牧养.移柩.入殓.启攒.谢土.修坟.立碑.",
			"j": "嫁娶.动土.安床.造桥.掘井.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1214": {
			"y": "祭祀.沐浴.作灶.纳财.捕捉.畋猎.安床.扫舍.",
			"j": "开市.斋醮.破土.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1215": {
			"y": "祈福.斋醮.纳采.订盟.解除.架马.开柱眼.修造.动土.起基.上梁.归岫.造屋.合脊.掘井.除服.成服.破土.栽种.",
			"j": "移徙.开市.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1216": {
			"y": "纳采.订盟.祭祀.沐浴.冠笄.合帐.裁衣.修造.动土.拆卸.移徙.入宅.安门.开仓.筑堤.作厕.栽种.纳畜.补垣.塞穴.",
			"j": "嫁娶.祈福.开光.掘井.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1217": {
			"y": "合帐.裁衣.教牛马.余事勿取.",
			"j": "入宅.动土.破土.嫁娶.作灶.造船.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1218": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.安香.出火.出行.会亲友.经络.求医.治病.解除.拆卸.起基.修造.动土.定磉.扫舍.栽种.牧养.造畜椆栖.",
			"j": "斋醮.作梁.掘井.行丧.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1221": {
			"y": "塑绘.开光.订盟.纳采.裁衣.冠笄.拆卸.修造.安床.入宅.出火.安葬.谢土.赴任.",
			"j": "掘井.伐木.斋醮.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1223": {
			"y": "祭祀.求医.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1224": {
			"y": "祭祀.祈福.斋醮.出行.冠笄.安机械.移徙.入宅.安香.安床.除服.成服.移柩.启攒.",
			"j": "开光.栽种.治病.安门.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1227": {
			"y": "订盟.纳采.祭祀.祈福.修造.动土.上梁.破土.",
			"j": "嫁娶.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1228": {
			"y": "出行.沐浴.理发.补垣.塞穴.",
			"j": "入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1231": {
			"y": "开市.立券.开光.解除.安机械.上梁.启攒.安葬.",
			"j": "嫁娶.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		}
	};


/***/ },
/* 23 */
/***/ function(module, exports) {

	window.HuangLi = window.HuangLi || {};
	HuangLi.y2020 = {
		"d0101": {
			"y": "平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0201": {
			"y": "祭祀.祈福.斋醮.塑绘.开光.除服.成服.入殓.作灶.嫁娶.捕捉.畋猎.纳财.",
			"j": "开仓.造屋.安葬.安床.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0102": {
			"y": "求嗣.斋醮.塑绘.订盟.纳采.出火.拆卸.修造.动土.造桥.安机械.栽种.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.",
			"j": "开市.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0103": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.修造.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0104": {
			"y": "治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0105": {
			"y": "祭祀.祈福.求嗣.斋醮.开光.入学.订盟.冠笄.伐木.修造.动土.起基.放水.交易.开池.",
			"j": "造桥.安门.理发.造庙.栽种.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0106": {
			"y": "沐浴.开仓.出货财.开市.交易.立券.纳财.栽种.纳畜.牧养.畋猎.入殓.破土.安葬.",
			"j": "祈福.嫁娶.安床.入宅.造船.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0107": {
			"y": "祭祀.沐浴.补垣.塞穴.断蚁.解除.余事勿取.",
			"j": "造庙.入宅.修造.安葬.行丧.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0108": {
			"y": "嫁娶.纳采.订盟.问名.祭祀.冠笄.裁衣.会亲友.进人口.纳财.捕捉.作灶.",
			"j": "开市.安床.安葬.修坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0109": {
			"y": "订盟.纳采.会亲友.祭祀.斋醮.沐浴.塑绘.出火.开光.竖柱.上梁.开市.交易.立券.作梁.开柱眼.伐木.架马.安门.安床.拆卸.牧养.造畜椆栖.掘井.",
			"j": "造庙.嫁娶.出行.动土.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0110": {
			"y": "交易.立券.纳财.安床.裁衣.造畜椆栖.安葬.谢土.启攒.除服.成服.修坟.立碑.移柩.入殓.",
			"j": "开光.嫁娶.开市.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0111": {
			"y": "祭祀.解除.教牛马.会亲友.余事勿取.",
			"j": "破土.动土.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0112": {
			"y": "纳采.订盟.移徙.纳财.开市.交易.立券.入宅.会亲友.解除.求医.治病.入学.安床.安门.安香.出火.拆卸.扫舍.入宅.挂匾.开生坟.合寿木.破土.修坟.启攒.入殓.",
			"j": "探病.祭祀.出行.上梁.造屋.谢土.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0113": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求嗣.会亲友.解除.出行.入学.纳财.开市.交易.立券.习艺.经络.安床.开仓.出货财.纳畜.安葬.启攒.修坟.入殓.",
			"j": "入宅.开光.开市.动土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0114": {
			"y": "祭祀.冠笄.嫁娶.会亲友.进人口.裁衣.结网.平治道涂.",
			"j": "移徙.入宅.造庙.作灶.治病.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0115": {
			"y": "祭祀.安碓硙.结网.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0116": {
			"y": "嫁娶.祭祀.沐浴.裁衣.出行.理发.移徙.捕捉.畋猎.放水.入宅.除服.成服.启攒.安葬.移柩.入殓.",
			"j": "造屋.开市.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0117": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "嫁娶.开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0118": {
			"y": "纳采.订盟.祭祀.求嗣.出火.塑绘.裁衣.会亲友.入学.拆卸.扫舍.造仓.挂匾.掘井.开池.结网.栽种.纳畜.破土.修坟.立碑.安葬.入殓.",
			"j": "祈福.嫁娶.造庙.安床.谢土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0119": {
			"y": "入殓.除服.成服.移柩.启攒.安葬.修坟.立碑.",
			"j": "开市.伐木.嫁娶.作梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0120": {
			"y": "祭祀.作灶.入殓.除服.余事勿取.",
			"j": "开市.安床.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0121": {
			"y": "塑绘.开光.沐浴.冠笄.会亲友.作灶.放水.造畜椆栖.",
			"j": "嫁娶.入殓.安葬.出行.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0122": {
			"y": "祭祀.沐浴.祈福.斋醮.订盟.纳采.裁衣.拆卸.起基.竖柱.上梁.安床.入殓.除服.成服.移柩.启攒.挂匾.求嗣.出行.合帐.造畜椆栖.",
			"j": "开仓.嫁娶.移徙.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0123": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0124": {
			"y": "沐浴.解除.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.移徙.入宅.除服.成服.移柩.破土.启攒.安葬.扫舍.修坟.伐木.纳财.交易.立券.",
			"j": "作灶.祭祀.上梁.出行.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0125": {
			"y": "出行.嫁娶.订盟.纳采.入殓.安床.启攒.安葬.祭祀.裁衣.会亲友.进人口.",
			"j": "作灶.掘井.谢土.入宅.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0126": {
			"y": "修饰垣墙.平治道涂.入殓.移柩.余事勿取.",
			"j": "嫁娶.移徙.入宅.开光.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0127": {
			"y": "会亲友.纳采.进人口.修造.动土.竖柱.上梁.祭祀.开光.塑绘.祈福.斋醮.嫁娶.安床.移徙.入宅.安香.纳畜.",
			"j": "出行.治病.安葬.开市.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "定",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0128": {
			"y": "祭祀.会亲友.出行.订盟.纳采.沐浴.修造.动土.祈福.斋醮.嫁娶.拆卸.安床.入殓.移柩.安葬.谢土.赴任.裁衣.竖柱.上梁.伐木.捕捉.栽种.破土.安门.",
			"j": "造屋.开市.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0129": {
			"y": "解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0130": {
			"y": "塑绘.开光.出行.订盟.纳采.除服.成服.嫁娶.纳婿.入殓.移柩.启攒.安葬.立碑.",
			"j": "入宅.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0131": {
			"y": "入殓.除服.成服.移柩.启攒.安葬.立碑.余事勿取.",
			"j": "破土.伐木.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0215": {
			"y": "祭祀.沐浴.开光.塑绘.祈福.求嗣.订盟.纳采.冠笄.裁衣.嫁娶.动土.除服.成服.移柩.破土.启攒.出行.安碓硙.放水.开市.立券.交易.",
			"j": "安葬.上梁.入宅.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0202": {
			"y": "祭祀.出行.沐浴.裁衣.祈福.斋醮.订盟.纳采.嫁娶.安机械.开市.立券.安碓硙.纳畜.",
			"j": "栽种.嫁娶.入殓.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0205": {
			"y": "纳采.会亲友.竖柱.上梁.立券.入殓.移柩.安葬.启攒.",
			"j": "祭祀.移徙.入宅.动土.破土.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0225": {
			"y": "取渔.入殓.除服.成服.移柩.破土.安葬.立碑.",
			"j": "嫁娶.上梁.入宅.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0212": {
			"y": "祭祀.冠笄.嫁娶.拆卸.修造.动土.起基.上梁.造屋.入宅.开市.开池.塞穴.入殓.除服.成服.移柩.安葬.破土.",
			"j": "安床.栽种.治病.作灶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0315": {
			"y": "塑绘.开光.订盟.纳采.裁衣.合帐.冠笄.安机械.会亲友.纳财.开市.立券.交易.安床.竖柱.上梁.结网.栽种.解除.经络.",
			"j": "作灶.出行.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0203": {
			"y": "祭祀.祈福.斋醮.沐浴.安床.安机械.造车器.入殓.移柩.启攒.安葬.立碑.合帐.经络.交易.",
			"j": "作灶.掘井.嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0204": {
			"y": "祭祀.祈福.求嗣.斋醮.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "嫁娶.动土.开光.造屋.破土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0206": {
			"y": "祭祀.祈福.斋醮.出行.开市.立券.动土.移徙.入宅.破土.安葬.",
			"j": "开光.嫁娶.作灶.掘井.纳畜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0207": {
			"y": "会亲友.求嗣.理发.冠笄.结网.捕捉.开光.理发.",
			"j": "开市.动土.安葬.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0208": {
			"y": "祭祀.平治道涂.余事勿取.",
			"j": "嫁娶.祈福.掘井.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0209": {
			"y": "祈福.求嗣.斋醮.纳采.嫁娶.伐木.修造.动土.移徙.入宅.造庙.安机械.开市.入殓.除服.成服.移柩.安葬.破土.谢土.",
			"j": "置产.造屋.合脊.开光.探病.安门.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0210": {
			"y": "入学.习艺.出行.纳采.订盟.嫁娶.会亲友.进人口.牧养.捕捉.入殓.移柩.安葬.启攒.",
			"j": "开光.开市.入宅.动土.造屋.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0211": {
			"y": "祭祀.沐浴.求医.治病.扫舍.破屋.坏垣.解除.余事勿取.",
			"j": "入宅.开市.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0213": {
			"y": "祭祀.结网.入殓.除服.成服.移柩.安葬.破土.",
			"j": "余事勿取.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0214": {
			"y": "塑绘.开光.祈福.求嗣.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.起基.安门.安床.移徙.造仓.结网.纳畜.",
			"j": "伐木.作灶.安葬.取渔.入宅.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0216": {
			"y": "祭祀.祈福.求嗣.酬神.裁衣.安床.立券.交易.入殓.除服.成服.移柩.谢土.启攒.",
			"j": "出行.嫁娶.入宅.动土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0217": {
			"y": "裁衣.合帐.入殓.除服.成服.会亲友.纳财.",
			"j": "祭祀.祈福.移徙.嫁娶.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0218": {
			"y": "祭祀.斋醮.裁衣.合帐.冠笄.订盟.纳采.嫁娶.入宅.安香.谢土.入殓.移柩.破土.立碑.安香.会亲友.出行.祈福.求嗣.立碑.上梁.放水.",
			"j": "掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0219": {
			"y": "安床.合帐.入宅.问名.纳采.求嗣.祭祀.开仓.",
			"j": "斋醮.作灶.安床.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0220": {
			"y": "作灶.平治道涂.",
			"j": "祭祀.祈福.安葬.安门.余事勿取.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "平",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0221": {
			"y": "塑绘.开光.酬神.斋醮.订盟.纳采.裁衣.合帐.拆卸.动土.上梁.安床.安香.造庙.挂匾.会亲友.进人口.出行.修造.纳财.伐木.放水.出火.纳畜.沐浴.安门.",
			"j": "造屋.栽种.安葬.作灶.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0222": {
			"y": "祭祀.祈福.酬神.订盟.纳采.冠笄.裁衣.合帐.嫁娶.安床.移徙.入宅.安香.入殓.移柩.启攒.安葬.解除.取渔.捕捉.伐木.安门.出火.",
			"j": "栽种.动土.开市.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0223": {
			"y": "求医.破屋.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0224": {
			"y": "祈福.求嗣.斋醮.塑绘.开光.订盟.纳采.嫁娶.动土.入宅.安香.移柩.安葬.谢土.出行.沐浴.修造.竖柱.上梁.纳财.破土.解除.安门.放水.",
			"j": "作灶.安床.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0226": {
			"y": "祭祀.求嗣.沐浴.酬神.订盟.纳采.裁衣.合帐.冠笄.安机械.安床.造仓.开池.经络.纳财.开市.立券.交易.结网.取渔.纳畜.捕捉.",
			"j": "安葬.作灶.伐木.作梁.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0227": {
			"y": "祭祀.沐浴.祈福.求嗣.斋醮.订盟.纳采.裁衣.冠笄.开市.立券.交易.纳财.沐浴.除服.谢土.出行.移柩.",
			"j": "入殓.安葬.作灶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0228": {
			"y": "祭祀.祈福.求嗣.入殓.启攒.安葬.移柩.",
			"j": "开光.掘井.针灸.出行.嫁娶.入宅.移徙.作灶.动土.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0229": {
			"y": "安床.解除.裁衣.竖柱.上梁.交易.立券.纳财.纳畜.牧养.入殓.移柩.安葬.启攒.",
			"j": "嫁娶.出行.动土.开渠.入宅.祭祀.掘井.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0305": {
			"y": "嫁娶.造车器.纳采.订盟.祭祀.祈福.安机械.移徙.入宅.开市.立券.破土.安葬.",
			"j": "纳畜.理发.合寿木.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0415": {
			"y": "祭祀.塑绘.开光.订盟.纳采.冠笄.裁衣.安机械.拆卸.修造.动土.安床.经络.开市.",
			"j": "出火.入宅.安葬.伐木.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0301": {
			"y": "嫁娶.安床.开光.出行.祭祀.动土.出火.解除.会亲友.开市.交易.立券.挂匾.入宅.移徙.拆卸.破土.启攒.安葬.",
			"j": "掘井.词讼.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0302": {
			"y": "嫁娶.开光.求嗣.会亲友.安床.牧养.塑绘.针灸.",
			"j": "入宅.移徙.出火.分居.安香.作灶.开市.交易.立券.安葬.动土.伐木.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0303": {
			"y": "作灶.解除.平治道涂.",
			"j": "栽种.出行.祈福.行丧.纳畜.安葬.安门.伐木.作梁.牧养.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0304": {
			"y": "解除.沐浴.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0306": {
			"y": "祈福.斋醮.出行.移徙.入宅.修造.动土.破土.安葬.",
			"j": "纳采.开光.安床.嫁娶.开市.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0307": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "嫁娶.移徙.开市.入宅.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0308": {
			"y": "嫁娶.冠笄.祭祀.出行.会亲友.修造.动土.入殓.破土.",
			"j": "塑绘.开光.造桥.除服.成服.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0309": {
			"y": "开光.求嗣.出行.纳采.冠笄.出火.拆卸.起基.修造.动土.上梁.移徙.造船.开市.交易.立券.纳财.",
			"j": "祈福.嫁娶.安葬.破土.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0310": {
			"y": "理发.冠笄.嫁娶.进人口.栽种.捕捉.针灸.",
			"j": "纳财.开市.安葬.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0311": {
			"y": "开光.祈福.求嗣.出行.解除.伐木.造屋.起基.修造.架马.安门.移徙.入宅.造庙.除服.成服.移柩.谢土.纳畜.牧养.",
			"j": "纳采.动土.开市.交易.安门.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0312": {
			"y": "裁衣.经络.伐木.开柱眼.拆卸.修造.动土.上梁.合脊.合寿木.入殓.除服.成服.移柩.破土.安葬.启攒.修坟.立碑.",
			"j": "祭祀.嫁娶.出行.上梁.掘井.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0313": {
			"y": "祭祀.会亲友.立券.交易.裁衣.合帐.嫁娶.冠笄.进人口.",
			"j": "栽种.动土.安葬.掘井.修坟.探病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0314": {
			"y": "扫舍.塞穴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0316": {
			"y": "祭祀.嫁娶.纳婿.除服.成服.入殓.移柩.",
			"j": "动土.作灶.入宅.开光.安床.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0317": {
			"y": "祈福.求嗣.开光.塑绘.斋醮.订盟.纳采.嫁娶.拆卸.安床.入宅.安香.移柩.修坟.安葬.谢土.栽种.解除.冠笄.裁衣.移徙.修造.动土.竖柱.放水.启攒.立碑.",
			"j": "赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0318": {
			"y": "祭祀.解除.入殓.除服.成服.移柩.启攒.安葬.修坟.立碑.谢土.沐浴.扫舍.捕捉.取渔.结网.畋猎.理发.",
			"j": "安床.嫁娶.作灶.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0319": {
			"y": "破屋.坏垣.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0320": {
			"y": "祭祀.出行.订盟.纳采.裁衣.合帐.冠笄.进人口.动土.安床.作灶.入殓.移柩.安葬.破土.结网.取渔.畋猎.",
			"j": "作梁.造庙.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0321": {
			"y": "祭祀.开光.塑绘.订盟.纳采.合帐.冠笄.拆卸.动土.起基.上梁.入宅.安香.开市.立券.纳财.沐浴.求嗣.出火.竖柱.安门.",
			"j": "造庙.嫁娶.伐木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0322": {
			"y": "祭祀.沐浴.捕捉.栽种.",
			"j": "嫁娶.入宅.移徙.作灶.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0323": {
			"y": "祭祀.开光.塑绘.酬神.斋醮.订盟.纳采.嫁娶.裁衣.动土.起基.出火.拆卸.移徙.入宅.安香.修造.竖柱.上梁.纳畜.牧养.祈福.求嗣.解除.伐木.定磉.造屋.安门.",
			"j": "栽种.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0324": {
			"y": "订盟.纳采.冠笄.拆卸.修造.动土.安床.入殓.除服.成服.移柩.安葬.破土.启攒.造仓.",
			"j": "作灶.开光.嫁娶.开市.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0325": {
			"y": "祈福.开光.塑绘.酬神.订盟.纳采.裁衣.安床.开市.立券.入殓.除服.成服.移柩.启攒.安葬.立碑.赴任.会亲友.出行.交易.竖柱.",
			"j": "作灶.掘井.动土.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0326": {
			"y": "祭祀.扫舍.塞穴.",
			"j": "栽种.作灶.安葬.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0327": {
			"y": "开光.塑绘.裁衣.冠笄.伐木.拆卸.竖柱.上梁.开仓.会亲友.安机械.造仓.造屋.交易.解除.开市.立券.纳财.",
			"j": "出行.嫁娶.入宅.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0328": {
			"y": "冠笄.入殓.除服.成服.移柩.平治道涂.修饰垣墙.",
			"j": "造屋.作灶.治病.探病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0329": {
			"y": "祭祀.嫁娶.祈福.纳采.裁衣.合帐.安床.入宅.安香.入殓.移柩.安葬.谢土.修造.安碓硙.求嗣.会亲友.挂匾.交易.立券.纳财.造仓.放水.",
			"j": "栽种.伐木.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0330": {
			"y": "祭祀.祈福.斋醮.订盟.纳采.裁衣.合帐.拆卸.修造.动土.上梁.起基.移柩.安葬.谢土.沐浴.扫舍.开柱眼.伐木.出火.",
			"j": "安床.开市.立券.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0331": {
			"y": "破屋.坏垣.求医.治病.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0409": {
			"y": "求嗣.出行.解除.订盟.纳采.嫁娶.会亲友.进人口.安床.开市.交易.纳畜.牧养.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "祈福.开市.修造.动土.破土.谢土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0419": {
			"y": "祭祀.进人口.嫁娶.安床.解除.冠笄.出行.裁衣.扫舍.",
			"j": "掘井.动土.破土.安葬.开光.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0404": {
			"y": "祭祀.捕捉.解除.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0509": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "斋醮.开市.嫁娶.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0401": {
			"y": "祭祀.动土.上梁.订盟.纳采.嫁娶.安机械.拆卸.安床.入宅.安香.入殓.移柩.破土.安葬.立碑.谢土.赴任.出行.移徙.祈福.求嗣.解除.造仓.进人口.",
			"j": "开光.出货财.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0402": {
			"y": "祭祀.开光.塑绘.纳采.裁衣.拆卸.安床.起基.动土.竖柱.上梁.移徙.入宅.安香.开市.立券.挂匾.沐浴.出行.求嗣.安门.",
			"j": "嫁娶.栽种.伐木.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0403": {
			"y": "裁衣.合帐.冠笄.嫁娶.纳婿.安床.入殓.纳财.",
			"j": "作灶.开市.安葬.作梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0405": {
			"y": "纳采.嫁娶.出行.开市.立券.纳畜.牧养.出火.移徙.入宅.",
			"j": "祈福.动土.破土.安葬.入殓.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0406": {
			"y": "祭祀.祈福.求嗣.斋醮.冠笄.作灶.纳财.交易.",
			"j": "开光.嫁娶.掘井.安葬.安门.探病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0407": {
			"y": "祭祀.解除.教牛马.出行.余事勿取.",
			"j": "动土.破土.行丧.开光.作梁.安葬.探病.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0408": {
			"y": "沐浴.斋醮.解除.求医.治病.会亲友.造畜椆栖.栽种.理发.扫舍.",
			"j": "开市.嫁娶.移徙.入宅.掘井.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0410": {
			"y": "祭祀.作灶.平治道涂.余事勿取.",
			"j": "嫁娶.安葬.动土.安床.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0411": {
			"y": "造车器.祭祀.祈福.求嗣.斋醮.开市.交易.安机械.雕刻.开光.造屋.合脊.起基.定磉.安门.纳畜.安葬.开生坟.立碑.谢土.斋醮.",
			"j": "入宅.动土.开仓.出货财.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0412": {
			"y": "祭祀.祈福.开光.求嗣.斋醮.纳采.订盟.求医.治病.起基.定磉.造船.取渔.解除.安葬.启攒.谢土.入殓.",
			"j": "开市.动土.掘井.开池.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0413": {
			"y": "祭祀.沐浴.破屋.坏垣.求医.治病.解除.余事勿取.",
			"j": "嫁娶.开市.交易.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0414": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0416": {
			"y": "祭祀.余事勿取.",
			"j": "造庙.嫁娶.安床.余事勿取.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0417": {
			"y": "订盟.纳采.嫁娶.进人口.会亲友.交易.立券.动土.除服.谢土.移柩.破土.启攒.赴任.出行.开市.纳财.栽种.",
			"j": "入殓.安葬.入宅.安床.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0418": {
			"y": "祭祀.祈福.裁衣.合帐.安床.入殓.除服.成服.移柩.破土.启攒.安葬.谢土.立碑.造畜椆栖.",
			"j": "掘井.安门.嫁娶.纳采.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0420": {
			"y": "纳采.开光.求医.治病.动土.上梁.移徙.入宅.",
			"j": "嫁娶.开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0421": {
			"y": "祭祀.会亲友.开市.安床.启攒.安葬.",
			"j": "嫁娶.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0422": {
			"y": "祭祀.作灶.掘井.平治道涂.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0423": {
			"y": "祭祀.斋醮.开市.动土.入殓.破土.安葬.",
			"j": "嫁娶.移徙.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0424": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.移徙.求医.",
			"j": "开市.动土.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0425": {
			"y": "祭祀.求医.治病.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0426": {
			"y": "沐浴.结网.取渔.",
			"j": "嫁娶.入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0427": {
			"y": "",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0428": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0429": {
			"y": "嫁娶.开光.出行.出火.拆卸.进人口.开市.立券.交易.挂匾.入宅.移徙.安床.栽种.",
			"j": "祈福.入殓.祭祀.作灶.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0430": {
			"y": "嫁娶.出行.合帐.冠笄.安床.除服.成服.作灶.交易.立券.入殓.移柩.破土.安葬.",
			"j": "词讼.开光.开市.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0609": {
			"y": "嫁娶.订盟.纳采.冠笄.会亲友.安机械.造车器.祭祀.出行.纳财.入宅.安香.出火.入学.塑绘.开光.拆卸.起基.修造.动土.牧养.栽种.安门.作厕.",
			"j": "行丧.伐木.作梁.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0501": {
			"y": "出行.修饰垣墙.造畜椆栖.教牛马.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0502": {
			"y": "祭祀.祈福.开光.求嗣.解除.伐木.出火.入宅.移徙.安床.拆卸.修造.动土.造畜椆栖.",
			"j": "嫁娶.纳财.安葬.出行.开市.立券.作灶.栽种.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0503": {
			"y": "纳采.嫁娶.开光.出行.理发.会亲友.开市.安床.栽种.牧养.入殓.移柩.启攒.",
			"j": "谢土.祈福.上梁.作灶.斋醮.修造.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0504": {
			"y": "祭祀.平治道涂.解除.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0505": {
			"y": "祭祀.沐浴.移徙.破土.安葬.扫舍.平治道涂.",
			"j": "祈福.嫁娶.入宅.安床.作灶.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0506": {
			"y": "祭祀.祈福.斋醮.求嗣.安机械.纳畜.移徙.入宅.安机械.塑绘.开光.起基.竖柱.上梁.作灶.安门.安香.出火.造屋.启攒.安葬.",
			"j": "动土.破土.嫁娶.嫁娶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0507": {
			"y": "嫁娶.纳采.订盟.斋醮.开光.祭祀.祈福.求医.治病.会亲友.动土.解除.捕捉.纳畜.牧养.入殓.破土.安葬.",
			"j": "移徙.入宅.造屋.架马.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0508": {
			"y": "祭祀.沐浴.解除.破屋.坏垣.余事勿取.",
			"j": "行丧.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0510": {
			"y": "开市.交易.立券.安机械.会亲友.开光.求医.治病.造屋.起基.修造.动土.定磉.竖柱.上梁.安门.作灶.放水.作厕.开池.栽种.牧养.造畜椆栖.破土.安葬.立碑.",
			"j": "嫁娶.出火.移徙.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0511": {
			"y": "栽种.捕捉.畋猎.余事勿取.",
			"j": "开市.动土.祭祀.斋醮.安葬.探病.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0512": {
			"y": "嫁娶.祭祀.祈福.求嗣.斋醮.订盟.纳采.解除.出行.动土.破土.习艺.针灸.理发.会亲友.起基.修造.动土.竖柱.定磉.安床.拆卸.纳畜.牧养.放水.破土.除服.成服.修坟.立碑.",
			"j": "开市.入宅.探病.出火.造屋.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0513": {
			"y": "余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0514": {
			"y": "塞穴.断蚁.结网.余事勿取.",
			"j": "破土.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0515": {
			"y": "开光.出行.纳采.嫁娶.伐木.架马.出火.拆卸.移徙.入宅.造庙.造桥.造船.造畜椆栖.开市.入殓.除服.成服.移柩.安葬.",
			"j": "",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0516": {
			"y": "进人口.牧养.置产.塞穴.结网.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0517": {
			"y": "开光.出行.嫁娶.",
			"j": "会亲友.进人口.修造.动土.起基.移徙.开市.纳畜.入殓.除服.成服.移柩.破土.安葬.修坟.立碑.会亲友.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0518": {
			"y": "嫁娶.纳采.出行.祭祀.祈福.开市.动土.移徙.入宅.破土.安葬.",
			"j": "安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0519": {
			"y": "嫁娶.纳采.求医.治病.修造.动土.移徙.入宅.破土.安葬.",
			"j": "开市.开光.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0520": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0521": {
			"y": "嫁娶.纳采.祭祀.祈福.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "祈福.斋醮.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0522": {
			"y": "纳采.祭祀.祈福.开市.求医.治病.动土.纳畜.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0523": {
			"y": "嫁娶.纳采.出行.移徙.入宅.",
			"j": "动土.破土.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0524": {
			"y": "订盟.纳采.祭祀.动土.破土.交易.立券.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0525": {
			"y": "嫁娶.裁衣.祭祀.出行.安床.作灶.移徙.入宅.破土.安葬.",
			"j": "赴任.捕捉.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0526": {
			"y": "塞穴.结网.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0527": {
			"y": "嫁娶.订盟.纳采.出行.祭祀.祈福.斋醮.动土.上梁.破土.安葬.",
			"j": "移徙.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0528": {
			"y": "订盟.纳采.会亲友.安床.作灶.造畜椆栖.",
			"j": "开市.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0529": {
			"y": "沐浴.平治道涂.扫舍.入殓.移柩.破土.启攒.安葬.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0530": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.出火.拆卸.动土.上梁.进人口.入宅.移徙.安床.安门.开市.交易.立券.挂匾.栽种.破土.安葬.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0531": {
			"y": "祭祀.开光.出行.解除.塑绘.裁衣.入殓.移柩.破土.启攒.安葬.除服.成服.",
			"j": "嫁娶.上梁.修造.拆卸.架马.入宅.伐木.动土.出火.开柱眼.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0606": {
			"y": "祭祀.祈福.求嗣.斋醮.安香.解除.移徙.入宅.会亲友.求医.治病.动土.破土.开生坟.合寿木.",
			"j": "合帐.上梁.经络.安葬.入殓.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0603": {
			"y": "开市.交易.立券.祭祀.祈福.开光.伐木.进人口.安床.拆卸.修造.动土.栽种.破土.移柩.安葬.",
			"j": "入宅.移徙.理发.出火.嫁娶.出行.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0608": {
			"y": "祭祀.交易.纳财.",
			"j": "斋醮.开渠.上梁.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0706": {
			"y": "祭祀.修饰垣墙.平治道涂.",
			"j": "开市.动土.破土.嫁娶.修造.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0601": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0602": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.拆卸.动土.上梁.出火.进人口.入宅.移徙.安床.栽种.纳畜.牧养.竖柱.安门.修造.解除.会亲友.",
			"j": "",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0604": {
			"y": "结网.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0605": {
			"y": "祭祀.作灶.余事勿取.",
			"j": "开市.安葬.破土.修坟.掘井.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0607": {
			"y": "嫁娶.冠笄.修造.动土.作灶.移徙.入宅.补垣.塞穴.纳畜.牧养.架马.修造.动土.起基.定磉.开池.造船.",
			"j": "祈福.开光.掘井.开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0610": {
			"y": "开光.求嗣.出行.冠笄.嫁娶.伐木.架马.开柱眼.修造.移徙.入宅.开市.交易.立券.出行.安香.出火.挂匾.起基.修造.开生坟.合寿木.入殓.除服.成服.移柩.安葬.",
			"j": "安床.出货财.作灶.动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0611": {
			"y": "祭祀.沐浴.理发.嫁娶.作灶.整手足甲.扫舍.修饰垣墙.平治道涂.",
			"j": "斋醮.出行.治病.合寿木.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0612": {
			"y": "安机械.移徙.入宅.出行.祭祀.祈福.斋醮.纳采.订盟.安香.出火.解除.会亲友.修造.动土.拆卸.起基.定磉.移徙.入宅.造屋.安床.修造.破土.安葬.入殓.立碑.",
			"j": "开市.伐木.作梁.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0613": {
			"y": "祭祀.沐浴.捕捉.结网.畋猎.取渔.余事勿取.",
			"j": "开市.交易.嫁娶.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0614": {
			"y": "破屋.坏垣.求医.治病.畋猎.余事勿取.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0615": {
			"y": "嫁娶.出行.安机械.祭祀.塑绘.开光.治病.经络.安床.结网.塞穴.破土.入殓.",
			"j": "开市.安门.掘井.作灶.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0616": {
			"y": "订盟.纳采.会亲友.进人口.雕刻.拆卸.修造.动土.起基.开市.栽种.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.",
			"j": "",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0617": {
			"y": "祭祀.捕捉.取渔.修饰垣墙.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0618": {
			"y": "嫁娶.纳采.祭祀.祈福.求医.治病.出行.动土.移徙.入宅.",
			"j": "开市.安门.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0619": {
			"y": "裁衣.作灶.移徙.入宅.纳畜.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0620": {
			"y": "祭祀.入殓.移柩.启攒.安葬.",
			"j": "上梁.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0621": {
			"y": "订盟.纳采.出行.祈福.斋醮.安床.会亲友.",
			"j": "移徙.入宅.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0622": {
			"y": "嫁娶.纳采.出行.求医.治病.开市.移徙.入宅.启攒.安葬.",
			"j": "动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0623": {
			"y": "嫁娶.祭祀.沐浴.扫舍.修饰垣墙.",
			"j": "行丧.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0624": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0625": {
			"y": "订盟.纳采.出行.祭祀.祈福.修造.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0626": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0627": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.入殓.破土.安葬.",
			"j": "开光.开市.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0628": {
			"y": "开光.求医.治病.动土.上梁.入殓.破土.安葬.",
			"j": "嫁娶.开光.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0629": {
			"y": "祭祀.栽种.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0630": {
			"y": "嫁娶.开光.祭祀.祈福.求嗣.出行.解除.伐木.入宅.移徙.安床.出火.拆卸.修造.上梁.栽种.移柩.",
			"j": "安葬.开市.交易.立券.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0709": {
			"y": "求医.治病.破屋.坏垣.余事勿取.",
			"j": "嫁娶.出行.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d0809": {
			"y": "嫁娶.冠笄.祭祀.沐浴.普渡.出行.纳财.扫舍.纳畜.赴任.",
			"j": "开市.动土.破土.安床.开仓.上梁.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d0701": {
			"y": "求嗣.嫁娶.纳采.合帐.裁衣.冠笄.伐木.作梁.修造.动土.起基.竖柱.上梁.安门.作灶.筑堤.造畜椆栖.",
			"j": "安葬.出行.祈福.栽种.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0702": {
			"y": "祭祀.解除.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0703": {
			"y": "嫁娶.祭祀.祈福.出火.开光.求嗣.出行.拆卸.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.动土.",
			"j": "安葬.行丧.伐木.作梁.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0704": {
			"y": "开光.求嗣.出行.解除.伐木.出火.拆卸.修造.上梁.起基.入宅.移徙.开市.交易.立券.栽种.牧养.入殓.安葬.除服.成服.",
			"j": "置产.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0705": {
			"y": "祭祀.理发.修饰垣墙.平治道涂.沐浴.整手足甲.扫舍.",
			"j": "出行.安门.修造.嫁娶.上梁.入宅.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0707": {
			"y": "订盟.纳采.祭祀.祈福.开光.安香.出火.立券.安机械.移徙.入宅.竖柱.上梁.会亲友.安床.拆卸.挂匾.牧养.教牛马.",
			"j": "嫁娶.安葬.行丧.破土.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0708": {
			"y": "沐浴.理发.捕捉.入殓.移柩.破土.启攒.安葬.",
			"j": "出火.嫁娶.入宅.作灶.破土.上梁.动土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0710": {
			"y": "纳采.订盟.嫁娶.移徙.入宅.出行.开市.交易.立券.纳财.会亲友.安香.出火.拆卸.造屋.起基.安床.作灶.挂匾.安葬.破土.启攒.立碑.入殓.移柩.",
			"j": "祈福.上梁.开仓.掘井.牧养.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0711": {
			"y": "祭祀.祈福.斋醮.出行.纳采.订盟.安机械.出火.拆卸.修造.动土.起基.移徙.入宅.造庙.入殓.除服.成服.移柩.破土.安葬.谢土.",
			"j": "嫁娶.开市.栽种.合寿木.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0712": {
			"y": "祭祀.进人口.纳财.纳畜.牧养.捕捉.余事勿取.",
			"j": "开市.入宅.安床.动土.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0713": {
			"y": "祭祀.塑绘.开光.求医.治病.嫁娶.会亲友.放水.掘井.牧养.纳畜.开渠.安碓硙.",
			"j": "造屋.入宅.作灶.入学.安葬.行丧.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0714": {
			"y": "祭祀.塞穴.结网.畋猎.余事勿取.",
			"j": "移徙.开市.入宅.嫁娶.开光.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0715": {
			"y": "开市.纳财.祭祀.塑绘.安机械.冠笄.会亲友.裁衣.开仓.经络.纳畜.造畜椆栖.教牛马.牧养.",
			"j": "动土.破土.安葬.治病.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0716": {
			"y": "移徙.入宅.治病.会亲友.祭祀.祈福.斋醮.安香.移徙.嫁娶.造屋.起基.",
			"j": "开市.斋醮.安床.出行.经络.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0717": {
			"y": "塑绘.出行.冠笄.嫁娶.进人口.裁衣.纳婿.造畜椆栖.交易.立券.牧养.开生坟.入殓.除服.成服.移柩.安葬.启攒.",
			"j": "",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0718": {
			"y": "祭祀.冠笄.嫁娶.捕捉.结网.畋猎.取渔.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0719": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0720": {
			"y": "纳采.祭祀.祈福.解除.动土.破土.安葬.",
			"j": "嫁娶.移徙.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0721": {
			"y": "祭祀.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0722": {
			"y": "嫁娶.纳采.开市.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "祭祀.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0723": {
			"y": "嫁娶.纳采.开市.出行.动土.上梁.移徙.入宅.破土.安葬.",
			"j": "赴任.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0724": {
			"y": "祭祀.作灶.纳财.捕捉.",
			"j": "开市.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0725": {
			"y": "嫁娶.开市.立券.祭祀.祈福.动土.移徙.入宅.",
			"j": "造庙.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0726": {
			"y": "补垣.塞穴.结网.入殓.除服.成服.移柩.安葬.启攒.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0727": {
			"y": "嫁娶.纳采.出行.祭祀.祈福.解除.移徙.入宅.",
			"j": "动土.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0728": {
			"y": "嫁娶.祭祀.祈福.斋醮.治病.破土.安葬.",
			"j": "开市.入宅.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0729": {
			"y": "嫁娶.出行.开市.安床.入殓.启攒.安葬.",
			"j": "祈福.动土.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0730": {
			"y": "嫁娶.祭祀.裁衣.结网.冠笄.沐浴.",
			"j": "开仓.出货财.置产.安葬.动土.破土.掘井.栽种.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0731": {
			"y": "入宅.移徙.安床.开光.祈福.求嗣.进人口.开市.交易.立券.出火.拆卸.修造.动土.",
			"j": "嫁娶.破土.置产.栽种.安葬.修坟.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0818": {
			"y": "塑绘.开光.解除.订盟.纳采.嫁娶.出火.修造.动土.移徙.入宅.拆卸.起基.安门.分居.开市.交易.立券.纳财.纳畜.牧养.",
			"j": "",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d0808": {
			"y": "嫁娶.普渡.祭祀.祈福.补垣.塞穴.断蚁.筑堤.入殓.除服.成服.安葬.",
			"j": "动土.破土.掘井.开光.上梁.词讼.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d0804": {
			"y": "嫁娶.开光.出行.祈福.求嗣.解除.拆卸.动土.修造.进人口.开市.交易.立券.挂匾.入宅.移徙.安床.栽种.纳畜.入殓.移柩.安葬.",
			"j": "",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d0814": {
			"y": "祭祀.捕捉.畋猎.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.启攒.",
			"j": "嫁娶.纳采.订盟.开市.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d0803": {
			"y": "嫁娶.开光.出行.理发.作梁.出火.拆卸.修造.开市.交易.立券.挂匾.动土.入宅.移徙.安床.栽种.",
			"j": "伐木.祭祀.纳畜.祭祀.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d0802": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d0819": {
			"y": "祈福.出行.订盟.纳采.嫁娶.裁衣.动土.安床.放水.开市.掘井.交易.立券.栽种.开渠.除服.成服.移柩.破土.",
			"j": "",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d0909": {
			"y": "余事勿取.",
			"j": "探病.余事勿取.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d0801": {
			"y": "祭祀.解除.沐浴.整手足甲.入殓.移柩.破土.启攒.安葬.",
			"j": "嫁娶.入宅.移徙.作灶.开市.交易.安门.栽种.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d0805": {
			"y": "祭祀.作灶.纳财.栽种.纳畜.进人口.",
			"j": "安葬.经络.修坟.破土.开市.安床.启攒.立碑.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d0806": {
			"y": "祭祀.祈福.求嗣.开光.开市.牧养.理发.",
			"j": "嫁娶.出行.安葬.入殓.入宅.作灶.冠笄.上梁.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d0807": {
			"y": "嫁娶.订盟.纳采.祭祀.斋醮.普渡.解除.出行.会亲友.开市.纳财.修造.动土.竖柱.上梁.开光.开仓.出货财.纳畜.牧养.开池.破土.启攒.",
			"j": "出火.入宅.造屋.安门.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d0810": {
			"y": "祭祀.沐浴.理发.整手足甲.冠笄.解除.入殓.移柩.破土.启攒.安葬.",
			"j": "嫁娶.出行.入宅.开市.安门.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0811": {
			"y": "塑绘.冠笄.嫁娶.会亲友.进人口.经络.裁衣.栽种.纳畜.牧养.补垣.塞穴.捕捉.",
			"j": "祈福.开市.动土.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d0812": {
			"y": "出行.沐浴.订盟.纳采.裁衣.竖柱.上梁.移徙.纳畜.牧养.",
			"j": "嫁娶.安门.动土.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d0813": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.普渡.开光.安香.出火.移徙.入宅.竖柱.修造.动土.竖柱.上梁.起基.造屋.安门.造庙.造桥.破土.启攒.安葬.",
			"j": "开市.立券.纳财.作灶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d0815": {
			"y": "破屋.坏垣.治病.余事勿取.",
			"j": "行丧.安葬.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d0816": {
			"y": "祈福.斋醮.出行.冠笄.嫁娶.雕刻.开柱眼.入宅.造桥.开市.交易.立券.纳财.入殓.除服.成服.移柩.破土.安葬.启攒.",
			"j": "动土.破土.订盟.安床.开池.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d0817": {
			"y": "祈福.求嗣.解除.订盟.纳采.动土.起基.放水.造仓.开市.纳畜.牧养.开生坟.入殓.除服.成服.移柩.破土.安葬.",
			"j": "",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d0820": {
			"y": "嫁娶.祭祀.祈福.斋醮.作灶.移徙.入宅.",
			"j": "动土.破土.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d0821": {
			"y": "嫁娶.出行.纳畜.祭祀.入殓.启攒.安葬.",
			"j": "作灶.动土.破土.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d0822": {
			"y": "订盟.纳采.祭祀.祈福.修造.动土.上梁.破土.安葬.",
			"j": "嫁娶.开市.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d0823": {
			"y": "订盟.纳采.出行.会亲友.修造.上梁.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d0824": {
			"y": "沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.祈福.余事勿取.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d0825": {
			"y": "嫁娶.祭祀.祈福.斋醮.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d0826": {
			"y": "捕捉.结网.入殓.破土.安葬.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d0827": {
			"y": "沐浴.治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d0828": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.移徙.入宅.启攒.安葬.",
			"j": "动土.破土.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d0829": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.求医.治病.动土.移徙.入宅.破土.安葬.",
			"j": "开光.针灸.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d0830": {
			"y": "订盟.纳采.祭祀.祈福.安机械.作灶.纳畜.",
			"j": "动土.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d0831": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.动土.安床.掘井.破土.启攒.",
			"j": "入宅.作梁.安门.伐木.修造.上梁.入殓.造屋.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d0904": {
			"y": "塑绘.开光.进人口.纳畜.补垣.塞穴.栽种.牧养.",
			"j": "嫁娶.纳财.祈福.安葬.修造.开市.交易.立券.动土.上梁.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d0908": {
			"y": "沐浴.捕捉.入殓.除服.成服.破土.启攒.安葬.",
			"j": "祭祀.嫁娶.安床.开市.入宅.探病.上梁.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d0907": {
			"y": "嫁娶.造车器.安机械.祭祀.祈福.开光.安香.出火.出行.开市.立券.修造.动土.移徙.入宅.破土.安葬.",
			"j": "纳采.订盟.架马.词讼.开渠.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1009": {
			"y": "冠笄.祭祀.沐浴.作灶.理发.整手足甲.扫舍.补垣.塞穴.入殓.破土.启攒.",
			"j": "开光.嫁娶.会亲友.栽种.针灸.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d0901": {
			"y": "嫁娶.祭祀.祈福.求嗣.出行.出火.拆卸.修造.移徙.动土.安床.入殓.破土.安葬.启攒.",
			"j": "造屋.开光.理发.造船.掘井.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d0902": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.上梁.造屋.移徙.安门.纳财.牧养.纳畜.安葬.启攒.入殓.",
			"j": "破土.置产.掘井.动土.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d0903": {
			"y": "祭祀.解除.沐浴.理发.整手足甲.入殓.移柩.破土.安葬.扫舍.",
			"j": "嫁娶.会亲友.进人口.出行.入宅.移徙.赴任.作灶.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d0905": {
			"y": "祭祀.作灶.沐浴.修饰垣墙.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d0906": {
			"y": "祭祀.求嗣.开光.出行.伐木.作梁.出火.解除.拆卸.进人口.修造.动土.起基.安床.栽种.纳畜.入殓.破土.安葬.除服.成服.",
			"j": "嫁娶.移徙.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d0910": {
			"y": "订盟.纳采.祭祀.祈福.安香.出火.修造.动土.上梁.安门.起基.竖柱.上梁.定磉.开池.移徙.入宅.立券.破土.",
			"j": "嫁娶.造庙.造桥.造船.作灶.安葬.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d0911": {
			"y": "开光.求嗣.雕刻.嫁娶.订盟.纳采.出火.拆卸.修造.动土.起基.上梁.放水.移徙.入宅.造仓.造船.开市.开池.纳畜.牧养.挂匾.",
			"j": "行丧.安葬.合寿木.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d0912": {
			"y": "祭祀.嫁娶.捕捉.",
			"j": "开光.动土.破土.开市.修造.入宅.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d0913": {
			"y": "祭祀.普渡.解除.会亲友.捕捉.畋猎.启攒.除服.成服.移柩.",
			"j": "嫁娶.开市.动土.掘井.开池.安葬.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d0914": {
			"y": "祭祀.出行.解除.冠笄.嫁娶.伐木.架马.开柱眼.修造.动土.移徙.入宅.开生坟.合寿木.入殓.移柩.破土.安葬.修坟.",
			"j": "开光.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d0915": {
			"y": "祭祀.祈福.求嗣.出行.沐浴.交易.扫舍.教牛马.",
			"j": "动土.作灶.行丧.安葬.修坟.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d0916": {
			"y": "出行.解除.纳采.冠笄.雕刻.修造.动土.起基.上梁.合脊.安床.移徙.入宅.开市.栽种.作厕.",
			"j": "造庙.安门.行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d0917": {
			"y": "祭祀.沐浴.解除.理发.冠笄.安机械.作灶.造仓.开市.开池.作厕.补垣.塞穴.断蚁.结网.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d0918": {
			"y": "祭祀.沐浴.修饰垣墙.平治道涂.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d0919": {
			"y": "祭祀.会亲友.纳采.嫁娶.开光.塑绘.斋醮.安香.开市.立券.除服.成服.入殓.移柩.安葬.赴任.进人口.出行.裁衣.修造.动土.上梁.经络.交易.",
			"j": "入宅.伐木.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d0920": {
			"y": "祭祀.冠笄.会亲友.拆卸.起基.除服.成服.移柩.启攒.安葬.沐浴.捕捉.开光.塑绘.",
			"j": "作灶.祭祀.入宅.嫁娶.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d0921": {
			"y": "祭祀.沐浴.破屋.坏垣.余事勿取.",
			"j": "移徙.入宅.出行.栽种.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d0922": {
			"y": "祭祀.塑绘.开光.出行.解除.订盟.嫁娶.拆卸.起基.安床.入宅.开市.入殓.除服.成服.移柩.破土.谢土.挂匾.开柱眼.交易.",
			"j": "造桥.冠笄.造屋.掘井.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d0923": {
			"y": "祭祀.赴任.动土.上梁.开光.塑绘.冠笄.拆卸.起基.安床.开市.立券.赴任.经络.",
			"j": "定磉.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d0924": {
			"y": "祭祀.裁衣.冠笄.嫁娶.纳婿.会亲友.除服.成服.移柩.捕捉.进人口.入殓.",
			"j": "移徙.入宅.作灶.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d0925": {
			"y": "祭祀.诸事不宜.",
			"j": "入殓.安葬.开市.交易.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d0926": {
			"y": "祭祀.裁衣.冠笄.嫁娶.安机械.拆卸.动土.起基.移徙.入宅.入殓.启攒.安葬.造仓.经络.",
			"j": "安床.开光.开市.交易.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "闭",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d0927": {
			"y": "祭祀.出行.成服.除服.沐浴.入殓.",
			"j": "动土.冠笄.移徙.入宅.开市.竖柱.上梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "建",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d0928": {
			"y": "祭祀.沐浴.赴任.出行.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "除",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d0929": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "满",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d0930": {
			"y": "沐浴.入殓.移柩.除服.成服.破土.平治道涂.",
			"j": "嫁娶.移徙.入宅.开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "平",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1008": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.出行.求医.治病.出火.移徙.入宅.",
			"j": "开市.开仓.出货财.安床.安门.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1108": {
			"y": "订盟.纳采.纳财.开市.立券.祭祀.祈福.移徙.入宅.出行.造屋.起基.修造.动土.竖柱.上梁.安门.安香.出火.教牛马.会亲友.破土.",
			"j": "嫁娶.安葬.掘井.置产.造船.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲己酉",
			"ts": "碓磨门外正东"
		},
		"d1001": {
			"y": "嫁娶.祭祀.祈福.求嗣.沐浴.出火.出行.拆卸.修造.动土.进人口.开市.交易.立券.入宅.移徙.安床.栽种.纳畜.入殓.安葬.启攒.除服.成服.",
			"j": "",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "定",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1002": {
			"y": "开光.解除.起基.动土.拆卸.上梁.立碑.修坟.安葬.破土.启攒.移柩.",
			"j": "嫁娶.出行.安床.作灶.祭祀.入宅.移徙.出火.进人口.置产.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "执",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1003": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "破",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1004": {
			"y": "嫁娶.祈福.求嗣.出行.出火.拆卸.修造.动土.上梁.开光.进人口.开市.交易.立券.挂匾.安床.入宅.移徙.栽种.伐木.入殓.破土.除服.成服.",
			"j": "",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "危",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1005": {
			"y": "开市.交易.立券.挂匾.祭祀.开光.进人口.入宅.安床.出火.拆卸.修造.动土.栽种.",
			"j": "嫁娶.立碑.出行.伐木.安葬.行丧.移徙.纳畜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "成",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1006": {
			"y": "祭祀.理发.会亲友.进人口.嫁娶.针灸.入殓.移柩.",
			"j": "探病.开渠.安葬.伐木.作灶.入宅.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "收",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1007": {
			"y": "祭祀.立碑.修坟.启攒.除服.成服.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "开",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1010": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.求嗣.置产.求医.治病.开市.交易.立券.会亲友.移徙.竖柱.上梁.造屋.合脊.安门.放水.捕捉.纳畜.",
			"j": "造庙.造船.动土.破土.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1011": {
			"y": "出行.造车器.造畜椆栖.解除.冠笄.裁衣.作梁.雕刻.会亲友.移徙.入宅.安机械.造畜椆栖.开市.扫舍.",
			"j": "嫁娶.动土.破土.修坟.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1012": {
			"y": "沐浴.理发.冠笄.安床.开市.立券.会亲友.交易.纳财.结网.教牛马.",
			"j": "移徙.入宅.出行.祈福.嫁娶.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1013": {
			"y": "祭祀.造畜椆栖.修饰垣墙.平治道涂.余事勿取.",
			"j": "嫁娶.开市.安床.掘井.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1014": {
			"y": "捕捉.结网.入殓.除服.成服.移柩.破土.安葬.启攒.立碑.",
			"j": "嫁娶.祭祀.入宅.造屋.移徙.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1015": {
			"y": "祭祀.祈福.求嗣.斋醮.造庙.出火.安机械.会亲友.开市.交易.立券.纳财.习艺.经络.求医.治病.开池.作厕.畋猎.结网.栽种.牧养.安葬.破土.启攒.",
			"j": "开光.嫁娶.掘井.伐木.作梁.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1016": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1017": {
			"y": "会亲友.嫁娶.订盟.纳采.纳婿.拆卸.修造.动土.起基.竖柱.上梁.安床.会亲友.纳财.",
			"j": "出行.祈福.安葬.作灶.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "危",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1018": {
			"y": "祭祀.塑绘.开光.祈福.斋醮.出行.订盟.纳采.裁衣.嫁娶.拆卸.修造.安床.入宅.安香.入殓.启攒.安葬.谢土.赴任.会亲友.进人口.出行.移徙.上梁.经络.开市.交易.立券.纳财.",
			"j": "开仓.冠笄.伐木.作梁.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1019": {
			"y": "祭祀.作灶.入殓.除服.成服.畋猎.",
			"j": "栽种.动土.安葬.开市.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1020": {
			"y": "祭祀.祈福.斋醮.沐浴.竖柱.订盟.纳采.嫁娶.拆卸.入宅.移柩.启攒.谢土.赴任.出火.纳畜.",
			"j": "作灶.入殓.安葬.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1021": {
			"y": "嫁娶.祭祀.安机械.入殓.破土.安葬.",
			"j": "动土.上梁.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1022": {
			"y": "作灶.造畜椆栖.",
			"j": "行丧.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1023": {
			"y": "沐浴.理发.入学.习艺.进人口.",
			"j": "嫁娶.入宅.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1024": {
			"y": "开光.针灸.会亲友.启攒.安葬.",
			"j": "开市.动土.破土.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1025": {
			"y": "祭祀.结网.造畜椆栖.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1026": {
			"y": "入殓.除服.成服.移柩.破土.启攒.安葬.",
			"j": "移徙.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "定",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1027": {
			"y": "嫁娶.订盟.纳采.出行.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "开市.赴任.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "执",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1028": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "余事勿取.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "破",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1029": {
			"y": "订盟.纳采.会亲友.安机械.纳财.牧养.",
			"j": "祈福.安葬.",
			"c": "生肖冲猪",
			"s": "煞东",
			"ch": "危",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1030": {
			"y": "嫁娶.订盟.纳采.出行.开市.祭祀.祈福.动土.移徙.入宅.破土.安葬.",
			"j": "斋醮.安门.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "成",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1031": {
			"y": "祭祀.塞穴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "收",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1107": {
			"y": "纳采.移徙.纳财.开市.交易.立券.纳财.入宅.修造.动土.竖柱.起基.定磉.造庙.安香.出火.修饰垣墙.平治道涂.会亲友.出行.开池.作厕.",
			"j": "开仓.造屋.造桥.祭祀.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲戊申",
			"ts": "占门炉外东北"
		},
		"d1117": {
			"y": "祭祀.会亲友.嫁娶.沐浴.修造.动土.祈福.开光.塑绘.出行.订盟.纳采.裁衣.入殓.除服.成服.移柩.启攒.赴任.竖柱.上梁.纳财.扫舍.栽种.纳畜.伐木.",
			"j": "入宅.作灶.安床.开仓.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲戊午",
			"ts": "占门碓外东南"
		},
		"d1104": {
			"y": "祭祀.祈福.求嗣.开光.出行.解除.移徙.伐木.安床.纳畜.出火.拆卸.",
			"j": "安葬.修坟.作灶.破土.造庙.动土.嫁娶.纳采.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "除",
			"zc": "正冲正冲乙巳",
			"ts": "厨灶床外东北"
		},
		"d1114": {
			"y": "祭祀.祈福.求嗣.斋醮.沐浴.冠笄.出行.理发.拆卸.解除.起基.动土.定磉.安碓硙.开池.掘井.扫舍.除服.成服.移柩.启攒.立碑.谢土.",
			"j": "移徙.入宅.安门.作梁.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲乙卯",
			"ts": "厨灶门外东南"
		},
		"d1113": {
			"y": "捕捉.畋猎.会亲友.解除.入殓.除服.成服.移柩.余事勿取.",
			"j": "安床.安门.破土.修坟.安葬.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲甲寅",
			"ts": "碓磨炉外东南"
		},
		"d1118": {
			"y": "理发.会亲友.补垣.塞穴.结网.",
			"j": "嫁娶.入宅.安门.移徙.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲己未",
			"ts": "碓磨厕外东南"
		},
		"d1115": {
			"y": "嫁娶.冠笄.安床.纳采.会亲友.塞穴.捕捉.置产.造畜椆栖.",
			"j": "开光.掘井.安葬.谢土.修坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲丙辰",
			"ts": "仓库栖外东南"
		},
		"d1217": {
			"y": "祭祀.求医.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲戊子",
			"ts": "占门碓房内北"
		},
		"d1101": {
			"y": "祭祀.祈福.求嗣.开光.开市.出行.解除.动土.起基.置产.栽种.",
			"j": "嫁娶.作灶.修坟.安门.入宅.立碑.安葬.安床.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "开",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		},
		"d1102": {
			"y": "祭祀.解除.裁衣.理发.安床.作灶.造畜椆栖.放水.筑堤.补垣.塞穴.整手足甲.扫舍.",
			"j": "嫁娶.开光.会亲友.掘井.安门.栽种.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "闭",
			"zc": "正冲正冲癸卯",
			"ts": "占大门外东北"
		},
		"d1103": {
			"y": "祭祀.出行.裁衣.冠笄.会亲友.造畜椆栖.嫁娶.竖柱.上梁.移徙.纳财.纳畜.",
			"j": "动土.伐木.作梁.行丧.安葬.开生坟.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "建",
			"zc": "正冲正冲甲辰",
			"ts": "碓磨栖外东北"
		},
		"d1105": {
			"y": "开市.交易.立券.纳财.会亲友.开光.理发.入殓.移柩.安葬.启攒.",
			"j": "嫁娶.作灶.出火.出行.入宅.移徙.安床.祈福.上梁.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "满",
			"zc": "正冲正冲丙午",
			"ts": "仓库碓外东北"
		},
		"d1106": {
			"y": "造畜椆栖.平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "平",
			"zc": "正冲正冲丁未",
			"ts": "房床厕外东北"
		},
		"d1109": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.塑绘.开光.移徙.安床.伐木.作梁.捕捉.畋猎.结网.求医.治病.解除.安葬.除服.成服.移柩.入殓.立碑.谢土.",
			"j": "开市.造庙.动土.破土.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲庚戌",
			"ts": "厨灶栖外正东"
		},
		"d1110": {
			"y": "破屋.坏垣.祭祀.余事勿取.",
			"j": "嫁娶.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲辛亥",
			"ts": "仓库床外正东"
		},
		"d1111": {
			"y": "嫁娶.纳采.订盟.祭祀.冠笄.裁衣.伐木.作梁.架马.定磉.开柱眼.作灶.移徙.安床.畋猎.结网.开池.作厕.除服.成服.启攒.入殓.移柩.安葬.",
			"j": "造屋.造船.动土.破土.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲壬子",
			"ts": "房床碓外正东"
		},
		"d1112": {
			"y": "纳采.订盟.祭祀.祈福.求嗣.斋醮.开光.会亲友.解除.入学.纳财.交易.立券.经络.起基.动土.定磉.开池.栽种.纳畜.牧养.破土.入殓.立碑.安葬.",
			"j": "嫁娶.开市.入宅.出火.移徙.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲癸丑",
			"ts": "占门厕外正东"
		},
		"d1116": {
			"y": "祭祀.沐浴.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲丁巳",
			"ts": "占房床外东南"
		},
		"d1119": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.拆卸.修造.动土.起基.安床.移徙.入宅.安香.除服.成服.入殓.移柩.安葬.谢土.赴任.会亲友.进人口.出行.竖柱.上梁.经络.开市.交易.立券.纳财.开仓.",
			"j": "作灶.治病.伐木.作梁.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲庚申",
			"ts": "厨灶炉外正南"
		},
		"d1120": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.拆卸.修造.动土.起基.安床.移徙.入宅.安香.入殓.移柩.安葬.谢土.赴任.进人口.会亲友.",
			"j": "作灶.治病.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲辛酉",
			"ts": "仓库门外正南"
		},
		"d1121": {
			"y": "祭祀.塑绘.开光.订盟.纳采.嫁娶.安床.进人口.入殓.除服.成服.移柩.启攒.安葬.立碑.",
			"j": "开市.交易.破土.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲壬戌",
			"ts": "房床栖外正南"
		},
		"d1122": {
			"y": "祭祀.解除.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲癸亥",
			"ts": "占门床外正南"
		},
		"d1123": {
			"y": "祭祀.解除.祈福.开光.塑绘.斋醮.订盟.纳采.裁衣.冠笄.拆卸.修造.动土.入殓.除服.成服.移柩.启攒.安床.赴任.出行.移徙.竖柱.上梁.伐木.栽种.破土.安葬.纳畜.",
			"j": "造屋.治病.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲甲子",
			"ts": "占碓磨外正南"
		},
		"d1124": {
			"y": "祭祀.祈福.订盟.纳采.裁衣.合帐.冠笄.安机械.安床.造畜椆栖.入殓.移柩.启攒.安葬.谢土.除服.成服.会亲友.竖柱.上梁.经络.开市.交易.立券.纳财.纳畜.筑堤.",
			"j": "嫁娶.入宅.治病.赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲乙丑",
			"ts": "厨灶厕外西南"
		},
		"d1125": {
			"y": "沐浴.扫舍.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "收",
			"zc": "正冲正冲丙寅",
			"ts": "仓库炉外西南"
		},
		"d1126": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "开",
			"zc": "正冲正冲丁卯",
			"ts": "房床门外西南"
		},
		"d1127": {
			"y": "祈福.斋醮.出行.订盟.纳采.入殓.移柩.破土.安葬.立碑.结网.",
			"j": "入宅.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "闭",
			"zc": "正冲正冲戊辰",
			"ts": "门鸡栖外西南"
		},
		"d1128": {
			"y": "祭祀.沐浴.出行.冠笄.进人口.余事勿取.",
			"j": "嫁娶.动土.安葬.作灶.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "建",
			"zc": "正冲正冲己巳",
			"ts": "碓磨床外西南"
		},
		"d1129": {
			"y": "祭祀.祈福.斋醮.塑绘.开光.订盟.纳采.裁衣.冠笄.嫁娶.拆卸.入宅.安香.入殓.移柩.理发.安葬.修坟.谢土.赴任.移徙.沐浴.治病.破土.启攒.整手足甲.入学.作梁.",
			"j": "开市.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "除",
			"zc": "正冲正冲庚午",
			"ts": "厨灶碓外西南"
		},
		"d1130": {
			"y": "诸事不宜.",
			"j": "诸事不宜.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "满",
			"zc": "正冲正冲辛未",
			"ts": "仓库厕外西南"
		},
		"d1213": {
			"y": "纳财.开市.交易.立券.会亲友.进人口.经络.祭祀.祈福.安香.出火.求医.治病.修造.动土.拆卸.扫舍.安床.栽种.牧养.开生坟.合寿木.入殓.安葬.启攒.",
			"j": "嫁娶.祈福.出火.移徙.入宅.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲甲申",
			"ts": "碓磨炉外正北"
		},
		"d1203": {
			"y": "开光.解除.拆卸.修造.动土.安床.纳畜.安葬.启攒.入殓.",
			"j": "嫁娶.开市.出火.栽种.破土.动土.入宅.移徙.安香.分居.掘井.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "执",
			"zc": "正冲正冲甲戌",
			"ts": "碓磨栖外正西"
		},
		"d1210": {
			"y": "纳采.订盟.祭祀.沐浴.冠笄.合帐.裁衣.修造.动土.拆卸.移徙.入宅.安门.开仓.筑堤.作厕.栽种.纳畜.补垣.塞穴.",
			"j": "嫁娶.祈福.开光.掘井.安葬.行丧.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲辛巳",
			"ts": "仓库床外西北"
		},
		"d1230": {
			"y": "祭祀.祈福.求嗣.斋醮.开光.入学.订盟.冠笄.伐木.修造.动土.起基.放水.交易.开池.",
			"j": "造桥.安门.理发.造庙.栽种.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲辛丑",
			"ts": "仓库厕房内东"
		},
		"d1218": {
			"y": "祭祀.祈福.斋醮.出行.冠笄.安机械.移徙.入宅.安香.安床.除服.成服.移柩.启攒.",
			"j": "开光.栽种.治病.安门.作灶.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "危",
			"zc": "正冲正冲己丑",
			"ts": "碓磨厕房内北"
		},
		"d1208": {
			"y": "祭祀.沐浴.作灶.纳财.捕捉.畋猎.安床.扫舍.",
			"j": "开市.斋醮.破土.安葬.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲己卯",
			"ts": "占门炉外西北"
		},
		"d1220": {
			"y": "祭祀.沐浴.安床.纳财.畋猎.捕捉.",
			"j": "开市.破土.",
			"c": "生肖冲兔",
			"s": "煞東",
			"ch": "收",
			"zc": "正冲正冲辛卯",
			"ts": "仓库门房内北"
		},
		"d1201": {
			"y": "开市.交易.立券.挂匾.纳财.开光.出行.入宅.移徙.安床.纳畜.入殓.移柩.安葬.",
			"j": "栽种.破土.置产.祭祀.嫁娶.动土.作灶.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "平",
			"zc": "正冲正冲壬申",
			"ts": "房床厕外正南"
		},
		"d1202": {
			"y": "嫁娶.祭祀.祈福.求嗣.开光.出行.解除.出火.出行.拆卸.进人口.入宅.移徙.安床.栽种.动土.修造.纳畜.入殓.安葬.立碑.除服.成服.",
			"j": "",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "定",
			"zc": "正冲正冲癸酉",
			"ts": "占门厕外正南"
		},
		"d1204": {
			"y": "破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "破",
			"zc": "正冲正冲乙亥",
			"ts": "厨灶床外正西"
		},
		"d1205": {
			"y": "嫁娶.祭祀.开光.出火.出行.拆卸.修造.动土.解除.开市.交易.立券.挂匾.纳财.入宅.移徙.安床.栽种.纳畜.",
			"j": "探病.安葬.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "危",
			"zc": "正冲正冲丙子",
			"ts": "仓库碓外西北"
		},
		"d1206": {
			"y": "祭祀.祈福.求嗣.开光.解除.理发.会亲友.栽种.纳畜.牧养.安葬.修坟.立碑.启攒.",
			"j": "入宅.作灶.词讼.移徙.出行.赴任.",
			"c": "生肖冲牛",
			"s": "煞西",
			"ch": "成",
			"zc": "正冲正冲丁丑",
			"ts": "房床厕外西北"
		},
		"d1207": {
			"y": "纳采.订盟.移徙.入宅.出行.安机械.会亲友.祭祀.祈福.斋醮.开光.安香.出火.解除.求医.针灸.治病.造屋.起基.修造.安门.造船.纳畜.牧养.移柩.入殓.启攒.谢土.修坟.立碑.",
			"j": "嫁娶.动土.安床.造桥.掘井.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲戊寅",
			"ts": "占门炉外西北"
		},
		"d1209": {
			"y": "祈福.斋醮.纳采.订盟.解除.架马.开柱眼.修造.动土.起基.上梁.归岫.造屋.合脊.掘井.除服.成服.破土.栽种.",
			"j": "移徙.开市.入宅.安葬.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲庚辰",
			"ts": "厨灶栖外西北"
		},
		"d1211": {
			"y": "合帐.裁衣.教牛马.余事勿取.",
			"j": "入宅.动土.破土.嫁娶.作灶.造船.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲壬午",
			"ts": "房床碓外正北"
		},
		"d1212": {
			"y": "纳采.订盟.嫁娶.祭祀.祈福.安香.出火.出行.会亲友.经络.求医.治病.解除.拆卸.起基.修造.动土.定磉.扫舍.栽种.牧养.造畜椆栖.",
			"j": "斋醮.作梁.掘井.行丧.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲癸未",
			"ts": "占门厕外正北"
		},
		"d1214": {
			"y": "祭祀.入殓.移柩.余事勿取.",
			"j": "入宅.修造.动土.破土.安门.上梁.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲乙酉",
			"ts": "厨灶门外正北"
		},
		"d1215": {
			"y": "塑绘.开光.订盟.纳采.裁衣.冠笄.拆卸.修造.安床.入宅.出火.安葬.谢土.赴任.",
			"j": "掘井.伐木.斋醮.作灶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲丙戌",
			"ts": "仓库栖外正北"
		},
		"d1216": {
			"y": "祭祀.塑绘.开光.裁衣.冠笄.嫁娶.纳采.拆卸.修造.动土.竖柱.上梁.安床.移徙.入宅.安香.结网.捕捉.畋猎.伐木.进人口.放水.",
			"j": "出行.安葬.修坟.开市.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲丁亥",
			"ts": "占房床房内北"
		},
		"d1219": {
			"y": "塑绘.斋醮.出行.拆卸.解除.修造.移徙.造船.入殓.除服.成服.移柩.启攒.修坟.立碑.谢土.",
			"j": "",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲庚寅",
			"ts": "厨灶炉房内北"
		},
		"d1221": {
			"y": "订盟.纳采.祭祀.祈福.修造.动土.上梁.破土.",
			"j": "嫁娶.作灶.",
			"c": "生肖冲龙",
			"s": "煞北",
			"ch": "开",
			"zc": "正冲正冲壬辰",
			"ts": "房床栖房内南"
		},
		"d1222": {
			"y": "出行.沐浴.理发.补垣.塞穴.",
			"j": "入宅.安葬.",
			"c": "生肖冲蛇",
			"s": "煞西",
			"ch": "闭",
			"zc": "正冲正冲癸巳",
			"ts": "占门床房内南"
		},
		"d1223": {
			"y": "教牛马.余事勿取.",
			"j": "入宅.动土.破土.余事勿取.",
			"c": "生肖冲马",
			"s": "煞南",
			"ch": "建",
			"zc": "正冲正冲甲午",
			"ts": "占碓磨房内南"
		},
		"d1224": {
			"y": "嫁娶.出行.求医.治病.祭祀.祈福.上梁.纳畜.",
			"j": "开市.安葬.",
			"c": "生肖冲羊",
			"s": "煞東",
			"ch": "除",
			"zc": "正冲正冲乙未",
			"ts": "厨灶厕房内南"
		},
		"d1225": {
			"y": "开市.立券.开光.解除.安机械.上梁.启攒.安葬.",
			"j": "嫁娶.祈福.",
			"c": "生肖冲猴",
			"s": "煞北",
			"ch": "满",
			"zc": "正冲正冲丙申",
			"ts": "仓库炉房内南"
		},
		"d1226": {
			"y": "平治道涂.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鸡",
			"s": "煞西",
			"ch": "平",
			"zc": "正冲正冲丁酉",
			"ts": "房床门房内南"
		},
		"d1227": {
			"y": "求嗣.斋醮.塑绘.订盟.纳采.出火.拆卸.修造.动土.造桥.安机械.栽种.纳畜.牧养.入殓.除服.成服.移柩.破土.安葬.",
			"j": "开市.嫁娶.",
			"c": "生肖冲狗",
			"s": "煞南",
			"ch": "定",
			"zc": "正冲正冲戊戌",
			"ts": "门鸡栖房内东"
		},
		"d1228": {
			"y": "嫁娶.订盟.纳采.祭祀.祈福.修造.动土.移徙.入宅.",
			"j": "开市.安葬.",
			"c": "生肖冲猪",
			"s": "煞東",
			"ch": "执",
			"zc": "正冲正冲己亥",
			"ts": "碓磨床房内东"
		},
		"d1229": {
			"y": "治病.破屋.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲鼠",
			"s": "煞北",
			"ch": "破",
			"zc": "正冲正冲庚子",
			"ts": "厨灶碓房内东"
		},
		"d1231": {
			"y": "解除.坏垣.余事勿取.",
			"j": "诸事不宜.",
			"c": "生肖冲虎",
			"s": "煞南",
			"ch": "成",
			"zc": "正冲正冲壬寅",
			"ts": "房床炉房内东"
		}
	};


/***/ }
/******/ ]);
//# sourceMappingURL=lunar.js.map