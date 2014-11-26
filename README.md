node-extjs-custom
=================

Customized version of Ext JS 4.2.1 with a subset of the functionalities ported for usage in NodeJS.

Functionalities included (indented by hierarchy)
* Ext
  * Ext.Template
    * Ext.XTemplate
  * Ext.XTemplateCompiler (required by XTemplate)
    * Ext.XTemplateParser

The files in this module are initially copy pasted from Ext JS 4.2.1.883.
All Ext.define with extends usage is replaced with Parent.prototype.extraProperty For extending

##Usage##

```javascript
var Ext       = require('./Ext');
Ext.XTemplate = require('./XTemplate');

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
