/**
 * @license ActiveData 0.3.0 by Holiber
 * work with collections
 *
 * Available via the MIT license.
 * see: http://github.com/holiber/activedata
 */
;(function (context) {

	//inheritance realisation
	var Class = function () {}
	Class.extend = function(props, staticProps) {

		var mixins = [];
		if ({}.toString.apply(arguments[0]) == "[object Array]") {
			mixins = arguments[0];
			props = arguments[1];
			staticProps = arguments[2];
		}
		function Constructor() {
			this.init && this.init.apply(this, arguments);
		}
		Constructor.prototype = Class.inherit(this.prototype);
		Constructor.prototype.constructor = Constructor;
		Constructor.extend = Class.extend;
		copyWrappedProps(staticProps, Constructor, this);

		for (var i = 0; i < mixins.length; i++) {
			copyWrappedProps(mixins[i], Constructor.prototype, this.prototype);
		}
		copyWrappedProps(props, Constructor.prototype, this.prototype);
		return Constructor;
	};

	var fnTest = /xyz/.test(function() {xyz}) ? /\b_super\b/ : /./;

	function copyWrappedProps(props, targetPropsObj, parentPropsObj) {
		if (!props) return;

		for (var name in props) {
			if (typeof props[name] == "function"
				&& typeof parentPropsObj[name] == "function"
				&& fnTest.test(props[name])) {
				// скопировать, завернув в обёртку
				targetPropsObj[name] = wrap(props[name], parentPropsObj[name]);
			} else {
				targetPropsObj[name] = props[name];
			}
		}

	}

	function wrap(method, parentMethod) {
		return function() {
			var backup = this._super;

			this._super = parentMethod;

			try {
				return method.apply(this, arguments);
			} finally {
				this._super = backup;
			}
		}
	}

	Class.inherit = Object.create || function(proto) {
		function F() {}
		F.prototype = proto;
		return new F;
	};

	/*ActiveData*/
	var ActiveData = context.ActiveData = Class.extend({

		init: function (reduce) {
			this.changes = {};
			this.sortFields = null;
			this.reduce = $.extend({}, reduce);
			var unpacked = this.unpack(reduce);
			this.rows = unpacked.rows;
			this.columns = unpacked.columns;
			this.lastIdx = unpacked.lastIdx;
			this.listener = function () {};
			this.computed = {};
			this.defaults = {};
		},

		/**
		 * data size
		 * @return {Number}
		 */
		size: function () {
			return (this.rows && this.rows.length) || 0;
		},

		/**
		 * unpack reduce data
		 * @param reduce
		 * @return {Object} unpacked object like {rows: {*}, columns: {*}, lastIdx: * }
		 */
		unpack: function (reduce) {
			var empty = {columns: ['idx'], rows: [], lastIdx: 1};
			if (!reduce) return empty;

			if ($.isArray(reduce)) {
				if (!reduce.length) return empty;
				var firstRow = reduce[0];
				var columns = ['idx'];
				var idx = 1;
				var rows = [];
				for (var fieldName in firstRow) {
					columns.push(fieldName);
				}
				for (var rowKey = 0; rowKey < reduce.length; rowKey++) {
					var row = $.extend({idx: idx}, reduce[rowKey]);
					rows.push(row);
					idx++
				}
				return {rows: rows, columns: columns, lastIdx: idx};
			}

			if (!reduce.columns) return empty;
			var columns = ['idx'].concat(reduce.columns);
			var idx = 1;
			var rows = [];
			for (var rowKey = 0; rowKey < reduce.rows.length; rowKey++) {
				var row = {idx: idx};
				for (var columnKey = 0; columnKey < reduce.columns.length; columnKey++) {
					row[reduce.columns[columnKey]] = reduce.rows[rowKey][columnKey];
				}
				rows.push(row);
				idx++;
			}
			return {rows: rows, columns: columns, lastIdx: idx};
		},

		pack: function (expr, columns) {
			var columnsToPack = columns || this.columns;
			var rowsToPack = expr ? this.find(expr) : this.rows;
			var rows = [];
			for (var key in rowsToPack) {
				var row = rowsToPack[key];
				var packedRow = [];
				for (var i = 0; i < columnsToPack.length; i++) {
					packedRow.push(row[columnsToPack[i]]);
				}
				rows.push(packedRow);
			}
			return {columns: columnsToPack, rows: rows}
		},

		/**
		 * find rows
		 * @param {Object|Function|Boolean} expr
		 * @param {Array|Boolean} [fields=true]
		 * @param {Object} [options]
		 * @returns {Array}
		 */
		find: function (expr, fields, options) {
			return ActiveData.findIn(this.rows, expr, fields, options);
		},

		/**
		 * find first row
		 * @param {Object|Function|Boolean} expr
		 * @param {Array|Boolean} [fields=true]
		 * @param {Object} [options]
		 * @returns {Object}
		 */
		findOne: function (expr, fields, options) {
			options = options || {};
			options = $.extend({}, {limit: 1}, options);
			return this.find(expr, fields, options)[0]
		},

		/**
		 *
		 * @param [expr]
		 * @param key
		 * @returns {Array}
		 */
		getList: function (expr, key) {
			if (typeof(expr) == 'string') {
				key = expr;
				expr = null;
			}
			var list = [];
			var rows = expr ? this.find(expr) : this.rows;
			for (var i = 0; i < rows.length; i++) {
				var value = rows[i][key];
				if (~$.inArray(value, list)) continue;
				list.push(value);
			}
			return list;
		},

		/**
			fire event
			@eventName {Sting}
			@data
		*/
		fire: function (eventName, data) {
			this.listener(eventName, data);
		},

		/**
		 * sort rows
		 * sort({Array} fields, {Boolean} zeroIsLast)
		 * sort({Function} fn)
		 * @param {Array} fields
		 * @example data.sort([{fieldName: 'amount', order: 'desc', zeroIsLast: true}])
		 */
		sort: function (opt, zeroIsLast) {

			if (!opt) return false;

			if ($.isFunction(opt)) {
				this.rows.sort(opt);
				return;
			}

			var fields = $.isArray(opt) ? opt : [opt];
			var self = this;

			this.sortFields = fields || this.sortFields || [{fieldName: 'idx', order: 'asc'}];

			var fnAscSort = function (a, z, fieldIdx) {
				fieldIdx = fieldIdx || 0;
				var endZero = (self.sortFields[fieldIdx].zeroIsLast !== undefined) ? self.sortFields[fieldIdx].zeroIsLast : zeroIsLast;
				var fieldName = self.sortFields[fieldIdx].fieldName;

				if (endZero) {
					if (a[fieldName] !== z[fieldName]) {
						if (!a[fieldName]) return 1;
						if (!z[fieldName]) return -1;
					}
				}
				if (a[fieldName] == z[fieldName]) {
					var nextField = self.sortFields[fieldIdx + 1];
					if (!nextField) {
						return a.idx - z.idx;
					}
					var nextFieldOrder = nextField.order || 'asc';
					if (nextFieldOrder == 'asc') return fnAscSort(a, z, fieldIdx + 1);
					return fnDescSort(a, z, fieldIdx + 1)
				}
				if (a[fieldName] < z[fieldName]) return -1;
				if (a[fieldName] > z[fieldName]) return 1;
				if (typeof(a[fieldName]) == "number" || typeof(z[fieldName]) == "number") return  (typeof(a[fieldName]) == "number") ? 1 : -1;
				if (typeof(a[fieldName]) == "string" || typeof(z[fieldName]) == "string") return  (typeof(a[fieldName]) == "string") ? -1 : 1;
				return a.idx - z.idx;
			};

			var fnDescSort = function (a, z, fieldIdx) {
				fieldIdx = fieldIdx || 0;
				var endZero = (self.sortFields[fieldIdx].zeroIsLast !== undefined) ? self.sortFields[fieldIdx].zeroIsLast : zeroIsLast;
				var fieldName = self.sortFields[fieldIdx].fieldName;

				if (endZero) {
					if (a[fieldName] !== z[fieldName]) {
						if (!a[fieldName]) return -1;
						if (!z[fieldName]) return 1;
					}
				}
				if (a[fieldName] == z[fieldName]) {
					var nextField = self.sortFields[fieldIdx + 1];
					if (!nextField) {
						return z.idx - a.idx;
					}
					var nextFieldOrder = nextField.order || 'asc';
					if (nextFieldOrder == 'asc') return fnAscSort(a, z, fieldIdx + 1);
					return fnDescSort(a, z, fieldIdx + 1)
				};
				if (a[fieldName] < z[fieldName]) return 1;
				if (a[fieldName] > z[fieldName]) return -1;
				if (typeof(a[fieldName]) == "number" || typeof(z[fieldName]) == "number") return (typeof(a[fieldName]) == "number") ? -1 : 1;
				if (typeof(a[fieldName]) == "string" || typeof(z[fieldName]) == "string") return  (typeof(a[fieldName]) == "string") ? 1 : -1;
				return z.idx - a.idx;
			};

			var firstField = this.sortFields[0];
			firstField.order = firstField.order || 'asc';
			if (firstField.order == 'desc') {
				this.rows.sort(fnDescSort);
			} else {
				this.rows.sort(fnAscSort);
			}
		},

		/**
		 * update ([expr,] values [,soft=false])
		 * @param {Object} expr
		 * @param {Object|Function} values
		 * @param {Boolean} soft true if not need to save changes and fire event
		 * @return {Number} updated rows count
		 */
		update: function (opt1, opt2, opt3) {
			var expr = opt2 ? opt1 : null;
			var values = opt2 ? opt2 : opt1;
			var soft = typeof(opt2) == "boolean" ? opt2 : (typeof(opt3) == "boolean") ? opt3 : false;
			var cnt = 0;
			var operationChanges = [];
			for (var key = 0; key < this.rows.length; key++) {
				var row = this.rows[key];
				if (!expr || this.test(row, expr)) {
					var rowValues = $.isFunction(values) ? values(row) : values;
					if (!rowValues) continue;
					cnt++;
					var lastChange = (this.changes[row.idx]) || {};
					var change =  {action: 'update', source: lastChange.source || $.extend({}, row), values: $.extend({}, lastChange.values || {}, rowValues), current: null};
					for (var fieldName in rowValues) {
						row[fieldName] = rowValues[fieldName];
					}
					change.current = row;
					if (!soft) {
						operationChanges.push(change);
						this.changes[row.idx] = change;
					}
				}
			}
			this.compute();
			if (!soft) this.fire('change', {action: 'update', changes: operationChanges});
			return cnt;
		},

		/**
		 * patch rows
		 * @param items
		 * @param {String} [key='idx']
		 * @param {Boolean} [soft=false]
		 * @return {Number} patchedCount
		 */
		patch: function (items, key, soft) {
			key = key || 'idx';
			soft = soft || false;
			if (!items) return 0;
			var patchMap = {};
			for (var i = 0; i < items.length; i++) {
				patchMap[items[i][key]] = items[i]
			};
			this.update(function (row) {
				if (!patchMap[row[key]]) return false;
				var patch = $.extend({}, patchMap[row[key]]);
				delete patch[key];
				return patch;
			}, soft);
		},

		/**
		 * add row to data
		 * @param {Array|Object} rows
		 */
		add: function (rows, soft) {
			rows = $.isArray(rows) ? rows : [rows];
			rowsToAdd = [];
			for (var key = 0; key < rows.length; key++) {
				var row = rows[key];

				//set defaults
				for (var fieldName in this.defaults) {
					if (row[fieldName] === undefined) row[fieldName] = this.defaults[fieldName];
				}

				row.idx = ++this.lastIdx;
				var change = {action: 'add', values: row};
				if (!soft) this.changes[row.idx] = change;
				rowsToAdd.push(row);
			}
			this.rows = rowsToAdd.concat(this.rows);
			this.compute();
			this.sortFields = null;
			this.fire('change', change);
			return true;
		},

		/**
		 * remove rows by expr
		 * @param expr
		 * @return {Number} removed count
		 * @example
		 *  //remove red and green apples
		 *  data.remove({type: 'apple', color: ['red', 'green']});
		 */
		remove: function (expr, soft) {
			soft = soft || false;
			var operationChanges = [];
			var cnt = 0;

			for (i = 0; i < this.rows.length; i++) {
				var row = this.rows[i];
				if (this.test(row, expr)) {
					cnt++;
					if (!soft) {
						if (this.changes[row.idx]) {
							this.changes[row.idx].action = 'remove';
						} else {
							this.changes[row.idx] = {action: 'remove', source: row}
						}
					} else {
						if (this.changes[row.idx]) delete this.changes[row.idx];
					}
					operationChanges.push(this.changes[row.idx]);
					this.rows.splice(i, 1);
					i--;
				}
			}
			if (!soft) this.fire('change', {action: 'remove', changes: operationChanges});
			return cnt;
		},

		/**
		 * rollback changes
		 */
		rollback: function () {
			//TODO: rollback removed rows

			for (var i = this.rows.length; i--;) {
				var row = this.rows[i];
				var change = this.changes[row.idx];
				if (!change) continue;
				switch (change.action) {
					case 'update':
						this.rows[i] = change.source;
					break;
					case 'add':
						this.rows.splice(i, 1);
					break;
				}
			}

			this.fire('change', {action: 'rollback', changes: $.extend({}, this.changes)});
			this.changes = {};
		},

		/**
		 * commit changes
		 * @param {Boolean} [soft=false]
		 * @return {Number} changes count
		 */
		commit: function (soft) {
			var changesCnt = this.changes.length;
			if (!soft) this.fire('commit');
			this.changes = {};
			return changesCnt;
		},

		/**
		 * add new field
		 * @param {Array|Object} fields array of strings or objects like {name: 'fieldName', default: 0, compute: function(row) { return row.a + row.b}}
		 */
		addFields: function (fields) {
			if (!(fields instanceof Array)) fields = [fields];
			var length = fields.length;
			var newDefaults = [];
			if (!length) return false;
			for (var i = 0; i < length; i++) {
				var field = $.extend({name: false, compute: false}, typeof(fields[i]) == 'string' ? {name: fields[i]} : fields[i]);
				if (!field.name) continue;
				var isNewColumn = false;
				var columnExist = ~$.inArray(field.name, this.columns);
				if (!columnExist) {
					var isNewColumn = true;
					this.columns.push(field.name);
				}
				if (field.compute) this.computed[field.name] = field.compute;
				if (field.default != undefined) {
					this.defaults[field.name] = field.default;
					if (isNewColumn) newDefaults.push(field.name);
				}
			}
			//set default values for new fields
			if (newDefaults.length) for (var i = 0; i < this.rows.length; i++) {
				var row = this.rows[i];
				for (var j = 0; j < newDefaults.length; j++) {
					var fieldName = newDefaults[j];
					if (row[fieldName] === undefined) row[fieldName] = this.defaults[fieldName];
				}
			}
			this.compute();
			this.fire('change', {action: 'addFields', fields: fields});
			return true;
		},

		/**
		 * calculate computed fields and just added fields
		 */
		compute: function () {
			for (var i = this.size(); i--;) {
				for (var j = this.columns.length; j--;) {
					var fieldName = this.columns[j];
					if (this.computed[fieldName]) {
						this.rows[i][fieldName] = this.computed[fieldName](this.rows[i]);
						continue;
					}
					if (this.rows[i][fieldName] === undefined) this.rows[i][fieldName] = '';
				}
			}
		},

		/**
		 * getCopy ([expr])
		 * @param {Object|Function} [expr]
		 * @returns {ActiveData}
		 */
		getCopy: function (expr) {
			var rows = this.rows;
			if (expr) rows = this.find(expr);
			var copyData = new context.ActiveData(JSON.parse(JSON.stringify({columns: this.columns, rows: []})));
			copyData.rows = JSON.parse(JSON.stringify(rows));
			copyData.lastIdx = this.lastIdx;
			return copyData;
		},

		removeFields: function (fields) {
			if (!fields) return;
			if (!(fields instanceof Array)) fields = [fields];

			for (var i = 0; i < fields.length; i++) {
				var fieldName = fields[i];
				var fieldPos = this.columns.indexOf(fieldName);
				if (~fieldPos) this.columns.splice(fieldPos, 1);
				delete this.computed[fieldName];
				delete this.defaults[fieldName];
			}

			for (var i = 0; i < this.rows.length; i++) {
				for (var j = 0; j < fields.length; j++) {
					var fieldName = fields[j];
					delete this.rows[i][fieldName];
				}
			}
			this.fire('change', {action: 'removeFields', fields: fields});
		}
	}, {
		operators: {},

		addOperator: function (name, fn) {
			ActiveData.operators[name] = fn;
		},

		removeOperator: function (name) {
			delete ActiveData.operators[name];
		},

		/**
		 * checks for compliance with an item of expression
		 * @param item
		 * @param {Function|JSON} expr
		 * @param {String} [flag='$eq']
		 * @return {Boolean}
		 * @example
		 *  var apple = {type: 'apple', color: 'red'};
		 *  var isRed = data.test(apple, {color: 'red'});
		 */
		test: function (item, expr, flag) {

			if (typeof(expr) != 'object' && typeof(expr) != 'function') {
				flag = flag || '$eq';
				switch (flag) {
					case '$eq': return item == expr;
					case '$ne': return item != expr;
					case '$gt': return item > expr;
					case '$lt': return item < expr;
					case '$gte': return item >= expr;
					case '$lte': return item <= expr;
					case '$like': return item !== null ? ~String(item).toLowerCase().indexOf(expr) : false;
					default:
						//search custom operator
						var operator = flag.split('$')[1];
						var fn = ActiveData.operators[operator];
						if (!fn) throw 'operator ' + operator + ' not found';
						return fn(item, expr);
				}
			}

			if (flag == '$and') {
				for (var key = 0; key < expr.length; key++) {
					if (!this.test(item, expr[key])) return false;
				}
				return true;
			}

			// regular expressions
			if (expr instanceof RegExp) {
				return expr.test(String(item));
			}

			// "or" condtions
			if (expr instanceof Array) {
				for (var key = 0; key < expr.length; key++) {
					if (this.test(item, expr[key])) return true;
				}
				return false;
			}

			// "and" conditions
			if (typeof(expr) == 'object') {
				for (var key in expr) {

					if (key == '$and') {
						if (!this.test(item, expr[key], key)) return false;
						continue;
					}

					if (typeof(key) == 'string' && key.charAt(0) == '$') {
						if (!this.test(item, expr[key], key)) return false;
						continue;
					}

					if (typeof item != 'object') return false;
					if (!this.test(item[key], expr[key])) return false;
				}
				return true;
			}

			// function condition
			if (typeof expr == 'function') {
				return expr(item);
			}

			return false;
		},

		/**
		 * find rows in array
		 * findIn([data, selector [,fields=true] [,options]);
		 */
		findIn: function (data, expr, fields, options) {
			if (!data) throw 'empty data';
			if (!expr) return [];
			if (!$.isArray(fields) && typeof fields != 'boolean') {
				options = fields;
				fields = null;
			}
			fields = fields || true;
			options = options || {};
			var limit = options.limit;
			if (typeof limit == 'number') {
				limit = [1, limit];
			}

			var result = [];
			var counter = 0;
			for (var key = 0; key < data.length; key++) {
				var row = data[key];
				if (limit && counter >= limit[1]) break;
				if (expr !== true && !ActiveData.test(row, expr)) continue;
				counter++;
				if (limit && counter < limit[0]) continue;
				if (fields && $.isArray(fields)) {
					var filteredRow = {};
					for (var i = fields.length; i--;) {
						filteredRow[fields[i]] = row[fields[i]];
					}
					result.push(filteredRow);
					continue;
				}
				result.push(row);
			}
			return result;
		}
	});
	
})(window);