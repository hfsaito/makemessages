(function(scope) {

  var mm = scope.mm || (scope.mm = {});
  
  mm.pluralidx = function(n) {
    var v=(n > 1);
    if (typeof(v) == 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  
  mm.catalog = mm.catalog || {"things\u0004one book":"um livro","things\u0004{n} books":"{n} livros","dog":"cachorro\ncachorro","Testing\nKeep Testing":"Testando","Password":"Password","Rules":"Rules","Username":"Username","Egg":"Egg","Eggs":"Eggs","weekday\u0004Sunday":"Sunday","weekday\u0004Sundays":"Sundays","fruit\u0004orange":"orange","Testing %(module)s":"Testando %(module)s"};
  
  var newcatalog = {};
  for (var key in newcatalog) {
    mm.catalog[key] = newcatalog[key];
  }
  

  if (!mm.initialized) {

    mm.gettext = function(msgid) {

      var value = mm.catalog[msgid];
      if (typeof(value) == 'undefined') {
        return msgid;
      } else {
        return (typeof(value) == 'string') ? value : value[0];
      }
    };

    mm.ngettext = function(singular, plural, count) {

      var value = mm.catalog[singular];
      if (typeof(value) == 'undefined') {
        return (count == 1) ? singular : plural;
      } else {
        return value[mm.pluralidx(count)];
      }
    };

    mm.pgettext = function(context, msgid) {

      var value = mm.gettext(context + '' + msgid);
      if (value.indexOf('') != -1) {
        value = msgid;
      }
      return value;
    };

    mm.npgettext = function(context, singular, plural, count) {
      
      var value = mm.ngettext(context + '' + singular, context + '' + plural, count);
      if (value.indexOf('') != -1) {
        value = mm.ngettext(singular, plural, count);
      }
      return value;
    };

    mm.interpolate = function(fmt, obj, named) {

      if (named)

        return fmt.replace(/%((w+?))(c|s|b|d|o|x|X|f|j)/g, function(match, name, varformat, offset, text) {

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
    scope.gettext = mm.gettext;
    scope.ngettext = mm.ngettext;
    scope.pgettext = mm.pgettext;
    scope.npgettext = mm.npgettext;
    mm.initialized = true;
  }
}(this));