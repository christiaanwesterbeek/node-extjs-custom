var enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable','toLocaleString', 'toString', 'constructor']

var Ext = { //based on 4.2.1.833 only rewritten to fit node
  /**
   * Copies all the properties of config to the specified object.
   * Note that if recursive merging and cloning without referencing the original objects / arrays is needed, use
   * {@link Ext.Object#merge} instead.
   * @param {Object} object The receiver of the properties
   * @param {Object} config The source of the properties
   * @param {Object} [defaults] A different object that will also be applied for default values
   * @return {Object} returns obj
   */
  apply: function(object, config, defaults) {
    if (defaults) {
      Ext.apply(object, defaults);
    }

    if (object && config && typeof config === 'object') {
      var i, j, k;

      for (i in config) {
        object[i] = config[i];
      }

      if (enumerables) {
        for (j = enumerables.length; j--;) {
          k = enumerables[j];
          if (config.hasOwnProperty(k)) {
            object[k] = config[k];
          }
        }
      }
    }

    return object;
  },
  /**
   * Returns true if the passed value is empty, false otherwise. The value is deemed to be empty if it is either:
   *
   * - `null`
   * - `undefined`
   * - a zero-length array
   * - a zero-length string (Unless the `allowEmptyString` parameter is set to `true`)
   *
   * @param {Object} value The value to test
   * @param {Boolean} allowEmptyString (optional) true to allow empty strings (defaults to false)
   * @return {Boolean}
   * @markdown
   */
  isEmpty: function(value, allowEmptyString) {
      return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (Ext.isArray(value) && value.length === 0);
  },

  /**
   * Returns true if the passed value is a JavaScript Array, false otherwise.
   *
   * @param {Object} target The target to test
   * @return {Boolean}
   * @method
   */
  isArray: ('isArray' in Array) ? Array.isArray : function(value) {
      return toString.call(value) === '[object Array]';
  },

  /**
   * Returns true if the passed value is a JavaScript Date object, false otherwise.
   * @param {Object} object The object to test
   * @return {Boolean}
   */
  isDate: function(value) {
      return toString.call(value) === '[object Date]';
  },

  /**
   * Returns true if the passed value is a JavaScript Object, false otherwise.
   * @param {Object} value The value to test
   * @return {Boolean}
   * @method
   */
  isObject: (toString.call(null) === '[object Object]') ?
  function(value) {
      // check ownerDocument here as well to exclude DOM nodes
      return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
  } :
  function(value) {
      return toString.call(value) === '[object Object]';
  },

  /**
   * @private
   */
  isSimpleObject: function(value) {
      return value instanceof Object && value.constructor === Object;
  },
  /**
   * Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
   * @param {Object} value The value to test
   * @return {Boolean}
   */
  isPrimitive: function(value) {
      var type = typeof value;

      return type === 'string' || type === 'number' || type === 'boolean';
  },

  /**
   * Returns true if the passed value is a JavaScript Function, false otherwise.
   * @param {Object} value The value to test
   * @return {Boolean}
   * @method
   */
  isFunction: function(value) {
      return !!(value && value.$extIsFunction);
  },

  /**
   * Returns true if the passed value is a number. Returns false for non-finite numbers.
   * @param {Object} value The value to test
   * @return {Boolean}
   */
  isNumber: function(value) {
      return typeof value === 'number' && isFinite(value);
  },

  /**
   * Validates that a value is numeric.
   * @param {Object} value Examples: 1, '1', '2.34'
   * @return {Boolean} True if numeric, false otherwise
   */
  isNumeric: function(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
  },

  /**
   * Returns true if the passed value is a string.
   * @param {Object} value The value to test
   * @return {Boolean}
   */
  isString: function(value) {
      return typeof value === 'string';
  },

  /**
   * Returns true if the passed value is a boolean.
   *
   * @param {Object} value The value to test
   * @return {Boolean}
   */
  isBoolean: function(value) {
      return typeof value === 'boolean';
  },

  /**
   * Returns true if the passed value is an HTMLElement
   * @param {Object} value The value to test
   * @return {Boolean}
   */
  isElement: function(value) {
      return value ? value.nodeType === 1 : false;
  },

  /**
   * Returns true if the passed value is a TextNode
   * @param {Object} value The value to test
   * @return {Boolean}
   */
  isTextNode: function(value) {
      return value ? value.nodeName === "#text" : false;
  },

  /**
   * Returns true if the passed value is defined.
   * @param {Object} value The value to test
   * @return {Boolean}
   */
  isDefined: function(value) {
      return typeof value !== 'undefined';
  },

  /**
   * Returns `true` if the passed value is iterable, that is, if elements of it are addressable using array
   * notation with numeric indices, `false` otherwise.
   *
   * Arrays and function `arguments` objects are iterable. Also HTML collections such as `NodeList` and `HTMLCollection'
   * are iterable.
   *
   * @param {Object} value The value to test
   * @return {Boolean}
   */
  isIterable: function(value) {
      // To be iterable, the object must have a numeric length property and must not be a string or function.
      if (!value || typeof value.length !== 'number' || typeof value === 'string' || value.$extIsFunction) {
          return false;
      }

      // Certain "standard" collections in IE (such as document.images) do not offer the correct
      // Javascript Object interface; specifically, they lack the propertyIsEnumerable method.
      // And the item property while it does exist is not typeof "function"
      if (!value.propertyIsEnumerable) {
          return !!value.item;
      }

      // If it is a regular, interrogatable JS object (not an IE ActiveX object), then...
      // If it has its own property called "length", but not enumerable, it's iterable
      if (value.hasOwnProperty('length') && !value.propertyIsEnumerable('length')) {
          return true;
      }

      // Test against whitelist which includes known iterable collection types
      return iterableRe.test(toString.call(value));
  },  
  log : function(str) {throw(new Error(str))},//console.error,
  util: {},
  dom : {},

  /**
   * Customized version of Ext's define method to extend a Class
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
   * http://stackoverflow.com/questions/15192722/javascript-extending-class
   */
  extend: function(Parent, data) {
    //define the new class that extends the parent
    function F() {
        // Call the parent constructor
        Parent.apply(this, arguments);
    }
    // inherit parent
    F.prototype = Object.create(Parent.prototype);//alternative: new Parent();

    // correct the constructor pointer because it points to the parent
    F.prototype.constructor = F;

    return F;
  },
}

//http://stackoverflow.com/questions/20129236/creating-functions-dynamically-in-js
//
Ext.functionFactory= function() {
  var me = this,
      args = Array.prototype.slice.call(arguments),
      ln;
     
  /**
   * Alternative way of Sandboxing needed. To get Ext in scope of the function produced by Ext.functionFactory
   * Make sure to add scope.ExtReference=Ext when you call the produced function
   * 2 Examples can be found in lang/Date.js. It's like this:
   * var f = Ext.functionFactory("return 'stuff'"");
   * date.ExtReference = Ext;
   * return f.call(date);
   */
  if (true) { 
      ln = args.length;
      if (ln > 0) {
          ln--;
          args[ln] = 'var Ext=this.ExtReference;' + args[ln];
      }
  }

  return Function.prototype.constructor.apply(Function.prototype, args);
};

Ext.String            = require('./lang/String')(Ext);
Ext.Date              = require('./lang/Date')(Ext);
Ext.Number            = require('./lang/Number')(Ext);
Ext.util.Format       = require('./util/Format')(Ext);

Ext.XTemplateParser   = require('./XTemplateParser')(Ext);
Ext.XTemplateCompiler = require('./XTemplateCompiler')(Ext);

Ext.Template          = require('./Template')(Ext);
Ext.XTemplate         = require('./XTemplate')(Ext);

module.exports = Ext;