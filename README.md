[![Travis](https://img.shields.io/travis/smhxx/atom-transpiler-debug-tool.svg)](https://travis-ci.org/smhxx/atom-transpiler-debug-tool)
[![Version](https://img.shields.io/npm/v/atom-transpiler-debug-tool.svg)](https://www.npmjs.com/package/atom-transpiler-debug-tool)
[![Downloads](https://img.shields.io/npm/dt/atom-transpiler-debug-tool.svg)](https://www.npmjs.com/package/atom-transpiler-debug-tool)
[![Greenkeeper](https://badges.greenkeeper.io/smhxx/atom-transpiler-debug-tool.svg)](https://greenkeeper.io/)
# atom-transpiler-debug-tool

This package is a small debugging utility intended for use with [Atom](https://atom.io/) packages which rely on Atom's "custom transpiler" feature. When installed, it can analyze your package's configuration to determine which files are associated with each custom transpiler it relies on, as well as the current state of the compile cache for each source file. This analysis can help shed light on unexpected behavior and determine whether your package is configured properly.

## Usage

From your package's root directory:
```sh
npm install atom-transpiler-debug-tool --save-dev
```

Then in your package.json file, add a script:
```js
{
  // ...
  "scripts": {
    "debug": "atom-transpiler-debug-tool"
  }
}
```

Now you can `npm run debug` from your package's root directory and the debug information will be printed to stdout!

## License

The source code of this project is released under the [MIT Expat License](https://opensource.org/licenses/MIT), which freely permits reuse and redistribution. Feel free to use and/or modify it in any way, provided that you include this copyright notice with any copies that you make.

*Copyright © 2016 "smhxx" (https://github.com/smhxx)*

*Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:*

*The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.*

*THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*
