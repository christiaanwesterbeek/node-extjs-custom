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
  it('Ext.XTemplateParser instantiation should work', function() {
    var x = new Ext.XTemplateParser();

    (x instanceof Ext.XTemplateParser).should.be.equal(true);
    (x instanceof Ext.XTemplateCompiler).should.be.equal(false);
    x.className.should.be.a.String.and.be.equal('Ext.XTemplateParser');
  });
  it('Ext.XTemplateCompiler instantiation should work', function() {
    var x = new Ext.XTemplateCompiler();

    (x instanceof Ext.XTemplateParser).should.be.equal(true);
    (x instanceof Ext.XTemplateCompiler).should.be.equal(true);
    x.className.should.be.a.String.and.be.equal('Ext.XTemplateCompiler');
  });
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
    html.should.be.a.String.and.be.equal('Name: John, Age: 25');
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
    //The test below is to see that it's Actually XTemplate at work an not Template
    html.should.be.a.String.and.not.be.equal('<p>Name: Don Griffin</p><p>Title: Senior Technomage</p><p>Company: Sencha Inc.</p><p>Kids: <tpl for="kids"><p>Don Griffin</p></tpl></p>')
    html.should.be.a.String.and.be.equal('<p>Name: Don Griffin</p><p>Title: Senior Technomage</p><p>Company: Sencha Inc.</p><p>Kids: <p>Aubrey</p><p>Joshua</p><p>Cale</p><p>Nikol</p><p>Solomon</p></p>');
  });

  it('date formatting functions should work', function() {
    var tpl = new Ext.XTemplate(
      '<p>{name:date("Y-m-d")}</p>'
    );

    var html = tpl.apply({name: new Date(2014, 10, 29)});
    //The test below is to see that it's Actually XTemplate at work an not Template
    html.should.be.a.String.and.be.equal('<p>2014-11-29</p>');
  });
});

