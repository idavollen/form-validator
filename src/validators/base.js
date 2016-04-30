const  Validator = function(ruleName, ruleExpression, errMsg) {
  this.name = ruleName;
  this.expression = ruleExpression;
  this.errMsg = errMsg;
}

Validator.prototype.validate = function(value) {
  let valid = this.evaluate(value);
  if (!valid) return this.errMsg;
}

Validator.prototype.evaluate = function(value) {
  return typeof this.expression === 'function'? this.expression(value) : this.expression;
}

const  Pattern = function(regexp, errMsg) {
  regexp = typeof regexp === 'string' ? new RegExp(regexp) : regexp;
  if (!regexp.test || ! regexp.exec)
    throw new TypeError('invalid RegExp');
  Validator.apply(this, ['pattern', regexp, errMsg]);
}

Pattern.prototype = Object.create(Validator.prototype);
Pattern.prototype.constructor = Pattern;
Pattern.prototype.evaluate = function(value) {
  return this.expression.test(value);
}

export { Validator, Pattern }