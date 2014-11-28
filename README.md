[![Build Status](https://travis-ci.org/devotis/node-extjs-custom.svg)](https://travis-ci.org/devotis/node-extjs-custom)

node-extjs-custom
=================

Customized version of Ext JS 4.2.1 with a subset of the functionalities ported for usage in NodeJS.

Functionalities included (indented by hierarchy)
* Ext
  * Ext.Template
    * Ext.XTemplate
  * Ext.XTemplateParser
    * Ext.XTemplateCompiler (required by XTemplate)

The files in this module are initially copy pasted from Ext JS 4.2.1.883.
All Ext.define (with extends) usage is replaced with a plain vanilla Ext.extend method.

##Install##
Install with [npm](http://github.com/isaacs/npm)

```
npm install extjs-custom
```

##Usage##

```javascript
var Ext = require('extjs-custom');

var data = {
    name: 'Don Griffin',
    title: 'Senior Technomage',
    company: 'Sencha Inc.',
    drinks: ['Coffee', 'Water', 'More Coffee'],
    kids: [
        { name: 'Aubrey',  age: 17 },
        { name: 'Joshua',  age: 13 },
        { name: 'Cale',    age: 10 },
        { name: 'Nikol',   age: 5 },
        { name: 'Solomon', age: 0 }
    ]
};

var tpl = new Ext.XTemplate('Name: {0}, Age: {1}');
var html = tpl.apply(['John', 25]);
console.log(html)

var tpl = new Ext.XTemplate(
    '<p>Name: {name}</p>',
    '<p>Title: {title}</p>',
    '<p>Company: {company}</p>',
    '<p>Kids: ',
    '<tpl for="kids">',     // interrogate the kids property within the data
        '<p>{name}</p>',
    '</tpl></p>'
);
var html = tpl.apply(data);
console.log(html)
```

##License##

ExtJS is a fully licensed product for use in commercial projects or under GPL for open source projects. It is assumed that if you're using node-extjs-custom that you will conform to the licensing requirements of Sencha (http://www.sencha.com/products/extjs/license/).