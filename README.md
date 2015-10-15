# real-executable-paths-callback

[![NPM version](https://img.shields.io/npm/v/real-executable-paths-callback.svg)](https://www.npmjs.com/package/real-executable-paths-callback)
[![Build Status](https://travis-ci.org/shinnn/real-executable-paths-callback.svg?branch=master)](https://travis-ci.org/shinnn/real-executable-paths-callback)
[![Build status](https://ci.appveyor.com/api/projects/status/7b3tpi0ti2xyc5on/branch/master?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/real-executable-paths-callback/branch/master)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/real-executable-paths-callback.svg)](https://coveralls.io/github/shinnn/real-executable-paths-callback)
[![Dependency Status](https://img.shields.io/david/shinnn/real-executable-paths-callback.svg?label=deps)](https://david-dm.org/shinnn/real-executable-paths-callback)
[![devDependency Status](https://img.shields.io/david/dev/shinnn/real-executable-paths-callback.svg?label=devDeps)](https://david-dm.org/shinnn/real-executable-paths-callback#info=devDependencies)

[Callback](http://thenodeway.io/posts/understanding-error-first-callbacks/)-style version of [real-executable-paths]:

> Find all the resolved paths of the given executable in the PATH, with expanding all symbolic links

```javascript
const realExecutablePathsCallback = require('real-executable-paths-callback');
const which = require('which');

which('zsh', {all: true}, (err, paths) => {
  paths; //=> ['/usr/local/bin/zsh', '/bin/zsh']
});

realExecutablePathsCallback('zsh', (err, binPath) => {
  binPath; //=> ['/usr/local/Cellar/zsh/5.1.1/bin/zsh', '/bin/zsh']
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install real-executable-paths-callback
```

## API

```javascript
const realExecutablePathsCallback = require('real-executable-paths-callback');
```

### realExecutablePathsCallback(*fileName* [, *options*], *callback*)

*fileName*: `String` (an executable name in the PATH)  
*options*: `Object`  
*callback*: `Function` (called after the paths are resolved)

It finds all the files of the given executable in the [PATH](http://pubs.opengroup.org/onlinepubs/000095399/basedefs/xbd_chap08.html#tag_08_03) environment variable, expands all symbolic links and resolves the canonicalized absolute pathname.

#### options

Options except for `all` option are used as [`which`](https://github.com/npm/node-which) [options](https://github.com/npm/node-which#options), and `option.cache` is used as `cache` of [`fs.realpath`](https://nodejs.org/api/fs.html#fs_fs_realpath_path_cache_callback).

```javascript
const realExecutablePathsCallback = require('real-executable-paths-callback');

realExecutablePathsCallback('foo', {
  path: 'bar:baz',
  cache: {
    'bar/foo': '/path/to/qux',
    'baz/foo': '/path/to/quux'
  }
}, (err, resolvedPaths) => {
  resolvedPaths; //=> ['/path/to/qux', '/path/to/quux']
});
```

## Related projects

* [real-executable-paths][real-executable-paths] ([Promises/A+](https://promisesaplus.com/) version)
* [real-executable-path-callback](https://github.com/shinnn/real-executable-path-callback) (Returns the first matched path instead of tha all)

## License

Copyright (c) 2015 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).

[real-executable-paths]: https://github.com/shinnn/real-executable-paths
