'use strict';

const assert = require('assert');
const path = require('path');

const fs = require('graceful-fs');
const realExecutablePathsCallback = require('.');
const test = require('tape');

const isWindows = process.platform === 'win32';

/* istanbul ignore next */
const expectedEslintPath = isWindows ?
                           path.resolve('node_modules/.bin/eslint.CMD') :
                           path.resolve('node_modules/eslint/bin/eslint.js');

test('realExecutablePathsCallback()', t => {
  t.plan(15);

  t.strictEqual(
    realExecutablePathsCallback.name,
    'realExecutablePathsCallback',
    'should have a function name.'
  );

  process.env.PATH = path.delimiter.repeat(Number(!isWindows)) + path.join('node_modules', '.bin');

  realExecutablePathsCallback('eslint', (err0, filePaths0) => {
    t.strictEqual(err0, null, 'should not pass any errors when it successfully resolve a path.');
    t.deepEqual(filePaths0, [expectedEslintPath], 'should resolve executable paths.');

    const tmpPath = path.join(__dirname, 'eslint') + '.EXE'.repeat(Number(isWindows));

    fs.writeFile(tmpPath, new Buffer(0), {mode: '0777'}, err1 => {
      assert.ifError(err1);

      realExecutablePathsCallback('eslint', {
        cache: {
          [path.resolve('eslint' + '.EXE'.repeat(Number(isWindows)))]: path.resolve('__foo__'),
          [path.resolve('node_modules/.bin/eslint')]: path.resolve('__bar__'),
          [path.resolve('node_modules/.bin/eslint.CMD')]: path.resolve('__bar__')
        }
      }, (err2, filePaths1) => {
        fs.unlink(tmpPath, assert.ifError);

        t.strictEqual(err2, null, 'should accept `cache` option.');
        t.deepEqual(
          filePaths1,
          [path.resolve('__foo__'), path.resolve('__bar__')],
          'should pass `cache` option to fs.realpath.'
        );
      });
    });
  });

  realExecutablePathsCallback('foo', null, (...args) => {
    t.strictEqual(
      args.length,
      1,
      'should only pass one argument to the callback when it fails to resolve a path.'
    );
    t.strictEqual(
      args[0].message,
      'not found: foo',
      'should pass an error to the callback when it fails to resolve a path.'
    );
  });

  realExecutablePathsCallback('eslint', {path: 'foo'}, err => {
    t.strictEqual(
      err.message,
      'not found: eslint',
      'should reflect `node-which` options to the result.'
    );
  });

  t.throws(
    () => realExecutablePathsCallback(true, t.fail),
    /TypeError.*true is not a string\. Expected a string of a specific executable name in the PATH\./,
    'should throw a type error when the first argument is not a string.'
  );

  t.throws(
    () => realExecutablePathsCallback('', undefined, t.fail),
    /Error.* but received an empty string instead./,
    'should throw an error when the first argument is an empty string.'
  );

  t.throws(
    () => realExecutablePathsCallback('foo', true, t.fail),
    /TypeError.*true is not an object\. Expected a falsy value or an option object/,
    'should throw a type error when the second argument is not a function or object.'
  );

  t.throws(
    () => realExecutablePathsCallback('foo', [{}], t.fail),
    /TypeError.* to be passed to `node-which` .*, but received an array instead\./,
    'should throw a type error when the second argument is an array.'
  );

  t.throws(
    () => realExecutablePathsCallback('foo', {all: true}, t.fail),
    /Error.*`all` option is not supported\./,
    'should throw an error when it takes `all` option.'
  );

  t.throws(
    () => realExecutablePathsCallback('foo', 1),
    /TypeError.*1 is not a function\. Expected a callback function\./,
    'should throw a type error when the last argument is not a funtion.'
  );

  t.throws(
    () => realExecutablePathsCallback(),
    /TypeError.*undefined is not a string\. /,
    'should throw a type error when it takes no arguments.'
  );
});
