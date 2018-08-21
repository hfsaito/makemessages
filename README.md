# makemessages
Extract and compile messages to localize a web app

This package intends to work simliar to django's makemessages and compilemessages commands

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

## Configuration
makemessages.json example
```javascript
{
  "watch": "./test/samples/**/*.js",  // Files that strings will be extracted using gettext function
  "po": {
    "languages": {
      "en": "English",
      "pt": "Portuguese",
      "pt-br": "Brazilian Portuguese"
    },
    "output": "./test/samples/po/"
  },
  "meta": { // Optinal config
    "po": { // Edit PO files headers
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
}
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