module.exports = function(Ext) {
    if (!Ext || !Ext.Template || !Ext.XTemplateCompiler) {
        throw(new Error('Dependencies missing'));
    }

    var XTemplate = Ext.extend(Ext.Template);

    //Ext.define('Ext.XTemplate', {
        //extend: 'Ext.Template',

        //requires: 'Ext.XTemplateCompiler',

    XTemplate.prototype.className = 'Ext.XTemplate';

    /**
     * @private
     */
    XTemplate.prototype.emptyObj = {};

    /**
     * @cfg {Boolean} compiled
     * Only applies to {@link Ext.Template}, XTemplates are compiled automatically on the
     * first call to {@link #apply} or {@link #applyOut}.
     * @hide
     */

    /**
     * @cfg {String/Array} definitions
     * Optional. A statement, or array of statements which set up `var`s which may then
     * be accessed within the scope of the generated function.
     */

    XTemplate.prototype.apply = function(values, parent) {
        return this.applyOut(values, [], parent).join('');
    },

    XTemplate.prototype.applyOut = function(values, out, parent) {
        var me = this,
            compiler;

        if (!me.fn) {
            compiler = new Ext.XTemplateCompiler({
                useFormat: me.disableFormats !== true,
                definitions: me.definitions
            });

            me.fn = compiler.compile(me.html);
        }

        try {
            me.fn(out, values, parent || me.emptyObj, 1, 1);
        } catch (e) {
            //<debug>
            Ext.log('Error: ' + e.message);
            //</debug>
        }

        return out;
    };

    /**
     * Does nothing. XTemplates are compiled automatically, so this function simply returns this.
     * @return {Ext.XTemplate} this
     */
    XTemplate.prototype.compile = function() {
        return this;
    };

    XTemplate.prototype.statics = {
        /**
         * Gets an `XTemplate` from an object (an instance of an {@link Ext#define}'d class).
         * Many times, templates are configured high in the class hierarchy and are to be
         * shared by all classes that derive from that base. To further complicate matters,
         * these templates are seldom actual instances but are rather configurations. For
         * example:
         *
         *      Ext.define('MyApp.Class', {
         *          extraCls: 'extra-class',
         *
         *          someTpl: [
         *              '<div class="{%this.emitClass(out)%}"></div>',
         *          {
         *              // Member fn - outputs the owing class's extra CSS class
         *              emitClass: function(out) {
         *                  out.push(this.owner.extraCls);
         *              }
         *          }]
         *      });
         *
         * The goal being to share that template definition with all instances and even
         * instances of derived classes, until `someTpl` is overridden. This method will
         * "upgrade" these configurations to be real `XTemplate` instances *in place* (to
         * avoid creating one instance per object).
         *
         * The resulting XTemplate will have an `owner` reference injected which refers back
         * to the owning object whether that is an object which has an *own instance*, or a
         * class prototype. Through this link, XTemplate member functions will be able to access
         * prototype properties of its owning class.
         *
         * @param {Object} instance The object from which to get the `XTemplate` (must be
         * an instance of an {@link Ext#define}'d class).
         * @param {String} name The name of the property by which to get the `XTemplate`.
         * @return {Ext.XTemplate} The `XTemplate` instance or null if not found.
         * @protected
         * @static
         */
        getTpl: function (instance, name) {
            var tpl = instance[name], // go for it! 99% of the time we will get it!
                owner;

            if (tpl && !tpl.isTemplate) { // tpl is just a configuration (not an instance)
                // create the template instance from the configuration:
                tpl = Ext.ClassManager.dynInstantiate('Ext.XTemplate', tpl);

                // and replace the reference with the new instance:
                if (instance.hasOwnProperty(name)) { // the tpl is on the instance
                    owner = instance;
                } else { // must be somewhere in the prototype chain
                    for (owner = instance.self.prototype; owner && !owner.hasOwnProperty(name); owner = owner.superclass) {
                    }
                }
                owner[name] = tpl;
                tpl.owner = owner;
            }
            // else !tpl (no such tpl) or the tpl is an instance already... either way, tpl
            // is ready to return

            return tpl || null;
        }
    };

    return XTemplate;
};