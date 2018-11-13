# packhorse [![Build Status](https://travis-ci.org/bendrucker/packhorse.svg?branch=master)](https://travis-ci.org/bendrucker/packhorse) [![Greenkeeper badge](https://badges.greenkeeper.io/bendrucker/packhorse.svg)](https://greenkeeper.io/)

API for updating multiple packages like `package.json` and `bower.json`.

## Installing

```bash
$ npm install packhorse
```

## API

### `packhorse`

##### `packhorse.load(packages)` -> `promise(pack)`

Accepts an `Array` of package configuration and loads them into the `Pack`. A package can be a:

* `path` to a package (string)
* an object with:
  * `path` (string)
  * `optional` (boolean)
 
```js
packhorse.load([
 './package.json', // required
 './bower.json', // required
 {path: './component.json', optional: true} // optional, will be ignored if not present
])
.then(function (pack) {
  // use Pack API
});
```

Paths are resolved relative to the current working directory for the process. The first package will be considered the "leader" for `pack.get` calls. Packages where `optional` is `true` will be excluded if they are not found.

In addition to `load`, `packhorse` exposes the `Pack` and `Package` constructors.

<hr>

### `Pack`

A `Pack` controls batch operations across many `Package` instances.

##### `get(key)` -> `any`

Gets data from the first package stored at `key`. 

##### `set(key [, value])` -> `pack`

Sets a value on all packages in the pack. `set` can be called with a key value pair or an object.

##### `read()` -> `promise(pack)`

Reads in data for all packages in the pack. Returns a promise that resolves when all packages have been read.

##### `write()` -> `promise(pack)`

Updates data for all packages in the pack. Returns a promise that resolves when all packages have been written.

##### `paths()` -> `Array`

Returns an array containing the paths of each package in the pack.

<hr>

### `Package`

##### `get(key)` -> `any`

Gets data from the package stored at `key`. 

##### `set(key [, value])` -> `package`

Sets a value on the package data. `set` can be called with a key value pair or an object.

##### `read()` -> `promise(pkg)`

Reads in data for the package. Returns a promise that resolves the package when the data has been read.

##### `write()` -> `promise(pkg)`

Writes data for the package. Returns a promise that resolves the package when the data has been written.
