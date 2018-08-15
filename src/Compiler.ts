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
  
  mm.catalog = mm.catalog || {};
  
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

      var value = mm.gettext(context + '\x04' + msgid);
      if (value.indexOf('\x04') != -1) {
        value = msgid;
      }
      return value;
    };

    mm.npgettext = function(context, singular, plural, count) {
      
      var value = mm.ngettext(context + '\x04' + singular, context + '\x04' + plural, count);
      if (value.indexOf('\x04') != -1) {
        value = mm.ngettext(singular, plural, count);
      }
      return value;
    };

    scope.pluralidx = mm.pluralidx;
    scope.gettext = mm.gettext;
    scope.ngettext = mm.ngettext;
    scope.pgettext = mm.pgettext;
    scope.npgettext = mm.npgettext;
    mm.initialized = true;
  }
}(this));

