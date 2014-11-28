var should = require('should');

var Ext = require('../Ext');

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

describe('Class instantiation and inheritance', function() {
  it('Ext.Template instantiation should work', function() {
    var tpl = new Ext.Template('');

    (tpl instanceof Ext.Template).should.be.equal(true);
    (tpl instanceof Ext.XTemplate).should.be.equal(false);
    tpl.className.should.be.a.String.and.be.equal('Ext.Template');
  });
  it('Ext.XTemplate instantiation should work', function() {
    var tpl = new Ext.XTemplate('');

    (tpl instanceof Ext.Template).should.be.equal(true);
    (tpl instanceof Ext.XTemplate).should.be.equal(true);
    tpl.className.should.be.a.String.and.be.equal('Ext.XTemplate');
  });
});

describe('Template', function() {
  it('basic compiling should work', function() {
    var tpl = new Ext.Template('Name: {0}, Age: {1}');
    
    var html = tpl.apply(['John', 25]);
    html.should.be.a.String.and.be.equal('Name: John, Age: 25')
  });
});

describe('XTemplate', function() {
  it('basic compiling should work', function() {
    var tpl = new Ext.XTemplate(
      '<p>Name: {name}</p>',
      '<p>Title: {title}</p>',
      '<p>Company: {company}</p>',
      '<p>Kids: ',
      '<tpl for="kids">', // interrogate the kids property within the data
          '<p>{name}</p>',
      '</tpl></p>'
    );

    var html = tpl.apply(data);
    html.should.be.a.String.and.be.equal('<p>Name: Don Griffin</p><p>Title: Senior Technomage</p><p>Company: Sencha Inc.</p><p>Kids: <tpl for="kids"><p>Don Griffin</p></tpl></p>')
  });
});

