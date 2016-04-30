Simple-Form-Validator
=========================

A simple form validator is easy, flexible to use


## Installation



```
npm install --save simple-form-validator
```

This assumes that you’re using [npm](http://npmjs.com/) package manager with a module bundler like [Webpack](http://webpack.github.io) or [Browserify](http://browserify.org/) to consume [CommonJS modules](http://webpack.github.io/docs/commonjs.html).



## Documentation

- [createValidators] initialize validators with validator settings
	1. [validator setting can be an object describing validators for form field] 
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
        each validator object must have two keys, one of which should be **_msg_** , the other of which could be **_required_**, **_length_**, **_options_**, **_pattern_**, **_match_** and is case-sensitive, moreover, value for these keys could be a *function*
	2. [validator setting can be collections of built-in validators for each form field]

        ```javascript
					validators = createValidators({
		        'income': [
		            builtInValidators.isRequired('income should be given'), 
		            builtInValidators.isNumber('valid income should be digits'), 
		            builtInValidators.range('income should be between 0 and 100000000', 0, 100000000)
		          ],
		        'address':[
		          builtInValidators.isString('valid address should be string'), 
		          builtInValidators.length(5, 'valid address should be at least 5 letters')
		          ]
		        })
			    validators = createValidators(validatorsConfig);
        ```
		
- [addValidator] After a form validator is initialized, it is able to dynamically add validators to an existing form field or a brand new field, i.e. (see more example in validate.test.js) 
            
    ```javascript
                    
        					validators.addValidator('employer', builtInValidators.isRequired('employer should be provided', function() {
        		        if (emp === 'student') return false;
        		        else if (emp === 'developer') return true;
        		      }))
    ```
- [validateField] When a form field has changed its contents or lost focus, *validateField* can be called to validate it. If its value doesn't satisfy rules of its validators, the corresponding validating error message will be returned. To return *undefined* means there is no validating errors

- [validateForm] *validateForm* can be called to validate an entire form or just a port of it. Imagine that you have a Accordion showing a complex form and navigate from part 1 to part 2, and part 1 should validated before part 2 is to be shown. Return value of *undefined* for this method means there is no validating errors

- [built-in validators] for the time being, there are eight built-in validators, *isRequired*, *isNumber*, *isString*, *isEmail*, *range*, *length*, *options*, *match*. The last one is provided for your customized need because you can send your own javascript RegExp

## Other Usage

In additon to its usage mentioned above, simple-form-validator is originally designed for using together with [react-form-ex](https://www.npmjs.com/package/react-form-ex), which is a ReactForm provider, faciliating form validation in React

## Open Source Code

Source code for this npm package is available [idavollen@github](https://github.com/idavollen/simple-form-validator)


Enjoy!

## License

MIT
