Simple-Form-Validator
=========================

A simple form validator is easy, flexible to use


## Installation



```
npm install --save simple-form-validator

```

This assumes that you’re using [npm](http://npmjs.com/) package manager with a module bundler like [Webpack](http://webpack.github.io) or [Browserify](http://browserify.org/) to consume [CommonJS modules](http://webpack.github.io/docs/commonjs.html).



## Documentation

- [ **createValidators**] initialize validators with validator settings
	1. [**validator setting can be an object describing validators for form field**] 
    ```javascript
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
      ]
    }
    validators = createValidators(validatorsConfig);

    ```
        each validator object must have two keys, one of which should be **_msg_** , the other of which could be **_required_**, **_length_**, **_sameas_**, **_options_**, **_pattern_**, **_match_** and is case-sensitive, moreover, value for these keys could be a *function*
	2. [**validator setting can also be collections of either built-in validators or customized validators for each form field**]
	```javascript
	validators = createValidators({
    income: [
        builtinValidators.isRequired('income should be given'), 
        createValidator({
          msg: 'amount is invalid',
          validate: (val, contextFields) => /^\d+[,.]?\d*$/.test(String(val))
        }), 
        builtinValidators.range('income should be between 0 and 100000000', 0, 100000000)
      ],
    address:[
      builtinValidators.isString('valid address should be string'), 
      builtinValidators.length(5, 'valid address should be at least 5 letters')
      ]
    })
    validators = createValidators(validatorsConfig);
    ```
		
- [**addValidator**] After a form validators is initialized, it is able to dynamically add validators to an existing form field or a brand new field, i.e. (see more example in validate.test.js) 
            
    ```javascript
	validators.addValidator('employer', builtinValidators.isRequired('employer should be provided', function() {
    if (emp === 'student') return false;
    else if (emp === 'developer') return true;
      }))
    ```
- [**validateField**] When a form field has changed its contents or lost focus, *validateField* can be called to validate it. If its value doesn't satisfy all rules of its validators, the corresponding validating error message will be returned. To return *undefined* means there is no validating errors. If *validateField* is called with a *contextFields*, i.e. a js object consisting of form field names and their corresponding values, it will send in *contextFields* further to each function call of *validate* of each validator associated with this concerned field. It can be configured if validating process should stop when a validating error arises for a field that has multiple validators associated with.

- [**validateForm**] *validateForm* can be called to validate an entire form or just a part of it. Imagine that you have a Accordion showing a complex form and navigate from part 1 to part 2, and part 1 should validated before part 2 is to be shown. Return value of *undefined* for this method means there is no validating errors

- [**built-in validators**] for the time being, there are nine built-in validators, *isRequired*, *isNumber*, *isSame*, *isString*, *isEmail*, *range*, *length*, *options*, *match*. The last one is provided for your customized need because you can send your own javascript RegExp

- [**customized validators**] Besides the above mentioned built-in validators, it is possible to create your own customized validators by calling **_createValidator_**, which takes in a js object as param, consisting of *msg* as validating error msg, *validate* function, called with *(val, contextFields)*, for instance
	```javascript
	formvalidators = createValidators({
        amount: [
            builtinValidators.isRequired('income should be given'), 
            createValidator({
              msg: 'amount is invalid',
              validate: (val, contextFields) => /^\d+[,.]?\d*$/.test(String(val))
            })
          ]
        })
    ```
The customized validators can be used in the same way as built-in validators

## Other Usage

In additon to its usage mentioned above, simple-form-validator is originally designed for being used together with [react-form-ex](https://www.npmjs.com/package/react-form-ex), which is a ReactForm provider, faciliating form validation with React components

## Open Source Code

Source code for this npm package is available [idavollen@github](https://github.com/idavollen/simple-form-validator)


Enjoy!

## License

MIT
