/*!
 * real-executable-paths-callback | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/real-executable-paths-callback
*/
'use strict';

const realpathsCallback = require('realpaths-callback');
const which = require('which');

const optionErrorMsg = 'Expected a falsy value or an option object to be passed to `node-which` ' +
                       'https://www.npmjs.com/package/which';

module.exports = function realExecutablePathsCallback(cmd, options, cb) {
  if (typeof cmd !== 'string') {
    throw new TypeError(
      String(cmd) +
      ' is not a string. Expected a string of a specific executable name in the PATH.'
    );
  }

  if (cmd === '') {
    throw new Error(
      'Expected a string of a specific executable name in the PATH, ' +
      'but received an empty string instead.'
    );
  }

  if (cb === undefined) {
    cb = options;
    options = {cache: null};
  } else if (options) {
    if (typeof options !== 'object') {
      throw new TypeError(`${options} is not an object. ${optionErrorMsg}.`);
    }

    if (Array.isArray(options)) {
      throw new TypeError(`${optionErrorMsg}, but received an array instead.`);
    }

    if (options.hasOwnProperty('all')) {
      throw new Error('`all` option is not supported.');
    }
  } else {
    options = {cache: null};
  }

  if (typeof cb !== 'function') {
    throw new TypeError(`${cb} is not a function. Expected a callback function.`);
  }

  which(cmd, Object.assign({}, options, {all: true}), function whichCallback(err, resolvedPaths) {
    if (err) {
      cb(err);
      return;
    }

    realpathsCallback(resolvedPaths, options.cache, cb);
  });
};
