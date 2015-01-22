var should = require('should');

var Ext = require('../Ext');

var data = {
    name: 'Don Griffin',
    title: 'Senior Technomage',
    company: 'Sencha Inc.',
    drinks: ['Coffee', 'Water', 'More Coffee'],
    kids: [
        { name: 'Aubrey',  age: 17, created: new Date(2014, 0, 1, 11, 45, 56)},
        { name: 'Joshua',  age: 13, created: new Date(2014, 0, 2, 12, 45, 56)},
        { name: 'Cale',    age: 10, created: new Date(2014, 0, 3, 13, 45, 56)},
        { name: 'Nikol',   age: 5,  created: new Date(2014, 0, 4, 14, 45, 56)},
        { name: 'Solomon', age: 0,  created: new Date(2014, 0, 5, 15, 45, 56)}
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

describe('Template vs XTemplate', function() {
  it('Template basic compiling should work', function() {
    var tpl = new Ext.Template('Name: {0}, Age: {1}');
    
    var html = tpl.apply(['John', 25]);
    html.should.be.a.String.and.be.equal('Name: John, Age: 25');
  });

  it('XTemplate engine should not use Template engine', function() {
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
});

describe('All examples on http://docs.sencha.com/extjs/4.2.1/#!/api/Ext.XTemplate', function() {
  describe('Auto filling of arrays', function() {
    it('example 1 should work', function() {
      var tpl = new Ext.XTemplate(
        '<p>Kids: ',
        '<tpl for=".">',       // process the data.kids node
            '<p>{#}. {name}</p>',  // use current array index to autonumber
        '</tpl></p>'
      );

      var html = tpl.apply(data.kids);
      //The test below is to see that it's Actually XTemplate at work an not Template
      html.should.be.a.String
      .and.be.equal('<p>Kids: <p>1. Aubrey</p><p>2. Joshua</p><p>3. Cale</p><p>4. Nikol</p><p>5. Solomon</p></p>');
    });

    it('example 2, illustrating the for property, should work', function() {
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
      //The test below is to see that it's Actually XTemplate at work an not Template
      html.should.be.a.String
      .and.be.equal('<p>Name: Don Griffin</p><p>Title: Senior Technomage</p><p>Company: Sencha Inc.</p><p>Kids: <p>Aubrey</p><p>Joshua</p><p>Cale</p><p>Nikol</p><p>Solomon</p></p>');
    });

    it('example 3, using the special {.} variable inside a loop, should work', function() {
      var tpl = new Ext.XTemplate(
        '<p>{name}\'s favorite beverages:</p>',
        '<tpl for="drinks">',
            '<div> - {.}</div>',
        '</tpl>'
      );

      var html = tpl.apply(data);
      //The test below is to see that it's Actually XTemplate at work an not Template
      html.should.be.a.String
      .and.be.equal('<p>Don Griffin\'s favorite beverages:</p><div> - Coffee</div><div> - Water</div><div> - More Coffee</div>');
    });

    it('example 4, accessing the parent object, should work', function() {
      var tpl = new Ext.XTemplate(
        '<p>Name: {name}</p>',
        '<p>Kids: ',
        '<tpl for="kids">',
            '<tpl if="age &gt; 1">',
                '<p>{name}</p>',
                '<p>Dad: {parent.name}</p>',
            '</tpl>',
        '</tpl></p>'
      );

      var html = tpl.apply(data);
      //The test below is to see that it's Actually XTemplate at work an not Template
      html.should.be.a.String
      .and.be.equal('<p>Name: Don Griffin</p><p>Kids: <p>Aubrey</p><p>Dad: Don Griffin</p><p>Joshua</p><p>Dad: Don Griffin</p><p>Cale</p><p>Dad: Don Griffin</p><p>Nikol</p><p>Dad: Don Griffin</p></p>');
    });

    it('example 5, using the foreach operator, should work', function() {
      var tpl = new Ext.XTemplate(
        '<dl>',
            '<tpl foreach=".">',
                '<dt>{$}</dt>', // the special **`{$}`** variable contains the property name
                '<dd>{.}</dd>', // within the loop, the **`{.}`** variable is set to the property value
            '</tpl>',
        '</dl>'
      );

      var html = tpl.apply(data);
      //The test below is to see that it's Actually XTemplate at work an not Template
      html.should.be.a.String
      .and.be.equal('<dl><dt>name</dt><dd>Don Griffin</dd><dt>title</dt><dd>Senior Technomage</dd><dt>company</dt><dd>Sencha Inc.</dd><dt>drinks</dt><dd></dd><dt>kids</dt><dd></dd></dl>');
    });
  });

  describe('Conditional processing with basic comparison operators', function() {
    it('example 1, using the tpl tag and the if operator, should work', function() {
      var tpl = new Ext.XTemplate(
        '<p>Name: {name}</p>',
        '<p>Kids: ',
        '<tpl for="kids">',
            '<tpl if="age &gt; 1">',
                '<p>{name}</p>',
            '</tpl>',
        '</tpl></p>'
      );

      var html = tpl.apply(data);
      //The test below is to see that it's Actually XTemplate at work an not Template
      html.should.be.a.String
      .and.be.equal('<p>Name: Don Griffin</p><p>Kids: <p>Aubrey</p><p>Joshua</p><p>Cale</p><p>Nikol</p></p>');
    });

    it('example 2a, using advanced conditionals, should work', function() {
      var tpl = new Ext.XTemplate(
        '<p>Name: {name}</p>',
        '<p>Kids: ',
        '<tpl for="kids">',
            '<p>{name} is a ',
            '<tpl if="age &gt;= 13">',
                '<p>teenager</p>',
            '<tpl elseif="age &gt;= 2">',
                '<p>kid</p>',
            '<tpl else>',
                '<p>baby</p>',
            '</tpl>',
        '</tpl></p>'
      );

      var html = tpl.apply(data);
      //The test below is to see that it's Actually XTemplate at work an not Template
      html.should.be.a.String
      .and.be.equal('<p>Name: Don Griffin</p><p>Kids: <p>Aubrey is a <p>teenager</p><p>Joshua is a <p>teenager</p><p>Cale is a <p>kid</p><p>Nikol is a <p>kid</p><p>Solomon is a <p>baby</p></p>');
    });


    it('example 2b, using advanced conditionals, should work', function() {
      var tpl = new Ext.XTemplate(
        '<p>Name: {name}</p>',
        '<p>Kids: ',
        '<tpl for="kids">',
            '<p>{name} is a ',
            '<tpl switch="name">',
                '<tpl case="Aubrey" case="Nikol">',
                    '<p>girl</p>',
                '<tpl default>',
                    '<p>boy</p>',
            '</tpl>',
        '</tpl></p>'
      );

      var html = tpl.apply(data);
      //The test below is to see that it's Actually XTemplate at work an not Template
      html.should.be.a.String
      .and.be.equal('<p>Name: Don Griffin</p><p>Kids: <p>Aubrey is a <p>girl</p><p>Joshua is a <p>boy</p><p>Cale is a <p>boy</p><p>Nikol is a <p>girl</p><p>Solomon is a <p>boy</p></p>');
    });

  });

  describe('Basic math support', function() {
    it('example 1 should work', function() {
      var tpl = new Ext.XTemplate(
        '<p>Name: {name}</p>',
        '<p>Kids: ',
        '<tpl for="kids">',
            '<tpl if="age &gt; 1">',  // <-- Note that the > is encoded
                '<p>{#}: {name}</p>',  // <-- Auto-number each item
                '<p>In 5 Years: {age+5}</p>',  // <-- Basic math
                '<p>Dad: {parent.name}</p>',
            '</tpl>',
        '</tpl></p>'
      );

      var html = tpl.apply(data);
      //The test below is to see that it's Actually XTemplate at work an not Template
      html.should.be.a.String
      .and.be.equal('<p>Name: Don Griffin</p><p>Kids: <p>1: Aubrey</p><p>In 5 Years: 22</p><p>Dad: Don Griffin</p><p>2: Joshua</p><p>In 5 Years: 18</p><p>Dad: Don Griffin</p><p>3: Cale</p><p>In 5 Years: 15</p><p>Dad: Don Griffin</p><p>4: Nikol</p><p>In 5 Years: 10</p><p>Dad: Don Griffin</p></p>');
    });

  });

  describe('Execute arbitrary inline code with special built-in template variables', function() {
    it('example 1, using values and xindex, should work', function() {
      var tpl = new Ext.XTemplate(
        '<p>Name: {name}</p>',
        '<p>Company: {[values.company.toUpperCase() + ", " + values.title]}</p>',
        '<p>Kids: ',
        '<tpl for="kids">',
            '<div class="{[xindex % 2 === 0 ? "even" : "odd"]}">',
            '{name}',
            '</div>',
        '</tpl></p>'
      );

      var html = tpl.apply(data);
      //The test below is to see that it's Actually XTemplate at work an not Template
      html.should.be.a.String
      .and.be.equal('<p>Name: Don Griffin</p><p>Company: SENCHA INC., Senior Technomage</p><p>Kids: <div class=\"odd\">Aubrey</div><div class=\"even\">Joshua</div><div class=\"odd\">Cale</div><div class=\"even\">Nikol</div><div class=\"odd\">Solomon</div></p>');
    });

  });

  describe('Template member functions', function() {
    it('example 1, using member functions, should work', function() {
      var tpl = new Ext.XTemplate(
        '<p>Name: {name}</p>',
        '<p>Kids: ',
        '<tpl for="kids">',
            '<tpl if="this.isGirl(name)">',
                '<p>Girl: {name} - {age}</p>',
            '<tpl else>',
                '<p>Boy: {name} - {age}</p>',
            '</tpl>',
            '<tpl if="this.isBaby(age)">',
                '<p>{name} is a baby!</p>',
            '</tpl>',
        '</tpl></p>',
        {
          // XTemplate configuration:
          disableFormats: true,
          // member functions:
          isGirl: function(name){
             return name == 'Aubrey' || name == 'Nikol';
          },
          isBaby: function(age){
             return age < 1;
          }
        }
      );

      var html = tpl.apply(data);
      //The test below is to see that it's Actually XTemplate at work an not Template
      html.should.be.a.String
      .and.be.equal('<p>Name: Don Griffin</p><p>Kids: <p>Girl: Aubrey - 17</p><p>Boy: Joshua - 13</p><p>Boy: Cale - 10</p><p>Girl: Nikol - 5</p><p>Boy: Solomon - 0</p><p>Solomon is a baby!</p></p>');
    });

  });
});

describe('Special formatting with XTemplate', function() {
  it('date formatting functions should work', function() {
    var tpl = new Ext.XTemplate(
      '<tpl for="kids">',
          '<tpl if="age &gt; 1">',
              '<p>{created:date("Y-m-d")}</p>',
          '</tpl>',
      '</tpl></p>'      
    );

    var html = tpl.apply(data);
    //The test below is to see that it's Actually XTemplate at work an not Template
    html.should.be.a.String.and.be.equal('<p>2014-01-01</p><p>2014-01-02</p><p>2014-01-03</p><p>2014-01-04</p></p>');
  });

  it('combining built-in template variables with date formatting functions should work', function() {
    var tpl = new Ext.XTemplate(
      '<tpl for="kids">',
          '<tpl if="age &gt; 1">',
              '<p>{[Ext.util.Format.date(values.created, "H:i") || \'-\']}</p>',
          '</tpl>',
      '</tpl></p>'      
    );

    var html = tpl.apply(data);
    //The test below is to see that it's Actually XTemplate at work an not Template
    html.should.be.a.String.and.be.equal('<p>11:45</p><p>12:45</p><p>13:45</p><p>14:45</p></p>');
  });

});
