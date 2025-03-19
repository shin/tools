# @shin/tools

A toolset for personal projects

## Table of Contents

- [Configuration](#configuration)
- [Installation](#installation)
- [Usage](#Usage)
- [Dependencies](#dependencies)
- [License](#license)

## Configuration

Create a .npmrc file in your code root dir

```ini
@shin:registry=https://npm.pkg.github.com
```

## Installation

```bash
npm i -D @shin/tools@latest
```

## Usage

Create a st.config.json file in your code root dir

```json
{
  "monorepo": {
    "electron": {
      "dir": "packages/electron"
    },
    "next": {
      "dir": "packages/next",
      "useExports": true
    }
  }
}
```

Add the script to package.json

```json
"scripts": {
  "st": "tools build"
}

```

Add the exports to package.json(packages/next) like below

```json
"exports": {
    "./standalone/server": "./.next/standalone/packages/next/server.js"
  }
```

## Features

- monorepo/
  - packages/
    - electron/
    - next/

In monorepo,

1. Comment out the line in the standalone server.js because it causes a problem when used in the Electron app.

```js
process.chdir(__dirname)
```

2. Electron Forge does not use the local Next.js package correctly, so to run the Next.js standalone server, you need to prepare Next.js resources for Electron to build the bundler.

## Dependencies

- @types/node
- esbuild
- glob
- typescript

## License

MIT

---

## Additional Information

### Version History

- 0.0.1
  - Initial Release

### Contact

- Maintainer: Shin
- Project Link: https://github.com/shin/tools
