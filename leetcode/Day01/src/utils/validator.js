const validator = require('validator');

const validate = (data) => {
    const mandatoryFields = ['firstName', 'emailId', 'password'];
    const isAllowed = mandatoryFields.every((k) => k in data);
    if (!isAllowed) {
        throw new Error('Missing mandatory fields');
    }
    if (!validator.isEmail(data.emailId)) {
        throw new Error('Invalid email format');
    }
    if (!validator.isStrongPassword(data.password)) {
        throw new Error('Weak password');
    }
};

module.exports = validate;