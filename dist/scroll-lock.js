(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["scroll-lock"] = factory();
	else
		root["scrollLock"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SCROLLABLE_CLASSNAME = 'sl--scrollable';
var FILLGAP_CLASSNAME = 'sl--fillgap';
var PREVENT_SCROLL_DATASET = 'slPrevented';
var DELTA_DATASET = 'slDelta';
var FILLGAP_AVAILABLE_METHODS = ['padding', 'margin', 'width'];

var _state = true;
var _queue = 0;

var _scrollableTargets = [];
var _temporaryScrollableTargets = [];

var _fillGapMethod = FILLGAP_AVAILABLE_METHODS[0];
var _fillGapSelectors = ['body', '.' + FILLGAP_CLASSNAME];
var _fillGapTargets = [];

var generateSelector = function generateSelector(selectors) {
	return selectors.join(', ');
};

var eachNode = function eachNode(nodeList, callback) {
	for (var i = 0; i < nodeList.length; i++) {
		callback(nodeList[i]);
	}
};

var findTarget = function findTarget(e) {
	var target = e.target;
	while (target !== null) {
		if (target.classList && target.classList.contains(SCROLLABLE_CLASSNAME)) {
			break;
		}
		target = target.parentNode;
	}
	return target;
};

var throwError = function throwError(message) {
	console.error('[scroll-lock] ' + message);
};

var touchstartEventHandler = function touchstartEventHandler(e, scrollLock) {
	var target = findTarget(e);
	if (target) {
		var scrollTop = target.scrollTop;
		var totalScroll = target.scrollHeight;
		var height = target.clientHeight;
		target.dataset[DELTA_DATASET] = e.touches[0].clientY;

		if (height === totalScroll) {
			target.dataset[PREVENT_SCROLL_DATASET] = 'true';
		}
	}
};

var touchmoveEventHandler = function touchmoveEventHandler(e, scrollLock) {
	if (!scrollLock.getState()) {
		var target = findTarget(e);
		if (target) {
			if (target.dataset[PREVENT_SCROLL_DATASET] === 'true') {
				e.preventDefault();
			} else {
				var scrollTop = target.scrollTop;
				var totalScroll = target.scrollHeight;
				var currentScroll = scrollTop + target.offsetHeight;
				var delta = parseFloat(target.dataset[DELTA_DATASET]);
				var currentDelta = e.touches[0].clientY;

				if (scrollTop <= 0) {
					if (delta < currentDelta) {
						e.preventDefault();
					}
				} else if (currentScroll >= totalScroll) {
					if (delta > currentDelta) {
						e.preventDefault();
					}
				}
			}
		} else {
			e.preventDefault();
		}
	}
};

var touchendEventHandler = function touchendEventHandler(e, scrollLock) {
	var target = findTarget(e);
	if (target) {
		target.dataset[PREVENT_SCROLL_DATASET] = 'false';
	}
};

var bindEvents = function bindEvents(scrollLock) {
	document.addEventListener('touchstart', function (e) {
		return touchstartEventHandler(e, scrollLock);
	});
	document.addEventListener('touchmove', function (e) {
		return touchmoveEventHandler(e, scrollLock);
	});
	document.addEventListener('touchend', function (e) {
		return touchendEventHandler(e, scrollLock);
	});
};

var ScrollLock = function () {
	function ScrollLock() {
		_classCallCheck(this, ScrollLock);

		bindEvents(this);
	}

	_createClass(ScrollLock, [{
		key: 'getState',
		value: function getState() {
			return _state;
		}
	}, {
		key: 'hide',
		value: function hide(targets) {
			if (_queue <= 0) {
				this._fillGaps();
				document.body.style.overflow = 'hidden';
				_state = false;
			}

			this._setTemporaryScrollableTargets(targets);
			_queue++;

			return this;
		}
	}, {
		key: 'show',
		value: function show() {
			_queue--;
			if (_queue <= 0) {
				document.body.style.overflow = '';
				this._unfillGaps();
				_state = true;
			} else {
				this.clearQueue();
			}

			return this;
		}
	}, {
		key: 'clearQueue',
		value: function clearQueue() {
			_queue = 0;

			return this;
		}
	}, {
		key: 'toggle',
		value: function toggle() {
			if (this.getState()) {
				this.hide();
			} else {
				this.show();
			}

			return this;
		}
	}, {
		key: 'getWidth',
		value: function getWidth() {
			var overflowCurrentProperty = document.body.style.overflow;
			var width = 0;
			document.body.style.overflow = 'scroll';
			width = this.getCurrentWidth();
			document.body.style.overflow = overflowCurrentProperty;

			return width;
		}
	}, {
		key: 'getCurrentWidth',
		value: function getCurrentWidth() {
			var documentWidth = document.documentElement.clientWidth;
			var windowWidth = window.innerWidth;
			var currentWidth = windowWidth - documentWidth;

			return currentWidth;
		}
	}, {
		key: 'setScrollableTargets',
		value: function setScrollableTargets(targets) {
			var _this = this;

			if (Array.isArray(selectors)) {
				_scrollableTargets = targets;
			} else if (targets) {
				_scrollableTargets = [targets];
			}

			eachNode(_scrollableTargets, function (element) {
				return _this._makeScrollableTargetsElement(element);
			});

			return this;
		}
	}, {
		key: 'setFillGapMethod',
		value: function setFillGapMethod(method) {
			var parsedMethod = method.toLowerCase();
			if (FILLGAP_AVAILABLE_METHODS.includes(parsedMethod)) {
				_fillGapMethod = parsedMethod;
			} else {
				throwError('"' + method + '" method is not available!');
			}

			return this;
		}
	}, {
		key: 'setFillGapSelectors',
		value: function setFillGapSelectors(selectors) {
			if (Array.isArray(selectors)) {
				selectors.push('.' + FILLGAP_CLASSNAME);
				_fillGapSelectors = selectors;
			} else if (selectors) {
				_fillGapSelectors = [selectors];
			}

			return this;
		}
	}, {
		key: 'setFillGapTargets',
		value: function setFillGapTargets(targets) {
			if (Array.isArray(targets)) {
				_fillGapTargets = targets;
			} else if (targets) {
				_fillGapTargets = [targets];
			}

			return this;
		}
	}, {
		key: '_setTemporaryScrollableTargets',
		value: function _setTemporaryScrollableTargets(targets) {
			var _this2 = this;

			if (Array.isArray(targets)) {
				_temporaryScrollableTargets = targets;
			} else if (targets) {
				_temporaryScrollableTargets = [targets];
			}

			eachNode(_temporaryScrollableTargets, function (element) {
				return _this2._makeScrollableTargetsElement(element);
			});
		}
	}, {
		key: '_makeScrollableTargetsElement',
		value: function _makeScrollableTargetsElement(element) {
			if (element instanceof Element) {
				element.classList.add(SCROLLABLE_CLASSNAME);
			}
		}
	}, {
		key: '_fillGaps',
		value: function _fillGaps() {
			var _this3 = this;

			var selector = generateSelector(_fillGapSelectors);
			var elements = document.querySelectorAll(selector);

			eachNode(elements, function (element) {
				return _this3._fillGapsElement(element);
			});
			eachNode(_fillGapTargets, function (element) {
				return _this3._fillGapsElement(element);
			});
		}
	}, {
		key: '_fillGapsElement',
		value: function _fillGapsElement(element) {
			var currentWidth = this.getCurrentWidth();

			if (element instanceof Element) {
				if (_fillGapMethod === 'margin') {
					element.style.marginRight = currentWidth + 'px';
				} else if (_fillGapMethod === 'width') {
					element.style.width = 'calc(100% - ' + currentWidth + 'px)';
				} else {
					element.style.paddingRight = currentWidth + 'px';
				}
			}
		}
	}, {
		key: '_unfillGaps',
		value: function _unfillGaps() {
			var _this4 = this;

			var selector = generateSelector(_fillGapSelectors);
			var elements = document.querySelectorAll(selector);

			eachNode(elements, function (element) {
				return _this4._unfillGapsElement(element);
			});
			eachNode(_fillGapTargets, function (element) {
				return _this4._unfillGapsElement(element);
			});
		}
	}, {
		key: '_unfillGapsElement',
		value: function _unfillGapsElement(element) {
			if (element instanceof Element) {
				element.style.marginRight = '';
				element.style.width = '';
				element.style.paddingRight = '';
			}
		}
	}]);

	return ScrollLock;
}();

var scrollLock = new ScrollLock();
exports.default = scrollLock;

module.exports = scrollLock;

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLWxvY2suanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA4OGEzMGEyMDc4ZGRmMmY2NDFkMyIsIndlYnBhY2s6Ly8vc3JjL3Njcm9sbC1sb2NrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcInNjcm9sbC1sb2NrXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInNjcm9sbExvY2tcIl0gPSBmYWN0b3J5KCk7XG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDg4YTMwYTIwNzhkZGYyZjY0MWQzIiwiY29uc3QgU0NST0xMQUJMRV9DTEFTU05BTUUgPSAnc2wtLXNjcm9sbGFibGUnO1xuY29uc3QgRklMTEdBUF9DTEFTU05BTUUgPSAnc2wtLWZpbGxnYXAnO1xuY29uc3QgUFJFVkVOVF9TQ1JPTExfREFUQVNFVCA9ICdzbFByZXZlbnRlZCc7XG5jb25zdCBERUxUQV9EQVRBU0VUID0gJ3NsRGVsdGEnO1xuY29uc3QgRklMTEdBUF9BVkFJTEFCTEVfTUVUSE9EUyA9IFsncGFkZGluZycsICdtYXJnaW4nLCAnd2lkdGgnXTtcblxubGV0IF9zdGF0ZSA9IHRydWU7XG5sZXQgX3F1ZXVlID0gMDtcblxubGV0IF9zY3JvbGxhYmxlVGFyZ2V0cyA9IFtdO1xubGV0IF90ZW1wb3JhcnlTY3JvbGxhYmxlVGFyZ2V0cyA9IFtdO1xuXG5sZXQgX2ZpbGxHYXBNZXRob2QgPSBGSUxMR0FQX0FWQUlMQUJMRV9NRVRIT0RTWzBdO1xubGV0IF9maWxsR2FwU2VsZWN0b3JzID0gWydib2R5JywgYC4ke0ZJTExHQVBfQ0xBU1NOQU1FfWBdO1xubGV0IF9maWxsR2FwVGFyZ2V0cyA9IFtdO1xuXG5jb25zdCBnZW5lcmF0ZVNlbGVjdG9yID0gKHNlbGVjdG9ycykgPT4ge1xuXHRyZXR1cm4gc2VsZWN0b3JzLmpvaW4oJywgJyk7XG59O1xuXG5jb25zdCBlYWNoTm9kZSA9IChub2RlTGlzdCwgY2FsbGJhY2spID0+IHtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBub2RlTGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdGNhbGxiYWNrKG5vZGVMaXN0W2ldKTtcblx0fVxufTtcblxuY29uc3QgZmluZFRhcmdldCA9IChlKSA9PiB7XG5cdGxldCB0YXJnZXQgPSBlLnRhcmdldDtcblx0d2hpbGUgKHRhcmdldCAhPT0gbnVsbCkge1xuXHRcdGlmICh0YXJnZXQuY2xhc3NMaXN0ICYmIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoU0NST0xMQUJMRV9DTEFTU05BTUUpKSB7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdFx0dGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG5cdH1cblx0cmV0dXJuIHRhcmdldDtcbn07XG5cbmNvbnN0IHRocm93RXJyb3IgPSAobWVzc2FnZSkgPT4ge1xuXHRjb25zb2xlLmVycm9yKGBbc2Nyb2xsLWxvY2tdICR7bWVzc2FnZX1gKTtcbn07XG5cbmNvbnN0IHRvdWNoc3RhcnRFdmVudEhhbmRsZXIgPSAoZSwgc2Nyb2xsTG9jaykgPT4ge1xuXHRjb25zdCB0YXJnZXQgPSBmaW5kVGFyZ2V0KGUpO1xuXHRpZiAodGFyZ2V0KSB7XG5cdFx0Y29uc3Qgc2Nyb2xsVG9wID0gdGFyZ2V0LnNjcm9sbFRvcDtcblx0XHRjb25zdCB0b3RhbFNjcm9sbCA9IHRhcmdldC5zY3JvbGxIZWlnaHQ7XG5cdFx0Y29uc3QgaGVpZ2h0ID0gdGFyZ2V0LmNsaWVudEhlaWdodDtcblx0XHR0YXJnZXQuZGF0YXNldFtERUxUQV9EQVRBU0VUXSA9IGUudG91Y2hlc1swXS5jbGllbnRZO1xuXG5cdFx0aWYgKGhlaWdodCA9PT0gdG90YWxTY3JvbGwpIHtcblx0XHRcdHRhcmdldC5kYXRhc2V0W1BSRVZFTlRfU0NST0xMX0RBVEFTRVRdID0gJ3RydWUnO1xuXHRcdH1cblx0fVxufTtcblxuY29uc3QgdG91Y2htb3ZlRXZlbnRIYW5kbGVyID0gKGUsIHNjcm9sbExvY2spID0+IHtcblx0aWYgKCFzY3JvbGxMb2NrLmdldFN0YXRlKCkpIHtcblx0XHRjb25zdCB0YXJnZXQgPSBmaW5kVGFyZ2V0KGUpO1xuXHRcdGlmICh0YXJnZXQpIHtcblx0XHRcdGlmICh0YXJnZXQuZGF0YXNldFtQUkVWRU5UX1NDUk9MTF9EQVRBU0VUXSA9PT0gJ3RydWUnKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHNjcm9sbFRvcCA9IHRhcmdldC5zY3JvbGxUb3A7XG5cdFx0XHRcdGNvbnN0IHRvdGFsU2Nyb2xsID0gdGFyZ2V0LnNjcm9sbEhlaWdodDtcblx0XHRcdFx0Y29uc3QgY3VycmVudFNjcm9sbCA9IHNjcm9sbFRvcCArIHRhcmdldC5vZmZzZXRIZWlnaHQ7XG5cdFx0XHRcdGNvbnN0IGRlbHRhID0gcGFyc2VGbG9hdCh0YXJnZXQuZGF0YXNldFtERUxUQV9EQVRBU0VUXSk7XG5cdFx0XHRcdGNvbnN0IGN1cnJlbnREZWx0YSA9IGUudG91Y2hlc1swXS5jbGllbnRZO1xuXG5cdFx0XHRcdGlmIChzY3JvbGxUb3AgPD0gMCkge1xuXHRcdFx0XHRcdGlmIChkZWx0YSA8IGN1cnJlbnREZWx0YSkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChjdXJyZW50U2Nyb2xsID49IHRvdGFsU2Nyb2xsKSB7XG5cdFx0XHRcdFx0aWYgKGRlbHRhID4gY3VycmVudERlbHRhKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cdH1cbn07XG5cbmNvbnN0IHRvdWNoZW5kRXZlbnRIYW5kbGVyID0gKGUsIHNjcm9sbExvY2spID0+IHtcblx0Y29uc3QgdGFyZ2V0ID0gZmluZFRhcmdldChlKTtcblx0aWYgKHRhcmdldCkge1xuXHRcdHRhcmdldC5kYXRhc2V0W1BSRVZFTlRfU0NST0xMX0RBVEFTRVRdID0gJ2ZhbHNlJztcblx0fVxufTtcblxuY29uc3QgYmluZEV2ZW50cyA9IChzY3JvbGxMb2NrKSA9PiB7XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZSkgPT4gdG91Y2hzdGFydEV2ZW50SGFuZGxlcihlLCBzY3JvbGxMb2NrKSk7XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIChlKSA9PiB0b3VjaG1vdmVFdmVudEhhbmRsZXIoZSwgc2Nyb2xsTG9jaykpO1xuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIChlKSA9PiB0b3VjaGVuZEV2ZW50SGFuZGxlcihlLCBzY3JvbGxMb2NrKSk7XG59O1xuXG5jbGFzcyBTY3JvbGxMb2NrIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0YmluZEV2ZW50cyh0aGlzKTtcblx0fVxuXG5cdGdldFN0YXRlKCkge1xuXHRcdHJldHVybiBfc3RhdGU7XG5cdH1cblxuXHRoaWRlKHRhcmdldHMpIHtcblx0XHRpZiAoX3F1ZXVlIDw9IDApIHtcblx0XHRcdHRoaXMuX2ZpbGxHYXBzKCk7XG5cdFx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG5cdFx0XHRfc3RhdGUgPSBmYWxzZTtcblx0XHR9XG5cblx0XHR0aGlzLl9zZXRUZW1wb3JhcnlTY3JvbGxhYmxlVGFyZ2V0cyh0YXJnZXRzKTtcblx0XHRfcXVldWUrKztcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0c2hvdygpIHtcblx0XHRfcXVldWUtLTtcblx0XHRpZiAoX3F1ZXVlIDw9IDApIHtcblx0XHRcdGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnJztcblx0XHRcdHRoaXMuX3VuZmlsbEdhcHMoKTtcblx0XHRcdF9zdGF0ZSA9IHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuY2xlYXJRdWV1ZSgpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0Y2xlYXJRdWV1ZSgpIHtcblx0XHRfcXVldWUgPSAwO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHR0b2dnbGUoKSB7XG5cdFx0aWYgKHRoaXMuZ2V0U3RhdGUoKSkge1xuXHRcdFx0dGhpcy5oaWRlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuc2hvdygpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0Z2V0V2lkdGgoKSB7XG5cdFx0Y29uc3Qgb3ZlcmZsb3dDdXJyZW50UHJvcGVydHkgPSBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93O1xuXHRcdGxldCB3aWR0aCA9IDA7XG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdzY3JvbGwnO1xuXHRcdHdpZHRoID0gdGhpcy5nZXRDdXJyZW50V2lkdGgoKTtcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gb3ZlcmZsb3dDdXJyZW50UHJvcGVydHk7XG5cblx0XHRyZXR1cm4gd2lkdGg7XG5cdH1cblxuXHRnZXRDdXJyZW50V2lkdGgoKSB7XG5cdFx0Y29uc3QgZG9jdW1lbnRXaWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcblx0XHRjb25zdCB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdGNvbnN0IGN1cnJlbnRXaWR0aCA9IHdpbmRvd1dpZHRoIC0gZG9jdW1lbnRXaWR0aDtcblxuXHRcdHJldHVybiBjdXJyZW50V2lkdGg7XG5cdH1cblxuXHRzZXRTY3JvbGxhYmxlVGFyZ2V0cyh0YXJnZXRzKSB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoc2VsZWN0b3JzKSkge1xuXHRcdFx0X3Njcm9sbGFibGVUYXJnZXRzID0gdGFyZ2V0cztcblx0XHR9IGVsc2UgaWYgKHRhcmdldHMpIHtcblx0XHRcdF9zY3JvbGxhYmxlVGFyZ2V0cyA9IFt0YXJnZXRzXTtcblx0XHR9XG5cblx0XHRlYWNoTm9kZShfc2Nyb2xsYWJsZVRhcmdldHMsIChlbGVtZW50KSA9PiB0aGlzLl9tYWtlU2Nyb2xsYWJsZVRhcmdldHNFbGVtZW50KGVsZW1lbnQpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0c2V0RmlsbEdhcE1ldGhvZChtZXRob2QpIHtcblx0XHRjb25zdCBwYXJzZWRNZXRob2QgPSBtZXRob2QudG9Mb3dlckNhc2UoKTtcblx0XHRpZiAoRklMTEdBUF9BVkFJTEFCTEVfTUVUSE9EUy5pbmNsdWRlcyhwYXJzZWRNZXRob2QpKSB7XG5cdFx0XHRfZmlsbEdhcE1ldGhvZCA9IHBhcnNlZE1ldGhvZDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3dFcnJvcihgXCIke21ldGhvZH1cIiBtZXRob2QgaXMgbm90IGF2YWlsYWJsZSFgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHNldEZpbGxHYXBTZWxlY3RvcnMoc2VsZWN0b3JzKSB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoc2VsZWN0b3JzKSkge1xuXHRcdFx0c2VsZWN0b3JzLnB1c2goYC4ke0ZJTExHQVBfQ0xBU1NOQU1FfWApO1xuXHRcdFx0X2ZpbGxHYXBTZWxlY3RvcnMgPSBzZWxlY3RvcnM7XG5cdFx0fSBlbHNlIGlmIChzZWxlY3RvcnMpIHtcblx0XHRcdF9maWxsR2FwU2VsZWN0b3JzID0gW3NlbGVjdG9yc107XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRzZXRGaWxsR2FwVGFyZ2V0cyh0YXJnZXRzKSB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0cykpIHtcblx0XHRcdF9maWxsR2FwVGFyZ2V0cyA9IHRhcmdldHM7XG5cdFx0fSBlbHNlIGlmICh0YXJnZXRzKSB7XG5cdFx0XHRfZmlsbEdhcFRhcmdldHMgPSBbdGFyZ2V0c107XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRfc2V0VGVtcG9yYXJ5U2Nyb2xsYWJsZVRhcmdldHModGFyZ2V0cykge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHRhcmdldHMpKSB7XG5cdFx0XHRfdGVtcG9yYXJ5U2Nyb2xsYWJsZVRhcmdldHMgPSB0YXJnZXRzO1xuXHRcdH0gZWxzZSBpZiAodGFyZ2V0cykge1xuXHRcdFx0X3RlbXBvcmFyeVNjcm9sbGFibGVUYXJnZXRzID0gW3RhcmdldHNdO1xuXHRcdH1cblxuXHRcdGVhY2hOb2RlKF90ZW1wb3JhcnlTY3JvbGxhYmxlVGFyZ2V0cywgKGVsZW1lbnQpID0+IHRoaXMuX21ha2VTY3JvbGxhYmxlVGFyZ2V0c0VsZW1lbnQoZWxlbWVudCkpO1xuXHR9XG5cblx0X21ha2VTY3JvbGxhYmxlVGFyZ2V0c0VsZW1lbnQoZWxlbWVudCkge1xuXHRcdGlmIChlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudCkge1xuXHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKFNDUk9MTEFCTEVfQ0xBU1NOQU1FKTtcblx0XHR9XG5cdH1cblxuXHRfZmlsbEdhcHMoKSB7XG5cdFx0Y29uc3Qgc2VsZWN0b3IgPSBnZW5lcmF0ZVNlbGVjdG9yKF9maWxsR2FwU2VsZWN0b3JzKTtcblx0XHRjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG5cdFx0ZWFjaE5vZGUoZWxlbWVudHMsIChlbGVtZW50KSA9PiB0aGlzLl9maWxsR2Fwc0VsZW1lbnQoZWxlbWVudCkpO1xuXHRcdGVhY2hOb2RlKF9maWxsR2FwVGFyZ2V0cywgKGVsZW1lbnQpID0+IHRoaXMuX2ZpbGxHYXBzRWxlbWVudChlbGVtZW50KSk7XG5cdH1cblxuXHRfZmlsbEdhcHNFbGVtZW50KGVsZW1lbnQpIHtcblx0XHRjb25zdCBjdXJyZW50V2lkdGggPSB0aGlzLmdldEN1cnJlbnRXaWR0aCgpO1xuXG5cdFx0aWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG5cdFx0XHRpZiAoX2ZpbGxHYXBNZXRob2QgPT09ICdtYXJnaW4nKSB7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUubWFyZ2luUmlnaHQgPSBgJHtjdXJyZW50V2lkdGh9cHhgO1xuXHRcdFx0fSBlbHNlIGlmIChfZmlsbEdhcE1ldGhvZCA9PT0gJ3dpZHRoJykge1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLndpZHRoID0gYGNhbGMoMTAwJSAtICR7Y3VycmVudFdpZHRofXB4KWA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodCA9IGAke2N1cnJlbnRXaWR0aH1weGA7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0X3VuZmlsbEdhcHMoKSB7XG5cdFx0Y29uc3Qgc2VsZWN0b3IgPSBnZW5lcmF0ZVNlbGVjdG9yKF9maWxsR2FwU2VsZWN0b3JzKTtcblx0XHRjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG5cdFx0ZWFjaE5vZGUoZWxlbWVudHMsIChlbGVtZW50KSA9PiB0aGlzLl91bmZpbGxHYXBzRWxlbWVudChlbGVtZW50KSk7XG5cdFx0ZWFjaE5vZGUoX2ZpbGxHYXBUYXJnZXRzLCAoZWxlbWVudCkgPT4gdGhpcy5fdW5maWxsR2Fwc0VsZW1lbnQoZWxlbWVudCkpO1xuXHR9XG5cblx0X3VuZmlsbEdhcHNFbGVtZW50KGVsZW1lbnQpIHtcblx0XHRpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcblx0XHRcdGVsZW1lbnQuc3R5bGUubWFyZ2luUmlnaHQgPSAnJztcblx0XHRcdGVsZW1lbnQuc3R5bGUud2lkdGggPSAnJztcblx0XHRcdGVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0ID0gJyc7XG5cdFx0fVxuXHR9XG59XG5cbmNvbnN0IHNjcm9sbExvY2sgPSBuZXcgU2Nyb2xsTG9jaygpO1xuZXhwb3J0IGRlZmF1bHQgc2Nyb2xsTG9jaztcbm1vZHVsZS5leHBvcnRzID0gc2Nyb2xsTG9jaztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvc2Nyb2xsLWxvY2suanMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQUdBO0FBQ0E7QUFDQTtBQUFBOzs7O0EiLCJzb3VyY2VSb290IjoiIn0=