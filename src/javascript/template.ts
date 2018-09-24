export function template(functions:{ [index: string]: string } = {}, catalog: { [index: string]: string } = {}): string {
functions = {
  gettext: 'gettext',
  pgettext: 'pgettext',
  ngettext: 'ngettext',
  npgettext: 'npgettext',
  ...functions
}
return `(function(scope) {

  var mm = scope.mm || (scope.mm = {});
  
  mm.pluralidx = function(n) {
    var v=(n > 1);
    if (typeof(v) == 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  
  mm.catalog = mm.catalog || ${JSON.stringify(catalog)};
  
  var newcatalog = {};
  for (var key in newcatalog) {
    mm.catalog[key] = newcatalog[key];
  }
  

  if (!mm.initialized) {

    mm.${functions.gettext} = function(msgid) {

      var value = mm.catalog[msgid];
      if (typeof(value) == 'undefined') {
        return msgid;
      } else {
        return (typeof(value) == 'string') ? value : value[0];
      }
    };

    mm.${functions.ngettext} = function(singular, plural, count) {

      var value = mm.catalog[singular];
      if (typeof(value) == 'undefined') {
        return (count == 1) ? singular : plural;
      } else {
        return value[mm.pluralidx(count)];
      }
    };

    mm.${functions.pgettext} = function(context, msgid) {

      var value = mm.${functions.gettext}(context + '\x04' + msgid);
      if (value.indexOf('\x04') != -1) {
        value = msgid;
      }
      return value;
    };

    mm.${functions.npgettext} = function(context, singular, plural, count) {
      
      var value = mm.${functions.ngettext}(context + '\x04' + singular, context + '\x04' + plural, count);
      if (value.indexOf('\x04') != -1) {
        value = mm.${functions.ngettext}(singular, plural, count);
      }
      return value;
    };

    mm.interpolate = function(fmt, obj, named) {

      if (named)

        return fmt.replace(/%\((\w+?)\)(c|s|b|d|o|x|X|f|j)/g, function(match, name, varformat, offset, text) {

          if (typeof(obj[name]) == 'undefined')
            return match;
          
          switch(varformat) {
          case 'c':
            if (String(obj[name]).length > 1)
              throw 'Expected a character';
          case 's':
            return String(obj[name]);
          case 'b':
          case 'd':
          case 'o':
          case 'x':
          case 'X':
            return '' + parseInt(obj[name]);
          case 'f':
            return '' + parseFloat(obj[name]);
          case 'j':
            return JSON.stringfy(obj[name]);
          }

          return match;
        });

      return fmt.replace(/%(c|s|b|d|o|x|X|f|j)/g, function(match, varformat, offset, text) {

        if (typeof(obj[0]) == 'undefined')
          return match;
        
        switch(varformat) {
        case 'c':
          if (String(obj[0]).length > 1)
            throw 'Expected a character';
        case 's':
          return String(obj.shift());
        case 'b':
        case 'd':
        case 'o':
        case 'x':
        case 'X':
          return '' + parseInt(obj.shift());
        case 'f':
          return '' + parseFloat(obj.shift());
        case 'j':
          return JSON.stringfy(obj.shift());
        }

        return match;
      });
    };

    scope.pluralidx = mm.pluralidx;
    scope.${functions.gettext} = mm.${functions.gettext};
    scope.${functions.ngettext} = mm.${functions.ngettext};
    scope.${functions.pgettext} = mm.${functions.pgettext};
    scope.${functions.npgettext} = mm.${functions.npgettext};
    mm.initialized = true;
  }
}(this));`;
};