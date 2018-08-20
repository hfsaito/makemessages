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
    // ...
  }
  // ...
}
```
```
npm run makemessages -- -c "./makemessages.json"
```
if you install globally:
```
makemessages -c "./makemessages.json"
```

## Configuration
makemessages.json example
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
* Able to chagne transalation function through makemessage.json
* Build PO file header
* Able to chagne PO file header through makemessage.json