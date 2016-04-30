import * as BuiltInValidators from './validators/validator.js';
import { Validator, Pattern } from './validators/base';

export default function createValidators(configs) {
  /*
    {name: [{
        required: true,
        msg: 'name is mandate'
      }, {
        pattern: 'string',
        msg: 'name can be only string'
      }
    }
  */
  const _makeValidator = (validatorObj) => {
    if (!validatorObj.msg) return;
    if (validatorObj.required !== undefined) 
      return BuiltInValidators.isRequired(validatorObj.msg, validatorObj.required);
    else if (validatorObj.length) 
      return BuiltInValidators.length(validatorObj.length, validatorObj.msg);
    else if (validatorObj.range)
      return BuiltInValidators.range(validatorObj.msg, validatorObj.range)
    else if (validatorObj.options)
      return BuiltInValidators.options(validatorObj.msg, validatorObj.options);
    else if (validatorObj.match)
      return BuiltInValidators.match(validatorObj.match, validatorObj.msg)
    else if (validatorObj.pattern) {
      switch (validatorObj.pattern) {
        case 'digits':
          return BuiltInValidators.isNumber(validatorObj.msg);
        case 'string':
          return BuiltInValidators.isString(validatorObj.msg);
        case 'email':
          return BuiltInValidators.isEmail(validatorObj.msg);
      }
    }
  }

  const _normalize = configs => {
    for (let field in configs) {
      let validators = configs[field].reduce((coll, validator) => {
        if (validator instanceof Validator || [Validator.name, Pattern.name].indexOf(validator.constructor.name) != -1) 
          coll.push(validator)
        else {
          let v = _makeValidator(validator);
          if (v) coll.push(v);
        }
        return coll;
      }, []);
      configs[field] = validators;
    }
    return configs;
  }

  var _configs = _normalize(configs || {});

  return {
    config: function(configs) {
      _configs = _normalize(configs);
    },

    addValidator: function(field, ...validators) {
      let existing = _configs[field] || [];
      validators.forEach(v => {
        if (!(v instanceof Validator || [Validator.name, Pattern.name].indexOf(v.constructor.name) != -1)) {
          v = _makeValidator(v);
        }
        if (!existing.some(e => {
          if (v.name === e.name) {
            if (v.name === 'length' || v.name === 'required' || v.name === 'options') {
              e.expression = v.expression;
              e.errMsg = v.errMsg;
              return true;
            } else if (v.name === 'pattern' && v.expression == e.expression) {
              e.errMsg = v.errMsg;
              return true;
            }
          }
        })) {     
          existing.push(v);
        }
      })
      _configs[field] = existing;
    },

    validateField: function(field, value) {
      var result = _configs[field].reduce((prev, validator) => {
        var err = validator.validate(value);
        if (err) prev.push(err);
        return prev;
      }, []);
      return result.length? result : undefined;
    },

    //@param    formData, Object containing key-value pairs for each form field, i.e {name: 'Tom', age: 25}
    validateForm: function(formData) {
      var result;
      for (let key in formData) {
        let err = this.validateField(key, formData[key]);
        if (err) {
          if (!result) result = {};
          result[key] = err;
        } 
      }
      return result;
    }
  }
}