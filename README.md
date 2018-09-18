# makemessages

[![NPM version][npm-verision-img]][npm-url]
[![NPM license][npm-license-img]][npm-url]

Extract and compile messages to localize a web app using Regular Expressions.

This package intends to work simliar to django's makemessages and compilemessages commands.

## Installation

### Local
```
npm i makemessages
```

### Global
```
npm i -g makemessages
```

## Usage
### Configuring CLI
#### Local
Change your package.json:
```javascript
{
  // ...
  "scripts": {
    "makemessages": "makemessages",
    "compilemessages": "compilemessages",
    // ...
  }
  // ...
}
```
```
npm run makemessages -- -c "./makemessages.json"
npm run compilemessages -- -c "./compilemessages.json"
```
#### Global
```
makemessages -c "./makemessages.json"
compilemessages -c "./compilemessages.json"
```

## Configuration
makemessages json configuration file must have a list to how to process your files

Example:
```javascript
[
  {
    "type": "po", // Valid types: po (only .po files implemented for now)
    "input": "./path/to/your/source/**/*.js", // glob pattern to search your files
    "output": "./path/to/locale/po/", // if there is already some previous file in this folder, next result will be a merge between existing messages and new found ones
    "functions": [ // Array<string> that will initiate regular expression objects to look for your messages
        "(?:^|[^$\\w])gettext\\(\\s*['\"](?<singular>.*?)['\"]\\s*\\)",
        "(?:^|[^$\\w])pgettext\\(\\s*['\"](?<context>.*?)['\"]\\s*,\\s*['\"](?<singular>.*?)['\"]\\s*\\)",
        "(?:^|[^$\\w])ngettext\\(\\s*['\"](?<singular>.*?)['\"]\\s*,\\s*['\"](?<plural>.*?)['\"]\\s*,\\s*(?<number>\\d*)\\s*\\)",
        "(?:^|[^$\\w])npgettext\\(\\s*['\"](?<context>.*?)['\"]\\s*,\\s*['\"](?<singular>.*?)['\"]\\s*,\\s*['\"](?<plural>.*?)['\"]\\s*,\\s*(?<number>\\d*)\\s*\\)"
    ],
    "languages": {
      "en": "English",
      "pt": "Portuguese",
      "pt-br": "Brazilian Portuguese"
    },
    "meta": { // meta data that will be inserted into your .po files
      "copyright": {
        "domain": "example.com",
        "package": "example"
      },
      "maintainer": {
        "name": "Developer",
        "email": "developer@example.com"
      },
      "Project-Id-Version": "0.0.1",
      "Report-Msgid-Bugs-To": "developer@example.com",
      "Language-Team": "Team Example"
    }
  }
]
```

compilemessages.json example
```javascript
[
  {
    "input": {
      "type": "po",
      "target": "./path/to/locale/po/*.po" 
    },
    "output": {
      "type": "json",
      "target": "./path/to/locale/json/"
    }
  },
  {
    "input": {
      "type": "po",
      "target": "./path/to/locale/po/*.po" 
    },
    "output": {
      "type": "javascript",
      "target": "./path/to/locale/js/",
      "functions": { // Optional: change functions names
        "gettext": "gettext",
        "ngettext": "ngettext",
        "pgettext": "pgettext",
        "npgettext": "npgettext"
      }
    }
  }
]
```
Expected output
```
./path/to/locale/
  po/
    en.po
    pt.po
    pt-br.po
  json/
    en.json
    pt.json
    pt-br.json
  js/
    en.js
    pt.js
    pt-br.js
```

## Next features
> PO
> * Remove Old Messages - Configurable
> * Reference Position - Configurable

> Javascript
> * interpolate function

[npm-url]: https://www.npmjs.com/package/makemessages
[npm-verision-img]: https://img.shields.io/npm/v/makemessages.svg
[npm-license-img]: https://img.shields.io/npm/l/makemessages.svg