
import { Buffer, isArray, isBoolean, isBuffer, isDate, isFunction, isNumber, isObject, isRegExp, isString } from '../extern/base.mjs';
import { Filesystem                                                                                       } from './Filesystem.mjs';



const FILESYSTEM = new Filesystem();

export const isResults = function(obj) {
	return Object.prototype.toString.call(obj) === '[object Results]';
};

const clone = function(obj) {

	let data = null;

	try {
		data = JSON.parse(JSON.stringify(obj));
	} catch (err) {
		data = null;
	}

	if (data !== null) {

		if (isObject(data.payload) === true) {

			if (data.payload.type === 'Buffer') {
				data.payload = Buffer.from(data.payload.data || []);
			}

		}

	}

	return data;

};

const diff = function(aobject, bobject) {

	aobject = aobject !== undefined ? aobject : undefined;
	bobject = bobject !== undefined ? bobject : undefined;


	if (aobject === bobject) {

		return false;

	} else if (isArray(aobject) === true && isArray(bobject) === true) {

		for (let a = 0, al = aobject.length; a < al; a++) {

			if (bobject[a] !== undefined) {

				if (aobject[a] !== null && bobject[a] !== null) {

					let is_different = diff(aobject[a], bobject[a]);
					if (is_different === true) {

						if (isObject(aobject[a]) === true) {

							if (Object.keys(aobject[a].length > 0)) {
								return true;
							}

						} else {

							return true;

						}

					}

				}

			} else {

				return true;

			}

		}

	} else if (isBoolean(aobject) === true && isBoolean(bobject) === true) {

		return aobject !== bobject;

	} else if (isBuffer(aobject) === true && isBuffer(bobject) === true) {

		return aobject.toString('hex') !== bobject.toString('hex');

	} else if (isDate(aobject) === true && isDate(bobject) === true) {

		let astr = aobject.toString();
		let bstr = bobject.toString();

		if (astr !== bstr) {
			return true;
		}

	} else if (isFunction(aobject) === true && isFunction(bobject) === true) {

		let astr = aobject.toString();
		let bstr = bobject.toString();

		if (astr !== bstr) {
			return true;
		}

	} else if (isNumber(aobject) === true && isNumber(bobject) === true) {

		if (aobject === bobject) {

			return false;

		} else {

			// Allow 16ms of variance due to timing issues via setTimeout()
			if ((aobject).toString().length === 13 && (bobject).toString().length === 13) {

				if (aobject >= bobject - 8 && aobject <= bobject + 8) {
					return false;
				}

			}

			return true;

		}

	} else if (isObject(aobject) === true && isObject(bobject) === true) {

		let akeys = Object.keys(aobject);
		let bkeys = Object.keys(bobject);

		if (akeys.length !== bkeys.length) {
			return true;
		}


		for (let a = 0, al = akeys.length; a < al; a++) {

			let key = akeys[a];

			if (bobject[key] !== undefined) {

				if (aobject[key] !== null && bobject[key] !== null) {

					let is_different = diff(aobject[key], bobject[key]);
					if (is_different === true) {

						if (isObject(aobject[key]) === true) {

							if (Object.keys(aobject[key].length > 0)) {
								return true;
							}

						} else {

							return true;

						}

					}

				}

			} else {

				return true;

			}

		}

	} else if (isRegExp(aobject) === true && isRegExp(bobject) === true) {

		let astr = aobject.toString();
		let bstr = bobject.toString();

		if (astr !== bstr) {
			return true;
		}

	} else if (isString(aobject) === true && isString(bobject) === true) {

		return aobject !== bobject;

	} else if (aobject !== bobject) {

		return true;

	}


	return false;

};

const trace_assert = function() {

	let stack = [];

	try {
		throw new Error();
	} catch (err) {
		stack = err.stack.trim().split('\n');
		// Remove unnecessary function calls
		stack = stack.slice(4);
	}

	if (stack.length > 0) {

		let origin = null;

		for (let s = 0, sl = stack.length; s < sl; s++) {

			let line = stack[s].trim();
			if (line.includes('(file://') && line.includes(')')) {

				let tmp = line.split('(file://')[1].split(')').shift().trim();
				if (tmp.includes('/review/') && tmp.includes('.mjs')) {
					origin = tmp;
					break;
				}

			} else if (line.includes('file://')) {

				let tmp = line.split('file://')[1].trim();
				if (tmp.includes('/review/') && tmp.includes('.mjs')) {
					origin = tmp;
					break;
				}

			}

		}

		if (origin !== null) {

			let file = origin.split(':')[0] || null;
			let line = origin.split(':')[1] || null;

			if (file !== null && file.endsWith('.mjs') && line !== null) {

				let code = FILESYSTEM.read(file, 'utf8');
				if (code !== null) {

					let lines = code.split('\n');
					let check = lines[line - 1].trim();

					if (check.startsWith('assert(') && check.endsWith(');')) {
						return check.substr(0, check.length - 1) + ' in line #' + line;
					} else if (check.startsWith('assert(')) {
						return 'assert() in line #' + line;
					}

				}

			}

		}

	}


	return null;

};



const Results = function(length) {

	length = isNumber(length) ? length : 0;


	this.data   = new Array(length).fill(null);
	this.index  = 0;
	this.length = length;
	this.stack  = new Array(length).fill(null);

};


Results.isResults = isResults;


Results.from = function(data) {

	if (isFunction(data) === true) {

		let length = 0;
		let body   = data.toString().split('\n').slice(1, -1);

		if (body.length > 0) {

			body.map((line) => line.trim()).forEach((line) => {

				if (line.startsWith('assert(')) {
					length++;
				}

			});

		}

		return new Results(length);

	} else if (isArray(data) === true) {

		let length  = data.length;
		let results = new Results(length);

		data.forEach((value, d) => {

			if (isBoolean(value) === true) {
				results.data[d] = value;
			} else {
				results.data[d] = null;
			}

		});

		return results;

	} else if (isNumber(data) === true) {

		if (Number.isNaN(data) === false) {
			return new Results((data | 0));
		}

	}


	return new Results(0);

};


Results.prototype = {

	[Symbol.toStringTag]: 'Results',

	toJSON: function() {

		return {
			'type': 'Results',
			'data': this.data.slice()
		};

	},

	assert: function(result, expect) {

		result = result !== undefined ? result : undefined;
		expect = expect !== undefined ? expect : undefined;


		if (result !== undefined && expect !== undefined) {

			if (this.index < this.data.length) {

				if (diff(result, expect) === true) {

					this.data[this.index]  = false;
					this.stack[this.index] = {
						assert: trace_assert(),
						diff:   [ clone(result), clone(expect) ]
					};

				} else {

					this.data[this.index]  = true;
					this.stack[this.index] = {
						assert: null,
						diff:   null
					};

				}

				this.index++;

			}

		} else if (expect !== undefined) {

			if (this.index < this.data.length) {

				this.data[this.index]  = false;
				this.stack[this.index] = {
					assert: trace_assert(),
					diff:   [ null, clone(expect) ]
				};

				this.index++;

			}

		} else if (result === true || result === false) {

			if (this.index < this.data.length) {

				if (result === false) {

					this.data[this.index]  = false;
					this.stack[this.index] = {
						assert: trace_assert(),
						diff:   [ false, true ]
					};

				} else {

					this.data[this.index]  = true;
					this.stack[this.index] = {
						assert: null,
						diff:   null
					};

				}

				this.index++;

			}

		} else {

			if (this.index < this.data.length) {

				this.data[this.index]  = null;
				this.stack[this.index] = {
					assert: trace_assert(),
					diff:   [ null, true ]
				};

				this.index++;

			}

		}

	},

	complete: function() {

		if (this.index < this.data.length) {
			return false;
		}

		return true;

	},

	current: function() {

		return this.index;

	},

	includes: function(result) {

		if (isBoolean(result) === true || result === null) {
			return this.data.includes(result);
		}

		return false;

	},

	render: function() {

		let str = '';

		if (this.data.length > 0) {

			str += '|';

			for (let d = 0, dl = this.data.length; d < dl; d++) {

				let value = this.data[d];
				if (value === null) {
					str += '?';
				} else if (value === true) {
					str += '+';
				} else if (value === false) {
					str += '-';
				} else {
					str += '?';
				}

			}

			str += '|';

		} else {

			str += '| no assert() calls |';

		}

		return str;

	},

	reset: function() {

		for (let d = 0, dl = this.data.length; d < dl; d++) {
			this.data[d] = null;
		}

		this.index = 0;

	}

};


export { Results };

