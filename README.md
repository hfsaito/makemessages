# makemessages
Extract and compile messages to localize a web app using Regular Expressions.

This package intends to work simliar to django's makemessages and compilemessages commands.

## Installation
```
npm i makemessages
npm i -g makemessages
```

## Usage
if you install locally, change your package.json:
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
if you install globally:
```
makemessages -c "./makemessages.json"
compilemessages -c "./compilemessages.json"
```

### Configuration
makemessages json configuration file must have a list to how to process your files

Example:
```javascript
[
  {
    "type": "po", // Valid types: po (only .po files implemented for now)
    "input": "./test/samples/**/*.js", // glob pattern to search your files
    "output": "./test/samples/po/", // if there is already some previous file in this folder, next result will be a merge between existing messages and new found ones
    "functions": [ // Array<string> that will initiate regular expression objects to look for your messages
        "(?:^|[^$\\w])gettext\\(['\"](?<singular>.*?)['\"]\\)",
        "(?:^|[^$\\w])pgettext\\(['\"](?<context>.*?)['\"],\\s*['\"](?<singular>.*?)['\"]\\)",
        "(?:^|[^$\\w])ngettext\\(['\"](?<singular>.*?)['\"],\\s*['\"](?<plural>.*?)['\"],\\s*(?<number>\\d*)\\)",
        "(?:^|[^$\\w])npgettext\\(['\"](?<context>.*?)['\"],\\s*['\"](?<singular>.*?)['\"],\\s*['\"](?<plural>.*?)['\"],\\s*(?<number>\\d*)\\)"
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
{
  "watch": "./test/samples/**/*.js", // Files that strings will be extracted using gettext function
  "po": {
    "languages": {
      "en": "English",
      "pt": "Portuguese",
      "pt-br": "Brazilian Portuguese"
    },
    "output": "./path/to/output/po/"
  },
  "json": {
    "input": "./path/to/output/po/",
    "output": "./path/to/output/json/"
  }
}
```
Expected output
```
./path/to/output/
  po/
    en/
      locale.po
    pt/
      locale.po
    pt-br/
      locale.po
  json/
    en/
      locale.json
    pt/
      locale.json
    pt-br/
      locale.json
```

### Next features
* Able to change translation function through makemessage.json
* Optinal removing old messeges not found

### Known issues
* makemessages don't gather msgctx or plural