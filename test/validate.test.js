var assert = require('chai').assert;
import createValidators , { createValidator, builtinValidators } from '../src/index.js';


describe('Form validators', function() {
  describe('Literal validators config', function() {
    var validators
    beforeEach(function() {
      var validatorsConfig = {
        name: [{
            required: true,
            msg: 'name cannot be empty'
          }, {
            pattern: 'string',
            msg: 'name should be string'
          }],
        age: [
          {
            required: true,
            msg: 'age should be provided'
          }, {
            pattern: 'digits',
            msg: 'age should be digits'
          }
        ],
        pw: [
          {
            required: true,
            msg: 'password should be provided'
          }, {
            length: 8,
            msg: 'a strong password should be at least 8 characters'
          }
        ],
        pw2: [
          {
            required: true,
            msg: 'password should be provided'
          }, {
            length: 8,
            msg: 'a strong password should be at least 8 characters'
          }, {
            sameas: 'pw',
            msg: 'the second password should have the same value as the peer password'
          }
        ]
      }
      validators = createValidators(validatorsConfig);
    })
    it('validate.js should parse literal validators config', function() {
      var errMsg = validators.validateField('name', '');
      assert.equal(2, errMsg.length);
    })

    it('addValidator should work with literal validators config', function() {
      validators.addValidator('age', builtinValidators.range('age should be between 1 and 150', [1, 150]));
      var errMsg = validators.validateField('age', '');
      assert.equal(3, errMsg.length);
    })

    it('addValidator using validator object literal should work with literal validators config', function() {
      validators.addValidator('age', {
        range: [1, 150], 
        msg: 'age should be between 1 and 150'
      });
      var errMsg = validators.validateField('age', '');
      assert.equal(3, errMsg.length);
    })

    it('addValidator using builtInValidator should work with literal validators config', function() {
      validators.addValidator('age', builtinValidators.range('age should be between 1 and 150', [1, 150]));
      var errMsg = validators.validateField('age', '');
      assert.equal(3, errMsg.length);
    })

    it('literal validators should also support isSame (sameas)', function() {
      const contextFields = { pw: '12345678' }
      var errMsg = validators.validateField('pw', '12345678');
      assert.equal(undefined, errMsg);
      errMsg = validators.validateField('pw2', '123456789', contextFields)
      assert.equal(1, errMsg.length);
      errMsg = validators.validateField('pw2', '12345678', contextFields)
      assert.equal(undefined, errMsg);
    })
  })

  describe('Validators config with customized validators', function() {
    var formvalidators
    beforeEach(function() {
      formvalidators = createValidators({
        'amount': [
            builtinValidators.isRequired('income should be given'), 
            createValidator({
              msg: 'amount is invalid',
              validate: (val, contextFields) => /^\d+[,.]?\d*$/.test(String(val))
            })
          ]
        })
    });

    it('customized amount validator should be ok with separator, "," and "."', function () {
      var msg = formvalidators.validateField('amount', '123.45');
      assert.equal(undefined, msg);
      msg = formvalidators.validateField('amount', '123,45');
      assert.equal(undefined, msg);
      msg = formvalidators.validateField('amount', '123-45');
      assert.equal(1, msg.length);
    });

    it('customized amount validator should not contain any letters', function () {
      var msg = formvalidators.validateField('amount', '123e45');
      assert.equal(1, msg.length);
    });
  })

  describe('Validators config with built-in validators', function() {
    var formvalidators
    beforeEach(function() {
      formvalidators = createValidators({
        'income': [
            builtinValidators.isRequired('income should be given'), 
            builtinValidators.isNumber('valid income should be digits'), 
            builtinValidators.range('income should be between 0 and 100000000', 1, 100000000)
          ],
        'address':[
          builtinValidators.isString('valid address should be string'), 
          builtinValidators.length(5, 'valid address should be at least 5 letters')
          ]
        })
    });

    afterEach(function() {
      formvalidators = null
    });

    it('should income of "a" return two validation errors', function () {
      var msg = formvalidators.validateField('income', 'a');
      assert.equal(2, msg.length);
    });

    it('should income of "" return 3 validation errors', function () {
      var msg = formvalidators.validateField('income', '');
      assert.equal(3, msg.length);
    });

    it('address of 3 letters is too short', function () {
      var msg = formvalidators.validateField('address', 'vei');
      assert.equal(1, msg.length);
    });


    it('should validate form well when its fields is valid', function () {
      var msg = formvalidators.validateForm({'income': 500000, address: 'Harry Fetts Vei'});
      assert.equal(undefined, msg);
    });

    it('should return validation err if form data is invalid', function () {
      var msg = formvalidators.validateForm({'income': 500000, address: 'Vei'});
      assert.equal(1, msg.address.length);
    });

    it('the newly added validator should be applicable', function () {
    	formvalidators.addValidator('address', builtinValidators.isRequired('address can not be empty'))
      var msg = formvalidators.validateField('address', '');
      assert.equal(3, msg.length);
    });

    it('the newly added validator defined with object literal should be applicable', function () {
      formvalidators.addValidator('address', {
        required: true,
        msg: 'address can not be empty'
      });
      var msg = formvalidators.validateField('address', '');
      assert.equal(3, msg.length);
    });

    it('the newly added validator should be applicable', function () {
    	formvalidators.addValidator('address', builtinValidators.length(2, 'valid address should be at least 2 letters'))
      var msg = formvalidators.validateField('address', 'vei');
      assert.equal(undefined, msg);
    });

    it('options validator should work as enum', function () {
      formvalidators.addValidator('sex', builtinValidators.options('sex should have only two valid possible values', 'male', 'female'))
      var msg = formvalidators.validateField('sex', 'male');
      assert.equal(undefined, msg);
      msg = formvalidators.validateField('sex', 'man');
      assert.equal(1, msg.length);
    });

    it('options validator should work with enum 0', function () {
      formvalidators.addValidator('status', builtinValidators.options('enable or disable', 0, 1))
      var msg = formvalidators.validateField('status', 0);
      assert.equal(undefined, msg);
      msg = formvalidators.validateField('status', 2);
      assert.equal(1, msg.length);
    });

    it('valid email should have at least 3 parts', function () {
      formvalidators.addValidator('email', builtinValidators.isEmail('email should look like name@example.com'));
      var msg = formvalidators.validateField('email', 'aa@bb.cc');
      assert.equal(undefined, msg);
      msg = formvalidators.validateField('email', 'aa@cc.c');
      assert.equal(1, msg.length);
    });

    it('confirm email should have the same as the first email', function () {
      formvalidators.addValidator('email', builtinValidators.isEmail('email should look like name@example.com'));
      formvalidators.addValidator('email2', builtinValidators.isSame('email2 should have the same as email', 'email'));
      var msg = formvalidators.validateField('email', 'aa@bb.cc');
      assert.equal(undefined, msg);
      msg = formvalidators.validateField('email2', 'aa@cc.no', {email: 'aa@bb.cc'});
      assert.equal(1, msg.length);
      msg = formvalidators.validateField('email2', 'aa@bb.cc', {email: 'aa@bb.cc'});
      assert.equal(undefined, msg);
    });

    it('dynamic validator validate value based on contextFields', function () {
      formvalidators.addValidator('employer', builtinValidators.isRequired('employer is needed', function(value, contextFields) {
        return (contextFields && ('employee' == contextFields.employment || 'temp' == contextFields.employment))
      }));
      var msg = formvalidators.validateField('employer', '', { employment: 'employee'});
      assert.equal(1, msg.length);
      msg = formvalidators.validateField('employer', 'Finn.no', { employment: 'employee'});
      assert.equal(undefined, msg);
      msg = formvalidators.validateField('employer', '', { employment: 'student'});
      assert.equal(undefined, msg);
    });

    it('if value is a function, it should be called during validating', function () {
      var emp = 'student';
      formvalidators.addValidator('employer', builtinValidators.isRequired('employer should be provided', function() {
        if (emp === 'student') return false;
        else if (emp === 'developer') return true;
      }))
      var msg = formvalidators.validateField('employer', '');
      assert.equal(undefined, msg);
      emp = 'developer';
      msg = formvalidators.validateField('employer', '');
      assert.equal(1, msg.length);
    });
  })
});