export {Validator};

const Validator = function (templateObj) {

    class ValidationError extends Error {
      constructor(message) {
        super(message);
        this.name = "ValidationError";
      }
    }
  
    function checkType(type, value) {
      return typeof type() === typeof value
    }
  
    this.validator = function (validateObj) {
      for (let key in templateObj) {
        if ('required' in templateObj[key] &&
             templateObj[key].required &&
             !checkType(templateObj[key].type, validateObj[key]) ) {
          throw new ValidationError(`type error - ${key}: is not ${typeof (templateObj[key].type)()}`);
  
        } else if (!('required' in templateObj[key]) &&
                   key in validateObj &&
                   !checkType(templateObj[key].type, validateObj[key])) {
          throw new ValidationError(`type error - ${key}: is not ${typeof (templateObj[key].type)()}`);
        }
      }
    }
  }