'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _iterator2 = require('babel-runtime/core-js/symbol/iterator');

var _iterator3 = _interopRequireDefault(_iterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _console = console;
var _log = _console.log;
var error = _console.error;

var Log = function () {
	function Log(colors, depth) {
		(0, _classCallCheck3.default)(this, Log);

		this.colors = colors;
		this.depth = depth;
	}

	(0, _createClass3.default)(Log, [{
		key: 'add',
		value: function add(log) {
			(this.logs || (this.logs = [])).push(log);
		}
	}, {
		key: _iterator3.default,
		value: _regenerator2.default.mark(function value() {
			var i;
			return _regenerator2.default.wrap(function value$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							i = 0;

						case 1:
							if (!(this.logs[i] !== undefined)) {
								_context.next = 7;
								break;
							}

							_context.next = 4;
							return (0, _util.inspect)(this.logs[i], {
								depth: this.depth, colors: this.colors
							});

						case 4:
							++i;
							_context.next = 1;
							break;

						case 7:
						case 'end':
							return _context.stop();
					}
				}
			}, value, this);
		})
	}]);
	return Log;
}();

var Logger = function () {
	function Logger() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		var _ref$colors = _ref.colors;
		var colors = _ref$colors === undefined ? true : _ref$colors;
		var _ref$depth = _ref.depth;
		var depth = _ref$depth === undefined ? null : _ref$depth;
		var _ref$patch = _ref.patch;
		var patch = _ref$patch === undefined ? false : _ref$patch;
		(0, _classCallCheck3.default)(this, Logger);

		this.colors = colors;
		this.depth = depth;

		if (patch) {
			this.patch();
		}

		return this;
	}

	(0, _createClass3.default)(Logger, [{
		key: 'format',
		value: function format(style, unstyled) {
			if (this.colors) {
				return style(unstyled);
			}

			return unstyled;
		}
	}, {
		key: 'log',
		value: function log() {
			var logs = new Log(this.colors, this.depth);
			var time = this.format(_chalk2.default.cyan, new Date().toTimeString().split(" ")[0]);
			var annotation = this.annotation;

			//Stopgap until babel calls iterators on spread.

			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = (0, _getIterator3.default)(args), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var arg = _step.value;

					logs.add(arg);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			var metadata = annotation ? [time, annotation] : [time];
			delete this.annotation;

			_log.apply(undefined, [].concat(metadata, (0, _toConsumableArray3.default)(logs)));

			return this;
		}
	}, {
		key: 'explain',
		value: function explain(annotation) {
			this.annotation = this.format(_chalk2.default.blue, annotation);

			return this;
		}
	}, {
		key: 'patch',
		value: function patch() {
			console.explain = this.explain.bind(this);
			console.log = console.info = this.log.bind(this);
			console.error = console.warn = this.log.bind(this);

			return this;
		}
	}, {
		key: 'unpatch',
		value: function unpatch() {
			delete console.explain;
			console.info = _log;
			console.warn = error;

			return this;
		}
	}]);
	return Logger;
}();

module.exports = Logger;