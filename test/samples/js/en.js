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
  
  mm.catalog = mm.catalog || {"things\u0004one book":"one book","things\u0004{n} books":"{n} books","dog":"dog\ndog","Testing\nKeep Testing":"Testing","Password":"","Rules":"","Username":"","Egg":"","Eggs":"","weekday\u0004Sunday":"","weekday\u0004Sundays":"","fruit\u0004orange":""};
  
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

    scope.pluralidx = mm.pluralidx;
    scope.gettext = mm.gettext;
    scope.ngettext = mm.ngettext;
    scope.pgettext = mm.pgettext;
    scope.npgettext = mm.npgettext;
    mm.initialized = true;
  }
}(this));