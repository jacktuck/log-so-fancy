import chalk from 'chalk';
import {inspect} from 'util';

const {log, error} = console;

class Log {
  constructor(colors, depth) {
	  this.colors = colors;
	  this.depth = depth;
  }

  add(log) {
	  (this.logs || (this.logs = [])).push(log);
  }

  *[Symbol.iterator]() {
    var i = 0;
    while(this.logs[i] !== undefined) {
	  	yield inspect(this.logs[i], {
			depth: this.depth, colors: this.colors
		});
	  	++i;
    }
  }
}

class Logger {
	constructor({colors=true, depth=null, patch=false} = {}) {
		this.colors = colors;
		this.depth = depth;

		if (patch) {
			this.patch();
		}

		return this;
	}

	format(style, unstyled) {
		if (this.colors) {
			return style(unstyled);
		}

		return unstyled;
	}

	log(...args) {
		let logs = new Log(this.colors, this.depth);
		let time = this.format(chalk.cyan, new Date().toTimeString().split(" ")[0]);
		let annotation = this.annotation;

		//Stopgap until babel calls iterators on spread.
		for (let arg of args) {
			logs.add(arg);
		}

		var metadata = (annotation) ? [time, annotation] : [time];
		delete this.annotation;

		log(...[...metadata, ...logs]);

		return this;
	}

	explain(annotation) {
		this.annotation = this.format(chalk.blue, annotation);

		return this;
	}

	patch() {
		console.explain = this.explain.bind(this);
		console.log = console.info = this.log.bind(this);
		console.error = console.warn = this.log.bind(this);

		return this;
	}

	unpatch() {
		delete console.explain
		console.info = log;
		console.warn = error;

		return this;
	}
}

module.exports = Logger
