const validator = require("validator");

const validateSignUpData = (req, res) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    } else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("First name should be 4 to 50 characters");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }
};

const validateEditProfile = (req) => {
    const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl", "gender", "age", "about", "skills"];
    const updates = Object.keys(req.body);

    for (let field of updates) {
        if (!allowedEditFields.includes(field)) {
            throw new Error(`Invalid field: ${field}`);
        }
    }

    if (req.body.emailId && !validator.isEmail(req.body.emailId)) {
        throw new Error("Email is not valid");
    }

    if (req.body.age && (!Number.isInteger(req.body.age) || req.body.age < 0)) {
        throw new Error("Age must be a valid positive integer");
    }
};

module.exports = { validateSignUpData, validateEditProfile };
