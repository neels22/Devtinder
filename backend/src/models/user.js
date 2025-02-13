const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Define the user schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minLength: [3, 'First name must be at least 4 characters'],
        maxLength: [30, 'First name cannot exceed 30 characters']
    },
    lastName: {
        type: String,
        maxLength: [30, 'Last name cannot exceed 30 characters']
    },
    emailId: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 characters']
    },
    age: {
        type: Number,
        min: [18, 'Must be at least 18 years old'],
        max: [100, 'Age cannot exceed 100 years']
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://example.com/default-avatar.jpg",
        match: [/^https?:\/\/.+/, 'Please enter a valid URL']
    },
    about: {
        type: String,
        default: "This is default about text",
        maxLength: [500, 'About cannot exceed 500 characters']
    },
    skills: {
        type: [String],
        validate: {
            validator: function (arr) {
                return arr.length >= 0;
            },
            message: 'At least one skill is required'
        }
    }
}, {
    timestamps: true
});

// Generate JWT Token
userSchema.methods.getJWT = async function () {
    return jwt.sign(
        { _id: this._id },
        "Devtinder@123",
        { expiresIn: "1d" }
    );
};

// Validate password
userSchema.methods.validatePassword = async function (pass) {
    return bcrypt.compare(pass, this.password);
};

// Create and export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
